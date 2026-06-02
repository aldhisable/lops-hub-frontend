"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Filter, MapPin, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { FilterChips } from '@/components/ui/filter-chips';
import { analyticsApi } from '@/lib/api';
import type { CityPin, ProvinceData } from '@/components/ui/leaflet-map';

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

// ── Koordinat kota-kota Indonesia ──────────────────────────────────────────
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // DKI Jakarta & sekitar
  'dki jakarta':       { lat: -6.200,  lng: 106.816 },
  'jakarta':           { lat: -6.200,  lng: 106.816 },
  'jakarta selatan':   { lat: -6.261,  lng: 106.810 },
  'jakarta utara':     { lat: -6.121,  lng: 106.884 },
  'jakarta barat':     { lat: -6.168,  lng: 106.763 },
  'jakarta timur':     { lat: -6.225,  lng: 106.900 },
  'jakarta pusat':     { lat: -6.186,  lng: 106.845 },
  'bekasi':            { lat: -6.238,  lng: 106.975 },
  'kabupaten bekasi':  { lat: -6.350,  lng: 107.150 },
  'depok':             { lat: -6.402,  lng: 106.794 },
  'tangerang':         { lat: -6.178,  lng: 106.640 },
  'tanggerang':        { lat: -6.178,  lng: 106.640 },
  'tangerang selatan': { lat: -6.289,  lng: 106.714 },
  'bogor':             { lat: -6.596,  lng: 106.806 },
  'kabupaten bogor':   { lat: -6.596,  lng: 106.806 },
  // Jawa Barat
  'bandung':           { lat: -6.917,  lng: 107.619 },
  'kota bandung':      { lat: -6.917,  lng: 107.619 },
  'kabupaten bandung': { lat: -7.030,  lng: 107.580 },
  'cimahi':            { lat: -6.872,  lng: 107.543 },
  'sukabumi':          { lat: -6.920,  lng: 106.927 },
  'cirebon':           { lat: -6.706,  lng: 108.557 },
  'subang':            { lat: -6.577,  lng: 107.757 },
  'karawang':          { lat: -6.321,  lng: 107.338 },
  'garut':             { lat: -7.217,  lng: 107.907 },
  'tasikmalaya':       { lat: -7.327,  lng: 108.221 },
  // Jawa Tengah
  'semarang':          { lat: -6.967,  lng: 110.417 },
  'surakarta':         { lat: -7.576,  lng: 110.827 },
  'solo':              { lat: -7.576,  lng: 110.827 },
  'yogyakarta':        { lat: -7.797,  lng: 110.370 },
  'magelang':          { lat: -7.470,  lng: 110.218 },
  'pekalongan':        { lat: -6.889,  lng: 109.675 },
  'tegal':             { lat: -6.869,  lng: 109.125 },
  'purwokerto':        { lat: -7.424,  lng: 109.235 },
  'purworejo':         { lat: -7.707,  lng: 110.014 },
  // Jawa Timur
  'surabaya':          { lat: -7.257,  lng: 112.752 },
  'malang':            { lat: -7.983,  lng: 112.621 },
  'kota malang':       { lat: -7.983,  lng: 112.621 },
  'sidoarjo':          { lat: -7.447,  lng: 112.718 },
  'mojokerto':         { lat: -7.472,  lng: 111.522 },
  'kediri':            { lat: -7.816,  lng: 112.011 },
  'blitar':            { lat: -8.096,  lng: 112.162 },
  'jember':            { lat: -8.173,  lng: 113.700 },
  'banyuwangi':        { lat: -8.219,  lng: 114.369 },
  'probolinggo':       { lat: -7.755,  lng: 113.216 },
  'pasuruan':          { lat: -7.645,  lng: 112.907 },
  'gresik':            { lat: -7.155,  lng: 112.655 },
  'lamongan':          { lat: -7.120,  lng: 112.411 },
  // DIY
  'gunungkidul':       { lat: -7.960,  lng: 110.592 },
  'sleman':            { lat: -7.717,  lng: 110.356 },
  'bantul':            { lat: -7.887,  lng: 110.333 },
  'kulonprogo':        { lat: -7.830,  lng: 110.155 },
  // Bali
  'bali':              { lat: -8.340,  lng: 115.092 },
  'denpasar':          { lat: -8.655,  lng: 115.216 },
  'denpasar barat':    { lat: -8.655,  lng: 115.180 },
  'badung':            { lat: -8.585,  lng: 115.188 },
  'gianyar':           { lat: -8.535,  lng: 115.331 },
  'buleleng':          { lat: -8.112,  lng: 115.088 },
  'tabanan':           { lat: -8.540,  lng: 115.099 },
  'klungkung':         { lat: -8.539,  lng: 115.404 },
  // NTB
  'mataram':           { lat: -8.583,  lng: 116.117 },
  'lombok':            { lat: -8.650,  lng: 116.324 },
  // NTT
  'kupang':            { lat: -10.162, lng: 123.606 },
  'maumere':           { lat: -8.618,  lng: 122.213 },
  'kabupaten nagekeo': { lat: -8.904,  lng: 121.338 },
  // Sumatera Utara
  'medan':             { lat:  3.595,  lng:  98.672 },
  'binjai':            { lat:  3.600,  lng:  98.485 },
  'pematangsiantar':   { lat:  2.960,  lng:  99.068 },
  'rantau prapat labuhanbatu': { lat:  2.100, lng: 99.833 },
  'rantau prapat':     { lat:  2.100,  lng:  99.833 },
  // Sumatera Barat
  'padang':            { lat: -0.950,  lng: 100.354 },
  'bukittinggi':       { lat: -0.308,  lng: 100.369 },
  // Riau
  'pekanbaru':         { lat:  0.533,  lng: 101.450 },
  'batam':             { lat:  1.045,  lng: 104.030 },
  // Kepulauan Riau
  'tanjungpinang':     { lat:  0.918,  lng: 104.478 },
  // Jambi
  'jambi':             { lat: -1.611,  lng: 103.612 },
  // Sumatera Selatan
  'palembang':         { lat: -2.976,  lng: 104.775 },
  // Bengkulu
  'bengkulu':          { lat: -3.792,  lng: 102.261 },
  // Lampung
  'bandar lampung':    { lat: -5.454,  lng: 105.261 },
  // Kalimantan Barat
  'pontianak':         { lat: -0.023,  lng: 109.332 },
  // Kalimantan Tengah
  'palangka raya':     { lat: -2.208,  lng: 113.916 },
  // Kalimantan Selatan
  'banjarmasin':       { lat: -3.318,  lng: 114.591 },
  'banjarbaru':        { lat: -3.443,  lng: 114.832 },
  // Kalimantan Timur
  'samarinda':         { lat: -0.502,  lng: 117.154 },
  'balikpapan':        { lat: -1.269,  lng: 116.829 },
  // Sulawesi Selatan
  'makassar':          { lat: -5.147,  lng: 119.432 },
  'parepare':          { lat: -4.014,  lng: 119.631 },
  'palopo':            { lat: -3.001,  lng: 120.196 },
  // Sulawesi Tengah
  'palu':              { lat: -0.902,  lng: 119.871 },
  // Sulawesi Tenggara
  'kendari':           { lat: -3.972,  lng: 122.515 },
  // Sulawesi Utara
  'manado':            { lat:  1.474,  lng: 124.842 },
  // Maluku
  'ambon':             { lat: -3.655,  lng: 128.191 },
  // Papua
  'jayapura':          { lat: -2.537,  lng: 140.717 },
  // Aceh
  'banda aceh':        { lat:  5.548,  lng:  95.323 },
  'aceh':              { lat:  4.695,  lng:  96.749 },
};

