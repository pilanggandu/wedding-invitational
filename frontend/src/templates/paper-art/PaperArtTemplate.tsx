"use client";

import React, { useState, useEffect, useRef, useId, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Send,
  Download,
  ExternalLink,
  ZoomIn,
  X,
  MessageSquare,
  Home,
  Users,
  Gift,
  Image as ImageIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { resolveThemeColors } from "@/lib/colorPalettes";
import { TemplateProps } from "@/templates/types";
import { WishMessage, BankAccount } from "@/types/wedding";
import { getWishes } from "@/lib/invitationStore";
import { saveGuestResponse, type GuestResponseFeedback } from "@/lib/guestResponse";
import { createKeepsakeCalendar, getKeepsakeSchedule } from "../paper-keepsake/keepsakeCalendar";
import { DesktopLeftShowcase } from "@/components/DesktopLeftShowcase";
import { EnvelopeCover } from "@/components/EnvelopeCover";
import { InvitationPreloader } from "@/components/InvitationPreloader";
import { NavigationDock } from "@/components/NavigationDock";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";
import { CharMotionReveal } from "@/components/CharMotionReveal";
import { FallingPaperPetals } from "@/components/FallingPaperPetals";
import { getFontFamilyCss } from "@/lib/typography";
import { MOTION_TRANSITIONS } from "@/lib/motion";
import { BotanicalLeaves } from "@/components/PaperArtDecorations";
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
  animateFloat = false,
}: {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: number;
  animateFloat?: boolean;
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

  if (shouldReduceMotion) {
    return (
      <img
        src="/images/paper-art/botanical-corner-sprig.png"
        alt="Botanical Sprig"
        style={{ transform: `rotate(${rot.end}deg)` }}
        className={`pointer-events-none select-none drop-shadow-xs ${className}`}
      />
    );
  }

  return (
    <motion.img
      src="/images/paper-art/botanical-corner-sprig.png"
      alt="Botanical Sprig"
      initial={{ opacity: 0, y: 6, rotate: rot.start, scale: 0.98 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: animateFloat ? [rot.end, rot.end - 1.5, rot.end + 1.5, rot.end] : rot.end,
        y: animateFloat ? [0, -2, 1, 0] : 0,
        x: animateFloat ? [0, -1, 1, 0] : 0,
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        opacity: { duration: 0.5, delay, ease: MOTION_TRANSITIONS.romantic.ease },
        scale: { duration: 0.5, delay, ease: MOTION_TRANSITIONS.romantic.ease },
        rotate: animateFloat
          ? {
              duration: 7.2,
              delay: delay + 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : { duration: 0.5, delay, ease: MOTION_TRANSITIONS.romantic.ease },
        y: animateFloat
          ? {
              duration: 6.2,
              delay: delay + 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : { duration: 0.5, delay, ease: MOTION_TRANSITIONS.romantic.ease },
        x: animateFloat
          ? {
              duration: 6.8,
              delay: delay + 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : { duration: 0.5, delay, ease: MOTION_TRANSITIONS.romantic.ease },
      }}
      className={`pointer-events-none select-none drop-shadow-xs ${className}`}
    />
  );
}

function BotanicalSectionDivider() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex items-center justify-center my-6 px-8 select-none">
      <div className="h-px flex-1 border-t border-dashed border-[#F2DFBA]/30" />
      <motion.img
        src="/images/paper-art/botanical-corner-sprig.png"
        alt="Botanical Divider"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 4 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.9, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: MOTION_TRANSITIONS.romantic.ease }}
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-2 pointer-events-none drop-shadow-2xs rotate-45"
      />
      <div className="h-px flex-1 border-t border-dashed border-[#F2DFBA]/30" />
    </div>
  );
}

