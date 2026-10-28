export type PhotoboxLayout =
  // Vertical Strips
  | "strip-1"
  | "strip-2"
  | "strip-3"
  | "strip-4"
  | "strip-5"
  | "strip-6"
  // Square & Collages
  | "grid-1"
  | "grid-2"
  | "grid-3"
  | "grid-4"
  | "grid-5"
  | "grid-6"
  | "grid-8"
  | "grid-9"
  // Backwards compatibility aliases
  | "4-strip"
  | "3-strip"
  | "2x2-grid"
  | "2-strip"
  | "polaroid";

export interface LayoutOption {
  id: PhotoboxLayout;
  type: "strip" | "grid";
  shots: number;
  name: string;
  badge?: string;
  description: string;
  tag: string;
}

export const LAYOUT_OPTIONS: LayoutOption[] = [
  // --- STRIP VERTIKAL (1 - 6) ---
  {
    id: "strip-1",
    type: "strip",
    shots: 1,
    name: "Strip 1 Foto",
    badge: "Solo",
    description: "Format strip 1 foto besar fokus dan minimalis",
    tag: "1 Pose",
  },
  {
    id: "strip-2",
    type: "strip",
    shots: 2,
    name: "Strip 2 Foto (Duo)",
    badge: "Duo",
    description: "2 foto vertikal bertingkat cocok untuk berpasangan",
    tag: "2 Pose",
  },
  {
    id: "strip-3",
    type: "strip",
    shots: 3,
    name: "Strip 3 Foto (Trio)",
    badge: "Klasik",
    description: "3 foto vertikal lebih tinggi dan lega",
    tag: "3 Pose",
  },
  {
    id: "strip-4",
    type: "strip",
    shots: 4,
    name: "Strip 4 Foto (4-Cut)",
    badge: "Populer",
    description: "Format 4-Cut ikonik khas studio photobox Korea",
    tag: "4 Pose",
  },
  {
    id: "strip-5",
    type: "strip",
    shots: 5,
    name: "Strip 5 Foto",
    badge: "Ekstra",
    description: "5 foto memanjang ke bawah untuk lebih banyak ekspresi",
    tag: "5 Pose",
  },
  {
    id: "strip-6",
    type: "strip",
    shots: 6,
    name: "Strip 6 Foto (Mega)",
    badge: "Maksimal",
    description: "Strip panjang 6 foto dengan gaya photo booth lengkap",
    tag: "6 Pose",
  },

  // --- KOTAK / KOLASE GRID (1 - 9) ---
  {
    id: "grid-1",
    type: "grid",
    shots: 1,
    name: "Kotak 1 Foto (Square)",
    badge: "1:1",
    description: "Format kartu bujur sangkar 1 foto estetik",
    tag: "1 Pose",
  },
  {
    id: "grid-2",
    type: "grid",
    shots: 2,
    name: "Kotak 2 Foto (Side-by-Side)",
    badge: "2 Kolom",
    description: "2 foto berdampingan kiri & kanan",
    tag: "2 Pose",
  },
  {
    id: "grid-3",
    type: "grid",
    shots: 3,
    name: "Kotak 3 Foto (Hero + Duo)",
    badge: "Trio",
    description: "1 foto utama lebar di atas + 2 foto grid di bawah",
    tag: "3 Pose",
  },
  {
    id: "grid-4",
    type: "grid",
    shots: 4,
    name: "Kotak 4 Foto (2x2 Quad)",
    badge: "Favorit",
    description: "Kolase kotak modern 4 foto (2 kolom x 2 baris)",
    tag: "4 Pose",
  },
  {
    id: "grid-5",
    type: "grid",
    shots: 5,
    name: "Kotak 5 Foto (Hero + 4)",
    badge: "Kolase 5",
    description: "1 foto banner atas + 4 foto grid bawah",
    tag: "5 Pose",
  },
  {
    id: "grid-6",
    type: "grid",
    shots: 6,
    name: "Kotak 6 Foto (2x3 Grid)",
    badge: "6 Kolase",
    description: "6 foto kotak rapi: 2 kolom x 3 baris",
    tag: "6 Pose",
  },
  {
    id: "grid-8",
    type: "grid",
    shots: 8,
    name: "Kotak 8 Foto (2x4 Grid)",
    badge: "8 Kolase",
    description: "8 foto dalam format galeri mini 2 kolom x 4 baris",
    tag: "8 Pose",
  },
  {
    id: "grid-9",
    type: "grid",
    shots: 9,
    name: "Kotak 9 Foto (3x3 Grid)",
    badge: "Instagram 3x3",
    description: "Kolase penuh 9 foto gaya grid feed Instagram",
    tag: "9 Pose",
  },
];

