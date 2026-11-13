import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "wedding_auth_token_v1";

function isValidAdminJwt(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payloadStr = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload = JSON.parse(payloadStr);
    if (!payload || typeof payload !== "object") return false;
    if (payload.exp && Date.now() > payload.exp) return false;
    if (!payload.id || payload.role !== "admin") return false;
    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = authCookie || headerToken || "";
  const isAuthenticated = Boolean(token && isValidAdminJwt(token));

  // 1. Proteksi endpoint upload media internal (hanya admin terotentikasi)
  if (pathname.startsWith("/api/upload-image") || pathname.startsWith("/api/upload-audio")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Akses ditolak: Hanya pengelola yang berwenang mengunggah berkas." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Proteksi rute admin dashboard
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // Akses dashboard tanpa otentikasi valid langsung dialihkan ke login
    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      if (authCookie) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }
      return response;
    }

    // Akses halaman login ketika sudah terotentikasi langsung diarahkan ke dashboard
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/upload-image",
    "/api/upload-audio",
  ],
};
