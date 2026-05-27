# Pelindo UMKM Intelligence & Growth Platform
## Visual UI Guidelines & Standards

Dokumen ini berisi standar visual yang harus diikuti selama pengembangan antarmuka (UI) untuk menjaga konsistensi desain yang *Modern, Premium, dan Enterprise-ready*. Seluruh pengembangan komponen di Phase 2 dan seterusnya wajib mengacu pada panduan ini.

---

### 1. Konsep Utama (Design Direction)
*   **Tema:** Modern Glass Enterprise Dashboard.
*   **Karakteristik:** Bersih (clean), ruang lega (airy whitespace), elemen mengambang (floating elements), dan *soft glassmorphism*.
*   **Kesan:** Profesional, futuristik namun sangat mudah dibaca (high readability) untuk kebutuhan analitik.

---

### 2. Palet Warna (Color Palette)

#### Base & Backgrounds
*   **Main Background:** Sangat terang, biasanya `#F8FAFC` (slate-50) atau putih `#FFFFFF`.
*   **Ambient Glow:** Efek *blur* gradien di latar belakang menggunakan warna pastel transparan (Biru Laut, Ungu, dan Magenta halus) untuk menghilangkan kesan kaku.
*   **Card Background:** Putih solid `#FFFFFF` dengan opasitas (semi-transparan/glass) jika diletakkan di atas *ambient glow*.

#### Typography & Text
*   **Primary Text (Headings/Angka Utama):** Hitam kebiruan pekat, contoh: `#0F172A` (slate-900).
*   **Secondary Text (Label/Deskripsi):** Abu-abu sejuk yang terbaca, contoh: `#64748B` (slate-500).
*   **Muted Text (Placeholder):** `#94A3B8` (slate-400).

#### Accents & Brand Colors
*   **Primary Accent:** Biru Pelindo (Biru Elektrik/Royal Blue) -> Digunakan untuk tombol utama, teks aktif, dan grafik.
*   **Secondary Accent:** Ungu (Purple) -> Digunakan sebagai gradien pasangan biru.
*   **Success (Positive Growth):** Hijau Zamrud terang (`#10B981` atau green-500).
*   **Warning/Draft:** Oranye (`#F59E0B` atau amber-500).
*   **Danger/Decline:** Merah (`#EF4444` atau red-500).

---

### 3. Tipografi (Typography)

*   **Font Family:** *Plus Jakarta Sans* atau *Inter* (Sans-serif yang bersih dan modern).
*   **Hierarki:**
    *   **KPI Numbers:** Extra Besar, Font Weight: `Bold` (700) atau `Semibold` (600).
    *   **Card Titles / Headings:** Menengah, Font Weight: `Semibold` (600).
    *   **Labels / Table Text:** Reguler (13px - 14px), Font Weight: `Medium` (500) atau `Regular` (400).
*   **Aturan:** Hindari penggunaan terlalu banyak bobot font yang berbeda. Fokus pada kontras ukuran antara angka data (besar) dan labelnya (kecil).

---

### 4. Elemen Antarmuka (UI Components)

#### Cards (Kartu & Wadah)
*   **Border Radius (Sudut):** Melengkung lembut, gunakan `rounded-2xl` (16px) hingga `rounded-3xl` (24px).
*   **Border (Garis Tepi):** Sangat tipis dan halus. Gunakan `border border-slate-100/50` atau `border-white/20`.
*   **Shadow (Bayangan):** *Soft drop shadow* yang tersebar luas, bukan bayangan tajam. Gunakan *custom shadow* di Tailwind, contoh: `box-shadow: 0 10px 40px -10px rgba(0,0,0,0.04)`.
*   **Glass Effect:** Jika menggunakan latar transparan, gunakan `backdrop-blur-md` (blur secukupnya, jangan terlalu buram) dengan `bg-white/70` hingga `bg-white/90`.

#### Buttons (Tombol)
*   **Primary Button:** Latar belakang *gradient* halus (Biru ke Ungu) atau warna solid aksen dengan efek *glow* (shadow berwarna serumpun) saat *hover*. Sudut membulat `rounded-xl` atau `rounded-full`.
*   **Secondary Button:** *Ghost button* (tanpa latar belakang) atau latar belakang abu-abu sangat transparan dengan teks tebal.

#### Sidebar & Navigasi
*   **Active State:** Item menu yang sedang aktif menggunakan latar belakang biru muda transparan (`bg-blue-50`) atau *gradient text* dengan indikator visual (seperti garis vertikal di sebelah kiri).
*   **Icons:** Gunakan *Lucide Icons* dengan ukuran `18px - 20px`, *stroke-width* `2` atau `1.5` agar konsisten. Ikon dalam KPI card dibungkus dengan lingkaran berlatar belakang warna aksen yang sangat transparan (opacity 10-15%).

---

### 5. Visualisasi Data (Charts)

*   **Line Chart:**
    *   Garis harus melengkung mulus (*monotone/smooth*), **jangan** patah-patah bersudut tajam (*linear*).
    *   Gunakan titik akhir (*dot*) pada nilai terakhir.
    *   Tambahkan *gradient fill* transparan di bawah garis (memudar ke bawah).
*   **Sparklines (Mini Charts):** Digunakan di bagian bawah KPI card tanpa sumbu X/Y (axes disembunyikan), hanya menampilkan tren garis.
*   **Funnel Chart (Pipeline):** Gunakan blok dengan sudut agak membulat. Warnai tiap lapisan dengan gradasi yang berkesinambungan (misal: Biru -> Ungu -> Oranye/Kuning).
*   **Donut Chart:** *Stroke* tebal dengan ruang kosong (*inner radius*) yang cukup besar di tengah untuk menempatkan teks total nilai.
*   **Tooltip:** *Hover tooltip* pada grafik harus berupa *glass card* kecil, menampilkan nilai dengan jelas.

---

### 6. Tata Letak (Layout) & Spacing

*   **Whitespace:** Berikan ruang bernapas yang lega (*padding/margin* besar) antar elemen. Jangan menumpuk informasi terlalu padat.
*   **Grid:** Gunakan sistem Grid standard Tailwind (`grid-cols-4`, `grid-cols-12`) untuk menyelaraskan *cards* KPI dan *charts*.
*   **Map (Peta):** Peta Indonesia menjadi titik fokus sentral (*centerpiece*). Harus terlihat bercahaya lembut (*glowing pins*) dan menyatu dengan tema warna.

---

### Ringkasan Eksekusi (Developer Notes)
Saat merakit komponen (Tailwind):
- Gunakan utilitas shadow khusus: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`
- Gunakan radius besar: `rounded-2xl` atau `rounded-[20px]`
- Gunakan teks warna redup untuk konteks: `text-slate-500`
- Gunakan blur proporsional: `backdrop-blur-xl bg-white/80`
