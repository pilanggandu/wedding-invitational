import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase";
import { postgresService, isPostgresConnected, getNormalizedWeddingService } from "../postgres";
import { sqliteService } from "../sqlite";
import { ensureGuestQuotaSupported, formatLegacyGuest, GuestValidationError, validateGuestCreate, validateGuestUpdate } from "../guestValidation";

const router = Router();

// GET /api/guests - Ambil seluruh daftar tamu
router.get("/", async (_req: Request, res: Response) => {
  try {
    // 1. PostgreSQL (Local / VPS)
    if (isPostgresConnected()) {
      const guests = await postgresService.getGuests();
      return res.json({ guests, source: "postgresql" });
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase GET guests error:", error);
        return res.status(500).json({ error: error.message });
      }

      const formatted = (data || []).map(formatLegacyGuest);

      return res.json({ guests: formatted, source: "supabase" });
    }

    // 3. SQLite Local
    const guests = sqliteService.getGuests().map(formatLegacyGuest);
    res.json({ guests, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in GET /api/guests:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// GET /api/guests/verify/:token - Verifikasi token undangan tamu & catat open tracking
router.get("/verify/:token", async (req: Request<{ token: string }>, res: Response) => {
  try {
    const { token } = req.params;
    const service = getNormalizedWeddingService();
    if (isPostgresConnected() && service) {
      const guest = await service.verifyGuestToken(token);
      if (!guest) {
        return res.status(404).json({ error: "Undangan tidak ditemukan atau token tidak valid" });
      }
      return res.json({ success: true, guest, source: "postgresql_12_tables" });
    }

    res.status(404).json({ error: "Token tidak ditemukan" });
  } catch (err: any) {
    console.error("Error in GET /api/guests/verify/:token:", err);
    res.status(500).json({ error: err.message || "Gagal memverifikasi token tamu" });
  }
});

// POST /api/guests - Tambah tamu baru
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, phone, category, notes, quota } = validateGuestCreate(req.body);
    const postgresConnected = isPostgresConnected();
    ensureGuestQuotaSupported(quota, postgresConnected && Boolean(getNormalizedWeddingService()));
    const slug = encodeURIComponent(name).replace(/%20/g, "+");
    const id = `g_${randomUUID()}`;
    const createdAt = new Date().toISOString();

    // 1. PostgreSQL (Local / VPS)
    if (postgresConnected) {
      const created = await postgresService.createGuest({
        id,
        name,
        slug,
        phone,
        category,
        notes,
        quota,
        createdAt,
      });
      return res.status(201).json({ success: true, guest: created, source: "postgresql" });
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("guests")
        .insert({
          id,
          name,
          slug,
          phone,
          category,
          is_sent: false,
          notes,
          created_at: createdAt,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase POST guests error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({
        success: true,
        guest: formatLegacyGuest(data),
        source: "supabase",
      });
    }

    // 3. Simpan ke database SQLite lokal
    const created = sqliteService.createGuest({
      id,
      name,
      slug,
      phone,
      category,
      notes,
      createdAt,
    });

    res.status(201).json({ success: true, guest: formatLegacyGuest(created), source: "sqlite" });
  } catch (err: any) {
    if (err instanceof GuestValidationError) return res.status(400).json({ error: err.message });
    console.error("Error in POST /api/guests:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// PATCH /api/guests/:id - Update status kirim atau informasi tamu
router.patch("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const updates = validateGuestUpdate(req.body);
    const postgresConnected = isPostgresConnected();
    ensureGuestQuotaSupported(updates.quota, postgresConnected && Boolean(getNormalizedWeddingService()));
    const { isSent, notes, category, phone, name } = updates;

    // 1. PostgreSQL (Local / VPS)
    if (postgresConnected) {
      const updated = await postgresService.updateGuest(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Tamu tidak ditemukan" });
      }
      return res.json({ success: true, guest: updated, source: "postgresql" });
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const persistedUpdates: Record<string, unknown> = {};
      if (isSent !== undefined) persistedUpdates.is_sent = isSent;
      if (notes !== undefined) persistedUpdates.notes = notes;
      if (category !== undefined) persistedUpdates.category = category;
      if (phone !== undefined) persistedUpdates.phone = phone;
      if (name !== undefined) {
        persistedUpdates.name = name;
        persistedUpdates.slug = encodeURIComponent(name).replace(/%20/g, "+");
      }

      const table = supabase.from("guests");
      const query = Object.keys(persistedUpdates).length ? table.update(persistedUpdates).select("*") : table.select("*");
      const { data, error } = await query
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase PATCH guests error:", error);
        return res.status(error.code === "PGRST116" ? 404 : 500).json({ error: error.message });
      }

      return res.json({ success: true, guest: formatLegacyGuest(data), source: "supabase" });
    }

    // 3. Update di database SQLite lokal
    const updated = sqliteService.updateGuest(id, { isSent, notes, category, phone, name });
    if (!updated) {
      return res.status(404).json({ error: "Tamu tidak ditemukan" });
    }

    res.json({ success: true, guest: formatLegacyGuest(updated), source: "sqlite" });
  } catch (err: any) {
    if (err instanceof GuestValidationError) return res.status(400).json({ error: err.message });
    console.error("Error in PATCH /api/guests/:id:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// DELETE /api/guests/:id - Hapus tamu
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // 1. PostgreSQL (Local / VPS)
    if (isPostgresConnected()) {
      await postgresService.deleteGuest(id);
      return res.json({ success: true, id, source: "postgresql" });
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) {
        console.error("Supabase DELETE guests error:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.json({ success: true, id, source: "supabase" });
    }

    // 3. Hapus dari SQLite lokal
    sqliteService.deleteGuest(id);
    res.json({ success: true, id, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in DELETE /api/guests/:id:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
