"use client";
import React from 'react';
import { Map as MapIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

export default function RegionalPeta() {
  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Peta Sebaran Regional 4</h1><p className="text-slate-500 mt-1">Visualisasi sebaran UMKM di wilayah Makassar & sekitarnya</p></div>
      <GlassCard className="p-0 overflow-hidden min-h-[500px] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
          <div className="bg-white/90 p-6 rounded-2xl shadow-xl border border-slate-200 text-center max-w-sm"><MapIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-900 mb-2">Peta Regional</h3><p className="text-sm text-slate-500">Masukkan Google Maps API Key untuk aktivasi</p></div>
        </div>
      </GlassCard>
    </>
  );
}
