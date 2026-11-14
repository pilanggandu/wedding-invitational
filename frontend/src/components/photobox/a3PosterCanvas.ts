import QRCode from "qrcode";

export type PosterPaperSize = "a3" | "a4" | "a5" | "a6" | "f4" | "5r" | "4r";
export type A3PosterTheme = "royal-maroon" | "paper-keepsake" | "korean-studio";

export interface PosterSizeConfig {
  id: PosterPaperSize;
  name: string;
  code: string;
  dimensionsMm: string;
  dimensionsCm: string;
  widthMm: number;
  heightMm: number;
  widthPx: number; // 300 DPI
  heightPx: number; // 300 DPI
  cssPageSize: string;
  category: "poster" | "standee" | "table" | "mini" | "frame";
  useCase: string;
  description: string;
  supportsA4MultiUp?: boolean;
  multiUpCount?: number;
  multiUpLabel?: string;
  multiUpPageSize?: string;
  multiUpOrientation?: "portrait" | "landscape";
}

export const POSTER_SIZES: Record<PosterPaperSize, PosterSizeConfig> = {
  a3: {
    id: "a3",
    name: "A3 Poster Standee",
    code: "A3",
    dimensionsMm: "297 × 420 mm",
    dimensionsCm: "29.7 × 42 cm",
    widthMm: 297,
    heightMm: 420,
    widthPx: 3508,
    heightPx: 4960,
    cssPageSize: "A3 portrait",
    category: "poster",
    useCase: "Standing Easel / Pintu Masuk / Welcome Board",
    description: "Ukuran poster besar utama untuk dipasang di easel/tripod dekat gate atau pintu masuk photobox.",
  },
  a4: {
    id: "a4",
    name: "A4 Standee Meja",
    code: "A4",
    dimensionsMm: "210 × 297 mm",
    dimensionsCm: "21 × 29.7 cm",
    widthMm: 210,
    heightMm: 297,
    widthPx: 2480,
    heightPx: 3508,
    cssPageSize: "A4 portrait",
    category: "standee",
    useCase: "Meja Registrasi / Standing Akrilik Sedang",
    description: "Ukuran paling populer dan praktis untuk meja penerima tamu, booth photobox, atau meja souvenir.",
  },
  a5: {
    id: "a5",
    name: "A5 Table Tent",
    code: "A5",
    dimensionsMm: "148 × 210 mm",
    dimensionsCm: "14.8 × 21 cm",
    widthMm: 148,
    heightMm: 210,
    widthPx: 1748,
    heightPx: 2480,
    cssPageSize: "A5 portrait",
    category: "table",
    useCase: "Tent Card Meja Makan / Table Top Stand",
    description: "Separuh dari ukuran A4. Ideal diletakkan di setiap meja tamu (round table) agar tamu dapat scan langsung.",
    supportsA4MultiUp: true,
    multiUpCount: 2,
    multiUpLabel: "2x A5 dalam 1 Lembar A4 (Hemat Kertas + Garis Potong)",
    multiUpPageSize: "A4 landscape",
    multiUpOrientation: "landscape",
  },
  a6: {
    id: "a6",
    name: "A6 Mini Card",
    code: "A6",
    dimensionsMm: "105 × 148 mm",
    dimensionsCm: "10.5 × 14.8 cm",
    widthMm: 105,
    heightMm: 148,
    widthPx: 1240,
    heightPx: 1748,
    cssPageSize: "A6 portrait",
    category: "mini",
    useCase: "Mini Akrilik / Kartu Meja Kecil / Souvenir",
    description: "Seperempat A4. Sangat kompak untuk nomor meja, akrilik mini L-shape, atau sisipan ucapan terima kasih.",
    supportsA4MultiUp: true,
    multiUpCount: 4,
    multiUpLabel: "4x A6 dalam 1 Lembar A4 (Kolase 4 Kartu Meja + Garis Potong)",
    multiUpPageSize: "A4 portrait",
    multiUpOrientation: "portrait",
  },
  f4: {
    id: "f4",
    name: "F4 / Folio Standee",
    code: "F4",
    dimensionsMm: "215 × 330 mm",
    dimensionsCm: "21.5 × 33 cm",
    widthMm: 215,
    heightMm: 330,
    widthPx: 2539,
    heightPx: 3898,
    cssPageSize: "215mm 330mm",
    category: "poster",
    useCase: "Kertas Folio / HVS Percetakan Indonesia",
    description: "Standar kertas percetakan dan fotokopi lokal Indonesia. Pas untuk cetak art paper/karton F4 tanpa terpotong.",
  },
  "5r": {
    id: "5r",
    name: "5R Frame Foto",
    code: "5R",
    dimensionsMm: "127 × 178 mm",
    dimensionsCm: "12.7 × 17.8 cm",
    widthMm: 127,
    heightMm: 178,
    widthPx: 1500,
    heightPx: 2102,
    cssPageSize: "127mm 178mm",
    category: "frame",
    useCase: "Bingkai Foto 5R (5 x 7 inci)",
    description: "Format bingkai foto meja dekorasi 5R yang estetik dan cocok dengan berbagai frame dekoratif.",
  },
  "4r": {
    id: "4r",
    name: "4R Frame Foto",
    code: "4R",
    dimensionsMm: "102 × 152 mm",
    dimensionsCm: "10.2 × 15.2 cm",
    widthMm: 102,
    heightMm: 152,
    widthPx: 1205,
    heightPx: 1795,
    cssPageSize: "102mm 152mm",
    category: "frame",
    useCase: "Bingkai Foto 4R (4 x 6 inci)",
    description: "Ukuran standar foto meja atau akrilik 4R yang umum tersedia di toko dekorasi pesta.",
  },
};

