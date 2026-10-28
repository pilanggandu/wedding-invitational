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
      className="absolute inset-0 z-50 flex flex-col items-center justify-between p-5 sm:p-8 bg-[#FAF5ED] text-[#38241B] overflow-y-auto min-h-full"
    >
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center pt-2"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#F3DFD1] shadow-2xs">
          <DoodlePawSticker className="w-3.5 h-3.5" />
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C2633C]">
            Walimatul &lsquo;Ursy &bull; Purrfect Romance
          </span>
          <DoodlePawSticker className="w-3.5 h-3.5" rotate={10} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm my-auto rounded-[36px] p-6 sm:p-7 text-center bg-white/95 backdrop-blur-md border-[4px] border-white shadow-[0_20px_50px_rgba(222,125,84,0.16)] ring-1 ring-[#F3DFD1] relative overflow-hidden"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
          <WashiTape color="peach" angle={-2} className="w-28 text-[8px]" />
        </div>

        <div className="absolute top-5 left-3 z-10">
          <DoodleHeartSticker className="w-6 h-6" rotate={-12} />
        </div>
        <div className="absolute top-6 right-3 z-10">
          <DoodleSparkleSticker className="w-5 h-5" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center -mb-2 relative z-10 pointer-events-none select-none"
        >
          <img
            src="/images/templates/painted-cats/meow-speech-bubble.svg"
            alt="Meow and Forever"
            aria-hidden="true"
            className="w-36 sm:w-40 h-auto object-contain drop-shadow-sm"
          />
        </motion.div>

        <div className="pt-2 pb-2 flex justify-center relative">
          <DoodleCatCoupleSticker className="w-64 h-56 sm:w-72 sm:h-64" rotate={-1} />
        </div>

        <div className="space-y-1 mb-2 pt-1">
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C2633C] block">
            Undangan Pernikahan
          </span>
          <div className="min-h-[52px] flex items-center justify-center">
            <PaintedTextReveal
              text={`${groomName} & ${brideName}`}
              className="text-2xl sm:text-3xl font-serif font-bold text-[#38241B] tracking-tight"
              mode="words"
              staggerDelay={0.12}
              loopFade={true}
              intervalSeconds={7}
            />
          </div>
          <p className="text-xs text-[#7A5B4C] font-sans font-medium tracking-wide">
            {dayStr}, {dateStr}
          </p>
        </div>

        <BrushStrokeDivider className="my-3" />

        <div className="bg-[#FFF9F5] rounded-2xl p-4 border-2 border-dashed border-[#F3DFD1] text-center mb-5 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
            <DoodlePawSticker className="w-7 h-7" rotate={0} />
          </div>
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#9E7E6E] block mt-1 mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <p className="font-serif font-bold text-base sm:text-lg text-[#38241B] tracking-wide truncate">
            {recipient}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E78862] via-[#DF7B54] to-[#D56F46] hover:from-[#DF7B54] hover:to-[#C66239] text-white font-bold text-sm tracking-wide shadow-[0_12px_26px_rgba(223,123,84,0.36)] transition-all cursor-pointer group flex items-center justify-center gap-2"
        >
          <Mail className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span>Buka Undangan</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center pb-2 text-[11px] font-sans text-[#8F6C5A]"
      >
        <p>Mohon maaf apabila terdapat kesalahan penulisan nama atau gelar</p>
      </motion.div>
    </motion.div>
  );
}
