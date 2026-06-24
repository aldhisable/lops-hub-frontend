"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { InternalLayout } from '@/components/layout/internal-layout';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TopBar } from '@/components/layout/top-bar';
import { umkmBrandConfig, umkmMainNavItems, umkmSupportNavItems } from '@/config/workspace-sidebar-config';
import { useAuth } from '@/context/auth-context';
import { WorkspaceProvider, useWorkspace } from '@/context/workspace-context';

const PROFIL_HREF = '/workspace/profil';

function PendingBanner() {
  return (
    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
      <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-800">Akun menunggu verifikasi admin</p>
        <p className="text-sm text-amber-700 mt-0.5">
          Lengkapi profil usaha Anda di bawah ini selengkap mungkin. Setelah diverifikasi admin,
          seluruh fitur workspace akan terbuka.
        </p>
      </div>
    </div>
  );
}

function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { umkm, loading } = useWorkspace();

  const isPending = !loading && umkm?.status === 'PENDING';

  // UMKM yang masih PENDING hanya boleh mengisi profil — paksa kembali ke halaman profil
  useEffect(() => {
    if (isPending && pathname !== PROFIL_HREF) {
      router.replace(PROFIL_HREF);
    }
  }, [isPending, pathname, router]);

  const sidebar = (
    <SidebarNav
      brand={umkmBrandConfig}
      items={umkmMainNavItems}
      supportItems={umkmSupportNavItems}
      activePath={pathname}
      lockExceptHref={isPending ? PROFIL_HREF : undefined}
    />
  );

  return (
    <InternalLayout sidebar={sidebar} topbar={<TopBar userName={user?.name ?? 'UMKM'} userRole="UMK Binaan" />}>
      {isPending && <PendingBanner />}
      {isPending && pathname !== PROFIL_HREF ? null : children}
    </InternalLayout>
  );
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <WorkspaceShell>{children}</WorkspaceShell>
    </WorkspaceProvider>
  );
}
