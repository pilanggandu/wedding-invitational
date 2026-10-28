import {
  PhotoboxLayout,
  PhotoboxFilter,
  PhotoboxTemplate,
  StickerItem,
  getLayoutShotsCount,
} from "./types";

interface ExportOptions {
  layout: PhotoboxLayout;
  template: PhotoboxTemplate;
  photos: string[];
  filter: PhotoboxFilter;
  customTitle: string;
  customSubtitle: string;
  showDate: boolean;
  customDate: string;
  customBgColor?: string;
  stickers: StickerItem[];
}

// Map filter id to canvas filter string
const getCanvasFilter = (filter: PhotoboxFilter): string => {
  switch (filter) {
    case "vintage":
      return "sepia(0.28) contrast(1.08) brightness(1.02) saturate(1.15)";
    case "bw":
      return "grayscale(1) contrast(1.22) brightness(1.04)";
    case "warm":
      return "sepia(0.2) saturate(1.3) brightness(1.05) contrast(1.05)";
    case "pastel":
      return "contrast(0.96) brightness(1.08) saturate(1.12)";
    case "cold":
      return "contrast(1.12) brightness(0.98) saturate(0.92)";
    case "moody":
      return "contrast(1.25) brightness(0.95) saturate(1.18)";
    default:
      return "none";
  }
};

// Helper to load an HTMLImageElement
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

