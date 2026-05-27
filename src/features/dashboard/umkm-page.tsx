"use client";

import { useState, useEffect, useCallback } from 'react';
import { Download, Plus, MoreHorizontal, Search } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { DataTable } from '@/components/ui/data-table';
import { FilterChips } from '@/components/ui/filter-chips';
import { GlowButton } from '@/components/ui/glow-button';
import { umkmApi } from '@/lib/api';
import Link from 'next/link';

interface UMKMRow {
  id: string;
  name: string;
  city: string | null;
  province: string | null;
  classification: string;
  status: string;
  _count: { participations: number };
}

const CLASS_COLORS: Record<string, string> = {
  PLATINUM: 'bg-blue-100 text-blue-700',
  GOLD: 'bg-amber-100 text-amber-700',
  SILVER: 'bg-slate-200 text-slate-700',
  BRONZE: 'bg-orange-100 text-orange-700',
};

export function UMKMDirectoryPage() {
  const [data, setData] = useState<UMKMRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua Kelas');
  const [page, setPage] = useState(1);

  const filterToApi: Record<string, string | undefined> = {
    'Semua Kelas': undefined,
    Platinum: 'PLATINUM',
    Gold: 'GOLD',
    Silver: 'SILVER',
    Bronze: 'BRONZE',
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 20 };
    if (search) params.search = search;
    const cls = filterToApi[activeFilter];
    if (cls) params.classification = cls;

    umkmApi
      .list(params)
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      header: 'Nama UMKM',
      accessor: 'name' as const,
      render: (val: string, row: UMKMRow) => (
        <Link href={`/dashboard/umkm/${row.id}`} className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
          {val}
        </Link>
      ),
    },
    { header: 'Kota / Kabupaten', accessor: 'city' as const, render: (val: string | null) => val ?? '—' },
    { header: 'Provinsi', accessor: 'province' as const, render: (val: string | null) => val ?? '—' },
    {
      header: 'Kelas',
      accessor: 'classification' as const,
      render: (val: string) => {
        const label = val.charAt(0) + val.slice(1).toLowerCase();
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${CLASS_COLORS[val] ?? 'bg-slate-100 text-slate-700'}`}>
            {label}
          </span>
        );
      },
    },
    {
      header: 'Program',
      accessor: '_count' as const,
      render: (val: { participations: number }) => (
        <span className="text-slate-600">{val.participations} program</span>
      ),
    },
    {
      header: 'Aksi',
      accessor: 'id' as const,
      render: (_: string, row: UMKMRow) => (
        <Link href={`/dashboard/umkm/${row.id}`} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition-colors inline-flex">
          <MoreHorizontal className="w-4 h-4" />
        </Link>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Direktori UMKM Binaan</h1>
          <p className="text-slate-500 mt-1">
            Kelola dan pantau data {loading ? '...' : total.toLocaleString('id-ID')} UMKM yang terdaftar di sistem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export Data
          </button>
          <Link href="/dashboard/umkm/tambah">
            <GlowButton variant="primary" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" /> Tambah UMKM
            </GlowButton>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama UMKM..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <FilterChips
          options={['Semua Kelas', 'Platinum', 'Gold', 'Silver', 'Bronze']}
          selectedOption={activeFilter}
          onSelect={(opt) => { setActiveFilter(opt); setPage(1); }}
        />
      </div>

      {loading ? (
        <GlassCard className="p-12 flex items-center justify-center text-slate-400">
          Memuat data UMKM...
        </GlassCard>
      ) : data.length === 0 ? (
        <GlassCard className="p-12 flex items-center justify-center text-slate-400">
          Tidak ada data UMKM yang ditemukan.
        </GlassCard>
      ) : (
        <DataTable columns={columns} data={data} />
      )}

      {!loading && total > 20 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>
          <span className="text-sm text-slate-500">
            Halaman {page} / {Math.ceil(total / 20)}
          </span>
          <button
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Berikutnya →
          </button>
        </div>
      )}
    </>
  );
}
