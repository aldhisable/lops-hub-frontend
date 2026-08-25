"use client";

import { KlasifikasiPage } from '@/features/dashboard/klasifikasi-page';
import { useAuth } from '@/context/auth-context';

// Komponen yang sama dengan Admin Pusat; hanya sumber angkanya yang berbeda
// (statistik wilayah, bukan nasional) dan tautannya mengarah ke direktori
// regional.
export default function RegionalKlasifikasi() {
  const { user } = useAuth();
  return <KlasifikasiPage regional={user?.regional ?? undefined} basePath="/regional" />;
}
