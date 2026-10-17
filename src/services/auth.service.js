// ==================== AUTH SERVICE ====================
import api from './api';

export const authService = {
  // Salesman login
  login: (userId, password) =>
    api.post('/auth/user/login', { userId, password }),

  // Current user info
  getMe: () => api.get('/auth/me'),

  // Logout
  logout: () => {
    localStorage.removeItem('udaan_token');
    localStorage.removeItem('udaan_user');
  },
};

export default authService;