# 📌 Panduan URL Akses Web Undangan Digital (Dimas & Sarah)

Dokumen ini berisi seluruh daftar tautan (URL) dan metode untuk membuka serta mengakses web undangan pernikahan ini, baik dari PC lokal, HP via Wi-Fi, maupun jarak jauh via internet tanpa VPN.

---

## 🌟 1. URL Publik Gratis Aktif (Bisa Dibuka Siapa Saja Tanpa VPN)
Link HTTPS resmi dari Cloudflare Tunnel yang saat ini **sedang aktif berjalan**:
- 👉 **[https://older-approaches-fog-shareware.trycloudflare.com](https://older-approaches-fog-shareware.trycloudflare.com)**
- Contoh dengan Nama Tamu: **[https://older-approaches-fog-shareware.trycloudflare.com/?to=Sahabat+Tercinta](https://older-approaches-fog-shareware.trycloudflare.com/?to=Sahabat+Tercinta)**

*(Bisa dibuka dari HP siapa saja menggunakan paket data seluler tanpa perlu install VPN atau sambung ke Wi-Fi).*

---

## 💻 2. Akses Langsung di Komputer Ini (Local PC)
Buka di browser laptop/PC pengembangan:
- **http://localhost:3000**
- **http://127.0.0.1:3000**

---

## 📱 3. Akses dari HP / Laptop Lain di Wi-Fi yang Sama (Lokal LAN)
Pastikan perangkat terhubung ke Wi-Fi / Router yang sama dengan PC ini:
- **http://192.168.1.2:3000**

---

## 🔒 4. Akses Remote Pribadi via VPN (Tailscale / ZeroTier)
Bisa dibuka dari luar rumah jika perangkat lain terhubung ke akun VPN Anda:
- **Tailscale:** **http://100.119.19.25:3000**
- **ZeroTier:** **http://10.147.17.166:3000**

---

## 🚀 5. Cara Mendapatkan URL Permanen Gratis Selamanya (Vercel)
Jika ingin web undangan online 24 jam nonstop meskipun PC Anda dimatikan:
1. Proyek ini berbasis Next.js standar.
2. Push repository ini ke GitHub Anda.
3. Buka **[vercel.com](https://vercel.com)** dan login dengan akun GitHub Anda.
4. Klik **"Add New Project"** -> pilih repositori ini -> klik **"Deploy"**.
5. Anda akan mendapatkan domain permanen gratis, misalnya:
   `https://undangan-dimas-sarah.vercel.app`
