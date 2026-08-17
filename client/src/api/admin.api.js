import { apiRequest } from './client.js';
import { toQueryString } from '../utils/queryString.js';

export const adminApi = {
  listUsers: () => apiRequest('/admin/users'),
  createUser: (payload) => apiRequest('/admin/users', { method: 'POST', body: payload }),
  updateUser: (id, payload) => apiRequest(`/admin/users/${id}`, { method: 'PATCH', body: payload }),
  removeUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
  listItems: (params) => apiRequest(`/admin/items${toQueryString(params)}`),
  stats: () => apiRequest('/admin/stats')
};
