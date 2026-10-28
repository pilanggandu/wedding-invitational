export interface GuestInput {
  name: string;
  phone: string;
  category: string;
  notes: string;
  quota: number;
}

export type GuestUpdates = Partial<GuestInput & { isSent: boolean }>;

export class GuestValidationError extends Error {}

function readBody(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new GuestValidationError("Data tamu harus berupa objek");
  }
  return input as Record<string, unknown>;
}

function readText(value: unknown, label: string, required: boolean, maxLength?: number): string {
  if (typeof value !== "string") throw new GuestValidationError(`${label} harus berupa teks`);
  const text = value.trim();
  if (required && !text) throw new GuestValidationError(`${label} wajib diisi`);
  if (maxLength && text.length > maxLength) {
    throw new GuestValidationError(`${label} maksimal ${maxLength} karakter`);
  }
  return text;
}

export function normalizeGuestPhone(value: unknown): string {
  const phone = readText(value, "Nomor WhatsApp", false);
  if (!phone) return "";
  if (!/^\+?[\d\s().-]+$/.test(phone)) {
    throw new GuestValidationError("Nomor WhatsApp hanya boleh berisi angka dan tanda pemisah");
  }
  let digits = phone.replace(/\D/g, "");
  if (!phone.startsWith("+")) {
    if (digits.startsWith("00")) digits = digits.slice(2);
    else if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  }
  if (!/^[1-9]\d{9,14}$/.test(digits)) {
    throw new GuestValidationError("Nomor WhatsApp harus berisi 10 sampai 15 angka termasuk kode negara");
  }
  return digits;
}

function readQuota(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 20) {
    throw new GuestValidationError("Kuota tamu harus berupa bilangan bulat antara 1 dan 20");
  }
  return value;
}

export function validateGuestCreate(input: unknown): GuestInput {
  const body = readBody(input);
  return {
    name: readText(body.name, "Nama tamu", true, 150),
    phone: normalizeGuestPhone(body.phone === undefined ? "" : body.phone),
    category: readText(body.category === undefined ? "Sahabat" : body.category, "Kategori", true, 100),
    notes: readText(body.notes === undefined ? "" : body.notes, "Catatan", false),
    quota: readQuota(body.quota === undefined ? 1 : body.quota),
  };
}

export function validateGuestUpdate(input: unknown): GuestUpdates {
  const body = readBody(input);
  const updates: GuestUpdates = {};
  if (Object.hasOwn(body, "name")) updates.name = readText(body.name, "Nama tamu", true, 150);
  if (Object.hasOwn(body, "phone")) updates.phone = normalizeGuestPhone(body.phone);
  if (Object.hasOwn(body, "category")) updates.category = readText(body.category, "Kategori", true, 100);
  if (Object.hasOwn(body, "notes")) updates.notes = readText(body.notes, "Catatan", false);
  if (Object.hasOwn(body, "quota")) updates.quota = readQuota(body.quota);
  if (Object.hasOwn(body, "isSent")) {
    if (typeof body.isSent !== "boolean") throw new GuestValidationError("Status kirim harus berupa boolean");
    updates.isSent = body.isSent;
  }
  if (Object.keys(updates).length === 0) throw new GuestValidationError("Tidak ada perubahan data tamu");
  return updates;
}

export function ensureGuestQuotaSupported(quota: number | undefined, supportsQuota: boolean): void {
  if (quota !== undefined && quota !== 1 && !supportsQuota) {
    throw new GuestValidationError("Penyimpanan tamu ini belum mendukung kuota lebih dari 1");
  }
}

export function formatLegacyGuest(row: Record<string, any>) {
  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug || encodeURIComponent(row.name).replace(/%20/g, "+"),
    phone: row.phone || "",
    category: row.category || "Sahabat",
    isSent: Boolean(row.isSent ?? row.is_sent),
    quota: 1,
    notes: row.notes || "",
    createdAt: row.createdAt ?? row.created_at,
  };
}
