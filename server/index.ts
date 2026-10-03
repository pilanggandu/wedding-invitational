import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { isSupabaseConfigured } from "./supabase";
import invitationRoutes from "./routes/invitation";
import guestsRoutes from "./routes/guests";
import wishesRoutes from "./routes/wishes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Middleware
app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? "*" : [CORS_ORIGIN, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));

// Request Logger sederhana
app.use((req, _res, next) => {
  const timestamp = new Date().toLocaleTimeString("id-ID");
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "wedding-express-backend",
    supabaseConnected: isSupabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/invitation", invitationRoutes);
app.use("/api/guests", guestsRoutes);
app.use("/api/wishes", wishesRoutes);

// Root route info
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Wedding Invitation API Server (Express + Supabase)",
    endpoints: [
      "/api/health",
      "/api/invitation (GET, PUT)",
      "/api/guests (GET, POST, PATCH, DELETE)",
      "/api/wishes (GET, POST, DELETE)",
    ],
    supabaseConfigured: isSupabaseConfigured(),
  });
});

// Start Server
app.listen(PORT, () => {
  console.log("==================================================");
  console.log(`🚀 Express Backend Server aktif di port ${PORT}`);
  console.log(`👉 API Base URL: http://localhost:${PORT}/api`);
  console.log(
    `🗄️ Supabase Status: ${
      isSupabaseConfigured() ? "✅ Terhubung" : "⚠️ Menunggu Konfigurasi .env"
    }`
  );
  console.log("==================================================");
});

export default app;
