import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('foodhub_token') || null);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Session restore failed', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: loggedUser } = res.data;
    localStorage.setItem('foodhub_token', access_token);
    setToken(access_token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { access_token, user: registeredUser } = res.data;
    localStorage.setItem('foodhub_token', access_token);
    setToken(access_token);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('foodhub_token');
    setToken(null);
    setUser(null);
  };

  // One-click demo role switcher for quick review and testing
  const quickLoginAs = async (role) => {
    const credentials = {
      customer: { email: 'customer@foodhub.com', password: 'password123' },
      restaurant: { email: 'chef@delhidarbar.com', password: 'password123' },
      admin: { email: 'admin@foodhub.com', password: 'password123' },
    };

    if (credentials[role]) {
      return await login(credentials[role].email, credentials[role].password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        role: user?.role || 'guest',
        login,
        register,
        logout,
        quickLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
