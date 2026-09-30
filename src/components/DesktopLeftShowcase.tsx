"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Heart, Sparkles, QrCode, Smartphone, Music, MapPin } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import { BotanicalLeaves, PaperStamp } from "./PaperArtDecorations";

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
      <BotanicalLeaves className="absolute -top-10 -left-10 w-44 h-64 opacity-25 rotate-45 pointer-events-none" />
      <BotanicalLeaves className="absolute -bottom-10 -right-10 w-48 h-68 opacity-25 -rotate-135 pointer-events-none" />

      {/* Floating Decorative Stamp */}
      <div className="absolute top-8 right-8">
        <PaperStamp text="OFFICIAL SAH" date="12 • 12 • 2026" />
      </div>

      {/* Header Section */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-script font-bold tracking-wider uppercase bg-[#FFE58F] text-[#4A0812] border-1.5 border-[#4A0812] shadow-sm mb-4 rotate-[-1.5deg]">
          <Sparkles className="w-3.5 h-3.5 text-[#D63D56]" />
          Wedding of Dimas & Sarah • Desktop Showcase
        </div>

        <h1 className="font-handwriting text-6xl xl:text-7xl text-[#FFF0F3] drop-shadow-md my-1 leading-tight">
          Dimas <span className="font-script text-4xl text-[#F5A8B8]">&</span> Sarah
        </h1>

        <p className="font-script text-xl xl:text-2xl text-[#FAD2D8] font-bold mt-1 max-w-md">
          &ldquo;{WEDDING_DATA.general.funTagline}&rdquo;
        </p>

        <div className="flex items-center gap-3 mt-4 text-xs font-mono font-bold text-[#FFE58F]">
          <span className="bg-[#4A0812] px-3 py-1 rounded-full border border-[#D63D56]/50 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F5A8B8]" />
            Sabtu, 12 Desember 2026
          </span>
          <span className="bg-[#4A0812] px-3 py-1 rounded-full border border-[#D63D56]/50 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#F5A8B8]" />
            Depok & Jakarta
          </span>
        </div>
      </div>

      {/* Center Drawing Art Showcase Card */}
      <div className="my-6 relative z-10">
        <div className="bg-[#FFF0F3] text-[#4A0812] rounded-3xl p-6 border-[3px] border-[#3D070E] shadow-[6px_7px_0px_#3D070E] relative">
          {/* Cute Washi Tape on corner */}
          <div className="absolute -top-3.5 left-8 w-24 h-7 washi-tape-cute -rotate-2 rounded-xs flex items-center justify-center">
            <span className="text-[9px] font-mono font-bold text-[#8A5A10]">
              ♥ LOVEBIRDS ♥
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Chibi Couple SVG Illustration */}
            <div className="w-32 h-32 shrink-0 bg-white rounded-2xl border-2 border-[#660F1A] p-1 flex items-center justify-center shadow-xs">
              <svg
                viewBox="0 0 140 120"
                className="w-full h-full text-[#660F1A]"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Couple hugging with boba */}
                <circle cx="50" cy="38" r="18" fill="#FFF5F6" stroke="#660F1A" />
                <path d="M34 32 Q50 18 64 32" stroke="#4A0812" strokeWidth="3" fill="#4A0812" />
                <circle cx="44" cy="38" r="2.5" fill="#660F1A" />
                <circle cx="56" cy="38" r="2.5" fill="#660F1A" />
                <path d="M46 45 Q50 49 54 45" strokeWidth="2.5" />
                <circle cx="39" cy="42" r="3" fill="#F8B4C0" stroke="none" />
                <path d="M36 56 L30 102 L66 102 L62 56 Z" fill="#660F1A" stroke="#4A0812" />

                <circle cx="90" cy="40" r="18" fill="#FFF5F6" stroke="#660F1A" />
                <path d="M80 26 C98 32 108 55 106 100 C92 104 78 104 74 100" fill="#FFF0F3" stroke="#D63D56" strokeDasharray="3 3" />
                <path d="M82 39 Q86 34 90 39" strokeWidth="2.5" />
                <path d="M94 39 Q98 34 102 39" strokeWidth="2.5" />
                <path d="M88 47 Q92 51 96 47" strokeWidth="2.5" fill="#D63D56" />
                <circle cx="102" cy="44" r="3" fill="#F8B4C0" stroke="none" />
                <path d="M74 58 L70 102 L108 102 L100 58 Z" fill="#FFFFFF" stroke="#660F1A" />

                <rect x="62" y="70" width="16" height="22" rx="3" fill="#FFE58F" stroke="#660F1A" strokeWidth="2" />
                <line x1="70" y1="65" x2="70" y2="70" stroke="#D63D56" strokeWidth="3" />
              </svg>
            </div>

            {/* Funny Speech Bubbles & Bio */}
            <div className="flex-1 text-left">
              <div className="bg-white p-3 rounded-2xl border-2 border-[#660F1A] shadow-[2px_3px_0px_#660F1A] mb-2.5">
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

          {/* Desktop Live Countdown Preview */}
          <div className="mt-5 pt-4 border-t-2 border-dashed border-[#8A1C2C]/30 text-center">
            <span className="text-xs font-script font-bold text-[#7D1128] block mb-2">
              ⏰ Menuju Ijab Kabul & Resepsi:
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded-xl p-2 border-1.5 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#660F1A] block">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Hari</span>
              </div>
              <div className="bg-white rounded-xl p-2 border-1.5 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#660F1A] block">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Jam</span>
              </div>
              <div className="bg-white rounded-xl p-2 border-1.5 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#660F1A] block">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Menit</span>
              </div>
              <div className="bg-white rounded-xl p-2 border-1.5 border-[#660F1A] text-center shadow-xs">
                <span className="font-script text-2xl font-bold text-[#660F1A] block">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#9E2A3B] uppercase">Detik</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: QR Code & Mobile Prompt */}
      <div className="relative z-10 pt-2 border-t-2 border-white/20 flex items-center justify-between gap-4">
        {/* Mobile scan badge */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-2xl border-2 border-[#FFE58F] p-1.5 flex items-center justify-center shrink-0 shadow-md">
            {/* Stylized QR Code SVG */}
            <svg viewBox="0 0 40 40" className="w-full h-full text-[#660F1A]" fill="currentColor">
              <rect x="2" y="2" width="10" height="10" />
              <rect x="4" y="4" width="6" height="6" fill="#FFF" />
              <rect x="5.5" y="5.5" width="3" height="3" />

              <rect x="28" y="2" width="10" height="10" />
              <rect x="30" y="4" width="6" height="6" fill="#FFF" />
              <rect x="31.5" y="5.5" width="3" height="3" />

              <rect x="2" y="28" width="10" height="10" />
              <rect x="4" y="30" width="6" height="6" fill="#FFF" />
              <rect x="5.5" y="31.5" width="3" height="3" />

              {/* Data dots */}
              <circle cx="20" cy="8" r="2" />
              <circle cx="20" cy="20" r="3" fill="#D63D56" />
              <circle cx="8" cy="20" r="2" />
              <circle cx="32" cy="20" r="2" />
              <circle cx="20" cy="32" r="2" />
              <circle cx="28" cy="28" r="2" />
              <circle cx="34" cy="34" r="2" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-script font-bold text-[#FFE58F] flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              Buka di HP Kamu!
            </span>
            <p className="text-[11px] font-sans text-[#FAD2D8] leading-tight">
              Gunakan perangkat HP atau scroll simulasi ponsel di sisi kanan 👉
            </p>
          </div>
        </div>

        {/* Music indicator */}
        <div className="hidden xl:flex items-center gap-2 bg-[#4A0812] px-3 py-1.5 rounded-full border border-[#D63D56]/40 text-right">
          <Music className="w-3.5 h-3.5 text-[#F5A8B8] animate-bounce" />
          <span className="text-[10px] font-mono text-[#FAD2D8]">
            Acoustic Serenade
          </span>
        </div>
      </div>
    </div>
  );
}
