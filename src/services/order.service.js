// ==================== ORDER SERVICE ====================
import api from './api';

export const orderService = {
  // My orders (salesman's orders)
  getMyOrders: (params) => api.get('/orders', { params }),

  // Order stats
  getStats: () => api.get('/orders/stats'),

  // Create new order
  create: (data) => api.post('/orders', data),

  // Single order
  getOne: (id) => api.get(`/orders/${id}`),
};

export default orderService;