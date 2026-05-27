"use client";
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const reports = [
  { name: 'Laporan Omzet Mei 2025', date: '17 Mei 2025', type: 'Bulanan' },
  { name: 'Laporan Omzet Apr 2025', date: '01 Mei 2025', type: 'Bulanan' },
  { name: 'Laporan Keuangan Q1 2025', date: '15 Apr 2025', type: 'Kuartal' },
  { name: 'Laporan Tahunan 2024', date: '15 Jan 2025', type: 'Tahunan' },
];

export default function WorkspaceLaporan() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Laporan Saya</h1><p className="text-slate-500 mt-1">Unduh laporan kinerja usaha Anda</p></div>
      <div className="flex flex-col gap-4">
        {reports.map((r, i) => (
          <GlassCard key={i} className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-600" /></div>
            <div className="flex-1"><h4 className="text-sm font-bold text-slate-900">{r.name}</h4><p className="text-xs text-slate-400 mt-0.5">{r.date}</p></div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">{r.type}</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"><Download className="w-4 h-4" /> Unduh</button>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
