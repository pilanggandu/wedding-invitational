# Audit bug dan UI/UX undangan

Tanggal: 29 Oktober 2026. Baseline repository: `3db2c82`.

Audit menelusuri kode frontend, kontrak RSVP backend, penyimpanan lokal, dan penggunaan komponen bersama. Alamat produksi yang diberikan membuka `/admin`; login dan tampilan setelah login belum terverifikasi karena panel ekstensi Chrome menghalangi otomatisasi. Tidak ada pengiriman RSVP percobaan atau perubahan data produksi.

Perbaikan pada putaran ini dipusatkan pada Paper Art dan sumber data bersama. Keberadaan template lain di repository tidak membuktikan template tersebut sedang aktif di produksi. Temuan kode di bawah dibedakan dari pengujian visual yang masih diperlukan.

## Bug yang diperbaiki

| Prioritas | Temuan dan cara memicu | Dampak sebelum perubahan | Perbaikan |
| --- | --- | --- | --- |
| P1 | Muat undangan tanpa data tersimpan: tanggal default masih 21 November | Countdown, tanggal acara, dan data kalender berbeda dari tanggal yang sudah dikonfirmasi | Default menjadi 28 November 2026; jam yang sudah ada dipertahankan |
| P1 | Ubah tanggal acara lalu gunakan kalender Paper Art | Google Calendar dan `.ics` tetap menyimpan 21 November karena tanggal hardcoded di komponen | Kedua tombol mengambil jadwal acara melalui parser yang sudah digunakan Paper Keepsake; `.ics` tidak mengarang waktu selesai akad |
| P1 | Server RSVP menolak atau mengembalikan `success: false` | Paper Art mengabaikan hasil request dan tetap menampilkan sukses | API memerlukan konfirmasi eksplisit, dan handler Paper Art memeriksa hasil sebelum melanjutkan |
| P1 | Kirim ucapan ketika backend tidak tersedia | Ucapan lokal dianggap tersimpan; input langsung dikosongkan | Jalur pengiriman Paper Art menunggu ID ucapan dari server, menyimpan hasil server, dan mempertahankan input jika belum terkonfirmasi |
| P1 | Kirim dari preview/editor Paper Art | Form berpotensi mengirim data sebenarnya | Flag preview/editor diteruskan sampai handler; mode ini hanya memberi penjelasan dan tidak mengirim request |
| P1 | Pilih “Ragu-ragu” pada Paper Art | Frontend mengirim status `0`, tetapi backend hanya menerima `1` atau `2` | Pilihan dibatasi menjadi Hadir dan Tidak Hadir sesuai kontrak yang tersedia |
| P1 | Simpan `gifts.accounts: []` atau section kosong | Normalisasi memasukkan kembali data contoh, termasuk rekening | Array kosong dihormati; rekening contoh di default dihapus; identitas orang tua dan Instagram tidak lagi dikarang dari fallback store |
| P2 | Buka cover memakai `?u=TOKEN` | Token teknis dapat ditampilkan sebagai nama tamu; nama hasil verifikasi kalah prioritas | Token tidak dipakai sebagai nama, dan nama terverifikasi diprioritaskan |
| P2 | Data ucapan selesai disinkronkan setelah form dirender | Daftar Paper Art tidak mengikuti perubahan store; “Hadir” dapat tampil sebagai “Tidak Hadir” karena perbandingan huruf kecil | Berlangganan perubahan store dan menampilkan nilai kehadiran yang tersedia |
| P2 | Konfirmasi kehadiran tanpa ingin membuat ucapan publik | Form mewajibkan ucapan meskipun tamu hanya ingin RSVP | Ucapan opsional bagi tamu dengan tautan pribadi; tanpa tautan pribadi, pesan sukses menjelaskan kehadiran belum tercatat |
| P2 | Klik submit berulang atau kuota tidak valid | Peluang request ganda dan jumlah hadir di luar batas | Kunci submit berbasis ref, input dinonaktifkan saat mengirim, dan validasi jumlah tamu sebelum request |
| P2 | Clipboard ditolak browser | Tombol tetap mengumumkan “Tersalin” | Status sukses menunggu `writeText`; kegagalan menjelaskan cara menyalin manual |
| P2 | Buka foto lalu gunakan keyboard | Overlay tidak memiliki perilaku dialog, fokus dapat keluar, dan Escape tidak ditangani | Dialog native dengan label, tombol tutup berlabel, penguncian scroll, serta pemulihan fokus; perilaku nyata lintas browser masih perlu diuji |
| P2 | Daftar rekening kosong | Tombol Kado tetap menuju section yang tidak dirender | Navigasi Kado hanya dimasukkan ketika rekening tersedia |

