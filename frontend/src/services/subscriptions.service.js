import api from './api.js';

const BASE_URL = '/subscriptions';

export const subscriptionsService = {
  getAll: async () => {
    const { data } = await api.get(BASE_URL);
    return data.subscriptions;
  },

  create: async (payload) => {
    const { data } = await api.post(BASE_URL, payload);
    return data.subscription;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`${BASE_URL}/${id}`, payload);
    return data.subscription;
  },

  delete: async (id) => {
    const { data } = await api.delete(`${BASE_URL}/${id}`);
    return data;
  }
};
