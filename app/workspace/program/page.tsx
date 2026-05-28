"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Folders, Users, Calendar, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { useWorkspace } from '@/context/workspace-context';
import { programsApi } from '@/lib/api';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

const PROG_STATUS: Record<string, { label: string; color: string }> = {
  ACTIVE:    { label: 'Aktif',   color: 'bg-blue-50 text-blue-700' },
  UPCOMING:  { label: 'Segera',  color: 'bg-amber-50 text-amber-700' },
  COMPLETED: { label: 'Selesai', color: 'bg-emerald-50 text-emerald-700' },
};

const PART_STATUS: Record<string, { label: string; color: string }> = {
  REGISTERED:  { label: 'Terdaftar',         color: 'text-slate-500' },
  IN_PROGRESS: { label: 'Sedang Berlangsung', color: 'text-blue-600' },
  GRADUATED:   { label: 'Lulus',              color: 'text-emerald-600' },
  INACTIVE:    { label: 'Tidak Aktif',        color: 'text-slate-400' },
};

interface ProgramDetail {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  status: string;
  _count?: { participants: number };
}

export default function ProgramSaya() {
  const { umkm, loading, refetch } = useWorkspace();
  const participations = umkm?.participations ?? [];

  const [allPrograms, setAllPrograms] = useState<ProgramDetail[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [joinError, setJoinError] = useState('');
  const [detail, setDetail] = useState<ProgramDetail | null>(null);

  useEffect(() => {
    programsApi.list()
      .then(res => setAllPrograms(res.data))
      .catch(() => {})
      .finally(() => setLoadingPrograms(false));
  }, []);

  const joinedIds = new Set(participations.map(p => p.program.id));
  const available = allPrograms.filter(p => !joinedIds.has(p.id) && p.status !== 'COMPLETED');

  const handleJoin = async (programId: string) => {
    if (!umkm) return;
    setJoining(programId);
    setJoinError('');
    try {
      await programsApi.join(umkm.id, programId);
      refetch();
    } catch (err: any) {
      setJoinError(err.response?.data?.error || 'Gagal mendaftar program.');
    } finally {
      setJoining(null);
    }
  };

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
        <div className="flex flex-col gap-4 mb-10">
          {participations.map((p) => {
            const prog = p.program;
            const progMeta = PROG_STATUS[prog.status] ?? { label: prog.status, color: 'bg-slate-100 text-slate-500' };
            const partMeta = PART_STATUS[p.status] ?? { label: p.status, color: 'text-slate-500' };
            const done = p.status === 'GRADUATED' || prog.status === 'COMPLETED';
            return (
              <GlassCard key={p.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${done ? 'bg-emerald-50' : prog.status === 'ACTIVE' ? 'bg-blue-50' : 'bg-slate-50'}`}>
                    {done ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : prog.status === 'ACTIVE' ? <Folders className="w-6 h-6 text-blue-600" /> : <Clock className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-bold text-slate-900">{prog.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${progMeta.color}`}>{progMeta.label}</span>
                    </div>
                    {prog.description && <p className="text-sm text-slate-500">{prog.description}</p>}
                    <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <Calendar className="w-3 h-3" />{formatDate(prog.startDate)} — {formatDate(prog.endDate)}
                    </p>
                    <p className="text-xs mt-0.5">
                      Status partisipasi: <span className={`font-semibold ${partMeta.color}`}>{partMeta.label}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setDetail(prog)}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Lihat Detail
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Program Tersedia */}
      <div className="mt-2">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Program Tersedia</h2>
        <p className="text-sm text-slate-500 mb-4">Program pembinaan yang dapat Anda ikuti</p>
        {loadingPrograms ? (
          <p className="text-sm text-slate-400">Memuat program...</p>
        ) : available.length === 0 ? (
          <GlassCard className="p-8 flex flex-col items-center text-slate-400 gap-2">
            <Users className="w-8 h-8 text-slate-300" />
            <p className="text-sm">Tidak ada program baru yang tersedia saat ini.</p>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-4">
            {joinError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{joinError}</div>
            )}
            {available.map(prog => {
              const progMeta = PROG_STATUS[prog.status] ?? { label: prog.status, color: 'bg-slate-100 text-slate-500' };
              return (
                <GlassCard key={prog.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-slate-50">
                      <Folders className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-base font-bold text-slate-900">{prog.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${progMeta.color}`}>{progMeta.label}</span>
                      </div>
                      {prog.description && <p className="text-sm text-slate-500">{prog.description}</p>}
                      <div className="flex items-center gap-4 mt-1">
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />{formatDate(prog.startDate)} — {formatDate(prog.endDate)}
                        </p>
                        {prog._count && (
                          <p className="flex items-center gap-1 text-xs text-slate-400">
                            <Users className="w-3 h-3" />{prog._count.participants} peserta
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setDetail(prog)}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Detail
                      </button>
                      <GlowButton
                        variant="primary"
                        disabled={joining === prog.id}
                        onClick={() => handleJoin(prog.id)}
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold"
                      >
                        {joining === prog.id ? 'Mendaftar...' : 'Daftar'}
                      </GlowButton>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setDetail(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 pr-4">{detail.name}</h3>
              <button onClick={() => setDetail(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Status Program</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${(PROG_STATUS[detail.status] ?? { color: 'bg-slate-100 text-slate-500' }).color}`}>
                  {(PROG_STATUS[detail.status] ?? { label: detail.status }).label}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Periode</p>
                <p className="text-sm text-slate-700">{formatDate(detail.startDate)} — {formatDate(detail.endDate)}</p>
              </div>
              {detail.description && (
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Deskripsi</p>
                  <p className="text-sm text-slate-700">{detail.description}</p>
                </div>
              )}
              {detail._count && (
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Jumlah Peserta</p>
                  <p className="text-sm text-slate-700">{detail._count.participants} peserta terdaftar</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setDetail(null)}
              className="mt-6 w-full px-4 py-2.5 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
