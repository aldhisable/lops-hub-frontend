"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { FileSpreadsheet, Download, Info, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { umkmApi, analyticsApi } from '@/lib/api';
import { useAuth } from '@/context/auth-context';

interface UmkmRow {
  id: string;
  name: string;
  category: string;
  city: string | null;
  province: string | null;
  classification: string;
  status: string;
  establishedYear: number | null;
  phone: string | null;
  _count?: { products: number; participations: number };
  participations?: Array<{ program: { name: string } }>;
}

function unduhCsv(namaBerkas: string, baris: (string | number)[][]) {
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

export default function RegionalLaporan() {
  const { user } = useAuth();
  const wilayah = user?.regional ?? 'Wilayah';

  const [umkm, setUmkm] = useState<UmkmRow[]>([]);
  const [stats, setStats] = useState<{ topCities: Array<{ city: string; count: number }>; classificationDist: Array<{ classification: string; _count: { id: number } }> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!user?.regional) { setLoading(false); return; }
    Promise.all([
      umkmApi.list({ limit: 500, status: 'ACTIVE' }),
      analyticsApi.regional(user.regional),
    ])
      .then(([listRes, statRes]) => {
        setUmkm(listRes.data.data ?? []);
        setStats(statRes.data);
      })
      .catch(() => setErr('Gagal memuat data laporan.'))
      .finally(() => setLoading(false));
  }, [user]);

  const tanggal = new Date().toISOString().slice(0, 10);

  const laporan = useMemo(() => {
    if (umkm.length === 0) return [];
    return [
      {
        key: 'direktori',
        nama: 'Direktori UMK Binaan',
        desc: `Daftar lengkap ${umkm.length} UMK aktif di ${wilayah} beserta klasifikasi, lokasi, dan jumlah produk.`,
        unduh: () =>
          unduhCsv(`Direktori_UMKM_${wilayah.replace(/\s+/g, '_')}_${tanggal}.csv`, [
            ['Direktori UMK Binaan', wilayah],
            ['Diunduh', tanggal],
            [],
            ['Nama Usaha', 'Kategori', 'Kota/Kabupaten', 'Provinsi', 'Kelas', 'Tahun Berdiri', 'Telepon', 'Jumlah Produk', 'Jumlah Program'],
            ...umkm.map((u) => [
              u.name, u.category, u.city ?? '', u.province ?? '', u.classification,
              u.establishedYear ?? '', u.phone ?? '',
              u._count?.products ?? 0, u._count?.participations ?? 0,
            ]),
          ]),
      },
      {
        key: 'klasifikasi',
        nama: 'Rekap Klasifikasi',
        desc: 'Jumlah UMK per kelas 5S di wilayah Anda, siap dilampirkan ke laporan kinerja.',
        unduh: () =>
          unduhCsv(`Rekap_Klasifikasi_${wilayah.replace(/\s+/g, '_')}_${tanggal}.csv`, [
            ['Rekap Klasifikasi UMK', wilayah],
            ['Diunduh', tanggal],
            [],
            ['Kelas', 'Jumlah UMK'],
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
        nama: 'Sebaran Kota / Kabupaten',
        desc: 'Jumlah UMK per kota dan kabupaten, untuk memetakan konsentrasi binaan.',
        unduh: () =>
          unduhCsv(`Sebaran_Kota_${wilayah.replace(/\s+/g, '_')}_${tanggal}.csv`, [
            ['Sebaran UMK per Kota/Kabupaten', wilayah],
            ['Diunduh', tanggal],
            [],
            ['Kota / Kabupaten', 'Jumlah UMK'],
            ...(stats?.topCities ?? []).map((c) => [c.city, c.count]),
          ]),
      },
    ];
  }, [umkm, stats, wilayah, tanggal]);

  if (!user?.regional) {
    return (
      <GlassCard className="p-12 text-center text-slate-500">
        Akun Anda belum ditetapkan ke wilayah mana pun, sehingga laporan tidak bisa dibuat.
      </GlassCard>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Laporan {wilayah}</h1>
        <p className="text-slate-500 mt-1">Unduh rekap data UMK binaan di wilayah Anda sebagai berkas CSV</p>
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
          Belum ada UMK aktif di {wilayah}, jadi belum ada yang bisa dilaporkan.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          Berkas dibuat dari data yang sama dengan yang Anda lihat di menu UMK dan Klasifikasi,
          dan hanya memuat UMK di {wilayah}.
        </span>
      </div>
    </>
  );
}
