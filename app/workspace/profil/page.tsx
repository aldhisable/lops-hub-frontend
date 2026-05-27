"use client";
import React from 'react';
import { Edit3, CheckCircle2, Phone, AtSign, Globe, MapPin, AlignLeft, ShoppingBag, Save } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

export default function ProfilUsaha() {
  return (
    <>
      <div className="flex justify-between items-end mb-8"><div><h1 className="text-2xl font-bold text-slate-900">Profil Usaha</h1><p className="text-slate-500 mt-1">Kelola informasi usaha Anda</p></div>
        <GlowButton variant="primary" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium"><Edit3 className="w-4 h-4" /> Edit Profil</GlowButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <GlassCard className="p-6 text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mx-auto border border-teal-300/50"><div className="text-teal-800 font-extrabold text-sm"><span className="text-2xl block">🌊</span>RUMAH<br/>LAUT</div></div>
            <h3 className="text-lg font-bold text-slate-900 mt-4 flex items-center justify-center gap-2">Rumah Laut Sejahtera <CheckCircle2 className="w-4 h-4 text-blue-500" /></h3>
            <div className="flex justify-center gap-2 mt-3"><span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Aktif</span><span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">🏆 Gold</span></div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3 text-sm text-left">
              <div className="flex items-center gap-3 text-slate-600"><Phone className="w-4 h-4 text-slate-400" /> 0812-3456-7890</div>
              <div className="flex items-center gap-3 text-slate-600"><AtSign className="w-4 h-4 text-slate-400" /> @rumahlaut.id</div>
              <div className="flex items-center gap-3 text-slate-600"><Globe className="w-4 h-4 text-slate-400" /> rumahlaut.id</div>
            </div>
          </GlassCard>
        </div>
        <div className="lg:col-span-8">
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Detail Usaha</h3>
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Nama UMKM</label><input defaultValue="Rumah Laut Sejahtera" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Kategori</label><input defaultValue="Makanan & Minuman" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Tahun Berdiri</label><input defaultValue="2021" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Jumlah Tenaga Kerja</label><input defaultValue="18" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
              </div>
              <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Alamat</label><textarea rows={2} defaultValue="Jl. Perintis Kemerdekaan No. 123, Makassar, Sulawesi Selatan 90241" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white resize-none" /></div>
              <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Deskripsi</label><textarea rows={3} defaultValue="Rumah Laut Sejahtera bergerak di bidang pengolahan hasil laut menjadi produk makanan beku berkualitas tinggi dengan bahan baku lokal." className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white resize-none" /></div>
              <div className="flex justify-end"><GlowButton variant="primary" className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Simpan</GlowButton></div>
            </form>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
