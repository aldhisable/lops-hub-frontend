"use client";
import React from 'react';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

export default function RegionalLaporan() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Laporan Regional 4</h1><p className="text-slate-500 mt-1">Buat dan unduh laporan kinerja UMKM wilayah Anda</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[{ title: 'Laporan Bulanan', desc: 'Rekap performa UMKM bulan berjalan', icon: FileText, color: 'bg-blue-50 text-blue-600' }, { title: 'Laporan Kuartal', desc: 'Ringkasan triwulanan Q1/Q2', icon: FileSpreadsheet, color: 'bg-emerald-50 text-emerald-600' }, { title: 'Laporan Tahunan', desc: 'Laporan komprehensif tahun berjalan', icon: FileText, color: 'bg-purple-50 text-purple-600' }].map(r => (
          <GlassCard key={r.title} className="p-6 hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 rounded-xl ${r.color} flex items-center justify-center mb-4`}><r.icon className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{r.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{r.desc}</p>
            <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium w-full justify-center"><Download className="w-4 h-4" /> Generate & Unduh</GlowButton>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
