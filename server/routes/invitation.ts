import { Router, Request, Response } from "express";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase";

const router = Router();

// Fallback in-memory store jika Supabase belum aktif
let inMemoryWeddingData: any = null;

// GET /api/invitation - Mendapatkan data lengkap undangan pernikahan
router.get("/", async (_req: Request, res: Response) => {
  try {
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

    // Return in-memory fallback
    res.json({
      ...(inMemoryWeddingData || {
        id: "inv_gilang_salsa",
        activeTemplateId: "paper-art-maroon",
        source: "in-memory-fallback",
      }),
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

    // Update in-memory fallback
    inMemoryWeddingData = { ...payload };
    res.json({ success: true, data: inMemoryWeddingData, source: "in-memory-fallback" });
  } catch (err: any) {
    console.error("Error in PUT /api/invitation:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
