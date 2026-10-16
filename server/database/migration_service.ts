import { Pool } from "pg";
import crypto from "crypto";

export function generateSecureToken(length = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let token = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

export async function run12TablesMigration(pool: Pool): Promise<void> {
  console.log("Menjalankan migrasi skema 12 tabel ternormalisasi di PostgreSQL...");

  // 1. Jalankan DDL pembuatan 12 tabel
  await pool.query(`
    -- 1. USERS
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(190) NOT NULL,
      email_verified_at TIMESTAMP WITH TIME ZONE NULL,
      password VARCHAR(255) NOT NULL,
      remember_token VARCHAR(100) NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT uq_users_email UNIQUE (email)
    );

    -- 2. WEDDING_SETTINGS
    CREATE TABLE IF NOT EXISTS wedding_settings (
      id BIGSERIAL PRIMARY KEY,
      wedding_title VARCHAR(255) NULL,
      cover_subtitle VARCHAR(255) NULL,
      cover_image VARCHAR(500) NULL,
      hero_image VARCHAR(500) NULL,
      opening_text TEXT NULL,
      closing_text TEXT NULL,
      quote TEXT NULL,
      quote_source VARCHAR(255) NULL,
      background_music VARCHAR(500) NULL,
      background_music_volume SMALLINT DEFAULT 40,
      og_title VARCHAR(255) NULL,
      og_description TEXT NULL,
      og_image VARCHAR(500) NULL,
      allow_indexing BOOLEAN DEFAULT FALSE,
      allow_share BOOLEAN DEFAULT FALSE,
      timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
      active_template_id VARCHAR(100) DEFAULT 'paper-art-maroon',
      theme_palette JSONB NULL,
      dresscode JSONB NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 3. COUPLES
    CREATE TABLE IF NOT EXISTS couples (
      id BIGSERIAL PRIMARY KEY,
      type SMALLINT NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      nickname VARCHAR(100) NULL,
      father_name VARCHAR(255) NULL,
      mother_name VARCHAR(255) NULL,
      instagram_url VARCHAR(500) NULL,
      photo VARCHAR(500) NULL,
      tagline VARCHAR(255) NULL,
      bio_funny TEXT NULL,
      sort_order SMALLINT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT uq_couples_type UNIQUE (type)
    );

    -- 4. WEDDING_EVENTS
    CREATE TABLE IF NOT EXISTS wedding_events (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      event_date DATE NOT NULL,
      start_time TIME NULL,
      end_time TIME NULL,
      venue VARCHAR(255) NULL,
      address TEXT NULL,
      latitude DECIMAL(10, 7) NULL,
      longitude DECIMAL(10, 7) NULL,
      maps_url VARCHAR(1000) NULL,
      dress_code VARCHAR(255) NULL,
      description TEXT NULL,
      is_main BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      sort_order SMALLINT DEFAULT 0,
      display_day VARCHAR(50) NULL,
      display_date VARCHAR(100) NULL,
      badge_cute VARCHAR(100) NULL,
      color_theme VARCHAR(50) DEFAULT 'red',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 5. WEDDING_STORIES
    CREATE TABLE IF NOT EXISTS wedding_stories (
      id BIGSERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      story_date DATE NULL,
      date_label VARCHAR(100) NULL,
      description TEXT NULL,
      image VARCHAR(500) NULL,
      cute_reaction VARCHAR(100) NULL,
      badge_color VARCHAR(50) NULL,
      sort_order SMALLINT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 6. WEDDING_GALLERIES
    CREATE TABLE IF NOT EXISTS wedding_galleries (
      id BIGSERIAL PRIMARY KEY,
      image_path VARCHAR(500) NOT NULL,
      medium_path VARCHAR(500) NULL,
      thumbnail_path VARCHAR(500) NULL,
      caption VARCHAR(500) NULL,
      alt_text VARCHAR(255) NULL,
      tag VARCHAR(100) NULL,
      aspect_ratio VARCHAR(50) DEFAULT 'square',
      doodle_sticker VARCHAR(100) NULL,
      sticker_bg VARCHAR(100) NULL,
      sort_order SMALLINT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 7. GUEST_GROUPS
    CREATE TABLE IF NOT EXISTS guest_groups (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT uq_guest_groups_name UNIQUE (name)
    );

    -- 8. GUESTS
    CREATE TABLE IF NOT EXISTS guests (
      id BIGSERIAL PRIMARY KEY,
      guest_group_id BIGINT NULL REFERENCES guest_groups(id) ON DELETE SET NULL,
      name VARCHAR(150) NOT NULL,
      phone VARCHAR(30) NULL,
      token VARCHAR(32) NOT NULL,
      quota SMALLINT DEFAULT 1,
      invitation_status SMALLINT DEFAULT 0,
      sent_at TIMESTAMP WITH TIME ZONE NULL,
      opened_at TIMESTAMP WITH TIME ZONE NULL,
      last_opened_at TIMESTAMP WITH TIME ZONE NULL,
      open_count INT DEFAULT 0,
      notes TEXT NULL,
      deleted_at TIMESTAMP WITH TIME ZONE NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT uq_guests_token UNIQUE (token)
    );

    -- 9. RSVPS
    CREATE TABLE IF NOT EXISTS rsvps (
      id BIGSERIAL PRIMARY KEY,
      guest_id VARCHAR(100) NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
      status SMALLINT NOT NULL,
      attendee_count SMALLINT DEFAULT 0,
      message VARCHAR(500) NULL,
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT uq_rsvps_guest UNIQUE (guest_id)
    );

    -- 10. WISHES
    CREATE TABLE IF NOT EXISTS wishes (
      id VARCHAR(100) PRIMARY KEY,
      guest_id VARCHAR(100) NULL REFERENCES guests(id) ON DELETE SET NULL,
      display_name VARCHAR(150) NOT NULL,
      message VARCHAR(500) NOT NULL,
      relationship VARCHAR(100) NULL,
      status SMALLINT DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 11. WEDDING_GIFTS
    CREATE TABLE IF NOT EXISTS wedding_gifts (
      id BIGSERIAL PRIMARY KEY,
      type SMALLINT NOT NULL,
      provider VARCHAR(100) NULL,
      account_number VARCHAR(100) NULL,
      account_holder VARCHAR(255) NULL,
      qr_image VARCHAR(500) NULL,
      address TEXT NULL,
      phone VARCHAR(50) NULL,
      card_color VARCHAR(50) DEFAULT 'maroon',
      sort_order SMALLINT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 12. SECTION_SETTINGS
    CREATE TABLE IF NOT EXISTS section_settings (
      id BIGSERIAL PRIMARY KEY,
      section_code VARCHAR(50) NOT NULL,
      is_enabled BOOLEAN DEFAULT TRUE,
      sort_order SMALLINT DEFAULT 0,
      settings JSONB NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT uq_section_code UNIQUE (section_code)
    );
  `);

  // Pastikan kolom baru di tabel guests & wishes ada sebelum pembuatan index
  await pool.query(`
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS guest_group_id BIGINT NULL REFERENCES guest_groups(id) ON DELETE SET NULL;
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS token VARCHAR(32);
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS quota SMALLINT DEFAULT 1;
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS invitation_status SMALLINT DEFAULT 0;
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE NULL;
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP WITH TIME ZONE NULL;
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS last_opened_at TIMESTAMP WITH TIME ZONE NULL;
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS open_count INT DEFAULT 0;
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE NULL;
    ALTER TABLE guests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

    ALTER TABLE wishes ADD COLUMN IF NOT EXISTS guest_id VARCHAR(100) NULL REFERENCES guests(id) ON DELETE SET NULL;
    ALTER TABLE wishes ADD COLUMN IF NOT EXISTS display_name VARCHAR(150);
    ALTER TABLE wishes ADD COLUMN IF NOT EXISTS status SMALLINT DEFAULT 1;
    ALTER TABLE wishes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  `);

  // Index creation
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_events_date ON wedding_events(event_date);
    CREATE INDEX IF NOT EXISTS idx_events_main ON wedding_events(is_main);
    CREATE INDEX IF NOT EXISTS idx_events_active_sort ON wedding_events(is_active, sort_order);

    CREATE INDEX IF NOT EXISTS idx_stories_active_sort ON wedding_stories(is_active, sort_order);
    CREATE INDEX IF NOT EXISTS idx_galleries_active_sort ON wedding_galleries(is_active, sort_order);

    CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
    CREATE INDEX IF NOT EXISTS idx_guests_group ON guests(guest_group_id);
    CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(invitation_status);
    CREATE INDEX IF NOT EXISTS idx_guests_group_status ON guests(guest_group_id, invitation_status);
    CREATE INDEX IF NOT EXISTS idx_guests_token ON guests(token);

    CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);
    CREATE INDEX IF NOT EXISTS idx_rsvps_status_attendee ON rsvps(status, attendee_count);

    CREATE INDEX IF NOT EXISTS idx_wishes_guest ON wishes(guest_id);
    CREATE INDEX IF NOT EXISTS idx_wishes_status ON wishes(status);
    CREATE INDEX IF NOT EXISTS idx_wishes_status_created ON wishes(status, created_at);

    CREATE INDEX IF NOT EXISTS idx_gifts_active_sort ON wedding_gifts(is_active, sort_order);
    CREATE INDEX IF NOT EXISTS idx_gifts_type ON wedding_gifts(type);

    CREATE INDEX IF NOT EXISTS idx_sections_enabled_sort ON section_settings(is_enabled, sort_order);
  `);

  console.log("Skema 12 tabel berhasil diverifikasi!");

  // 2. Seed Guest Groups jika kosong
  const groupCount = await pool.query("SELECT COUNT(*) FROM guest_groups");
  if (parseInt(groupCount.rows[0].count) === 0) {
    const defaultGroups = [
      "VIP",
      "Keluarga Mempelai Pria",
      "Keluarga Mempelai Wanita",
      "Sahabat & Teman Dekat",
      "Rekan Kerja",
    ];
    for (const g of defaultGroups) {
      await pool.query("INSERT INTO guest_groups (name) VALUES ($1) ON CONFLICT DO NOTHING", [g]);
    }
    console.log("Guest groups awal berhasil di-seed!");
  }

  // 3. Seed Section Settings jika kosong
  const sectionCount = await pool.query("SELECT COUNT(*) FROM section_settings");
  if (parseInt(sectionCount.rows[0].count) === 0) {
    const defaultSections = [
      { code: "hero", order: 10, settings: null },
      { code: "couple", order: 20, settings: null },
      { code: "quote", order: 30, settings: null },
      { code: "events", order: 40, settings: null },
      { code: "countdown", order: 50, settings: null },
      { code: "story", order: 60, settings: null },
      { code: "gallery", order: 70, settings: { layout: "masonry" } },
      { code: "location", order: 80, settings: null },
      { code: "streaming", order: 90, settings: { platform: "youtube", url: "", start_at: "2026-11-21 08:00:00" } },
      { code: "rsvp", order: 100, settings: null },
      { code: "wishes", order: 110, settings: { moderation: false, limit: 20 } },
      { code: "gift", order: 120, settings: null },
      { code: "closing", order: 130, settings: null },
    ];
    for (const s of defaultSections) {
      await pool.query(
        "INSERT INTO section_settings (section_code, is_enabled, sort_order, settings) VALUES ($1, TRUE, $2, $3) ON CONFLICT DO NOTHING",
        [s.code, s.order, JSON.stringify(s.settings)]
      );
    }
    console.log("Section settings awal berhasil di-seed!");
  }

  // 4. Migrasi data eksisting dari tabel 'weddings' (wide-table) ke 12 tabel baru
  const checkSettings = await pool.query("SELECT COUNT(*) FROM wedding_settings");
  if (parseInt(checkSettings.rows[0].count) === 0) {
    const existingWedding = await pool.query("SELECT * FROM weddings LIMIT 1");
    if (existingWedding.rows.length > 0) {
      const row = existingWedding.rows[0];
      console.log("Mentransformasikan data tabel 'weddings' eksisting ke dalam 12 tabel ternormalisasi...");

      // A. Masukkan wedding_settings
      const general = typeof row.general === "string" ? JSON.parse(row.general) : row.general || {};
      const themePalette = typeof row.theme_palette === "string" ? JSON.parse(row.theme_palette) : row.theme_palette || {};
      const dresscode = typeof row.dresscode === "string" ? JSON.parse(row.dresscode) : row.dresscode || {};

      await pool.query(
        `INSERT INTO wedding_settings (
          wedding_title, cover_subtitle, opening_text, closing_text,
          quote, quote_source, background_music, background_music_volume,
          og_title, og_description, timezone, active_template_id,
          theme_palette, dresscode
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          "The Wedding of Gilang & Salsadila",
          general.funTagline || "Menemukan cinta itu mudah, tapi menemukan yang sefrekuensi itu anugerah!",
          general.openingMessage || "Dengan rasa syukur yang melimpah dan senyum paling bahagia, kami mengundang teman-teman dan keluarga:",
          general.closingMessage || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.",
          general.quote?.arabic ? `${general.quote.arabic}\n${general.quote.translation}` : "Dan di antara tanda-tanda kebesaran-Nya...",
          general.quote?.source || "QS. Ar-Rum: 21",
          general.musicTitle || "A Thousand Years",
          40,
          "The Wedding of Gilang & Salsadila",
          general.funTagline || "Pernikahan Gilang & Salsadila",
          "Asia/Jakarta",
          row.active_template_id || "paper-art-maroon",
          JSON.stringify(themePalette),
          JSON.stringify(dresscode),
        ]
      );

      // B. Masukkan couples (type 1 = groom, type 2 = bride)
      const couple = typeof row.couple === "string" ? JSON.parse(row.couple) : row.couple || {};
      const groom = couple.groom || {};
      const bride = couple.bride || {};

      await pool.query(
        `INSERT INTO couples (type, full_name, nickname, father_name, mother_name, instagram_url, photo, tagline, bio_funny, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (type) DO UPDATE SET full_name = EXCLUDED.full_name`,
        [
          1,
          groom.fullName || "Gilang Pandu Permadi",
          groom.name || "Gilang",
          "Bpk. Permadi",
          "Ibu",
          groom.instagram ? `https://instagram.com/${groom.instagram.replace(/^@/, "")}` : null,
          null,
          groom.tagline || "Calon Suami Idaman & Penyabar",
          groom.bioFunny || "Suka kopi, hobi ngobrol, dan siap jadi pendamping setia selamanya.",
          1,
        ]
      );

      await pool.query(
        `INSERT INTO couples (type, full_name, nickname, father_name, mother_name, instagram_url, photo, tagline, bio_funny, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (type) DO UPDATE SET full_name = EXCLUDED.full_name`,
        [
          2,
          bride.fullName || "Salsadila Nanda Octavia",
          bride.name || "Salsadila",
          "Bpk. Mokhamad Mokharom",
          "Ibu",
          bride.instagram ? `https://instagram.com/${bride.instagram.replace(/^@/, "")}` : null,
          null,
          bride.tagline || "Tuan Putri Cantik & Berhati Lembut",
          bride.bioFunny || "Pencinta keceriaan, senyum manis, dan siap membangun surga rumah tangga bersama.",
          2,
        ]
      );

      // C. Masukkan events
      const events = typeof row.events === "string" ? JSON.parse(row.events) : row.events || [];
      if (Array.isArray(events)) {
        for (let i = 0; i < events.length; i++) {
          const ev = events[i];
          await pool.query(
            `INSERT INTO wedding_events (
              name, event_date, start_time, end_time, venue, address,
              maps_url, is_main, is_active, sort_order, display_day, display_date, badge_cute, color_theme
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
              ev.title || (i === 0 ? "Akad Nikah" : "Resepsi Pernikahan"),
              ev.dateStr || "2026-11-21",
              ev.time?.includes("-") ? ev.time.split("-")[0].trim().replace(/\s*WIB/i, "") + ":00" : "08:00:00",
              ev.time?.includes("-") ? ev.time.split("-")[1].trim().replace(/\s*WIB/i, "").replace(/selesai/i, "21:00") + ":00" : "12:00:00",
              ev.venueName || "Kediaman Mempelai",
              ev.venueAddress || "Merakurak, Tuban, Jawa Timur",
              ev.mapUrl || "https://maps.google.com",
              i === 0, // Event pertama is_main = true
              true,
              (i + 1) * 10,
              ev.displayDay || "Sabtu",
              ev.displayDate || "21 November 2026",
              ev.badgeCute || "Momen Sakral",
              ev.colorTheme || "red",
            ]
          );
        }
      }

      // D. Masukkan stories
      const stories = typeof row.stories === "string" ? JSON.parse(row.stories) : row.stories || [];
      if (Array.isArray(stories)) {
        for (let i = 0; i < stories.length; i++) {
          const st = stories[i];
          await pool.query(
            `INSERT INTO wedding_stories (
              title, date_label, description, cute_reaction, badge_color, sort_order, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
            [
              st.title || "Awal Bertemu",
              st.year || "2022",
              st.story || "",
              st.cuteReaction || "Senyum",
              st.badgeColor || "gold",
              (i + 1) * 10,
            ]
          );
        }
      }

      // E. Masukkan galleries
      const gallery = typeof row.gallery === "string" ? JSON.parse(row.gallery) : row.gallery || [];
      if (Array.isArray(gallery)) {
        for (let i = 0; i < gallery.length; i++) {
          const g = gallery[i];
          await pool.query(
            `INSERT INTO wedding_galleries (
              image_path, caption, tag, aspect_ratio, doodle_sticker, sticker_bg, sort_order, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
            [
              `/gallery/photo-${i + 1}.jpg`,
              g.caption || "Momen Bahagia",
              g.tag || "Galeri",
              g.aspectRatio || "portrait",
              g.doodleSticker || "Love",
              g.stickerBg || "bg-[#FDE047]",
              (i + 1) * 10,
            ]
          );
        }
      }

      // F. Masukkan gifts
      const gifts = typeof row.gifts === "string" ? JSON.parse(row.gifts) : row.gifts || {};
      if (Array.isArray(gifts.accounts)) {
        for (let i = 0; i < gifts.accounts.length; i++) {
          const acc = gifts.accounts[i];
          await pool.query(
            `INSERT INTO wedding_gifts (
              type, provider, account_number, account_holder, card_color, sort_order, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
            [
              1, // bank
              acc.bankName || "BCA",
              acc.accountNumber || "",
              acc.accountHolder || "",
              acc.cardColor || "maroon",
              (i + 1) * 10,
            ]
          );
        }
      }

      // Masukkan gift physical address
      if (gifts.physicalGiftAddress?.address) {
        await pool.query(
          `INSERT INTO wedding_gifts (
            type, account_holder, address, phone, sort_order, is_active
          ) VALUES ($1, $2, $3, $4, $5, TRUE)`,
          [
            4, // address
            gifts.physicalGiftAddress.recipient || "Gilang & Salsadila",
            gifts.physicalGiftAddress.address,
            gifts.physicalGiftAddress.phone || "",
            99,
          ]
        );
      }

      console.log("Data eksisting tabel 'weddings' berhasil ditransformasikan ke 12 tabel!");
    }
  }

  // 5. Cek apakah ada tamu di tabel eksisting yang perlu ditransfer ke tabel guests baru
  // Jika tabel guests memiliki kolom lama 'slug' dan belum punya 'token', lakukan migrasi kolom
  try {
    const colCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'guests' AND column_name = 'token'
    `);

    if (colCheck.rows.length === 0) {
      console.log("Menambahkan kolom 'token', 'quota', 'invitation_status', 'open_count' ke tabel guests...");
      await pool.query(`
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS guest_group_id BIGINT NULL REFERENCES guest_groups(id) ON DELETE SET NULL;
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS token VARCHAR(32);
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS quota SMALLINT DEFAULT 1;
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS invitation_status SMALLINT DEFAULT 0;
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE NULL;
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP WITH TIME ZONE NULL;
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS last_opened_at TIMESTAMP WITH TIME ZONE NULL;
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS open_count INT DEFAULT 0;
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE NULL;
        ALTER TABLE guests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `);
    }

    // Generate token acak untuk tamu yang token-nya masih NULL
    const guestsWithoutToken = await pool.query("SELECT id FROM guests WHERE token IS NULL");
    for (const g of guestsWithoutToken.rows) {
      let uniqueToken = generateSecureToken(10);
      await pool.query("UPDATE guests SET token = $1 WHERE id = $2", [uniqueToken, g.id]);
    }
  } catch (err: any) {
    console.warn("Catatan migrasi kolom guests:", err.message);
  }

  // 6. Migrasi kolom wishes jika tabel wishes sudah ada sebelumnya
  try {
    await pool.query(`
      ALTER TABLE wishes ADD COLUMN IF NOT EXISTS guest_id VARCHAR(100) NULL REFERENCES guests(id) ON DELETE SET NULL;
      ALTER TABLE wishes ADD COLUMN IF NOT EXISTS display_name VARCHAR(150);
      ALTER TABLE wishes ADD COLUMN IF NOT EXISTS status SMALLINT DEFAULT 1;
      ALTER TABLE wishes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      UPDATE wishes SET display_name = name WHERE display_name IS NULL AND name IS NOT NULL;
    `);
  } catch (wishErr: any) {
    console.warn("Catatan migrasi kolom wishes:", wishErr.message);
  }
}
