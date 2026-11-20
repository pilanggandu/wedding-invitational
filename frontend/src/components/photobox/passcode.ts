/**
 * Helper modul untuk verifikasi passcode akses Bilik Foto (Photobox).
 * Mengamankan akses tamu hanya dengan satu passcode aktif yang dikonfigurasi.
 * Pincode lama ("2026") otomatis tidak berlaku dan tidak dapat digunakan lagi setelah passcode diubah ke kode pernikahan (2111 atau custom).
 */

// Tanggal pernikahan Gilang & Salsa: 21 November 2026 (21.11 -> "2111")
export const DEFAULT_PASSCODE = "2111";
export const DEFAULT_PASSCODES = [DEFAULT_PASSCODE];
export const OBSOLETE_PASSCODES = ["2026"];
export const PHOTOBOX_STORAGE_KEY = "wedding_photobox_unlocked_passcode_v2";
export const LEGACY_STORAGE_KEYS = [
  "wedding_photobox_unlocked_session",
  "wedding_photobox_unlocked_v1",
  "wedding_photobox_unlocked",
];

/**
 * Mengambil satu-satunya passcode aktif yang berlaku saat ini.
 * Prioritas:
 * 1. wedding_invitation_data_v1.general.photoboxPasscode (dari konfigurasi admin/database)
 * 2. wedding_photobox_pin (fallback penyimpanan pin admin)
 * 3. customPasscode dari props / pemanggil langsung (selama bukan kode usang "2026" jika ada kode lain)
 * 4. NEXT_PUBLIC_PHOTOBOX_PASSCODE (environment variable)
 * 5. DEFAULT_PASSCODE ("2111" tanggal pernikahan 21 November)
 */
export function getActivePasscode(customPasscode?: string): string {
  // 1. Cek konfigurasi admin / database terlebih dahulu jika di browser
  if (typeof window !== "undefined") {
    try {
      const localStore = window.localStorage.getItem("wedding_invitation_data_v1");
      if (localStore) {
        const parsed = JSON.parse(localStore);
        const storePin = parsed?.general?.photoboxPasscode?.toString()?.trim();
        if (storePin) return storePin;
      }
    } catch {}

    try {
      const customCode = window.localStorage.getItem("wedding_photobox_pin")?.trim();
      if (customCode) return customCode;
    } catch {}
  }

  // 2. Gunakan customPasscode dari props jika valid
  if (customPasscode && typeof customPasscode === "string") {
    const clean = customPasscode.trim();
    if (clean) return clean;
  }

  // 3. Environment variable
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_PHOTOBOX_PASSCODE) {
    const envCode = process.env.NEXT_PUBLIC_PHOTOBOX_PASSCODE.trim();
    if (envCode) return envCode;
  }

  return DEFAULT_PASSCODE;
}

/**
 * Mengembalikan daftar passcode yang sah.
 * Hanya berisi 1 passcode yang sedang aktif. Kode lama tidak dimasukkan agar tidak bisa dipakai membobol akses.
 */
export function getValidPasscodes(customPasscode?: string): string[] {
  return [getActivePasscode(customPasscode)];
}

/**
 * Cek apakah sebuah input kode merupakan kode lama yang sudah usang/kedaluwarsa.
 */
export function isPasscodeObsolete(input: string, customPasscode?: string): boolean {
  if (!input || typeof input !== "string") return false;
  const clean = input.trim();
  const active = getActivePasscode(customPasscode);
  return OBSOLETE_PASSCODES.includes(clean) && clean !== active;
}

/**
 * Verifikasi apakah input yang dimasukkan sesuai dengan passcode aktif.
 * Pincode lama ("2026") akan otomatis ditolak (return false) jika kode aktif bukan 2026.
 */
export function verifyPhotoboxPasscode(input: string, customPasscode?: string): boolean {
  if (!input || typeof input !== "string") return false;
  const clean = input.trim();
  if (!clean) return false;

  const activePasscode = getActivePasscode(customPasscode);

  // Tolak tegas jika input adalah kode lama yang telah usang
  if (isPasscodeObsolete(clean, activePasscode)) {
    return false;
  }

  return clean.toLowerCase() === activePasscode.toLowerCase();
}

/**
 * Cek apakah sesi saat ini sudah dibuka dengan passcode yang masih sah.
 * Jika passcode telah diganti oleh admin, sesi yang dibuka dengan passcode lama otomatis hangus.
 */
export function isPhotoboxUnlockedSession(expectedPasscode?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    // Bersihkan sesi warisan versi lama
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      window.sessionStorage.removeItem(legacyKey);
    }

    const stored = window.sessionStorage.getItem(PHOTOBOX_STORAGE_KEY);
    if (!stored) return false;

    const currentCode = getActivePasscode(expectedPasscode);
    if (stored.toLowerCase() === currentCode.toLowerCase()) {
      return true;
    }

    // Passcode telah diganti sejak sesi terakhir dibuka, hapus sesi usang
    window.sessionStorage.removeItem(PHOTOBOX_STORAGE_KEY);
    return false;
  } catch {
    return false;
  }
}

/**
 * Simpan passcode yang membuka sesi agar bila passcode diubah di masa depan,
 * sesi lama otomatis ter-invalidasi.
 */
export function setPhotoboxUnlockedSession(unlocked: boolean, activePasscode?: string): void {
  if (typeof window === "undefined") return;
  try {
    // Bersihkan sesi warisan versi lama
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      window.sessionStorage.removeItem(legacyKey);
    }

    if (unlocked) {
      const codeToStore = getActivePasscode(activePasscode);
      window.sessionStorage.setItem(PHOTOBOX_STORAGE_KEY, codeToStore);
    } else {
      window.sessionStorage.removeItem(PHOTOBOX_STORAGE_KEY);
    }
  } catch {}
}
