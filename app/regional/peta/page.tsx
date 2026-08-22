"use client";

import { MapPage } from '@/features/dashboard/map-page';
import { useAuth } from '@/context/auth-context';

export default function RegionalPeta() {
  const { user } = useAuth();
  return (
    <MapPage
      basePath="/regional"
      title={`Peta Sebaran ${user?.regional ?? 'Wilayah Anda'}`}
    />
  );
}
