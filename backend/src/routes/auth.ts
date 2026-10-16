import { Router, Request, Response } from "express";
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
