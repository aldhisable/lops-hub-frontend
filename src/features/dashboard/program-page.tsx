"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Download, MoreHorizontal, Calendar, Users, X } from 'lucide-react';
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
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Aktif',
  UPCOMING: 'Pendaftaran',
  COMPLETED: 'Selesai',
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'bg-blue-50 text-blue-700',
  UPCOMING: 'bg-amber-50 text-amber-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
};

const FILTER_TO_STATUS: Record<string, string> = {
  'Aktif': 'ACTIVE',
  'Pendaftaran': 'UPCOMING',
  'Selesai': 'COMPLETED',
};

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

export function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', startDate: '', endDate: '', status: 'UPCOMING',
  });
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

  const filtered = programs.filter(p => {
    if (filter === 'Semua') return true;
    return p.status === FILTER_TO_STATUS[filter];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.startDate || !form.endDate) {
      setFormError('Nama, tanggal mulai, dan tanggal selesai wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await programsApi.create({
        name: form.name,
        description: form.description || undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      });
      setShowModal(false);
      setForm({ name: '', description: '', startDate: '', endDate: '', status: 'UPCOMING' });
      await fetchPrograms();
    } catch (err: any) {
      setFormError(err?.response?.data?.error ?? 'Gagal membuat program.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" onClick={() => setShowModal(true)}>
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
            const label = STATUS_LABEL[prog.status] ?? prog.status;
            return (
              <GlassCard key={prog.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[prog.status] ?? 'bg-slate-100 text-slate-600'}`}>{label}</span>
                  <button className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><MoreHorizontal className="w-4 h-4" /></button>
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

      {/* Modal Tambah Program */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Tambah Program Baru</h2>
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
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Program'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </>
  );
}
