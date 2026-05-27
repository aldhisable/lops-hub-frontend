# Pelindo UMKM Intelligence & Growth Platform - Development Checklist

## Phase 1: Foundation (✅ Selesai)
- [x] Setup Next.js 16 project + TailwindCSS v4 + shadcn/ui
- [x] Design system tokens (colors, typography, spacing)
- [x] Core layout components (PublicLayout, InternalLayout, AuthLayout)
- [x] SidebarNav + TopBar + Breadcrumb
- [x] GlassCard + GlowButton base components

## Phase 2: Core Components Build (✅ Selesai)
- [x] Install dependencies (Framer Motion, Recharts, @vis.gl/react-google-maps, Axios)
- [x] Komponen **KPI Card** (gradient + sparkline)
- [x] Komponen **Analytics Chart** base (Recharts area chart)
- [x] Komponen **Radar Chart** (5S Classification)
- [x] Komponen **Data Table** dengan pagination
- [x] Komponen **Filter Chips** & Search Bar
- [x] Komponen **Timeline** (history program)

## Phase 3: Public & Auth Pages (✅ Selesai)
- [x] **Public Homepage** (Navbar, Hero, Pipeline, Analytics, Map Preview, Showcase, Footer)
- [x] **Login Page** — terhubung ke backend API + role-based redirect

## Phase 4: Internal Dashboard & Directory — Admin Pusat (✅ Selesai)
- [x] **Main Dashboard** (`/dashboard`) — KPI Cards, Funnel, Analytics, Recent Activity
- [x] **UMKM Directory** (`/dashboard/umkm`) — Search, Filter, Data Table
- [x] **Tambah UMKM** (`/dashboard/umkm/tambah`) — Form registrasi
- [x] **Halaman UMKM lainnya** (Pending, Graduated, Archived)
- [x] Sidebar Admin Pusat dengan nested menu
- [x] TopBar — tampilkan user real dari JWT + dropdown logout

## Phase 5: UMKM Profile Workspace (✅ Selesai)
- [x] **Profile Layout** (Header, UMKM Info, Score/Status)
- [x] **Tabs Navigation** (Overview, Products, Programs, Documents, Growth, Timeline)
- [x] **Overview Tab** (Info Usaha, Radar Chart 5S, Ringkasan Bisnis)
- [x] **Products Tab** (Galeri Produk, Grid Cards)
- [x] **Program History Tab** (Timeline program)
- [x] **Growth Analytics Tab** (Tren Omzet, Target vs Aktual)

## Phase 6: Advanced Analytics & Maps (✅ Selesai)
- [x] **Peta Sebaran** — Leaflet.js + OpenStreetMap (gratis, tanpa API key) + choropleth GeoJSON provinsi Indonesia
- [x] **Analytics Page** — KPI, Chart, Comparison
- [x] **Laporan / Report Page** — Generator UI, Export Options
- [x] **Program Page** — Manajemen program pembinaan
- [x] **Klasifikasi Page** — Distribusi Gold/Silver/Bronze/Platinum
- [x] **Media & Galeri Page**
- [x] **Target & KPI Page**

## Phase 7: Polish & Responsiveness (✅ Selesai)
- [x] Mobile Responsiveness (Topbar mobile toggle, layout stacked)
- [x] Motion & Animation (hover glow, chart animation)
- [x] Visual Guidelines file (`visual_guidelines.md`)

## Phase 8: 3 Dashboard Role (✅ Selesai)
- [x] **Dashboard Admin Pusat** (`/dashboard/*`) — full akses nasional
- [x] **Dashboard Admin Regional** (`/regional/*`) — filter per regional
- [x] **Workspace UMKM** (`/workspace/*`) — profil & data usaha individu

## Phase 9: Backend & Integration (✅ Selesai — lihat backend_checklist.md)
- [x] Backend API (Express + TypeScript + Prisma + SQLite)
- [x] Auth JWT + role-based middleware
- [x] Core APIs (UMKM, Products, Programs)
- [x] Analytics APIs (Dashboard, Regional, Workspace)
- [x] Seed data (3 akun demo)
- [x] Frontend API layer (`src/lib/api.ts` + `auth-context.tsx`)
- [x] Dashboard page — KPI & revenue trend dari API real
- [x] UMKM Directory page — fetch & pagination dari API real
- [x] Analytics page — stats & classification dari API real
- [x] UMKM Profile page — identitas, produk, program, keuangan dari API real
- [x] TypeScript clean build (0 errors) — hapus dead code `antigravity-foundation.tsx`

## Phase 10: Deployment (⏳ Menunggu)
- [ ] Setup PostgreSQL production (Neon.tech — daftar di https://neon.tech)
- [ ] Update `DATABASE_URL` backend ke Neon connection string
- [ ] Deploy backend ke Railway / Render
- [x] ~~Google Maps~~ → diganti Leaflet.js + OpenStreetMap (gratis, tanpa API key)
- [ ] Deploy frontend ke Vercel
