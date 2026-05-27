"use client";
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';

const cls = [
  { kelas: 'Platinum', jumlah: 32, persen: '8,4%', color: 'from-blue-600 to-blue-700', icon: '💎', criteria: 'Omzet > 1M, Ekspor aktif' },
  { kelas: 'Gold', jumlah: 84, persen: '22,0%', color: 'from-amber-500 to-amber-600', icon: '🏆', criteria: 'Omzet > 500Jt, Marketplace aktif' },
  { kelas: 'Silver', jumlah: 146, persen: '38,2%', color: 'from-slate-400 to-slate-500', icon: '🥈', criteria: 'Omzet > 100Jt, NIB & NPWP' },
  { kelas: 'Bronze', jumlah: 120, persen: '31,4%', color: 'from-orange-600 to-orange-700', icon: '🥉', criteria: 'UMKM baru terdaftar' },
];

export default function RegionalKlasifikasi() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Klasifikasi UMKM Regional 4</h1><p className="text-slate-500 mt-1">Distribusi klasifikasi UMKM di wilayah Makassar</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cls.map(c => (
          <GlassCard key={c.kelas} className="p-0 overflow-hidden"><div className={`bg-gradient-to-r ${c.color} p-6 text-white`}><div className="flex justify-between"><div><span className="text-3xl">{c.icon}</span><h3 className="text-2xl font-bold mt-2">{c.kelas}</h3></div><div className="text-right"><div className="text-3xl font-bold">{c.jumlah}</div><div className="text-sm opacity-80">UMKM ({c.persen})</div></div></div></div><div className="p-6"><div className="text-sm font-medium text-slate-700 mb-1">Kriteria:</div><p className="text-sm text-slate-500">{c.criteria}</p><button className="mt-3 text-sm font-semibold text-blue-600">Lihat Daftar →</button></div></GlassCard>
        ))}
      </div>
    </>
  );
}
