"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { InternalLayout } from '@/components/layout/internal-layout';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TopBar } from '@/components/layout/top-bar';
import { umkmBrandConfig, umkmMainNavItems, umkmSupportNavItems } from '@/config/workspace-sidebar-config';
import { useAuth } from '@/context/auth-context';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const sidebar = (
    <SidebarNav
      brand={umkmBrandConfig}
      items={umkmMainNavItems}
      supportItems={umkmSupportNavItems}
      activePath={pathname}
    />
  );

  return (
    <InternalLayout sidebar={sidebar} topbar={<TopBar userName={user?.name ?? 'UMKM'} userRole="UMK Binaan" />}>
      {children}
    </InternalLayout>
  );
}
