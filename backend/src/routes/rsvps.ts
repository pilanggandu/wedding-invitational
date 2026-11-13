import { Router, Request, Response } from "express";
import { getNormalizedWeddingService, isPostgresConnected } from "../postgres";
import { sqliteService } from "../sqlite";
import { requireAuth } from "../auth";

const router = Router();

// GET /api/rsvps - Mengambil ringkasan dan daftar RSVP (Khusus Admin)
router.get("/", requireAuth, async (_req: Request, res: Response) => {
  try {
    const service = getNormalizedWeddingService();
    if (isPostgresConnected() && service) {
      const summary = await service.getRsvpSummary();
      const rsvps = await service.getRsvpList();
      return res.json({ success: true, summary, rsvps, source: "postgresql_12_tables" });
    }

    const summary = sqliteService.getRsvpSummary();
    const rsvps = sqliteService.getRsvpList();
    return res.json({ success: true, summary, rsvps, source: "sqlite" });
  } catch (err: any) {
    console.error("Error in GET /api/rsvps:", err);
    res.status(500).json({ error: err.message || "Gagal mengambil data RSVP" });
  }
});

// POST /api/rsvps - Submit konfirmasi kehadiran (1:1 per guest, validasi kuota)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { guestId, name, status, attendeeCount, message } = req.body;

    if (!guestId && (!name || !name.trim())) {
      return res.status(400).json({ error: "guestId atau nama tamu wajib disertakan" });
    }
    if (status !== 1 && status !== 2) {
      return res.status(400).json({ error: "Status kehadiran tidak valid (1 = Hadir, 2 = Tidak Hadir)" });
    }

    const service = getNormalizedWeddingService();
    if (isPostgresConnected() && service) {
      const rsvp = await service.submitRsvp({
        guestId,
        name: name ? name.trim() : undefined,
        status: Number(status),
        attendeeCount: Number(attendeeCount || (status === 1 ? 1 : 0)),
        message: message || "",
      });
      return res.json({ success: true, data: rsvp, message: "Konfirmasi kehadiran berhasil disimpan" });
    }

    const rsvp = sqliteService.submitRsvp({
      guestId,
      name: name ? name.trim() : undefined,
      status: Number(status),
      attendeeCount: Number(attendeeCount || (status === 1 ? 1 : 0)),
      message: message || "",
    });
    return res.json({ success: true, data: rsvp, message: "Konfirmasi kehadiran berhasil disimpan" });
  } catch (err: any) {
    console.error("Error in POST /api/rsvps:", err);
    res.status(400).json({ error: err.message || "Gagal menyimpan konfirmasi kehadiran" });
  }
});

export default router;
