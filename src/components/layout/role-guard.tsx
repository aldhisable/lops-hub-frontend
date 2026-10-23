"use client";

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import type { AuthUser } from '@/lib/api';
import { hasRoleAccess, homeForRole } from '@/lib/role-access';

export function RoleGuard({ role, superOnly = false, children }: { role: AuthUser['role']; superOnly?: boolean; children: ReactNode }) {
  const { user, isLoading, sessionError, refreshSession } = useAuth();
  const router = useRouter();
  const allowed = hasRoleAccess(user, role, superOnly);
  useEffect(() => {
    if (!isLoading && !sessionError && !allowed) router.replace(homeForRole(user?.role));
  }, [isLoading, sessionError, allowed, user?.role, router]);

  if (sessionError) return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <p role="alert" className="text-slate-700">{sessionError}</p>
      <button onClick={() => void refreshSession()} className="rounded-lg bg-blue-600 px-5 py-3 text-white">Coba lagi</button>
    </main>
  );
  if (isLoading || !allowed) return <div role="status" className="p-10 text-center text-sm text-slate-500">Memeriksa akses akun…</div>;
  return children;
}
