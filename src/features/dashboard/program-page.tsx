"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Plus, Download, MoreHorizontal, Calendar, Users, X, Pencil, Trash2, Check, Inbox } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { FilterChips } from '@/components/ui/filter-chips';
import { GlowButton } from '@/components/ui/glow-button';
import { programsApi } from '@/lib/api';

interface Program {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string;
  _count: { participants: number };
  pendingCount?: number;
}

interface Participant {
  id: string;
  status: string;
  joinedAt: string;
  umkm: { id: string; name: string; city?: string | null; category?: string | null };
}

const PART_LABEL: Record<string, string> = {
  PENDING: 'Menunggu', REGISTERED: 'Disetujui', REJECTED: 'Ditolak',
  IN_PROGRESS: 'Berlangsung', GRADUATED: 'Lulus', INACTIVE: 'Tidak Aktif',
};
const PART_COLOR: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  REGISTERED: 'bg-blue-50 text-blue-700',
  REJECTED: 'bg-red-50 text-red-600',
  IN_PROGRESS: 'bg-blue-50 text-blue-700',
  GRADUATED: 'bg-emerald-50 text-emerald-700',
  INACTIVE: 'bg-slate-100 text-slate-500',
};

type FormState = { name: string; description: string; startDate: string; endDate: string; status: string };

const STATUS_LABEL: Record<string, string> = { ACTIVE: 'Aktif', UPCOMING: 'Pendaftaran', COMPLETED: 'Selesai' };
const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'bg-blue-50 text-blue-700',
  UPCOMING: 'bg-amber-50 text-amber-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
};
const FILTER_TO_STATUS: Record<string, string> = { 'Aktif': 'ACTIVE', 'Pendaftaran': 'UPCOMING', 'Selesai': 'COMPLETED' };

function toDateInput(iso: string) { return iso ? iso.slice(0, 10) : ''; }

