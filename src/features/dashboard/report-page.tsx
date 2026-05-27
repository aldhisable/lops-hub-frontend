"use client";

import React from 'react';
import { FileText, FileSpreadsheet, FileIcon as FilePdf, Image as ImageIcon2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

export function ReportPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan & Export</h1>
          <p className="text-slate-500 mt-1">Buat dan unduh laporan kinerja UMKM secara dinamis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-6">Filter Laporan</h3>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Periode Tahun</label>
                <select className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"><option>2025</option><option>2026</option></select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Regional / Wilayah</label>
                <select className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"><option>Semua Wilayah (Nasional)</option><option>Regional 1</option><option>Regional 2</option></select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Klasifikasi UMK</label>
                <select className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"><option>Semua Klasifikasi</option><option>Platinum</option><option>Gold</option></select>
              </div>
              <GlowButton variant="primary" className="w-full mt-4 py-2.5 rounded-lg">Update Preview</GlowButton>
            </form>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-4">Export Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white hover:border-green-500 hover:bg-green-50 transition-colors group"><FileSpreadsheet className="w-8 h-8 text-slate-400 group-hover:text-green-600 mb-2 transition-colors" /><span className="text-sm font-semibold text-slate-700 group-hover:text-green-700">Excel</span><span className="text-xs text-slate-400">.xlsx</span></button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white hover:border-red-500 hover:bg-red-50 transition-colors group"><FilePdf className="w-8 h-8 text-slate-400 group-hover:text-red-600 mb-2 transition-colors" /><span className="text-sm font-semibold text-slate-700 group-hover:text-red-700">PDF</span><span className="text-xs text-slate-400">.pdf</span></button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-colors group col-span-2"><ImageIcon2 className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mb-2 transition-colors" /><span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Infographic</span><span className="text-xs text-slate-400">.png / .jpg</span></button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-8 flex flex-col">
          <GlassCard className="p-0 overflow-hidden flex-1 flex flex-col border border-slate-200 shadow-xl shadow-slate-200/50 min-h-[600px]">
            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
              <h3 className="font-semibold text-slate-700">Preview Laporan</h3>
              <div className="flex gap-2"><button className="w-3 h-3 rounded-full bg-red-400"></button><button className="w-3 h-3 rounded-full bg-amber-400"></button><button className="w-3 h-3 rounded-full bg-green-400"></button></div>
            </div>
            <div className="flex-1 bg-white p-12 flex flex-col items-center justify-center text-center">
              <div className="w-[80%] max-w-lg aspect-[1/1.4] bg-slate-50 border border-slate-200 shadow-sm mx-auto flex flex-col items-center justify-center p-8 text-slate-400">
                <FileText className="w-16 h-16 opacity-20 mb-4" />
                <h4 className="text-xl font-bold text-slate-600">Laporan Eksekutif Nasional</h4>
                <p className="mt-2 text-sm">Periode 2025</p>
                <div className="w-full mt-12 flex flex-col gap-4 px-8"><div className="h-4 bg-slate-200 rounded w-full"></div><div className="h-4 bg-slate-200 rounded w-[80%]"></div><div className="h-4 bg-slate-200 rounded w-[90%]"></div><div className="h-32 bg-slate-200 rounded w-full mt-4"></div></div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