function SketchbookHero() {
  const data = useWeddingData();
  const { paperColor, textColor } = resolveThemeColors(data.themePalette);
  const shouldReduceMotion = useReducedMotion();
  const { groom, bride } = data.couple;
  const mainEvent = data.events?.[0];
  const dateStr = mainEvent?.displayDate || "";
  const dayStr = mainEvent?.displayDay || "";

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
      data.countdownTarget
    ).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (!Number.isFinite(difference) || difference <= 0) {
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

  const schedule = mainEvent ? getKeepsakeSchedule(mainEvent) : null;
  const calendarStamp = (value: number) => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const googleCalendarUrl = mainEvent && schedule ? `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: `${mainEvent.title} - ${groom.name} & ${bride.name}`, dates: `${calendarStamp(schedule.start)}/${calendarStamp(schedule.end ?? schedule.start)}`, details: mainEvent.calendarEvent?.description || "", location: [mainEvent.venueName, mainEvent.venueAddress].filter(Boolean).join(", ") })}` : undefined;

  const downloadIcs = () => {
    const icsContent = mainEvent ? createKeepsakeCalendar(mainEvent, `${groom.name} & ${bride.name}`) : null;
    if (!icsContent) return;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Sketchbook-Wedding-${groom.name}-${bride.name}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  };

  return (
    <SectionMotion id="hero" className="relative pt-6 pb-12 px-5 text-center text-[#FFFDFB]">
      <div className="max-w-md mx-auto space-y-6">
        <ItemMotion
          variant="card-lift"
          duration={0.82}
          delay={0.06}
          style={{ backgroundColor: paperColor, color: textColor }}
          className="relative rounded-2xl p-6 sm:p-8 border-2 border-dashed border-[#541E24]/35 shadow-[0_8px_24px_rgba(84,30,36,0.08)]"
        >
          <img
            src="/images/paper-art/paperclip-washi-accent.png"
            alt="Paperclip Washi Accent"
            className="absolute -top-7 -right-3 w-16 sm:w-20 pointer-events-none drop-shadow-md select-none z-20 rotate-[6deg]"
          />

          <BotanicalSprigOrnament
            position="bottom-left"
            className="absolute -bottom-6 -left-4 w-20 sm:w-24 z-20"
            animateFloat={!shouldReduceMotion}
          />

          {(data.general?.heroPhotoUrl || data.general?.coverPhotoUrl) && (
            <div className="relative w-full max-w-[240px] sm:max-w-[270px] mx-auto aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#F8EFEA] border-2 border-[#541E24]/25 shadow-sm">
              <motion.div
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
                    : { opacity: 0, clipPath: "inset(18% 0% 0% 0%)", scale: 1.02 }
                }
                whileInView={
                  shouldReduceMotion
                    ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
                    : { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
                }
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.88, delay: 0.12, ease: MOTION_TRANSITIONS.romantic.ease }}
                className="w-full h-full"
              >
                <img
                  src={data.general?.heroPhotoUrl || data.general?.coverPhotoUrl || "/images/prewedding/couple-2.jpg"}
                  alt={`${groom.name} & ${bride.name}`}
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
              <div className="absolute inset-0 border border-white/40 rounded-2xl pointer-events-none" />
            </div>
          )}

          <ItemMotion
            variant="pop"
            delay={0.16}
            float={true}
            floatDistance={3}
            floatDuration={5.5}
            className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center mb-2 select-none"
          >
            <img
              src="/images/templates/paper-art/real-botanical-olive-wreath.png"
              alt="Botanical Olive Wreath"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-xs select-none"
            />
            <span
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-2xl sm:text-3xl font-bold text-[#541E24] tracking-widest z-10 select-none pl-1 -mt-2"
            >
              {coupleMonogram}
            </span>
          </ItemMotion>

          <div className="pt-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#541E24] block font-bold mb-1">
              Buku Catatan Pernikahan
            </span>

            <h1
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-3xl sm:text-4xl font-bold text-[#541E24] tracking-tight my-1"
            >
              <CharMotionReveal text={groom.name} baseDelay={0.15} /> &amp;{" "}
              <CharMotionReveal text={bride.name} baseDelay={0.35} />
            </h1>

            <div className="flex justify-center my-1.5">
              <CrayonUnderlineSvg className="w-36 h-3" color="#541E24" />
            </div>

            {dateStr && <p className="text-sm font-serif italic text-[#6B4B3E] mt-2">{[dayStr, dateStr].filter(Boolean).join(", ")}</p>}
          </div>

          {data.general?.quote && (
            <div className="mt-5 pt-4 border-t border-[#541E24]/20 space-y-2">
              {data.general.quote.arabic && !data.general.quote.arabic.includes("?") && data.general.quote.arabic.trim().length > 0 && (
                <p className="font-serif text-sm text-[#541E24] leading-loose dir-rtl">
                  {data.general.quote.arabic}
                </p>
              )}
              {data.general.quote.translation && (
                <p className="text-xs sm:text-sm font-sans italic text-[#5C3A2E] leading-relaxed">
                  &ldquo;{data.general.quote.translation}&rdquo;
                </p>
              )}
              {data.general.quote.source && (
                <span className="text-xs font-mono uppercase tracking-widest text-[#8C6D60] block font-medium">
                  {data.general.quote.source}
                </span>
              )}
            </div>
          )}
        </ItemMotion>

        <ItemMotion
          variant="card-lift"
          delay={0.12}
          style={{ backgroundColor: paperColor, color: textColor }}
          className="rounded-2xl p-5 border-2 border-dashed border-[#541E24]/30 shadow-sm space-y-3 text-left"
        >
          <div className="flex items-center justify-between border-b border-[#541E24]/15 pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#541E24] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#541E24]" />
              Catatan Hitung Mundur
            </span>
            <span className="text-xs font-mono text-[#8C6D60] font-medium">WAKTU TERSISA</span>
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
                className="bg-[#F8EFEA] p-2.5 rounded-xl border border-[#541E24]/20 shadow-2xs"
              >
                <span className="text-xl sm:text-2xl font-bold text-[#541E24] block tabular-nums leading-tight py-0.5">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#6B4B3E] font-bold block mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-[#541E24]/15">
            <motion.a
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              href={googleCalendarUrl}
              aria-disabled={!googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#541E24] hover:bg-[#3A1116] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-colors min-h-[44px]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Calendar</span>
            </motion.a>
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              onClick={downloadIcs}
              disabled={!schedule}
              className="px-4 py-2.5 rounded-xl bg-[#F8EFEA] hover:bg-[#F0E3DC] text-[#541E24] border border-[#541E24]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan (.ics)</span>
            </motion.button>
          </div>
        </ItemMotion>
      </div>
    </SectionMotion>
  );
}

function SketchbookCouple() {
  const data = useWeddingData();
  const { paperColor, textColor } = resolveThemeColors(data.themePalette);
  const shouldReduceMotion = useReducedMotion();
  const { groom, bride } = data.couple;

  return (
    <SectionMotion id="couple" className="relative py-12 px-5 text-[#FFFDFB]">
      <div className="max-w-md mx-auto space-y-8">
        <ItemMotion variant="slide-down" className="text-center space-y-1 relative">
          <div className="flex justify-center mb-1">
            <BotanicalBranchSvg className="w-24 h-6 text-[#F2DFBA]" color="#F2DFBA" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#F2DFBA] block">
            Lembar Studi Sketsa
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#FFFDFB]">
            Kedua Mempelai
          </h2>
        </ItemMotion>

        <div className="space-y-6">
          <ItemMotion
            variant="frame-mount"
            delay={0.08}
            rotate={-0.8}
            style={{ backgroundColor: paperColor, color: textColor }}
            className="relative rounded-2xl p-5 border-2 border-dashed border-[#541E24]/35 shadow-sm transform rotate-[-0.8deg]"
          >
            <div className="absolute -top-6 -left-3 z-20 pointer-events-none">
              <img
                src="/images/paper-art/paperclip-washi-accent.png"
                alt="Paperclip Washi Accent"
                className="w-14 sm:w-16 drop-shadow-md select-none -rotate-[8deg]"
              />
            </div>

            <div className="relative w-full max-w-[270px] sm:max-w-[290px] mx-auto aspect-[819/1024] flex items-center justify-center mb-4 select-none">
              <div className="absolute top-[13.5%] bottom-[15.5%] left-[17.5%] right-[16.5%] overflow-hidden bg-[#F8EFEA] rounded-xs">
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
                      : { opacity: 0, clipPath: "inset(16% 0% 0% 0%)", scale: 1.02 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
                      : { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.88, delay: 0.16, ease: MOTION_TRANSITIONS.romantic.ease }}
                  className="w-full h-full"
                >
                  <img
                    src={groom.photoUrl || "/images/prewedding/couple-3.jpg"}
                    alt={groom.fullName || groom.name}
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>
              </div>
              <img
                src="/images/paper-art/deckle-photo-mat.png"
                alt="Deckle Photo Frame"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none z-10"
              />
              <div className="absolute bottom-[18%] left-[20%] right-[20%] flex justify-between items-end z-20 pointer-events-none">
                <span className="text-xs font-mono uppercase bg-[#541E24]/95 text-white px-2.5 py-0.5 rounded font-bold shadow-xs">
                  Mempelai Pria
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-center">
              <h3
                style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                className="text-2xl sm:text-3xl font-bold text-[#541E24]"
              >
                <CharMotionReveal text={groom.name} baseDelay={0.15} />
              </h3>
              <p className="text-sm sm:text-base font-sans font-bold text-[#4A2E24]">
                {groom.fullName}
              </p>
              {groom.parents && (
                <p className="text-xs sm:text-sm font-serif italic text-[#6B4B3E] pt-1">
                  {groom.parents}
                </p>
              )}
              {groom.tagline && (
                <div className="pt-1.5">
                  <p className="inline-block text-xs font-script font-bold text-[#541E24] bg-[#F2DFBA]/75 py-1 px-3 rounded-lg border border-[#541E24]/20 shadow-2xs">
                    &ldquo;{groom.tagline}&rdquo;
                  </p>
                </div>
              )}
              {groom.instagram && (
                <div className="pt-2">
                  <motion.a
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    href={`https://instagram.com/${groom.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8EFEA] hover:bg-[#F0E3DC] text-[#541E24] border border-[#541E24]/30 text-xs font-mono font-medium transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@{groom.instagram.replace("@", "")}</span>
                  </motion.a>
                </div>
              )}
            </div>
          </ItemMotion>

          <ItemMotion variant="pop" delay={0.1} className="flex items-center justify-center gap-3 py-1">
            <div className="h-px flex-1 bg-[#541E24]/25 border-t border-dashed border-[#541E24]/40" />
            <div className="w-8 h-8 rounded-full bg-[#541E24] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs">
              &amp;
            </div>
            <div className="h-px flex-1 bg-[#541E24]/25 border-t border-dashed border-[#541E24]/40" />
          </ItemMotion>

          <ItemMotion
            variant="frame-mount"
            delay={0.12}
            rotate={0.8}
            style={{ backgroundColor: paperColor, color: textColor }}
            className="relative rounded-2xl p-5 border-2 border-dashed border-[#541E24]/35 shadow-sm transform rotate-[0.8deg]"
          >
            <div className="absolute -top-6 -right-3 z-20 pointer-events-none">
              <img
                src="/images/paper-art/paperclip-washi-accent.png"
                alt="Paperclip Washi Accent"
                className="w-14 sm:w-16 drop-shadow-md select-none rotate-[8deg]"
              />
            </div>

            <div className="absolute -bottom-6 -left-3 z-20 pointer-events-none">
              <BotanicalSprigOrnament
                position="bottom-left"
                className="w-16 sm:w-20"
                animateFloat={false}
              />
            </div>

            <div className="relative w-full max-w-[270px] sm:max-w-[290px] mx-auto aspect-[819/1024] flex items-center justify-center mb-4 select-none">
              <div className="absolute top-[13.5%] bottom-[15.5%] left-[17.5%] right-[16.5%] overflow-hidden bg-[#F8EFEA] rounded-xs">
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
                      : { opacity: 0, clipPath: "inset(16% 0% 0% 0%)", scale: 1.02 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
                      : { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.88, delay: 0.2, ease: MOTION_TRANSITIONS.romantic.ease }}
                  className="w-full h-full"
                >
                  <img
                    src={bride.photoUrl || "/images/prewedding/couple-4.jpg"}
                    alt={bride.fullName || bride.name}
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>
              </div>
              <img
                src="/images/paper-art/deckle-photo-mat.png"
                alt="Deckle Photo Frame"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none z-10"
              />
              <div className="absolute bottom-[18%] left-[20%] right-[20%] flex justify-between items-end z-20 pointer-events-none">
                <span className="text-xs font-mono uppercase bg-[#541E24]/95 text-white px-2.5 py-0.5 rounded font-bold shadow-xs">
                  Mempelai Wanita
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-center">
              <h3
                style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                className="text-2xl sm:text-3xl font-bold text-[#541E24]"
              >
                <CharMotionReveal text={bride.name} baseDelay={0.15} />
              </h3>
              <p className="text-sm sm:text-base font-sans font-bold text-[#4A2E24]">
                {bride.fullName}
              </p>
              {bride.parents && (
                <p className="text-xs sm:text-sm font-serif italic text-[#6B4B3E] pt-1">
                  {bride.parents}
                </p>
              )}
              {bride.tagline && (
                <div className="pt-1.5">
                  <p className="inline-block text-xs font-script font-bold text-[#541E24] bg-[#F2DFBA]/75 py-1 px-3 rounded-lg border border-[#541E24]/20 shadow-2xs">
                    &ldquo;{bride.tagline}&rdquo;
                  </p>
                </div>
              )}
              {bride.instagram && (
                <div className="pt-2">
                  <motion.a
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    href={`https://instagram.com/${bride.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8EFEA] hover:bg-[#F0E3DC] text-[#541E24] border border-[#541E24]/30 text-xs font-mono font-medium transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@{bride.instagram.replace("@", "")}</span>
                  </motion.a>
                </div>
              )}
            </div>
          </ItemMotion>
        </div>
      </div>
    </SectionMotion>
  );
}

function SketchbookEvents() {
  const data = useWeddingData();
  const { paperColor, textColor } = resolveThemeColors(data.themePalette);
  const shouldReduceMotion = useReducedMotion();
  const { events } = data;

  return (
    <SectionMotion id="event" className="relative py-12 px-5 text-[#FFFDFB]">
      <div className="max-w-md mx-auto space-y-6">
        <ItemMotion variant="slide-down" className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#F2DFBA] block">
            Jurnal Waktu &amp; Tempat
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#FFFDFB]">
            Rangkaian Acara
          </h2>
        </ItemMotion>

        <div className="space-y-5">
          {events.map((evt, idx) => (
            <ItemMotion
              key={evt.id || idx}
              variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
              delay={0.08 + idx * 0.08}
              style={{ backgroundColor: paperColor, color: textColor }}
              className="relative rounded-2xl p-5 border-2 border-dashed border-[#541E24]/35 shadow-sm space-y-3"
            >
              {idx === 0 && (
                <>
                  <div className="absolute -top-5 -right-3 z-20 pointer-events-none">
                    <img
                      src="/images/paper-art/paperclip-washi-accent.png"
                      alt="Paperclip Washi Accent"
                      className="w-14 sm:w-16 drop-shadow-md select-none rotate-[4deg]"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-3 z-20 pointer-events-none">
                    <BotanicalSprigOrnament
                      position="bottom-left"
                      className="w-18 sm:w-22"
                      animateFloat={false}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between border-b border-[#541E24]/20 pb-2">
                <span className="px-3 py-1 rounded-full bg-[#541E24] text-white text-xs font-mono font-bold uppercase tracking-wider">
                  {evt.title}
                </span>
                <span className="text-xs font-mono font-bold text-[#541E24]">
                  {evt.displayDay}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#541E24] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono uppercase text-[#8C6D60] block font-bold">
                      Hari &amp; Tanggal
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-[#2C1810]">
                      {evt.displayDay}, {evt.displayDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#541E24] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono uppercase text-[#8C6D60] block font-bold">
                      Waktu
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-[#2C1810]">
                      {evt.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#541E24] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono uppercase text-[#8C6D60] block font-bold">
                      Tempat &amp; Lokasi
                    </span>
                    <p className="text-sm sm:text-base font-bold text-[#541E24]">
                      {evt.venueName}
                    </p>
                    <p className="text-xs sm:text-sm text-[#5C4538] leading-relaxed mt-0.5">
                      {evt.venueAddress}
                    </p>
                  </div>
                </div>
              </div>

              {evt.mapUrl && (
                <div className="pt-2 border-t border-[#541E24]/15">
                  <motion.a
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#541E24] hover:bg-[#3A1116] text-white text-xs font-mono font-bold shadow-xs transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Petunjuk Arah (Maps)</span>
                  </motion.a>
                </div>
              )}
            </ItemMotion>
          ))}
        </div>
      </div>
    </SectionMotion>
  );
}

function SketchbookGallery() {
  const data = useWeddingData();
  const { paperColor, textColor } = resolveThemeColors(data.themePalette);
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!selectedPhoto || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [selectedPhoto]);

  return (
    <SectionMotion id="gallery" className="relative py-12 px-5 text-[#FFFDFB]">
      <div className="max-w-md mx-auto space-y-6">
        <ItemMotion variant="slide-down" className="text-center space-y-1 relative">
          <div className="absolute -top-5 right-2 z-10 pointer-events-none">
            <BotanicalSprigOrnament
              position="top-right"
              className="w-16 sm:w-20"
              animateFloat={false}
            />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#F2DFBA] block">
            Koleksi Potret
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#FFFDFB]">
            Galeri Sketsa Kenangan
          </h2>
        </ItemMotion>

        <div className="grid grid-cols-2 gap-3">
          {photoList.map((src, idx) => (
            <ItemMotion
              key={idx}
              variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
              delay={0.06 + idx * 0.04}
              className={idx === 0 ? "col-span-2" : ""}
            >
              <motion.button
                type="button"
                onClick={() => setSelectedPhoto(src)}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -3,
                        scale: 1.015,
                        boxShadow: "0 8px 20px -4px rgba(84,30,36,0.12)",
                      }
                }
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.2, ease: MOTION_TRANSITIONS.romantic.ease }}
                style={{ backgroundColor: paperColor }}
                className="w-full relative p-2 rounded-xl border-2 border-dashed border-[#541E24]/30 shadow-xs cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#541E24] focus-visible:ring-offset-2 transition-colors block"
                aria-label={`Buka potret kenangan ${idx + 1}`}
              >
                <div className="w-10 h-3 bg-[#E5B869]/70 absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-[-2deg] rounded-xs z-10 pointer-events-none" />
                <div className={`relative overflow-hidden rounded-lg bg-[#F8EFEA] ${idx === 0 ? "h-48 sm:h-56" : "h-36 sm:h-40"}`}>
                  <img
                    src={src}
                    alt={`Prewedding ${idx + 1}`}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-[#541E24]/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 text-[#541E24] flex items-center justify-center shadow-md">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.button>
            </ItemMotion>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <dialog
            ref={dialogRef}
            aria-label="Foto kenangan diperbesar"
            onCancel={() => setSelectedPhoto(null)}
            onClick={(event) => { if (event.target === event.currentTarget) setSelectedPhoto(null); }}
            className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md max-h-[90dvh] overflow-auto border-0 bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
          >
            <button
              type="button"
              aria-label="Tutup foto"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer transition-colors hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.26, ease: MOTION_TRANSITIONS.romantic.ease }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: paperColor }}
              className="max-w-md w-full p-3 rounded-2xl border-4 border-[#541E24] shadow-2xl"
            >
              <img
                src={selectedPhoto}
                alt="Foto kenangan Gilang dan Salsa diperbesar"
                className="w-full max-h-[70vh] object-contain rounded-xl bg-black"
              />
            </motion.div>
          </dialog>
        )}
      </AnimatePresence>
    </SectionMotion>
  );
}

function SketchbookGift() {
  const data = useWeddingData();
  const { paperColor, textColor } = resolveThemeColors(data.themePalette);
  const shouldReduceMotion = useReducedMotion();
  const accounts: BankAccount[] = data.gifts?.accounts || [];
  const physicalAddress = data.gifts?.physicalGiftAddress;
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copyError, setCopyError] = useState("");
  const copyingRef = useRef(false);

  const handleCopy = async (num: string, idx: number) => {
    if (copyingRef.current) return;
    copyingRef.current = true;
    setCopiedIdx(null);
    setCopiedAddress(false);
    setCopyError("");
    try {
      await navigator.clipboard.writeText(num);
      setCopiedIdx(idx);
    } catch {
      setCopyError("Nomor rekening belum bisa disalin. Pilih dan salin nomor di atas secara manual.");
    } finally {
      copyingRef.current = false;
    }
  };

  const handleCopyAddress = async (addr: string) => {
    if (copyingRef.current) return;
    copyingRef.current = true;
    setCopiedIdx(null);
    setCopiedAddress(false);
    setCopyError("");
    try {
      await navigator.clipboard.writeText(addr);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 3000);
    } catch {
      setCopyError("Alamat pengiriman belum bisa disalin. Salin alamat di atas secara manual.");
    } finally {
      copyingRef.current = false;
    }
  };

  const hasAccounts = accounts.length > 0;
  const hasPhysicalAddress = Boolean(physicalAddress?.address?.trim());

  if (!data.gifts || (!hasAccounts && !hasPhysicalAddress)) return null;

  return (
    <SectionMotion id="gift" className="relative py-12 px-5 text-[#FFFDFB]">
      <div className="max-w-md mx-auto space-y-6">
        <div aria-live="polite" aria-atomic="true">
          {copyError && <p role="alert" className="text-sm text-[#FCA5A5]">{copyError}</p>}
          {copiedIdx !== null && <p role="status" className="text-sm text-[#86EFAC]">Nomor rekening sudah disalin.</p>}
          {copiedAddress && <p role="status" className="text-sm text-[#86EFAC]">Alamat pengiriman kado fisik sudah disalin.</p>}
        </div>
        <ItemMotion variant="slide-down" className="text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#F2DFBA] block">
            Tanda Kasih
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#FFFDFB]">
            Kado Pernikahan
          </h2>
          <p className="text-xs font-sans text-[#E8DCD4] max-w-xs mx-auto">
            Doa restu Anda merupakan hadiah terindah bagi kami.
          </p>
        </ItemMotion>

        <div className="space-y-4">
          {accounts.map((acc, idx) => (
            <ItemMotion
              key={idx}
              variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
              delay={0.08 + idx * 0.1}
              style={{ backgroundColor: paperColor, color: textColor }}
              className="rounded-2xl p-5 border-2 border-dashed border-[#541E24]/35 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#541E24]/15 pb-2">
                <span className="font-mono font-bold text-sm text-[#541E24] uppercase">
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
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
                  onClick={() => handleCopy(acc.accountNumber, idx)}
                  className="px-3 py-1.5 rounded-xl bg-[#F8EFEA] hover:bg-[#F0E3DC] text-[#541E24] border border-[#541E24]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                </motion.button>
              </div>
            </ItemMotion>
          ))}

          {hasPhysicalAddress && physicalAddress && (
            <ItemMotion
              variant={accounts.length % 2 === 0 ? "slide-left" : "slide-right"}
              delay={0.08 + accounts.length * 0.1}
              style={{ backgroundColor: paperColor, color: textColor }}
              className="rounded-2xl p-5 border-2 border-dashed border-[#541E24]/35 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#541E24]/15 pb-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#541E24]" />
                  <span className="font-mono font-bold text-sm text-[#541E24] uppercase">
                    Kirim Kado Fisik
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8C6D60]">ALAMAT RESMI</span>
              </div>

              <div className="space-y-1.5 text-left">
                {physicalAddress.recipient && (
                  <p className="text-xs font-mono font-bold text-[#541E24]">
                    Penerima: {physicalAddress.recipient} {physicalAddress.phone ? `(${physicalAddress.phone})` : ""}
                  </p>
                )}
                <p className="text-xs sm:text-sm font-sans text-[#2C1810] leading-relaxed">
                  {physicalAddress.address}
                </p>
              </div>

              <div className="pt-2 border-t border-[#541E24]/15 flex items-center justify-end">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
                  onClick={() => handleCopyAddress(`${physicalAddress.recipient ? `Penerima: ${physicalAddress.recipient}${physicalAddress.phone ? ` (${physicalAddress.phone})` : ""}\n` : ""}${physicalAddress.address}`)}
                  className="px-3.5 py-2 rounded-xl bg-[#F8EFEA] hover:bg-[#F0E3DC] text-[#541E24] border border-[#541E24]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Alamat Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </motion.button>
              </div>
            </ItemMotion>
          )}
        </div>
      </div>
    </SectionMotion>
  );
}

