"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Mail, Heart, Sparkles, Smile } from "lucide-react";
import {
  KidsDrawingSun,
  KidsDrawingHeart,
  KidsDrawingStar,
  CrayonWashiTape,
  PaperStamp,
} from "./PaperArtDecorations";
import { useWeddingData } from "@/context/WeddingDataContext";

interface EnvelopeCoverProps {
  onOpen: () => void;
  isOpen: boolean;
  initialGuestName?: string;
}

export function EnvelopeCover({ onOpen, isOpen, initialGuestName }: EnvelopeCoverProps) {
  const data = useWeddingData();
  const [guestName, setGuestName] = useState<string>(initialGuestName || "Tamu Undangan Terfavorit");
  const [isOpening, setIsOpening] = useState<boolean>(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("u") || params.get("nama");
      if (to) {
        setGuestName(to.trim());
      } else if (initialGuestName) {
        setGuestName(initialGuestName);
      }
    } catch {
      // Fallback
    }
  }, [initialGuestName]);

  const handleOpenInvitation = () => {
    if (isOpening) return;
    setIsOpening(true);

    try {
      // Burst of maroon, champagne gold, blush, and ivory confetti
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#7D1128", "#E5B869", "#F5A8B8", "#FFF0F3", "#B3394B", "#660F1A"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onOpen();
    }, 400);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isOpening ? 0 : 1, scale: isOpening ? 1.05 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onWheel={(e) => {
          if (e.deltaY > 15 && !isOpening) {
            handleOpenInvitation();
          }
        }}
        className="fixed lg:absolute inset-0 z-50 flex items-center justify-center p-4 select-none paper-texture bg-[#FFF5F6]"
      >
        {/* Harmonious 2D Floating Doodles with Chill Gentle Float */}
        <motion.div
          animate={{ y: [-6, 6, -6], rotate: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-6 left-6 pointer-events-none opacity-85"
        >
          <KidsDrawingSun className="w-14 h-14" />
        </motion.div>

        <motion.div
          animate={{ y: [6, -6, 6], rotate: [4, -4, 4] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-12 right-10 pointer-events-none opacity-80"
        >
          <KidsDrawingStar className="w-8 h-8 text-[#FFE58F]" />
        </motion.div>

        <motion.div
          animate={{ y: [-5, 5, -5], scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 left-8 pointer-events-none opacity-80"
        >
          <KidsDrawingHeart className="w-9 h-9" />
        </motion.div>

        <motion.div
          animate={{ y: [5, -5, 5], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-12 right-8 pointer-events-none opacity-80"
        >
          <KidsDrawingHeart className="w-8 h-8" />
        </motion.div>

        <div className="absolute top-8 right-8 hidden sm:block">
          <PaperStamp text="RESMI SAH" date="21 • 11 • 2026" />
        </div>

        {/* Flat 2D Hand-Drawn Envelope Card Presentation */}
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 85, damping: 18 }}
          className="relative w-full max-w-md my-auto py-4"
        >
          {/* Main Envelope Box with Childlike Maroon Border */}
          <div className="relative bg-[#FFF0F3] rounded-3xl p-5 sm:p-7 text-center border-[3px] border-[#660F1A] shadow-[6px_8px_0px_#660F1A] overflow-hidden">
            {/* Cute Crayon Washi Tape Accents in Gold & Maroon */}
            <CrayonWashiTape
              text="♥ SPESIAL UNTUKMU ♥"
              color="gold"
              className="absolute -top-3.5 left-8 z-30"
            />
            <CrayonWashiTape
              text="★ HARI BAHAGIA ★"
              color="maroon"
              className="absolute -top-3.5 right-8 z-30"
            />

            {/* Flat 2D Envelope Header Trim in Velvet Maroon */}
            <div className="w-full h-8 -mx-5 sm:-mx-7 -mt-5 sm:-mt-7 bg-gradient-to-r from-[#7D1128] via-[#8A1C2C] to-[#7D1128] border-b-2 border-[#4A0812] flex items-center justify-center mb-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFE58F] uppercase">
                ✦ OFFICIAL WEDDING INVITATION ✦
              </span>
            </div>

            {/* Flat 2D Inner Letter Card with Smooth Pull-Out Motion */}
            <motion.div
              animate={{
                y: isOpening ? -70 : 0,
                scale: isOpening ? 1.04 : 1,
                opacity: isOpening ? [1, 1, 0.2] : 1,
              }}
              transition={{
                duration: 1.0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="crayon-box p-5 sm:p-7 relative z-10 my-2 bg-white"
            >
              {/* Cute Header Pill */}
              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-script font-bold tracking-wide bg-[#FFF0F3] text-[#7D1128] border-2 border-[#7D1128] shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#B3394B]" />
                  Undangan Nikah Paling Bahagia!
                  <Sparkles className="w-3.5 h-3.5 text-[#B3394B]" />
                </span>
              </div>

              {/* Couple Names with Maroon & Gold Shimmer */}
              <h1 className="font-handwriting text-5xl sm:text-6xl maroon-shimmer-text my-2 leading-tight tracking-wide">
                {data.couple?.groom?.name || "Gilang"}{" "}
                <span className="font-script text-3xl sm:text-4xl text-[#7D1128]">&</span>{" "}
                {data.couple?.bride?.name || "Salsadila"}
              </h1>

              <div className="inline-block bg-[#FFE58F] text-[#4A0812] px-3.5 py-0.5 rounded-full border-2 border-[#4A0812] text-xs font-mono font-bold my-1 rotate-[-1deg] shadow-[2px_2px_0px_#4A0812]">
                {data.events[0]?.displayDay ? `${data.events[0].displayDay}, ${data.events[0].displayDate}` : "Sabtu, 21 November 2026"} 💍
              </div>

              {/* Recipient Letter Section */}
              <div className="border-2 border-dashed border-[#8A1C2C]/40 py-3.5 px-3 my-4 bg-[#FFF9FA] rounded-2xl">
                <p className="text-xs font-mono font-bold text-[#7D1128] uppercase tracking-wider mb-1">
                  Spesial Untuk Sahabat / Keluarga Tercinta:
                </p>
                <p className="font-script text-2xl sm:text-3xl text-[#4A0812] font-bold px-2 py-0.5 leading-snug">
                  {guestName}
                </p>
                <p className="text-[11px] text-[#9E2A3B] mt-1 font-sans italic flex items-center justify-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-[#D63D56]" />
                  Harus dateng yaa, kita udah kangen banget!
                </p>
              </div>

              {/* Prominent Buka Undangan (Open Invitation) Action Area */}
              <div className="mt-5 flex flex-col items-center justify-center">
                {/* Decorative 2D Wax Seal Badge with Pop Animation */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleOpenInvitation}
                  animate={
                    isOpening
                      ? { scale: [1, 1.35, 0], opacity: [1, 1, 0] }
                      : { y: [-2, 2, -2] }
                  }
                  transition={
                    isOpening
                      ? { duration: 0.5, ease: "easeOut" }
                      : { repeat: Infinity, duration: 3, ease: "easeInOut" }
                  }
                  className="relative mb-3 flex flex-col items-center cursor-pointer"
                  title="Buka Undangan"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-16 flex justify-center -z-10 pointer-events-none">
                    <div className="w-3 h-full bg-[#4A0812] border border-[#2D050B] shadow-xs transform -rotate-15 rounded-xs" />
                    <div className="w-3 h-full bg-[#E5B869] border border-[#4A0812] shadow-xs transform rotate-15 -ml-1 rounded-xs" />
                  </div>

                  <div className="w-12 h-12 wax-seal-maroon rounded-full flex flex-col items-center justify-center text-[#FFF0F3] p-1 shadow-[2px_3px_0px_#4A0812]">
                    <div className="w-full h-full rounded-full border border-dashed border-[#FFE58F]/80 flex flex-col items-center justify-center text-center">
                      <Heart className="w-3 h-3 text-[#FAD2D8] fill-current animate-pulse" />
                      <span className="font-script font-bold tracking-wider text-[10px] text-white">
                        {(data.couple?.groom?.name || "G")[0]} & {(data.couple?.bride?.name || "S")[0]}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Main Prominent "Buka Undangan / Open Invitation" CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenInvitation}
                  disabled={isOpening}
                  className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-full bg-[#7D1128] hover:bg-[#660F1A] text-white border-2 border-[#4A0812] shadow-[4px_5px_0px_#4A0812] flex items-center justify-center gap-3 transition-all cursor-pointer group min-h-[50px] focus:outline-none focus:ring-4 focus:ring-[#F5A8B8]/60"
                  aria-label="Buka Undangan (Open Invitation)"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFF0F3] border border-[#FFE58F] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#7D1128] group-hover:scale-110 transition-transform animate-bounce" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-script font-bold text-xl text-white leading-none">
                      {isOpening ? "Membuka Surat..." : "Buka Undangan"}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#FFE58F] font-bold mt-0.5">
                      Open Invitation 💌
                    </span>
                  </div>
                </motion.button>

                <span className="text-xs font-script font-bold text-[#7D1128] mt-3 flex items-center gap-1.5 animate-pulse">
                  Klik tombol di atas untuk membuka undangan resmi
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
