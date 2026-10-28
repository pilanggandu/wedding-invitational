import express, { Request, Response } from "express";
import cors from "cors";
import path from "node:path";
import dotenv from "dotenv";
import { isSupabaseConfigured } from "./supabase";
import { initPostgres, isPostgresConfigured, isPostgresConnected } from "./postgres";
import invitationRoutes from "./routes/invitation";
import guestsRoutes from "./routes/guests";
import wishesRoutes from "./routes/wishes";
import authRoutes from "./routes/auth";
import rsvpsRoutes from "./routes/rsvps";
import sectionsRoutes from "./routes/sections";

dotenv.config();
dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Inisialisasi PostgreSQL jika ada konfigurasi
if (isPostgresConfigured()) {
  initPostgres().catch((err) => {
    console.warn("PostgreSQL initialization notice:", err.message);
  });
}

// Middleware
app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? "*" : [CORS_ORIGIN, "http://localhost:3000", "http://localhost:3022"],
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
  let activeDb = "sqlite";
  if (isPostgresConnected()) {
    activeDb = "postgresql";
  } else if (isSupabaseConfigured()) {
    activeDb = "supabase";
  }

  res.json({
    status: "ok",
    service: "wedding-express-backend",
    database: activeDb,
    postgresActive: isPostgresConnected(),
    sqliteActive: true,
    supabaseConnected: isSupabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/invitation", invitationRoutes);
app.use("/api/guests", guestsRoutes);
app.use("/api/wishes", wishesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rsvps", rsvpsRoutes);
app.use("/api/sections", sectionsRoutes);

// Root route info
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Wedding Invitation API Server (Express + SQLite / Supabase)",
    endpoints: [
      "/api/health",
      "/api/auth (POST register, POST login, POST google, GET me, POST logout)",
      "/api/invitation (GET, PUT)",
      "/api/guests (GET, POST, PATCH, DELETE)",
      "/api/wishes (GET, POST, DELETE)",
    ],
    database: isSupabaseConfigured() ? "supabase" : "sqlite (server/data/wedding.db)",
    supabaseConfigured: isSupabaseConfigured(),
  });
});

// Start Server
app.listen(PORT, () => {
  console.log("==================================================");
  console.log(`🚀 Express Backend Server aktif di port ${PORT}`);
  console.log(`👉 API Base URL: http://localhost:${PORT}/api`);
  console.log(
    `🗄️ Database: ${
      isSupabaseConfigured()
        ? "✅ Supabase Cloud Database"
        : "✅ SQLite Database (server/data/wedding.db)"
    }`
  );
  console.log("==================================================");
});

export default app;
