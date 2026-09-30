"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Download, ExternalLink, Sparkles } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import {
  PhotoPlaceholder,
  KidsDrawingSun,
  KidsDrawingHeart,
  KidsDrawingStar,
  TornPaperDivider,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(WEDDING_DATA.countdownTarget).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Pernikahan Dimas & Sarah"
  )}&dates=20261212T010000Z/20261212T070000Z&details=${encodeURIComponent(
    "Undangan Pernikahan Paling Seru: Dimas Arya Pratama & Sarah Annisa Larasati"
  )}&location=${encodeURIComponent("Grand Cempaka Ballroom, Jakarta")}`;

  const downloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//The Wedding of Dimas & Sarah//ID",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "SUMMARY:The Wedding of Dimas & Sarah",
      "DESCRIPTION:Pernikahan Dimas Arya Pratama & Sarah Annisa Larasati",
      "LOCATION:Grand Cempaka Ballroom & Masjid Kubah Emas",
      "DTSTART:20261212T010000Z",
      "DTEND:20261212T070000Z",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Wedding-Dimas-Sarah.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="beranda" className="relative pt-14 pb-20 overflow-hidden paper-texture bg-[#FFFDF8]">
      {/* Decorative Childlike Floating Doodles */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-85">
        <KidsDrawingSun className="w-16 h-16 animate-gentle-pulse" />
      </div>
      <div className="absolute top-1/4 -right-2 pointer-events-none opacity-75">
        <KidsDrawingHeart className="w-10 h-10" />
      </div>
      <div className="absolute top-2/3 left-2 pointer-events-none opacity-80">
        <KidsDrawingStar className="w-9 h-9 text-[#FBBF24]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Childlike Badge with Heart */}
        <MotionReveal variant="fade-up" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-script font-bold tracking-wider uppercase bg-[#FEF08A] text-[#222222] border-2 border-[#222222] shadow-[2px_2px_0px_#222222] mb-3 rotate-[-1deg]">
            <Sparkles className="w-3.5 h-3.5 text-[#EF4444]" />
            Buku Gambar Bahagia: Pernikahan Kami!
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
          </div>
        </MotionReveal>

        {/* Couple Names with Rainbow Shimmer */}
        <MotionReveal variant="paper-unfold" delay={0.2}>
          <h1 className="font-handwriting text-6xl sm:text-7xl md:text-8xl rainbow-shimmer-text tracking-wide my-1">
            Dimas <span className="font-script text-4xl sm:text-5xl text-[#EF4444]">&</span> Sarah
          </h1>

          <p className="font-script text-lg sm:text-2xl text-[#374151] font-bold max-w-lg mx-auto mb-3">
            &ldquo;{WEDDING_DATA.general.funTagline}&rdquo;
          </p>

          <div className="inline-block bg-[#BAE6FD] text-[#0369A1] px-4 py-1 rounded-full border-2 border-[#222222] text-xs font-mono font-bold mb-6 rotate-[-1deg] shadow-[2px_2px_0px_#222222]">
            📅 Sabtu, 12 Desember 2026 • Depok & Jakarta
          </div>
        </MotionReveal>

        {/* Main Photo Placeholder (Childlike Couple Drawing Polaroid) */}
        <MotionReveal variant="polaroid-drop" delay={0.35}>
          <div className="my-4 flex justify-center">
            <PhotoPlaceholder
              variant="couple"
              caption="Dimas & Sarah: Siap Menempuh Hidup Baru Penuh Tawa!"
              tag="CINTA SEJATI"
              stickerText="100% Cocok! 💖"
              tapePosition="both-top"
              tiltAngle="straight"
              className="w-full max-w-sm"
            />
          </div>
        </MotionReveal>

        {/* Paper Countdown Timer with Childlike Crayon Box */}
        <MotionReveal variant="fade-up" delay={0.45}>
          <div className="mt-8 mb-8">
            <div className="inline-block crayon-box p-5 sm:p-7 max-w-lg w-full bg-white">
              <div className="flex items-center justify-center gap-2 mb-4 text-[#222222]">
                <Clock className="w-4 h-4 text-[#EF4444] animate-spin" style={{ animationDuration: "6s" }} />
                <span className="font-script font-bold text-lg sm:text-xl">
                  Hitung Mundur Menuju Hari Sah! ⏰🥳
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <CountdownCard value={timeLeft.days} label="Hari Lagi" bgClass="bg-[#FEF08A]" textClass="text-[#854D0E]" />
                <CountdownCard value={timeLeft.hours} label="Jam" bgClass="bg-[#BAE6FD]" textClass="text-[#0369A1]" />
                <CountdownCard value={timeLeft.minutes} label="Menit" bgClass="bg-[#BBF7D0]" textClass="text-[#15803D]" />
                <CountdownCard value={timeLeft.seconds} label="Detik" bgClass="bg-[#FBCFE8]" textClass="text-[#BE185D]" />
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* Save The Date Buttons with Crayon Tactile Feel */}
        <MotionReveal variant="fade-up" delay={0.55}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="crayon-button inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-sans font-bold cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Ingatkan di Google Calendar
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </a>

            <button
              onClick={downloadIcs}
              className="crayon-button-alt inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-sans font-bold cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#EF4444]" />
              Simpan Kalender (iCal)
            </button>
          </div>
        </MotionReveal>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FEF9E7" />
      </div>
    </section>
  );
}

// Countdown Card with Childlike Colorful Box
function CountdownCard({
  value,
  label,
  bgClass,
  textClass,
}: {
  value: number;
  label: string;
  bgClass: string;
  textClass: string;
}) {
  const formatted = String(value).padStart(2, "0");

  return (
    <div className={`${bgClass} rounded-xl p-2 sm:p-3 text-center border-2 border-[#222222] shadow-[2px_3px_0px_#222222]`}>
      <motion.div
        key={value}
        initial={{ y: -3, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`font-script text-2xl sm:text-4xl font-bold ${textClass} tracking-tight`}
      >
        {formatted}
      </motion.div>
      <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#222222] mt-0.5">
        {label}
      </div>
    </div>
  );
}
