import api from './api.js';

const BASE_URL = '/schedules';

export const schedulesService = {
  getAll: async () => {
    const { data } = await api.get(BASE_URL);
    return data.schedules;
  },

  create: async (payload) => {
    const { data } = await api.post(BASE_URL, payload);
    return data.schedule;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`${BASE_URL}/${id}`, payload);
    return data.schedule;
  },

  delete: async (id) => {
    const { data } = await api.delete(`${BASE_URL}/${id}`);
    return data;
  }
};
