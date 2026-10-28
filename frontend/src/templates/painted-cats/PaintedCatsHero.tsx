"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { PaintedTextReveal } from "./PaintedTextReveal";
import {
  DoodlePawSticker,
  DoodleHeartSticker,
  DoodleSparkleSticker,
  DoodleFlowerSticker,
  WashiTape,
  BrushStrokeDivider,
} from "./PaintedDecorations";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

export function PaintedCatsHero() {
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
    <SectionMotion id="hero" className="relative pt-12 pb-16 px-6 text-center text-[#2C2623] overflow-hidden">
      <div className="max-w-md mx-auto space-y-7">
        <ItemMotion variant="slide-down" delay={0.06} className="flex items-center justify-center gap-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#F3DFD1] shadow-2xs">
            <ItemMotion float={true} floatDistance={3} floatDuration={2.8}>
              <DoodlePawSticker className="w-3.5 h-3.5" rotate={-10} />
            </ItemMotion>
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C2633C]">
              Walimatul &lsquo;Ursy
            </span>
            <ItemMotion float={true} floatDistance={3} floatDuration={3.1}>
              <DoodlePawSticker className="w-3.5 h-3.5" rotate={10} />
            </ItemMotion>
          </div>
        </ItemMotion>

        <ItemMotion
          variant="pop"
          delay={0.12}
          className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-7 border-[3px] border-white shadow-[0_14px_34px_rgba(222,125,84,0.12)] ring-1 ring-[#F3DFD1] space-y-3 relative overflow-hidden"
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
            <ItemMotion variant="stamp" delay={0.22}>
              <WashiTape color="mint" angle={-1} className="w-24 text-[8px]" />
            </ItemMotion>
          </div>

          <ItemMotion
            float={true}
            floatDistance={5}
            floatDuration={4}
            rotate={8}
            className="absolute -bottom-1 -right-1 z-10 pointer-events-none opacity-80"
          >
            <DoodleFlowerSticker className="w-10 h-10" rotate={8} />
          </ItemMotion>

          <p className="font-serif text-sm sm:text-base text-[#C2633C] leading-loose dir-rtl pt-3">
            {data.general?.quote?.arabic}
          </p>
          <p className="text-xs text-[#6E5345] leading-relaxed font-sans italic">
            &ldquo;{data.general?.quote?.translation}&rdquo;
          </p>
          <span className="inline-block text-[11px] font-sans font-bold uppercase tracking-wider text-[#9E7E6E]">
            {data.general?.quote?.source}
          </span>
        </ItemMotion>

        <ItemMotion variant="slide-up" delay={0.18} className="space-y-2 pt-2">
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C2633C] block">
            The Wedding of
          </span>

          <div className="min-h-[58px] flex items-center justify-center">
            <PaintedTextReveal
              text={`${groom?.name} & ${bride?.name}`}
              className="text-3xl sm:text-4xl font-serif font-bold text-[#38241B] tracking-tight leading-tight"
              mode="words"
              staggerDelay={0.12}
              loopFade={true}
              intervalSeconds={6.5}
            />
          </div>

          <p className="text-xs text-[#7A5B4C] font-sans font-medium tracking-wide pt-1">
            {dayStr}, {dateStr}
          </p>
        </ItemMotion>

        <div className="flex justify-center -my-1 pointer-events-none select-none">
          <img
            src="/images/templates/painted-cats/cat-paw-trail-sticker.svg"
            alt=""
            aria-hidden="true"
            className="w-48 sm:w-56 h-auto object-contain drop-shadow-sm"
          />
        </div>

        <BrushStrokeDivider />

        <div className="space-y-3">
          <ItemMotion variant="fade" delay={0.22}>
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C2633C] block">
              Menghitung Hari Menuju Hari Bahagia
            </span>
          </ItemMotion>
          <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
            {[
              { label: "Hari", value: timeLeft.days, bg: "bg-white", variant: "slide-left" as const },
              { label: "Jam", value: timeLeft.hours, bg: "bg-[#FFF9F5]", variant: "slide-left" as const },
              { label: "Menit", value: timeLeft.minutes, bg: "bg-white", variant: "slide-right" as const },
              { label: "Detik", value: timeLeft.seconds, bg: "bg-[#FFF9F5]", variant: "slide-right" as const },
            ].map((item, idx) => (
              <ItemMotion
                key={idx}
                variant={item.variant}
                delay={0.25 + idx * 0.06}
                className={`${item.bg} rounded-2xl p-3 border-2 border-white ring-1 ring-[#F3DFD1] text-center shadow-xs`}
              >
                <span className="text-lg sm:text-xl font-serif font-bold text-[#38241B] block">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#C2633C] block mt-0.5">
                  {item.label}
                </span>
              </ItemMotion>
            ))}
          </div>
        </div>
      </div>
    </SectionMotion>
  );
}
