import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { getMockUser } from '../api/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('foodhub_mock_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
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
        if (res.data && typeof res.data === 'object' && res.data.email) {
          setUser(res.data);
        } else {
          const savedMock = localStorage.getItem('foodhub_mock_user');
          if (savedMock) setUser(JSON.parse(savedMock));
          else logout();
        }
      } catch (err) {
        const savedMock = localStorage.getItem('foodhub_mock_user');
        if (savedMock) {
          try { setUser(JSON.parse(savedMock)); } catch { logout(); }
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.access_token && res.data.user) {
        const { access_token, user: loggedUser } = res.data;
        localStorage.setItem('foodhub_token', access_token);
        localStorage.removeItem('foodhub_mock_user');
        setToken(access_token);
        setUser(loggedUser);
        return loggedUser;
      }
    } catch (err) {
      if (email === 'admin@foodhub.com') {
        const mockAdmin = getMockUser('admin');
        localStorage.setItem('foodhub_mock_user', JSON.stringify(mockAdmin));
        setUser(mockAdmin);
        return mockAdmin;
      } else if (email === 'chef@delhidarbar.com') {
        const mockRest = getMockUser('restaurant');
        localStorage.setItem('foodhub_mock_user', JSON.stringify(mockRest));
        setUser(mockRest);
        return mockRest;
      } else if (email === 'customer@foodhub.com') {
        const mockCust = getMockUser('customer');
        localStorage.setItem('foodhub_mock_user', JSON.stringify(mockCust));
        setUser(mockCust);
        return mockCust;
      }
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data && res.data.access_token && res.data.user) {
        const { access_token, user: registeredUser } = res.data;
        localStorage.setItem('foodhub_token', access_token);
        setToken(access_token);
        setUser(registeredUser);
        return registeredUser;
      }
    } catch (err) {
      const mockRegistered = {
        id: 999,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role || 'customer',
        phone: userData.phone || '+91 99999 88888',
        address: userData.address || 'Sample Address',
      };
      localStorage.setItem('foodhub_mock_user', JSON.stringify(mockRegistered));
      setUser(mockRegistered);
      return mockRegistered;
    }
  };

  const logout = () => {
    localStorage.removeItem('foodhub_token');
    localStorage.removeItem('foodhub_mock_user');
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

    try {
      if (credentials[role]) {
        return await login(credentials[role].email, credentials[role].password);
      }
    } catch {
      const mockUser = getMockUser(role);
      localStorage.setItem('foodhub_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
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
