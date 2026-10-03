import { WEDDING_DATA } from "@/data/weddingData";
import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";

const INVITATION_STORAGE_KEY = "wedding_invitation_data_v1";
const GUESTS_STORAGE_KEY = "wedding_guests_data_v1";
const WISHES_STORAGE_KEY = "wedding_wishes_gilang_salsa_maroon";

export const DEFAULT_INVITATION_DATA: WeddingInvitationData = {
  id: "inv_gilang_salsa",
  activeTemplateId: "paper-art-maroon",
  themePalette: {
    primaryColor: "#7D1128",
    secondaryColor: "#E5B869",
    accentColor: "#F5A8B8",
    fontStyle: "caveat",
    particlesEnabled: true,
    musicAutoplay: true,
  },
  couple: {
    groom: {
      name: WEDDING_DATA.couple.groom.name,
      fullName: WEDDING_DATA.couple.groom.fullName,
      tagline: WEDDING_DATA.couple.groom.tagline || "Calon Suami Idaman & Penyabar",
      bioFunny: WEDDING_DATA.couple.groom.bioFunny || "Suka kopi, hobi ngobrol, dan siap jadi pendamping setia selamanya.",
      parents: WEDDING_DATA.couple.groom.parents || "Bpk. Permadi & Ibu",
      instagram: WEDDING_DATA.couple.groom.instagram || "gilang",
      photoPlaceholder: {
        title: "The Groom",
        caption: "Gilang",
        aspectRatio: "3/4",
        variant: "groom",
      },
    },
    bride: {
      name: WEDDING_DATA.couple.bride.name,
      fullName: WEDDING_DATA.couple.bride.fullName,
      tagline: WEDDING_DATA.couple.bride.tagline || "Tuan Putri Cantik & Berhati Lembut",
      bioFunny: WEDDING_DATA.couple.bride.bioFunny || "Pencinta keceriaan, senyum manis, dan siap membangun surga rumah tangga bersama.",
      parents: WEDDING_DATA.couple.bride.parents || "Bpk. Mokhamad Mokharom & Ibu",
      instagram: WEDDING_DATA.couple.bride.instagram || "salsadila",
      photoPlaceholder: {
        title: "The Bride",
        caption: "Salsadila",
        aspectRatio: "3/4",
        variant: "bride",
      },
    },
  },
  general: {
    hashtag: WEDDING_DATA.general.hashtag,
    funTagline: WEDDING_DATA.general.funTagline,
    musicTitle: WEDDING_DATA.general.musicTitle,
    musicArtist: WEDDING_DATA.general.musicArtist,
    quote: WEDDING_DATA.general.quote,
    openingGreetings: WEDDING_DATA.general.openingGreetings,
    openingMessage: WEDDING_DATA.general.openingMessage,
    closingMessage: WEDDING_DATA.general.closingMessage,
  },
  countdownTarget: WEDDING_DATA.countdownTarget,
  events: WEDDING_DATA.events,
  stories: WEDDING_DATA.stories || [],
  gallery: WEDDING_DATA.gallery,
  gifts: {
    accounts: [
      {
        bankName: "BCA",
        accountNumber: "1234567890",
        accountHolder: "Gilang Pandu Permadi",
        logoText: "BCA",
        cuteLabel: "Rekening Mempelai Pria",
        cardColor: "maroon",
      },
      {
        bankName: "Bank Mandiri",
        accountNumber: "0987654321",
        accountHolder: "Salsadila Nanda Octavia",
        logoText: "MANDIRI",
        cuteLabel: "Rekening Mempelai Wanita",
        cardColor: "gold",
      },
    ],
    physicalGiftAddress: WEDDING_DATA.gifts.physicalGiftAddress,
  },
  dresscode: WEDDING_DATA.dresscode,
  initialWishes: WEDDING_DATA.initialWishes || [],
};

export const INITIAL_GUESTS: GuestItem[] = [
  {
    id: "g_1",
    name: "Bapak Budi Santoso & Keluarga",
    slug: "Bapak+Budi+Santoso+%26+Keluarga",
    phone: "6281234567890",
    category: "VIP",
    isSent: true,
    notes: "Tamu kehormatan keluarga besar",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "g_2",
    name: "Rizky Pratama & Partner",
    slug: "Rizky+Pratama+%26+Partner",
    phone: "6281987654321",
    category: "Sahabat",
    isSent: false,
    notes: "Teman kuliah seperjuangan",
    createdAt: "2026-10-02T11:00:00Z",
  },
  {
    id: "g_3",
    name: "Keluarga Besar dr. Hendra",
    slug: "Keluarga+Besar+dr.+Hendra",
    phone: "6281345678901",
    category: "Keluarga",
    isSent: true,
    notes: "Kerabat dekat mempelai wanita",
    createdAt: "2026-10-02T14:30:00Z",
  },
  {
    id: "g_4",
    name: "Anisa Rahmawati",
    slug: "Anisa+Rahmawati",
    phone: "6285712345678",
    category: "Rekan Kerja",
    isSent: false,
    notes: "Rekan satu divisi kantor",
    createdAt: "2026-10-03T09:15:00Z",
  },
];

