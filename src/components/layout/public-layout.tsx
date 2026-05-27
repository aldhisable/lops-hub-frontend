import React, { ReactNode } from 'react';
import Link from 'next/link';
import { GlowButton } from '../ui/glow-button';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <img src="/logo.png" alt="LOPs Hub" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">LOPs <span className="text-red-600">Hub</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
            <Link href="#program" className="hover:text-blue-600 transition-colors">Program</Link>
            <Link href="#showcase" className="hover:text-blue-600 transition-colors">Showcase</Link>
            <Link href="#statistik" className="hover:text-blue-600 transition-colors">Statistik</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <GlowButton variant="primary" className="px-6 py-2 rounded-full">
                Login Dashboard
              </GlowButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white">
             <div className="w-6 h-6 rounded-full overflow-hidden shrink-0"><img src="/logo.png" alt="LOPs Hub" className="w-full h-full object-cover" /></div>
             <span className="font-bold">LOPs Hub</span>
          </div>
          <p className="text-sm">© 2026 LOPs Hub — Local Pride Spot Intelligence & Growth Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
