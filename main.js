document.addEventListener('DOMContentLoaded', () => {

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
       2. INTRO SLIDESHOW & START-OVERLAY
       ========================================================================== */
    const introViewport = document.getElementById('intro-viewport');
    const startOverlay = document.getElementById('start-overlay');
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    const introWelcomeText = document.getElementById('introWelcomeText');
    const skipBtn = document.getElementById('skipBtn');
    const appWrapper = document.getElementById('app-wrapper');

    let introFinished = false;

    function startIntroAnimation() {
        if (typeof gsap !== 'undefined') {
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
        } else {
            setTimeout(finishIntro, 4000);
        }
    }

    // Beim Klick auf "Reise starten" Start-Overlay ausblenden & Musik + Intro starten
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            playAudio(); // Startet Musik direkt im Klick-Event

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

        if (typeof gsap !== 'undefined') {
            gsap.to(introViewport, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    introViewport.style.display = 'none';
                    appWrapper.classList.remove('content-hidden');
                    initCookieBackground();
                }
            });
        } else {
            introViewport.style.display = 'none';
            appWrapper.classList.remove('content-hidden');
            initCookieBackground();
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
            'assets/bild1.webp',
            'assets/bild2.webp',
            'assets/bild3.webp'
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
       4. VIEW & TAB NAVIGATION (INKL. TÜREN-ÖFFNEN ANIMATION)
       ========================================================================== */
    const navTabs = document.querySelectorAll('.nav-tab');
    const viewSections = document.querySelectorAll('.view-section');
    const doorFrames = document.querySelectorAll('.door-frame');

    function switchView(targetId) {
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
            switchView(target);
        });
    });

    doorFrames.forEach(frame => {
        frame.addEventListener('click', () => {
            const target = frame.getAttribute('data-target');
            frame.classList.add('door-opening');

            setTimeout(() => {
                switchView(target);
            }, 550);
        });
    });

    /* ==========================================================================
       5. PRODUCT CAROUSEL (KOLLEKTION)
       ========================================================================== */
    const track = document.getElementById('track');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselDots = document.getElementById('carouselDots');

    if (track && prevBtn && nextBtn) {
        const slides = Array.from(track.children);
        let currentIndex = 0;

        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${idx === 0 ? 'active-dot' : ''}`;
            dot.setAttribute('aria-label', `Slide ${idx + 1}`);
            dot.addEventListener('click', () => goToSlide(idx));
            if (carouselDots) carouselDots.appendChild(dot);
        });

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === slides.length - 1;

            if (carouselDots) {
                const dots = carouselDots.querySelectorAll('.carousel-dot');
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active-dot', idx === currentIndex);
                });
            }
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        updateCarousel();
    }

    /* ==========================================================================
       6. GAME SUB-TABS (SPIELE-ECKE)
       ========================================================================== */
    const subtabs = document.querySelectorAll('.subtab');
    const gamePanels = document.querySelectorAll('.game-panel');

    subtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-subtarget');

            subtabs.forEach(t => t.classList.remove('active-subtab'));
            tab.classList.add('active-subtab');

            gamePanels.forEach(panel => {
                if (panel.id === target) {
                    panel.classList.remove('hidden-panel');
                    panel.classList.add('active-panel');
                } else {
                    panel.classList.add('hidden-panel');
                    panel.classList.remove('active-panel');
                }
            });
        });
    });

    /* ==========================================================================
       7. PIXEL MEMORY GAME LOGIC
       ========================================================================== */
    const memoryBoard = document.getElementById('memory-board');
    const movesDisplay = document.getElementById('memory-moves');
    const matchesDisplay = document.getElementById('memory-matches');
    const restartBtn = document.getElementById('memory-restart-btn');
    const victoryModal = document.getElementById('memory-victory-modal');

    if (memoryBoard) {
        const memoryImages = [
            'assets/Rkopf.webp',
            'assets/C_run.webp',
            'assets/Bkopf.webp',
            'assets/Ckopf.webp',
            'assets/Lkopf.webp',
            'assets/dein-bild.webp'
        ];

        let cardsArray = [];
        let flippedCards = [];
        let moves = 0;
        let matches = 0;
        let lockBoard = false;

        function initMemoryGame() {
            memoryBoard.innerHTML = '';
            flippedCards = [];
            moves = 0;
            matches = 0;
            lockBoard = false;

            if (movesDisplay) movesDisplay.textContent = moves;
            if (matchesDisplay) matchesDisplay.textContent = matches;
            if (victoryModal) victoryModal.classList.add('hidden-view');

            cardsArray = [...memoryImages, ...memoryImages]
                .sort(() => 0.5 - Math.random());

            cardsArray.forEach((imgSrc, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.symbol = imgSrc;
                card.dataset.index = index;

                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = "Memory Karte";

                card.appendChild(img);
                card.addEventListener('click', () => flipCard(card));
                memoryBoard.appendChild(card);
            });
        }

        function flipCard(card) {
            if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                moves++;
                if (movesDisplay) movesDisplay.textContent = moves;
                checkMatch();
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            const isMatch = card1.dataset.symbol === card2.dataset.symbol;

            if (isMatch) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matches++;
                if (matchesDisplay) matchesDisplay.textContent = matches;
                flippedCards = [];

                if (matches === memoryImages.length) {
                    setTimeout(() => {
                        if (victoryModal) victoryModal.classList.remove('hidden-view');
                    }, 400);
                }
            } else {
                lockBoard = true;
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    lockBoard = false;
                }, 900);
            }
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', initMemoryGame);
        }

        initMemoryGame();
    }
});
