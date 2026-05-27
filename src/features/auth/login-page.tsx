"use client";

import React, { useState } from 'react';
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
      <GlassCard className="p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-white/40 bg-white/70">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-4"><img src="/logo.png" alt="LOPs Hub" className="w-full h-full object-cover" /></div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">LOPs Hub</h1>
          <p className="text-slate-500 text-sm mt-2">Local Pride Spot — Intelligence & Growth Platform</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="email@pelindo.co.id"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">Lupa Password?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <GlowButton type="submit" variant="primary" className="w-full py-2.5 mt-2 rounded-lg" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Login Sekarang'}
          </GlowButton>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center mb-3">Demo Akun</p>
          <div className="flex flex-col gap-2 text-xs text-slate-500">
            <div className="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
              <span>Admin Pusat</span><span className="font-mono">admin@pelindo.co.id / admin123</span>
            </div>
            <div className="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
              <span>Admin Regional</span><span className="font-mono">regional4@pelindo.co.id / admin123</span>
            </div>
            <div className="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
              <span>UMKM Binaan</span><span className="font-mono">rumahlaut@umkm.id / umkm123</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
