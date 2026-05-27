import React, { ReactNode } from 'react';
import Link from 'next/link';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen relative flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[120px]" />
      </div>

      {/* Back to Home */}
      <Link href="/" className="absolute top-8 left-8 z-20 text-slate-500 hover:text-blue-600 font-medium text-sm flex items-center gap-2 transition-colors">
        ← Kembali ke Beranda
      </Link>

      <section className="relative z-10 w-full max-w-md px-4">
        {children}
      </section>
    </main>
  );
}
