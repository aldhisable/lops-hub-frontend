"use client";

import React, { useEffect, useState } from 'react';
import { GraduationCap, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';
import { umkmApi } from '@/lib/api';

interface GraduatedUMKM {
  id: string;
  name: string;
  city: string | null;
  province: string | null;
  classification: string;
  participations: Array<{
    joinedAt: string;
    status: string;
    program: { name: string; endDate: string };
  }>;
}

const classificationColor: Record<string, string> = {
  PLATINUM: 'bg-purple-100 text-purple-700',
  GOLD: 'bg-amber-100 text-amber-700',
  SILVER: 'bg-slate-200 text-slate-600',
  BRONZE: 'bg-orange-100 text-orange-700',
};

export default function GraduatedUMKM() {
  const [data, setData] = useState<GraduatedUMKM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    umkmApi.list({ status: 'GRADUATED', limit: 100 })
      .then(res => setData((res.data as any).data ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900">UMKM Graduated</h1>
          {!loading && <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">{data.length}</span>}
        </div>
        <p className="text-slate-500">UMKM yang telah lulus dari program pembinaan</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <GlassCard key={i} className="p-6 h-48 animate-pulse bg-slate-50" />)}
        </div>
      ) : data.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Belum ada UMKM graduated</h3>
          <p className="text-sm text-slate-400">UMKM yang lulus program pembinaan akan muncul di sini</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map(umkm => {
            const lastProgram = umkm.participations?.[0];
            return (
              <GlassCard key={umkm.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classificationColor[umkm.classification] ?? 'bg-slate-100 text-slate-600'}`}>
                    {umkm.classification.charAt(0) + umkm.classification.slice(1).toLowerCase()}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{umkm.name}</h4>
                <p className="text-sm text-slate-500">{umkm.city ?? '-'}, {umkm.province ?? '-'}</p>
                {lastProgram && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-400 mb-1">Program Lulus</div>
                    <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> {lastProgram.program.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Tanggal: {formatDate(lastProgram.program.endDate)}</div>
                  </div>
                )}
                <Link href={`/dashboard/umkm/${umkm.id}`} className="mt-4 block text-center py-2 bg-slate-50 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                  Lihat Profil
                </Link>
              </GlassCard>
            );
          })}
        </div>
      )}
    </>
  );
}
