import { Pool } from "pg";
import { generateSecureToken } from "../database/migration_service";

export interface NormalizedCouple {
  id: number;
  type: number; // 1 = groom, 2 = bride
  fullName: string;
  nickname: string;
  fatherName: string;
  motherName: string;
  instagramUrl: string;
  tagline: string;
  bioFunny: string;
}

export class NormalizedWeddingService {
  constructor(private pool: Pool) {}

  /**
   * Mengumpulkan seluruh data dari tabel-tabel ternormalisasi ke dalam struktur WeddingInvitationData
   * yang dibutuhkan oleh Next.js frontend tanpa merusak kontrak komponen template.
   */
  async getAggregatedWeddingData(): Promise<any> {
    // 1. Settings
    const settingsRes = await this.pool.query(
      "SELECT * FROM wedding_settings ORDER BY id DESC LIMIT 1"
    );
    const settings = settingsRes.rows[0] || {};

    // 2. Couples
    const couplesRes = await this.pool.query(
      "SELECT * FROM couples ORDER BY type ASC"
    );
    const groomRow = couplesRes.rows.find((r) => r.type === 1) || {};
    const brideRow = couplesRes.rows.find((r) => r.type === 2) || {};

    const groom = {
      name: groomRow.nickname || "Gilang",
      fullName: groomRow.full_name || "Gilang Pandu Permadi",
      tagline: groomRow.tagline || "Calon Suami Idaman & Penyabar",
      bioFunny: groomRow.bio_funny || "Suka kopi, hobi ngobrol, dan siap jadi pendamping setia selamanya.",
      parents: groomRow.father_name
        ? `${groomRow.father_name} & ${groomRow.mother_name || "Ibu"}`
        : "Bpk. Permadi & Ibu",
      instagram: groomRow.instagram_url ? groomRow.instagram_url.split("/").pop() : "gilang",
      photoPlaceholder: {
        title: "The Groom",
        caption: groomRow.nickname || "Gilang",
        variant: "groom",
        aspectRatio: "3/4",
      },
    };

    const bride = {
      name: brideRow.nickname || "Salsadila",
      fullName: brideRow.full_name || "Salsadila Nanda Octavia",
      tagline: brideRow.tagline || "Tuan Putri Cantik & Berhati Lembut",
      bioFunny: brideRow.bio_funny || "Pencinta keceriaan, senyum manis, dan siap membangun surga rumah tangga bersama.",
      parents: brideRow.father_name
        ? `${brideRow.father_name} & ${brideRow.mother_name || "Ibu"}`
        : "Bpk. Mokhamad Mokharom & Ibu",
      instagram: brideRow.instagram_url ? brideRow.instagram_url.split("/").pop() : "salsadila",
      photoPlaceholder: {
        title: "The Bride",
        caption: brideRow.nickname || "Salsadila",
        variant: "bride",
        aspectRatio: "3/4",
      },
    };

    // 3. Events
    const eventsRes = await this.pool.query(
      "SELECT * FROM wedding_events WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC"
    );
    const events = eventsRes.rows.map((r, idx) => ({
      id: "event_" + r.id,
      title: r.name,
      subTitle: idx === 0 ? "Momen Sakral Ijab Kabul" : "Pesta Syukuran Bersama",
      badgeCute: r.badge_cute || (idx === 0 ? "Momen Paling Sakral" : "Pesta Kebahagiaan"),
      colorTheme: r.color_theme || (idx === 0 ? "red" : "blue"),
      dateStr: r.event_date ? new Date(r.event_date).toISOString().split("T")[0] : "2026-11-21",
      displayDay: r.display_day || "Sabtu",
      displayDate: r.display_date || "21 November 2026",
      time: r.start_time
        ? `${r.start_time.substring(0, 5)} - ${r.end_time ? r.end_time.substring(0, 5) : "Selesai"} WIB`
        : "08:00 - 10:00 WIB",
      venueName: r.venue || "Kediaman Mempelai",
      venueAddress: r.address || "Merakurak, Tuban, Jawa Timur",
      mapUrl: r.maps_url || "https://maps.google.com",
      isMain: r.is_main,
    }));

    // 4. Stories
    const storiesRes = await this.pool.query(
      "SELECT * FROM wedding_stories WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC"
    );
    const stories = storiesRes.rows.map((r) => ({
      id: r.id,
      year: r.date_label || (r.story_date ? new Date(r.story_date).getFullYear().toString() : "2022"),
      title: r.title,
      story: r.description || "",
      cuteReaction: r.cute_reaction || "Senyum Bahagia",
      photoCaption: r.title,
      badgeColor: r.badge_color || "gold",
    }));

    // 5. Galleries
    const galleriesRes = await this.pool.query(
      "SELECT * FROM wedding_galleries WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC"
    );
    const gallery = galleriesRes.rows.map((r) => ({
      id: r.id,
      tag: r.tag || "Galeri",
      caption: r.caption || "Momen Bahagia",
      stickerBg: r.sticker_bg || "bg-[#FDE047]",
      aspectRatio: r.aspect_ratio || "portrait",
      doodleSticker: r.doodle_sticker || "Love",
      imagePath: r.image_path,
    }));

    // 6. Gifts
    const giftsRes = await this.pool.query(
      "SELECT * FROM wedding_gifts WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC"
    );
    const accounts = giftsRes.rows
      .filter((r) => r.type === 1 || r.type === 2)
      .map((r) => ({
        bankName: r.provider || "BCA",
        accountNumber: r.account_number || "",
        accountHolder: r.account_holder || "",
        logoText: r.provider || "BCA",
        cuteLabel: `Rekening ${r.account_holder?.includes("Gilang") ? "Mempelai Pria" : "Mempelai Wanita"}`,
        cardColor: r.card_color || "maroon",
      }));

    const addressRow = giftsRes.rows.find((r) => r.type === 4);
    const physicalGiftAddress = {
      recipient: addressRow?.account_holder || "Gilang Pandu Permadi & Salsadila Nanda Octavia",
      phone: addressRow?.phone || "",
      address: addressRow?.address || "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
    };

    // 7. General & Settings
    const quoteText = settings.quote || "";
    const quoteLines = quoteText.split("\n");
    const quote = {
      arabic: quoteLines[0] || "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا",
      translation: quoteLines[1] || quoteLines[0] || "Dan di antara tanda-tanda kebesaran-Nya...",
      source: settings.quote_source || "QS. Ar-Rum: 21",
    };

    const mainEvent = events.find((e) => e.isMain) || events[0];

    return {
      id: "inv_gilang_salsa",
      activeTemplateId: settings.active_template_id || "paper-art-maroon",
      themePalette: settings.theme_palette || {
        primaryColor: "#7D1128",
        secondaryColor: "#E5B869",
        accentColor: "#F5A8B8",
        fontStyle: "alex-brush",
        particlesEnabled: true,
        musicAutoplay: true,
      },
      couple: { groom, bride },
      general: {
        hashtag: "#GilangSalsaHalal",
        funTagline: settings.cover_subtitle || "Menemukan cinta itu mudah, tapi menemukan yang sefrekuensi itu anugerah!",
        musicTitle: settings.background_music || "A Thousand Years",
        musicArtist: "Christina Perri",
        closingMessage: settings.closing_text || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.",
        openingMessage: settings.opening_text || "Dengan rasa syukur yang melimpah dan senyum paling bahagia, kami mengundang teman-teman dan keluarga:",
        openingGreetings: "Assalamu'alaikum & Halo Teman-Teman Semua!",
        quote,
      },
      countdownTarget: mainEvent ? `${mainEvent.dateStr}T08:00:00+07:00` : "2026-11-21T08:00:00+07:00",
      events,
      stories,
      gallery,
      gifts: { accounts, physicalGiftAddress },
      dresscode: settings.dresscode || {
        description: "Kenakan pakaian terbaikmu yang rapi dan nyaman. Rekomendasi palet warna tema hangat:",
        colors: [
          { hex: "#7D1128", name: "Royal Maroon" },
          { hex: "#E5B869", name: "Champagne Gold" },
          { hex: "#F5A8B8", name: "Dusty Rose" },
          { hex: "#8FA89B", name: "Warm Sage" },
          { hex: "#FFF0F3", name: "Ivory Cream" },
        ],
      },
      updatedAt: settings.updated_at || new Date().toISOString(),
      source: "postgresql_12_tables",
    };
  }

