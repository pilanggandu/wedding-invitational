import { Router, Request, Response } from "express";
import { getNormalizedWeddingService, isPostgresConnected } from "../postgres";

const router = Router();

// GET /api/rsvps - Mengambil ringkasan dan daftar RSVP
router.get("/", async (_req: Request, res: Response) => {
  try {
    const service = getNormalizedWeddingService();
    if (isPostgresConnected() && service) {
      const summary = await service.getRsvpSummary();
      const rsvps = await service.getRsvpList();
      return res.json({ success: true, summary, rsvps, source: "postgresql_12_tables" });
    }

    res.json({
      success: true,
      summary: {
        totalGuests: 0,
        attending: 0,
        notAttending: 0,
        estimatedHeads: 0,
      },
      rsvps: [],
      source: "fallback",
    });
  } catch (err: any) {
    console.error("Error in GET /api/rsvps:", err);
    res.status(500).json({ error: err.message || "Gagal mengambil data RSVP" });
  }
});

// POST /api/rsvps - Submit konfirmasi kehadiran (1:1 per guest, validasi kuota)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { guestId, status, attendeeCount, message } = req.body;

    if (!guestId) {
      return res.status(400).json({ error: "guestId wajib disertakan" });
    }
    if (status !== 1 && status !== 2) {
      return res.status(400).json({ error: "Status kehadiran tidak valid (1 = Hadir, 2 = Tidak Hadir)" });
    }

    const service = getNormalizedWeddingService();
    if (isPostgresConnected() && service) {
      const rsvp = await service.submitRsvp({
        guestId,
        status: Number(status),
        attendeeCount: Number(attendeeCount || 0),
        message: message || "",
      });
      return res.json({ success: true, data: rsvp, message: "Konfirmasi kehadiran berhasil disimpan" });
    }

    res.status(503).json({ error: "Layanan database belum siap" });
  } catch (err: any) {
    console.error("Error in POST /api/rsvps:", err);
    res.status(400).json({ error: err.message || "Gagal menyimpan konfirmasi kehadiran" });
  }
});

export default router;
