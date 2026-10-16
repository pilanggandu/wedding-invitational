"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  CreditCard,
  Copy,
  Check,
  Send,
  Download,
  ExternalLink,
  ZoomIn,
  X,
  MessageSquare,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { TemplateProps } from "@/templates/types";
import { WishMessage } from "@/types/wedding";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { submitRsvpApi } from "@/lib/api";
import { DesktopLeftShowcase } from "@/components/DesktopLeftShowcase";
import { EnvelopeCover } from "@/components/EnvelopeCover";
import { NavigationDock } from "@/components/NavigationDock";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getFontFamilyCss } from "@/lib/typography";
import {
  SketchbookSpiralBinding,
  BotanicalBranchSvg,
  CrayonUnderlineSvg,
} from "./SketchbookDecorations";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function BotanicalSprigOrnament({
  className = "",
  position = "bottom-left",
  delay = 0.05,
}: {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  const getRotation = () => {
    switch (position) {
      case "top-left":
        return { start: -24, end: -15 };
      case "top-right":
        return { start: 16, end: 24 };
      case "bottom-left":
        return { start: -10, end: -2 };
      case "bottom-right":
      default:
        return { start: 8, end: 16 };
    }
  };

  const rot = getRotation();

  return (
    <motion.img
      src="/images/paper-art/botanical-corner-sprig.png"
      alt="Botanical Sprig"
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 10, rotate: rot.start, scale: 0.94 }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, rotate: rot.end, scale: 1 }
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.45,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      className={`pointer-events-none select-none drop-shadow-xs ${className}`}
    />
  );
}

function BotanicalSectionDivider() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex items-center justify-center my-6 px-8 select-none">
      <div className="h-px flex-1 bg-[#7D1128]/20 border-t border-dashed border-[#7D1128]/35" />
      <motion.img
        src="/images/paper-art/botanical-corner-sprig.png"
        alt="Botanical Divider"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9, y: 6 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.95, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.25, 1, 0.5, 1] }}
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-2 pointer-events-none drop-shadow-2xs rotate-45"
      />
      <div className="h-px flex-1 bg-[#7D1128]/20 border-t border-dashed border-[#7D1128]/35" />
    </div>
  );
}