  /**
   * Menyimpan pembaruan data secara transaksional ke tabel-tabel ternormalisasi
   */
  async updateWeddingData(payload: any): Promise<any> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Update wedding_settings
      const currentSettings = await client.query("SELECT id FROM wedding_settings LIMIT 1");
      const settingsId = currentSettings.rows[0]?.id;

      if (settingsId) {
        await client.query(
          `UPDATE wedding_settings SET
            active_template_id = COALESCE($1, active_template_id),
            theme_palette = COALESCE($2, theme_palette),
            cover_subtitle = COALESCE($3, cover_subtitle),
            closing_text = COALESCE($4, closing_text),
            dresscode = COALESCE($5, dresscode),
            updated_at = NOW()
          WHERE id = $6`,
          [
            payload.activeTemplateId,
            payload.themePalette ? JSON.stringify(payload.themePalette) : null,
            payload.general?.funTagline,
            payload.general?.closingMessage,
            payload.dresscode ? JSON.stringify(payload.dresscode) : null,
            settingsId,
          ]
        );
      }

      // 2. Update couples jika ada payload.couple
      if (payload.couple) {
        if (payload.couple.groom) {
          await client.query(
            `UPDATE couples SET
              full_name = COALESCE($1, full_name),
              nickname = COALESCE($2, nickname),
              tagline = COALESCE($3, tagline),
              bio_funny = COALESCE($4, bio_funny),
              updated_at = NOW()
            WHERE type = 1`,
            [
              payload.couple.groom.fullName,
              payload.couple.groom.name,
              payload.couple.groom.tagline,
              payload.couple.groom.bioFunny,
            ]
          );
        }
        if (payload.couple.bride) {
          await client.query(
            `UPDATE couples SET
              full_name = COALESCE($1, full_name),
              nickname = COALESCE($2, nickname),
              tagline = COALESCE($3, tagline),
              bio_funny = COALESCE($4, bio_funny),
              updated_at = NOW()
            WHERE type = 2`,
            [
              payload.couple.bride.fullName,
              payload.couple.bride.name,
              payload.couple.bride.tagline,
              payload.couple.bride.bioFunny,
            ]
          );
        }
      }

