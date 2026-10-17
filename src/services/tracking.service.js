// ==================== TRACKING SERVICE ====================
import api from './api';

export const trackingService = {
  // Update current location
  updateLocation: (data) => api.post('/tracking/location', data),

  // Get location history
  getHistory: (params) => api.get('/tracking/history', { params }),

  // Get live location (for admin)
  getLive: () => api.get('/tracking/live'),
};

export default trackingService;