// ── Normalisasi nama provinsi ke format GeoJSON ────────────────────────────
function normalizeProvince(raw: string): string {
  const map: Record<string, string> = {
    'dki jakarta': 'DKI JAKARTA',
    'jakarta': 'DKI JAKARTA',
    'jawa barat': 'JAWA BARAT',
    'jawabarat': 'JAWA BARAT',
    'jawa tengah': 'JAWA TENGAH',
    'jawatengah': 'JAWA TENGAH',
    'jawa timur': 'JAWA TIMUR',
    'jawatimur': 'JAWA TIMUR',
    'daerah istimewa yogyakarta': 'DI YOGYAKARTA',
    'di yogyakarta': 'DI YOGYAKARTA',
    'yogyakarta': 'DI YOGYAKARTA',
    'bali': 'BALI',
    'nusa tenggara barat': 'NUSA TENGGARA BARAT',
    'ntb': 'NUSA TENGGARA BARAT',
    'nusa tenggara timur': 'NUSA TENGGARA TIMUR',
    'ntt': 'NUSA TENGGARA TIMUR',
    'sumatera utara': 'SUMATERA UTARA',
    'sumatra utara': 'SUMATERA UTARA',
    'sumatera barat': 'SUMATERA BARAT',
    'sumatera selatan': 'SUMATERA SELATAN',
    'riau': 'RIAU',
    'kepulauan riau': 'KEPULAUAN RIAU',
    'jambi': 'JAMBI',
    'bengkulu': 'BENGKULU',
    'lampung': 'LAMPUNG',
    'bangka belitung': 'KEPULAUAN BANGKA BELITUNG',
    'aceh': 'ACEH',
    'kalimantan barat': 'KALIMANTAN BARAT',
    'kalimantan tengah': 'KALIMANTAN TENGAH',
    'kalimantan selatan': 'KALIMANTAN SELATAN',
    'kalimantan timur': 'KALIMANTAN TIMUR',
    'kalimantan utara': 'KALIMANTAN UTARA',
    'sulawesi selatan': 'SULAWESI SELATAN',
    'sulawesi tengah': 'SULAWESI TENGAH',
    'sulawesi tenggara': 'SULAWESI TENGGARA',
    'sulawesi utara': 'SULAWESI UTARA',
    'sulawesi barat': 'SULAWESI BARAT',
    'gorontalo': 'GORONTALO',
    'maluku': 'MALUKU',
    'maluku utara': 'MALUKU UTARA',
    'papua': 'PAPUA',
    'papua barat': 'PAPUA BARAT',
    'banten': 'BANTEN',
  };
  const key = raw.toLowerCase().trim();
  return map[key] ?? raw.toUpperCase().trim();
}

