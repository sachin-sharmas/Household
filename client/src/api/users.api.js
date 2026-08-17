import { apiRequest } from './client.js';

export const usersApi = {
  list: () => apiRequest('/users')
};
