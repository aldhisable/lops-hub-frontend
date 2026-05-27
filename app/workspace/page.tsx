"use client";

import React from 'react';
import { PieChart, TrendingUp, ShoppingBag, Users2, CheckCircle2, Clock, AtSign, Phone, Globe, MapPin, AlignLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { RadarChart } from '@/components/ui/radar-chart';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { useAuth } from '@/context/auth-context';
import { useWorkspace } from '@/context/workspace-context';

const radarData = [
  { subject: 'Spread', A: 85, fullMark: 100 },
  { subject: 'Size', A: 78, fullMark: 100 },
  { subject: 'Sustain', A: 82, fullMark: 100 },
  { subject: 'Share', A: 76, fullMark: 100 },
  { subject: 'Supplier', A: 84, fullMark: 100 },
];

const revenueTrendData = [
  { month: 'Jan', revenue: 150 }, { month: 'Feb', revenue: 200 },
  { month: 'Mar', revenue: 180 }, { month: 'Apr', revenue: 250 },
  { month: 'Mei', revenue: 300 }, { month: 'Jun', revenue: 280 },
  { month: 'Jul', revenue: 350 }, { month: 'Agu', revenue: 380 },
  { month: 'Sep', revenue: 400 }, { month: 'Okt', revenue: 420 },
  { month: 'Nov', revenue: 460 }, { month: 'Des', revenue: 502 },
];

const targetVsActualData = [
  { month: 'Jan', target: 200, aktual: 150 }, { month: 'Feb', target: 220, aktual: 200 },
  { month: 'Mar', target: 250, aktual: 180 }, { month: 'Apr', target: 300, aktual: 350 },
  { month: 'Mei', target: 350, aktual: 400 }, { month: 'Jun', target: 380, aktual: 380 },
  { month: 'Jul', target: 400, aktual: 420 }, { month: 'Agu', target: 420, aktual: 400 },
  { month: 'Sep', target: 430, aktual: 450 }, { month: 'Okt', target: 440, aktual: 460 },
  { month: 'Nov', target: 450, aktual: 480 }, { month: 'Des', target: 450, aktual: 502 },
];

const programList = [
  { name: 'Maritimepreneur', period: '15 Jan 2025 - 30 Des 2025', status: 'Selesai', color: 'bg-emerald-500', badgeColor: 'bg-emerald-50 text-emerald-700' },
  { name: 'UMK Akselerator', period: '01 Jan 2025 - 31 Des 2026', status: 'Aktif', color: 'bg-blue-500', badgeColor: 'bg-blue-50 text-blue-700' },
  { name: 'National Expo 2025', period: '05 Mei 2025 - 08 Mei 2025', status: 'Selesai', color: 'bg-emerald-500', badgeColor: 'bg-emerald-50 text-emerald-700' },
  { name: 'Gedor Ekspor', period: 'Belum Bergabung', status: 'Belum', color: 'bg-slate-300', badgeColor: 'bg-slate-100 text-slate-500' },
];

export default function WorkspaceDashboard() {
  const { user } = useAuth();
  const { umkm } = useWorkspace();

  const ownerName = user?.name ?? '—';
  const umkmName = umkm?.name ?? '—';
  const classLabel: Record<string, string> = { PLATINUM: '💎 Platinum', GOLD: '🏆 Gold', SILVER: '🥈 Silver', BRONZE: '🥉 Bronze' };

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
            <div className="text-center text-teal-800 font-extrabold leading-tight text-sm"><span className="text-2xl block mb-0.5">🌊</span>RUMAH<br/>LAUT</div>
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
            <div><div className="text-xs text-slate-400 mb-1">Program Diikuti</div><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">{umkm?.participations?.length ?? 0} program</span></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:border-l lg:border-slate-100 lg:pl-6 shrink-0">
            {[
              { icon: PieChart, label: 'Omzet (2025)', value: 'Rp 502 Jt', trend: '↑ 18,6%', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: TrendingUp, label: 'Growth', value: '23,8%', trend: '↑ 6,1%', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: ShoppingBag, label: 'Jumlah Produk', value: '24', trend: '↑ 5', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { icon: Users2, label: 'Tenaga Kerja', value: '18', trend: '↑ 3', color: 'text-teal-600', bg: 'bg-teal-50' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 text-center min-w-[100px]">
                <div className={`${kpi.bg} p-2 rounded-lg inline-flex mb-2`}><kpi.icon className={`w-4 h-4 ${kpi.color}`} /></div>
                <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                <div className="text-xs font-semibold text-emerald-500 mt-1">{kpi.trend}</div>
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
            <div className="flex gap-3"><MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><div><div className="text-sm font-semibold text-slate-700">Alamat Usaha</div><div className="text-sm text-slate-500 mt-1">Jl. Perintis Kemerdekaan No. 123<br/>Makassar, Sulawesi Selatan 90241</div></div></div>
            <div className="flex gap-3"><AlignLeft className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><div><div className="text-sm font-semibold text-slate-700">Deskripsi Usaha</div><div className="text-sm text-slate-500 mt-1">Rumah Laut Sejahtera bergerak di bidang pengolahan hasil laut menjadi produk makanan beku berkualitas tinggi dengan bahan baku lokal.</div></div></div>
            <div className="flex gap-3"><ShoppingBag className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><div><div className="text-sm font-semibold text-slate-700">Marketplace</div><div className="flex gap-2 mt-2 flex-wrap"><span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold border border-orange-100">🛒 Shopee</span><span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold border border-green-100">🏪 Tokopedia</span><span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">📦 Lazada</span></div></div></div>
          </div>
        </GlassCard>

        <RadarChart title="Radar 5S (Klasifikasi)" data={radarData} dataKey="A" angleKey="subject" color="#8b5cf6" height={280} className="h-full" />

        <GlassCard className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-lg text-slate-900">Produk Unggulan</h3><a href="/workspace/produk" className="text-sm font-medium text-blue-600 hover:text-blue-700">Lihat Semua</a></div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[{ name: 'Abon Ikan Tuna', cat: 'Makanan Kering', price: 'Rp 45.000', emoji: '🐟' }, { name: 'Keripik Kulit Ikan', cat: 'Camilan', price: 'Rp 28.000', emoji: '🍘' }, { name: 'Nugget Ikan Premium', cat: 'Frozen Food', price: 'Rp 38.000', emoji: '🍗' }, { name: 'Bakso Ikan', cat: 'Frozen Food', price: 'Rp 32.000', emoji: '🍡' }].map(p => (
              <div key={p.name} className="rounded-xl border border-slate-100 bg-white overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-20 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-3xl">{p.emoji}</div>
                <div className="p-2.5"><h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4><p className="text-[11px] text-slate-500">{p.cat}</p><p className="text-xs font-bold text-blue-600 mt-1.5">{p.price}</p></div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Row 2: Tren Omzet | Target vs Aktual | Informasi Program */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsChart title="Tren Omzet (Penjualan)" data={revenueTrendData} dataKey="revenue" xAxisKey="month" height={250} color="#8b5cf6" valueFormatter={(val) => `Rp ${val} Jt`} />

        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg text-slate-900 mb-4">Perbandingan Target vs Aktual (2025)</h3>
          <div className="flex gap-4 mb-4 text-xs"><span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-400 rounded"></span> Target</span><span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 rounded"></span> Aktual</span></div>
          <div className="h-[220px] flex items-end gap-1">
            {targetVsActualData.map((d, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-0.5"><div className="w-full flex gap-0.5 items-end h-[180px]"><div className="flex-1 bg-slate-200 rounded-t" style={{ height: `${(d.target / 550) * 100}%` }}></div><div className="flex-1 bg-blue-500 rounded-t" style={{ height: `${(d.aktual / 550) * 100}%` }}></div></div><span className="text-[9px] text-slate-400">{d.month.substring(0, 3)}</span></div>))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg text-slate-900 mb-6">Informasi Program</h3>
          <div className="relative"><div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
            <div className="flex flex-col gap-5">
              {programList.map((prog, i) => (<div key={i} className="flex items-start gap-4 relative"><div className={`w-6 h-6 rounded-full ${prog.color} flex items-center justify-center shrink-0 z-10 shadow-sm`}>{prog.status === 'Aktif' ? <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> : prog.status === 'Selesai' ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Clock className="w-3 h-3 text-white" />}</div><div className="flex-1"><div className="flex justify-between items-start"><div><div className="text-sm font-semibold text-slate-800">{prog.name}</div><div className="text-xs text-slate-400 mt-0.5">{prog.period}</div></div><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${prog.badgeColor}`}>{prog.status}</span></div></div></div>))}
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
