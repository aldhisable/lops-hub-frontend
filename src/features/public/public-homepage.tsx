"use client";

import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { KPICard } from '@/components/ui/kpi-card';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlassCard } from '@/components/ui/glass-card';
import { Users, TrendingUp, Award, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyticsApi, PublicStats } from '@/lib/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function rpCompact(n: number): string {
  if (n >= 1e12) return `Rp ${(n / 1e12).toLocaleString('id-ID', { maximumFractionDigits: 2 })} T`;
  if (n >= 1e9) return `Rp ${(n / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
  if (n >= 1e6) return `Rp ${(n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}

const PIPELINE_STYLES = [
  { wrap: 'from-blue-500 to-blue-600 shadow-blue-500/20', width: 'w-full', value: 'text-3xl' },
  { wrap: 'from-purple-500 to-purple-600 shadow-purple-500/20', width: 'w-[85%]', value: 'text-2xl' },
  { wrap: 'from-amber-500 to-amber-600 shadow-amber-500/20', width: 'w-[70%]', value: 'text-xl' },
  { wrap: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20', width: 'w-[58%]', value: 'text-lg' },
];

export function PublicHomepage() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.publicStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const dash = (v: string | number) => (loading ? '—' : v);

  const revenueData = (stats?.revenueTrend ?? []).map((r) => ({
    month: `${MONTHS[r.month - 1]} ${r.year}`,
    revenue: r.revenue,
  }));
  const pipeline = (stats?.pipeline ?? []).slice(0, 4);
  const provinces = (stats?.byProvince ?? []).slice(0, 7);
  const maxProvince = provinces[0]?.count ?? 1;

  return (
    <PublicLayout>
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-400/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col gap-16">

        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center mt-10 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-6 border border-blue-100"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Monitoring Ekosistem UMKM Nasional
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight"
          >
            Mendorong Pertumbuhan <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">UMKM Nusantara</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-slate-500 max-w-2xl"
          >
            Platform intelijen terpadu untuk monitoring, evaluasi, dan akselerasi UMKM binaan LOPs Hub di seluruh Indonesia.
          </motion.p>
        </section>

        {/* KPI COUNTERS — real data */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          <KPICard
            title="Total UMKM Binaan"
            value={dash(stats ? stats.totalUmkm.toLocaleString('id-ID') : '—')}
            icon={Users}
            iconBgClass="bg-blue-100"
            iconColorClass="text-blue-600"
          />
          <KPICard
            title="Total Omzet (Penjualan)"
            value={dash(stats ? rpCompact(stats.totalOmzet) : '—')}
            icon={TrendingUp}
            iconBgClass="bg-purple-100"
            iconColorClass="text-purple-600"
            trend={stats ? { value: Math.abs(stats.momGrowthPct), isPositive: stats.momGrowthPct >= 0, label: 'bulan terakhir' } : undefined}
            sparklineData={revenueData.map((r) => r.revenue)}
          />
          <KPICard
            title="Pertumbuhan Omzet"
            value={dash(stats ? `${stats.momGrowthPct.toLocaleString('id-ID')}%` : '—')}
            icon={TrendingUp}
            iconBgClass="bg-emerald-100"
            iconColorClass="text-emerald-600"
            trend={stats ? { value: Math.abs(stats.momGrowthPct), isPositive: stats.momGrowthPct >= 0, label: 'vs bulan lalu' } : undefined}
          />
          <KPICard
            title="UMKM Naik Kelas"
            value={dash(stats ? stats.umkmNaikKelas.toLocaleString('id-ID') : '—')}
            icon={Award}
            iconBgClass="bg-amber-100"
            iconColorClass="text-amber-600"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PROVINCE DISTRIBUTION (2/3 width) — real data */}
          <section className="lg:col-span-2 flex flex-col" id="statistik">
            <GlassCard className="p-6 flex-1 flex flex-col min-h-[500px] relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Sebaran UMKM per Provinsi</h3>
                  <p className="text-sm text-slate-500">Distribusi UMKM binaan teratas berdasarkan provinsi</p>
                </div>
                <MapPin className="w-6 h-6 text-blue-500/60" />
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center text-slate-400">Memuat data...</div>
              ) : provinces.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-400">Belum ada data sebaran.</div>
              ) : (
                <div className="flex flex-col gap-4 flex-1 justify-center">
                  {provinces.map((p) => (
                    <div key={p.province}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-700">{p.province}</span>
                        <span className="text-slate-500">{p.count.toLocaleString('id-ID')} UMKM</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${Math.max(6, (p.count / maxProvince) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </section>

          {/* PIPELINE & ANALYTICS (1/3 width) — real data */}
          <section className="flex flex-col gap-6">
            {/* Pipeline Program */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Pipeline Program</h3>
              {loading ? (
                <p className="text-sm text-slate-400">Memuat...</p>
              ) : pipeline.length === 0 ? (
                <p className="text-sm text-slate-400">Belum ada program.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {pipeline.map((p, i) => {
                    const s = PIPELINE_STYLES[i] ?? PIPELINE_STYLES[PIPELINE_STYLES.length - 1];
                    return (
                      <div key={p.name} className={`${s.width} mx-auto bg-gradient-to-r ${s.wrap} rounded-lg p-4 text-white text-center shadow-lg`}>
                        <div className="text-sm font-medium opacity-80 truncate">{p.name}</div>
                        <div className={`${s.value} font-bold mt-1`}>{p.participants.toLocaleString('id-ID')}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>

            {/* Revenue Trend */}
            <AnalyticsChart
              title="Tren Omzet (Penjualan)"
              subtitle="Total omzet UMKM binaan per bulan"
              data={revenueData}
              dataKey="revenue"
              xAxisKey="month"
              height={220}
              color="#3b82f6"
              valueFormatter={(val) => rpCompact(Number(val))}
              className="flex-1"
            />
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
