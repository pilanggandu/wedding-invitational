import type { GeneralWeddingInfo } from "@/types/wedding";

export type MusicSettingsValue = Pick<
  GeneralWeddingInfo,
  "musicUrl" | "musicTitle" | "musicArtist" | "musicVolume"
>;

export function getMusicUrlError(value: string): string | null {
  const source = value.trim();
  if (!source) return null;
  if (source.startsWith("/") && !source.startsWith("//") && !source.includes("\\")) {
    return null;
  }
  if (source.startsWith("blob:") || source.startsWith("data:audio/")) {
    return null;
  }
  try {
    const url = new URL(source);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "Gunakan tautan audio dengan awalan https:// atau http://.";
    }
    const host = url.hostname.toLowerCase();
    if (["youtube.com", "youtu.be", "spotify.com"].some((domain) => host === domain || host.endsWith(`.${domain}`))) {
      return "Gunakan tautan langsung ke berkas audio, bukan halaman YouTube atau Spotify.";
    }
    return null;
  } catch {
    return "Masukkan tautan audio yang lengkap atau path lokal seperti /audio/lagu.mp3.";
  }
}

export function getMusicVolume(value?: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : 40;
}
