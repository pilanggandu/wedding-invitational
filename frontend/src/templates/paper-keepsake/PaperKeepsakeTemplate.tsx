"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Images,
  Mail,
  MapPin,
  Pause,
  Play,
  Users,
  X,
} from "lucide-react";
import {
  WeddingDataProvider,
  useWeddingData,
} from "@/context/WeddingDataContext";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getFontFamilyCss } from "@/lib/typography";
import type { TemplateProps } from "@/templates/types";
import type { EventDetail, GroomBrideInfo } from "@/types/wedding";
import { KeepsakeGuestbook, KeepsakeGifts } from "./KeepsakeGuestbook";
import {
  createKeepsakeCalendar,
  getKeepsakeSchedule,
} from "./keepsakeCalendar";
import { KeepsakeSurrounds } from "./KeepsakeSurrounds";
import { KeepsakeCharMotion } from "./KeepsakeCharMotion";
import { bindKeepsakeScrollMotion } from "./keepsakeScrollMotion";
import "./paper-keepsake.css";

const ASSETS = "/images/paper-keepsake/";

function Ornament({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const isCutePressedCorner = name === "botanical-corner";
  const isCutePressedCluster = name === "flower-cluster";
  const isCuteSilkBow = name === "ivory-bow";
  const src = isCutePressedCorner
    ? `${ASSETS}real-pressed-corner-cute.png`
    : isCutePressedCluster
      ? `${ASSETS}real-pressed-cluster-cute.png`
      : isCuteSilkBow
        ? `${ASSETS}real-cute-silk-bow.png`
        : `${ASSETS}${name}.svg`;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width="220"
      height="220"
      className={`pk-ornament ${className}`}
      loading="lazy"
    />
  );
}

