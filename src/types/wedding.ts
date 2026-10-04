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
  attendance: "Hadir dong! 😋" | "Maaf belum bisa 🥺" | "Masih mikir-mikir 👀";
  message: string;
  date: string;
}

export interface GeneralWeddingInfo {
  hashtag: string;
  funTagline: string;
  musicTitle: string;
  musicArtist: string;
  quote: {
    arabic: string;
    translation: string;
    source: string;
  };
  openingGreetings: string;
  openingMessage: string;
  closingMessage: string;
}

export interface ThemePaletteConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontStyle: "caveat" | "dancing" | "great-vibes";
  particlesEnabled: boolean;
  musicAutoplay: boolean;
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
  events: EventDetail[];
  stories: LoveStoryItem[];
  gallery: GalleryPhoto[];
  gifts: {
    accounts: BankAccount[];
    physicalGiftAddress: PhysicalGiftAddress;
  };
  dresscode: DresscodeConfig;
  initialWishes: WishMessage[];
}

export interface GuestItem {
  id: string;
  name: string;
  slug: string;
  phone: string;
  category: "Keluarga" | "Sahabat" | "Rekan Kerja" | "VIP" | "Lainnya";
  isSent: boolean;
  notes?: string;
  createdAt: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  category: "Paper Art" | "Modern Minimalist" | "Botanical" | "Urban Aesthetic";
  tag: string;
  badgeColor: string;
  previewGradient: string;
  accentHex: string;
  isAvailable: boolean;
}
