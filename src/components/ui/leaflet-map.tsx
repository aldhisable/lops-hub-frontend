"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';

// Pastikan Leaflet mengukur ulang container setelah layout selesai
// (mencegah peta tampil "putih"/blank saat di-mount di dalam flex/grid card).
function InvalidateOnReady() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    const t1 = setTimeout(fix, 0);
    const t2 = setTimeout(fix, 250);
    const t3 = setTimeout(fix, 600);
    const container = map.getContainer();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fix) : null;
    ro?.observe(container);
    window.addEventListener('resize', fix);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      ro?.disconnect();
      window.removeEventListener('resize', fix);
    };
  }, [map]);
  return null;
}

// GeoJSON batas wilayah Indonesia (via jsDelivr CDN)
// Provinsi — 33 provinsi, properti `state` (nama Indonesia)
const PROVINCE_GEOJSON_URL =
  'https://cdn.jsdelivr.net/gh/superpikar/indonesia-geojson@master/indonesia.geojson';
// Kabupaten/Kota — 514 kabkota, properti `alt_name` ("KOTA X" / "KABUPATEN X") — file besar (~10MB), di-load saat dibutuhkan saja
const KABKOTA_GEOJSON_URL =
  'https://cdn.jsdelivr.net/gh/eppofahmi/geojson-indonesia@master/kota/all_kabkota_ind.geojson';

// Cache level-modul agar file (terutama kabkota yang besar) hanya di-fetch sekali per sesi
let provinceCache: FeatureCollection | null = null;
let kabkotaCache: FeatureCollection | null = null;

// Warna choropleth provinsi (skala data nasional, max bisa ratusan)
function getColorProvince(count: number): string {
  if (count > 30) return '#1e40af';
  if (count > 20) return '#2563eb';
  if (count > 10) return '#3b82f6';
  if (count > 5)  return '#60a5fa';
  if (count > 1)  return '#93c5fd';
  if (count > 0)  return '#bfdbfe';
  return '#e2e8f0';
}

// Warna choropleth kabupaten/kota (skala lebih kecil per wilayah)
function getColorKabkota(count: number): string {
  if (count > 20) return '#1e40af';
  if (count > 10) return '#2563eb';
  if (count > 5)  return '#3b82f6';
  if (count > 2)  return '#60a5fa';
  if (count > 1)  return '#93c5fd';
  if (count > 0)  return '#bfdbfe';
  return '#e2e8f0';
}

export interface CityPin {
  lat: number;
  lng: number;
  label: string;
  count: number;
}

export interface ProvinceData {
  [provinceName: string]: number;
}

// Data per kabupaten/kota — key = nama kota/kabupaten apa adanya dari data (free-text), value = jumlah
export interface KabkotaData {
  [cityName: string]: number;
}

export type MapLevel = 'province' | 'kabkota';

interface LeafletMapProps {
  cityPins?: CityPin[];
  provinceData?: ProvinceData;
  kabkotaData?: KabkotaData;
  level?: MapLevel;
  showCityPins?: boolean;
  onSelectPin?: (label: string, count: number, isCity?: boolean) => void;
  onKabkotaLoadingChange?: (loading: boolean) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
}

