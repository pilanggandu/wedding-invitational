"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Film, Radio } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { CharMotionReveal } from "@/components/CharMotionReveal";
import {
  FilmClapperIcon,
  FilmTimecodeBadge,
  ModernHairlineDivider,
  CameraCropMarks,
} from "./CinematicDecorations";

interface CinematicDesktopLeftProps {
  isOpened: boolean;
  onOpen: () => void;
}

export function CinematicDesktopLeft({
  isOpened,
  onOpen,
}: CinematicDesktopLeftProps) {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const mainEvent = data.events?.[0];
  const dateStr = mainEvent?.displayDate || "21 November 2026";
  const dayStr = mainEvent?.displayDay || "Sabtu";

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
    <aside className="hidden lg:flex lg:w-[48%] xl:w-[50%] min-h-screen relative flex-col justify-between p-12 xl:p-16 text-[#FAF8F5] overflow-hidden select-none border-r border-white/10">
      {/* Background with Dark Frosted Veil */}
      <div className="absolute inset-0 bg-[#090B10]/75 backdrop-blur-md pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#090B10]/40 to-[#090B10]/85 pointer-events-none z-0" />

      {/* Top Header: Director's Studio HUD */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-lg">
            <FilmClapperIcon className="w-5 h-5" color="#FFFFFF" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/60 block">
              Director Studio &bull; Official Premiere
            </span>
            <span className="font-serif text-sm font-semibold tracking-wide text-white">
              {groom?.name} &amp; {bride?.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 font-mono">
          <Calendar className="w-3.5 h-3.5 text-white/70" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Center Cinematic Feature Showcase */}
      <div className="relative z-10 my-auto max-w-lg space-y-6">
        {/* Widescreen Prewedding Director's Monitor Still */}
        <div className="relative w-72 h-88 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)] border border-white/20 group">
          <CameraCropMarks />
          <img
            src={data.general?.heroPhotoUrl || data.general?.preweddingPhotos?.[1] || "/images/prewedding/couple-2.jpg"}
            alt="Prewedding Production Still"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Monitor Overlays */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono text-white/80">
            <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
            <span>DIRECTOR MONITOR</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-center z-20">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 block">
              Original Love Story
            </span>
            <h2
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-xl font-bold text-white tracking-tight"
            >
              {groom?.name} &amp; {bride?.name}
            </h2>
          </div>
        </div>

        {/* Big Editorial Title Card */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/70">
              Menghitung Waktu Tayang Utama
            </span>
          </div>
          <h1
            style={{ fontFamily: "var(--font-couple-custom, serif)" }}
            className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-md"
          >
            <CharMotionReveal text={groom?.name || ""} baseDelay={0.2} /> &amp;{" "}
            <CharMotionReveal text={bride?.name || ""} baseDelay={0.45} />
          </h1>
          <p className="text-sm text-white/70 font-sans leading-relaxed pt-1">
            {data.general?.funTagline ||
              "Menemukan cinta itu mudah, tapi menemukan yang sefrekuensi itu anugerah terindah."}
          </p>
        </div>

        <ModernHairlineDivider className="mx-0" />

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
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-3.5 text-center border border-white/20 shadow-lg"
            >
              <span className="text-xl xl:text-2xl font-mono font-bold text-white block">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-mono text-white/60 tracking-wider block mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 flex items-center justify-between text-xs text-white/50 font-sans border-t border-white/10 pt-4">
        <span>Gunakan panel smartphone di kanan untuk interaksi lengkap</span>
        <span className="font-mono text-white/80">{data.general?.hashtag}</span>
      </div>
    </aside>
  );
}
