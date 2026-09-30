"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Download, ExternalLink, Heart } from "lucide-react";
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
    "Undangan Pernikahan Dimas Arya Pratama & Sarah Annisa Larasati"
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
        {/* Subtle Paper Badge */}
        <MotionReveal variant="fade-up" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif tracking-widest uppercase bg-[#FFFDF9] text-[#7A6652] border border-[#DECDB8] shadow-xs mb-4">
            <Heart className="w-3.5 h-3.5 text-[#C26D53] fill-current" />
            The Wedding Celebration
            <Heart className="w-3.5 h-3.5 text-[#C26D53] fill-current" />
          </div>
        </MotionReveal>

        {/* Couple Names with Gold Foil Shimmer */}
        <MotionReveal variant="paper-unfold" delay={0.2}>
          <h1 className="font-handwriting text-6xl sm:text-7xl md:text-8xl gold-foil-text tracking-wide my-2">
            Dimas <span className="font-script text-4xl sm:text-5xl text-[#C26D53]">&</span> Sarah
          </h1>

          <p className="font-serif italic text-sm sm:text-base text-[#7B6652] tracking-widest uppercase mb-8">
            Sabtu, 12 Desember 2026 • Jakarta & Depok
          </p>
        </MotionReveal>

        {/* Main Photo Placeholder (Polaroid with 3D Parallax Tilt) */}
        <MotionReveal variant="polaroid-drop" delay={0.35}>
          <div className="my-6 flex justify-center">
            <PhotoPlaceholder
              variant="couple"
              caption="Dimas & Sarah — Menyongsong Hari Bahagia"
              tag="OUR MOMENTS"
              tapePosition="both-top"
              tiltAngle="straight"
              className="w-full max-w-sm"
            />
          </div>
        </MotionReveal>

        {/* Paper Countdown Timer */}
        <MotionReveal variant="fade-up" delay={0.45}>
          <div className="mt-10 mb-8">
            <div className="inline-block paper-sheet-kraft rounded-2xl p-4 sm:p-6 border border-[#D8C4A9] shadow-md max-w-lg w-full">
              <div className="flex items-center justify-center gap-2 mb-4 text-[#6A5745]">
                <Clock className="w-4 h-4 text-[#C26D53]" />
                <span className="font-serif uppercase tracking-widest text-xs font-semibold">
                  Menghitung Hari Bahagia
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <CountdownCard value={timeLeft.days} label="Hari" />
                <CountdownCard value={timeLeft.hours} label="Jam" />
                <CountdownCard value={timeLeft.minutes} label="Menit" />
                <CountdownCard value={timeLeft.seconds} label="Detik" />
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* Save The Date Buttons */}
        <MotionReveal variant="fade-up" delay={0.55}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium bg-[#A85A42] hover:bg-[#924B35] text-[#FFFDF9] shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              Google Calendar
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadIcs}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium bg-[#FFFDF9] hover:bg-[#F5EFEB] text-[#554538] border border-[#D5C2AA] shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#A85A42]" />
              Simpan Kalender (iCal)
            </motion.button>
          </div>
        </MotionReveal>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#F4EFE6" />
      </div>
    </section>
  );
}

// Paper Countdown Unit Card with smooth number animation
function CountdownCard({ value, label }: { value: number; label: string }) {
  const formatted = String(value).padStart(2, "0");

  return (
    <div className="paper-sheet rounded-xl p-2.5 sm:p-3 text-center border border-[#DECBB4]">
      <motion.div
        key={value}
        initial={{ y: -4, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="font-serif text-2xl sm:text-4xl font-bold text-[#3E3126] tracking-tight"
      >
        {formatted}
      </motion.div>
      <div className="text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#8A7663] mt-0.5">
        {label}
      </div>
    </div>
  );
}
