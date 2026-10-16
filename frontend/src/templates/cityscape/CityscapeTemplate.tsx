"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  CreditCard,
  Copy,
  Check,
  Send,
  Building2,
  Navigation,
  Download,
  ExternalLink,
  Smile,
  X,
  ZoomIn,
  Palette,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { TemplateProps } from "@/templates/types";

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
import { CityscapeCover } from "./CityscapeCover";
import { CityscapeDesktopLeft } from "./CityscapeDesktopLeft";
import { getFontFamilyCss } from "@/lib/typography";
import {
  CoupleWalkingIllustration,
  CityBoulevardBackdrop,
  UrbanGroomIllustration,
  UrbanBrideIllustration,
} from "./CityscapeIllustrations";
import {
  SkyAirplane,
  PastelCloud,
  CitySkylineSvg,
  VintageStreetLamp,
  ParkBushes,
} from "./CityscapeDecorations";
import { CityscapeParticles } from "./CityscapeParticles";
import { NavigationDock } from "@/components/NavigationDock";
import { AudioPlayer } from "@/components/AudioPlayer";
import { CityscapeRsvp } from "./CityscapeRsvp";

// ----------------------------------------------------------------------
// 1. HERO SECTION (Cityscape Morning Avenue)
// ----------------------------------------------------------------------
function CityscapeHero() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const akadEvent = data.events[0] || {
    displayDay: "Sabtu",
    displayDate: "21 November 2026",
    venueAddress: "Merakurak, Tuban",
    time: "08:00 - 10:00 WIB",
  };
  const receptionEvent = data.events[1] || akadEvent;

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
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
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
    `Undangan Pernikahan Resmi: ${groom.fullName} & ${bride.fullName}`
  )}&location=${encodeURIComponent(receptionEvent.venueAddress)}`;

  const downloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//The Wedding of ${groom.name || "Mempelai"} & ${bride.name || "Mempelai"}//ID`,
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:Pernikahan ${groom.name} & ${bride.name}`,
      `DESCRIPTION:Undangan Pernikahan ${groom.fullName} & ${bride.fullName}`,
      `LOCATION:${receptionEvent.venueAddress}`,
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
    link.setAttribute("download", `Wedding-${groom.name}-${bride.name}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const heroCoverPhoto = data.general?.coverPhotoUrl || data.general?.preweddingPhotos?.[0] || "/images/prewedding/couple-1.jpg";

  return (
    <section id="beranda" className="relative pt-10 pb-16 px-4 bg-[#0F2B46] text-white overflow-hidden text-center">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
        backgroundSize: "28px 28px"
      }} />

      <div className="relative z-10 max-w-md mx-auto space-y-5">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#1D78A0]/60 backdrop-blur-md text-[#7DD3FC] border border-[#38B6FF]/30 shadow-xs"
        >
          <Building2 className="w-3 h-3 text-[#38B6FF]" />
          <span>METROPOLITAN CELEBRATION</span>
          <span className="text-white/40">&bull;</span>
          <span>LAT -7.16&deg; LONG 112.05&deg;</span>
        </motion.div>

        <div>
          <h1
            style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
            className="text-4xl min-[380px]:text-5xl sm:text-6xl text-white font-extrabold tracking-tight drop-shadow-md leading-none my-1"
          >
            {groom.name}{" "}
            <span className="text-xl sm:text-2xl text-[#38B6FF] font-light font-mono mx-1">
              &times;
            </span>{" "}
            {bride.name}
          </h1>

          <p className="text-xs sm:text-sm font-mono text-[#93C5FD] tracking-wider mt-2">
            &ldquo;{data.general?.funTagline || "Menemukan cinta di antara jutaan cerita di kota ini."}&rdquo;
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-[#38B6FF]/40 shadow-2xl bg-[#0B1E2E]">
          <div className="bg-[#081827] py-1.5 px-3 flex items-center justify-between text-[9px] font-mono tracking-widest text-[#7DD3FC] border-b border-white/10">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38B6FF]" />
              CENTRAL AVENUE VIEW
            </span>
            <span>URBAN SKYLINE</span>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={heroCoverPhoto}
              alt={`${groom.name} & ${bride.name}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E2E] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between z-20 text-left">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#38B6FF] font-bold block">
                  VENUE DESTINATION
                </span>
                <span className="text-xs font-sans text-white font-semibold">
                  {akadEvent.venueAddress}
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/70 bg-black/60 px-2 py-0.5 rounded-sm border border-white/10">
                {akadEvent.displayDay}, {akadEvent.displayDate}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#0B1E2E]/90 backdrop-blur-xl p-5 rounded-2xl border border-[#38B6FF]/30 shadow-xl text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#7DD3FC] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#38B6FF]" />
              <span>TERMINAL DEPARTURES &bull; COUNTDOWN</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              ON SCHEDULE
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 font-mono text-center">
            <div className="bg-[#081827] p-2.5 rounded-xl border border-white/10 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-white block">{timeLeft.days}</span>
              <span className="text-[8px] text-[#7DD3FC] uppercase font-bold tracking-wider">Hari</span>
            </div>
            <div className="bg-[#081827] p-2.5 rounded-xl border border-white/10 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-white block">{timeLeft.hours}</span>
              <span className="text-[8px] text-[#7DD3FC] uppercase font-bold tracking-wider">Jam</span>
            </div>
            <div className="bg-[#081827] p-2.5 rounded-xl border border-white/10 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-white block">{timeLeft.minutes}</span>
              <span className="text-[8px] text-[#7DD3FC] uppercase font-bold tracking-wider">Menit</span>
            </div>
            <div className="bg-[#081827] p-2.5 rounded-xl border border-white/10 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-white block">{timeLeft.seconds}</span>
              <span className="text-[8px] text-[#7DD3FC] uppercase font-bold tracking-wider">Detik</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 mt-4 pt-3 border-t border-white/10">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#1D78A0] hover:bg-[#0284C7] text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Calendar</span>
            </a>
            <button
              onClick={downloadIcs}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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

function CityscapeCouple() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const quote = data.general?.quote;

  return (
    <section id="mempelai" className="relative py-14 px-4 bg-[#F0F7FB] overflow-hidden text-center">
      <div className="max-w-md mx-auto relative z-10">
        {quote && (
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm mb-10 text-center">
            <div className="w-9 h-9 mx-auto -mt-9 mb-2.5 rounded-full bg-[#1D78A0] text-white flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 fill-current text-white" />
            </div>
            {quote.arabic && (
              <p className="font-serif text-sm sm:text-base text-[#0C4A60] leading-relaxed mb-2 font-medium" dir="rtl">
                {quote.arabic}
              </p>
            )}
            <p className="text-xs text-[#1D78A0] font-sans italic leading-relaxed">
              &ldquo;{quote.translation}&rdquo;
            </p>
            <span className="text-[9px] font-mono text-slate-400 block mt-2">
              {quote.source}
            </span>
          </div>
        )}

        <div className="space-y-1 mb-8">
          <span className="text-[10px] font-mono font-bold text-[#1D78A0] uppercase tracking-[0.2em] block">
            METROPOLITAN SOULS &bull; TWO STORIES IN ONE CITY
          </span>
          <h2 className="text-3xl font-extrabold text-[#0C4A60] tracking-tight">
            Pasangan Mempelai
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden border border-sky-200 shadow-md text-left">
            <div className="bg-[#0F2B46] py-1.5 px-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-[#7DD3FC]">
              <span className="font-bold">URBAN PROFILE // GROOM</span>
              <span>SUB-TBN REGION</span>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden group">
              <img
                src={groom.photoUrl || "/images/prewedding/couple-3.jpg"}
                alt={groom.fullName || groom.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B46] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-20">
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#38B6FF] tracking-wider block font-bold">
                    Mempelai Pria
                  </span>
                  <h3
                    style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
                    className="text-2xl font-bold text-white tracking-tight"
                  >
                    {groom.name}
                  </h3>
                </div>
                {groom.instagram && (
                  <a
                    href={`https://instagram.com/${groom.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-xs text-white transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@{groom.instagram.replace("@", "")}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 space-y-1.5 bg-white border-t border-sky-100">
              <p className="text-xs font-sans font-bold text-[#0C4A60]">
                {groom.fullName}
              </p>
              {groom.parents && (
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  {groom.parents}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-1">
            <div className="h-px flex-1 bg-sky-200" />
            <div className="w-8 h-8 rounded-full bg-[#1D78A0] text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
              &times;
            </div>
            <div className="h-px flex-1 bg-sky-200" />
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-sky-200 shadow-md text-left">
            <div className="bg-[#0F2B46] py-1.5 px-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-[#7DD3FC]">
              <span className="font-bold">URBAN PROFILE // BRIDE</span>
              <span>SUB-TBN REGION</span>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden group">
              <img
                src={bride.photoUrl || "/images/prewedding/couple-4.jpg"}
                alt={bride.fullName || bride.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B46] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-20">
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#38B6FF] tracking-wider block font-bold">
                    Mempelai Wanita
                  </span>
                  <h3
                    style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
                    className="text-2xl font-bold text-white tracking-tight"
                  >
                    {bride.name}
                  </h3>
                </div>
                {bride.instagram && (
                  <a
                    href={`https://instagram.com/${bride.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-xs text-white transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@{bride.instagram.replace("@", "")}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 space-y-1.5 bg-white border-t border-sky-100">
              <p className="text-xs font-sans font-bold text-[#0C4A60]">
                {bride.fullName}
              </p>
              {bride.parents && (
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  {bride.parents}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CityscapeEvents() {
  const data = useWeddingData();
  const { events, dresscode } = data;

  return (
    <section id="acara" className="relative py-14 px-4 bg-[#0F2B46] text-white overflow-hidden text-center">
      <div className="max-w-md mx-auto relative z-10 space-y-8">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#7DD3FC] uppercase tracking-[0.2em] block">
            TRANSIT ROUTE MAP // CELEBRATION SCHEDULE
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Rangkaian Acara
          </h2>
        </div>

        <div className="space-y-6 text-left">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="bg-[#0B1E2E] rounded-2xl overflow-hidden border border-[#38B6FF]/30 shadow-xl relative"
            >
              <div className="bg-[#1D78A0] py-2 px-4 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FDE047] animate-pulse" />
                  LINE 0{idx + 1} &bull; {idx === 0 ? "AKAD NIKAH STATION" : "RECEPTION CENTRAL"}
                </span>
                <span className="text-white/80">{evt.displayDay}</span>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-white">
                      {evt.title}
                    </h3>
                    <p className="text-xs font-mono text-[#7DD3FC] mt-0.5">
                      {evt.displayDay}, {evt.displayDate}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-mono font-bold text-white">
                    {evt.time}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1">
                  <p className="font-sans font-semibold text-xs text-white">
                    {evt.venueName}
                  </p>
                  <p className="text-[11px] text-white/70 font-sans">
                    {evt.venueAddress}
                  </p>
                </div>

                {evt.mapUrl && (
                  <div className="pt-2">
                    <a
                      href={evt.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-mono font-bold shadow-md transition-transform hover:scale-105"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#FDE047]" />
                      <span>Navigasi Rute (Google Maps)</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dresscode Palette */}
        {dresscode?.colors && dresscode.colors.length > 0 && (
          <div className="mt-8 bg-white/95 p-5 rounded-3xl border border-sky-200 shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-[#1D78A0] uppercase mb-1">
              <Palette className="w-3.5 h-3.5 text-[#2E8BC0]" />
              <span>Rekomendasi Dress Code Tamu</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-3">
              {dresscode.description || "Sentuhan nuansa elegan modern perkotaan:"}
            </p>
            <div className="flex justify-center items-center gap-3">
              {dresscode.colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-9 h-9 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] font-mono text-slate-600 font-bold">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 4. LOVE STORY TIMELINE (Halte Perjalanan Cinta)
// ----------------------------------------------------------------------
function CityscapeLoveStory() {
  const data = useWeddingData();
  const stories = data.stories || [
    {
      year: "2020",
      title: "Pertemuan Pertama di Sudut Kota",
      story: "Awalnya rekan satu lingkup kerja dan teman berdiskusi seputar kesibukan kota.",
      cuteReaction: "Dari percakapan santai hingga frekuensi hati yang sama.",
      photoCaption: "Awal Cerita",
      badgeColor: "bg-[#2E8BC0]",
    },
    {
      year: "2023",
      title: "Menjelajahi Kota Bersama",
      story: "Menyadari harmoni yang saling melengkapi dan selalu merasa tenang saat bersama.",
      cuteReaction: "Menemukan ketenangan rumah dalam setiap langkah bersama.",
      photoCaption: "Kisah Bersama",
      badgeColor: "bg-[#38B6FF]",
    },
    {
      year: "2026",
      title: "Tujuan Akhir: Menuju Pelaminan",
      story: "Memutuskan untuk mengikat janji suci selamanya dalam ikatan pernikahan yang sah dan berkah.",
      cuteReaction: "Bismillah, melangkah mantap menuju babak baru kehidupan.",
      photoCaption: "Menuju Sah",
      badgeColor: "bg-[#1D78A0]",
    },
  ];

  return (
    <section id="cerita" className="relative py-16 px-4 bg-[#F8FCFD] overflow-hidden">
      <div className="max-w-md mx-auto relative z-10 text-center">
        <span className="text-xs font-mono font-bold text-[#1D78A0] uppercase tracking-wider block mb-1">
          Perjalanan Dua Hati
        </span>
        <h2 className="font-handwriting text-5xl text-[#0C4A60] mb-8">
          Kisah Cinta Kami
        </h2>

        {/* Metro Route Styled Timeline */}
        <div className="relative pl-6 text-left border-l-3 border-[#2E8BC0]/40 ml-4 space-y-8">
          {stories.map((s, idx) => (
            <div key={idx} className="relative">
              {/* Station Dot */}
              <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-[#2E8BC0] text-white flex items-center justify-center text-[10px] font-mono font-bold border-2 border-white shadow-md">
                {idx + 1}
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
                <span className="text-xs font-mono font-bold text-[#38B6FF] block">
                  {s.year}
                </span>
                <h4 className="font-sans font-bold text-base text-[#0C4A60] mt-0.5">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {s.story}
                </p>
                {s.cuteReaction && (
                  <p className="text-[11px] font-script font-bold text-[#1D78A0] mt-2">
                    {s.cuteReaction}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 5. GALLERY SECTION (Polaroid Moments)
// ----------------------------------------------------------------------
function CityscapeGallery() {
  const data = useWeddingData();
  const gallery = data.gallery || [];
  const userPreweddings = data.general?.preweddingPhotos || [];
  const defaultPhotos = [
    { id: 1, src: "/images/prewedding/couple-1.jpg", caption: "Kala Dua Hati Bertemu", tag: "AwalCerita" },
    { id: 2, src: "/images/prewedding/couple-2.jpg", caption: "Langkah Menuju Masa Depan", tag: "BahagiaBersama" },
    { id: 3, src: "/images/prewedding/couple-3.jpg", caption: "Senja dan Janji Suci", tag: "KisahCinta" },
    { id: 4, src: "/images/prewedding/couple-4.jpg", caption: "Menatap Hari Esok", tag: "MenujuSah" },
  ];

  const photos =
    gallery.length > 0
      ? gallery.map((photo: any, idx: number) => ({
          id: photo.id || idx,
          src: photo.url || (userPreweddings[idx] || defaultPhotos[idx % defaultPhotos.length].src),
          caption: photo.caption || `Momen Bahagia 0${idx + 1}`,
          tag: photo.tag || "MomenBahagia",
        }))
      : userPreweddings.length > 0
      ? userPreweddings.map((url, idx) => ({
          id: idx,
          src: url,
          caption: `Potret Kenangan 0${idx + 1}`,
          tag: "MomenBahagia",
        }))
      : defaultPhotos;

  const [activePhoto, setActivePhoto] = useState<any | null>(null);

  return (
    <section id="galeri" className="relative py-16 px-4 bg-gradient-to-b from-[#F8FCFD] via-[#EBF4F8] to-[#FFFFFF] overflow-hidden">
      <div className="max-w-md mx-auto relative z-10 text-center">
        <span className="text-xs font-mono font-bold text-[#1D78A0] uppercase tracking-wider block mb-1">
          Momen Indah Berdua
        </span>
        <h2 className="font-handwriting text-5xl text-[#0C4A60] mb-8">
          Galeri Foto
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="bg-white p-3 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group"
            >
              <div className="aspect-[3/4] bg-sky-50 rounded-xl overflow-hidden mb-2 relative border border-sky-100">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-sky-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
                </div>
              </div>
              <p className="text-[11px] font-script font-bold text-[#0C4A60] truncate">
                {photo.caption}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        <AnimatePresence>
          {activePhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePhoto(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-4 rounded-3xl max-w-sm w-full text-center relative"
              >
                <button
                  onClick={() => setActivePhoto(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="aspect-[3/4] bg-sky-50 rounded-2xl overflow-hidden my-3 border border-sky-100">
                  <img
                    src={activePhoto.src}
                    alt={activePhoto.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-sans font-bold text-sm text-[#0C4A60]">
                  {activePhoto.caption}
                </h4>
                <p className="text-xs text-[#2E8BC0] font-mono mt-1">
                  #{activePhoto.tag || "MomenBahagia"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 6. GIFTS SECTION (Amplop Digital & Kado)
// ----------------------------------------------------------------------
function CityscapeGifts() {
  const data = useWeddingData();
  const { accounts, physicalGiftAddress } = data.gifts;
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (num: string, idx: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIdx(idx);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#38B6FF", "#2E8BC0", "#FFE58F"],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  return (
    <section id="hadiah" className="relative py-16 px-4 bg-[#F5FAFC] overflow-hidden">
      <div className="max-w-md mx-auto relative z-10 text-center">
        <span className="text-xs font-mono font-bold text-[#1D78A0] uppercase tracking-wider block mb-1">
          Tanda Kasih & Doa Restu
        </span>
        <h2 className="font-handwriting text-5xl text-[#0C4A60] mb-2">
          Kado Pernikahan
        </h2>
        <p className="text-xs text-slate-600 max-w-xs mx-auto mb-8 leading-relaxed">
          Doa restu Anda merupakan karunia terindah bagi kami. Namun jika hendak memberikan tanda kasih, dapat melalui:
        </p>

        <div className="space-y-4">
          {accounts.map((acc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border-2 border-sky-100 shadow-sm text-left flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#1D78A0] block">
                  {acc.bankName} • {acc.cuteLabel || "Rekening Hadiah"}
                </span>
                <p className="font-mono font-black text-base text-[#0C4A60] tracking-wider my-0.5">
                  {acc.accountNumber}
                </p>
                <p className="text-xs text-slate-500">{acc.accountHolder}</p>
              </div>

              <button
                onClick={() => handleCopy(acc.accountNumber, idx)}
                className="px-4 py-2 rounded-xl bg-[#2E8BC0] hover:bg-[#1D78A0] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIdx === idx ? "Tersalin!" : "Salin"}</span>
              </button>
            </div>
          ))}

          {physicalGiftAddress?.address && (
            <div className="bg-white rounded-2xl p-5 border border-sky-100 text-left">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1D78A0] mb-1">
                <Building2 className="w-3.5 h-3.5 text-[#2E8BC0]" />
                <span>Pengiriman Kado Fisik:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {physicalGiftAddress.address}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 7. FOOTER SECTION (Twilight Skyline)
// ----------------------------------------------------------------------
function CityscapeFooter() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const families = [groom.parents, bride.parents].filter(Boolean);

  return (
    <footer className="relative pt-14 pb-28 px-4 bg-gradient-to-b from-[#1D78A0] via-[#0E516D] to-[#062837] text-white text-center overflow-hidden">
      {/* Background Twilight Skyline Silhouette */}
      <div className="absolute inset-x-0 bottom-0 h-36 opacity-20 pointer-events-none">
        <CitySkylineSvg className="w-full h-full" color="#FFFFFF" />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <span className="inline-block px-4 py-1 rounded-full text-xs font-mono font-bold bg-white/15 text-[#FFE58F] border border-white/20 mb-4">
          Terima Kasih Banyak
        </span>

        <p className="text-xs text-sky-100 max-w-sm mx-auto leading-relaxed mb-6">
          {data.general?.closingMessage ||
            "Merupakan kehormatan dan kebahagiaan bagi kami atas kehadiran dan doa restu Anda."}
        </p>

        {families.length > 0 && (
          <div className="mb-6">
            <span className="text-xs font-script text-[#FFE58F] block font-bold">
              Keluarga Besar:
            </span>
            <p className="text-xs text-white/90 font-sans mt-0.5 font-bold">
              {families.join(" & ")}
            </p>
          </div>
        )}

        <h3
          style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
          className="font-couple-title font-handwriting text-5xl sm:text-6xl text-white my-1"
        >
          {groom.name} <span className="font-script text-3xl text-[#FFE58F]">&</span> {bride.name}
        </h3>

        {data.general?.hashtag && (
          <div className="mt-4 text-xs font-mono text-[#FFE58F] font-bold">
            {data.general.hashtag}
          </div>
        )}
      </div>
    </footer>
  );
}

// ----------------------------------------------------------------------
// MAIN EXPORT: CityscapeTemplate
// ----------------------------------------------------------------------
export function CityscapeTemplate({
  data,
  guestName,
  guestItem,
  isPreview = false,
  isEditor = false,
  onOpenChange,
}: TemplateProps) {
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
        className="min-h-screen bg-[#EBF4F8] flex flex-col lg:flex-row relative"
      >
        {/* Desktop Left Showcase (only when not in miniature preview) */}
        {!isPreview && (
          <CityscapeDesktopLeft isOpened={isOpened} onOpen={handleOpen} />
        )}

        {/* Right Side: Phone mockup frame on desktop, Full native on mobile */}
        <div
          className={`w-full ${
            isPreview ? "w-full" : "lg:w-[52%] xl:w-[50%]"
          } min-h-screen flex justify-center py-0 ${
            isPreview ? "p-0" : "lg:py-8 lg:px-6"
          } bg-[#EBF4F8] relative`}
        >
          <main
            className={`w-full max-w-full ${
              isPreview ? "max-w-full" : "lg:max-w-[480px]"
            } min-h-screen bg-white ${
              isPreview
                ? "rounded-2xl border-2 border-[#1D78A0]"
                : "lg:rounded-[44px] lg:border-[5px] lg:border-[#1D78A0] lg:shadow-[0_12px_36px_rgba(29,120,160,0.3)]"
            } relative overflow-clip flex flex-col`}
          >
            {/* Top Phone Camera / Speaker Notch (Desktop View Only) */}
            {!isPreview && (
              <div className="hidden lg:flex justify-between items-center px-6 py-2.5 bg-[#1D78A0] text-white shrink-0">
                <span className="text-[11px] font-mono font-bold text-[#FFE58F]">
                  12:12
                </span>
                <div className="w-20 h-3.5 bg-[#0C4A60] rounded-full flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38B6FF]" />
                  <span className="w-6 h-1 rounded-full bg-[#2E8BC0]" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#E8F4F8]">
                  <span>5G</span>
                  <div className="w-4 h-2 rounded-xs border border-white/80 p-0.5 flex items-center">
                    <div className="w-full h-full bg-[#FFE58F] rounded-2xs" />
                  </div>
                </div>
              </div>
            )}

            {/* Cityscape Cover Screen (Rebuilt with Pure Vectors & Authentic OPEN Button) */}
            <AnimatePresence mode="wait">
              {!isOpened && (
                <CityscapeCover
                  key="cityscape-cover"
                  isOpen={isOpened}
                  onOpen={handleOpen}
                  initialGuestName={guestName}
                />
              )}
            </AnimatePresence>

            {/* Main Invitation Content Once Opened */}
            {isOpened && (
              <div className="animate-in fade-in duration-1000 flex flex-col flex-1 relative bg-white">
                {/* Floating Urban Particles */}
                {data.themePalette?.particlesEnabled !== false && <CityscapeParticles />}

                <CityscapeHero />
                <CityscapeCouple />
                <CityscapeEvents />
                <CityscapeLoveStory />
                <CityscapeGallery />
                <CityscapeGifts />
                <CityscapeRsvp guestName={guestName} guestItem={guestItem} />
                <CityscapeFooter />

                {!isEditor && <NavigationDock theme="cityscape" />}
                {!isEditor && <AudioPlayer autoPlayTrigger={isOpened} theme="cityscape" />}
              </div>
            )}
          </main>
        </div>
      </div>
    </WeddingDataProvider>
  );
}

export default CityscapeTemplate;
