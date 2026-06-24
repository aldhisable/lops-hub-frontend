// Kategori usaha UMKM — sumber tunggal yang dipakai di seluruh LOPs Hub
export const UMKM_CATEGORIES = ['Food & Beverage', 'Fashion', 'Craft'] as const;

export type UmkmCategory = (typeof UMKM_CATEGORIES)[number];

// Jenis dokumen UMKM — sumber tunggal untuk form upload (UMK) & filter (admin)
export const DOCUMENT_TYPES = [
  'NIB (Nomor Induk Berusaha)', 'NPWP Usaha', 'SIUP / Izin Usaha',
  'Sertifikat Halal MUI', 'BPOM MD Registration', 'Sertifikat SNI',
  'Laporan Keuangan', 'Sertifikat Pelatihan', 'Dokumen Legalitas Lainnya',
] as const;
