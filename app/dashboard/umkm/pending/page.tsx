"use client";

import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';
import { umkmApi } from '@/lib/api';

interface PendingUMKM {
  id: string;
  name: string;
  city: string | null;
  province: string | null;
  createdAt: string;
  user: { name: string } | null;
}

export default function PendingVerifikasi() {
  const [data, setData] = useState<PendingUMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPending = async () => {
    try {
      const res = await umkmApi.list({ status: 'PENDING', limit: 100 });
      setData((res.data as any).data ?? []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id: string) => {
    setProcessing(id + '-approve');
    try {
      await umkmApi.update(id, { status: 'ACTIVE' });
      setData(prev => prev.filter(u => u.id !== id));
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(id + '-reject');
    try {
      await umkmApi.update(id, { status: 'INACTIVE' });
      setData(prev => prev.filter(u => u.id !== id));
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Pending Verifikasi</h1>
          {!loading && <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">{data.length}</span>}
        </div>
        <p className="text-slate-500">UMKM yang menunggu verifikasi dan persetujuan admin</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <GlassCard key={i} className="p-6 h-20 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Tidak ada UMKM pending</h3>
          <p className="text-sm text-slate-400">Semua UMKM sudah diverifikasi</p>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map(umkm => (
            <GlassCard key={umkm.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-slate-900">{umkm.name}</h4>
                <p className="text-sm text-slate-500 mt-0.5">
                  Owner: {umkm.user?.name ?? '-'} • {umkm.city ?? '-'}, {umkm.province ?? '-'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Didaftarkan: {formatDate(umkm.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/dashboard/umkm/${umkm.id}`} className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleApprove(umkm.id)}
                  disabled={processing !== null}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Setujui
                </button>
                <button
                  onClick={() => handleReject(umkm.id)}
                  disabled={processing !== null}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Tolak
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </>
  );
}
