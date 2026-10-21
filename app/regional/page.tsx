"use client";

import { useState, useEffect } from 'react';
import { Users, PieChart, Award, TrendingUp, MapPin } from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlassCard } from '@/components/ui/glass-card';
import { DashboardActivityCard } from '@/features/dashboard/dashboard-activity-card';
import { analyticsApi } from '@/lib/api';
import { formatCompactRupiah } from '@/lib/currency';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

const MONTHS_ID = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

interface RegionalStats {
  totalUMKM: number;
  classificationDist: Array<{ classification: string; _count: { id: number } }>;
  topCities: Array<{ city: string; count: number }>;
  monthlyRevenue: Array<{ month: number; revenue: number }>;
}

const CLASS_META = [
  { label: 'Platinum', key: 'PLATINUM', color: 'bg-blue-600' },
  { label: 'Gold', key: 'GOLD', color: 'bg-amber-400' },
  { label: 'Silver', key: 'SILVER', color: 'bg-slate-400' },
  { label: 'Bronze', key: 'BRONZE', color: 'bg-orange-400' },
];

export default function RegionalDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<RegionalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.regional) { setLoading(false); return; }
    analyticsApi
      .regional(user.regional)
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const getClass = (k: string) =>
    stats?.classificationDist.find((d) => d.classification === k)?._count.id ?? 0;

  const totalOmzet = (stats?.monthlyRevenue ?? []).reduce((s, m) => s + (m.revenue ?? 0), 0);
  const trend = (stats?.monthlyRevenue ?? []).map((m) => ({
    month: MONTHS_ID[m.month] ?? String(m.month),
    revenue: m.revenue,
  }));
  const totalKota = stats?.topCities.length ?? 0;

  if (!user?.regional) {
    return (
      <GlassCard className="p-12 text-center text-slate-500">
        Akun Anda belum ditetapkan ke wilayah mana pun, sehingga tidak ada data yang bisa ditampilkan.
        Hubungi Admin Pusat untuk penetapan wilayah.
      </GlassCard>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Dashboard {user.regional}</h1>
          <p className="text-slate-500 mt-1">
            Pemantauan UMK binaan di wilayah Anda. Seluruh angka di halaman ini hanya mencakup {user.regional}.
          </p>
        </div>
        <div className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
          📅 {new Date().getFullYear()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="UMK Binaan"
          value={loading ? '—' : (stats?.totalUMKM ?? 0).toLocaleString('id-ID')}
          icon={Users}
          iconBgClass="bg-purple-50"
          iconColorClass="text-purple-600"
        />
        <KPICard
          title="Total Omzet"
          value={loading ? '—' : formatCompactRupiah(totalOmzet)}
          icon={PieChart}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-600"
        />
        <KPICard
          title="Platinum + Gold"
          value={loading ? '—' : String(getClass('PLATINUM') + getClass('GOLD'))}
          icon={Award}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-600"
        />
        <KPICard
          title="Kota / Kabupaten"
          value={loading ? '—' : String(totalKota)}
          icon={MapPin}
          iconBgClass="bg-cyan-50"
          iconColorClass="text-cyan-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sebaran kota */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-slate-900">Sebaran Kota / Kabupaten</h3>
            <Link href="/regional/peta" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Lihat peta →
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Memuat data...</div>
          ) : (stats?.topCities.length ?? 0) === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
              Belum ada UMK dengan data kota di wilayah ini.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {stats!.topCities.map((c, i) => {
                const maks = stats!.topCities[0].count || 1;
                return (
                  <div key={c.city}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">
                        <span className="text-slate-400 mr-2">{i + 1}.</span>{c.city}
                      </span>
                      <span className="font-semibold text-slate-900">{c.count} UMK</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.count / maks) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Distribusi klasifikasi */}
        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg text-slate-900 mb-6">Distribusi Klasifikasi</h3>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Memuat data...</div>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              {CLASS_META.map(({ label, key, color }) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${color}`}></span>
                    <span className="text-slate-600 font-medium">{label}</span>
                  </div>
                  <span className="text-slate-900 font-bold">{getClass(key)}</span>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Total</span>
                <span className="text-slate-900 font-black text-xl">{stats?.totalUMKM ?? 0}</span>
              </div>
              <Link
                href="/regional/klasifikasi"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 mt-1"
              >
                Rincian klasifikasi →
              </Link>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <AnalyticsChart
          title={`Tren Omzet ${user.regional}`}
          subtitle="Omzet UMK binaan di wilayah Anda (Rupiah)"
          data={trend.length > 0 ? trend : [{ month: '—', revenue: 0 }]}
          dataKey="revenue"
          xAxisKey="month"
          height={300}
          color="#3b82f6"
          valueFormatter={formatCompactRupiah}
        />
      </div>

      <DashboardActivityCard />

      <p className="text-xs text-slate-400 mt-6">
        <TrendingUp className="w-3 h-3 inline mr-1" />
        Data omzet berasal dari laporan keuangan UMK. Selama UMK di wilayah Anda belum mengisinya,
        angka omzet akan tampil kosong.
      </p>
    </>
  );
}
