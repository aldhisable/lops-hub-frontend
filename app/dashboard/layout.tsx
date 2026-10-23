"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { InternalLayout } from '@/components/layout/internal-layout';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TopBar } from '@/components/layout/top-bar';
import { brandConfig, mainNavItems, supportNavItems } from '@/config/sidebar-config';
import { useAuth } from '@/context/auth-context';
import { RoleGuard } from '@/components/layout/role-guard';
import { ShieldCheck } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const support = user?.isSuperAdmin
    ? [{ label: 'Manajemen Admin', icon: ShieldCheck, href: '/dashboard/admin' }, ...supportNavItems]
    : supportNavItems;

  const sidebar = (
    <SidebarNav
      brand={brandConfig}
      items={mainNavItems}
      supportItems={support}
      activePath={pathname}
    />
  );

  return (
    <RoleGuard role="ADMIN_PUSAT"><InternalLayout sidebar={sidebar} topbar={<TopBar />}>
      {children}
    </InternalLayout></RoleGuard>
  );
}