export function getLayoutShotsCount(layout: PhotoboxLayout): number {
  switch (layout) {
    case "strip-1":
    case "grid-1":
    case "polaroid":
      return 1;
    case "strip-2":
    case "grid-2":
    case "2-strip":
      return 2;
    case "strip-3":
    case "grid-3":
    case "3-strip":
      return 3;
    case "strip-4":
    case "grid-4":
    case "4-strip":
    case "2x2-grid":
      return 4;
    case "strip-5":
    case "grid-5":
      return 5;
    case "strip-6":
    case "grid-6":
      return 6;
    case "grid-8":
      return 8;
    case "grid-9":
      return 9;
    default:
      return 4;
  }
}

export function isGridLayout(layout: PhotoboxLayout): boolean {
  return (
    layout.startsWith("grid-") ||
    layout === "2x2-grid"
  );
}

export type PhotoboxFilter =
  | "none"
  | "vintage"
  | "bw"
  | "warm"
  | "pastel"
  | "cold"
  | "moody";

export type TemplateCategory =
  | "all"
  | "korean"
  | "wedding"
  | "retro"
  | "cute"
  | "editorial";

export interface StickerItem {
  id: string;
  emoji: string;
  imageUrl?: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  scale: number;
  rotation: number;
}

export interface CouplePhotoSticker {
  id: string;
  title: string;
  imageUrl: string;
  type: "couple" | "groom" | "bride" | "stamp" | "seal";
}

export const COUPLE_PHOTO_STICKERS: CouplePhotoSticker[] = [
  {
    id: "cps-watercolor",
    title: "Lukisan Cat Air Gilang & Salsa",
    imageUrl: "/images/paper-keepsake/couple-watercolor-keepsake.jpg",
    type: "couple",
  },
  {
    id: "cps-prewed-1",
    title: "Foto Prewedding Romantis",
    imageUrl: "/images/prewedding/couple-1.jpg",
    type: "couple",
  },
  {
    id: "cps-prewed-2",
    title: "Foto Gilang & Salsa Senyum",
    imageUrl: "/images/prewedding/couple-2.jpg",
    type: "couple",
  },
  {
    id: "cps-prewed-3",
    title: "Gilang & Salsa Bersama",
    imageUrl: "/images/prewedding/couple-5.jpg",
    type: "couple",
  },
  {
    id: "cps-cats-couple",
    title: "Kartun Kucing Pengantin",
    imageUrl: "/images/cats/cats-couple.png",
    type: "couple",
  },
  {
    id: "cps-cat-groom",
    title: "Kucing Groom Gilang",
    imageUrl: "/images/cats/orange-cat-groom.png",
    type: "groom",
  },
  {
    id: "cps-cat-bride",
    title: "Kucing Bride Salsa",
    imageUrl: "/images/cats/white-cat-bride.png",
    type: "bride",
  },
  {
    id: "cps-gold-wax-seal",
    title: "Segel Emas Pernikahan",
    imageUrl: "/images/paper-keepsake/real-gold-wax-seal.png",
    type: "seal",
  },
  {
    id: "cps-pressed-flower",
    title: "Bunga Kering Asli",
    imageUrl: "/images/paper-keepsake/real-pressed-corner-cute.png",
    type: "seal",
  },
  {
    id: "cps-silk-bow",
    title: "Pita Sutra Pengantin",
    imageUrl: "/images/paper-keepsake/real-cute-silk-bow.png",
    type: "seal",
  },
];

export interface PhotoboxTemplate {
  id: string;
  name: string;
  category: "korean" | "wedding" | "retro" | "cute" | "editorial";
  description: string;
  badge?: string;
  // Generated photo of the bride & groom decoration on the frame
  coupleBadge?: {
    imageUrl: string;
    title?: string;
    subtitle?: string;
    position?: "header" | "footer" | "top-right" | "bottom-right";
    shape?: "circle" | "oval" | "polaroid" | "stamp" | "cutout";
  };
  // Visual styling
  bgColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  textColor: string;
  subtextColor: string;
  accentColor: string;
  fontFamily: "sans" | "serif" | "handwriting" | "mono" | "calligraphy";
  // Custom decoration details
  themeStyle: {
    paperTexture?: boolean;
    filmSprockets?: boolean;
    headerTitle?: string;
    headerSubtitle?: string;
    footerTitle?: string;
    footerSubtitle?: string;
    cornerStyle?: "sharp" | "rounded" | "cut";
    innerPadding?: number;
    photoGap?: number;
    photoRadius?: number;
    shadowStyle?: string;
    watermarkIcon?: string;
    patternType?: "none" | "dots" | "checker" | "stars" | "grid-fine" | "stripes";
  };
}

export interface PhotoboxSettings {
  layout: PhotoboxLayout;
  selectedTemplateId: string;
  filter: PhotoboxFilter;
  customTitle: string;
  customSubtitle: string;
  showDate: boolean;
  customDate: string;
  customBgColor?: string; // override option
  stickers: StickerItem[];
}
