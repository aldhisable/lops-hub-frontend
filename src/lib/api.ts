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
  me: () => api.get('/umkm/me'),
  updateMe: (data: Record<string, unknown>) => api.put('/umkm/me', data),
  get: (id: string) => api.get(`/umkm/${id}`),
  create: (data: Record<string, unknown>) => api.post('/umkm', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/umkm/${id}`, data),
  delete: (id: string) => api.delete(`/umkm/${id}`),
  archive: (id: string) => api.put(`/umkm/${id}`, { status: 'INACTIVE' }),
  products: (umkmId: string) => api.get(`/umkm/${umkmId}/products`),
  createProduct: (umkmId: string, data: Record<string, unknown>) => api.post(`/umkm/${umkmId}/products`, data),
  updateProduct: (umkmId: string, productId: string, data: Record<string, unknown>) =>
    api.put(`/umkm/${umkmId}/products/${productId}`, data),
  deleteProduct: (umkmId: string, productId: string) =>
    api.delete(`/umkm/${umkmId}/products/${productId}`),
  // Upload foto langsung ke Cloudinary (tanpa proxy backend)
  uploadProductImage: async (umkmId: string, file: File): Promise<string> => {
    const { data: sign } = await api.get<{
      timestamp: number; signature: string; apiKey: string; cloudName: string; folder: string;
    }>(`/umkm/${umkmId}/products/cloudinary-sign`);

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sign.apiKey);
    form.append('timestamp', String(sign.timestamp));
    form.append('signature', sign.signature);
    form.append('folder', sign.folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
      { method: 'POST', body: form }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message ?? 'Cloudinary upload failed');
    return data.secure_url as string;
  },
};

// Programs
export const programsApi = {
  list: () => api.get('/programs'),
  get: (id: string) => api.get(`/programs/${id}`),
  join: (umkmId: string, programId: string) => api.post('/programs/join', { umkmId, programId }),
};

// Documents
export const documentsApi = {
  list: () => api.get('/documents'),
  getCloudinarySign: () => api.get<{
    timestamp: number; signature: string; apiKey: string; cloudName: string; folder: string;
  }>('/documents/cloudinary-sign'),
  create: (data: { name: string; type: string; fileUrl: string; publicId?: string; fileType: string }) =>
    api.post('/documents', data),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

// LOPs Sales (penjualan konsinyasi gerai)
export const lopsSalesApi = {
  getByUmkm: (umkmId: string, year?: number) =>
    api.get(`/lops-sales/${umkmId}`, { params: year ? { year } : {} }),
  upsert: (umkmId: string, data: { month: number; year: number; amount: number; gerai?: string; notes?: string }) =>
    api.post(`/lops-sales/${umkmId}`, data),
  delete: (umkmId: string, month: number, year: number) =>
    api.delete(`/lops-sales/${umkmId}/${month}/${year}`),
};

// Financial (omzet umum self-report UMKM)
export const financialApi = {
  getMe: () => api.get('/financial/me'),
  upsertMe: (data: { month: number; year: number; revenue: number; profit?: number }) =>
    api.post('/financial/me', data),
  getByUmkm: (umkmId: string) => api.get(`/financial/${umkmId}`),
  upsertByUmkm: (umkmId: string, data: { month: number; year: number; revenue: number; profit?: number }) =>
    api.post(`/financial/${umkmId}`, data),
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
