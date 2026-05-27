"use client";
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { RadarChart } from '@/components/ui/radar-chart';
import { AnalyticsChart } from '@/components/ui/analytics-chart';

const monthlyData = [{ month: 'Jan', revenue: 70 },{ month: 'Feb', revenue: 74 },{ month: 'Mar', revenue: 78 },{ month: 'Apr', revenue: 82 },{ month: 'Mei', revenue: 86.54 }];

export default function RegionalAnalytics() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Analytics Regional 4</h1><p className="text-slate-500 mt-1">Analisis mendalam performa wilayah</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AnalyticsChart title="Tren Omzet Regional" data={monthlyData} dataKey="revenue" xAxisKey="month" height={300} color="#3b82f6" valueFormatter={v => `Rp ${v} M`} />
        <GlassCard className="p-6"><h3 className="font-semibold text-lg text-slate-900 mb-4">Top Kategori</h3>
          <div className="flex flex-col gap-4">{[{n:'Makanan & Minuman',v:'Rp 24,2 M',w:'80%'},{n:'Kerajinan',v:'Rp 16,8 M',w:'60%'},{n:'Fashion',v:'Rp 12,7 M',w:'45%'},{n:'Perikanan',v:'Rp 10,3 M',w:'35%'}].map(k=>(<div key={k.n}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-700">{k.n}</span><span className="font-semibold text-slate-900">{k.v}</span></div><div className="w-full bg-slate-100 h-2 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width:k.w}}></div></div></div>))}</div>
        </GlassCard>
      </div>
    </>
  );
}
