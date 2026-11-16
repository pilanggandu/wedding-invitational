import { PhotoboxLayout, PhotoboxFilter, StickerItem } from "./types";

export interface PhotoboxCustomizerDraft {
  templateId?: string;
  filter?: PhotoboxFilter;
  customTitle?: string;
  customSubtitle?: string;
  showDate?: boolean;
  customDate?: string;
  customBgColor?: string;
  stickers?: StickerItem[];
}

export interface PhotoboxSessionDraft {
  version: number;
  timestamp: number;
  currentStep: "camera" | "frames";
  layout: PhotoboxLayout;
  photos: string[];
  customizerState?: PhotoboxCustomizerDraft;
}

const DB_NAME = "wedding_photobox_db";
const DB_VERSION = 1;
const STORE_NAME = "drafts";
const DRAFT_KEY = "active_session";
const SESSION_FALLBACK_KEY = "wedding_photobox_draft_backup";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not available"));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Simpan draft sesi foto ke IndexedDB (dengan fallback ke sessionStorage).
 * Mencegah data hilang jika halaman di-refresh, tertutup, atau tab di-kill oleh OS HP.
 */
export async function savePhotoboxDraft(draft: PhotoboxSessionDraft): Promise<void> {
  if (typeof window === "undefined") return;

  // Coba IndexedDB terlebih dahulu (kapasitas besar untuk foto resolusi tinggi)
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(draft, DRAFT_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    return;
  } catch {
    // Fallback ke sessionStorage jika IndexedDB tidak aktif / diblokir mode private
    try {
      sessionStorage.setItem(SESSION_FALLBACK_KEY, JSON.stringify(draft));
    } catch {
      // Abaikan jika kuota penyimpanan peramban penuh
    }
  }
}

/**
 * Muat draft sesi foto yang belum selesai jika ada.
 */
export async function loadPhotoboxDraft(): Promise<PhotoboxSessionDraft | null> {
  if (typeof window === "undefined") return null;

  try {
    const db = await openDB();
    const draft = await new Promise<PhotoboxSessionDraft | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(DRAFT_KEY);
      req.onsuccess = () => resolve((req.result as PhotoboxSessionDraft) || null);
      req.onerror = () => reject(req.error);
    });

    if (draft) return draft;
  } catch {
    // Abaikan kegagalan IndexedDB dan coba fallback
  }

  try {
    const raw = sessionStorage.getItem(SESSION_FALLBACK_KEY);
    if (raw) {
      return JSON.parse(raw) as PhotoboxSessionDraft;
    }
  } catch {}

  return null;
}

/**
 * Hapus draft sesi foto saat pengguna selesai mengunduh atau menekan reset sesi.
 */
export async function clearPhotoboxDraft(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(DRAFT_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {}

  try {
    sessionStorage.removeItem(SESSION_FALLBACK_KEY);
  } catch {}
}
