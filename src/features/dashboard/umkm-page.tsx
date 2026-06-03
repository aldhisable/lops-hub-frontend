"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Plus, MoreHorizontal, Search, Pencil, Archive, Trash2, X, AlertTriangle, MapPin } from 'lucide-react';
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

type ConfirmType = 'archive' | 'delete';

interface ConfirmState {
  type: ConfirmType;
  id: string;
  name: string;
}

const CLASS_COLORS: Record<string, string> = {
  PLATINUM: 'bg-blue-100 text-blue-700',
  GOLD: 'bg-amber-100 text-amber-700',
  SILVER: 'bg-slate-200 text-slate-700',
  BRONZE: 'bg-orange-100 text-orange-700',
};

function ActionDropdown({ row, onArchive, onDelete }: {
  row: UMKMRow;
  onArchive: (row: UMKMRow) => void;
  onDelete: (row: UMKMRow) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors inline-flex"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
          <Link
            href={`/dashboard/umkm/${row.id}`}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Pencil className="w-4 h-4 text-slate-400" />
            Edit
          </Link>
          <button
            onClick={() => { setOpen(false); onArchive(row); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Archive className="w-4 h-4 text-amber-400" />
            Arsip
          </button>
          <div className="my-1 border-t border-slate-100" />
          <button
            onClick={() => { setOpen(false); onDelete(row); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

function ConfirmModal({ confirm, loading, onCancel, onConfirm }: {
  confirm: ConfirmState;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isDelete = confirm.type === 'delete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDelete ? 'bg-red-100' : 'bg-amber-100'}`}>
          <AlertTriangle className={`w-6 h-6 ${isDelete ? 'text-red-500' : 'text-amber-500'}`} />
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-2">
          {isDelete ? 'Hapus UMKM?' : 'Arsipkan UMKM?'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {isDelete
            ? <>Anda akan menghapus <span className="font-semibold text-slate-700">{confirm.name}</span> secara permanen. Tindakan ini tidak dapat dibatalkan.</>
            : <>Anda akan mengarsipkan <span className="font-semibold text-slate-700">{confirm.name}</span>. UMKM ini akan berstatus tidak aktif dan bisa dipulihkan kembali.</>
          }
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-50 ${
              isDelete ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {loading ? 'Memproses...' : isDelete ? 'Ya, Hapus' : 'Ya, Arsipkan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function UMKMDirectoryPage() {
  const router = useRouter();

  // Baca city/province/classification dari URL tanpa useSearchParams (hindari Suspense boundary issue)
  const [cityFilter, setCityFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setCityFilter(p.get('city') ?? '');
    setProvinceFilter(p.get('province') ?? '');
    const cls = p.get('classification');
    if (cls) {
      const label = cls.charAt(0) + cls.slice(1).toLowerCase();
      setActiveFilter(label);
    }
  }, []);

  const locationLabel = cityFilter || provinceFilter;

  const [data, setData] = useState<UMKMRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua Kelas');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filterToApi: Record<string, string | undefined> = {
    'Semua Kelas': undefined,
    Platinum: 'PLATINUM',
    Gold: 'GOLD',
    Silver: 'SILVER',
    Bronze: 'BRONZE',
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 20, status: 'ACTIVE' };
    if (search) params.search = search;
    const cls = filterToApi[activeFilter];
    if (cls) params.classification = cls;
    if (cityFilter) params.city = cityFilter;
    if (provinceFilter) params.province = provinceFilter;

    umkmApi
      .list(params)
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, activeFilter, cityFilter, provinceFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConfirm = async () => {
    if (!confirm) return;
    setActionLoading(true);
    try {
      if (confirm.type === 'delete') {
        await umkmApi.delete(confirm.id);
      } else {
        await umkmApi.archive(confirm.id);
      }
      setConfirm(null);
      fetchData();
    } catch {
      // silently fail — could add toast here
    } finally {
      setActionLoading(false);
    }
  };

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
        <ActionDropdown
          row={row}
          onArchive={(r) => setConfirm({ type: 'archive', id: r.id, name: r.name })}
          onDelete={(r) => setConfirm({ type: 'delete', id: r.id, name: r.name })}
        />
      ),
    },
  ];

  return (
    <>
      {confirm && (
        <ConfirmModal
          confirm={confirm}
          loading={actionLoading}
          onCancel={() => setConfirm(null)}
          onConfirm={handleConfirm}
        />
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Direktori UMKM Binaan</h1>
          <p className="text-slate-500 mt-1">
            Kelola dan pantau data {loading ? '...' : total.toLocaleString('id-ID')} UMKM yang terdaftar di sistem.
          </p>
          {locationLabel && (
            <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg w-fit">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-sm text-blue-700 font-medium">{locationLabel}</span>
              <button
                onClick={() => router.push('/dashboard/umkm')}
                className="ml-1 text-blue-400 hover:text-blue-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}
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
