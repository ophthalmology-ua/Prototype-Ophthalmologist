import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function validateEmail(email: string) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Login = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      setShowToast(true);
      return;
    }
    if (!validateEmail(email)) {
      setError('El formato del email es inválido.');
      setShowToast(true);
      return;
    }
    setError('');
    setShowToast(false);
    setLoading(true);
    // Simulate async login
    await new Promise(res => setTimeout(res, 1200));
    setLoading(false);
    // In a real app, redirect or set auth state here
    setError('¡Login exitoso! (Prototipo)');
    setShowToast(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 relative overflow-hidden px-4">
      {/* Decorative background shape */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-2xl z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-2xl z-0" />
      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl px-4 py-8 sm:px-8 sm:py-10 flex flex-col items-center mx-4 sm:mx-0">
        {/* Logo and app name */}
        <div className="flex flex-col items-center mb-6">
          <Eye className="w-10 h-10 text-blue-600 mb-2" />
          <span className="font-extrabold text-xl tracking-tight text-blue-700">{t('appName')}</span>
        </div>
        {/* Welcome message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Bienvenido</h2>
        <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">Inicia sesión para continuar con tu gestión oftalmológica.</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-1 text-base font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-100 text-base transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              autoComplete="username"
              placeholder="ejemplo@correo.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 text-base font-medium">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-100 text-base transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-base shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''} mt-2`}
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
        {/* Toast */}
        {showToast && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg transition-all duration-300 text-sm sm:text-base ${error.includes('exitoso') ? 'bg-green-500' : 'bg-red-500'}`}
            onAnimationEnd={() => {
              if (error.includes('exitoso')) setShowToast(false);
            }}
          >
            {error}
            <button
              className="ml-2 sm:ml-4 text-white font-bold"
              onClick={() => setShowToast(false)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        )}
        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400 text-center w-full">
          &copy; {new Date().getFullYear()} {t('appName')}. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login; 