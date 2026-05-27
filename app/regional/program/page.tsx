"use client";
import React from 'react';
import { Users, Calendar, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const programs = [
  { name: 'Maritimepreneur Batch 5', status: 'Aktif', peserta: 126, progress: 45 },
  { name: 'UMK Akselerator 2025', status: 'Aktif', peserta: 86, progress: 30 },
  { name: 'Gedor Ekspor Gel. 3', status: 'Pendaftaran', peserta: 40, progress: 0 },
  { name: 'National Expo 2025', status: 'Selesai', peserta: 28, progress: 100 },
];

export default function RegionalProgram() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Program Regional 4</h1><p className="text-slate-500 mt-1">Kelola program pembinaan UMKM di wilayah Anda</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map(p => (
          <GlassCard key={p.name} className="p-6"><div className="flex justify-between items-start mb-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'Aktif' ? 'bg-blue-50 text-blue-700' : p.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{p.status}</span><button className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><MoreHorizontal className="w-4 h-4" /></button></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{p.name}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4"><span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {p.peserta} peserta</span></div>
            <div className="mb-2 flex justify-between text-xs"><span className="text-slate-500">Progress</span><span className="font-semibold">{p.progress}%</span></div>
            <div className="w-full bg-slate-100 h-2 rounded-full"><div className={`h-full rounded-full ${p.progress===100?'bg-emerald-500':'bg-blue-500'}`} style={{width:`${p.progress}%`}}></div></div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
