import QRCode from "qrcode";

export type A3PosterTheme = "royal-maroon" | "paper-keepsake" | "korean-studio";

export interface A3PosterOptions {
  theme: A3PosterTheme;
  targetUrl: string;
  weddingTitle?: string;
  coupleNames?: string;
  weddingDate?: string;
  hashtag?: string;
  wifiInfo?: {
    enabled: boolean;
    ssid: string;
    password: string;
  };
}

// Standard A3 dimensions at 300 DPI: 3508 x 4960 pixels
export const A3_WIDTH = 3508;
export const A3_HEIGHT = 4960;

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
 * Generate high-resolution A3 Poster (3508 x 4960 px at 300 DPI)
 * tailored to the wedding theme of Gilang & Salsadila.
 */
export async function generateA3PosterCanvas(
  options: A3PosterOptions
): Promise<HTMLCanvasElement> {
  const {
    theme,
    targetUrl,
    weddingTitle = "THE WEDDING CELEBRATION OF",
    coupleNames = "GILANG & SALSADILA",
    weddingDate = "Rabu, 28 Oktober 2026 • Jakarta",
    hashtag = "#GilangSalsaWedding",
    wifiInfo,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = A3_WIDTH;
  canvas.height = A3_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context");

  // Generate QR Code data URL with high error correction (level 'H')
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

  // Load decorative assets
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
    // Royal Deep Burgundy Gradient
    const bgGradient = ctx.createRadialGradient(
      A3_WIDTH / 2,
      A3_HEIGHT * 0.35,
      200,
      A3_WIDTH / 2,
      A3_HEIGHT * 0.5,
      3000
    );
    bgGradient.addColorStop(0, "#4A121A");
    bgGradient.addColorStop(0.55, "#300B11");
    bgGradient.addColorStop(1, "#180306");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, A3_WIDTH, A3_HEIGHT);

    // Subtle golden floral / vintage paper dust pattern
    ctx.save();
    ctx.fillStyle = "rgba(223, 210, 189, 0.02)";
    for (let x = 0; x < A3_WIDTH; x += 32) {
      for (let y = 0; y < A3_HEIGHT; y += 32) {
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
    ctx.strokeRect(100, 100, A3_WIDTH - 200, A3_HEIGHT - 200);

    ctx.strokeStyle = "rgba(223, 210, 189, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(130, 130, A3_WIDTH - 260, A3_HEIGHT - 260);

    // Corner flourishes
    drawCornerFlourish(ctx, 100, 100, 0, "#DFD2BD");
    drawCornerFlourish(ctx, A3_WIDTH - 100, 100, Math.PI / 2, "#DFD2BD");
    drawCornerFlourish(ctx, A3_WIDTH - 100, A3_HEIGHT - 100, Math.PI, "#DFD2BD");
    drawCornerFlourish(ctx, 100, A3_HEIGHT - 100, -Math.PI / 2, "#DFD2BD");
    ctx.restore();
  } else if (theme === "paper-keepsake") {
    // Warm Antique Ivory Deckle Paper
    ctx.fillStyle = "#FAF6EE";
    ctx.fillRect(0, 0, A3_WIDTH, A3_HEIGHT);

    // Paper texture simulation
    ctx.fillStyle = "rgba(140, 98, 57, 0.015)";
    for (let x = 0; x < A3_WIDTH; x += 16) {
      for (let y = 0; y < A3_HEIGHT; y += 16) {
        if ((x * 7 + y * 13) % 23 === 0) {
          ctx.fillRect(x, y, 6, 6);
        }
      }
    }

    // Double warm brown & gold frame
    ctx.save();
    ctx.strokeStyle = "#8C6239";
    ctx.lineWidth = 6;
    ctx.strokeRect(100, 100, A3_WIDTH - 200, A3_HEIGHT - 200);

    ctx.strokeStyle = "rgba(197, 168, 128, 0.5)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(125, 125, A3_WIDTH - 250, A3_HEIGHT - 250);

    drawCornerFlourish(ctx, 100, 100, 0, "#8C6239");
    drawCornerFlourish(ctx, A3_WIDTH - 100, 100, Math.PI / 2, "#8C6239");
    drawCornerFlourish(ctx, A3_WIDTH - 100, A3_HEIGHT - 100, Math.PI, "#8C6239");
    drawCornerFlourish(ctx, 100, A3_HEIGHT - 100, -Math.PI / 2, "#8C6239");
    ctx.restore();
  } else {
    // Korean Studio Minimalist White
    ctx.fillStyle = "#FAF9F6";
    ctx.fillRect(0, 0, A3_WIDTH, A3_HEIGHT);

    // Sleek architectural border
    ctx.save();
    ctx.strokeStyle = "#27272A";
    ctx.lineWidth = 6;
    ctx.strokeRect(110, 110, A3_WIDTH - 220, A3_HEIGHT - 220);

    ctx.strokeStyle = "#E4E4E7";
    ctx.lineWidth = 2;
    ctx.strokeRect(130, 130, A3_WIDTH - 260, A3_HEIGHT - 260);
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
  ctx.fillText(`✦  ${weddingTitle}  ✦`, A3_WIDTH / 2, 280);

  // Couple Name (Large Regal Heading)
  ctx.fillStyle = textColorPrimary;
  ctx.font = "bold 130px 'Playfair Display', Georgia, serif";
  ctx.letterSpacing = "8px";
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = theme === "royal-maroon" ? 18 : 6;
  ctx.shadowOffsetY = 4;
  ctx.fillText(coupleNames, A3_WIDTH / 2, 420);
  ctx.shadowColor = "transparent";

  // Date & City Info
  ctx.fillStyle = textColorMuted;
  ctx.font = "500 48px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText(weddingDate, A3_WIDTH / 2, 530);

  // Decorative divider line
  ctx.strokeStyle = textColorAccent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(A3_WIDTH / 2 - 380, 590);
  ctx.lineTo(A3_WIDTH / 2 + 380, 590);
  ctx.stroke();

  // Diamond center on divider
  ctx.fillStyle = textColorAccent;
  ctx.beginPath();
  ctx.arc(A3_WIDTH / 2, 590, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- 3. COUPLE PORTRAIT MEDALLION (High Art) ---
  const medallionCenterY = 960;
  const medallionRadius = 260;

  if (coupleArtImg) {
    ctx.save();
    // Glowing drop shadow for medallion
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;

    // Outer gold medallion ring
    ctx.beginPath();
    ctx.arc(A3_WIDTH / 2, medallionCenterY, medallionRadius + 14, 0, Math.PI * 2);
    ctx.fillStyle = theme === "royal-maroon" ? "#DFD2BD" : "#8C6239";
    ctx.fill();

    // Inner ring
    ctx.beginPath();
    ctx.arc(A3_WIDTH / 2, medallionCenterY, medallionRadius + 4, 0, Math.PI * 2);
    ctx.fillStyle = theme === "royal-maroon" ? "#2B070D" : "#FFFDF9";
    ctx.fill();

    // Clip image inside circle
    ctx.beginPath();
    ctx.arc(A3_WIDTH / 2, medallionCenterY, medallionRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      coupleArtImg,
      A3_WIDTH / 2 - medallionRadius,
      medallionCenterY - medallionRadius,
      medallionRadius * 2,
      medallionRadius * 2
    );
    ctx.restore();

    // Subtle inner shadow / border ring
    ctx.save();
    ctx.strokeStyle = "rgba(223, 210, 189, 0.8)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(A3_WIDTH / 2, medallionCenterY, medallionRadius, 0, Math.PI * 2);
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
  const badgeX = A3_WIDTH / 2 - badgeWidth / 2;
  const badgeY = heroBannerY - 80;

  ctx.fillStyle = theme === "royal-maroon" ? "#DFD2BD" : "#4A121A";
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 38);
  ctx.fill();

  ctx.fillStyle = theme === "royal-maroon" ? "#3E0F16" : "#DFD2BD";
  ctx.font = "bold 36px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("📸  LIVE WEDDING PHOTOBOX", A3_WIDTH / 2, badgeY + badgeHeight / 2);
  ctx.restore();

  // Grand Invitation Headline
  ctx.fillStyle = textColorPrimary;
  ctx.font = "bold 96px 'Playfair Display', Georgia, serif";
  ctx.fillText("Abadikan Senyumanmu Bersama Kami", A3_WIDTH / 2, heroBannerY + 70);

  // Subtitle
  ctx.fillStyle = textColorAccent;
  ctx.font = "500 44px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText(
    "Arahkan kamera HP ke QR Code di bawah untuk berfoto langsung",
    A3_WIDTH / 2,
    heroBannerY + 160
  );
  ctx.restore();

  // --- 5. CENTRAL QR CODE CONTAINER CARD ---
  const cardWidth = 1860;
  const cardHeight = 2060;
  const cardX = A3_WIDTH / 2 - cardWidth / 2;
  const cardY = 1680;

  ctx.save();
  // Card Drop Shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;

  // Card Background
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
  ctx.fillText("SCAN DENGAN KAMERA HP", A3_WIDTH / 2, cardY + 120);

  ctx.fillStyle = "#785E46";
  ctx.font = "500 36px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Buka aplikasi Kamera / Google Lens pada smartphone Anda", A3_WIDTH / 2, cardY + 185);
  ctx.restore();

  // Draw QR Code
  const qrDisplaySize = 1260;
  const qrX = A3_WIDTH / 2 - qrDisplaySize / 2;
  const qrY = cardY + 245;

  ctx.save();
  // Rounded clipping or crisp rendering for QR
  ctx.drawImage(qrImage, qrX, qrY, qrDisplaySize, qrDisplaySize);

  // Center Emblem inside QR (using error correction headroom)
  const emblemSize = 220;
  const emblemX = A3_WIDTH / 2 - emblemSize / 2;
  const emblemY = qrY + qrDisplaySize / 2 - emblemSize / 2;

  // White / ivory emblem backing
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = cardBg;
  ctx.beginPath();
  ctx.arc(A3_WIDTH / 2, qrY + qrDisplaySize / 2, emblemSize / 2 + 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#4A121A";
  ctx.lineWidth = 5;
  ctx.stroke();

  // Emblem Content: Wedding Rings or Monogram
  if (ringsImg) {
    ctx.drawImage(ringsImg, emblemX + 20, emblemY + 20, emblemSize - 40, emblemSize - 40);
  } else {
    ctx.fillStyle = "#4A121A";
    ctx.font = "bold 64px 'Playfair Display', Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("G & S", A3_WIDTH / 2, qrY + qrDisplaySize / 2);
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

  // URL Display Box
  ctx.fillStyle = "#8C6239";
  ctx.font = "600 34px 'Courier New', monospace";
  ctx.fillText(targetUrl, A3_WIDTH / 2, cardY + cardHeight - 90);
  ctx.restore();

  // --- 6. OPTIONAL VENUE WIFI CARD OR STEP GUIDE ---
  if (wifiInfo && wifiInfo.enabled) {
    const wifiCardWidth = 1400;
    const wifiCardHeight = 160;
    const wifiCardX = A3_WIDTH / 2 - wifiCardWidth / 2;
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
      A3_WIDTH / 2,
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
    { num: "1", title: "Scan QR", desc: "Arahkan kamera HP ke QR Code tanpa aplikasi tambahan" },
    { num: "2", title: "Pilih Frame & Pose", desc: "Pilih layout kolase dan pose bersama teman/pasangan" },
    { num: "3", title: "Simpan & Bagikan", desc: "Unduh foto hasil photobox resolusi tinggi ke galeri HP" },
  ];

  const colWidth = 980;
  const colCenters = [
    A3_WIDTH / 2 - 1050,
    A3_WIDTH / 2,
    A3_WIDTH / 2 + 1050,
  ];

  stepList.forEach((st, idx) => {
    const cx = colCenters[idx];
    // Circle Number
    ctx.save();
    ctx.fillStyle = theme === "royal-maroon" ? "#DFD2BD" : "#4A121A";
    ctx.beginPath();
    ctx.arc(cx, stepsY, 52, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = theme === "royal-maroon" ? "#3E0F16" : "#DFD2BD";
    ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
    ctx.fillText(st.num, cx, stepsY);

    // Title
    ctx.fillStyle = textColorPrimary;
    ctx.font = "bold 46px 'Playfair Display', Georgia, serif";
    ctx.fillText(st.title, cx, stepsY + 95);

    // Description
    ctx.fillStyle = textColorMuted;
    ctx.font = "500 32px 'Plus Jakarta Sans', sans-serif";
    wrapText(ctx, st.desc, cx, stepsY + 165, colWidth - 80, 44);
    ctx.restore();
  });
  ctx.restore();

  // --- 8. FOOTER: HASHTAG, WAX SEAL & GREETING ---
  const footerY = 4620;

  // Wax seal badge on the bottom corner/center if available
  if (waxSealImg) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 18;
    ctx.drawImage(waxSealImg, A3_WIDTH / 2 - 80, footerY - 140, 160, 160);
    ctx.restore();
  }

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = textColorAccent;
  ctx.font = "bold 56px 'Playfair Display', Georgia, serif";
  ctx.letterSpacing = "4px";
  ctx.fillText(`Tag Momen Serumu: ${hashtag}`, A3_WIDTH / 2, footerY + 90);

  ctx.fillStyle = textColorMuted;
  ctx.font = "500 34px 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText(
    "Terima kasih telah berbagi kebahagiaan dan mengabadikan kenangan bersama Gilang & Salsa",
    A3_WIDTH / 2,
    footerY + 170
  );
  ctx.restore();

  return canvas;
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
  // Curved filigree arc
  ctx.arc(50, 50, 40, Math.PI, 1.5 * Math.PI);
  ctx.stroke();

  // Diamond flourish accent
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
