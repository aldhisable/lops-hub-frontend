"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Edit3, CheckCircle2, Phone, AtSign, Globe, Save, Loader2, Camera } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { WilayahPicker } from '@/components/ui/wilayah-select';
import { useWorkspace } from '@/context/workspace-context';
import { umkmApi } from '@/lib/api';
import { UMKM_CATEGORIES } from '@/lib/constants';

const CLASS_BADGE: Record<string, string> = {
  PLATINUM: 'bg-blue-50 text-blue-700',
  GOLD: 'bg-amber-50 text-amber-700',
  SILVER: 'bg-slate-100 text-slate-600',
  BRONZE: 'bg-orange-50 text-orange-700',
};
const CLASS_LABEL: Record<string, string> = {
  PLATINUM: '💎 Platinum', GOLD: '🏆 Gold', SILVER: '🥈 Silver', BRONZE: '🥉 Bronze',
};

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function ProfilUsaha() {
  const { umkm, refetch } = useWorkspace();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoErr, setLogoErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '', category: '', establishedYear: '',
    province: '', city: '', district: '', village: '', address: '', description: '', phone: '', instagram: '', website: '',
  });

  useEffect(() => {
    if (umkm) {
      setForm({
        name: umkm.name ?? '',
        category: umkm.category ?? '',
        establishedYear: umkm.establishedYear ? String(umkm.establishedYear) : '',
        province: umkm.province ?? '',
        city: umkm.city ?? '',
        district: umkm.district ?? '',
        village: umkm.village ?? '',
        address: umkm.address ?? '',
        description: umkm.description ?? '',
        phone: umkm.phone ?? '',
        instagram: umkm.instagram ?? '',
        website: umkm.website ?? '',
      });
    }
  }, [umkm]);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !umkm) return;
    setLogoErr('');
    if (file.size > 2 * 1024 * 1024) { setLogoErr('Ukuran foto maksimal 2MB.'); return; }
    setUploadingLogo(true);
    try {
      const url = await umkmApi.uploadProductImage(umkm.id, file);
      await umkmApi.updateMe({ logoUrl: url });
      refetch();
    } catch {
      setLogoErr('Gagal mengunggah foto. Coba lagi.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!umkm) return;
    setSaving(true);
    try {
      await umkmApi.updateMe({
        name: form.name,
        category: form.category,
        establishedYear: form.establishedYear ? parseInt(form.establishedYear) : undefined,
        province: form.province || undefined,
        city: form.city || undefined,
        district: form.district || undefined,
        village: form.village || undefined,
        address: form.address || undefined,
        description: form.description || undefined,
        phone: form.phone || undefined,
        instagram: form.instagram || undefined,
        website: form.website || undefined,
      });
      refetch();
      setEditing(false);
      setSuccessMsg('Profil berhasil disimpan!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (editable: boolean) =>
    `px-4 py-2.5 rounded-lg border text-sm w-full outline-none transition-colors ${
      editable
        ? 'border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
        : 'border-slate-100 bg-slate-50 text-slate-700 cursor-default'
    }`;

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profil Usaha</h1>
          <p className="text-slate-500 mt-1">Kelola informasi usaha Anda</p>
        </div>
        {!editing && (
          <GlowButton
            variant="primary"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium"
            onClick={() => setEditing(true)}
          >
            <Edit3 className="w-4 h-4" /> Edit Profil
          </GlowButton>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left card */}
        <div className="lg:col-span-4">
          <GlassCard className="p-6 text-center">
            <div className="relative w-24 h-24 mx-auto group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center border border-teal-300/50">
                {umkm?.logoUrl ? (
                  <img src={umkm.logoUrl} alt={umkm.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-teal-800 font-extrabold text-lg">{umkm ? getInitials(umkm.name) : '—'}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploadingLogo || !umkm}
                title="Ganti foto"
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={handleLogoChange} className="hidden" />
            </div>
            <p className="text-xs text-slate-400 mt-3">JPG, PNG. Maks 2MB</p>
            {logoErr && <p className="text-xs text-red-500 mt-1">{logoErr}</p>}
            <h3 className="text-lg font-bold text-slate-900 mt-3 flex items-center justify-center gap-2">
              {umkm?.name ?? '—'} <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </h3>
            <div className="flex justify-center gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                umkm?.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700'
                  : umkm?.status === 'PENDING' ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {umkm?.status === 'ACTIVE' ? 'Aktif'
                  : umkm?.status === 'PENDING' ? 'Menunggu Verifikasi'
                  : umkm?.status ?? '—'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CLASS_BADGE[umkm?.classification ?? ''] ?? 'bg-slate-100 text-slate-600'}`}>
                {CLASS_LABEL[umkm?.classification ?? ''] ?? umkm?.classification ?? '—'}
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3 text-sm text-left">
              {umkm?.phone && (
                <div className="flex items-center gap-3 text-slate-600"><Phone className="w-4 h-4 text-slate-400 shrink-0" /> {umkm.phone}</div>
              )}
              {umkm?.instagram && (
                <div className="flex items-center gap-3 text-slate-600"><AtSign className="w-4 h-4 text-slate-400 shrink-0" /> {umkm.instagram}</div>
              )}
              {umkm?.website && (
                <div className="flex items-center gap-3 text-slate-600"><Globe className="w-4 h-4 text-slate-400 shrink-0" /> {umkm.website}</div>
              )}
              {!umkm?.phone && !umkm?.instagram && !umkm?.website && (
                <p className="text-slate-400 text-xs">Belum ada kontak yang diisi</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right form */}
        <div className="lg:col-span-8">
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Detail Usaha</h3>
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Nama UMKM</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} readOnly={!editing} className={inputCls(editing)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Kategori</label>
                  {editing ? (
                    <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls(true)}>
                      <option value="">Pilih kategori</option>
                      {UMKM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input value={form.category} readOnly className={inputCls(false)} />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Tahun Berdiri</label>
                  <input type={editing ? 'number' : 'text'} value={form.establishedYear} onChange={e => set('establishedYear', e.target.value)} readOnly={!editing} className={inputCls(editing)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">No. Telepon</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} readOnly={!editing} className={inputCls(editing)} placeholder={editing ? '0812-xxxx-xxxx' : '—'} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Instagram</label>
                  <input value={form.instagram} onChange={e => set('instagram', e.target.value)} readOnly={!editing} className={inputCls(editing)} placeholder={editing ? '@namaakun' : '—'} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Website</label>
                  <input value={form.website} onChange={e => set('website', e.target.value)} readOnly={!editing} className={inputCls(editing)} placeholder={editing ? 'contoh.com' : '—'} />
                </div>
                {editing ? (
                  <WilayahPicker
                    value={{ province: form.province, city: form.city, district: form.district, village: form.village }}
                    onChange={(v) => setForm(f => ({ ...f, ...v }))}
                  />
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700">Provinsi</label>
                      <input value={form.province} readOnly className={inputCls(false)} placeholder="—" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700">Kota / Kabupaten</label>
                      <input value={form.city} readOnly className={inputCls(false)} placeholder="—" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700">Kecamatan</label>
                      <input value={form.district} readOnly className={inputCls(false)} placeholder="—" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700">Kelurahan / Desa</label>
                      <input value={form.village} readOnly className={inputCls(false)} placeholder="—" />
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Alamat</label>
                <textarea rows={2} value={form.address} onChange={e => set('address', e.target.value)} readOnly={!editing} className={`${inputCls(editing)} resize-none`} placeholder={editing ? 'Jl. Contoh No. 123...' : '—'} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Deskripsi</label>
                <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} readOnly={!editing} className={`${inputCls(editing)} resize-none`} placeholder={editing ? 'Jelaskan tentang usaha Anda...' : '—'} />
              </div>
              {editing && (
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => { setEditing(false); if (umkm) setForm({ name: umkm.name, category: umkm.category, establishedYear: umkm.establishedYear ? String(umkm.establishedYear) : '', province: umkm.province ?? '', city: umkm.city ?? '', district: umkm.district ?? '', village: umkm.village ?? '', address: umkm.address ?? '', description: umkm.description ?? '', phone: umkm.phone ?? '', instagram: umkm.instagram ?? '', website: umkm.website ?? '' }); }}
                    className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <GlowButton type="submit" variant="primary" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium">
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan</>}
                  </GlowButton>
                </div>
              )}
            </form>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
