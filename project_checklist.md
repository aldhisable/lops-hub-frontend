# LOPs Hub — Frontend Development Checklist

**Terakhir diperbarui:** 22 Agustus 2026
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · TailwindCSS v4 · Recharts · Leaflet · Framer Motion

> Spesifikasi produk: [`../PRD.md`](../PRD.md) · Status QA: [`../REVIEW_CHECKLIST.md`](../REVIEW_CHECKLIST.md)

---

## Phase 1–9 — Fondasi sampai integrasi backend ✅

- [x] Setup Next.js + Tailwind, design token, layout inti (Public, Internal, Auth)
- [x] Komponen dasar: GlassCard, GlowButton, KPICard, AnalyticsChart, RadarChart, DataTable, FilterChips, Timeline, LeafletMap, WilayahSelect
- [x] Halaman publik, Login, Register (dengan OTP email lewat Supabase)
- [x] Tiga dashboard peran: Admin Pusat, Admin Regional, Workspace UMKM
- [x] Lapisan API (`src/lib/api.ts`) + `auth-context` dengan interceptor token & 401
- [x] Peta Leaflet + OpenStreetMap + choropleth GeoJSON provinsi (menggantikan Google Maps)
- [x] Responsif mobile, animasi, panduan visual

## Phase 10 — Deployment ✅

- [x] Deploy ke Vercel, `NEXT_PUBLIC_API_URL` diarahkan ke backend produksi
- [x] Dropdown wilayah lewat proxy backend (menghindari ketergantungan langsung ke API eksternal)

## Phase 11 — Audit gap & perbaikan (Tahap 1–8) ✅

Rujukan lengkap: https://claude.ai/code/artifact/6fcab825-d020-4909-b092-b0e3d16fb67a

- [x] **Tahap 1** — klien tidak lagi mengirim `role` saat registrasi
- [x] **Tahap 2** — halaman Ekspor untuk admin & workspace dirilis
- [x] **Tahap 3** — wrapper klien untuk input assessment 5S oleh admin
- [x] **Tahap 5** — 8 halaman Admin Regional memakai data nyata; komponen dipakai bersama dengan Admin Pusat lewat prop `basePath`; menu tanpa backend dihapus
- [x] **Tahap 6** — pencarian global TopBar berfungsi; paginasi tiruan `DataTable` dihapus; Laporan & Pengaturan Admin Pusat dibangun; tombol Export dihidupkan
- [x] **Tahap 7** — kode mati dibersihkan (`src/App.tsx`, `dist/`), `tsconfig.tsbuildinfo` tidak lagi di-track

## Halaman

| Peran | Halaman | Data |
|---|---|---|
| Publik | Beranda · Login · Register | API |
| Admin Pusat | Dashboard · UMKM (+pending/graduated/archived/tambah/detail) · Program · Ekspor · Klasifikasi · Analytics · Peta · Laporan · Pengaturan | API |
| Admin Regional | Dashboard · UMKM (+detail) · Program · Klasifikasi · Peta · Analytics · Laporan · Pengaturan | API |
| Workspace UMKM | Dashboard · Profil · Produk (+tambah/edit) · Program · Dokumen · Omzet · Ekspor · Analytics · Laporan · Pengaturan | API |

**Tidak ada halaman yang memakai data contoh.** Menu tanpa backend (Target & KPI, Pengguna, Media & Galeri) dihapus, bukan ditampilkan sebagai mockup.

## Sisa pekerjaan

- [ ] UI admin untuk mengisi indikator 5S atas nama UMKM (lapisan API sudah ada)
- [ ] Halaman Klasifikasi: ganti kriteria yang ditampilkan agar sesuai parameter 5S
- [ ] Sparkline kartu KPI dashboard: pakai data nyata, bukan angka hardcoded
- [ ] Hapus blok "Demo Akun" di halaman login (memajang kredensial admin ke publik)
- [ ] Ekspor laporan format PDF & infografis
- [ ] Cek ulang responsivitas layar kecil setelah perombakan Tahap 5–6
