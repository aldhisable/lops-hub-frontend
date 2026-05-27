"use client";

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, DollarSign } from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlassCard } from '@/components/ui/glass-card';
import { analyticsApi } from '@/lib/api';

const MONTHS_ID = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

interface DashboardStats {
  totalUMKM: number;
  totalRevenue: number;
  classificationDist: Array<{ classification: string; _count: { id: number } }>;
}

interface RevenueTrendItem { month: number; revenue: number }

export function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trend, setTrend] = useState<RevenueTrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.dashboard(),
      analyticsApi.revenueTrend(new Date().getFullYear()),
    ])
      .then(([s, t]) => { setStats(s.data); setTrend(t.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const trendChartData = trend.map((t) => ({
    month: MONTHS_ID[t.month] ?? String(t.month),
    revenue: parseFloat((t.revenue / 1000).toFixed(2)),
  }));

  const getCount = (cls: string) =>
    stats?.classificationDist.find((d) => d.classification === cls)?._count.id ?? 0;

  const platinumGold = getCount('PLATINUM') + getCount('GOLD');
  const totalRevBillion = stats ? (stats.totalRevenue / 1_000_000).toFixed(2) : '0';

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="text-slate-500 mt-1">Laporan kinerja dan analitik mendalam program UMKM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Omzet Nasional"
          value={loading ? '—' : `Rp ${totalRevBillion} M`}
          icon={DollarSign}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-600"
        />
        <KPICard
          title="Total UMKM Aktif"
          value={loading ? '—' : (stats?.totalUMKM ?? 0).toLocaleString('id-ID')}
          icon={Users}
          iconBgClass="bg-purple-50"
          iconColorClass="text-purple-600"
        />
        <KPICard
          title="Platinum + Gold"
          value={loading ? '—' : platinumGold.toString()}
          icon={Award}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-600"
        />
        <KPICard
          title="Silver + Bronze"
          value={loading ? '—' : (getCount('SILVER') + getCount('BRONZE')).toString()}
          icon={TrendingUp}
          iconBgClass="bg-emerald-50"
          iconColorClass="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsChart
          title="Tren Omzet Nasional"
          subtitle="Total omzet UMKM (dalam Juta Rupiah)"
          data={trendChartData.length > 0 ? trendChartData : [{ month: '—', revenue: 0 }]}
          dataKey="revenue"
          xAxisKey="month"
          color="#8b5cf6"
          height={350}
          valueFormatter={(val) => `Rp ${val.toLocaleString('id-ID')} Jt`}
        />
        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg text-slate-900 mb-6">Distribusi Klasifikasi</h3>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Memuat data...</div>
          ) : (
            <div className="flex flex-col gap-5 mt-4">
              {[
                { label: 'Platinum', key: 'PLATINUM', color: 'bg-blue-500' },
                { label: 'Gold', key: 'GOLD', color: 'bg-amber-400' },
                { label: 'Silver', key: 'SILVER', color: 'bg-slate-400' },
                { label: 'Bronze', key: 'BRONZE', color: 'bg-orange-400' },
              ].map(({ label, key, color }) => {
                const count = getCount(key);
                const pct = stats?.totalUMKM
                  ? Math.round((count / stats.totalUMKM) * 100)
                  : 0;
                return (
                  <div key={key} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700">{label}</span>
                      <div className="flex gap-4">
                        <span className="font-semibold text-slate-900">{count} UMKM</span>
                        <span className="text-slate-400 w-10 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}
