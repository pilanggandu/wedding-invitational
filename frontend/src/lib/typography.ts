export type TypographyCategory =
  | "all"
  | "calligraphy"
  | "handwriting"
  | "serif"
  | "modern";

export interface TypographyOption {
  id: string;
  name: string;
  category: "calligraphy" | "handwriting" | "serif" | "modern";
  fontFamily: string;
  fontClass: string;
  description: string;
  vibe: string;
  sampleText: string;
  bestFor: string;
  badge?: string;
}

export const TYPOGRAPHY_OPTIONS: TypographyOption[] = [
  // 1. Kaligrafi & Kursif Mewah
  {
    id: "great-vibes",
    name: "Great Vibes",
    category: "calligraphy",
    fontFamily: "'Great Vibes', cursive",
    fontClass: "font-great-vibes",
    description: "Lengkungan kursif formal klasik dengan ornamen flourish megah dan anggun.",
    vibe: "Formal, Anggun, Royal",
    sampleText: "Gilang & Salsadila",
    bestFor: "Royal Heritage & Resepsi Formal",
    badge: "Klasik Populer",
  },
  {
    id: "pinyon",
    name: "Pinyon Script",
    category: "calligraphy",
    fontFamily: "'Pinyon Script', cursive",
    fontClass: "font-pinyon",
    description: "Kemewahan aristokrat dengan kemiringan tinggi (high-slant) dan goresan tajam berwibawa.",
    vibe: "Aristokrat, Mewah, Eksklusif",
    sampleText: "Gilang & Salsadila",
    bestFor: "Tema Royal Heritage",
    badge: "High-End",
  },
  {
    id: "alex-brush",
    name: "Alex Brush",
    category: "calligraphy",
    fontFamily: "'Alex Brush', cursive",
    fontClass: "font-alex-brush",
    description: "Kursif pita mengalir mulus dengan keterbacaan tinggi dan kesan romantis manis.",
    vibe: "Romantis, Bersih, Luwes",
    sampleText: "Gilang & Salsadila",
    bestFor: "Semua Tema Undangan",
    badge: "Favorit",
  },
  {
    id: "allura",
    name: "Allura",
    category: "calligraphy",
    fontFamily: "'Allura', cursive",
    fontClass: "font-allura",
    description: "Kaligrafi modern dengan goresan feminin yang lembut, ramping, dan elegan.",
    vibe: "Feminin, Lembut, Manis",
    sampleText: "Gilang & Salsadila",
    bestFor: "Tema Romantis & Minimalis",
  },
  {
    id: "parisienne",
    name: "Parisienne",
    category: "calligraphy",
    fontFamily: "'Parisienne', cursive",
    fontClass: "font-parisienne",
    description: "Kursif vintage Prancis dengan irama huruf yang riang namun tetap santun.",
    vibe: "Vintage Chic, Klasik Eropa",
    sampleText: "Gilang & Salsadila",
    bestFor: "Tema Aesthetic & Romantis",
  },
  {
    id: "sacramento",
    name: "Sacramento",
    category: "calligraphy",
    fontFamily: "'Sacramento', cursive",
    fontClass: "font-sacramento",
    description: "Kaligrafi monoline ramping dengan estetika semi-konektif modern yang bersahaja.",
    vibe: "Ramping, Modern, Artistik",
    sampleText: "Gilang & Salsadila",
    bestFor: "Tema Modern & Minimalis",
  },

  // 2. Handwritten & Organik Hangat
  {
    id: "caveat",
    name: "Caveat",
    category: "handwriting",
    fontFamily: "'Caveat', cursive",
    fontClass: "font-caveat",
    description: "Gaya tulisan tangan santai dan hangat, merefleksikan catatan buku sketsa organik.",
    vibe: "Hangat, Natural, Kreatif",
    sampleText: "Gilang & Salsadila",
    bestFor: "Tema 2D Paper Art Craft",
    badge: "Default Paper Art",
  },
  {
    id: "dancing",
    name: "Dancing Script",
    category: "handwriting",
    fontFamily: "'Dancing Script', cursive",
    fontClass: "font-dancing",
    description: "Kursif dinamis dengan ritme membal (bouncy) yang menyenangkan dan hidup.",
    vibe: "Ceria, Bersahabat, Segar",
    sampleText: "Gilang & Salsadila",
    bestFor: "Tema Paper Art & Cerita Cinta",
  },
  {
    id: "marck",
    name: "Marck Script",
    category: "handwriting",
    fontFamily: "'Marck Script', cursive",
    fontClass: "font-marck",
    description: "Karakter tulisan pulpen felt-tip alami layaknya coretan surat cinta pribadi.",
    vibe: "Personal, Otentik, Lembut",
    sampleText: "Gilang & Salsadila",
    bestFor: "Tema Surat & Cerita Cinta",
  },
  {
    id: "pacifico",
    name: "Pacifico",
    category: "handwriting",
    fontFamily: "'Pacifico', cursive",
    fontClass: "font-pacifico",
    description: "Karakter brush tebal retro yang hangat dan berani memberikan aksen kuat.",
    vibe: "Berani, Retro, Menyenangkan",
    sampleText: "Gilang & Salsadila",
    bestFor: "Aksen Judul & Tagline",
  },

  // 3. Serif Klasik & Editorial Kerajaan
  {
    id: "cinzel",
    name: "Cinzel Royal",
    category: "serif",
    fontFamily: "'Cinzel', serif",
    fontClass: "font-cinzel",
    description: "Tipografi huruf kapital prasasti Romawi klasik, sangat megah untuk inisial dan tajuk agung.",
    vibe: "Megah, Monumental, Berwibawa",
    sampleText: "GILANG & SALSADILA",
    bestFor: "Tema Royal Heritage",
    badge: "Direkomendasikan",
  },
  {
    id: "cormorant",
    name: "Cormorant Garamond",
    category: "serif",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontClass: "font-cormorant",
    description: "Serif tradisional bangsawan dengan proporsi tinggi ramping dan detail halus.",
    vibe: "Bangsawan, Puitis, Abadi",
    sampleText: "Gilang & Salsadila",
    bestFor: "Tema Formal & Royal Heritage",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    category: "serif",
    fontFamily: "'Playfair Display', Georgia, serif",
    fontClass: "font-playfair",
    description: "Serif editorial dengan kontras tebal-tipis tegas yang menghadirkan aura mewah majalah.",
    vibe: "Dramatis, Mewah, Editorial",
    sampleText: "Gilang & Salsadila",
    bestFor: "Judul Acara & Undangan Formal",
  },
  {
    id: "prata",
    name: "Prata Didone",
    category: "serif",
    fontFamily: "'Prata', Georgia, serif",
    fontClass: "font-prata",
    description: "Serif bergaya Didone elegan dengan teardrop terminals yang sangat artistik.",
    vibe: "Artistik, Haute Couture, Elegan",
    sampleText: "Gilang & Salsadila",
    bestFor: "Undangan Elegan & Modern",
  },
  {
    id: "lora",
    name: "Lora Calligraphic",
    category: "serif",
    fontFamily: "'Lora', Georgia, serif",
    fontClass: "font-lora",
    description: "Serif kontemporer dengan akar kaligrafi yang seimbang dan sangat nyaman dibaca.",
    vibe: "Seimbang, Bersahabat, Anggun",
    sampleText: "Gilang & Salsadila",
    bestFor: "Teks Undangan & Kutipan",
  },

  // 4. Modern & Minimalis
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    category: "modern",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontClass: "font-jakarta",
    description: "Sans-serif geometris modern dengan kejelasan baca maksimal di layar gadget.",
    vibe: "Modern, Jernih, Bersih",
    sampleText: "Gilang & Salsadila",
    bestFor: "Informasi Tanggal & Alamat",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    category: "modern",
    fontFamily: "'Montserrat', sans-serif",
    fontClass: "font-montserrat",
    description: "Tipografi urban modern dengan geometri kokoh yang serasi untuk tema perkotaan.",
    vibe: "Urban, Arsitektural, Tegas",
    sampleText: "GILANG & SALSADILA",
    bestFor: "Tema Cityscape Skyline",
  },
];

export function getTypographyById(id?: string): TypographyOption {
  if (!id) return TYPOGRAPHY_OPTIONS[0];
  const found = TYPOGRAPHY_OPTIONS.find((t) => t.id === id);
  return found || TYPOGRAPHY_OPTIONS[0];
}

export function getFontFamilyCss(id?: string): string {
  const typo = getTypographyById(id);
  return typo.fontFamily;
}

export function getFontClass(id?: string): string {
  const typo = getTypographyById(id);
  return typo.fontClass;
}
