import { apiRequest } from './client.js';
import { toQueryString } from '../utils/queryString.js';

export const itemsApi = {
  list: (params) => apiRequest(`/items${toQueryString(params)}`),
  stats: (scope) => apiRequest(`/items/stats${toQueryString({ scope })}`),
  create: (payload) => apiRequest('/items', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/items/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/items/${id}`, { method: 'DELETE' })
};
