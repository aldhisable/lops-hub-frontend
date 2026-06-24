"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthUser } from '@/lib/api';

interface RegisterInput {
  name: string;
  umkmName: string;
  category: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ redirectTo: string }>;
  register: (data: RegisterInput) => Promise<{ redirectTo: string }>;
  updateUser: (partial: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);

    // Role-based redirect
    const redirectTo =
      data.user.role === 'ADMIN_PUSAT' ? '/dashboard' :
      data.user.role === 'ADMIN_REGIONAL' ? '/regional' :
      '/workspace';

    return { redirectTo };
  };

  const register = async (input: RegisterInput) => {
    const { data } = await authApi.register({
      name: input.name,
      email: input.email,
      password: input.password,
      role: 'UMKM',
      umkmName: input.umkmName,
      category: input.category,
    });
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);

    // Pendaftaran mandiri selalu sebagai UMKM → langsung ke workspace
    return { redirectTo: '/workspace' };
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem('auth_user', JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
