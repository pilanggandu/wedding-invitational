# Setup Google SSO

Login admin memakai Google Identity Services untuk mengirim ID token ke frontend. Backend memverifikasi token Google dan hanya menerima email yang ada di `GOOGLE_SSO_ALLOWED_EMAILS`. Login ini hanya untuk identitas; aplikasi tidak meminta akses Gmail, Drive, Calendar, atau API Google lainnya.

## Buat OAuth Client Google

1. Buka [Google Cloud Console](https://console.cloud.google.com/) lalu pilih atau buat project.
2. Atur nama aplikasi, email dukungan, dan audience pada pengaturan Google Auth Platform / OAuth consent.
3. Buat OAuth Client dengan tipe aplikasi **Web application**.
4. Tambahkan origin berikut di **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - Origin production, misalnya `https://undangan.example.com`
   - Origin HTTPS lain yang digunakan untuk membuka halaman admin
5. Salin Client ID untuk Web application tersebut.

Flow popup yang dipakai aplikasi ini tidak memerlukan Authorized redirect URI atau Client Secret. Google meminta origin lokal dan domain website didaftarkan sebagai Authorized JavaScript origins. Lihat [panduan setup Google Identity Services](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

## Isi environment

Gunakan Client ID yang sama di frontend dan backend:

```dotenv
# frontend/.env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

```dotenv
# backend/.env
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_SSO_ALLOWED_EMAILS=admin@example.com
```

`GOOGLE_SSO_ALLOWED_EMAILS` menerima satu atau beberapa email persis, dipisahkan koma. Email dinormalisasi ke huruf kecil. Jika kosong, backend menolak login Google. Jangan gunakan wildcard.

Setelah mengubah env, restart frontend dan backend. Untuk production, isi `NEXT_PUBLIC_GOOGLE_CLIENT_ID` sebelum build frontend.

## Login

Buka `/admin`, lalu pilih **Sign in with Google**. Backend memvalidasi signature, audience, issuer, waktu kedaluwarsa, dan email terverifikasi sebelum memeriksa allowlist. Setelah lolos, aplikasi membuat token sesi admin yang sudah digunakan login biasa.

Client ID frontend dan backend harus sama. Detail verifikasi ID token ada di [dokumentasi OpenID Connect Google](https://developers.google.com/identity/openid-connect/openid-connect).

Pada startup, backend menambahkan kolom `users.google_sub` jika belum tersedia dan membuat unique index. Akun admin lama dengan email allowlist akan ditautkan ke Google saat login pertama, selama akun tersebut belum tertaut ke identitas Google lain.
