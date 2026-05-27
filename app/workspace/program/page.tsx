"use client";
import React from 'react';
import { CheckCircle2, Clock, Folders } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const programs = [
  { name: 'Maritimepreneur Batch 5', period: '15 Jan 2025 - 30 Des 2025', status: 'Selesai', progress: 100, desc: 'Program pemberdayaan UMKM maritim untuk meningkatkan daya saing produk' },
  { name: 'UMK Akselerator 2025', period: '01 Jan 2025 - 31 Des 2026', status: 'Aktif', progress: 30, desc: 'Akselerasi pertumbuhan usaha melalui mentoring dan akses pasar' },
  { name: 'National Expo 2025', period: '05 Mei 2025 - 08 Mei 2025', status: 'Selesai', progress: 100, desc: 'Pameran nasional produk UMKM unggulan Indonesia' },
  { name: 'Gedor Ekspor Gelombang 3', period: 'Belum Bergabung', status: 'Tersedia', progress: 0, desc: 'Program pendampingan ekspor untuk UMKM yang siap menembus pasar internasional' },
];

export default function ProgramSaya() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Program Saya</h1><p className="text-slate-500 mt-1">Program pembinaan yang sedang dan telah Anda ikuti</p></div>
      <div className="flex flex-col gap-6">
        {programs.map((prog, i) => (
          <GlassCard key={i} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${prog.status === 'Aktif' ? 'bg-blue-50' : prog.status === 'Selesai' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                {prog.status === 'Aktif' ? <Folders className="w-6 h-6 text-blue-600" /> : prog.status === 'Selesai' ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Clock className="w-6 h-6 text-slate-400" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1"><h4 className="text-lg font-bold text-slate-900">{prog.name}</h4><span className={`px-3 py-1 rounded-full text-xs font-semibold ${prog.status === 'Aktif' ? 'bg-blue-50 text-blue-700' : prog.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{prog.status}</span></div>
                <p className="text-sm text-slate-500">{prog.desc}</p>
                <p className="text-xs text-slate-400 mt-1">{prog.period}</p>
                {prog.progress > 0 && <div className="mt-3"><div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Progress</span><span className="font-semibold text-slate-700">{prog.progress}%</span></div><div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className={`h-full rounded-full ${prog.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${prog.progress}%` }}></div></div></div>}
              </div>
              <button className={`px-5 py-2.5 rounded-lg text-sm font-semibold shrink-0 transition-colors ${prog.status === 'Tersedia' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>{prog.status === 'Tersedia' ? 'Daftar Sekarang' : 'Lihat Detail'}</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
