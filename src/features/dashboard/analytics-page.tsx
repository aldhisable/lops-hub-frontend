"use client";

import { useState, useEffect, Fragment } from 'react';
import { Users, TrendingUp, Award, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlassCard } from '@/components/ui/glass-card';
import { analyticsApi } from '@/lib/api';
import { formatCompactRupiah } from '@/lib/currency';

const MONTHS_ID = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

interface DashboardStats {
  totalUMKM: number;
  totalRevenue: number;
  classificationDist: Array<{ classification: string; _count: { id: number } }>;
}

interface RevenueTrendItem { month: number; revenue: number }

interface IndicatorDist { bronze: number; silver: number; gold: number; platinum: number; empty: number }
interface AggregateIndicator {
  id: string;
  pillar: string;
  label: string;
  source: 'computed' | 'input';
  avgScore: number;
  filledCount: number;
  distribution: IndicatorDist;
}
interface Aggregate5S {
  totalUmkm: number;
  assessedCount: number;
  overallScore: number;
  pillars: Record<string, { score: number; weight: number; assessed: number }>;
  indicators: AggregateIndicator[];
}

interface PerUmkmRow {
  id: string;
  name: string;
  city: string | null;
  province: string | null;
  classification: string;
  spread: number;
  size: number;
  sustain: number;
  share: number;
  supplier: number;
  totalScore: number;
  assessed: boolean;
}

interface UmkmIndicator {
  id: string;
  pillar: string;
  label: string;
  source: 'computed' | 'input';
  score: number;
}

const PILLAR_META: Array<{ key: string; label: string; desc: string; dot: string; bar: string }> = [
  { key: 'spread', label: 'Spread', desc: 'Kenaikan Laba', dot: 'bg-rose-500', bar: 'bg-rose-500' },
  { key: 'size', label: 'Size', desc: 'Kenaikan Aset & Penjualan', dot: 'bg-orange-500', bar: 'bg-orange-500' },
  { key: 'sustain', label: 'Sustain', desc: 'SDM, Usaha, Operasi, Legal', dot: 'bg-green-500', bar: 'bg-green-500' },
  { key: 'share', label: 'Share', desc: 'Jangkauan & Ekspo Produk', dot: 'bg-blue-500', bar: 'bg-blue-500' },
  { key: 'supplier', label: 'Supplier', desc: 'Keberlanjutan Bahan Baku', dot: 'bg-purple-500', bar: 'bg-purple-500' },
];

const SCORE_TIER: Record<number, { label: string; cls: string }> = {
  0: { label: 'Belum Diisi', cls: 'bg-slate-100 text-slate-400' },
  25: { label: 'Bronze', cls: 'bg-orange-100 text-orange-700' },
  50: { label: 'Silver', cls: 'bg-slate-200 text-slate-600' },
  75: { label: 'Gold', cls: 'bg-amber-100 text-amber-700' },
  100: { label: 'Platinum', cls: 'bg-blue-100 text-blue-700' },
};

