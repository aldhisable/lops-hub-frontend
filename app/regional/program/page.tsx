"use client";

import { ProgramPage } from '@/features/dashboard/program-page';
import { useAuth } from '@/context/auth-context';

// Program bersifat nasional, tetapi daftar pesertanya disaring backend sehingga
// admin regional hanya melihat peserta dari wilayahnya sendiri.
export default function RegionalProgram() {
  const { user } = useAuth();
  return <ProgramPage title={`Program — Peserta ${user?.regional ?? 'Wilayah Anda'}`} />;
}
