"use client";

import React, { useEffect, useState } from 'react';
import { Mail, MailWarning, Pencil, Trash2, Loader2, Check, X, AlertTriangle } from 'lucide-react';
import { GlowButton } from './glow-button';
import { umkmApi } from '@/lib/api';

// Status email akun UMKM.
//
// Kolom email dipakai sebagai identitas login. Skrip impor mengisinya dengan
// nomor telepon, atau slug nama usaha bila nomor pun tidak ada. Nilai seperti
// itu bisa dipakai login tetapi tidak bisa dipakai menghubungi siapa pun, jadi
// "punya email terdaftar" TIDAK sama dengan "kolomnya terisi".
export type StatusEmail = 'email' | 'telepon' | 'slug' | 'kosong';

export function statusEmail(nilai: string | null | undefined): StatusEmail {
  if (!nilai || nilai.trim() === '') return 'kosong';
  if (nilai.includes('@')) return 'email';
  if (/^\d+$/.test(nilai)) return 'telepon';
  return 'slug';
}

export function punyaEmail(nilai: string | null | undefined): boolean {
  return statusEmail(nilai) === 'email';
}

const KETERANGAN: Record<StatusEmail, string> = {
  email: 'Email terdaftar',
  kosong: 'Belum ada email terdaftar. Akun ini tidak bisa login sampai emailnya diisi.',
  telepon: 'Belum ada email terdaftar. Identitas loginnya masih berupa nomor telepon bawaan impor.',
  slug: 'Belum ada email terdaftar. Identitas loginnya masih berupa penanda bawaan impor.',
};

/** Lencana ringkas untuk tabel direktori. */
export function EmailAkunBadge({ email }: { email: string | null | undefined }) {
  const status = statusEmail(email);

  if (status === 'email') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-slate-700" title={KETERANGAN.email}>
        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate max-w-[220px]">{email}</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700"
      title={KETERANGAN[status]}
    >
      <MailWarning className="w-3.5 h-3.5 shrink-0" />
      Belum ada email
      {status !== 'kosong' && <span className="text-amber-500/80 font-normal">· {email}</span>}
    </span>
  );
}

const inputCls =
  'w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors';

/**
 * Pengelola email akun UMKM: isi, ubah, atau kosongkan.
 *
 * Ditampilkan sebagai modal karena mengubah email berarti mengubah identitas
 * login UMKM — akibatnya perlu disampaikan jelas, bukan disembunyikan di balik
 * kolom yang bisa tersunting tanpa sengaja.
 */
export function EmailAkunEditor({
  umkmId, umkmName, email, onClose, onSaved,
}: {
  umkmId: string;
  umkmName: string;
  email: string | null | undefined;
  onClose: () => void;
  onSaved: (emailBaru: string | null) => void;
}) {
  const status = statusEmail(email);
  const [nilai, setNilai] = useState(status === 'email' ? (email ?? '') : '');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [konfirmHapus, setKonfirmHapus] = useState(false);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setSaving(true);
    try {
      const { data } = await umkmApi.updateEmail(umkmId, nilai.trim());
      onSaved(data.email);
      onClose();
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Gagal menyimpan email.');
    } finally {
      setSaving(false);
    }
  };

  const hapus = async () => {
    setErr(''); setSaving(true);
    try {
      const { data } = await umkmApi.updateEmail(umkmId, null);
      onSaved(data.email);
      onClose();
    } catch (e: any) {
      setErr(e.response?.data?.error || 'Gagal menghapus email.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-1">
          <h3 className="text-lg font-bold text-slate-900">Email Akun</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1 -mr-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-5">{umkmName}</p>

        {status !== 'email' && (
          <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{KETERANGAN[status]}</span>
          </div>
        )}

        {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{err}</div>}

        {konfirmHapus ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
              <p className="font-semibold mb-1">Kosongkan email akun ini?</p>
              <p>
                Email adalah identitas login. Setelah dikosongkan, <strong>{umkmName}</strong> tidak
                bisa masuk ke workspace-nya sampai admin mengisi email baru.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setKonfirmHapus(false)}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={hapus}
                disabled={saving}
                className="px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Ya, kosongkan
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={simpan} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Alamat email</label>
              <input
                type="email"
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                placeholder="contoh: usaha@email.com"
                autoFocus
                className={inputCls}
              />
              <span className="text-xs text-slate-400">
                Dipakai UMKM untuk masuk ke workspace, jadi harus unik antar akun.
              </span>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t border-slate-100">
              {status === 'email' ? (
                <button
                  type="button"
                  onClick={() => setKonfirmHapus(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" /> Hapus email
                </button>
              ) : (
                <span />
              )}

              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <GlowButton
                  variant="primary"
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Simpan
                </GlowButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/** Tombol kecil pembuka editor, dipakai di halaman profil. */
export function EmailAkunTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
    >
      <Pencil className="w-3 h-3" /> Kelola
    </button>
  );
}
