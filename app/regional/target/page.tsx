"use client";
import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const kpis = [
  { name: 'UMKM Terdaftar', target: 450, actual: 382, unit: 'UMKM' },
  { name: 'Total Omzet Regional', target: 100, actual: 86.54, unit: 'Miliar' },
  { name: 'UMKM Naik Kelas', target: 50, actual: 38, unit: 'UMKM' },
  { name: 'UMKM Ekspor', target: 20, actual: 12, unit: 'UMKM' },
  { name: 'Rata-rata Growth', target: 25, actual: 23.8, unit: '%' },
  { name: 'Tenaga Kerja', target: 1500, actual: 1180, unit: 'orang' },
];

export default function RegionalTarget() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Target & KPI Regional 4</h1><p className="text-slate-500 mt-1">Pencapaian target wilayah Makassar</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {kpis.map(k => { const pct = Math.round((k.actual/k.target)*100); const ok = pct >= 75; return (
          <GlassCard key={k.name} className="p-6"><div className="flex justify-between items-start mb-4"><h4 className="text-sm font-medium text-slate-500">{k.name}</h4>{ok ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}</div><div className="flex items-end gap-2 mb-1"><span className="text-3xl font-bold text-slate-900">{k.actual}</span><span className="text-sm text-slate-400 mb-1">/ {k.target} {k.unit}</span></div><div className="mb-3 text-xs font-semibold" style={{color:ok?'#10b981':'#f59e0b'}}>{pct}% tercapai</div><div className="w-full bg-slate-100 h-2.5 rounded-full"><div className={`h-full rounded-full ${ok?'bg-emerald-500':'bg-amber-500'}`} style={{width:`${Math.min(pct,100)}%`}}></div></div></GlassCard>
        ); })}
      </div>
    </>
  );
}
