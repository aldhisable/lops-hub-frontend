"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/auth-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { supabase } from '@/lib/supabase';
import { authApi } from '@/lib/api';

const inputCls = 'auth-field px-4 py-2.5 rounded-lg border border-slate-500/80 focus:border-primary';
const linkCls = 'inline-flex min-h-[44px] items-center justify-center rounded-md px-2 text-sm font-medium text-blue-700! hover:bg-blue-50 hover:text-blue-800! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60';
const RESEND_COOLDOWN = 60;

export function ForgotPasswordPage() {
  const [phase, setPhase] = useState<'email' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [action, setAction] = useState<'sending' | 'resetting' | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const isLoading = action !== null;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const sendCode = async (address: string) => {
    if (isLoading || cooldown > 0) return;
    setError('');
    setInfo('');
    setCode('');
    setAction('sending');
    try {
      if (!supabase) {
        setError('Layanan pengiriman kode belum tersedia. Silakan kirim ulang kode nanti.');
        return;
      }
      // Sama dengan gerbang verifikasi email registrasi. Ini dapat menyiapkan
      // identitas email Supabase untuk akun impor, tetapi tidak membuat akun LOPs.
      const { error: providerError } = await supabase.auth.signInWithOtp({
        email: address,
        options: { shouldCreateUser: true },
      });
      if (providerError) {
        if (providerError.status === 429) setCooldown(RESEND_COOLDOWN);
        setError(providerError.status === 429
          ? 'Terlalu banyak permintaan kode. Tunggu sebentar sebelum mengirim ulang.'
          : 'Kode belum berhasil dikirim. Silakan kirim ulang kode.');
        return;
      }
      setCooldown(RESEND_COOLDOWN);
      setInfo('Periksa kode verifikasi di kotak masuk atau spam. Kode hanya dapat memulihkan akun LOPs Hub yang sudah terdaftar.');
    } catch {
      setError('Layanan pengiriman kode belum dapat dihubungi. Silakan kirim ulang kode.');
    } finally {
      setAction(null);
    }
  };

  const handleEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading || cooldown > 0) return;
    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError('Masukkan alamat email akun yang valid.');
      return;
    }
    setEmail(address);
    setPhase('reset');
    await sendCode(address);
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!/^\d{6,10}$/.test(code)) {
      setError('Masukkan kode OTP dari email Anda.');
      return;
    }
    if (password.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }
    if (password !== confirmation) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setAction('resetting');
    try {
      // Backend mengonsumsi OTP sekali pakai dan mengganti hash password LOPs.
      // Tidak memakai supabase.auth.updateUser(), karena login memakai backend.
      await authApi.resetPassword(email, code, password);
      setCode('');
      setPassword('');
      setConfirmation('');
      setInfo('Password berhasil diperbarui. Silakan login dengan password baru.');
      setPhase('success');
    } catch (failure: unknown) {
      const response = (failure as { response?: { status?: number; data?: { error?: string } } }).response;
      setError(response?.data?.error || 'Pemulihan belum dapat diselesaikan. Coba login dengan password baru; jika belum bisa, kirim ulang kode.');
    } finally {
      setAction(null);
    }
  };

  return (
    <AuthLayout>
      <GlassCard className="p-6 sm:p-8">
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="LOPs Hub" width={48} height={48} className="mx-auto mb-4 rounded-full" />
          <h1 className="text-2xl font-bold text-slate-900">{phase === 'success' ? 'Password Diperbarui' : 'Lupa Password?'}</h1>
          <p className="mt-2 text-sm text-slate-600 [overflow-wrap:anywhere]">
            {phase === 'email' ? 'Gunakan email yang terdaftar pada akun LOPs Hub.'
              : phase === 'reset' ? `Masukkan kode dari email ${email} dan password baru Anda.`
                : 'Akun Anda siap digunakan kembali.'}
          </p>
        </div>

        {phase === 'email' && (
          <form key="recovery-email" onSubmit={handleEmail} aria-busy={isLoading} aria-describedby={error ? 'recovery-email-error' : undefined} className="auth-step flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="recovery-email" className="text-sm font-medium text-slate-700">Email akun</label>
              <input id="recovery-email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} className={inputCls} placeholder="email@usaha.id" aria-describedby="recovery-help" />
              <p id="recovery-help" className="text-sm text-slate-600">Pastikan email akun aktif dan dapat diakses. Jika belum memiliki akses, hubungi administrator LOPs Hub untuk memperbarui email akun.</p>
            </div>
            {error && <div id="recovery-email-error" role="alert" className="auth-feedback rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <GlowButton type="submit" className="w-full" disabled={isLoading || cooldown > 0}>{cooldown > 0 ? `Kirim kode (${cooldown}s)` : 'Kirim kode verifikasi'}</GlowButton>
          </form>
        )}

        {phase === 'reset' && (
          <form key="recovery-reset" onSubmit={handleReset} aria-busy={isLoading} aria-describedby={error ? 'recovery-reset-error' : undefined} className="auth-step flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="recovery-code" className="text-sm font-medium text-slate-700">Kode OTP</label>
              <input id="recovery-code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={10} required autoFocus value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ''))} className={inputCls} placeholder="Kode dari email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="recovery-password" className="text-sm font-medium text-slate-700">Password baru</label>
              <input id="recovery-password" name="newPassword" type="password" autoComplete="new-password" minLength={6} maxLength={72} required value={password} onChange={event => setPassword(event.target.value)} className={inputCls} placeholder="Minimal 6 karakter" aria-describedby="recovery-password-hint" />
              <p id="recovery-password-hint" className="text-sm text-slate-600">Gunakan minimal 6 karakter. Jangan bagikan kode atau password kepada siapa pun.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="recovery-confirmation" className="text-sm font-medium text-slate-700">Konfirmasi password baru</label>
              <input id="recovery-confirmation" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} maxLength={72} required value={confirmation} onChange={event => setConfirmation(event.target.value)} className={inputCls} placeholder="Ulangi password baru" />
            </div>
            {info && <div role="status" className="auth-feedback rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{info}</div>}
            {error && <div id="recovery-reset-error" role="alert" className="auth-feedback rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <GlowButton type="submit" className="w-full" disabled={isLoading}>{action === 'sending' ? 'Mengirim kode...' : action === 'resetting' ? 'Memperbarui password...' : 'Simpan password baru'}</GlowButton>
            <div className="flex flex-wrap justify-between gap-2">
              <button type="button" className={linkCls} disabled={isLoading} onClick={() => { setPhase('email'); setError(''); setInfo(''); setCode(''); }}>Ubah email</button>
              <button type="button" className={`${linkCls} tabular-nums`} disabled={isLoading || cooldown > 0} onClick={() => sendCode(email)}>{cooldown > 0 ? `Kirim ulang (${cooldown}s)` : 'Kirim ulang kode'}</button>
            </div>
          </form>
        )}

        {phase === 'success' && (
          <div className="auth-step flex flex-col gap-5">
            <p role="status" className="auth-feedback rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{info}</p>
            <GlowButton asChild className="w-full"><Link href="/login" className="text-white!">Login dengan password baru</Link></GlowButton>
          </div>
        )}
        {phase !== 'success' && <div className="mt-5 border-t border-slate-100 pt-3 text-center"><Link href="/login" className={linkCls}>Kembali ke login</Link></div>}
      </GlassCard>
    </AuthLayout>
  );
}
