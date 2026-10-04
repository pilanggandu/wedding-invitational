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
import {
  CoupleWalkingIllustration,
  CityBoulevardBackdrop,
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
import { RsvpSection } from "@/components/RsvpSection";

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
      "PRODID:-//The Wedding of Gilang & Salsadila//ID",
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

  return (
    <section id="beranda" className="relative pt-12 pb-16 px-4 bg-gradient-to-b from-[#BFE1F4] via-[#DCEDF8] to-[#FFFFFF] overflow-hidden text-center">
      {/* Background Animated Sky Elements */}
      <SkyAirplane className="top-4 left-4" />
      <PastelCloud className="w-28 h-12 absolute top-8 right-4 opacity-70" delay={1} />
      <PastelCloud className="w-24 h-10 absolute top-20 left-6 opacity-60" delay={4} />

      <div className="relative z-10 max-w-md mx-auto">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-mono font-bold bg-white/85 text-[#1D78A0] border border-sky-100 shadow-xs mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#38B6FF]" />
          <span>The Wedding Celebration</span>
          <Sparkles className="w-3.5 h-3.5 text-[#38B6FF]" />
        </motion.div>

        <h1 className="font-handwriting text-5xl sm:text-6xl text-[#1D78A0] tracking-wide my-1">
          {groom.name} <span className="font-script text-3xl sm:text-4xl text-[#38B6FF]">&</span> {bride.name}
        </h1>

        <p className="font-script text-base sm:text-lg text-[#2E8BC0] font-bold max-w-sm mx-auto mb-4">
          &ldquo;{data.general?.funTagline || "Menemukan cinta di antara jutaan cerita di kota ini."}&rdquo;
        </p>

        {/* Handcrafted Centerpiece: Vector Couple Walk in City Center */}
        <div className="relative w-full max-w-[260px] mx-auto py-2 my-2 flex justify-center">
          <CoupleWalkingIllustration className="w-full h-auto" />
        </div>

        {/* Date & Location Pill */}
        <div className="inline-block bg-[#1D78A0] text-white px-5 py-1.5 rounded-full text-xs font-mono font-bold shadow-md my-2">
          📅 {akadEvent.displayDay}, {akadEvent.displayDate} • {akadEvent.venueAddress}
        </div>

        {/* Modern Frosted Countdown Box */}
        <div className="mt-6 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-sky-200 shadow-lg">
          <span className="text-xs font-mono font-bold text-[#1D78A0] block mb-3">
            ⏰ Hitung Mundur Menuju Hari Bahagia:
          </span>
          <div className="grid grid-cols-4 gap-2 font-mono">
            <div className="bg-[#F0F8FF] p-2.5 rounded-2xl border border-sky-200 shadow-2xs">
              <span className="text-2xl font-black text-[#1D78A0] block">{timeLeft.days}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Hari</span>
            </div>
            <div className="bg-[#F0F8FF] p-2.5 rounded-2xl border border-sky-200 shadow-2xs">
              <span className="text-2xl font-black text-[#1D78A0] block">{timeLeft.hours}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Jam</span>
            </div>
            <div className="bg-[#F0F8FF] p-2.5 rounded-2xl border border-sky-200 shadow-2xs">
              <span className="text-2xl font-black text-[#1D78A0] block">{timeLeft.minutes}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Menit</span>
            </div>
            <div className="bg-[#F0F8FF] p-2.5 rounded-2xl border border-sky-200 shadow-2xs">
              <span className="text-2xl font-black text-[#1D78A0] block">{timeLeft.seconds}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Detik</span>
            </div>
          </div>

          {/* Calendar Actions */}
          <div className="flex items-center justify-center gap-2.5 mt-4 pt-3 border-t border-sky-100">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#2E8BC0] hover:bg-[#1D78A0] text-white text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Calendar</span>
            </a>
            <button
              onClick={downloadIcs}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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

// ----------------------------------------------------------------------
// 2. COUPLE SECTION (Pasangan Mempelai)
// ----------------------------------------------------------------------
function CityscapeCouple() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const quote = data.general?.quote;

  return (
    <section id="mempelai" className="relative py-16 px-4 bg-[#F8FCFD] overflow-hidden">
      <div className="max-w-md mx-auto relative z-10 text-center">
        {/* Quranic Verse / Blessing */}
        {quote && (
          <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-sm mb-12 text-center">
            <div className="w-10 h-10 mx-auto -mt-11 mb-3 rounded-full bg-[#2E8BC0] text-white flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 fill-current text-white" />
            </div>
            <p className="font-serif text-sm sm:text-base text-[#0C4A60] leading-relaxed mb-3 font-medium" dir="rtl">
              {quote.arabic}
            </p>
            <p className="font-script text-sm text-[#1D78A0] font-bold leading-relaxed">
              &ldquo;{quote.translation}&rdquo;
            </p>
            <span className="text-[10px] font-mono text-slate-400 block mt-2">
              ({quote.source})
            </span>
          </div>
        )}

        <span className="text-xs font-mono font-bold text-[#2E8BC0] uppercase tracking-wider block mb-1">
          Dua Langkah, Satu Cerita
        </span>
        <h2 className="font-handwriting text-5xl text-[#0C4A60] mb-8">
          Pasangan Mempelai
        </h2>

        {/* Groom Profile Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-sm text-center mb-8 relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-[#E8F4F8] to-[#CBE6F6] border-4 border-[#2E8BC0] flex items-center justify-center text-4xl mb-3 shadow-inner">
            👨‍💼
          </div>
          <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F4F8] text-[#1D78A0] mb-1">
            Mempelai Pria
          </span>
          <h3 className="font-handwriting text-4xl text-[#1D78A0] my-0.5">
            {groom.name}
          </h3>
          <p className="font-sans font-bold text-xs text-[#0C4A60]">
            {groom.fullName}
          </p>
          <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
            &ldquo;{groom.bioFunny || "Suka kopi, hobi ngobrol, dan siap jadi pendamping setia selamanya."}&rdquo;
          </p>
          <p className="text-[11px] text-slate-600 mt-3 font-medium">
            {groom.parents}
          </p>
          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F0F8FF] hover:bg-sky-100 text-[#1D78A0] border border-sky-200 text-xs font-mono font-bold mt-4 transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@{groom.instagram}</span>
            </a>
          )}
        </div>

        {/* Bride Profile Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-sm text-center relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-[#FFF0F3] to-[#FCE7F3] border-4 border-[#38B6FF] flex items-center justify-center text-4xl mb-3 shadow-inner">
            👰‍♀️
          </div>
          <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FFF0F3] text-[#EC4899] mb-1">
            Mempelai Wanita
          </span>
          <h3 className="font-handwriting text-4xl text-[#1D78A0] my-0.5">
            {bride.name}
          </h3>
          <p className="font-sans font-bold text-xs text-[#0C4A60]">
            {bride.fullName}
          </p>
          <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
            &ldquo;{bride.bioFunny || "Pencinta keceriaan, senyum manis, dan siap membangun surga rumah tangga bersama."}&rdquo;
          </p>
          <p className="text-[11px] text-slate-600 mt-3 font-medium">
            {bride.parents}
          </p>
          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F0F8FF] hover:bg-sky-100 text-[#1D78A0] border border-sky-200 text-xs font-mono font-bold mt-4 transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@{bride.instagram}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 3. EVENT SECTION (Rangkaian Acara & Maps)
// ----------------------------------------------------------------------
function CityscapeEvents() {
  const data = useWeddingData();
  const { events, dresscode } = data;

  return (
    <section id="acara" className="relative py-16 px-4 bg-gradient-to-b from-[#FFFFFF] via-[#E8F4F8] to-[#CBE6F6] overflow-hidden">
      <div className="max-w-md mx-auto relative z-10 text-center">
        <span className="text-xs font-mono font-bold text-[#1D78A0] uppercase tracking-wider block mb-1">
          Catat Waktu & Lokasi
        </span>
        <h2 className="font-handwriting text-5xl text-[#0C4A60] mb-8">
          Rangkaian Acara
        </h2>

        <div className="space-y-6">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-md text-center relative overflow-hidden"
            >
              {/* Skyline Banner Header */}
              <div className="h-10 -mx-6 -mt-6 bg-[#1D78A0] text-white flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest mb-4">
                {idx === 0 ? "🏙️ Akad Nikah" : "✨ Resepsi Pernikahan"}
              </div>

              <h3 className="font-sans font-extrabold text-xl text-[#0C4A60]">
                {evt.title}
              </h3>
              <p className="text-xs font-mono font-bold text-[#2E8BC0] mt-1">
                {evt.displayDay}, {evt.displayDate}
              </p>
              <p className="text-xs font-mono text-slate-600 mt-1">
                ⏰ {evt.time}
              </p>

              <div className="my-4 pt-3 border-t border-sky-100">
                <p className="font-sans font-bold text-xs text-[#0C4A60]">
                  {evt.venueName}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {evt.venueAddress}
                </p>
              </div>

              {evt.mapUrl && (
                <a
                  href={evt.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E8BC0] hover:bg-[#1D78A0] text-white text-xs font-mono font-bold shadow-md transition-transform hover:scale-105"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FFE58F]" />
                  <span>Buka Google Maps</span>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Dresscode Palette */}
        {dresscode?.colors && dresscode.colors.length > 0 && (
          <div className="mt-8 bg-white/95 p-5 rounded-3xl border border-sky-200 shadow-sm">
            <span className="text-xs font-mono font-bold text-[#1D78A0] uppercase block mb-1">
              🎨 Rekomendasi Dress Code Tamu
            </span>
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
      story: "Awalnya hanya rekan kerja dan teman ngobrol santai seputar kopi dan kesibukan kota.",
      cuteReaction: "Tak disangka berlanjut obrolan panjang! ☕",
      photoCaption: "Awal Cerita",
      badgeColor: "bg-[#2E8BC0]",
    },
    {
      year: "2023",
      title: "Menjelajahi Kota Bersama",
      story: "Menyadari frekuensi yang sama dan selalu merasa tenang saat saling berbagi cerita.",
      cuteReaction: "Dari teman jadi belahan jiwa 💕",
      photoCaption: "Kisah Bersama",
      badgeColor: "bg-[#38B6FF]",
    },
    {
      year: "2026",
      title: "Tujuan Akhir: Menuju Pelaminan",
      story: "Memutuskan untuk mengikat janji suci selamanya dalam ikatan pernikahan yang sah dan penuh berkah.",
      cuteReaction: "Alhamdulillah siap melangkah bersama! 💍",
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
          {gallery.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="bg-white p-3 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[3/4] bg-gradient-to-b from-sky-100 to-sky-50 rounded-xl flex items-center justify-center text-4xl mb-2 relative overflow-hidden border border-sky-50">
                <span>📸</span>
                <div className="absolute inset-0 bg-sky-900/10 hover:bg-transparent transition-colors flex items-center justify-center">
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
                <div className="aspect-[3/4] bg-sky-50 rounded-2xl flex items-center justify-center text-6xl my-3">
                  📸
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
              <span className="text-xs font-mono font-bold text-[#1D78A0] block mb-1">
                📦 Pengiriman Kado Fisik:
              </span>
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

        <h3 className="font-handwriting text-5xl sm:text-6xl text-white my-1">
          {groom.name} <span className="font-script text-3xl text-[#FFE58F]">&</span> {bride.name}
        </h3>

        <div className="mt-4 text-xs font-mono text-[#FFE58F] font-bold">
          {data.general?.hashtag || "#GilangSalsaHalal"}
        </div>
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
  isPreview = false,
  onOpenChange,
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState<boolean>(isPreview);

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
      <div className="min-h-screen bg-[#EBF4F8] flex flex-col lg:flex-row relative">
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
                  12:12 🏙️
                </span>
                <div className="w-20 h-3.5 bg-[#0C4A60] rounded-full flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38B6FF]" />
                  <span className="w-6 h-1 rounded-full bg-[#2E8BC0]" />
                </div>
                <span className="text-[10px] font-mono text-[#E8F4F8]">
                  100% 🔋
                </span>
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
                <RsvpSection />
                <CityscapeFooter />

                {/* Floating Navigation Dock & Audio Player */}
                <NavigationDock />
                <AudioPlayer autoPlayTrigger={isOpened} />
              </div>
            )}
          </main>
        </div>
      </div>
    </WeddingDataProvider>
  );
}

export default CityscapeTemplate;
