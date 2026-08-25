"use client";

import React, { useEffect, useState } from 'react';
import { Save, Loader2, Check, Info } from 'lucide-react';
import { GlassCard } from './glass-card';
import { GlowButton } from './glow-button';
import { assessmentApi, type Assessment5SInput, type Scoring5SResult } from '@/lib/api';

// Formulir tujuh indikator 5S yang tidak bisa dihitung otomatis.
//
// Tiga indikator lain diturunkan dari data yang sudah ada: kenaikan laba dan
// kenaikan penjualan dari laporan keuangan, dan usia usaha dari tahun berdiri.
// Formulir ini melengkapi sisanya supaya kelas UMKM bisa ditetapkan.

type Pilihan = { nilai: string; label: string; jenjang: string };

type KunciOpsi = 'technologyLevel' | 'legalStatus' | 'marketReach' | 'exhibitionScale' | 'supplierStatus';

const OPSI: Record<KunciOpsi, Pilihan[]> = {
  technologyLevel: [
    { nilai: 'NONE', label: 'Belum memanfaatkan teknologi', jenjang: 'Bronze' },
    { nilai: 'OFFLINE', label: 'Teknologi, pemasaran offline', jenjang: 'Silver' },
    { nilai: 'SOSMED', label: 'Teknologi, pemasaran media sosial', jenjang: 'Gold' },
    { nilai: 'ECOMMERCE', label: 'Teknologi, pemasaran e-commerce', jenjang: 'Platinum' },
  ],
  legalStatus: [
    { nilai: 'NONE', label: 'Belum punya legalitas', jenjang: 'Bronze' },
    { nilai: 'PERMIT', label: 'Ada ijin usaha saja', jenjang: 'Silver' },
    { nilai: 'PERMIT_PRODUCT', label: 'Ijin usaha + legalitas produk', jenjang: 'Gold' },
    { nilai: 'FULL', label: 'Ijin usaha + legalitas produk + perpajakan', jenjang: 'Platinum' },
  ],
  marketReach: [
    { nilai: 'LOCAL', label: 'Lokal', jenjang: 'Bronze' },
    { nilai: 'REGIONAL', label: 'Antar kabupaten/kota dalam 1 provinsi', jenjang: 'Silver' },
    { nilai: 'NATIONAL', label: 'Antar provinsi (skala nasional)', jenjang: 'Gold' },
    { nilai: 'EXPORT', label: 'Ekspor (mancanegara)', jenjang: 'Platinum' },
  ],
  exhibitionScale: [
    { nilai: 'NONE', label: 'Belum pernah ikut pameran', jenjang: 'Bronze' },
    { nilai: 'LOCAL', label: 'Skala lokal', jenjang: 'Bronze' },
    { nilai: 'PROVINCIAL', label: 'Skala provinsi', jenjang: 'Silver' },
    { nilai: 'NATIONAL', label: 'Skala nasional', jenjang: 'Gold' },
    { nilai: 'INTERNATIONAL', label: 'Skala internasional', jenjang: 'Platinum' },
  ],
  supplierStatus: [
    { nilai: 'NONE', label: 'Belum punya supplier tetap', jenjang: 'Bronze' },
    { nilai: 'INFORMAL', label: 'Punya supplier tetap, tanpa ikatan legal', jenjang: 'Silver' },
    { nilai: 'FORMAL_ONE', label: '1 supplier tetap dengan ikatan legal', jenjang: 'Gold' },
    { nilai: 'FORMAL_MULTIPLE', label: 'Lebih dari 1 supplier tetap dengan ikatan legal', jenjang: 'Platinum' },
  ],
};

const WARNA_JENJANG: Record<string, string> = {
  Bronze: 'text-orange-600',
  Silver: 'text-slate-500',
  Gold: 'text-amber-600',
  Platinum: 'text-blue-600',
};

const selectCls =
  'w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors';

function Baris({ pilar, label, bantuan, children }: {
  pilar: string; label: string; bantuan?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        <span className="text-[10px] uppercase tracking-wide text-blue-500 mr-2">{pilar}</span>
        {label}
      </label>
      {children}
      {bantuan && <span className="text-xs text-slate-400">{bantuan}</span>}
    </div>
  );
}

