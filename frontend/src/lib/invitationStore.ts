import { WEDDING_DATA } from "@/data/weddingData";
import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";
import {
  fetchInvitationFromBackend,
  saveInvitationToBackend,
  fetchGuestsFromBackend,
  addGuestToBackend,
  updateGuestInBackend,
  deleteGuestFromBackend,
  fetchWishesFromBackend,
  addWishToBackend,
  deleteWishFromBackend,
  saveGuestMasterToBackend,
  deleteGuestMasterFromBackend,
} from "@/lib/api";
import { getGuestInputError, normalizeGuestPhone, type GuestDraft } from "./guestData";

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
      tagline: WEDDING_DATA.couple.groom.tagline || "",
      bioFunny: WEDDING_DATA.couple.groom.bioFunny || "",
      parents: WEDDING_DATA.couple.groom.parents,
      instagram: WEDDING_DATA.couple.groom.instagram,
      photoPlaceholder: {
        title: "The Groom",
        caption: "Gilang",
        aspectRatio: "3/4",
        variant: "groom",
      },
      photoUrl: "/images/prewedding/couple-3.jpg",
    },
    bride: {
      name: WEDDING_DATA.couple.bride.name,
      fullName: WEDDING_DATA.couple.bride.fullName,
      tagline: WEDDING_DATA.couple.bride.tagline || "",
      bioFunny: WEDDING_DATA.couple.bride.bioFunny || "",
      parents: WEDDING_DATA.couple.bride.parents,
      instagram: WEDDING_DATA.couple.bride.instagram,
      photoPlaceholder: {
        title: "The Bride",
        caption: "Salsa",
        aspectRatio: "3/4",
        variant: "bride",
      },
      photoUrl: "/images/prewedding/couple-4.jpg",
    },
  },
  general: {
    hashtag: WEDDING_DATA.general.hashtag,
    funTagline: WEDDING_DATA.general.funTagline,
    musicTitle: WEDDING_DATA.general.musicTitle,
    musicArtist: WEDDING_DATA.general.musicArtist,
    musicUrl: "",
    musicVolume: 40,
    quote: WEDDING_DATA.general.quote,
    openingGreetings: WEDDING_DATA.general.openingGreetings,
    openingMessage: WEDDING_DATA.general.openingMessage,
    closingMessage: WEDDING_DATA.general.closingMessage,
    coverPhotoUrl: "/images/prewedding/couple-1.jpg",
    heroPhotoUrl: "/images/prewedding/couple-2.jpg",
    backgroundPhotoUrl: "/images/prewedding/couple-1.jpg",
    preweddingPhotos: [
      "/images/prewedding/couple-1.jpg",
      "/images/prewedding/couple-2.jpg",
      "/images/prewedding/couple-3.jpg",
      "/images/prewedding/couple-4.jpg",
      "/images/prewedding/couple-5.jpg",
    ],
  },
  countdownTarget: WEDDING_DATA.countdownTarget,
  events: WEDDING_DATA.events,
  stories: WEDDING_DATA.stories || [],
  gallery: WEDDING_DATA.gallery,
  gifts: {
    accounts: [],
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

let isSyncing = false;

/**
 * Sinkronisasi data dari backend (Express + SQLite / Supabase) ke Client Store
 */
export async function syncWithBackend(): Promise<void> {
  if (typeof window === "undefined" || isSyncing) return;
  isSyncing = true;

  try {
    const [invitationRes, guestsRes, wishesRes] = await Promise.allSettled([
      fetchInvitationFromBackend(),
      fetchGuestsFromBackend(),
      fetchWishesFromBackend(),
    ]);

    // 1. Sync Invitation Data
    if (invitationRes.status === "fulfilled" && invitationRes.value) {
      const serverData = invitationRes.value;
      if (serverData && typeof serverData === "object") {
        const local = getInvitationData();
        const merged: WeddingInvitationData = {
          ...DEFAULT_INVITATION_DATA,
          ...local,
          ...serverData,
          couple: {
            groom: {
              ...DEFAULT_INVITATION_DATA.couple.groom,
              ...(local.couple?.groom || {}),
              ...(serverData.couple?.groom || {}),
            },
            bride: {
              ...DEFAULT_INVITATION_DATA.couple.bride,
              ...(local.couple?.bride || {}),
              ...(serverData.couple?.bride || {}),
            },
          },
          general: {
            ...DEFAULT_INVITATION_DATA.general,
            ...(local.general || {}),
            ...(serverData.general || {}),
          },
          events:
            Array.isArray(serverData.events) && serverData.events.length > 0
              ? serverData.events
              : local.events,
          gifts: {
            ...DEFAULT_INVITATION_DATA.gifts,
            ...(local.gifts || {}),
            ...(serverData.gifts || {}),
          },
        };
        localStorage.setItem(INVITATION_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(
          new CustomEvent("wedding-data-changed", { detail: merged })
        );
      }
    }

    // 2. Sync Guests
    if (
      guestsRes.status === "fulfilled" &&
      guestsRes.value &&
      Array.isArray(guestsRes.value)
    ) {
      const serverGuests = guestsRes.value;
      localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(serverGuests));
      window.dispatchEvent(
        new CustomEvent("wedding-guests-changed", { detail: serverGuests })
      );
    }

    // 3. Sync Wishes
    if (
      wishesRes.status === "fulfilled" &&
      wishesRes.value &&
      Array.isArray(wishesRes.value)
    ) {
      const serverWishes = wishesRes.value;
      localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(serverWishes));
      window.dispatchEvent(
        new CustomEvent("wedding-wishes-changed", { detail: serverWishes })
      );
    }
  } catch (err) {
    console.warn("Backend sync notice (offline mode fallback):", err);
  } finally {
    isSyncing = false;
  }
}

