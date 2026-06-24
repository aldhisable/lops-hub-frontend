"use client";

import React, { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronLeft, ChevronDown, ChevronRight, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useLayout } from '@/context/layout-context'

export type SidebarSubItem = {
  label: string
  href: string
}

export type SidebarNavItem = {
  label: string
  icon: LucideIcon
  href: string
  children?: SidebarSubItem[]
}

type SidebarNavProps = {
  brand: {
    mark: string
    name: string
    descriptor: string
  }
  items: SidebarNavItem[]
  supportItems?: SidebarNavItem[]
  activePath?: string
  /** When set, every item except this href is locked (non-clickable). Used while a UMKM awaits verification. */
  lockExceptHref?: string
}

export function SidebarNav({
  brand,
  items,
  supportItems = [],
  activePath = '/dashboard',
  lockExceptHref,
}: SidebarNavProps) {
  const { closeMobileSidebar, isSidebarCollapsed, toggleSidebarCollapsed } = useLayout();

  return (
    <aside className={cn(
      'bg-white border-r border-slate-100 flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all duration-300',
      isSidebarCollapsed ? 'w-20' : 'w-[280px]'
    )}>
      <div className={cn('p-6 flex items-center gap-3', isSidebarCollapsed && 'justify-center px-0')}>
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-blue-500/30 shrink-0">
          <img src="/logo.png" alt="LOPs Hub" className="w-full h-full object-cover" />
        </div>
        {!isSidebarCollapsed && (
          <div>
            <strong className="block text-slate-900 font-bold text-lg leading-tight">{brand.name}</strong>
            <span className="text-xs text-blue-600 font-medium tracking-wide">{brand.descriptor}</span>
          </div>
        )}
      </div>

      <div className={cn('flex-1 py-2 flex flex-col gap-1', isSidebarCollapsed ? 'px-2' : 'px-4')}>
        <NavList activePath={activePath} items={items} onClose={closeMobileSidebar} lockExceptHref={lockExceptHref} collapsed={isSidebarCollapsed} />
      </div>

      <div className={cn('mt-auto', isSidebarCollapsed ? 'p-2' : 'p-4')}>
        {supportItems.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
             <NavList activePath={activePath} items={supportItems} onClose={closeMobileSidebar} lockExceptHref={lockExceptHref} collapsed={isSidebarCollapsed} />
          </div>
        )}

        <button
          onClick={toggleSidebarCollapsed}
          title={isSidebarCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          className={cn(
            'flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium mt-2 transition-colors w-full rounded-xl hover:bg-slate-50',
            isSidebarCollapsed ? 'justify-center p-3' : 'p-4'
          )}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> Collapse</>}
        </button>
      </div>
    </aside>
  )
}

function NavList({
  activePath,
  items,
  onClose,
  lockExceptHref,
  collapsed = false,
}: {
  activePath: string
  items: SidebarNavItem[]
  onClose?: () => void
  lockExceptHref?: string
  collapsed?: boolean
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          activePath={activePath}
          onClose={onClose}
          locked={!!lockExceptHref && item.href !== lockExceptHref}
          collapsed={collapsed}
        />
      ))}
    </nav>
  )
}

function NavItem({ item, activePath, onClose, locked = false, collapsed = false }: { item: SidebarNavItem; activePath: string; onClose?: () => void; locked?: boolean; collapsed?: boolean }) {
  const Icon = item.icon
  const hasChildren = !!item.children && item.children.length > 0
  const isActive = activePath === item.href || (item.href !== '/dashboard' && activePath.startsWith(item.href))
  const isChildActive = hasChildren && item.children!.some(c => activePath === c.href || activePath.startsWith(c.href))

  // Hook must run unconditionally (before any early return)
  const [expanded, setExpanded] = useState(isActive || isChildActive)

  // Locked (UMKM awaiting verification) — render non-clickable
  if (locked) {
    return (
      <div
        aria-disabled="true"
        title="Tersedia setelah akun Anda diverifikasi admin"
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 cursor-not-allowed select-none',
          collapsed && 'justify-center px-0'
        )}
      >
        <Icon className="w-5 h-5 text-slate-300" />
        {!collapsed && <><span className="flex-1">{item.label}</span><Lock className="w-3.5 h-3.5 text-slate-300" /></>}
      </div>
    )
  }

  // Collapsed rail — icon-only link (submenus flatten to the parent route)
  if (collapsed) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        title={item.label}
        className={cn(
          'flex items-center justify-center p-3 rounded-xl transition-colors',
          (isActive || isChildActive) ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        )}
      >
        <Icon className={cn('w-5 h-5', (isActive || isChildActive) ? 'text-blue-600' : 'text-slate-400')} />
      </Link>
    )
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group w-full',
            (isActive || isChildActive)
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          <Icon className={cn("w-5 h-5 transition-colors", (isActive || isChildActive) ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
          <span className="flex-1 text-left">{item.label}</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {expanded && (
          <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l-2 border-slate-100 pl-4">
            {item.children!.map(child => {
              const childActive = activePath === child.href || activePath.startsWith(child.href)
              return (
                <Link
                  key={child.label}
                  href={child.href}
                  onClick={onClose}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    childActive
                      ? 'text-blue-700 bg-blue-50/50'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {child.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      )}
    >
      <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
      {item.label}
    </Link>
  )
}
