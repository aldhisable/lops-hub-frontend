"use client";

import React from 'react';
import { Clock, CheckCircle2, XCircle, Eye, MoreHorizontal } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';

const pendingData = [
  { id: 10, nama: 'Warung Bahari Jaya', kota: 'Semarang', provinsi: 'Jawa Tengah', tanggal: '15 Mei 2025', owner: 'Ahmad Fauzi' },
  { id: 11, nama: 'Tenun Sari Indah', kota: 'Denpasar', provinsi: 'Bali', tanggal: '14 Mei 2025', owner: 'Ni Made Sari' },
  { id: 12, nama: 'Kopi Gunung Merapi', kota: 'Yogyakarta', provinsi: 'DI Yogyakarta', tanggal: '13 Mei 2025', owner: 'Bambang Sudrajat' },
  { id: 13, nama: 'Batik Pesisir Modern', kota: 'Pekalongan', provinsi: 'Jawa Tengah', tanggal: '12 Mei 2025', owner: 'Heni Kusuma' },
];

export default function PendingVerifikasi() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Pending Verifikasi</h1>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">{pendingData.length}</span>
        </div>
        <p className="text-slate-500">UMKM yang menunggu verifikasi dan persetujuan admin</p>
      </div>

      <div className="flex flex-col gap-4">
        {pendingData.map(umkm => (
          <GlassCard key={umkm.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"><Clock className="w-6 h-6 text-amber-500" /></div>
            <div className="flex-1">
              <h4 className="text-base font-bold text-slate-900">{umkm.nama}</h4>
              <p className="text-sm text-slate-500 mt-0.5">Owner: {umkm.owner} • {umkm.kota}, {umkm.provinsi}</p>
              <p className="text-xs text-slate-400 mt-1">Didaftarkan: {umkm.tanggal}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/dashboard/umkm/${umkm.id}`} className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Eye className="w-4 h-4" /></Link>
              <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Setujui</button>
              <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5"><XCircle className="w-4 h-4" /> Tolak</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
