"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Heart, Sparkles, Smartphone, Music, MapPin } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import {
  KidsDrawingCouple,
  KidsDrawingSun,
  KidsDrawingHeart,
  KidsDrawingStar,
  CrayonWashiTape,
  PaperStamp,
  BotanicalLeaves,
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
    <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] lg:h-screen lg:sticky lg:top-0 p-8 xl:p-12 flex-col justify-between overflow-y-auto bg-[#660F1A] text-white border-r-[4px] border-[#3D070E] shadow-2xl relative select-none">
      {/* Background Decorative Doodles */}
      <BotanicalLeaves className="absolute -top-10 -left-10 w-44 h-64 opacity-20 rotate-45 pointer-events-none" />
      <BotanicalLeaves className="absolute -bottom-10 -right-10 w-48 h-68 opacity-20 -rotate-135 pointer-events-none" />

      {/* Floating Sun & Stars */}
      <div className="absolute top-6 left-6 pointer-events-none opacity-85">
        <KidsDrawingSun className="w-14 h-14" />
      </div>
      <div className="absolute top-10 right-28 pointer-events-none opacity-70">
        <KidsDrawingStar className="w-8 h-8 text-[#FFE58F]" />
      </div>

      {/* Floating Decorative Stamp */}
      <div className="absolute top-6 right-6">
        <PaperStamp text="RESMI SAH" date="12 • 12 • 2026" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 mt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-script font-bold tracking-wider uppercase bg-[#FFE58F] text-[#4A0812] border-2 border-[#4A0812] shadow-[2px_2px_0px_#3D070E] mb-3 rotate-[-1.5deg]">
          <Sparkles className="w-3.5 h-3.5 text-[#7D1128]" />
          Buku Sketsa Bahagia: Dimas & Sarah
        </div>

        <h1 className="font-handwriting text-6xl xl:text-7xl text-[#FFF0F3] drop-shadow-md my-1 leading-tight tracking-wide">
          Dimas <span className="font-script text-4xl text-[#F5A8B8]">&</span> Sarah
        </h1>

        <p className="font-script text-xl xl:text-2xl text-[#FAD2D8] font-bold mt-1 max-w-md">
          &ldquo;{WEDDING_DATA.general.funTagline}&rdquo;
        </p>

        <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-mono font-bold">
          <span className="bg-[#4A0812] text-[#FFE58F] px-3.5 py-1.5 rounded-full border border-[#D63D56]/50 flex items-center gap-1.5 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#F5A8B8]" />
            Sabtu, 12 Desember 2026
          </span>
          <span className="bg-[#4A0812] text-[#FFE58F] px-3.5 py-1.5 rounded-full border border-[#D63D56]/50 flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#F5A8B8]" />
            Depok & Jakarta
          </span>
        </div>
      </div>

      {/* Center Drawing Art Showcase Card */}
      <div className="my-5 relative z-10">
        <div className="bg-[#FFF0F3] text-[#4A0812] rounded-3xl p-6 border-[3px] border-[#3D070E] shadow-[6px_7px_0px_#3D070E] relative">
          {/* Cute Washi Tape on corner */}
          <CrayonWashiTape
            text="♥ LOVEBIRDS CUTE ♥"
            color="gold"
            className="absolute -top-3.5 left-8 z-20"
          />

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Childlike Drawing Couple Illustration */}
            <div className="w-36 h-36 shrink-0 bg-white rounded-2xl border-2 border-[#660F1A] p-2 flex items-center justify-center shadow-sm">
              <KidsDrawingCouple className="w-full h-full" />
            </div>

            {/* Funny Speech Bubbles & Bio */}
            <div className="flex-1 text-left space-y-2.5">
              <div className="bg-white p-3 rounded-2xl border-2 border-[#660F1A] shadow-[2px_3px_0px_#660F1A]">
                <p className="text-xs font-script font-bold text-[#660F1A] leading-snug">
                  💬 <strong>Dimas:</strong> &ldquo;Siap nemenin jajan boba dan nurutin apa kata nyonya rumah!&rdquo;
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border-2 border-[#660F1A] shadow-[2px_3px_0px_#660F1A]">
                <p className="text-xs font-script font-bold text-[#660F1A] leading-snug">
                  💬 <strong>Sarah:</strong> &ldquo;Siap ketawa denger lelucon garing Mas Dimas selamanya!&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Live Countdown in Harmonious Maroon & Gold Boxes */}
          <div className="mt-5 pt-4 border-t-2 border-dashed border-[#8A1C2C]/30 text-center">
            <span className="text-xs font-script font-bold text-[#7D1128] block mb-2.5">
              ⏰ Menuju Ijab Kabul & Resepsi Pesta Bahagia:
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded-xl p-2 border-2 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#660F1A] block">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Hari</span>
              </div>
              <div className="bg-[#FFFDF0] rounded-xl p-2 border-2 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#8A5A10] block">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#8A5A10] uppercase">Jam</span>
              </div>
              <div className="bg-[#FFF5F6] rounded-xl p-2 border-2 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#7D1128] block">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Menit</span>
              </div>
              <div className="bg-white rounded-xl p-2 border-2 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#660F1A] block">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Detik</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: QR Code & Mobile Simulation Hint */}
      <div className="relative z-10 pt-3 border-t-2 border-white/20 flex items-center justify-between gap-4">
        {/* Mobile scan badge */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-2xl border-2 border-[#FFE58F] p-1.5 flex items-center justify-center shrink-0 shadow-md">
            {/* Stylized QR Code SVG in Maroon */}
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

              {/* Data dots in maroon and gold */}
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
              Gunakan perangkat ponsel atau scroll simulasi ponsel di sisi kanan 👉
            </p>
          </div>
        </div>

        {/* Music indicator */}
        <div className="hidden xl:flex items-center gap-2 bg-[#4A0812] px-3.5 py-1.5 rounded-full border border-[#D63D56]/40 text-right shadow-sm">
          <Music className="w-3.5 h-3.5 text-[#F5A8B8] animate-bounce" />
          <span className="text-[10px] font-mono font-bold text-[#FAD2D8]">
            Acoustic Serenade
          </span>
        </div>
      </div>
    </div>
  );
}
