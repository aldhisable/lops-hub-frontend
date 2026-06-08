"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { RadarChart } from '@/components/ui/radar-chart';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { analyticsApi, assessmentApi, financialApi } from '@/lib/api';
import { ChevronDown, ChevronUp, Pencil, CheckCircle2, Info } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Indicator {
  id: string;
  pillar: string;
  label: string;
  score: number;
  source: 'computed' | 'input';
}

interface Score5S {
  totalScore: number;
  pillars: Record<string, { score: number; weight: number }>;
  indicators: Indicator[];
  assessment: Record<string, unknown> | null;
  establishedYear: number | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PILLAR_META: Record<string, { label: string; color: string; weight: number }> = {
  spread:   { label: 'Spread',   color: 'bg-rose-500',   weight: 25 },
  size:     { label: 'Size',     color: 'bg-orange-500', weight: 25 },
  sustain:  { label: 'Sustain',  color: 'bg-green-500',  weight: 35 },
  share:    { label: 'Share',    color: 'bg-blue-500',   weight: 15 },
  supplier: { label: 'Supplier', color: 'bg-purple-500', weight: 5  },
};

const SCORE_LABEL: Record<number, { label: string; color: string }> = {
  0:   { label: 'Belum Diisi', color: 'text-slate-400' },
  25:  { label: 'Bronze',      color: 'text-orange-600' },
  50:  { label: 'Silver',      color: 'text-slate-500' },
  75:  { label: 'Gold',        color: 'text-amber-600' },
  100: { label: 'Platinum',    color: 'text-blue-600' },
};

const TECH_OPTIONS = [
  { value: 'NONE',      label: 'Belum ada pemanfaatan teknologi' },
  { value: 'OFFLINE',   label: 'Teknologi, pemasaran offline' },
  { value: 'SOSMED',    label: 'Teknologi, pemasaran medsos' },
  { value: 'ECOMMERCE', label: 'Teknologi, pemasaran e-commerce' },
];
const LEGAL_OPTIONS = [
  { value: 'NONE',           label: 'Belum punya sama sekali' },
  { value: 'PERMIT',         label: 'Ada ijin usaha, legal produk & perpajakan belum' },
  { value: 'PERMIT_PRODUCT', label: 'Ada ijin usaha, legal produk sudah, perpajakan belum' },
  { value: 'FULL',           label: 'Ada ijin usaha, legal produk, dan perpajakan' },
];
const REACH_OPTIONS = [
  { value: 'LOCAL',    label: 'Lokal' },
  { value: 'REGIONAL', label: 'Antar Kab/Kota dalam 1 Provinsi (Regional)' },
  { value: 'NATIONAL', label: 'Antar Provinsi (Skala Nasional)' },
  { value: 'EXPORT',   label: 'Ekspor (mancanegara)' },
];
const EXHIBIT_OPTIONS = [
  { value: 'NONE',          label: 'Belum pernah / Skala Lokal (Frek < 3/thn)' },
  { value: 'PROVINCIAL',    label: 'Skala Provinsi (Frek > 2/thn)' },
  { value: 'NATIONAL',      label: 'Skala Nasional (Frek > 2/thn)' },
  { value: 'INTERNATIONAL', label: 'Skala Internasional (Frek > 1/thn)' },
];
const SUPPLIER_OPTIONS = [
  { value: 'NONE',            label: 'Belum memiliki supplier tetap' },
  { value: 'INFORMAL',        label: 'Sudah memiliki supplier tetap, belum ada ikatan legal' },
  { value: 'FORMAL_ONE',      label: 'Sudah memiliki 1 supplier tetap & ada ikatan legal' },
  { value: 'FORMAL_MULTIPLE', label: 'Sudah mempunyai >1 supplier tetap & ada ikatan legal' },
];

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

// ─── Assessment Form ──────────────────────────────────────────────────────────

interface AssessmentFormProps {
  initial: Record<string, unknown>;
  onSaved: () => void;
  onCancel: () => void;
}

function AssessmentForm({ initial, onSaved, onCancel }: AssessmentFormProps) {
  const [form, setForm] = useState({
    employeeCount: String(initial.employeeCount ?? ''),
    technologyLevel: String(initial.technologyLevel ?? ''),
    legalStatus: String(initial.legalStatus ?? ''),
    marketReach: String(initial.marketReach ?? ''),
    exhibitionScale: String(initial.exhibitionScale ?? ''),
    supplierStatus: String(initial.supplierStatus ?? ''),
    assetGrowthMillion: String(initial.assetGrowthMillion ?? ''),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await assessmentApi.upsertMe({
        employeeCount: form.employeeCount !== '' ? parseInt(form.employeeCount) : null,
        technologyLevel: form.technologyLevel || null,
        legalStatus: form.legalStatus || null,
        marketReach: form.marketReach || null,
        exhibitionScale: form.exhibitionScale || null,
        supplierStatus: form.supplierStatus || null,
        assetGrowthMillion: form.assetGrowthMillion !== '' ? parseFloat(form.assetGrowthMillion) : null,
      });
      onSaved();
    } catch {
      setError('Gagal menyimpan data. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const selectClass = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white";
  const inputClass = `${selectClass}`;

  return (
    <GlassCard className="p-6 mb-6">
      <h3 className="font-semibold text-lg text-slate-900 mb-1">Update Data Penilaian 5S</h3>
      <p className="text-sm text-slate-500 mb-5">Data ini digunakan untuk menghitung skor klasifikasi kelas UMK Anda.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SIZE */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kenaikan Aset Usaha (Juta Rp)</label>
          <input type="number" min="0" placeholder="cth: 350" value={form.assetGrowthMillion}
            onChange={(e) => set('assetGrowthMillion', e.target.value)} className={inputClass} />
          <p className="text-xs text-slate-400 mt-1">Di luar tanah & bangunan</p>
        </div>

        {/* SUSTAIN - SDM */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jumlah Tenaga Kerja</label>
          <input type="number" min="0" placeholder="cth: 8" value={form.employeeCount}
            onChange={(e) => set('employeeCount', e.target.value)} className={inputClass} />
        </div>

        {/* SUSTAIN - Operasi */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Aspek Operasi (Teknologi)</label>
          <select value={form.technologyLevel} onChange={(e) => set('technologyLevel', e.target.value)} className={selectClass}>
            <option value="">-- Pilih --</option>
            {TECH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* SUSTAIN - Legal */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Aspek Legal</label>
          <select value={form.legalStatus} onChange={(e) => set('legalStatus', e.target.value)} className={selectClass}>
            <option value="">-- Pilih --</option>
            {LEGAL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* SHARE - Jangkauan */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jangkauan Pemasaran</label>
          <select value={form.marketReach} onChange={(e) => set('marketReach', e.target.value)} className={selectClass}>
            <option value="">-- Pilih --</option>
            {REACH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* SHARE - Ekspo */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ekspo Produk (Pameran)</label>
          <select value={form.exhibitionScale} onChange={(e) => set('exhibitionScale', e.target.value)} className={selectClass}>
            <option value="">-- Pilih --</option>
            {EXHIBIT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* SUPPLIER */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Keberlanjutan Bahan Baku (Supplier)</label>
          <select value={form.supplierStatus} onChange={(e) => set('supplierStatus', e.target.value)} className={selectClass}>
            <option value="">-- Pilih --</option>
            {SUPPLIER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

      <div className="flex gap-3 mt-5">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
          Batal
        </button>
        <button onClick={handleSave} disabled={saving}
          className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {saving ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>
    </GlassCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkspaceAnalytics() {
  const [score5S, setScore5S] = useState<Score5S | null>(null);
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s5, fin] = await Promise.all([
        analyticsApi.workspace5S().then((r) => r.data as Score5S),
        financialApi.getMe().then((r) => r.data),
      ]);
      setScore5S(s5);

      const currentYear = new Date().getFullYear();
      const rows: typeof monthlyData = MONTH_NAMES.map((month, i) => {
        const entry = (fin as Array<{ month: number; year: number; revenue: number }>)
          .find((f) => f.month === i + 1 && f.year === currentYear);
        return { month, revenue: entry ? entry.revenue / 1_000_000 : 0 };
      }).filter((r) => r.revenue > 0);
      setMonthlyData(rows);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const radarData = score5S
    ? Object.entries(score5S.pillars).map(([key, val]) => ({
        subject: PILLAR_META[key]?.label ?? key,
        A: val.score,
        fullMark: 100,
      }))
    : [];

  const classifyTotal = (s: number) => {
    if (s >= 88) return { label: 'Platinum', color: 'text-blue-600' };
    if (s >= 63) return { label: 'Gold', color: 'text-amber-600' };
    if (s >= 38) return { label: 'Silver', color: 'text-slate-500' };
    return { label: 'Bronze', color: 'text-orange-600' };
  };

  if (loading) {
    return (
      <GlassCard className="p-12 flex items-center justify-center text-slate-400">
        Memuat data analytics...
      </GlassCard>
    );
  }

  const totalClass = score5S ? classifyTotal(score5S.totalScore) : null;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Usaha</h1>
          <p className="text-slate-500 mt-1">Insight dan analisis performa usaha berdasarkan framework 5S</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Pencil className="w-4 h-4" /> Update Data Penilaian
          </button>
        )}
      </div>

      {/* Assessment Form */}
      {editing && score5S && (
        <AssessmentForm
          initial={score5S.assessment ?? {}}
          onSaved={() => { setEditing(false); fetchAll(); }}
          onCancel={() => setEditing(false)}
        />
      )}

      {/* Total Score Card */}
      {score5S && (
        <GlassCard className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Skor Total 5S</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-900">{score5S.totalScore}</span>
                <span className="text-sm text-slate-400">/ 100</span>
                {totalClass && (
                  <span className={`font-semibold text-lg ${totalClass.color}`}>{totalClass.label}</span>
                )}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(score5S.pillars).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="text-xs text-slate-500">{PILLAR_META[key]?.label}</div>
                  <div className="font-bold text-slate-800">{val.score}</div>
                  <div className="text-xs text-slate-400">({val.weight}%)</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-blue-500 transition-all duration-700"
              style={{ width: `${score5S.totalScore}%` }}
            />
          </div>
        </GlassCard>
      )}

      {/* Radar + Monthly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RadarChart
          title="Radar Skor 5S"
          data={radarData}
          dataKey="A"
          angleKey="subject"
          color="#8b5cf6"
          height={300}
        />
        {monthlyData.length > 0 ? (
          <AnalyticsChart
            title="Tren Omzet Bulanan (Juta Rp)"
            data={monthlyData}
            dataKey="revenue"
            xAxisKey="month"
            height={300}
            color="#3b82f6"
          />
        ) : (
          <GlassCard className="p-6 flex flex-col items-center justify-center h-[300px]">
            <Info className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-400 text-center">Belum ada data omzet.<br />Isi data di menu Omzet &amp; Growth.</p>
          </GlassCard>
        )}
      </div>

      {/* 10 Indicator Breakdown by Pillar */}
      {score5S && (
        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg text-slate-900 mb-5">10 Indikator Penilaian Kelas</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(PILLAR_META).map(([pillarKey, pillarMeta]) => {
              const pillars = score5S.indicators.filter((ind) => ind.pillar === pillarKey.toUpperCase());
              const isOpen = expandedPillar === pillarKey;
              const pillarScore = score5S.pillars[pillarKey]?.score ?? 0;

              return (
                <div key={pillarKey} className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedPillar(isOpen ? null : pillarKey)}
                  >
                    <div className={`w-3 h-3 rounded-full ${pillarMeta.color}`} />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{pillarMeta.label}</span>
                        <span className="text-xs text-slate-400">({pillarMeta.weight}%)</span>
                      </div>
                      <ScoreBar score={pillarScore} color={pillarMeta.color} />
                    </div>
                    <div className="text-right min-w-[64px]">
                      <span className="font-bold text-slate-800">{pillarScore}</span>
                      <span className="text-slate-400 text-sm">/100</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 border-t border-slate-100 bg-slate-50/50">
                      <div className="flex flex-col gap-3 mt-3">
                        {pillars.map((ind) => {
                          const sl = SCORE_LABEL[ind.score] ?? SCORE_LABEL[0];
                          return (
                            <div key={ind.id} className="flex items-center gap-3">
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${ind.score > 0 ? 'text-green-500' : 'text-slate-300'}`} />
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-slate-700">{ind.label}</span>
                                  <span className={`text-xs font-semibold ${sl.color}`}>{sl.label}</span>
                                </div>
                                <ScoreBar score={ind.score} color={pillarMeta.color} />
                              </div>
                              <span className="text-sm font-bold text-slate-600 min-w-[32px] text-right">{ind.score}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </>
  );
}
