"use client";

import React, { useState } from 'react';
import { Upload, Grid, List, Image as ImageIcon, Film, FileText, Eye, Download, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { FilterChips } from '@/components/ui/filter-chips';
import { GlowButton } from '@/components/ui/glow-button';

const mediaItems = [
  { id: 1, name: 'Foto Produk Abon Tuna.jpg', type: 'Foto', size: '2.4 MB', date: '12 Mei 2025', emoji: '📸' },
  { id: 2, name: 'Video Proses Produksi.mp4', type: 'Video', size: '45 MB', date: '10 Mei 2025', emoji: '🎬' },
  { id: 3, name: 'Brosur UMKM Expo.pdf', type: 'Dokumen', size: '1.2 MB', date: '08 Mei 2025', emoji: '📄' },
  { id: 4, name: 'Foto Booth National Expo.jpg', type: 'Foto', size: '3.1 MB', date: '06 Mei 2025', emoji: '📸' },
  { id: 5, name: 'Katalog Produk 2025.pdf', type: 'Dokumen', size: '5.6 MB', date: '01 Mei 2025', emoji: '📄' },
  { id: 6, name: 'Testimonial Customer.mp4', type: 'Video', size: '28 MB', date: '28 Apr 2025', emoji: '🎬' },
  { id: 7, name: 'Logo UMKM HD.png', type: 'Foto', size: '0.8 MB', date: '25 Apr 2025', emoji: '📸' },
  { id: 8, name: 'Infografis Omzet Q1.png', type: 'Foto', size: '1.5 MB', date: '20 Apr 2025', emoji: '📸' },
];

export function MediaPage() {
  const [filter, setFilter] = useState('Semua');
  const filtered = mediaItems.filter(m => filter === 'Semua' || m.type === filter);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media & Galeri</h1>
          <p className="text-slate-500 mt-1">Kelola galeri produk, dokumentasi, dan aset media UMKM</p>
        </div>
        <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"><Upload className="w-4 h-4" /> Upload Media</GlowButton>
      </div>

      <div className="mb-6">
        <FilterChips options={['Semua', 'Foto', 'Video', 'Dokumen']} selectedOption={filter} onSelect={setFilter} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Upload Card */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer min-h-[200px]">
          <Upload className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Drop file atau klik</span>
          <span className="text-xs mt-1">JPG, PNG, MP4, PDF</span>
        </div>

        {filtered.map(item => (
          <GlassCard key={item.id} className="p-0 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
            <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-5xl relative">
              {item.emoji}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button className="p-2 bg-white rounded-full shadow-lg text-slate-700 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                <button className="p-2 bg-white rounded-full shadow-lg text-slate-700 hover:text-blue-600"><Download className="w-4 h-4" /></button>
                <button className="p-2 bg-white rounded-full shadow-lg text-slate-700 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[11px] text-slate-400">{item.size}</span>
                <span className="text-[11px] text-slate-400">{item.date}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
