import { createContext, useContext, useState, useCallback } from 'react';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cookino_token'));
  const [email, setEmail] = useState(() => localStorage.getItem('cookino_email'));

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${apiBaseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Login fehlgeschlagen');
    }
    localStorage.setItem('cookino_token', data.access_token);
    localStorage.setItem('cookino_email', email);
    setToken(data.access_token);
    setEmail(email);
    return data;
  }, []);

  const register = useCallback(async (vorname, nachname, email, password) => {
    const res = await fetch(`${apiBaseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vorname, nachname, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Registrierung fehlgeschlagen');
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cookino_token');
    localStorage.removeItem('cookino_email');
    setToken(null);
    setEmail(null);
  }, []);

  const authFetch = useCallback((path, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${localStorage.getItem('cookino_token')}`,
    };
    return fetch(`${apiBaseUrl}${path}`, { ...options, headers });
  }, []);

  return (
    <AuthContext.Provider value={{ token, email, login, register, logout, authFetch, apiBaseUrl }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  return ctx;
}
