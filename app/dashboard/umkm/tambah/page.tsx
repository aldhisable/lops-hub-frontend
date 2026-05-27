"use client";

import React from 'react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import Link from 'next/link';

export default function TambahUMKM() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah UMKM Baru</h1>
          <p className="text-slate-500 mt-1">Daftarkan UMKM baru ke dalam sistem pembinaan</p>
        </div>
        <Link href="/dashboard/umkm" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Informasi Usaha</h3>
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Nama UMKM *</label><input type="text" placeholder="Contoh: Rumah Laut Sejahtera" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Nama Owner *</label><input type="text" placeholder="Nama lengkap pemilik" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Kategori Usaha *</label><select className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"><option>Pilih Kategori</option><option>Makanan & Minuman</option><option>Fashion</option><option>Kerajinan</option><option>Agrikultur</option><option>Teknologi</option></select></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Tahun Berdiri</label><input type="number" placeholder="2021" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Kota / Kabupaten *</label><input type="text" placeholder="Nama kota" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Provinsi *</label><select className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"><option>Pilih Provinsi</option><option>Jawa Timur</option><option>Jawa Barat</option><option>Jawa Tengah</option><option>Sulawesi Selatan</option><option>Nusa Tenggara Timur</option></select></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">No. Telepon</label><input type="tel" placeholder="0812-xxxx-xxxx" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Email</label><input type="email" placeholder="email@umkm.id" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
              </div>
              <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Alamat Lengkap</label><textarea rows={3} placeholder="Jl. Perintis Kemerdekaan No. 123..." className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" /></div>
              <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Deskripsi Usaha</label><textarea rows={4} placeholder="Jelaskan tentang usaha yang dijalankan..." className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" /></div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Batal</button>
                <GlowButton variant="primary" className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Simpan UMKM</GlowButton>
              </div>
            </form>
          </GlassCard>
        </div>

        <div className="lg:col-span-4">
          <GlassCard className="p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Upload Logo</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Klik atau drop file</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG max 2MB</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Program Awal</h3>
            <div className="flex flex-col gap-3">
              {['Maritimepreneur', 'UMK Akselerator', 'Gedor Ekspor'].map(p => (
                <label key={p} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-700">{p}</span>
                </label>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
