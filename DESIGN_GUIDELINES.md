# 🎨 Pelindo UMKM - Design Guidelines

## 1. Typography

### Statistik & Angka Numerik
- **Semua angka statistik di dashboard WAJIB menggunakan `font-black` (weight 900)** — ini adalah level paling tebal.
- **Ukuran minimum untuk angka KPI utama: `text-4xl` (36px)**. Untuk KPI sekunder: `text-3xl` (30px).
- Tambahkan `tracking-tight` agar angka terlihat padat dan profesional.
- Gunakan warna `text-slate-900` (gelap) agar kontras tinggi.

```html
<!-- ✅ Benar: Angka KPI utama -->
<span class="text-4xl font-black text-slate-900 tracking-tight">1.284</span>

<!-- ✅ Benar: Angka KPI sekunder (dalam card kecil) -->
<span class="text-3xl font-extrabold text-slate-900 tracking-tight">382</span>

<!-- ❌ Salah: terlalu tipis -->
<span class="text-xl font-medium text-slate-700">1.284</span>
```

### Headline & Judul Halaman
- **Judul halaman utama WAJIB `text-3xl font-black`** (bukan font-bold biasa).
- Subtitle halaman: `text-base font-medium text-slate-500`.

```html
<!-- ✅ Benar -->
<h1 class="text-3xl font-black text-slate-900">Dashboard Nasional</h1>

<!-- ❌ Salah -->
<h1 class="text-2xl font-bold text-slate-900">Dashboard Nasional</h1>
```

### Hirarki Teks Lengkap
| Elemen | Font Size | Font Weight | Warna | Tailwind |
|---|---|---|---|---|
| **Headline halaman** | 30px | **900 (black)** | `slate-900` | `text-3xl font-black` |
| **KPI Value utama** | 36px | **900 (black)** | `slate-900` | `text-4xl font-black tracking-tight` |
| **KPI Value sekunder** | 30px | **800 (extrabold)** | `slate-900` | `text-3xl font-extrabold tracking-tight` |
| **Conversion / % besar** | 24px | **800 (extrabold)** | varies | `text-2xl font-extrabold` |
| Section Title | 18px | 600 (semibold) | `slate-900` | `text-lg font-semibold` |
| Card Title | 14-16px | 600 (semibold) | `slate-900` | `text-sm/base font-semibold` |
| Label / Subtitle | 14px | 500 (medium) | `slate-500` | `text-sm font-medium` |
| Trend Indicator | 12px | 600 (semibold) | emerald/red | `text-xs font-semibold` |
| Angka di legend/list | 14px | **700 (bold)** | `slate-900` | `text-sm font-bold` |

## 2. Color Palette
- **Primary**: Blue (`#3b82f6` / `blue-500`)
- **Accent**: Purple (`#8b5cf6` / `violet-500`)
- **Success**: Emerald (`#10b981`)
- **Warning**: Amber (`#f59e0b`)
- **Danger**: Red (`#ef4444`)
- **Neutral**: Slate scale (`slate-50` → `slate-900`)

## 3. Component Rules
- **GlassCard**: `rounded-2xl`, `border border-white/60`, backdrop blur
- **Buttons**: `rounded-lg` atau `rounded-xl`, padding `px-4 py-2` minimum
- **Badge/Chip**: `rounded-full`, `text-xs font-semibold`, background sesuai status

## 4. Spacing
- Jarak antar section: `gap-6` atau `gap-8`
- Padding card: `p-6` minimum
- Margin bottom header: `mb-8`
