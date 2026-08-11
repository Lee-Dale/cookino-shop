export default function SizePickerModal({ produkt, onSelect, onClose }) {
  return (
    <div className="modal-content glass-card spotlight-card" style={{ position: 'relative', zIndex: 100, maxWidth: '400px' }}>
      <button type="button" className="modal-close-btn magnetic-element" aria-label="Schließen" onClick={onClose}>✖</button>
      <h2 style={{ marginTop: 0 }}>Größe wählen</h2>
      <p>{produkt.name}</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(produkt.varianten || []).map((v) => (
          <button
            key={v.id}
            type="button"
            className="magnetic-element clay-btn"
            onClick={() => onSelect(v.id)}
            style={{
              padding: '0.9rem 1.4rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: '12px',
              minWidth: '80px',
            }}
          >
            {v.groesse?.code || ''} {v.farbe || ''}
          </button>
        ))}
      </div>
    </div>
  );
}
