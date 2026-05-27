import {
  LayoutDashboard, Users, Folders, PieChart, Map,
  FileText, Image, Target, Award, UserCircle, Settings
} from 'lucide-react';
import type { SidebarNavItem } from '@/components/layout/sidebar-nav';

export const brandConfig = {
  mark: 'L',
  name: 'LOPs Hub',
  descriptor: 'Local Pride Spot',
};

export const mainNavItems: SidebarNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  {
    label: 'UMKM',
    icon: Users,
    href: '/dashboard/umkm',
    children: [
      { label: 'All UMKM', href: '/dashboard/umkm' },
      { label: 'Tambah UMKM', href: '/dashboard/umkm/tambah' },
      { label: 'Pending Verifikasi', href: '/dashboard/umkm/pending' },
      { label: 'Graduated', href: '/dashboard/umkm/graduated' },
      { label: 'Archived', href: '/dashboard/umkm/archived' },
    ],
  },
  { label: 'Program', icon: Folders, href: '/dashboard/program' },
  { label: 'Klasifikasi', icon: Award, href: '/dashboard/klasifikasi' },
  { label: 'Analytics', icon: PieChart, href: '/dashboard/analytics' },
  { label: 'Peta Sebaran', icon: Map, href: '/dashboard/peta' },
  { label: 'Laporan', icon: FileText, href: '/dashboard/laporan' },
  { label: 'Media & Galeri', icon: Image, href: '/dashboard/media' },
  { label: 'Target & KPI', icon: Target, href: '/dashboard/target' },
];

export const supportNavItems: SidebarNavItem[] = [
  { label: 'Pengguna', icon: UserCircle, href: '/dashboard/users' },
  { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
];
