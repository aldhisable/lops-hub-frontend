"use client";

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { analyticsApi } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

const CLASS_META: Record<string, { label: string; color: string; criteria: string; icon: string }> = {
  PLATINUM: { label: 'Platinum', color: 'from-blue-600 to-blue-700', criteria: 'Omzet > 1M, Ekspor aktif, Sertifikasi lengkap', icon: '💎' },
  GOLD:     { label: 'Gold',     color: 'from-amber-500 to-amber-600', criteria: 'Omzet > 500Jt, Minimal 2 marketplace, SDM > 10', icon: '🏆' },
  SILVER:   { label: 'Silver',   color: 'from-slate-400 to-slate-500', criteria: 'Omzet > 100Jt, Memiliki NPWP & NIB, SDM > 3', icon: '🥈' },
  BRONZE:   { label: 'Bronze',   color: 'from-orange-600 to-orange-700', criteria: 'UMKM baru terdaftar, Dalam proses pembinaan awal', icon: '🥉' },
};

const ORDER = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'];

export default function RegionalKlasifikasi() {
  const { user } = useAuth();
  const [dist, setDist] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const regional = user?.regional;
    if (!regional) { setLoading(false); return; }

    analyticsApi.regional(regional)
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
  }, [user]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Klasifikasi UMKM {user?.regional ?? ''}</h1>
        <p className="text-slate-500 mt-1">Distribusi klasifikasi UMKM di wilayah {user?.regional ?? 'regional Anda'}</p>
      </div>

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
                    href={`/regional/umkm?classification=${key}`}
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
