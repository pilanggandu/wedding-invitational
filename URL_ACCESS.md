# 📌 Panduan URL Akses Web Undangan Digital (Dimas & Sarah)

Dokumen ini berisi seluruh daftar tautan (URL) dan metode untuk membuka serta mengakses web undangan pernikahan ini, baik dari PC lokal, HP via Wi-Fi, maupun jarak jauh via internet.

---

## 1. 💻 Akses Langsung di Komputer Ini (Local PC)
Buka di browser laptop/PC pengembangan:
- **http://localhost:3000**
- **http://127.0.0.1:3000**

---

## 2. 📱 Akses dari HP / Tablet / Laptop Lain di Wi-Fi yang Sama (Lokal LAN)
Pastikan perangkat terhubung ke Wi-Fi / Router yang sama dengan PC ini:
- **http://192.168.1.2:3000**

> **Catatan:** IP lokal komputer Anda di jaringan Wi-Fi saat ini adalah `192.168.1.2`. Port 3000 dan izin masuk Node.js di Windows Firewall sudah diaktifkan.

---

## 3. 🌐 Akses Jarak Jauh / Remote Pribadi (VPN Mesh)
Bisa dibuka dari luar rumah/kantor jika perangkat lain terhubung ke akun VPN Anda:
- **Tailscale:** **http://100.119.19.25:3000**
- **ZeroTier:** **http://10.147.17.166:3000**

---

## 4. 🌍 Akses Publik Bebas (Untuk Tamu / HP via Paket Data)
Jika ingin membagikan link ke teman/keluarga tanpa perlu satu jaringan Wi-Fi, jalankan salah satu perintah ini di terminal:

### Opsi A: Cloudflare Tunnel (Gratis, Cepat, Tanpa Akun)
```powershell
npx cloudflared tunnel --url http://localhost:3000
```
*Terminal akan menghasilkan link HTTPS publik (contoh: `https://xxxx.trycloudflare.com`) yang bisa dibuka siapa saja dari internet.*

### Opsi B: Localtunnel
```powershell
npx localtunnel --port 3000
```

---

## 💡 Tips Parameter Nama Tamu:
Anda bisa menyertakan nama tamu undangan di URL menggunakan parameter `?to=`:
- Contoh di Wi-Fi: `http://192.168.1.2:3000/?to=Budi+Santoso`
- Contoh di Localhost: `http://localhost:3000/?to=Sahabat+Tercinta`
