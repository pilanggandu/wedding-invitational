import type { PhotoboxFilter } from "./types";

export type PhotoboxFlowLayout = "strip-3" | "strip-2";

export const FILTER_CSS_MAP: Record<PhotoboxFilter, string> = {
  none: "none",
  original: "none",
  bw: "grayscale(1) contrast(1.22) brightness(1.04)",
  warm: "sepia(0.2) saturate(1.3) brightness(1.05) contrast(1.05)",
  pastel: "contrast(0.96) brightness(1.08) saturate(1.12)",
  vintage: "sepia(0.28) contrast(1.08) brightness(1.02) saturate(1.15)",
  moody: "contrast(1.25) brightness(0.95) saturate(1.18)",
  cold: "contrast(1.12) brightness(0.98) saturate(0.92)",
};

export const FILTER_PRESETS: { id: PhotoboxFilter; label: string; tone: string; desc: string }[] = [
  { id: "original", label: "Clean", tone: "Alami", desc: "Warna asli jernih" },
  { id: "bw", label: "B&W", tone: "Klasik", desc: "Hitam-putih retro elegan" },
  { id: "warm", label: "Warm", tone: "Hangat", desc: "Golden glow romantis" },
  { id: "pastel", label: "Korean", tone: "Pastel", desc: "Mencerahkan skin tone" },
  { id: "vintage", label: "Film", tone: "Analog", desc: "Tone kamera 35mm" },
  { id: "moody", label: "Moody", tone: "Sinematik", desc: "Kontras dalam artistik" },
];
