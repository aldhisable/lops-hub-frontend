"use client";

import { Ship } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ExportRecordsManager } from '@/components/ui/export-records-manager';
import { useWorkspace } from '@/context/workspace-context';

export default function WorkspaceEksporPage() {
  const { umkm, loading } = useWorkspace();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <Ship className="w-7 h-7 text-blue-600" /> Ekspor
        </h1>
        <p className="text-slate-500 mt-1">Catat riwayat ekspor usaha Anda — mendukung program Gedor Ekspor</p>
      </div>

      <GlassCard className="p-6">
        {loading ? (
          <div className="text-sm text-slate-400 py-10 text-center">Memuat...</div>
        ) : umkm ? (
          <ExportRecordsManager umkmId={umkm.id} canEdit />
        ) : (
          <div className="text-sm text-slate-400 py-10 text-center">Data usaha tidak ditemukan</div>
        )}
      </GlassCard>
    </>
  );
}