export interface PosterOptions {
  theme: A3PosterTheme;
  targetUrl: string;
  paperSize?: PosterPaperSize;
  multiUpOnA4?: boolean; // When true for A5/A6, generates multi-up sheet on A4 with cut marks
  weddingTitle?: string;
  coupleNames?: string;
  weddingDate?: string;
  hashtag?: string;
  passcode?: string;
  wifiInfo?: {
    enabled: boolean;
    ssid: string;
    password: string;
  };
}

// Backward compatibility alias
export type A3PosterOptions = PosterOptions;

// Master base resolution (A3 at 300 DPI)
export const MASTER_WIDTH = 3508;
export const MASTER_HEIGHT = 4960;
export const A3_WIDTH = MASTER_WIDTH;
export const A3_HEIGHT = MASTER_HEIGHT;

// A4 sheet dimensions at 300 DPI
export const A4_WIDTH = 2480;
export const A4_HEIGHT = 3508;

// Helper to load an HTMLImageElement safely
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

/**
 * Render the master high-resolution poster (3508 x 4960 px at 300 DPI)
 */
async function renderMasterPoster(
  options: PosterOptions
): Promise<HTMLCanvasElement> {
  const {
    theme,
    targetUrl,
    weddingTitle = "THE WEDDING CELEBRATION OF",
    coupleNames = "GILANG & SALSADILA",
    weddingDate = "Rabu, 28 Oktober 2026 • Jakarta",
    hashtag = "#GilangSalsaWedding",
    passcode = "2026",
    wifiInfo,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = MASTER_WIDTH;
  canvas.height = MASTER_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context");

  // QR Code colors
  const qrColorDark =
    theme === "royal-maroon"
      ? "#3E0F16"
      : theme === "paper-keepsake"
      ? "#2D2013"
      : "#18181B";

  const qrColorLight =
    theme === "royal-maroon"
      ? "#FAF6EE"
      : theme === "paper-keepsake"
      ? "#FFFDF9"
      : "#FFFFFF";

  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 1400,
    color: {
      dark: qrColorDark,
      light: qrColorLight,
    },
  });

  const qrImage = await loadImage(qrDataUrl);

  // Decorative assets
  let coupleArtImg: HTMLImageElement | null = null;
  let waxSealImg: HTMLImageElement | null = null;
  let ringsImg: HTMLImageElement | null = null;

  try {
    coupleArtImg = await loadImage("/images/paper-keepsake/couple-watercolor-keepsake.jpg");
  } catch {
    try {
      coupleArtImg = await loadImage("/images/prewedding/couple-1.jpg");
    } catch {
      // fallback
    }
  }

  try {
    waxSealImg = await loadImage("/images/paper-keepsake/real-gold-wax-seal.png");
  } catch {
    // fallback
  }

  try {
    ringsImg = await loadImage("/images/paper-keepsake/wedding-rings-closing-vignette.png");
  } catch {
    // fallback
  }

  // --- 1. RENDER BACKGROUND BASED ON THEME ---
  if (theme === "royal-maroon") {
    const bgGradient = ctx.createRadialGradient(
      MASTER_WIDTH / 2,
      MASTER_HEIGHT * 0.35,
      200,
      MASTER_WIDTH / 2,
      MASTER_HEIGHT * 0.5,
      3000
    );
    bgGradient.addColorStop(0, "#4A121A");
    bgGradient.addColorStop(0.55, "#300B11");
    bgGradient.addColorStop(1, "#180306");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, MASTER_WIDTH, MASTER_HEIGHT);

    // Golden floral / vintage dust
    ctx.save();
    ctx.fillStyle = "rgba(223, 210, 189, 0.02)";
    for (let x = 0; x < MASTER_WIDTH; x += 32) {
      for (let y = 0; y < MASTER_HEIGHT; y += 32) {
        if ((x + y) % 64 === 0) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();

    // Elegant Double Gold Filigree Border
    ctx.save();
    ctx.strokeStyle = "#DFD2BD";
    ctx.lineWidth = 8;
    ctx.strokeRect(100, 100, MASTER_WIDTH - 200, MASTER_HEIGHT - 200);

    ctx.strokeStyle = "rgba(223, 210, 189, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(130, 130, MASTER_WIDTH - 260, MASTER_HEIGHT - 260);

    drawCornerFlourish(ctx, 100, 100, 0, "#DFD2BD");
    drawCornerFlourish(ctx, MASTER_WIDTH - 100, 100, Math.PI / 2, "#DFD2BD");
    drawCornerFlourish(ctx, MASTER_WIDTH - 100, MASTER_HEIGHT - 100, Math.PI, "#DFD2BD");
    drawCornerFlourish(ctx, 100, MASTER_HEIGHT - 100, -Math.PI / 2, "#DFD2BD");
    ctx.restore();
  } else if (theme === "paper-keepsake") {
    ctx.fillStyle = "#FAF6EE";
    ctx.fillRect(0, 0, MASTER_WIDTH, MASTER_HEIGHT);

    ctx.fillStyle = "rgba(140, 98, 57, 0.015)";
    for (let x = 0; x < MASTER_WIDTH; x += 16) {
      for (let y = 0; y < MASTER_HEIGHT; y += 16) {
        if ((x * 7 + y * 13) % 23 === 0) {
          ctx.fillRect(x, y, 6, 6);
        }
      }
    }

    ctx.save();
    ctx.strokeStyle = "#8C6239";
    ctx.lineWidth = 6;
    ctx.strokeRect(100, 100, MASTER_WIDTH - 200, MASTER_HEIGHT - 200);

    ctx.strokeStyle = "rgba(197, 168, 128, 0.5)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(125, 125, MASTER_WIDTH - 250, MASTER_HEIGHT - 250);

    drawCornerFlourish(ctx, 100, 100, 0, "#8C6239");
    drawCornerFlourish(ctx, MASTER_WIDTH - 100, 100, Math.PI / 2, "#8C6239");
    drawCornerFlourish(ctx, MASTER_WIDTH - 100, MASTER_HEIGHT - 100, Math.PI, "#8C6239");
    drawCornerFlourish(ctx, 100, MASTER_HEIGHT - 100, -Math.PI / 2, "#8C6239");
    ctx.restore();
  } else {
    // Korean Studio Minimalist White
    ctx.fillStyle = "#FAF9F6";
    ctx.fillRect(0, 0, MASTER_WIDTH, MASTER_HEIGHT);

    ctx.save();
    ctx.strokeStyle = "#27272A";
    ctx.lineWidth = 6;
    ctx.strokeRect(110, 110, MASTER_WIDTH - 220, MASTER_HEIGHT - 220);

    ctx.strokeStyle = "#E4E4E7";
    ctx.lineWidth = 2;
    ctx.strokeRect(130, 130, MASTER_WIDTH - 260, MASTER_HEIGHT - 260);
    ctx.restore();
  }

  // --- 2. HEADER: WEDDING TITLE & COUPLE NAMES ---
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textColorPrimary =
    theme === "royal-maroon"
      ? "#FAF6EE"
      : theme === "paper-keepsake"
      ? "#3A2A1E"
      : "#18181B";

  const textColorAccent =
    theme === "royal-maroon"
      ? "#DFD2BD"
      : theme === "paper-keepsake"
      ? "#8C6239"
      : "#C99A45";

  const textColorMuted =
    theme === "royal-maroon"
      ? "rgba(223, 210, 189, 0.75)"
      : theme === "paper-keepsake"
      ? "#6D533B"
      : "#71717A";

  // Top Subheader
  ctx.fillStyle = textColorAccent;
  ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
  ctx.letterSpacing = "6px";
  ctx.fillText(`✦  ${weddingTitle}  ✦`, MASTER_WIDTH / 2, 280);

  // Couple Name (Large Regal Heading)
  ctx.fillStyle = textColorPrimary;
  ctx.font = "bold 130px 'Playfair Display', Georgia, serif";
  ctx.letterSpacing = "8px";
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = theme === "royal-maroon" ? 18 : 6;
  ctx.shadowOffsetY = 4;
  ctx.fillText(coupleNames, MASTER_WIDTH / 2, 420);
  ctx.shadowColor = "transparent";

  // Date & City Info
  ctx.fillStyle = textColorMuted;
  ctx.font = "500 48px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText(weddingDate, MASTER_WIDTH / 2, 530);

  // Decorative divider line
  ctx.strokeStyle = textColorAccent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(MASTER_WIDTH / 2 - 380, 590);
  ctx.lineTo(MASTER_WIDTH / 2 + 380, 590);
  ctx.stroke();

  // Diamond center on divider
  ctx.fillStyle = textColorAccent;
  ctx.beginPath();
  ctx.arc(MASTER_WIDTH / 2, 590, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- 3. COUPLE PORTRAIT MEDALLION ---
  const medallionCenterY = 960;
  const medallionRadius = 260;

  if (coupleArtImg) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;

    ctx.beginPath();
    ctx.arc(MASTER_WIDTH / 2, medallionCenterY, medallionRadius + 14, 0, Math.PI * 2);
    ctx.fillStyle = theme === "royal-maroon" ? "#DFD2BD" : "#8C6239";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(MASTER_WIDTH / 2, medallionCenterY, medallionRadius + 4, 0, Math.PI * 2);
    ctx.fillStyle = theme === "royal-maroon" ? "#2B070D" : "#FFFDF9";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(MASTER_WIDTH / 2, medallionCenterY, medallionRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      coupleArtImg,
      MASTER_WIDTH / 2 - medallionRadius,
      medallionCenterY - medallionRadius,
      medallionRadius * 2,
      medallionRadius * 2
    );
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(223, 210, 189, 0.8)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(MASTER_WIDTH / 2, medallionCenterY, medallionRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // --- 4. PHOTOBOX ANNOUNCEMENT HERO BANNER ---
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const heroBannerY = 1380;

  // Badge Pill "LIVE PHOTOBOOTH"
  ctx.save();
  const badgeWidth = 620;
  const badgeHeight = 76;
  const badgeX = MASTER_WIDTH / 2 - badgeWidth / 2;
  const badgeY = heroBannerY - 80;

  ctx.fillStyle = theme === "royal-maroon" ? "#DFD2BD" : "#4A121A";
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 38);
  ctx.fill();

  ctx.fillStyle = theme === "royal-maroon" ? "#3E0F16" : "#DFD2BD";
  ctx.font = "bold 36px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("📸  LIVE WEDDING PHOTOBOX", MASTER_WIDTH / 2, badgeY + badgeHeight / 2);
  ctx.restore();

  // Grand Invitation Headline
  ctx.fillStyle = textColorPrimary;
  ctx.font = "bold 96px 'Playfair Display', Georgia, serif";
  ctx.fillText("Abadikan Senyumanmu Bersama Kami", MASTER_WIDTH / 2, heroBannerY + 70);

  // Subtitle
  ctx.fillStyle = textColorAccent;
  ctx.font = "500 44px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText(
    "Arahkan kamera HP ke QR Code di bawah untuk berfoto langsung",
    MASTER_WIDTH / 2,
    heroBannerY + 160
  );
  ctx.restore();

  // --- 5. CENTRAL QR CODE CONTAINER CARD ---
  const cardWidth = 1860;
  const cardHeight = 2060;
  const cardX = MASTER_WIDTH / 2 - cardWidth / 2;
  const cardY = 1680;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;

  const cardBg =
    theme === "royal-maroon"
      ? "#FAF6EE"
      : theme === "paper-keepsake"
      ? "#FFFDF9"
      : "#FFFFFF";

  ctx.fillStyle = cardBg;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 48);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Card Outer Gold Border
  ctx.strokeStyle = theme === "royal-maroon" ? "#DFD2BD" : "#E8DFC8";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 48);
  ctx.stroke();

  // Card Inner Border
  ctx.strokeStyle = "rgba(140, 98, 57, 0.25)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(cardX + 24, cardY + 24, cardWidth - 48, cardHeight - 48, 36);
  ctx.stroke();
  ctx.restore();

  // Card Header: Step Instruction
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#3E0F16";
  ctx.font = "bold 52px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("SCAN DENGAN KAMERA HP", MASTER_WIDTH / 2, cardY + 120);

  ctx.fillStyle = "#785E46";
  ctx.font = "500 36px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Buka aplikasi Kamera / Google Lens pada smartphone Anda", MASTER_WIDTH / 2, cardY + 185);
  ctx.restore();

  // Draw QR Code
  const qrDisplaySize = 1260;
  const qrX = MASTER_WIDTH / 2 - qrDisplaySize / 2;
  const qrY = cardY + 245;

  ctx.save();
  ctx.drawImage(qrImage, qrX, qrY, qrDisplaySize, qrDisplaySize);

  // Center Emblem inside QR
  const emblemSize = 220;
  const emblemX = MASTER_WIDTH / 2 - emblemSize / 2;
  const emblemY = qrY + qrDisplaySize / 2 - emblemSize / 2;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = cardBg;
  ctx.beginPath();
  ctx.arc(MASTER_WIDTH / 2, qrY + qrDisplaySize / 2, emblemSize / 2 + 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#4A121A";
  ctx.lineWidth = 5;
  ctx.stroke();

  if (ringsImg) {
    ctx.drawImage(ringsImg, emblemX + 20, emblemY + 20, emblemSize - 40, emblemSize - 40);
  } else {
    ctx.fillStyle = "#4A121A";
    ctx.font = "bold 64px 'Playfair Display', Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("G & S", MASTER_WIDTH / 2, qrY + qrDisplaySize / 2);
  }
  ctx.restore();

  // Card Bottom Section: Friendly Feature Pills
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const featurePillsY = cardY + cardHeight - 240;
  const features = [
    "✨ 30+ Frame Desain",
    "⚡ Langsung di Browser",
    "🖨️ Cetak & Unduh HD",
    "🎁 100% Gratis",
  ];

  const totalFeatures = features.length;
  const pillSpacing = cardWidth / (totalFeatures + 1);

  features.forEach((feature, idx) => {
    const fx = cardX + pillSpacing * (idx + 1);
    ctx.save();
    ctx.fillStyle = "#F5EFE3";
    ctx.beginPath();
    ctx.roundRect(fx - 180, featurePillsY - 34, 360, 68, 34);
    ctx.fill();

    ctx.strokeStyle = "#DFD2BD";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#4A121A";
    ctx.font = "bold 30px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(feature, fx, featurePillsY);
    ctx.restore();
  });

  // URL & Passcode Display Box
  ctx.fillStyle = "#8C6239";
  ctx.font = "600 34px 'Courier New', monospace";
  const displayFooter = passcode
    ? `${targetUrl}   •   Passcode: ${passcode}`
    : targetUrl;
  ctx.fillText(displayFooter, MASTER_WIDTH / 2, cardY + cardHeight - 90);
  ctx.restore();

  // --- 6. OPTIONAL VENUE WIFI CARD ---
  if (wifiInfo && wifiInfo.enabled) {
    const wifiCardWidth = 1400;
    const wifiCardHeight = 160;
    const wifiCardX = MASTER_WIDTH / 2 - wifiCardWidth / 2;
    const wifiCardY = 3840;

    ctx.save();
    ctx.fillStyle =
      theme === "royal-maroon" ? "rgba(250, 246, 238, 0.12)" : "rgba(140, 98, 57, 0.1)";
    ctx.beginPath();
    ctx.roundRect(wifiCardX, wifiCardY, wifiCardWidth, wifiCardHeight, 28);
    ctx.fill();

    ctx.strokeStyle = textColorAccent;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColorPrimary;
    ctx.font = "bold 38px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(
      `📶 WiFi Acara: "${wifiInfo.ssid}"   •   Password: "${wifiInfo.password}"`,
      MASTER_WIDTH / 2,
      wifiCardY + wifiCardHeight / 2
    );
    ctx.restore();
  }

  // --- 7. HOW IT WORKS 3 EASY STEPS ---
  const stepsY = wifiInfo && wifiInfo.enabled ? 4080 : 3960;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const stepList = [
    {
      num: "1",
      title: "Scan QR & Masukkan Kode",
      desc: passcode
        ? `Arahkan kamera HP ke QR Code dan masukkan passcode ${passcode}`
        : "Arahkan kamera HP ke QR Code tanpa aplikasi tambahan",
    },
    { num: "2", title: "Pilih Frame & Pose", desc: "Pilih layout kolase dan pose bersama teman/pasangan" },
    { num: "3", title: "Simpan & Bagikan", desc: "Unduh foto hasil photobox resolusi tinggi ke galeri HP" },
  ];

  const colWidth = 980;
  const colCenters = [
    MASTER_WIDTH / 2 - 1050,
    MASTER_WIDTH / 2,
    MASTER_WIDTH / 2 + 1050,
  ];

  stepList.forEach((st, idx) => {
    const cx = colCenters[idx];
    ctx.save();
    ctx.fillStyle = theme === "royal-maroon" ? "#DFD2BD" : "#4A121A";
    ctx.beginPath();
    ctx.arc(cx, stepsY, 52, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = theme === "royal-maroon" ? "#3E0F16" : "#DFD2BD";
    ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
    ctx.fillText(st.num, cx, stepsY);

    ctx.fillStyle = textColorPrimary;
    ctx.font = "bold 46px 'Playfair Display', Georgia, serif";
    ctx.fillText(st.title, cx, stepsY + 95);

    ctx.fillStyle = textColorMuted;
    ctx.font = "500 32px 'Plus Jakarta Sans', sans-serif";
    wrapText(ctx, st.desc, cx, stepsY + 165, colWidth - 80, 44);
    ctx.restore();
  });
  ctx.restore();

  // --- 8. FOOTER: HASHTAG, WAX SEAL & GREETING ---
  const footerY = 4620;

  if (waxSealImg) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 18;
    ctx.drawImage(waxSealImg, MASTER_WIDTH / 2 - 80, footerY - 140, 160, 160);
    ctx.restore();
  }

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = textColorAccent;
  ctx.font = "bold 56px 'Playfair Display', Georgia, serif";
  ctx.letterSpacing = "4px";
  ctx.fillText(`Tag Momen Serumu: ${hashtag}`, MASTER_WIDTH / 2, footerY + 90);

  ctx.fillStyle = textColorMuted;
  ctx.font = "500 34px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText(
    "Terima kasih telah berbagi kebahagiaan dan mengabadikan kenangan bersama Gilang & Salsa",
    MASTER_WIDTH / 2,
    footerY + 170
  );
  ctx.restore();

  return canvas;
}

