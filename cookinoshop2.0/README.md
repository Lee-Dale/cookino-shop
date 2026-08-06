# cookinoshop2

Reaktives Frontend mit Vite, React, Tailwind CSS und GSAP.

## Schnellstart

1. Abhängigkeiten installieren

```bash
npm install
```

2. Lokalen Entwicklungsserver starten

```bash
npm run dev
```

3. Produktionsbuild erzeugen

```bash
npm run build
```

4. Fertigen Build lokal testen

```bash
npm run preview
```

Der Build wird in `dist/` erzeugt.

## Projektübersicht

Dieses Projekt kombiniert das vorhandene Visual Design mit modernen
Entwicklungstools, während die bestehende Interaktionslogik erhalten
bleibt.

- `index.html` – Vite-Einstiegspunkt, enthält nur das Root-Element
  und die Meta-/Preload-Einstellungen.
- `src/main.jsx` – startet die React-Anwendung und lädt `style.css`.
- `src/App.jsx` – rendert die Seitenstruktur als JSX und bindet das
  Legacy-Verhalten ein.
- `src/legacyMain.js` – enthält die bisherige UI-Logik für:
  - Custom Cursor
  - 3D-Tilt-Karten
  - Navigation und Tabs
  - Modal-Management
  - Karussell
  - Intro-Animation mit GSAP
  - Memory-Spiel und weitere Interaktionen
- `src/components/AllwissendesBuch.jsx` – eigenständige Komponente für
  das Flüsternde Buch, inkl. Chat-Verlauf und Frage-Formular.
- `src/style.css` – bestehendes Projekt-CSS, ergänzt um Tailwind-
  Direktiven und neue Stile für das Buch-Modal.
- `tailwind.config.js`, `postcss.config.js`, `vite.config.js` –
  Standardkonfiguration für Vite + Tailwind + React.

## Assets

Statische Dateien gehören in den `public/`-Ordner. Beispiel:

```text
public/assets/            # alle Bilder
public/assets/audio/      # Hintergrundmusik und Sounds
```

Vite kopiert `public/` unverändert in den Build-Ordner. Im Code werden
Assets über `/assets/...` geladen.

## Hinweise

- Die Anwendung nutzt React hauptsächlich als Render-Schicht. Die
  ursprüngliche Logik bleibt weitgehend in `src/legacyMain.js`
  erhalten, damit das bestehende Verhalten stabil bleibt.
- Änderungen an der Modal-Darstellung oder am Buch-Layout können
  direkt in `src/App.jsx`, `src/components/AllwissendesBuch.jsx` und
  `src/style.css` vorgenommen werden.
- Die aktuelle Build-Konfiguration unterstützt moderne Browser und
  ist auf schnelle Entwicklung mit Hot Reload ausgelegt.
