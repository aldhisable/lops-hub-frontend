"use client";
import React from 'react';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlassCard } from '@/components/ui/glass-card';

const data = [
  { month: 'Jan', revenue: 150 }, { month: 'Feb', revenue: 200 },
  { month: 'Mar', revenue: 180 }, { month: 'Apr', revenue: 250 },
  { month: 'Mei', revenue: 300 }, { month: 'Jun', revenue: 280 },
  { month: 'Jul', revenue: 350 }, { month: 'Agu', revenue: 380 },
  { month: 'Sep', revenue: 400 }, { month: 'Okt', revenue: 420 },
  { month: 'Nov', revenue: 460 }, { month: 'Des', revenue: 502 },
];

export default function OmzetPage() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Omzet & Growth</h1><p className="text-slate-500 mt-1">Pantau perkembangan omzet dan pertumbuhan usaha Anda</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[{ label: 'Omzet Bulan Ini', val: 'Rp 502 Jt', trend: '↑ 18,6%' }, { label: 'Omzet Tahun Ini', val: 'Rp 4,2 M', trend: '↑ 24%' }, { label: 'Growth Bulanan', val: '23,8%', trend: '↑ 6,1%' }, { label: 'Target Tercapai', val: '85%', trend: '↑ 12%' }].map(k => (
          <GlassCard key={k.label} className="p-5"><div className="text-xs text-slate-500 mb-1">{k.label}</div><div className="text-2xl font-bold text-slate-900">{k.val}</div><div className="text-xs font-semibold text-emerald-500 mt-1">{k.trend}</div></GlassCard>
        ))}
      </div>
      <AnalyticsChart title="Tren Omzet 12 Bulan Terakhir" data={data} dataKey="revenue" xAxisKey="month" height={350} color="#8b5cf6" valueFormatter={(v) => `Rp ${v} Jt`} />
    </>
  );
}
