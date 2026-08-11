import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './components/AuthContext.jsx';
import './style.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