function getCityCoords(city: string): { lat: number; lng: number } | null {
  const key = city.toLowerCase().trim();
  return CITY_COORDS[key] ?? null;
}

const LEGEND = [
  { color: '#1e40af', label: '> 30 UMKM' },
  { color: '#2563eb', label: '21 – 30' },
  { color: '#3b82f6', label: '11 – 20' },
  { color: '#60a5fa', label: '6 – 10'  },
  { color: '#93c5fd', label: '2 – 5'   },
  { color: '#e2e8f0', label: '0 – 1'   },
];

export function MapPage() {
  const [activeProgram, setActiveProgram] = useState('Semua Program');
  const [activeClass, setActiveClass] = useState('Semua Kelas');
  const [selected, setSelected] = useState<{ label: string; count: number } | null>(null);
  const [cityPins, setCityPins] = useState<CityPin[]>([]);
  const [provinceData, setProvinceData] = useState<ProvinceData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.mapData()
      .then(({ data }) => {
        // ── City pins ──────────────────────────────────────────────────────
        const pinMap = new Map<string, CityPin>();
        for (const row of data.byCity) {
          const coords = getCityCoords(row.city);
          if (!coords) continue;
          const key = row.city.toLowerCase().trim();
          if (pinMap.has(key)) {
            pinMap.get(key)!.count += row.count;
          } else {
            pinMap.set(key, { lat: coords.lat, lng: coords.lng, label: row.city, count: row.count });
          }
        }
        setCityPins(Array.from(pinMap.values()));

        // ── Province choropleth ────────────────────────────────────────────
        const provMap: ProvinceData = {};
        for (const row of data.byProvince) {
          const normalized = normalizeProvince(row.province);
          provMap[normalized] = (provMap[normalized] ?? 0) + row.count;
        }
        setProvinceData(provMap);

        // Default selected = kota terbanyak
        const top = Array.from(pinMap.values()).sort((a, b) => b.count - a.count)[0];
        if (top) setSelected({ label: top.label, count: top.count });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalUmkm = cityPins.reduce((s, p) => s + p.count, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Peta Sebaran Nasional</h1>
          <p className="text-slate-500 mt-1">
            Pemetaan interaktif UMKM binaan di seluruh Indonesia
            {!loading && totalUmkm > 0 && (
              <span className="ml-2 text-blue-600 font-medium">· {totalUmkm} UMKM terpetakan</span>
            )}
          </p>
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
          cityPins={cityPins}
          provinceData={provinceData}
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
          {selected ? (
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
          ) : (
            <p className="text-sm text-slate-400">Klik pin kota untuk detail</p>
          )}
        </div>

        {loading && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Memuat data peta...</span>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
