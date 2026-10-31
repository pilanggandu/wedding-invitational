"use client";

export interface ExtractedColors {
  dominant: string;
  secondary: string;
  deep: string;
  light: string;
  glow: string;
  rgb: { r: number; g: number; b: number };
}

export const FALLBACK_PALETTE: ExtractedColors = {
  dominant: "#D97736",
  secondary: "#E0A96D",
  deep: "#0F1117",
  light: "#FDE68A",
  glow: "rgba(217, 119, 54, 0.25)",
  rgb: { r: 217, g: 119, b: 54 },
};

export const COLOR_PRESETS: Record<string, ExtractedColors> = {
  warmAmber: {
    dominant: "#D97736",
    secondary: "#F59E0B",
    deep: "#14100E",
    light: "#FED7AA",
    glow: "rgba(217, 119, 54, 0.28)",
    rgb: { r: 217, g: 119, b: 54 },
  },
  oceanAzure: {
    dominant: "#0284C7",
    secondary: "#38BDF8",
    deep: "#08131D",
    light: "#BAE6FD",
    glow: "rgba(2, 132, 199, 0.28)",
    rgb: { r: 2, g: 132, b: 199 },
  },
  forestSage: {
    dominant: "#15803D",
    secondary: "#4ADE80",
    deep: "#09140D",
    light: "#BBF7D0",
    glow: "rgba(21, 128, 61, 0.28)",
    rgb: { r: 21, g: 128, b: 61 },
  },
  romanticRose: {
    dominant: "#E11D48",
    secondary: "#FB7185",
    deep: "#180A0F",
    light: "#FECDD3",
    glow: "rgba(225, 29, 72, 0.28)",
    rgb: { r: 225, g: 29, b: 72 },
  },
  lavenderDream: {
    dominant: "#7C3AED",
    secondary: "#A78BFA",
    deep: "#110B1C",
    light: "#DDD6FE",
    glow: "rgba(124, 58, 237, 0.28)",
    rgb: { r: 124, g: 58, b: 237 },
  },
  champagneGold: {
    dominant: "#CA8A04",
    secondary: "#FACC15",
    deep: "#15130A",
    light: "#FEF08A",
    glow: "rgba(202, 138, 4, 0.28)",
    rgb: { r: 202, g: 138, b: 4 },
  },
};

/**
 * Extracts dominant vibrant and ambient background colors from an image using an offscreen canvas.
 */
export async function extractColorsFromImage(imageSrc: string): Promise<ExtractedColors> {
  if (typeof window === "undefined" || !imageSrc) {
    return FALLBACK_PALETTE;
  }

  return new Promise((resolve) => {
    const img = new Image();
    if (!imageSrc.startsWith("data:") && !imageSrc.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(FALLBACK_PALETTE);
          return;
        }

        const size = 32;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size);
        const data = imgData.data;

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        let sampleCount = 0;

        // Collect colorful pixels (filter out near-black and near-white)
        const buckets: { r: number; g: number; b: number; weight: number }[] = [];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 128) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          const brightness = max / 255;

          // Prefer colorful pixels (saturation > 0.15, brightness between 0.15 and 0.90)
          if (saturation > 0.15 && brightness > 0.15 && brightness < 0.92) {
            totalR += r;
            totalG += g;
            totalB += b;
            sampleCount++;
            buckets.push({ r, g, b, weight: saturation * (1 - Math.abs(0.5 - brightness)) });
          }
        }

        if (sampleCount === 0 || buckets.length === 0) {
          resolve(FALLBACK_PALETTE);
          return;
        }

        // Weighted average for vibrant dominant
        let wR = 0,
          wG = 0,
          wB = 0,
          totalWeight = 0;
        buckets.forEach((p) => {
          wR += p.r * p.weight;
          wG += p.g * p.weight;
          wB += p.b * p.weight;
          totalWeight += p.weight;
        });

        const domR = Math.round(wR / totalWeight);
        const domG = Math.round(wG / totalWeight);
        const domB = Math.round(wB / totalWeight);

        // Secondary color (shifted hue or lighter tone)
        const secR = Math.min(255, Math.round(domR * 1.25 + 20));
        const secG = Math.min(255, Math.round(domG * 1.25 + 20));
        const secB = Math.min(255, Math.round(domB * 1.25 + 20));

        // Deep background tone (dark tinted version for ambient backdrop: 6-12% luminance)
        const deepR = Math.max(6, Math.min(18, Math.round(domR * 0.08)));
        const deepG = Math.max(8, Math.min(22, Math.round(domG * 0.08)));
        const deepB = Math.max(10, Math.min(28, Math.round(domB * 0.08)));

        // Light highlight version
        const lightR = Math.min(255, Math.round(domR * 0.6 + 100));
        const lightG = Math.min(255, Math.round(domG * 0.6 + 100));
        const lightB = Math.min(255, Math.round(domB * 0.6 + 100));

        const toHex = (n: number) => n.toString(16).padStart(2, "0");

        const dominantHex = `#${toHex(domR)}${toHex(domG)}${toHex(domB)}`;
        const secondaryHex = `#${toHex(secR)}${toHex(secG)}${toHex(secB)}`;
        const deepHex = `#${toHex(deepR)}${toHex(deepG)}${toHex(deepB)}`;
        const lightHex = `#${toHex(lightR)}${toHex(lightG)}${toHex(lightB)}`;
        const glowRgba = `rgba(${domR}, ${domG}, ${domB}, 0.28)`;

        resolve({
          dominant: dominantHex,
          secondary: secondaryHex,
          deep: deepHex,
          light: lightHex,
          glow: glowRgba,
          rgb: { r: domR, g: domG, b: domB },
        });
      } catch (err) {
        // Fallback on CORS or reading restriction
        resolve(FALLBACK_PALETTE);
      }
    };

    img.onerror = () => {
      resolve(FALLBACK_PALETTE);
    };

    img.src = imageSrc;
  });
}
