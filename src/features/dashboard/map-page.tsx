"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Filter, MapPin, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { FilterChips } from '@/components/ui/filter-chips';
import type { CityPin, ProvinceData } from '@/components/ui/leaflet-map';

// Dynamic import — react-leaflet tidak support SSR
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

// Data dummy — akan diganti dari API saat backend produksi tersedia
const CITY_PINS: CityPin[] = [
  { lat: -6.2,   lng: 106.816, label: 'DKI Jakarta',      count: 312 },
  { lat: -7.257, lng: 112.752, label: 'Surabaya',          count: 248 },
  { lat: -8.655, lng: 115.216, label: 'Bali',              count: 186 },
  { lat: -5.147, lng: 119.432, label: 'Makassar',          count: 428 },
  { lat: -6.917, lng: 107.619, label: 'Bandung',           count: 195 },
  { lat:  3.595, lng:  98.672, label: 'Medan',             count: 203 },
  { lat: -1.269, lng: 116.829, label: 'Balikpapan',        count:  89 },
  { lat: -3.318, lng: 114.591, label: 'Banjarmasin',       count:  76 },
  { lat: -0.902, lng: 119.871, label: 'Palu',              count:  54 },
  { lat:  1.474, lng: 124.842, label: 'Manado',            count:  42 },
];

// Mapping nama provinsi (uppercase, sesuai GeoJSON superpikar) → jumlah UMKM
const PROVINCE_DATA: ProvinceData = {
  'DKI JAKARTA':        312,
  'JAWA BARAT':         195,
  'JAWA TENGAH':        147,
  'JAWA TIMUR':         248,
  'BALI':               186,
  'SULAWESI SELATAN':   428,
  'SUMATERA UTARA':     203,
  'KALIMANTAN TIMUR':    89,
  'KALIMANTAN SELATAN':  76,
  'SULAWESI TENGAH':     54,
  'SULAWESI UTARA':      42,
  'SUMATERA SELATAN':    68,
  'KALIMANTAN BARAT':    45,
  'NUSA TENGGARA BARAT': 37,
};

// Legend steps
const LEGEND = [
  { color: '#1e40af', label: '> 350 UMKM' },
  { color: '#2563eb', label: '251 – 350' },
  { color: '#3b82f6', label: '151 – 250' },
  { color: '#60a5fa', label: '81 – 150'  },
  { color: '#93c5fd', label: '31 – 80'   },
  { color: '#e2e8f0', label: '0 – 30'    },
];

export function MapPage() {
  const [activeProgram, setActiveProgram] = useState('Semua Program');
  const [activeClass, setActiveClass] = useState('Semua Kelas');
  const [selected, setSelected] = useState<{ label: string; count: number }>(CITY_PINS[3]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Peta Sebaran Nasional</h1>
          <p className="text-slate-500 mt-1">Pemetaan interaktif UMKM binaan di seluruh Indonesia</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 self-end">
            <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter:
            </span>
            <FilterChips
              options={['Semua Kelas', 'Platinum', 'Gold', 'Silver', 'Bronze']}
              selectedOption={activeClass}
              onSelect={setActiveClass}
            />
          </div>
          <div className="flex items-center gap-3 self-end">
            <FilterChips
              options={['Semua Program', 'Maritimepreneur', 'UMK Akselerator', 'Gedor Ekspor']}
              selectedOption={activeProgram}
              onSelect={setActiveProgram}
            />
          </div>
        </div>
      </div>

      {/* Map Area */}
      <GlassCard className="flex-1 rounded-2xl overflow-hidden relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-white/60">
        <LeafletMap
          cityPins={CITY_PINS}
          provinceData={PROVINCE_DATA}
          onSelectPin={(label, count) => setSelected({ label, count })}
          height="100%"
        />

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-slate-700">
            <Info className="w-3.5 h-3.5" /> Jumlah UMKM
          </div>
          <div className="flex flex-col gap-1.5">
            {LEGEND.map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="w-4 h-3 rounded-sm shrink-0" style={{ backgroundColor: l.color }} />
                <span className="text-xs text-slate-600">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="absolute bottom-6 right-6 z-[1000] w-[240px] bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-5 shadow-lg">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" /> Detail Wilayah
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Wilayah</span>
              <strong className="text-slate-900 text-right max-w-[120px] truncate">{selected.label}</strong>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Total UMKM</span>
              <strong className="text-slate-900">{selected.count.toLocaleString('id-ID')}</strong>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Status</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">Aktif</span>
            </div>
            <div className="mt-2 pt-3 border-t border-slate-100">
              <button className="w-full py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                Lihat UMKM di Wilayah Ini
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
