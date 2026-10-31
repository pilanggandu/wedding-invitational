import { Pool, PoolConfig } from "pg";
import path from "node:path";
import dotenv from "dotenv";
import { hashPassword } from "./auth";
import { run12TablesMigration } from "./database/migration_service";
import { NormalizedWeddingService } from "./services/normalizedWeddingService";

if (typeof path !== "undefined" && typeof path.resolve === "function") {
  const envDir = typeof __dirname !== "undefined" ? __dirname : typeof process !== "undefined" ? process.cwd() : ".";
  dotenv.config();
  dotenv.config({ path: path.resolve(envDir, "../.env") });
  dotenv.config({ path: path.resolve(envDir, "../../.env") });
} else {
  dotenv.config();
}

let pool: Pool | null = null;
let isConnected = false;
let normalizedWeddingService: NormalizedWeddingService | null = null;

export function getNormalizedWeddingService(): NormalizedWeddingService | null {
  return normalizedWeddingService;
}

export function isPostgresConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.PGHOST ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PASSWORD ||
      process.env.PGPASSWORD
  );
}

export function isPostgresConnected(): boolean {
  return isConnected && pool !== null;
}

export function getPostgresPool(): Pool | null {
  return pool;
}

/**
 * Inisialisasi pool PostgreSQL dan otomatis siapkan database & tabel jika belum ada
 */
