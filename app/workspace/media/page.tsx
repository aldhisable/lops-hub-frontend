"use client";
import React from 'react';
import { Upload, Eye, Download, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

const items = [
  { name: 'Foto Produk Abon Tuna.jpg', size: '2.4 MB', date: '12 Mei 2025', emoji: '📸' },
  { name: 'Video Proses Produksi.mp4', size: '45 MB', date: '10 Mei 2025', emoji: '🎬' },
  { name: 'Foto Booth Expo.jpg', size: '3.1 MB', date: '06 Mei 2025', emoji: '📸' },
  { name: 'Logo UMKM HD.png', size: '0.8 MB', date: '25 Apr 2025', emoji: '📸' },
];

export default function WorkspaceMedia() {
  return (
    <>
      <div className="flex justify-between items-end mb-8"><div><h1 className="text-2xl font-bold text-slate-900">Media & Galeri</h1><p className="text-slate-500 mt-1">Kelola foto dan video usaha Anda</p></div>
        <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"><Upload className="w-4 h-4" /> Upload</GlowButton>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer min-h-[200px]"><Upload className="w-8 h-8 mb-2" /><span className="text-sm font-medium">Drop file</span></div>
        {items.map((m, i) => (
          <GlassCard key={i} className="p-0 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
            <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-5xl relative">{m.emoji}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button className="p-2 bg-white rounded-full shadow-lg text-slate-700"><Eye className="w-4 h-4" /></button>
                <button className="p-2 bg-white rounded-full shadow-lg text-slate-700"><Download className="w-4 h-4" /></button>
                <button className="p-2 bg-white rounded-full shadow-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-3"><h4 className="text-xs font-bold text-slate-900 truncate">{m.name}</h4><div className="flex justify-between mt-1"><span className="text-[11px] text-slate-400">{m.size}</span><span className="text-[11px] text-slate-400">{m.date}</span></div></div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