export async function generatePhotoboxCanvas(
  options: ExportOptions
): Promise<HTMLCanvasElement> {
  const {
    layout,
    template,
    photos,
    filter,
    customTitle,
    customSubtitle,
    showDate,
    customDate,
    customBgColor,
    stickers,
  } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  // Determine Dimensions based on layout (Ultra HD 3x Scale for printing crispness)
  let canvasWidth = 1200;
  let canvasHeight = 3600;

  if (layout === "strip-1" || layout === "polaroid") {
    canvasWidth = 1200;
    canvasHeight = 1800;
  } else if (layout === "strip-2" || layout === "2-strip") {
    canvasWidth = 1200;
    canvasHeight = 2200;
  } else if (layout === "strip-3" || layout === "3-strip") {
    canvasWidth = 1200;
    canvasHeight = 3000;
  } else if (layout === "strip-4" || layout === "4-strip") {
    canvasWidth = 1200;
    canvasHeight = 3600;
  } else if (layout === "strip-5") {
    canvasWidth = 1200;
    canvasHeight = 4400;
  } else if (layout === "strip-6") {
    canvasWidth = 1200;
    canvasHeight = 5200;
  } else if (layout === "grid-1") {
    canvasWidth = 1800;
    canvasHeight = 2200;
  } else if (layout === "grid-2") {
    canvasWidth = 2400;
    canvasHeight = 1800;
  } else if (layout === "grid-3") {
    canvasWidth = 2000;
    canvasHeight = 2400;
  } else if (layout === "grid-4" || layout === "2x2-grid") {
    canvasWidth = 2400;
    canvasHeight = 2800;
  } else if (layout === "grid-5") {
    canvasWidth = 2400;
    canvasHeight = 3200;
  } else if (layout === "grid-6") {
    canvasWidth = 2400;
    canvasHeight = 3400;
  } else if (layout === "grid-8") {
    canvasWidth = 2400;
    canvasHeight = 4000;
  } else if (layout === "grid-9") {
    canvasWidth = 2700;
    canvasHeight = 3200;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 1. Draw Background
  const effectiveBgColor = customBgColor || template.bgColor;
  ctx.fillStyle = effectiveBgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Subtle paper texture or pattern if enabled
  if (template.themeStyle.paperTexture) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    for (let x = 0; x < canvasWidth; x += 8) {
      for (let y = 0; y < canvasHeight; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
  }

  // 2. Film Sprockets for 35mm film strips
  if (template.themeStyle.filmSprockets) {
    ctx.fillStyle = "#2D2D2D";
    const sprocketWidth = 50;
    const sprocketHeight = 70;
    const sprocketRadius = 12;
    const step = 120;

    for (let y = 80; y < canvasHeight - 80; y += step) {
      // Left sprocket
      ctx.beginPath();
      ctx.roundRect(30, y, sprocketWidth, sprocketHeight, sprocketRadius);
      ctx.fill();

      // Right sprocket
      ctx.beginPath();
      ctx.roundRect(canvasWidth - 30 - sprocketWidth, y, sprocketWidth, sprocketHeight, sprocketRadius);
      ctx.fill();
    }
  }

  // 3. Draw Outer Border if template has one
  if (template.borderWidth && template.borderColor) {
    const bWidth = template.borderWidth * 3;
    ctx.strokeStyle = template.borderColor;
    ctx.lineWidth = bWidth;
    ctx.strokeRect(bWidth / 2, bWidth / 2, canvasWidth - bWidth, canvasHeight - bWidth);
  }

  // Header Section
  const isSingle = layout === "strip-1" || layout === "polaroid" || layout === "grid-1";
  const headerHeight = isSingle ? 100 : 220;
  const headerTitle = customTitle || template.themeStyle.headerTitle || template.name;
  const headerSubtitle = customSubtitle || template.themeStyle.headerSubtitle || "";

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Header Title
  ctx.fillStyle = template.textColor;
  if (template.fontFamily === "serif") {
    ctx.font = "bold 56px 'Playfair Display', Georgia, serif";
  } else if (template.fontFamily === "handwriting") {
    ctx.font = "bold 72px 'Caveat', cursive";
  } else if (template.fontFamily === "mono") {
    ctx.font = "bold 44px 'Courier New', monospace";
  } else {
    ctx.font = "bold 48px 'Plus Jakarta Sans', sans-serif";
  }
  ctx.fillText(headerTitle, canvasWidth / 2, isSingle ? 70 : 100);

  // Header Subtitle
  if (headerSubtitle && !isSingle) {
    ctx.fillStyle = template.subtextColor;
    ctx.font = "500 32px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(headerSubtitle, canvasWidth / 2, 160);
  }

  // 4. Calculate Photo Slot Rectangles
  const footerHeight = 280;
  const contentTop = headerHeight;
  const contentBottom = canvasHeight - footerHeight;
  const availableContentHeight = contentBottom - contentTop;

  const sideMargin = template.themeStyle.filmSprockets ? 120 : 70;
  const slotGap = 40;
  const slotRadius = (template.themeStyle.photoRadius || 6) * 3;

  interface SlotRect {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  const slotRects: SlotRect[] = [];

  // STRIP LAYOUTS (1, 2, 3, 4, 5, 6)
  if (
    layout === "strip-1" ||
    layout === "strip-2" ||
    layout === "strip-3" ||
    layout === "strip-4" ||
    layout === "strip-5" ||
    layout === "strip-6" ||
    layout === "4-strip" ||
    layout === "3-strip" ||
    layout === "2-strip" ||
    layout === "polaroid"
  ) {
    const shotsCount = getLayoutShotsCount(layout);
    const totalGaps = slotGap * (shotsCount - 1);
    const slotH = (availableContentHeight - totalGaps) / shotsCount;
    const slotW = canvasWidth - sideMargin * 2;

    for (let i = 0; i < shotsCount; i++) {
      slotRects.push({
        x: sideMargin,
        y: contentTop + i * (slotH + slotGap),
        w: slotW,
        h: slotH,
      });
    }
  } else if (layout === "grid-1") {
    // Kotak 1 Foto Square
    const slotW = canvasWidth - sideMargin * 2;
    const slotH = slotW * 0.95;
    slotRects.push({
      x: sideMargin,
      y: contentTop + (availableContentHeight - slotH) / 2,
      w: slotW,
      h: slotH,
    });
  } else if (layout === "grid-2") {
    // Kotak 2 Foto: 2 Kolom x 1 Baris
    const slotW = (canvasWidth - sideMargin * 2 - slotGap) / 2;
    const slotH = availableContentHeight;
    slotRects.push({ x: sideMargin, y: contentTop, w: slotW, h: slotH });
    slotRects.push({ x: sideMargin + slotW + slotGap, y: contentTop, w: slotW, h: slotH });
  } else if (layout === "grid-3") {
    // Kotak 3 Foto: 1 Hero Top + 2 Duo Bottom
    const heroH = availableContentHeight * 0.52;
    const bottomH = availableContentHeight - heroH - slotGap;
    const fullW = canvasWidth - sideMargin * 2;
    const halfW = (fullW - slotGap) / 2;

    // Slot 0: Top Hero
    slotRects.push({ x: sideMargin, y: contentTop, w: fullW, h: heroH });
    // Slot 1 & 2: Bottom Grid
    const botY = contentTop + heroH + slotGap;
    slotRects.push({ x: sideMargin, y: botY, w: halfW, h: bottomH });
    slotRects.push({ x: sideMargin + halfW + slotGap, y: botY, w: halfW, h: bottomH });
  } else if (layout === "grid-4" || layout === "2x2-grid") {
    // Kotak 4 Foto: 2 Kolom x 2 Baris
    const slotW = (canvasWidth - sideMargin * 2 - slotGap) / 2;
    const slotH = (availableContentHeight - slotGap) / 2;
    // Row 0
    slotRects.push({ x: sideMargin, y: contentTop, w: slotW, h: slotH });
    slotRects.push({ x: sideMargin + slotW + slotGap, y: contentTop, w: slotW, h: slotH });
    // Row 1
    slotRects.push({ x: sideMargin, y: contentTop + slotH + slotGap, w: slotW, h: slotH });
    slotRects.push({ x: sideMargin + slotW + slotGap, y: contentTop + slotH + slotGap, w: slotW, h: slotH });
  } else if (layout === "grid-5") {
    // Kotak 5 Foto: 1 Hero Top + 4 Grid (2x2) Bottom
    const heroH = availableContentHeight * 0.38;
    const bottomAvailableH = availableContentHeight - heroH - slotGap;
    const slotGridH = (bottomAvailableH - slotGap) / 2;
    const fullW = canvasWidth - sideMargin * 2;
    const halfW = (fullW - slotGap) / 2;

    // Slot 0: Top Hero
    slotRects.push({ x: sideMargin, y: contentTop, w: fullW, h: heroH });
    // Row 1
    const r1Y = contentTop + heroH + slotGap;
    slotRects.push({ x: sideMargin, y: r1Y, w: halfW, h: slotGridH });
    slotRects.push({ x: sideMargin + halfW + slotGap, y: r1Y, w: halfW, h: slotGridH });
    // Row 2
    const r2Y = r1Y + slotGridH + slotGap;
    slotRects.push({ x: sideMargin, y: r2Y, w: halfW, h: slotGridH });
    slotRects.push({ x: sideMargin + halfW + slotGap, y: r2Y, w: halfW, h: slotGridH });
  } else if (layout === "grid-6") {
    // Kotak 6 Foto: 2 Kolom x 3 Baris
    const slotW = (canvasWidth - sideMargin * 2 - slotGap) / 2;
    const slotH = (availableContentHeight - slotGap * 2) / 3;
    for (let r = 0; r < 3; r++) {
      const y = contentTop + r * (slotH + slotGap);
      slotRects.push({ x: sideMargin, y, w: slotW, h: slotH });
      slotRects.push({ x: sideMargin + slotW + slotGap, y, w: slotW, h: slotH });
    }
  } else if (layout === "grid-8") {
    // Kotak 8 Foto: 2 Kolom x 4 Baris
    const slotW = (canvasWidth - sideMargin * 2 - slotGap) / 2;
    const slotH = (availableContentHeight - slotGap * 3) / 4;
    for (let r = 0; r < 4; r++) {
      const y = contentTop + r * (slotH + slotGap);
      slotRects.push({ x: sideMargin, y, w: slotW, h: slotH });
      slotRects.push({ x: sideMargin + slotW + slotGap, y, w: slotW, h: slotH });
    }
  } else if (layout === "grid-9") {
    // Kotak 9 Foto: 3 Kolom x 3 Baris
    const slotW = (canvasWidth - sideMargin * 2 - slotGap * 2) / 3;
    const slotH = (availableContentHeight - slotGap * 2) / 3;
    for (let r = 0; r < 3; r++) {
      const y = contentTop + r * (slotH + slotGap);
      for (let c = 0; c < 3; c++) {
        const x = sideMargin + c * (slotW + slotGap);
        slotRects.push({ x, y, w: slotW, h: slotH });
      }
    }
  }

  // 5. Draw Photos with clipping and filter
  for (let i = 0; i < slotRects.length; i++) {
    const rect = slotRects[i];
    const photoSrc = photos[i];

    ctx.save();
    // Rounded clip for the photo
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, rect.w, rect.h, slotRadius);
    ctx.clip();

    if (photoSrc) {
      try {
        const img = await loadImage(photoSrc);
        ctx.filter = getCanvasFilter(filter);

        // Aspect Fill (cover)
        const imgAspect = img.width / img.height;
        const targetAspect = rect.w / rect.h;
        let drawW = rect.w;
        let drawH = rect.h;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > targetAspect) {
          drawH = rect.h;
          drawW = rect.h * imgAspect;
          offsetX = (rect.w - drawW) / 2;
        } else {
          drawW = rect.w;
          drawH = rect.w / imgAspect;
          offsetY = (rect.h - drawH) / 2;
        }

        ctx.drawImage(img, rect.x + offsetX, rect.y + offsetY, drawW, drawH);
      } catch (e) {
        console.warn("Could not draw photo", e);
        ctx.fillStyle = "#E5E7EB";
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      }
    } else {
      // Empty slot placeholder
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.fillStyle = template.subtextColor;
      ctx.font = "bold 36px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`FOTO ${i + 1}`, rect.x + rect.w / 2, rect.y + rect.h / 2);
    }

    ctx.restore();

    // Subtle inner stroke around photo
    ctx.save();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, rect.w, rect.h, slotRadius);
    ctx.stroke();
    ctx.restore();
  }

  // 6. Draw Footer Section
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const footerCenterY = canvasHeight - 140;
  const footerTitle = template.themeStyle.footerTitle || "MEMORIES";
  const footerSubtitle = template.themeStyle.footerSubtitle || "";

  ctx.fillStyle = template.textColor;
  if (template.fontFamily === "serif") {
    ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
  } else if (template.fontFamily === "handwriting") {
    ctx.font = "bold 64px 'Caveat', cursive";
  } else if (template.fontFamily === "mono") {
    ctx.font = "bold 38px 'Courier New', monospace";
  } else {
    ctx.font = "bold 40px 'Plus Jakarta Sans', sans-serif";
  }
  ctx.fillText(footerTitle, canvasWidth / 2, footerCenterY - 30);

  if (footerSubtitle) {
    ctx.fillStyle = template.subtextColor;
    ctx.font = "500 28px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(footerSubtitle, canvasWidth / 2, footerCenterY + 25);
  }

  // Date Stamp
  if (showDate) {
    const dateText = customDate || new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    ctx.fillStyle = template.accentColor || template.subtextColor;
    ctx.font = "600 26px 'Courier New', monospace";
    ctx.fillText(`• ${dateText} •`, canvasWidth / 2, footerCenterY + 75);
  }
  ctx.restore();

  // 6b. Draw Bride & Groom Generated Photo Badge if enabled on this template
  if (template.coupleBadge) {
    try {
      const badgeImg = await loadImage(template.coupleBadge.imageUrl);
      ctx.save();
      const bShape = template.coupleBadge.shape || "circle";
      const bPos = template.coupleBadge.position || "footer";

      const badgeSize = 180;
      let badgeX = canvasWidth / 2 - badgeSize / 2;
      let badgeY = bPos === "header" ? 60 : canvasHeight - 250;

      if (bPos === "top-right") {
        badgeX = canvasWidth - sideMargin - badgeSize;
        badgeY = 50;
      } else if (bPos === "bottom-right") {
        badgeX = canvasWidth - sideMargin - badgeSize;
        badgeY = canvasHeight - 250;
      }

      ctx.save();
      ctx.beginPath();
      if (bShape === "polaroid") {
        ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize * 1.15, 12);
      } else {
        ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
      }
      ctx.clip();
      ctx.drawImage(badgeImg, badgeX, badgeY, badgeSize, badgeSize);
      ctx.restore();

      // Border frame around couple photo badge
      ctx.strokeStyle = template.accentColor || "#DFD2BD";
      ctx.lineWidth = 6;
      ctx.beginPath();
      if (bShape === "polaroid") {
        ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize * 1.15, 12);
      } else {
        ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.restore();
    } catch (e) {
      console.warn("Could not load couple badge image", e);
    }
  }

  // 7. Draw Stickers onto the Canvas (Supports both Emojis and Generated Couple Photos!)
  if (stickers && stickers.length > 0) {
    for (const sticker of stickers) {
      ctx.save();
      const stX = (sticker.x / 100) * canvasWidth;
      const stY = (sticker.y / 100) * canvasHeight;
      const size = 150 * sticker.scale;

      ctx.translate(stX, stY);
      ctx.rotate((sticker.rotation * Math.PI) / 180);

      if (sticker.imageUrl) {
        try {
          const sImg = await loadImage(sticker.imageUrl);
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(-size / 2, -size / 2, size, size, 16);
          ctx.clip();
          ctx.drawImage(sImg, -size / 2, -size / 2, size, size);
          ctx.restore();

          // Border for photo sticker
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.roundRect(-size / 2, -size / 2, size, size, 16);
          ctx.stroke();
        } catch {
          // fallback
        }
      } else {
        ctx.font = `${size * 0.7}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sticker.emoji, 0, 0);
      }
      ctx.restore();
    }
  }

  return canvas;
}
