import {
  LayoutDashboard, Users, Folders, PieChart, Map,
  FileText, Award, Settings, Ship
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
  { label: 'Ekspor', icon: Ship, href: '/dashboard/ekspor' },
  { label: 'Klasifikasi', icon: Award, href: '/dashboard/klasifikasi' },
  { label: 'Analytics', icon: PieChart, href: '/dashboard/analytics' },
  { label: 'Peta Sebaran', icon: Map, href: '/dashboard/peta' },
  { label: 'Laporan', icon: FileText, href: '/dashboard/laporan' },
];

// 'Target & KPI', 'Pengguna', dan 'Media & Galeri' sengaja tidak dicantumkan:
// belum ada model Target, API manajemen pengguna, maupun penyimpanan media.
// Munculkan kembali begitu backend-nya ada — menu yang tampak berfungsi padahal
// kosong lebih merugikan daripada tidak ada menunya sama sekali.
export const supportNavItems: SidebarNavItem[] = [
  { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
];
