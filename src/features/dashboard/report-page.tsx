"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { FileSpreadsheet, Download, Info, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { umkmApi, analyticsApi } from '@/lib/api';

interface UmkmRow {
  id: string;
  name: string;
  category: string;
  city: string | null;
  province: string | null;
  classification: string;
  establishedYear: number | null;
  phone: string | null;
  user?: { email: string | null };
  _count?: { products: number; participations: number };
}

interface DashboardStats {
  totalUMKM: number;
  totalProducts: number;
  totalPrograms: number;
  totalRevenue: number;
  classificationDist: Array<{ classification: string; _count: { id: number } }>;
  revenueByProvince: Array<{ province: string; total: number }>;
}

export function unduhCsv(namaBerkas: string, baris: (string | number)[][]) {
  const csv = baris
    .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  // BOM supaya Excel membaca UTF-8 dengan benar.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = namaBerkas;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ReportPage() {
  const [umkm, setUmkm] = useState<UmkmRow[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    Promise.all([umkmApi.list({ limit: 500, status: 'ACTIVE' }), analyticsApi.dashboard()])
      .then(([listRes, statRes]) => {
        setUmkm(listRes.data.data ?? []);
        setStats(statRes.data);
      })
      .catch(() => setErr('Gagal memuat data laporan.'))
      .finally(() => setLoading(false));
  }, []);

  const tanggal = new Date().toISOString().slice(0, 10);

  const laporan = useMemo(() => {
    if (umkm.length === 0) return [];

    const perProvinsi = new Map<string, number>();
    const perKategori = new Map<string, number>();
    for (const u of umkm) {
      const p = u.province ?? '(tidak diisi)';
      perProvinsi.set(p, (perProvinsi.get(p) ?? 0) + 1);
      perKategori.set(u.category, (perKategori.get(u.category) ?? 0) + 1);
    }

    return [
      {
        key: 'direktori',
        nama: 'Direktori UMKM Nasional',
        desc: `Daftar lengkap ${umkm.length} UMKM binaan aktif beserta klasifikasi, lokasi, dan jumlah produk.`,
        unduh: () =>
          unduhCsv(`Direktori_UMKM_Nasional_${tanggal}.csv`, [
            ['Direktori UMKM Binaan Nasional'],
            ['Diunduh', tanggal],
            [],
            ['Nama Usaha', 'Kategori', 'Email Akun', 'Kota/Kabupaten', 'Provinsi', 'Kelas', 'Tahun Berdiri', 'Telepon', 'Jumlah Produk', 'Jumlah Program'],
            ...umkm.map((u) => [
              u.name, u.category,
              u.user?.email && u.user.email.includes('@') ? u.user.email : 'BELUM ADA EMAIL',
              u.city ?? '', u.province ?? '', u.classification,
              u.establishedYear ?? '', u.phone ?? '',
              u._count?.products ?? 0, u._count?.participations ?? 0,
            ]),
          ]),
      },
      {
        key: 'klasifikasi',
        nama: 'Rekap Klasifikasi 5S',
        desc: 'Jumlah UMKM per kelas Platinum, Gold, Silver, dan Bronze.',
        unduh: () =>
          unduhCsv(`Rekap_Klasifikasi_${tanggal}.csv`, [
            ['Rekap Klasifikasi UMKM Nasional'],
            ['Diunduh', tanggal],
            [],
            ['Kelas', 'Jumlah UMKM'],
            ...['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'].map((k) => [
              k,
              stats?.classificationDist.find((d) => d.classification === k)?._count.id ?? 0,
            ]),
            [],
            ['Total', umkm.length],
          ]),
      },
      {
        key: 'sebaran',
        nama: 'Sebaran Provinsi',
        desc: 'Jumlah UMKM per provinsi, untuk memetakan konsentrasi binaan secara nasional.',
        unduh: () =>
          unduhCsv(`Sebaran_Provinsi_${tanggal}.csv`, [
            ['Sebaran UMKM per Provinsi'],
            ['Diunduh', tanggal],
            [],
            ['Provinsi', 'Jumlah UMKM'],
            ...[...perProvinsi.entries()].sort((a, b) => b[1] - a[1]),
          ]),
      },
      {
        key: 'kategori',
        nama: 'Rekap Kategori Usaha',
        desc: 'Jumlah UMKM per kategori usaha, untuk melihat komposisi portofolio binaan.',
        unduh: () =>
          unduhCsv(`Rekap_Kategori_${tanggal}.csv`, [
            ['Rekap Kategori Usaha'],
            ['Diunduh', tanggal],
            [],
            ['Kategori', 'Jumlah UMKM'],
            ...[...perKategori.entries()].sort((a, b) => b[1] - a[1]),
          ]),
      },
    ];
  }, [umkm, stats, tanggal]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Laporan &amp; Export</h1>
        <p className="text-slate-500 mt-1">Unduh rekap data UMKM binaan sebagai berkas CSV</p>
      </div>

      {err && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{err}</div>
      )}

      {loading ? (
        <GlassCard className="p-12 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Menyiapkan laporan...
        </GlassCard>
      ) : umkm.length === 0 ? (
        <GlassCard className="p-12 text-center text-slate-500">
          Belum ada UMKM aktif, jadi belum ada yang bisa dilaporkan.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {laporan.map((r) => (
            <GlassCard key={r.key} className="p-6 flex flex-col hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{r.nama}</h3>
              <p className="text-sm text-slate-500 mb-5 flex-1">{r.desc}</p>
              <GlowButton
                variant="primary"
                onClick={r.unduh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium w-full justify-center"
              >
                <Download className="w-4 h-4" /> Unduh CSV
              </GlowButton>
            </GlassCard>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-xs text-slate-400">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>
          Berkas dibuat dari data yang sama dengan yang tampil di menu UMKM dan Klasifikasi.
          Ekspor PDF dan infografis belum tersedia.
        </span>
      </div>
    </>
  );
}
