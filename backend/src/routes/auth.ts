import { Router, Request, Response } from "express";
import { createHash, randomBytes } from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import { sqliteService } from "../sqlite";
import { postgresService, isPostgresConnected } from "../postgres";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  requireAuth,
  AuthenticatedRequest,
} from "../auth";

const router = Router();
const googleAuthClient = new OAuth2Client();

// GET /api/auth/sso/config - Status konfigurasi Google SSO
router.get("/sso/config", (_req: Request, res: Response) => {
  const googleClientId =
    process.env.GOOGLE_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ||
    "";
  res.json({
    googleConfigured: Boolean(googleClientId),
    googleClientId: googleClientId || null,
  });
});

// GET /api/auth/sso/google - Inisiasi alur redirect Google OAuth2 SSO
router.get("/sso/google", (req: Request, res: Response) => {
  const googleClientId =
    process.env.GOOGLE_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (!googleClientId) {
    return res.status(503).json({ error: "Google SSO belum dikonfigurasi di server." });
  }

  const host = req.get("x-forwarded-host") || req.get("host") || "localhost:5022";
  const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
  const redirectUri = `${protocol}://${host}/api/auth/sso/google/callback`;

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: redirectUri,
    client_id: googleClientId,
    access_type: "offline",
    response_type: "code",
    prompt: "select_account",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  return res.redirect(`${rootUrl}?${qs.toString()}`);
});

// GET /api/auth/sso/google/callback - Callback penyelesaian Google OAuth2 SSO
router.get("/sso/google/callback", async (req: Request, res: Response) => {
  try {
    const code = typeof req.query.code === "string" ? req.query.code : null;
    if (!code) {
      return res.redirect("/admin/login?error=Otentikasi+Google+dibatalkan");
    }

    const googleClientId =
      process.env.GOOGLE_CLIENT_ID?.trim() ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    if (!googleClientId || !googleClientSecret) {
      return res.redirect("/admin/login?error=Konfigurasi+Google+SSO+belum+lengkap+di+server");
    }

    const host = req.get("x-forwarded-host") || req.get("host") || "localhost:5022";
    const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
    const redirectUri = `${protocol}://${host}/api/auth/sso/google/callback`;

    const client = new OAuth2Client(googleClientId, googleClientSecret, redirectUri);
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.redirect("/admin/login?error=Token+identitas+Google+tidak+ditemukan");
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    const email = payload?.email?.trim().toLowerCase();
    if (!payload?.sub || !email || payload.email_verified !== true) {
      return res.redirect("/admin/login?error=Email+Google+belum+terverifikasi");
    }

    const allowedEmails = (process.env.GOOGLE_SSO_ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const usePostgres = isPostgresConnected();
    const getUserByGoogleSub = (sub: string) =>
      usePostgres ? postgresService.getUserByGoogleSub(sub) : sqliteService.getUserByGoogleSub(sub);
    const getUserByEmail = (em: string) =>
      usePostgres ? postgresService.getUserByEmail(em) : sqliteService.getUserByEmail(em);
    const linkGoogleSub = (id: string, sub: string) =>
      usePostgres ? postgresService.linkGoogleSub(id, sub) : sqliteService.linkGoogleSub(id, sub);

    let user = await getUserByGoogleSub(payload.sub);

    if (!user) {
      const existingUser = await getUserByEmail(email);
      if (existingUser && existingUser.role === "admin") {
        await linkGoogleSub(existingUser.id, payload.sub);
        user = existingUser;
      }
    }

    if (!user) {
      if (allowedEmails.length > 0 && !allowedEmails.includes(email)) {
        return res.redirect("/admin/login?error=Email+Google+ini+belum+diizinkan+sebagai+pengelola");
      }

      if (allowedEmails.length > 0 && allowedEmails.includes(email)) {
        const googleSubjectKey = createHash("sha256").update(payload.sub).digest("hex");
        const { hash, salt } = hashPassword(randomBytes(32).toString("hex"));
        const newUser = {
          id: `usr_${googleSubjectKey}`,
          username: `google_${googleSubjectKey}`,
          email,
          googleSub: payload.sub,
          fullName: payload.name?.trim() || email.split("@")[0],
          passwordHash: hash,
          salt,
          role: "admin",
          createdAt: new Date().toISOString(),
        };
        user = usePostgres ? await postgresService.createUser(newUser) : sqliteService.createUser(newUser);
      }
    }

    if (!user || user.role !== "admin") {
      return res.redirect("/admin/login?error=Akun+ini+belum+terdaftar+sebagai+administrator");
    }

    const fullName = user.full_name || user.fullName || email;
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      fullName,
    });

    res.setHeader(
      "Set-Cookie",
      `wedding_auth_token_v1=${encodeURIComponent(token)}; Path=/; Max-Age=604800; SameSite=Lax${
        protocol === "https" ? "; Secure" : ""
      }`
    );

    return res.redirect(`/admin?token=${encodeURIComponent(token)}`);
  } catch (err: any) {
    console.error("SSO Callback Error:", err);
    return res.redirect("/admin/login?error=Gagal+memproses+otentikasi+Google+SSO");
  }
});

