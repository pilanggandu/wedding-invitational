import { Router, Request, Response } from "express";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase";
import { postgresService, isPostgresConnected, getNormalizedWeddingService } from "../postgres";
import { sqliteService } from "../sqlite";

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

      const formatted = (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        phone: row.phone || "",
        category: row.category,
        isSent: row.is_sent,
        notes: row.notes || "",
        createdAt: row.created_at,
      }));

      return res.json({ guests: formatted, source: "supabase" });
    }

    // 3. SQLite Local
    const guests = sqliteService.getGuests();
    res.json({ guests, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in GET /api/guests:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// GET /api/guests/verify/:token - Verifikasi token undangan tamu & catat open tracking
router.get("/verify/:token", async (req: Request, res: Response) => {
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
    const { name, phone = "", category = "Sahabat", notes = "", quota = 1 } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Nama tamu wajib diisi" });
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim().replace(/^0/, "62").replace(/[^0-9]/g, "");
    const slug = encodeURIComponent(cleanName).replace(/%20/g, "+");
    const id = "g_" + Date.now();
    const createdAt = new Date().toISOString();

    // 1. PostgreSQL (Local / VPS)
    if (isPostgresConnected()) {
      const created = await postgresService.createGuest({
        id,
        name: cleanName,
        slug,
        phone: cleanPhone,
        category,
        notes,
        quota: Number(quota || 1),
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
          name: cleanName,
          slug,
          phone: cleanPhone,
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
        guest: {
          id: data.id,
          name: data.name,
          slug: data.slug,
          phone: data.phone,
          category: data.category,
          isSent: data.is_sent,
          notes: data.notes,
          createdAt: data.created_at,
        },
        source: "supabase",
      });
    }

    // 3. Simpan ke database SQLite lokal
    const created = sqliteService.createGuest({
      id,
      name: cleanName,
      slug,
      phone: cleanPhone,
      category,
      notes,
      createdAt,
    });

    res.status(201).json({ success: true, guest: created, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in POST /api/guests:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// PATCH /api/guests/:id - Update status kirim atau informasi tamu
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isSent, notes, category, phone, name, quota } = req.body;

    // 1. PostgreSQL (Local / VPS)
    if (isPostgresConnected()) {
      const updated = await postgresService.updateGuest(id, {
        isSent,
        notes,
        category,
        phone,
        name,
        quota: quota !== undefined ? Number(quota) : undefined,
      });
      if (!updated) {
        return res.status(404).json({ error: "Tamu tidak ditemukan" });
      }
      return res.json({ success: true, guest: updated, source: "postgresql" });
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const updates: any = {};
      if (typeof isSent === "boolean") updates.is_sent = isSent;
      if (typeof notes === "string") updates.notes = notes;
      if (category) updates.category = category;
      if (phone !== undefined) updates.phone = phone;
      if (name) updates.name = name;

      const { data, error } = await supabase
        .from("guests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase PATCH guests error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true, guest: data, source: "supabase" });
    }

    // 3. Update di database SQLite lokal
    const updated = sqliteService.updateGuest(id, { isSent, notes, category, phone, name });
    if (!updated) {
      return res.status(404).json({ error: "Tamu tidak ditemukan" });
    }

    res.json({ success: true, guest: updated, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in PATCH /api/guests/:id:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// DELETE /api/guests/:id - Hapus tamu
router.delete("/:id", async (req: Request, res: Response) => {
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