File utama: `frontend/src/templates/paper-art/PaperArtTemplate.tsx`, `frontend/src/lib/guestResponse.ts`, `frontend/src/lib/invitationStore.ts`, `frontend/src/lib/api.ts`, `frontend/src/context/WeddingDataContext.tsx`, `frontend/src/components/EnvelopeCover.tsx`, dan `frontend/src/data/weddingData.ts`.

## Koreksi atas audit sebelumnya

Teks Arab pada `weddingData.ts` sebenarnya valid UTF-8. Output terminal yang salah menampilkan karakter bukan bukti bahwa isi file rusak. Teks aslinya dipertahankan. Jangan mengganti kutipan atau terjemahan tanpa verifikasi sumber.

Perubahan default tidak memperbarui isi backend atau localStorage yang sudah ada. Tanggal, rekening, nama orang tua, dan template produksi tetap perlu dilihat melalui admin sebelum undangan dibagikan. Audit ini tidak mengasumsikan data default sama dengan data aktif.

## Temuan terverifikasi yang masih perlu dikerjakan

### P1 — Admin dapat mengumumkan simpan berhasil sebelum backend mengonfirmasi

Lokasi: `frontend/src/lib/invitationStore.ts`, fungsi `saveInvitationData`; `frontend/src/app/admin/components/CoupleEventManager.tsx`, fungsi `handleSave`; pemanggil lain pada pengaturan tema, setup mempelai, dan editor.

Reproduksi lokal: gagalkan request PUT `/api/invitation`, lalu simpan pengaturan. Store menulis localStorage terlebih dahulu, tidak menunggu hasil boolean backend, dan pemanggil langsung menampilkan status berhasil. Akibatnya preview host dapat berbeda dari tampilan perangkat tamu.

Saran konkret: buat jalur penyimpanan terkonfirmasi yang di-await seluruh pemanggil. Bedakan “tersimpan di server”, “draft lokal”, dan “gagal”; pertahankan draft ketika gagal. Perubahan ini perlu mencakup semua pemanggil, bukan hanya mengganti signature store secara sepihak.

### P1 — Editor acara menulis ulang jadwal dan nomor telepon contoh

Lokasi: `frontend/src/app/admin/components/CoupleEventManager.tsx`, objek `events` dan `physicalGiftAddress` pada `handleSave`; `frontend/src/app/admin/components/CoupleSetupModal.tsx`, pembaruan tanggal tampilan.

Reproduksi: ubah tanggal/jam di form lalu simpan. `displayDate` mengikuti input tetapi `dateStr`, `calendarEvent.startDate`, dan `endDate` masih memiliki nilai 21 November yang hardcoded. Nomor telepon pengiriman juga ditulis sebagai `081234567890`. Setup modal hanya mengubah tanggal tampilan sehingga countdown dapat tetap memakai tanggal lama.

Saran konkret: gunakan satu model jadwal yang menghasilkan label, ISO berzona waktu, countdown, serta kalender. Pertahankan nomor telepon lama ketika form tidak menyediakan field untuk mengubahnya. Jangan menambahkan jam selesai jika hanya tersedia jam mulai.

### P1 — Template alternatif masih memiliki jalur sukses semu dan preview yang menulis data

Lokasi: `frontend/src/templates/craft-book/CraftBookGuestbook.tsx`; `frontend/src/templates/ambient-blur/AmbientBlurRsvp.tsx`; komponen RSVP Cinematic, Cityscape, Painted Cats, Royal Heritage, serta `frontend/src/components/RsvpSection.tsx`.

Craft Book memanggil `submitWish` di cabang `isPreview || isEditor`, sehingga “preview” tetap menulis lokal dan mencoba POST ucapan. Sejumlah template lain masih mengabaikan hasil `submitRsvpApi`, memakai `submitWish` optimistis, atau mengirim status ragu `0`.

Saran konkret: terapkan alur pengiriman terkonfirmasi dan isolasi preview yang sudah dipakai Paper Art ke setiap template dengan pengujian masing-masing. Perbaikan Paper Art pada putaran ini tidak berarti seluruh template sudah memiliki perilaku yang sama.

### P2 — Identitas tamu dapat tertinggal saat parameter berubah tanpa remount

Lokasi: `frontend/src/app/undangan/page.tsx`, effect verifikasi token.

Ketika token diubah/dihapus melalui navigasi client, state tamu lama tidak langsung direset dan respons request lama tidak dibatalkan/diabaikan. Jika respons token A datang setelah token B, nama dan ID A dapat menang atas B. `resolvedName` juga diinisialisasi dari parameter sekali saja.

Saran konkret: ikat hasil verifikasi ke token asal, abaikan respons kedaluwarsa melalui cleanup, dan turunkan nama fallback dari parameter terbaru. Selama verifikasi, jangan izinkan RSVP memakai ID tamu sebelumnya.

### P2 — Mengosongkan foto belum berarti menyembunyikan galeri

Lokasi: `SketchbookGallery` pada `PaperArtTemplate.tsx`; inisialisasi foto pada `CoupleEventManager.tsx`.

