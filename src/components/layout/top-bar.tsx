"use client";

import { useState, useRef, useEffect } from 'react'
import { Bell, Search, HelpCircle, ChevronDown, Menu, LogOut, User } from 'lucide-react'
import { useLayout } from '@/context/layout-context'
import { useAuth } from '@/context/auth-context'

type TopBarProps = {
  searchPlaceholder?: string
  userName?: string
  userRole?: string
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN_PUSAT: 'Admin Pusat',
  ADMIN_REGIONAL: 'Admin Regional',
  UMKM: 'UMK Binaan',
};

export function TopBar({ searchPlaceholder = "Cari UMKM, wilayah, kategori, program...", userName, userRole }: TopBarProps) {
  const { user: authUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = userName ?? authUser?.name ?? 'Pengguna';
  const displayRole = userRole ?? (authUser ? ROLE_LABEL[authUser.role] ?? authUser.role : 'Guest');
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const { toggleMobileSidebar } = useLayout();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  
  return (
    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile Toggle */}
        <button 
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-xl relative hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          aria-label="Search" 
          placeholder={searchPlaceholder} 
          type="search" 
          className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-full pl-11 pr-16 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
          <span>Ctrl</span>
          <span>+</span>
          <span>K</span>
        </div>
        </div>
      </div>
      
      {/* Mobile Search Icon */}
      <div className="md:hidden flex-1 flex justify-end">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button aria-label="Notifications" className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50" title="Notifications" type="button">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button aria-label="Help" className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50" title="Help" type="button">
          <HelpCircle className="w-5 h-5" />
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-2 md:gap-3 hover:bg-slate-50 p-1 md:p-1.5 md:pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shrink-0">
              {initials}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-sm font-semibold text-slate-900 leading-none">{displayName}</div>
              <div className="text-xs text-slate-500 mt-1">{displayRole}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/60 py-1 z-50">
              <div className="px-4 py-3 border-b border-slate-50">
                <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                <p className="text-xs text-slate-500 truncate">{displayRole}</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <User className="w-4 h-4" /> Profil Saya
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

