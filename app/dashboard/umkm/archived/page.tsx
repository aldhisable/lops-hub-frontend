"use client";

import React from 'react';
import { Archive, RotateCcw, Trash2, Eye } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';

const archivedData = [
  { id: 30, nama: 'Roti Manis Nusantara', kota: 'Bandung', provinsi: 'Jawa Barat', alasan: 'Tidak aktif > 12 bulan', tanggal: '01 Jan 2025' },
  { id: 31, nama: 'Keripik Singkong Pak Joko', kota: 'Malang', provinsi: 'Jawa Timur', alasan: 'Usaha tutup permanen', tanggal: '15 Feb 2025' },
  { id: 32, nama: 'Tas Rajut Mama Rosa', kota: 'Ambon', provinsi: 'Maluku', alasan: 'Request pemilik', tanggal: '20 Mar 2025' },
];

export default function ArchivedUMKM() {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900">UMKM Archived</h1>
          <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-sm font-semibold">{archivedData.length}</span>
        </div>
        <p className="text-slate-500">UMKM yang telah diarsipkan atau dinon-aktifkan dari sistem</p>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">UMKM</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Lokasi</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Alasan Arsip</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
          </tr></thead>
          <tbody>
            {archivedData.map(umkm => (
              <tr key={umkm.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"><Archive className="w-4 h-4 text-slate-400" /></div>
                    <span className="text-sm font-semibold text-slate-700">{umkm.nama}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{umkm.kota}, {umkm.provinsi}</td>
                <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{umkm.alasan}</span></td>
                <td className="px-6 py-4 text-sm text-slate-500">{umkm.tanggal}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Lihat"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Restore"><RotateCcw className="w-4 h-4" /></button>
                    <button className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Hapus Permanen"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}
