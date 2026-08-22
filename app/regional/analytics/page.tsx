"use client";

import { AnalyticsPage } from '@/features/dashboard/analytics-page';
import { useAuth } from '@/context/auth-context';

export default function RegionalAnalytics() {
  const { user } = useAuth();
  return <AnalyticsPage title={`Analytics ${user?.regional ?? 'Wilayah Anda'}`} />;
}
