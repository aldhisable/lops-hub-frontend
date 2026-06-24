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
  register: (data: { name: string; email: string; password: string; role: string; regional?: string; umkmName?: string; category?: string }) =>
    api.post<{ token: string; user: AuthUser }>('/auth/register', data),
  me: () => api.get<AuthUser>('/auth/me'),
};

// UMKM
export const umkmApi = {
  list: (params?: Record<string, string | number | undefined>) => api.get('/umkm', { params }),
  filterOptions: () => api.get<{
    categories: string[];
    provinces: string[];
    programs: Array<{ id: string; name: string }>;
    docTypes: string[];
  }>('/umkm/filter-options'),
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
  create: (data: { name: string; description?: string; startDate: string; endDate: string; status?: string }) =>
    api.post('/programs', data),
  update: (id: string, data: { name?: string; description?: string; startDate?: string; endDate?: string; status?: string }) =>
    api.put(`/programs/${id}`, data),
  delete: (id: string) => api.delete(`/programs/${id}`),
  join: (umkmId: string, programId: string) => api.post('/programs/join', { umkmId, programId }),
  updateParticipantStatus: (participantId: string, status: 'REGISTERED' | 'REJECTED') =>
    api.patch(`/programs/participants/${participantId}/status`, { status }),
};

// Documents
export const documentsApi = {
  list: () => api.get('/documents'),
  getCloudinarySign: () => api.get<{
    timestamp: number; signature: string; apiKey: string; cloudName: string; folder: string;
  }>('/documents/cloudinary-sign'),
  create: (data: { name: string; type: string; fileUrl: string; publicId?: string; fileType: string }) =>
    api.post('/documents', data),
  file: (id: string, download = false) =>
    api.get<Blob>(`/documents/${id}/file`, {
      params: download ? { download: '1' } : undefined,
      responseType: 'blob',
    }),
  updateStatus: (id: string, status: string) => api.patch(`/documents/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

export async function openDocumentFile(
  doc: { id: string; name: string; fileType?: string },
  download = false
): Promise<void> {
  const popup = !download && typeof window !== 'undefined' ? window.open('', '_blank') : null;

  try {
    const res = await documentsApi.file(doc.id, download);
    const contentType = typeof res.headers['content-type'] === 'string'
      ? res.headers['content-type']
      : 'application/octet-stream';
    const blob = res.data instanceof Blob
      ? res.data
      : new Blob([res.data], { type: contentType });
    const objectUrl = URL.createObjectURL(blob);

    if (download) {
      const ext = doc.fileType?.toLowerCase() === 'pdf' && !doc.name.toLowerCase().endsWith('.pdf') ? '.pdf' : '';
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${doc.name}${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else if (popup) {
      popup.location.href = objectUrl;
    } else {
      window.open(objectUrl, '_blank', 'noopener,noreferrer');
    }

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  } catch (err) {
    popup?.close();
    throw err;
  }
}

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

// Assessment (5S indicator data input by UMKM)
export const assessmentApi = {
  getMe: () => api.get('/umkm/me/assessment'),
  upsertMe: (data: {
    employeeCount?: number | null;
    technologyLevel?: string | null;
    legalStatus?: string | null;
    marketReach?: string | null;
    exhibitionScale?: string | null;
    supplierStatus?: string | null;
    assetGrowthMillion?: number | null;
  }) => api.put('/umkm/me/assessment', data),
  getByUmkm: (id: string) => api.get(`/umkm/${id}/assessment`),
};

// Analytics
export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),
  regional: (regional: string) => api.get(`/analytics/regional/${encodeURIComponent(regional)}`),
  workspace: () => api.get('/analytics/workspace'),
  workspace5S: () => api.get('/analytics/workspace/5s'),
  aggregate5S: () => api.get('/analytics/5s-aggregate'),
  perUmkm5S: () => api.get('/analytics/5s-per-umkm'),
  umkm5S: (umkmId: string) => api.get(`/analytics/5s/${umkmId}`),
  revenueTrend: (year?: number, province?: string) =>
    api.get('/analytics/revenue-trend', { params: { year, province } }),
  addFinancial: (data: Record<string, unknown>) => api.post('/analytics/financial', data),
  mapData: (params?: { classification?: string; program?: string }) =>
    api.get<{
      byCity: Array<{ city: string; province: string; count: number }>;
      byProvince: Array<{ province: string; count: number }>;
    }>('/analytics/map', { params }),
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN_PUSAT' | 'ADMIN_REGIONAL' | 'UMKM';
  regional?: string | null;
}
