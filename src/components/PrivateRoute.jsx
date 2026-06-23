import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verificarSesionAdmin } from '../firebase';

export default function PrivateRoute({ children }) {
  const [autenticado, setAutenticado] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = verificarSesionAdmin((tieneSesion) => {
      setAutenticado(tieneSesion);
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  // Verificar expiración (1 hora)
  const timestamp = parseInt(sessionStorage.getItem('adminTime') || '0');
  const isExpired = (Date.now() - timestamp) > 3600000;

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#f5ede0] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#c9a882] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!autenticado || !sessionStorage.getItem('adminAuth') || isExpired) {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminTime');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}