/**
 * Generate Multi-up Sheet on A4 Paper for smaller sizes (A5, A6)
 * Includes subtle cutting guide lines (tanda potong).
 */
async function generateMultiUpA4Canvas(
  masterCanvas: HTMLCanvasElement,
  paperSize: PosterPaperSize
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");

  if (paperSize === "a5") {
    // 2x A5 on A4 Landscape (3508 x 2480 px)
    canvas.width = A4_HEIGHT; // 3508
    canvas.height = A4_WIDTH; // 2480
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not acquire 2D canvas context");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const a5Width = canvas.width / 2; // 1754 px
    const a5Height = canvas.height; // 2480 px

    // Draw Left Copy
    ctx.drawImage(masterCanvas, 0, 0, a5Width, a5Height);

    // Draw Right Copy
    ctx.drawImage(masterCanvas, a5Width, 0, a5Width, a5Height);

    // Subtle Cut Line down the middle
    ctx.save();
    ctx.strokeStyle = "rgba(100, 100, 100, 0.45)";
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(a5Width, 0);
    ctx.lineTo(a5Width, canvas.height);
    ctx.stroke();

    // Cut Scissors Icons
    ctx.setLineDash([]);
    ctx.fillStyle = "#71717A";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✂", a5Width, 60);
    ctx.fillText("✂", a5Width, canvas.height / 2);
    ctx.fillText("✂", a5Width, canvas.height - 60);

    // Small guide text
    ctx.font = "500 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Garis Potong A5", a5Width, 105);
    ctx.restore();
  } else if (paperSize === "a6") {
    // 4x A6 on A4 Portrait (2480 x 3508 px) - 2x2 Grid
    canvas.width = A4_WIDTH; // 2480
    canvas.height = A4_HEIGHT; // 3508
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not acquire 2D canvas context");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const a6Width = canvas.width / 2; // 1240 px
    const a6Height = canvas.height / 2; // 1754 px

    // Draw 4 copies: Top-Left, Top-Right, Bottom-Left, Bottom-Right
    ctx.drawImage(masterCanvas, 0, 0, a6Width, a6Height);
    ctx.drawImage(masterCanvas, a6Width, 0, a6Width, a6Height);
    ctx.drawImage(masterCanvas, 0, a6Height, a6Width, a6Height);
    ctx.drawImage(masterCanvas, a6Width, a6Height, a6Width, a6Height);

    // Cutting Guide Lines (Cross)
    ctx.save();
    ctx.strokeStyle = "rgba(100, 100, 100, 0.45)";
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 12]);

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(a6Width, 0);
    ctx.lineTo(a6Width, canvas.height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, a6Height);
    ctx.lineTo(canvas.width, a6Height);
    ctx.stroke();

    // Scissors & labels
    ctx.setLineDash([]);
    ctx.fillStyle = "#71717A";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("✂", a6Width, 60);
    ctx.fillText("✂", a6Width, canvas.height - 60);
    ctx.fillText("✂", 60, a6Height);
    ctx.fillText("✂", canvas.width - 60, a6Height);
    ctx.fillText("✂", a6Width, a6Height);

    ctx.font = "500 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Garis Potong A6", a6Width, 105);
    ctx.fillText("Garis Potong A6", a6Width, a6Height + 45);
    ctx.restore();
  }

  return canvas;
}

