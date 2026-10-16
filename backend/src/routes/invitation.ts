import { Router, Request, Response } from "express";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase";
import { postgresService, isPostgresConnected } from "../postgres";
import { sqliteService } from "../sqlite";

const router = Router();

// GET /api/invitation - Mendapatkan data lengkap undangan pernikahan
router.get("/", async (_req: Request, res: Response) => {
  try {
    // 1. PostgreSQL (Local / VPS)
    if (isPostgresConnected()) {
      const pgData = await postgresService.getWedding("inv_gilang_salsa");
      if (pgData) {
        return res.json({ ...pgData, source: "postgresql" });
      }
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("weddings")
        .select("*")
        .eq("id", "inv_gilang_salsa")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Supabase GET invitation error:", error);
        return res.status(500).json({ error: error.message });
      }

      if (data) {
        return res.json({
          id: data.id,
          activeTemplateId: data.active_template_id,
          themePalette: data.theme_palette,
          couple: data.couple,
          general: data.general,
          countdownTarget: data.countdown_target,
          events: data.events,
          stories: data.stories,
          gallery: data.gallery,
          gifts: data.gifts,
          dresscode: data.dresscode,
          source: "supabase",
        });
      }
    }

    // 3. SQLite Fallback
    const sqliteData = sqliteService.getWedding("inv_gilang_salsa");
    if (sqliteData) {
      return res.json({
        ...sqliteData,
        source: "sqlite",
      });
    }

    res.json({
      id: "inv_gilang_salsa",
      activeTemplateId: "paper-art-maroon",
      source: "sqlite-default",
    });
  } catch (err: any) {
    console.error("Error in GET /api/invitation:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// PUT /api/invitation - Memperbarui data undangan pernikahan
router.put("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    // 1. PostgreSQL (Local / VPS)
    if (isPostgresConnected()) {
      const saved = await postgresService.upsertWedding(payload);
      return res.json({ success: true, data: saved, source: "postgresql" });
    }

    // 2. Supabase Cloud
    const supabase = getSupabaseClient();
    if (isSupabaseConfigured() && supabase) {
      const record = {
        id: payload.id || "inv_gilang_salsa",
        active_template_id: payload.activeTemplateId || "paper-art-maroon",
        theme_palette: payload.themePalette || {},
        couple: payload.couple || {},
        general: payload.general || {},
        countdown_target: payload.countdownTarget || "2026-11-21T08:00:00+07:00",
        events: payload.events || [],
        stories: payload.stories || [],
        gallery: payload.gallery || [],
        gifts: payload.gifts || {},
        dresscode: payload.dresscode || {},
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("weddings")
        .upsert(record)
        .select()
        .single();

      if (error) {
        console.error("Supabase PUT invitation error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true, data, source: "supabase" });
    }

    // Simpan ke database SQLite lokal
    const saved = sqliteService.upsertWedding(payload);
    res.json({ success: true, data: saved, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in PUT /api/invitation:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
