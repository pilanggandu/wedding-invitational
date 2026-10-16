"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowDown } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  RoyalMonogram,
  CornerFiligree,
  DividerOrnament,
} from "./RoyalDecorations";
import { RoyalAmbientParticles } from "./RoyalAmbientParticles";
import { getFontFamilyCss } from "@/lib/typography";

interface RoyalCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  initialGuestName?: string;
}

export function RoyalCover({
  isOpen,
  onOpen,
  initialGuestName,
}: RoyalCoverProps) {
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
  const akadDate = data.events[0]?.displayDate || "";
  const akadDay = data.events[0]?.displayDay || "";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        y: -50,
        scale: 0.97,
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
      }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 bg-[#09221B] text-[#FAF8F5] overflow-y-auto min-h-full"
    >
      {/* Serene Ambient Gold Dust Particles */}
      <RoyalAmbientParticles />

      {/* Background Architectural Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
        <RoyalMonogram className="w-[600px] h-[600px]" color="#C8A97E" />
      </div>

      {/* Outer Golden Cathedral Border with Majestic Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px] my-auto rounded-t-[140px] sm:rounded-t-[160px] rounded-b-2xl border-2 border-[#C8A97E]/60 p-4 sm:p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0C2B22]/90 backdrop-blur-xs z-10"
      >
        {/* Inner Hairline Arch */}
        <div className="absolute inset-2 rounded-t-[132px] sm:rounded-t-[152px] rounded-b-[10px] border border-[#C8A97E]/30 pointer-events-none" />

        {/* Corner Filigrees on Bottom Corners */}
        <CornerFiligree
          className="absolute bottom-3 left-3 w-6 h-6"
          position="bottom-left"
          color="#C8A97E"
        />
        <CornerFiligree
          className="absolute bottom-3 right-3 w-6 h-6"
          position="bottom-right"
          color="#C8A97E"
        />

        {/* Top Header Tag */}
        <div className="pt-3 sm:pt-4 mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-serif uppercase tracking-[0.28em] text-[#C8A97E]">
            Walimatul &lsquo;Ursy
          </span>
        </div>

        {/* Central Royal Monogram Crest */}
        <div className="my-1.5 sm:my-2">
          <RoyalMonogram className="w-20 h-20 sm:w-28 sm:h-28" color="#C8A97E" />
        </div>

        {/* Subtitle */}
        <p className="text-[10px] sm:text-[11px] font-serif uppercase tracking-[0.25em] text-[#E8D7B8]/80 mb-2 sm:mb-3">
          The Wedding of
        </p>

        {/* Couple Names in Classical Dignified Serif */}
        <h1
          style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
          className="font-couple-title font-serif text-2xl min-[380px]:text-3xl sm:text-4xl tracking-tight text-[#FAF8F5] mb-1 font-normal leading-tight"
        >
          {groomName} &amp; {brideName}
        </h1>

        {/* Date */}
        <p className="text-[11px] sm:text-xs font-serif tracking-[0.2em] text-[#C8A97E] uppercase mt-1 sm:mt-2 mb-3 sm:mb-4">
          {akadDay}, {akadDate}
        </p>

        <DividerOrnament className="w-40 sm:w-48 my-2 sm:my-3" color="#C8A97E" />

        {/* Personalized Guest Card */}
        <div className="w-full bg-[#081B15]/80 rounded-xl border border-[#C8A97E]/30 p-3 sm:p-4 mt-1 sm:mt-2 mb-4 sm:mb-6 text-center">
          <p className="text-[10px] sm:text-[11px] font-sans text-[#E8D7B8]/70 tracking-wide mb-1">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <div className="text-base sm:text-lg font-serif font-semibold text-[#FAF8F5] tracking-wide px-2 py-0.5 sm:py-1">
            {recipient}
          </div>
          <p className="text-[9px] sm:text-[10px] font-sans text-[#E8D7B8]/50 mt-1 italic">
            Mohon maaf apabila ada kesalahan penulisan nama atau gelar
          </p>
        </div>

        {/* Open Invitation CTA */}
        <motion.button
          onClick={onOpen}
          whileHover={{ scale: 1.025, boxShadow: "0 10px 30px rgba(200,169,126,0.45)" }}
          whileTap={{ scale: 0.975 }}
          className="w-full max-w-[260px] py-3.5 px-6 rounded-lg bg-[#C8A97E] hover:bg-[#B8986D] text-[#09221B] font-serif font-medium text-xs tracking-[0.2em] uppercase transition-colors shadow-[0_6px_20px_rgba(200,169,126,0.3)] flex items-center justify-center gap-2.5 cursor-pointer min-h-[48px]"
        >
          <Mail className="w-4 h-4 text-[#09221B]" />
          <span>Buka Undangan</span>
        </motion.button>
      </motion.div>

      {/* Bottom Footer Note */}
      <div className="py-2 text-center">
        <p className="text-[10px] font-sans tracking-widest uppercase text-[#C8A97E]/60">
          Official Digital Wedding Invitation
        </p>
      </div>
    </motion.div>
  );
}
