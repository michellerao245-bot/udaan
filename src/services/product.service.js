// ==================== PRODUCT SERVICE ====================
import api from './api';

export const productService = {
  // Products list
  getAll: (params) => api.get('/products', { params }),

  // Single product
  getOne: (id) => api.get(`/products/${id}`),

  // Categories
  getCategories: () => api.get('/products/categories'),

  // Search
  search: (q) => api.get('/products/search', { params: { q } }),
};

export default productService;