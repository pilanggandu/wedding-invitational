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
