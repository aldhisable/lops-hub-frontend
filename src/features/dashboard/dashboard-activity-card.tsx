"use client";

import { useEffect, useState } from 'react';
import { Users, FileText, Package, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { analyticsApi, type RecentActivity } from '@/lib/api';

const TYPE_META: Record<
  RecentActivity['type'],
  { icon: typeof Users; bg: string; color: string }
> = {
  UMKM_NEW: { icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
  UMKM_UPDATE: { icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
  PRODUCT_NEW: { icon: Package, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  SALES_UPDATE: { icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600' },
};

function phrase(a: RecentActivity): string {
  switch (a.type) {
    case 'UMKM_NEW':
      return `UMKM "${a.umkmName}" baru terdaftar`;
    case 'UMKM_UPDATE':
      return `UMKM "${a.umkmName}" memperbarui data profil`;
    case 'PRODUCT_NEW':
      return `UMKM "${a.umkmName}" ${a.detail.charAt(0).toLowerCase()}${a.detail.slice(1)}`;
    case 'SALES_UPDATE':
      return `UMKM "${a.umkmName}" memperbarui data penjualan`;
    default:
      return `UMKM "${a.umkmName}"`;
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} hari lalu`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} bulan lalu`;
  return `${Math.floor(mo / 12)} tahun lalu`;
}

function location(a: RecentActivity): string | null {
  const parts = [a.city, a.province].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

export function DashboardActivityCard() {
  const [items, setItems] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .recentActivity(6)
      .then(({ data }) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <GlassCard className="p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-slate-900">Aktivitas Terbaru</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Memuat aktivitas...</div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Belum ada aktivitas terbaru</div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((a) => {
            const meta = TYPE_META[a.type] ?? TYPE_META.UMKM_UPDATE;
            const Icon = meta.icon;
            const loc = location(a);
            return (
              <div key={a.id} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${meta.bg} flex items-center justify-center ${meta.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{phrase(a)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {loc ? `${loc} • ` : ''}
                    {timeAgo(a.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