      await client.query("COMMIT");
      return await this.getAggregatedWeddingData();
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  // =========================================================================
  // GUEST MANAGEMENT (Token, Quota, Open Tracking, Soft Delete)
  // =========================================================================

  private async resolveGuestGroup(category: string): Promise<{ id: number; name: string }> {
    const name = category.trim();
    const existing = await this.pool.query(
      "SELECT id, name FROM guest_groups WHERE LOWER(name) = LOWER($1) ORDER BY id LIMIT 1",
      [name]
    );
    if (existing.rows.length) return existing.rows[0];
    const inserted = await this.pool.query(
      `INSERT INTO guest_groups (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = guest_groups.name
       RETURNING id, name`,
      [name]
    );
    return inserted.rows[0];
  }

  async getGuests(options: { includeDeleted?: boolean } = {}): Promise<any[]> {
    const whereClause = options.includeDeleted ? "" : "WHERE g.deleted_at IS NULL";
    const res = await this.pool.query(`
      SELECT
        g.id,
        g.name,
        g.phone,
        g.token,
        g.quota,
        g.invitation_status,
        g.sent_at,
        g.opened_at,
        g.last_opened_at,
        g.open_count,
        g.notes,
        g.created_at,
        gg.id AS group_id,
        gg.name AS group_name,
        r.status AS rsvp_status,
        r.attendee_count AS rsvp_attendee_count
      FROM guests g
      LEFT JOIN guest_groups gg ON g.guest_group_id = gg.id
      LEFT JOIN rsvps r ON g.id = r.guest_id
      ${whereClause}
      ORDER BY g.created_at DESC
    `);

    return res.rows.map((r) => ({
      id: r.id.toString(),
      name: r.name,
      slug: encodeURIComponent(r.name).replace(/%20/g, "+"),
      phone: r.phone || "",
      token: r.token,
      quota: r.quota || 1,
      invitationStatus: r.invitation_status,
      category: r.group_name || "Sahabat & Teman Dekat",
      groupId: r.group_id,
      isSent: r.invitation_status > 0,
      openedAt: r.opened_at,
      lastOpenedAt: r.last_opened_at,
      openCount: r.open_count || 0,
      notes: r.notes || "",
      createdAt: r.created_at,
      rsvp: r.rsvp_status ? { status: r.rsvp_status, count: r.rsvp_attendee_count } : null,
    }));
  }

