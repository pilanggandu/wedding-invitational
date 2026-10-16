"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Palette, Sparkles } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ExtractedColors } from "@/lib/colorExtractor";

interface AmbientBlurDesktopLeftProps {
  isOpened: boolean;
  onOpen: () => void;
  palette?: ExtractedColors;
}

export function AmbientBlurDesktopLeft({
  isOpened,
  onOpen,
  palette,
}: AmbientBlurDesktopLeftProps) {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const mainEvent = data.events?.[0];
  const dateStr = mainEvent?.displayDate || "21 November 2026";
  const dayStr = mainEvent?.displayDay || "Sabtu";

  const heroPhoto =
    data.general?.heroPhotoUrl ||
    data.general?.preweddingPhotos?.[1] ||
    "/images/prewedding/couple-2.jpg";

  const accentColor = palette?.dominant || "#D97736";
  const glowColor = palette?.glow || "rgba(217,119,54,0.3)";

  // Countdown timer
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
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data.countdownTarget]);

  return (
    <aside className="hidden lg:flex lg:w-[48%] xl:w-[50%] min-h-screen relative flex-col justify-between p-12 xl:p-16 text-slate-800 overflow-hidden select-none border-r border-slate-200/80">
      {/* Background with Luminous Pearl Frosted Veil */}
      <div className="absolute inset-0 bg-white/65 backdrop-blur-xl pointer-events-none z-0" />
      <div
        style={{
          background: `radial-gradient(circle at 10% 20%, ${accentColor}18 0%, transparent 60%),
                       radial-gradient(circle at 80% 80%, ${glowColor} 0%, transparent 60%)`,
        }}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Top Header: Atelier Title & Calendar Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}44` }}
            className="w-10 h-10 rounded-2xl border flex items-center justify-center text-slate-800 shadow-sm"
          >
            <Palette className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 block">
              Atmosfer Warna Foto Adaptif
            </span>
            <span className="font-serif text-sm font-semibold tracking-wide text-slate-800">
              {groom?.name} &amp; {bride?.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-xs text-slate-700 font-mono shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Center Showcase Card */}
      <div className="relative z-10 my-auto max-w-lg space-y-6">
        {/* Prewedding Portrait with Dynamic Border Halo */}
        <div
          style={{
            borderColor: `${accentColor}66`,
            boxShadow: `0 20px 45px rgba(15, 23, 42, 0.12), 0 0 40px ${glowColor}`,
          }}
          className="relative w-72 h-88 rounded-3xl overflow-hidden border-2 bg-slate-100 group shadow-xl"
        >
          <img
            src={heroPhoto}
            alt="Foto Prewedding Pasangan"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

          {/* Extracted Color Palette Live Badge */}
          {palette && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[10px] font-mono text-slate-800 shadow-sm">
              <span
                style={{ backgroundColor: palette.dominant }}
                className="w-2.5 h-2.5 rounded-full border border-white"
              />
              <span
                style={{ backgroundColor: palette.secondary }}
                className="w-2.5 h-2.5 rounded-full border border-white"
              />
              <span className="uppercase text-[9px] text-slate-600 font-bold">Warna Terdeteksi</span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 text-center z-20">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 block">
              Official Invitation
            </span>
            <h2
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-xl font-bold text-white tracking-tight"
            >
              {groom?.name} &amp; {bride?.name}
            </h2>
          </div>
        </div>

        {/* Big Editorial Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: accentColor }}
              className="w-2 h-2 rounded-full animate-ping"
            />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500 font-bold">
              Menghitung Hari Bahagia
            </span>
          </div>
          <h1
            style={{ fontFamily: "var(--font-couple-custom, serif)" }}
            className="text-4xl xl:text-5xl font-bold tracking-tight text-slate-900 leading-tight drop-shadow-xs"
          >
            {groom?.name} &amp; {bride?.name}
          </h1>
          <p className="text-sm text-slate-600 font-sans leading-relaxed pt-1">
            {data.general?.funTagline ||
              "Menemukan cinta itu mudah, tapi menemukan yang sefrekuensi itu anugerah terindah."}
          </p>
        </div>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "HARI", value: timeLeft.days },
            { label: "JAM", value: timeLeft.hours },
            { label: "MENIT", value: timeLeft.minutes },
            { label: "DETIK", value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/85 backdrop-blur-xl rounded-2xl p-3.5 text-center border border-slate-200/80 shadow-sm"
            >
              <span
                style={{ color: accentColor }}
                className="text-xl xl:text-2xl font-mono font-bold block"
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider block mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-200/80 pt-4">
        <span>Gunakan panel smartphone di kanan untuk interaksi lengkap</span>
        <span className="font-mono text-slate-700 font-bold">{data.general?.hashtag}</span>
      </div>
    </aside>
  );
}
