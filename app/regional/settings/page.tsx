"use client";
import React from 'react';
import { Save } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

export default function RegionalSettings() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1><p className="text-slate-500 mt-1">Konfigurasi akun dan preferensi regional</p></div>
      <GlassCard className="p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Profil Akun</h3>
        <form className="flex flex-col gap-6">
          <div className="flex items-center gap-6 mb-4"><div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">AR</div><div><button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Ganti Foto</button></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Nama</label><input defaultValue="Admin Regional" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
            <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Email</label><input defaultValue="admin.reg4@pelindo.co.id" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
            <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Regional</label><input defaultValue="Regional 4 - Makassar" disabled className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" /></div>
            <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Role</label><input defaultValue="Admin Regional" disabled className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" /></div>
          </div>
          <div className="flex justify-end"><GlowButton variant="primary" className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Simpan</GlowButton></div>
        </form>
      </GlassCard>
    </>
  );
}
