import { Router, Request, Response } from "express";
import { getNormalizedWeddingService, isPostgresConnected } from "../postgres";

const router = Router();

// GET /api/sections - Mengambil daftar section settings
router.get("/", async (_req: Request, res: Response) => {
  try {
    const service = getNormalizedWeddingService();
    if (isPostgresConnected() && service) {
      const sections = await service.getSections();
      return res.json({ success: true, sections, source: "postgresql_12_tables" });
    }

    res.json({ success: true, sections: [], source: "fallback" });
  } catch (err: any) {
    console.error("Error in GET /api/sections:", err);
    res.status(500).json({ error: err.message || "Gagal mengambil data section" });
  }
});

// PUT /api/sections/:code - Memperbarui status/urutan section
router.put("/:code", async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const { isEnabled, sortOrder } = req.body;

    const service = getNormalizedWeddingService();
    if (isPostgresConnected() && service) {
      const updated = await service.updateSection(code, isEnabled, sortOrder);
      return res.json({ success: updated, message: `Section ${code} berhasil diperbarui` });
    }

    res.status(503).json({ error: "Layanan database belum siap" });
  } catch (err: any) {
    console.error("Error in PUT /api/sections:", err);
    res.status(400).json({ error: err.message || "Gagal memperbarui section" });
  }
});

export default router;
