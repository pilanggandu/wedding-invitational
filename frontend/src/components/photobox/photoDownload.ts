export const isIOSDevice = (): boolean => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isAppleMobile = /iPad|iPhone|iPod/.test(ua);
  const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isAppleMobile || isIPadOS;
};

export const isInAppBrowser = (): boolean => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = (navigator.userAgent || "").toLowerCase();
  return (
    ua.includes("instagram") ||
    ua.includes("fbav") ||
    ua.includes("fban") ||
    ua.includes("line") ||
    ua.includes("tiktok") ||
    ua.includes("bytedance") ||
    ua.includes("micromessenger")
  );
};

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Gagal mengonversi canvas ke Blob"));
        }
      },
      type,
      quality
    );
  });
}

export interface PhotoDownloadOptions {
  filename: string;
  title?: string;
  text?: string;
}

export interface PhotoDownloadResult {
  method: "share" | "download" | "modal";
  blobUrl: string;
  blob: Blob;
  filename: string;
}

export async function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  options: PhotoDownloadOptions
): Promise<PhotoDownloadResult> {
  const {
    filename,
    title = "Foto Photobox Gilang & Salsa",
    text = "Kenangan Photobox Pernikahan Gilang & Salsadila",
  } = options;

  const blob = await canvasToBlob(canvas, "image/png");
  const blobUrl = URL.createObjectURL(blob);
  const isApple = isIOSDevice();

  if (isApple) {
    const file = new File([blob], filename, { type: "image/png" });
    const canUseShare =
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] });

    if (canUseShare) {
      try {
        await navigator.share({
          files: [file],
          title,
          text,
        });
        return { method: "share", blobUrl, blob, filename };
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return { method: "share", blobUrl, blob, filename };
        }
        console.warn("navigator.share di iOS gagal, fallback ke modal simpan:", err);
      }
    }

    return { method: "modal", blobUrl, blob, filename };
  }

  // Non-iOS (Android, Windows, macOS Desktop, Linux)
  try {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 1200);
    return { method: "download", blobUrl, blob, filename };
  } catch (err) {
    console.warn("Direct download gagal, fallback ke modal:", err);
    return { method: "modal", blobUrl, blob, filename };
  }
}
