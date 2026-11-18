import {
  PhotoboxLayout,
  PhotoboxFilter,
  PhotoboxTemplate,
  StickerItem,
  getLayoutShotsCount,
  isGridLayout,
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

// Draw classical royal gilded gold border frame with corner rosettes
function drawGildedBorderFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save();
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#FAF1D9");
  grad.addColorStop(0.35, "#C8A97E");
  grad.addColorStop(0.7, "#7A5B2C");
  grad.addColorStop(1, "#F0D9BA");

  // Outer beveled gold border
  const mOuter = 32;
  ctx.strokeStyle = grad;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(mOuter, mOuter, width - mOuter * 2, height - mOuter * 2, 16);
  ctx.stroke();

  // Inner dashed gold hairline border
  const mInner = 50;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([14, 8]);
  ctx.beginPath();
  ctx.roundRect(mInner, mInner, width - mInner * 2, height - mInner * 2, 10);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4 Corner Rosettes (circular rosettes, perfectly round and sharp!)
  const rPos = [
    { x: mInner, y: mInner },
    { x: width - mInner, y: mInner },
    { x: mInner, y: height - mInner },
    { x: width - mInner, y: height - mInner },
  ];

  for (const p of rPos) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#0F2D24";
    ctx.fill();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#FAF1D9";
    ctx.fill();
  }
  ctx.restore();
}

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

  // Ensure all web fonts are loaded in canvas context before drawing
  try {
    if (typeof document !== "undefined" && document.fonts) {
      await document.fonts.ready;
    }
  } catch {
    // Continue if document.fonts is unavailable
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  const isGrid = isGridLayout(layout);
  const isSingle = layout === "strip-1" || layout === "polaroid" || layout === "grid-1";

  // Base Canvas Width (High-res 1200px for strips, 2000-2400px for grids)
  let canvasWidth = 1200;
  if (layout === "grid-1") canvasWidth = 1600;
  else if (layout === "grid-2") canvasWidth = 2400;
  else if (layout === "grid-3") canvasWidth = 2000;
  else if (layout === "grid-4" || layout === "2x2-grid") canvasWidth = 2400;
  else if (layout === "grid-5") canvasWidth = 2200;
  else if (layout === "grid-6" || layout === "grid-8") canvasWidth = 2400;
  else if (layout === "grid-9") canvasWidth = 2400;

  const sideMargin = template.themeStyle.filmSprockets ? 120 : (isGrid ? 80 : 70);
  const slotGap = isGrid ? 32 : 36;
  const slotRadius = (template.themeStyle.photoRadius || 6) * 3;
  const cardRadius = (template.borderRadius || 10) * 3;
  const shotsCount = getLayoutShotsCount(layout);

  interface SlotRect {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  // 1. Calculate relative photo slot layout (y relative to contentTop = 0)
  const localRects: SlotRect[] = [];
  let totalPhotoH = 0;

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
    const slotW = canvasWidth - sideMargin * 2;
    const slotH = isSingle ? slotW : Math.round((slotW * 3) / 4); // Exact 4:3 matching preview!

    for (let i = 0; i < shotsCount; i++) {
      localRects.push({
        x: sideMargin,
        y: i * (slotH + slotGap),
        w: slotW,
        h: slotH,
      });
    }
    totalPhotoH = shotsCount * slotH + (shotsCount - 1) * slotGap;
  } else if (layout === "grid-1") {
    const slotW = canvasWidth - sideMargin * 2;
    const slotH = slotW;
    localRects.push({ x: sideMargin, y: 0, w: slotW, h: slotH });
    totalPhotoH = slotH;
  } else if (layout === "grid-2") {
    const slotW = (canvasWidth - sideMargin * 2 - slotGap) / 2;
    const slotH = Math.round((slotW * 3) / 4);
    localRects.push({ x: sideMargin, y: 0, w: slotW, h: slotH });
    localRects.push({ x: sideMargin + slotW + slotGap, y: 0, w: slotW, h: slotH });
    totalPhotoH = slotH;
  } else if (layout === "grid-3") {
    // 1 Hero Top (16:9) + 2 Grid Bottom (4:3)
    const slotW = canvasWidth - sideMargin * 2;
    const heroH = Math.round((slotW * 9) / 16);
    const slotW2 = (slotW - slotGap) / 2;
    const bottomH = Math.round((slotW2 * 3) / 4);

    localRects.push({ x: sideMargin, y: 0, w: slotW, h: heroH });
    localRects.push({ x: sideMargin, y: heroH + slotGap, w: slotW2, h: bottomH });
    localRects.push({ x: sideMargin + slotW2 + slotGap, y: heroH + slotGap, w: slotW2, h: bottomH });
    totalPhotoH = heroH + slotGap + bottomH;
  } else if (layout === "grid-4" || layout === "2x2-grid") {
    const slotW = (canvasWidth - sideMargin * 2 - slotGap) / 2;
    const slotH = Math.round((slotW * 3) / 4);
    localRects.push({ x: sideMargin, y: 0, w: slotW, h: slotH });
    localRects.push({ x: sideMargin + slotW + slotGap, y: 0, w: slotW, h: slotH });
    localRects.push({ x: sideMargin, y: slotH + slotGap, w: slotW, h: slotH });
    localRects.push({ x: sideMargin + slotW + slotGap, y: slotH + slotGap, w: slotW, h: slotH });
    totalPhotoH = slotH * 2 + slotGap;
  } else if (layout === "grid-5") {
    const slotW = canvasWidth - sideMargin * 2;
    const heroH = Math.round((slotW * 9) / 16);
    const slotW2 = (slotW - slotGap) / 2;
    const bottomH = Math.round((slotW2 * 3) / 4);

    localRects.push({ x: sideMargin, y: 0, w: slotW, h: heroH });
    const r1Y = heroH + slotGap;
    localRects.push({ x: sideMargin, y: r1Y, w: slotW2, h: bottomH });
    localRects.push({ x: sideMargin + slotW2 + slotGap, y: r1Y, w: slotW2, h: bottomH });
    const r2Y = r1Y + bottomH + slotGap;
    localRects.push({ x: sideMargin, y: r2Y, w: slotW2, h: bottomH });
    localRects.push({ x: sideMargin + slotW2 + slotGap, y: r2Y, w: slotW2, h: bottomH });
    totalPhotoH = r2Y + bottomH;
  } else if (layout === "grid-6") {
    const slotW = (canvasWidth - sideMargin * 2 - slotGap) / 2;
    const slotH = Math.round((slotW * 3) / 4);
    for (let r = 0; r < 3; r++) {
      const y = r * (slotH + slotGap);
      localRects.push({ x: sideMargin, y, w: slotW, h: slotH });
      localRects.push({ x: sideMargin + slotW + slotGap, y, w: slotW, h: slotH });
    }
    totalPhotoH = slotH * 3 + slotGap * 2;
  } else if (layout === "grid-8") {
    const slotW = (canvasWidth - sideMargin * 2 - slotGap) / 2;
    const slotH = Math.round((slotW * 3) / 4);
    for (let r = 0; r < 4; r++) {
      const y = r * (slotH + slotGap);
      localRects.push({ x: sideMargin, y, w: slotW, h: slotH });
      localRects.push({ x: sideMargin + slotW + slotGap, y, w: slotW, h: slotH });
    }
    totalPhotoH = slotH * 4 + slotGap * 3;
  } else if (layout === "grid-9") {
    const slotW = (canvasWidth - sideMargin * 2 - slotGap * 2) / 3;
    const slotH = slotW;
    for (let r = 0; r < 3; r++) {
      const y = r * (slotH + slotGap);
      for (let c = 0; c < 3; c++) {
        const x = sideMargin + c * (slotW + slotGap);
        localRects.push({ x, y, w: slotW, h: slotH });
      }
    }
    totalPhotoH = slotH * 3 + slotGap * 2;
  }

  // 2. Calculate Header Section Metrics (Zero overlap between ornament and title)
  const hasTopOrnament = Boolean(template.realAssets?.topOrnamentUrl);
  const topOrnamentH = hasTopOrnament ? 120 : 0;
  const topOrnamentY = 28;
  const headerTitleY = hasTopOrnament
    ? topOrnamentY + topOrnamentH + 45
    : (isSingle ? 75 : 95);
  const headerSubtitle = customSubtitle || template.themeStyle.headerSubtitle || "";
  const headerSubtitleY = headerTitleY + 45;
  const headerHeight = (!isSingle && headerSubtitle)
    ? headerSubtitleY + 45
    : headerTitleY + 45;

  const contentTop = headerHeight;
  const contentBottom = contentTop + totalPhotoH;

  // 3. Calculate Footer Section Metrics (Zero overlap between bottom ornament and text)
  const hasBottomOrnament = Boolean(template.realAssets?.bottomOrnamentUrl);
  const botOrnamentH = hasBottomOrnament ? 140 : 0;
  const botOrnamentY = contentBottom + 25;
  const footerTitle = template.themeStyle.footerTitle || "MEMORIES";
  const footerSubtitle = template.themeStyle.footerSubtitle || "";
  const footerTitleY = hasBottomOrnament
    ? botOrnamentY + botOrnamentH + 45
    : contentBottom + 50;
  const footerSubtitleY = footerSubtitle ? footerTitleY + 40 : footerTitleY;
  const dateY = showDate ? footerSubtitleY + 40 : footerSubtitleY;
  const footerHeight = (dateY - contentBottom) + 55;

  // Total Canvas Dimensions (Calculated from true content, no arbitrary crushing!)
  const canvasHeight = Math.round(headerHeight + totalPhotoH + footerHeight);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 4. Map final photo slot coordinates
  const slotRects: SlotRect[] = localRects.map((r) => ({
    x: r.x,
    y: r.y + contentTop,
    w: r.w,
    h: r.h,
  }));

  // 5. Draw Card with Rounded Corners Clip
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, canvasWidth, canvasHeight, cardRadius);
  ctx.clip();

  // Background Fill
  const effectiveBgColor = customBgColor || template.bgColor;
  ctx.fillStyle = effectiveBgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Real paper texture asset
  if (template.realAssets?.bgTextureUrl) {
    try {
      const texImg = await loadImage(template.realAssets.bgTextureUrl);
      ctx.save();
      ctx.globalAlpha = 0.5;
      const pattern = ctx.createPattern(texImg, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
      ctx.restore();
    } catch (e) {
      console.warn("Could not load real bg texture", e);
    }
  }

  // Real Frame Border (Baroque Gilded Gold or custom image border)
  if (template.id === "real-royal-baroque") {
    drawGildedBorderFrame(ctx, canvasWidth, canvasHeight);
  } else if (template.realAssets?.frameBorderUrl) {
    try {
      const borderImg = await loadImage(template.realAssets.frameBorderUrl);
      ctx.save();
      ctx.drawImage(borderImg, 0, 0, canvasWidth, canvasHeight);
      ctx.restore();
    } catch (e) {
      console.warn("Could not load real frame border", e);
    }
  }

  // Film Sprockets Simulation
  if (template.themeStyle.filmSprockets) {
    ctx.fillStyle = "#2D2D2D";
    const sprocketWidth = 50;
    const sprocketHeight = 70;
    const sRadius = 12;
    const step = 120;

    for (let y = 80; y < canvasHeight - 80; y += step) {
      ctx.beginPath();
      ctx.roundRect(30, y, sprocketWidth, sprocketHeight, sRadius);
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(canvasWidth - 30 - sprocketWidth, y, sprocketWidth, sprocketHeight, sRadius);
      ctx.fill();
    }
  }

  // Outer Border with rounded corners
  if (template.borderWidth && template.borderColor) {
    const bWidth = template.borderWidth * 3;
    ctx.strokeStyle = template.borderColor;
    ctx.lineWidth = bWidth;
    ctx.beginPath();
    ctx.roundRect(
      bWidth / 2,
      bWidth / 2,
      canvasWidth - bWidth,
      canvasHeight - bWidth,
      Math.max(0, cardRadius - bWidth / 2)
    );
    ctx.stroke();
  }

  // 6. Draw Real Corner Sprigs/Flourishes
  if (template.realAssets?.cornerAssetUrl) {
    try {
      const cornerImg = await loadImage(template.realAssets.cornerAssetUrl);
      const cSize = 140;
      const margin = 24;

      // Top-Left Corner
      ctx.drawImage(cornerImg, margin, margin, cSize, cSize);

      // Top-Right Corner (Flipped horizontally)
      ctx.save();
      ctx.translate(canvasWidth - margin, margin);
      ctx.scale(-1, 1);
      ctx.drawImage(cornerImg, 0, 0, cSize, cSize);
      ctx.restore();

      // Bottom-Left Corner (Flipped vertically)
      ctx.save();
      ctx.translate(margin, canvasHeight - margin);
      ctx.scale(1, -1);
      ctx.drawImage(cornerImg, 0, 0, cSize, cSize);
      ctx.restore();

      // Bottom-Right Corner (Flipped both)
      ctx.save();
      ctx.translate(canvasWidth - margin, canvasHeight - margin);
      ctx.scale(-1, -1);
      ctx.drawImage(cornerImg, 0, 0, cSize, cSize);
      ctx.restore();
    } catch (e) {
      console.warn("Could not load real corner asset", e);
    }
  }

  // 7. Draw Top Ornament (Golden Ribbon / Silk Bow / Sprig)
  if (template.realAssets?.topOrnamentUrl) {
    try {
      const topImg = await loadImage(template.realAssets.topOrnamentUrl);
      const topTargetW = (topImg.width / topImg.height) * topOrnamentH;
      const topX = (canvasWidth - topTargetW) / 2;

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.16)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.drawImage(topImg, topX, topOrnamentY, topTargetW, topOrnamentH);
      ctx.restore();
    } catch (e) {
      console.warn("Could not load real top ornament", e);
    }
  }

  // 8. Draw Header Text
  const headerTitle = customTitle || template.themeStyle.headerTitle || template.name;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
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
  ctx.fillText(headerTitle, canvasWidth / 2, headerTitleY);

  if (headerSubtitle && !isSingle) {
    ctx.fillStyle = template.subtextColor;
    ctx.font = "500 32px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(headerSubtitle, canvasWidth / 2, headerSubtitleY);
  }

  // 9. Draw Photo Slots with aspect-fill and filter
  for (let i = 0; i < slotRects.length; i++) {
    const rect = slotRects[i];
    const photoSrc = photos[i];

    ctx.save();
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

  // 10. Draw Bottom Ornament (Wax Seal / Rings / Cat Couple)
  if (template.realAssets?.bottomOrnamentUrl) {
    try {
      const botImg = await loadImage(template.realAssets.bottomOrnamentUrl);
      const botTargetW = (botImg.width / botImg.height) * botOrnamentH;
      const botX = (canvasWidth - botTargetW) / 2;

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;
      ctx.drawImage(botImg, botX, botOrnamentY, botTargetW, botOrnamentH);
      ctx.restore();
    } catch (e) {
      console.warn("Could not load real bottom ornament", e);
    }
  }

  // 11. Draw Footer Text
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
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
  ctx.fillText(footerTitle, canvasWidth / 2, footerTitleY);

  if (footerSubtitle) {
    ctx.fillStyle = template.subtextColor;
    ctx.font = "500 28px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(footerSubtitle, canvasWidth / 2, footerSubtitleY);
  }

  // Date Stamp
  if (showDate) {
    const dateText =
      customDate ||
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    ctx.fillStyle = template.accentColor || template.subtextColor;
    ctx.font = "600 26px 'Courier New', monospace";
    ctx.fillText(`• ${dateText} •`, canvasWidth / 2, dateY);
  }
  ctx.restore();

  // 12. Draw Couple Badge if enabled
  if (template.coupleBadge) {
    try {
      const badgeImg = await loadImage(template.coupleBadge.imageUrl);
      ctx.save();
      const bShape = template.coupleBadge.shape || "circle";
      const bPos = template.coupleBadge.position || "footer";
      const badgeSize = 160;
      let badgeX = canvasWidth / 2 - badgeSize / 2;
      let badgeY = bPos === "header" ? 50 : botOrnamentY;

      if (bPos === "top-right") {
        badgeX = canvasWidth - sideMargin - badgeSize;
        badgeY = 50;
      } else if (bPos === "bottom-right") {
        badgeX = canvasWidth - sideMargin - badgeSize;
        badgeY = canvasHeight - 230;
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

      ctx.strokeStyle = template.accentColor || "#DFD2BD";
      ctx.lineWidth = 5;
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

  // 13. Draw Stickers (Coordinates match percentage on canvas)
  if (stickers && stickers.length > 0) {
    const sortedStickers = [...stickers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    for (const sticker of sortedStickers) {
      ctx.save();
      const stX = (sticker.x / 100) * canvasWidth;
      const stY = (sticker.y / 100) * canvasHeight;
      const scale = sticker.scale || 1;
      const size = 150 * scale;

      ctx.translate(stX, stY);
      ctx.rotate(((sticker.rotation || 0) * Math.PI) / 180);

      if (sticker.isFlipped) {
        ctx.scale(-1, 1);
      }

      if (sticker.opacity !== undefined) {
        ctx.globalAlpha = sticker.opacity;
      }

      if (sticker.imageUrl) {
        try {
          const sImg = await loadImage(sticker.imageUrl);
          const imgAspect = sImg.width && sImg.height ? sImg.width / sImg.height : 1;

          let drawW = size;
          let drawH = size;
          if (imgAspect > 1) {
            drawH = size / imgAspect;
          } else {
            drawW = size * imgAspect;
          }

          if (sticker.hasFrame) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(-size / 2, -size / 2, size, size, 16);
            ctx.clip();
            ctx.drawImage(sImg, -size / 2, -size / 2, size, size);
            ctx.restore();

            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.roundRect(-size / 2, -size / 2, size, size, 16);
            ctx.stroke();
          } else {
            ctx.drawImage(sImg, -drawW / 2, -drawH / 2, drawW, drawH);
          }
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

  // 14. Restore Card Rounded Clip
  ctx.restore();

  return canvas;
}