/**
 * Generate poster canvas with specified paper size (A3, A4, A5, A6, F4, 5R, 4R)
 * and optional multi-up printing on standard A4 paper.
 */
export async function generatePosterCanvas(
  options: PosterOptions
): Promise<HTMLCanvasElement> {
  const paperSize = options.paperSize || "a3";
  const sizeConfig = POSTER_SIZES[paperSize] || POSTER_SIZES.a3;

  // 1. Render master artwork at full 3508 x 4960 px
  const masterCanvas = await renderMasterPoster(options);

  // 2. Check if user requested multi-up printing on A4 for smaller sizes
  if (options.multiUpOnA4 && (paperSize === "a5" || paperSize === "a6")) {
    return generateMultiUpA4Canvas(masterCanvas, paperSize);
  }

  // 3. For exact A3, return master directly
  if (paperSize === "a3") {
    return masterCanvas;
  }

  // 4. Downsample/scale cleanly to the exact target 300 DPI dimensions
  const targetCanvas = document.createElement("canvas");
  targetCanvas.width = sizeConfig.widthPx;
  targetCanvas.height = sizeConfig.heightPx;
  const targetCtx = targetCanvas.getContext("2d");
  if (!targetCtx) throw new Error("Could not acquire 2D canvas context for target size");

  targetCtx.imageSmoothingEnabled = true;
  targetCtx.imageSmoothingQuality = "high";

  // For sizes with matching or near-matching aspect ratios (A-series):
  if (paperSize === "a4" || paperSize === "a5" || paperSize === "a6") {
    targetCtx.drawImage(
      masterCanvas,
      0,
      0,
      masterCanvas.width,
      masterCanvas.height,
      0,
      0,
      targetCanvas.width,
      targetCanvas.height
    );
  } else {
    // For sizes like F4, 5R, 4R: fit proportionally without distortion
    const masterAspect = masterCanvas.width / masterCanvas.height;
    const targetAspect = targetCanvas.width / targetCanvas.height;

    // Fill background with theme color first
    const bgColor =
      options.theme === "royal-maroon"
        ? "#180306"
        : options.theme === "paper-keepsake"
        ? "#FAF6EE"
        : "#FAF9F6";
    targetCtx.fillStyle = bgColor;
    targetCtx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

    let renderW = targetCanvas.width;
    let renderH = targetCanvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (targetAspect > masterAspect) {
      // Target is wider than master
      renderW = targetCanvas.height * masterAspect;
      offsetX = (targetCanvas.width - renderW) / 2;
    } else {
      // Target is taller than master
      renderH = targetCanvas.width / masterAspect;
      offsetY = (targetCanvas.height - renderH) / 2;
    }

    targetCtx.drawImage(
      masterCanvas,
      0,
      0,
      masterCanvas.width,
      masterCanvas.height,
      offsetX,
      offsetY,
      renderW,
      renderH
    );
  }

  return targetCanvas;
}

/**
 * Backward compatibility function for existing callers
 */
export async function generateA3PosterCanvas(
  options: A3PosterOptions
): Promise<HTMLCanvasElement> {
  return generatePosterCanvas({
    ...options,
    paperSize: options.paperSize || "a3",
  });
}

// Helper to draw classic corner flourishes
function drawCornerFlourish(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(50, 50, 40, Math.PI, 1.5 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(40, 20);
  ctx.lineTo(46, 26);
  ctx.lineTo(40, 32);
  ctx.lineTo(34, 26);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Helper to wrap text cleanly
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
