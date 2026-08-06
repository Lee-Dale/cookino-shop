import gsap from 'gsap';

/**
 * Diese Datei enthält die komplette ursprüngliche Interaktions-Logik aus
 * main.js (Custom Cursor, Tilt-Karten, Intro-Animation, Tabs, Modals,
 * Karussell, Memory-Spiel usw.), 1:1 auf Basis von DOM-Queries wie zuvor -
 * nur eingebettet in eine exportierte Funktion, die per useEffect in
 * App.jsx nach dem React-Mount aufgerufen wird. So bleibt das komplette,
 * getestete Verhalten erhalten, während Vite/React nur noch das Markup
 * rendert.
 *
 * @param {HTMLElement} root - Root-Element, in dem sich die App befindet
 *                              (aktuell ungenutzt, aber für spätere Scope-
 *                              Einschränkungen vorbereitet).
 * @returns {Function} cleanup - entfernt die global registrierten Listener
 *                                 (mousemove/resize/scroll) wieder.
 */
export function initLegacyApp(root) {
    /* ==========================================================================
       0. INTERAKTIVE KINEMATIK & EFFECT INITIALIZATION (CURSOR, SPOTLIGHT, 3D TILT, MAGNETIC)
       ========================================================================== */

    const cursorDot = document.getElementById('cursorDot');
    const canvas = document.getElementById('fluid-canvas');

    let particles = [];
    let ctx = null;
    let rafId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle(x, y) {
        if (particles.length > 35) return;
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5,
            size: Math.random() * 4 + 2,
            color: Math.random() > 0.5 ? '#8A2BE2' : '#F8CB54',
            alpha: 1
        });
    }

    function renderParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
            if (p.alpha <= 0) {
                particles.splice(i, 1);
                i--;
                continue;
            }
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        rafId = requestAnimationFrame(renderParticles);
    }

    function handleMouseMove(e) {
        if (cursorDot) {
            cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        }
        if (canvas) createParticle(e.clientX, e.clientY);
    }

    window.addEventListener('mousemove', handleMouseMove);

    if (canvas) {
        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        renderParticles();
    }

    // 2. SPOTLIGHT BORDER GLOW UPDATER
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 3. 3D TILT CARDS LOGIC
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            const parallaxImg = card.querySelector('.parallax-img');
            if (parallaxImg) {
                parallaxImg.style.transform = `translateZ(30px) rotateX(${-rotateX * 0.5}deg) rotateY(${-rotateY * 0.5}deg)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            const parallaxImg = card.querySelector('.parallax-img');
            if (parallaxImg) {
                parallaxImg.style.transform = 'translateZ(0px)';
            }
        });
    });

    // 4. MAGNETIC BUTTONS LOGIC (smooth, ohne Zittern)
    const magneticBtns = document.querySelectorAll('.magnetic-element');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.setProperty('transition', 'transform 0.12s ease-out', 'important');
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.setProperty('transition', 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', 'important');
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // 5. UNMATCHED PARALLAX SCROLL LOGIC
    function handleScroll() {
        const scrolled = window.scrollY;
        const aurora = document.querySelector('.aurora-container');
        if (aurora) {
            aurora.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    }
    window.addEventListener('scroll', handleScroll);

    /* ==========================================================================
       1. AUDIO STEUERUNG (SCHALTET AUDIO DURCH USER-KLICK FREI)
       ========================================================================== */
    const bgAudio = document.getElementById('bgAudio');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    let isMusicPlaying = false;

    function playAudio() {
        if (!bgAudio) return;
        bgAudio.play().then(() => {
            isMusicPlaying = true;
            if (musicToggleBtn) {
                musicToggleBtn.textContent = '🔊';
                musicToggleBtn.classList.remove('muted');
                musicToggleBtn.setAttribute('title', 'Musik ausschalten');
            }
        }).catch(err => {
            console.log("Audio-Wiedergabe blockiert oder fehlgeschlagen:", err);
        });
    }

    function pauseAudio() {
        if (!bgAudio) return;
        bgAudio.pause();
        isMusicPlaying = false;
        if (musicToggleBtn) {
            musicToggleBtn.textContent = '🔇';
            musicToggleBtn.classList.add('muted');
            musicToggleBtn.setAttribute('title', 'Musik einschalten');
        }
    }

    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', () => {
            if (isMusicPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });
    }

    /* ==========================================================================
       2. INTRO SLIDESHOW & START-OVERLAY (MAGISCHER LICHTUNGS-ÜBERGANG)
       ========================================================================== */
    const introViewport = document.getElementById('intro-viewport');
    const startOverlay = document.getElementById('start-overlay');
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    const introWelcomeText = document.getElementById('introWelcomeText');
    const skipBtn = document.getElementById('skipBtn');
    const appWrapper = document.getElementById('app-wrapper');
    const lightOverlay = document.getElementById('clearing-light-overlay');

    let introFinished = false;

    function startIntroAnimation() {
        const tl = gsap.timeline({
            onComplete: finishIntro
        });

        // Slide 1
        tl.to('.slide-1', { opacity: 1, duration: 1.2, scale: 1.05 })
          .to('.slide-1', { opacity: 0, duration: 0.8, delay: 1.2 });

        // Slide 2
        tl.to('.slide-2', { opacity: 1, duration: 1.2, scale: 1.05 }, "-=0.4")
          .to('.slide-2', { opacity: 0, duration: 0.8, delay: 1.2 });

        // Slide 3
        tl.to('.slide-3', { opacity: 1, duration: 1.2, scale: 1.05 }, "-=0.4")
          .to('.slide-3', { opacity: 0, duration: 0.8, delay: 1.2 });

        // Slide 4 (Lichtung)
        tl.to('.slide-4', { opacity: 1, duration: 1.2, scale: 1.05 }, "-=0.4")
          .to('.slide-4', { duration: 1.5 });
    }

    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            playAudio();

            if (startOverlay) {
                startOverlay.style.opacity = '0';
                setTimeout(() => {
                    startOverlay.style.display = 'none';
                    if (introWelcomeText) introWelcomeText.style.opacity = '1';
                    if (skipBtn) skipBtn.style.display = 'block';
                    startIntroAnimation();
                }, 500);
            } else {
                startIntroAnimation();
            }
        });
    }

    function finishIntro() {
        if (introFinished) return;
        introFinished = true;

        if (appWrapper) {
            appWrapper.classList.remove('content-hidden');
            initCookieBackground();
        }

        const tl = gsap.timeline({
            onComplete: () => {
                if (introViewport) introViewport.style.display = 'none';
                if (lightOverlay) lightOverlay.style.display = 'none';
            }
        });

        // 1. Aufblühen des magischen Sonnenlichts
        if (lightOverlay) {
            tl.to(lightOverlay, { opacity: 0.85, duration: 0.5, ease: "power2.in" }, 0);
        }

        // 2. Vorwärtsbewegung durch das Baumdach hindurch
        if (introViewport) {
            tl.to(introViewport, {
                scale: 1.15,
                opacity: 0,
                filter: 'brightness(1.5) blur(8px)',
                duration: 1.1,
                ease: "power2.inOut"
            }, 0.2);
        }

        // 3. Haupt-App / Lichtung tritt flüssig aus dem Sonnenlicht hervor
        if (appWrapper) {
            tl.fromTo(appWrapper,
                { opacity: 0, scale: 1.05, filter: 'blur(10px) brightness(1.2)' },
                { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)', duration: 1.3, ease: "power2.out" },
                0.3
            );
        }

        // 4. Lichtstrahl blendet weich aus
        if (lightOverlay) {
            tl.to(lightOverlay, { opacity: 0, duration: 0.8, ease: "power2.out" }, 0.7);
        }
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', finishIntro);
    }

    /* ==========================================================================
       3. FLIEGENDE COOKIES / COOKINOS ANIMATION GENERATOR
       ========================================================================== */
    function initCookieBackground() {
        const container = document.getElementById('cookie-background');
        if (!container) return;

        const cookieTypes = [
            '/assets/bild1.webp',
            '/assets/bild2.webp',
            '/assets/bild3.webp'
        ];
        const numCookies = 16;

        for (let i = 0; i < numCookies; i++) {
            const cookie = document.createElement('div');
            cookie.className = 'flying-cookie';

            const randomImg = cookieTypes[Math.floor(Math.random() * cookieTypes.length)];
            cookie.innerHTML = `<img src="${randomImg}" alt="Cookie">`;

            const leftPos = Math.random() * 95;
            const size = 45 + Math.random() * 30;
            const duration = 10 + Math.random() * 12;
            const delay = Math.random() * 10;
            const rotDirection = Math.random() > 0.5 ? 360 : -360;

            cookie.style.left = `${leftPos}%`;
            cookie.style.width = `${size}px`;
            cookie.style.animationDuration = `${duration}s`;
            cookie.style.animationDelay = `${delay}s`;
            cookie.style.setProperty('--target-rotation', `${rotDirection}deg`);

            container.appendChild(cookie);
        }
    }

    /* ==========================================================================
       4. VIEW & TAB NAVIGATION
       ========================================================================== */
    const navTabs = document.querySelectorAll('.nav-tab');
    const viewSections = document.querySelectorAll('.view-section');
    const doorFrames = document.querySelectorAll('.door-frame');

    function switchView(targetId) {
        if (!targetId) return;

        navTabs.forEach(tab => {
            if (tab.getAttribute('data-target') === targetId) {
                tab.classList.add('active-tab');
            } else {
                tab.classList.remove('active-tab');
            }
        });

        viewSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove('hidden-view');
                section.classList.add('active-view');
            } else {
                section.classList.add('hidden-view');
                section.classList.remove('active-view');
            }
        });

        doorFrames.forEach(frame => frame.classList.remove('door-opening'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            if (target) switchView(target);
        });
    });

    doorFrames.forEach(frame => {
        frame.addEventListener('click', () => {
            const target = frame.getAttribute('data-target');
            frame.classList.add('door-opening');

            setTimeout(() => {
                switchView(target);
            }, 600);
        });
    });

    /* ==========================================================================
       5. CHARAKTER-GESCHICHTEN MODAL LOGIK
       ========================================================================== */
    const storyModal = document.getElementById('story-modal');
    const closeStoryModalBtn = document.getElementById('closeStoryModal');
    const modalStoryBody = document.getElementById('modalStoryBody');
    const characterCards = document.querySelectorAll('.character-card-clickable');

    function openStoryModal(card) {
        const title = card.querySelector('.card-title')?.textContent || '';
        const role = card.querySelector('.card-role')?.textContent || '';
        const imgSrc = card.querySelector('.product-image')?.getAttribute('src') || '';
        const fullContent = card.querySelector('.full-story-content')?.innerHTML || '';

        modalStoryBody.innerHTML = `
            <img src="${imgSrc}" alt="${title}" class="modal-hero-img">
            <h2>${title}</h2>
            <span class="modal-role">${role}</span>
            <div class="modal-full-text">${fullContent}</div>
        `;

        storyModal.classList.remove('hidden-view');
        storyModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeStoryModal() {
        if (!storyModal) return;
        storyModal.classList.add('hidden-view');
        storyModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    characterCards.forEach(card => {
        card.addEventListener('click', () => {
            openStoryModal(card);
        });
    });

    if (closeStoryModalBtn) {
        closeStoryModalBtn.addEventListener('click', closeStoryModal);
    }

    if (storyModal) {
        storyModal.addEventListener('click', (e) => {
            if (e.target === storyModal) closeStoryModal();
        });
    }

    /* ==========================================================================
       5b. ALLWISSENDES BUCH MODAL (Platzhalter für spätere KI-Integration)
       ========================================================================== */
    const bookBtn = document.getElementById('bookBtn');
    const bookModal = document.getElementById('book-modal');
    const closeBookModalBtn = document.getElementById('closeBookModal');

    function openBookModal() {
        if (!bookModal) return;
        bookModal.classList.remove('hidden-view');
        bookModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeBookModal() {
        if (!bookModal) return;
        bookModal.classList.add('hidden-view');
        bookModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (bookBtn) {
        bookBtn.addEventListener('click', openBookModal);
    }

    if (closeBookModalBtn) {
        closeBookModalBtn.addEventListener('click', closeBookModal);
    }

    if (bookModal) {
        bookModal.addEventListener('click', (e) => {
            if (e.target === bookModal) closeBookModal();
        });
    }

    /* ==========================================================================
       6. CAROUSEL / SCHATZKAMMER LOGIK
       ========================================================================== */
    const track = document.getElementById('track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');

    if (track) {
        const slides = Array.from(track.children);
        let currentSlideIndex = 0;

        function updateCarousel() {
            if (slides.length === 0) return;
            track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

            if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
            if (nextBtn) nextBtn.disabled = currentSlideIndex === slides.length - 1;

            if (dotsContainer) {
                const dots = Array.from(dotsContainer.children);
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active-dot', index === currentSlideIndex);
                });
            }
        }

        if (dotsContainer && slides.length > 0) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active-dot');
                dot.addEventListener('click', () => {
                    currentSlideIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentSlideIndex > 0) {
                    currentSlideIndex--;
                    updateCarousel();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentSlideIndex < slides.length - 1) {
                    currentSlideIndex++;
                    updateCarousel();
                }
            });
        }

        updateCarousel();
    }

    /* ==========================================================================
       7. MEMORY-SPIEL (RÄTSELKAMMER)
       ========================================================================== */
    const memoryBoard = document.getElementById('memory-board');
    const movesEl = document.getElementById('memory-moves');
    const matchesEl = document.getElementById('memory-matches');
    const restartBtn = document.getElementById('memory-restart-btn');
    const victoryModal = document.getElementById('memory-victory-modal');

    const allMemoryImages = [
        '/assets/Mixelmoos.webp', '/assets/Wuschel.webp', '/assets/Moniki.webp',
        '/assets/Cookino.webp', '/assets/Annora.webp', '/assets/Bendix.webp',
        '/assets/Ramona.webp', '/assets/Chris.webp', '/assets/Lee.webp'
    ];
    const PAIR_COUNT = 6;

    function shuffleArray(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    let cards = [];
    let flippedCards = [];
    let matches = 0;
    let moves = 0;
    let isLocked = false;

    function initMemoryGame() {
        if (!memoryBoard) return;

        memoryBoard.innerHTML = '';

        const roundImages = shuffleArray(allMemoryImages).slice(0, PAIR_COUNT);
        cards = shuffleArray([...roundImages, ...roundImages]);
        matches = 0;
        moves = 0;
        movesEl.textContent = moves;
        matchesEl.textContent = matches;
        victoryModal.classList.add('hidden-view');
        flippedCards = [];
        isLocked = false;

        cards.forEach(imgSrc => {
            const card = document.createElement('div');
            card.classList.add('memory-card');

            const img = document.createElement('img');
            img.src = imgSrc;
            card.appendChild(img);

            card.addEventListener('click', () => flipCard(card, imgSrc));
            memoryBoard.appendChild(card);
        });
    }

    function flipCard(card, imgSrc) {
        if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        flippedCards.push({ card, imgSrc });

        if (flippedCards.length === 2) {
            moves++;
            movesEl.textContent = moves;
            checkMatch();
        }
    }

    function checkMatch() {
        isLocked = true;
        const [card1, card2] = flippedCards;

        if (card1.imgSrc === card2.imgSrc) {
            card1.card.classList.add('matched', 'match-effect');
            card2.card.classList.add('matched', 'match-effect');
            matches++;
            matchesEl.textContent = matches;
            flippedCards = [];
            isLocked = false;

            if (matches === 6) {
                setTimeout(() => {
                    victoryModal.classList.remove('hidden-view');
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.card.classList.remove('flipped');
                card2.card.classList.remove('flipped');
                flippedCards = [];
                isLocked = false;
            }, 1000);
        }
    }

    if (restartBtn) restartBtn.addEventListener('click', initMemoryGame);
    if (memoryBoard) initMemoryGame();

    /* ==========================================================================
       8. GAME-SUBTAB & DOWNLOAD LOGIK
       ========================================================================== */
    const gameSubtabs = document.querySelectorAll('.subtab');
    const gamePanels = document.querySelectorAll('.game-panel');

    gameSubtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            gameSubtabs.forEach(t => t.classList.remove('active-subtab'));
            gamePanels.forEach(p => p.classList.add('hidden-view'));

            tab.classList.add('active-subtab');
            const target = document.getElementById(tab.getAttribute('data-subtarget'));
            if (target) {
                target.classList.remove('hidden-view');
            }
        });
    });

    // Cleanup der global registrierten Listener (mousemove/resize/scroll),
    // damit bei einem Re-Mount (z. B. React StrictMode im Dev-Modus) keine
    // doppelten Listener übrig bleiben.
    return function cleanup() {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('scroll', handleScroll);
        if (rafId) cancelAnimationFrame(rafId);
    };
}
