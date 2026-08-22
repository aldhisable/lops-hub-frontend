"use client";

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Globe2, Ship } from 'lucide-react';
import { exportApi, type ExportRecord, type ExportInput } from '@/lib/api';
import { EXPORT_COUNTRIES } from '@/lib/countries';
import { formatRupiah } from '@/lib/currency';
import { SearchableSelect, type Wilayah } from '@/components/ui/wilayah-select';

const COUNTRY_OPTS: Wilayah[] = EXPORT_COUNTRIES.map((c) => ({ id: c, name: c }));
const emptyForm = (): ExportInput => ({ country: '', year: new Date().getFullYear(), value: 0, commodity: '' });

export function ExportRecordsManager({
  umkmId,
  canEdit = true,
  onChanged,
}: {
  umkmId: string;
  canEdit?: boolean;
  onChanged?: () => void;
}) {
  const [items, setItems] = useState<ExportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExportInput>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    exportApi
      .listByUmkm(umkmId)
      .then(({ data }) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (umkmId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umkmId]);

  const startAdd = () => { setEditingId(null); setForm(emptyForm()); setError(''); setShowForm(true); };
  const startEdit = (r: ExportRecord) => {
    setEditingId(r.id);
    setForm({ country: r.country, year: r.year, value: r.value, commodity: r.commodity });
    setError('');
    setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditingId(null); setError(''); };

  const save = async () => {
    if (!form.country.trim()) { setError('Negara tujuan wajib dipilih'); return; }
    if (!form.commodity.trim()) { setError('Komoditas wajib diisi'); return; }
    setSaving(true);
    setError('');
    try {
      if (editingId) await exportApi.update(umkmId, editingId, form);
      else await exportApi.create(umkmId, form);
      cancel();
      load();
      onChanged?.();
    } catch (e) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error ?? 'Gagal menyimpan data ekspor');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Hapus catatan ekspor ini?')) return;
    try {
      await exportApi.remove(umkmId, id);
      load();
      onChanged?.();
    } catch {
      // ignore
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-900 font-semibold">
          <Ship className="w-4 h-4 text-blue-600" /> Riwayat Ekspor
        </div>
        {canEdit && !showForm && (
          <button
            onClick={startAdd}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        )}
      </div>

      {canEdit && showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Negara Tujuan</label>
              <SearchableSelect
                options={COUNTRY_OPTS}
                value={form.country}
                onChange={(o) => setForm((f) => ({ ...f, country: o.name }))}
                placeholder="Pilih negara"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tahun</label>
              <input
                type="number"
                value={form.year || ''}
                onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value) || 0 }))}
                className={inputCls}
                placeholder="2026"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Nilai Ekspor (Rp)</label>
              <input
                type="number"
                value={form.value || ''}
                onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) || 0 }))}
                className={inputCls}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Komoditas / Produk</label>
              <input
                value={form.commodity}
                onChange={(e) => setForm((f) => ({ ...f, commodity: e.target.value }))}
                className={inputCls}
                placeholder="mis. Kopi, Kerajinan rotan"
              />
            </div>
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={cancel} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
              <X className="w-4 h-4" /> Batal
            </button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-1.5 rounded-lg transition-colors">
              <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-sm text-slate-400 py-6 text-center">Memuat data ekspor...</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
          <Globe2 className="w-8 h-8 opacity-40" />
          <span className="text-sm">Belum ada catatan ekspor</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="py-2 pr-4 font-medium">Negara</th>
                <th className="py-2 pr-4 font-medium">Tahun</th>
                <th className="py-2 pr-4 font-medium">Komoditas</th>
                <th className="py-2 pr-4 font-medium text-right">Nilai</th>
                {canEdit && <th className="py-2 font-medium text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="py-2.5 pr-4 font-medium text-slate-800">{r.country}</td>
                  <td className="py-2.5 pr-4 text-slate-600">{r.year}</td>
                  <td className="py-2.5 pr-4 text-slate-600">{r.commodity}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-800">{r.value > 0 ? formatRupiah(r.value) : '—'}</td>
                  {canEdit && (
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <button onClick={() => startEdit(r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(r.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
