"use client";

import React, { useEffect, useState } from 'react';
import { Archive, RotateCcw, Trash2, Eye } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';
import { umkmApi } from '@/lib/api';

interface ArchivedUMKM {
  id: string;
  name: string;
  city: string | null;
  province: string | null;
  updatedAt: string;
}

export default function ArchivedUMKM() {
  const [data, setData] = useState<ArchivedUMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchArchived = async () => {
    try {
      const res = await umkmApi.list({ status: 'INACTIVE', limit: 100 });
      setData((res.data as any).data ?? []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArchived(); }, []);

  const handleRestore = async (id: string) => {
    setProcessing(id + '-restore');
    try {
      await umkmApi.update(id, { status: 'ACTIVE' });
      setData(prev => prev.filter(u => u.id !== id));
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus UMKM ini secara permanen? Tindakan tidak bisa dibatalkan.')) return;
    setProcessing(id + '-delete');
    try {
      await umkmApi.delete(id);
      setData(prev => prev.filter(u => u.id !== id));
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900">UMKM Archived</h1>
          {!loading && <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-sm font-semibold">{data.length}</span>}
        </div>
        <p className="text-slate-500">UMKM yang telah diarsipkan atau dinon-aktifkan dari sistem</p>
      </div>

      {loading ? (
        <GlassCard className="p-8 animate-pulse bg-slate-50" />
      ) : data.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Archive className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Tidak ada UMKM archived</h3>
          <p className="text-sm text-slate-400">Semua UMKM masih aktif di sistem</p>
        </GlassCard>
      ) : (
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">UMKM</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Lokasi</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Tanggal Arsip</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map(umkm => (
                <tr key={umkm.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                        <Archive className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{umkm.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{umkm.city ?? '-'}, {umkm.province ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(umkm.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/umkm/${umkm.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Lihat">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleRestore(umkm.id)}
                        disabled={processing !== null}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        title="Restore"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(umkm.id)}
                        disabled={processing !== null}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        title="Hapus Permanen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </>
  );
}
