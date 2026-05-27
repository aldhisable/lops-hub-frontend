"use client";
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { RadarChart } from '@/components/ui/radar-chart';
import { AnalyticsChart } from '@/components/ui/analytics-chart';

const radarData = [
  { subject: 'Spread', A: 85, fullMark: 100 },
  { subject: 'Size', A: 78, fullMark: 100 },
  { subject: 'Sustain', A: 82, fullMark: 100 },
  { subject: 'Share', A: 76, fullMark: 100 },
  { subject: 'Supplier', A: 84, fullMark: 100 },
];

const monthlyData = [
  { month: 'Jan', orders: 45 }, { month: 'Feb', orders: 62 },
  { month: 'Mar', orders: 58 }, { month: 'Apr', orders: 78 },
  { month: 'Mei', orders: 95 },
];

export default function WorkspaceAnalytics() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Analytics Usaha</h1><p className="text-slate-500 mt-1">Insight dan analisis performa usaha Anda</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RadarChart title="Radar 5S (Skor Klasifikasi)" data={radarData} dataKey="A" angleKey="subject" color="#8b5cf6" height={300} />
        <AnalyticsChart title="Tren Pesanan Bulanan" data={monthlyData} dataKey="orders" xAxisKey="month" height={300} color="#3b82f6" />
      </div>
      <GlassCard className="p-6">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">Produk Terlaris</h3>
        <div className="flex flex-col gap-4">
          {[{ name: 'Abon Ikan Tuna', sold: 1250, pct: 35 }, { name: 'Keripik Kulit Ikan', sold: 980, pct: 27 }, { name: 'Nugget Ikan Premium', sold: 750, pct: 21 }, { name: 'Bakso Ikan', sold: 420, pct: 12 }].map(p => (
            <div key={p.name}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-700">{p.name}</span><span className="text-slate-500">{p.sold} terjual ({p.pct}%)</span></div><div className="w-full bg-slate-100 h-2 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.pct * 2.5}%` }}></div></div></div>
          ))}
        </div>
      </GlassCard>
    </>
  );
}
