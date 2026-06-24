"use client";
import React, { useEffect, useState } from 'react';
import { Save, Loader2, KeyRound, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { useAuth } from '@/context/auth-context';
import { authApi } from '@/lib/api';

const ROLE_LABEL: Record<string, string> = {
  ADMIN_PUSAT: 'Admin Pusat',
  ADMIN_REGIONAL: 'Admin Regional',
  UMKM: 'UMK Binaan',
};

const inputCls =
  'px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors';
const readonlyCls =
  'px-4 py-2.5 rounded-lg border border-slate-100 bg-slate-50 text-sm text-slate-500 cursor-not-allowed';

export default function WorkspaceSettings() {
  const { user, updateUser } = useAuth();

  // Profil akun
  const [name, setName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState('');
  const [nameErr, setNameErr] = useState('');

  // Keamanan
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  useEffect(() => { if (user) setName(user.name ?? ''); }, [user]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameMsg(''); setNameErr('');
    if (name.trim().length < 2) { setNameErr('Nama minimal 2 karakter.'); return; }
    setSavingName(true);
    try {
      const { data } = await authApi.updateAccount({ name: name.trim() });
      updateUser({ name: data.name });
      setNameMsg('Nama akun berhasil diperbarui.');
      setTimeout(() => setNameMsg(''), 3000);
    } catch (err: any) {
      setNameErr(err.response?.data?.error || 'Gagal memperbarui nama akun.');
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(''); setPwdErr('');
    if (newPassword.length < 6) { setPwdErr('Password baru minimal 6 karakter.'); return; }
    if (newPassword !== confirmPassword) { setPwdErr('Konfirmasi password tidak cocok.'); return; }
    setSavingPwd(true);
    try {
      await authApi.changePassword(oldPassword, newPassword);
      setPwdMsg('Password berhasil diubah.');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => setPwdMsg(''), 3000);
    } catch (err: any) {
      setPwdErr(err.response?.data?.error || 'Gagal mengubah password.');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500 mt-1">Kelola akun login dan keamanan Anda</p>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl">
        {/* Profil Akun */}
        <GlassCard className="p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Profil Akun</h3>
          <p className="text-sm text-slate-500 mb-6">Identitas akun login Anda. Foto & data usaha diatur di menu Profil Usaha.</p>

          {nameMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />{nameMsg}
            </div>
          )}
          {nameErr && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{nameErr}</div>}

          <form onSubmit={handleSaveName} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                <input value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Nama pemilik usaha" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Email <span className="text-xs text-slate-400">(tidak dapat diubah)</span></label>
                <input value={user?.email ?? ''} readOnly className={readonlyCls} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <input value={ROLE_LABEL[user?.role ?? ''] ?? user?.role ?? '—'} readOnly className={readonlyCls} />
              </div>
            </div>
            <div className="flex justify-end">
              <GlowButton type="submit" variant="primary" disabled={savingName} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium">
                {savingName ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan</>}
              </GlowButton>
            </div>
          </form>
        </GlassCard>

        {/* Keamanan */}
        <GlassCard className="p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2"><KeyRound className="w-5 h-5 text-slate-400" /> Keamanan</h3>
          <p className="text-sm text-slate-500 mb-6">Ganti password akun Anda secara berkala.</p>

          {pwdMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />{pwdMsg}
            </div>
          )}
          {pwdErr && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{pwdErr}</div>}

          <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 md:max-w-sm">
              <label className="text-sm font-medium text-slate-700">Password Lama</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className={inputCls} placeholder="Masukkan password saat ini" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Password Baru</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputCls} placeholder="Minimal 6 karakter" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Konfirmasi Password Baru</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputCls} placeholder="Ulangi password baru" required />
              </div>
            </div>
            <div className="flex justify-end">
              <GlowButton type="submit" variant="primary" disabled={savingPwd} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium">
                {savingPwd ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><KeyRound className="w-4 h-4" /> Ganti Password</>}
              </GlowButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </>
  );
}
