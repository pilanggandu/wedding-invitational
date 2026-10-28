"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  Music,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  WeddingDataProvider,
  useWeddingData,
} from "@/context/WeddingDataContext";
import { AudioPlayer } from "@/components/AudioPlayer";
import { CharMotionReveal } from "@/components/CharMotionReveal";
import { triggerKeepsakeCelebration } from "../paper-keepsake/keepsakeCelebration";
import { KeepsakeCelebrationShower } from "../paper-keepsake/KeepsakeCelebrationShower";
import { createKeepsakeCalendar } from "../paper-keepsake/keepsakeCalendar";
import { CraftBookEnvelope } from "./CraftBookEnvelope";
import { CraftBookGuestbook } from "./CraftBookGuestbook";
import type { TemplateProps } from "../types";
import "./craft-book.css";

const TABS = [
  { id: 1, label: "Sampul", icon: "🔖" },
  { id: 2, label: "Mempelai", icon: "💍" },
  { id: 3, label: "Acara", icon: "🗓️" },
  { id: 4, label: "Kisah Kita", icon: "📖" },
  { id: 5, label: "Galeri", icon: "🖼️" },
  { id: 6, label: "Amplop Kado", icon: "💌" },
  { id: 7, label: "Papan Doa", icon: "📝" },
];

