"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Heart, Sparkles, Smartphone, Music, MapPin, Smile } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import {
  KidsDrawingCouple,
  KidsDrawingSun,
  KidsDrawingBoba,
  KidsDrawingHeart,
  KidsDrawingStar,
  CrayonWashiTape,
  PaperStamp,
} from "./PaperArtDecorations";

export function DesktopLeftShowcase() {
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

  return (
    <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] lg:h-screen lg:sticky lg:top-0 p-8 xl:p-12 flex-col justify-between overflow-y-auto bg-[#FFFDF8] text-[#222222] border-r-[4px] border-[#222222] shadow-xl relative select-none paper-texture">
      {/* Playful Floating Doodles */}
      <div className="absolute top-4 left-6 pointer-events-none opacity-85">
        <KidsDrawingSun className="w-16 h-16 animate-gentle-pulse" />
      </div>

      <div className="absolute top-12 right-28 pointer-events-none opacity-70">
        <KidsDrawingStar className="w-8 h-8 text-[#FBBF24]" />
      </div>

      <div className="absolute bottom-24 left-8 pointer-events-none opacity-75">
        <KidsDrawingHeart className="w-9 h-9" />
      </div>

      {/* Floating Decorative Stamp */}
      <div className="absolute top-6 right-6">
        <PaperStamp text="RESMI SAH" date="12 • 12 • 2026" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 mt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-script font-bold tracking-wider uppercase bg-[#FEF08A] text-[#222222] border-2 border-[#222222] shadow-[2px_2px_0px_#222222] mb-3 rotate-[-1.5deg]">
          <Sparkles className="w-3.5 h-3.5 text-[#EF4444]" />
          Buku Gambar Bahagia: Dimas & Sarah
        </div>

        <h1 className="font-handwriting text-6xl xl:text-7xl rainbow-shimmer-text my-1 leading-tight tracking-wide">
          Dimas <span className="font-script text-4xl text-[#EF4444]">&</span> Sarah
        </h1>

        <p className="font-script text-xl xl:text-2xl text-[#374151] font-bold mt-1 max-w-md">
          &ldquo;{WEDDING_DATA.general.funTagline}&rdquo;
        </p>

        <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-mono font-bold">
          <span className="bg-[#FEF08A] text-[#222222] px-3 py-1 rounded-full border-2 border-[#222222] flex items-center gap-1.5 shadow-[2px_2px_0px_#222222]">
            <Calendar className="w-3.5 h-3.5 text-[#EF4444]" />
            Sabtu, 12 Desember 2026
          </span>
          <span className="bg-[#BAE6FD] text-[#0369A1] px-3 py-1 rounded-full border-2 border-[#222222] flex items-center gap-1.5 shadow-[2px_2px_0px_#222222]">
            <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
            Depok & Jakarta
          </span>
        </div>
      </div>

      {/* Center Drawing Art Showcase Card */}
      <div className="my-5 relative z-10">
        <div className="crayon-box bg-white p-6 relative">
          {/* Cute Washi Tape on corner */}
          <CrayonWashiTape
            text="♥ LOVEBIRDS CUTE ♥"
            color="yellow"
            className="absolute -top-3.5 left-8 z-20"
          />

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Childlike Drawing Couple Illustration */}
            <div className="w-36 h-36 shrink-0 bg-[#FFFDF8] rounded-2xl border-2 border-[#222222] p-2 flex items-center justify-center shadow-[3px_3px_0px_#222222]">
              <KidsDrawingCouple className="w-full h-full" />
            </div>

            {/* Funny Speech Bubbles & Bio */}
            <div className="flex-1 text-left space-y-2.5">
              <div className="bg-[#FEF9C3] p-3 rounded-2xl border-2 border-[#222222] shadow-[2px_3px_0px_#222222]">
                <p className="text-xs font-script font-bold text-[#854D0E] leading-snug">
                  💬 <strong>Dimas:</strong> &ldquo;Siap nemenin jajan boba dan nurutin apa kata nyonya rumah!&rdquo;
                </p>
              </div>
              <div className="bg-[#FCE7F3] p-3 rounded-2xl border-2 border-[#222222] shadow-[2px_3px_0px_#222222]">
                <p className="text-xs font-script font-bold text-[#9D174D] leading-snug">
                  💬 <strong>Sarah:</strong> &ldquo;Siap ketawa denger lelucon garing Mas Dimas selamanya!&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Live Countdown in 4 Colorful Crayon Boxes */}
          <div className="mt-5 pt-4 border-t-2 border-dashed border-[#222222]/30 text-center">
            <span className="text-xs font-script font-bold text-[#222222] block mb-2.5">
              ⏰ Menuju Ijab Kabul & Resepsi Pesta Ceria:
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-[#FEF08A] rounded-xl p-2 border-2 border-[#222222] text-center shadow-[2px_2px_0px_#222222]">
                <span className="font-script text-2xl font-bold text-[#854D0E] block">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#713F12] uppercase">Hari</span>
              </div>
              <div className="bg-[#BAE6FD] rounded-xl p-2 border-2 border-[#222222] text-center shadow-[2px_2px_0px_#222222]">
                <span className="font-script text-2xl font-bold text-[#0369A1] block">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#075985] uppercase">Jam</span>
              </div>
              <div className="bg-[#BBF7D0] rounded-xl p-2 border-2 border-[#222222] text-center shadow-[2px_2px_0px_#222222]">
                <span className="font-script text-2xl font-bold text-[#15803D] block">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#166534] uppercase">Menit</span>
              </div>
              <div className="bg-[#FBCFE8] rounded-xl p-2 border-2 border-[#222222] text-center shadow-[2px_2px_0px_#222222]">
                <span className="font-script text-2xl font-bold text-[#BE185D] block">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9D174D] uppercase">Detik</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: QR Code & Mobile Simulation Hint */}
      <div className="relative z-10 pt-3 border-t-2 border-dashed border-[#222222]/30 flex items-center justify-between gap-4">
        {/* Mobile scan badge */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-2xl border-2 border-[#222222] p-1.5 flex items-center justify-center shrink-0 shadow-[2px_3px_0px_#222222]">
            {/* Stylized Colorful QR Code SVG */}
            <svg viewBox="0 0 40 40" className="w-full h-full text-[#222222]" fill="currentColor">
              <rect x="2" y="2" width="10" height="10" rx="1.5" />
              <rect x="4" y="4" width="6" height="6" fill="#FFF" />
              <rect x="5.5" y="5.5" width="3" height="3" fill="#EF4444" />

              <rect x="28" y="2" width="10" height="10" rx="1.5" />
              <rect x="30" y="4" width="6" height="6" fill="#FFF" />
              <rect x="31.5" y="5.5" width="3" height="3" fill="#3B82F6" />

              <rect x="2" y="28" width="10" height="10" rx="1.5" />
              <rect x="4" y="30" width="6" height="6" fill="#FFF" />
              <rect x="5.5" y="31.5" width="3" height="3" fill="#22C55E" />

              {/* Data dots in cheerful colors */}
              <circle cx="20" cy="8" r="2" fill="#FBBF24" />
              <circle cx="20" cy="20" r="3" fill="#EC4899" />
              <circle cx="8" cy="20" r="2" fill="#3B82F6" />
              <circle cx="32" cy="20" r="2" fill="#22C55E" />
              <circle cx="20" cy="32" r="2" fill="#EF4444" />
              <circle cx="28" cy="28" r="2" fill="#F59E0B" />
              <circle cx="34" cy="34" r="2" fill="#8B5CF6" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-script font-bold text-[#222222] flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-[#3B82F6]" />
              Buka di HP Kamu!
            </span>
            <p className="text-[11px] font-sans text-[#4B5563] leading-tight">
              Gunakan perangkat ponsel atau scroll simulasi ponsel di sisi kanan 👉
            </p>
          </div>
        </div>

        {/* Music indicator */}
        <div className="hidden xl:flex items-center gap-2 bg-[#FEF08A] px-3.5 py-1.5 rounded-full border-2 border-[#222222] text-right shadow-[2px_2px_0px_#222222]">
          <Music className="w-3.5 h-3.5 text-[#EF4444] animate-bounce" />
          <span className="text-[10px] font-mono font-bold text-[#222222]">
            Melodi Ceria Bahagia
          </span>
        </div>
      </div>
    </div>
  );
}