// POST /api/auth/google - Masuk sebagai admin menggunakan Google Identity Services
router.post("/google", async (req: Request, res: Response) => {
  try {
    const googleClientId =
      process.env.GOOGLE_CLIENT_ID?.trim() ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
    const allowedEmails = (process.env.GOOGLE_SSO_ALLOWED_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (!googleClientId) {
      return res.status(503).json({
        error: "Login Google belum dikonfigurasi di server.",
      });
    }

    const credential = req.body?.credential;
    if (typeof credential !== "string" || credential.length === 0 || credential.length > 10000) {
      return res.status(400).json({ error: "Kredensial Google tidak valid." });
    }

    let payload;
    try {
      const ticket = await googleAuthClient.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ error: "Token Google tidak valid atau kedaluwarsa." });
    }

    const email = payload?.email?.trim().toLowerCase();
    if (!payload?.sub || !email || payload.email_verified !== true) {
      return res.status(401).json({
        error: "Akun Google tidak memiliki email terverifikasi.",
      });
    }

    const usePostgres = isPostgresConnected();
    const getUserByGoogleSub = (googleSub: string) =>
      usePostgres
        ? postgresService.getUserByGoogleSub(googleSub)
        : sqliteService.getUserByGoogleSub(googleSub);
    const getUserByEmail = (userEmail: string) =>
      usePostgres
        ? postgresService.getUserByEmail(userEmail)
        : sqliteService.getUserByEmail(userEmail);
    const linkGoogleSub = (userId: string, googleSub: string) =>
      usePostgres
        ? postgresService.linkGoogleSub(userId, googleSub)
        : sqliteService.linkGoogleSub(userId, googleSub);

    const existingUser = await getUserByEmail(email);

    if (allowedEmails.length > 0 && !allowedEmails.includes(email) && (!existingUser || existingUser.role !== "admin")) {
      return res.status(403).json({
        error: "Email Google ini belum diizinkan untuk mengelola undangan.",
      });
    }

    if (allowedEmails.length === 0 && (!existingUser || existingUser.role !== "admin")) {
      const existingSub = await getUserByGoogleSub(payload.sub);
      if (!existingSub || existingSub.role !== "admin") {
        return res.status(403).json({
          error: "Email Google ini belum terdaftar sebagai administrator.",
        });
      }
    }

    const googleSubjectKey = createHash("sha256").update(payload.sub).digest("hex");
    const googleUserId = `usr_${googleSubjectKey}`;
    const googleUsername = `google_${googleSubjectKey}`;
      usePostgres
        ? postgresService.getUserByGoogleSub(googleSub)
        : sqliteService.getUserByGoogleSub(googleSub);
    const getUserByEmail = (userEmail: string) =>
      usePostgres
        ? postgresService.getUserByEmail(userEmail)
        : sqliteService.getUserByEmail(userEmail);
    const linkGoogleSub = (userId: string, googleSub: string) =>
      usePostgres
        ? postgresService.linkGoogleSub(userId, googleSub)
        : sqliteService.linkGoogleSub(userId, googleSub);

    const linkExistingAdmin = async (existingUser: any) => {
      if (existingUser.role !== "admin") {
        return { user: null, status: 403 };
      }

      const existingGoogleSub = existingUser.google_sub || existingUser.googleSub;
      if (existingGoogleSub === payload.sub) {
        return { user: existingUser, status: null };
      }
      if (existingGoogleSub) {
        return { user: null, status: 409 };
      }

      try {
        const linked = await linkGoogleSub(existingUser.id, payload.sub);
        if (linked) {
          return {
            user: { ...existingUser, google_sub: payload.sub },
            status: null,
          };
        }
      } catch {
        // A concurrent login may have linked this subject between the lookup and update.
      }

      const subjectOwner = await getUserByGoogleSub(payload.sub);
      if (subjectOwner?.id === existingUser.id) {
        return { user: subjectOwner, status: null };
      }
      return { user: null, status: 409 };
    };

    let user = await getUserByGoogleSub(payload.sub);

    // Reuse an existing allowlisted admin account only when it is not linked to
    // another Google identity.
    if (!user) {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        const linkedAccount = await linkExistingAdmin(existingUser);
        if (!linkedAccount.user) {
          return res.status(linkedAccount.status || 403).json({
            error:
              linkedAccount.status === 409
                ? "Akun ini sudah terhubung ke akun Google lain."
                : "Akun ini tidak memiliki akses sebagai admin.",
          });
        }
        user = linkedAccount.user;
      }
    }

    if (!user) {
      const { hash, salt } = hashPassword(randomBytes(32).toString("hex"));
      const fullName = payload.name?.trim() || email.split("@")[0];
      const newUser = {
        id: googleUserId,
        username: googleUsername,
        email,
        googleSub: payload.sub,
        fullName,
        passwordHash: hash,
        salt,
        role: "admin",
        createdAt: new Date().toISOString(),
      };

      try {
        user = usePostgres
          ? await postgresService.createUser(newUser)
          : sqliteService.createUser(newUser);
      } catch (createError) {
        // A concurrent first login may have inserted the same subject already.
        user = await getUserByGoogleSub(payload.sub);
        if (!user) {
          const emailUser = await getUserByEmail(email);
          if (emailUser) {
            const linkedAccount = await linkExistingAdmin(emailUser);
            if (!linkedAccount.user) {
              return res.status(linkedAccount.status || 403).json({
                error:
                  linkedAccount.status === 409
                    ? "Akun ini sudah terhubung ke akun Google lain."
                    : "Akun ini tidak memiliki akses sebagai admin.",
              });
            }
            user = linkedAccount.user;
          }
        }
        if (!user) throw createError;
      }
    }

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        error: "Akun ini tidak memiliki akses sebagai admin.",
      });
    }

    const fullName = user.full_name || user.fullName || payload.name?.trim() || email;
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      fullName,
    });

    return res.json({
      success: true,
      message: "Berhasil masuk dengan Google.",
      user: {
        id: user.id,
        username: user.username,
        email,
        fullName,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    console.error("Google login error:", err);
    return res.status(500).json({
      error: "Terjadi kesalahan internal saat login dengan Google.",
    });
  }
});

