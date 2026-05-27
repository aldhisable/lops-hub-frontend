"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { authApi, umkmApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Wilayah { id: string; name: string; }

const KATEGORI = [
  'Makanan & Minuman', 'Fashion & Tekstil', 'Kerajinan & Souvenir',
  'Agrikultur & Perkebunan', 'Perikanan & Kelautan', 'Teknologi & Digital',
  'Jasa & Layanan', 'Perdagangan Umum', 'Lainnya',
];

const KLASIFIKASI = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'];

export default function TambahUMKM() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Wilayah
  const [provinces, setProvinces] = useState<Wilayah[]>([]);
  const [cities, setCities] = useState<Wilayah[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    // Akun login owner
    ownerName: '', email: '', password: '',
    // Data UMKM
    name: '', category: '', establishedYear: '',
    provinceId: '', provinceName: '', city: '',
    address: '', phone: '', instagram: '', website: '',
    description: '', classification: 'BRONZE',
  });

  useEffect(() => {
    fetch('https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json')
      .then(r => r.json())
      .then((data: Wilayah[]) => setProvinces(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.provinceId) { setCities([]); return; }
    setLoadingCities(true);
    fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${form.provinceId}.json`)
      .then(r => r.json())
      .then((data: Wilayah[]) => setCities(data))
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  }, [form.provinceId]);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const opt = e.target.selectedOptions[0];
    set('provinceId', opt.value);
    set('provinceName', opt.text);
    set('city', '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.ownerName || !form.email || !form.password || !form.name || !form.category) {
      setError('Nama UMKM, kategori, nama owner, email, dan password wajib diisi.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setSaving(true);
    try {
      // 1. Buat akun User untuk owner UMKM
      const { data: regData } = await authApi.register({
        name: form.ownerName,
        email: form.email,
        password: form.password,
        role: 'UMKM',
      });

      // 2. Buat profil UMKM
      await umkmApi.create({
        userId: regData.user.id,
        name: form.name,
        category: form.category,
        establishedYear: form.establishedYear ? parseInt(form.establishedYear) : undefined,
        province: form.provinceName || undefined,
        city: form.city || undefined,
        address: form.address || undefined,
        phone: form.phone || undefined,
        instagram: form.instagram || undefined,
        website: form.website || undefined,
        description: form.description || undefined,
        classification: form.classification,
        status: 'ACTIVE',
      });

      setSuccess(true);
      setTimeout(() => router.push('/dashboard/umkm'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menyimpan data. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm";

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah UMKM Baru</h1>
          <p className="text-slate-500 mt-1">Daftarkan UMKM baru ke dalam sistem pembinaan</p>
        </div>
        <Link href="/dashboard/umkm" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium">
          UMKM berhasil ditambahkan! Mengarahkan ke direktori...
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main form */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Akun Login Owner */}
            <GlassCard className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Akun Login Owner</h3>
              <p className="text-sm text-slate-500 mb-6">Email dan password yang akan digunakan pemilik UMKM untuk login ke workspace</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Nama Lengkap Owner *</label>
                  <input value={form.ownerName} onChange={e => set('ownerName', e.target.value)} placeholder="Nama pemilik usaha" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="owner@umkm.id" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Password *</label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 karakter" className={inputCls} />
                </div>
              </div>
            </GlassCard>

            {/* Informasi Usaha */}
            <GlassCard className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Informasi Usaha</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Nama UMKM *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Contoh: Rumah Laut Sejahtera" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Kategori Usaha *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                    <option value="">Pilih Kategori</option>
                    {KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Tahun Berdiri</label>
                  <input type="number" value={form.establishedYear} onChange={e => set('establishedYear', e.target.value)} placeholder={String(new Date().getFullYear())} min="1900" max={new Date().getFullYear()} className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Provinsi</label>
                  <select value={form.provinceId} onChange={handleProvinceChange} className={inputCls}>
                    <option value="">Pilih Provinsi</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Kota / Kabupaten</label>
                  <select value={form.city} onChange={e => set('city', e.target.value)} disabled={!form.provinceId || loadingCities} className={`${inputCls} disabled:opacity-50`}>
                    <option value="">{loadingCities ? 'Memuat...' : 'Pilih Kota/Kabupaten'}</option>
                    {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">No. Telepon</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0812-xxxx-xxxx" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Instagram</label>
                  <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@namaakun" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
                  <textarea rows={2} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Jl. Contoh No. 123..." className={`${inputCls} resize-none`} />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Deskripsi Usaha</label>
                  <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Jelaskan tentang usaha yang dijalankan..." className={`${inputCls} resize-none`} />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <GlassCard className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Klasifikasi Awal</h3>
              <div className="flex flex-col gap-2">
                {KLASIFIKASI.map(k => (
                  <label key={k} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.classification === k ? 'border-blue-400 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <input type="radio" name="classification" value={k} checked={form.classification === k} onChange={e => set('classification', e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">{k.charAt(0) + k.slice(1).toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex flex-col gap-3">
                <GlowButton type="submit" variant="primary" disabled={saving} className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium w-full">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan UMKM</>}
                </GlowButton>
                <Link href="/dashboard/umkm" className="flex items-center justify-center px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  Batal
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </form>
    </>
  );
}
