import crypto from "node:crypto";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "wedding_secret_key_2026_gilang_salsa";

export interface AuthUserPayload {
  id: string;
  username: string;
  role: string;
  fullName: string;
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return checkHash === hash;
}

export function generateToken(payload: AuthUserPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 hari kedaluwarsa
  const data = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${data}`)
    .digest("base64url");
  return `${header}.${data}.${signature}`;
}

export function verifyToken(token: string): AuthUserPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${data}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
      fullName: payload.fullName,
    };
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Sesi tidak valid atau belum masuk (Unauthorized)" });
  }

  const token = authHeader.split(" ")[1];
  const user = verifyToken(token);
  if (!user) {
    return res
      .status(401)
      .json({ error: "Token telah kedaluwarsa atau tidak valid" });
  }

  req.user = user;
  next();
}
