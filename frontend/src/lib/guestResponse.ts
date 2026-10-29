import { submitRsvpApi } from "./api";
import { submitWishConfirmed } from "./invitationStore";

export interface GuestResponseFeedback {
  tone: "success" | "notice" | "error";
  message: string;
  clearMessage: boolean;
}

export async function saveGuestResponse(input: { name: string; attendance: "hadir" | "tidak"; attendeeCount: number; quota: number; message: string; guestId?: string; preview?: boolean }): Promise<GuestResponseFeedback> {
  const name = input.name.trim();
  const message = input.message.trim();
  const fail = (text: string): GuestResponseFeedback => ({ tone: "error", message: text, clearMessage: false });
  if (!name) return fail("Isi nama Anda terlebih dahulu.");
  if (input.attendance !== "hadir" && input.attendance !== "tidak") return fail("Pilih status kehadiran yang tersedia.");
  if (input.attendance === "hadir" && (!Number.isInteger(input.attendeeCount) || input.attendeeCount < 1 || input.attendeeCount > input.quota)) return fail(`Jumlah tamu harus antara 1 dan ${input.quota} orang.`);
  if (input.preview) return { tone: "notice", message: "Ini pratinjau. Konfirmasi dan ucapan tidak dikirim atau disimpan.", clearMessage: false };
  if (!input.guestId && !message) return fail("Tulis ucapan, atau gunakan tautan undangan pribadi untuk mencatat kehadiran.");
  let rsvpSaved = false;
  try {
    if (input.guestId) {
      const result = await submitRsvpApi({ guestId: input.guestId, status: input.attendance === "hadir" ? 1 : 2, attendeeCount: input.attendance === "hadir" ? input.attendeeCount : 0, message });
      if (!result.success) return fail(result.error || "Konfirmasi belum tersimpan. Silakan coba lagi.");
      rsvpSaved = true;
    }
    if (message) await submitWishConfirmed({ name, relationship: "Tamu Undangan", attendance: input.attendance === "hadir" ? "Hadir" : "Berhalangan Hadir", message, guestId: input.guestId });
    return { tone: "success", message: rsvpSaved ? message ? "Terima kasih. Kehadiran dan ucapan Anda sudah tersimpan." : "Terima kasih. Konfirmasi kehadiran Anda sudah tersimpan." : "Terima kasih. Ucapan Anda sudah tersimpan. Kehadiran belum tercatat tanpa tautan undangan pribadi.", clearMessage: true };
  } catch (error) {
    return fail(rsvpSaved ? "Kehadiran sudah tersimpan, tetapi ucapan belum terkonfirmasi. Periksa koneksi sebelum mencoba lagi." : error instanceof Error ? error.message : "Belum berhasil dikirim. Periksa koneksi lalu coba lagi.");
  }
}
