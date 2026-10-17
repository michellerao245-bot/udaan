// ==================== API CLIENT ====================
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://udaanbackend-z5tw.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('udaan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('udaan_token');
      localStorage.removeItem('udaan_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;