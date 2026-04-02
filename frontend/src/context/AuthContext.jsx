// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { authService } from '../services/auth.service.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // On mount — try to rehydrate session from the access token + /me
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    authService.getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('accessToken'))
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async ({ full_name, email, password }) => {
    setLoading(true);
    setError('');
    try {
      const user = await authService.register({ full_name, email, password });
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const user = await authService.login({ email, password });
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Invalid email or password';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const [localAvatar, setLocalAvatarState] = useState(localStorage.getItem('dyme_avatar'));

  const setLocalAvatar = useCallback((url) => {
    setLocalAvatarState(url);
    if (url) localStorage.setItem('dyme_avatar', url);
    else localStorage.removeItem('dyme_avatar');
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (updates.avatar_url) {
      setLocalAvatar(updates.avatar_url);
    }
    try {
      const updated = await authService.updateMe(updates);
      setUser(prev => ({ ...prev, ...updated, ...updates, user_metadata: { ...(prev?.user_metadata || {}), ...updates } }));
      return updated;
    } catch(err) {
      setUser(prev => ({ ...prev, ...updates, user_metadata: { ...(prev?.user_metadata || {}), ...updates } }));
      throw err;
    }
  }, [setLocalAvatar]);


  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, updateProfile, localAvatar, setLocalAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
