"use client";
import React from 'react';
import { User, Bell, Shield, Save } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

export default function WorkspaceSettings() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1><p className="text-slate-500 mt-1">Kelola akun dan preferensi Anda</p></div>
      <GlassCard className="p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Profil Akun</h3>
        <form className="flex flex-col gap-6">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">SA</div>
            <div><button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Ganti Foto</button><div className="text-xs text-slate-400 mt-2">JPG, PNG. Maks 2MB</div></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Nama Lengkap</label><input defaultValue="Siti Aisyah" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
            <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Email</label><input defaultValue="siti.a@rumahlaut.id" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
            <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">No. Telepon</label><input defaultValue="0812-3456-7890" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white" /></div>
            <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Role</label><input defaultValue="UMK Binaan" disabled className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" /></div>
          </div>
          <div className="flex justify-end"><GlowButton variant="primary" className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Simpan</GlowButton></div>
        </form>
      </GlassCard>
    </>
  );
}
