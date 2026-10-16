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
  WashiTape,
  BrushStrokeDivider,
} from "./PaintedDecorations";

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
    <section id="hero" className="relative pt-12 pb-16 px-6 text-center text-[#2C2623] overflow-hidden">
      <div className="max-w-md mx-auto space-y-7">
        {/* Header Paw Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-1.5"
        >
          <DoodlePawSticker className="w-4 h-4 text-[#D97736]" color="#D97736" rotate={-10} />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#C85A17]">
            Walimatul &lsquo;Ursy
          </span>
          <DoodlePawSticker className="w-4 h-4 text-[#D97736]" color="#D97736" rotate={10} />
        </motion.div>

        {/* Sacred Quote Card styled like painted scrapbook parchment with washi tape */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-2 border-[#EAD8C7] shadow-[0_10px_30px_rgba(200,90,23,0.08)] space-y-3 relative overflow-hidden"
        >
          {/* Top washi tape */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
            <WashiTape color="mint" angle={-1} className="w-24 text-[8px]" />
          </div>

          <p className="font-serif text-sm sm:text-base text-[#C85A17] leading-loose dir-rtl pt-3">
            {data.general?.quote?.arabic}
          </p>
          <p className="text-xs text-[#5C4A3E] leading-relaxed font-sans italic">
            &ldquo;{data.general?.quote?.translation}&rdquo;
          </p>
          <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-[#A07855]">
            {data.general?.quote?.source}
          </span>
        </motion.div>

        {/* Main Wedding Headline with Sequential Painted Font Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-2 pt-2"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A17] block">
            The Wedding of
          </span>

          {/* Sequential Painted Text Reveal (Fade In and Out letter/word by word) */}
          <div className="min-h-[58px] flex items-center justify-center">
            <PaintedTextReveal
              text={`${groom?.name} & ${bride?.name}`}
              className="text-3xl sm:text-4xl font-serif font-bold text-[#2C2623] tracking-tight leading-tight"
              mode="words"
              staggerDelay={0.12}
              loopFade={true}
              intervalSeconds={6.5}
            />
          </div>

          <p className="text-xs text-[#8C6D58] font-mono tracking-wider pt-1">
            {dayStr}, {dateStr}
          </p>
        </motion.div>

        <BrushStrokeDivider />

        {/* Countdown Timer with Sticker Card Design */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-3"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A17] block">
            Menghitung Hari Menuju Hari Bahagia
          </span>
          <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
            {[
              { label: "Hari", value: timeLeft.days, bg: "bg-white" },
              { label: "Jam", value: timeLeft.hours, bg: "bg-[#FFF9F3]" },
              { label: "Menit", value: timeLeft.minutes, bg: "bg-[#FFF4EB]" },
              { label: "Detik", value: timeLeft.seconds, bg: "bg-[#FDECE0]" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${item.bg} rounded-2xl p-3 border border-[#E8D9CB] text-center shadow-xs`}
              >
                <span className="text-lg sm:text-xl font-serif font-bold text-[#2C2623] block">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#C85A17] block mt-0.5 font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
