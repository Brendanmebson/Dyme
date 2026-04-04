// src/services/notifications.service.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const notificationsService = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/notifications`, { withCredentials: true });
    return res.data;
  },
  sync: async () => {
    const res = await axios.post(`${API_URL}/notifications/sync`, {}, { withCredentials: true });
    return res.data;
  },
  update: async (id, status) => {
    const res = await axios.patch(`${API_URL}/notifications/${id}`, { status }, { withCredentials: true });
    return res.data;
  },
  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/notifications/${id}`, { withCredentials: true });
    return res.data;
  }
};
