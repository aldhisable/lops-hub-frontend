"use client";

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from 'react-leaflet';
import type { Feature } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';

// GeoJSON provinsi Indonesia — superpikar/indonesia-geojson (via jsDelivr CDN)
const GEOJSON_URL =
  'https://cdn.jsdelivr.net/gh/superpikar/indonesia-geojson@master/indonesia-provinces.geojson';

// Warna choropleth berdasarkan jumlah UMKM
function getColor(count: number): string {
  if (count > 350) return '#1e40af';
  if (count > 250) return '#1d4ed8';
  if (count > 150) return '#2563eb';
  if (count > 80)  return '#3b82f6';
  if (count > 30)  return '#60a5fa';
  if (count > 0)   return '#93c5fd';
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

interface LeafletMapProps {
  cityPins?: CityPin[];
  provinceData?: ProvinceData;
  onSelectPin?: (label: string, count: number) => void;
  height?: string;
}

// Helper: ambil nama provinsi dari berbagai kemungkinan property GeoJSON
function getProvinceName(feature: Feature): string {
  const p = feature?.properties ?? {};
  return (
    p.state ?? p.name ?? p.NAME ?? p.Propinsi ?? p.PROPINSI ?? p.province ?? ''
  ).toString().toUpperCase().trim();
}

export function LeafletMap({
  cityPins = [],
  provinceData = {},
  onSelectPin,
  height = '100%',
}: LeafletMapProps) {
  const [geoJson, setGeoJson] = useState<object | null>(null);
  const [geoKey, setGeoKey] = useState(0);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => {
        setGeoJson(data);
        setGeoKey((k) => k + 1);
      })
      .catch(() => {
        // Graceful degrade — peta tetap tampil dengan tile + city pins
      });
  }, []);

  const styleFeature = useCallback(
    (feature?: Feature): PathOptions => {
      const name = getProvinceName(feature!);
      const count = provinceData[name] ?? 0;
      return {
        fillColor: getColor(count),
        fillOpacity: 0.65,
        color: '#ffffff',
        weight: 1.2,
      };
    },
    [provinceData]
  );

  const onEachFeature = useCallback(
    (feature: Feature, layer: Layer) => {
      const name = getProvinceName(feature);
      const displayName = feature?.properties?.state ?? feature?.properties?.name ?? name;
      const count = provinceData[name] ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const l = layer as any;

      l.on('mouseover', () => l.setStyle({ fillOpacity: 0.85, weight: 2 }));
      l.on('mouseout', () => l.setStyle({ fillOpacity: 0.65, weight: 1.2 }));
      l.on('click', () => onSelectPin?.(displayName, count));

      l.bindTooltip(
        `<div style="font-family:Inter,sans-serif;line-height:1.4;padding:2px 4px">
          <strong style="font-size:12px">${displayName}</strong><br/>
          <span style="font-size:11px;color:#475569">${count > 0 ? `${count} UMKM` : 'Belum ada data'}</span>
        </div>`,
        { sticky: true, className: 'leaflet-tooltip-clean' }
      );
    },
    [provinceData, onSelectPin]
  );

  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      minZoom={4}
      maxZoom={12}
      style={{ width: '100%', height }}
      zoomControl
      scrollWheelZoom
    >
      {/* Tile OpenStreetMap — gratis tanpa API key */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Choropleth provinsi */}
      {geoJson && (
        <GeoJSON
          key={geoKey}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={geoJson as any}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}

      {/* Marker kota / cluster UMKM */}
      {cityPins.map((pin) => {
        const radius = Math.max(10, Math.sqrt(pin.count / Math.PI) * 0.9);
        return (
          <CircleMarker
            key={pin.label}
            center={[pin.lat, pin.lng]}
            radius={radius}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor: '#2563eb',
              fillOpacity: 0.9,
            }}
            eventHandlers={{ click: () => onSelectPin?.(pin.label, pin.count) }}
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
