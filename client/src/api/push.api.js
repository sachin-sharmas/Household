import { apiRequest } from './client.js';

export const pushApi = {
  publicKey: () => apiRequest('/push/public-key'),
  subscribe: (subscription) => apiRequest('/push/subscribe', { method: 'POST', body: subscription }),
  unsubscribe: (endpoint) => apiRequest('/push/unsubscribe', { method: 'POST', body: { endpoint } })
};
