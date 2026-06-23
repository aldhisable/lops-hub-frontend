"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Download, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useWorkspace } from '@/context/workspace-context';
import { financialApi } from '@/lib/api';

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

interface FinRow { month: number; year: number; revenue: number; profit?: number | null }

interface ReportItem {
  key: string;
  name: string;
  period: string;
  type: 'Bulanan' | 'Tahunan';
  download: () => void;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function WorkspaceLaporan() {
  const { umkm } = useWorkspace();
  const [financials, setFinancials] = useState<FinRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    financialApi.getMe()
      .then((r) => setFinancials(r.data as FinRow[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const usahaName = umkm?.name ?? 'UMKM';

  const reports = useMemo<ReportItem[]>(() => {
    if (financials.length === 0) return [];
    const years = Array.from(new Set(financials.map((f) => f.year))).sort((a, b) => b - a);

    const annual: ReportItem[] = years.map((y) => {
      const rows = financials.filter((f) => f.year === y).sort((a, b) => a.month - b.month);
      const totalRev = rows.reduce((s, f) => s + (f.revenue || 0), 0);
      const totalProfit = rows.reduce((s, f) => s + (f.profit || 0), 0);
      return {
        key: `y-${y}`,
        name: `Laporan Tahunan ${y}`,
        period: `Tahun ${y}`,
        type: 'Tahunan',
        download: () =>
          downloadCsv(`Laporan_Tahunan_${y}_${usahaName}.csv`, [
            ['Laporan Tahunan', usahaName],
            ['Tahun', y],
            [],
            ['Bulan', 'Omzet (Rp)', 'Laba (Rp)'],
            ...rows.map((f) => [MONTH_NAMES[f.month - 1], f.revenue, f.profit ?? 0]),
            [],
            ['Total', totalRev, totalProfit],
          ]),
      };
    });

    const monthly: ReportItem[] = [...financials]
      .sort((a, b) => b.year - a.year || b.month - a.month)
      .map((f) => ({
        key: `m-${f.year}-${f.month}`,
        name: `Laporan Omzet ${MONTH_NAMES[f.month - 1]} ${f.year}`,
        period: `${MONTH_NAMES[f.month - 1]} ${f.year}`,
        type: 'Bulanan',
        download: () =>
          downloadCsv(`Laporan_Omzet_${MONTH_NAMES[f.month - 1]}_${f.year}_${usahaName}.csv`, [
            ['Laporan Omzet', usahaName],
            ['Periode', `${MONTH_NAMES[f.month - 1]} ${f.year}`],
            [],
            ['Omzet (Rp)', f.revenue],
            ['Laba (Rp)', f.profit ?? 0],
          ]),
      }));

    return [...annual, ...monthly];
  }, [financials, usahaName]);

  return (
    <>
      <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Laporan Saya</h1><p className="text-slate-500 mt-1">Unduh laporan kinerja usaha Anda</p></div>

      {loading ? (
        <GlassCard className="p-12 text-center text-slate-400">Memuat laporan...</GlassCard>
      ) : reports.length === 0 ? (
        <GlassCard className="p-12 flex flex-col items-center text-center">
          <Info className="w-9 h-9 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">Belum ada laporan</p>
          <p className="text-sm text-slate-400 mt-1">Isi data omzet di menu <strong>Omzet &amp; Growth</strong> — laporan akan dibuat otomatis dari data Anda.</p>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((r) => (
            <GlassCard key={r.key} className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-600" /></div>
              <div className="flex-1"><h4 className="text-sm font-bold text-slate-900">{r.name}</h4><p className="text-xs text-slate-400 mt-0.5">{r.period}</p></div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">{r.type}</span>
              <button onClick={r.download} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"><Download className="w-4 h-4" /> Unduh</button>
            </GlassCard>
          ))}
        </div>
      )}
    </>
  );
}
