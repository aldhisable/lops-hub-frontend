"use client";

import React, { useEffect, useState } from 'react';
import { PieChart, TrendingUp, ShoppingBag, Users2, CheckCircle2, Clock, AtSign, Phone, Globe, MapPin, AlignLeft, Info, PackageOpen } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { RadarChart } from '@/components/ui/radar-chart';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { useAuth } from '@/context/auth-context';
import { useWorkspace } from '@/context/workspace-context';
import { analyticsApi, financialApi } from '@/lib/api';
import { formatCompactRupiah } from '@/lib/currency';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const PILLAR_LABEL: Record<string, string> = { spread: 'Spread', size: 'Size', sustain: 'Sustain', share: 'Share', supplier: 'Supplier' };
const PROG_STATUS: Record<string, { label: string; color: string; badge: string }> = {
  ACTIVE: { label: 'Aktif', color: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
  COMPLETED: { label: 'Selesai', color: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
};

interface Score5S {
  totalScore: number;
  pillars: Record<string, { score: number; weight: number }>;
  assessment: { employeeCount?: number | null } | null;
}
interface FinRow { month: number; year: number; revenue: number; profit?: number }

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '—';
}
function fmtDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function EmptyState({ text, icon: Icon = Info }: { text: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
      <Icon className="w-8 h-8 text-slate-300 mb-2" />
      <p className="text-sm text-slate-400 whitespace-pre-line">{text}</p>
    </div>
  );
}

export default function WorkspaceDashboard() {
  const { user } = useAuth();
  const { umkm } = useWorkspace();
  const [score5S, setScore5S] = useState<Score5S | null>(null);
  const [financials, setFinancials] = useState<FinRow[]>([]);

  useEffect(() => {
    analyticsApi.workspace5S().then((r) => setScore5S(r.data as Score5S)).catch(() => {});
    financialApi.getMe().then((r) => setFinancials(r.data as FinRow[])).catch(() => {});
  }, []);

  const ownerName = user?.name ?? '—';
  const umkmName = umkm?.name ?? '—';
  const classLabel: Record<string, string> = { PLATINUM: '💎 Platinum', GOLD: '🏆 Gold', SILVER: '🥈 Silver', BRONZE: '🥉 Bronze' };

  const currentYear = new Date().getFullYear();
  const omzetThisYear = financials.filter((f) => f.year === currentYear).reduce((s, f) => s + (f.revenue || 0), 0);
  const omzetLastYear = financials.filter((f) => f.year === currentYear - 1).reduce((s, f) => s + (f.revenue || 0), 0);
  const growth = omzetLastYear > 0 ? ((omzetThisYear - omzetLastYear) / omzetLastYear) * 100 : null;

  const products = umkm?.products ?? [];
  const participations = umkm?.participations ?? [];
  const employeeCount = score5S?.assessment?.employeeCount ?? null;

  const revenueTrend = MONTH_NAMES
    .map((month, i) => {
      const e = financials.find((f) => f.month === i + 1 && f.year === currentYear);
      return { month, revenue: e ? e.revenue : 0 };
    })
    .filter((r) => r.revenue > 0);

  const radarData = score5S
    ? Object.entries(score5S.pillars).map(([k, v]) => ({ subject: PILLAR_LABEL[k] ?? k, A: v.score, fullMark: 100 }))
    : [];
  const has5S = (score5S?.totalScore ?? 0) > 0;

  const kpis = [
    { icon: PieChart, label: `Omzet (${currentYear})`, value: formatCompactRupiah(omzetThisYear), color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: TrendingUp, label: 'Growth', value: growth === null ? '—' : `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: ShoppingBag, label: 'Jumlah Produk', value: String(products.length), color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: Users2, label: 'Tenaga Kerja', value: employeeCount != null ? String(employeeCount) : '—', color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Selamat Datang, {ownerName} 👋</h1>
        <p className="text-slate-500 mt-1">Berikut ringkasan usaha <strong className="text-slate-700">{umkmName}</strong> Anda hari ini</p>
      </div>

      {/* Identity Card */}
      <GlassCard className="p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center shrink-0 border border-teal-300/50 shadow-inner">
            <div className="text-center text-teal-800 font-extrabold leading-tight text-2xl">{initials(umkmName)}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-3">
              <h2 className="text-xl font-bold text-slate-900">{umkmName}</h2>
              <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-100 shrink-0" />
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1.5 text-sm mb-4">
              <span className="text-slate-500">Owner</span><span className="font-medium text-slate-800">{ownerName}</span>
              <span className="text-slate-500">Kategori</span><span className="font-medium text-slate-800">{umkm?.category ?? '—'}</span>
              <span className="text-slate-500">Berdiri Sejak</span><span className="font-medium text-slate-800">{umkm?.establishedYear ?? '—'}</span>
              <span className="text-slate-500">Kota / Provinsi</span><span className="font-medium text-slate-800">{umkm?.city && umkm?.province ? `${umkm.city}, ${umkm.province}` : umkm?.city ?? umkm?.province ?? '—'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {umkm?.phone && <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {umkm.phone}</span>}
              {umkm?.instagram && <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-pink-600 flex items-center gap-1.5"><AtSign className="w-3 h-3" /> {umkm.instagram}</span>}
              {umkm?.website && <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 flex items-center gap-1.5"><Globe className="w-3 h-3" /> {umkm.website}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:border-l lg:border-slate-100 lg:pl-6 shrink-0 min-w-[140px]">
            <div><div className="text-xs text-slate-400 mb-1">Status</div><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {umkm?.status === 'ACTIVE' ? 'Aktif' : umkm?.status ?? '—'}</span></div>
            <div><div className="text-xs text-slate-400 mb-1">Klasifikasi</div><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold">{classLabel[umkm?.classification ?? ''] ?? umkm?.classification ?? '—'}</span></div>
            <div><div className="text-xs text-slate-400 mb-1">Program Diikuti</div><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">{participations.length} program</span></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:border-l lg:border-slate-100 lg:pl-6 shrink-0">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 text-center min-w-[100px]">
                <div className={`${kpi.bg} p-2 rounded-lg inline-flex mb-2`}><kpi.icon className={`w-4 h-4 ${kpi.color}`} /></div>
                <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Row 1: Info Umum | Radar 5S | Galeri Produk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg text-slate-900 mb-6">Informasi Umum</h3>
          <div className="flex flex-col gap-5">
            <div className="flex gap-3"><MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><div><div className="text-sm font-semibold text-slate-700">Alamat Usaha</div><div className="text-sm text-slate-500 mt-1">{umkm?.address || <span className="text-slate-400 italic">Belum diisi</span>}</div></div></div>
            <div className="flex gap-3"><AlignLeft className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><div><div className="text-sm font-semibold text-slate-700">Deskripsi Usaha</div><div className="text-sm text-slate-500 mt-1">{umkm?.description || <span className="text-slate-400 italic">Belum diisi</span>}</div></div></div>
          </div>
        </GlassCard>

        {has5S ? (
          <RadarChart title="Radar 5S (Klasifikasi)" data={radarData} dataKey="A" angleKey="subject" color="#8b5cf6" height={280} className="h-full" />
        ) : (
          <GlassCard className="p-6 flex flex-col">
            <h3 className="font-semibold text-lg text-slate-900 mb-2">Radar 5S (Klasifikasi)</h3>
            <EmptyState text={'Belum ada penilaian 5S.\nIsi data di menu Analytics.'} />
          </GlassCard>
        )}

        <GlassCard className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-lg text-slate-900">Produk Unggulan</h3><a href="/workspace/produk" className="text-sm font-medium text-blue-600 hover:text-blue-700">Lihat Semua</a></div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 flex-1">
              {products.slice(0, 4).map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-100 bg-white overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-20 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center overflow-hidden">
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-7 h-7 text-slate-300" />}
                  </div>
                  <div className="p-2.5"><h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4><p className="text-[11px] text-slate-500 truncate">{p.category}</p><p className="text-xs font-bold text-blue-600 mt-1.5">Rp {p.price.toLocaleString('id-ID')}</p></div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text={'Belum ada produk.\nTambahkan di menu Produk.'} icon={PackageOpen} />
          )}
        </GlassCard>
      </div>

      {/* Row 2: Tren Omzet | Informasi Program */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {revenueTrend.length > 0 ? (
            <AnalyticsChart title="Tren Omzet (Penjualan)" data={revenueTrend} dataKey="revenue" xAxisKey="month" height={250} color="#8b5cf6" valueFormatter={formatCompactRupiah} />
          ) : (
            <GlassCard className="p-6 flex flex-col h-full min-h-[300px]">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Tren Omzet (Penjualan)</h3>
              <EmptyState text={'Belum ada data omzet.\nIsi data di menu Omzet & Growth.'} />
            </GlassCard>
          )}
        </div>

        <GlassCard className="p-6 flex flex-col">
          <h3 className="font-semibold text-lg text-slate-900 mb-6">Informasi Program</h3>
          {participations.length > 0 ? (
            <div className="relative"><div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
              <div className="flex flex-col gap-5">
                {participations.map((par) => {
                  const st = PROG_STATUS[par.program.status] ?? { label: par.program.status, color: 'bg-slate-300', badge: 'bg-slate-100 text-slate-500' };
                  return (
                    <div key={par.id} className="flex items-start gap-4 relative">
                      <div className={`w-6 h-6 rounded-full ${st.color} flex items-center justify-center shrink-0 z-10 shadow-sm`}>{st.label === 'Aktif' ? <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> : st.label === 'Selesai' ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Clock className="w-3 h-3 text-white" />}</div>
                      <div className="flex-1"><div className="flex justify-between items-start"><div><div className="text-sm font-semibold text-slate-800">{par.program.name}</div><div className="text-xs text-slate-400 mt-0.5">{fmtDate(par.program.startDate)} - {fmtDate(par.program.endDate)}</div></div><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${st.badge}`}>{st.label}</span></div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState text={'Belum mengikuti program apa pun.'} />
          )}
        </GlassCard>
      </div>
    </>
  );
}
