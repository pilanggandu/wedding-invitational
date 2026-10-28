# Paper Keepsake

Template tambahan dengan ID `paper-keepsake`, berdasarkan prototype Paper Keepsake yang disetujui dari chat “Prompt Motion Undangan”. Template ini memakai surat, bunga pressed, pita, dan halaman album sebagai arah desain.

## Preview dan pemilihan

- Buka `/undangan?template=paper-keepsake&to=Nama+Tamu` untuk mencoba tanpa mengganti template aktif.
- Pilih **Paper Keepsake · Surat & Album Kenangan** di katalog admin untuk mengedit atau mengaktifkannya lewat alur yang tersedia.
- Editor menampilkan isi langsung. Preview menampilkan sampul; formulir preview memberi informasi bahwa data tidak dikirim.

## Sumber data

Semua nama, tanggal, foto, keluarga, cerita, rekening, alamat, dan ucapan memakai `WeddingDataProvider` serta kontrak undangan existing. Kalender ICS memakai tanggal mulai/selesai setiap acara, termasuk konversi zona waktu dari data. Jumlah tamu mengikuti kuota tamu yang terverifikasi. Pengiriman RSVP dan ucapan memakai API/store existing; ucapan tanpa konfirmasi server diberi status belum terkonfirmasi.

## Desain dan motion

- Paper `#F3EBDD`, card `#FBF8F1`, taupe `#5E4C35`, ink `#342D28`, rose `#C7887D`, sage `#79806B`, line `#D9CBB7`.
- Font judul memakai Cormorant Garamond yang sudah dimuat aplikasi. Nama mengikuti pilihan font editor; informasi memakai Plus Jakarta Sans.
- Seluruh stylesheet memakai awalan `pk-`. Scrollbar dokumen hanya berlaku saat `data-template-theme="paper-keepsake"`.
- Aset hero bergerak sebagai satu gambar. Teks nama/tanggal/tamu merupakan HTML di atas bagian kertas kosong; raster ini tidak berisi flap amplop terpisah.
- Pembuka bergerak 650 ms; ornamen di tepinya melebar dan menghilang bersama surat. Reveal memakai IntersectionObserver sekali per elemen dari keadaan default yang terlihat, dengan jeda pendek untuk agenda/foto.
- `KeepsakeSurrounds` membingkai sampul, showcase desktop, hero, cerita, dan penutup dengan bunga, daun, pita, perangko, serta hati dari aset lokal. Komposisi tepi menjaga area nama, foto, dan tombol tetap terbaca; tidak ada aset baru atau dependensi tambahan.
- Gerak ornamen memakai ayunan 4–8 derajat dan perpindahan hingga 14 px dengan ritme 5–7 detik agar karakter kertas dan pita terlihat. Animasi berhenti saat zona keluar layar atau tab disembunyikan. Tombol jeda di masthead, pengaturan ornamen editor, dan reduced motion menghentikan gerak dekoratif.
- Lightbox memakai dialog native untuk fokus terkurung, Escape, navigasi panah, dan pengembalian fokus. Tautan navigasi mengikuti section dan menyesuaikan reduced motion.
- Musik memakai AudioPlayer existing dan baru dipasang setelah pengguna membuka undangan. Sumber musik tetap mengikuti implementasi audio proyek yang tersedia.

## Berkas

`PaperKeepsakeTemplate.tsx` menangani sampul, showcase desktop, konten, kalender, galeri, dan navigasi. `KeepsakeGuestbook.tsx` menangani RSVP, ucapan, serta salin rekening/alamat. `keepsakeCalendar.ts` menyusun ICS dari tanggal/jam dan detail acara yang ditampilkan; teks jadwal yang ambigu tidak menampilkan tombol kalender. `paper-keepsake.css` memuat style dan motion. Aset lokal berada di `public/images/paper-keepsake`.
