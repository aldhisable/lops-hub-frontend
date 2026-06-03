"use client";

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { analyticsApi } from '@/lib/api';
import Link from 'next/link';

const CLASS_META: Record<string, { label: string; color: string; criteria: string; icon: string }> = {
  PLATINUM: { label: 'Platinum', color: 'from-blue-600 to-blue-700', criteria: 'Omzet > 1M, Ekspor aktif, Sertifikasi lengkap', icon: '💎' },
  GOLD:     { label: 'Gold',     color: 'from-amber-500 to-amber-600', criteria: 'Omzet > 500Jt, Minimal 2 marketplace, SDM > 10', icon: '🏆' },
  SILVER:   { label: 'Silver',   color: 'from-slate-400 to-slate-500', criteria: 'Omzet > 100Jt, Memiliki NPWP & NIB, SDM > 3', icon: '🥈' },
  BRONZE:   { label: 'Bronze',   color: 'from-orange-600 to-orange-700', criteria: 'UMKM baru terdaftar, Dalam proses pembinaan awal', icon: '🥉' },
};

const ORDER = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'];

const radarLabels = ['Spread', 'Size', 'Sustain', 'Share', 'Supplier'];
const radarDesc = ['Jangkauan pasar', 'Skala usaha', 'Keberlanjutan', 'Kontribusi sosial', 'Rantai pasok'];

export function KlasifikasiPage() {
  const [dist, setDist] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.dashboard()
      .then((res) => {
        const classificationDist: Array<{ classification: string; _count: { id: number } }> = res.data.classificationDist;
        const map: Record<string, number> = {};
        let sum = 0;
        for (const d of classificationDist) {
          map[d.classification] = d._count.id;
          sum += d._count.id;
        }
        setDist(map);
        setTotal(res.data.totalUMKM ?? sum);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Klasifikasi UMKM</h1>
        <p className="text-slate-500 mt-1">Sistem penilaian dan pengelompokan UMKM berdasarkan 5S Framework</p>
      </div>

      {/* 5S Framework Explanation */}
      <GlassCard className="p-6 mb-8">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">Framework Penilaian 5S</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {radarLabels.map((label, i) => (
            <div key={label} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-lg mx-auto mb-2">{i + 1}</div>
              <div className="font-semibold text-slate-900 text-sm">{label}</div>
              <div className="text-xs text-slate-500 mt-1">{radarDesc[i]}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Classification Cards */}
      {loading ? (
        <GlassCard className="p-12 flex items-center justify-center text-slate-400">
          Memuat data klasifikasi...
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ORDER.map((key) => {
            const meta = CLASS_META[key];
            const count = dist[key] ?? 0;
            const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
            return (
              <GlassCard key={key} className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`bg-gradient-to-r ${meta.color} p-6 text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-3xl">{meta.icon}</span>
                      <h3 className="text-2xl font-bold mt-2">{meta.label}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{count.toLocaleString('id-ID')}</div>
                      <div className="text-sm opacity-80">UMKM ({pct}%)</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-slate-700 mb-2">Kriteria:</div>
                  <p className="text-sm text-slate-500">{meta.criteria}</p>
                  <Link
                    href={`/dashboard/umkm?classification=${key}`}
                    className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Lihat Daftar UMKM →
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
