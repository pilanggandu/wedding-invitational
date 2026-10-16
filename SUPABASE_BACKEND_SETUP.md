# Panduan Setup & Integrasi Database Supabase

Dokumen ini memandu langkah-langkah menghubungkan backend Express ke **Supabase Cloud Database**.

Saat ini, server backend Express (`http://localhost:5000`) telah aktif berjalan menggunakan **SQLite lokal** (`server/data/wedding.db`). Ketika konfigurasi Supabase dipasang, sistem akan otomatis beralih ke Supabase tanpa perlu mengubah kode frontend.

---

## 1. Langkah Pembuatan Proyek di Supabase

1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard) dan login ke akun Anda.
2. Klik tombol **New Project**.
3. Masukkan nama proyek (contoh: `wedding-gilang-salsa`), buat kata sandi database yang kuat, dan pilih region terdekat (misalnya: `Singapore`).
4. Tunggu beberapa saat hingga proses provisioning proyek selesai (status menjadi hijau/Active).

---

## 2. Mengambil Kredensial API Supabase

1. Pada dashboard Supabase proyek Anda, klik ikon **Settings** (roda gigi) di bagian bawah sidebar kiri.
2. Pilih menu **API** (atau **Data API**).
3. Salin 3 nilai penting berikut:
   - **Project URL** (format: `https://[project-id].supabase.co`)
   - **anon / public key** (kunci publik)
   - **service_role secret key** (kunci administratif privat)

---

## 3. Membuat File Konfigurasi `.env`

Buat file baru bernama `.env` di folder utama (root) proyek (`c:/My Files/Projects/GITHUB_WEDDING_GEMINI/.env`) dan isi dengan kredensial yang diperoleh:

```env
# Port Server Backend Express
PORT=5000

# Kredensial Supabase Anda
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Konfigurasi CORS dan URL Frontend
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 4. Menjalankan Skrip Database (SQL Schema)

1. Pada sidebar Supabase, buka menu **SQL Editor**.
2. Klik tombol **New query**.
3. Buka file [`server/schema.sql`](file:///c:/My%20Files/Projects/GITHUB_WEDDING_GEMINI/server/schema.sql) di editor Anda, salin seluruh kodenya, lalu tempelkan (*paste*) ke SQL Editor Supabase.
4. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
5. Tabel berikut akan otomatis dibuat beserta indeks dan kebijakan keamanan Row Level Security (RLS):
   - `public.weddings` : Menyimpan data mempelai, tanggal acara, tema warna, dan nomor rekening.
   - `public.guests` : Menyimpan daftar tamu undangan, slug tautan, nomor kontak, dan status pengiriman.
   - `public.wishes` : Menyimpan buku tamu, doa restu, dan kehadiran RSVP.

---

## 5. Menjalankan Ulang Server Backend

Setelah file `.env` terisi dan skema SQL dieksekusi, jalankan ulang server backend:

```bash
# Menghentikan proses lama (jika ada) lalu jalankan server:
npm run server:dev
```

Server backend akan mendeteksi kredensial Supabase dan menampilkan log berikut di terminal:

```
⚡ Supabase client initialized successfully with: https://[project-id].supabase.co
==================================================
🚀 Express Backend Server aktif di port 5000
👉 API Base URL: http://localhost:5000/api
🗄️ Database: ✅ Supabase Cloud Database
==================================================
```

---

## 6. Daftar Endpoint REST API yang Tersedia

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/health` | Cek status server dan database aktif (`supabase` atau `sqlite`) |
| `GET` | `/api/invitation` | Mengambil seluruh data undangan pernikahan |
| `PUT` | `/api/invitation` | Memperbarui data undangan dari Dashboard Admin |
| `GET` | `/api/guests` | Mengambil seluruh daftar tamu undangan |
| `POST` | `/api/guests` | Menambahkan tamu baru |
| `PATCH` | `/api/guests/:id` | Mengubah data tamu atau status kirim WhatsApp |
| `DELETE` | `/api/guests/:id` | Menghapus tamu |
| `GET` | `/api/wishes` | Mengambil ucapan buku tamu dan RSVP |
| `POST` | `/api/wishes` | Mengirim ucapan dan konfirmasi RSVP |
| `DELETE` | `/api/wishes/:id` | Menghapus ucapan (moderasi admin) |

---

## 7. Keamanan dan Fallback Otomatis

- **Dual-Driver Database**: Jika koneksi internet atau Supabase mengalami kendala sewaktu-waktu, server backend Express secara otomatis tetap melayani permintaan data melalui database SQLite lokal tanpa menyebabkan tampilan web error.
- **Client Fallback**: Frontend Next.js dilengkapi *graceful client fallback* menggunakan LocalStorage, memastikan tamu undangan tetap dapat membaca undangan secara lancar di setiap kondisi.
