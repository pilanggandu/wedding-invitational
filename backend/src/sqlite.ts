import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { hashPassword } from "./auth";

// Pastikan direktori backend/data ada
const dbDir = process.env.DB_DIR
  ? path.resolve(process.env.DB_DIR)
  : path.resolve(import.meta.dirname, "..", "data");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "wedding.db");
export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance
db.exec("PRAGMA journal_mode = WAL;");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS weddings (
    id TEXT PRIMARY KEY,
    active_template_id TEXT,
    theme_palette TEXT,
    couple TEXT,
    general TEXT,
    countdown_target TEXT,
    events TEXT,
    stories TEXT,
    gallery TEXT,
    gifts TEXT,
    dresscode TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS guests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    phone TEXT,
    category TEXT,
    is_sent INTEGER DEFAULT 0,
    notes TEXT,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS wishes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    relationship TEXT,
    attendance TEXT,
    message TEXT NOT NULL,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    google_sub TEXT,
    created_at TEXT
  );
`);

const userColumns = db.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>;
if (!userColumns.some((column) => column.name === "google_sub")) {
  db.exec("ALTER TABLE users ADD COLUMN google_sub TEXT;");
}
db.exec(
  "CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_unique_idx ON users (google_sub);"
);

// ----------------------------------------------------
// SEED INITIAL DATA (Jika kosong)
// ----------------------------------------------------
function seedIfEmpty() {
  const weddingCountStmt = db.prepare("SELECT COUNT(*) as count FROM weddings");
  const weddingCount = (weddingCountStmt.get() as any)?.count || 0;

  if (weddingCount === 0) {
    const insertWedding = db.prepare(`
      INSERT INTO weddings (
        id, active_template_id, theme_palette, couple, general, countdown_target,
        events, stories, gallery, gifts, dresscode, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertWedding.run(
      "inv_gilang_salsa",
      "paper-art-maroon",
      JSON.stringify({
        primaryColor: "#7D1128",
        accentGold: "#E5B869",
        pastelPink: "#F5A8B8",
        paperCream: "#FFF9FA",
        particlesEnabled: true,
      }),
      JSON.stringify({
        groom: {
          name: "Gilang",
          fullName: "Gilang Pandu Permadi",
          tagline: "Sang Petualang & Pengagum Senja",
          bioFunny: "Anak rumahan yang suka ngoding sampai subuh dan koleksi kopi sachet.",
          parents: "Putra pertama dari Bpk. Permadi & Ibu",
          instagram: "gilangpermadi",
          photoPlaceholder: {
            title: "Si Ganteng",
            caption: "Groom Portrait",
            aspectRatio: "portrait",
            variant: "groom",
          },
        },
        bride: {
          name: "Salsadila",
          fullName: "Salsadila Nanda Octavia",
          tagline: "Penebar Senyum & Pecinta Kucing",
          bioFunny: "Hobi scrolling resep masakan tapi ujung-ujungnya pesan ojek online.",
          parents: "Putri kedua dari Bpk. Mokhamad Mokharom & Ibu",
          instagram: "salsadila.nanda",
          photoPlaceholder: {
            title: "Sang Bidadari",
            caption: "Bride Portrait",
            aspectRatio: "portrait",
            variant: "bride",
          },
        },
      }),
      JSON.stringify({
        hashtag: "#GilangSalsaHalal",
        title: "The Wedding of Gilang & Salsadila",
        welcomeGreeting: "Walimatul 'Ursy - Pernikahan Penuh Berkah",
        quote: {
          arabic:
            "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
          translation:
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
          surah: "QS. Ar-Rum: 21",
        },
      }),
      "2026-11-21T08:00:00+07:00",
      JSON.stringify([
        {
          id: "evt_akad",
          title: "Akad Nikah",
          subTitle: "Momen Sakral Ijab Kabul",
          badgeCute: "Ijab Kabul 💍",
          colorTheme: "red",
          dateStr: "2026-11-21",
          displayDate: "21 November 2026",
          displayDay: "Sabtu Pagi",
          time: "08:00 - 10:00 WIB",
          venueName: "Kediaman Mempelai Wanita",
          venueAddress:
            "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
          mapUrl: "https://maps.google.com/?q=-6.8943,111.9845",
          calendarEvent: {
            title: "Akad Nikah Gilang & Salsadila",
            description: "Akad Nikah sakral Gilang & Salsadila di Merakurak, Tuban",
            location:
              "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Merakurak, Tuban",
            startDate: "20261121T010000Z",
            endDate: "20261121T030000Z",
          },
        },
        {
          id: "evt_resepsi",
          title: "Resepsi Pernikahan",
          subTitle: "Temu Kangen & Pesta Syukuran",
          badgeCute: "Pesta Syukuran 🌸",
          colorTheme: "blue",
          dateStr: "2026-11-21",
          displayDate: "21 November 2026",
          displayDay: "Sabtu Siang",
          time: "11:00 - Selesai",
          venueName: "Gedung Serbaguna Mandirejo",
          venueAddress: "Jl. Raya Merakurak No. 18, Tuban, Jawa Timur",
          mapUrl: "https://maps.google.com/?q=-6.8943,111.9845",
          calendarEvent: {
            title: "Resepsi Pernikahan Gilang & Salsadila",
            description: "Resepsi Pernikahan Gilang & Salsadila di Tuban",
            location: "Jl. Raya Merakurak No. 18, Tuban, Jawa Timur",
            startDate: "20261121T040000Z",
            endDate: "20261121T080000Z",
          },
        },
      ]),
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify({
        accounts: [
          {
            bankName: "BCA",
            accountNumber: "1820492811",
            accountHolder: "Gilang Pandu Permadi",
            logoText: "BCA",
            cuteLabel: "Rekening Mempelai Pria",
            cardColor: "maroon",
          },
          {
            bankName: "Mandiri",
            accountNumber: "1420019283741",
            accountHolder: "Salsadila Nanda Octavia",
            logoText: "MANDIRI",
            cuteLabel: "Rekening Mempelai Wanita",
            cardColor: "gold",
          },
        ],
        physicalGiftAddress: {
          recipient: "Gilang & Salsadila",
          phone: "081234567890",
          address:
            "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
        },
      }),
      JSON.stringify({}),
      new Date().toISOString()
    );
  }

  const guestCountStmt = db.prepare("SELECT COUNT(*) as count FROM guests");
  const guestCount = (guestCountStmt.get() as any)?.count || 0;

  if (guestCount === 0) {
    const insertGuest = db.prepare(`
      INSERT INTO guests (id, name, slug, phone, category, is_sent, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertGuest.run(
      "g_1",
      "Bapak Budi Santoso & Keluarga",
      "Bapak+Budi+Santoso+%26+Keluarga",
      "6281234567890",
      "VIP",
      1,
      "Tamu kehormatan keluarga besar",
      new Date().toISOString()
    );

    insertGuest.run(
      "g_2",
      "Rizky Pratama & Partner",
      "Rizky+Pratama+%26+Partner",
      "6281987654321",
      "Sahabat",
      0,
      "Teman kuliah seperjuangan",
      new Date().toISOString()
    );
  }

  const wishCountStmt = db.prepare("SELECT COUNT(*) as count FROM wishes");
  const wishCount = (wishCountStmt.get() as any)?.count || 0;

  if (wishCount === 0) {
    const insertWish = db.prepare(`
      INSERT INTO wishes (id, name, relationship, attendance, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertWish.run(
      "w_1",
      "Rian & Fani",
      "Teman Kuliah Gilang",
      "Hadir",
      "Selamat menempuh hidup baru Gilang & Salsa! Semoga langgeng dan bahagia selalu!",
      new Date().toISOString()
    );

    insertWish.run(
      "w_2",
      "dr. Hendra & Keluarga",
      "Kerabat Salsa",
      "Hadir",
      "Barakallahu lakuma wa baraka alaika wa jama'a bainakuma fii khair.",
      new Date().toISOString()
    );
  }

  // 4. Seed Default Admin User jika tabel users masih kosong
  const userCountStmt = db.prepare("SELECT COUNT(*) as count FROM users");
  const userCount = (userCountStmt.get() as any)?.count || 0;

  if (userCount === 0) {
    const { hash, salt } = hashPassword("admin123");
    const insertUser = db.prepare(`
      INSERT INTO users (id, username, email, password_hash, salt, full_name, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      "usr_admin_default",
      "admin",
      "admin@wedding.local",
      hash,
      salt,
      "Administrator Mempelai",
      "admin",
      new Date().toISOString()
    );
  }
}

seedIfEmpty();

// ----------------------------------------------------
// DATABASE ACCESS HELPERS
// ----------------------------------------------------

export const sqliteService = {
  // WEDDING INVITATION
  getWedding(id = "inv_gilang_salsa") {
    const stmt = db.prepare("SELECT * FROM weddings WHERE id = ?");
    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      activeTemplateId: row.active_template_id,
      themePalette: row.theme_palette ? JSON.parse(row.theme_palette) : {},
      couple: row.couple ? JSON.parse(row.couple) : {},
      general: row.general ? JSON.parse(row.general) : {},
      countdownTarget: row.countdown_target,
      events: row.events ? JSON.parse(row.events) : [],
      stories: row.stories ? JSON.parse(row.stories) : [],
      gallery: row.gallery ? JSON.parse(row.gallery) : [],
      gifts: row.gifts ? JSON.parse(row.gifts) : {},
      dresscode: row.dresscode ? JSON.parse(row.dresscode) : {},
      updatedAt: row.updated_at,
    };
  },

  upsertWedding(payload: any) {
    const id = payload.id || "inv_gilang_salsa";
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO weddings (
        id, active_template_id, theme_palette, couple, general, countdown_target,
        events, stories, gallery, gifts, dresscode, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        active_template_id = excluded.active_template_id,
        theme_palette = excluded.theme_palette,
        couple = excluded.couple,
        general = excluded.general,
        countdown_target = excluded.countdown_target,
        events = excluded.events,
        stories = excluded.stories,
        gallery = excluded.gallery,
        gifts = excluded.gifts,
        dresscode = excluded.dresscode,
        updated_at = excluded.updated_at
    `);

    stmt.run(
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
      now
    );

    return this.getWedding(id);
  },

  // GUESTS
  getGuests() {
    const stmt = db.prepare("SELECT * FROM guests ORDER BY created_at DESC");
    const rows = stmt.all() as any[];

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      phone: r.phone || "",
      category: r.category,
      isSent: Boolean(r.is_sent),
      notes: r.notes || "",
      createdAt: r.created_at,
    }));
  },

  createGuest(guest: {
    id: string;
    name: string;
    slug: string;
    phone?: string;
    category?: string;
    notes?: string;
    createdAt?: string;
  }) {
    const stmt = db.prepare(`
      INSERT INTO guests (id, name, slug, phone, category, is_sent, notes, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    `);

    stmt.run(
      guest.id,
      guest.name,
      guest.slug,
      guest.phone || "",
      guest.category || "Sahabat",
      guest.notes || "",
      guest.createdAt || new Date().toISOString()
    );

    const getStmt = db.prepare("SELECT * FROM guests WHERE id = ?");
    const r = getStmt.get(guest.id) as any;
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      phone: r.phone || "",
      category: r.category,
      isSent: Boolean(r.is_sent),
      notes: r.notes || "",
      createdAt: r.created_at,
    };
  },

  updateGuest(id: string, updates: Partial<{ name: string; phone: string; category: string; notes: string; isSent: boolean }>) {
    const existingStmt = db.prepare("SELECT * FROM guests WHERE id = ?");
    const existing = existingStmt.get(id) as any;
    if (!existing) return null;

    const name = updates.name !== undefined ? updates.name : existing.name;
    const slug = updates.name !== undefined ? encodeURIComponent(updates.name).replace(/%20/g, "+") : existing.slug;
    const phone = updates.phone !== undefined ? updates.phone : existing.phone;
    const category = updates.category !== undefined ? updates.category : existing.category;
    const notes = updates.notes !== undefined ? updates.notes : existing.notes;
    const isSent = updates.isSent !== undefined ? (updates.isSent ? 1 : 0) : existing.is_sent;

    const updateStmt = db.prepare(`
      UPDATE guests SET
        name = ?,
        slug = ?,
        phone = ?,
        category = ?,
        notes = ?,
        is_sent = ?
      WHERE id = ?
    `);

    updateStmt.run(name, slug, phone, category, notes, isSent, id);

    return {
      id,
      name,
      slug,
      phone,
      category,
      isSent: Boolean(isSent),
      notes,
      createdAt: existing.created_at,
    };
  },

  deleteGuest(id: string) {
    const stmt = db.prepare("DELETE FROM guests WHERE id = ?");
    stmt.run(id);
    return true;
  },

  // WISHES (RSVP & DO'A)
  getWishes() {
    const stmt = db.prepare("SELECT * FROM wishes ORDER BY created_at DESC");
    const rows = stmt.all() as any[];

    return rows.map((r) => ({
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

  createWish(wish: {
    id: string;
    name: string;
    relationship?: string;
    attendance?: string;
    message: string;
    createdAt?: string;
  }) {
    const stmt = db.prepare(`
      INSERT INTO wishes (id, name, relationship, attendance, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      wish.id,
      wish.name,
      wish.relationship || "Tamu Undangan",
      wish.attendance || "Hadir",
      wish.message,
      wish.createdAt || new Date().toISOString()
    );

    const getStmt = db.prepare("SELECT * FROM wishes WHERE id = ?");
    const r = getStmt.get(wish.id) as any;
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

  deleteWish(id: string) {
    const stmt = db.prepare("DELETE FROM wishes WHERE id = ?");
    stmt.run(id);
    return true;
  },

  // USERS & AUTH
  getUserByUsername(username: string) {
    const stmt = db.prepare("SELECT * FROM users WHERE LOWER(username) = LOWER(?)");
    return stmt.get(username) as any;
  },

  getUserByEmail(email: string) {
    const stmt = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)");
    return stmt.get(email) as any;
  },

    getUserByGoogleSub(googleSub: string) {
      const stmt = db.prepare("SELECT * FROM users WHERE google_sub = ?");
      return stmt.get(googleSub) as any;
    },

  getUserById(id: string) {
    const stmt = db.prepare(
      "SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?"
    );
    const r = stmt.get(id) as any;
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

  createUser(user: {
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
    const stmt = db.prepare(`
        INSERT INTO users (
          id, username, email, password_hash, salt, full_name, role, google_sub, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      user.id,
      user.username,
      user.email || null,
      user.passwordHash,
      user.salt,
      user.fullName,
      user.role || "admin",
        user.googleSub || null,
      user.createdAt || new Date().toISOString()
    );
    return {
      id: user.id,
      username: user.username,
      email: user.email || null,
      fullName: user.fullName,
      role: user.role || "admin",
        googleSub: user.googleSub || null,
      createdAt: user.createdAt || new Date().toISOString(),
    };
  },

    linkGoogleSub(userId: string, googleSub: string) {
      const result = db
        .prepare(
          "UPDATE users SET google_sub = ? WHERE id = ? AND (google_sub IS NULL OR google_sub = ?)"
        )
        .run(googleSub, userId, googleSub);
      return result.changes > 0;
    },
};
