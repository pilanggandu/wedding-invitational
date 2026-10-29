import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";
import { AuthUser, AuthResponse } from "@/types/auth";
import type { GuestDraft } from "./guestData";

export const AUTH_TOKEN_KEY = "wedding_auth_token_v1";

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeStoredAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    if (
      process.env.NEXT_PUBLIC_API_URL &&
      !process.env.NEXT_PUBLIC_API_URL.includes("localhost") &&
      !process.env.NEXT_PUBLIC_API_URL.includes("127.0.0.1")
    ) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return "/api";
  }
  return (
    process.env.INTERNAL_API_URL ||
    (process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:5000/api")
  );
}

/**
 * Helper fetch dengan timeout dan error handling toleran
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null; status?: number }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 detik timeout
    const baseUrl = getBaseUrl();
    const token = getStoredAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options?.headers as Record<string, string>) || {}),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { data: null, error: errBody.error || `HTTP ${res.status}`, status: res.status };
    }

    const json = await res.json();
    return { data: json, error: null };
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return { data: null, error: "Koneksi waktu habis (timeout) ke server." };
    }
    const message =
      err?.message === "Load failed" || err?.message === "Failed to fetch"
        ? "Gagal menghubungi server backend. Pastikan server backend sedang aktif."
        : err?.message || "Network error";
    return { data: null, error: message };
  }
}

// ----------------------------------------------------
// INVITATION DATA API
// ----------------------------------------------------

export async function fetchInvitationFromBackend(): Promise<WeddingInvitationData | null> {
  const { data, error } = await apiRequest<WeddingInvitationData>("/invitation");
  if (error || !data) return null;
  return data;
}

export async function saveInvitationToBackend(
  invitationData: WeddingInvitationData
): Promise<boolean> {
  const { error } = await apiRequest("/invitation", {
    method: "PUT",
    body: JSON.stringify(invitationData),
  });
  return !error;
}

// ----------------------------------------------------
// GUESTS API
// ----------------------------------------------------

export async function fetchGuestsFromBackend(): Promise<GuestItem[] | null> {
  const { data, error } = await apiRequest<{ guests: GuestItem[] }>("/guests");
  if (error || !data || !Array.isArray(data.guests)) return null;
  return data.guests;
}

export async function addGuestToBackend(
  guest: Omit<GuestItem, "id" | "slug" | "createdAt" | "isSent">
): Promise<GuestItem | null> {
  const { data, error } = await apiRequest<{ guest: GuestItem }>("/guests", {
    method: "POST",
    body: JSON.stringify(guest),
  });
  if (error || !data) return null;
  return data.guest;
}

export async function updateGuestInBackend(
  id: string,
  updates: Partial<GuestItem>
): Promise<boolean> {
  const { error } = await apiRequest(`/guests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return !error;
}

export async function deleteGuestFromBackend(id: string): Promise<boolean> {
  const { error } = await apiRequest(`/guests/${id}`, {
    method: "DELETE",
  });
  return !error;
}

export async function saveGuestMasterToBackend(
  draft: GuestDraft | { isSent: boolean },
  id?: string,
): Promise<GuestItem> {
  const { data, error, status } = await apiRequest<{ guest: GuestItem }>(
    id ? `/guests/${encodeURIComponent(id)}` : "/guests",
    { method: id ? "PATCH" : "POST", body: JSON.stringify(draft) },
  );
  if (error || !data?.guest?.id) {
    throw new GuestSaveError(
      error || "Server belum mengonfirmasi penyimpanan tamu.",
      status === undefined || status >= 500 || !error,
    );
  }
  return data.guest;
}

export class GuestSaveError extends Error {
  constructor(message: string, public readonly unconfirmed: boolean) {
    super(message);
    this.name = "GuestSaveError";
  }
}

export async function deleteGuestMasterFromBackend(id: string): Promise<void> {
  const { error } = await apiRequest(`/guests/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (error) throw new Error(error);
}

export async function verifyGuestTokenApi(
  token: string
): Promise<{ success: boolean; guest?: any; error?: string }> {
  const { data, error } = await apiRequest<{ success: boolean; guest: any }>(
    `/guests/verify/${encodeURIComponent(token)}`
  );
  if (error || !data || !data.guest) {
    return { success: false, error: error || "Token tidak valid" };
  }
  return { success: true, guest: data.guest };
}

// ----------------------------------------------------
// RSVPS API (1:1 per guest with quota)
// ----------------------------------------------------

export async function fetchRsvpsApi(): Promise<{
  summary: {
    totalGuests: number;
    attending: number;
    notAttending: number;
    estimatedHeads: number;
  };
  rsvps: any[];
} | null> {
  const { data, error } = await apiRequest<{
    success: boolean;
    summary: {
      totalGuests: number;
      attending: number;
      notAttending: number;
      estimatedHeads: number;
    };
    rsvps: any[];
  }>("/rsvps");
  if (error || !data) return null;
  return {
    summary: data.summary,
    rsvps: data.rsvps || [],
  };
}

export async function submitRsvpApi(params: {
  guestId: string | number;
  status: number; // 1 = attending, 2 = not_attending
  attendeeCount: number;
  message?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const { data, error } = await apiRequest<{ success: boolean; data: any }>(
    "/rsvps",
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
  if (error || !data || data.success !== true) {
    return { success: false, error: error || "Gagal menyimpan RSVP" };
  }
  return { success: true, data: data.data };
}

// ----------------------------------------------------
// WISHES & RSVP API
// ----------------------------------------------------

export async function fetchWishesFromBackend(): Promise<WishMessage[] | null> {
  const { data, error } = await apiRequest<{ wishes: WishMessage[] }>("/wishes");
  if (error || !data || !Array.isArray(data.wishes)) return null;
  return data.wishes;
}

export async function addWishToBackend(wish: {
  name: string;
  relationship: string;
  attendance: string;
  message: string;
  guestId?: string;
}): Promise<WishMessage | null> {
  const { data, error } = await apiRequest<{ wish: WishMessage }>("/wishes", {
    method: "POST",
    body: JSON.stringify(wish),
  });
  if (error || !data) return null;
  return data.wish;
}

export async function updateWishStatusApi(
  id: string,
  status: number // 0 = pending, 1 = approved, 2 = rejected
): Promise<boolean> {
  const { error } = await apiRequest(`/wishes/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return !error;
}

export async function deleteWishFromBackend(id: string): Promise<boolean> {
  const { error } = await apiRequest(`/wishes/${id}`, {
    method: "DELETE",
  });
  return !error;
}

// ----------------------------------------------------
// SECTIONS MANAGEMENT API
// ----------------------------------------------------

export async function fetchSectionsApi(): Promise<any[] | null> {
  const { data, error } = await apiRequest<{ success: boolean; sections: any[] }>(
    "/sections"
  );
  if (error || !data || !Array.isArray(data.sections)) return null;
  return data.sections;
}

export async function updateSectionApi(
  key: string,
  updates: { is_active?: boolean; sort_order?: number }
): Promise<boolean> {
  const { error } = await apiRequest(`/sections/${key}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return !error;
}

// ----------------------------------------------------
// HEALTH CHECK API
// ----------------------------------------------------

export async function checkBackendHealth(): Promise<{
  online: boolean;
  database: string;
}> {
  const { data, error } = await apiRequest<{
    status: string;
    database: string;
  }>("/health");
  if (error || !data || data.status !== "ok") {
    return { online: false, database: "offline" };
  }
  return { online: true, database: data.database || "sqlite" };
}

// ----------------------------------------------------
// AUTHENTICATION API
// ----------------------------------------------------

export async function loginToBackend(credentials: {
  username: string;
  password: string;
}): Promise<{
  user: AuthUser | null;
  token: string | null;
  error: string | null;
}> {
  const { data, error } = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (error || !data || !data.token) {
    return { user: null, token: null, error: error || "Gagal masuk" };
  }

  setStoredAuthToken(data.token);
  return { user: data.user, token: data.token, error: null };
}

export async function loginWithGoogleToBackend(credential: string): Promise<{
  user: AuthUser | null;
  token: string | null;
  error: string | null;
}> {
  const { data, error } = await apiRequest<AuthResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });

  if (error || !data || !data.token) {
    return { user: null, token: null, error: error || "Gagal masuk dengan Google" };
  }

  setStoredAuthToken(data.token);
  return { user: data.user, token: data.token, error: null };
}

export async function registerToBackend(params: {
  username: string;
  password: string;
  fullName: string;
  email?: string;
}): Promise<{
  user: AuthUser | null;
  token: string | null;
  error: string | null;
}> {
  const { data, error } = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(params),
  });

  if (error || !data || !data.token) {
    return { user: null, token: null, error: error || "Gagal mendaftar" };
  }

  setStoredAuthToken(data.token);
  return { user: data.user, token: data.token, error: null };
}

export async function fetchCurrentUserFromBackend(): Promise<AuthUser | null> {
  const token = getStoredAuthToken();
  if (!token) return null;

  const { data, error } = await apiRequest<{
    authenticated: boolean;
    user: AuthUser;
  }>("/auth/me");

  if (error || !data || !data.authenticated) {
    removeStoredAuthToken();
    return null;
  }

  return data.user;
}

export async function logoutFromBackend(): Promise<void> {
  await apiRequest("/auth/logout", { method: "POST" });
  removeStoredAuthToken();
}
