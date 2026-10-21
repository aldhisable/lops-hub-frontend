"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Ship, Globe2, DollarSign, Building2, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { SearchableSelect, type Wilayah } from '@/components/ui/wilayah-select';
import { exportApi, type ExportSummary } from '@/lib/api';
import { formatCompactRupiah, formatRupiah } from '@/lib/currency';

const CLASS_COLORS: Record<string, string> = {
  PLATINUM: 'bg-blue-100 text-blue-700',
  GOLD: 'bg-amber-100 text-amber-700',
  SILVER: 'bg-slate-200 text-slate-700',
  BRONZE: 'bg-orange-100 text-orange-700',
};

export function ExportPage() {
  const [summary, setSummary] = useState<ExportSummary | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    exportApi.countries().then(({ data }) => setCountries(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    exportApi
      .summary(country ? { country } : undefined)
      .then(({ data }) => setSummary(data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [country]);

  const countryOpts: Wilayah[] = useMemo(
    () => countries.map((c) => ({ id: c, name: c })),
    [countries]
  );

  const maxCountryValue = useMemo(
    () => Math.max(1, ...(summary?.byCountry ?? []).map((c) => c.value)),
    [summary]
  );

  const stats = [
    { label: 'UMK Ekspor', value: summary ? summary.totalExportingUmkm.toLocaleString('id-ID') : '—', icon: Building2, bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Total Nilai Ekspor', value: summary ? formatCompactRupiah(summary.totalValue) : '—', icon: DollarSign, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Negara Tujuan', value: summary ? summary.totalCountries.toLocaleString('id-ID') : '—', icon: Globe2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Total Transaksi', value: summary ? summary.totalTransactions.toLocaleString('id-ID') : '—', icon: Ship, bg: 'bg-amber-50', color: 'text-amber-600' },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Ship className="w-7 h-7 text-blue-600" /> Ekspor UMK
          </h1>
          <p className="text-slate-500 mt-1">Informasi ekspor UMK binaan — terkait program Gedor Ekspor</p>
        </div>
        <div className="w-full md:w-64">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchableSelect
                options={countryOpts}
                value={country}
                onChange={(o) => setCountry(o.name)}
                placeholder="Filter negara tujuan"
              />
            </div>
            {country && (
              <button
                onClick={() => setCountry('')}
                className="p-2.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                title="Reset filter"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-sm text-slate-500 font-medium">{s.label}</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Negara tujuan */}
        <GlassCard className="p-6 lg:col-span-1">
          <h3 className="font-semibold text-lg text-slate-900 mb-4">Negara Tujuan Ekspor</h3>
          {loading ? (
            <div className="text-sm text-slate-400 py-6 text-center">Memuat...</div>
          ) : !summary || summary.byCountry.length === 0 ? (
            <div className="text-sm text-slate-400 py-6 text-center">Belum ada data ekspor</div>
          ) : (
            <div className="flex flex-col gap-3">
              {summary.byCountry.map((c) => (
                <div key={c.country}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-medium text-slate-700">{c.country}</span>
                    <span className="text-slate-500">{c.umkmCount} UMK · {formatCompactRupiah(c.value)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.value / maxCountryValue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Daftar transaksi ekspor */}
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="font-semibold text-lg text-slate-900 mb-4">
            Riwayat Ekspor UMK{country ? ` ke ${country}` : ''}
          </h3>
          {loading ? (
            <div className="text-sm text-slate-400 py-6 text-center">Memuat...</div>
          ) : !summary || summary.records.length === 0 ? (
            <div className="text-sm text-slate-400 py-10 text-center">Belum ada catatan ekspor</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="py-2 pr-4 font-medium">UMK</th>
                    <th className="py-2 pr-4 font-medium">Negara</th>
                    <th className="py-2 pr-4 font-medium">Tahun</th>
                    <th className="py-2 pr-4 font-medium">Komoditas</th>
                    <th className="py-2 font-medium text-right">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.records.map((r) => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-2.5 pr-4">
                        <Link href={`/dashboard/umkm/${r.umkmId}`} className="font-medium text-slate-800 hover:text-blue-600">
                          {r.umkmName}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          {[r.city, r.province].filter(Boolean).length > 0 && (
                            <span className="text-xs text-slate-400">{[r.city, r.province].filter(Boolean).join(', ')}</span>
                          )}
                          {r.classification && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${CLASS_COLORS[r.classification] ?? 'bg-slate-100 text-slate-600'}`}>
                              {r.classification}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-700">{r.country}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{r.year}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{r.commodity}</td>
                      <td className="py-2.5 text-right text-slate-800">{r.value > 0 ? formatRupiah(r.value) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}
