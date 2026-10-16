import { Router, Request, Response } from "express";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase";
import { postgresService, isPostgresConnected, getNormalizedWeddingService } from "../postgres";
import { sqliteService } from "../sqlite";

const router = Router();

// GET /api/wishes - Ambil semua ucapan dan doa restu
router.get("/", async (_req: Request, res: Response) => {
  try {
    // 1. PostgreSQL (Local / VPS)
    if (isPostgresConnected()) {
      const wishes = await postgresService.getWishes();
      return res.json({ wishes, source: "postgresql" });
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase GET wishes error:", error);
        return res.status(500).json({ error: error.message });
      }

      const formatted = (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        relationship: row.relationship,
        attendance: row.attendance,
        message: row.message,
        date: new Date(row.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        createdAt: row.created_at,
      }));

      return res.json({ wishes: formatted, source: "supabase" });
    }

    // 3. SQLite Local
    const wishes = sqliteService.getWishes();
    res.json({ wishes, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in GET /api/wishes:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// POST /api/wishes - Kirim ucapan & RSVP baru
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, relationship = "Sahabat", attendance = "Hadir", message } = req.body;

    if (!name || !name.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: "Nama dan pesan ucapan wajib diisi" });
    }

    const id = "w_" + Date.now();
    const createdAt = new Date().toISOString();
    const cleanName = name.trim();
    const cleanMessage = message.trim();

    // 1. PostgreSQL (Local / VPS)
    if (isPostgresConnected()) {
      const created = await postgresService.createWish({
        id,
        name: cleanName,
        relationship: relationship.trim(),
        attendance,
        message: cleanMessage,
        createdAt,
      });
      return res.status(201).json({ success: true, wish: created, source: "postgresql" });
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("wishes")
        .insert({
          id,
          name: cleanName,
          relationship: relationship.trim(),
          attendance,
          message: cleanMessage,
          created_at: createdAt,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase POST wishes error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({
        success: true,
        wish: {
          id: data.id,
          name: data.name,
          relationship: data.relationship,
          attendance: data.attendance,
          message: data.message,
          date: "Baru saja",
          createdAt: data.created_at,
        },
        source: "supabase",
      });
    }

    // 3. Simpan ke SQLite lokal
    const created = sqliteService.createWish({
      id,
      name: cleanName,
      relationship: relationship.trim(),
      attendance,
      message: cleanMessage,
      createdAt,
    });

    res.status(201).json({ success: true, wish: created, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in POST /api/wishes:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// PATCH /api/wishes/:id/status - Moderasi ucapan (0=pending, 1=approved, 2=rejected)
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === undefined || ![0, 1, 2].includes(Number(status))) {
      return res.status(400).json({ error: "Status moderasi tidak valid (0=pending, 1=approved, 2=rejected)" });
    }

    const service = getNormalizedWeddingService();
    if (isPostgresConnected() && service) {
      const updated = await service.updateWishStatus(id, Number(status));
      return res.json({ success: updated, message: `Status ucapan ${id} berhasil diperbarui` });
    }

    res.json({ success: true, message: "Status ucapan diperbarui (mock)" });
  } catch (err: any) {
    console.error("Error in PATCH /api/wishes/:id/status:", err);
    res.status(500).json({ error: err.message || "Gagal memperbarui status ucapan" });
  }
});

// DELETE /api/wishes/:id - Hapus ucapan (moderasi)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. PostgreSQL (Local / VPS)
    if (isPostgresConnected()) {
      await postgresService.deleteWish(id);
      return res.json({ success: true, id, source: "postgresql" });
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("wishes").delete().eq("id", id);
      if (error) {
        console.error("Supabase DELETE wishes error:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.json({ success: true, id, source: "supabase" });
    }

    // 3. Hapus dari SQLite lokal
    sqliteService.deleteWish(id);
    res.json({ success: true, id, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in DELETE /api/wishes/:id:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
