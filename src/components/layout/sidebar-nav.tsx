"use client";

import React, { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react'
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
}

export function SidebarNav({
  brand,
  items,
  supportItems = [],
  activePath = '/dashboard',
}: SidebarNavProps) {
  const { closeMobileSidebar } = useLayout();

  return (
    <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col h-full overflow-y-auto">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
          {brand.mark}
        </div>
        <div>
          <strong className="block text-slate-900 font-bold text-lg leading-tight">{brand.name}</strong>
          <span className="text-xs text-blue-600 font-medium tracking-wide">{brand.descriptor}</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 flex flex-col gap-1">
        <NavList activePath={activePath} items={items} onClose={closeMobileSidebar} />
      </div>

      <div className="p-4 mt-auto">
        {supportItems.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
             <NavList activePath={activePath} items={supportItems} onClose={closeMobileSidebar} />
          </div>
        )}

        <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium p-4 mt-2 transition-colors w-full">
          <ChevronLeft className="w-4 h-4" />
          Collapse
        </button>
      </div>
    </aside>
  )
}

function NavList({
  activePath,
  items,
  onClose,
}: {
  activePath: string
  items: SidebarNavItem[]
  onClose?: () => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <NavItem key={item.label} item={item} activePath={activePath} onClose={onClose} />
      ))}
    </nav>
  )
}

function NavItem({ item, activePath, onClose }: { item: SidebarNavItem; activePath: string; onClose?: () => void }) {
  const Icon = item.icon
  const hasChildren = item.children && item.children.length > 0
  const isActive = activePath === item.href || (item.href !== '/dashboard' && activePath.startsWith(item.href))
  const isChildActive = hasChildren && item.children!.some(c => activePath === c.href || activePath.startsWith(c.href))
  const shouldExpand = isActive || isChildActive

  const [expanded, setExpanded] = useState(shouldExpand)

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
      {/* Show chevron for items that could have sub-pages */}
    </Link>
  )
}
