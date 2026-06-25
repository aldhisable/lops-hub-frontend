"use client";

import { useState, useEffect } from 'react';
import { Users, PieChart, TrendingUp, Award, FileText } from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlassCard } from '@/components/ui/glass-card';
import { DashboardMapCard } from './dashboard-map-card';
import { analyticsApi } from '@/lib/api';
import { formatCompactRupiah } from '@/lib/currency';

const MONTHS_ID = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

interface DashboardStats {
  totalUMKM: number;
  totalRevenue: number;
  classificationDist: Array<{ classification: string; _count: { id: number } }>;
}

interface RevenueTrendItem {
  month: number;
  revenue: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trend, setTrend] = useState<RevenueTrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.dashboard(),
      analyticsApi.revenueTrend(new Date().getFullYear()),
    ])
      .then(([statsRes, trendRes]) => {
        setStats(statsRes.data);
        setTrend(trendRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const trendChartData = trend.map((t) => ({
    month: MONTHS_ID[t.month] ?? String(t.month),
    revenue: t.revenue,
  }));

  const getClassCount = (cls: string) =>
    stats?.classificationDist.find((d) => d.classification === cls)?._count.id ?? 0;

  const totalClassified = stats
    ? stats.classificationDist.reduce((s, d) => s + d._count.id, 0)
    : 0;

  const pct = (n: number) =>
    totalClassified > 0 ? `(${((n / totalClassified) * 100).toFixed(1)}%)` : '';

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Dashboard Nasional</h1>
          <p className="text-slate-500 mt-1">Monitoring pertumbuhan dan perkembangan UMKM binaan LOPs Hub</p>
        </div>
        <div className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
          📅 {new Date().getFullYear()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total UMKM"
          value={loading ? '—' : stats?.totalUMKM.toLocaleString('id-ID') ?? '0'}
          icon={Users}
          iconBgClass="bg-purple-50"
          iconColorClass="text-purple-600"
          sparklineData={[10, 15, 12, 18, 25, 30, 35]}
        />
        <KPICard
          title="Total Omzet (Penjualan)"
          value={loading ? '—' : formatCompactRupiah(stats?.totalRevenue ?? 0)}
          icon={PieChart}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-600"
          sparklineData={[20, 22, 28, 35, 42, 50, 60]}
        />
        <KPICard
          title="Platinum + Gold"
          value={loading ? '—' : (getClassCount('PLATINUM') + getClassCount('GOLD')).toString()}
          icon={Award}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-600"
          sparklineData={[5, 8, 12, 15, 18, 25, 30]}
        />
        <KPICard
          title="UMKM Silver"
          value={loading ? '—' : getClassCount('SILVER').toString()}
          icon={TrendingUp}
          iconBgClass="bg-cyan-50"
          iconColorClass="text-cyan-600"
          sparklineData={[10, 12, 15, 16, 18, 20, 24]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* MAP — Peta Sebaran UMKM (choropleth heatmap) */}
        <DashboardMapCard />

        {/* Classification Distribution */}
        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg text-slate-900 mb-6">Distribusi Klasifikasi</h3>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Memuat data...</div>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              {[
                { label: 'Platinum', key: 'PLATINUM', color: 'bg-blue-600' },
                { label: 'Gold', key: 'GOLD', color: 'bg-amber-400' },
                { label: 'Silver', key: 'SILVER', color: 'bg-slate-400' },
                { label: 'Bronze', key: 'BRONZE', color: 'bg-orange-400' },
              ].map(({ label, key, color }) => {
                const count = getClassCount(key);
                return (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${color}`}></span>
                      <span className="text-slate-600 font-medium">{label}</span>
                    </div>
                    <div className="text-slate-900 font-bold">
                      {count} <span className="text-slate-400 font-normal ml-1">{pct(count)}</span>
                    </div>
                  </div>
                );
              })}
              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Total UMKM</span>
                <span className="text-slate-900 font-black text-xl">{totalClassified}</span>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <AnalyticsChart
          title="Tren Omzet (Penjualan)"
          subtitle="Total omzet UMKM (Rupiah)"
          data={trendChartData.length > 0 ? trendChartData : [{ month: '—', revenue: 0 }]}
          dataKey="revenue"
          xAxisKey="month"
          height={300}
          color="#3b82f6"
          valueFormatter={formatCompactRupiah}
        />
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg text-slate-900">Aktivitas Terbaru</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Lihat Semua</button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">UMKM &quot;Kopi Nusantara&quot; memperbarui data omzet</p>
              <p className="text-xs text-slate-500 mt-0.5">Makassar, Sulawesi Selatan • 5 menit lalu</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Regional 2 menambahkan 12 UMKM baru</p>
              <p className="text-xs text-slate-500 mt-0.5">Bandung, Jawa Barat • 1 jam lalu</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">UMKM &quot;Srikandi Craft&quot; naik kelas ke Gold</p>
              <p className="text-xs text-slate-500 mt-0.5">Surabaya, Jawa Timur • 2 jam lalu</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