let wishesSnapshot: WishMessage[] = [];
let wishesSnapshotJson = "";
const emptyWishes: WishMessage[] = [];

function readWishesSnapshot() {
  const current = getWishes();
  const serialized = JSON.stringify(current);
  if (serialized !== wishesSnapshotJson) {
    wishesSnapshot = current;
    wishesSnapshotJson = serialized;
  }
  return wishesSnapshot;
}

function subscribeWishes(onChange: () => void) {
  window.addEventListener("wedding-wishes-changed", onChange);
  return () => window.removeEventListener("wedding-wishes-changed", onChange);
}

function subscribePreview() {
  return () => {};
}

function SketchbookRsvp({
  guestName,
  guestItem,
  preview = false,
}: {
  guestName?: string;
  guestItem?: { id: string; name: string; quota: number } | null;
  preview?: boolean;
}) {
  const data = useWeddingData();
  const { paperColor, textColor } = resolveThemeColors(data.themePalette);
  const shouldReduceMotion = useReducedMotion();
  const defaultName = guestItem?.name || guestName || "";
  const [customName, setCustomName] = useState<string | null>(null);
  const name = customName !== null ? customName : defaultName;
  const [attendance, setAttendance] = useState<"hadir" | "tidak">("hadir");
  const [attendeeCount, setAttendeeCount] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<GuestResponseFeedback | null>(null);
  const wishes = useSyncExternalStore(preview ? subscribePreview : subscribeWishes, preview ? () => data.initialWishes || emptyWishes : readWishesSnapshot, () => data.initialWishes || emptyWishes);
  const submittingRef = useRef(false);
  const formId = useId();
  const maxQuota = guestItem && Number.isFinite(guestItem.quota) ? Math.max(1, Math.floor(guestItem.quota)) : 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const result = await saveGuestResponse({ name, attendance, attendeeCount, quota: maxQuota, message, guestId: guestItem?.id, preview });
      setFeedback(result);
      if (result.clearMessage) setMessage("");
      if (result.tone === "success" && !shouldReduceMotion) {
        try {
          confetti({ particleCount: 50, spread: 65, origin: { y: 0.7 }, colors: ["#541E24", "#A3B899", "#E5B869", "#F2DFBA", "#FFFDFB"] });
        } catch {}
      }
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <SectionMotion id="rsvp" className="relative py-12 px-5 text-[#FFFDFB]">
      <div className="max-w-md mx-auto space-y-6">
        <ItemMotion variant="slide-down" className="text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#F2DFBA] block">
            Konfirmasi Kehadiran
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#FFFDFB]">
            Buku Tamu &amp; Doa Restu
          </h2>
        </ItemMotion>

        <ItemMotion variant="slide-left" delay={0.08}>
          <form
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
            style={{ backgroundColor: paperColor, color: textColor }}
            className="relative rounded-2xl p-5 border-2 border-dashed border-[#541E24]/35 shadow-sm space-y-4"
          >
            <div className="absolute -top-5 -right-3 z-10 pointer-events-none">
              <BotanicalSprigOrnament
                position="top-right"
                className="w-16 sm:w-20"
                animateFloat={false}
              />
            </div>

            <div>
              <label htmlFor={`${formId}-name`} className="text-xs font-mono uppercase tracking-wider text-[#541E24] font-bold block mb-1">
                Nama Lengkap
              </label>
              <input
                id={`${formId}-name`}
                autoComplete="name"
                maxLength={150}
                disabled={isSubmitting}
                type="text"
                value={name}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Masukkan nama Anda"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#541E24]/30 bg-[#F8EFEA] text-base sm:text-sm font-sans text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#541E24]/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#541E24] font-bold block mb-1.5">
                Status Kehadiran
              </label>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Status kehadiran">
                {(
                  [
                    { key: "hadir", label: "Hadir" },
                    { key: "tidak", label: "Tidak Hadir" },
                  ] as const
                ).map((opt) => (
                  <motion.button
                    type="button"
                    key={opt.key}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    onClick={() => setAttendance(opt.key)}
                    aria-pressed={attendance === opt.key}
                    disabled={isSubmitting}
                    className={`py-2.5 px-2 text-center rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer min-h-[44px] ${
                      attendance === opt.key
                        ? "bg-[#541E24] text-white border-[#541E24]"
                        : "bg-[#F8EFEA] text-[#6B4B3E] border-[#541E24]/25 hover:bg-[#F0E3DC]"
                    }`}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {attendance === "hadir" && guestItem && maxQuota > 1 && (
              <div>
                <label htmlFor={`${formId}-count`} className="text-xs font-mono uppercase tracking-wider text-[#541E24] font-bold block mb-1">
                  Jumlah Hadir (Maks: {maxQuota} Orang)
                </label>
                <select
                  id={`${formId}-count`}
                  disabled={isSubmitting}
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#541E24]/30 bg-[#F8EFEA] text-base sm:text-sm font-sans text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#541E24]/40 min-h-[44px]"
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
              <label htmlFor={`${formId}-message`} className="text-xs font-mono uppercase tracking-wider text-[#541E24] font-bold block mb-1">
                Ucapan &amp; Doa {guestItem && "(opsional)"}
              </label>
              <textarea
                id={`${formId}-message`}
                maxLength={2000}
                disabled={isSubmitting}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Tuliskan ucapan dan doa untuk ${data.couple.groom.name} & ${data.couple.bride.name}...`}
                required={!guestItem}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#541E24]/30 bg-[#F8EFEA] text-base sm:text-sm font-sans text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#541E24]/40"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={shouldReduceMotion ? {} : { scale: 1.015, y: -1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              className="w-full py-3.5 rounded-xl bg-[#541E24] hover:bg-[#3A1116] text-white font-mono font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[48px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Mengirim..." : guestItem ? "Kirim Kehadiran & Ucapan" : "Kirim Ucapan"}</span>
            </motion.button>

            <div aria-live="polite" aria-atomic="true">
              {feedback && <p role={feedback.tone === "error" ? "alert" : "status"} className={`text-sm text-center leading-relaxed ${feedback.tone === "error" ? "text-[#541E24]" : feedback.tone === "success" ? "text-emerald-800" : "text-[#6B4B3E]"}`}>{feedback.message}</p>}
            </div>
            {preview && <p className="text-xs text-[#6B4B3E]">Mode pratinjau: formulir tidak mengirim data.</p>}
            {!guestItem && <p className="text-xs text-[#6B4B3E]">Pencatatan kehadiran memerlukan tautan undangan pribadi.</p>}
          </form>
        </ItemMotion>

        <ItemMotion
          variant="slide-right"
          delay={0.12}
          style={{ backgroundColor: paperColor, color: textColor }}
          className="rounded-2xl p-5 border-2 border-dashed border-[#541E24]/35 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2 border-b border-[#541E24]/15 pb-2 text-xs font-mono font-bold uppercase tracking-wider text-[#541E24]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ucapan &amp; Doa ({wishes.length})</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {wishes.map((w, wIdx) => (
              <ItemMotion
                key={w.id}
                variant={wIdx % 2 === 0 ? "slide-left" : "slide-right"}
                delay={0.04 + (wIdx % 5) * 0.03}
                className="p-3 rounded-xl bg-[#F8EFEA] border border-[#541E24]/20 space-y-1 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-xs text-[#541E24]">
                    {w.name}
                  </span>
                  <span className="text-xs font-mono text-[#8C6D60]">
                    {w.attendance}
                  </span>
                </div>
                <p className="text-sm font-sans text-[#4A2E24] leading-relaxed whitespace-pre-wrap break-words">
                  {w.message}
                </p>
              </ItemMotion>
            ))}
          </div>
        </ItemMotion>

        <div className="flex flex-col items-center justify-center pt-6 pb-2">
          <img
            src="/images/templates/paper-art/maroon-wax-seal-rings.svg"
            alt="Maroon Wax Seal Rings"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain pointer-events-none drop-shadow-md select-none mb-3"
          />
          <img
            src="/images/paper-art/wedding-rings-closing-vignette.png"
            alt="Wedding Rings Closing Vignette"
            className="w-52 sm:w-60 h-auto object-contain pointer-events-none drop-shadow-sm select-none opacity-90"
          />
        </div>
      </div>
    </SectionMotion>
  );
}

function SketchbookFooter() {
  const data = useWeddingData();
  const { primaryColor } = resolveThemeColors(data.themePalette);
  const shouldReduceMotion = useReducedMotion();
  const { groom, bride } = data.couple;
  const closingPhoto =
    data.general?.closingPhotoUrl ||
    data.general?.coverPhotoUrl ||
    "/images/prewedding/couple-1.jpg";

  return (
    <SectionMotion id="closing" style={{ backgroundColor: primaryColor }} className="pt-10 pb-24 px-5 text-center text-[#FFFDFB] relative">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center mb-1">
          <img
            src="/images/paper-art/wedding-rings-closing-vignette.png"
            alt="Wedding Rings Closing Vignette"
            className="w-48 sm:w-56 h-auto object-contain pointer-events-none drop-shadow-sm select-none opacity-95"
          />
        </div>

        {/* Bingkai Foto Bersama Mempelai (Deckle Mat & Overflow Hidden) */}
        <ItemMotion variant="card-lift" delay={0.08}>
          <div className="relative w-full max-w-[270px] sm:max-w-[300px] mx-auto aspect-[4/5] my-2">
            <div className="absolute top-[13.5%] bottom-[15.5%] left-[17.5%] right-[16.5%] overflow-hidden rounded-[2px] shadow-inner bg-[#EFE6DC]">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <img
                  src={closingPhoto}
                  alt={`${groom.name} & ${bride.name}`}
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </div>
            <img
              src="/images/paper-art/deckle-photo-mat.png"
              alt="Deckle Photo Frame"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none z-10"
            />
            <div className="absolute bottom-[18%] left-[20%] right-[20%] flex justify-center items-end z-20 pointer-events-none">
              <span className="text-xs font-mono uppercase bg-[#541E24]/95 text-white px-2.5 py-0.5 rounded font-bold shadow-xs">
                {groom.name} &amp; {bride.name}
              </span>
            </div>
          </div>
        </ItemMotion>

        <ItemMotion variant="fade" delay={0.12}>
          <p className="text-sm sm:text-base font-serif italic text-white/90 max-w-sm mx-auto leading-relaxed">
            {data.general?.closingMessage || "Kehadiran dan doa restu Anda akan menjadi kebahagiaan bagi kami."}
          </p>
        </ItemMotion>
        <ItemMotion variant="slide-up" delay={0.16}>
          <h3
            style={{ fontFamily: "var(--font-couple-custom, serif)" }}
            className="text-3xl sm:text-4xl font-bold text-[#E5B869]"
          >
            {groom.name} &amp; {bride.name}
          </h3>
        </ItemMotion>
        {data.general?.funTagline && (
          <ItemMotion variant="fade" delay={0.18}>
            <p className="font-script text-base sm:text-lg text-[#F2DFBA] font-bold max-w-sm mx-auto leading-relaxed italic opacity-95">
              &ldquo;{data.general.funTagline}&rdquo;
            </p>
          </ItemMotion>
        )}
        {data.general?.hashtag && (
          <ItemMotion variant="pop" delay={0.2}>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider bg-[#F2DFBA] text-[#3A1116] border border-[#541E24]/40 shadow-xs">
              {data.general.hashtag}
            </span>
          </ItemMotion>
        )}
        <ItemMotion variant="pop" delay={0.22}>
          <p className="text-xs font-mono text-white/60 tracking-widest uppercase font-medium pt-1">
            SKETCHBOOK MEMORY &bull; 2026
          </p>
        </ItemMotion>
      </div>
    </SectionMotion>
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
  const [isOpened, setIsOpened] = useState<boolean>(isEditor);
  const [isPreloading, setIsPreloading] = useState<boolean>(!isEditor);
  const fontFamilyCss = getFontFamilyCss(data.themePalette?.fontStyle);
  const { primaryColor, secondaryColor } = resolveThemeColors(data.themePalette);

  const handleOpen = () => {
    setIsOpened(true);
    onOpenChange?.(true);
  };

  return (
    <WeddingDataProvider data={data}>
      <AnimatePresence>
        {isPreloading && (
          <InvitationPreloader
            key="invitation-preloader"
            data={data}
            onComplete={() => setIsPreloading(false)}
          />
        )}
      </AnimatePresence>

      <div
        style={{
          "--font-couple-custom": fontFamilyCss,
          backgroundColor: secondaryColor,
        } as React.CSSProperties}
        className="min-h-screen flex flex-col lg:flex-row relative selection:bg-[#541E24] selection:text-white"
      >
        {!isPreview && (
          <DesktopLeftShowcase
            isOpened={isOpened}
            onOpen={handleOpen}
          />
        )}

        <div
          style={{ backgroundColor: secondaryColor }}
          className={`w-full ${
            isPreview ? "w-full" : "lg:w-[52%] xl:w-[50%]"
          } min-h-screen flex justify-center py-0 ${
            isPreview ? "p-0" : "lg:py-8 lg:px-6"
          } relative`}
        >
          <main
            style={{ backgroundColor: primaryColor }}
            className={`w-full max-w-full ${
              isPreview ? "max-w-full" : "lg:max-w-[480px]"
            } min-h-screen text-[#FFFDFB] ${
              isPreview
                ? "rounded-2xl border-2 border-[#2C0A0E]"
                : "lg:rounded-[44px] lg:border-[5px] lg:border-[#2C0A0E] lg:shadow-[8px_10px_0px_#1A0507]"
            } relative overflow-clip flex flex-col`}
          >
            <BotanicalLeaves className="absolute -top-10 -left-10 w-44 h-64 opacity-20 rotate-45 pointer-events-none" />
            <BotanicalLeaves className="absolute -bottom-10 -right-10 w-48 h-68 opacity-20 -rotate-135 pointer-events-none" />

            <SketchbookSpiralBinding />

            <AnimatePresence mode="wait">
              {!isOpened && !isPreloading && (
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
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.2 : MOTION_TRANSITIONS.romantic.duration,
                  ease: MOTION_TRANSITIONS.romantic.ease,
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
                <SketchbookRsvp guestName={guestName} guestItem={guestItem} preview={isPreview || isEditor} />
                <SketchbookFooter />

                {!isEditor && data.themePalette?.particlesEnabled !== false && (
                  <FallingPaperPetals />
                )}

                {!isEditor && <NavigationDock theme="maroon" customItems={[{ id: "hero", label: "Beranda", icon: Home }, { id: "couple", label: "Mempelai", icon: Users }, { id: "event", label: "Acara", icon: Calendar }, { id: "gallery", label: "Galeri", icon: ImageIcon }, ...((data.gifts?.accounts?.length || data.gifts?.physicalGiftAddress?.address?.trim()) ? [{ id: "gift", label: "Kado", icon: Gift }] : []), { id: "rsvp", label: "Doa", icon: MessageSquare }]} />}
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
