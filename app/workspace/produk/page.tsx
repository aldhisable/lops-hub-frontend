"use client";
import React from 'react';
import { Plus, Edit3, ShoppingBag } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import Link from 'next/link';
import { useWorkspace } from '@/context/workspace-context';

function formatPrice(price: number) {
  return 'Rp ' + price.toLocaleString('id-ID');
}

export default function ProdukPage() {
  const { umkm, loading } = useWorkspace();
  const products = umkm?.products ?? [];

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produk Saya</h1>
          <p className="text-slate-500 mt-1">Kelola katalog produk usaha Anda ({loading ? '...' : products.length} produk)</p>
        </div>
        <Link href="/workspace/produk/tambah">
          <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> Tambah Produk
          </GlowButton>
        </Link>
      </div>

      {loading ? (
        <GlassCard className="p-12 flex items-center justify-center text-slate-400">Memuat produk...</GlassCard>
      ) : products.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
          <p className="text-sm">Belum ada produk yang terdaftar.</p>
          <Link href="/workspace/produk/tambah">
            <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mt-1">
              <Plus className="w-4 h-4" /> Tambah Produk Pertama
            </GlowButton>
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(p => (
            <GlassCard key={p.id} className="p-0 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-10 h-10 text-slate-300" />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {p.isActive ? 'Aktif' : 'Draft'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button className="p-2 bg-white rounded-full shadow-lg text-blue-600"><Edit3 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{p.category}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm font-bold text-blue-600">{formatPrice(p.price)}</p>
                  <p className="text-xs text-slate-400">Stok: {p.stock ?? 0}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </>
  );
}
