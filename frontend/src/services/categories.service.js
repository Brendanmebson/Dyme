// src/services/categories.service.js
import api from './api.js';

export const categoriesService = {
  getAll: async (type) => {
    const { data } = await api.get('/categories', { params: type ? { type } : {} });
    return data.categories.map((c) => c.name); // return name strings to match existing UI
  },

  getAllFull: async () => {
    const { data } = await api.get('/categories');
    return data.categories;
  },

  create: async (category) => {
    const { data } = await api.post('/categories', category);
    return data.category;
  },

  delete: async (id) => {
    await api.delete(`/categories/${id}`);
  },
};
