import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Helper fetch dengan timeout dan error handling toleran
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 detik timeout

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { data: null, error: errBody.error || `HTTP ${res.status}` };
    }

    const json = await res.json();
    return { data: json, error: null };
  } catch (err: any) {
    // Backend offline / not reachable
    return { data: null, error: err.message || "Network error" };
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
}): Promise<WishMessage | null> {
  const { data, error } = await apiRequest<{ wish: WishMessage }>("/wishes", {
    method: "POST",
    body: JSON.stringify(wish),
  });
  if (error || !data) return null;
  return data.wish;
}

export async function deleteWishFromBackend(id: string): Promise<boolean> {
  const { error } = await apiRequest(`/wishes/${id}`, {
    method: "DELETE",
  });
  return !error;
}