// POST /api/auth/register - Pendaftaran akun baru (Khusus Superadmin terotentikasi)
router.post("/register", async (req: Request, res: Response) => {
  try {
    // Kunci registrasi publik: hanya administrator yang sudah login yang boleh membuat akun baru
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        error: "Registrasi publik dinonaktifkan demi keamanan. Silakan masuk menggunakan akun admin.",
      });
    }
    const token = authHeader.split(" ")[1];
    const requestingUser = verifyToken(token);
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({
        error: "Hanya akun administrator yang berwenang mendaftarkan akun baru.",
      });
    }

    const { username, password, fullName, email } = req.body;

    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return res.status(400).json({
        error: "Username minimal 3 karakter tanpa spasi",
      });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        error: "Kata sandi minimal 6 karakter",
      });
    }

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return res.status(400).json({
        error: "Nama lengkap wajib diisi",
      });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, "");
    const cleanFullName = fullName.trim();
    const cleanEmail = email && typeof email === "string" ? email.trim().toLowerCase() : undefined;

    // Cek apakah username sudah dipakai
    const existingUser = isPostgresConnected()
      ? await postgresService.getUserByUsername(cleanUsername)
      : sqliteService.getUserByUsername(cleanUsername);

    if (existingUser) {
      return res.status(400).json({
        error: `Username "${cleanUsername}" sudah digunakan. Silakan gunakan username lain.`,
      });
    }

    // Cek apakah email sudah dipakai jika diisi
    if (cleanEmail) {
      const existingEmail = isPostgresConnected()
        ? await postgresService.getUserByEmail(cleanEmail)
        : sqliteService.getUserByEmail(cleanEmail);

      if (existingEmail) {
        return res.status(400).json({
          error: `Email "${cleanEmail}" sudah terdaftar.`,
        });
      }
    }

    const id = "usr_" + Date.now();
    const { hash, salt } = hashPassword(password);

    const newUser = isPostgresConnected()
      ? await postgresService.createUser({
          id,
          username: cleanUsername,
          email: cleanEmail,
          fullName: cleanFullName,
          passwordHash: hash,
          salt,
          role: "admin",
          createdAt: new Date().toISOString(),
        })
      : sqliteService.createUser({
          id,
          username: cleanUsername,
          email: cleanEmail,
          fullName: cleanFullName,
          passwordHash: hash,
          salt,
          role: "admin",
          createdAt: new Date().toISOString(),
        });

    if (!newUser) {
      return res.status(500).json({ error: "Gagal menyimpan akun baru" });
    }

    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    return res.status(201).json({
      success: true,
      message: "Akun berhasil didaftarkan",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
      token,
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return res.status(500).json({
      error: err.message || "Terjadi kesalahan internal saat mendaftar",
    });
  }
});

