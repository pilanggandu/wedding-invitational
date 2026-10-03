import { Router, Request, Response } from "express";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase";

const router = Router();

// Fallback in-memory wishes
let inMemoryWishes = [
  {
    id: "w_1",
    name: "Rian & Fani",
    relationship: "Teman Kuliah Gilang",
    attendance: "Hadir dong! 😋",
    message: "Selamat menempuh hidup baru Gilang & Salsa! Semoga langgeng dan samawa selalu sampai kakek nenek!",
    createdAt: "2026-10-02T10:00:00Z",
  },
  {
    id: "w_2",
    name: "dr. Hendra & Keluarga",
    relationship: "Kerabat Salsa",
    attendance: "Hadir dong! 😋",
    message: "Barakallahu lakuma wa baraka alaika wa jama'a bainakuma fii khair. Turut berbahagia untuk kedua mempelai.",
    createdAt: "2026-10-02T12:30:00Z",
  },
  {
    id: "w_3",
    name: "Bima Sakti",
    relationship: "Sahabat Nongkrong",
    attendance: "Masih mikir-mikir 👀",
    message: "Akhirnya sohib gua sold out juga! Doain gua cepet nyusul ya bro, insyaAllah meluncur ke Tuban!",
    createdAt: "2026-10-03T08:15:00Z",
  },
];

// GET /api/wishes - Ambil semua ucapan dan doa restu
router.get("/", async (_req: Request, res: Response) => {
  try {
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

    res.json({ wishes: inMemoryWishes, source: "in-memory-fallback" });
  } catch (err: any) {
    console.error("Error in GET /api/wishes:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// POST /api/wishes - Kirim ucapan & RSVP baru
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, relationship = "Sahabat", attendance = "Hadir dong! 😋", message } = req.body;

    if (!name || !name.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: "Nama dan pesan ucapan wajib diisi" });
    }

    const id = "w_" + Date.now();
    const createdAt = new Date().toISOString();
    const cleanName = name.trim();
    const cleanMessage = message.trim();

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

    const newWish = {
      id,
      name: cleanName,
      relationship: relationship.trim(),
      attendance,
      message: cleanMessage,
      date: "Baru saja",
      createdAt,
    };
    inMemoryWishes = [newWish, ...inMemoryWishes];

    res.status(201).json({ success: true, wish: newWish, source: "in-memory-fallback" });
  } catch (err: any) {
    console.error("Error in POST /api/wishes:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// DELETE /api/wishes/:id - Hapus ucapan (moderasi)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("wishes").delete().eq("id", id);
      if (error) {
        console.error("Supabase DELETE wishes error:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.json({ success: true, id, source: "supabase" });
    }

    inMemoryWishes = inMemoryWishes.filter((w) => w.id !== id);
    res.json({ success: true, id, source: "in-memory-fallback" });
  } catch (err: any) {
    console.error("Error in DELETE /api/wishes/:id:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
