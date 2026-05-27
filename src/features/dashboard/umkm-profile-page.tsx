"use client";

import { useState, useEffect } from 'react';
import {
  PieChart, FileText,
  ArrowLeft, CheckCircle2, Phone, AtSign,
  Globe, ShoppingBag, TrendingUp,
  AlignLeft, ChevronRight, Edit3, Clock, MapPin
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { RadarChart } from '@/components/ui/radar-chart';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlowButton } from '@/components/ui/glow-button';
import { umkmApi } from '@/lib/api';
import Link from 'next/link';

const MONTHS_ID = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

const RADAR_STUB = [
  { subject: 'Spread', A: 80, fullMark: 100 },
  { subject: 'Size', A: 75, fullMark: 100 },
  { subject: 'Sustain', A: 78, fullMark: 100 },
  { subject: 'Share', A: 72, fullMark: 100 },
  { subject: 'Supplier', A: 80, fullMark: 100 },
];

const CLASS_BADGE: Record<string, string> = {
  PLATINUM: 'bg-blue-50 text-blue-700',
  GOLD: 'bg-amber-50 text-amber-700',
  SILVER: 'bg-slate-100 text-slate-700',
  BRONZE: 'bg-orange-50 text-orange-700',
};
const CLASS_ICON: Record<string, string> = {
  PLATINUM: '💎', GOLD: '🏆', SILVER: '🥈', BRONZE: '🥉',
};

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  INACTIVE: 'bg-red-50 text-red-700',
  GRADUATED: 'bg-purple-50 text-purple-700',
  PENDING: 'bg-amber-50 text-amber-700',
};

const PROG_STATUS_BADGE: Record<string, string> = {
  IN_PROGRESS: 'bg-blue-50 text-blue-700',
  GRADUATED: 'bg-emerald-50 text-emerald-700',
  DROPPED: 'bg-red-50 text-red-700',
};

interface UMKMData {
  id: string;
  name: string;
  category: string;
  establishedYear: number | null;
  city: string | null;
  province: string | null;
  address: string | null;
  phone: string | null;
  instagram: string | null;
  website: string | null;
  description: string | null;
  classification: string;
  status: string;
  user: { name: string };
  products: Array<{ id: string; name: string; category: string; price: number; stock: number | null }>;
  participations: Array<{
    status: string;
    joinedAt: string;
    program: { id: string; name: string; startDate: string; endDate: string; status: string };
  }>;
  financials: Array<{ month: number; year: number; revenue: number; profit: number | null }>;
}

