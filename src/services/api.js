import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
};

export const itemsAPI = {
  createItem: (itemData) => api.post('/items/create', itemData),
  createBulkItems: (bulkData) => api.post('/items/bulk', bulkData),
  getMyItems: () => api.get('/items/my/items'),
  getCompanyItems: (companyId) => api.get(`/items/company/${companyId}`),
  getItemBySerial: (serial) => api.get(`/items/${serial}`),
  assignItem: (data) => api.post('/items/assign', data),
};

export const companyAPI = {
  createCompany: (companyData) => api.post('/companies', companyData),
  getAllCompanies: () => api.get('/companies'),
  getCompanyById: (id) => api.get(`/companies/${id}`),
  createCompanyUser: (companyId, userData) => api.post(`/companies/${companyId}/users`, userData),
};

export const adminAPI = {
  getUsers: () => api.get('/auth/users'),
};

export default api;