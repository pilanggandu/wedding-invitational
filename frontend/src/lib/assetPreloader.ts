import type { WeddingInvitationData } from "../types/wedding";

export function collectInvitationAssets(data?: Partial<WeddingInvitationData>): string[] {
  if (!data) return [];
  const assets = new Set<string>();

  // 1. Core template decorative illustrations for 2D Paper Art
  const templateAssets = [
    "/images/paper-art/paperclip-washi-accent.png",
    "/images/paper-art/deckle-photo-mat.png",
    "/images/paper-art/wedding-rings-closing-vignette.png",
    "/images/templates/paper-art/real-botanical-olive-wreath.png",
    "/images/templates/paper-art/maroon-wax-seal-rings.svg",
    "/images/prewedding/couple-1.jpg",
    "/images/prewedding/couple-2.jpg",
    "/images/prewedding/couple-3.jpg",
    "/images/prewedding/couple-4.jpg",
  ];

  templateAssets.forEach((url) => {
    if (url) assets.add(url);
  });

  // 2. Couple photos
  if (data.couple?.groom?.photoUrl) assets.add(data.couple.groom.photoUrl.trim());
  if (data.couple?.bride?.photoUrl) assets.add(data.couple.bride.photoUrl.trim());

  // 3. General photos (Hero, Cover, Closing, Background)
  if (data.general?.heroPhotoUrl) assets.add(data.general.heroPhotoUrl.trim());
  if (data.general?.coverPhotoUrl) assets.add(data.general.coverPhotoUrl.trim());
  if (data.general?.closingPhotoUrl) assets.add(data.general.closingPhotoUrl.trim());
  if (data.general?.backgroundPhotoUrl) assets.add(data.general.backgroundPhotoUrl.trim());

  // 4. Prewedding photo array
  if (Array.isArray(data.general?.preweddingPhotos)) {
    data.general.preweddingPhotos.forEach((url) => {
      if (typeof url === "string" && url.trim()) assets.add(url.trim());
    });
  }

  // 5. Gallery photos
  if (Array.isArray(data.gallery)) {
    data.gallery.forEach((item) => {
      const url = item?.imageUrl;
      if (url && typeof url === "string" && url.trim()) {
        assets.add(url.trim());
      }
    });
  }

  return Array.from(assets).filter(Boolean);
}

export function preloadImage(url: string, timeoutMs = 6000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !url) {
      resolve(true);
      return;
    }

    try {
      const img = new Image();
      let settled = false;

      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve(false);
        }
      }, timeoutMs);

      img.onload = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(true);
        }
      };

      img.onerror = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(false);
        }
      };

      img.src = url;

      if (img.complete && img.naturalWidth > 0) {
        settled = true;
        clearTimeout(timer);
        resolve(true);
      }
    } catch {
      resolve(false);
    }
  });
}

export async function preloadAllAssets(
  urls: string[],
  onProgress?: (progress: number, loadedCount: number, totalCount: number) => void,
  maxTotalTimeMs = 7000
): Promise<void> {
  if (!urls || urls.length === 0) {
    onProgress?.(100, 0, 0);
    return;
  }

  const total = urls.length;
  let loaded = 0;
  let isDone = false;

  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      if (!isDone) {
        isDone = true;
        onProgress?.(100, total, total);
        resolve();
      }
    }, maxTotalTimeMs);
  });

  const loadPromises = urls.map(async (url) => {
    await preloadImage(url);
    if (!isDone) {
      loaded += 1;
      const pct = Math.min(100, Math.round((loaded / total) * 100));
      onProgress?.(pct, loaded, total);
    }
  });

  await Promise.race([Promise.all(loadPromises), timeoutPromise]);
  isDone = true;
  onProgress?.(100, total, total);
}
