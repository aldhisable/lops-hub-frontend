"use client";
import React from 'react';
import { CheckCircle2, Clock, Folders } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useWorkspace } from '@/context/workspace-context';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ProgramSaya() {
  const { umkm, loading } = useWorkspace();
  const participations = umkm?.participations ?? [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Program Saya</h1>
        <p className="text-slate-500 mt-1">Program pembinaan yang sedang dan telah Anda ikuti</p>
      </div>

      {loading ? (
        <GlassCard className="p-12 flex items-center justify-center text-slate-400">Memuat program...</GlassCard>
      ) : participations.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Folders className="w-10 h-10 text-slate-300" />
          <p className="text-sm">Belum terdaftar di program manapun.</p>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-6">
          {participations.map((p) => {
            const prog = p.program;
            const isActive = prog.status === 'ACTIVE';
            const isDone = prog.status === 'COMPLETED';
            const statusLabel = isActive ? 'Aktif' : isDone ? 'Selesai' : prog.status;
            const badgeColor = isActive ? 'bg-blue-50 text-blue-700' : isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500';
            const iconBg = isActive ? 'bg-blue-50' : isDone ? 'bg-emerald-50' : 'bg-slate-50';

            return (
              <GlassCard key={p.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    {isActive ? <Folders className="w-6 h-6 text-blue-600" /> : isDone ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Clock className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-bold text-slate-900">{prog.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>{statusLabel}</span>
                    </div>
                    {prog.description && <p className="text-sm text-slate-500">{prog.description}</p>}
                    <p className="text-xs text-slate-400 mt-1">{formatDate(prog.startDate)} — {formatDate(prog.endDate)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Status partisipasi: <span className="font-medium text-slate-600">{p.status}</span></p>
                  </div>
                  <button className="px-5 py-2.5 rounded-lg text-sm font-semibold shrink-0 transition-colors bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
                    Lihat Detail
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </>
  );
}
