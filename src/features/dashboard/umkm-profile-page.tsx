"use client";

import { useState, useEffect } from 'react';
import {
  PieChart, FileText, Eye,
  ArrowLeft, CheckCircle2, Phone, AtSign,
  Globe, ShoppingBag, TrendingUp,
  AlignLeft, ChevronRight, Edit3, Clock, MapPin
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { RadarChart } from '@/components/ui/radar-chart';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlowButton } from '@/components/ui/glow-button';
import { umkmApi, lopsSalesApi, documentsApi, openDocumentFile } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
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

const DOC_STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  VERIFIED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-600',
};
const DOC_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Menunggu', VERIFIED: 'Terverifikasi', REJECTED: 'Ditolak',
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
  documents: Array<{ id: string; name: string; type: string; fileUrl: string; fileType: string; status: string; uploadedAt: string }>;
}

interface LopsSalesEntry { month: number; year: number; amount: number; gerai: string | null; notes: string | null }

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

export function UMKMProfilePage({ id }: { id?: string }) {
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === 'ADMIN_PUSAT' || authUser?.role === 'ADMIN_REGIONAL';

  const [activeTab, setActiveTab] = useState('Overview');
  const [umkm, setUmkm] = useState<UMKMData | null>(null);
  const [lopsSales, setLopsSales] = useState<LopsSalesEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Form input LopsSales (admin)
  const [lopsMonth, setLopsMonth] = useState(CURRENT_MONTH);
  const [lopsYear, setLopsYear] = useState(CURRENT_YEAR);
  const [lopsAmount, setLopsAmount] = useState('');
  const [lopsGerai, setLopsGerai] = useState('');
  const [lopsNotes, setLopsNotes] = useState('');
  const [lopsSaving, setLopsSaving] = useState(false);
  const [lopsSaveMsg, setLopsSaveMsg] = useState('');
  const [docFileError, setDocFileError] = useState('');

  const tabs = ['Overview', 'Products', 'Programs', 'Documents', 'Growth', 'Timeline'];

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    Promise.all([
      umkmApi.get(id),
      lopsSalesApi.getByUmkm(id),
    ])
      .then(([umkmRes, lopsRes]) => {
        setUmkm(umkmRes.data);
        setLopsSales(lopsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSaveLops(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !lopsAmount) return;
    setLopsSaving(true);
    setLopsSaveMsg('');
    try {
      const res = await lopsSalesApi.upsert(id, {
        month: lopsMonth,
        year: lopsYear,
        amount: parseFloat(lopsAmount),
        gerai: lopsGerai || undefined,
        notes: lopsNotes || undefined,
      });
      setLopsSales(prev => {
        const filtered = prev.filter(l => !(l.month === lopsMonth && l.year === lopsYear));
        return [...filtered, res.data];
      });
      setLopsSaveMsg('Data berhasil disimpan');
      setLopsAmount('');
      setLopsGerai('');
      setLopsNotes('');
    } catch {
      setLopsSaveMsg('Gagal menyimpan data');
    } finally {
      setLopsSaving(false);
    }
  }

  async function handleDeleteLops(month: number, year: number) {
    if (!id) return;
    try {
      await lopsSalesApi.delete(id, month, year);
      setLopsSales(prev => prev.filter(l => !(l.month === month && l.year === year)));
    } catch {
      // silently fail
    }
  }

  async function handleVerifyDoc(docId: string, status: 'VERIFIED' | 'REJECTED') {
    try {
      await documentsApi.updateStatus(docId, status);
      setUmkm(prev => prev ? {
        ...prev,
        documents: prev.documents.map(d => d.id === docId ? { ...d, status } : d),
      } : null);
    } catch {
      // silently fail
    }
  }

  async function handleOpenDoc(doc: UMKMData['documents'][number]) {
    setDocFileError('');
    try {
      await openDocumentFile(doc);
    } catch {
      setDocFileError('Gagal memuat file dokumen. Coba lagi beberapa saat.');
    }
  }

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
          {docFileError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {docFileError}
            </div>
          )}
          {umkm.documents.length === 0 ? (
            <GlassCard className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <FileText className="w-10 h-10 text-slate-300" />
              <p className="text-sm">Belum ada dokumen yang diupload oleh UMKM ini.</p>
            </GlassCard>
          ) : umkm.documents.map((doc) => (
            <GlassCard key={doc.id} className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                <FileText className={`w-5 h-5 ${doc.fileType === 'PDF' ? 'text-red-500' : 'text-blue-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {doc.type} • {doc.fileType} • {new Date(doc.uploadedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${DOC_STATUS_STYLE[doc.status] ?? 'bg-slate-100 text-slate-600'}`}>
                {DOC_STATUS_LABEL[doc.status] ?? doc.status}
              </span>
              <button onClick={() => handleOpenDoc(doc)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0">
                <Eye className="w-4 h-4" />
              </button>
              {isAdmin && doc.status !== 'VERIFIED' && (
                <button onClick={() => handleVerifyDoc(doc.id, 'VERIFIED')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors shrink-0">
                  Verifikasi
                </button>
              )}
              {isAdmin && doc.status !== 'REJECTED' && (
                <button onClick={() => handleVerifyDoc(doc.id, 'REJECTED')}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors shrink-0">
                  Tolak
                </button>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Growth Tab */}
      {activeTab === 'Growth' && (() => {
        const currentYear = new Date().getFullYear();
        const lopsThisYear = lopsSales.filter(l => l.year === currentYear).sort((a, b) => a.month - b.month);
        const lopsTrendData = lopsThisYear.map(l => ({ month: MONTHS_ID[l.month] ?? String(l.month), revenue: l.amount }));
        const finThisYear = umkm.financials.filter(f => f.year === currentYear).sort((a, b) => a.month - b.month);
        const finTrendData = finThisYear.map(f => ({ month: MONTHS_ID[f.month] ?? String(f.month), revenue: f.revenue }));
        const totalLops = lopsThisYear.reduce((s, l) => s + l.amount, 0);
        const totalFin = finThisYear.reduce((s, f) => s + f.revenue, 0);
        return (
          <div className="flex flex-col gap-6">
            {/* KPI summary */}
            <div className="grid grid-cols-2 gap-4">
              <GlassCard className="p-5">
                <div className="text-xs text-slate-500 mb-1">Penjualan Gerai LOPs {currentYear}</div>
                <div className="text-xl font-bold text-teal-700">Rp {totalLops.toLocaleString('id-ID')} Jt</div>
                <div className="text-xs text-slate-400 mt-1">Diinput oleh admin</div>
              </GlassCard>
              <GlassCard className="p-5">
                <div className="text-xs text-slate-500 mb-1">Omzet Umum {currentYear}</div>
                <div className="text-xl font-bold text-purple-700">Rp {totalFin.toLocaleString('id-ID')} Jt</div>
                <div className="text-xs text-slate-400 mt-1">Self-report oleh UMKM</div>
              </GlassCard>
            </div>

            {/* Chart penjualan LOPs */}
            {lopsTrendData.length > 0 ? (
              <AnalyticsChart
                title="Tren Penjualan Gerai LOPs"
                subtitle={`Data konsinyasi ${currentYear} — diinput admin`}
                data={lopsTrendData}
                dataKey="revenue"
                xAxisKey="month"
                height={250}
                color="#0d9488"
                valueFormatter={(val) => `Rp ${val} Jt`}
              />
            ) : (
              <GlassCard className="p-8 text-center text-slate-400 text-sm">
                Belum ada data penjualan gerai LOPs untuk {currentYear}.
              </GlassCard>
            )}

            {/* Form input LopsSales — admin only */}
            {isAdmin && (
              <GlassCard className="p-6">
                <h3 className="font-semibold text-slate-900 mb-1">Input Penjualan Gerai LOPs</h3>
                <p className="text-xs text-slate-500 mb-4">Tambah atau perbarui data penjualan konsinyasi bulanan.</p>
                <form onSubmit={handleSaveLops} className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Bulan</label>
                      <select value={lopsMonth} onChange={e => setLopsMonth(parseInt(e.target.value))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-300">
                        {MONTHS_ID.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Tahun</label>
                      <select value={lopsYear} onChange={e => setLopsYear(parseInt(e.target.value))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-300">
                        {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Nilai Penjualan (Juta Rupiah)</label>
                    <input type="number" min="0" step="0.1" placeholder="Contoh: 85" value={lopsAmount}
                      onChange={e => setLopsAmount(e.target.value)} required
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-300" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Nama Gerai (opsional)</label>
                    <input type="text" placeholder="Contoh: LOPs Surabaya" value={lopsGerai}
                      onChange={e => setLopsGerai(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-300" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Catatan (opsional)</label>
                    <input type="text" placeholder="Catatan tambahan..." value={lopsNotes}
                      onChange={e => setLopsNotes(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-300" />
                  </div>
                  <button type="submit" disabled={lopsSaving}
                    className="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
                    {lopsSaving ? 'Menyimpan...' : 'Simpan Data Penjualan'}
                  </button>
                  {lopsSaveMsg && (
                    <p className={`text-sm font-medium ${lopsSaveMsg.includes('berhasil') ? 'text-emerald-600' : 'text-red-500'}`}>
                      {lopsSaveMsg}
                    </p>
                  )}
                </form>
              </GlassCard>
            )}

            {/* Detail tabel LOPs + Omzet umum */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Detail Penjualan Gerai LOPs</h3>
                {lopsThisYear.length === 0 ? (
                  <div className="text-sm text-slate-400 py-4 text-center">Belum ada data.</div>
                ) : (
                  <div className="flex flex-col divide-y divide-slate-50">
                    {lopsThisYear.sort((a, b) => b.month - a.month).map(l => (
                      <div key={`${l.month}-${l.year}`} className="flex justify-between items-center py-2.5">
                        <div>
                          <span className="text-sm font-medium text-slate-700">{MONTHS_ID[l.month]}</span>
                          {l.gerai && <span className="text-xs text-slate-400 ml-2">— {l.gerai}</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-teal-700">Rp {l.amount.toLocaleString('id-ID')} Jt</span>
                          {isAdmin && (
                            <button onClick={() => handleDeleteLops(l.month, l.year)}
                              className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50">
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
              <GlassCard className="p-6">
                <h3 className="font-semibold text-slate-900 mb-1">Omzet Umum (Self-Report)</h3>
                <p className="text-xs text-slate-400 mb-4">Dilaporkan langsung oleh UMKM</p>
                {finThisYear.length === 0 ? (
                  <div className="text-sm text-slate-400 py-4 text-center">Belum ada laporan omzet.</div>
                ) : (
                  <div className="flex flex-col divide-y divide-slate-50">
                    {finThisYear.sort((a, b) => b.month - a.month).map(f => (
                      <div key={`${f.month}-${f.year}`} className="flex justify-between items-center py-2.5">
                        <span className="text-sm text-slate-600">{MONTHS_ID[f.month]}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">Rp {f.revenue.toLocaleString('id-ID')} Jt</div>
                          {f.profit != null && <div className="text-xs text-emerald-600">Profit: Rp {f.profit.toFixed(0)} Jt</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        );
      })()}

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
