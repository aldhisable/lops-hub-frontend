"use client";
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const users = [
  { nama: 'Budi Santoso', email: 'budi.s@pelindo.co.id', role: 'Admin Regional', status: 'Aktif', avatar: 'BS' },
  { nama: 'Dewi Kartika', email: 'dewi.k@pelindo.co.id', role: 'Mentor', status: 'Aktif', avatar: 'DK' },
  { nama: 'Rina Purnama', email: 'rina.p@pelindo.co.id', role: 'Verifikator', status: 'Aktif', avatar: 'RP' },
];

export default function RegionalUsers() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Tim Regional 4</h1><p className="text-slate-500 mt-1">Kelola anggota tim di wilayah Anda</p></div>
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left"><thead><tr className="border-b border-slate-100 bg-slate-50/50"><th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nama</th><th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th><th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th><th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th></tr></thead>
          <tbody>{users.map(u => (<tr key={u.email} className="border-b border-slate-50 hover:bg-slate-50/50"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">{u.avatar}</div><div><div className="text-sm font-semibold text-slate-900">{u.nama}</div><div className="text-xs text-slate-500">{u.email}</div></div></div></td><td className="px-6 py-4 text-sm text-slate-600">{u.role}</td><td className="px-6 py-4"><span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{u.status}</span></td><td className="px-6 py-4"><button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><MoreHorizontal className="w-4 h-4" /></button></td></tr>))}</tbody>
        </table>
      </GlassCard>
    </>
  );
}
