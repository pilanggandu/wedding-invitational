export interface GuestDraft {
  name: string;
  phone: string;
  category: string;
  notes: string;
  quota: number;
}

export function normalizeGuestPhone(value: string): string {
  const phone = value.trim().replace(/[\s().+\-]/g, "");
  if (!/^\d*$/.test(phone)) return phone;
  if (value.trim().startsWith("+")) return phone;
  if (phone.startsWith("00")) return phone.slice(2);
  if (phone.startsWith("0")) return `62${phone.slice(1)}`;
  return phone;
}

export function getGuestInputError(draft: {
  name: string;
  phone: string;
  category?: string;
  notes?: string;
  quota?: number;
}): string | null {
  if (!draft.name.trim()) return "Nama tamu wajib diisi.";
  if (draft.name.trim().length > 150) return "Nama tamu maksimal 150 karakter.";
  const phone = normalizeGuestPhone(draft.phone);
  if (phone && !/^[1-9]\d{9,14}$/.test(phone)) {
    return "Nomor WhatsApp harus 10–15 digit dengan kode negara, misalnya 6281234567890.";
  }
  const quota = draft.quota ?? 1;
  if (!Number.isInteger(quota) || quota < 1 || quota > 20) {
    return "Kuota tamu harus bilangan bulat antara 1 dan 20.";
  }
  if (draft.category && draft.category.trim().length > 80) return "Kategori maksimal 80 karakter.";
  if (draft.notes && draft.notes.length > 1000) return "Catatan maksimal 1.000 karakter.";
  return null;
}

export function getGuestDuplicateKey(name: string, phone: string): string {
  return `${name.trim().toLocaleLowerCase("id-ID").replace(/\s+/g, " ")}|${normalizeGuestPhone(phone)}`;
}
