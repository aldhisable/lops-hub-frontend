"use client";

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { analyticsApi } from '@/lib/api';
import Link from 'next/link';

// Isi halaman ini sebelumnya kriteria karangan ("Omzet > 1M, Ekspor aktif,
// Sertifikasi lengkap") yang tidak ada hubungannya dengan matriks 5S, dan
// deskripsi pilar yang keliru ("Share = Kontribusi sosial"). Padahal justru di
// halaman inilah pengguna belajar apa itu 5S. Isinya kini mengikuti PRD.md.

const PILAR = [
  {
    nama: 'Spread',
    bobot: '23,8%',
    ringkas: 'Kenaikan laba',
    rinci: 'Pertumbuhan laba antar periode, diukur per 6 bulan atau 1 tahun.',
  },
  {
    nama: 'Size',
    bobot: '23,8%',
    ringkas: 'Kenaikan aset & penjualan',
    rinci: 'Kenaikan aset usaha di luar tanah dan bangunan, serta kenaikan nilai penjualan.',
  },
  {
    nama: 'Sustain',
    bobot: '33,3%',
    ringkas: 'Keberlanjutan usaha',
    rinci: 'Jumlah tenaga kerja, lama usaha berdiri, pemanfaatan teknologi, dan kelengkapan legalitas.',
  },
  {
    nama: 'Share',
    bobot: '14,3%',
    ringkas: 'Jangkauan pasar',
    rinci: 'Luas jangkauan pemasaran, dari lokal sampai ekspor, dan skala pameran yang diikuti.',
  },
  {
    nama: 'Supplier',
    bobot: '4,8%',
    ringkas: 'Rantai pasok',
    rinci: 'Kepemilikan supplier tetap dan ada tidaknya ikatan legal dengan mereka.',
  },
];

const KELAS = [
  { key: 'PLATINUM', label: 'Platinum', rentang: 'Skor 87,5 – 100', warna: 'from-blue-600 to-blue-700', ikon: '💎' },
  { key: 'GOLD', label: 'Gold', rentang: 'Skor 62,5 – 87,5', warna: 'from-amber-500 to-amber-600', ikon: '🏆' },
  { key: 'SILVER', label: 'Silver', rentang: 'Skor 37,5 – 62,5', warna: 'from-slate-400 to-slate-500', ikon: '🥈' },
  { key: 'BRONZE', label: 'Bronze', rentang: 'Skor di bawah 37,5', warna: 'from-orange-600 to-orange-700', ikon: '🥉' },
];

interface Props {
  /** Bila diisi, data diambil dari statistik wilayah tersebut, bukan nasional. */
  regional?: string | null;
  basePath?: string;
}

export function KlasifikasiPage({ regional, basePath = '/dashboard' }: Props = {}) {
  const [dist, setDist] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [belumLengkap, setBelumLengkap] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilDist = regional ? analyticsApi.regional(regional) : analyticsApi.dashboard();

    Promise.all([ambilDist, analyticsApi.aggregate5S().catch(() => null)])
      .then(([res, agg]) => {
        const map: Record<string, number> = {};
        let jumlah = 0;
        for (const d of res.data.classificationDist ?? []) {
          map[d.classification] = d._count.id;
          jumlah += d._count.id;
        }
        setDist(map);
        setTotal(res.data.totalUMKM ?? jumlah);
        if (agg?.data) setBelumLengkap((agg.data.totalUmkm ?? 0) - (agg.data.completeCount ?? 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [regional]);

  const judul = regional ? `Klasifikasi UMKM ${regional}` : 'Klasifikasi UMKM';

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{judul}</h1>
        <p className="text-slate-500 mt-1">
          Pengelompokan UMKM berdasarkan parameter 5S: Spread, Size, Sustain, Share, dan Supplier
        </p>
      </div>

      {/* Penjelasan 5S */}
      <GlassCard className="p-6 mb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
          <h3 className="font-semibold text-lg text-slate-900">Parameter Penilaian</h3>
          <span className="text-xs text-slate-400">
            Sepuluh indikator, dikelompokkan ke lima pilar berbobot
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {PILAR.map((p) => (
            <div key={p.nama} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-bold text-slate-900">{p.nama}</span>
                <span className="text-xs font-semibold text-blue-600">{p.bobot}</span>
              </div>
              <div className="text-sm font-medium text-slate-700">{p.ringkas}</div>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{p.rinci}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
          Tiap indikator dinilai Bronze 25, Silver 50, Gold 75, atau Platinum 100. Skor pilar adalah
          rata-rata indikator yang <em>sudah terisi</em>, lalu digabung menurut bobot di atas menjadi
          skor akhir 0–100. Kelas hanya ditetapkan bila kesepuluh indikator lengkap.
        </p>
      </GlassCard>

      {belumLengkap !== null && belumLengkap > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>{belumLengkap.toLocaleString('id-ID')} UMKM</strong> belum memiliki data 5S lengkap,
          sehingga kelasnya belum bisa ditetapkan dari penilaian. Kelas yang tampil untuk mereka
          adalah nilai terakhir yang tersimpan.
        </div>
      )}

      {/* Kartu kelas */}
      {loading ? (
        <GlassCard className="p-12 flex items-center justify-center text-slate-400">
          Memuat data klasifikasi...
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {KELAS.map((k) => {
            const jumlah = dist[k.key] ?? 0;
            const persen = total > 0 ? ((jumlah / total) * 100).toFixed(1) : '0.0';
            return (
              <GlassCard key={k.key} className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`bg-gradient-to-r ${k.warna} p-6 text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-3xl">{k.ikon}</span>
                      <h3 className="text-2xl font-bold mt-2">{k.label}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{jumlah.toLocaleString('id-ID')}</div>
                      <div className="text-sm opacity-80">UMKM ({persen}%)</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-slate-700 mb-1">Ambang skor</div>
                  <p className="text-sm text-slate-500">{k.rentang}</p>
                  <Link
                    href={`${basePath}/umkm?classification=${k.key}`}
                    className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Lihat daftar UMKM →
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </>
  );
}
