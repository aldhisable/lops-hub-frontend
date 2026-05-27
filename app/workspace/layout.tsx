"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { InternalLayout } from '@/components/layout/internal-layout';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TopBar } from '@/components/layout/top-bar';
import { umkmBrandConfig, umkmMainNavItems, umkmSupportNavItems } from '@/config/workspace-sidebar-config';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebar = (
    <SidebarNav
      brand={umkmBrandConfig}
      items={umkmMainNavItems}
      supportItems={umkmSupportNavItems}
      activePath={pathname}
    />
  );

  return (
    <InternalLayout sidebar={sidebar} topbar={<TopBar userName="Siti Aisyah" userRole="UMK Binaan" />}>
      {children}
    </InternalLayout>
  );
}
