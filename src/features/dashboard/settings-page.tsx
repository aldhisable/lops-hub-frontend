"use client";

import React from 'react';
import { User, Bell, Shield, Palette, Globe, Database, Save } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

const settingSections = [
  { icon: User, title: 'Profil Akun', desc: 'Ubah nama, email, foto profil, dan informasi akun lainnya' },
  { icon: Bell, title: 'Notifikasi', desc: 'Atur preferensi notifikasi email, push, dan in-app' },
  { icon: Shield, title: 'Keamanan', desc: 'Kelola password, autentikasi dua faktor, dan sesi aktif' },
  { icon: Palette, title: 'Tampilan', desc: 'Ubah tema, bahasa, dan preferensi tampilan dashboard' },
  { icon: Globe, title: 'Integrasi', desc: 'Kelola koneksi API, webhook, dan integrasi pihak ketiga' },
  { icon: Database, title: 'Data & Backup', desc: 'Export data, jadwal backup otomatis, dan manajemen storage' },
];

export function SettingsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500 mt-1">Konfigurasi sistem dan preferensi platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-4">
          <div className="flex flex-col gap-2">
            {settingSections.map((section, i) => (
              <button key={section.title} className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all ${i === 0 ? 'bg-blue-50 border border-blue-100 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                <div className={`p-2 rounded-lg ${i === 0 ? 'bg-blue-100' : 'bg-slate-100'}`}><section.icon className="w-5 h-5" /></div>
                <div><div className="text-sm font-semibold">{section.title}</div><div className="text-xs text-slate-500 mt-0.5">{section.desc}</div></div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-8">
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Profil Akun</h3>
            <form className="flex flex-col gap-6">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">AP</div>
                <div><button type="button" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Ganti Foto</button><div className="text-xs text-slate-400 mt-2">JPG, PNG. Maks 2MB</div></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Nama Lengkap</label><input type="text" defaultValue="Admin Pusat" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Email</label><input type="email" defaultValue="admin@pelindo-umkm.id" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">No. Telepon</label><input type="tel" defaultValue="0812-0000-0000" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Role</label><input type="text" defaultValue="Super Admin" disabled className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" /></div>
              </div>
              <div className="flex flex-col gap-2"><label className="text-sm font-medium text-slate-700">Bio</label><textarea rows={3} defaultValue="Administrator utama platform Pelindo UMKM" className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" /></div>
              <div className="flex justify-end"><GlowButton variant="primary" className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Simpan Perubahan</GlowButton></div>
            </form>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