function SketchbookHero() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const mainEvent = data.events?.[0];
  const dateStr = mainEvent?.displayDate || "21 November 2026";
  const dayStr = mainEvent?.displayDay || "Sabtu";

  const groomInitial = groom.name ? groom.name.trim().charAt(0).toUpperCase() : "G";
  const brideInitial = bride.name ? bride.name.trim().charAt(0).toUpperCase() : "B";
  const coupleMonogram = `${groomInitial}${brideInitial}`;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(
      data.countdownTarget || "2026-11-21T08:00:00+07:00"
    ).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data.countdownTarget]);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Pernikahan ${groom.name} & ${bride.name}`
  )}&dates=20261121T010000Z/20261121T080000Z&details=${encodeURIComponent(
    `Buku Sketsa Pernikahan: ${groom.fullName} & ${bride.fullName}`
  )}&location=${encodeURIComponent(mainEvent?.venueAddress || "")}`;

  const downloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//The Wedding of ${groom.name} & ${bride.name}//ID`,
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:Pernikahan ${groom.name} & ${bride.name}`,
      `DESCRIPTION:Undangan Pernikahan ${groom.fullName} & ${bride.fullName}`,
      `LOCATION:${mainEvent?.venueAddress || ""}`,
      "DTSTART:20261121T010000Z",
      "DTEND:20261121T080000Z",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Sketchbook-Wedding-${groom.name}-${bride.name}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="hero" className="relative pt-6 pb-12 px-5 text-center text-[#2C1810]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="relative bg-[#FFFDF8] rounded-2xl p-6 sm:p-8 border-2 border-dashed border-[#7D1128]/35 shadow-[0_8px_24px_rgba(125,17,40,0.08)]">
          <img
            src="/images/paper-art/paperclip-washi-accent.png"
            alt="Paperclip Washi Accent"
            className="absolute -top-7 -right-3 w-16 sm:w-20 pointer-events-none drop-shadow-md select-none z-20 rotate-[6deg]"
          />

          <BotanicalSprigOrnament
            position="bottom-left"
            className="absolute -bottom-6 -left-4 w-20 sm:w-24 z-20"
          />

          <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center mb-2 select-none">
            <img
              src="/images/paper-art/botanical-monogram-wreath.png"
              alt="Botanical Monogram Wreath"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-xs select-none"
            />
            <span
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-2xl sm:text-3xl font-bold text-[#7D1128] tracking-widest z-10 select-none pl-1"
            >
              {coupleMonogram}
            </span>
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7D1128] block font-bold mb-1">
            Buku Catatan Pernikahan
          </span>

          <h1
            style={{ fontFamily: "var(--font-couple-custom, serif)" }}
            className="text-3xl sm:text-4xl font-bold text-[#7D1128] tracking-tight my-1"
          >
            {groom.name} &amp; {bride.name}
          </h1>

          <div className="flex justify-center my-1.5">
            <CrayonUnderlineSvg className="w-36 h-3" color="#7D1128" />
          </div>

          <p className="text-xs font-serif italic text-[#6B4B3E] mt-2">
            {dayStr}, {dateStr}
          </p>

          {data.general?.quote && (
            <div className="mt-5 pt-4 border-t border-[#7D1128]/20 space-y-2">
              {data.general.quote.arabic && (
                <p className="font-serif text-sm text-[#7D1128] leading-loose dir-rtl">
                  {data.general.quote.arabic}
                </p>
              )}
              <p className="text-[11px] font-sans italic text-[#5C3A2E] leading-relaxed">
                &ldquo;{data.general.quote.translation}&rdquo;
              </p>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C6D60] block">
                {data.general.quote.source}
              </span>
            </div>
          )}
        </div>

        <div className="bg-[#FFFDF8] rounded-2xl p-5 border-2 border-dashed border-[#7D1128]/30 shadow-sm space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-[#7D1128]/15 pb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7D1128] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7D1128]" />
              Catatan Hitung Mundur
            </span>
            <span className="text-[9px] font-mono text-[#8C6D60]">WAKTU TERSISA</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            {[
              { label: "Hari", val: timeLeft.days },
              { label: "Jam", val: timeLeft.hours },
              { label: "Menit", val: timeLeft.minutes },
              { label: "Detik", val: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF3EA] p-2.5 rounded-xl border border-[#7D1128]/20 shadow-2xs"
              >
                <span className="text-xl sm:text-2xl font-bold text-[#7D1128] block">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-[#6B4B3E] font-bold block mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-[#7D1128]/15">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#7D1128] hover:bg-[#600C1E] text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Calendar</span>
            </a>
            <button
              onClick={downloadIcs}
              className="px-3.5 py-2 rounded-xl bg-[#FAF3EA] hover:bg-[#F2E7D9] text-[#7D1128] border border-[#7D1128]/30 text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan (.ics)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SketchbookCouple() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <section id="couple" className="relative py-12 px-5 text-[#2C1810]">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-1 relative">
          <div className="flex justify-center mb-1">
            <BotanicalBranchSvg className="w-24 h-6 text-[#7D1128]" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7D1128] block">
            Lembar Studi Sketsa
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#7D1128]">
            Kedua Mempelai
          </h2>
        </div>

        <div className="space-y-6">
          <div className="relative bg-[#FFFDF8] rounded-2xl p-5 border-2 border-dashed border-[#7D1128]/35 shadow-sm transform rotate-[-0.8deg]">
            <img
              src="/images/paper-art/paperclip-washi-accent.png"
              alt="Paperclip Washi Accent"
              className="absolute -top-6 -left-3 w-14 sm:w-16 pointer-events-none drop-shadow-md select-none z-20 -rotate-[8deg]"
            />

            <div className="relative w-full max-w-[270px] sm:max-w-[290px] mx-auto aspect-[819/1024] flex items-center justify-center mb-4 select-none">
              <div className="absolute inset-[20%] overflow-hidden rounded-xs bg-[#FAF3EA]">
                <img
                  src={groom.photoUrl || "/images/prewedding/couple-3.jpg"}
                  alt={groom.fullName || groom.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <img
                src="/images/paper-art/deckle-photo-mat.png"
                alt="Deckle Photo Frame"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none z-10"
              />
              <div className="absolute bottom-[21%] left-[22%] right-[22%] flex justify-between items-end z-20 pointer-events-none">
                <span className="text-[9px] font-mono uppercase bg-[#7D1128]/95 text-white px-2.5 py-0.5 rounded font-bold shadow-xs">
                  Mempelai Pria
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-center">
              <h3
                style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                className="text-2xl font-bold text-[#7D1128]"
              >
                {groom.name}
              </h3>
              <p className="text-xs font-sans font-bold text-[#4A2E24]">
                {groom.fullName}
              </p>
              {groom.parents && (
                <p className="text-[11px] font-serif italic text-[#6B4B3E] pt-1">
                  {groom.parents}
                </p>
              )}
              {groom.instagram && (
                <div className="pt-2">
                  <a
                    href={`https://instagram.com/${groom.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EA] hover:bg-[#F2E7D9] text-[#7D1128] border border-[#7D1128]/30 text-xs font-mono font-medium transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@{groom.instagram.replace("@", "")}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-1">
            <div className="h-px flex-1 bg-[#7D1128]/25 border-t border-dashed border-[#7D1128]/40" />
            <div className="w-8 h-8 rounded-full bg-[#7D1128] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs">
              &amp;
            </div>
            <div className="h-px flex-1 bg-[#7D1128]/25 border-t border-dashed border-[#7D1128]/40" />
          </div>

          <div className="relative bg-[#FFFDF8] rounded-2xl p-5 border-2 border-dashed border-[#7D1128]/35 shadow-sm transform rotate-[0.8deg]">
            <img
              src="/images/paper-art/paperclip-washi-accent.png"
              alt="Paperclip Washi Accent"
              className="absolute -top-6 -right-3 w-14 sm:w-16 pointer-events-none drop-shadow-md select-none z-20 rotate-[8deg]"
            />

            <BotanicalSprigOrnament
              position="bottom-left"
              className="absolute -bottom-6 -left-3 w-16 sm:w-20 z-20"
            />

            <div className="relative w-full max-w-[270px] sm:max-w-[290px] mx-auto aspect-[819/1024] flex items-center justify-center mb-4 select-none">
              <div className="absolute inset-[20%] overflow-hidden rounded-xs bg-[#FAF3EA]">
                <img
                  src={bride.photoUrl || "/images/prewedding/couple-4.jpg"}
                  alt={bride.fullName || bride.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <img
                src="/images/paper-art/deckle-photo-mat.png"
                alt="Deckle Photo Frame"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none z-10"
              />
              <div className="absolute bottom-[21%] left-[22%] right-[22%] flex justify-between items-end z-20 pointer-events-none">
                <span className="text-[9px] font-mono uppercase bg-[#7D1128]/95 text-white px-2.5 py-0.5 rounded font-bold shadow-xs">
                  Mempelai Wanita
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-center">
              <h3
                style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                className="text-2xl font-bold text-[#7D1128]"
              >
                {bride.name}
              </h3>
              <p className="text-xs font-sans font-bold text-[#4A2E24]">
                {bride.fullName}
              </p>
              {bride.parents && (
                <p className="text-[11px] font-serif italic text-[#6B4B3E] pt-1">
                  {bride.parents}
                </p>
              )}
              {bride.instagram && (
                <div className="pt-2">
                  <a
                    href={`https://instagram.com/${bride.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EA] hover:bg-[#F2E7D9] text-[#7D1128] border border-[#7D1128]/30 text-xs font-mono font-medium transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@{bride.instagram.replace("@", "")}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SketchbookEvents() {
  const data = useWeddingData();
  const { events } = data;

  return (
    <section id="event" className="relative py-12 px-5 text-[#2C1810]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7D1128] block">
            Jurnal Waktu &amp; Tempat
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#7D1128]">
            Rangkaian Acara
          </h2>
        </div>

        <div className="space-y-5">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="relative bg-[#FFFDF8] rounded-2xl p-5 border-2 border-dashed border-[#7D1128]/35 shadow-sm space-y-3"
            >
              {idx === 0 && (
                <>
                  <img
                    src="/images/paper-art/paperclip-washi-accent.png"
                    alt="Paperclip Washi Accent"
                    className="absolute -top-5 -right-3 w-14 sm:w-16 pointer-events-none drop-shadow-md select-none z-20 rotate-[4deg]"
                  />
                  <BotanicalSprigOrnament
                    position="bottom-left"
                    className="absolute -bottom-6 -left-3 w-18 sm:w-22 z-20"
                  />
                </>
              )}

              <div className="flex items-center justify-between border-b border-[#7D1128]/20 pb-2">
                <span className="px-3 py-0.5 rounded-full bg-[#7D1128] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  {evt.title}
                </span>
                <span className="text-xs font-mono font-bold text-[#7D1128]">
                  {evt.displayDay}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#7D1128] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#8C6D60] block font-bold">
                      Hari &amp; Tanggal
                    </span>
                    <p className="text-xs font-semibold text-[#2C1810]">
                      {evt.displayDay}, {evt.displayDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#7D1128] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#8C6D60] block font-bold">
                      Waktu
                    </span>
                    <p className="text-xs font-semibold text-[#2C1810]">
                      {evt.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#7D1128] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#8C6D60] block font-bold">
                      Lokasi Acara
                    </span>
                    <p className="text-xs font-bold text-[#7D1128]">
                      {evt.venueName}
                    </p>
                    <p className="text-[11px] text-[#6B4B3E]">
                      {evt.venueAddress}
                    </p>
                  </div>
                </div>
              </div>

              {evt.mapUrl && (
                <div className="pt-2 border-t border-[#7D1128]/15">
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7D1128] hover:bg-[#600C1E] text-white text-xs font-mono font-bold shadow-xs transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Petunjuk Arah (Maps)</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SketchbookGallery() {
  const data = useWeddingData();
  const shouldReduceMotion = useReducedMotion();
  const userPreweddings = data.general?.preweddingPhotos || [];
  const defaultImages = [
    "/images/prewedding/couple-1.jpg",
    "/images/prewedding/couple-2.jpg",
    "/images/prewedding/couple-3.jpg",
    "/images/prewedding/couple-4.jpg",
    "/images/prewedding/couple-5.jpg",
  ];
  const photoList = userPreweddings.length > 0 ? userPreweddings : defaultImages;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <section id="gallery" className="relative py-12 px-5 text-[#2C1810]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-1 relative">
          <BotanicalSprigOrnament
            position="top-right"
            className="absolute -top-5 right-2 w-16 sm:w-20 z-10"
          />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7D1128] block">
            Koleksi Potret
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#7D1128]">
            Galeri Sketsa Kenangan
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {photoList.map((src, idx) => (
            <motion.button
              key={idx}
              type="button"
              onClick={() => setSelectedPhoto(src)}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -4,
                      rotate: idx % 2 === 0 ? 0.8 : -0.8,
                      boxShadow: "0 10px 22px -4px rgba(125,17,40,0.14)",
                    }
              }
              whileTap={shouldReduceMotion ? {} : { scale: 0.98, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`relative bg-[#FFFDF8] p-2 rounded-xl border-2 border-dashed border-[#7D1128]/30 shadow-xs cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7D1128] focus-visible:ring-offset-2 transition-colors ${
                idx === 0 ? "col-span-2" : ""
              }`}
              aria-label={`Buka potret kenangan ${idx + 1}`}
            >
              <div className="w-10 h-3 bg-[#E5B869]/70 absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-[-2deg] rounded-xs z-10 pointer-events-none" />
              <div className={`relative overflow-hidden rounded-lg bg-[#FAF3EA] ${idx === 0 ? "h-48 sm:h-56" : "h-36 sm:h-40"}`}>
                <img
                  src={src}
                  alt={`Prewedding ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#7D1128]/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-[#7D1128] flex items-center justify-center shadow-md">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-[#FFFDF8] p-3 rounded-2xl border-4 border-[#7D1128] shadow-2xl"
            >
              <img
                src={selectedPhoto}
                alt="Selected"
                className="w-full max-h-[70vh] object-contain rounded-xl bg-black"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SketchbookGift() {
  const data = useWeddingData();
  const accounts = data.gifts?.accounts || [];
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (num: string, idx: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!data.gifts || accounts.length === 0) return null;

  return (
    <section id="gift" className="relative py-12 px-5 text-[#2C1810]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7D1128] block">
            Tanda Kasih
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#7D1128]">
            Kado Pernikahan
          </h2>
          <p className="text-xs font-sans text-[#6B4B3E] max-w-xs mx-auto">
            Doa restu Anda merupakan hadiah terindah bagi kami.
          </p>
        </div>

        <div className="space-y-4">
          {accounts.map((acc: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#FFFDF8] rounded-2xl p-5 border-2 border-dashed border-[#7D1128]/35 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#7D1128]/15 pb-2">
                <span className="font-mono font-bold text-sm text-[#7D1128] uppercase">
                  {acc.bankName}
                </span>
                <span className="text-[10px] font-mono text-[#8C6D60]">REKENING RESMI</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base sm:text-lg font-mono font-bold tracking-wider text-[#2C1810]">
                    {acc.accountNumber}
                  </p>
                  <p className="text-xs font-sans text-[#6B4B3E]">
                    a.n. {acc.accountHolder}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(acc.accountNumber, idx)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF3EA] hover:bg-[#F2E7D9] text-[#7D1128] border border-[#7D1128]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SketchbookRsvp({
  guestName,
  guestItem,
}: {
  guestName?: string;
  guestItem?: { id: string; name: string; quota: number } | null;
}) {
  const data = useWeddingData();
  const [name, setName] = useState(guestItem?.name || guestName || "");
  const [attendance, setAttendance] = useState<"hadir" | "ragu" | "tidak">("hadir");
  const [attendeeCount, setAttendeeCount] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [wishes, setWishes] = useState<WishMessage[]>([]);

  useEffect(() => {
    if (guestItem?.name) {
      setName(guestItem.name);
    } else if (guestName) {
      setName(guestName);
    }
  }, [guestItem, guestName]);

  useEffect(() => {
    const list = getWishes();
    if (list && list.length > 0) {
      setWishes(list);
    } else if (data.initialWishes && data.initialWishes.length > 0) {
      setWishes(data.initialWishes);
    }
  }, [data.initialWishes]);

  const maxQuota = guestItem?.quota || 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    try {
      if (guestItem?.id) {
        await submitRsvpApi({
          guestId: guestItem.id,
          status: attendance === "hadir" ? 1 : attendance === "tidak" ? 2 : 0,
          attendeeCount: attendance === "hadir" ? attendeeCount : 0,
          message: message.trim(),
        });
      }

      const attendanceText =
        attendance === "hadir"
          ? "Hadir"
          : attendance === "ragu"
          ? "Masih Ragu"
          : "Berhalangan Hadir";

      const newWish = submitWish({
        name: name.trim(),
        relationship: "Tamu Undangan",
        attendance: attendanceText,
        message: message.trim(),
        guestId: guestItem?.id,
      });

      setWishes((prev) => [newWish, ...prev]);
      setIsSuccess(true);
      setMessage("");

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#7D1128", "#E5B869", "#FAF3EA"],
      });
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-12 px-5 text-[#2C1810]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7D1128] block">
            Konfirmasi Kehadiran
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#7D1128]">
            Buku Tamu &amp; Doa Restu
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-[#FFFDF8] rounded-2xl p-5 border-2 border-dashed border-[#7D1128]/35 shadow-sm space-y-4"
        >
          <BotanicalSprigOrnament
            position="top-right"
            className="absolute -top-5 -right-3 w-16 sm:w-20 z-10"
          />

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#7D1128] font-bold block mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#7D1128]/30 bg-[#FAF3EA] text-xs font-sans text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7D1128]/40"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#7D1128] font-bold block mb-1">
              Status Kehadiran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "hadir", label: "Hadir" },
                { key: "ragu", label: "Ragu-ragu" },
                { key: "tidak", label: "Tidak Hadir" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setAttendance(opt.key as any)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                    attendance === opt.key
                      ? "bg-[#7D1128] text-white border-[#7D1128]"
                      : "bg-[#FAF3EA] text-[#6B4B3E] border-[#7D1128]/25 hover:bg-[#F2E7D9]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {attendance !== "tidak" && maxQuota > 1 && (
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#7D1128] font-bold block mb-1">
                Jumlah Hadir (Maks: {maxQuota} Orang)
              </label>
              <select
                value={attendeeCount}
                onChange={(e) => setAttendeeCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#7D1128]/30 bg-[#FAF3EA] text-xs font-sans text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7D1128]/40"
              >
                {Array.from({ length: maxQuota }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} Orang
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#7D1128] font-bold block mb-1">
              Ucapan &amp; Doa Restu
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan dan doa manis untuk kedua mempelai..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#7D1128]/30 bg-[#FAF3EA] text-xs font-sans text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#7D1128]/40"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#7D1128] hover:bg-[#600C1E] text-white font-mono font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Mengirim Catatan..." : "Kirim Doa Restu"}</span>
          </button>

          {isSuccess && (
            <p className="text-xs font-mono text-emerald-700 text-center font-bold">
              Terima kasih! Doa restu Anda telah tersimpan di buku sketsa kami.
            </p>
          )}
        </form>

        <div className="bg-[#FFFDF8] rounded-2xl p-5 border-2 border-dashed border-[#7D1128]/35 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-[#7D1128]/15 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#7D1128]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Doa Restu dari Para Sahabat ({wishes.length})</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="p-3 rounded-xl bg-[#FAF3EA] border border-[#7D1128]/20 space-y-1 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-xs text-[#7D1128]">
                    {w.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#8C6D60]">
                    {w.attendance === "hadir" ? "Hadir" : w.attendance === "ragu" ? "Ragu-ragu" : "Tidak Hadir"}
                  </span>
                </div>
                <p className="text-xs font-sans text-[#4A2E24] leading-relaxed">
                  {w.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-6 pb-2">
          <img
            src="/images/paper-art/wedding-rings-closing-vignette.png"
            alt="Wedding Rings Closing Vignette"
            className="w-52 sm:w-60 h-auto object-contain pointer-events-none drop-shadow-sm select-none opacity-90"
          />
        </div>
      </div>
    </section>
  );
}

function SketchbookFooter() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <footer className="pt-10 pb-24 px-5 text-center bg-[#2C1810] text-[#FFFDF8] relative">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center mb-3">
          <img
            src="/images/paper-art/wedding-rings-closing-vignette.png"
            alt="Wedding Rings Closing Vignette"
            className="w-56 sm:w-68 h-auto object-contain pointer-events-none drop-shadow-sm select-none"
          />
        </div>
        <p className="text-xs font-serif italic text-white/80 max-w-xs mx-auto leading-relaxed">
          &ldquo;Merupakan kehormatan serta kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.&rdquo;
        </p>
        <h3
          style={{ fontFamily: "var(--font-couple-custom, serif)" }}
          className="text-2xl font-bold text-[#E5B869]"
        >
          {groom.name} &amp; {bride.name}
        </h3>
        <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
          SKETCHBOOK MEMORY &bull; 2026
        </p>
      </div>
    </footer>
  );
}

export function PaperArtTemplate({
  data,
  guestName,
  guestItem,
  isPreview = false,
  isEditor = false,
  onOpenChange,
}: TemplateProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpened, setIsOpened] = useState<boolean>(isPreview);
  const fontFamilyCss = getFontFamilyCss(data.themePalette?.fontStyle);

  useEffect(() => {
    if (isPreview) {
      setIsOpened(true);
    }
  }, [isPreview]);

  const handleOpen = () => {
    setIsOpened(true);
    onOpenChange?.(true);
  };

  return (
    <WeddingDataProvider data={data}>
      <div
        style={{ "--font-couple-custom": fontFamilyCss } as React.CSSProperties}
        className="min-h-screen bg-[#F5EBE1] flex flex-col lg:flex-row relative selection:bg-[#7D1128] selection:text-white"
      >
        {!isPreview && (
          <DesktopLeftShowcase
            isOpened={isOpened}
            onOpen={handleOpen}
          />
        )}

        <div
          className={`w-full ${
            isPreview ? "w-full" : "lg:w-[52%] xl:w-[50%]"
          } min-h-screen flex justify-center py-0 ${
            isPreview ? "p-0" : "lg:py-8 lg:px-6"
          } bg-[#F5EBE1] relative`}
        >
          <main
            className={`w-full max-w-full ${
              isPreview ? "max-w-full" : "lg:max-w-[480px]"
            } min-h-screen bg-[#FBF6EE] ${
              isPreview
                ? "rounded-2xl border-2 border-[#7D1128]"
                : "lg:rounded-[44px] lg:border-[5px] lg:border-[#7D1128] lg:shadow-[8px_10px_0px_#4A0812]"
            } relative overflow-clip flex flex-col`}
            style={{
              backgroundImage: "url('/images/paper-art/paper-texture-ivory.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "380px",
            }}
          >
            <SketchbookSpiralBinding />

            <AnimatePresence mode="wait">
              {!isOpened && (
                <EnvelopeCover
                  key="envelope-cover"
                  isOpen={isOpened}
                  onOpen={handleOpen}
                  initialGuestName={guestName}
                />
              )}
            </AnimatePresence>

            {isOpened && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.2 : 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col flex-1 relative"
              >
                <SketchbookHero />
                <BotanicalSectionDivider />
                <SketchbookCouple />
                <BotanicalSectionDivider />
                <SketchbookEvents />
                <BotanicalSectionDivider />
                <SketchbookGallery />
                <BotanicalSectionDivider />
                <SketchbookGift />
                <SketchbookRsvp guestName={guestName} guestItem={guestItem} />
                <SketchbookFooter />

                {!isEditor && <NavigationDock theme="maroon" />}
                {!isEditor && <AudioPlayer autoPlayTrigger={isOpened} theme="maroon" />}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </WeddingDataProvider>
  );
}

export default PaperArtTemplate;
