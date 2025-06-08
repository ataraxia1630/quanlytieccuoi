import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('accessToken');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('accessToken');
    return <Navigate to="/login" replace />;
  }

  return children;
}
