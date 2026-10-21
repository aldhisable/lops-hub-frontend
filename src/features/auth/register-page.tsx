"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/auth-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { useAuth } from '@/context/auth-context';
import { UMKM_CATEGORIES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { authApi } from '@/lib/api';

const inputCls =
  'px-4 py-2.5 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all';

const RESEND_COOLDOWN = 60;
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [phase, setPhase] = useState<'form' | 'otp'>('form');
  const [name, setName] = useState('');
  const [umkmName, setUmkmName] = useState('');
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [otp, setOtp] = useState('');
  const [verifiedOtpToken, setVerifiedOtpToken] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<'checking' | 'sending' | 'verifying' | null>(null);
  const isLoading = loadingAction !== null;
  const loadingText = loadingAction === 'checking' ? 'Memeriksa email...' : loadingAction === 'sending' ? 'Mengirim kode...' : 'Memverifikasi...';
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // Cek email sebelum setiap pengiriman. Gangguan tetap ditampilkan di halaman
  // kode; akun hanya dibuat setelah OTP berhasil diverifikasi oleh server.
  const sendOtp = async (address: string) => {
    setVerifiedOtpToken(null);
    try {
      await authApi.checkRegistrationEmail(address);
    } catch (err: unknown) {
      const response = (err as { response?: { status?: number } }).response;
      if (response?.status === 409) {
        setPhase('form');
        setError('Email sudah terdaftar. Silakan login atau gunakan email lain.');
      } else {
        setError('Email belum dapat diperiksa. Silakan klik Kirim ulang kode untuk mencoba lagi.');
      }
      return;
    }

    if (!supabase) {
      setError('Layanan pengiriman kode belum tersedia. Silakan klik Kirim ulang kode untuk mencoba lagi nanti.');
      return;
    }

    setLoadingAction('sending');
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: address,
        options: { shouldCreateUser: true },
      });
      if (otpError) {
        setError(otpError.status === 429
          ? 'Terlalu banyak permintaan kode. Tunggu sebentar, lalu klik Kirim ulang kode.'
          : 'Kode OTP belum berhasil dikirim. Silakan klik Kirim ulang kode untuk mencoba lagi.');
        if (otpError.status === 429) setCooldown(RESEND_COOLDOWN);
        return;
      }
    } catch {
      setError('Layanan pengiriman kode belum dapat dihubungi. Silakan klik Kirim ulang kode untuk mencoba lagi.');
      return;
    }

    setCooldown(RESEND_COOLDOWN);
    setInfo(`Kode OTP telah dikirim ke ${address}.`);
  };

  // Langkah 1: validasi form lalu kirim OTP
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const address = email.trim().toLowerCase();
    if (!isValidEmail(address)) {
      setError('Masukkan alamat email yang valid (OTP akan dikirim ke email ini).');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoadingAction('checking');
    setEmail(address);
    setOtp('');
    setPhase('otp');
    try {
      await sendOtp(address);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoadingAction(null);
    }
  };

  // Langkah 2: verifikasi OTP, lalu buat akun + profil via backend
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!supabase) {
      setError('Layanan verifikasi belum tersedia. Silakan klik Kirim ulang kode untuk mencoba lagi nanti.');
      return;
    }
    if (otp.trim().length < 6) {
      setError('Masukkan kode OTP dari email Anda.');
      return;
    }

    setLoadingAction('verifying');
    try {
      let otpToken = verifiedOtpToken;
      if (!otpToken) {
        const { data: hasilOtp, error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: otp.trim(),
          type: 'email',
        });
        if (verifyError) {
          setError('Kode OTP salah, sudah kedaluwarsa, atau layanan belum tersedia. Periksa kode atau kirim ulang.');
          return;
        }
        otpToken = hasilOtp.session?.access_token ?? null;
        if (!otpToken) {
          setError('Verifikasi email tidak menghasilkan sesi. Coba kirim ulang kode.');
          return;
        }
        // Simpan hanya di memori agar retry backend tidak memakai ulang kode
        // OTP yang sudah dikonsumsi oleh Supabase.
        setVerifiedOtpToken(otpToken);
      }

      const { redirectTo } = await register({ name, umkmName, category, email, password, otpToken });
      router.push(redirectTo);
    } catch (err: unknown) {
      const response = (err as { response?: { status?: number; data?: { error?: string } } }).response;
      if (response?.status === 409) {
        setPhase('form');
        setInfo('');
        setVerifiedOtpToken(null);
      } else if (response?.status === 401) {
        setVerifiedOtpToken(null);
      }
      setError(response?.data?.error || 'Pendaftaran belum berhasil. Silakan coba lagi atau kirim ulang kode.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isLoading) return;
    setError('');
    setInfo('');
    setLoadingAction('checking');
    try {
      await sendOtp(email);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <AuthLayout>
      <GlassCard className="p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-white/40 bg-white/70">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-4"><img src="/logo.png" alt="LOPs Hub" className="w-full h-full object-cover" /></div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {phase === 'form' ? 'Daftar UMK' : 'Verifikasi Email'}
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {phase === 'form'
              ? 'Buat akun untuk mengelola usaha Anda di LOPs Hub'
              : `Masukkan kode OTP untuk memverifikasi ${email}`}
          </p>
        </div>

        {phase === 'form' ? (
          <form onSubmit={handleSubmitForm} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Nama Pemilik</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Nama lengkap Anda" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Nama Usaha</label>
              <input type="text" required value={umkmName} onChange={(e) => setUmkmName(e.target.value)} className={inputCls} placeholder="Nama UMK / brand usaha" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Kategori Usaha</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputCls} bg-white/50 ${category ? 'text-slate-900' : 'text-slate-400'}`}
              >
                <option value="" disabled>Pilih kategori usaha</option>
                {UMKM_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="text-slate-900">{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="email@usaha.id" />
              <p className="text-xs text-slate-400">Kode OTP akan dikirim ke email ini untuk verifikasi.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="Minimal 6 karakter" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Konfirmasi Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} placeholder="Ulangi password" />
            </div>

            {error && (
              <div role="alert" className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
            )}

            <GlowButton type="submit" variant="primary" className="w-full py-2.5 mt-2 rounded-lg" disabled={isLoading}>
              {isLoading ? loadingText : 'Lanjut & Kirim OTP'}
            </GlowButton>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="registration-otp" className="text-sm font-medium text-slate-700">Kode OTP</label>
              <input
                id="registration-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={10}
                required
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setVerifiedOtpToken(null); }}
                className={`${inputCls} text-center text-lg tracking-[0.4em] font-semibold`}
                placeholder="Masukkan kode dari email"
              />
            </div>

            {info && (
              <div role="status" className="px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">{info}</div>
            )}
            {error && (
              <div role="alert" className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
            )}

            <GlowButton type="submit" variant="primary" className="w-full py-2.5 mt-2 rounded-lg" disabled={isLoading}>
              {isLoading ? loadingText : 'Verifikasi & Daftar'}
            </GlowButton>

            <div className="flex items-center justify-between text-sm">
              <button type="button" disabled={isLoading} onClick={() => { setPhase('form'); setError(''); setInfo(''); setVerifiedOtpToken(null); }} className="font-medium text-slate-500 hover:text-slate-700">
                ← Ubah data
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || isLoading}
                className="font-medium text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : 'Kirim ulang kode'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">Login di sini</Link>
          </p>
        </div>

      </GlassCard>
    </AuthLayout>
  );
}
