import { apiRequest } from './client.js';

export const authApi = {
  me: () => apiRequest('/auth/me'),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  forgotPassword: (payload) => apiRequest('/auth/forgot-password', { method: 'POST', body: payload }),
  resetPassword: (payload) => apiRequest('/auth/reset-password', { method: 'POST', body: payload })
};
