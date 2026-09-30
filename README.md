# 💌 Undangan Digital Pernikahan - Paper Art Edition

Aplikasi Web Undangan Pernikahan Digital modern bergaya **Paper Art (Seni Kertas)** dengan tipografi **Handwriting Calligraphy**, dibangun menggunakan **Next.js 16 (App Router)**, **TypeScript**, dan **Tailwind CSS**.

---

## ✨ Fitur Utama

1. **Aestetika Paper Art & Craft**:
   - Efek potongan kertas berlapis (*layered paper cutouts*) dengan bayangan bertingkat (*multi-layer drop shadows*).
   - Tekstur serat kertas alami (*paper grain texture*), aksen pita washi (*washi tape*), pembatas kertas sobek (*torn deckle edge*), dan stempel pos klasik.
   - Ornamen dedaunan botani bergaya siluet seni kertas (*botanical cutouts*).

2. **Tipografi Handwriting & Kaligrafi**:
   - Google Fonts: **Great Vibes** (calligraphy handwriting) untuk nama mempelai & tanda tangan.
   - **Caveat** untuk aksen tulisan tangan polaroid & catatan scrapbook.
   - **Playfair Display** untuk judul dan ayat suci bernuansa editorial elegan.
   - **Plus Jakarta Sans** untuk kenyamanan membaca detail acara dan formulir.

3. **Placeholder Foto Artistik**:
   - Frame polaroid kertas kerajinan tangan lengkap dengan aksen selotip washi tape dan sudut kemiringan alami.
   - Siluet ilustratif seni kertas untuk Pria (*The Groom*), Wanita (*The Bride*), Pasangan (*Our Moments*), Cincin (*The Rings*), dan Lanskap Alam.
   - Mudah diganti dengan foto asli kapan saja.

4. **Cover Amplop Interaktif dengan Segel Lilin (Wax Seal)**:
   - Personalisasi nama tamu secara otomatis melalui URL query:
     ```text
     https://domain-anda.com/?to=Bapak+Budi+Santoso
     https://domain-anda.com/?u=Keluarga+Besar+Hendra
     ```
   - Tombol segel lilin 3D (*Wax Seal*) dengan pita gantung merah bata.
   - Efek ledakan konfeti (*paper confetti burst*) dan animasi membuka amplop.

5. **Audio Player Akustik Romantis**:
   - Menggunakan Web Audio API synthesizer dengan arpeggio gitar akustik romantis yang menenangkan tanpa ketergantungan file eksternal (anti error 404).
   - Tombol kontrol mengambang (*floating toggle*) untuk memutar atau membisukan musik.

6. **Rangkaian Acara Lengkap**:
   - Kartu tiket paper art untuk **Akad Nikah** dan **Resepsi Pernikahan**.
   - Tombol integrasi langsung ke **Google Maps** (*Petunjuk Arah*) & tautan **Live Streaming**.
   - Tombol simpan ke **Google Calendar** dan download kalender **iCal (.ics)**.
   - Hitung mundur hari bahagia (*Live Countdown Timer*) dalam blok kartu kertas.

7. **Kilas Jejak Kisah Cinta (Scrapbook Love Story)**:
   - Garis waktu perjalanan cinta mulai dari pertemuan pertama, komitmen, lamaran, hingga pernikahan.

8. **Galeri Foto Scrapbook & Lightbox**:
   - Tata letak grid polaroid dengan sudut kemiringan acak dan selotip washi.
   - Modal tampilan pembesar (*lightbox*) saat foto diklik.

9. **Amplop Digital & Kado Fisik**:
   - Kartu nomor rekening bank (BCA, Mandiri) dengan tombol **Salin Nomor Rekening** sekali klik (disertai feedback visual).
   - Alamat pengiriman kado fisik dengan tombol **Salin Alamat Lengkap**.

10. **Buku Tamu & RSVP Interaktif**:
    - Formulir konfirmasi kehadiran (Hadir, Tidak Hadir, Masih Ragu), jumlah tamu, dan pesan doa restu.
    - Ucapan langsung tersimpan dan muncul di daftar doa secara instan (tersimpan di *localStorage*).

11. **Panduan Busana (*Dresscode*)**:
    - Palet warna hangat bertema *Earthy Paper* (Terracotta, Warm Cream, Kraft Sand, Soft Sage, Espresso).

12. **Navigasi Mengambang (*Floating Dock*)**:
    - Menu navigasi cepat di bagian bawah layar untuk beralih antar seksi dengan mulus.

---

## 🚀 Cara Menjalankan Proyek

### 1. Instalasi Dependensi (jika belum)
```bash
npm install
```

### 2. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

Untuk menguji nama tamu khusus:
[http://localhost:3000/?to=Bapak+Joko+Wirowo](http://localhost:3000/?to=Bapak+Joko+Wirowo)

### 3. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 📁 Struktur Data & Kustomisasi

Semua data teks, nama mempelai, tanggal acara, rekening bank, dan daftar cerita tersimpan rapi dalam satu file konfigurasi di:

📄 **`src/data/weddingData.ts`**

Contoh kustomisasi:
- Ubah nama mempelai di bagian `couple.groom` dan `couple.bride`.
- Ubah tanggal acara dan lokasi di bagian `events`.
- Ubah rekening bank di bagian `gifts.accounts`.
- Ganti placeholder foto dengan URL foto asli dengan menambahkan `next/image` ke `PhotoPlaceholder`.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide Icons
- **Effects**: Canvas Confetti & Web Audio API
- **Fonts**: Great Vibes, Caveat, Playfair Display, Plus Jakarta Sans
