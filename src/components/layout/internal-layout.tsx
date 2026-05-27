"use client";

import React, { ReactNode } from 'react'
import { LayoutProvider, useLayout } from '@/context/layout-context'
import { cn } from '@/lib/utils'

type InternalLayoutProps = {
  children: ReactNode
  sidebar: ReactNode
  topbar: ReactNode
}

function LayoutContent({ children, sidebar, topbar }: InternalLayoutProps) {
  const { isMobileSidebarOpen, closeMobileSidebar } = useLayout();
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebar}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[280px] flex flex-col min-w-0 transition-all duration-300 w-full">
        {topbar}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden max-w-[100vw]">
          {children}
        </main>
      </div>
    </div>
  )
}

export function InternalLayout(props: InternalLayoutProps) {
  return (
    <LayoutProvider>
      <LayoutContent {...props} />
    </LayoutProvider>
  )
}
