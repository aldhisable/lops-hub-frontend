"use client";

import React from 'react';
import { Users, PieChart, TrendingUp, Download, Map, CheckCircle2, Clock, FileText, Award } from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlassCard } from '@/components/ui/glass-card';

const trendData = [
  { month: 'Jun 2024', revenue: 52 }, { month: 'Jul 2024', revenue: 56 },
  { month: 'Agu 2024', revenue: 60 }, { month: 'Sep 2024', revenue: 58 },
  { month: 'Okt 2024', revenue: 64 }, { month: 'Nov 2024', revenue: 68 },
  { month: 'Des 2024', revenue: 72 }, { month: 'Jan 2025', revenue: 70 },
  { month: 'Feb 2025', revenue: 74 }, { month: 'Mar 2025', revenue: 78 },
  { month: 'Apr 2025', revenue: 82 }, { month: 'Mei 2025', revenue: 86.54 },
];

const top5 = [
  { rank: 1, name: 'Kota Makassar', umkm: 92, omzet: 'Rp 24,8 M' },
  { rank: 2, name: 'Kab. Gowa', umkm: 65, omzet: 'Rp 15,6 M' },
  { rank: 3, name: 'Kab. Maros', umkm: 42, omzet: 'Rp 9,2 M' },
  { rank: 4, name: 'Kab. Bone', umkm: 41, omzet: 'Rp 8,7 M' },
  { rank: 5, name: 'Kota Parepare', umkm: 37, omzet: 'Rp 6,1 M' },
];

const topKategori = [
  { name: 'Makanan & Minuman', val: 'Rp 24,2 M', pct: '28,0%', w: '80%', emoji: '🍽️', color: 'bg-blue-500' },
  { name: 'Kerajinan', val: 'Rp 16,8 M', pct: '19,4%', w: '60%', emoji: '🎨', color: 'bg-purple-500' },
  { name: 'Fashion', val: 'Rp 12,7 M', pct: '14,7%', w: '45%', emoji: '👗', color: 'bg-blue-400' },
  { name: 'Perikanan', val: 'Rp 10,3 M', pct: '11,9%', w: '35%', emoji: '🐟', color: 'bg-cyan-500' },
  { name: 'Agrikultur', val: 'Rp 8,5 M', pct: '9,8%', w: '28%', emoji: '🌾', color: 'bg-emerald-500' },
];

const activities = [
  { title: 'UMKM "Makassar Coffee" berhasil naik kelas ke Silver', sub: 'Program UMK Akselerator', time: '2 jam lalu', color: 'bg-blue-500' },
  { title: 'Pendampingan Branding untuk 15 UMKM selesai', sub: 'Program Pendampingan', time: '5 jam lalu', color: 'bg-emerald-500' },
  { title: 'Verifikasi dokumen 8 UMKM baru', sub: 'Oleh Tim Verifikator', time: '1 hari lalu', color: 'bg-purple-500' },
  { title: 'Pelatihan Digital Marketing - Batch 3', sub: 'Selesai dilaksanakan', time: '2 hari lalu', color: 'bg-amber-500' },
];