  async createGuest(data: {
    name: string;
    phone?: string;
    quota?: number;
    category?: string;
    notes?: string;
  }): Promise<any> {
    const cleanName = data.name.trim();
    const cleanPhone = (data.phone || "").trim().replace(/^0/, "62").replace(/[^0-9]/g, "");
    const token = generateSecureToken(10);
    const quota = Math.max(1, data.quota || 1);

    const group = await this.resolveGuestGroup(data.category || "Sahabat");

    const res = await this.pool.query(
      `INSERT INTO guests (guest_group_id, name, phone, token, quota, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [group.id, cleanName, cleanPhone, token, quota, data.notes || ""]
    );

    const row = res.rows[0];
    return {
      id: row.id.toString(),
      name: row.name,
      slug: encodeURIComponent(row.name).replace(/%20/g, "+"),
      phone: row.phone || "",
      token: row.token,
      quota: row.quota,
      invitationStatus: row.invitation_status,
      category: group.name,
      groupId: row.guest_group_id,
      isSent: false,
      notes: row.notes,
      createdAt: row.created_at,
    };
  }

  /**
   * Verifikasi token tamu saat membuka undangan publik dan catat open tracking
   */
  async verifyGuestToken(token: string): Promise<any | null> {
    const res = await this.pool.query(
      "SELECT * FROM guests WHERE token = $1 AND deleted_at IS NULL",
      [token]
    );

    if (res.rows.length === 0) return null;

    const guest = res.rows[0];
    const now = new Date().toISOString();

    // Catat open tracking: opened_at hanya di-set saat pertama kali buka
    await this.pool.query(
      `UPDATE guests SET
        opened_at = COALESCE(opened_at, NOW()),
        last_opened_at = NOW(),
        open_count = COALESCE(open_count, 0) + 1,
        invitation_status = 2,
        updated_at = NOW()
      WHERE id = $1`,
      [guest.id]
    );

    return {
      id: guest.id.toString(),
      name: guest.name,
      phone: guest.phone,
      token: guest.token,
      quota: guest.quota,
      openCount: (guest.open_count || 0) + 1,
      openedAt: guest.opened_at || now,
    };
  }

  async softDeleteGuest(id: string): Promise<boolean> {
    const res = await this.pool.query(
      "UPDATE guests SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    return (res.rowCount ?? 0) > 0;
  }

  async updateGuest(
    id: string | number,
    data: {
      name?: string;
      phone?: string;
      quota?: number;
      category?: string;
      notes?: string;
      isSent?: boolean;
    }
  ): Promise<any | null> {
    const curRes = await this.pool.query(
      `SELECT g.*, gg.name AS group_name
       FROM guests g
       LEFT JOIN guest_groups gg ON g.guest_group_id = gg.id
       WHERE g.id = $1 AND g.deleted_at IS NULL`,
      [id]
    );
    if (curRes.rows.length === 0) return null;
    const cur = curRes.rows[0];

    const name = data.name !== undefined ? data.name.trim() : cur.name;
    const phone =
      data.phone !== undefined
        ? data.phone.trim().replace(/^0/, "62").replace(/[^0-9]/g, "")
        : cur.phone;
    const quota =
      data.quota !== undefined ? Math.max(1, data.quota) : cur.quota || 1;
    const notes = data.notes !== undefined ? data.notes : cur.notes;

    let invitationStatus = cur.invitation_status;
    let sentAt = cur.sent_at;
    if (data.isSent !== undefined) {
      if (data.isSent) {
        invitationStatus = cur.invitation_status === 2 ? 2 : 1;
        sentAt = sentAt || new Date().toISOString();
      } else {
        invitationStatus = 0;
      }
    }

    let groupId = cur.guest_group_id;
    let category = cur.group_name || "Sahabat & Teman Dekat";
    if (data.category !== undefined) {
      const group = await this.resolveGuestGroup(data.category);
      groupId = group.id;
      category = group.name;
    }

    const res = await this.pool.query(
      `UPDATE guests SET
        name = $1,
        phone = $2,
        quota = $3,
        notes = $4,
        guest_group_id = $5,
        invitation_status = $6,
        sent_at = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING *`,
      [name, phone, quota, notes, groupId, invitationStatus, sentAt, id]
    );

    const row = res.rows[0];
    return {
      id: row.id.toString(),
      name: row.name,
      slug: encodeURIComponent(row.name).replace(/%20/g, "+"),
      phone: row.phone || "",
      token: row.token,
      quota: row.quota,
      invitationStatus: row.invitation_status,
      category,
      groupId: row.guest_group_id,
      isSent: row.invitation_status > 0,
      notes: row.notes,
      openCount: row.open_count || 0,
      openedAt: row.opened_at,
      lastOpenedAt: row.last_opened_at,
      createdAt: row.created_at,
    };
  }

  // =========================================================================
  // RSVP MANAGEMENT (1:1 per guest, Quota Validation)
  // =========================================================================

  async submitRsvp(params: {
    guestId: string | number;
    status: number; // 1 = attending, 2 = not_attending
    attendeeCount: number;
    message?: string;
  }): Promise<any> {
    const guestRes = await this.pool.query(
      "SELECT id, quota FROM guests WHERE id = $1 AND deleted_at IS NULL",
      [params.guestId]
    );

    if (guestRes.rows.length === 0) {
      throw new Error("Data tamu undangan tidak ditemukan");
    }

    const guest = guestRes.rows[0];
    const quota = guest.quota || 1;

    // Validasi kuota jika hadir
    let count = params.attendeeCount;
    if (params.status === 1) {
      if (count < 1) count = 1;
      if (count > quota) {
        throw new Error(`Jumlah kehadiran (${count}) melebihi kuota reservasi (${quota} orang)`);
      }
    } else {
      count = 0;
    }

    const res = await this.pool.query(
      `INSERT INTO rsvps (guest_id, status, attendee_count, message, submitted_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (guest_id) DO UPDATE SET
         status = EXCLUDED.status,
         attendee_count = EXCLUDED.attendee_count,
         message = EXCLUDED.message,
         submitted_at = NOW(),
         updated_at = NOW()
       RETURNING *`,
      [params.guestId, params.status, count, params.message || ""]
    );

    return res.rows[0];
  }

  async getRsvpSummary(): Promise<any> {
    const totalRes = await this.pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 1) AS attending_count,
        COUNT(*) FILTER (WHERE status = 2) AS not_attending_count,
        COALESCE(SUM(attendee_count) FILTER (WHERE status = 1), 0) AS estimated_heads
      FROM rsvps
    `);
    const guestCountRes = await this.pool.query(
      "SELECT COUNT(*) AS total_guests FROM guests WHERE deleted_at IS NULL"
    );

    return {
      totalGuests: parseInt(guestCountRes.rows[0]?.total_guests || 0),
      attending: parseInt(totalRes.rows[0]?.attending_count || 0),
      notAttending: parseInt(totalRes.rows[0]?.not_attending_count || 0),
      estimatedHeads: parseInt(totalRes.rows[0]?.estimated_heads || 0),
    };
  }

  async getRsvpList(): Promise<any[]> {
    const res = await this.pool.query(`
      SELECT 
        r.id,
        r.guest_id,
        r.status,
        r.attendee_count,
        r.message,
        r.submitted_at,
        g.name AS guest_name,
        g.phone AS guest_phone,
        g.quota AS guest_quota,
        gg.name AS group_name
      FROM rsvps r
      JOIN guests g ON r.guest_id = g.id
      LEFT JOIN guest_groups gg ON g.guest_group_id = gg.id
      WHERE g.deleted_at IS NULL
      ORDER BY r.submitted_at DESC
    `);
    return res.rows.map((r) => ({
      id: r.id.toString(),
      guestId: r.guest_id.toString(),
      guestName: r.guest_name,
      guestPhone: r.guest_phone || "",
      guestQuota: r.guest_quota || 1,
      groupName: r.group_name || "Sahabat",
      status: r.status,
      attendeeCount: r.attendee_count,
      message: r.message || "",
      submittedAt: r.submitted_at,
    }));
  }

  // =========================================================================
  // WISHES MANAGEMENT (Buku Tamu dengan Moderasi Status)
  // =========================================================================

  async getWishes(status?: number): Promise<any[]> {
    const filter = status !== undefined ? "WHERE status = $1" : "WHERE status = 1";
    const params = status !== undefined ? [status] : [];

    const res = await this.pool.query(
      `SELECT * FROM wishes ${filter} ORDER BY created_at DESC LIMIT 50`,
      params
    );

    return res.rows.map((r) => ({
      id: r.id.toString(),
      name: r.display_name,
      relationship: r.relationship || "Sahabat",
      attendance: "Hadir",
      message: r.message,
      status: r.status,
      date: new Date(r.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      createdAt: r.created_at,
    }));
  }

  async createWish(data: {
    displayName: string;
    message: string;
    guestId?: string | number;
    relationship?: string;
  }): Promise<any> {
    const res = await this.pool.query(
      `INSERT INTO wishes (guest_id, display_name, message, relationship, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 1, NOW(), NOW())
       RETURNING *`,
      [data.guestId || null, data.displayName.trim(), data.message.trim(), data.relationship || "Sahabat"]
    );
    const r = res.rows[0];
    return {
      id: r.id.toString(),
      name: r.display_name,
      relationship: r.relationship,
      message: r.message,
      status: r.status,
      date: new Date(r.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      createdAt: r.created_at,
    };
  }

  async updateWishStatus(id: string | number, status: number): Promise<boolean> {
    const res = await this.pool.query(
      "UPDATE wishes SET status = $1, updated_at = NOW() WHERE id = $2",
      [status, id]
    );
    return (res.rowCount ?? 0) > 0;
  }

  // =========================================================================
  // SECTION SETTINGS (Urutan & Status Section)
  // =========================================================================

  async getSections(): Promise<any[]> {
    const res = await this.pool.query(
      "SELECT * FROM section_settings ORDER BY sort_order ASC"
    );
    return res.rows.map((r) => ({
      id: r.id,
      code: r.section_code,
      isEnabled: r.is_enabled,
      sortOrder: r.sort_order,
      settings: r.settings,
    }));
  }

  async updateSection(code: string, isEnabled: boolean, sortOrder?: number): Promise<boolean> {
    const res = await this.pool.query(
      `UPDATE section_settings SET
        is_enabled = $1,
        sort_order = COALESCE($2, sort_order),
        updated_at = NOW()
      WHERE section_code = $3`,
      [isEnabled, sortOrder ?? null, code]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