export function getInvitationData(): WeddingInvitationData {
  if (typeof window === "undefined") {
    return DEFAULT_INVITATION_DATA;
  }
  try {
    const raw = localStorage.getItem(INVITATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_INVITATION_DATA,
        ...parsed,
        couple: {
          ...DEFAULT_INVITATION_DATA.couple,
          ...parsed.couple,
          groom: { ...DEFAULT_INVITATION_DATA.couple.groom, ...(parsed.couple?.groom || {}) },
          bride: { ...DEFAULT_INVITATION_DATA.couple.bride, ...(parsed.couple?.bride || {}) },
        },
        general: { ...DEFAULT_INVITATION_DATA.general, ...(parsed.general || {}) },
        themePalette: { ...DEFAULT_INVITATION_DATA.themePalette, ...(parsed.themePalette || {}) },
        gifts: { ...DEFAULT_INVITATION_DATA.gifts, ...(parsed.gifts || {}) },
      };
    }
  } catch (err) {
    console.error("Gagal membaca invitation data:", err);
  }
  return DEFAULT_INVITATION_DATA;
}

export function saveInvitationData(data: WeddingInvitationData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVITATION_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("wedding-data-changed", { detail: data }));
  } catch (err) {
    console.error("Gagal menyimpan invitation data:", err);
  }
}

export function resetInvitationData(): WeddingInvitationData {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(INVITATION_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("wedding-data-changed", { detail: DEFAULT_INVITATION_DATA }));
    } catch {
      // ignore
    }
  }
  return DEFAULT_INVITATION_DATA;
}

export function getGuests(): GuestItem[] {
  if (typeof window === "undefined") return INITIAL_GUESTS;
  try {
    const raw = localStorage.getItem(GUESTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Gagal membaca tamu:", err);
  }
  return INITIAL_GUESTS;
}

export function saveGuests(guests: GuestItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));
    window.dispatchEvent(new CustomEvent("wedding-guests-changed", { detail: guests }));
  } catch (err) {
    console.error("Gagal menyimpan tamu:", err);
  }
}

export function addGuest(
  name: string,
  phone: string,
  category: GuestItem["category"],
  notes?: string
): GuestItem {
  const cleanName = name.trim();
  const slug = encodeURIComponent(cleanName).replace(/%20/g, "+");
  const newGuest: GuestItem = {
    id: "g_" + Date.now(),
    name: cleanName,
    slug,
    phone: phone.trim().replace(/^0/, "62").replace(/[^0-9]/g, ""),
    category,
    isSent: false,
    notes: notes?.trim(),
    createdAt: new Date().toISOString(),
  };

  const list = [newGuest, ...getGuests()];
  saveGuests(list);
  return newGuest;
}

export function deleteGuest(id: string): void {
  const list = getGuests().filter((g) => g.id !== id);
  saveGuests(list);
}

export function toggleGuestSent(id: string): void {
  const list = getGuests().map((g) =>
    g.id === id ? { ...g, isSent: !g.isSent } : g
  );
  saveGuests(list);
}

export function getWishes(): WishMessage[] {
  if (typeof window === "undefined") return WEDDING_DATA.initialWishes || [];
  try {
    const raw = localStorage.getItem(WISHES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Gagal membaca ucapan:", err);
  }
  return WEDDING_DATA.initialWishes || [];
}

export function saveWishes(wishes: WishMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
    window.dispatchEvent(new CustomEvent("wedding-wishes-changed", { detail: wishes }));
  } catch (err) {
    console.error("Gagal menyimpan ucapan:", err);
  }
}

export function deleteWish(id: string): void {
  const list = getWishes().filter((w) => w.id !== id);
  saveWishes(list);
}

export function generateWhatsAppInvitationUrl(
  phone: string,
  guestName: string,
  coupleGroom: string,
  coupleBride: string,
  invitationWebUrl: string
): string {
  const cleanPhone = phone.replace(/^0/, "62").replace(/[^0-9]/g, "");
  const personalUrl = `${invitationWebUrl}?to=${encodeURIComponent(guestName).replace(/%20/g, "+")}`;

  const message = [
    `Assalamu'alaikum Warahmatullahi Wabarakatuh`,
    ``,
    `Kepada Yth. *${guestName}*,`,
    `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dan memberikan doa restu pada hari pernikahan kami:`,
    ``,
    `💍 *The Wedding of ${coupleGroom} & ${coupleBride}*`,
    `📅 *Sabtu, 21 November 2026*`,
    ``,
    `Buka tautan undangan digital resmi di bawah ini:`,
    `${personalUrl}`,
    ``,
    `Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.`,
    ``,
    `Terima kasih banyak,`,
    `Wassalamu'alaikum Warahmatullahi Wabarakatuh`,
    `*${coupleGroom} & ${coupleBride}*`,
  ].join("\n");

  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}
