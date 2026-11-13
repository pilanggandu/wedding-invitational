/**
 * Helper modul untuk verifikasi passcode akses Bilik Foto (Photobox).
 * Mengamankan akses tamu dengan kode akses pernikahan (default 2026 atau 2111).
 */

export const DEFAULT_PASSCODES = ["2026", "2111"];
export const PHOTOBOX_STORAGE_KEY = "wedding_photobox_unlocked_v1";

export function getValidPasscodes(): string[] {
  const codes = new Set<string>(DEFAULT_PASSCODES);

  // Ambil kode dari environment variable jika disediakan
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_PHOTOBOX_PASSCODE) {
    const envCode = process.env.NEXT_PUBLIC_PHOTOBOX_PASSCODE.trim();
    if (envCode) codes.add(envCode);
  }

  // Ambil kode kustom dari localStorage jika dikonfigurasi admin
  if (typeof window !== "undefined") {
    try {
      const customCode = window.localStorage.getItem("wedding_photobox_pin")?.trim();
      if (customCode) codes.add(customCode);
    } catch {
      // Abaikan jika localStorage tidak tersedia di context saat ini
    }
  }

  return Array.from(codes);
}

export function verifyPhotoboxPasscode(input: string): boolean {
  if (!input || typeof input !== "string") return false;
  const clean = input.trim();
  if (!clean) return false;

  const validCodes = getValidPasscodes();
  return validCodes.some((code) => code.toLowerCase() === clean.toLowerCase());
}

export function isPhotoboxUnlockedSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(PHOTOBOX_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setPhotoboxUnlockedSession(unlocked: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (unlocked) {
      window.sessionStorage.setItem(PHOTOBOX_STORAGE_KEY, "true");
    } else {
      window.sessionStorage.removeItem(PHOTOBOX_STORAGE_KEY);
    }
  } catch {
    // Abaikan jika sessionStorage diblokir browser
  }
}
