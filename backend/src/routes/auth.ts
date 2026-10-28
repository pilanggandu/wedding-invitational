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

// POST /api/auth/google - Masuk sebagai admin menggunakan Google Identity Services
router.post("/google", async (req: Request, res: Response) => {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const allowedEmails = (process.env.GOOGLE_SSO_ALLOWED_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (!googleClientId || allowedEmails.length === 0) {
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

    if (!allowedEmails.includes(email)) {
      return res.status(403).json({
        error: "Email Google ini belum diizinkan untuk mengelola undangan.",
      });
    }

    const googleSubjectKey = createHash("sha256").update(payload.sub).digest("hex");
    const googleUserId = `usr_${googleSubjectKey}`;
    const googleUsername = `google_${googleSubjectKey}`;
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

// POST /api/auth/register - Pendaftaran akun baru
router.post("/register", async (req: Request, res: Response) => {
  try {
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
  res.json({ success: true, message: "Berhasil keluar" });
});

export default router;
