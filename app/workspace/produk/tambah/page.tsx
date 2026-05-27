"use client";
import React, { useState } from 'react';
import { Save, Upload, ArrowLeft, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/context/workspace-context';
import { umkmApi } from '@/lib/api';

// Sub-kategori produk berdasarkan jenis usaha UMKM
const PRODUCT_CATEGORIES: Record<string, string[]> = {
  'Makanan & Minuman': [
    'Makanan Kering', 'Frozen Food', 'Camilan', 'Bumbu & Rempah',
    'Minuman', 'Kue & Roti', 'Olahan Susu', 'Makanan Segar', 'Lainnya',
  ],
  'Fashion & Tekstil': [
    'Pakaian Wanita', 'Pakaian Pria', 'Pakaian Anak', 'Baju Muslim',
    'Batik', 'Aksesoris Fashion', 'Tas & Dompet', 'Sepatu & Sandal',
    'Kain & Tekstil', 'Lainnya',
  ],
  'Kerajinan & Souvenir': [
    'Kerajinan Kayu', 'Kerajinan Anyaman', 'Kerajinan Logam',
    'Kerajinan Kain', 'Souvenir & Cinderamata', 'Dekorasi Rumah',
    'Kerajinan Tanah Liat', 'Lainnya',
  ],
  'Agrikultur & Perkebunan': [
    'Sayuran & Buah Segar', 'Rempah-rempah', 'Tanaman Hias',
    'Produk Pertanian Olahan', 'Pupuk & Media Tanam', 'Bibit & Benih', 'Lainnya',
  ],
  'Perikanan & Kelautan': [
    'Ikan Segar', 'Ikan Olahan', 'Seafood Segar', 'Produk Laut Kering',
    'Hasil Budidaya', 'Lainnya',
  ],
  'Teknologi & Digital': [
    'Software & Aplikasi', 'Layanan IT', 'Hardware & Perangkat',
    'Elektronik', 'Aksesoris Gadget', 'Lainnya',
  ],
  'Jasa & Layanan': [
    'Jasa Konsultasi', 'Jasa Desain', 'Jasa Fotografi & Video',
    'Jasa Pelatihan', 'Jasa Pengiriman', 'Jasa Reparasi', 'Lainnya',
  ],
  'Perdagangan Umum': [
    'Elektronik & Gadget', 'Peralatan Rumah Tangga', 'Perlengkapan Kantor',
    'Alat Tulis & ATK', 'Mainan & Hobi', 'Produk Kesehatan', 'Lainnya',
  ],
  'Lainnya': ['Produk Umum', 'Lainnya'],
};

const DEFAULT_CATEGORIES = [
  'Produk Utama', 'Produk Sampingan', 'Produk Unggulan', 'Lainnya',
];

export default function TambahProduk() {
  const router = useRouter();
  const { umkm, refetch } = useWorkspace();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', category: '', price: '', stock: '', description: '',
  });

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  // Ambil kategori sesuai jenis usaha UMKM
  const umkmCategory = umkm?.category ?? '';
  const subCategories = PRODUCT_CATEGORIES[umkmCategory] ?? DEFAULT_CATEGORIES;

  const handleSubmit = async (isActive: boolean) => {
    setError('');
    if (!form.name.trim()) { setError('Nama produk wajib diisi.'); return; }
    if (!form.category) { setError('Kategori wajib dipilih.'); return; }
    if (!form.price || parseFloat(form.price) <= 0) { setError('Harga wajib diisi dan harus lebih dari 0.'); return; }
    if (!umkm) { setError('Data UMKM belum dimuat, coba refresh.'); return; }

    setSaving(true);
    try {
      await umkmApi.createProduct(umkm.id, {
        name: form.name.trim(),
        category: form.category,
        price: parseFloat(form.price),
        stock: form.stock ? parseInt(form.stock) : 0,
        description: form.description.trim() || undefined,
        isActive,
      });
      refetch();
      router.push('/workspace/produk');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menyimpan produk. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm w-full";

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah Produk Baru</h1>
          <p className="text-slate-500 mt-1">Tambahkan produk baru ke katalog usaha Anda</p>
        </div>
        <Link href="/workspace/produk" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <GlassCard className="p-8">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Nama Produk *</label>
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Contoh: Kemeja Batik Modern"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Kategori *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                    <option value="">Pilih Kategori</option>
                    {subCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Harga (Rp) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    placeholder="50000"
                    min="0"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Stok</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => set('stock', e.target.value)}
                    placeholder="100"
                    min="0"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Deskripsi Produk</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Jelaskan produk Anda..."
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSubmit(false)}
                  className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Draft'}
                </button>
                <GlowButton
                  variant="primary"
                  disabled={saving}
                  onClick={() => handleSubmit(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Publikasikan</>}
                </GlowButton>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-4">
          <GlassCard className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Foto Produk</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Klik atau drop file</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG max 5MB</p>
            </div>
            {umkmCategory && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Kategori usaha Anda:</p>
                <p className="text-sm text-blue-800 font-semibold mt-0.5">{umkmCategory}</p>
                <p className="text-xs text-blue-500 mt-1">Kategori produk disesuaikan otomatis</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </>
  );
}
