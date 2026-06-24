"use client";

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export interface Wilayah { id: string; name: string }

const BASE = 'https://emsifa.github.io/api-wilayah-indonesia/api';

// Canonical province list (Title Case, 38 provinces incl. new Papua provinces)
export const INDONESIA_PROVINCES: Wilayah[] = [
  { id: '11', name: 'Aceh' }, { id: '12', name: 'Sumatera Utara' }, { id: '13', name: 'Sumatera Barat' },
  { id: '14', name: 'Riau' }, { id: '15', name: 'Jambi' }, { id: '16', name: 'Sumatera Selatan' },
  { id: '17', name: 'Bengkulu' }, { id: '18', name: 'Lampung' }, { id: '19', name: 'Kepulauan Bangka Belitung' },
  { id: '21', name: 'Kepulauan Riau' }, { id: '31', name: 'DKI Jakarta' }, { id: '32', name: 'Jawa Barat' },
  { id: '33', name: 'Jawa Tengah' }, { id: '34', name: 'DI Yogyakarta' }, { id: '35', name: 'Jawa Timur' },
  { id: '36', name: 'Banten' }, { id: '51', name: 'Bali' }, { id: '52', name: 'Nusa Tenggara Barat' },
  { id: '53', name: 'Nusa Tenggara Timur' }, { id: '61', name: 'Kalimantan Barat' }, { id: '62', name: 'Kalimantan Tengah' },
  { id: '63', name: 'Kalimantan Selatan' }, { id: '64', name: 'Kalimantan Timur' }, { id: '65', name: 'Kalimantan Utara' },
  { id: '71', name: 'Sulawesi Utara' }, { id: '72', name: 'Sulawesi Tengah' }, { id: '73', name: 'Sulawesi Selatan' },
  { id: '74', name: 'Sulawesi Tenggara' }, { id: '75', name: 'Gorontalo' }, { id: '76', name: 'Sulawesi Barat' },
  { id: '81', name: 'Maluku' }, { id: '82', name: 'Maluku Utara' }, { id: '91', name: 'Papua Barat' },
  { id: '92', name: 'Papua Barat Daya' }, { id: '94', name: 'Papua' }, { id: '95', name: 'Papua Selatan' },
  { id: '96', name: 'Papua Tengah' }, { id: '97', name: 'Papua Pegunungan' },
];

const toTitleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

async function fetchList(url: string): Promise<Wilayah[]> {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error();
    const data: Wilayah[] = await r.json();
    return data.map((w) => ({ id: w.id, name: toTitleCase(w.name) }));
  } catch {
    return [];
  }
}

// ── Searchable dropdown ───────────────────────────────────────────────────────
export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  options: Wilayah[];
  value: string;
  onChange: (opt: Wilayah) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.name === value);
  const filtered = options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleOpen = () => {
    if (disabled) return;
    setQuery('');
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = (opt: Wilayah) => {
    onChange(opt);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${selected ? 'text-slate-900' : 'text-slate-400'}`}
      >
        <span className="truncate">{selected ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-400 text-center">Tidak ditemukan</li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors ${opt.name === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                >
                  {opt.name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── 4-level cascading region picker ───────────────────────────────────────────
export interface WilayahValue {
  province: string;
  city: string;
  district: string;
  village: string;
}

export function WilayahPicker({
  value,
  onChange,
  disabled,
  showVillage = true,
}: {
  value: WilayahValue;
  onChange: (v: WilayahValue) => void;
  disabled?: boolean;
  showVillage?: boolean;
}) {
  const provinces = INDONESIA_PROVINCES;
  const [regencies, setRegencies] = useState<Wilayah[]>([]);
  const [districts, setDistricts] = useState<Wilayah[]>([]);
  const [villages, setVillages] = useState<Wilayah[]>([]);
  const [ids, setIds] = useState({ province: '', regency: '', district: '' });
  const [loading, setLoading] = useState({ regency: false, district: false, village: false });

  // Resolve province id from name
  useEffect(() => {
    const p = value.province ? provinces.find((x) => x.name === value.province) : undefined;
    setIds((s) => (s.province !== (p?.id ?? '') ? { ...s, province: p?.id ?? '' } : s));
  }, [provinces, value.province]);

  // Province id -> regencies
  useEffect(() => {
    if (!ids.province) { setRegencies([]); return; }
    setLoading((l) => ({ ...l, regency: true }));
    fetchList(`${BASE}/regencies/${ids.province}.json`).then(setRegencies).finally(() => setLoading((l) => ({ ...l, regency: false })));
  }, [ids.province]);

  // Resolve regency id from name
  useEffect(() => {
    const r = value.city ? regencies.find((x) => x.name === value.city) : undefined;
    setIds((s) => (s.regency !== (r?.id ?? '') ? { ...s, regency: r?.id ?? '' } : s));
  }, [regencies, value.city]);

  // Regency id -> districts
  useEffect(() => {
    if (!ids.regency) { setDistricts([]); return; }
    setLoading((l) => ({ ...l, district: true }));
    fetchList(`${BASE}/districts/${ids.regency}.json`).then(setDistricts).finally(() => setLoading((l) => ({ ...l, district: false })));
  }, [ids.regency]);

  // Resolve district id from name
  useEffect(() => {
    const d = value.district ? districts.find((x) => x.name === value.district) : undefined;
    setIds((s) => (s.district !== (d?.id ?? '') ? { ...s, district: d?.id ?? '' } : s));
  }, [districts, value.district]);

  // District id -> villages
  useEffect(() => {
    if (!ids.district || !showVillage) { setVillages([]); return; }
    setLoading((l) => ({ ...l, village: true }));
    fetchList(`${BASE}/villages/${ids.district}.json`).then(setVillages).finally(() => setLoading((l) => ({ ...l, village: false })));
  }, [ids.district, showVillage]);

  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <>
      <div>
        <label className={labelCls}>Provinsi</label>
        <SearchableSelect
          options={provinces}
          value={value.province}
          onChange={(o) => onChange({ province: o.name, city: '', district: '', village: '' })}
          placeholder="Pilih Provinsi"
          disabled={disabled}
        />
      </div>
      <div>
        <label className={labelCls}>Kota / Kabupaten</label>
        <SearchableSelect
          options={regencies}
          value={value.city}
          onChange={(o) => onChange({ ...value, city: o.name, district: '', village: '' })}
          placeholder={loading.regency ? 'Memuat...' : 'Pilih Kota/Kabupaten'}
          disabled={disabled || !ids.province || loading.regency}
        />
      </div>
      <div>
        <label className={labelCls}>Kecamatan</label>
        <SearchableSelect
          options={districts}
          value={value.district}
          onChange={(o) => onChange({ ...value, district: o.name, village: '' })}
          placeholder={loading.district ? 'Memuat...' : 'Pilih Kecamatan'}
          disabled={disabled || !ids.regency || loading.district}
        />
      </div>
      {showVillage && (
        <div>
          <label className={labelCls}>Kelurahan / Desa</label>
          <SearchableSelect
            options={villages}
            value={value.village}
            onChange={(o) => onChange({ ...value, village: o.name })}
            placeholder={loading.village ? 'Memuat...' : 'Pilih Kelurahan/Desa'}
            disabled={disabled || !ids.district || loading.village}
          />
        </div>
      )}
    </>
  );
}
