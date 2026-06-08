import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import wsService from '../services/websocket';

const AuthContext = createContext(null);

/**
 * Authentication Context Provider.
 * 
 * Manages JWT token, user state, and provides login/register/logout.
 * Wraps the entire app so any component can access auth state.
 * 
 * Stored in localStorage for persistence across page refreshes:
 *   - token: JWT access token
 *   - user: { name, email, role }
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Connect WebSocket with saved token
        wsService.connect(savedToken);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token: jwt, name, role } = response.data;
    const userData = { name, email, role };

    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);

    // Connect WebSocket with new token
    wsService.connect(jwt);

    return userData;
  }, []);

  const register = useCallback(async (name, email, password, phone, role = 'PASSENGER') => {
    const response = await authAPI.register({ name, email, password, phone, role });
    const { token: jwt, name: userName, role: userRole } = response.data;
    const userData = { name: userName, email, role: userRole };

    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);

    wsService.connect(jwt);

    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    wsService.disconnect();
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    isDriver: user?.role === 'DRIVER',
    isPassenger: user?.role === 'PASSENGER',
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication state and actions.
 * 
 * Usage:
 *   const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
