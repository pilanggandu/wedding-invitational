export interface PhotoPlaceholderConfig {
  title: string;
  caption: string;
  aspectRatio: string;
  variant: "groom" | "bride" | "couple" | "rings" | "landscape" | "gallery" | "boba";
}

export interface GroomBrideInfo {
  name: string;
  fullName: string;
  tagline: string;
  bioFunny: string;
  parents: string;
  instagram: string;
  photoPlaceholder: PhotoPlaceholderConfig;
  photoUrl?: string;
}

export interface CalendarEventDetail {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface EventDetail {
  id: string;
  title: string;
  subTitle: string;
  badgeCute: string;
  colorTheme: "red" | "blue" | "yellow" | "green";
  dateStr: string;
  displayDate: string;
  displayDay: string;
  time: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  calendarEvent: CalendarEventDetail;
  isMain?: boolean;
  hostSide?: "wanita" | "pria" | "bersama";
  eventType?: "akad" | "resepsi_wanita" | "resepsi_pria" | "resepsi" | "ngunduh_mantu" | "custom" | string;
  note?: string;
}

export interface LoveStoryItem {
  year: string;
  title: string;
  story: string;
  cuteReaction: string;
  photoCaption: string;
  badgeColor: string;
}

export interface GalleryPhoto {
  id: number;
  caption: string;
  tag: string;
  doodleSticker: string;
  stickerBg: string;
  aspectRatio: "square" | "portrait" | "landscape";
  imageUrl?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoText: string;
  cuteLabel: string;
  cardColor: "gold" | "maroon";
}

export interface PhysicalGiftAddress {
  recipient: string;
  phone: string;
  address: string;
}

export interface DresscodeColor {
  name: string;
  hex: string;
}

export interface DresscodeConfig {
  description: string;
  colors: DresscodeColor[];
}

export interface WishMessage {
  id: string;
  name: string;
  relationship: string;
  attendance: string;
  message: string;
  date: string;
  createdAt?: string;
}

export interface GeneralWeddingInfo {
  hashtag: string;
  funTagline: string;
  musicTitle: string;
  musicArtist: string;
  musicUrl?: string;
  musicVolume?: number;
  photoboxPasscode?: string;
  quote: {
    arabic: string;
    translation: string;
    source: string;
  };
  openingGreetings: string;
  openingMessage: string;
  closingMessage: string;
  coverPhotoUrl?: string;
  heroPhotoUrl?: string;
  closingPhotoUrl?: string;
  backgroundPhotoUrl?: string;
  preweddingPhotos?: string[];
}

export interface ThemePaletteConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontStyle: string;
  headingFont?: string;
  bodyFont?: string;
  particlesEnabled: boolean;
  musicAutoplay: boolean;
  ambientColorMode?: "auto" | "custom";
  customAmbientColor?: string;
  paperColor?: string;
  colorSchemeId?: string;
}

export interface WeddingInvitationData {
  id: string;
  activeTemplateId: string;
  themePalette: ThemePaletteConfig;
  couple: {
    groom: GroomBrideInfo;
    bride: GroomBrideInfo;
  };
  general: GeneralWeddingInfo;
  countdownTarget: string;
  mainEventId?: string;
  events: EventDetail[];
  stories: LoveStoryItem[];
  gallery: GalleryPhoto[];
  gifts: {
    accounts: BankAccount[];
    physicalGiftAddress: PhysicalGiftAddress;
  };
  dresscode: DresscodeConfig;
  initialWishes: WishMessage[];
  updatedAt?: string;
  source?: string;
}

export interface GuestItem {
  id: string;
  name: string;
  slug: string;
  phone: string;
  category: "Keluarga" | "Sahabat" | "Rekan Kerja" | "VIP" | "Lainnya" | string;
  isSent: boolean;
  notes?: string;
  token?: string;
  quota?: number;
  invitationStatus?: number;
  openCount?: number;
  openedAt?: string;
  lastOpenedAt?: string;
  groupId?: number | null;
  rsvp?: {
    status: number;
    count: number;
  } | null;
  createdAt: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  category: "Paper Art" | "Modern Minimalist" | "Botanical" | "Urban Aesthetic" | "Classic Formal" | "Cinematic Romance" | "Artistic Painterly" | "Adaptive Dynamic";
  tag: string;
  badgeColor: string;
  previewGradient: string;
  accentHex: string;
  isAvailable: boolean;
}

/**
 * Mendapatkan acara utama (highlight) dari data undangan.
 * Prioritas:
 * 1. Target event override (misal dari URL query param ?event=...)
 * 2. mainEventId yang dipilih di pengaturan
 * 3. Event yang memiliki flag isMain: true
 * 4. Fallback ke acara pertama (events[0])
 */
export function getMainEvent(
  data?: WeddingInvitationData | null,
  targetEventId?: string | null
): EventDetail | undefined {
  if (!data?.events || data.events.length === 0) return undefined;

  // 1. URL parameter override (case-insensitive by id or title keyword)
  if (targetEventId) {
    const cleanTarget = targetEventId.trim().toLowerCase();
    const foundByParam = data.events.find(
      (e) =>
        e.id.toLowerCase() === cleanTarget ||
        e.title.toLowerCase().replace(/\s+/g, "-") === cleanTarget ||
        e.title.toLowerCase().includes(cleanTarget)
    );
    if (foundByParam) return foundByParam;
  }

  // 2. Explicit mainEventId from invitation data
  if (data.mainEventId) {
    const foundById = data.events.find((e) => e.id === data.mainEventId);
    if (foundById) return foundById;
  }

  // 3. Flag isMain: true
  const mainEvent = data.events.find((e) => e.isMain);
  if (mainEvent) return mainEvent;

  // 4. Fallback
  return data.events[0];
}

/**
 * Menghitung string ISO target countdown berdasarkan tanggal dan jam acara
 */
export function getEventCountdownTarget(event?: EventDetail): string {
  if (!event) return "2026-11-28T08:00:00+07:00";

  // Jika dateStr sudah berformat ISO lengkap dengan timestamp
  if (event.dateStr && event.dateStr.includes("T")) {
    return event.dateStr;
  }

  const baseDate = event.dateStr && /^\d{4}-\d{2}-\d{2}$/.test(event.dateStr)
    ? event.dateStr
    : "2026-11-28";

  // Coba ekstrak jam mulai dari field time (contoh: "08:00 - 10:00 WIB" atau "13:00 WIB")
  let timeStr = "08:00:00";
  if (event.time) {
    const match = event.time.match(/(\d{1,2})[:.](\d{2})/);
    if (match) {
      const hh = match[1].padStart(2, "0");
      const mm = match[2];
      timeStr = `${hh}:${mm}:00`;
    }
  }

  return `${baseDate}T${timeStr}+07:00`;
}
