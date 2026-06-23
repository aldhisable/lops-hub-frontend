"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/auth-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { useAuth } from '@/context/auth-context';
import { UMKM_CATEGORIES } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const inputCls =
  'px-4 py-2.5 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all';

const RESEND_COOLDOWN = 30;
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const sendOtp = async () => {
    if (!supabase) {
      setError('Verifikasi email belum dikonfigurasi (Supabase). Hubungi admin.');
      return false;
    }
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (otpError) {
      setError(otpError.message || 'Gagal mengirim kode OTP.');
      return false;
    }
    setCooldown(RESEND_COOLDOWN);
    setInfo(`Kode OTP telah dikirim ke ${email}.`);
    return true;
  };

  // Langkah 1: validasi form lalu kirim OTP
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!isValidEmail(email)) {
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

    setIsLoading(true);
    try {
      if (await sendOtp()) {
        setOtp('');
        setPhase('otp');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Langkah 2: verifikasi OTP, lalu buat akun + profil via backend
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!supabase) return;
    if (otp.trim().length < 6) {
      setError('Masukkan kode OTP dari email Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: 'email',
      });
      if (verifyError) {
        setError('Kode OTP salah atau sudah kadaluarsa.');
        return;
      }

      // Email terverifikasi → buat akun aplikasi
      const { redirectTo } = await register({ name, umkmName, category, email, password });
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isLoading) return;
    setError('');
    setInfo('');
    setIsLoading(true);
    try {
      await sendOtp();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <GlassCard className="p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-white/40 bg-white/70">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-4"><img src="/logo.png" alt="LOPs Hub" className="w-full h-full object-cover" /></div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {phase === 'form' ? 'Daftar UMKM' : 'Verifikasi Email'}
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {phase === 'form'
              ? 'Buat akun untuk mengelola usaha Anda di LOPs Hub'
              : `Masukkan kode yang kami kirim ke ${email}`}
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
              <input type="text" required value={umkmName} onChange={(e) => setUmkmName(e.target.value)} className={inputCls} placeholder="Nama UMKM / brand usaha" />
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
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
            )}

            <GlowButton type="submit" variant="primary" className="w-full py-2.5 mt-2 rounded-lg" disabled={isLoading}>
              {isLoading ? 'Mengirim kode...' : 'Lanjut & Kirim OTP'}
            </GlowButton>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Kode OTP</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={10}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className={`${inputCls} text-center text-lg tracking-[0.4em] font-semibold`}
                placeholder="Masukkan kode dari email"
              />
            </div>

            {info && (
              <div className="px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">{info}</div>
            )}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
            )}

            <GlowButton type="submit" variant="primary" className="w-full py-2.5 mt-2 rounded-lg" disabled={isLoading}>
              {isLoading ? 'Memverifikasi...' : 'Verifikasi & Daftar'}
            </GlowButton>

            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => { setPhase('form'); setError(''); setInfo(''); }} className="font-medium text-slate-500 hover:text-slate-700">
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

        {!isSupabaseConfigured && (
          <p className="mt-4 text-center text-xs text-amber-600">
            ⚠ Supabase belum dikonfigurasi — isi NEXT_PUBLIC_SUPABASE_URL & ANON_KEY di .env.local
          </p>
        )}
      </GlassCard>
    </AuthLayout>
  );
}
