"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TopBar } from '@/components/layout/top-bar';
import { InternalLayout } from '@/components/layout/internal-layout';
import { regionalBrandConfig, regionalMainNavItems, regionalDataNavItems, regionalAnalyticsNavItems, regionalSupportNavItems } from '@/config/regional-sidebar-config';
import { MapPin, ChevronDown } from 'lucide-react';

function RegionalSidebar({ activePath }: { activePath: string }) {
  const allItems = [...regionalMainNavItems, ...regionalDataNavItems, ...regionalAnalyticsNavItems];
  return (
    <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-40 overflow-y-auto">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-blue-500/30 shrink-0"><img src="/logo.png" alt="LOPs Hub" className="w-full h-full object-cover" /></div>
        <div><strong className="block text-slate-900 font-bold text-lg leading-tight">{regionalBrandConfig.name}</strong><span className="text-xs text-blue-600 font-medium tracking-wide">{regionalBrandConfig.descriptor}</span></div>
      </div>

      <div className="flex-1 px-4 py-2 flex flex-col gap-1">
        {/* Dashboard */}
        <NavSection items={regionalMainNavItems} activePath={activePath} />

        {/* Data & Manajemen */}
        <div className="mt-4 mb-2 px-4"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data & Manajemen</span></div>
        <NavSection items={regionalDataNavItems} activePath={activePath} />

        {/* Analytics */}
        <div className="mt-4 mb-2 px-4"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Analytics</span></div>
        <NavSection items={regionalAnalyticsNavItems} activePath={activePath} />

        {/* Pengaturan */}
        <div className="mt-4 mb-2 px-4"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pengaturan</span></div>
        <NavSection items={regionalSupportNavItems} activePath={activePath} />
      </div>

      {/* Regional Aktif Indicator */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Regional Aktif</div>
          <button className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><MapPin className="w-4 h-4 text-blue-600" /></div>
            <div className="flex-1 text-left"><div className="text-sm font-semibold text-slate-900">Regional 4</div><div className="text-xs text-slate-500">Makassar, Sulawesi Selatan</div></div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavSection({ items, activePath }: { items: typeof regionalMainNavItems; activePath: string }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activePath === item.href || (item.href !== '/regional' && activePath.startsWith(item.href));
        return (
          <a key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

export default function RegionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <RegionalSidebar activePath={pathname} />
      <div className="flex-1 ml-[280px] flex flex-col">
        <TopBar userName="Admin Regional" userRole="Regional 4 - Makassar" searchPlaceholder="Cari UMKM, program, kategori, wilayah..." />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
