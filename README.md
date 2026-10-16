# 💌 Wedding Invitational - Full-Stack Platform

Aplikasi Web Undangan Pernikahan Digital modern multi-template dengan backend Express.js dan frontend Next.js 16 (App Router + Turbopack).

---

## 📁 Struktur Monorepo

Repository ini terbagi secara rapi menjadi 2 bagian utama: **Frontend** dan **Backend**:

```text
wedding-invitational/
├── frontend/                     # 🌐 Aplikasi Web Client & Admin Dashboard
│   ├── public/                   # Asset gambar, stiker, texture & audio
│   ├── src/
│   │   ├── app/                  # Next.js App Router (/admin, /undangan, dll.)
│   │   ├── components/           # Reusable UI components & Dock navigation
│   │   ├── context/              # AuthContext & WeddingDataContext
│   │   ├── data/                 # Default wedding data & template definitions
│   │   ├── lib/                  # API client & local storage sync
│   │   ├── templates/            # 6 dynamic templates (Paper Art, Cityscape, Blur, dll.)
│   │   └── types/                # TypeScript type definitions
│   ├── .env.example              # Contoh variabel lingkungan frontend
│   ├── next.config.ts            # Konfigurasi Next.js & API proxy rewrite
│   ├── tsconfig.json             # TypeScript config untuk Next.js
│   └── package.json              # Dependensi frontend
│
├── backend/                      # ⚙️ REST API Server & Database
│   ├── src/
│   │   ├── database/             # Skema SQL & migration services
│   │   ├── routes/               # API routes (invitation, guests, wishes, rsvps, auth)
│   │   ├── services/             # Normalized business logic services
│   │   ├── auth.ts               # Autentikasi JWT / password hashing
│   │   ├── postgres.ts           # PostgreSQL connection driver
│   │   ├── sqlite.ts             # SQLite zero-config local engine
│   │   ├── supabase.ts           # Supabase cloud connector
│   │   └── index.ts              # Express app entrypoint
│   ├── data/                     # Folder penyimpanan SQLite database (git-ignored)
│   ├── .env.example              # Contoh variabel lingkungan backend
│   ├── tsconfig.json             # TypeScript config untuk Node.js
│   └── package.json              # Dependensi backend
│
├── package.json                  # 📦 Root orchestrator (npm workspaces)
├── .gitignore                    # Gitignore menyeluruh untuk monorepo
├── SUPABASE_BACKEND_SETUP.md     # Panduan setup Supabase cloud database
└── README.md
```

---

## 🚀 Cara Menjalankan

### 1. Instalasi Dependensi
Cukup jalankan sekali di root folder:
```bash
npm install
```
*npm workspaces akan secara otomatis menginstal dependensi untuk root, frontend, dan backend.*

### 2. Menjalankan Server Pengembangan

#### Opsi A: Jalankan Frontend & Backend Sekaligus (Direkomendasikan)
```bash
npm run dev
```
- Frontend berjalan di: [http://localhost:3000](http://localhost:3000)
- Backend API berjalan di: [http://localhost:5000/api](http://localhost:5000/api)

#### Opsi B: Jalankan Secara Terpisah
- **Frontend saja**:
  ```bash
  npm run dev:frontend
  # atau
  cd frontend && npm run dev
  ```
- **Backend saja**:
  ```bash
  npm run dev:backend
  # atau
  cd backend && npm run dev
  ```

### 3. Build & Produksi
- **Build Frontend**:
  ```bash
  npm run build
  ```
- **Start Frontend Production**:
  ```bash
  npm run start
  ```
- **Start Backend Production**:
  ```bash
  npm run start:backend
  ```

---

## ✨ Fitur & Template

1. **6 Template Desain Eksklusif**:
   - **Paper Art / Scrapbook**: Efek potongan kertas, tekstur serat alami, washi tape, dan kaligrafi romantis.
   - **Cityscape Urban Romance**: Ilustrasi vektor perkotaan modern, siluet gedung, dan gradasi senja.
   - **Ambient Blur**: Latar belakang blur dinamis dengan ekstraksi warna otomatis dari foto mempelai.
   - **Cinematic Blur**: Nuansa dramatis ala film bioskop.
   - **Painted Cats**: Gaya artistik cat air dengan ilustrasi kucing yang menggemaskan.
   - **Royal Heritage**: Ornamen kemewahan tradisional kerajaan dengan partikel emas.

2. **Interactive Envelope & Wax Seal**:
   - Sampul amplop digital dengan segel lilin 3D, animasi buka amplop, dan efek taburan konfeti.
   - Personalisasi nama tamu otomatis via URL: `/?to=Nama+Tamu`.

3. **Admin Suite Lengkap**:
   - Live preview interaktif tampilan desktop & mobile.
   - Manajemen daftar tamu, status pengiriman, dan pembuatan link undangan instan.
   - Manajemen RSVP kehadiran & buku tamu (wishes).
   - Pengaturan tema warna, font, dan kustomisasi konten mempelai.

4. **Dukungan Multi-Database**:
   - **SQLite**: Langsung aktif secara lokal tanpa perlu instalasi database server (`backend/data/wedding.db`).
   - **PostgreSQL / Supabase**: Dapat diaktifkan dengan mengisi variabel lingkungan di `.env`.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.3 (Turbopack), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons, Canvas Confetti.
- **Backend**: Express.js, TypeScript (tsx), SQLite, PostgreSQL, Supabase JS, CORS, Dotenv.
- **Tools**: npm workspaces, Concurrently.
