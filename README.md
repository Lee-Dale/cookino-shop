# 🍪 Cookie Crew – Pixel Plüschwald Abenteuer

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

Willkommen im **Pixel Plüschwald**! Eine interaktive, magische Webanwendung, die charmantes Storytelling, Merchandise-Präsentationen, ein Minispiel und kreative Animationen miteinander verbindet.

> **Hinweis:** Dieses Projekt wurde im Rahmen eines Schulprojekts entwickelt und dient ausschließlich Bildungs- und Anschauungszwecken.

---

## 🌲 Über das Projekt

Die Website nimmt die Besucher mit auf eine Reise durch den mystischen Pixel Plüschwald. Neben den Geschichten rund um Mixelmoos, Wuschel Witznase und weitere Fabelwesen bietet die Anwendung eine interaktive Entdeckungstour mit animierten Türen, ein Karussell für Merchandise-Artikel, ein integriertes Memory-Spiel sowie Download-Möglichkeiten.

---

## ✨ Features & Highlights

- **GSAP Waldspaziergang-Intro:** Eine mehrstufige Diashow-Animation beim Aufrufen der Seite inklusive Skip-Funktion (*„Hüpf zur Lichtung!“*).
- **Fliegende Cookinos:** Dynamisch generierte, schwebende Kekse im Hintergrund mit individuellen Rotations- und Aufsteiganimationen via Vanilla JS.
- **Interaktiver Hub („Zauberlichtung“):** 3D-Holztüren mit Klapp-Animation (`transform: rotateY`), die sanft zu den jeweiligen Unterseiten navigieren.
- **Die Gefährten (Storytelling):** Vorstellung der Charaktere mit ausklappenden Hover-Monstern, Sprechblasen und einer Hervorhebung der Hauptfigur Mixelmoos.
- **Die Schatzkammer (Merch-Kollektion):** Responsive Produkt-Karussell mit Indikator-Dots und Vor/Zurück-Steuerung.
- **Die Rätselkammer (Spiele-Ecke & Downloads):**
  - **Pixel-Memory:** Voll funktionsfähiges Minispiel mit Zähler für Versuche/Paare und Sieges-Modal.
  - **Downloads:** Direkt-Downloads für Charakter-Grafiken.
- **Die Hüter des Reiches:** Team-Präsentation der Cookie Crew.
- **Responsive Design:** Optimiert für Desktops, Tablets und Mobilgeräte (inklusive Touch-Anpassungen für das Memory-Grid und die Navigationsleiste).

---

## 🛠️ Technologie-Stack

- **HTML5:** Semantischer Aufbau, Barrierefreiheit-Features (`aria-label`, `aria-hidden`).
- **CSS3:** 
  - CSS Custom Properties (Farbpalette & Design-Tokens)
  - Flexbox & CSS Grid
  - Custom Keyframe-Animationen & 3D-Transformationen
  - Glassmorphism (`backdrop-filter`)
- **JavaScript (ES6 Vanilla JS):**
  - DOM-Manipulation & State Management
  - Eigener Event-Driven View-Switcher
  - Algorithmus zum Mischen und Logik für das Memory-Spiel
  - Dynamischer Generator für Hintergrund-Partikel
- **GSAP (GreenSock Animation Platform):** Für geschmeidige Timeline-Animationen im Intro.

---

## 📁 Projektstruktur

```text
.
├── index.html              # Haupt-HTML-Datei (Single-Page-Anwendungsstruktur)
├── css/
│   └── style.css           # Zentrales Stylesheet (Reset, Layout, Komponenten, Responsive)
├── js/
│   └── main.js             # Anwendungslogik (Intro, Navigation, Karussell, Memory)
└── assets/                 # Grafiken, Icons und Hintergründe (.webp)
    ├── Hintergrundbild.webp
    ├── trees-mid.webp
    ├── tree-left.webp
    ├── tree-right.webp
    ├── clearing-bg.webp
    ├── monster_peek.webp
    ├── Mixelmoos.webp
    ├── Wuschel.webp
    ├── Moniki.webp
    ├── Cookino.webp
    └── ... (weitere Produkt- und Team-Bilder)