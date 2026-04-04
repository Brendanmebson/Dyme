import api from './api.js';

const BASE_URL = '/loans';

export const loansService = {
  getAll: async () => {
    const { data } = await api.get(BASE_URL);
    return data.loans;
  },

  create: async (payload) => {
    const { data } = await api.post(BASE_URL, payload);
    return data.loan;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`${BASE_URL}/${id}`, payload);
    return data.loan;
  },

  delete: async (id) => {
    const { data } = await api.delete(`${BASE_URL}/${id}`);
    return data;
  }
};
