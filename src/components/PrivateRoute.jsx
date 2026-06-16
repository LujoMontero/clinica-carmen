import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const isAuth = sessionStorage.getItem('adminAuth') === 'true';
  
  return isAuth ? children : <Navigate to="/admin/login" replace />;
}