"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { PaintedTextReveal } from "./PaintedTextReveal";
import {
  DoodleCatCoupleSticker,
  DoodleHeartSticker,
  DoodlePawSticker,
  DoodleSparkleSticker,
  WashiTape,
  BrushStrokeDivider,
} from "./PaintedDecorations";

interface PaintedCatsCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  initialGuestName?: string;
}

export function PaintedCatsCover({
  isOpen,
  onOpen,
  initialGuestName,
}: PaintedCatsCoverProps) {
  const data = useWeddingData();
  const [recipient, setRecipient] = useState<string>("Tamu Terhormat");

  useEffect(() => {
    if (initialGuestName && initialGuestName.trim() !== "") {
      setRecipient(initialGuestName.trim());
      return;
    }
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const toParam = urlParams.get("to");
      if (toParam) {
        setRecipient(decodeURIComponent(toParam.replace(/\+/g, " ")));
      }
    }
  }, [initialGuestName]);

  const groomName = data.couple?.groom?.name || "Mempelai Pria";
  const brideName = data.couple?.bride?.name || "Mempelai Wanita";
  const mainEvent = data.events?.[0];
  const dateStr = mainEvent?.displayDate || "21 November 2026";
  const dayStr = mainEvent?.displayDay || "Sabtu";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        y: -40,
        scale: 0.98,
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
      }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between p-5 sm:p-8 bg-[#FAF6EE] text-[#2C2623] overflow-y-auto min-h-full"
    >
      {/* Top Header Label */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center pt-2"
      >
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <DoodlePawSticker className="w-4 h-4 text-[#D97736]" color="#D97736" rotate={0} />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#C85A17]">
            Doodle Cat Wedding Scrapbook
          </span>
        </div>
      </motion.div>

      {/* Center Scrapbook Card with Doodle Cat Couple Sticker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm my-auto rounded-3xl p-5 sm:p-6 text-center bg-white/90 backdrop-blur-md border-2 border-[#EAD8C7] shadow-[0_20px_50px_rgba(200,90,23,0.12)] relative overflow-hidden"
      >
        {/* Washi tape on top center holding the sticker */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
          <WashiTape color="peach" angle={-2} className="w-28 text-[8px]" />
        </div>

        {/* Floating Mini Decorative Stickers */}
        <div className="absolute top-5 left-3 z-10">
          <DoodleHeartSticker className="w-6 h-6" rotate={-12} />
        </div>
        <div className="absolute top-6 right-3 z-10">
          <DoodleSparkleSticker className="w-5 h-5" />
        </div>

        {/* Speech Bubble from Cats */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4EB] border border-[#EAD8C7] text-[10px] font-mono text-[#D97736] font-bold shadow-2xs mb-1"
        >
          <span>🐾</span>
          <span>&ldquo;Meow! Mami &amp; Papi mau nikah!&rdquo;</span>
        </motion.div>

        {/* Centerpiece: Adorable Doodle Cat Couple Die-Cut Sticker */}
        <div className="pt-2 pb-2 flex justify-center relative">
          <DoodleCatCoupleSticker className="w-64 h-56 sm:w-72 sm:h-64" rotate={-1} />
        </div>

        {/* Animated Sequential Text Reveal for Couple Names */}
        <div className="space-y-1 mb-2 pt-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A17] block">
            Undangan Pernikahan
          </span>
          <div className="min-h-[52px] flex items-center justify-center">
            <PaintedTextReveal
              text={`${groomName} & ${brideName}`}
              className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2623] tracking-tight"
              mode="words"
              staggerDelay={0.12}
              loopFade={true}
              intervalSeconds={7}
            />
          </div>
          <p className="text-xs text-[#8C6D58] font-mono tracking-wider">
            {dayStr}, {dateStr}
          </p>
        </div>

        <BrushStrokeDivider className="my-3" />

        {/* Guest Recipient Box with Sticker Stamp Effect */}
        <div className="bg-[#FAF6EE] rounded-2xl p-4 border-2 border-dashed border-[#E8D9CB] text-center mb-5 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
            <DoodlePawSticker className="w-7 h-7" color="#D97736" rotate={0} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A07855] block mt-1 mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <p className="font-serif font-bold text-base sm:text-lg text-[#2C2623] tracking-wide truncate">
            {recipient}
          </p>
        </div>

        {/* Primary CTA: Buka Undangan */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#D97736] hover:bg-[#C85A17] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(217,119,54,0.35)] transition-all cursor-pointer group"
        >
          <Mail className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span>Buka Undangan</span>
        </motion.button>
      </motion.div>

      {/* Bottom Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center pb-2 text-[11px] font-sans text-[#8C6D58]"
      >
        <p>Mohon maaf apabila terdapat kesalahan penulisan nama atau gelar</p>
      </motion.div>
    </motion.div>
  );
}
