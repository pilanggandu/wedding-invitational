"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ExtractedColors } from "@/lib/colorExtractor";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";
import { CharMotionReveal } from "@/components/CharMotionReveal";

interface AmbientBlurHeroProps {
  palette?: ExtractedColors;
}

export function AmbientBlurHero({ palette }: AmbientBlurHeroProps) {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const mainEvent = data.events?.[0];
  const dateStr = mainEvent?.displayDate || "21 November 2026";
  const dayStr = mainEvent?.displayDay || "Sabtu";

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
    <SectionMotion id="hero" className="relative pt-12 pb-16 px-6 text-center text-slate-800 overflow-hidden">
      <div className="max-w-md mx-auto space-y-7">
        {/* Top Atmosphere Accent Badge */}
        <ItemMotion variant="slide-down" float={true} floatDistance={3} floatDuration={4} className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-[10px] font-mono tracking-widest text-slate-700 shadow-sm ring-1 ring-slate-900/5">
            <span
              style={{ backgroundColor: accentColor }}
              className="w-1.5 h-1.5 rounded-full"
            />
            <span className="font-semibold">MOMEN SAKRAL PERNIKAHAN</span>
          </div>
        </ItemMotion>

        {/* Sacred Quote Card in Pearl Glass */}
        <ItemMotion
          variant="slide-up"
          delay={0.1}
          style={{
            borderColor: `${accentColor}33`,
            boxShadow: `0 15px 35px rgba(15, 23, 42, 0.06), 0 0 30px ${glowColor}`,
          }}
          className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 border shadow-md space-y-3"
        >
          {data.general?.quote?.arabic && (
            <p className="font-serif text-sm sm:text-base text-slate-900 leading-loose dir-rtl font-medium">
              {data.general.quote.arabic}
            </p>
          )}
          <p className="text-xs text-slate-600 leading-relaxed font-sans italic">
            &ldquo;{data.general?.quote?.translation || "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram dan damai kepadanya."}&rdquo;
          </p>
          <span
            style={{ color: accentColor }}
            className="inline-block text-[10px] font-mono uppercase tracking-widest font-bold"
          >
            {data.general?.quote?.source || "QS. Ar-Rum: 21"}
          </span>
        </ItemMotion>

        {/* Large Central Prewedding Photo Showcase */}
        <ItemMotion
          variant="frame-mount"
          delay={0.15}
          style={{
            borderColor: `${accentColor}44`,
            boxShadow: `0 24px 60px rgba(15, 23, 42, 0.08), 0 0 45px ${glowColor}`,
          }}
          className="relative rounded-[32px] overflow-hidden border-2 bg-white/70 p-2 shadow-2xl group"
        >
          <div className="relative h-96 sm:h-[420px] w-full rounded-[26px] overflow-hidden">
            <img
              src={data.general?.heroPhotoUrl || "/images/prewedding/couple-2.jpg"}
              alt="Mempelai"
              className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-1000"
            />
            {/* Viewfinder Corner Overlays */}
            <div className="absolute inset-0 pointer-events-none select-none p-2.5 z-10 opacity-70">
              <img
                src="/images/templates/ambient-blur/modern-viewfinder-crosshairs.svg"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Light Chromatic Sheer Gradient Veil */}
            <div
              style={{
                background: `linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 40%, transparent 70%)`,
              }}
              className="absolute inset-0 pointer-events-none"
            />

            {/* Live Palette Extraction Spectrum Bar on Photo */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
              <ItemMotion variant="slide-left" delay={0.25} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-md text-[9px] font-mono font-bold text-slate-800">
                <span
                  style={{ backgroundColor: accentColor }}
                  className="w-2 h-2 rounded-full ring-2 ring-white animate-pulse"
                />
                <span>Palet Foto: {accentColor.toUpperCase()}</span>
              </ItemMotion>
              <ItemMotion variant="slide-right" delay={0.25} className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette?.dominant || accentColor }} />
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette?.secondary || "#cbd5e1" }} />
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette?.light || "#f8fafc" }} />
              </ItemMotion>
            </div>

            {/* Couple Title Embedded on Lower Photo */}
            <ItemMotion variant="slide-up" delay={0.3} className="absolute bottom-4 left-4 right-4 text-left text-white">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/80 font-semibold block mb-0.5">
                The Wedding of
              </span>
              <h1
                style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight drop-shadow-md"
              >
                <CharMotionReveal
                  text={`${groom?.name} & ${bride?.name}`}
                  delay={0.3}
                  step={0.035}
                />
              </h1>
              <p className="text-xs font-mono text-white/90 tracking-wide mt-1 flex items-center gap-2">
                <span>{dayStr}, {dateStr}</span>
                <span>&bull;</span>
                <span className="text-[11px] opacity-90">{mainEvent?.venueName || "Tuban"}</span>
              </p>
            </ItemMotion>
          </div>
        </ItemMotion>

        {/* Digital Countdown Timer Dock */}
        <ItemMotion
          variant="slide-up"
          delay={0.25}
          style={{
            borderColor: `${accentColor}33`,
            boxShadow: `0 15px 35px rgba(15, 23, 42, 0.05)`,
          }}
          className="bg-white/90 backdrop-blur-2xl rounded-3xl p-5 border shadow-lg space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-semibold text-slate-700">
            <Clock style={{ color: accentColor }} className="w-3.5 h-3.5" />
            <span>Hitung Mundur Acara</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            {[
              { val: timeLeft.days, label: "HARI" },
              { val: timeLeft.hours, label: "JAM" },
              { val: timeLeft.minutes, label: "MENIT" },
              { val: timeLeft.seconds, label: "DETIK" },
            ].map((item, idx) => (
              <ItemMotion
                key={idx}
                variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
                delay={0.3 + idx * 0.05}
                style={{ borderColor: `${accentColor}22` }}
                className="bg-slate-50/90 rounded-2xl p-2.5 border shadow-2xs"
              >
                <span
                  style={{ color: accentColor }}
                  className="font-bold text-xl sm:text-2xl block tracking-tight"
                >
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block mt-0.5">
                  {item.label}
                </span>
              </ItemMotion>
            ))}
          </div>

          <div className="pt-1 flex items-center justify-center gap-2 text-xs text-slate-600 font-sans">
            <Calendar style={{ color: accentColor }} className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">{dayStr}, {dateStr}</span>
          </div>
        </ItemMotion>

        <div className="flex justify-center pt-2 opacity-70 pointer-events-none select-none">
          <img
            src="/images/templates/ambient-blur/fluid-wave-divider.svg"
            alt=""
            aria-hidden="true"
            className="w-full max-w-xs h-auto object-contain"
          />
        </div>
      </div>
    </SectionMotion>
  );
}
