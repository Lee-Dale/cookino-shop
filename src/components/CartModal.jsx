import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const ARTIKEL_BILDER = {
  'ANN-CAP': '/assets/Annora_Cap.webp',
  'ANN-HOOD': '/assets/Annora_Hoodie.webp',
  'ANN-MUG': '/assets/Annora_Tasse.webp',
  'COD-COVER': '/assets/codeumschlag.webp',
  'COD-NOTE': '/assets/codebuch.webp',
  'COD-MUG': '/assets/codetasse.webp',
  'COO-CAP': '/assets/bildschirmfoto-2026-05-06-095240.webp',
  'COO-HOOD': '/assets/bildschirmfoto-2026-05-06-095228.webp',
  'COO-MUG': '/assets/bildschirmfoto-2026-05-06-095250.webp',
  'MAR-CAP': '/assets/Maribyte_Cap.webp',
  'MAR-HOOD': '/assets/maribyte-hoodie.webp',
  'MAR-MUG': '/assets/Maribyte_Tasse.webp',
  'MIX-CAP': '/assets/Mixelmoos_Cap.webp',
  'MIX-HOOD': '/assets/Mixelmoos_Hoodie.webp',
  'MIX-MUG': '/assets/Mixelmoos_Tasse.webp',
  'MON-CAP': '/assets/bildschirmfoto-2026-05-06-095210.webp',
  'MON-HOOD': '/assets/bildschirmfoto-2026-05-06-095157.webp',
  'MON-MUG': '/assets/bildschirmfoto-2026-05-06-095218.webp',
  'WUS-CAP': '/assets/bildschirmfoto-2026-05-05-114222.webp',
  'WUS-HOOD': '/assets/bildschirmfoto-2026-05-05-114232.webp',
  'WUS-MUG': '/assets/bildschirmfoto-2026-05-05-113452.webp',
};

function bildFuerArtikel(artikelnummer) {
  if (!artikelnummer) return null;
  const teile = artikelnummer.split('-');
  if (teile.length < 2) return null;
  const schluessel = `${teile[0]}-${teile[1]}`;
  return ARTIKEL_BILDER[schluessel] || null;
}

export default function CartModal({ onClose }) {
  const { authFetch, email, apiBaseUrl } = useAuth();
  const [warenkorb, setWarenkorb] = useState([]);
  const [kollektionen, setKollektionen] = useState([]);
  const [aktiveKollektion, setAktiveKollektion] = useState(null);
  const [artikel, setArtikel] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function ladeWarenkorb() {
    if (!email) return;
    try {
      const res = await authFetch('/warenkorb');
      const data = await res.json();
      if (res.ok) setWarenkorb(data.warenkorb || []);
    } catch {
      setError('Warenkorb konnte nicht geladen werden.');
    }
  }

  async function ladeKollektionen() {
    try {
      const res = await fetch(`${apiBaseUrl}/kollektionen`);
      const data = await res.json();
      setKollektionen(data.kollektionen || []);
    } catch {
      setError('Kollektionen konnten nicht geladen werden.');
    }
  }

  async function ladeArtikel(kollektionName) {
    setAktiveKollektion(kollektionName);
    try {
      const res = await fetch(`${apiBaseUrl}/artikel/${encodeURIComponent(kollektionName)}`);
      const data = await res.json();
      setArtikel(data.kollektion_name || []);
    } catch {
      setError('Artikel konnten nicht geladen werden.');
    }
  }

  useEffect(() => {
    ladeKollektionen();
    ladeWarenkorb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    const badge = document.getElementById('cartCount');
    if (badge) {
      const gesamtMenge = warenkorb.reduce((summe, item) => summe + (item.menge || 0), 0);
      badge.textContent = gesamtMenge;
    }
  }, [warenkorb]);

  const gesamtsumme = warenkorb.reduce((summe, item) => summe + (item.zwischensumme || 0), 0);

  async function hinzufuegen(varianteId) {
    setLoading(true);
    setMessage('');
    try {
      const res = await authFetch('/warenkorb/artikel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produkt_variante_id: varianteId, menge: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Hinzufügen fehlgeschlagen');
      setMessage('Zum Warenkorb hinzugefügt!');
      ladeWarenkorb();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function entfernen(varianteId) {
    setLoading(true);
    try {
      const res = await authFetch(`/warenkorb/artikel/${varianteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Entfernen fehlgeschlagen');
      ladeWarenkorb();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkout() {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await authFetch('/warenkorb/checkout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Checkout fehlgeschlagen');
      setMessage(`Bestellung aufgegeben! (Bestell-ID: ${data.bestell_id})`);
      setWarenkorb([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!email) {
    return (
      <div className="modal-content glass-card spotlight-card" style={{ position: 'relative', zIndex: 100, maxWidth: '400px' }}>
        <button type="button" className="modal-close-btn magnetic-element" aria-label="Schließen" onClick={onClose}>✖</button>
        <h2 style={{ marginTop: 0 }}>Warenkorb</h2>
        <p>Bitte logge dich zuerst ein, um den Warenkorb zu nutzen.</p>
      </div>
    );
  }

  return (
    <div className="modal-content glass-card spotlight-card" style={{ position: 'relative', zIndex: 100, maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
      <button type="button" className="modal-close-btn magnetic-element" aria-label="Schließen" onClick={onClose}>✖</button>
      <h2 style={{ marginTop: 0 }}>Dein Warenkorb</h2>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}
      {message && <p style={{ color: '#27ae60' }}>{message}</p>}

      <div style={{ marginBottom: '1.5rem' }}>
        {warenkorb.length === 0 ? (
          <p>Dein Warenkorb ist leer.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {warenkorb.map((item, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  {bildFuerArtikel(item.artikelnummer) && (
                    <img
                      src={bildFuerArtikel(item.artikelnummer)}
                      alt={item.name}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.75 }}>
                      {[item.farbe, item.groesse].filter(Boolean).join(' · ')} · Menge: {item.menge}
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>{item.zwischensumme?.toFixed?.(2) ?? item.zwischensumme} €</div>
                  </div>
                </div>
                <button type="button" className="magnetic-element" onClick={() => entfernen(item.produkt_variante_id)} disabled={loading}>
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        )}
        {warenkorb.length > 0 && (
          <>
            <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', margin: '0.75rem 0' }}>
              Gesamtsumme: {gesamtsumme.toFixed(2)} €
            </div>
            <button type="button" className="btn magnetic-element clay-btn" onClick={checkout} disabled={loading}>
              Jetzt bestellen
            </button>
          </>
        )}
      </div>

      <h3>Produkte durchstöbern</h3>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {kollektionen.map((k) => (
          <button key={k.name || k.id || k} type="button" className="magnetic-element" onClick={() => ladeArtikel(k.slug || k.name || k)}>
            {k.name || k}
          </button>
        ))}
      </div>

      {aktiveKollektion && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {artikel.map((produkt, i) => (
            <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{produkt.name} {produkt.preis != null ? `– ${produkt.preis} €` : ''}</span>
              </div>
              {Array.isArray(produkt.varianten) && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {produkt.varianten.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className="magnetic-element"
                      onClick={() => hinzufuegen(v.id)}
                      disabled={loading}
                      style={{
                        padding: '0.35rem 0.7rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        border: '1px solid rgba(0,0,0,0.15)',
                        minWidth: '44px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      + {v.groesse?.code || ''} {v.farbe || ''}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
