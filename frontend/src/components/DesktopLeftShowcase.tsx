"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Sparkles, Smartphone, Music, MapPin, Mail } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { getFontFamilyCss } from "@/lib/typography";
import { CharMotionReveal } from "@/components/CharMotionReveal";
import {
  KidsDrawingCouple,
  KidsDrawingSun,
  KidsDrawingStar,
  CrayonWashiTape,
  PaperStamp,
  BotanicalLeaves,
} from "./PaperArtDecorations";

interface DesktopLeftShowcaseProps {
  onOpen?: () => void;
  isOpened?: boolean;
}

export function DesktopLeftShowcase({ onOpen, isOpened }: DesktopLeftShowcaseProps) {
  const data = useWeddingData();
  const shouldReduceMotion = useReducedMotion();
  const akadEvent = data.events[0] || {
    time: "",
    displayDay: "",
    displayDate: "",
    venueAddress: "",
  };
  const receptionEvent = data.events[1];
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(data.countdownTarget).getTime();

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

  return (
    <div
      className="hidden lg:flex lg:w-[48%] xl:w-[50%] lg:h-screen lg:sticky lg:top-0 p-8 xl:p-12 flex-col justify-between overflow-y-auto bg-[#660F1A] text-white border-r-[4px] border-[#3D070E] shadow-2xl relative select-none"
    >
      <BotanicalLeaves className="absolute -top-10 -left-10 w-44 h-64 opacity-20 rotate-45 pointer-events-none" />
      <BotanicalLeaves className="absolute -bottom-10 -right-10 w-48 h-68 opacity-20 -rotate-135 pointer-events-none" />

      <motion.div
        animate={shouldReduceMotion ? {} : { y: [-3, 3, -3], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ repeat: Infinity, duration: 7.2, ease: "easeInOut" }}
        className="absolute top-6 left-6 pointer-events-none opacity-85"
      >
        <KidsDrawingSun className="w-14 h-14" />
      </motion.div>
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [3, -3, 3], rotate: [2, -2, 2] }}
        transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 0.4 }}
        className="absolute top-10 right-28 pointer-events-none opacity-70"
      >
        <KidsDrawingStar className="w-8 h-8 text-[#FFE58F]" />
      </motion.div>

      <div className="absolute top-6 right-6">
        <PaperStamp text="RESMI SAH" date="28 • 11 • 2026" />
      </div>

      <div className="relative z-10 mt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-script font-bold tracking-wider uppercase bg-[#FFE58F] text-[#4A0812] border-2 border-[#4A0812] shadow-[2px_2px_0px_#3D070E] mb-3 rotate-[-1.5deg]">
          <Sparkles className="w-3.5 h-3.5 text-[#7D1128]" />
          Buku Sketsa Bahagia: {data.couple?.groom?.name || "Gilang"} &amp; {data.couple?.bride?.name || "Salsa"}
        </div>

        <h1
          style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
          className="font-couple-title font-handwriting text-6xl xl:text-7xl text-[#FFF0F3] drop-shadow-md my-1 leading-tight tracking-wide"
        >
          <CharMotionReveal text={data.couple?.groom?.name || "Gilang"} baseDelay={0.2} />{" "}
          <span className="font-script text-4xl text-[#F5A8B8]">&amp;</span>{" "}
          <CharMotionReveal text={data.couple?.bride?.name || "Salsa"} baseDelay={0.5} />
        </h1>

        <p className="font-script text-xl xl:text-2xl text-[#FAD2D8] font-bold mt-1 max-w-md">
          &ldquo;{data.general?.funTagline || "Perayaan pernikahan yang dipenuhi tawa, doa, dan rasa syukur."}&rdquo;
        </p>

        <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-mono font-bold">
          {akadEvent.displayDate && <span className="bg-[#4A0812] text-[#FFE58F] px-3.5 py-1.5 rounded-full border border-[#D63D56]/50 flex items-center gap-1.5 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#F5A8B8]" />
            {[akadEvent.displayDay, akadEvent.displayDate].filter(Boolean).join(", ")}
          </span>}
          {akadEvent.venueAddress && <span className="bg-[#4A0812] text-[#FFE58F] px-3.5 py-1.5 rounded-full border border-[#D63D56]/50 flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#F5A8B8]" />
            {akadEvent.venueAddress}
          </span>}
        </div>
      </div>

      <div className="my-5 relative z-10">
        <div className="bg-[#FFF0F3] text-[#4A0812] rounded-3xl p-6 border-[3px] border-[#3D070E] shadow-[6px_7px_0px_#3D070E] relative">
          <CrayonWashiTape
            text="♥ LOVEBIRDS CUTE ♥"
            color="gold"
            className="absolute -top-3.5 left-8 z-20"
          />

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-36 h-36 shrink-0 bg-white rounded-2xl border-2 border-[#660F1A] p-2 flex items-center justify-center shadow-sm">
              <KidsDrawingCouple className="w-full h-full" />
            </div>

            <div className="flex-1 text-left space-y-2.5">
              {akadEvent.time && <div className="bg-white p-3 rounded-2xl border-2 border-[#660F1A] shadow-[2px_3px_0px_#660F1A]">
                <p className="text-xs font-script font-bold text-[#660F1A] leading-snug">
                  <strong>Akad:</strong> {akadEvent.time}
                </p>
              </div>}
              {receptionEvent?.time && <div className="bg-white p-3 rounded-2xl border-2 border-[#660F1A] shadow-[2px_3px_0px_#660F1A]">
                <p className="text-xs font-script font-bold text-[#660F1A] leading-snug">
                  <strong>Resepsi:</strong> {receptionEvent.time}
                </p>
              </div>}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t-2 border-dashed border-[#8A1C2C]/30 text-center">
            <span className="text-xs font-script font-bold text-[#7D1128] block mb-2.5">
              ⏰ Menuju Ijab Kabul & Resepsi Pesta Bahagia:
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded-xl p-2 border-2 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#660F1A] block tabular-nums leading-none py-1">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Hari</span>
              </div>

              <div className="bg-[#FFFDF0] rounded-xl p-2 border-2 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#8A5A10] block tabular-nums leading-none py-1">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#8A5A10] uppercase">Jam</span>
              </div>

              <div className="bg-[#FFF5F6] rounded-xl p-2 border-2 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#7D1128] block tabular-nums leading-none py-1">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Menit</span>
              </div>

              <div className="bg-white rounded-xl p-2 border-2 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#660F1A] block tabular-nums leading-none py-1">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Detik</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t-2 border-white/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-2xl border-2 border-[#FFE58F] p-1.5 flex items-center justify-center shrink-0 shadow-md">
            <svg viewBox="0 0 40 40" className="w-full h-full text-[#660F1A]" fill="currentColor">
              <rect x="2" y="2" width="10" height="10" rx="1.5" />
              <rect x="4" y="4" width="6" height="6" fill="#FFF" />
              <rect x="5.5" y="5.5" width="3" height="3" fill="#660F1A" />

              <rect x="28" y="2" width="10" height="10" rx="1.5" />
              <rect x="30" y="4" width="6" height="6" fill="#FFF" />
              <rect x="31.5" y="5.5" width="3" height="3" fill="#660F1A" />

              <rect x="2" y="28" width="10" height="10" rx="1.5" />
              <rect x="4" y="30" width="6" height="6" fill="#FFF" />
              <rect x="5.5" y="31.5" width="3" height="3" fill="#660F1A" />

              <circle cx="20" cy="8" r="2" fill="#E5B869" />
              <circle cx="20" cy="20" r="3" fill="#660F1A" />
              <circle cx="8" cy="20" r="2" fill="#8A1C2C" />
              <circle cx="32" cy="20" r="2" fill="#E5B869" />
              <circle cx="20" cy="32" r="2" fill="#660F1A" />
              <circle cx="28" cy="28" r="2" fill="#8A1C2C" />
              <circle cx="34" cy="34" r="2" fill="#E5B869" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-script font-bold text-[#FFE58F] flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              Buka di HP Kamu!
            </span>
            <p className="text-[11px] font-sans text-[#FAD2D8] leading-tight">
              Gunakan perangkat ponsel atau simulasi ponsel di sisi kanan 👉
            </p>
          </div>
        </div>

        {!isOpened && onOpen && (
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            onClick={onOpen}
            className="group px-4 py-2 rounded-full bg-[#FFE58F] hover:bg-[#FFD966] text-[#4A0812] border-2 border-[#2D050B] shadow-[3px_3px_0px_#2D050B] font-script font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shrink-0"
            title="Buka Undangan Pernikahan"
            aria-label="Buka Undangan (Open Invitation)"
          >
            <Mail className="w-4 h-4 text-[#7D1128] group-hover:scale-110 transition-transform" />
            <span>Buka Undangan 💌</span>
          </motion.button>
        )}

        <div className="hidden xl:flex items-center gap-2 bg-[#4A0812] px-3.5 py-1.5 rounded-full border border-[#D63D56]/40 text-right shadow-sm shrink-0">
          <Music className="w-3.5 h-3.5 text-[#F5A8B8]" />
          <span className="text-[10px] font-mono font-bold text-[#FAD2D8]">
            Acoustic Serenade
          </span>
        </div>
      </div>
    </div>
  );
}
