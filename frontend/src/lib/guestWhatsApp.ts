import type { GuestItem, WeddingInvitationData } from "@/types/wedding";
import { getGuestInputError, normalizeGuestPhone } from "@/lib/guestData";

export const DEFAULT_GUEST_WHATSAPP_TEMPLATE = [
  "Kepada Yth.",
  "Bapak/Ibu/Saudara/i *{nama}*",
  "di Tempat",
  "",
  "Assalamu’alaikum Warahmatullahi Wabarakatuh / Salam Sejahtera,",
  "",
  "Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada momen bahagia pernikahan kami:",
  "",
  "*{mempelai_pria} & {mempelai_wanita}*",
  "{tanggal}",
  "",
  "Detail acara, denah lokasi, dan konfirmasi kehadiran (RSVP) dapat dilihat melalui tautan undangan digital kami berikut:",
  "{link}",
  "",
  "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu secara langsung.",
  "",
  "Mohon maaf perihal undangan yang kami sampaikan melalui pesan digital ini. Atas perhatian, kehadiran, dan doa restunya, kami ucapkan terima kasih yang sebesar-besarnya.",
  "",
  "Wassalamu’alaikum Warahmatullahi Wabarakatuh / Salam Hangat,",
  "",
  "Kami yang berbahagia,",
  "*{mempelai_pria} & {mempelai_wanita}*",
].join("\n");

export const GUEST_WHATSAPP_PRESETS = [
  {
    id: "formal",
    name: "Formal Santun (Lengkap)",
    template: DEFAULT_GUEST_WHATSAPP_TEMPLATE,
  },
  {
    id: "islami",
    name: "Nuansa Islami",
    template: [
      "Kepada Yth.",
      "Bapak/Ibu/Saudara/i *{nama}*",
      "di Tempat",
      "",
      "Assalamu’alaikum Warahmatullahi Wabarakatuh,",
      "",
      "Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri akad nikah dan walimatul 'ursy kami:",
      "",
      "*{mempelai_pria} & {mempelai_wanita}*",
      "{tanggal}",
      "",
      "Informasi lengkap acara, lokasi, dan buku tamu (RSVP) dapat diakses melalui tautan undangan digital berikut:",
      "{link}",
      "",
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada kedua mempelai.",
      "",
      "Jazaakumullah Khairan Katsiran atas doa dan perhatian yang diberikan.",
      "",
      "Wassalamu’alaikum Warahmatullahi Wabarakatuh,",
      "",
      "Kami yang berbahagia,",
      "*{mempelai_pria} & {mempelai_wanita}*",
      "Beserta Keluarga Besar",
    ].join("\n"),
  },
  {
    id: "universal",
    name: "Universal & Hangat",
    template: [
      "Kepada Yth.",
      "Bapak/Ibu/Saudara/i *{nama}*",
      "di Tempat",
      "",
      "Salam hangat dan bahagia untuk Anda sekeluarga.",
      "",
      "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan merayakan hari pernikahan kami:",
      "",
      "*{mempelai_pria} & {mempelai_wanita}*",
      "{tanggal}",
      "",
      "Untuk informasi waktu, denah lokasi, dan konfirmasi kehadiran, silakan buka tautan undangan digital berikut:",
      "{link}",
      "",
      "Kehadiran serta doa restu Anda akan menjadi kebahagiaan dan kehormatan yang luar biasa bagi kami.",
      "",
      "Terima kasih atas segala perhatian dan kebaikan yang diberikan.",
      "",
      "Salam hangat,",
      "*{mempelai_pria} & {mempelai_wanita}*",
    ].join("\n"),
  },
  {
    id: "ringkas",
    name: "Ringkas & Padat",
    template: [
      "Yth. {nama},",
      "",
      "Dengan hormat, kami mengundang Anda ke pernikahan:",
      "*{mempelai_pria} & {mempelai_wanita}*",
      "{tanggal}",
      "",
      "Undangan lengkap untuk Anda:",
      "{link}",
      "",
      "Merupakan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.",
      "",
      "Terima kasih.",
    ].join("\n"),
  },
] as const;

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