export function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trend, setTrend] = useState<RevenueTrendItem[]>([]);
  const [agg, setAgg] = useState<Aggregate5S | null>(null);
  const [perUmkm, setPerUmkm] = useState<PerUmkmRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [umkmQuery, setUmkmQuery] = useState('');
  const [umkmSort, setUmkmSort] = useState<'total' | 'name'>('total');
  const [expandedUmkm, setExpandedUmkm] = useState<string | null>(null);
  const [umkmIndicators, setUmkmIndicators] = useState<Record<string, UmkmIndicator[]>>({});
  const [indLoadingId, setIndLoadingId] = useState<string | null>(null);

  const toggleUmkm = (umkmId: string) => {
    if (expandedUmkm === umkmId) { setExpandedUmkm(null); return; }
    setExpandedUmkm(umkmId);
    if (!umkmIndicators[umkmId]) {
      setIndLoadingId(umkmId);
      analyticsApi.umkm5S(umkmId)
        .then((r) => setUmkmIndicators((prev) => ({ ...prev, [umkmId]: r.data.indicators ?? [] })))
        .catch(() => setUmkmIndicators((prev) => ({ ...prev, [umkmId]: [] })))
        .finally(() => setIndLoadingId(null));
    }
  };

  useEffect(() => {
    Promise.all([
      analyticsApi.dashboard(),
      analyticsApi.revenueTrend(new Date().getFullYear()),
      analyticsApi.aggregate5S(),
      analyticsApi.perUmkm5S(),
    ])
      .then(([s, t, a, u]) => { setStats(s.data); setTrend(t.data); setAgg(a.data); setPerUmkm(u.data.rows ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const trendChartData = trend.map((t) => ({
    month: MONTHS_ID[t.month] ?? String(t.month),
    revenue: t.revenue,
  }));

  const getCount = (cls: string) =>
    stats?.classificationDist.find((d) => d.classification === cls)?._count.id ?? 0;

  const platinumGold = getCount('PLATINUM') + getCount('GOLD');

  const filteredUmkm = perUmkm
    .filter((u) => {
      const q = umkmQuery.trim().toLowerCase();
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || (u.city ?? '').toLowerCase().includes(q) || (u.province ?? '').toLowerCase().includes(q);
    })
    .sort((a, b) => (umkmSort === 'name' ? a.name.localeCompare(b.name) : b.totalScore - a.totalScore));

  const classBadge: Record<string, string> = {
    PLATINUM: 'bg-blue-100 text-blue-700',
    GOLD: 'bg-amber-100 text-amber-700',
    SILVER: 'bg-slate-200 text-slate-600',
    BRONZE: 'bg-orange-100 text-orange-700',
  };

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
          value={loading ? '—' : formatCompactRupiah(stats?.totalRevenue ?? 0)}
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
          subtitle="Total omzet UMKM (Rupiah)"
          data={trendChartData.length > 0 ? trendChartData : [{ month: '—', revenue: 0 }]}
          dataKey="revenue"
          xAxisKey="month"
          color="#8b5cf6"
          height={350}
          valueFormatter={formatCompactRupiah}
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

      {/* Detail Parameter 5S + 10 Indikator Turunan */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Detail Parameter 5S</h3>
            <p className="text-slate-500 text-sm mt-1">
              Rata-rata skor 5 parameter & 10 indikator turunan dari data UMK yang sudah diinput
            </p>
          </div>
          {agg && (
            <div className="flex items-center gap-4 text-sm">
              <div className="text-right">
                <div className="text-xs text-slate-400">Skor Rata-rata Nasional</div>
                <div className="font-bold text-slate-900 text-lg">{agg.overallScore}<span className="text-slate-400 text-sm font-normal"> / 100</span></div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">UMK Ternilai</div>
                <div className="font-bold text-slate-900 text-lg">{agg.assessedCount}<span className="text-slate-400 text-sm font-normal"> / {agg.totalUmkm}</span></div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Memuat data...</div>
        ) : !agg ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Data tidak tersedia</div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-3">Parameter / Indikator</th>
                  <th className="py-3 px-3 text-center w-20">Bobot</th>
                  <th className="py-3 px-3 w-48">Skor Rata-rata</th>
                  <th className="py-3 px-3 text-center w-24">UMK Terisi</th>
                  <th className="py-3 px-3 w-44">Distribusi Kelas</th>
                </tr>
              </thead>
              <tbody>
                {PILLAR_META.map((pillar) => {
                  const p = agg.pillars[pillar.key];
                  const indicators = agg.indicators.filter((i) => i.pillar === pillar.key.toUpperCase());
                  return (
                    <Fragment key={pillar.key}>
                      {/* Pillar header row */}
                      <tr className="bg-slate-50/70 border-b border-slate-100">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${pillar.dot}`} />
                            <div>
                              <span className="font-semibold text-slate-800">{pillar.label}</span>
                              <span className="text-slate-400 text-xs ml-2">{pillar.desc}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-semibold text-slate-700">{p?.weight ?? 0}%</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className={`h-full ${pillar.bar} rounded-full transition-all duration-700`} style={{ width: `${p?.score ?? 0}%` }} />
                            </div>
                            <span className="font-bold text-slate-800 w-8 text-right">{p?.score ?? 0}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-500">{p?.assessed ?? 0}</td>
                        <td className="py-3 px-3" />
                      </tr>

                      {/* Indicator rows */}
                      {indicators.map((ind) => {
                        const tier = SCORE_TIER[ind.avgScore] ?? SCORE_TIER[0];
                        return (
                          <tr key={ind.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                            <td className="py-2.5 px-3 pl-8">
                              <span className="text-slate-700">{ind.label}</span>
                              <span className={`ml-2 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${ind.source === 'computed' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                {ind.source === 'computed' ? 'otomatis' : 'input'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3" />
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className={`h-full ${pillar.bar} rounded-full opacity-70`} style={{ width: `${ind.avgScore}%` }} />
                                </div>
                                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${tier.cls}`}>{tier.label}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-500">
                              {ind.filledCount}<span className="text-slate-300">/{agg.totalUmkm}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5 text-[10px] font-medium">
                                <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700" title="Bronze">{ind.distribution.bronze}</span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600" title="Silver">{ind.distribution.silver}</span>
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700" title="Gold">{ind.distribution.gold}</span>
                                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700" title="Platinum">{ind.distribution.platinum}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              <span className="font-medium text-slate-500">Distribusi Kelas:</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-400" /> Bronze (25)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-400" /> Silver (50)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400" /> Gold (75)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Platinum (100)</span>
              <span className="ml-auto">Skor rata-rata hanya menghitung UMK yang sudah mengisi indikator terkait.</span>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Skor 5S per UMK */}
      <GlassCard className="p-6 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Skor 5S per UMK</h3>
            <p className="text-slate-500 text-sm mt-1">
              Nilai tiap parameter & skor total per UMK — klik baris untuk breakdown 10 indikator turunannya
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={umkmQuery}
              onChange={(e) => setUmkmQuery(e.target.value)}
              placeholder="Cari nama / kota..."
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white w-44"
            />
            <select
              value={umkmSort}
              onChange={(e) => setUmkmSort(e.target.value as 'total' | 'name')}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="total">Urut: Skor Tertinggi</option>
              <option value="name">Urut: Nama (A-Z)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Memuat data...</div>
        ) : filteredUmkm.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Tidak ada UMK ditemukan</div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-3">UMK</th>
                  <th className="py-3 px-3 text-center w-24">Kelas</th>
                  <th className="py-3 px-3 text-center w-20">Spread<div className="font-normal text-slate-300">25%</div></th>
                  <th className="py-3 px-3 text-center w-20">Size<div className="font-normal text-slate-300">25%</div></th>
                  <th className="py-3 px-3 text-center w-20">Sustain<div className="font-normal text-slate-300">35%</div></th>
                  <th className="py-3 px-3 text-center w-20">Share<div className="font-normal text-slate-300">15%</div></th>
                  <th className="py-3 px-3 text-center w-20">Supplier<div className="font-normal text-slate-300">5%</div></th>
                  <th className="py-3 px-3 w-40">Skor Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredUmkm.map((u) => {
                  const isOpen = expandedUmkm === u.id;
                  return (
                    <Fragment key={u.id}>
                      <tr
                        onClick={() => toggleUmkm(u.id)}
                        className={`border-b border-slate-50 cursor-pointer transition-colors ${isOpen ? 'bg-slate-50/70' : 'hover:bg-slate-50/40'}`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />}
                            <div>
                              <div className="font-medium text-slate-800">{u.name}</div>
                              {(u.city || u.province) && (
                                <div className="text-xs text-slate-400">{[u.city, u.province].filter(Boolean).join(', ')}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${classBadge[u.classification] ?? 'bg-slate-100 text-slate-400'}`}>
                            {u.classification}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{u.spread || <span className="text-slate-300">—</span>}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{u.size || <span className="text-slate-300">—</span>}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{u.sustain || <span className="text-slate-300">—</span>}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{u.share || <span className="text-slate-300">—</span>}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{u.supplier || <span className="text-slate-300">—</span>}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-blue-500 transition-all duration-700" style={{ width: `${u.totalScore}%` }} />
                            </div>
                            <span className="font-bold text-slate-800 w-8 text-right">{u.totalScore}</span>
                          </div>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr className="bg-slate-50/40">
                          <td colSpan={8} className="px-3 pb-4 pt-1">
                            {indLoadingId === u.id ? (
                              <div className="py-4 text-center text-sm text-slate-400">Memuat 10 indikator...</div>
                            ) : (umkmIndicators[u.id]?.length ?? 0) === 0 ? (
                              <div className="py-4 text-center text-sm text-slate-400">Belum ada data indikator untuk UMK ini.</div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-2 pl-6">
                                {PILLAR_META.map((pillar) => {
                                  const inds = (umkmIndicators[u.id] ?? []).filter((i) => i.pillar === pillar.key.toUpperCase());
                                  if (inds.length === 0) return null;
                                  return (
                                    <div key={pillar.key} className="py-2">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`w-2 h-2 rounded-full ${pillar.dot}`} />
                                        <span className="text-xs font-semibold text-slate-600">{pillar.label}</span>
                                      </div>
                                      <div className="flex flex-col gap-1.5">
                                        {inds.map((ind) => {
                                          const tier = SCORE_TIER[ind.score] ?? SCORE_TIER[0];
                                          return (
                                            <div key={ind.id} className="flex items-center gap-2 text-xs">
                                              <span className="text-slate-600 flex-1 truncate" title={ind.label}>{ind.label}</span>
                                              <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                <div className={`h-full ${pillar.bar} rounded-full opacity-70`} style={{ width: `${ind.score}%` }} />
                                              </div>
                                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded w-16 text-center ${tier.cls}`}>{tier.label}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              <span>Menampilkan {filteredUmkm.length} dari {perUmkm.length} UMK</span>
              <span>Skor mengikuti perhitungan 5S yang sama dengan radar segilima di profil UMK.</span>
            </div>
          </div>
        )}
      </GlassCard>
    </>
  );
}
