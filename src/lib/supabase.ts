import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase Auth dipakai HANYA sebagai gerbang verifikasi OTP email saat register UMKM.
// Bukan untuk sesi login aplikasi (itu tetap pakai JWT backend), jadi sesi tidak dipersist.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const timeout = AbortSignal.timeout(15000);
          return fetch(input, {
            ...init,
            signal: init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout,
          });
        },
      },
    })
  : null;