export function Assessment5SForm({ umkmId, onSaved }: { umkmId: string; onSaved?: () => void }) {
  const [form, setForm] = useState<Assessment5SInput>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [hasil, setHasil] = useState<Scoring5SResult | null>(null);

  useEffect(() => {
    assessmentApi
      .getByUmkm(umkmId)
      .then(({ data }) => setForm(data ?? {}))
      .catch(() => setErr('Gagal memuat data 5S.'))
      .finally(() => setLoading(false));
  }, [umkmId]);

  const set = (k: keyof Assessment5SInput, v: string) =>
    setForm((p) => ({ ...p, [k]: v === '' ? null : v } as Assessment5SInput));

  const setAngka = (k: keyof Assessment5SInput, v: string) =>
    setForm((p) => ({ ...p, [k]: v === '' ? null : Number(v) } as Assessment5SInput));

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr(''); setSaving(true);
    try {
      const { data } = await assessmentApi.upsertByUmkm(umkmId, form);
      setHasil(data.scoring ?? null);
      setMsg('Data 5S tersimpan dan klasifikasi dihitung ulang.');
      onSaved?.();
      setTimeout(() => setMsg(''), 4000);
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Gagal menyimpan data 5S.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-10 flex items-center justify-center gap-2 text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" /> Memuat data 5S...
      </GlassCard>
    );
  }

  const pilihan = (k: KunciOpsi) => (
    <select value={(form[k] as string) ?? ''} onChange={(e) => set(k, e.target.value)} className={selectCls}>
      <option value="">— belum diisi —</option>
      {OPSI[k].map((o) => (
        <option key={o.nilai} value={o.nilai}>{o.label}</option>
      ))}
    </select>
  );

  const jenjangTerpilih = (k: KunciOpsi) => {
    const v = form[k] as string | null | undefined;
    const o = v ? OPSI[k].find((x) => x.nilai === v) : undefined;
    return o ? <span className={`font-semibold ${WARNA_JENJANG[o.jenjang]}`}>{o.jenjang}</span> : null;
  };

  return (
    <GlassCard className="p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h3 className="text-lg font-bold text-slate-900">Penilaian 5S</h3>
        <span className="text-xs text-slate-400">Tujuh indikator yang diisi manual</span>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Tiga indikator lain dihitung otomatis: kenaikan laba dan kenaikan penjualan dari laporan
        keuangan, serta usia usaha dari tahun berdiri.
      </p>

      {msg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />{msg}
        </div>
      )}
      {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{err}</div>}

      {hasil && (
        <div className={`mb-5 p-4 rounded-xl border text-sm ${hasil.complete ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          {hasil.complete ? (
            <>Skor <strong>{hasil.score}/100</strong> — kelas ditetapkan <strong>{hasil.classification}</strong>.</>
          ) : (
            <>
              Skor sementara <strong>{hasil.score ?? '—'}/100</strong>, kelengkapan{' '}
              <strong>{hasil.completeness}%</strong>. Kelas belum ditetapkan karena masih ada
              indikator yang kosong.
            </>
          )}
        </div>
      )}

      <form onSubmit={simpan} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Baris pilar="Size" label="Kenaikan aset usaha (juta Rupiah)"
               bantuan="Di luar tanah dan bangunan. Bronze <300 · Silver 300–750 · Gold 750–2.500 · Platinum >2.500">
          <input
            type="number" min={0} step="any" inputMode="decimal"
            value={form.assetGrowthMillion ?? ''}
            onChange={(e) => setAngka('assetGrowthMillion', e.target.value)}
            placeholder="contoh: 450"
            className={selectCls}
          />
        </Baris>

        <Baris pilar="Sustain" label="Jumlah tenaga kerja"
               bantuan="Bronze <5 · Silver 5–30 · Gold 30–50 · Platinum >50 orang">
          <input
            type="number" min={0} step={1} inputMode="numeric"
            value={form.employeeCount ?? ''}
            onChange={(e) => setAngka('employeeCount', e.target.value)}
            placeholder="contoh: 12"
            className={selectCls}
          />
        </Baris>

        <Baris pilar="Sustain" label="Aspek operasi (pemanfaatan teknologi)">
          {pilihan('technologyLevel')}
          <span className="text-xs">{jenjangTerpilih('technologyLevel')}</span>
        </Baris>

        <Baris pilar="Sustain" label="Aspek legal">
          {pilihan('legalStatus')}
          <span className="text-xs">{jenjangTerpilih('legalStatus')}</span>
        </Baris>

        <Baris pilar="Share" label="Jangkauan pemasaran">
          {pilihan('marketReach')}
          <span className="text-xs">{jenjangTerpilih('marketReach')}</span>
        </Baris>

        <Baris pilar="Share" label="Ekspo produk (skala pameran)">
          {pilihan('exhibitionScale')}
          <span className="text-xs">{jenjangTerpilih('exhibitionScale')}</span>
        </Baris>

        <Baris pilar="Supplier" label="Keberlanjutan bahan baku">
          {pilihan('supplierStatus')}
          <span className="text-xs">{jenjangTerpilih('supplierStatus')}</span>
        </Baris>

        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <span className="flex items-start gap-1.5 text-xs text-slate-400 max-w-md">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Kelas hanya ditetapkan bila kesepuluh indikator lengkap. Menyimpan sebagian tetap
            berguna — kelengkapannya ikut tercatat.
          </span>
          <GlowButton
            variant="primary"
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Penilaian
          </GlowButton>
        </div>
      </form>
    </GlassCard>
  );
}
