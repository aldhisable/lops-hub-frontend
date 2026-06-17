// Kategori usaha UMKM — sumber tunggal yang dipakai di seluruh LOPs Hub
export const UMKM_CATEGORIES = ['Food & Beverage', 'Fashion', 'Craft'] as const;

export type UmkmCategory = (typeof UMKM_CATEGORIES)[number];
