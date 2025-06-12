import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (e) {
        setUsername(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('accessToken', token);
    const decoded = jwtDecode(token);
    setUsername(decoded.username);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
