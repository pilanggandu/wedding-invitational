-- ========================================================
-- SUPABASE SQL SCHEMA: WEDDING INVITATION & MANAGEMENT
-- The Wedding of Gilang & Salsadila
-- ========================================================

-- 1. Table: weddings (Menyimpan data mempelai, jadwal acara, tema, dan amplop)
CREATE TABLE IF NOT EXISTS public.weddings (
    id TEXT PRIMARY KEY DEFAULT 'inv_gilang_salsa',
    active_template_id TEXT NOT NULL DEFAULT 'paper-art-maroon',
    theme_palette JSONB NOT NULL DEFAULT '{
        "primaryColor": "#7D1128",
        "secondaryColor": "#E5B869",
        "accentColor": "#F5A8B8",
        "fontStyle": "caveat",
        "particlesEnabled": true,
        "musicAutoplay": true
    }'::jsonb,
    couple JSONB NOT NULL DEFAULT '{
        "groom": {
            "name": "Gilang",
            "fullName": "Gilang Pandu Permadi, S.Kom.",
            "tagline": "Calon Suami Idaman & Penyabar",
            "bioFunny": "Suka kopi, hobi ngobrol, dan siap jadi pendamping setia selamanya.",
            "parents": "Putra pertama dari Bpk. Permadi & Ibu",
            "instagram": "gilang"
        },
        "bride": {
            "name": "Salsadila",
            "fullName": "Salsadila Nanda Octavia, S.M.",
            "tagline": "Tuan Putri Cantik & Berhati Lembut",
            "bioFunny": "Pencinta keceriaan, senyum manis, dan siap membangun rumah tangga penuh tawa.",
            "parents": "Putri kedua dari Bpk. Mokhamad Mokharom & Ibu",
            "instagram": "salsadila"
        }
    }'::jsonb,
    general JSONB NOT NULL DEFAULT '{
        "hashtag": "#GilangSalsaHalal",
        "funTagline": "Menemukan cinta itu mudah, tapi menemukan yang sehobi dan sefrekuensi itu anugerah!",
        "musicTitle": "Acoustic Serenade",
        "musicArtist": "Instrumental Acoustic Guitar",
        "openingGreetings": "Assalamu''alaikum Warahmatullahi Wabarakatuh",
        "openingMessage": "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami.",
        "closingMessage": "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu."
    }'::jsonb,
    countdown_target TIMESTAMPTZ NOT NULL DEFAULT '2026-11-21T08:00:00+07:00',
    events JSONB NOT NULL DEFAULT '[]'::jsonb,
    stories JSONB NOT NULL DEFAULT '[]'::jsonb,
    gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
    gifts JSONB NOT NULL DEFAULT '{}'::jsonb,
    dresscode JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: guests (Daftar tamu undangan & pelacakan status kirim)
CREATE TABLE IF NOT EXISTS public.guests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    phone TEXT DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Sahabat',
    is_sent BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pencarian tamu
CREATE INDEX IF NOT EXISTS idx_guests_name ON public.guests(name);
CREATE INDEX IF NOT EXISTS idx_guests_category ON public.guests(category);
CREATE INDEX IF NOT EXISTS idx_guests_is_sent ON public.guests(is_sent);

-- 3. Table: wishes (Buku tamu ucapan & RSVP kehadiran)
CREATE TABLE IF NOT EXISTS public.wishes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL DEFAULT 'Sahabat Seperjuangan',
    attendance TEXT NOT NULL DEFAULT 'Hadir dong! 😋',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index buku tamu
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes(created_at DESC);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Policy: weddings (Public Read, Admin Write)
CREATE POLICY "Allow public read for weddings" ON public.weddings
    FOR SELECT USING (true);

CREATE POLICY "Allow public update for weddings" ON public.weddings
    FOR ALL USING (true) WITH CHECK (true);

-- Policy: guests (Public/Admin Read & Write)
CREATE POLICY "Allow read guests" ON public.guests
    FOR SELECT USING (true);

CREATE POLICY "Allow modify guests" ON public.guests
    FOR ALL USING (true) WITH CHECK (true);

-- Policy: wishes (Public can read and submit wishes)
CREATE POLICY "Allow read wishes" ON public.wishes
    FOR SELECT USING (true);

CREATE POLICY "Allow insert wishes" ON public.wishes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow modify wishes" ON public.wishes
    FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- INITIAL SEED DATA (Opsional: Baris Awal Default)
-- ========================================================
INSERT INTO public.weddings (id, active_template_id)
VALUES ('inv_gilang_salsa', 'paper-art-maroon')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.guests (id, name, slug, phone, category, is_sent, notes)
VALUES
    ('g_1', 'Bapak Budi Santoso & Keluarga', 'Bapak+Budi+Santoso+%26+Keluarga', '6281234567890', 'VIP', TRUE, 'Tamu kehormatan keluarga besar'),
    ('g_2', 'Rizky Pratama & Partner', 'Rizky+Pratama+%26+Partner', '6281987654321', 'Sahabat', FALSE, 'Teman kuliah seperjuangan'),
    ('g_3', 'Keluarga Besar dr. Hendra', 'Keluarga+Besar+dr.+Hendra', '6281345678901', 'Keluarga', TRUE, 'Kerabat dekat mempelai wanita'),
    ('g_4', 'Anisa Rahmawati', 'Anisa+Rahmawati', '6285712345678', 'Rekan Kerja', FALSE, 'Rekan satu divisi kantor')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.wishes (id, name, relationship, attendance, message)
VALUES
    ('w_1', 'Rian & Fani', 'Teman Kuliah Gilang', 'Hadir dong! 😋', 'Selamat menempuh hidup baru Gilang & Salsa! Semoga langgeng dan samawa selalu sampai kakek nenek!'),
    ('w_2', 'dr. Hendra & Keluarga', 'Kerabat Salsa', 'Hadir dong! 😋', 'Barakallahu lakuma wa baraka alaika wa jama''a bainakuma fii khair. Turut berbahagia untuk kedua mempelai.'),
    ('w_3', 'Bima Sakti', 'Sahabat Nongkrong', 'Masih mikir-mikir 👀', 'Akhirnya sohib gua sold out juga! Doain gua cepet nyusul ya bro, insyaAllah meluncur ke Tuban!')
ON CONFLICT (id) DO NOTHING;
