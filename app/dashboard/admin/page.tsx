import { RoleGuard } from '@/components/layout/role-guard';
import { AdminUsersPage } from '@/features/dashboard/admin-users-page';

export default function Page() {
  return <RoleGuard role="ADMIN_PUSAT" superOnly><AdminUsersPage /></RoleGuard>;
}
