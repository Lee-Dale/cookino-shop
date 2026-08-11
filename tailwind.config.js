/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {},
  },
  // Preflight (Tailwinds CSS-Reset) ist deaktiviert: Preflight setzt u.a.
  // h1-h6 auf font-size: inherit zurück und entfernt damit die
  // Standard-Browser-Größe, auf die das bestehende Custom-CSS (style.css)
  // sich verlässt - dadurch wurden Überschriften wie "Willkommen im Pixel
  // Plüschwald" plötzlich viel kleiner. Ohne Preflight bleibt das
  // bisherige Design 1:1 erhalten; Tailwind-Utility-Klassen funktionieren
  // trotzdem ganz normal in neuen Komponenten.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
