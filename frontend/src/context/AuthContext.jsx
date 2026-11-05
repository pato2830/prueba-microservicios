import { createContext, useContext, useState } from 'react';
import { login as loginService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!savedUser || !token) return null;

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const login = async (email, password) => {
    const response = await loginService(email, password);

    if (response.success && response.data && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      setUser(response.data);

      return response.data;
    }

    throw new Error(response.message || 'No se pudo iniciar sesión');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user && !!localStorage.getItem('token'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}