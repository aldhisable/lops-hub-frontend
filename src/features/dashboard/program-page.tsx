"use client";

import React, { useState } from 'react';
import { Plus, Download, MoreHorizontal, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { FilterChips } from '@/components/ui/filter-chips';
import { GlowButton } from '@/components/ui/glow-button';

const programs = [
  { id: 1, nama: 'Maritimepreneur Batch 5', status: 'Aktif', peserta: 642, mulai: '15 Jan 2025', selesai: '30 Des 2025', progress: 45 },
  { id: 2, nama: 'UMK Akselerator 2025', status: 'Aktif', peserta: 214, mulai: '01 Mar 2025', selesai: '31 Des 2025', progress: 30 },
  { id: 3, nama: 'Gedor Ekspor Gelombang 3', status: 'Pendaftaran', peserta: 57, mulai: '01 Jul 2025', selesai: '31 Des 2025', progress: 0 },
  { id: 4, nama: 'National Expo 2025', status: 'Selesai', peserta: 120, mulai: '05 Mei 2025', selesai: '08 Mei 2025', progress: 100 },
  { id: 5, nama: 'Maritimepreneur Batch 4', status: 'Selesai', peserta: 580, mulai: '01 Jan 2024', selesai: '31 Des 2024', progress: 100 },
];

export function ProgramPage() {
  const [filter, setFilter] = useState('Semua');

  const statusColor: Record<string, string> = {
    'Aktif': 'bg-blue-50 text-blue-700',
    'Selesai': 'bg-emerald-50 text-emerald-700',
    'Pendaftaran': 'bg-amber-50 text-amber-700',
  };

  const filtered = programs.filter(p => filter === 'Semua' || p.status === filter);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Program</h1>
          <p className="text-slate-500 mt-1">Kelola program pembinaan dan pelatihan UMKM</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors"><Download className="w-4 h-4" /> Export</button>
          <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /> Tambah Program</GlowButton>
        </div>
      </div>

      <div className="mb-6">
        <FilterChips options={['Semua', 'Aktif', 'Pendaftaran', 'Selesai']} selectedOption={filter} onSelect={setFilter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(prog => (
          <GlassCard key={prog.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[prog.status] || 'bg-slate-100 text-slate-600'}`}>{prog.status}</span>
              <button className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{prog.nama}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {prog.peserta} peserta</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {prog.mulai}</span>
            </div>
            <div className="mb-2 flex justify-between text-xs"><span className="text-slate-500">Progress</span><span className="font-semibold text-slate-700">{prog.progress}%</span></div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${prog.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${prog.progress}%` }}></div>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