export async function initPostgres(): Promise<boolean> {
  if (!isPostgresConfigured()) {
    return false;
  }

  const databaseName = process.env.PGDATABASE || "wedding_db";
  const user = process.env.PGUSER || "postgres";
  const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || "";
  const host = process.env.PGHOST || "localhost";
  const port = Number(process.env.PGPORT) || 5432;

  let poolConfig: PoolConfig;

  if (process.env.DATABASE_URL) {
    poolConfig = {
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
    };
  } else {
    poolConfig = {
      host,
      port,
      user,
      password,
      database: databaseName,
      max: 10,
      idleTimeoutMillis: 30000,
    };
  }

  // 1. Coba koneksi ke database target
  let testPool = new Pool(poolConfig);
  testPool.on("error", (err) => console.warn("PostgreSQL pool background error:", err.message));

  try {
    const client = await testPool.connect();
    client.release();
    pool = testPool;
    isConnected = true;
  } catch (err: any) {
    testPool.end().catch(() => {});
    // Jika database belum ada (error code 3D000), coba buat database otomatis
    if (err.code === "3D000") {
      console.log(
        `Database '${databaseName}' belum ada. Menghubungkan ke database default 'postgres' untuk membuat '${databaseName}'...`
      );

      let adminConfig: PoolConfig;
      if (process.env.DATABASE_URL) {
        adminConfig = {
          connectionString: process.env.DATABASE_URL.replace(
            /\/[^/?]+(\?.*)?$/,
            "/postgres$1"
          ),
        };
      } else {
        adminConfig = {
          host,
          port,
          user,
          password,
          database: "postgres",
        };
      }

      const adminPool = new Pool(adminConfig);

      try {
        const adminClient = await adminPool.connect();
        await adminClient.query(`CREATE DATABASE "${databaseName}"`);
        adminClient.release();
        await adminPool.end();
        console.log(`✅ Database '${databaseName}' berhasil dibuat di PostgreSQL lokal!`);

        // Hubungkan kembali ke database yang baru dibuat
        pool = new Pool(poolConfig);
        pool.on("error", (err) => console.warn("PostgreSQL pool background error:", err.message));
        const retryClient = await pool.connect();
        retryClient.release();
        isConnected = true;
      } catch (createErr: any) {
        console.error("Gagal membuat database PostgreSQL:", createErr.message);
        isConnected = false;
        return false;
      }
    } else {
      console.warn("Koneksi PostgreSQL gagal:", err.message);
      isConnected = false;
      return false;
    }
  }

  // 2. Setup skema tabel jika belum ada
  if (pool && isConnected) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS weddings (
          id VARCHAR(100) PRIMARY KEY,
          active_template_id VARCHAR(100),
          theme_palette JSONB,
          couple JSONB,
          general JSONB,
          countdown_target VARCHAR(100),
          events JSONB,
          stories JSONB,
          gallery JSONB,
          gifts JSONB,
          dresscode JSONB,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS guests (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          category VARCHAR(100),
          is_sent BOOLEAN DEFAULT FALSE,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS wishes (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          relationship VARCHAR(100),
          attendance VARCHAR(100),
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE,
          password_hash TEXT NOT NULL,
          salt TEXT NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          google_sub VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // Keep older databases compatible with Google account linking.
      await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub VARCHAR(255)");
      await pool.query(
        "CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_unique_idx ON users (google_sub)"
      );

      // 3. Seed data awal jika tabel weddings masih kosong
      const weddingCount = await pool.query("SELECT COUNT(*) FROM weddings");
      if (parseInt(weddingCount.rows[0].count) === 0) {
        await pool.query(
          `INSERT INTO weddings (
            id, active_template_id, theme_palette, couple, general, countdown_target,
            events, stories, gallery, gifts, dresscode, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
          [
            "inv_gilang_salsa",
            "paper-art-maroon",
            JSON.stringify({
              primaryColor: "#7D1128",
              secondaryColor: "#E5B869",
              accentColor: "#F5A8B8",
              fontStyle: "caveat",
              particlesEnabled: true,
              musicAutoplay: true,
            }),
            JSON.stringify({
              groom: {
                name: "Gilang",
                fullName: "Gilang Pandu Permadi",
                tagline: "Calon Suami Idaman & Penyabar",
                bioFunny: "Suka kopi, hobi ngobrol, dan siap jadi pendamping setia selamanya.",
                parents: "Bpk. Permadi & Ibu",
                instagram: "gilang",
              },
              bride: {
                name: "Salsadila",
                fullName: "Salsadila Nanda Octavia",
                tagline: "Tuan Putri Cantik & Berhati Lembut",
                bioFunny: "Pencinta keceriaan, senyum manis, dan siap membangun surga rumah tangga bersama.",
                parents: "Bpk. Mokhamad Mokharom & Ibu",
                instagram: "salsadila",
              },
            }),
            JSON.stringify({
              hashtag: "#GilangSalsaHalal",
              funTagline: "Menemukan cinta itu mudah, tapi menemukan yang sefrekuensi itu anugerah!",
              musicTitle: "A Thousand Years",
              musicArtist: "Christina Perri",
              closingMessage:
                "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.",
            }),
            "2026-11-21T08:00:00+07:00",
            JSON.stringify([
              {
                id: "event_akad",
                title: "Akad Nikah",
                subTitle: "Momen Sakral Ijab Kabul",
                badgeCute: "Momen Paling Sakral 💍",
                colorTheme: "red",
                dateStr: "2026-11-21",
                displayDate: "21 November 2026",
                displayDay: "Sabtu",
                time: "08:00 - 10:00 WIB",
                venueName: "Kediaman Mempelai Wanita",
                venueAddress: "Merakurak, Tuban, Jawa Timur",
                mapUrl: "https://maps.google.com",
              },
              {
                id: "event_resepsi",
                title: "Resepsi Pernikahan",
                subTitle: "Pesta Syukuran Bersama",
                badgeCute: "Pesta Kebahagiaan 🌸",
                colorTheme: "blue",
                dateStr: "2026-11-21",
                displayDate: "21 November 2026",
                displayDay: "Sabtu",
                time: "11:00 - Selesai",
                venueName: "Gedung Serbaguna Merakurak",
                venueAddress: "Jl. Raya Merakurak, Tuban, Jawa Timur",
                mapUrl: "https://maps.google.com",
              },
            ]),
            JSON.stringify([]),
            JSON.stringify([]),
            JSON.stringify({
              accounts: [
                {
                  bankName: "BCA",
                  accountNumber: "1234567890",
                  accountHolder: "Gilang Pandu Permadi",
                  logoText: "BCA",
                  cuteLabel: "Rekening Mempelai Pria",
                  cardColor: "maroon",
                },
                {
                  bankName: "Bank Mandiri",
                  accountNumber: "0987654321",
                  accountHolder: "Salsadila Nanda Octavia",
                  logoText: "MANDIRI",
                  cuteLabel: "Rekening Mempelai Wanita",
                  cardColor: "gold",
                },
              ],
            }),
            JSON.stringify({}),
          ]
        );
      }

      // 4. Seed tamu awal jika kosong
      const guestCount = await pool.query("SELECT COUNT(*) FROM guests");
      if (parseInt(guestCount.rows[0].count) === 0) {
        await pool.query(`
          INSERT INTO guests (id, name, slug, phone, category, is_sent, notes, created_at)
          VALUES 
            ('g_1', 'Bapak Budi Santoso & Keluarga', 'Bapak+Budi+Santoso+%26+Keluarga', '6281234567890', 'VIP', TRUE, 'Tamu kehormatan keluarga besar', NOW()),
            ('g_2', 'Rizky Pratama & Partner', 'Rizky+Pratama+%26+Partner', '6281987654321', 'Sahabat', FALSE, 'Teman seperjuangan kuliah', NOW())
        `);
      }

      // 5. Seed ucapan awal jika kosong
      const wishCount = await pool.query("SELECT COUNT(*) FROM wishes");
      if (parseInt(wishCount.rows[0].count) === 0) {
        await pool.query(`
          INSERT INTO wishes (id, name, relationship, attendance, message, created_at)
          VALUES 
            ('w_1', 'Rian & Fani', 'Teman Kuliah Gilang', 'Hadir', 'Selamat menempuh hidup baru Gilang & Salsa! Semoga langgeng dan bahagia selalu!', NOW()),
            ('w_2', 'dr. Hendra & Keluarga', 'Kerabat Salsa', 'Hadir', 'Barakallahu lakuma wa baraka alaika wa jama''a bainakuma fii khair.', NOW())
        `);
      }

      // 6. Seed default admin user jika kosong
      const userCount = await pool.query("SELECT COUNT(*) FROM users");
      if (parseInt(userCount.rows[0].count) === 0) {
        const { hash, salt } = hashPassword("admin123");
        await pool.query(
          `INSERT INTO users (id, username, email, password_hash, salt, full_name, role, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [
            "usr_admin_default",
            "admin",
            "admin@wedding.local",
            hash,
            salt,
            "Administrator Mempelai",
            "admin",
          ]
        );
      }

      // Jalankan migrasi 12 tabel ternormalisasi
      try {
        await run12TablesMigration(pool);
        normalizedWeddingService = new NormalizedWeddingService(pool);
        console.log("✅ Skema 12 tabel ternormalisasi & Data Adapter aktif!");
      } catch (migErr: any) {
        console.warn("Peringatan migrasi 12 tabel:", migErr.message);
      }

      console.log(`✅ PostgreSQL terhubung dan skema tabel siap di database: ${databaseName}`);
      return true;
    } catch (schemaErr: any) {
      console.error("Gagal menyiapkan skema tabel PostgreSQL:", schemaErr.message);
      return false;
    }
  }

  return false;
}

// ----------------------------------------------------
// DATABASE SERVICE POSTGRESQL
// ----------------------------------------------------

export const postgresService = {
  // WEDDING INVITATION
  async getWedding(id = "inv_gilang_salsa") {
    if (normalizedWeddingService) {
      try {
        const normalizedData = await normalizedWeddingService.getAggregatedWeddingData();
        if (!pool) return normalizedData;

        // Music fields are persisted in the wide row while normalized settings lack them.
        const saved = await pool.query("SELECT general FROM weddings WHERE id = $1", [id]);
        const rawGeneral = saved.rows[0]?.general;
        const general = typeof rawGeneral === "string" ? JSON.parse(rawGeneral) : rawGeneral;
        const musicSettings: Record<string, any> = {};

        if (general && typeof general === "object" && !Array.isArray(general)) {
          for (const key of [
            "musicUrl",
            "musicTitle",
            "musicArtist",
            "hashtag",
            "funTagline",
            "closingMessage",
            "coverPhotoUrl",
            "heroPhotoUrl",
            "preweddingPhotos",
          ] as const) {
            if (general[key] !== undefined) {
              musicSettings[key] = general[key];
            }
          }
          if (
            typeof general.musicVolume === "number" &&
            Number.isFinite(general.musicVolume) &&
            general.musicVolume >= 0 &&
            general.musicVolume <= 100
          ) {
            musicSettings.musicVolume = general.musicVolume;
          }
        }

        return {
          ...normalizedData,
          general: { ...normalizedData.general, ...musicSettings },
        };
      } catch (e: any) {
        console.warn("Fallback to wide weddings table:", e.message);
      }
    }
    if (!pool) return null;
    const res = await pool.query("SELECT * FROM weddings WHERE id = $1", [id]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];

    return {
      id: row.id,
      activeTemplateId: row.active_template_id,
      themePalette: typeof row.theme_palette === "string" ? JSON.parse(row.theme_palette) : row.theme_palette || {},
      couple: typeof row.couple === "string" ? JSON.parse(row.couple) : row.couple || {},
      general: typeof row.general === "string" ? JSON.parse(row.general) : row.general || {},
      countdownTarget: row.countdown_target,
      events: typeof row.events === "string" ? JSON.parse(row.events) : row.events || [],
      stories: typeof row.stories === "string" ? JSON.parse(row.stories) : row.stories || [],
      gallery: (() => {
        const raw = typeof row.gallery === "string" ? JSON.parse(row.gallery) : row.gallery || [];
        if (Array.isArray(raw) && raw.length > 0) return raw;
        return [
          { id: 1, caption: "Ilustrasi Pasangan", tag: "Ilustrasi", doodleSticker: "Cute Couple", stickerBg: "bg-[#FDE047]", aspectRatio: "portrait" },
          { id: 2, caption: "Lanskap Bahagia", tag: "Gambar", doodleSticker: "Sunny Day", stickerBg: "bg-[#F472B6]", aspectRatio: "landscape" },
          { id: 3, caption: "Momen Ceria", tag: "Gambar", doodleSticker: "Senyum Manis", stickerBg: "bg-[#60A5FA]", aspectRatio: "square" },
          { id: 4, caption: "Sepasang Cincin", tag: "Gambar", doodleSticker: "Shining Star", stickerBg: "bg-[#FDE047]", aspectRatio: "landscape" },
          { id: 5, caption: "Bunga Kebahagiaan", tag: "Gambar", doodleSticker: "Bunga Mawar", stickerBg: "bg-[#4ADE80]", aspectRatio: "portrait" },
          { id: 6, caption: "Bersama Selamanya", tag: "Gambar", doodleSticker: "Together", stickerBg: "bg-[#C084FC]", aspectRatio: "square" },
        ];
      })(),
      gifts: (() => {
        const raw = typeof row.gifts === "string" ? JSON.parse(row.gifts) : row.gifts || {};
        return {
          accounts: Array.isArray(raw?.accounts) && raw.accounts.length > 0
            ? raw.accounts
            : [
                { bankName: "BCA", accountNumber: "1234567890", accountHolder: "Gilang Pandu Permadi", logoText: "BCA", cuteLabel: "Rekening Mempelai Pria", cardColor: "maroon" },
                { bankName: "Bank Mandiri", accountNumber: "0987654321", accountHolder: "Salsadila Nanda Octavia", logoText: "MANDIRI", cuteLabel: "Rekening Mempelai Wanita", cardColor: "gold" },
              ],
          physicalGiftAddress: raw?.physicalGiftAddress || {
            recipientName: "Gilang & Salsadila",
            phone: "6281234567890",
            address: "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
          },
        };
      })(),
      dresscode: (() => {
        const raw = typeof row.dresscode === "string" ? JSON.parse(row.dresscode) : row.dresscode || {};
        if (raw?.colors && Array.isArray(raw.colors) && raw.colors.length > 0) return raw;
        return {
          description: "Kenakan pakaian terbaikmu yang rapi dan nyaman. Rekomendasi palet warna tema hangat:",
          colors: [
            { name: "Royal Maroon", hex: "#7D1128" },
            { name: "Champagne Gold", hex: "#E5B869" },
            { name: "Dusty Rose", hex: "#F5A8B8" },
            { name: "Warm Sage", hex: "#8FA89B" },
            { name: "Ivory Cream", hex: "#FFF0F3" },
          ],
        };
      })(),
      updatedAt: row.updated_at,
    };
  },

  async upsertWedding(payload: any) {
    if (!pool) return null;
    const id = payload.id || "inv_gilang_salsa";

    if (normalizedWeddingService) {
      try {
        await normalizedWeddingService.updateWeddingData(payload);
      } catch (e: any) {
        console.warn("Notice updating normalized tables:", e.message);
      }
    }

    const query = `
      INSERT INTO weddings (
        id, active_template_id, theme_palette, couple, general, countdown_target,
        events, stories, gallery, gifts, dresscode, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (id) DO UPDATE SET
        active_template_id = EXCLUDED.active_template_id,
        theme_palette = EXCLUDED.theme_palette,
        couple = EXCLUDED.couple,
        general = EXCLUDED.general,
        countdown_target = EXCLUDED.countdown_target,
        events = EXCLUDED.events,
        stories = EXCLUDED.stories,
        gallery = EXCLUDED.gallery,
        gifts = EXCLUDED.gifts,
        dresscode = EXCLUDED.dresscode,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      id,
      payload.activeTemplateId || "paper-art-maroon",
      JSON.stringify(payload.themePalette || {}),
      JSON.stringify(payload.couple || {}),
      JSON.stringify(payload.general || {}),
      payload.countdownTarget || "2026-11-21T08:00:00+07:00",
      JSON.stringify(payload.events || []),
      JSON.stringify(payload.stories || []),
      JSON.stringify(payload.gallery || []),
      JSON.stringify(payload.gifts || {}),
      JSON.stringify(payload.dresscode || {}),
    ];

    const res = await pool.query(query, values);
    return res.rows[0];
  },

  // GUESTS
  async getGuests() {
    if (normalizedWeddingService) {
      return await normalizedWeddingService.getGuests();
    }
    if (!pool) return [];
    const res = await pool.query("SELECT * FROM guests ORDER BY created_at DESC");
    return res.rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      phone: r.phone || "",
      category: r.category || "Sahabat",
      isSent: Boolean(r.is_sent),
      quota: 1,
      notes: r.notes || "",
      createdAt: r.created_at,
    }));
  },

  async createGuest(guest: {
    id: string;
    name: string;
    slug: string;
    phone?: string;
    category?: string;
    notes?: string;
    quota?: number;
    createdAt?: string;
  }) {
    if (normalizedWeddingService) {
      return await normalizedWeddingService.createGuest({
        name: guest.name,
        phone: guest.phone,
        quota: guest.quota || 1,
        category: guest.category,
        notes: guest.notes,
      });
    }
    if (!pool) return null;
    const query = `
      INSERT INTO guests (id, name, slug, phone, category, is_sent, notes, created_at)
      VALUES ($1, $2, $3, $4, $5, FALSE, $6, $7)
      RETURNING *;
    `;
    const values = [
      guest.id,
      guest.name,
      guest.slug,
      guest.phone || "",
      guest.category || "Sahabat",
      guest.notes || "",
      guest.createdAt || new Date().toISOString(),
    ];
    const res = await pool.query(query, values);
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      phone: r.phone || "",
      category: r.category,
      isSent: Boolean(r.is_sent),
      quota: 1,
      notes: r.notes || "",
      createdAt: r.created_at,
    };
  },

  async updateGuest(id: string, updates: Partial<{ name: string; phone: string; category: string; notes: string; isSent: boolean; quota?: number }>) {
    if (normalizedWeddingService) {
      return await normalizedWeddingService.updateGuest(id, updates);
    }
    if (!pool) return null;
    const currentRes = await pool.query("SELECT * FROM guests WHERE id = $1", [id]);
    if (currentRes.rows.length === 0) return null;
    const cur = currentRes.rows[0];

    const name = updates.name !== undefined ? updates.name : cur.name;
    const slug = updates.name !== undefined ? encodeURIComponent(updates.name).replace(/%20/g, "+") : cur.slug;
    const phone = updates.phone !== undefined ? updates.phone : cur.phone;
    const category = updates.category !== undefined ? updates.category : cur.category;
    const notes = updates.notes !== undefined ? updates.notes : cur.notes;
    const isSent = updates.isSent !== undefined ? updates.isSent : cur.is_sent;

    const query = `
      UPDATE guests SET
        name = $1,
        slug = $2,
        phone = $3,
        category = $4,
        notes = $5,
        is_sent = $6
      WHERE id = $7
      RETURNING *;
    `;
    const res = await pool.query(query, [name, slug, phone, category, notes, isSent, id]);
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      phone: r.phone || "",
      category: r.category,
      isSent: Boolean(r.is_sent),
      quota: 1,
      notes: r.notes || "",
      createdAt: r.created_at,
    };
  },

  async deleteGuest(id: string) {
    if (normalizedWeddingService) {
      return await normalizedWeddingService.softDeleteGuest(id);
    }
    if (!pool) return false;
    await pool.query("DELETE FROM guests WHERE id = $1", [id]);
    return true;
  },

  // WISHES
  async getWishes() {
    if (!pool) return [];
    const res = await pool.query("SELECT * FROM wishes ORDER BY created_at DESC");
    return res.rows.map((r) => ({
      id: r.id,
      name: r.name,
      relationship: r.relationship,
      attendance: r.attendance,
      message: r.message,
      date: new Date(r.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      createdAt: r.created_at,
    }));
  },

  async createWish(wish: {
    id: string;
    name: string;
    relationship?: string;
    attendance?: string;
    message: string;
    createdAt?: string;
  }) {
    if (!pool) return null;
    const query = `
      INSERT INTO wishes (id, name, relationship, attendance, message, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      wish.id,
      wish.name,
      wish.relationship || "Tamu Undangan",
      wish.attendance || "Hadir",
      wish.message,
      wish.createdAt || new Date().toISOString(),
    ];
    const res = await pool.query(query, values);
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      relationship: r.relationship,
      attendance: r.attendance,
      message: r.message,
      date: new Date(r.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      createdAt: r.created_at,
    };
  },

  async deleteWish(id: string) {
    if (!pool) return false;
    await pool.query("DELETE FROM wishes WHERE id = $1", [id]);
    return true;
  },

  // USERS & AUTH
  async getUserByUsername(username: string) {
    if (!pool) return null;
    const res = await pool.query(
      "SELECT * FROM users WHERE LOWER(username) = LOWER($1)",
      [username]
    );
    return res.rows[0] || null;
  },

  async getUserByEmail(email: string) {
    if (!pool) return null;
    const res = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );
    return res.rows[0] || null;
  },

    async getUserByGoogleSub(googleSub: string) {
      if (!pool) return null;
      const res = await pool.query("SELECT * FROM users WHERE google_sub = $1", [googleSub]);
      return res.rows[0] || null;
    },

  async getUserById(id: string) {
    if (!pool) return null;
    const res = await pool.query(
      "SELECT id, username, email, full_name, role, created_at FROM users WHERE id = $1",
      [id]
    );
    const r = res.rows[0];
    if (!r) return null;
    return {
      id: r.id,
      username: r.username,
      email: r.email,
      fullName: r.full_name,
      role: r.role,
      createdAt: r.created_at,
    };
  },

  async createUser(user: {
    id: string;
    username: string;
    email?: string;
      googleSub?: string;
    passwordHash: string;
    salt: string;
    fullName: string;
    role?: string;
    createdAt?: string;
  }) {
    if (!pool) return null;
    const query = `
        INSERT INTO users (
          id, username, email, password_hash, salt, full_name, role, google_sub, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      user.id,
      user.username,
      user.email || null,
      user.passwordHash,
      user.salt,
      user.fullName,
      user.role || "admin",
        user.googleSub || null,
      user.createdAt || new Date().toISOString(),
    ];
    const res = await pool.query(query, values);
    const r = res.rows[0];
    return {
      id: r.id,
      username: r.username,
      email: r.email,
      fullName: r.full_name,
      role: r.role,
        googleSub: r.google_sub,
      createdAt: r.created_at,
    };
  },

    async linkGoogleSub(userId: string, googleSub: string) {
      if (!pool) return false;
      const res = await pool.query(
        "UPDATE users SET google_sub = $2 WHERE id = $1 AND (google_sub IS NULL OR google_sub = $2)",
        [userId, googleSub]
      );
      return (res.rowCount || 0) > 0;
    },
};
