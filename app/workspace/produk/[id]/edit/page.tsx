"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, ArrowLeft, Loader2, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useWorkspace } from '@/context/workspace-context';
import { umkmApi } from '@/lib/api';

const PRODUCT_CATEGORIES: Record<string, string[]> = {
  'Makanan & Minuman': ['Makanan Kering', 'Frozen Food', 'Camilan', 'Bumbu & Rempah', 'Minuman', 'Kue & Roti', 'Olahan Susu', 'Makanan Segar', 'Lainnya'],
  'Fashion & Tekstil': ['Pakaian Wanita', 'Pakaian Pria', 'Pakaian Anak', 'Baju Muslim', 'Batik', 'Aksesoris Fashion', 'Tas & Dompet', 'Sepatu & Sandal', 'Kain & Tekstil', 'Lainnya'],
  'Kerajinan & Souvenir': ['Kerajinan Kayu', 'Kerajinan Anyaman', 'Kerajinan Logam', 'Kerajinan Kain', 'Souvenir & Cinderamata', 'Dekorasi Rumah', 'Kerajinan Tanah Liat', 'Lainnya'],
  'Agrikultur & Perkebunan': ['Sayuran & Buah Segar', 'Rempah-rempah', 'Tanaman Hias', 'Produk Pertanian Olahan', 'Pupuk & Media Tanam', 'Bibit & Benih', 'Lainnya'],
  'Perikanan & Kelautan': ['Ikan Segar', 'Ikan Olahan', 'Seafood Segar', 'Produk Laut Kering', 'Hasil Budidaya', 'Lainnya'],
  'Teknologi & Digital': ['Software & Aplikasi', 'Layanan IT', 'Hardware & Perangkat', 'Elektronik', 'Aksesoris Gadget', 'Lainnya'],
  'Jasa & Layanan': ['Jasa Konsultasi', 'Jasa Desain', 'Jasa Fotografi & Video', 'Jasa Pelatihan', 'Jasa Pengiriman', 'Jasa Reparasi', 'Lainnya'],
  'Perdagangan Umum': ['Elektronik & Gadget', 'Peralatan Rumah Tangga', 'Perlengkapan Kantor', 'Alat Tulis & ATK', 'Mainan & Hobi', 'Produk Kesehatan', 'Lainnya'],
  'Lainnya': ['Produk Umum', 'Lainnya'],
};
const DEFAULT_CATEGORIES = ['Produk Utama', 'Produk Sampingan', 'Produk Unggulan', 'Lainnya'];

export default function EditProduk() {
  const router = useRouter();
  const params = useParams();
  const productId = String(params.id);
  const { umkm, refetch } = useWorkspace();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', category: '', price: '', stock: '', description: '', isActive: true,
  });

  useEffect(() => {
    if (!umkm) return;
    const product = umkm.products?.find((p: any) => p.id === productId);
    if (!product) { setNotFound(true); return; }
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock ?? 0),
      description: product.description ?? '',
      isActive: product.isActive ?? true,
    });
    if (product.imageUrl) {
      setImageUrl(product.imageUrl);
      setImagePreview(product.imageUrl);
    }
  }, [umkm, productId]);

  const set = (field: string, value: string | boolean) => setForm(f => ({ ...f, [field]: value }));

  const umkmCategory = umkm?.category ?? '';
  const subCategories = PRODUCT_CATEGORIES[umkmCategory] ?? DEFAULT_CATEGORIES;

  const handleImageSelect = async (file: File) => {
    if (!umkm) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await umkmApi.uploadProductImage(umkm.id, file);
      setImageUrl(url);
    } catch {
      setError('Gagal mengupload foto. Coba lagi.');
      setImagePreview(imageUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (isActive: boolean) => {
    setError('');
    if (!form.name.trim()) { setError('Nama produk wajib diisi.'); return; }
    if (!form.category) { setError('Jenis produk wajib dipilih.'); return; }
    if (!form.price || parseFloat(form.price) <= 0) { setError('Harga wajib diisi dan harus lebih dari 0.'); return; }
    if (!umkm) { setError('Data UMKM belum dimuat, coba refresh.'); return; }

    setSaving(true);
    try {
      await umkmApi.updateProduct(umkm.id, productId, {
        name: form.name.trim(),
        category: form.category,
        price: parseFloat(form.price),
        stock: form.stock ? parseInt(form.stock) : 0,
        description: form.description.trim() || undefined,
        imageUrl: imageUrl || undefined,
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

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <p>Produk tidak ditemukan.</p>
        <Link href="/workspace/produk" className="text-blue-600 text-sm hover:underline">Kembali ke Produk</Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Produk</h1>
          <p className="text-slate-500 mt-1">Perbarui informasi produk Anda</p>
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
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Contoh: Kemeja Batik Modern" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Jenis Produk *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                    <option value="">Pilih Jenis Produk</option>
                    {subCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Harga (Rp) *</label>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="50000" min="0" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Stok</label>
                  <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="100" min="0" className={inputCls} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Deskripsi Produk</label>
                <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Jelaskan produk Anda..." className={`${inputCls} resize-none`} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" disabled={saving} onClick={() => handleSubmit(false)}
                  className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors">
                  {saving ? 'Menyimpan...' : 'Simpan sebagai Draft'}
                </button>
                <GlowButton variant="primary" disabled={saving} onClick={() => handleSubmit(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
                </GlowButton>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-4">
          <GlassCard className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Foto Produk</h3>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }} />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                {uploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                )}
                {!uploading && (
                  <button type="button" onClick={() => { setImagePreview(''); setImageUrl(''); }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow text-red-500 hover:bg-red-50">
                    <X className="w-4 h-4" />
                  </button>
                )}
                {!uploading && (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 rounded-lg text-xs font-medium text-slate-700 shadow hover:bg-white transition-colors">
                    Ganti Foto
                  </button>
                )}
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Klik atau drop file</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP max 5MB</p>
              </div>
            )}
            {umkmCategory && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Kategori usaha Anda:</p>
                <p className="text-sm text-blue-800 font-semibold mt-0.5">{umkmCategory}</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </>
  );
}
