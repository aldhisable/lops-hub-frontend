"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/auth-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { useAuth } from '@/context/auth-context';

export function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { redirectTo } = await login(email, password);
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <GlassCard className="p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-white/40 bg-white/70">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-4"><img src="/logo.png" alt="LOPs Hub" className="w-full h-full object-cover" /></div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">LOPs Hub</h1>
          <p className="text-slate-600 text-sm mt-2">Local Pride Spot — Intelligence & Growth Platform</p>
        </div>

        <form onSubmit={handleLogin} aria-describedby={error ? 'login-error' : undefined} aria-busy={isLoading} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-identifier" className="text-sm font-medium text-slate-700">Email</label>
            <input
              id="login-identifier"
              name="username"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-field px-4 py-2.5 rounded-lg border border-slate-500/80 focus:border-primary"
              placeholder="email@usaha.id"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="login-password" className="text-sm font-medium text-slate-700">Password</label>
              <Link href="/forgot-password" className="inline-flex min-h-[44px] items-center rounded-md px-2 text-xs font-medium text-blue-700! hover:bg-blue-50 hover:text-blue-800! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Lupa Password?</Link>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-field px-4 py-2.5 rounded-lg border border-slate-500/80 focus:border-primary"
              placeholder="Masukkan password"
            />
          </div>

          {error && (
            <div id="login-error" role="alert" className="auth-feedback px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <GlowButton type="submit" variant="primary" className="w-full py-2.5 mt-2 rounded-lg" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Login Sekarang'}
          </GlowButton>
        </form>

        <p className="text-sm text-center mt-5"><Link href="/activate-account" className="font-medium text-blue-700!">Menerima undangan admin? Aktivasi akun</Link></p>
        <p className="text-sm text-slate-600 text-center mt-5">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="inline-block rounded-md px-1.5 py-1 font-semibold text-blue-700! hover:bg-blue-50 hover:text-blue-800! hover:shadow-sm focus-visible:bg-blue-50 focus-visible:text-blue-800! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-blue-100 active:text-blue-900!"
          >
            Daftar sebagai UMK
          </Link>
        </p>

      </GlassCard>
    </AuthLayout>
  );
}
