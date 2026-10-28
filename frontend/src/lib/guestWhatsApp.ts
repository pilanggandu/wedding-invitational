import type { GuestItem, WeddingInvitationData } from "@/types/wedding";
import { getGuestInputError, normalizeGuestPhone } from "@/lib/guestData";

export const DEFAULT_GUEST_WHATSAPP_TEMPLATE = [
  "Yth. {nama},",
  "",
  "Dengan hormat, kami mengundang Anda ke pernikahan:",
  "{mempelai_pria} & {mempelai_wanita}",
  "{tanggal}",
  "",
  "Undangan lengkap untuk Anda:",
  "{link}",
  "",
  "Merupakan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.",
  "",
  "Terima kasih.",
].join("\n");

export function getPersonalInvitationUrl(
  baseUrl: string,
  guest: Pick<GuestItem, "name" | "token">
): string {
  let url: URL;
  try {
    url = new URL(baseUrl.trim());
  } catch {
    throw new Error("URL undangan harus lengkap, misalnya https://domain-anda.com/undangan.");
  }
  if (!/^https?:$/.test(url.protocol) || url.username || url.password) {
    throw new Error("URL undangan harus menggunakan http atau https tanpa kredensial.");
  }

  url.pathname = url.pathname === "/" ? "/undangan" : url.pathname.replace(/\/+$/, "");
  url.searchParams.delete("to");
  if (guest.token?.trim()) {
    url.searchParams.set("u", guest.token.trim());
  } else {
    url.searchParams.delete("u");
    url.searchParams.set("to", guest.name.trim());
  }
  return url.toString();
}

export function buildGuestWhatsAppMessage(
  guest: Pick<GuestItem, "name" | "token">,
  data: WeddingInvitationData,
  baseUrl: string,
  template = DEFAULT_GUEST_WHATSAPP_TEMPLATE
): string {
  const event = data.events?.[0];
  const date = event?.displayDate?.trim() || event?.dateStr?.trim() || "";
  const values: Record<string, string> = {
    nama: guest.name.trim(),
    mempelai_pria: data.couple?.groom?.name?.trim() || "Mempelai Pria",
    mempelai_wanita: data.couple?.bride?.name?.trim() || "Mempelai Wanita",
    tanggal: date ? [event?.displayDay?.trim(), date].filter(Boolean).join(", ") : "",
    link: getPersonalInvitationUrl(baseUrl, guest),
  };
  return template.replace(/\{(nama|mempelai_pria|mempelai_wanita|tanggal|link)\}/g,
    (_, key: string) => values[key]
  ).trim();
}

export function getWhatsAppWebUrl(phone: string, message: string): string {
  const normalizedPhone = normalizeGuestPhone(phone);
  const error = getGuestInputError({ name: "Tamu", phone });
  if (!normalizedPhone || error) {
    throw new Error(error || "Nomor WhatsApp wajib diisi untuk mengirim undangan.");
  }
  if (!message.trim()) throw new Error("Pesan undangan tidak boleh kosong.");
  const url = new URL("https://web.whatsapp.com/send");
  url.searchParams.set("phone", normalizedPhone);
  url.searchParams.set("text", message);
  return url.toString();
}
