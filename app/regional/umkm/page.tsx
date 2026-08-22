"use client";

import { UMKMDirectoryPage } from '@/features/dashboard/umkm-page';
import { useAuth } from '@/context/auth-context';

// Direktori yang sama dengan milik Admin Pusat. Penyaringan wilayah dilakukan di
// backend, jadi komponennya cukup diberi tahu tautan mana yang harus dipakai —
// bukan disalin ulang.
export default function RegionalUMKM() {
  const { user } = useAuth();
  return (
    <UMKMDirectoryPage
      basePath="/regional"
      scopeLabel={user?.regional ?? undefined}
      canCreate={false}
    />
  );
}