export default function RegionalDashboard() {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
        <div>
          <p className="text-slate-500 text-sm">Selamat datang kembali,</p>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">Admin Regional 4 <span className="text-xl">🌏</span></h1>
          <p className="text-slate-500 mt-1">Berikut ringkasan perkembangan UMKM binaan di wilayah Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">📅 1 Jan 2025 - 31 Mei 2025</div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50"><Download className="w-4 h-4" /> Export Dashboard</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Total UMKM" value="382" icon={Users} iconBgClass="bg-purple-50" iconColorClass="text-purple-600" trend={{ value: 18.2, isPositive: true, label: "vs Apr 2025" }} sparklineData={[10, 15, 12, 18, 25, 30, 35]} />
        <KPICard title="Total Omzet (Penjualan)" value="Rp 86,54 M" icon={PieChart} iconBgClass="bg-blue-50" iconColorClass="text-blue-600" trend={{ value: 24.6, isPositive: true, label: "vs Apr 2025" }} sparklineData={[20, 22, 28, 35, 42, 50, 60]} />
        <KPICard title="Rata-rata Growth" value="23,8%" icon={TrendingUp} iconBgClass="bg-cyan-50" iconColorClass="text-cyan-600" trend={{ value: 6.1, isPositive: true, label: "vs Apr 2025" }} sparklineData={[10, 12, 15, 16, 18, 20, 24]} />
      </div>

      {/* Map + Pipeline + Klasifikasi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Peta + Top 5 */}
        <div className="lg:col-span-8">
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-slate-900">Peta Sebaran UMKM - Regional 4 (Makassar)</h3>
              <div className="flex bg-slate-100 p-1 rounded-lg"><button className="px-4 py-1.5 text-sm font-medium text-slate-500">Provinsi</button><button className="px-4 py-1.5 text-sm font-medium bg-white rounded-md shadow-sm text-slate-800">Kabupaten/Kota</button></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl h-[280px] flex items-center justify-center relative overflow-hidden border border-blue-100">
                <Map className="w-12 h-12 text-blue-300 opacity-30 absolute" />
                {/* Simulated dots */}
                <div className="absolute top-[25%] left-[35%] w-8 h-8 rounded-full bg-blue-400/30 flex items-center justify-center"><span className="text-[10px] font-bold text-blue-700">42</span></div>
                <div className="absolute top-[20%] right-[30%] w-7 h-7 rounded-full bg-blue-500/30 flex items-center justify-center"><span className="text-[10px] font-bold text-blue-700">36</span></div>
                <div className="absolute top-[45%] left-[50%] w-10 h-10 rounded-full bg-blue-600/40 flex items-center justify-center"><span className="text-xs font-bold text-blue-800">68</span></div>
                <div className="absolute bottom-[25%] left-[30%] w-6 h-6 rounded-full bg-blue-400/25 flex items-center justify-center"><span className="text-[9px] font-bold text-blue-700">35</span></div>
                <div className="absolute bottom-[30%] right-[25%] w-5 h-5 rounded-full bg-blue-300/25 flex items-center justify-center"><span className="text-[9px] font-bold text-blue-700">37</span></div>
                <div className="absolute bottom-[15%] left-[20%] w-9 h-9 rounded-full bg-blue-500/30 flex items-center justify-center"><span className="text-[10px] font-bold text-blue-700">92</span></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[10px] text-slate-500">
                  <span>Jumlah UMKM</span>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-200"></span> Rendah</div>
                  <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-blue-200 via-blue-400 to-blue-700"></div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-700"></span> Tinggi</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Top 5 Kabupaten/Kota</h4>
                <div className="flex flex-col gap-3">
                  {top5.map(t => (
                    <div key={t.rank} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center">{t.rank}</span>
                      <span className="flex-1 text-sm font-medium text-slate-800">{t.name}</span>
                      <span className="text-sm text-slate-500">{t.umkm} <span className="text-slate-400">UMKM</span></span>
                      <span className="text-sm font-semibold text-slate-900 w-24 text-right">{t.omzet}</span>
                    </div>
                  ))}
                </div>
                <a href="/regional/peta" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">Lihat Semua Wilayah →</a>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Pipeline + Klasifikasi */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-slate-900">Pipeline Program</h3><a href="/regional/program" className="text-xs font-semibold text-blue-600">Lihat Detail</a></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[100%] h-16 bg-blue-500 rounded-t-xl flex justify-between items-center px-5 text-white" style={{clipPath:'polygon(0 0,100% 0,95% 100%,5% 100%)'}}><div><div className="text-[10px] opacity-80">Maritimepreneur</div><div className="font-black text-3xl tracking-tight">126</div></div><div className="text-xs opacity-90">(50,0%)</div></div>
              <div className="w-[85%] h-16 bg-purple-500 flex justify-between items-center px-5 text-white" style={{clipPath:'polygon(0 0,100% 0,90% 100%,10% 100%)'}}><div><div className="text-[10px] opacity-80">UMK Akselerator</div><div className="font-black text-3xl tracking-tight">86</div></div><div className="text-xs opacity-90">(34,1%)</div></div>
              <div className="w-[70%] h-16 bg-amber-500 rounded-b-xl flex justify-between items-center px-5 text-white shadow-lg shadow-amber-500/20" style={{clipPath:'polygon(0 0,100% 0,85% 100%,15% 100%)'}}><div><div className="text-[10px] opacity-80">Gedor Ekspor</div><div className="font-black text-3xl tracking-tight">40</div></div><div className="text-xs opacity-90">(15,9%)</div></div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-sm"><span className="text-slate-500">Conversion Overall</span><span className="text-blue-600 font-black text-2xl">11,2%</span></div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-slate-900">Distribusi Klasifikasi UMKM</h3><a href="/regional/klasifikasi" className="text-xs font-semibold text-blue-600">Lihat Detail</a></div>
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full border-[12px] border-slate-200 relative flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-[12px] border-blue-600" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 30%)' }}></div>
                <div className="absolute inset-0 rounded-full border-[12px] border-amber-400" style={{ clipPath: 'polygon(50% 50%, 100% 30%, 100% 80%)' }}></div>
                <div className="absolute inset-0 rounded-full border-[12px] border-slate-400" style={{ clipPath: 'polygon(50% 50%, 100% 80%, 30% 100%, 0 50%)' }}></div>
                <div className="text-center"><div className="text-3xl font-black text-slate-900 tracking-tight">382</div><div className="text-[9px] text-slate-500">Total UMKM</div></div>
              </div>
              <div className="flex flex-col gap-2 flex-1 text-sm">
                {[{ c: 'bg-blue-600', l: 'Platinum', v: '32 (8,4%)' }, { c: 'bg-amber-400', l: 'Gold', v: '84 (22,0%)' }, { c: 'bg-slate-400', l: 'Silver', v: '146 (38,2%)' }, { c: 'bg-orange-400', l: 'Bronze', v: '120 (31,4%)' }].map(x => (
                  <div key={x.l} className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${x.c}`}></span><span className="text-slate-600 flex-1">{x.l}</span><span className="font-bold text-slate-800">{x.v}</span></div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Row 3: Tren Omzet | Top Kategori | Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsChart title="Tren Omzet (Penjualan)" subtitle="12 Bulan Terakhir" data={trendData} dataKey="revenue" xAxisKey="month" height={280} color="#3b82f6" valueFormatter={(v) => `Rp ${v} M`} />

        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-5"><h3 className="font-semibold text-slate-900">Top Kategori (Omzet Tertinggi)</h3><a href="#" className="text-xs font-semibold text-blue-600">Lihat Semua</a></div>
          <div className="flex flex-col gap-4">
            {topKategori.map(k => (
              <div key={k.name} className="flex items-center gap-3">
                <span className="text-lg">{k.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-700">{k.name}</span><span className="text-slate-400">{k.pct}</span></div>
                  <div className="flex items-center gap-2"><div className="flex-1 bg-slate-100 h-2 rounded-full"><div className={`h-full ${k.color} rounded-full`} style={{ width: k.w }}></div></div><span className="text-sm font-semibold text-slate-900 w-20 text-right">{k.val}</span></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-5"><h3 className="font-semibold text-slate-900">Aktivitas Terbaru</h3><a href="#" className="text-xs font-semibold text-blue-600">Lihat Semua</a></div>
          <div className="relative border-l-2 border-slate-100 ml-2">
            {activities.map((a, i) => (
              <div key={i} className="mb-5 ml-5 relative last:mb-0">
                <div className={`absolute -left-[27px] w-3 h-3 rounded-full ${a.color} border-2 border-white`}></div>
                <h4 className="text-sm font-semibold text-slate-900 leading-snug">{a.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{a.sub}</p>
                <p className="text-[11px] text-slate-400 mt-1">{a.time}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
