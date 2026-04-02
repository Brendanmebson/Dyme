// src/services/banking.service.js
import api from './api.js';

const BASE = '/banking';

export const bankingService = {
  // Get current bank connection status
  getStatus: async () => {
    const { data } = await api.get(`${BASE}/status`);
    return data;
  },

  // ── GoCardless (EU/UK/Free) ────────────────────────────────────
  gocardlessCreateLink: async (institution_id) => {
    const { data } = await api.post(`${BASE}/gocardless/create-link`, {
      institution_id,
      redirect_url: window.location.origin + '/onboarding',
    });
    return data.link;
  },

  gocardlessConfirm: async (requisition_id) => {
    const { data } = await api.post(`${BASE}/gocardless/confirm-link`, { requisition_id });
    return data;
  },

  gocardlessSync: async () => {
    const { data } = await api.post(`${BASE}/gocardless/sync`);
    return data;
  },

  // ── Manual CSV Upload (Nigerian/African Banks) ─────────────────
  uploadCSV: async (file, currency = 'USD') => {
    const formData = new FormData();
    formData.append('statement', file);
    formData.append('currency', currency);
    const { data } = await api.post(`${BASE}/upload-csv`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
