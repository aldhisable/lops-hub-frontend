import type { AuthUser } from './api';

export function homeForRole(role?: string): string {
  return role === 'ADMIN_PUSAT' ? '/dashboard' : role === 'ADMIN_REGIONAL' ? '/regional' : role === 'UMKM' ? '/workspace' : '/login';
}

export function hasRoleAccess(user: AuthUser | null, role: AuthUser['role'], superOnly = false): boolean {
  return Boolean(user && user.isActive && !user.passwordSetupRequired && user.role === role
    && (!superOnly || (user.role === 'ADMIN_PUSAT' && user.isSuperAdmin)));
}
