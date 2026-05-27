"use client";
import React from 'react';
import { Save, Upload, ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import Link from 'next/link';

export default function TambahProduk() {
  return (
    <>
      <div className="flex justify-between items-end mb-8"><div><h1 className="text-2xl font-bold text-slate-900">Tambah Produk Baru</h1><p className="text-slate-500 mt-1">Tambahkan produk baru ke katalog usaha Anda</p></div>
        <Link href="/workspace/produk" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50"><ArrowLeft className="w-4 h-4" /> Kembali</Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <GlassCard className="p-8">
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Nama Produk *</label><input placeholder="Contoh: Abon Ikan Tuna" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Kategori *</label><select className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white"><option>Pilih Kategori</option><option>Makanan Kering</option><option>Frozen Food</option><option>Camilan</option><option>Bumbu</option></select></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Harga (Rp) *</label><input type="number" placeholder="45000" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Stok</label><input type="number" placeholder="100" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
              </div>
              <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Deskripsi Produk</label><textarea rows={4} placeholder="Jelaskan produk Anda..." className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white resize-none" /></div>
              <div className="flex justify-end gap-3"><button type="button" className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700">Simpan Draft</button><GlowButton variant="primary" className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Publikasikan</GlowButton></div>
            </form>
          </GlassCard>
        </div>
        <div className="lg:col-span-4">
          <GlassCard className="p-6"><h3 className="font-semibold text-slate-900 mb-4">Foto Produk</h3><div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 cursor-pointer transition-colors"><Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p className="text-sm text-slate-500">Klik atau drop file</p><p className="text-xs text-slate-400 mt-1">PNG, JPG max 5MB</p></div></GlassCard>
        </div>
      </div>
    </>
  );
}
