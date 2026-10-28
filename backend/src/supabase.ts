import { createClient, SupabaseClient } from "@supabase/supabase-js";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });
dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes("your-project-id") &&
      !supabaseKey.includes("your-supabase-")
  );
};

let client: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseKey);
    console.log("⚡ Supabase client initialized successfully with:", supabaseUrl);
  } catch (err) {
    console.error("Gagal menginisialisasi Supabase client:", err);
  }
} else {
  console.warn(
    "⚠️ SUPABASE_URL atau SUPABASE_ANON_KEY belum dikonfigurasi di file .env. Server Express berjalan dalam mode Fallback Store."
  );
}

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!client && isSupabaseConfigured()) {
    client = createClient(supabaseUrl, supabaseKey);
  }
  return client;
};

export const supabase = client;
