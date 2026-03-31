// src/services/transactions.service.js
import api from './api.js';

export const transactionsService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/transactions', { params });
    return data; // { transactions, pagination }
  },

  create: async (transaction) => {
    const { data } = await api.post('/transactions', transaction);
    return data.transaction;
  },

  update: async (id, updates) => {
    const { data } = await api.patch(`/transactions/${id}`, updates);
    return data.transaction;
  },

  delete: async (id) => {
    await api.delete(`/transactions/${id}`);
  },

  getMonthlySummary: async (months = 6) => {
    const { data } = await api.get('/transactions/summary/monthly', { params: { months } });
    return data.summary;
  },

  getCategorySummary: async (from, to) => {
    const { data } = await api.get('/transactions/summary/categories', {
      params: { from, to },
    });
    return data.categories;
  },
};