function Photo({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return src && src !== failedSource ? (
    <img
      src={src}
      alt={alt}
      className={`pk-photo ${className}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      width="640"
      height="800"
      onError={() => setFailedSource(src)}
    />
  ) : (
    <div
      className={`pk-photo-placeholder ${className}`}
      role="img"
      aria-label={alt}
    >
      <Heart size={30} strokeWidth={1} aria-hidden="true" />
      <span>{alt}</span>
    </div>
  );
}

function Cover({
  guestName,
  onOpen,
  leaving,
}: {
  guestName?: string;
  onOpen: () => void;
  leaving: boolean;
}) {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  return (
    <section
      className={`pk-cover ${leaving ? "pk-cover--opening" : ""}`}
      aria-label="Sampul undangan"
      data-pk-motion-zone
    >
      <KeepsakeSurrounds variant="cover" />
      <div className="pk-letter">
        <img
          className="pk-letter-art"
          src={`${ASSETS}hero-paper-keepsake.png`}
          alt=""
          aria-hidden="true"
          width="1122"
          height="1402"
          fetchPriority="high"
        />
        <div className="pk-letter-names">
          <h1>
            <KeepsakeCharMotion text={groom.name} baseDelay={0.2} />
            <span>&amp;</span>
            <KeepsakeCharMotion text={bride.name} baseDelay={0.5} />
          </h1>
          <p>{data.events[0]?.displayDate}</p>
        </div>
        <div className="pk-letter-guest">
          <span>Kepada Yth.</span>
          <strong>
            <KeepsakeCharMotion
              text={guestName || "Bapak / Ibu / Saudara/i"}
              baseDelay={0.7}
            />
          </strong>
        </div>
        <button
          type="button"
          className="pk-letter-seal"
          onClick={onOpen}
          disabled={leaving}
          aria-label="Buka segel lilin undangan pernikahan"
          title="Klik segel lilin untuk membuka undangan"
        >
          <img
            src={`${ASSETS}wax-seal-authentic.png`}
            alt=""
            aria-hidden="true"
            className="pk-letter-seal-img"
            width="60"
            height="60"
          />
          <span className="pk-seal-monogram">
            {groom.name.charAt(0)}
            {bride.name.charAt(0)}
          </span>
          <span className="pk-seal-shine" aria-hidden="true" />
        </button>
      </div>
      <div className="pk-cover-action">
        <p>Sepucuk undangan untuk hari bahagia kami.</p>
        <button
          type="button"
          className="pk-button pk-button-festive"
          onClick={onOpen}
          disabled={leaving}
        >
          <Mail size={17} aria-hidden="true" />
          {leaving ? "Membuka undangan…" : "Buka undangan"}
        </button>
        <small>Dengan senang hati, kami menantikan kehadiranmu.</small>
      </div>
    </section>
  );
}

function KeepsakeDesktop({
  opened,
  onOpen,
}: {
  opened: boolean;
  onOpen: () => void;
}) {
  const data = useWeddingData();
  return (
    <aside className="pk-desktop" aria-label="Undangan pernikahan">
      <KeepsakeSurrounds variant="desktop" />
      <div className="pk-desktop-inner">
        <span className="pk-desktop-date">
          {data.events[0]?.displayDay}
          {data.events[0]?.displayDay ? ", " : ""}
          {data.events[0]?.displayDate}
        </span>
        <div className="pk-desktop-photo pk-photo-mount" data-pk-motion-zone>
          <div className="pk-photo-tape" aria-hidden="true" />
          <div className="pk-photo-matte">
            <Photo
              src={data.general.coverPhotoUrl || data.general.heroPhotoUrl}
              alt={`${data.couple.groom.name} dan ${data.couple.bride.name}`}
              eager
            />
          </div>
          <Ornament name="botanical-corner" className="pk-desktop-botanical" />
          <Ornament name="ivory-bow" className="pk-desktop-bow" />
        </div>
        <h2 className="pk-couple-name">
          <KeepsakeCharMotion text={data.couple.groom.name} baseDelay={0.3} />
          <em>&amp;</em>
          <KeepsakeCharMotion text={data.couple.bride.name} baseDelay={0.6} />
        </h2>
        <p>
          Sebuah awal baru.
          <br />
          Sebuah kenangan untuk kita simpan.
        </p>
        {!opened ? (
          <button type="button" className="pk-text-button" onClick={onOpen}>
            Buka surat kami <ArrowRight size={17} aria-hidden="true" />
          </button>
        ) : (
          <span className="pk-desktop-scroll">
            Gulir untuk membaca undangan{" "}
            <ArrowDown size={15} aria-hidden="true" />
          </span>
        )}
        <span className="pk-desktop-signature">{data.general.hashtag}</span>
      </div>
    </aside>
  );
}

function KeepsakeHero() {
  const data = useWeddingData();
  return (
    <>
      <section id="hero" className="pk-section pk-hero" data-pk-reveal>
        <KeepsakeSurrounds variant="hero" />
        <div className="pk-hero-photo pk-photo-mount" data-pk-motion-zone>
          <div className="pk-photo-tape" aria-hidden="true" />
          <div className="pk-photo-matte">
            <Photo
              src={data.general.heroPhotoUrl || data.general.coverPhotoUrl}
              alt={`${data.couple.groom.name} dan ${data.couple.bride.name}`}
              eager
            />
          </div>
          <Ornament name="washi-tape" className="pk-tape" />
          <Ornament name="flower-cluster" className="pk-hero-flower" />
        </div>
        <h2 tabIndex={-1} className="pk-couple-name">
          <KeepsakeCharMotion text={data.couple.groom.name} baseDelay={0.2} />
          <em>&amp;</em>
          <KeepsakeCharMotion text={data.couple.bride.name} baseDelay={0.5} />
        </h2>
        <p className="pk-date">
          {data.events[0]?.displayDay}, {data.events[0]?.displayDate}
        </p>
        <a
          href="#couple"
          className="pk-text-button"
          aria-label="Lanjut membaca tentang mempelai"
        >
          Simpan hari ini bersama kami{" "}
          <ArrowDown size={16} aria-hidden="true" />
        </a>
      </section>
      <section className="pk-section pk-intro" data-pk-reveal>
        <Ornament name="botanical-divider" className="pk-divider" />
        <p className="pk-greeting">{data.general.openingGreetings}</p>
        <p>{data.general.openingMessage}</p>
        {data.general.quote?.arabic && (
          <p lang="ar" dir="rtl" className="pk-arabic">
            {data.general.quote.arabic}
          </p>
        )}
        {data.general.quote?.translation && (
          <blockquote>
            “{data.general.quote.translation}”
            <cite>{data.general.quote.source}</cite>
          </blockquote>
        )}
      </section>
    </>
  );
}

function Person({
  person,
  role,
  index,
}: {
  person: GroomBrideInfo;
  role: string;
  index: number;
}) {
  const handle = person.instagram?.replace(/^@/, "");
  const socialUrl = person.instagram?.startsWith("https://")
    ? person.instagram
    : `https://www.instagram.com/${encodeURIComponent(handle || "")}/`;
  return (
    <article className={`pk-person pk-person-${index}`} data-pk-reveal>
      <div className="pk-person-frame pk-photo-mount">
        <div className="pk-photo-matte">
          <Photo src={person.photoUrl} alt={person.fullName || person.name} />
        </div>
        <Ornament
          name={index ? "brass-clip" : "washi-tape"}
          className="pk-person-fastener"
        />
        <Ornament name="photo-corners" className="pk-photo-corners" />
      </div>
      <div className="pk-person-copy">
        <span className="pk-person-role">{role}</span>
        <h3 className="pk-couple-name">
          <KeepsakeCharMotion text={person.name} baseDelay={0.2} />
        </h3>
        <p className="pk-full-name">{person.fullName}</p>
        {person.parents && <p className="pk-parents">{person.parents}</p>}
        {handle && (
          <a
            href={socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pk-social"
          >
            @{handle.includes("/") ? person.name : handle}
          </a>
        )}
      </div>
    </article>
  );
}

function KeepsakeCouple() {
  const { couple } = useWeddingData();
  return (
    <section id="couple" className="pk-section pk-couple">
      <h2 data-pk-reveal>
        Dua nama,
        <br />
        <em>satu cerita.</em>
      </h2>
      <div className="pk-couple-grid">
        <Person person={couple.groom} role="Mempelai pria" index={0} />
        <span className="pk-between" aria-hidden="true">
          &amp;
        </span>
        <Person person={couple.bride} role="Mempelai wanita" index={1} />
      </div>
      <div className="pk-couple-botanical-row" data-pk-reveal>
        <img
          src={`${ASSETS}real-pressed-wildflower.png`}
          alt=""
          aria-hidden="true"
          className="pk-couple-wildflower"
          width="110"
          height="150"
          loading="lazy"
        />
        <Ornament name="leaf-spray" className="pk-couple-leaf" />
      </div>
    </section>
  );
}

function downloadCalendar(event: EventDetail, coupleNames: string) {
  const contents = createKeepsakeCalendar(event, coupleNames);
  if (!contents) return;
  const url = URL.createObjectURL(
    new Blob([contents], { type: "text/calendar;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `paper-keepsake-${event.id}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function KeepsakeEvents() {
  const data = useWeddingData();
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(data.countdownTarget).getTime();
    if (Number.isNaN(target)) return;
    const update = () => setRemaining(Math.max(0, target - Date.now()));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [data.countdownTarget]);
  const ticks =
    remaining === null
      ? null
      : [
          Math.floor(remaining / 86400000),
          Math.floor(remaining / 3600000) % 24,
          Math.floor(remaining / 60000) % 60,
          Math.floor(remaining / 1000) % 60,
        ];
  return (
    <section id="event" className="pk-section pk-events">
      <img
        src={`${ASSETS}wedding-rings-closing-vignette.png`}
        alt=""
        aria-hidden="true"
        className="pk-rings-vignette"
        width="240"
        height="82"
        loading="lazy"
      />
      <h2 data-pk-reveal>
        Hari yang
        <br />
        <em>kami nantikan.</em>
      </h2>
      <div
        className="pk-countdown"
        aria-label="Hitung mundur menuju pernikahan"
      >
        {["Hari", "Jam", "Menit", "Detik"].map((label, index) => (
          <div key={label}>
            <strong>
              {ticks ? String(ticks[index]).padStart(2, "0") : "—"}
            </strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {remaining === 0 && (
        <p className="pk-countdown-note">Hari yang dinanti telah tiba.</p>
      )}
      <div className="pk-agendas">
        {data.events.map((event, index) => (
          <article
            key={event.id}
            className="pk-agenda"
            data-pk-reveal
            style={{ "--pk-delay": `${index * 80}ms` } as React.CSSProperties}
          >
            <h3>{event.title}</h3>
            <p className="pk-event-date">
              {event.displayDay}
              <strong>{event.displayDate}</strong>
            </p>
            <p className="pk-event-time">{event.time}</p>
            <div className="pk-perforation" />
            <h4>{event.venueName}</h4>
            <p className="pk-address">{event.venueAddress}</p>
            <div className="pk-actions">
              {event.mapUrl && /^https?:\/\//i.test(event.mapUrl) && (
                <a
                  className="pk-button pk-button-outline"
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin size={16} aria-hidden="true" />
                  Buka peta
                </a>
              )}
              {getKeepsakeSchedule(event) && (
                <button
                  type="button"
                  className="pk-button pk-button-outline"
                  onClick={() =>
                    downloadCalendar(
                      event,
                      `${data.couple.groom.name} & ${data.couple.bride.name}`,
                    )
                  }
                >
                  <CalendarDays size={16} aria-hidden="true" />
                  Simpan tanggal
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {data.dresscode?.description && (
        <div className="pk-dresscode">
          <h3>Pilihan busana</h3>
          <p>{data.dresscode.description}</p>
          <div>
            {data.dresscode.colors.map((color) => (
              <span key={color.name}>
                <i
                  style={{
                    background: /^#[0-9a-f]{3,8}$/i.test(color.hex)
                      ? color.hex
                      : "#D9CBB7",
                  }}
                />
                {color.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function KeepsakeStory() {
  const { stories } = useWeddingData();
  if (!stories.length) return null;
  return (
    <section id="story" className="pk-section pk-story">
      <KeepsakeSurrounds variant="story" />
      <Ornament name="postal-mark" className="pk-postmark" />
      <div className="pk-story-specimen" data-pk-reveal>
        <img
          src={`${ASSETS}real-pressed-lavender-card.png`}
          alt=""
          aria-hidden="true"
          className="pk-specimen-card"
          loading="lazy"
          width="260"
          height="320"
        />
      </div>
      <h2 data-pk-reveal>
        Halaman
        <br />
        <em>cerita kami.</em>
      </h2>
      <ol>
        {stories.map((story, index) => (
          <li key={`${story.year}-${index}`} data-pk-reveal>
            <time>{story.year}</time>
            <div>
              <h3>{story.title}</h3>
              <p>{story.story}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function KeepsakeGallery() {
  const data = useWeddingData();
  const photos = data.gallery
    .map((photo, index) => ({
      ...photo,
      imageUrl: photo.imageUrl || data.general.preweddingPhotos?.[index],
    }))
    .filter((photo) => Boolean(photo.imageUrl));
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const photo = photos[active];
  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);
  const openPhoto = (index: number, trigger: HTMLButtonElement) => {
    setActive(index);
    opener.current = trigger;
    dialog.current?.showModal();
    setLightboxOpen(true);
  };
  const close = () => {
    dialog.current?.close();
  };
  const restore = () => {
    setLightboxOpen(false);
    opener.current?.focus();
  };
  const step = (direction: number) =>
    setActive((index) => (index + direction + photos.length) % photos.length);
  if (!photos.length) return null;
  return (
    <section id="gallery" className="pk-section pk-gallery">
      <h2 data-pk-reveal>
        Yang ingin
        <br />
        <em>kami kenang.</em>
      </h2>
      <p>Beberapa potong cerita, sebelum halaman baru dimulai.</p>
      <div className="pk-gallery-grid">
        {photos.map((item, index) => (
          <figure
            className="pk-gallery-frame"
            key={item.id}
            data-pk-reveal
            style={
              { "--pk-delay": `${(index % 2) * 90}ms` } as React.CSSProperties
            }
          >
            <button
              type="button"
              onClick={(event) => openPhoto(index, event.currentTarget)}
              aria-label={`Perbesar foto: ${item.caption}`}
            >
              <Photo src={item.imageUrl} alt={item.caption} />
              <span className="pk-photo-hint">
                <Images size={16} aria-hidden="true" />
                Lihat foto
              </span>
            </button>
            <figcaption>{item.caption}</figcaption>
            {index === 0 && (
              <Ornament name="brass-clip" className="pk-gallery-clip" />
            )}
          </figure>
        ))}
      </div>
      <Ornament name="botanical-divider" className="pk-divider" />
      <dialog
        ref={dialog}
        className="pk-lightbox"
        aria-label="Galeri foto pernikahan"
        onClose={restore}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        <div className="pk-lightbox-inner">
          <button
            type="button"
            className="pk-lightbox-close pk-icon-button"
            aria-label="Tutup foto"
            onClick={close}
          >
            <X />
          </button>
          {photo && (
            <>
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                width="1200"
                height="1600"
              />
              <div className="pk-lightbox-caption">
                <button
                  type="button"
                  className="pk-icon-button"
                  onClick={() => step(-1)}
                  disabled={photos.length < 2}
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft />
                </button>
                <p aria-live="polite">
                  {photo.caption}
                  <small>
                    {active + 1} / {photos.length}
                  </small>
                </p>
                <button
                  type="button"
                  className="pk-icon-button"
                  onClick={() => step(1)}
                  disabled={photos.length < 2}
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight />
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </section>
  );
}

const NAV_ITEMS = [
  { id: "hero", label: "Beranda", icon: Mail },
  { id: "couple", label: "Mempelai", icon: Users },
  { id: "event", label: "Acara", icon: CalendarDays },
  { id: "gallery", label: "Foto", icon: Images },
  { id: "gift", label: "Hadiah", icon: Heart },
  { id: "rsvp", label: "RSVP", icon: Check },
];

function KeepsakeNavigation({
  root,
}: {
  root: React.RefObject<HTMLDivElement | null>;
}) {
  const [active, setActive] = useState("hero");
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -35% 0px", threshold: [0, 0.15, 0.4] },
    );
    NAV_ITEMS.forEach((item) => {
      const section = root.current?.querySelector(`#${item.id}`);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [root]);
  return (
    <nav className="pk-navigation" aria-label="Bagian undangan">
      {NAV_ITEMS.map((item) => (
        <a
          href={`#${item.id}`}
          key={item.id}
          aria-current={active === item.id ? "location" : undefined}
          onClick={(event) => {
            const section = root.current?.querySelector(`#${item.id}`);
            if (section) {
              event.preventDefault();
              section.scrollIntoView({
                behavior: reduced ? "instant" : "smooth",
                block: "start",
              });
              setActive(item.id);
            }
          }}
        >
          <item.icon size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function KeepsakeContent({
  guestName,
  guestItem,
  isPreview = false,
  isEditor = false,
  onOpenChange,
}: Omit<TemplateProps, "data">) {
  const data = useWeddingData();
  const [hasOpened, setHasOpened] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  const opened = isEditor || hasOpened;
  const motionDisabled =
    Boolean(reduced) ||
    motionPaused ||
    data.themePalette?.particlesEnabled === false;
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const zones = element.querySelectorAll<HTMLElement>("[data-pk-motion-zone]");
    const visibleZones = new Set<Element>();
    const updateVisibility = () => {
      zones.forEach((zone) => {
        zone.dataset.pkMoving = String(
          !document.hidden && visibleZones.has(zone),
        );
      });
    };
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleZones.add(entry.target);
        else visibleZones.delete(entry.target);
      });
      updateVisibility();
    });
    zones.forEach((zone) => observer.observe(zone));
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [opened]);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  useEffect(() => {
    if (!opened || !root.current || motionDisabled) return;
    return bindKeepsakeScrollMotion(root.current);
  }, [opened, motionDisabled]);
  const open = () => {
    if (leaving || opened) return;
    const letter = root.current?.querySelector<HTMLElement>(".pk-letter");
    if (letter && !reduced) {
      const { transform, opacity } = getComputedStyle(letter);
      letter.style.animation = "none";
      letter.style.transform = transform;
      letter.style.opacity = opacity;
      void letter.offsetWidth;
    }
    setLeaving(true);
    if (letter && !reduced) {
      requestAnimationFrame(() => {
        letter.style.removeProperty("transform");
        letter.style.removeProperty("opacity");
      });
    }
    timeout.current = setTimeout(
      () => {
        setHasOpened(true);
        setLeaving(false);
        onOpenChange?.(true);
        requestAnimationFrame(() =>
          root.current
            ?.querySelector<HTMLElement>("#hero h2")
            ?.focus({ preventScroll: true }),
        );
      },
      reduced ? 0 : 650,
    );
  };
  return (
    <div
      ref={root}
      className={`pk-root ${isPreview ? "pk-preview" : ""} ${opened ? "pk-opened" : ""} ${motionDisabled ? "pk-still" : ""}`}
      style={
        {
          "--pk-couple-font": getFontFamilyCss(data.themePalette?.fontStyle),
          "--pk-primary": data.themePalette?.primaryColor || "#541e24",
          "--pk-taupe": data.themePalette?.primaryColor || "#541e24",
        } as React.CSSProperties
      }
    >
      {!isPreview && <KeepsakeDesktop opened={opened} onOpen={open} />}
      <main className="pk-page">
        <header className="pk-masthead">
          <span>
            {data.couple.groom.name.charAt(0)} <i>&amp;</i>{" "}
            {data.couple.bride.name.charAt(0)}
          </span>
          <span>Undangan pernikahan</span>
          <div className="pk-masthead-actions">
            {!reduced && data.themePalette?.particlesEnabled !== false && (
              <button
                type="button"
                className="pk-motion-toggle"
                onClick={() => setMotionPaused((paused) => !paused)}
                aria-label="Jeda animasi dekorasi"
                aria-pressed={motionPaused}
                title={
                  motionPaused
                    ? "Putar animasi dekorasi"
                    : "Jeda animasi dekorasi"
                }
              >
                {motionPaused ? (
                  <Play size={15} aria-hidden="true" />
                ) : (
                  <Pause size={15} aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </header>
        {!opened ? (
          <Cover guestName={guestName} onOpen={open} leaving={leaving} />
        ) : (
          <div className="pk-pages">
            <KeepsakeHero />
            <KeepsakeCouple />
            <KeepsakeEvents />
            <KeepsakeStory />
            <KeepsakeGallery />
            <KeepsakeGifts />
            <KeepsakeGuestbook
              guestName={guestName}
              guestItem={guestItem}
              isPreview={isPreview}
              isEditor={isEditor}
            />
            <footer
              id="closing"
              className="pk-section pk-closing"
              data-pk-reveal
            >
              <KeepsakeSurrounds variant="closing" />
                <img
                  src={`${ASSETS}real-gold-wax-seal.png`}
                  alt=""
                  aria-hidden="true"
                  className="pk-closing-gold-seal"
                  width="84"
                  height="84"
                />
              <p>{data.general.closingMessage}</p>
              <h2 className="pk-couple-name">
                <KeepsakeCharMotion text={data.couple.groom.name} baseDelay={0.2} />
                <em>&amp;</em>
                <KeepsakeCharMotion text={data.couple.bride.name} baseDelay={0.5} />
              </h2>
              <span>{data.general.hashtag}</span>
              <Ornament name="botanical-corner" className="pk-closing-flower" />
              <p className="pk-colophon">
                Paper Keepsake · Sebuah kenangan bersama.
              </p>
            </footer>
          </div>
        )}
      </main>
      {opened && !isEditor && <KeepsakeNavigation root={root} />}
      {opened && !isEditor && (
        <div className="pk-audio">
          <AudioPlayer
            autoPlayTrigger={Boolean(data.themePalette?.musicAutoplay)}
          />
        </div>
      )}
    </div>
  );
}

export function PaperKeepsakeTemplate({ data, ...props }: TemplateProps) {
  return (
    <WeddingDataProvider data={data}>
      <KeepsakeContent {...props} />
    </WeddingDataProvider>
  );
}

export default PaperKeepsakeTemplate;
