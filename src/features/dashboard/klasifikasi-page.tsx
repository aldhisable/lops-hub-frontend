"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { FilterChips } from '@/components/ui/filter-chips';

const classifications = [
  { kelas: 'Platinum', jumlah: 68, persen: '5.3%', color: 'from-blue-600 to-blue-700', criteria: 'Omzet > 1M, Ekspor aktif, Sertifikasi lengkap', icon: '💎' },
  { kelas: 'Gold', jumlah: 286, persen: '22.3%', color: 'from-amber-500 to-amber-600', criteria: 'Omzet > 500Jt, Minimal 2 marketplace, SDM > 10', icon: '🏆' },
  { kelas: 'Silver', jumlah: 538, persen: '41.9%', color: 'from-slate-400 to-slate-500', criteria: 'Omzet > 100Jt, Memiliki NPWP & NIB, SDM > 3', icon: '🥈' },
  { kelas: 'Bronze', jumlah: 392, persen: '30.5%', color: 'from-orange-600 to-orange-700', criteria: 'UMKM baru terdaftar, Dalam proses pembinaan awal', icon: '🥉' },
];

const radarLabels = ['Spread', 'Size', 'Sustain', 'Share', 'Supplier'];

export function KlasifikasiPage() {
  const [filter, setFilter] = useState('Semua');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Klasifikasi UMKM</h1>
        <p className="text-slate-500 mt-1">Sistem penilaian dan pengelompokan UMKM berdasarkan 5S Framework</p>
      </div>

      {/* 5S Framework Explanation */}
      <GlassCard className="p-6 mb-8">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">Framework Penilaian 5S</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {radarLabels.map((label, i) => (
            <div key={label} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-lg mx-auto mb-2">{i + 1}</div>
              <div className="font-semibold text-slate-900 text-sm">{label}</div>
              <div className="text-xs text-slate-500 mt-1">{['Jangkauan pasar', 'Skala usaha', 'Keberlanjutan', 'Kontribusi sosial', 'Rantai pasok'][i]}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Classification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classifications.map(cls => (
          <GlassCard key={cls.kelas} className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`bg-gradient-to-r ${cls.color} p-6 text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-3xl">{cls.icon}</span>
                  <h3 className="text-2xl font-bold mt-2">{cls.kelas}</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{cls.jumlah}</div>
                  <div className="text-sm opacity-80">UMKM ({cls.persen})</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-sm font-medium text-slate-700 mb-2">Kriteria:</div>
              <p className="text-sm text-slate-500">{cls.criteria}</p>
              <button className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">Lihat Daftar UMKM →</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
