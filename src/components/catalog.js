const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// Lädt alle Kollektionen + Artikel und baut eine Map: Bild-Dateiname -> Produkt
export async function ladeKatalog() {
  const map = new Map();
  try {
    const kollRes = await fetch(`${apiBaseUrl}/kollektionen`);
    const kollData = await kollRes.json();
    const kollektionen = kollData.kollektionen || [];

    for (const k of kollektionen) {
      const slug = k.slug || k.name;
      try {
        const artRes = await fetch(`${apiBaseUrl}/artikel/${encodeURIComponent(slug)}`);
        const artData = await artRes.json();
        const produkte = artData.kollektion_name || [];
        for (const produkt of produkte) {
          const bilder = produkt.bilder || [];
          for (const bild of bilder) {
            const rawPath = bild.s3_key || bild.url || '';
            const dateiname = rawPath.split('/').pop();
            if (dateiname) {
              map.set(dateiname, produkt);
            }
          }
        }
      } catch {
        // einzelne Kollektion konnte nicht geladen werden, weiter mit den anderen
      }
    }
  } catch {
    // Katalog konnte nicht geladen werden, Map bleibt leer
  }
  return map;
}

export function findeProduktZuBild(katalog, imgSrc) {
  if (!imgSrc) return null;
  const dateiname = imgSrc.split('/').pop();
  return katalog.get(dateiname) || null;
}
