"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";
import { useScrollMotion } from "@/components/ScrollMotionContext";
import { FallingPaperPetals } from "@/components/FallingPaperPetals";
import { getFontFamilyCss } from "@/lib/typography";
import type { TemplateProps } from "@/templates/types";
import type { EventDetail, GroomBrideInfo } from "@/types/wedding";
import { KeepsakeGuestbook, KeepsakeGifts } from "./KeepsakeGuestbook";
import {
  createKeepsakeCalendar,
  getKeepsakeSchedule,
} from "./keepsakeCalendar";
import { triggerKeepsakeCelebration } from "./keepsakeCelebration";
import { KeepsakeCelebrationShower } from "./KeepsakeCelebrationShower";
import { KeepsakeSurrounds } from "./KeepsakeSurrounds";
import { KeepsakeCharMotion } from "./KeepsakeCharMotion";
import { bindKeepsakeScrollMotion } from "./keepsakeScrollMotion";
import "./paper-keepsake.css";

const ASSETS = "/images/paper-keepsake/";
const PK_SECTION_DURATION = 1.05;
const PK_ITEM_DURATION = 0.95;

function Ornament({
  name,
  className = "",
  animate = true,
}: {
  name: string;
  className?: string;
  animate?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const isCutePressedCorner = name === "botanical-corner";
  const isCutePressedCluster = name === "flower-cluster";
  const isCuteSilkBow = name === "ivory-bow";
  const isFloatingAccented =
    isCutePressedCluster || isCuteSilkBow || isCutePressedCorner;

  const src = isCutePressedCorner
    ? `${ASSETS}real-pressed-corner-cute.png`
    : isCutePressedCluster
      ? `${ASSETS}real-pressed-cluster-cute.png`
      : isCuteSilkBow
        ? `${ASSETS}real-cute-silk-bow.png`
        : `${ASSETS}${name}.svg`;

  if (shouldReduceMotion || !animate || !isFloatingAccented) {
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

  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      width="220"
      height="220"
      className={`pk-ornament ${className}`}
      loading="lazy"
      animate={{
        y: -3,
        rotate: 1.5,
      }}
      transition={{
        duration: isCuteSilkBow ? 8.5 : 10.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
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
      <motion.div
        className="pk-letter"
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
      >
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
            <KeepsakeCharMotion className="pk-letter-name" text={groom.name} baseDelay={0.35} />
            <span className="pk-letter-amp" aria-hidden="true">&amp;</span>
            <KeepsakeCharMotion className="pk-letter-name" text={bride.name} baseDelay={0.75} />
          </h1>
          <p>{data.events[0]?.displayDate}</p>
        </div>
        <div className="pk-letter-guest">
          <span>Kepada Yth.</span>
          <strong>
            <KeepsakeCharMotion
              text={guestName || "Bapak / Ibu / Saudara/i"}
              baseDelay={1.1}
            />
          </strong>
        </div>
        <motion.button
          type="button"
          className="pk-letter-seal"
          onClick={onOpen}
          disabled={leaving}
          aria-label="Buka segel lilin undangan pernikahan"
          title="Klik segel lilin untuk membuka undangan"
          whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
        </motion.button>
      </motion.div>
      <div className="pk-cover-action">
        <p>Sepucuk undangan untuk hari bahagia kami.</p>
        <motion.button
          type="button"
          className="pk-button pk-button-festive"
          onClick={onOpen}
          disabled={leaving}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Mail size={17} aria-hidden="true" />
          {leaving ? "Membuka undangan…" : "Buka undangan"}
        </motion.button>
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
        <motion.div
          className="pk-desktop-photo pk-photo-mount"
          data-pk-motion-zone
          whileHover={{ scale: 1.02, rotate: 0.5 }}
          transition={{ duration: 0.35 }}
        >
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
        </motion.div>
        <h2 className="pk-couple-name">
          <KeepsakeCharMotion text={data.couple.groom.name} baseDelay={0.35} />
          <em>&amp;</em>
          <KeepsakeCharMotion text={data.couple.bride.name} baseDelay={0.7} />
        </h2>
        <p>
          Sebuah awal baru.
          <br />
          Sebuah kenangan untuk kita simpan.
        </p>
        {!opened ? (
          <motion.button
            type="button"
            className="pk-text-button"
            onClick={onOpen}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.96 }}
          >
            Buka surat kami <ArrowRight size={17} aria-hidden="true" />
          </motion.button>
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
      <SectionMotion id="hero" className="pk-section pk-hero" duration={PK_SECTION_DURATION}>
        <KeepsakeSurrounds variant="hero" />
        <ItemMotion variant="frame-mount" delay={0.12} duration={PK_ITEM_DURATION}>
          <motion.div
            className="pk-hero-photo pk-photo-mount"
            data-pk-motion-zone
            whileHover={{ scale: 1.02, rotate: -0.5 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        </ItemMotion>
        <ItemMotion variant="slide-up" delay={0.24} duration={PK_ITEM_DURATION}>
          <h2 tabIndex={-1} className="pk-couple-name">
            <KeepsakeCharMotion text={data.couple.groom.name} baseDelay={0.3} />
            <em>&amp;</em>
            <KeepsakeCharMotion text={data.couple.bride.name} baseDelay={0.65} />
          </h2>
        </ItemMotion>
        <ItemMotion variant="pop" delay={0.36} duration={PK_ITEM_DURATION}>
          <p className="pk-date">
            {data.events[0]?.displayDay}, {data.events[0]?.displayDate}
          </p>
        </ItemMotion>
        <ItemMotion variant="fade" delay={0.46} duration={PK_ITEM_DURATION}>
          <motion.a
            href="#couple"
            className="pk-text-button"
            aria-label="Lanjut membaca tentang mempelai"
            whileHover={{ y: 2 }}
            whileTap={{ scale: 0.96 }}
          >
            Simpan hari ini bersama kami{" "}
            <ArrowDown size={16} aria-hidden="true" />
          </motion.a>
        </ItemMotion>
      </SectionMotion>
      <SectionMotion className="pk-section pk-intro" duration={PK_SECTION_DURATION}>
        <ItemMotion variant="pop" duration={PK_ITEM_DURATION}>
          <Ornament name="botanical-divider" className="pk-divider" />
        </ItemMotion>
        <ItemMotion variant="slide-down" delay={0.12} duration={PK_ITEM_DURATION}>
          <p className="pk-greeting">{data.general.openingGreetings}</p>
        </ItemMotion>
        <ItemMotion variant="fade" delay={0.22} duration={PK_ITEM_DURATION}>
          <p>{data.general.openingMessage}</p>
        </ItemMotion>
        {data.general.quote?.arabic && (
          <ItemMotion variant="card-lift" delay={0.3} duration={PK_ITEM_DURATION}>
            <p lang="ar" dir="rtl" className="pk-arabic">
              {data.general.quote.arabic}
            </p>
          </ItemMotion>
        )}
        {data.general.quote?.translation && (
          <ItemMotion variant="card-lift" delay={0.38} duration={PK_ITEM_DURATION}>
            <blockquote>
              “{data.general.quote.translation}”
              <cite>{data.general.quote.source}</cite>
            </blockquote>
          </ItemMotion>
        )}
      </SectionMotion>
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
    <ItemMotion
      variant={index === 0 ? "slide-left" : "slide-right"}
      delay={0.14 + index * 0.18}
      duration={PK_ITEM_DURATION}
      className={`pk-person pk-person-${index}`}
    >
      <motion.div
        className="pk-person-frame pk-photo-mount"
        whileHover={{ scale: 1.025, rotate: index === 0 ? -1.5 : 1.5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="pk-photo-matte">
          <Photo src={person.photoUrl} alt={person.fullName || person.name} />
        </div>
        <Ornament
          name={index ? "brass-clip" : "washi-tape"}
          className="pk-person-fastener"
        />
        <Ornament name="photo-corners" className="pk-photo-corners" />
      </motion.div>
      <div className="pk-person-copy">
        <span className="pk-person-role">{role}</span>
        <h3 className="pk-couple-name">
          <KeepsakeCharMotion text={person.name} baseDelay={0.3} />
        </h3>
        <p className="pk-full-name">{person.fullName}</p>
        {person.parents && <p className="pk-parents">{person.parents}</p>}
        {handle && (
          <motion.a
            href={socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pk-social"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            @{handle.includes("/") ? person.name : handle}
          </motion.a>
        )}
      </div>
    </ItemMotion>
  );
}

function KeepsakeCouple() {
  const { couple } = useWeddingData();
  return (
    <SectionMotion id="couple" className="pk-section pk-couple" duration={PK_SECTION_DURATION}>
      <ItemMotion variant="slide-down" duration={PK_ITEM_DURATION}>
        <h2>
          Dua nama,
          <br />
          <em>satu cerita.</em>
        </h2>
      </ItemMotion>
      <div className="pk-couple-grid">
        <Person person={couple.groom} role="Mempelai pria" index={0} />
        <ItemMotion variant="pop" delay={0.26} duration={PK_ITEM_DURATION} className="pk-between-wrapper flex items-center justify-center">
          <span className="pk-between" aria-hidden="true">
            &amp;
          </span>
        </ItemMotion>
        <Person person={couple.bride} role="Mempelai wanita" index={1} />
      </div>
      <ItemMotion variant="fade" delay={0.36} duration={PK_ITEM_DURATION} className="pk-couple-botanical-row">
        <motion.img
          src={`${ASSETS}real-pressed-wildflower.png`}
          alt=""
          aria-hidden="true"
          className="pk-couple-wildflower"
          width="110"
          height="150"
          loading="lazy"
          animate={{ y: -3.5, rotate: 1.8 }}
          transition={{ duration: 9.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <Ornament name="leaf-spray" className="pk-couple-leaf" />
      </ItemMotion>
    </SectionMotion>
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
    <SectionMotion id="event" className="pk-section pk-events" duration={PK_SECTION_DURATION}>
      <ItemMotion variant="pop" duration={PK_ITEM_DURATION}>
        <motion.img
          src={`${ASSETS}wedding-rings-closing-vignette.png`}
          alt=""
          aria-hidden="true"
          className="pk-rings-vignette"
          width="240"
          height="82"
          loading="lazy"
          animate={{ scale: 1.03 }}
          transition={{ duration: 7.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </ItemMotion>
      <ItemMotion variant="slide-down" delay={0.12} duration={PK_ITEM_DURATION}>
        <h2>
          Hari yang
          <br />
          <em>kami nantikan.</em>
        </h2>
      </ItemMotion>
      <div
        className="pk-countdown"
        aria-label="Hitung mundur menuju pernikahan"
      >
        {["Hari", "Jam", "Menit", "Detik"].map((label, index) => (
          <ItemMotion key={label} variant="pop" delay={0.18 + index * 0.08} duration={PK_ITEM_DURATION}>
            <motion.div
              whileHover={{ y: -3, scale: 1.04 }}
              transition={{ duration: 0.2 }}
            >
              <strong>
                {ticks ? String(ticks[index]).padStart(2, "0") : "—"}
              </strong>
              <span>{label}</span>
            </motion.div>
          </ItemMotion>
        ))}
      </div>
      {remaining === 0 && (
        <ItemMotion variant="fade" duration={PK_ITEM_DURATION}>
          <p className="pk-countdown-note">Hari yang dinanti telah tiba.</p>
        </ItemMotion>
      )}
      <div className="pk-agendas">
        {data.events.map((event, index) => (
          <ItemMotion
            key={event.id}
            variant="card-lift"
            delay={0.2 + index * 0.16}
            duration={PK_ITEM_DURATION}
            className="pk-agenda-wrapper"
          >
            <motion.article
              className="pk-agenda"
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
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
                  <motion.a
                    className="pk-button pk-button-outline"
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MapPin size={16} aria-hidden="true" />
                    Buka peta
                  </motion.a>
                )}
                {getKeepsakeSchedule(event) && (
                  <motion.button
                    type="button"
                    className="pk-button pk-button-outline"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      downloadCalendar(
                        event,
                        `${data.couple.groom.name} & ${data.couple.bride.name}`,
                      )
                    }
                  >
                    <CalendarDays size={16} aria-hidden="true" />
                    Simpan tanggal
                  </motion.button>
                )}
              </div>
            </motion.article>
          </ItemMotion>
        ))}
      </div>
      {data.dresscode?.description && (
        <ItemMotion variant="slide-up" delay={0.26} duration={PK_ITEM_DURATION} className="pk-dresscode">
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
        </ItemMotion>
      )}
    </SectionMotion>
  );
}

function KeepsakeStory() {
  const { stories } = useWeddingData();
  if (!stories.length) return null;
  return (
    <SectionMotion id="story" className="pk-section pk-story" duration={PK_SECTION_DURATION}>
      <KeepsakeSurrounds variant="story" />
      <Ornament name="postal-mark" className="pk-postmark" />
      <ItemMotion variant="stamp" delay={0.1} duration={PK_ITEM_DURATION}>
        <div className="pk-story-specimen">
          <motion.img
            src={`${ASSETS}real-pressed-lavender-card.png`}
            alt=""
            aria-hidden="true"
            className="pk-specimen-card"
            loading="lazy"
            width="260"
            height="320"
            whileHover={{ rotate: 1.5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </ItemMotion>
      <ItemMotion variant="slide-down" delay={0.16} duration={PK_ITEM_DURATION}>
        <h2>
          Halaman
          <br />
          <em>cerita kami.</em>
        </h2>
      </ItemMotion>
      <ol>
        {stories.map((story, index) => (
          <ItemMotion
            key={`${story.year}-${index}`}
            variant={index % 2 === 0 ? "slide-left" : "slide-right"}
            delay={0.22 + index * 0.12}
            duration={PK_ITEM_DURATION}
          >
            <motion.li
              whileHover={{ x: index % 2 === 0 ? 4 : -4 }}
              transition={{ duration: 0.2 }}
            >
              <time>{story.year}</time>
              <div>
                <h3>{story.title}</h3>
                <p>{story.story}</p>
              </div>
            </motion.li>
          </ItemMotion>
        ))}
      </ol>
    </SectionMotion>
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
    <SectionMotion id="gallery" className="pk-section pk-gallery" duration={PK_SECTION_DURATION}>
      <ItemMotion variant="slide-down" duration={PK_ITEM_DURATION}>
        <h2>
          Yang ingin
          <br />
          <em>kami kenang.</em>
        </h2>
        <p>Beberapa potong cerita, sebelum halaman baru dimulai.</p>
      </ItemMotion>
      <div className="pk-gallery-grid">
        {photos.map((item, index) => (
          <ItemMotion
            key={item.id}
            variant="card-lift"
            delay={0.12 + (index % 4) * 0.1}
            duration={PK_ITEM_DURATION}
          >
            <motion.figure
              className="pk-gallery-frame"
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ duration: 0.25 }}
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
            </motion.figure>
          </ItemMotion>
        ))}
      </div>
      <ItemMotion variant="pop" delay={0.28} duration={PK_ITEM_DURATION}>
        <Ornament name="botanical-divider" className="pk-divider" />
      </ItemMotion>
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
    </SectionMotion>
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
  const [celebrationActive, setCelebrationActive] = useState(false);
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
  const scrollMotion = useScrollMotion();
  useEffect(() => {
    if (!opened || !root.current || motionDisabled || scrollMotion) return;
    return bindKeepsakeScrollMotion(root.current);
  }, [opened, motionDisabled, scrollMotion]);
  const open = () => {
    if (leaving || opened) return;
    triggerKeepsakeCelebration(Boolean(reduced));
    setCelebrationActive(true);
    setLeaving(true);
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
      reduced ? 0 : 950,
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
        {opened && !motionDisabled && (
          <FallingPaperPetals />
        )}
        <KeepsakeCelebrationShower
          active={celebrationActive}
          reduced={Boolean(reduced)}
          durationMs={9500}
        />
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="cover"
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 0.98,
                y: -16,
                transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
              }}
              className="pk-cover-wrapper contents"
            >
              <Cover guestName={guestName} onOpen={open} leaving={leaving} />
            </motion.div>
          ) : (
            <motion.div
              key="pages"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="pk-pages"
            >
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
              <SectionMotion
                id="closing"
                className="pk-section pk-closing"
                duration={PK_SECTION_DURATION}
              >
                <KeepsakeSurrounds variant="closing" />
                <ItemMotion variant="stamp" delay={0.12} duration={PK_ITEM_DURATION}>
                  <motion.img
                    src={`${ASSETS}real-gold-wax-seal.png`}
                    alt=""
                    aria-hidden="true"
                    className="pk-closing-gold-seal"
                    width="84"
                    height="84"
                    whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                    transition={{ duration: 0.35 }}
                  />
                </ItemMotion>
                <ItemMotion variant="fade" delay={0.2} duration={PK_ITEM_DURATION}>
                  <p>{data.general.closingMessage}</p>
                </ItemMotion>
                <ItemMotion variant="slide-up" delay={0.3} duration={PK_ITEM_DURATION}>
                  <h2 className="pk-couple-name">
                    <KeepsakeCharMotion text={data.couple.groom.name} baseDelay={0.35} />
                    <em>&amp;</em>
                    <KeepsakeCharMotion text={data.couple.bride.name} baseDelay={0.7} />
                  </h2>
                </ItemMotion>
                <ItemMotion variant="pop" delay={0.38} duration={PK_ITEM_DURATION}>
                  <span>{data.general.hashtag}</span>
                </ItemMotion>
                <Ornament name="botanical-corner" className="pk-closing-flower" />
                <p className="pk-colophon">
                  Paper Keepsake · Sebuah kenangan bersama.
                </p>
              </SectionMotion>
            </motion.div>
          )}
        </AnimatePresence>
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
