"use client";
import React from 'react';
import { Plus, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import Link from 'next/link';

const products = [
  { id: 1, name: 'Abon Ikan Tuna', cat: 'Makanan Kering', price: 'Rp 45.000', stock: 150, emoji: '🐟', status: 'Aktif' },
  { id: 2, name: 'Keripik Kulit Ikan', cat: 'Camilan', price: 'Rp 28.000', stock: 200, emoji: '🍘', status: 'Aktif' },
  { id: 3, name: 'Nugget Ikan Premium', cat: 'Frozen Food', price: 'Rp 38.000', stock: 80, emoji: '🍗', status: 'Aktif' },
  { id: 4, name: 'Bakso Ikan', cat: 'Frozen Food', price: 'Rp 32.000', stock: 120, emoji: '🍡', status: 'Aktif' },
  { id: 5, name: 'Otak-otak Ikan', cat: 'Frozen Food', price: 'Rp 25.000', stock: 95, emoji: '🥟', status: 'Aktif' },
  { id: 6, name: 'Sambal Ikan Roa', cat: 'Bumbu', price: 'Rp 35.000', stock: 60, emoji: '🌶️', status: 'Aktif' },
  { id: 7, name: 'Ikan Asin Premium', cat: 'Makanan Kering', price: 'Rp 50.000', stock: 45, emoji: '🐡', status: 'Draft' },
  { id: 8, name: 'Kerupuk Ikan', cat: 'Camilan', price: 'Rp 18.000', stock: 300, emoji: '🍪', status: 'Aktif' },
];

export default function ProdukPage() {
  return (
    <>
      <div className="flex justify-between items-end mb-8"><div><h1 className="text-2xl font-bold text-slate-900">Produk Saya</h1><p className="text-slate-500 mt-1">Kelola katalog produk usaha Anda ({products.length} produk)</p></div>
        <Link href="/workspace/produk/tambah"><GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /> Tambah Produk</GlowButton></Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map(p => (
          <GlassCard key={p.id} className="p-0 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-4xl relative">
              {p.emoji}
              <div className="absolute top-2 right-2"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{p.status}</span></div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button className="p-2 bg-white rounded-full shadow-lg text-blue-600"><Edit3 className="w-4 h-4" /></button>
                <button className="p-2 bg-white rounded-full shadow-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-4"><h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4><p className="text-xs text-slate-500 mt-0.5">{p.cat}</p><div className="flex justify-between items-center mt-2"><p className="text-sm font-bold text-blue-600">{p.price}</p><p className="text-xs text-slate-400">Stok: {p.stock}</p></div></div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
