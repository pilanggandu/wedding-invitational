-- ==============================================================================
-- WEDDING INVITATION DATABASE SCHEMA (12 NORMALIZED TABLES)
-- Engine: PostgreSQL 14+ / Local & VPS Production
-- Conforms strictly to: Wedding Invitation - Database Technical Design
-- ==============================================================================

-- 1. USERS (Admin Authentication)
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

-- 2. WEDDING_SETTINGS (Singleton Configuration)
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

-- 3. COUPLES (Groom & Bride)
-- Constant type: 1 = groom, 2 = bride
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

-- 4. WEDDING_EVENTS (Event Schedules)
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

CREATE INDEX IF NOT EXISTS idx_events_date ON wedding_events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_main ON wedding_events(is_main);
CREATE INDEX IF NOT EXISTS idx_events_active_sort ON wedding_events(is_active, sort_order);

-- 5. WEDDING_STORIES (Love Story Timeline)
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

CREATE INDEX IF NOT EXISTS idx_stories_active_sort ON wedding_stories(is_active, sort_order);

-- 6. WEDDING_GALLERIES (Photo Gallery)
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

CREATE INDEX IF NOT EXISTS idx_galleries_active_sort ON wedding_galleries(is_active, sort_order);

-- 7. GUEST_GROUPS (Grouping Tamu: VIP, Family, Office, Friends)
CREATE TABLE IF NOT EXISTS guest_groups (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_guest_groups_name UNIQUE (name)
);

-- 8. GUESTS (Daftar Tamu Undangan dengan Token & Tracking)
-- invitation_status: 0 = not_sent, 1 = sent, 2 = opened
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

CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_group ON guests(guest_group_id);
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(invitation_status);
CREATE INDEX IF NOT EXISTS idx_guests_group_status ON guests(guest_group_id, invitation_status);
CREATE INDEX IF NOT EXISTS idx_guests_token ON guests(token);

-- 9. RSVPS (Konfirmasi Kehadiran 1:1 per Guest)
-- status: 1 = attending, 2 = not_attending
CREATE TABLE IF NOT EXISTS rsvps (
  id BIGSERIAL PRIMARY KEY,
  guest_id BIGINT NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
  status SMALLINT NOT NULL,
  attendee_count SMALLINT DEFAULT 0,
  message VARCHAR(500) NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_rsvps_guest UNIQUE (guest_id)
);

CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);
CREATE INDEX IF NOT EXISTS idx_rsvps_status_attendee ON rsvps(status, attendee_count);

-- 10. WISHES (Buku Tamu / Doa Restu dengan Moderasi)
-- status: 0 = pending, 1 = approved, 2 = rejected
CREATE TABLE IF NOT EXISTS wishes (
  id BIGSERIAL PRIMARY KEY,
  guest_id BIGINT NULL REFERENCES guests(id) ON DELETE SET NULL,
  display_name VARCHAR(150) NOT NULL,
  message VARCHAR(500) NOT NULL,
  relationship VARCHAR(100) NULL,
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wishes_guest ON wishes(guest_id);
CREATE INDEX IF NOT EXISTS idx_wishes_status ON wishes(status);
CREATE INDEX IF NOT EXISTS idx_wishes_status_created ON wishes(status, created_at);

-- 11. WEDDING_GIFTS (Amplop Digital & Hadiah Fisik)
-- type: 1 = bank, 2 = ewallet, 3 = qris, 4 = address
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

CREATE INDEX IF NOT EXISTS idx_gifts_active_sort ON wedding_gifts(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_gifts_type ON wedding_gifts(type);

-- 12. SECTION_SETTINGS (Urutan & Status Section Undangan)
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

CREATE INDEX IF NOT EXISTS idx_sections_enabled_sort ON section_settings(is_enabled, sort_order);
