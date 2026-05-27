"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Loader2, ChevronDown, Search } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { authApi, umkmApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Wilayah { id: string; name: string; }

const PROVINCES: Wilayah[] = [
  { id: '11', name: 'Aceh' },
  { id: '12', name: 'Sumatera Utara' },
  { id: '13', name: 'Sumatera Barat' },
  { id: '14', name: 'Riau' },
  { id: '15', name: 'Jambi' },
  { id: '16', name: 'Sumatera Selatan' },
  { id: '17', name: 'Bengkulu' },
  { id: '18', name: 'Lampung' },
  { id: '19', name: 'Kepulauan Bangka Belitung' },
  { id: '21', name: 'Kepulauan Riau' },
  { id: '31', name: 'DKI Jakarta' },
  { id: '32', name: 'Jawa Barat' },
  { id: '33', name: 'Jawa Tengah' },
  { id: '34', name: 'DI Yogyakarta' },
  { id: '35', name: 'Jawa Timur' },
  { id: '36', name: 'Banten' },
  { id: '51', name: 'Bali' },
  { id: '52', name: 'Nusa Tenggara Barat' },
  { id: '53', name: 'Nusa Tenggara Timur' },
  { id: '61', name: 'Kalimantan Barat' },
  { id: '62', name: 'Kalimantan Tengah' },
  { id: '63', name: 'Kalimantan Selatan' },
  { id: '64', name: 'Kalimantan Timur' },
  { id: '65', name: 'Kalimantan Utara' },
  { id: '71', name: 'Sulawesi Utara' },
  { id: '72', name: 'Sulawesi Tengah' },
  { id: '73', name: 'Sulawesi Selatan' },
  { id: '74', name: 'Sulawesi Tenggara' },
  { id: '75', name: 'Gorontalo' },
  { id: '76', name: 'Sulawesi Barat' },
  { id: '81', name: 'Maluku' },
  { id: '82', name: 'Maluku Utara' },
  { id: '91', name: 'Papua Barat' },
  { id: '92', name: 'Papua Barat Daya' },
  { id: '94', name: 'Papua' },
  { id: '95', name: 'Papua Selatan' },
  { id: '96', name: 'Papua Tengah' },
  { id: '97', name: 'Papua Pegunungan' },
];

const KATEGORI = [
  'Makanan & Minuman', 'Fashion & Tekstil', 'Kerajinan & Souvenir',
  'Agrikultur & Perkebunan', 'Perikanan & Kelautan', 'Teknologi & Digital',
  'Jasa & Layanan', 'Perdagangan Umum', 'Lainnya',
];

const KLASIFIKASI = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'];

function SearchableSelect({ options, value, onChange, placeholder, disabled = false }: {
  options: Wilayah[];
  value: string;
  onChange: (opt: Wilayah) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find(o => o.name === value);
  const filtered = options.filter(o => o.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleOpen = () => {
    if (disabled) return;
    setQuery('');
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = (opt: Wilayah) => {
    onChange(opt);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${selected ? 'text-slate-900' : 'text-slate-400'}`}
      >
        <span className="truncate">{selected ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Cari..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-400 text-center">Tidak ditemukan</li>
            ) : filtered.map(opt => (
              <li
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors ${opt.name === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
              >
                {opt.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TambahUMKM() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Wilayah
  const [cities, setCities] = useState<Wilayah[]>([]);
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
    if (!form.provinceId) { setCities([]); return; }
    setLoadingCities(true);
    const emsifa = `https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${form.provinceId}.json`;
    const ibnux = `https://ibnux.github.io/data-indonesia/kabupaten/${form.provinceId}.json`;
    fetch(emsifa)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: Wilayah[]) => setCities(data))
      .catch(() =>
        fetch(ibnux)
          .then(r => r.json())
          .then((data: { id: string; nama: string }[]) =>
            setCities(data.map(d => ({ id: d.id, name: d.nama })))
          )
          .catch(() => setCities([]))
      )
      .finally(() => setLoadingCities(false));
  }, [form.provinceId]);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

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
                  <SearchableSelect
                    options={PROVINCES}
                    value={form.provinceName}
                    onChange={(opt) => {
                      set('provinceId', opt.id);
                      set('provinceName', opt.name);
                      set('city', '');
                    }}
                    placeholder="Pilih Provinsi"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Kota / Kabupaten</label>
                  <SearchableSelect
                    options={cities}
                    value={form.city}
                    onChange={(opt) => set('city', opt.name)}
                    placeholder={loadingCities ? 'Memuat...' : 'Pilih Kota/Kabupaten'}
                    disabled={!form.provinceId || loadingCities}
                  />
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
