"use client";
import React from 'react';
import { Upload, Eye, Download } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

const docs = [
  { name: 'NIB (Nomor Induk Berusaha)', date: '12 Jan 2025', status: 'Terverifikasi', icon: '📋' },
  { name: 'NPWP Usaha', date: '12 Jan 2025', status: 'Terverifikasi', icon: '📄' },
  { name: 'Sertifikat Halal MUI', date: '05 Mar 2025', status: 'Terverifikasi', icon: '✅' },
  { name: 'BPOM MD Registration', date: '20 Feb 2025', status: 'Terverifikasi', icon: '🏥' },
  { name: 'Sertifikat Maritimepreneur', date: '30 Des 2025', status: 'Menunggu', icon: '🎓' },
  { name: 'Laporan Keuangan 2024', date: '15 Jan 2025', status: 'Terverifikasi', icon: '📊' },
];

export default function DokumenPage() {
  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div><h1 className="text-2xl font-bold text-slate-900">Dokumen Saya</h1><p className="text-slate-500 mt-1">Kelola dokumen legalitas dan sertifikasi usaha</p></div>
        <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"><Upload className="w-4 h-4" /> Upload Dokumen</GlowButton>
      </div>
      <div className="flex flex-col gap-4">
        {docs.map((doc, i) => (
          <GlassCard key={i} className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100">{doc.icon}</div>
            <div className="flex-1"><h4 className="text-sm font-bold text-slate-900">{doc.name}</h4><p className="text-xs text-slate-400 mt-0.5">Diupload: {doc.date}</p></div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doc.status === 'Terverifikasi' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{doc.status}</span>
            <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Eye className="w-4 h-4" /></button>
            <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Download className="w-4 h-4" /></button>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
