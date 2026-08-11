import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

export default function LoginModal({ onClose }) {
  const { login, register, logout, email: loggedInEmail } = useAuth();
  const [mode, setMode] = useState('login');
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else {
        await register(vorname, nachname, email, password);
        setInfo('Registrierung erfolgreich! Du kannst dich jetzt einloggen.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loggedInEmail) {
    return (
      <div className="modal-content glass-card spotlight-card" style={{ position: 'relative', zIndex: 100, maxWidth: '400px' }}>
        <button type="button" className="modal-close-btn magnetic-element" aria-label="Schließen" onClick={onClose}>✖</button>
        <h2 style={{ marginTop: 0 }}>Angemeldet</h2>
        <p>Du bist eingeloggt als <strong>{loggedInEmail}</strong>.</p>
        <button type="button" className="btn magnetic-element clay-btn" onClick={() => { logout(); }}>
          Ausloggen
        </button>
      </div>
    );
  }

  return (
    <div className="modal-content glass-card spotlight-card" style={{ position: 'relative', zIndex: 100, maxWidth: '400px' }}>
      <button type="button" className="modal-close-btn magnetic-element" aria-label="Schließen" onClick={onClose}>✖</button>
      <h2 style={{ marginTop: 0 }}>{mode === 'login' ? 'Login' : 'Registrieren'}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mode === 'register' && (
          <>
            <input type="text" placeholder="Vorname" value={vorname} onChange={(e) => setVorname(e.target.value)} required />
            <input type="text" placeholder="Nachname" value={nachname} onChange={(e) => setNachname(e.target.value)} required />
          </>
        )}
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />

        {error && <p style={{ color: '#c0392b' }}>{error}</p>}
        {info && <p style={{ color: '#27ae60' }}>{info}</p>}

        <button type="submit" className="btn magnetic-element clay-btn" disabled={loading}>
          {loading ? 'Bitte warten...' : mode === 'login' ? 'Einloggen' : 'Registrieren'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        {mode === 'login' ? (
          <>Noch kein Konto?{' '}
            <button type="button" className="link-btn" onClick={() => { setMode('register'); setError(''); }}>
              Jetzt registrieren
            </button>
          </>
        ) : (
          <>Schon ein Konto?{' '}
            <button type="button" className="link-btn" onClick={() => { setMode('login'); setError(''); }}>
              Zum Login
            </button>
          </>
        )}
      </p>
    </div>
  );
}