function calcProgress(startDate: string, endDate: string, status: string): number {
  if (status === 'COMPLETED') return 100;
  if (status === 'UPCOMING') return 0;
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function ProgramMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1 text-sm">
          <button
            onClick={e => { e.stopPropagation(); setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Pencil className="w-4 h-4 text-blue-500" /> Edit
          </button>
          <button
            onClick={e => { e.stopPropagation(); setOpen(false); onDelete(); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Hapus
          </button>
        </div>
      )}
    </div>
  );
}

function ParticipantsModal({ program, onClose, onChanged }: { program: Program; onClose: () => void; onChanged: () => void }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const fetchParticipants = async () => {
    try {
      const res = await programsApi.get(program.id);
      setParticipants(((res.data as any)?.participants ?? []) as Participant[]);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParticipants(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [program.id]);

  const decide = async (id: string, status: 'REGISTERED' | 'REJECTED') => {
    setActing(id);
    try {
      await programsApi.updateParticipantStatus(id, status);
      setParticipants(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
      onChanged();
    } catch {
      alert('Gagal memperbarui status pendaftar.');
    } finally {
      setActing(null);
    }
  };

  const pending = participants.filter(p => p.status === 'PENDING');
  const others = participants.filter(p => p.status !== 'PENDING');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <GlassCard className="w-full max-w-lg p-8 relative max-h-[85vh] overflow-y-auto" >
        <div onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Kelola Peserta</h2>
          <p className="text-sm text-slate-500 mb-6">{program.name}</p>

          {loading ? (
            <p className="text-sm text-slate-400 py-8 text-center">Memuat pendaftar...</p>
          ) : (
            <>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                Menunggu Persetujuan
                {pending.length > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">{pending.length}</span>}
              </h3>
              {pending.length === 0 ? (
                <div className="flex flex-col items-center gap-2 text-slate-400 py-6">
                  <Inbox className="w-7 h-7 text-slate-300" />
                  <p className="text-sm">Tidak ada pendaftar yang menunggu.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mb-6">
                  {pending.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{p.umkm.name}</p>
                        <p className="text-xs text-slate-400 truncate">{[p.umkm.category, p.umkm.city].filter(Boolean).join(' · ') || '—'}</p>
                      </div>
                      <button
                        onClick={() => decide(p.id, 'REGISTERED')}
                        disabled={acting === p.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" /> Setujui
                      </button>
                      <button
                        onClick={() => decide(p.id, 'REJECTED')}
                        disabled={acting === p.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" /> Tolak
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {others.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Peserta Lain ({others.length})</h3>
                  <div className="flex flex-col gap-2">
                    {others.map(p => (
                      <div key={p.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{p.umkm.name}</p>
                          <p className="text-xs text-slate-400 truncate">{[p.umkm.category, p.umkm.city].filter(Boolean).join(' · ') || '—'}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PART_COLOR[p.status] ?? 'bg-slate-100 text-slate-500'}`}>
                          {PART_LABEL[p.status] ?? p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

const EMPTY_FORM: FormState = { name: '', description: '', startDate: '', endDate: '', status: 'UPCOMING' };

export function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Program | null>(null);
  const [manageTarget, setManageTarget] = useState<Program | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const fetchPrograms = async () => {
    try {
      const res = await programsApi.list();
      setPrograms((res.data as any) ?? []);
    } catch {
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrograms(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setFormError(''); setShowModal(true); };
  const openEdit = (prog: Program) => {
    setEditTarget(prog);
    setForm({ name: prog.name, description: prog.description ?? '', startDate: toDateInput(prog.startDate), endDate: toDateInput(prog.endDate), status: prog.status });
    setFormError('');
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditTarget(null); };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus program "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await programsApi.delete(id);
      setPrograms(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Gagal menghapus program.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.startDate || !form.endDate) {
      setFormError('Nama, tanggal mulai, dan tanggal selesai wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      if (editTarget) {
        await programsApi.update(editTarget.id, {
          name: form.name,
          description: form.description || undefined,
          startDate: form.startDate,
          endDate: form.endDate,
          status: form.status,
        });
      } else {
        await programsApi.create({
          name: form.name,
          description: form.description || undefined,
          startDate: form.startDate,
          endDate: form.endDate,
          status: form.status,
        });
      }
      closeModal();
      await fetchPrograms();
    } catch (err: any) {
      setFormError(err?.response?.data?.error ?? 'Gagal menyimpan program.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = programs.filter(p => filter === 'Semua' || p.status === FILTER_TO_STATUS[filter]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Program</h1>
          <p className="text-slate-500 mt-1">Kelola program pembinaan dan pelatihan UMKM</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Tambah Program
          </GlowButton>
        </div>
      </div>

      <div className="mb-6">
        <FilterChips options={['Semua', 'Aktif', 'Pendaftaran', 'Selesai']} selectedOption={filter} onSelect={setFilter} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <GlassCard key={i} className="p-6 h-48 animate-pulse bg-slate-50" />)}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500">Tidak ada program untuk filter ini.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(prog => {
            const progress = calcProgress(prog.startDate, prog.endDate, prog.status);
            return (
              <GlassCard key={prog.id} onClick={() => setManageTarget(prog)} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[prog.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {STATUS_LABEL[prog.status] ?? prog.status}
                    </span>
                    {!!prog.pendingCount && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                        {prog.pendingCount} menunggu
                      </span>
                    )}
                  </div>
                  <ProgramMenu onEdit={() => openEdit(prog)} onDelete={() => handleDelete(prog.id, prog.name)} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{prog.name}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {prog._count.participants} peserta</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(prog.startDate)}</span>
                </div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-semibold text-slate-700">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Modal Tambah / Edit Program */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-8 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-6">{editTarget ? 'Edit Program' : 'Tambah Program Baru'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Program <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="contoh: Maritimepreneur Batch 6"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Deskripsi singkat program..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Mulai <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Selesai <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  <option value="UPCOMING">Pendaftaran</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="COMPLETED">Selesai</option>
                </select>
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editTarget ? 'Simpan Perubahan' : 'Simpan Program'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {manageTarget && (
        <ParticipantsModal
          program={manageTarget}
          onClose={() => setManageTarget(null)}
          onChanged={fetchPrograms}
        />
      )}
    </>
  );
}
