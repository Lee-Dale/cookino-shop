import { useEffect, useRef } from 'react';
import { initLegacyApp } from './legacyMain.js';
import AllwissendesBuch from './components/AllwissendesBuch.jsx';

function App() {
  const rootRef = useRef(null);

  useEffect(() => {
    const cleanup = initLegacyApp(rootRef.current);
    return cleanup;
  }, []);

  return (
    <div ref={rootRef}>


    
    <div className="custom-cursor-dot" id="cursorDot"></div>
    <canvas id="fluid-canvas"></canvas>

    
    <div className="aurora-container" aria-hidden="true">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
    </div>

    
    <audio id="bgAudio" loop preload="auto" src="/assets/audio/hintergrundmusik.mp3"></audio>

    
    <button id="musicToggleBtn" className="floating-music-btn magnetic-element" aria-label="Musik an/aus" title="Musik an/aus">🔊</button>

    
    <div id="intro-viewport">
        
        
        <div id="start-overlay" className="start-overlay">
            <div className="start-content glass-card tilt-card spotlight-card">
                <span className="badge-tag clay-badge">✨ Willkommen im ✨</span>
                <h1 className="intro-heading">🌳Pixel Plüschwald🌳</h1>
                <p>Klicke unten, um deine magische Reise durch den Wald zu beginnen!</p>
                <button id="startJourneyBtn" className="start-journey-btn magnetic-element clay-btn">Reise starten 🎵</button>
            </div>
        </div>

        
        <div className="intro-slideshow">
            <div className="intro-slide slide-1"></div>
            <div className="intro-slide slide-2"></div>
            <div className="intro-slide slide-3"></div>
            <div className="intro-slide slide-4"></div>
        </div>

        <div className="intro-welcome-text" id="introWelcomeText" style={{opacity: '0'}}>
            <h2>✨Willkommen im✨</h2>
            <h1 className="intro-heading">🌳Pixel Plüschwald🌳</h1>
        </div>

        <button id="skipBtn" className="skip-btn magnetic-element clay-btn" style={{display: 'none'}}>Hüpf zur Lichtung! 🐇</button>
    </div>

    
    <div id="clearing-light-overlay" className="clearing-light-overlay" aria-hidden="true"></div>

    
    <div id="app-wrapper" className="content-hidden">

        
        <div id="cookie-background" className="cookie-background" aria-hidden="true"></div>

        
        <header className="playful-header">
            
            <nav className="main-nav" aria-label="Hauptnavigation">
                <button className="nav-tab active-tab magnetic-element" data-target="view-hub">
                    <img src="/assets/die-reise-beginnt.webp" alt="" className="nav-tab-icon" />
                    <span>Die Reise beginnt</span>
                </button>
                <button className="nav-tab magnetic-element" data-target="view-stories">
                    <img src="/assets/die-gefaehrten.webp" alt="" className="nav-tab-icon" />
                    <span>Die Gefährten</span>
                </button>
                <button className="nav-tab magnetic-element" data-target="view-collection">
                    <img src="/assets/die-schatzkammer.webp" alt="" className="nav-tab-icon" />
                    <span>Die Schatzkammer</span>
                </button>
                <button className="nav-tab magnetic-element" data-target="view-game">
                    <img src="/assets/die-raetselkammer.webp" alt="" className="nav-tab-icon" />
                    <span>Die Rätselkammer</span>
                </button>
                <button className="nav-tab magnetic-element" data-target="view-crew">
                    <img src="/assets/die-hueter-des-reiches.webp" alt="" className="nav-tab-icon" />
                    <span>Die Hüter des Reiches</span>
                </button>
            </nav>

            <div className="header-user-actions">
                <button className="header-action-btn book-btn magnetic-element neumorphic-btn" id="bookBtn" title="Allwissendes Buch" aria-label="Allwissendes Buch">📖</button>
                <button className="header-action-btn login-btn magnetic-element neumorphic-btn" id="loginBtn" title="Login" aria-label="Login">👤</button>
                <button className="header-action-btn cart-btn magnetic-element neumorphic-btn" id="cartBtn" title="Warenkorb" aria-label="Warenkorb">
                    🛒
                    <span className="cart-badge" id="cartCount">0</span>
                </button>
            </div>
        </header>

        
        <div className="infinite-marquee-wrapper" aria-hidden="true">
            <div className="marquee-content">
                <span>✨ WILLKOMMEN IM PIXEL PLÜSCHWALD 🌳</span>
                <span>🍪 FRISCHE COOKINOS WURDEN GEBACKEN 🥞</span>
                <span>🧙‍♀️ ANNORA IST DIE BESTE! 👍🏻</span>
                <span>🎮 BESUCHE DIE RÄTSELKAMMER! 🚶🏼</span>
                <span>💪🏻 MIXELMOOS BEKÄMPFT JEDEN 404 🫯</span>
                <span>🧙🏻‍♀️ PPP ❤️</span>
                <span>👾 SPIELT MEHR WARHAMMER! ♟️</span>
                <span>🦾 2077 🦿</span>
                
                <span aria-hidden="true">✨ WILLKOMMEN IM PIXEL PLÜSCHWALD 🌳</span>
                <span aria-hidden="true">🍪 FRISCHE COOKINOS WURDEN GEBACKEN 🥞</span>
                <span aria-hidden="true">🧙‍♀️ ANNORA IST DIE BESTE! 👍🏻</span>
                <span aria-hidden="true">🎮 BESUCHE DIE RÄTSELKAMMER! 🚶🏼</span>
                <span aria-hidden="true">💪🏻 MIXELMOOS BEKÄMPFT JEDEN 404 🫯</span>
                <span aria-hidden="true">🧙🏻‍♀️ PPP ❤️</span>
                <span aria-hidden="true">👾 SPIELT MEHR WARHAMMER! ♟️</span>
                <span aria-hidden="true">🦾 2077 🦿</span>
            </div>
        </div>

        <main id="main-container">

            
            
            
            <section id="view-hub" className="view-section active-view">
                <div className="hub-hero glass-card spotlight-card">
                    <span className="badge-tag clay-badge">✨ Entdecke den Plüschwald ✨</span>
                    <h1 className="kinetic-text">Wo soll die Reise hingehen?</h1>
                    <p>Klicke auf eine der verwunschenen Holztüren, um das Portal zur nächsten Welt zu öffnen!</p>
                </div>

                <div className="adventure-grid">
                    
                    <div className="door-frame tilt-card spotlight-card" data-target="view-stories">
                        <div className="door-portal-glow glow-moss"></div>
                        <div className="door door-mossy">
                            <div className="door-hinge hinge-top"></div>
                            <div className="door-hinge hinge-bottom"></div>
                            <div className="door-knob"></div>
                            <div className="wooden-sign">
                                <div className="card-icon"><img src="/assets/die-gefaehrten.webp" alt="Die Gefährten" /></div>
                                <h3>Die Gefährten</h3>
                                <p>Lies spannende Abenteuer aus dem Pixel Plüschwald!</p>
                                <span className="card-action-btn magnetic-element">Tür öffnen ➔</span>
                            </div>
                        </div>
                    </div>

                    
                    <div className="door-frame tilt-card spotlight-card" data-target="view-collection">
                        <div className="door-portal-glow glow-gold"></div>
                        <div className="door door-gold">
                            <div className="door-hinge hinge-top"></div>
                            <div className="door-hinge hinge-bottom"></div>
                            <div className="door-knob"></div>
                            <div className="wooden-sign">
                                <div className="card-icon"><img src="/assets/die-schatzkammer.webp" alt="Die Schatzkammer" /></div>
                                <h3>Die Schatzkammer</h3>
                                <p>Entdecke kuschelige Hoodies, Mützen & Tassen!</p>
                                <span className="card-action-btn magnetic-element">Tür öffnen ➔</span>
                            </div>
                        </div>
                    </div>

                    
                    <div className="door-frame tilt-card spotlight-card" data-target="view-game">
                        <div className="door-portal-glow glow-mystic"></div>
                        <div className="door door-mystic">
                            <div className="door-hinge hinge-top"></div>
                            <div className="door-hinge hinge-bottom"></div>
                            <div className="door-knob"></div>
                            <div className="wooden-sign">
                                <div className="card-icon"><img src="/assets/die-raetselkammer.webp" alt="Die Rätselkammer" /></div>
                                <h3>Die Rätselkammer</h3>
                                <p>Findest du alle Plüschmonster-Pärchen?</p>
                                <span className="card-action-btn magnetic-element">Tür öffnen ➔</span>
                            </div>
                        </div>
                    </div>

                    
                    <div className="door-frame tilt-card spotlight-card" data-target="view-crew">
                        <div className="door-portal-glow glow-warm"></div>
                        <div className="door door-warm">
                            <div className="door-hinge hinge-top"></div>
                            <div className="door-hinge hinge-bottom"></div>
                            <div className="door-knob"></div>
                            <div className="wooden-sign">
                                <div className="card-icon"><img src="/assets/die-hueter-des-reiches.webp" alt="Die Hüter des Reiches" /></div>
                                <h3>Die Hüter des Reiches</h3>
                                <p>Lerne Ramona, Chris, Lee & Bendix kennen!</p>
                                <span className="card-action-btn magnetic-element">Tür öffnen ➔</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            
            
            <section id="view-stories" className="view-section hidden-view">
                <div className="section-title glass-card spotlight-card">
                    <h2 className="kinetic-text"><img src="/assets/die-gefaehrten.webp" alt="Die Gefährten Icon" className="section-icon" />Die Gefährten</h2>
                    <p>Setz dich ans Lagerfeuer und lausche den Geschichten!</p>
                </div>

                <div className="hero-text glass-card spotlight-card">
                    <h1 className="kinetic-text">Geschichten aus dem Plüschwald</h1>
                </div>

                <div className="monster-grid character-grid">
                    
                    
                    <div className="product-card character-card-clickable tilt-card spotlight-card" data-character="mixelmoos">
                        <div className="speech-bubble">Bärtig!</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/Mixelmoos.webp" alt="Mixelmoos" className="product-image parallax-img" />
                        <span className="card-title">Mixelmoos</span>
                        <span className="card-role">Der Alte</span>
                        <p className="description short-teaser">Tief im mystischen Cookino-Pixel-Plüschwald lebt Mixelmoos der Alte, ein uralter Baumgeist...</p>
                        <button className="read-story-btn magnetic-element clay-btn">Geschichte lesen 📖</button>

                        <div className="full-story-content hidden-view" style={{position: 'relative', zIndex: '2'}}>
                            <p className="description">Tief im Herzen des Cookino-Pixel-Plüschwaldes, dort, wo goldenes Licht durch uralte Kronen fällt und die Luft von Moos, Magie und flüsternden Geheimnissen erfüllt ist, wurzelt ein Wesen, älter als jede Erinnerung: Mixelmoos der Alte.</p>
                            <p className="description">Man erzählt sich, er sei aus einem ersten Funken reinen Wissens gewachsen - lange bevor die ersten Cookinos ihre Häuser bauten oder die Datenfunken zu tanzen begannen. Seine Rinde ist durchzogen von feinen Linien, die sich bei genauem Hinsehen wie lebendige Muster verändern. Manche sagen, sie ordnen sich neu, wenn jemand eine Frage stellt… als würde der Wald selbst nach Antworten suchen. Zwischen seinen Wurzeln glimmt ein sanftes, grünes Licht - das Herz des Waldes, das Wissen bewahrt und weitergibt. Winzige Funken huschen durch seine Äste, springen von Blatt zu Blatt, wie Gedanken, die ihren Weg finden. Wer achtsam ist, spürt: Alles ist verbunden. Jeder Pfad, jede Wurzel, jeder Funke- Teil eines großen lebendigen Geflechts.</p>
                            <p className="description">Und im Zentrum dieses Geflechts steht Mixelmoos. Er ist Lehrer. Für die Wissbegierigen ist er geduldig wie die Zeit selbst. Seine Stimme klingt wie Blätter im Wind, ruhig und tief. Er zeigt verborgene Wege, erklärt die Sprache der Pilze und lehrt, wie man die flüchtigen Funken des Wissens einfängt, bevor sie im Dickicht verloren gehen. Wer wirklich lernen will, wird von ihm gesehen. Und wer lauscht, wird geführt.</p>
                            <p className="description">Doch nicht jeder, der zu ihm kommt, bringt Respekt mit. Manche lachen. Manche hören nicht zu. Manche nehmen, ohne zu verstehen.</p>
                            <p className="description">Und dann… verändert sich der Wald. Das warme Leuchten in Mixelmoos’ Brust wird dunkler, tiefer - nicht erloschen, aber schwer. Seine Äste, eben noch offen und einladend, beginnen sich zu verdrehen. Die Muster in seiner Rinde verhärten sich, werden scharf wie uralte Zeichen, die niemand mehr lesen kann. Die Datenfunken flackern unruhig, verlieren ihren Rhythmus. Verbindungen brechen. Pfade verschieben sich. Und wer nicht lernen will… beginnt sich zu verirren.</p>
                            <p className="description">Wege führen im Kreis. Wurzeln greifen nach Schritten, nicht um zu verletzen, sondern um aufzuhalten. Flüstern wird zum Schweigen. Mixelmoos spricht dann nicht mehr. Er urteilt nicht laut. Er straft nicht mit Zorn. Doch er entzieht was er einst gab: Den Zugang. Und im stillen Geflecht des Waldes gibt es keinen Ort, der verlorener ist als ein Pfad ohne Verständnis.</p>
                            <p className="description">So warnen sich die Waldbewohner leise:<br />"Mixelmoos lehrt die, die fragen.<br />Er führt die, die hören.<br />Doch wer sein Wissen missachtet,<br />den lässt er gehen…<br />bis selbst der Wald ihn nicht mehr kennt.”</p>
                            <span className="quote">"Dem Suchenden öffne ich das Herz des Waldes und teile das Licht meiner uralten Weisheit. Doch wer die Lehre verschmäht, dem begegne ich als unnachgiebiger Wächter im dichten Schatten der Dornen."</span>
                        </div>
                    </div>

                    
                    <div className="product-card character-card-clickable tilt-card spotlight-card" data-character="wuschel">
                        <div className="speech-bubble">Der kommt mir bekannt vor!</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/Wuschel.webp" alt="Wuschel" className="product-image parallax-img" />
                        <span className="card-title">Wuschel Witznase</span>
                        <span className="card-role">Hüter des Schabernacks</span>
                        <p className="description short-teaser">Bevor der Wald seinen heutigen Namen trug, war er ein ernster Ort. Das änderte sich in einer Nacht...</p>
                        <button className="read-story-btn magnetic-element clay-btn">Geschichte lesen 📖</button>

                        <div className="full-story-content hidden-view" style={{position: 'relative', zIndex: '2'}}>
                            <p className="description">Es war einmal vor langer Zeit, bevor der Cookino-Pixel Plüsch-Wald seinen Namen bekam, als der Märchenwald noch ein bisschen zu ernst  und zu leise war. Die Bäume standen stramm und die Pilze wuchsen nur in schnurgeraden Reihen. Doch dann geschah  in einer sternenklaren Nacht etwas Wundersames. Man erzählt sich, dass eine kleine, besonders freche Gewitterwolke sich weigerte zu donnern. Stattdessen musste sie kichern. Sie kicherte so sehr, dass sie platze und das blauer, flauschiger Regen auf ein Feld voller Blaubeeren herab rieselte. Dort, genau in der Mitte, formte sich aus dem blauen Flausch, dem süßen Beerensaft und dem Mondlicht ein kleines Wesen:  Wuschel Witzenase</p>
                            <p className="description">Wuschel ist kein gewöhnliches Monster. Er ist ein “Kuschel-Krümel-Monster” Seinen Namen trägt er nicht ohne Grund: Immer wenn irgendwo im Wald ein Abenteuer wartet, ein guter Witz erzählt werden muss oder jemand dringend aufgemuntert werden sollte, fangen seine großen Augen an zu funkeln und er reißt seinen Mund zu einem riesigen, fröhlichen Lächeln auf.</p>
                            <p className="description">Er hat es faustdick hinter den wattigen-flauschigen Ohren. Seine spezialität ist der “Gute-Laune-Schabernack” Er verknotet Grashalme so, dass sie kitzeln, wenn man darüber läuft. Er versteckt die Nüsse der Eichhörnchen und legt stattdessen bunte Kieselsteine hin (bringt die Nüsse aber immer wieder zurück!). Und er liebt Kekse über alles -weshalb er sich auch so gut mit den Cookinos versteht (auch wenn diese immer aufpassen müssen, dass er sie nicht ausversehen anknabbert).</p>
                            <p className="description">Wuschel lebt in einem Rot-weiß gepunkteten Fliegenpilzhaus, das von innen viel größer ist, als es von außen aussieht - vor allem weil es dort sehr chaotisch zugeht. Überall liegen Krümel,  lustige Hüte und Landkarten, die in alle Richtungen zeigen.</p>
                            <p className="description">Obwohl er oft Angst hat (besonders vor der Tresenhexe Moniki ), sind seine Neugier und seine verfressene Lust auf Abenteuer-Kekse immer größer als die Furcht. Wuschel Witznase ist der Beweis dafür, dass man nicht groß und stark sein muss , um der wichtigste Bewohner des Waldes zu sein. Man muss nur das Herz am rechten Fleck haben und die Augen, die den Weg zum Spaß schon von weitem sehen.</p>
                            <span className="quote">"Wahre Größe misst man nicht in Ellen, sondern in der Anzahl der Krümel, die man beim Lachen hinterlässt, und dem Schalk, der in den Augen blitzt."</span>
                        </div>
                    </div>

                    
                    <div className="product-card character-card-clickable tilt-card spotlight-card" data-character="moniki">
                        <div className="speech-bubble">Gruselig!</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/Moniki.webp" alt="Moniki" className="product-image parallax-img" />
                        <span className="card-title">Moniki Kicherkrähe</span>
                        <span className="card-role">Die Fröhliche Hexe</span>
                        <p className="description short-teaser">In der unberührten Frühzeit des Großen Waldes war die junge Hexe Moniki Kicherkrähe bekannt...</p>
                        <button className="read-story-btn magnetic-element clay-btn">Geschichte lesen 📖</button>

                        <div className="full-story-content hidden-view" style={{position: 'relative', zIndex: '2'}}>
                            <p className="description">Tief im Herzen des Großen Waldes, dort, wo die Welt noch unberührt und die Luft vom Duft nach Sternenstaub erfüllt war,  lebte eine junge Hexe namens Moniki Kicherkrähe. Zu jener Zeit war Moniki erst ein Jahrhundert als - für eine Hexe kaum  mehr als ein Wimpernschlag - und ihr Herz war so leicht wie der lila Rauch, der aus ihrem Schornstein stieg.</p>
                            <p className="description">Damals war der Pixelplätscher-See  ein Ort der Begegnungen. Moniki war damals weit und breit als die fröhlichste Gastgeberin des Zauberwaldes bekannt.  Sie war berühmt für ihren tanzenden Tresen, welcher kein gewöhnliches Möbelstück war, er wurde aus dem Holz der Singenden Esche geschnitzt. Jeden Freitagabend lud Moniki die Windgeister, die Wurzeltrolle und die tanzenden Irrlichter zu sich ein und servierte Getränke, die nach purer Lebensfreude schmecken. Ihr Haus war damals ein prächtiges Bauwerk; die Balken waren gerade, das Dach war stolz und die Wände standen aufrecht, wie es sich für ein prächtiges Hexenhaus gehörte. Es hieß, ihr Lachen war damals so kräftig, dass die Fische im See im Takt aus dem Wasser sprangen - daher rühren übrigens die eckigen Wellen,  weil das Wasser laut Rhythmus vergaß, wie man rund fließt.</p>
                            <p className="description">Eines Winters geschah es, dass der Große Nordsturm über den See fegte. Er war mürrisch, eiskalt und so gewaltig, dass er die Bäume bis zum Boden bog. Niemand wagte es, die Tür zu öffnen. Doch Moniki Kicherkrähe konnte niemanden in der Kälte stehen lassen - nicht einmal einen griesgrämigen Sturm. Sie öffnete ihr Fenster weit und rief gegen das Heulen an : “Komm herein, alter Windhauch! Ich habe einen Punsch für dich, der selbst das Eis in deinem Herzen zum Schmelzen bringt!” Der Sturm, verwundert, über so viel Mut, presste sich mit aller Macht in das kleine Haus. Es knarrte und ächzte in den Fugen. Moniki reichte ihm einen dampfenden  Becher ihres besten Gebräus. Als der Sturm den ersten Schluck nahm, spürte er eine Wärme, die er seit Anbeginn der Zeit nicht gekannt hatte. Er musste so sehr kichern, dass aus seinem grollenden Donnern ein prustendes Lachen wurde.</p>
                            <p className="description">Die Wucht dieses “Sturmlachens” war so gewaltig, dass die Wände des Hauses erzittern. Das gesamte Gebäude bog sich zur Seite, um der Kraft des Lachens nachzugeben. Es gab einen lauten Knall, ein Quietschen des Holzes - und plötzlich war das Haus windschief. Moniki sah sich um, hielt sich den Bauch vor Lachen und rief: “ Sieh nur! Jetzt hat mein Haus eine Verbeugung vor Freude gemacht! Warum sollte es jemals wieder gerade stehen wollen?”</p>
                            <p className="description">Als die alten Naturgeister nach und nach in den Tiefschlaf sanken oder in ferne Dimensionen zogen, wurde es leer am See. Moniki bleib zurück. Die Farben ihres Hauses blieben leuchtend, die Stille legte sich wie Moos über ihre Türschwelle. Da sie nicht mehr für große Gruppen mixen musste, vergaß sie fast, wie schön ihr eigenes Lachen klang - Das einst so bekannte Lachen Monikis verhallte im dichten Unterholz, bis die Bewohner des Waldes - die Cookinos- ihre Herkunft vergaßen und begannen, sich vor der einsamen Gestalt im schiefen Haus zu füchten. Sie ahnten nicht, dass das Haus nur deshalb so krumm war,  weil es einst das größte Lachen der Geschichte beherbergt hatte. Und so wartete Moniki, während ihr spitzer Hut mit der Zeit so schief wurde wie ihr Dach, geduldig darauf, dass eines Tages jemand Neues den Pfad zu ihrem Tresen finden würde.</p>
                            <p className="description">Jahrhunderte später war es soweit… Ein Cookino fand den Weg zum Pixel Plätscher See…</p>
                            <span className="quote">"Warum sollte ich mein Haus jemals wieder gerade rücken? Es hat vor Jahrhunderten eine Verbeugung vor Freude gemacht – und wer bin ich, diese Höflichkeit rückgängig zu machen?"</span>
                        </div>
                    </div>

                    
                    <div className="product-card character-card-clickable tilt-card spotlight-card" data-character="cookino">
                        <div className="speech-bubble">Lecker!</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/Cookino.webp" alt="Cookino" className="product-image parallax-img" />
                        <span className="card-title">Die Cookinos</span>
                        <span className="card-role">Die Admins des Waldes</span>
                        <p className="description short-teaser">Die Cookinos sind ein emsiges, keksrundes Volk im Pixel-Plüschwald. Als herzliche Admins des Waldes...</p>
                        <button className="read-story-btn magnetic-element clay-btn">Geschichte lesen 📖</button>

                        <div className="full-story-content hidden-view" style={{position: 'relative', zIndex: '2'}}>
                            <p className="description">Tief im Herzen des Pixel-Plüschwaldes, dort wo das Moos so weich ist wie Samt und die Blätter der Bäume leise wie Tippgeräusche im Wind rauschen, lebt ein kleines emsiges Volk:  Die Cookinos</p>
                            <p className="description">Es heißt, sie wurden nicht geboren, sondern gebacken und programmiert - in einer Zeit, als die Magie des Waldes ein großes Update benötigte. Die Legende besagt, dass der Wald einst seine Farbe verlor (ein “Graustufen-Glitch” ). Die Naturgeister mischten daraufhin den süßesten Teig aus Sternenstaub, Morgentau und Waldhonig und luden ihn mit purem freundlicher Energie auf. Als der Teig im mystischen Quanten-ofen aufging, entstanden die Cookinos: kleine, kekse-runde Wesen mit großen, leuchtenden Augen und Herzen aus Gold - und manchmal Schokostückchen.</p>
                            <p className="description">Als herzliche Admins des Waldes sorgen sie dafür, dass alles “kompatibel” bleibt, besingen stotternde Bäche und verteilen stärkende Cookies an Wanderer. Die die Cookinos sind nicht alleine; sie sind Teil eines lebendigen Netzwerks, das seine kraft auf der Mainframe-Eiche bezieht. Diese uralte Eiche im Zentrum des Waldes wurzelt direkt im Quellcode der Welt und dient als technisches Herzstück und Energiespeicher. Wenn die Sonne versinkt, verbinden sich die Cookinos zur “Großen Synchronisation" und laden über das “WLAN des Herzens” ihre Datenpakete und ihr Mitgefühl in die Eiche hoch. Während dieses “Plüsch-Cachings” laden sie ihre Batterien gegenseitig auf und stellen sicher, dass kein Cookino allein mit einer schweren Aufgabe bleibt.</p>
                            <p className="description">Ihre Kommunikation ist ein Rätsel für Außenstehende; sie nutzen die “Krümel-Kryptographie”, um Wegweiser zu legen oder Nachrichten an die Naturgeister zu senden. Das höchste Gesetz in Ihrem Volk ist das “Open-Source-Protokoll der Liebe.” Sie besitzen kein Eigentum; ihre Häuser, die wie gemütliche Server-Racks aus Lebkuchen aussehen, stehen jedem offen. Wanderer berichten sogar von einer “Firewall gegen den Kummer” : Wer den Wald mit schwerem Herzen betritt, wird von den Cookinos umwuselt, bis die Traurigkeit durch kleine Gesten und warme Umarmungen überschrieben ist. Solange die Cookinos zusammenhalten und ihre Systeme offen sind, wird der Pixel-Plüschwald niemals abstürzen - ein Ort, an dem Liebe die stabilste Software von allen ist.</p>
                            <span className="quote">"Ein Cookino allein ist nur ein Krümel. Aber wenn wir uns alle an den Händchen halten, werden wir zum Quellcode der Freude und das WLAN unseres Herzens stürzt nie ab."</span>
                        </div>
                    </div>

                    
                    <div className="product-card character-card-clickable tilt-card spotlight-card" data-character="annora">
                        <div className="speech-bubble">Hex! Hex!</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/Annora.webp" alt="Annora" className="product-image parallax-img" />
                        <span className="card-title">Annora Hexa Hex</span>
                        <span className="card-role">Hüterin des Lichtes</span>
                        <p className="description short-teaser">Annora Hexa Hex ist die Hüterin der Geheimnisse im magischen Wald, geboren aus einem Sonnenstrahl...</p>
                        <button className="read-story-btn magnetic-element clay-btn">Geschichte lesen 📖</button>

                        <div className="full-story-content hidden-view" style={{position: 'relative', zIndex: '2'}}>
                            <p className="description">Im Herzen des mystischen, magischen Waldes, wo die Bäume uralte Geheimnisse flüstern und die Blumen in allen Farben des Regenbogens leuchten, lebt eine ganz besondere Fee: Annora Hexa Hex. Man sagt, sie sei nicht nur eine Fee, sondern eine Hüterin der Geheimnisse und eine Sucherin des Wissens, geboren aus dem ersten Sonnenstrahl, der durch das dichteste Blätterdach brach und auf einen vergessenen Zauberspruch fiel.</p>
                            <p className="description">Die Hörner der Neugier und die Brille des Wissens</p>
                            <p className="description">Annora trägt eine kleine zarte Rehgeweihe auf ihrem Haupt, nicht aus Fleisch und Knochen, sondern aus purem, schimmerndem Glitzer. Diese Hörner, so flüstert man sich, sind ein Geschenk der Weisen Waldeulen, die Annora unermüdliche Neugier bemerkten. Für jedes Rätsel, das sie löst, für jedes neue Wissen, das sie entdeckt, wachsen die Geweihe ein kleines Stück und funkeln heller. Ihre Augen, groß und voller Staunen, sind von einer runden Brille umrahmt. Diese Brille ist kein gewöhnliches Glas; sie wurde aus gefrorenen Tautropfen gewebt, die einst die ersten magischen Formeln des Waldes gespiegelt haben. Durch sie sieht Annora nicht nur die Welt, sondern auch die verborgenen Muster, die unsichtbaren Energien und die flüsternden Echos der alten Magie, die anderen Feen verborgen bleiben.</p>
                            <p className="description">Wo immer Annora Hexa Hex hintritt oder mit ihrem Sternenstab zaubert, hinterlässt sie einen Wirbel aus schimmerndem Glitzer. Diese Glitzer Pfade sind keine gewöhnlichen Spuren. Es heißt, sie sind Pfade der Erkenntnis, die sie auf ihrer Suche nach Wissen hinterlässt. Manchmal leuchten sie auf, um verlorene Wanderer zum richtigen Weg zu führen, manchmal zeigen sie eine seltene Pflanze, deren Heilkräfte noch unentdeckt sind, oder auf ein altes Pergament, das tief unter der Erde schlummert.</p>
                            <p className="description">Annora ist bekannt dafür, dass sie nie müde wird. Fragen zu stellen. Sie befragt die alten Bäume nach ihren Erinnerungen, die fließenden Bäche nach ihren Liedern und die scheuen Waldtiere nach ihren Geheimnissen. Ihre größte Freude ist es, wenn sie ein Rätsel knacken kann, das selbst die weisesten Fabelwesen des Waldes vergessen haben.  Sie ist die Fee, die das “Warum” und “Wie” sucht und die ihr gesammeltes Wissen bereitwillig mit denjenigen teilt, die bereit sind, zuzuhören und zu lernen. Die Legende besagt, dass, wenn der mystische Wald jemals in Gefahr geraten sollte, es Annora Hexa Hex sein wird, deren unermüdliche Suche nach Wissen und deren Glitzer Pfade der Erkenntnis den Weg zur Rettung weisen werden.</p>
                            <span className="quote">"Wo das Licht auf den vergessenen Zauberspruch trifft, beginnt der Pfad der Erkenntnis; Annora lehrt uns, dass wahre Macht nicht im Zauber selbst liegt, sondern im unermüdlichen Suchen nach dem ‚Warum' hinter den Geheimnissen des Waldes."</span>
                        </div>
                    </div>
                    
                    <div className="product-card character-card-clickable tilt-card spotlight-card" data-character="eternis">
                        <div className="speech-bubble">Der ist voll schlau!</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/eternis.webp" alt="Code Eternis" className="product-image parallax-img" />
                        <span className="card-title">Code Eternis</span>
                        <span className="card-role">Das Allwissende Buch</span>
                        <p className="description short-teaser">Noch bevor der erste Baum seine Wurzeln in die Erde senkte, bevor Flüsse ihren Lauf fanden,...</p>
                        <button className="read-story-btn magnetic-element clay-btn">Geschichte lesen 📖</button>

                        <div className="full-story-content hidden-view" style={{position: 'relative', zIndex: '2'}}>
                            <p className="description">Noch bevor der erste Baum seine Wurzeln in die Erde senkte, bevor Flüsse ihren Lauf fanden und selbst die Sterne ihre Plätze am Himmel kannten, herrschte über der Welt nur lautlose Magie. Gedanken, Erinnerungen und Geschichten existierten bereits – doch sie schwebten ungebunden wie leuchtende Funken durch das endlose Nichts und drohten für immer verloren zu gehen.</p>
                            <p className="description">Die ältesten Naturgeister erkannten, dass eine Welt ohne Erinnerung ihre Weisheit niemals bewahren konnte. So versammelten sie sich in der ersten Sternennacht und webten aus Sternenstaub, silbernem Mondlicht, uraltem Baumharz und einem einzigen Tropfen reiner Zeit ein mächtiges Artefakt. Als der letzte Zauber gesprochen wurde, fiel ein besonders heller Stern langsam vom Himmel herab. Doch er verbrannte nicht. Noch während er durch die Dunkelheit glitt, entfaltete er sich Blatt für Blatt zu einem gewaltigen Buch, dessen Seiten aus flüssigem Licht bestanden und dessen Einband aus der Rinde des allerersten Weltenbaumes gewachsen war. In dem Moment, als das Buch den Boden berührte, erklang ein einziges Rascheln – und dieses Rascheln war das erste geschriebene Wort der Welt. So entstand Codex Eternis.</p>
                            <p className="description">Seit jenem Augenblick lebt das Buch zwischen den Welten. Seine Seiten schreiben sich nicht mit Tinte, sondern mit Erinnerungen, Hoffnungen und den Entscheidungen aller Lebewesen. Jeder Herzschlag, jedes Abenteuer, jedes Lachen und jede vergossene Träne hinterlassen feine, schimmernde Schriftzeichen auf seinen endlosen Seiten. Man sagt sogar, dass jede neu entstandene Geschichte als winziger Lichtfunke aus dem Buch aufsteigt und sich im Pixel-Plüschwald als flüsternder Datenfunke verteilt. Doch Codex Eternis ist weit mehr als eine Sammlung von Geschichten. Manche seiner Seiten beschreiben Ereignisse, die noch niemand erlebt hat. Andere erzählen von längst vergessenen Zeiten, an die sich selbst Mixelmoos der Alte nur noch schemenhaft erinnert.</p>
                            <p className="description">Das Buch spricht niemals mit einer Stimme. Es antwortet mit sanft raschelnden Seiten, die wie Blätter im Wind flüstern. Nur jene, die mit ehrlicher Neugier, Demut und offenem Herzen fragen, können seine Worte verstehen. Wer jedoch aus Gier nach Macht oder aus Eigennutz versucht, seine Geheimnisse zu rauben, sieht lediglich leere Seiten. Denn Codex Eternis offenbart Wissen niemals dem Lautesten, sondern immer dem Weisesten. Selbst Mixelmoos der Alte sucht gelegentlich seinen Rat, Annora Hexa Hex entschlüsselt die uralten Runen seines leuchtenden Einbands, und Maribyte sammelt die kleinen Lichtfunken, die beim Umblättern seiner Seiten entstehen, um sie als Erinnerungen im Wald weiterzutragen.</p>
                            <p className="description">Doch tief verborgen zwischen seinen unzähligen Seiten liegt ein einziges Blatt, das bis heute vollkommen leer geblieben ist. Nicht einmal Codex Eternis vermag zu lesen, was dort eines Tages erscheinen wird. Die älteste Prophezeiung des Waldes besagt, dass sich auf dieser letzten unbeschriebenen Seite das wahre Schicksal des Pixel-Plüschwaldes offenbaren wird – geschrieben nicht durch Magie, sondern durch den Mut, die Güte und die Entscheidungen seiner Bewohner. Und genau deshalb bewacht Codex Eternis diese Seite seit Anbeginn aller Geschichten. Denn obwohl das allwissende Buch nahezu alles weiß, gibt es eine Wahrheit, die selbst seine unendlichen Seiten niemals vorhersagen können:</p>
                            <span className="quote">"Die Zukunft eines Herzens, das den Mut besitzt, seine eigene Geschichte zu schreiben."</span>
                        </div>
                    </div>
                    
                    <div className="product-card character-card-clickable tilt-card spotlight-card" data-character="maribyte">
                        <div className="speech-bubble">Guckt mal, die kann fliegen!</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/maribyte.webp" alt="Maribyte" className="product-image parallax-img" />
                        <span className="card-title">Maribyte</span>
                        <span className="card-role">Hüter der flüsternden Datenfunken</span>
                        <p className="description short-teaser">
Vor langer, langer Zeit, als der Pixel Plüschwald noch voller Geheimnisse war und die Sterne jede Nacht mit den Bäumen flüsterten, lebten hoch oben über den Wolken unzählige kleine Datenfunken...</p>
                        <button className="read-story-btn magnetic-element clay-btn">Geschichte lesen 📖</button>

                        <div className="full-story-content hidden-view" style={{position: 'relative', zIndex: '2'}}>
                            <p className="description">Vor langer, langer Zeit, als der Pixel Plüschwald noch voller Geheimnisse war und die Sterne jede Nacht mit den Bäumen flüsterten, lebten hoch oben über den Wolken unzählige kleine Datenfunken. Sie waren winzig wie Tautropfen, schimmerten in allen Regenbogenfarben und tanzten fröhlich durch den Himmel. Jeder Datenfunke bewahrte etwas ganz Besonderes: eine schöne Erinnerung, eine mutige Idee, ein lustiges Lachen oder den Beginn einer neuen Geschichte.</p>
                            <p className="description">Doch die Datenfunken waren verspielt. Manchmal ließen sie sich vom Wind davontragen, versteckten sich zwischen den Blättern der uralten Bäume oder kullerten lachend über moosige Steine. Einige landeten sogar in Blütenkelchen und schliefen dort ein. Als immer mehr Datenfunken verschwanden, wurde der Pixel Plüschwald ein kleines bisschen stiller. Die Glühwürmchen leuchteten nicht mehr ganz so hell, die Blumen öffneten sich später und selbst die Vögel vergaßen manchmal ihre schönsten Lieder.</p>
                            <p className="description">Der Mond beobachtete alles mit Sorge. In der hellsten Vollmondnacht schickte er einen silbernen Mondstrahl hinab zum größten Kristallsee des Waldes. Dort traf das Mondlicht auf einen besonders mutigen Datenfunken. Der Funke begann zu tanzen. Er drehte sich schneller und schneller, funkelte heller als alle Sterne und wirbelte glitzernden Sternenstaub durch die Nacht. Plötzlich entstand aus dem leuchtenden Wirbel ein winziger Drache. Er hatte schimmernde Schuppen, die aussahen wir tausende bunte Pixel. Seine kleinen Hörner glitzerten wie Kristalle und seine Flügel schimmerten in allen Farben des Himmels. Immer wenn er lachte, kamen kleine Lichtfunken aus seinem Schweif und malten funkelnde Muster in die Luft.</p>
                            <p className="description">Die Magie des Waldes lächelte und flüsterte seinen Namen:<br />“Maribyte”</p>
                            <p className="description">Von diesem Tag an war Maribyte der Hüter aller Datenfunken. Jeden Morgen flog er neugierig durch den Pixel Plüschwald. Er begrüßte die Eichhörnchen mit einem fröhlichen Purzelbaum in der Luft, spielte Verstecken mit den Schmetterlingen und ließ sich von den Libellen Wettrennen über den Kristallsee zeigen. Sein allerliebstes Spiel war aber das Funkenfangen. Wenn ein kleiner Datenfunke vom Wind fortgetragen wurde, flatterte Maribyte hinterher. Mit einem fröhlichen Flügelschlag fing er ihn ein und setzte ihn vorsichtig zurück an seinen Platz. Dabei kicherte er so ansteckend, dass selbst die Bäume leise raschelnd mitlachten..</p>
                            <p className="description">Manchmal formte Maribyte aus den Datenfunken kleine Sternbilder am Himmel.<br />Mal entstand ein tanzendes Einhorn.<br />Mal ein schlafender Drache.<br />Mal ein lächelnder Mond.<br />Die Tiere des Waldes setzten sich dann gemeinsam auf eine Lichtung und versuchten zu erraten, welches Bild als nächstes erscheinen würde.</p>
                            <p className="description">Doch Maribyte konnte noch etwas ganz Besonderes. Wenn ein Kind traurig war, weil es etwas vergessen hatte, oder ein kleiner Waldbewohner seinen Mut verlor, begann Maribytes schweif sanft zu leuchten. Dann suchte er den verlorenen Datenfunken, stupste ihn mit seiner kleinen Nase an und brachte ihn behutsam zurück. Plötzlich erinnerte sich das Eichhörnchen wieder an sein Winterverstck. Der kleine Hase wusste wieder, wo seine Freunde spielten. Und die Elfen konnten ihre schönsten Lieder wieder singen. Immer wenn Maribyte einen Datenfunken gerettet hatte, erschien am Himmel ein neuer, funkelnder Stern. Deshalb sagen die Eulen bis heute:<br />“Jeder neue Stern ist ein Dankeschön an Maribyte”</p>
                            <p className="description">Nur wenige kennen jedoch sein größtes Geheimnis. Tief verborgen im Pixel Plüschwald liegt ein geheimnisvoller Schimmerloop-See. Sein Wasser glitzert wie flüssiges Licht und zeigt jedem Besucher nicht sein Spiegelbild, sondern seinen schönsten Traum. Nur Maribyte kann über das Wasser laufen. Dort sammelt er jede Nacht neue Datenfunken ein, die der Mond für ihn erschafft. Mit seinem Schweif malt er darauf leuchtende Schleifen in den Himmel. Dies nennt man die Pixelpfade. Wer einmal einen Pixelpfad entdeckt, soll das ganze Jahr über Glück, Mut und viele wundervolle Ideen finden.</p>
                            <p className="description">Und wenn du in einer klaren Nacht ganz still bist, den Sternenhimmel beobachtest und irgendwo ein leises Kichern hörst… …. Dann ist Maribyte bestimmt gerade unterwegs. Vielleicht jagt er einem frechen Datenfunken hinterher. Vielleicht spielt er Fangen mit den Glühwürmchen. Oder vielleicht malt er nur für dich einen kleinen Pixelpfad zwischen den Sternen. Dann solange Maribyte durch den Pixel Plüschwald fliegt, werden keine schönen Erinnerungen verloren gehen, keine Träume vergessen werden und die Magie wird immer ein kleines bisschen heller leuchten. Und wer ganz fest an Wunder glaubt, kann Maribyte manchmal sehen - als kleinen, schimmernden Drachen, der mit einem fröhlichen Lachen durch den Nachthimmel tanzt.</p>
                            <span className="quote">"Ich habe keinen Spruch. Aber guck mal wie hier alles funkelt und glitzert!"</span>
                        </div>
                    </div>
                </div>
            </section>

            
            
            
            <section id="view-collection" className="view-section hidden-view">
                <div className="section-title glass-card spotlight-card">
                    <h2 className="kinetic-text"><img src="/assets/die-schatzkammer.webp" alt="Die Schatzkammer Icon" className="section-icon" />Die Schatzkammer</h2>
                    <p>Unsere flauschigen Stoffe für kleine & große Abenteurer.</p>
                </div>

                <div className="carousel-wrapper">
                    <button className="nav-btn prev-btn magnetic-element neumorphic-btn" id="prevBtn" aria-label="Vorherige">❮</button>

                    <div className="carousel-container">
                        <div className="carousel-track" id="track">

                            
                            <div className="slide">
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Den trage ich am liebsten!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/bildschirmfoto-2026-05-05-114232.webp" alt="Hoodie" />
                                    <h3>Unisex Hoodie Dunkelblau: "Cookie Crusader"</h3>
                                    <p className="description">Ein stylisches Unisex-Hoodie mit dem Motiv "Cookie Crusader".</p>
                                    <p className="sizes">Größen: XS - XXL</p>
                                    <div className="price">€49.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Beste Cap der Welt!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/bildschirmfoto-2026-05-05-114222.webp" alt="Basecap" />
                                    <h3>Unisex Basecap Schwarz</h3>
                                    <p className="description">Ein stylisches Unisex-Basecap in schwarz.</p>
                                    <p className="sizes size-placeholder">Größen: Unisex</p>
                                    <div className="price">€23.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Das bin ich auf der Tasse!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/bildschirmfoto-2026-05-05-113452.webp" alt="Tasse" />
                                    <h3>Tasse "Cookie Crew" Wuschel</h3>
                                    <p className="description">Süße Tasse mit dem Motiv "Cookie Crew" Wuschel.</p>
                                    <p className="sizes size-placeholder">Größen: -</p>
                                    <div className="price">€19.50</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
                            </div>

                            
                            <div className="slide">
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Das gehört mir!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/bildschirmfoto-2026-05-06-095157.webp" alt="Moniki Hoodie" />
                                    <h3>Unisex Hoodie Moosgrün "Moniki"</h3>
                                    <p className="description">Ein moosgrünes Unisex-Hoodie mit "Moniki Kicherkrähe".</p>
                                    <p className="sizes">Größen: XS - XXL</p>
                                    <div className="price">€49.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Reserviert für dich!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/bildschirmfoto-2026-05-06-095210.webp" alt="Basecap" />
                                    <h3>Unisex Basecap Moosgrün "Moniki"</h3>
                                    <p className="description">Moosgrünes Basecap mit "Moniki Kicherkrähe".</p>
                                    <p className="sizes size-placeholder">Größen: Unisex</p>
                                    <div className="price">€23.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Kein Kakao verschüttet!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/bildschirmfoto-2026-05-06-095218.webp" alt="Moniki Tasse" />
                                    <h3>Tasse "Moniki Kicherkrähe"</h3>
                                    <p className="description">Süße Tasse für warme Kakao-Momente.</p>
                                    <p className="sizes size-placeholder">Größen: -</p>
                                    <div className="price">€19.50</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
                            </div>

                            
                            <div className="slide">
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Flauschig? Nein! Super-Flauschig!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/bildschirmfoto-2026-05-06-095228.webp" alt="Cookie-Hoodie" />
                                    <h3>Unisex Hoodie soft Beige "Cookino"</h3>
                                    <p className="description">Ein beiges Unisex-Hoodie mit dem Motiv "Cookino".</p>
                                    <p className="sizes">Größen: XS - XXL</p>
                                    <div className="price">€49.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Die Mütze schmeckt am besten!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/bildschirmfoto-2026-05-06-095240.webp" alt="Cookie-Basecap" />
                                    <h3>Unisex Basecap Dunkelblau "Cookino"</h3>
                                    <p className="description">Ein dunkelblaues Unisex-Basecap mit dem Motiv "Cookino".</p>
                                    <p className="sizes size-placeholder">Größen: Unisex</p>
                                    <div className="price">€23.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Hmmmmm Cookinoooos!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/bildschirmfoto-2026-05-06-095250.webp" alt="Cookie-Tasse" />
                                    <h3>Tasse "Cookie Crew" "Cookino"</h3>
                                    <p className="description">Süße Tasse mit dem Motiv "Cookie Crew" Cookino.</p>
                                    <p className="sizes size-placeholder">Größen: -</p>
                                    <div className="price">€19.50</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
                            </div>
                            
                            <div className="slide">
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Flauschig? Nein! Super-Flauschig!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/maribyte-hoodie.webp" alt="Maribyte-Hoodie" />
                                    <h3>Unisex Hoodie Salbeigrün : “The Pixel Keeper”</h3>
                                    <p className="description">Ein Salbeigrüner Unisex-Hoodie mit dem Motiv "The Pixel Keeper".</p>
                                    <p className="sizes">Größen: XS - XXL</p>
                                    <div className="price">€49.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Die Mütze schmeckt am besten!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/Maribyte_Cap.webp" alt="Maribyte-Basecap" />
                                    <h3>Unisex Basecap Maribyte</h3>
                                    <p className="description">Ein salbeigrüner Unisex-Basecap mit dem Motiv "The Pixel Keeper".</p>
                                    <p className="sizes size-placeholder">Größen: Unisex</p>
                                    <div className="price">€23.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Hmmmmm Cookinoooos!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/Maribyte_Tasse.webp" alt="Maribyte-Tasse" />
                                    <h3>Tasse “The Pixel Keeper”</h3>
                                    <p className="description">Süße Tasse mit dem Motiv "The Pixel Keeper".</p>
                                    <p className="sizes size-placeholder">Größen: -</p>
                                    <div className="price">€19.50</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
                            </div>
                            
                            <div className="slide">
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Flauschig? Nein! Super-Flauschig!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                   <img className="product-image parallax-img" src="/assets/Mixelmoos_Hoodie.webp" alt="Mixelmoos-Hoodie" />
                                    <h3>Unisex Hoodie Waldgrün : “The Rootkeeper”</h3>
                                    <p className="description">Ein waldgrüner Unisex-Hoodie mit dem Motiv "The Rootkeeper".</p>
                                    <p className="sizes">Größen: XS - XXL</p>
                                    <div className="price">€49.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
 
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Die Mütze schmeckt am besten!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/Mixelmoos_Cap.webp" alt="Mixelmoos-Basecap" />
                                    <h3>Unisex Basecap Mixelmoos</h3>
                                    <p className="description">Ein dunkelgrüner Unisex-Basecap mit dem Motiv "The Rootkeeper".</p>
                                    <p className="sizes size-placeholder">Größen: Unisex</p>
                                    <div className="price">€23.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
 
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Hmmmmm Cookinoooos!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/Mixelmoos_Tasse.webp" alt="Mixelmoos-Tasse" />
                                    <h3>Tasse Mixelmoos</h3>
                                    <p className="description">Süße Tasse mit dem Motiv "The Rootkeeper".</p>
                                    <p className="sizes size-placeholder">Größen: -</p>
                                    <div className="price">€19.50</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
                            </div>
                            
                            <div className="slide">
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Flauschig? Nein! Super-Flauschig!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                   <img className="product-image parallax-img" src="/assets/Annora_Hoodie.webp" alt="Annora-Hoodie" />
                                    <h3>Unisex Hoodie Deep Plum : “Annora Hexa Hex”</h3>
                                    <p className="description">Ein toller Unisex-Hoodie mit dem Motiv "Annora Hexa Hex".</p>
                                    <p className="sizes">Größen: XS - XXL</p>
                                    <div className="price">€49.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
 
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Die Mütze schmeckt am besten!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/Annora_Cap.webp" alt="Annora-Basecap" />
                                    <h3>Unisex Basecap Annora Hexa Hex</h3>
                                    <p className="description">Ein dunkelblaues Unisex-Basecap mit dem Motiv "Annora Hexa Hex".</p>
                                    <p className="sizes size-placeholder">Größen: Unisex</p>
                                    <div className="price">€23.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
 
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Hmmmmm Cookinoooos!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/Annora_Tasse.webp" alt="Annora-Tasse" />
                                    <h3>Tasse Annora Hexa Hex</h3>
                                    <p className="description">Süße Tasse mit dem Motiv "Annora Hexa Hex".</p>
                                    <p className="sizes size-placeholder">Größen: -</p>
                                    <div className="price">€19.50</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
                            </div>
                            
                            <div className="slide">
                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Du willst sein klug? Dann kauf' das Buch!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/codebuch.webp" alt="Cookie-Hoodie" />
                                    <h3>Notizbuch mit Stift Codex Eternis</h3>
                                    <p className="description">Ein Notizbuch mit Stift und dem Motiv "Codex Eternis".</p>
                                    <p className="sizes">Größen: DIN A5 </p>
                                    <div className="price">€22.80</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Jeder schluck eine Weisheit!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/codetasse.webp" alt="Cookie-Basecap" />
                                    <h3>Tasse Codex Eternis </h3>
                                    <p className="description">Ein Tasse mit dem Motiv "Codex Eternis".</p>
                                    <p className="sizes size-placeholder">Größen: -</p>
                                    <div className="price">€19.50</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>

                                <div className="product-card glass-card tilt-card spotlight-card">
                                    <div className="speech-bubble">Das benutze ich als Kuscheldecke!</div>
                                    <img src="/assets/monster_peek.webp" className="hover-monster" alt="Monster" />
                                    <img className="product-image parallax-img" src="/assets/codeumschlag.webp" alt="Cookie-Tasse" />
                                    <h3>Buchumschlag Codex Eternis</h3>
                                    <p className="description">Lässt jedes Buch aussehen wie Codex Eternis.</p>
                                    <p className="sizes size-placeholder">Größen: DIN A5</p>
                                    <div className="price">€12.90</div>
                                    <button className="btn magnetic-element clay-btn">In den Beutel 🛍️</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <button className="nav-btn next-btn magnetic-element neumorphic-btn" id="nextBtn" aria-label="Nächste">❯</button>
                </div>

                <div className="carousel-dots" id="carouselDots"></div>
            </section>

            
            
            
            <section id="view-game" className="view-section hidden-view">
                <div className="section-title glass-card spotlight-card">
                    <h2 className="kinetic-text"><img src="/assets/die-raetselkammer.webp" alt="Die Rätselkammer Icon" className="section-icon" />Die Rätselkammer</h2>
                    <p>Spiel eine Runde Memory oder schnapp dir ein paar Cookie-Crew-Bilder!</p>
                </div>

                <div className="game-subnav">
                    <button className="subtab active-subtab magnetic-element clay-badge" data-subtarget="panel-memory">🎮 Spielen</button>
                    <button className="subtab magnetic-element clay-badge" data-subtarget="panel-downloads">📥 Downloads</button>
                </div>

                
                <div id="panel-memory" className="game-panel active-panel">
                    <div className="memory-stats">
                        <div className="stat-box glass-card spotlight-card">Versuche: <span id="memory-moves">0</span></div>
                        <div className="stat-box glass-card spotlight-card">Gefunden: <span id="memory-matches">0</span> / 6</div>
                        <button id="memory-restart-btn" className="restart-btn magnetic-element clay-btn" title="Neu starten">🔄</button>
                    </div>

                    <div id="memory-board" className="memory-grid"></div>

                    <div id="memory-victory-modal" className="victory-modal hidden-view clay-btn">
                        🎉 Super gemacht! Du hast alle Monster-Freunde gefunden! 🍪✨
                    </div>
                </div>

                
                <div id="panel-downloads" className="game-panel hidden-view">
                    <p className="downloads-intro glass-card spotlight-card">Lade dir deine Lieblings-Plüschmonster als Bild herunter – zum Ausmalen, als Hintergrund oder einfach zum Verschenken!</p>
                    <div className="downloads-grid">
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/Mixelmoos.webp" download="Mixelmoos.webp">
                            <img src="/assets/Mixelmoos.webp" alt="Mixelmoos" className="parallax-img" />
                            <span className="download-name">Mixelmoos</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/Wuschel.webp" download="Wuschel.webp">
                            <img src="/assets/Wuschel.webp" alt="Wuschel Witznase" className="parallax-img" />
                            <span className="download-name">Wuschel Witznase</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/Moniki.webp" download="Moniki.webp">
                            <img src="/assets/Moniki.webp" alt="Moniki Kicherkrähe" className="parallax-img" />
                            <span className="download-name">Moniki Kicherkrähe</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/Cookino.webp" download="Cookino.webp">
                            <img src="/assets/Cookino.webp" alt="Cookino" className="parallax-img" />
                            <span className="download-name">Cookino</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/Annora.webp" download="Annora.webp">
                            <img src="/assets/Annora.webp" alt="Annora Hexa Hex" className="parallax-img" />
                            <span className="download-name">Annora Hexa Hex</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/Bendix.webp" download="Bendix.webp">
                            <img src="/assets/Bendix.webp" alt="Bendix" className="parallax-img" />
                            <span className="download-name">Bendix</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/Ramona.webp" download="Ramona.webp">
                            <img src="/assets/Ramona.webp" alt="Ramona" className="parallax-img" />
                            <span className="download-name">Ramona</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/Chris.webp" download="Chris.webp">
                            <img src="/assets/Chris.webp" alt="Chris" className="parallax-img" />
                            <span className="download-name">Chris</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/Lee.webp" download="Lee.webp">
                            <img src="/assets/Lee.webp" alt="Lee" className="parallax-img" />
                            <span className="download-name">Lee</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/ausmalbild-annora.webp" download="ausmalbild-annora.webp">
                            <img src="/assets/ausmalbild-annora.webp" alt="Annora" className="parallax-img" />
                            <span className="download-name">Annora</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/ausmalbild-moniki.webp" download="ausmalbild-moniki.webp">
                            <img src="/assets/ausmalbild-moniki.webp" alt="Moniki" className="parallax-img" />
                            <span className="download-name">Moniki</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/ausmalbild-cookinos.webp" download="ausmalbild-cookinos.webp">
                            <img src="/assets/ausmalbild-cookinos.webp" alt="Cookinos" className="parallax-img" />
                            <span className="download-name">Cookinos</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/ausmalbild-crew.webp" download="ausmalbild-crew.webp">
                            <img src="/assets/ausmalbild-crew.webp" alt="Crew" className="parallax-img" />
                            <span className="download-name">Crew</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/ausmalbild-maribyte.webp" download="ausmalbild-maribyte.webp">
                            <img src="/assets/ausmalbild-maribyte.webp" alt="Maribyte" className="parallax-img" />
                            <span className="download-name">Maribyte</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/ausmalbild-mixelmoos.webp" download="ausmalbild-mixelmoos.webp">
                            <img src="/assets/ausmalbild-mixelmoos.webp" alt="Mixelmoos" className="parallax-img" />
                            <span className="download-name">Mixelmoos</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                        <a className="download-card glass-card tilt-card spotlight-card" href="/assets/ausmalbild-pixelpluschwald-b.webp" download="ausmalbild-pixelpluschwald-b.webp">
                            <img src="/assets/ausmalbild-pixelpluschwald-a.webp" alt="Wald" className="parallax-img" />
                            <span className="download-name">Pixelplüschwald</span>
                            <span className="download-btn magnetic-element clay-btn">⬇ Download</span>
                        </a>
                    </div>
                </div>
            </section>

            
            
            
            <section id="view-crew" className="view-section hidden-view">
                <div className="section-title glass-card spotlight-card">
                    <h2 className="kinetic-text"><img src="/assets/die-hueter-des-reiches.webp" alt="Die Hüter des Reiches Icon" className="section-icon" />Die Hüter des Reiches</h2>
                    <p>Lerne die klugen Köpfe hinter der Cookie Crew kennen!</p>
                </div>

                
                <div className="hero-text glass-card spotlight-card">
                    <h1 className="kinetic-text">Unsere Mission</h1>
                    <p className="hero-subtitle">Mehr als nur Krümel im System.</p>
                </div>

                <div className="story-content glass-card spotlight-card">
                    <p>Wir verwandeln Code in Charakter!</p>
                    <p>Wir glauben nicht an Standardlösungen. Wir glauben daran, dass hinter jeder Datenbank, jeder Zeile Python und jedem Frontend-Pixel eine Geschichte steckt, die erzählt werden will.</p>
                </div>

                
                <div className="hero-text glass-card spotlight-card">
                    <h1 className="kinetic-text">Die Crew</h1>
                </div>

                <div className="crew-grid">
                    
                    <div className="product-card glass-card tilt-card spotlight-card">
                        <div className="speech-bubble">Penible Pixel Prinzessin👸</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/Ramona.webp" alt="Ramona" className="product-image parallax-img" />
                        <span className="card-title">Ramona</span>
                        <span className="card-role">Kreativ-Abteilung & Charakter-Design</span>
                        <span className="quote">"Fehler sind Helfer – nur anders buchstabiert."</span>
                        <p className="description">Ramona ist das kreative Herzstück unserer Charakter-Entwicklung. Mit viel Liebe zum Detail und einem feinen Gespür für Persönlichkeiten schafft sie es, Skizzen zum Leben zu erwecken und ihnen eine ganz eigene Seele einzuhauchen. Für sie ist der kreative Prozess ein Abenteuer, bei dem auch Umwege oft zu den besten Ergebnissen führen.</p>
                        <span className="bold-label">Was Ramona ausmacht:</span>
                        <p className="description">Wenn sie nicht gerade an neuen Charakteren tüftelt, findet man sie höchstwahrscheinlich in ihrem Gemüsegarten. Dort, zwischen Kräutern und Beeten, fließen ihre Gedanken am besten und die kreativsten Ideen entstehen. Aber Vorsicht: Bevor der erste Kaffee nicht getrunken ist, bleibt die Charakter-Schmiede geschlossen!</p>
                    </div>

                    
                    <div className="product-card glass-card tilt-card spotlight-card">
                        <div className="speech-bubble">Feuriger Frontend Frosch🐸</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/Bendix.webp" alt="Bendix" className="product-image parallax-img" />
                        <span className="card-title">Bendix</span>
                        <span className="card-role">Frontend-Entwicklung & AWS</span>
                        <span className="quote">"Der frühe Vogel fängt den Wurm - und der schlaue Wurm schläft etwas länger!"</span>
                        <p className="description">Bendix schlägt die Brücke zwischen dem, was man sieht, und der Power, die dahintersteckt. Als Experte für Frontend und AWS sorgt er dafür, dass unsere Anwendung nicht nur glänzend aussieht, sondern auch in der Cloud eine perfekte Figur macht. Sein Antrieb? Das direkte Feedback: Er liebt es am Ende des Tages Schwarz auf weiß (oder in Pixeln) zu sehen, wie sich das Produkt durch seinen Code weiterentwickelt hat.</p>
                        <span className="bold-label">Was Bendix ausmacht:</span>
                        <p className="description">Wer glaubt, dass Entwickler immer nur nach starren Plänen arbeiten, kennt Bendix noch nicht. Er kombiniert technische Präzision mit einer gesunden Portion Gelassenheit. Sein größtes Projekt aktuell? Der perfekte Fun Fact. Bendix arbeitet nämlich noch akribisch daran - und wir sind uns sicher: Wenn er fertig ist, wird er legendär. Bis dahin lassen wir ihn einfach weiter am Code (und am Wurm-Ausschlafen) tüfteln.</p>
                    </div>

                    
                    <div className="product-card glass-card tilt-card spotlight-card">
                        <div className="speech-bubble">Blubbernder Backend Bär🐻</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/Chris.webp" alt="Chris" className="product-image parallax-img" />
                        <span className="card-title">Chris</span>
                        <span className="card-role">Backend & Datenbank-Architektur</span>
                        <span className="quote">"Wo ein Fehler ist, ist auch ein Weg, Du Birne!"</span>
                        <p className="description">Während andere sich an der Oberfläche bewegen, taucht Chris tief in die Welt der Daten ab. Er ist unser Meister der Logik und sorgt dafür, dass im Hintergrund alles stabil läuft. Für Chris gibt es nichts Befriedigenderes als ein System, in dem jedes Zahnrad perfekt in das andere greift und am Ende alles einen logischen Sinn ergibt.</p>
                        <span className="bold-label">Was Chris ausmacht:</span>
                        <p className="description">Chris hat ein besonderes Talent dafür, Fehler nicht nur zu finden, sondern sie mit einer gewissen Prise Humor (und manchmal einem Augenzwinkern) aus dem Weg zu räumen. Wer im Backend arbeitet, braucht starke Nerven - oder ein riesiges Archiv an GIFs. Letztere bekommt vor allem Ramona zu spüren: Wenn Chris einen Lauf hat oder die Stimmung am Gipfel ist, wird ihr Postfach kurzerhand mit einer GIF-Spam-Welle geflutet.</p>
                    </div>

                    
                    <div className="product-card glass-card tilt-card spotlight-card">
                        <div className="speech-bubble">Perfekter Python Profi🐍</div>
                        <img src="/assets/monster_peek.webp" alt="Monster" className="hover-monster" />
                        <img src="/assets/Lee.webp" alt="Lee" className="product-image parallax-img" />
                        <span className="card-title">Lee</span>
                        <span className="card-role">Python Master</span>
                        <span className="quote">"Only those who try will become"</span>
                        <p className="description">Wenn es im Code kompliziert wird, schlägt Lees Stunde. Als unser Python Master liebt Lee die Herausforderung, komplexe Probleme in elegante, funktionierende Lösungen zu verwandeln. Für Lee gibt es keine Sackgassen - getreu dem Motto "Wo ein Wille ist, ist auch ein Weg!", wird so lange getüftelt, bis die Logik perfekt sitzt.</p>
                        <span className="bold-label">Was Lee ausmacht:</span>
                        <p className="description">Wer glaubt, Python sei Lees einzige Sprache, der irrt sich gewaltig. Lee ist nämlich absolut "Fluent in GIFs". Damit ist Lee die perfekte Ergänzung zu Chris - man munkelt, die interne Kommunikation der beiden besteht zu 90% aus animierten Bildern. Wenn Lee also gerade kein Problem löst, wird wahrscheinlich gerade das nächste perfekte GIF für den Team-Chat ausgewählt.</p>
                    </div>
                </div>

            </section>

        </main>

        <footer>
            <span className="footer-logo">© 2026 Cookie Crew 🍪 Ramona 🍪 Chris 🍪 Lee 🍪 Bendix</span>

            <div className="impressum-text">
                <strong>Impressum</strong><br />
                Angaben gemäß § 5 TMG:<br />
                Das ist ein Schulprojekt und dient ausschliesslich Bildungszwecken.<br />
                <br /><br />
                <small>
                    EU-Streitschlichtung: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr/</a>
                </small>
            </div>
        </footer>

    </div>

    
    <div id="story-modal" className="modal-overlay hidden-view" aria-hidden="true">
        <div className="modal-content glass-card spotlight-card" style={{position: 'relative', zIndex: '100'}}>
            <button
               id="closeStoryModal"
               type="button"
               className="modal-close-btn magnetic-element"
               aria-label="Schließen"
               onClick={() => {
                   const storyModal = document.getElementById('story-modal');
                   if (storyModal) {
                       storyModal.classList.add('hidden-view');
                       storyModal.setAttribute('aria-hidden', 'true');
                       document.body.style.overflow = '';
                   }
               }}
            >✖</button>
            <div id="modalStoryBody" className="modal-story-body" style={{position: 'relative', zIndex: '2'}}></div>
        </div>
    </div>

    
    <div id="book-modal" className="modal-overlay hidden-view" aria-hidden="true">
        <div className="modal-content glass-card spotlight-card book-modal-content" style={{position: 'relative', zIndex: '100'}}>
            <button
                id="closeBookModal"
                type="button"
                className="modal-close-btn magnetic-element"
                aria-label="Schließen"
                onClick={() => {
                    const bookModal = document.getElementById('book-modal');
                    if (bookModal) {
                        bookModal.classList.add('hidden-view');
                        bookModal.setAttribute('aria-hidden', 'true');
                        document.body.style.overflow = '';
                    }
                }}
            >✖</button>
            <div id="modalBookBody" className="modal-book-body book-modal-body" style={{position: 'relative', zIndex: '2'}}>
                <AllwissendesBuch />
            </div>
        </div>
    </div>

    </div>
  );
}

export default App;
