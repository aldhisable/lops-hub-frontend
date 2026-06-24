"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LayoutContextType {
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Restore collapsed preference
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('sidebar_collapsed') === '1') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
  const toggleSidebarCollapsed = () =>
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') localStorage.setItem('sidebar_collapsed', next ? '1' : '0');
      return next;
    });

  return (
    <LayoutContext.Provider value={{ isMobileSidebarOpen, toggleMobileSidebar, closeMobileSidebar, isSidebarCollapsed, toggleSidebarCollapsed }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