`preweddingPhotos: []` masih diganti lima foto default. Ini berbeda dari array section yang kini sudah menghormati nilai kosong.

Saran konkret: bedakan properti belum tersedia dari array kosong yang sengaja disimpan. Sembunyikan section dan item navigasinya ketika tidak ada foto; gunakan placeholder hanya dalam editor dengan label yang jelas.

## Saran UI/UX konkret

| Area | Kondisi dari kode | Saran | Manfaat / tradeoff |
| --- | --- | --- | --- |
| Informasi acara | Label sebelumnya 9px, alamat 11px | Putaran ini menaikkan label ke sekitar 12px dan isi ke 14px; tetap uji alamat panjang di 360px | Lebih mudah dibaca; kartu sedikit lebih tinggi |
| Form mobile | Input sebelumnya sekitar 12px | Input Paper Art menjadi 16px pada mobile dan 14px pada layar lebih besar; label terhubung dengan input | Mengurangi kebutuhan zoom dan membantu teknologi bantu |
| Navigasi bawah | `NavigationDock.tsx` memakai label 8–9px dan tinggi minimum 38px | Targetkan kontrol sekitar 44px dan evaluasi jumlah menu di lebar 360px; aktifkan penanda `aria-current` | Kontrol lebih mudah disentuh; mungkin perlu mengurangi jumlah item |
| Warna | Paper Art memiliki banyak warna maroon hardcoded | Hubungkan komponen ke token palette aktif secara bertahap; jangan mengganti warna produksi sebelum template aktif diketahui | Pengaturan olive/dusty pink benar-benar konsisten; membutuhkan verifikasi kontras |
| Motion | Reveal section, reveal item, karakter nama, dan ornamen bisa bertumpuk | Pertahankan nama/cover sebagai momen utama; detail acara muncul sebagai satu kelompok, dekorasi lain berhenti setelah reveal | Informasi lebih cepat terbaca; jumlah gerak dekoratif berkurang |
| Lokasi dan kalender | Hero berfokus pada acara pertama | Beri tombol kalender per acara agar tamu dapat memilih akad atau resepsi | Maksud tombol lebih jelas; menambah kontrol pada kartu |
| Ucapan | RSVP dan ucapan publik berada dalam satu form | Jelaskan mana data kehadiran dan mana pesan publik; tambahkan pilihan tidak menulis ucapan | Tamu memahami apa yang akan disimpan/ditampilkan |
| Font dan gambar | Banyak keluarga font di stylesheet global; banyak elemen `img` | Ukur transfer dan LCP terlebih dahulu, lalu muat font yang digunakan serta optimalkan gambar utama | Potensi penghematan transfer; angka penghematan belum diukur |
| Tautan yang dibagikan | `/` mengarah ke `/admin` | Gunakan `/undangan` atau tautan tamu pribadi untuk distribusi | Tamu langsung menuju undangan; routing root tidak perlu diubah tanpa keputusan produk |

Perubahan motion, copy, dan ukuran teks lain yang muncul bersamaan di workspace dipertahankan. Identitas visual tidak diganti menjadi desain baru.

## Verifikasi dan batasnya

- Suite tes frontend yang tersedia: `node --test frontend/src/lib/*.test.mjs` — 43 tes lulus, 0 gagal. Runtime Node menampilkan peringatan module type pada tes lama.
- Pemeriksaan TypeScript: `npm exec --workspace=frontend -- tsc --noEmit` — lulus.
- Lint komponen UI yang diubah, normalisasi, helper baru, dan tes audit tidak memiliki error. Lint seluruh file yang disentuh tetap menemukan 11 error `no-explicit-any` yang sudah ada di `api.ts` dan `invitationStore.ts`; pemakaian `any` tersebut tidak diperkenalkan patch ini.
- Lint proyek secara keseluruhan tidak lulus: 91 error dan 283 warning pada pemeriksaan awal. Ini bukan klaim bahwa lint seluruh repository sudah bersih.
- `npm run build` gagal saat Turbopack mencoba menjalankan proses CSS di sandbox: `node process exited before we could connect to it`.
- Percobaan `npm run build --workspace=frontend -- --webpack` juga gagal: DNS `fonts.googleapis.com` tidak dapat diakses (`ENOTFOUND`), sehingga empat font `next/font/google` tidak dapat diunduh. Build produksi belum dapat dinyatakan lulus.
- Tidak ada pengukuran Lighthouse, pengujian iPhone/Safari, kontras visual, atau bukti screenshot mobile yang dapat diklaim pada putaran ini.
- Browser produksi terhalang panel ekstensi Chrome. Akses HTTP localhost dari sandbox juga ditolak oleh pembatasan socket.
- Tidak ada migrasi data tersimpan, perubahan rekening produksi, atau deploy yang dilakukan sebagai bagian dari audit lokal ini.
