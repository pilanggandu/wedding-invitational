import type { ThemePaletteConfig } from "../types/wedding";

export interface ColorPalettePreset {
  id: string;
  name: string;
  description: string;
  paperColor: string; // Background warna kartu / kertas sketsa
  primaryColor: string; // Background panggung mobile / utama
  secondaryColor: string; // Background desktop showcase / container luar
  accentColor: string; // Aksen ornamen / badge
  textColor: string; // Warna teks dalam kartu
  borderColor: string; // Garis putus-putus / border kartu
}

export const COLOR_PALETTE_PRESETS: ColorPalettePreset[] = [
  {
    id: "krem-mahogany",
    name: "Krem Mahogany",
    description: "Krem almond lembut (#F4E3C9) dengan kontras warm roasted mahogany (#49271B).",
    paperColor: "#F4E3C9",
    primaryColor: "#49271B",
    secondaryColor: "#361B12",
    accentColor: "#F2DFBA",
    textColor: "#3A210B",
    borderColor: "#49271B",
  },
  {
    id: "warm-ivory",
    name: "Warm Ivory",
    description: "Krem gading lembut klasik khas buku sketsa watercolor.",
    paperColor: "#F7EBE4",
    primaryColor: "#49271B",
    secondaryColor: "#361B12",
    accentColor: "#F2DFBA",
    textColor: "#3A210B",
    borderColor: "#49271B",
  },
  {
    id: "pure-white",
    name: "Pure White",
    description: "Kertas sketsa putih bersih kontras dengan latar mahogany pekat.",
    paperColor: "#FFFDFB",
    primaryColor: "#49271B",
    secondaryColor: "#361B12",
    accentColor: "#E5B869",
    textColor: "#3A210B",
    borderColor: "#49271B",
  },
  {
    id: "rustic-kraft",
    name: "Rustic Kraft",
    description: "Kertas daur ulang cokelat earthy vintage bersahaja.",
    paperColor: "#E2CBB7",
    primaryColor: "#3E1E17",
    secondaryColor: "#2A130E",
    accentColor: "#E5BE8A",
    textColor: "#2E130D",
    borderColor: "#4A2218",
  },
  {
    id: "dusty-rose",
    name: "Dusty Rose",
    description: "Nuansa mawar antik lembut berpadu deep burgundy romantis.",
    paperColor: "#DFC5BD",
    primaryColor: "#401824",
    secondaryColor: "#2D0E18",
    accentColor: "#F5CCD5",
    textColor: "#38121E",
    borderColor: "#521E2C",
  },
  {
    id: "sage-botanical",
    name: "Sage Botanical",
    description: "Kertas sage hijau sejuk dengan latar botanical forest teduh.",
    paperColor: "#D5DDD2",
    primaryColor: "#203025",
    secondaryColor: "#142118",
    accentColor: "#D8E2CE",
    textColor: "#1C2B20",
    borderColor: "#2C4232",
  },
  {
    id: "cinnamon-latte",
    name: "Cinnamon Latte",
    description: "Kombinasi kayu manis dan susu hangat bernuansa autumn.",
    paperColor: "#EBDBC8",
    primaryColor: "#4A2B20",
    secondaryColor: "#341D15",
    accentColor: "#F0E2CE",
    textColor: "#381D14",
    borderColor: "#5C3527",
  },
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    description: "Tema malam dramatis dengan kartu charcoal dan ornamen emas.",
    paperColor: "#2B2428",
    primaryColor: "#161215",
    secondaryColor: "#0F0B0E",
    accentColor: "#E6CA9E",
    textColor: "#F7EFE8",
    borderColor: "#574540",
  },
];

export function isDarkHex(hex?: string): boolean {
  if (!hex) return false;
  const clean = hex.replace("#", "");
  if (clean.length !== 6 && clean.length !== 3) return false;
  const r = parseInt(clean.length === 3 ? clean[0] + clean[0] : clean.substring(0, 2), 16);
  const g = parseInt(clean.length === 3 ? clean[1] + clean[1] : clean.substring(2, 4), 16);
  const b = parseInt(clean.length === 3 ? clean[2] + clean[2] : clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
}

export function resolveThemeColors(palette?: Partial<ThemePaletteConfig>) {
  const paperColor = palette?.paperColor || "#F4E3C9";
  const primaryColor = palette?.primaryColor || "#49271B";
  const secondaryColor = palette?.secondaryColor || "#361B12";
  const accentColor = palette?.accentColor || "#F2DFBA";

  const matchedPreset = COLOR_PALETTE_PRESETS.find(
    (p) =>
      p.paperColor.toLowerCase() === paperColor.toLowerCase() &&
      p.primaryColor.toLowerCase() === primaryColor.toLowerCase()
  ) || COLOR_PALETTE_PRESETS.find(
    (p) => p.paperColor.toLowerCase() === paperColor.toLowerCase()
  );

  const isDark = isDarkHex(paperColor);
  const textColor = matchedPreset?.textColor || (isDark ? "#F7EFE8" : "#3A210B");
  const borderColor = matchedPreset?.borderColor || (isDark ? "rgba(255,255,255,0.2)" : "#49271B");

  return {
    paperColor,
    primaryColor,
    secondaryColor,
    accentColor,
    textColor,
    borderColor,
    isDark,
    matchedPresetId: matchedPreset?.id || null,
  };
}