// ── Normalisasi nama untuk pencocokan ──────────────────────────────────────
// Provinsi: samakan varian penulisan (DKI Jakarta / Jakarta Raya, DI Yogyakarta / Yogyakarta, dst.)
function canonProvince(raw: unknown): string {
  let s = (raw ?? '').toString().toUpperCase().replace(/[^A-Z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.includes('JAKARTA')) return 'JAKARTA';
  if (s.includes('YOGYAKARTA') || s.includes('JOGJAKARTA')) return 'YOGYAKARTA';
  if (s.includes('BANGKA')) return 'BANGKABELITUNG';
  s = s.replace(/\s+/g, '');
  return s;
}

// Kabupaten/Kota: uppercase + rapikan spasi (tetap pertahankan prefix KOTA/KABUPATEN)
function canonKab(raw: unknown): string {
  return (raw ?? '').toString().toUpperCase().replace(/[^A-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Lepas prefix jenis wilayah agar bisa cocok dengan data free-text ("Bandung" → KOTA/KABUPATEN BANDUNG)
function stripKabPrefix(raw: unknown): string {
  return canonKab(raw).replace(/^(KOTA ADM(?:INISTRASI)?|KABUPATEN ADM(?:INISTRASI)?|KABUPATEN|KAB|KOTA)\s+/, '').trim();
}

// Helper: ambil nama provinsi dari berbagai kemungkinan property GeoJSON
function getProvinceName(feature: Feature): string {
  const p = feature?.properties ?? {};
  return (
    p.state ?? p.name ?? p.NAME ?? p.Propinsi ?? p.PROPINSI ?? p.province ?? ''
  ).toString();
}

// Cocokkan data kabkota (free-text) ke fitur GeoJSON → jumlah per fitur (by mhid).
// Dua tahap: (1) cocok penuh dengan alt_name, (2) cocok nama dasar (kota diprioritaskan).
function buildKabCounts(
  features: Feature[],
  data: KabkotaData
): Record<string, number> {
  const dataMap = new Map<string, number>();
  for (const [city, count] of Object.entries(data)) {
    const k = canonKab(city);
    if (!k) continue;
    dataMap.set(k, (dataMap.get(k) ?? 0) + count);
    // simpan juga varian tanpa prefix agar "Kota Bandung" / "Bandung" sama-sama tercocokkan
    const base = stripKabPrefix(city);
    if (base && base !== k) dataMap.set(base, (dataMap.get(base) ?? 0) + count);
  }

  const result: Record<string, number> = {};
  const consumed = new Set<string>();
  // urutkan: KOTA lebih dulu agar nama dasar yang ambigu memihak ke kota
  const ordered = [...features].sort((a, b) => {
    const ak = canonKab(a.properties?.alt_name ?? a.properties?.name).startsWith('KOTA') ? 0 : 1;
    const bk = canonKab(b.properties?.alt_name ?? b.properties?.name).startsWith('KOTA') ? 0 : 1;
    return ak - bk;
  });

  for (const f of ordered) {
    const mhid = String(f.properties?.mhid ?? f.properties?.kabkot_id ?? '');
    const candidates = [
      canonKab(f.properties?.alt_name),
      canonKab(f.properties?.name),
      stripKabPrefix(f.properties?.alt_name ?? f.properties?.name),
    ];
    for (const cand of candidates) {
      if (cand && !consumed.has(cand) && dataMap.has(cand)) {
        result[mhid] = (result[mhid] ?? 0) + (dataMap.get(cand) ?? 0);
        consumed.add(cand);
        break;
      }
    }
  }
  return result;
}

export function LeafletMap({
  cityPins = [],
  provinceData = {},
  kabkotaData = {},
  level = 'province',
  showCityPins = true,
  onSelectPin,
  onKabkotaLoadingChange,
  height = '100%',
  center = [-2.5, 118],
  zoom = 5,
  minZoom = 4,
  maxZoom = 12,
}: LeafletMapProps) {
  const [provinceGeo, setProvinceGeo] = useState<FeatureCollection | null>(provinceCache);
  const [kabkotaGeo, setKabkotaGeo] = useState<FeatureCollection | null>(kabkotaCache);

  // Provinsi: load sekali di awal (state sudah di-seed dari cache via useState initializer)
  useEffect(() => {
    if (provinceCache) return;
    fetch(PROVINCE_GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => {
        provinceCache = data;
        setProvinceGeo(data);
      })
      .catch(() => {
        // Graceful degrade — tile peta tetap tampil
      });
  }, []);

  // Kabupaten/Kota: load lazy hanya saat level kabkota dipilih (file besar)
  useEffect(() => {
    if (level !== 'kabkota' || kabkotaGeo) return;
    if (kabkotaCache) {
      setKabkotaGeo(kabkotaCache);
      return;
    }
    onKabkotaLoadingChange?.(true);
    fetch(KABKOTA_GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => {
        kabkotaCache = data;
        setKabkotaGeo(data);
      })
      .catch(() => {})
      .finally(() => onKabkotaLoadingChange?.(false));
  }, [level, kabkotaGeo, onKabkotaLoadingChange]);

  // Re-key data provinsi ke bentuk canonical untuk pencocokan
  const provCanon = useMemo(() => {
    const m: Record<string, number> = {};
    for (const [name, count] of Object.entries(provinceData)) {
      const k = canonProvince(name);
      m[k] = (m[k] ?? 0) + count;
    }
    return m;
  }, [provinceData]);

  // Hitung jumlah per fitur kabkota (by mhid)
  const kabCounts = useMemo(() => {
    if (!kabkotaGeo) return {};
    return buildKabCounts(kabkotaGeo.features as Feature[], kabkotaData);
  }, [kabkotaGeo, kabkotaData]);

  // ── Province layer ──────────────────────────────────────────────────────
  const styleProvince = useCallback(
    (feature?: Feature): PathOptions => {
      const count = provCanon[canonProvince(getProvinceName(feature!))] ?? 0;
      return { fillColor: getColorProvince(count), fillOpacity: 0.65, color: '#ffffff', weight: 1.2 };
    },
    [provCanon]
  );

  const onEachProvince = useCallback(
    (feature: Feature, layer: Layer) => {
      const displayName = getProvinceName(feature);
      const count = provCanon[canonProvince(displayName)] ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const l = layer as any;
      l.on('mouseover', () => l.setStyle({ fillOpacity: 0.85, weight: 2 }));
      l.on('mouseout', () => l.setStyle({ fillOpacity: 0.65, weight: 1.2 }));
      l.on('click', () => onSelectPin?.(displayName, count, false));
      l.bindTooltip(
        `<div style="font-family:Inter,sans-serif;line-height:1.4;padding:2px 4px">
          <strong style="font-size:12px">${displayName}</strong><br/>
          <span style="font-size:11px;color:#475569">${count > 0 ? `${count} UMKM` : 'Belum ada data'}</span>
        </div>`,
        { sticky: true, className: 'leaflet-tooltip-clean' }
      );
    },
    [provCanon, onSelectPin]
  );

  // ── Kabkota layer ─────────────────────────────────────────────────────────
  const styleKabkota = useCallback(
    (feature?: Feature): PathOptions => {
      const mhid = String(feature?.properties?.mhid ?? feature?.properties?.kabkot_id ?? '');
      const count = kabCounts[mhid] ?? 0;
      return { fillColor: getColorKabkota(count), fillOpacity: 0.7, color: '#ffffff', weight: 0.7 };
    },
    [kabCounts]
  );

  const onEachKabkota = useCallback(
    (feature: Feature, layer: Layer) => {
      const p = feature?.properties ?? {};
      const displayName = (p.alt_name ?? p.name ?? '').toString();
      const mhid = String(p.mhid ?? p.kabkot_id ?? '');
      const count = kabCounts[mhid] ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const l = layer as any;
      l.on('mouseover', () => l.setStyle({ fillOpacity: 0.9, weight: 1.5 }));
      l.on('mouseout', () => l.setStyle({ fillOpacity: 0.7, weight: 0.7 }));
      l.on('click', () => onSelectPin?.(displayName, count, true));
      l.bindTooltip(
        `<div style="font-family:Inter,sans-serif;line-height:1.4;padding:2px 4px">
          <strong style="font-size:12px">${displayName}</strong><br/>
          <span style="font-size:11px;color:#475569">${count > 0 ? `${count} UMKM` : 'Belum ada data'}</span>
        </div>`,
        { sticky: true, className: 'leaflet-tooltip-clean' }
      );
    },
    [kabCounts, onSelectPin]
  );

  // Signature untuk re-key GeoJSON agar style ter-refresh saat data/level berubah
  const provKey = useMemo(
    () => `prov-${provinceGeo ? 1 : 0}-${Object.keys(provCanon).length}-${Object.values(provCanon).reduce((s, n) => s + n, 0)}`,
    [provinceGeo, provCanon]
  );
  const kabKey = useMemo(
    () => `kab-${kabkotaGeo ? 1 : 0}-${Object.keys(kabCounts).length}-${Object.values(kabCounts).reduce((s, n) => s + n, 0)}`,
    [kabkotaGeo, kabCounts]
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      style={{ width: '100%', height }}
      zoomControl
      scrollWheelZoom
    >
      <InvalidateOnReady />

      {/* Tile OpenStreetMap — gratis tanpa API key */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Choropleth: provinsi atau kabupaten/kota sesuai level */}
      {level === 'province' && provinceGeo && (
        <GeoJSON
          key={provKey}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={provinceGeo as any}
          style={styleProvince}
          onEachFeature={onEachProvince}
        />
      )}

      {level === 'kabkota' && kabkotaGeo && (
        <GeoJSON
          key={kabKey}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={kabkotaGeo as any}
          style={styleKabkota}
          onEachFeature={onEachKabkota}
        />
      )}

      {/* Marker kota / cluster UMKM (opsional) */}
      {showCityPins &&
        cityPins.map((pin) => {
          const radius = Math.max(10, Math.sqrt(pin.count / Math.PI) * 0.9);
          return (
            <CircleMarker
              key={pin.label}
              center={[pin.lat, pin.lng]}
              radius={radius}
              pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#2563eb', fillOpacity: 0.9 }}
              eventHandlers={{ click: () => onSelectPin?.(pin.label, pin.count, true) }}
            >
              <Tooltip permanent direction="top" offset={[0, -radius - 2]}>
                <span style={{ fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {pin.count.toLocaleString('id-ID')}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
    </MapContainer>
  );
}