export function UMKMProfilePage({ id }: { id?: string }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [umkm, setUmkm] = useState<UMKMData | null>(null);
  const [loading, setLoading] = useState(true);

  const tabs = ['Overview', 'Products', 'Programs', 'Documents', 'Growth', 'Timeline'];

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    umkmApi.get(id)
      .then((res) => setUmkm(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const revenueTrendData = (umkm?.financials ?? [])
    .filter((f) => f.year === new Date().getFullYear())
    .map((f) => ({ month: MONTHS_ID[f.month] ?? String(f.month), revenue: f.revenue }));

  const totalRevenue = (umkm?.financials ?? [])
    .filter((f) => f.year === new Date().getFullYear())
    .reduce((s, f) => s + f.revenue, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">Memuat data UMKM...</div>
    );
  }

  if (!umkm) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Data UMKM tidak ditemukan.{' '}
        <Link href="/dashboard/umkm" className="text-blue-600 ml-2 hover:underline">Kembali ke direktori</Link>
      </div>
    );
  }

  const classLabel = umkm.classification.charAt(0) + umkm.classification.slice(1).toLowerCase();
  const statusLabel = umkm.status === 'ACTIVE' ? 'Aktif' : umkm.status === 'INACTIVE' ? 'Tidak Aktif' : umkm.status === 'GRADUATED' ? 'Lulus' : 'Pending';
  const activeProgram = umkm.participations.find((p) => p.status === 'IN_PROGRESS')?.program;

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm font-medium text-slate-400 mb-6 gap-2">
        <Link href="/dashboard/umkm" className="hover:text-blue-600 transition-colors">UMKM</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-semibold">{umkm.name}</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Workspace</h1>
          <p className="text-slate-500 mt-1">Kelola dan pantau perkembangan UMK secara lengkap</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/umkm" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <GlowButton variant="primary" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </GlowButton>
        </div>
      </div>

      {/* Identity Card */}
      <GlassCard className="p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center shrink-0 border border-teal-300/50 shadow-inner">
            <div className="text-center text-teal-800 font-extrabold leading-tight text-sm">
              <span className="text-2xl block mb-0.5">🌊</span>
              {umkm.name.split(' ').slice(0, 2).join('\n')}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-3">
              <h2 className="text-xl font-bold text-slate-900">{umkm.name}</h2>
              <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-100 shrink-0" />
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1.5 text-sm mb-4">
              <span className="text-slate-500">Owner</span><span className="font-medium text-slate-800">{umkm.user?.name ?? '—'}</span>
              <span className="text-slate-500">Kategori</span><span className="font-medium text-slate-800">{umkm.category}</span>
              {umkm.establishedYear && <><span className="text-slate-500">Berdiri Sejak</span><span className="font-medium text-slate-800">{umkm.establishedYear}</span></>}
              <span className="text-slate-500">Kota / Provinsi</span><span className="font-medium text-slate-800">{[umkm.city, umkm.province].filter(Boolean).join(', ') || '—'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {umkm.phone && <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {umkm.phone}</span>}
              {umkm.instagram && <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-pink-600 flex items-center gap-1.5"><AtSign className="w-3 h-3" /> {umkm.instagram}</span>}
              {umkm.website && <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 flex items-center gap-1.5"><Globe className="w-3 h-3" /> {umkm.website}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:border-l lg:border-slate-100 lg:pl-6 shrink-0 min-w-[140px]">
            <div>
              <div className="text-xs text-slate-400 mb-1">Status</div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${STATUS_BADGE[umkm.status] ?? 'bg-slate-100 text-slate-600'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {statusLabel}
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Klasifikasi</div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${CLASS_BADGE[umkm.classification] ?? 'bg-slate-100 text-slate-600'}`}>
                {CLASS_ICON[umkm.classification]} {classLabel}
              </span>
            </div>
            {activeProgram && (
              <div>
                <div className="text-xs text-slate-400 mb-1">Program Aktif</div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">🚀 {activeProgram.name}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:border-l lg:border-slate-100 lg:pl-6 shrink-0">
            {[
              { icon: PieChart, label: `Omzet ${new Date().getFullYear()}`, value: `Rp ${totalRevenue.toLocaleString('id-ID')} Jt`, color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: ShoppingBag, label: 'Jumlah Produk', value: umkm.products.length.toString(), color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { icon: TrendingUp, label: 'Program Diikuti', value: umkm.participations.length.toString(), color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 text-center min-w-[100px]">
                <div className={`${kpi.bg} p-2 rounded-lg inline-flex mb-2`}><kpi.icon className={`w-4 h-4 ${kpi.color}`} /></div>
                <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
                <div className="text-lg font-bold text-slate-900">{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 mb-8 gap-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 pb-3 pt-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'Overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <GlassCard className="p-6">
              <h3 className="font-semibold text-lg text-slate-900 mb-6">Informasi Umum</h3>
              <div className="flex flex-col gap-5">
                {umkm.address && (
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div><div className="text-sm font-semibold text-slate-700">Alamat Usaha</div><div className="text-sm text-slate-500 mt-1 leading-relaxed">{umkm.address}</div></div>
                  </div>
                )}
                {umkm.description && (
                  <div className="flex gap-3">
                    <AlignLeft className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div><div className="text-sm font-semibold text-slate-700">Deskripsi Usaha</div><div className="text-sm text-slate-500 mt-1 leading-relaxed">{umkm.description}</div></div>
                  </div>
                )}
                {umkm.instagram && (
                  <div className="flex gap-3">
                    <AtSign className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div><div className="text-sm font-semibold text-slate-700">Social Media</div><div className="text-sm text-slate-500 mt-1">{umkm.instagram}</div></div>
                  </div>
                )}
              </div>
            </GlassCard>
            <RadarChart title="Radar 5S (Klasifikasi)" data={RADAR_STUB} dataKey="A" angleKey="subject" color="#8b5cf6" height={280} className="h-full" />
            <GlassCard className="p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-slate-900">Produk Unggulan</h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700" onClick={() => setActiveTab('Products')}>Lihat Semua</button>
              </div>
              <div className="grid grid-cols-2 gap-3 flex-1">
                {umkm.products.slice(0, 4).map((p) => (
                  <div key={p.id} className="rounded-xl border border-slate-100 bg-white overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-20 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-3xl">🛒</div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                      <p className="text-[11px] text-slate-500">{p.category}</p>
                      <p className="text-xs font-bold text-blue-600 mt-1.5">Rp {p.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
          {revenueTrendData.length > 0 && (
            <AnalyticsChart
              title="Tren Omzet (Penjualan)"
              subtitle={`Total omzet ${new Date().getFullYear()} (Juta Rupiah)`}
              data={revenueTrendData}
              dataKey="revenue"
              xAxisKey="month"
              height={250}
              color="#8b5cf6"
              valueFormatter={(val) => `Rp ${val} Jt`}
            />
          )}
        </>
      )}

      {/* Products Tab */}
      {activeTab === 'Products' && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {umkm.products.length === 0 ? (
            <div className="col-span-4 py-12 text-center text-slate-400">Belum ada produk terdaftar.</div>
          ) : umkm.products.map((p) => (
            <GlassCard key={p.id} className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-4xl">🛒</div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{p.category}</p>
                <p className="text-sm font-bold text-blue-600 mt-2">Rp {p.price.toLocaleString('id-ID')}</p>
                {p.stock != null && <p className="text-xs text-slate-400 mt-1">Stok: {p.stock} pcs</p>}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Programs Tab */}
      {activeTab === 'Programs' && (
        <div className="flex flex-col gap-4">
          {umkm.participations.length === 0 ? (
            <GlassCard className="p-12 text-center text-slate-400">Belum mengikuti program apapun.</GlassCard>
          ) : umkm.participations.map((part, i) => (
            <GlassCard key={i} className="p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${part.status === 'IN_PROGRESS' ? 'bg-blue-500' : part.status === 'GRADUATED' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                {part.status === 'IN_PROGRESS' ? <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span> : part.status === 'GRADUATED' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-slate-900">{part.program.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PROG_STATUS_BADGE[part.status] ?? 'bg-slate-100 text-slate-500'}`}>
                    {part.status === 'IN_PROGRESS' ? 'Aktif' : part.status === 'GRADUATED' ? 'Selesai' : 'Keluar'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(part.program.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' — '}
                  {new Date(part.program.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0">Detail</button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'Documents' && (
        <div className="flex flex-col gap-4">
          {[
            { name: 'NIB (Nomor Induk Berusaha)', date: '—', status: 'Terverifikasi', icon: '📋' },
            { name: 'NPWP Usaha', date: '—', status: 'Terverifikasi', icon: '📄' },
            { name: 'Laporan Keuangan', date: '—', status: 'Menunggu', icon: '📊' },
          ].map((doc, i) => (
            <GlassCard key={i} className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100">{doc.icon}</div>
              <div className="flex-1"><h4 className="text-sm font-bold text-slate-900">{doc.name}</h4><p className="text-xs text-slate-400 mt-0.5">Diupload: {doc.date}</p></div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doc.status === 'Terverifikasi' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{doc.status}</span>
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FileText className="w-4 h-4" /></button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Growth Tab */}
      {activeTab === 'Growth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {revenueTrendData.length > 0 ? (
            <AnalyticsChart
              title="Tren Omzet 12 Bulan Terakhir"
              data={revenueTrendData}
              dataKey="revenue"
              xAxisKey="month"
              height={300}
              color="#8b5cf6"
              valueFormatter={(val) => `Rp ${val} Jt`}
            />
          ) : (
            <GlassCard className="p-12 flex items-center justify-center text-slate-400">Belum ada data keuangan.</GlassCard>
          )}
          <GlassCard className="p-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-4">Ringkasan Keuangan {new Date().getFullYear()}</h3>
            <div className="flex flex-col gap-3 mt-6">
              {umkm.financials.filter((f) => f.year === new Date().getFullYear()).map((f) => (
                <div key={`${f.month}-${f.year}`} className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                  <span className="text-slate-600">{MONTHS_ID[f.month]}</span>
                  <span className="font-semibold text-slate-900">Rp {f.revenue.toLocaleString('id-ID')} Jt</span>
                  {f.profit != null && <span className="text-emerald-600 text-xs">Profit: Rp {f.profit.toFixed(0)} Jt</span>}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'Timeline' && (
        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg text-slate-900 mb-8">Riwayat Program</h3>
          <div className="relative border-l-2 border-slate-100 ml-4">
            {umkm.participations.length === 0 ? (
              <div className="ml-6 text-slate-400 text-sm">Belum ada riwayat program.</div>
            ) : umkm.participations.map((part, i) => (
              <div key={i} className="mb-8 ml-6 relative">
                <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white shadow-sm ${part.status === 'IN_PROGRESS' ? 'bg-blue-500' : part.status === 'GRADUATED' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <div className="text-xs font-semibold text-slate-400 mb-1">
                  {new Date(part.joinedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h4 className="text-sm font-semibold text-slate-900">{part.program.name}</h4>
                <p className="text-sm text-slate-500 mt-0.5">
                  Status: {part.status === 'IN_PROGRESS' ? 'Sedang Berlangsung' : part.status === 'GRADUATED' ? 'Lulus' : 'Keluar'}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </>
  );
}
