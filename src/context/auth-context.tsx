"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { authApi, AuthUser } from '@/lib/api';
import { homeForRole } from '@/lib/role-access';

interface RegisterInput {
  name: string;
  umkmName: string;
  category: string;
  email: string;
  password: string;
  // Bukti verifikasi email dari Supabase, diperiksa ulang oleh backend.
  otpToken: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  sessionError: string;
  refreshSession: (background?: boolean) => Promise<void>;
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
  const [sessionError, setSessionError] = useState('');
  const requestId = useRef(0);

  const refreshSession = useCallback(async (background = false) => {
    const currentRequest = ++requestId.current;
    const storedToken = localStorage.getItem('auth_token');
    if (!background) { setIsLoading(true); setUser(null); }
    setSessionError('');
    setToken(storedToken);
    if (!storedToken) { setUser(null); setIsLoading(false); return; }
    try {
      const { data } = await authApi.me();
      if (currentRequest !== requestId.current || localStorage.getItem('auth_token') !== storedToken) return;
      setUser(data);
      localStorage.setItem('auth_user', JSON.stringify(data));
    } catch {
      if (currentRequest === requestId.current) setSessionError('Identitas akun belum dapat diperiksa. Coba kembali.');
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const sessionRequests = requestId;
    let active = true;
    void Promise.resolve().then(() => { if (active) return refreshSession(); });
    const onFocus = () => { if (localStorage.getItem('auth_token')) void refreshSession(true); };
    const onStorage = (event: StorageEvent) => { if (event.key === 'auth_token' || event.key === null) void refreshSession(); };
    const onToken = (event: Event) => { requestId.current++; setToken((event as CustomEvent<string>).detail); };
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-session-token', onToken);
    return () => {
      active = false;
      sessionRequests.current++;
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-session-token', onToken);
    };
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    requestId.current++;
    setIsLoading(false); setSessionError('');
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);

    // Role-based redirect
    const redirectTo = homeForRole(data.user.role);

    return { redirectTo };
  };

  const register = async (input: RegisterInput) => {
    const { data } = await authApi.register({
      name: input.name,
      email: input.email,
      password: input.password,
      umkmName: input.umkmName,
      category: input.category,
      otpToken: input.otpToken,
    });
    requestId.current++;
    setIsLoading(false); setSessionError('');
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
    requestId.current++;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, sessionError, refreshSession, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
