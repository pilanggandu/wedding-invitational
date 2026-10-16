-- ==============================================================================
-- WEDDING INVITATION DATABASE SCHEMA (12 NORMALIZED TABLES)
-- Engine: MySQL 8.x / InnoDB / utf8mb4 / Laravel Migration Blueprint
-- Conforms strictly to: Wedding Invitation - Database Technical Design
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS (Admin Authentication)
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `email_verified_at` TIMESTAMP NULL,
  `password` VARCHAR(255) NOT NULL,
  `remember_token` VARCHAR(100) NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. WEDDING_SETTINGS (Singleton Configuration)
CREATE TABLE IF NOT EXISTS `wedding_settings` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `wedding_title` VARCHAR(255) NULL,
  `cover_subtitle` VARCHAR(255) NULL,
  `cover_image` VARCHAR(500) NULL,
  `hero_image` VARCHAR(500) NULL,
  `opening_text` TEXT NULL,
  `closing_text` TEXT NULL,
  `quote` TEXT NULL,
  `quote_source` VARCHAR(255) NULL,
  `background_music` VARCHAR(500) NULL,
  `background_music_volume` TINYINT UNSIGNED DEFAULT 40,
  `og_title` VARCHAR(255) NULL,
  `og_description` TEXT NULL,
  `og_image` VARCHAR(500) NULL,
  `allow_indexing` TINYINT(1) DEFAULT 0,
  `allow_share` TINYINT(1) DEFAULT 0,
  `timezone` VARCHAR(50) DEFAULT 'Asia/Jakarta',
  `active_template_id` VARCHAR(100) DEFAULT 'paper-art-maroon',
  `theme_palette` JSON NULL,
  `dresscode` JSON NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. COUPLES (Groom & Bride)
-- type: 1 = groom, 2 = bride
CREATE TABLE IF NOT EXISTS `couples` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `type` TINYINT UNSIGNED NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(100) NULL,
  `father_name` VARCHAR(255) NULL,
  `mother_name` VARCHAR(255) NULL,
  `instagram_url` VARCHAR(500) NULL,
  `photo` VARCHAR(500) NULL,
  `tagline` VARCHAR(255) NULL,
  `bio_funny` TEXT NULL,
  `sort_order` SMALLINT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_couples_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. WEDDING_EVENTS (Event Schedules)
CREATE TABLE IF NOT EXISTS `wedding_events` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `event_date` DATE NOT NULL,
  `start_time` TIME NULL,
  `end_time` TIME NULL,
  `venue` VARCHAR(255) NULL,
  `address` TEXT NULL,
  `latitude` DECIMAL(10, 7) NULL,
  `longitude` DECIMAL(10, 7) NULL,
  `maps_url` VARCHAR(1000) NULL,
  `dress_code` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `is_main` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `sort_order` SMALLINT UNSIGNED DEFAULT 0,
  `display_day` VARCHAR(50) NULL,
  `display_date` VARCHAR(100) NULL,
  `badge_cute` VARCHAR(100) NULL,
  `color_theme` VARCHAR(50) DEFAULT 'red',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_events_date` (`event_date`),
  KEY `idx_events_main` (`is_main`),
  KEY `idx_events_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. WEDDING_STORIES (Love Story Timeline)
CREATE TABLE IF NOT EXISTS `wedding_stories` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `story_date` DATE NULL,
  `date_label` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `image` VARCHAR(500) NULL,
  `cute_reaction` VARCHAR(100) NULL,
  `badge_color` VARCHAR(50) NULL,
  `sort_order` SMALLINT UNSIGNED DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_stories_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. WEDDING_GALLERIES (Photo Gallery)
CREATE TABLE IF NOT EXISTS `wedding_galleries` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `image_path` VARCHAR(500) NOT NULL,
  `medium_path` VARCHAR(500) NULL,
  `thumbnail_path` VARCHAR(500) NULL,
  `caption` VARCHAR(500) NULL,
  `alt_text` VARCHAR(255) NULL,
  `tag` VARCHAR(100) NULL,
  `aspect_ratio` VARCHAR(50) DEFAULT 'square',
  `doodle_sticker` VARCHAR(100) NULL,
  `sticker_bg` VARCHAR(100) NULL,
  `sort_order` SMALLINT UNSIGNED DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_galleries_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. GUEST_GROUPS (Grouping Tamu: VIP, Family, Office, Friends)
