"use client";
import React, { useState, useEffect } from 'react';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { GlassCard } from '@/components/ui/glass-card';
import { financialApi, lopsSalesApi, umkmApi } from '@/lib/api';

const MONTHS_ID = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

interface FinancialEntry { month: number; year: number; revenue: number; profit: number | null }
interface LopsSalesEntry { month: number; year: number; amount: number; gerai: string | null; notes: string | null }

export default function OmzetPage() {
  const [financials, setFinancials] = useState<FinancialEntry[]>([]);
  const [lopsSales, setLopsSales] = useState<LopsSalesEntry[]>([]);
  const [umkmId, setUmkmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formMonth, setFormMonth] = useState(CURRENT_MONTH);
  const [formYear, setFormYear] = useState(CURRENT_YEAR);
  const [formRevenue, setFormRevenue] = useState('');
  const [formProfit, setFormProfit] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [finRes, meRes] = await Promise.all([
          financialApi.getMe(),
          umkmApi.me(),
        ]);
        setFinancials(finRes.data);
        const id = meRes.data?.id;
        setUmkmId(id);
        if (id) {
          const lopsRes = await lopsSalesApi.getByUmkm(id, CURRENT_YEAR);
          setLopsSales(lopsRes.data);
        }
      } catch {
        // silently fail — halaman tetap tampil dengan data kosong
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const thisYearFinancials = financials.filter(f => f.year === CURRENT_YEAR);
  const omzetBulanIni = thisYearFinancials.find(f => f.month === CURRENT_MONTH)?.revenue ?? 0;
  const omzetTahunIni = thisYearFinancials.reduce((s, f) => s + f.revenue, 0);

  const prevMonth = CURRENT_MONTH === 1 ? 12 : CURRENT_MONTH - 1;
  const prevYear = CURRENT_MONTH === 1 ? CURRENT_YEAR - 1 : CURRENT_YEAR;
  const omzetBulanLalu = financials.find(f => f.month === prevMonth && f.year === prevYear)?.revenue ?? 0;
  const growthPct = omzetBulanLalu > 0 ? ((omzetBulanIni - omzetBulanLalu) / omzetBulanLalu * 100).toFixed(1) : null;

  const chartData = thisYearFinancials
    .sort((a, b) => a.month - b.month)
    .map(f => ({ month: MONTHS_ID[f.month], revenue: f.revenue }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formRevenue) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await financialApi.upsertMe({
        month: formMonth,
        year: formYear,
        revenue: parseFloat(formRevenue),
        profit: formProfit ? parseFloat(formProfit) : undefined,
      });
      setFinancials(prev => {
        const filtered = prev.filter(f => !(f.month === formMonth && f.year === formYear));
        return [...filtered, res.data];
      });
      setSaveMsg('Data berhasil disimpan');
      setFormRevenue('');
      setFormProfit('');
    } catch {
      setSaveMsg('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Memuat data...</div>;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Omzet & Growth</h1>
        <p className="text-slate-500 mt-1">Pantau perkembangan omzet dan pertumbuhan usaha Anda</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <GlassCard className="p-5">
          <div className="text-xs text-slate-500 mb-1">Omzet Bulan Ini</div>
          <div className="text-2xl font-bold text-slate-900">Rp {omzetBulanIni.toLocaleString('id-ID')} Jt</div>
          {growthPct !== null && (
            <div className={`text-xs font-semibold mt-1 ${parseFloat(growthPct) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {parseFloat(growthPct) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(growthPct))}% vs bulan lalu
            </div>
          )}
        </GlassCard>
        <GlassCard className="p-5">
          <div className="text-xs text-slate-500 mb-1">Omzet Tahun {CURRENT_YEAR}</div>
          <div className="text-2xl font-bold text-slate-900">Rp {omzetTahunIni.toLocaleString('id-ID')} Jt</div>
          <div className="text-xs text-slate-400 mt-1">{thisYearFinancials.length} bulan dilaporkan</div>
        </GlassCard>
        <GlassCard className="p-5 col-span-2 md:col-span-1">
          <div className="text-xs text-slate-500 mb-1">Penjualan di Gerai LOPs ({CURRENT_YEAR})</div>
          <div className="text-2xl font-bold text-slate-900">
            Rp {lopsSales.reduce((s, l) => s + l.amount, 0).toLocaleString('id-ID')} Jt
          </div>
          <div className="text-xs text-slate-400 mt-1">Diinput oleh admin LOPs</div>
        </GlassCard>
      </div>

      {/* Chart omzet umum */}
      {chartData.length > 0 ? (
        <div className="mb-8">
          <AnalyticsChart
            title="Tren Omzet Umum (Self-Report)"
            data={chartData}
            dataKey="revenue"
            xAxisKey="month"
            height={300}
            color="#8b5cf6"
            valueFormatter={(v) => `Rp ${v} Jt`}
          />
        </div>
      ) : (
        <GlassCard className="p-8 text-center text-slate-400 mb-8">
          Belum ada data omzet yang dilaporkan untuk tahun {CURRENT_YEAR}.
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form input omzet */}
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Laporkan Omzet Bulanan</h3>
          <p className="text-xs text-slate-500 mb-5">Omzet umum dari semua channel penjualan (termasuk di luar gerai LOPs).</p>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Bulan</label>
                <select
                  value={formMonth}
                  onChange={e => setFormMonth(parseInt(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {MONTHS_ID.slice(1).map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Tahun</label>
                <select
                  value={formYear}
                  onChange={e => setFormYear(parseInt(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Omzet (Juta Rupiah)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Contoh: 150"
                value={formRevenue}
                onChange={e => setFormRevenue(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Profit Bersih (Juta Rupiah) — opsional</label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Contoh: 30"
                value={formProfit}
                onChange={e => setFormProfit(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              {saving ? 'Menyimpan...' : 'Simpan Laporan'}
            </button>
            {saveMsg && (
              <p className={`text-sm font-medium ${saveMsg.includes('berhasil') ? 'text-emerald-600' : 'text-red-500'}`}>
                {saveMsg}
              </p>
            )}
          </form>
        </GlassCard>

        {/* Riwayat laporan */}
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Riwayat Laporan Omzet</h3>
          {thisYearFinancials.length === 0 ? (
            <div className="text-sm text-slate-400 py-8 text-center">Belum ada laporan untuk tahun {CURRENT_YEAR}.</div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-50">
              {thisYearFinancials.sort((a, b) => b.month - a.month).map(f => (
                <div key={`${f.month}-${f.year}`} className="flex justify-between items-center py-3">
                  <span className="text-sm text-slate-600 font-medium">{MONTHS_ID[f.month]} {f.year}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">Rp {f.revenue.toLocaleString('id-ID')} Jt</div>
                    {f.profit != null && (
                      <div className="text-xs text-emerald-600">Profit: Rp {f.profit.toLocaleString('id-ID')} Jt</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Tabel penjualan LOPs (read-only) */}
      {lopsSales.length > 0 && (
        <GlassCard className="p-6 mt-6">
          <h3 className="font-semibold text-slate-900 mb-1">Penjualan di Gerai LOPs</h3>
          <p className="text-xs text-slate-500 mb-4">Data diinput oleh Admin LOPs berdasarkan laporan penjualan gerai konsinyasi.</p>
          <div className="flex flex-col divide-y divide-slate-50">
            {lopsSales.sort((a, b) => b.month - a.month).map(l => (
              <div key={`${l.month}-${l.year}`} className="flex justify-between items-center py-3">
                <div>
                  <span className="text-sm font-medium text-slate-700">{MONTHS_ID[l.month]} {l.year}</span>
                  {l.gerai && <span className="text-xs text-slate-400 ml-2">— {l.gerai}</span>}
                  {l.notes && <p className="text-xs text-slate-400 mt-0.5">{l.notes}</p>}
                </div>
                <div className="text-sm font-bold text-teal-700">Rp {l.amount.toLocaleString('id-ID')} Jt</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </>
  );
}
