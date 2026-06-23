import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdminAnonimo } from '../firebase';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!password.trim()) {
      setError('Ingrese la contraseña');
      return;
    }

    setCargando(true);
    setError('');

    // 1. Validar contraseña
    if (password !== ADMIN_PASSWORD) {
      setError('Contraseña incorrecta');
      setCargando(false);
      return;
    }

    // 2. Autenticar anónimamente en Firebase
    const resultado = await loginAdminAnonimo();
    
    if (!resultado.success) {
      setError('Error de autenticación. Intente nuevamente.');
      setCargando(false);
      return;
    }

    // 3. Guardar sesión
    sessionStorage.setItem('adminAuth', 'true');
    sessionStorage.setItem('adminTime', Date.now().toString());
    
    setCargando(false);
    navigate('/admin');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen bg-[#f5ede0] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-[#4a3728]">Dra. Carmen Montero</h1>
          <p className="text-sm text-[#7a6152] mt-1">Panel de administración</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#7a6152] block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c9a882] focus:ring-2 focus:ring-[#c9a882]/20"
              placeholder="••••••"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          <button
            onClick={handleLogin}
            disabled={cargando}
            className="w-full bg-[#4a3728] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#3a2a1e] transition-all disabled:opacity-50"
          >
            {cargando ? 'Verificando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}