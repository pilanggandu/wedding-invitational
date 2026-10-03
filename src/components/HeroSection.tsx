"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Download, ExternalLink, Sparkles } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  PhotoPlaceholder,
  KidsDrawingSun,
  KidsDrawingHeart,
  KidsDrawingStar,
  BotanicalLeaves,
  TornPaperDivider,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function HeroSection() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const akadEvent = data.events[0] || {
    venueAddress: "Merakurak, Tuban",
    displayDate: "21 November 2026",
    displayDay: "Sabtu",
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
    const target = new Date(data.countdownTarget || "2026-11-21T08:00:00+07:00").getTime();

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
  }, [data.countdownTarget]);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Pernikahan ${groom.name} & ${bride.name}`
  )}&dates=20261121T010000Z/20261121T080000Z&details=${encodeURIComponent(
    `Undangan Pernikahan Paling Seru: ${groom.fullName} & ${bride.fullName}`
  )}&location=${encodeURIComponent(receptionEvent.venueAddress)}`;

  const downloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//The Wedding of Gilang & Salsadila//ID",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:The Wedding of ${groom.name} & ${bride.name}`,
      `DESCRIPTION:Pernikahan ${groom.fullName} & ${bride.fullName}`,
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
    link.setAttribute("download", "Wedding-Gilang-Salsadila.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="beranda" className="relative pt-14 pb-20 overflow-hidden paper-texture bg-[#FFF9FA]">
      {/* Botanical & Childlike Doodles */}
      <BotanicalLeaves className="absolute -top-6 -left-8 w-40 sm:w-56 h-60 opacity-30 rotate-12 pointer-events-none" />
      <BotanicalLeaves className="absolute top-1/3 -right-10 w-44 sm:w-60 h-64 opacity-30 -rotate-45 pointer-events-none" />

      <div className="absolute top-4 right-4 pointer-events-none opacity-80">
        <KidsDrawingSun className="w-14 h-14" />
      </div>
      <div className="absolute top-2/3 left-2 pointer-events-none opacity-75">
        <KidsDrawingHeart className="w-9 h-9" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Childlike Badge with Heart */}
        <MotionReveal variant="fade-up" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-script font-bold tracking-wider uppercase bg-[#FFF0F3] text-[#7D1128] border-2 border-[#7D1128] shadow-xs mb-3 rotate-[-1deg]">
            <Sparkles className="w-3.5 h-3.5 text-[#D63D56]" />
            Buku Sketsa Bahagia: Pernikahan Kami!
            <Sparkles className="w-3.5 h-3.5 text-[#D63D56]" />
          </div>
        </MotionReveal>

        {/* Couple Names with Maroon Shimmer */}
        <MotionReveal variant="paper-unfold" delay={0.2}>
          <h1 className="font-handwriting text-6xl sm:text-7xl md:text-8xl maroon-shimmer-text tracking-wide my-1">
            {groom.name} <span className="font-script text-4xl sm:text-5xl text-[#7D1128]">&</span> {bride.name}
          </h1>

          <p className="font-script text-lg sm:text-2xl text-[#660F1A] font-bold max-w-lg mx-auto mb-3">
            &ldquo;{data.general.funTagline}&rdquo;
          </p>

          <div className="inline-block bg-[#FFE58F] text-[#4A0812] px-4 py-1 rounded-full border-2 border-[#4A0812] text-xs font-mono font-bold mb-6 rotate-[-1deg] shadow-[2px_2px_0px_#4A0812]">
            📅 {akadEvent.displayDay}, {akadEvent.displayDate} • {akadEvent.venueAddress || "Merakurak, Tuban"}
          </div>
        </MotionReveal>

        {/* Main Photo Placeholder (Childlike Couple Drawing Polaroid) */}
        <MotionReveal variant="polaroid-drop" delay={0.35}>
          <div className="my-4 flex justify-center">
            <PhotoPlaceholder
              variant="couple"
              caption="Gilang & Salsadila: Siap Menempuh Hidup Baru Penuh Tawa!"
              tag="CINTA SEJATI"
              stickerText="100% Cocok! 💖"
              tapePosition="both-top"
              tiltAngle="straight"
              className="w-full max-w-sm"
            />
          </div>
        </MotionReveal>

        {/* Paper Countdown Timer in Maroon & Gold */}
        <MotionReveal variant="fade-up" delay={0.45}>
          <div className="mt-8 mb-8">
            <div className="inline-block crayon-box p-5 sm:p-7 max-w-lg w-full bg-[#FFF0F3] border-[#660F1A]">
              <div className="flex items-center justify-center gap-2 mb-4 text-[#7D1128]">
                <Clock className="w-4 h-4 text-[#D63D56] animate-spin" style={{ animationDuration: "6s" }} />
                <span className="font-script font-bold text-lg sm:text-xl">
                  Hitung Mundur Menuju Hari Sah! ⏰🥳
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <CountdownCard value={timeLeft.days} label="Hari Lagi" bgClass="bg-white" textClass="text-[#660F1A]" />
                <CountdownCard value={timeLeft.hours} label="Jam" bgClass="bg-[#FFFDF0]" textClass="text-[#8A5A10]" />
                <CountdownCard value={timeLeft.minutes} label="Menit" bgClass="bg-[#FFF5F6]" textClass="text-[#7D1128]" />
                <CountdownCard value={timeLeft.seconds} label="Detik" bgClass="bg-white" textClass="text-[#660F1A]" />
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* Save The Date Buttons in Maroon & Gold */}
        <MotionReveal variant="fade-up" delay={0.55}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="crayon-button inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-sans font-bold cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#FFE58F]" />
              Ingatkan di Google Calendar
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={downloadIcs}
              className="crayon-button-alt inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-sans font-bold cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#7D1128]" />
              Simpan Kalender (iCal)
            </motion.button>
          </div>
        </MotionReveal>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FFF0F3" />
      </div>
    </section>
  );
}

// Countdown Card with Childlike Maroon Box & Spring Number Pop
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
    <motion.div
      whileHover={{ scale: 1.06, y: -2 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className={`${bgClass} rounded-xl p-2 sm:p-3 text-center border-2 border-[#660F1A] shadow-[2px_3px_0px_#660F1A] cursor-default`}
    >
      <motion.div
        key={value}
        initial={{ y: -6, scale: 0.88, opacity: 0.6 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className={`font-script text-2xl sm:text-4xl font-bold ${textClass} tracking-tight`}
      >
        {formatted}
      </motion.div>
      <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#9E2A3B] mt-0.5">
        {label}
      </div>
    </motion.div>
  );
}
