import {
  LayoutDashboard, ShoppingBag, Folders, FileText,
  TrendingUp, PieChart, Map, Settings, UserCircle
} from 'lucide-react';
import type { SidebarNavItem } from '@/components/layout/sidebar-nav';

export const umkmBrandConfig = {
  mark: 'L',
  name: 'LOPs Hub',
  descriptor: 'Local Pride Spot',
};

export const umkmMainNavItems: SidebarNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/workspace' },
  { label: 'Profil Usaha', icon: UserCircle, href: '/workspace/profil' },
  {
    label: 'Produk',
    icon: ShoppingBag,
    href: '/workspace/produk',
    children: [
      { label: 'Semua Produk', href: '/workspace/produk' },
      { label: 'Tambah Produk', href: '/workspace/produk/tambah' },
    ],
  },
  { label: 'Program Saya', icon: Folders, href: '/workspace/program' },
  { label: 'Dokumen', icon: FileText, href: '/workspace/dokumen' },
  { label: 'Omzet & Growth', icon: TrendingUp, href: '/workspace/omzet' },
  { label: 'Analytics', icon: PieChart, href: '/workspace/analytics' },
  { label: 'Laporan', icon: FileText, href: '/workspace/laporan' },
];

export const umkmSupportNavItems: SidebarNavItem[] = [
  { label: 'Pengaturan', icon: Settings, href: '/workspace/settings' },
];
