import {
  LayoutDashboard, Users, Folders, Award, Map,
  FileText, PieChart, Settings,
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
];

// 'Target & KPI' dan 'Pengguna' sengaja tidak dicantumkan: belum ada model
// Target maupun API manajemen pengguna, jadi menunya hanya akan mengarah ke
// halaman contoh. Munculkan kembali begitu backend-nya ada.
export const regionalSupportNavItems: SidebarNavItem[] = [
  { label: 'Pengaturan', icon: Settings, href: '/regional/settings' },
];
