"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Film } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { FilmTimecodeBadge, ModernHairlineDivider, CameraCropMarks } from "./CinematicDecorations";

export function CinematicHero() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const mainEvent = data.events?.[0];
  const dateStr = mainEvent?.displayDate || "21 November 2026";
  const dayStr = mainEvent?.displayDay || "Sabtu";

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
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data.countdownTarget]);

  const heroImage = data.general?.coverPhotoUrl || data.general?.preweddingPhotos?.[0] || "/images/prewedding/couple-1.jpg";

  return (
    <section id="hero" className="relative pt-6 pb-16 px-4 text-center text-white overflow-hidden">
      <div className="max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <FilmTimecodeBadge scene="SEQUENCE 01" take="PROLOGUE" fps="24 FPS" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-black"
        >
          <div className="w-full bg-black py-1 px-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-white/60 border-b border-white/15">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              REC
            </span>
            <span>2.39:1 CINEMASCOPE</span>
            <span>TC 00:01:24:18</span>
          </div>

          <div className="relative aspect-[21/9] sm:aspect-[2.39/1] overflow-hidden group">
            <CameraCropMarks className="opacity-70" />
            <motion.img
              initial={{ scale: 1.08 }}
              animate={{ scale: 1.02 }}
              transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              src={heroImage}
              alt="Film Still"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-20">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-white/80 block mb-1">
                A Motion Picture Love Story
              </span>
              <h2
                style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              >
                {groom?.name} &amp; {bride?.name}
              </h2>
            </div>
          </div>

          <div className="w-full bg-black/90 py-1.5 px-4 flex items-center justify-between text-[9px] font-mono tracking-wider text-white/50 border-t border-white/15">
            <span>SHUTTER 1/48</span>
            <span>F/2.0 &bull; 50MM</span>
            <span>ISO 400</span>
          </div>
        </motion.div>

        {data.general?.quote && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="bg-black/60 backdrop-blur-2xl rounded-2xl p-5 border border-white/15 shadow-xl space-y-2.5 text-center"
          >
            {data.general.quote.arabic && (
              <p className="font-serif text-sm sm:text-base text-white/95 leading-loose dir-rtl">
                {data.general.quote.arabic}
              </p>
            )}
            <p className="text-xs text-white/80 font-sans italic leading-relaxed">
              &ldquo;{data.general.quote.translation}&rdquo;
            </p>
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-white/50">
              {data.general.quote.source}
            </span>
          </motion.div>
        )}

        <ModernHairlineDivider />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="bg-black/70 backdrop-blur-2xl rounded-2xl p-5 border border-white/20 shadow-2xl space-y-3"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              SMPTE COUNTDOWN TIMER
            </span>
            <span className="text-[10px] font-mono text-emerald-400">SYNC LOCKED</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "DAYS", val: timeLeft.days },
              { label: "HOURS", val: timeLeft.hours },
              { label: "MINS", val: timeLeft.minutes },
              { label: "SECS", val: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-950/90 rounded-xl p-2.5 border border-white/15 text-center shadow-inner"
              >
                <span className="text-xl sm:text-2xl font-mono font-bold text-white block tracking-wider">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-mono uppercase tracking-wider text-white/50 block mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-mono text-white/60 tracking-wider pt-1">
            PREMIERE DATE: {dayStr.toUpperCase()}, {dateStr.toUpperCase()}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
