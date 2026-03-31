// src/services/budgets.service.js
import api from './api.js';

export const budgetsService = {
  getAll: async () => {
    const { data } = await api.get('/budgets');
    return data.budgets; // already shaped: { id, category, limit, spent, period }
  },

  create: async (budget) => {
    const { data } = await api.post('/budgets', {
      category:     budget.category,
      limit_amount: budget.limit,
      period:       budget.period || 'monthly',
    });
    return data.budget;
  },

  update: async (id, updates) => {
    const { data } = await api.patch(`/budgets/${id}`, updates);
    return data.budget;
  },

  delete: async (id) => {
    await api.delete(`/budgets/${id}`);
  },
};