function CraftBookInner({
  guestName,
  guestItem,
  isPreview = false,
  isEditor = false,
  onOpenChange,
}: Omit<TemplateProps, "data">) {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  const [opened, setOpened] = useState(isEditor || false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const albumRef = useRef<HTMLDivElement>(null);

  // Handle open invitation
  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setShowCelebration(true);
    onOpenChange?.(true);
    triggerKeepsakeCelebration();
  };

  // Keyboard navigation between pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!opened) return;
      if (e.key === "ArrowRight" && currentPage < TABS.length) {
        setCurrentPage((prev) => prev + 1);
      } else if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [opened, currentPage]);

  const switchPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (albumRef.current) {
      albumRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownloadCalendar = (event: (typeof data.events)[0]) => {
    const coupleNames = `${groom.name} & ${bride.name}`;
    const icsContent = createKeepsakeCalendar(event, coupleNames);
    if (!icsContent) return;
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wedding-${event.id || "invitation"}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="cb-root">
      {/* CELEBRATION SHOWER */}
      {showCelebration && (
        <KeepsakeCelebrationShower active={showCelebration} />
      )}

      {/* TOP BAR */}
      <header className="cb-top-bar">
        <div className="cb-branding">
          <span className="cb-brand-stamp">🏷️</span>
          <span>
            {groom.name} &amp; {bride.name} • Craft Scrapbook
          </span>
        </div>
        <div className="cb-top-actions">
          {opened && (
            <div className="cb-audio-pill">
              <AudioPlayer
                autoPlayTrigger={Boolean(data.themePalette?.musicAutoplay)}
              />
            </div>
          )}
        </div>
      </header>

      {/* IF NOT OPENED YET: COVER VIEW */}
      {!opened ? (
        <main className="cb-desk-wrapper my-auto py-8">
          <div className="cb-album max-w-xl mx-auto p-6 sm:p-10 text-center relative">
            <div className="cb-texture-overlay" />
            <div className="cb-corner-tape top-left" />
            <div className="cb-corner-tape top-right" />

            <div className="relative z-10">
              <div className="flex justify-center mb-2">
                <img
                  src="/images/templates/craft-book/airmail-border-badge.svg"
                  alt="Airmail Wedding Edition"
                  aria-hidden="true"
                  className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm select-none pointer-events-none"
                />
              </div>

              <div className="cb-torn-hero">
                <div className="cb-washi-strip tape-olive">
                  WALIMATUL 'URS • {data.events[0]?.displayDate || "Hari Bahagia"}
                </div>
                <h1 className="cb-hero-couple">
                  <CharMotionReveal text={groom.name} baseDelay={0.25} />{" "}
                  <em>&amp;</em>{" "}
                  <CharMotionReveal text={bride.name} baseDelay={0.55} />
                </h1>
                <p className="cb-hero-quote">
                  "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
                  pasangan-pasangan untukmu dari jenismu sendiri, agar kamu
                  cenderung dan merasa tenteram kepadanya."
                </p>
              </div>

              {/* GUEST RECIPIENT CARD */}
              <div className="cb-guest-card">
                <span>Kepada Yth. Bapak / Ibu / Saudara/i</span>
                <strong>
                  <CharMotionReveal
                    text={guestName || guestItem?.name || "Tamu Terhormat"}
                    baseDelay={0.8}
                  />
                </strong>
              </div>

              {/* POLAROID SHOWCASE */}
              <div className="cb-polaroids-showcase my-4 relative">
                <div className="cb-polaroid tilt-left mx-auto relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-8 h-8 pointer-events-none select-none">
                    <img
                      src="/images/templates/craft-book/thumbtack-pin.svg"
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="cb-polaroid-img-box">
                    <img
                      src={
                        data.general.coverPhotoUrl ||
                        data.general.heroPhotoUrl ||
                        "/images/prewedding/couple-1.jpg"
                      }
                      alt={`${groom.name} & ${bride.name}`}
                    />
                  </div>
                  <div className="cb-polaroid-caption">
                    Sebuah Babak Baru Dimulai ✨
                  </div>
                </div>
              </div>

              {/* MONOGRAM WAX SEAL BUTTON */}
              <button
                type="button"
                className="cb-wax-seal relative group border-0 bg-transparent shadow-none"
                onClick={handleOpen}
                aria-label="Buka buku scrapbook pernikahan"
                title="Buka segel lilin"
              >
                <img
                  src="/images/templates/craft-book/kraft-wax-seal.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="sr-only">
                  {groom.name.charAt(0)}&amp;{bride.name.charAt(0)}
                </span>
              </button>

              <div className="mt-4">
                <button
                  type="button"
                  className="cb-submit-btn max-w-xs mx-auto"
                  onClick={handleOpen}
                >
                  <Mail size={17} />
                  <span>Buka Buku Undangan</span>
                </button>
                <p className="text-xs text-[#6e5e54] mt-3">
                  Klik amplop atau tombol di atas untuk membuka lembaran kenangan
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* OPENED BOOK VIEW (VIEW BOOK) */
        <main className="cb-desk-wrapper">
          {/* SCRAPBOOK TABS */}
          <nav className="cb-tabs-scroll" aria-label="Tab Halaman Scrapbook">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`cb-tab-btn ${currentPage === tab.id ? "active" : ""}`}
                onClick={() => switchPage(tab.id)}
              >
                <span className="cb-tab-tape" />
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* ALBUM BOOK CONTAINER */}
          <div ref={albumRef} className="cb-album relative" id="scrapbookAlbum">
            <div className="cb-texture-overlay" />
            <div className="cb-corner-tape top-left" />
            <div className="cb-corner-tape top-right" />
            <div className="absolute -left-3.5 sm:-left-5 top-8 bottom-8 w-6 sm:w-8 z-20 pointer-events-none select-none opacity-85">
              <img
                src="/images/templates/craft-book/craft-spiral-spine.svg"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain"
              />
            </div>

            {/* ================= PAGE 1: SAMPUL DEPAN ================= */}
            <section className={`cb-page ${currentPage === 1 ? "active" : ""}`}>
              <div className="cb-cover-hero">
                <div className="cb-airmail-badge">
                  <span>CHAPTER OF LOVE • THE WEDDING ALBUM</span>
                </div>

                <div className="cb-torn-hero">
                  <div className="cb-washi-strip tape-terracotta">
                    SAVE THE DATE • {data.events[0]?.displayDate}
                  </div>
                  <h2 className="cb-hero-couple">
                    <CharMotionReveal text={groom.name} baseDelay={0.15} />{" "}
                    <em>&amp;</em>{" "}
                    <CharMotionReveal text={bride.name} baseDelay={0.45} />
                  </h2>
                  <p className="cb-hero-quote">
                    “Dua jiwa yang berjalan bersama dalam ikatan suci pernikahan,
                    merajut hari-hari penuh kasih dan tawa yang kita simpan dalam
                    buku kenangan ini.”
                  </p>
                </div>

                <div className="cb-polaroids-showcase">
                  <div className="cb-polaroid tilt-left">
                    <div className="cb-polaroid-pin tape-mustard" />
                    <div className="cb-polaroid-img-box">
                      <img
                        src={
                          data.general.heroPhotoUrl ||
                          data.general.coverPhotoUrl ||
                          "/images/prewedding/couple-1.jpg"
                        }
                        alt="Potret Mempelai"
                      />
                    </div>
                    <div className="cb-polaroid-caption">
                      Hari yang Dinanti Bersamamu
                    </div>
                  </div>

                  <div className="cb-polaroid tilt-right">
                    <div className="cb-polaroid-pin tape-olive" />
                    <div className="cb-polaroid-img-box">
                      <img
                        src={
                          data.couple.bride.photoUrl ||
                          data.couple.groom.photoUrl ||
                          "/images/prewedding/couple-2.jpg"
                        }
                        alt="Keluarga & Mempelai"
                      />
                    </div>
                    <div className="cb-polaroid-caption">
                      {data.general.hashtag || "#OurNewChapter"}
                    </div>
                  </div>
                </div>

                {data.general.openingGreetings && (
                  <div className="max-w-lg mx-auto bg-[#fdfaf6] p-4 rounded border border-dashed border-[#caa98c] my-4 text-sm text-[#5c4737] leading-relaxed">
                    <strong>{data.general.openingGreetings}</strong>
                    <p className="mt-2">{data.general.openingMessage}</p>
                  </div>
                )}
              </div>
            </section>

            {/* ================= PAGE 2: KEDUA MEMPELAI ================= */}
            <section className={`cb-page ${currentPage === 2 ? "active" : ""}`}>
              <div className="cb-page-header">
                <div className="cb-washi-strip tape-olive">PROFIL MEMPELAI</div>
                <h2 className="cb-page-title">Mempelai Pria &amp; Wanita</h2>
                <p className="cb-page-subtitle">
                  Dengan memohon rahmat dan ridho Allah SWT, kami mengikat janji suci
                </p>
              </div>

              <div className="cb-couple-grid">
                {/* GROOM CARD */}
                <article className="cb-couple-card">
                  <div className="cb-polaroid tilt-left">
                    <div className="cb-polaroid-pin tape-terracotta" />
                    <div className="cb-polaroid-img-box">
                      <img
                        src={groom.photoUrl || "/images/prewedding/couple-3.jpg"}
                        alt={groom.fullName || groom.name}
                      />
                    </div>
                    <div className="cb-polaroid-caption">Mempelai Pria</div>
                  </div>
                  <span className="cb-couple-role">Mempelai Pria</span>
                  <h3 className="cb-couple-name">
                    <CharMotionReveal text={groom.name} baseDelay={0.2} />
                  </h3>
                  <p className="cb-couple-fullname">{groom.fullName}</p>
                  {groom.parents && (
                    <p className="cb-couple-parents">
                      Putra tercinta dari:
                      <br />
                      <strong>{groom.parents}</strong>
                    </p>
                  )}
                  {groom.instagram && (
                    <a
                      href={`https://instagram.com/${groom.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cb-couple-social"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                      <span>@{groom.instagram.replace("@", "")}</span>
                    </a>
                  )}
                </article>

                {/* BRIDE CARD */}
                <article className="cb-couple-card">
                  <div className="cb-polaroid tilt-right">
                    <div className="cb-polaroid-pin tape-olive" />
                    <div className="cb-polaroid-img-box">
                      <img
                        src={bride.photoUrl || "/images/prewedding/couple-4.jpg"}
                        alt={bride.fullName || bride.name}
                      />
                    </div>
                    <div className="cb-polaroid-caption">Mempelai Wanita</div>
                  </div>
                  <span className="cb-couple-role">Mempelai Wanita</span>
                  <h3 className="cb-couple-name">
                    <CharMotionReveal text={bride.name} baseDelay={0.2} />
                  </h3>
                  <p className="cb-couple-fullname">{bride.fullName}</p>
                  {bride.parents && (
                    <p className="cb-couple-parents">
                      Putri tercinta dari:
                      <br />
                      <strong>{bride.parents}</strong>
                    </p>
                  )}
                  {bride.instagram && (
                    <a
                      href={`https://instagram.com/${bride.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cb-couple-social"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                      <span>@{bride.instagram.replace("@", "")}</span>
                    </a>
                  )}
                </article>
              </div>
            </section>

            {/* ================= PAGE 3: ACARA & AGENDA (BOARDING PASS) ================= */}
            <section className={`cb-page ${currentPage === 3 ? "active" : ""}`}>
              <div className="cb-page-header">
                <div className="cb-washi-strip tape-mustard">RANGKAIAN HARI BAHAGIA</div>
                <h2 className="cb-page-title">Agenda &amp; Lokasi Acara</h2>
                <p className="cb-page-subtitle">
                  Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kehormatan besar bagi kami
                </p>
                <div className="flex justify-center mt-3">
                  <img
                    src="/images/templates/craft-book/boarding-pass-ticket.svg"
                    alt="Boarding Pass Acara"
                    aria-hidden="true"
                    className="w-full max-w-xs h-auto object-contain drop-shadow-sm opacity-90"
                  />
                </div>
              </div>

              <div className="cb-events-list">
                {data.events.map((event, index) => (
                  <div key={event.id || index} className="cb-ticket-card">
                    <div className="cb-ticket-cut-left" />
                    <div className="cb-ticket-cut-right" />

                    <div className="cb-ticket-badge">
                      <span>BOARDING PASS TO OUR BIG DAY</span>
                      <span>{event.displayDate || "Tanggal Acara"}</span>
                    </div>

                    <h3 className="cb-ticket-title">{event.title}</h3>

                    <div className="cb-ticket-grid">
                      <div className="cb-ticket-item">
                        <span>WAKTU PELAKSANAAN:</span>
                        <strong>{event.time}</strong>
                      </div>
                      <div className="cb-ticket-item">
                        <span>TEMPAT / GEDUNG:</span>
                        <strong>{event.venueName}</strong>
                      </div>
                      <div className="cb-ticket-item col-span-full">
                        <span>ALAMAT LENGKAP:</span>
                        <p className="text-xs text-[#5c4737] mt-0.5">
                          {event.venueAddress}
                        </p>
                      </div>
                    </div>

                    <div className="cb-ticket-actions">
                      {event.mapUrl && (
                        <a
                          href={event.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cb-action-btn"
                        >
                          <MapPin size={15} />
                          <span>Buka Petunjuk Google Maps</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                      <button
                        type="button"
                        className="cb-action-btn"
                        onClick={() => handleDownloadCalendar(event)}
                      >
                        <CalendarDays size={15} />
                        <span>Simpan ke Kalender (.ics)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ================= PAGE 4: LOVE STORY (STICKY NOTES) ================= */}
            <section className={`cb-page ${currentPage === 4 ? "active" : ""}`}>
              <div className="cb-page-header">
                <div className="cb-washi-strip tape-gingham">JEJAK PERJALANAN KAMI</div>
                <h2 className="cb-page-title">Kisah Cinta &amp; Momen Manis</h2>
                <p className="cb-page-subtitle">
                  Rangkaian cerita singkat dari awal perjumpaan hingga janji suci
                </p>
              </div>

              <div className="cb-story-grid">
                {data.stories && data.stories.length > 0 ? (
                  data.stories.map((story, idx) => {
                    const colors = ["note-yellow", "note-sage", "note-terracotta", "note-kraft"];
                    const noteColor = colors[idx % colors.length];
                    return (
                      <div key={idx} className={`cb-sticky-note ${noteColor}`}>
                        <span className="cb-sticky-pin inline-flex items-center justify-center">
                          <img
                            src="/images/templates/craft-book/thumbtack-pin.svg"
                            alt=""
                            aria-hidden="true"
                            className="w-5 h-5 object-contain"
                          />
                        </span>
                        <div>
                          <div className="cb-sticky-date">{story.year}</div>
                          <h3 className="cb-sticky-title">{story.title}</h3>
                          <p className="cb-sticky-desc">{story.story}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="cb-sticky-note note-yellow">
                      <span className="cb-sticky-pin inline-flex items-center justify-center">
                        <img
                          src="/images/templates/craft-book/thumbtack-pin.svg"
                          alt=""
                          aria-hidden="true"
                          className="w-5 h-5 object-contain"
                        />
                      </span>
                      <div>
                        <div className="cb-sticky-date">Awal Pertemuan</div>
                        <h3 className="cb-sticky-title">Pertama Kali Bersua</h3>
                        <p className="cb-sticky-desc">
                          Pertemuan sederhana yang tidak disengaja, membuka pintu
                          percakapan panjang dan rasa nyaman yang terus tumbuh.
                        </p>
                      </div>
                    </div>
                    <div className="cb-sticky-note note-sage">
                      <span className="cb-sticky-pin inline-flex items-center justify-center">
                        <img
                          src="/images/templates/craft-book/thumbtack-pin.svg"
                          alt=""
                          aria-hidden="true"
                          className="w-5 h-5 object-contain"
                        />
                      </span>
                      <div>
                        <div className="cb-sticky-date">Komitmen Bersama</div>
                        <h3 className="cb-sticky-title">Memilih Melangkah Berdua</h3>
                        <p className="cb-sticky-desc">
                          Saling menguatkan dalam suka dan duka, meyakinkan hati bahwa
                          kita siap mengarungi masa depan bersama.
                        </p>
                      </div>
                    </div>
                    <div className="cb-sticky-note note-terracotta">
                      <span className="cb-sticky-pin inline-flex items-center justify-center">
                        <img
                          src="/images/templates/craft-book/thumbtack-pin.svg"
                          alt=""
                          aria-hidden="true"
                          className="w-5 h-5 object-contain"
                        />
                      </span>
                      <div>
                        <div className="cb-sticky-date">Menuju Pelaminan</div>
                        <h3 className="cb-sticky-title">Ikatan Janji Suci</h3>
                        <p className="cb-sticky-desc">
                          Dengan restu kedua orang tua dan sanak keluarga, kami
                          memantapkan hati untuk menyatukan dua keluarga dalam pernikahan.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ================= PAGE 5: GALERI FOTO POLAROID ================= */}
            <section className={`cb-page ${currentPage === 5 ? "active" : ""}`}>
              <div className="cb-page-header relative">
                <div className="absolute -top-4 -right-1 w-14 sm:w-16 h-auto pointer-events-none select-none opacity-85 z-20">
                  <img
                    src="/images/templates/craft-book/pressed-fern-sprig.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-auto object-contain rotate-12"
                  />
                </div>
                <div className="cb-washi-strip tape-terracotta">GALERI POLAROID TEMPEL</div>
                <h2 className="cb-page-title">Album Foto Kenangan</h2>
                <p className="cb-page-subtitle">
                  Potret tawa dan kebersamaan yang terpatri rapi di lembaran scrapbook
                </p>
              </div>

              <div className="cb-gallery-grid">
                {(data.gallery && data.gallery.length > 0
                  ? data.gallery.map((g) => ({
                      url: g.imageUrl || "/images/prewedding/couple-1.jpg",
                      caption: g.caption,
                    }))
                  : [
                      { url: "/images/prewedding/couple-1.jpg", caption: "Senyum Pertama" },
                      { url: "/images/prewedding/couple-2.jpg", caption: "Langkah Bersama" },
                      { url: "/images/prewedding/couple-3.jpg", caption: "Kopi & Obrolan Sore" },
                      { url: "/images/prewedding/couple-4.jpg", caption: "Senja di Kota" },
                      { url: "/images/prewedding/couple-5.jpg", caption: "Menatap Hari Esok" },
                      { url: "/images/prewedding/couple-1.jpg", caption: "Menuju Hari Bahagia" },
                    ]
                ).map((item, idx) => {
                  const tilts = ["tilt-1", "tilt-2", "tilt-3", "tilt-4"];
                  const tilt = tilts[idx % tilts.length];
                  return (
                    <div key={idx} className={`cb-polaroid ${tilt} mx-auto`}>
                      <div
                        className={`cb-polaroid-pin ${
                          idx % 3 === 0
                            ? "tape-mustard"
                            : idx % 3 === 1
                            ? "tape-terracotta"
                            : "tape-olive"
                        }`}
                      />
                      <div className="cb-polaroid-img-box">
                        <img src={item.url} alt={item.caption || `Galeri ${idx + 1}`} />
                      </div>
                      <div className="cb-polaroid-caption">
                        {item.caption || `Kenangan Bahagia #${idx + 1}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ================= PAGE 6: AMPLOP KADO (DIGITAL ENVELOPE) ================= */}
            <section className={`cb-page ${currentPage === 6 ? "active" : ""}`}>
              <div className="cb-page-header">
                <div className="cb-washi-strip tape-olive">KOTAK SURAT &amp; TANDA KASIH</div>
                <h2 className="cb-page-title">Amplop Kraft Hadiah Digital</h2>
                <p className="cb-page-subtitle">
                  Sentuh amplop di bawah ini untuk melihat nomor rekening dan alamat kado
                </p>
              </div>

              <CraftBookEnvelope />
            </section>

            {/* ================= PAGE 7: PAPAN DOA & RSVP ================= */}
            <section className={`cb-page ${currentPage === 7 ? "active" : ""}`}>
              <CraftBookGuestbook
                guestName={guestName}
                guestItem={guestItem}
                isPreview={isPreview}
                isEditor={isEditor}
              />
            </section>

            {/* BOTTOM NAV BAR */}
            <footer className="cb-bottom-nav">
              <button
                type="button"
                className="cb-nav-btn"
                disabled={currentPage === 1}
                onClick={() => switchPage(currentPage - 1)}
              >
                <ChevronLeft size={16} />
                <span>Sebelumnya</span>
              </button>

              <div className="cb-page-indicator">
                Halaman {currentPage} dari {TABS.length} • {TABS[currentPage - 1]?.label}
              </div>

              <button
                type="button"
                className="cb-nav-btn"
                disabled={currentPage === TABS.length}
                onClick={() => switchPage(currentPage + 1)}
              >
                <span>Selanjutnya</span>
                <ChevronRight size={16} />
              </button>
            </footer>
          </div>
        </main>
      )}
    </div>
  );
}

export function CraftBookTemplate({ data, ...props }: TemplateProps) {
  return (
    <WeddingDataProvider data={data}>
      <CraftBookInner {...props} />
    </WeddingDataProvider>
  );
}

export default CraftBookTemplate;