// POST /api/auth/login - Masuk dengan kredensial
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username dan kata sandi wajib diisi",
      });
    }

    const cleanIdentifier = String(username).trim();

    // Cari berdasarkan username atau email
    const user = isPostgresConnected()
      ? (await postgresService.getUserByUsername(cleanIdentifier)) ||
        (await postgresService.getUserByEmail(cleanIdentifier))
      : sqliteService.getUserByUsername(cleanIdentifier) ||
        sqliteService.getUserByEmail(cleanIdentifier);

    if (!user) {
      return res.status(401).json({
        error: "Username atau kata sandi tidak sesuai",
      });
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(401).json({
        error: "Username atau kata sandi tidak sesuai",
      });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.full_name,
    });

    const isSecure = req.protocol === "https" || req.get("x-forwarded-proto") === "https";
    res.setHeader(
      "Set-Cookie",
      `wedding_auth_token_v1=${encodeURIComponent(token)}; Path=/; Max-Age=604800; SameSite=Lax${
        isSecure ? "; Secure" : ""
      }`
    );

    return res.json({
      success: true,
      message: "Berhasil masuk",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({
      error: err.message || "Terjadi kesalahan internal saat login",
    });
  }
});

// GET /api/auth/me - Verifikasi sesi token aktif
router.get("/me", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ authenticated: false, error: "Belum login" });
    }

    const user = isPostgresConnected()
      ? await postgresService.getUserById(req.user.id)
      : sqliteService.getUserById(req.user.id);

    if (!user) {
      return res.status(401).json({ authenticated: false, error: "Akun tidak ditemukan" });
    }

    return res.json({
      authenticated: true,
      user,
    });
  } catch (err: any) {
    console.error("Auth me error:", err);
    return res.status(500).json({ error: "Gagal memverifikasi akun" });
  }
});

// POST /api/auth/logout - Keluar sesi
router.post("/logout", (_req: Request, res: Response) => {
  res.setHeader("Set-Cookie", "wedding_auth_token_v1=; Path=/; Max-Age=0; SameSite=Lax");
  res.json({ success: true, message: "Berhasil keluar" });
});

export default router;
