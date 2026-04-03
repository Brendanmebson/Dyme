// src/services/auth.service.js
import api from './api.js';

const AUTH_BASE = '/auth';

export const authService = {
  register: async ({ full_name, email, password }) => {
    const { data } = await api.post(`${AUTH_BASE}/register`, {
      full_name,
      email,
      password,
    });

    localStorage.setItem('accessToken', data.session.access_token);
    return data.user;
  },

  login: async ({ email, password }) => {
    const { data } = await api.post(`${AUTH_BASE}/login`, {
      email,
      password,
    });

    localStorage.setItem('accessToken', data.session.access_token);
    return data.user;
  },

  logout: async () => {
    await api.post(`${AUTH_BASE}/logout`);
    localStorage.removeItem('accessToken');
  },

  getMe: async () => {
    const { data } = await api.get(`${AUTH_BASE}/me`);
    return data.user;
  },

  updateMe: async (updates) => {
    const { data } = await api.patch(`${AUTH_BASE}/me`, updates);
    return data.user;
  },

  changePassword: async (new_password) => {
    await api.post(`${AUTH_BASE}/change-password`, { new_password });
    localStorage.removeItem('accessToken');
  },
};