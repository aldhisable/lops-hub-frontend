"use client";
import React, { useState } from 'react';
import { Download, Plus, MoreHorizontal } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { FilterChips } from '@/components/ui/filter-chips';
import { GlowButton } from '@/components/ui/glow-button';
import Link from 'next/link';

const data = [
  { id: 1, nama: 'Makassar Coffee', kota: 'Makassar', kelas: 'Silver', program: 'UMK Akselerator' },
  { id: 2, nama: 'Rumah Laut Sejahtera', kota: 'Makassar', kelas: 'Gold', program: 'UMK Akselerator' },
  { id: 3, nama: 'Tenun Bugis Indah', kota: 'Bone', kelas: 'Bronze', program: 'Maritimepreneur' },
  { id: 4, nama: 'Keripik Maros Jaya', kota: 'Maros', kelas: 'Silver', program: 'Maritimepreneur' },
  { id: 5, nama: 'Coklat Sulawesi', kota: 'Gowa', kelas: 'Platinum', program: 'Gedor Ekspor' },
  { id: 6, nama: 'Bandeng Presto Parepare', kota: 'Parepare', kelas: 'Gold', program: 'UMK Akselerator' },
];

export default function RegionalUMKM() {
  const [filter, setFilter] = useState('Semua Kelas');
  const filtered = data.filter(d => filter === 'Semua Kelas' || d.kelas === filter);
  const kc: Record<string, string> = { Platinum: 'bg-blue-100 text-blue-700', Gold: 'bg-amber-100 text-amber-700', Silver: 'bg-slate-200 text-slate-700', Bronze: 'bg-orange-100 text-orange-700' };
  return (
    <>
      <div className="flex justify-between items-end mb-8"><div><h1 className="text-2xl font-bold text-slate-900">UMKM Binaan Regional 4</h1><p className="text-slate-500 mt-1">Kelola {data.length} UMKM di wilayah Makassar & sekitarnya</p></div>
        <div className="flex gap-3"><button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50"><Download className="w-4 h-4" /> Export</button><GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /> Tambah UMKM</GlowButton></div>
      </div>
      <div className="mb-6"><FilterChips options={['Semua Kelas','Platinum','Gold','Silver','Bronze']} selectedOption={filter} onSelect={setFilter} /></div>
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left"><thead><tr className="border-b border-slate-100 bg-slate-50/50"><th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nama UMKM</th><th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Kota</th><th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Kelas</th><th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Program</th><th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th></tr></thead>
          <tbody>{filtered.map(u => (<tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="px-6 py-4 text-sm font-semibold text-slate-800">{u.nama}</td><td className="px-6 py-4 text-sm text-slate-500">{u.kota}</td><td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${kc[u.kelas]}`}>{u.kelas}</span></td><td className="px-6 py-4 text-sm text-slate-500">{u.program}</td><td className="px-6 py-4"><button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><MoreHorizontal className="w-4 h-4" /></button></td></tr>))}</tbody>
        </table>
      </GlassCard>
    </>
  );
}
