/**
 * Helper modul untuk verifikasi passcode akses Bilik Foto (Photobox).
 * Mengamankan akses tamu hanya dengan satu passcode aktif yang dikonfigurasi.
 * Pincode lama otomatis tidak berlaku dan tidak dapat digunakan lagi setelah passcode diubah.
 */

export const DEFAULT_PASSCODE = "2026";
export const DEFAULT_PASSCODES = [DEFAULT_PASSCODE];
export const PHOTOBOX_STORAGE_KEY = "wedding_photobox_unlocked_passcode_v2";

/**
 * Mengambil satu-satunya passcode aktif yang berlaku saat ini.
 * Prioritas:
 * 1. customPasscode dari props / pemanggil langsung
 * 2. wedding_invitation_data_v1.general.photoboxPasscode (dari konfigurasi admin/database)
 * 3. wedding_photobox_pin (fallback penyimpanan pin admin)
 * 4. NEXT_PUBLIC_PHOTOBOX_PASSCODE (environment variable)
 * 5. DEFAULT_PASSCODE ("2026" hanya jika belum pernah dikonfigurasi sama sekali)
 */
export function getActivePasscode(customPasscode?: string): string {
  if (customPasscode && typeof customPasscode === "string") {
    const clean = customPasscode.trim();
    if (clean) return clean;
  }

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
 * Verifikasi apakah input yang dimasukkan sesuai dengan passcode aktif.
 * Pincode lama akan otomatis ditolak (return false).
 */
export function verifyPhotoboxPasscode(input: string, customPasscode?: string): boolean {
  if (!input || typeof input !== "string") return false;
  const clean = input.trim();
  if (!clean) return false;

  const activePasscode = getActivePasscode(customPasscode);
  return clean.toLowerCase() === activePasscode.toLowerCase();
}

/**
 * Cek apakah sesi saat ini sudah dibuka dengan passcode yang masih sah.
 * Jika passcode telah diganti oleh admin, sesi yang dibuka dengan passcode lama otomatis hangus.
 */
export function isPhotoboxUnlockedSession(expectedPasscode?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
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
    if (unlocked) {
      const codeToStore = getActivePasscode(activePasscode);
      window.sessionStorage.setItem(PHOTOBOX_STORAGE_KEY, codeToStore);
    } else {
      window.sessionStorage.removeItem(PHOTOBOX_STORAGE_KEY);
    }
  } catch {}
}
