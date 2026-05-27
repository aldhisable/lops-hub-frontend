"use client";

import React, { useState } from 'react';
import { Plus, MoreHorizontal, Shield, Mail, Search } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { FilterChips } from '@/components/ui/filter-chips';

const users = [
  { id: 1, nama: 'Admin Pusat', email: 'admin@pelindo-umkm.id', role: 'Super Admin', status: 'Aktif', lastLogin: '17 Mei 2025, 09:30', avatar: 'AP' },
  { id: 2, nama: 'Budi Santoso', email: 'budi.s@pelindo.co.id', role: 'Regional Admin', status: 'Aktif', lastLogin: '16 Mei 2025, 14:20', avatar: 'BS' },
  { id: 3, nama: 'Siti Aisyah', email: 'siti.a@rumahlaut.id', role: 'UMKM Owner', status: 'Aktif', lastLogin: '15 Mei 2025, 10:45', avatar: 'SA' },
  { id: 4, nama: 'Dewi Kartika', email: 'dewi.k@pelindo.co.id', role: 'Mentor', status: 'Aktif', lastLogin: '14 Mei 2025, 08:00', avatar: 'DK' },
  { id: 5, nama: 'Rudi Hermawan', email: 'rudi.h@pelindo.co.id', role: 'Regional Admin', status: 'Nonaktif', lastLogin: '01 Apr 2025, 16:30', avatar: 'RH' },
];

const roleColor: Record<string, string> = {
  'Super Admin': 'bg-purple-100 text-purple-700',
  'Regional Admin': 'bg-blue-100 text-blue-700',
  'UMKM Owner': 'bg-emerald-100 text-emerald-700',
  'Mentor': 'bg-amber-100 text-amber-700',
};

export function UsersPage() {
  const [filter, setFilter] = useState('Semua');
  const filtered = users.filter(u => filter === 'Semua' || u.role === filter);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-slate-500 mt-1">Kelola akses dan peran pengguna platform</p>
        </div>
        <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /> Tambah Pengguna</GlowButton>
      </div>

      <div className="mb-6">
        <FilterChips options={['Semua', 'Super Admin', 'Regional Admin', 'UMKM Owner', 'Mentor']} selectedOption={filter} onSelect={setFilter} />
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Pengguna</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Login Terakhir</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
          </tr></thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">{user.avatar}</div>
                    <div><div className="text-sm font-semibold text-slate-900">{user.nama}</div><div className="text-xs text-slate-500">{user.email}</div></div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor[user.role] || 'bg-slate-100 text-slate-600'}`}>{user.role}</span></td>
                <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${user.status === 'Aktif' ? 'text-emerald-600' : 'text-slate-400'}`}><span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>{user.status}</span></td>
                <td className="px-6 py-4 text-sm text-slate-500">{user.lastLogin}</td>
                <td className="px-6 py-4"><button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><MoreHorizontal className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}
