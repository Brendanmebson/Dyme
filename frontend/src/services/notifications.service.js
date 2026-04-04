// src/services/notifications.service.js
import api from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const notificationsService = {
  getAll: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  sync: async () => {
    const res = await api.post('/notifications/sync');
    return res.data;
  },
  update: async (id, status) => {
    const res = await api.patch(`/notifications/${id}`, { status });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  }
};