CREATE TABLE IF NOT EXISTS `guest_groups` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_guest_groups_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. GUESTS (Daftar Tamu Undangan dengan Token & Tracking)
-- invitation_status: 0 = not_sent, 1 = sent, 2 = opened
CREATE TABLE IF NOT EXISTS `guests` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `guest_group_id` BIGINT UNSIGNED NULL,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `token` VARCHAR(32) NOT NULL,
  `quota` TINYINT UNSIGNED DEFAULT 1,
  `invitation_status` TINYINT UNSIGNED DEFAULT 0,
  `sent_at` TIMESTAMP NULL,
  `opened_at` TIMESTAMP NULL,
  `last_opened_at` TIMESTAMP NULL,
  `open_count` INT UNSIGNED DEFAULT 0,
  `notes` TEXT NULL,
  `deleted_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_guests_token` (`token`),
  KEY `idx_guests_phone` (`phone`),
  KEY `idx_guests_group` (`guest_group_id`),
  KEY `idx_guests_status` (`invitation_status`),
  KEY `idx_guests_group_status` (`guest_group_id`, `invitation_status`),
  CONSTRAINT `fk_guests_group` FOREIGN KEY (`guest_group_id`) REFERENCES `guest_groups` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. RSVPS (Konfirmasi Kehadiran 1:1 per Guest)
-- status: 1 = attending, 2 = not_attending
CREATE TABLE IF NOT EXISTS `rsvps` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `guest_id` BIGINT UNSIGNED NOT NULL,
  `status` TINYINT UNSIGNED NOT NULL,
  `attendee_count` TINYINT UNSIGNED DEFAULT 0,
  `message` VARCHAR(500) NULL,
  `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_rsvps_guest` (`guest_id`),
  KEY `idx_rsvps_status` (`status`),
  KEY `idx_rsvps_status_attendee` (`status`, `attendee_count`),
  CONSTRAINT `fk_rsvps_guest` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. WISHES (Buku Tamu / Doa Restu dengan Moderasi)
-- status: 0 = pending, 1 = approved, 2 = rejected
CREATE TABLE IF NOT EXISTS `wishes` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `guest_id` BIGINT UNSIGNED NULL,
  `display_name` VARCHAR(150) NOT NULL,
  `message` VARCHAR(500) NOT NULL,
  `relationship` VARCHAR(100) NULL,
  `status` TINYINT UNSIGNED DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_wishes_guest` (`guest_id`),
  KEY `idx_wishes_status` (`status`),
  KEY `idx_wishes_status_created` (`status`, `created_at`),
  CONSTRAINT `fk_wishes_guest` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. WEDDING_GIFTS (Amplop Digital & Hadiah Fisik)
-- type: 1 = bank, 2 = ewallet, 3 = qris, 4 = address
CREATE TABLE IF NOT EXISTS `wedding_gifts` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `type` TINYINT UNSIGNED NOT NULL,
  `provider` VARCHAR(100) NULL,
  `account_number` VARCHAR(100) NULL,
  `account_holder` VARCHAR(255) NULL,
  `qr_image` VARCHAR(500) NULL,
  `address` TEXT NULL,
  `phone` VARCHAR(50) NULL,
  `card_color` VARCHAR(50) DEFAULT 'maroon',
  `sort_order` SMALLINT UNSIGNED DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_gifts_active_sort` (`is_active`, `sort_order`),
  KEY `idx_gifts_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. SECTION_SETTINGS (Urutan & Status Section Undangan)
CREATE TABLE IF NOT EXISTS `section_settings` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `section_code` VARCHAR(50) NOT NULL,
  `is_enabled` TINYINT(1) DEFAULT 1,
  `sort_order` SMALLINT UNSIGNED DEFAULT 0,
  `settings` JSON NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_section_code` (`section_code`),
  KEY `idx_sections_enabled_sort` (`is_enabled`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
