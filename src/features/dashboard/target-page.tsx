"use client";

import React from 'react';
import { Target, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnalyticsChart } from '@/components/ui/analytics-chart';

const kpiTargets = [
  { name: 'UMKM Terdaftar', target: 1500, actual: 1284, unit: 'UMKM' },
  { name: 'Total Omzet', target: 3.0, actual: 2.45, unit: 'Triliun' },
  { name: 'UMKM Naik Kelas', target: 250, actual: 186, unit: 'UMKM' },
  { name: 'UMKM Ekspor', target: 100, actual: 57, unit: 'UMKM' },
  { name: 'Rata-rata Growth', target: 25, actual: 23.8, unit: '%' },
  { name: 'Tenaga Kerja Terserap', target: 5000, actual: 3842, unit: 'orang' },
];

const monthlyProgress = [
  { month: 'Jan', target: 100, actual: 85 }, { month: 'Feb', target: 200, actual: 180 },
  { month: 'Mar', target: 350, actual: 320 }, { month: 'Apr', target: 500, actual: 480 },
  { month: 'Mei', target: 700, actual: 642 },
];

export function TargetKPIPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Target & KPI</h1>
        <p className="text-slate-500 mt-1">Monitoring pencapaian target nasional pembinaan UMKM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {kpiTargets.map(kpi => {
          const pct = Math.round((kpi.actual / kpi.target) * 100);
          const isOnTrack = pct >= 75;
          return (
            <GlassCard key={kpi.name} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-medium text-slate-500">{kpi.name}</h4>
                {isOnTrack ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-bold text-slate-900">{kpi.actual}</span>
                <span className="text-sm text-slate-400 mb-1">/ {kpi.target} {kpi.unit}</span>
              </div>
              <div className="mb-3 text-xs font-semibold" style={{ color: isOnTrack ? '#10b981' : '#f59e0b' }}>{pct}% tercapai</div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${isOnTrack ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <AnalyticsChart title="Progress Kumulatif Bulanan" subtitle="Pencapaian target vs aktual (UMKM Baru Terdaftar)" data={monthlyProgress} dataKey="actual" xAxisKey="month" color="#8b5cf6" height={350} />
    </>
  );
}
