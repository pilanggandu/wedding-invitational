import { Router, Request, Response } from "express";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase";

const router = Router();

// Fallback in-memory list
let inMemoryGuests = [
  {
    id: "g_1",
    name: "Bapak Budi Santoso & Keluarga",
    slug: "Bapak+Budi+Santoso+%26+Keluarga",
    phone: "6281234567890",
    category: "VIP",
    isSent: true,
    notes: "Tamu kehormatan keluarga besar",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "g_2",
    name: "Rizky Pratama & Partner",
    slug: "Rizky+Pratama+%26+Partner",
    phone: "6281987654321",
    category: "Sahabat",
    isSent: false,
    notes: "Teman kuliah seperjuangan",
    createdAt: "2026-10-02T11:00:00Z",
  },
];

// GET /api/guests - Ambil seluruh daftar tamu
router.get("/", async (_req: Request, res: Response) => {
  try {
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

    res.json({ guests: inMemoryGuests, source: "in-memory-fallback" });
  } catch (err: any) {
    console.error("Error in GET /api/guests:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// POST /api/guests - Tambah tamu baru
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, phone = "", category = "Sahabat", notes = "" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Nama tamu wajib diisi" });
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim().replace(/^0/, "62").replace(/[^0-9]/g, "");
    const slug = encodeURIComponent(cleanName).replace(/%20/g, "+");
    const id = "g_" + Date.now();
    const createdAt = new Date().toISOString();

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

    const newGuest = {
      id,
      name: cleanName,
      slug,
      phone: cleanPhone,
      category,
      isSent: false,
      notes,
      createdAt,
    };
    inMemoryGuests = [newGuest, ...inMemoryGuests];

    res.status(201).json({ success: true, guest: newGuest, source: "in-memory-fallback" });
  } catch (err: any) {
    console.error("Error in POST /api/guests:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// PATCH /api/guests/:id - Update status kirim atau informasi tamu
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isSent, notes, category, phone } = req.body;

    const supabase = getSupabaseClient();

    if (isSupabaseConfigured() && supabase) {
      const updates: any = {};
      if (typeof isSent === "boolean") updates.is_sent = isSent;
      if (typeof notes === "string") updates.notes = notes;
      if (category) updates.category = category;
      if (phone !== undefined) updates.phone = phone;

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

    inMemoryGuests = inMemoryGuests.map((g) =>
      g.id === id
        ? {
            ...g,
            ...(typeof isSent === "boolean" ? { isSent } : {}),
            ...(typeof notes === "string" ? { notes } : {}),
            ...(category ? { category } : {}),
          }
        : g
    );

    res.json({ success: true, source: "in-memory-fallback" });
  } catch (err: any) {
    console.error("Error in PATCH /api/guests/:id:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// DELETE /api/guests/:id - Hapus tamu
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) {
        console.error("Supabase DELETE guests error:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.json({ success: true, id, source: "supabase" });
    }

    inMemoryGuests = inMemoryGuests.filter((g) => g.id !== id);
    res.json({ success: true, id, source: "in-memory-fallback" });
  } catch (err: any) {
    console.error("Error in DELETE /api/guests/:id:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
