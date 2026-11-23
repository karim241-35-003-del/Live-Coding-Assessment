import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ADMIN } from '../data/mockData';

const AuthContext = createContext(null);

const STORAGE_KEY_AUTH = 'jamal_auth_session';
const STORAGE_KEY_REMEMBER = 'jamal_remember_email';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading auth from localStorage', e);
      return null;
    }
  });

  const [rememberedEmail, setRememberedEmail] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_REMEMBER) || '';
  });

  const [authError, setAuthError] = useState('');

  const login = (email, password, rememberMe = false) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanEmail === MOCK_ADMIN.email.toLowerCase() && cleanPass === MOCK_ADMIN.password) {
      const sessionUser = {
        email: MOCK_ADMIN.email,
        name: MOCK_ADMIN.name,
        role: MOCK_ADMIN.role,
        shopName: MOCK_ADMIN.shopName,
        loginTime: new Date().toISOString()
      };

      setUser(sessionUser);
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionUser));

      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY_REMEMBER, cleanEmail);
        setRememberedEmail(cleanEmail);
      } else {
        localStorage.removeItem(STORAGE_KEY_REMEMBER);
        setRememberedEmail('');
      }

      return { success: true };
    } else {
      const msg = 'Invalid credentials. Use admin@jamal.com and admin123';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    authError,
    setAuthError,
    rememberedEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
