"use client";

import React from 'react';
import { GraduationCap, Eye, MoreHorizontal, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';

const graduatedData = [
  { id: 20, nama: 'Sambal Bu Rudy', kota: 'Surabaya', provinsi: 'Jawa Timur', kelas: 'Platinum', graduated: 'Gedor Ekspor Batch 2', date: '30 Des 2024' },
  { id: 21, nama: 'Batik Srikandi', kota: 'Solo', provinsi: 'Jawa Tengah', kelas: 'Platinum', graduated: 'UMK Akselerator 2024', date: '31 Des 2024' },
  { id: 22, nama: 'Kopi Nusantara', kota: 'Makassar', provinsi: 'Sulawesi Selatan', kelas: 'Gold', graduated: 'Maritimepreneur Batch 4', date: '30 Des 2024' },
];

export default function GraduatedUMKM() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900">UMKM Graduated</h1>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">{graduatedData.length}</span>
        </div>
        <p className="text-slate-500">UMKM yang telah lulus dari program pembinaan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {graduatedData.map(umkm => (
          <GlassCard key={umkm.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center"><GraduationCap className="w-6 h-6 text-emerald-600" /></div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{umkm.kelas}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">{umkm.nama}</h4>
            <p className="text-sm text-slate-500">{umkm.kota}, {umkm.provinsi}</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-400 mb-1">Program Lulus</div>
              <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {umkm.graduated}</div>
              <div className="text-xs text-slate-400 mt-1">Tanggal: {umkm.date}</div>
            </div>
            <Link href={`/dashboard/umkm/${umkm.id}`} className="mt-4 block text-center py-2 bg-slate-50 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">Lihat Profil</Link>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