// Inisialisasi auto-sync background saat client browser memuat modul
if (typeof window !== "undefined") {
  setTimeout(() => {
    syncWithBackend();
  }, 100);
}

export async function saveInvitationData(data: WeddingInvitationData): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(INVITATION_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("wedding-data-changed", { detail: data }));
    // Simpan ke backend secara terkonfirmasi
    const ok = await saveInvitationToBackend(data);
    return ok;
  } catch (err) {
    console.error("Gagal menyimpan invitation data:", err);
    return false;
  }
}

export function resetInvitationData(): WeddingInvitationData {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(INVITATION_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent("wedding-data-changed", { detail: DEFAULT_INVITATION_DATA })
      );
      saveInvitationToBackend(DEFAULT_INVITATION_DATA).catch((err) => {
        console.warn("Gagal mereset data undangan di backend:", err);
      });
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
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Gagal membaca tamu:", err);
  }
  return INITIAL_GUESTS;
}

function saveGuestsLocalOnly(guests: GuestItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));
    window.dispatchEvent(new CustomEvent("wedding-guests-changed", { detail: guests }));
  } catch (err) {
    console.error("Gagal menyimpan tamu:", err);
  }
}

export function saveGuests(guests: GuestItem[]): void {
  saveGuestsLocalOnly(guests);
}

function rememberSavedGuest(saved: GuestItem): GuestItem {
  const guests = getGuests();
  const previous = guests.find((guest) => guest.id === saved.id);
  const guest = { ...previous, ...saved };
  saveGuestsLocalOnly(previous
    ? guests.map((item) => item.id === guest.id ? guest : item)
    : [guest, ...guests]);
  return guest;
}

export async function saveGuestMaster(draft: GuestDraft, id?: string): Promise<GuestItem> {
  const error = getGuestInputError(draft);
  if (error) throw new Error(error);
  const saved = await saveGuestMasterToBackend({
    ...draft,
    name: draft.name.trim(),
    phone: normalizeGuestPhone(draft.phone),
    category: draft.category.trim() || "Lainnya",
    notes: draft.notes.trim(),
  }, id);
  return rememberSavedGuest(saved);
}

export async function setGuestSentStatus(id: string, isSent: boolean): Promise<GuestItem> {
  const saved = await saveGuestMasterToBackend({ isSent }, id);
  return rememberSavedGuest(saved);
}

export async function deleteGuestMaster(id: string): Promise<void> {
  await deleteGuestMasterFromBackend(id);
  saveGuestsLocalOnly(getGuests().filter((guest) => guest.id !== id));
}

export function addGuest(
  name: string,
  phone: string,
  category: GuestItem["category"],
  notes?: string,
  quota?: number
): GuestItem {
  const cleanName = name.trim();
  const slug = encodeURIComponent(cleanName).replace(/%20/g, "+");
  const cleanPhone = phone.trim().replace(/^0/, "62").replace(/[^0-9]/g, "");
  const guestQuota = Math.max(1, quota || 1);
  const newGuest: GuestItem = {
    id: "g_" + Date.now(),
    name: cleanName,
    slug,
    phone: cleanPhone,
    category,
    quota: guestQuota,
    isSent: false,
    notes: notes?.trim(),
    createdAt: new Date().toISOString(),
  };

  const list = [newGuest, ...getGuests()];
  saveGuestsLocalOnly(list);

  // Simpan ke backend secara asinkron
  addGuestToBackend({
    name: cleanName,
    phone: cleanPhone,
    category,
    notes: notes?.trim(),
    quota: guestQuota,
  } as any)
    .then((saved) => {
      if (saved && saved.id) {
        const current = getGuests().map((g) => (g.id === newGuest.id ? saved : g));
        saveGuestsLocalOnly(current);
      }
    })
    .catch((err) => {
      console.warn("Gagal menyimpan tamu ke backend:", err);
    });

  return newGuest;
}

