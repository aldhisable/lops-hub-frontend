import {
  LayoutDashboard, Users, Folders, Award, Map,
  FileText, PieChart, Target, UserCircle, Settings
} from 'lucide-react';
import type { SidebarNavItem } from '@/components/layout/sidebar-nav';

export const regionalBrandConfig = {
  mark: 'L',
  name: 'LOPs Hub',
  descriptor: 'Local Pride Spot',
};

export const regionalMainNavItems: SidebarNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/regional' },
];

export const regionalDataNavItems: SidebarNavItem[] = [
  { label: 'UMKM', icon: Users, href: '/regional/umkm' },
  { label: 'Program', icon: Folders, href: '/regional/program' },
  { label: 'Klasifikasi', icon: Award, href: '/regional/klasifikasi' },
  { label: 'Peta Sebaran', icon: Map, href: '/regional/peta' },
  { label: 'Laporan', icon: FileText, href: '/regional/laporan' },
];

export const regionalAnalyticsNavItems: SidebarNavItem[] = [
  { label: 'Analytics', icon: PieChart, href: '/regional/analytics' },
  { label: 'Target & KPI', icon: Target, href: '/regional/target' },
];

export const regionalSupportNavItems: SidebarNavItem[] = [
  { label: 'Pengguna', icon: UserCircle, href: '/regional/users' },
  { label: 'Pengaturan', icon: Settings, href: '/regional/settings' },
];
