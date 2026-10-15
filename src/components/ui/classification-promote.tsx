"use client";

import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Loader2, Check, RotateCcw, PenSquare, X } from 'lucide-react';
import { GlassCard } from './glass-card';
import { GlowButton } from './glow-button';
import { umkmApi, type Klasifikasi, type ClassificationSource } from '@/lib/api';

// Kartu klasifikasi & rekomendasi sistem — tab Penilaian 5S profil UMKM.
//
// Mesin 5S menghitung rekomendasi (skor 0-100 → kelas), tapi klasifikasi
// RESMI ditetapkan admin lewat kartu ini: bisa mengikuti rekomendasi, atau
// dipromosikan/diubah manual ke kelas lain. Sekali manual, recalc otomatis
// (misalnya saat admin mengisi ulang data 5S) tidak lagi menimpanya — lihat
// backend/src/lib/scoring-5s.ts#recalcClassification.

const KELAS_META: Record<Klasifikasi, { label: string; icon: string; badge: string }> = {
  PLATINUM: { label: 'Platinum', icon: '💎', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  GOLD: { label: 'Gold', icon: '🏆', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  SILVER: { label: 'Silver', icon: '🥈', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
  BRONZE: { label: 'Bronze', icon: '🥉', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
};
const URUTAN_KELAS: Klasifikasi[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

function Lencana({ kelas }: { kelas: Klasifikasi }) {
  const m = KELAS_META[kelas];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold ${m.badge}`}>
      {m.icon} {m.label}
    </span>
  );
}

export function ClassificationPromoteCard({
  umkmId, current, source, suggested, score,
  onChanged,
}: {
  umkmId: string;
  current: Klasifikasi;
  source: ClassificationSource;
  suggested: Klasifikasi | null;
  score: number | null;
  onChanged: (data: { classification: Klasifikasi; classificationSource: ClassificationSource }) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [pilihan, setPilihan] = useState<Klasifikasi>(suggested ?? current);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const berbeda = suggested !== null && suggested !== current;

  async function terapkan(kelas: Klasifikasi) {
    setSaving(true); setErr(''); setMsg('');
    try {
      const { data } = await umkmApi.promoteClassification(umkmId, { mode: 'MANUAL', classification: kelas });
      onChanged({ classification: data.classification, classificationSource: data.classificationSource });
      setMsg(`Klasifikasi ditetapkan manual ke ${KELAS_META[kelas].label}.`);
      setShowPicker(false);
      setTimeout(() => setMsg(''), 4000);
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Gagal memperbarui klasifikasi.');
    } finally {
      setSaving(false);
    }
  }

  async function kembalikanOtomatis() {
    setSaving(true); setErr(''); setMsg('');
    try {
      const { data } = await umkmApi.promoteClassification(umkmId, { mode: 'AUTO' });
      onChanged({ classification: data.classification, classificationSource: data.classificationSource });
      setMsg('Klasifikasi dikembalikan ke mode otomatis.');
      setTimeout(() => setMsg(''), 4000);
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Gagal mengembalikan ke mode otomatis.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <GlassCard className="p-6 mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h3 className="text-lg font-bold text-slate-900">Klasifikasi & Rekomendasi Sistem</h3>
        <span className="text-xs text-slate-400">Skor 5S sebagai bahan acuan — admin yang menetapkan kelas resmi</span>
      </div>

      {msg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />{msg}
        </div>
      )}
      {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{err}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Klasifikasi Resmi
          </div>
          <Lencana kelas={current} />
          <p className="text-xs text-slate-400 mt-2">
            {source === 'MANUAL' ? 'Ditetapkan manual oleh admin.' : 'Mengikuti hitungan otomatis mesin 5S.'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Rekomendasi Sistem (5S)
          </div>
          {suggested ? (
            <>
              <Lencana kelas={suggested} />
              <p className="text-xs text-slate-400 mt-2">Skor total {score}/100.</p>
            </>
          ) : (
            <p className="text-sm text-slate-400">Belum bisa direkomendasikan — data 5S belum lengkap.</p>
          )}
        </div>
      </div>

      {berbeda && (
        <div className="mb-4 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 flex flex-wrap items-center justify-between gap-3">
          <span>Rekomendasi sistem ({KELAS_META[suggested as Klasifikasi].label}) berbeda dari klasifikasi resmi saat ini.</span>
          <GlowButton
            variant="primary"
            size="sm"
            onClick={() => terapkan(suggested as Klasifikasi)}
            disabled={saving}
            className="shrink-0 rounded-lg text-xs font-semibold"
          >
            Terapkan rekomendasi ini
          </GlowButton>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
        {!showPicker ? (
          <GlowButton
            variant="primary"
            onClick={() => { setPilihan(suggested ?? current); setShowPicker(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            <PenSquare className="w-4 h-4" /> Promosikan / Ubah Klasifikasi
          </GlowButton>
        ) : (
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/80">
            <select
              value={pilihan}
              onChange={(e) => setPilihan(e.target.value as Klasifikasi)}
              className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            >
              {URUTAN_KELAS.map((k) => <option key={k} value={k}>{KELAS_META[k].icon} {KELAS_META[k].label}</option>)}
            </select>
            <GlowButton
              variant="primary"
              onClick={() => terapkan(pilihan)}
              disabled={saving}
              className="flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Tetapkan
            </GlowButton>
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="flex items-center gap-1.5 h-10 px-3.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-white transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Batal
            </button>
          </div>
        )}

        {source === 'MANUAL' && (
          <button
            type="button"
            onClick={kembalikanOtomatis}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Kembalikan ke Otomatis
          </button>
        )}
      </div>
    </GlassCard>
  );
}
