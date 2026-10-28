"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { PaintedTextReveal } from "./PaintedTextReveal";
import {
  DoodleCatCoupleSticker,
  DoodlePawSticker,
  DoodleHeartSticker,
  DoodleSparkleSticker,
  WashiTape,
  BrushStrokeDivider,
} from "./PaintedDecorations";

interface PaintedCatsDesktopLeftProps {
  isOpened: boolean;
  onOpen: () => void;
}

export function PaintedCatsDesktopLeft({
  isOpened,
  onOpen,
}: PaintedCatsDesktopLeftProps) {
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
    <aside className="hidden lg:flex lg:w-[48%] xl:w-[50%] min-h-screen relative flex-col justify-between p-12 xl:p-16 text-[#38241B] overflow-hidden select-none border-r border-[#F3DFD1] bg-[#FAF5ED]">
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#DF7B54 0.75px, transparent 0.75px), radial-gradient(#F3DFD1 0.75px, #FAF5ED 0.75px)`,
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#DF7B54] to-[#F4929D] flex items-center justify-center text-white shadow-sm">
            <DoodlePawSticker className="w-5 h-5" color="#FFFFFF" rotate={0} />
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#DF7B54] block">
              Cute Chibi Cat Scrapbook
            </span>
            <span className="font-serif text-sm font-bold text-[#38241B]">
              {groom?.name} &amp; {bride?.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F3DFD1] text-xs text-[#DF7B54] font-sans font-bold shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-[#DF7B54]" />
          <span>{dateStr}</span>
        </div>
      </div>

      <div className="relative z-10 my-auto max-w-lg space-y-6">
        <div className="relative w-80 p-6 rounded-[36px] bg-white border-[4px] border-white ring-1 ring-[#F3DFD1] shadow-[0_20px_45px_rgba(222,125,84,0.12)] text-center">
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
            <WashiTape color="peach" angle={-3} className="w-32 text-[9px]" />
          </div>
          <div className="absolute top-4 left-4 z-10">
            <DoodleHeartSticker className="w-6 h-6" rotate={-15} />
          </div>
          <div className="absolute top-4 right-4 z-10">
            <DoodleSparkleSticker className="w-6 h-6" />
          </div>

          <DoodleCatCoupleSticker className="w-72 h-64 mx-auto" rotate={0} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-sans uppercase font-bold tracking-wider text-[#DF7B54] block">
            The Wedding Celebration of
          </span>
          <div className="min-h-[64px] flex items-center">
            <PaintedTextReveal
              text={`${groom?.name} & ${bride?.name}`}
              className="text-4xl xl:text-5xl font-serif font-bold text-[#38241B] tracking-tight leading-tight"
              mode="words"
              staggerDelay={0.12}
              loopFade={true}
              intervalSeconds={7}
            />
          </div>
          <p className="text-sm text-[#6E5345] font-sans leading-relaxed pt-1">
            {data.general?.funTagline ||
              "Dua hati yang saling melengkapi dalam kehangatan cinta, doa, dan rasa syukur."}
          </p>
        </div>

        <BrushStrokeDivider className="mx-0" />

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "HARI", value: timeLeft.days, bg: "bg-white" },
            { label: "JAM", value: timeLeft.hours, bg: "bg-[#FFF9F5]" },
            { label: "MENIT", value: timeLeft.minutes, bg: "bg-white" },
            { label: "DETIK", value: timeLeft.seconds, bg: "bg-[#FFF9F5]" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`${item.bg} rounded-2xl p-3.5 text-center border-[2.5px] border-white ring-1 ring-[#F3DFD1] shadow-xs relative`}
            >
              <span className="text-xl xl:text-2xl font-serif font-bold text-[#38241B] block">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-sans text-[#DF7B54] font-bold tracking-wider block mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs text-[#8C6D58] font-sans border-t border-[#F3DFD1] pt-4">
        <span>Gunakan layar ponsel di samping untuk pengalaman interaktif</span>
        <span className="font-sans text-[#DF7B54] font-bold">{data.general?.hashtag}</span>
      </div>
    </aside>
  );
}
