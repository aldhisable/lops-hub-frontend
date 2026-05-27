import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: AuthUser }>('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; role: string; regional?: string }) =>
    api.post<{ token: string; user: AuthUser }>('/auth/register', data),
  me: () => api.get<AuthUser>('/auth/me'),
};

// UMKM
export const umkmApi = {
  list: (params?: Record<string, string | number>) => api.get('/umkm', { params }),
  get: (id: string) => api.get(`/umkm/${id}`),
  create: (data: Record<string, unknown>) => api.post('/umkm', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/umkm/${id}`, data),
  delete: (id: string) => api.delete(`/umkm/${id}`),
  products: (umkmId: string) => api.get(`/umkm/${umkmId}/products`),
};

// Programs
export const programsApi = {
  list: () => api.get('/programs'),
  get: (id: string) => api.get(`/programs/${id}`),
  join: (umkmId: string, programId: string) => api.post('/programs/join', { umkmId, programId }),
};

// Analytics
export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),
  regional: (regional: string) => api.get(`/analytics/regional/${encodeURIComponent(regional)}`),
  workspace: () => api.get('/analytics/workspace'),
  revenueTrend: (year?: number, province?: string) =>
    api.get('/analytics/revenue-trend', { params: { year, province } }),
  addFinancial: (data: Record<string, unknown>) => api.post('/analytics/financial', data),
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN_PUSAT' | 'ADMIN_REGIONAL' | 'UMKM';
  regional?: string | null;
}
