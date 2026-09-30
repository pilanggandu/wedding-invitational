"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Download, ExternalLink, Heart, Sparkles } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import { PhotoPlaceholder, BotanicalLeaves, TornPaperDivider } from "./PaperArtDecorations";
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
    <section id="beranda" className="relative pt-16 pb-20 overflow-hidden paper-texture">
      {/* Decorative Botanical Leaf Cutouts with natural sway */}
      <BotanicalLeaves className="absolute -top-6 -left-8 w-40 sm:w-56 h-60 opacity-40 rotate-12 pointer-events-none" />
      <BotanicalLeaves className="absolute top-1/4 -right-10 w-44 sm:w-60 h-64 opacity-40 -rotate-45 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Cute Badge with Heart */}
        <MotionReveal variant="fade-up" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-script font-bold tracking-wider uppercase bg-[#FFF0F3] text-[#7D1128] border-2 border-[#7D1128] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D63D56]" />
            Official Wedding of Two Dorks!
            <Sparkles className="w-3.5 h-3.5 text-[#D63D56]" />
          </div>
        </MotionReveal>

        {/* Couple Names with Maroon Shimmer */}
        <MotionReveal variant="paper-unfold" delay={0.2}>
          <h1 className="font-handwriting text-6xl sm:text-7xl md:text-8xl maroon-shimmer-text tracking-wide my-1">
            Dimas <span className="font-script text-4xl sm:text-5xl text-[#7D1128]">&</span> Sarah
          </h1>

          <p className="font-script text-lg sm:text-2xl text-[#660F1A] font-bold max-w-lg mx-auto mb-3">
            &ldquo;{WEDDING_DATA.general.funTagline}&rdquo;
          </p>

          <div className="inline-block bg-[#FFE58F] text-[#4A0812] px-3.5 py-1 rounded-full border-2 border-[#4A0812] text-xs font-mono font-bold mb-6 rotate-[-1deg]">
            📅 Sabtu, 12 Desember 2026 • Depok & Jakarta
          </div>
        </MotionReveal>

        {/* Main Photo Placeholder (Chibi Couple Drawing Polaroid) */}
        <MotionReveal variant="polaroid-drop" delay={0.35}>
          <div className="my-4 flex justify-center">
            <PhotoPlaceholder
              variant="couple"
              caption="Dimas & Sarah — Siap Menempuh Hidup Baru Penuh Tawa!"
              tag="FOREVER LOVE"
              stickerText="100% Cocok! 💖"
              tapePosition="both-top"
              tiltAngle="straight"
              className="w-full max-w-sm"
            />
          </div>
        </MotionReveal>

        {/* Paper Countdown Timer with Cute Doodle Box */}
        <MotionReveal variant="fade-up" delay={0.45}>
          <div className="mt-8 mb-8">
            <div className="inline-block doodle-box p-5 sm:p-7 max-w-lg w-full bg-[#FFF9FA]">
              <div className="flex items-center justify-center gap-2 mb-4 text-[#7D1128]">
                <Clock className="w-4 h-4 text-[#D63D56] animate-spin" style={{ animationDuration: "6s" }} />
                <span className="font-script font-bold text-lg sm:text-xl">
                  Hitung Mundur Menuju Hari Sah! ⏰🥳
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <CountdownCard value={timeLeft.days} label="Hari Lagi" />
                <CountdownCard value={timeLeft.hours} label="Jam" />
                <CountdownCard value={timeLeft.minutes} label="Menit" />
                <CountdownCard value={timeLeft.seconds} label="Detik" />
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* Save The Date Buttons with Doodle Tactile Feel */}
        <MotionReveal variant="fade-up" delay={0.55}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="doodle-button inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-sans font-bold cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Ingatkan di Google Calendar
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </a>

            <button
              onClick={downloadIcs}
              className="doodle-button-alt inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-sans font-bold cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#7D1128]" />
              Simpan Kalender (iCal)
            </button>
          </div>
        </MotionReveal>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FFF5F6" />
      </div>
    </section>
  );
}

// Countdown Card with Cute Doodle Box
function CountdownCard({ value, label }: { value: number; label: string }) {
  const formatted = String(value).padStart(2, "0");

  return (
    <div className="bg-white rounded-xl p-2 sm:p-3 text-center border-2 border-[#7D1128] shadow-[2px_3px_0px_#7D1128]">
      <motion.div
        key={value}
        initial={{ y: -3, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="font-script text-2xl sm:text-4xl font-bold text-[#660F1A] tracking-tight"
      >
        {formatted}
      </motion.div>
      <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#9E2A3B] mt-0.5">
        {label}
      </div>
    </div>
  );
}
