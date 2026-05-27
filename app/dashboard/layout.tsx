"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { InternalLayout } from '@/components/layout/internal-layout';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TopBar } from '@/components/layout/top-bar';
import { brandConfig, mainNavItems, supportNavItems } from '@/config/sidebar-config';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebar = (
    <SidebarNav
      brand={brandConfig}
      items={mainNavItems}
      supportItems={supportNavItems}
      activePath={pathname}
    />
  );

  return (
    <InternalLayout sidebar={sidebar} topbar={<TopBar />}>
      {children}
    </InternalLayout>
  );
}
