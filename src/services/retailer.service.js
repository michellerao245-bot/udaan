// ==================== RETAILER SERVICE ====================
import api from './api';

export const retailerService = {
  // My retailers (salesman's retailers)
  getAll: (params) => api.get('/retailers', { params }),

  // Single retailer
  getOne: (id) => api.get(`/retailers/${id}`),

  // Add new retailer (with GPS location)
  create: (data) => api.post('/retailers', data),

  // Update retailer
  update: (id, data) => api.put(`/retailers/${id}`, data),

  // Stats
  getStats: () => api.get('/retailers/stats'),
};

export default retailerService;