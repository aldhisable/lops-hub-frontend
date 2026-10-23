"use client";

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Plus, Search, ShieldCheck, Loader2, Mail, Pencil, Power, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { adminUsersApi, type AdminAccount, type AdminAccountInput, type EmailDelivery } from '@/lib/api';

const regions = ['REGIONAL 1', 'REGIONAL 2', 'REGIONAL 3', 'REGIONAL 4'];
const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';
const actionClass = 'inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40';
function errorMessage(error: unknown) {
  return (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Permintaan belum berhasil. Silakan coba lagi.';
}
function statusOf(account: AdminAccount) {
  if (!account.isActive) return { text: 'Nonaktif', style: 'bg-slate-100 text-slate-600' };
  return account.passwordSetupRequired ? { text: 'Menunggu Aktivasi', style: 'bg-amber-50 text-amber-800' }
    : { text: 'Aktif', style: 'bg-emerald-50 text-emerald-700' };
}

export function AdminUsersPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [regional, setRegional] = useState('');
  const [status, setStatus] = useState('');
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; warning?: boolean } | null>(null);
  const [form, setForm] = useState<(AdminAccountInput & { id?: string }) | null>(null);
  const [formError, setFormError] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);
  const formKey = form ? form.id || 'new' : null;

  useEffect(() => {
    const timer = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => { if (formKey) nameInput.current?.focus(); }, [formKey]);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setLoading(true); setLoadError('');
      return adminUsersApi.list({ page, ...(query ? { search: query } : {}), ...(regional ? { regional } : {}), ...(status ? { status } : {}) });
    })
      .then(result => {
        if (!active || !result) return;
        const { data } = result;
        if (page > data.totalPages) { setPage(data.totalPages); return; }
        setAccounts(data.data); setTotal(data.total); setPages(data.totalPages);
      }).catch(error => { if (active) { setLoadError(errorMessage(error)); setAccounts([]); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, query, regional, status, revision]);

  const report = (message: string, emailDelivery?: EmailDelivery) => {
    setFeedback({ message: `${message}${emailDelivery ? ` ${emailDelivery.message}` : ''}`, warning: emailDelivery && emailDelivery.status !== 'sent' });
    setRevision(value => value + 1);
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form || busy) return;
    setBusy(true); setFormError(''); setFeedback(null);
    try {
      const { id, ...data } = form;
      const result = id ? await adminUsersApi.update(id, data) : await adminUsersApi.create(data);
      report(id ? 'Akun diperbarui.' : 'Akun admin dibuat.', result.data.emailDelivery);
      setForm(null);
    } catch (error) { setFormError(errorMessage(error)); }
    finally { setBusy(false); }
  };
  const toggleActive = async (account: AdminAccount) => {
    const message = account.isActive
      ? `Nonaktifkan ${account.name}? Semua sesi login akun ini akan berakhir.`
      : `Aktifkan kembali ${account.name}? ${account.passwordSetupRequired ? 'Petugas tetap harus menyelesaikan aktivasi email.' : 'Petugas dapat login kembali.'}`;
    if (busy || !window.confirm(message)) return;
    setBusy(true); setFeedback(null);
    try {
      await adminUsersApi.update(account.id, { isActive: !account.isActive });
      report(account.isActive ? 'Akun dinonaktifkan dan sesi lama dibatalkan.' : 'Akun diaktifkan kembali.');
    } catch (error) { setFeedback({ message: errorMessage(error), warning: true }); }
    finally { setBusy(false); }
  };
  const sendEmail = async (account: AdminAccount) => {
    if (busy) return;
    setBusy(true); setFeedback(null);
    try { const { data } = await adminUsersApi.sendEmail(account); report('', data.emailDelivery); }
    catch (error) { setFeedback({ message: errorMessage(error), warning: true }); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600"><ShieldCheck className="h-4 w-4" /> Super Admin</div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Admin</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Kelola petugas Regional 1–4. Setiap akun hanya dapat mengakses data regional yang ditugaskan.</p>
        </div>
        <GlowButton disabled={busy} onClick={() => { setForm({ name: '', email: '', regional: '' }); setFormError(''); }} className="gap-2"><Plus className="h-4 w-4" /> Tambah Admin</GlowButton>
      </div>
      {feedback && <div role={feedback.warning ? 'alert' : 'status'} className={`rounded-xl border p-4 text-sm ${feedback.warning ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{feedback.message}</div>}

      {form && (
        <GlassCard className="p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-slate-900">{form.id ? 'Edit akun admin' : 'Undang admin regional'}</h2><button type="button" aria-label="Tutup form" disabled={busy} onClick={() => setForm(null)} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
          <form onSubmit={save} aria-busy={busy} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div><label htmlFor="admin-name" className="mb-1.5 block text-sm font-medium text-slate-700">Nama petugas</label><input ref={nameInput} id="admin-name" required minLength={2} maxLength={120} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} /></div>
              <div><label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email akun</label><input id="admin-email" type="email" required maxLength={254} autoCapitalize="none" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
              <div><label htmlFor="admin-regional" className="mb-1.5 block text-sm font-medium text-slate-700">Regional penugasan</label><select id="admin-regional" required value={form.regional} onChange={e => setForm({ ...form, regional: e.target.value })} className={inputClass}><option value="" disabled>Pilih regional</option>{regions.map(value => <option key={value} value={value}>{value.replace('REGIONAL', 'Regional')}</option>)}</select></div>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">{form.id ? 'Perubahan regional atau email mengakhiri sesi lama. Email baru harus diverifikasi sebelum akun dapat digunakan kembali.' : 'Petugas menerima kode melalui email dan menetapkan password sendiri. Beberapa petugas dapat ditugaskan pada regional yang sama.'}</p>
            {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
            <div className="flex justify-end gap-2"><button type="button" disabled={busy} onClick={() => setForm(null)} className={actionClass}>Batal</button><GlowButton type="submit" disabled={busy} className="gap-2">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{form.id ? 'Simpan Perubahan' : 'Buat & Kirim Aktivasi'}</GlowButton></div>
          </form>
        </GlassCard>
      )}

      <GlassCard className="overflow-hidden">
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-5">
          <div className="relative min-w-48 flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" /><input aria-label="Cari nama atau email admin" placeholder="Cari nama atau email…" value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} pl-9`} /></div>
          <select aria-label="Filter regional" value={regional} onChange={e => { setRegional(e.target.value); setPage(1); }} className={`${inputClass} sm:w-44`}><option value="">Semua regional</option>{regions.map(value => <option key={value} value={value}>{value.replace('REGIONAL', 'Regional')}</option>)}</select>
          <select aria-label="Filter status" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={`${inputClass} sm:w-48`}><option value="">Semua status</option><option value="ACTIVE">Aktif</option><option value="PENDING">Menunggu Aktivasi</option><option value="INACTIVE">Nonaktif</option></select>
        </div>
        {loading ? <div role="status" className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Memuat akun admin…</div>
          : loadError ? <div role="alert" className="p-8 text-center text-sm text-red-700">{loadError}<button onClick={() => setRevision(value => value + 1)} className="ml-3 underline">Coba lagi</button></div>
            : accounts.length === 0 ? <div className="p-12 text-center"><ShieldCheck className="mx-auto mb-3 h-8 w-8 text-slate-300" /><p className="font-medium text-slate-700">Tidak ada akun yang cocok</p><p className="mt-1 text-sm text-slate-500">Sesuaikan filter atau tambahkan petugas regional baru.</p></div>
              : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Petugas</th><th className="px-5 py-3">Regional</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Tindakan</th></tr></thead><tbody className="divide-y divide-slate-100">{accounts.map(account => {
                const badge = statusOf(account);
                return <tr key={account.id} className="hover:bg-slate-50/60"><td className="px-5 py-4"><div className="font-semibold text-slate-800">{account.name}</div><div className="mt-1 text-xs text-slate-500">{account.email}</div></td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{account.regional?.replace('REGIONAL', 'Regional') || 'Belum ditetapkan'}</td><td className="whitespace-nowrap px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.style}`}>{badge.text}</span></td><td className="px-5 py-4"><div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => { setForm({ id: account.id, name: account.name, email: account.email, regional: account.regional }); setFormError(''); }} className={actionClass}><Pencil className="h-3.5 w-3.5" />Edit</button><button disabled={busy || !account.isActive} onClick={() => void sendEmail(account)} className={actionClass}><Mail className="h-3.5 w-3.5" />{account.passwordSetupRequired ? 'Kirim Aktivasi' : 'Reset Password'}</button><button disabled={busy} onClick={() => void toggleActive(account)} className={actionClass}><Power className="h-3.5 w-3.5" />{account.isActive ? 'Nonaktifkan' : 'Aktifkan'}</button></div></td></tr>;
              })}</tbody></table></div>}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500"><span>{total} akun admin regional</span><div className="flex items-center gap-3"><button disabled={loading || page <= 1} onClick={() => setPage(value => value - 1)} className={actionClass}>Sebelumnya</button><span>{page} / {pages}</span><button disabled={loading || page >= pages} onClick={() => setPage(value => value + 1)} className={actionClass}>Berikutnya</button></div></div>
      </GlassCard>
    </div>
  );
}
