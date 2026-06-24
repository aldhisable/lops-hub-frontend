"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { umkmApi } from '@/lib/api';

export interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  stock?: number | null;
  isActive: boolean;
}

export interface ProgramParticipation {
  id: string;
  status: string;
  joinedAt: string;
  program: {
    id: string;
    name: string;
    description?: string | null;
    startDate: string;
    endDate: string;
    status: string;
  };
}

export interface WorkspaceUMKM {
  id: string;
  name: string;
  category: string;
  establishedYear?: number | null;
  city?: string | null;
  province?: string | null;
  district?: string | null;
  village?: string | null;
  address?: string | null;
  phone?: string | null;
  instagram?: string | null;
  website?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  classification: string;
  status: string;
  products: ProductData[];
  participations: ProgramParticipation[];
}

interface WorkspaceContextValue {
  umkm: WorkspaceUMKM | null;
  loading: boolean;
  refetch: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [umkm, setUmkm] = useState<WorkspaceUMKM | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUMKM = () => {
    setLoading(true);
    umkmApi.me()
      .then(res => setUmkm(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUMKM(); }, []);

  return (
    <WorkspaceContext.Provider value={{ umkm, loading, refetch: fetchUMKM }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}
