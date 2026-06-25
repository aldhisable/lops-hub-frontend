"use client";

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { analyticsApi } from '@/lib/api';
import type { KabkotaData, MapLevel, ProvinceData } from '@/components/ui/leaflet-map';

const LeafletMap = dynamic(
  () => import('@/components/ui/leaflet-map').then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Memuat peta...</span>
        </div>
      </div>
    ),
  }
);

const LEGEND: Record<MapLevel, Array<{ color: string; label: string }>> = {
  province: [
    { color: '#1e40af', label: '> 30 UMKM' },
    { color: '#2563eb', label: '21 – 30' },
    { color: '#3b82f6', label: '11 – 20' },
    { color: '#60a5fa', label: '6 – 10' },
    { color: '#93c5fd', label: '2 – 5' },
    { color: '#e2e8f0', label: '0 – 1' },
  ],
  kabkota: [
    { color: '#1e40af', label: '> 20 UMKM' },
    { color: '#2563eb', label: '11 – 20' },
    { color: '#3b82f6', label: '6 – 10' },
    { color: '#60a5fa', label: '3 – 5' },
    { color: '#93c5fd', label: '2' },
    { color: '#e2e8f0', label: '0 – 1' },
  ],
};

export function DashboardMapCard() {
  const [level, setLevel] = useState<MapLevel>('province');
  const [provinceData, setProvinceData] = useState<ProvinceData>({});
  const [kabkotaData, setKabkotaData] = useState<KabkotaData>({});
  const [loading, setLoading] = useState(true);
  const [kabkotaLoading, setKabkotaLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErrMsg(null);
    analyticsApi
      .mapData()
      .then(({ data }) => {
        const provMap: ProvinceData = {};
        for (const row of data.byProvince ?? []) {
          provMap[row.province] = (provMap[row.province] ?? 0) + row.count;
        }
        setProvinceData(provMap);

        const cityMap: KabkotaData = {};
        for (const row of data.byCity ?? []) {
          cityMap[row.city] = (cityMap[row.city] ?? 0) + row.count;
        }
        setKabkotaData(cityMap);
      })
      .catch((err) => {
        const status = err?.response?.status;
        setErrMsg(
          status === 401 || status === 403
            ? 'Sesi tidak valid — silakan login ulang'
            : `Gagal memuat data peta (${status ?? err?.message ?? 'network'})`
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const totalUmkm = useMemo(
    () => Object.values(provinceData).reduce((s, n) => s + n, 0),
    [provinceData]
  );

  const tabClass = (active: boolean) =>
    active
      ? 'px-4 py-1.5 text-sm font-medium bg-white rounded-md shadow-sm text-slate-800'
      : 'px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700';

  return (
    <GlassCard className="p-6 lg:col-span-2 min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-lg text-slate-900">Peta Sebaran UMKM</h3>
          {!loading && totalUmkm > 0 && (
            <p className="text-xs text-slate-500 mt-0.5">{totalUmkm.toLocaleString('id-ID')} UMKM terpetakan</p>
          )}
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button className={tabClass(level === 'province')} onClick={() => setLevel('province')}>
            Provinsi
          </button>
          <button className={tabClass(level === 'kabkota')} onClick={() => setLevel('kabkota')}>
            Kota / Kabupaten
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-slate-100 relative overflow-hidden min-h-[320px]">
        <LeafletMap
          level={level}
          provinceData={provinceData}
          kabkotaData={kabkotaData}
          showCityPins={false}
          onKabkotaLoadingChange={setKabkotaLoading}
          height="100%"
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-slate-700">
            <Info className="w-3.5 h-3.5" /> Jumlah UMKM
          </div>
          <div className="flex flex-col gap-1">
            {LEGEND[level].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="w-4 h-3 rounded-sm shrink-0" style={{ backgroundColor: l.color }} />
                <span className="text-xs text-slate-600">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {!loading && (errMsg || totalUmkm === 0) && (
          <div className="absolute inset-x-0 top-3 z-[1000] flex justify-center pointer-events-none">
            <span className={`text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm border ${errMsg ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-slate-600 bg-white/90 border-slate-200'}`}>
              {errMsg ?? 'Belum ada data wilayah yang termuat'}
            </span>
          </div>
        )}

        {(loading || kabkotaLoading) && (
          <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-500">
                {kabkotaLoading ? 'Memuat batas kabupaten/kota...' : 'Memuat data peta...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
