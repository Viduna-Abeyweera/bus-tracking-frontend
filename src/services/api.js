import axios from 'axios';

/**
 * Axios instance configured with the backend base URL and JWT interceptor.
 * 
 * All API calls should use this instance to ensure:
 * - Consistent base URL
 * - Automatic JWT token injection
 * - 401 redirect to login
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ===== AUTH API =====
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ===== ROUTES API =====
export const routesAPI = {
  getAll: () => api.get('/routes'),
  getActive: () => api.get('/routes/active'),
  getById: (id) => api.get(`/routes/${id}`),
  getByNumber: (num) => api.get(`/routes/number/${num}`),
  search: (query) => api.get(`/routes/search?query=${query}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`),
};

// ===== BUSES API =====
export const busesAPI = {
  getAll: () => api.get('/buses'),
  getById: (id) => api.get(`/buses/${id}`),
  getByRoute: (routeId) => api.get(`/buses/route/${routeId}`),
  create: (data) => api.post('/buses', data),
  update: (id, data) => api.put(`/buses/${id}`, data),
  updateStatus: (id, status) => api.patch(`/buses/${id}/status?status=${status}`),
  delete: (id) => api.delete(`/buses/${id}`),
};

// ===== SCHEDULES API =====
export const schedulesAPI = {
  getByRoute: (routeId) => api.get(`/schedules/route/${routeId}`),
  getByRouteAndDay: (routeId, day) => api.get(`/schedules/route/${routeId}/day/${day}`),
  getByBus: (busId) => api.get(`/schedules/bus/${busId}`),
  create: (data) => api.post('/schedules', data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

// ===== BUS LOCATIONS API =====
export const locationsAPI = {
  getLatest: () => api.get('/bus-locations/latest'),
  getAll: () => api.get('/bus-locations'),
  getByBusId: (busId) => api.get(`/bus-locations/bus/${busId}`),
  save: (data) => api.post('/bus-locations', data),
};

// ===== BUS STOPS API =====
export const stopsAPI = {
  getAll: () => api.get('/bus-stops'),
  getById: (id) => api.get(`/bus-stops/${id}`),
  getETA: (stopId) => api.get(`/bus-stops/${stopId}/eta`),
  getNearby: (lat, lon, radiusKm) => api.get(`/bus-stops/nearby?latitude=${lat}&longitude=${lon}&radiusKm=${radiusKm}`),
  create: (data) => api.post('/bus-stops', data),
  update: (id, data) => api.put(`/bus-stops/${id}`, data),
  delete: (id) => api.delete(`/bus-stops/${id}`),
};

export default api;