export function deleteGuest(id: string): void {
  const list = getGuests().filter((g) => g.id !== id);
  saveGuestsLocalOnly(list);
  deleteGuestFromBackend(id).catch((err) => {
    console.warn("Gagal menghapus tamu di backend:", err);
  });
}

export function toggleGuestSent(id: string): void {
  let targetSentState = false;
  const list = getGuests().map((g) => {
    if (g.id === id) {
      targetSentState = !g.isSent;
      return { ...g, isSent: !g.isSent };
    }
    return g;
  });
  saveGuestsLocalOnly(list);
  updateGuestInBackend(id, { isSent: targetSentState }).catch((err) => {
    console.warn("Gagal memperbarui status kirim tamu di backend:", err);
  });
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

function saveWishesLocalOnly(wishes: WishMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
    window.dispatchEvent(new CustomEvent("wedding-wishes-changed", { detail: wishes }));
  } catch (err) {
    console.error("Gagal menyimpan ucapan:", err);
  }
}

export function saveWishes(wishes: WishMessage[]): void {
  saveWishesLocalOnly(wishes);
}

/**
 * Mengirim doa restu / RSVP baru ke store lokal dan backend database
 */
export function submitWish(wish: {
  name: string;
  relationship?: string;
  attendance?: string;
  message: string;
  guestId?: string;
}): WishMessage {
  const cleanName = wish.name.trim();
  const cleanMessage = wish.message.trim();
  const relationship = wish.relationship || "Tamu Undangan";
  const attendance = wish.attendance || "Hadir";

  const newWish: WishMessage = {
    id: "w_" + Date.now(),
    name: cleanName,
    relationship,
    attendance: attendance as any,
    message: cleanMessage,
    date: "Baru saja",
    createdAt: new Date().toISOString(),
  };

  const list = [newWish, ...getWishes()];
  saveWishesLocalOnly(list);

  // Simpan ke database backend
  addWishToBackend({
    name: cleanName,
    relationship,
    attendance,
    message: cleanMessage,
    guestId: wish.guestId,
  })
    .then((saved) => {
      if (saved && saved.id) {
        const current = getWishes().map((w) => (w.id === newWish.id ? saved : w));
        saveWishesLocalOnly(current);
      }
    })
    .catch((err) => {
      console.warn("Gagal menyimpan ucapan ke backend:", err);
    });

  return newWish;
}

export async function submitWishConfirmed(wish: Parameters<typeof submitWish>[0]): Promise<WishMessage> {
  const saved = await addWishToBackend({ name: wish.name.trim(), relationship: wish.relationship || "Tamu Undangan", attendance: wish.attendance || "Hadir", message: wish.message.trim(), guestId: wish.guestId });
  if (!saved?.id) throw new Error("Penyimpanan ucapan belum terkonfirmasi. Periksa koneksi sebelum mencoba lagi.");
  saveWishesLocalOnly([saved, ...getWishes().filter((item) => item.id !== saved.id)]);
  return saved;
}

export function deleteWish(id: string): void {
  const list = getWishes().filter((w) => w.id !== id);
  saveWishesLocalOnly(list);
  deleteWishFromBackend(id).catch((err) => {
    console.warn("Gagal menghapus ucapan di backend:", err);
  });
}

export function generateWhatsAppInvitationUrl(
  phone: string,
  guestName: string,
  coupleGroom: string,
  coupleBride: string,
  invitationWebUrl: string,
  eventDate?: string
): string {
  const cleanPhone = phone.replace(/^0/, "62").replace(/[^0-9]/g, "");
  const target = new URL(invitationWebUrl);
  if (!target.pathname.replace(/\/$/, "").endsWith("/undangan")) {
    target.pathname = `${target.pathname.replace(/\/$/, "")}/undangan`;
  }
  if (!target.searchParams.get("u")) target.searchParams.set("to", guestName);
  const personalUrl = target.toString();

  const message = [
    `Assalamu'alaikum Warahmatullahi Wabarakatuh`,
    ``,
    `Kepada Yth. *${guestName}*,`,
    `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dan memberikan doa restu pada hari pernikahan kami:`,
    ``,
    `💍 *The Wedding of ${coupleGroom} & ${coupleBride}*`,
    ...(eventDate ? [`📅 *${eventDate}*`] : []),
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
