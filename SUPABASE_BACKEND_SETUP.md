# 🚀 Panduan Integrasi Backend Express & Database Supabase

Arsitektur backend dengan **Express.js** dan database **Supabase** telah disiapkan secara lengkap untuk proyek Undangan Digital Gilang & Salsadila.

---

## 📁 Struktur File Backend yang Disiapkan

```
├── server/
│   ├── index.ts              # Entry point server Express (port 5000)
│   ├── supabase.ts           # Inisialisasi Supabase Client & fallback handler
│   ├── schema.sql            # Script SQL DDL tabel Supabase (Weddings, Guests, Wishes)
│   └── routes/
│       ├── invitation.ts     # Endpoint data undangan (GET, PUT)
│       ├── guests.ts         # Endpoint daftar tamu & RSVP tracking (GET, POST, PATCH, DELETE)
│       └── wishes.ts         # Endpoint buku tamu & doa restu (GET, POST, DELETE)
├── .env.example              # Template variabel lingkungan
└── src/lib/api.ts            # Client fetch frontend dengan auto-fallback toleran
```

---

## 🔑 1. Konfigurasi Kredensial Supabase (`.env`)

Ketika Anda sudah memiliki URL & API Key dari Supabase, buat file `.env` di direktori utama proyek (atau isi sesuai config):

```env
# Port Server Backend
PORT=5000

# Kredensial Supabase Anda
SUPABASE_URL=https://id-project-anda.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# URL Frontend untuk CORS
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🗄️ 2. Eksekusi Skrip Database di Supabase

1. Buka dashboard proyek Supabase Anda: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Masuk ke menu **SQL Editor** di sidebar kiri.
3. Klik tombol **New query**.
4. Buka dan salin seluruh isi file [`server/schema.sql`](file:///c:/My%20Files/Projects/GITHUB_WEDDING_GEMINI/server/schema.sql) lalu tempelkan (paste) ke SQL Editor.
5. Klik tombol **Run**.

Tabel berikut akan langsung terbuat secara otomatis:
- `weddings`: Data profil pengantin, jadwal acara Akad & Resepsi, tema warna, dan amplop hadiah.
- `guests`: Daftar tamu, nomor WhatsApp, kategori, status kirim undangan, dan catatan.
- `wishes`: Buku tamu, ucapan selamat, dan konfirmasi kehadiran RSVP.
- Kebijakan RLS (Row Level Security) yang aman untuk publik dan admin.

---

## ⚡ 3. Menjalankan Server Backend

Setelah dependensi terpasang (`npm install`), Anda dapat menjalankan server dengan perintah:

```bash
# Menjalankan server backend Express dengan hot-reload
npm run server:dev

# Atau menjalankan sekali jalan
npm run server
```

Server backend akan berjalan di **`http://localhost:5000`**.

---

## 🌐 4. Daftar REST API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Cek status server & koneksi Supabase |
| `GET` | `/api/invitation` | Mengambil seluruh data undangan pernikahan |
| `PUT` | `/api/invitation` | Menyimpan perubahan data undangan dari Dashboard Admin |
| `GET` | `/api/guests` | Mengambil daftar seluruh tamu undangan |
| `POST` | `/api/guests` | Menambahkan tamu undangan baru |
| `PATCH` | `/api/guests/:id` | Memperbarui data tamu atau status terkirim (`is_sent`) |
| `DELETE` | `/api/guests/:id` | Menghapus tamu dari daftar |
| `GET` | `/api/wishes` | Mengambil semua ucapan buku tamu & RSVP |
| `POST` | `/api/wishes` | Mengirimkan ucapan & konfirmasi kehadiran RSVP baru |
| `DELETE` | `/api/wishes/:id` | Menghapus ucapan (moderasi admin) |

---

## 💡 Fitur Graceful Fallback
Jika server Express atau Supabase belum berjalan atau sedang offline, frontend web Next.js (`/` dan `/admin`) akan secara otomatis beralih menggunakan *Client-side LocalStorage Store* tanpa menampilkan pesan crash kepada tamu undangan!
