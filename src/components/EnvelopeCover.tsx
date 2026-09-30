"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Mail, Heart, Sparkles, Smile } from "lucide-react";
import { BotanicalLeaves, PaperStamp } from "./PaperArtDecorations";

interface EnvelopeCoverProps {
  onOpen: () => void;
  isOpen: boolean;
}

export function EnvelopeCover({ onOpen, isOpen }: EnvelopeCoverProps) {
  const [guestName, setGuestName] = useState<string>("Tamu Undangan Terfavorit");
  const [isOpening, setIsOpening] = useState<boolean>(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("u") || params.get("nama");
      if (to) {
        setGuestName(to.trim());
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsOpening(true);

    try {
      // Burst of maroon, blush, gold, and white confetti
      confetti({
        particleCount: 70,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#7D1128", "#F5A8B8", "#FFE58F", "#FFF0F3", "#D63D56"],
      });

      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#7D1128", "#FFE58F", "#F8B4C0"],
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#7D1128", "#FFE58F", "#F8B4C0"],
        });
      }, 250);
    } catch {
      // ignore
    }

    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isOpening ? 0 : 1, scale: isOpening ? 1.08 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="fixed lg:absolute inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none paper-texture"
      >
        {/* Cute leaf cutouts in Maroon */}
        <BotanicalLeaves className="absolute -top-10 -left-10 w-44 h-64 opacity-50 rotate-45 pointer-events-none" />
        <BotanicalLeaves className="absolute -bottom-10 -right-10 w-48 h-68 opacity-45 -rotate-135 pointer-events-none" />

        <div className="absolute top-8 right-8 hidden sm:block">
          <PaperStamp text="OFFICIALLY SAH" date="12 • 12 • 2026" />
        </div>

        {/* 3D Envelope Presentation */}
        <div
          className="relative w-full max-w-md"
          style={{ perspective: "1400px" }}
        >
          {/* Main Envelope Box with Cute Maroon Doodle Border */}
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative bg-[#FFF0F3] rounded-3xl p-6 sm:p-8 text-center border-[3px] border-[#660F1A] shadow-[6px_8px_0px_#660F1A] overflow-hidden"
          >
            {/* Cute Washi Tape Accents */}
            <div className="absolute -top-3.5 left-8 w-24 h-7 washi-tape-cute -rotate-3 z-30 rounded-xs flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-[#8A5A10]">
                ♥ FOR YOU ♥
              </span>
            </div>
            <div className="absolute -top-3.5 right-8 w-24 h-7 washi-tape-maroon rotate-3 z-30 rounded-xs flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-[#FFF0F3]">
                ★ SWEET DAY ★
              </span>
            </div>

            {/* 3D Envelope Flap */}
            <motion.div
              animate={{
                rotateX: isOpening ? 180 : 0,
                opacity: isOpening ? 0 : 1,
              }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{
                transformOrigin: "top center",
                backfaceVisibility: "hidden",
              }}
              className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#8A1C2C] to-[#660F1A] border-b-2 border-[#4A0812] shadow-sm z-20 pointer-events-none rounded-t-2xl"
            />

            {/* Inner Letter Card */}
            <motion.div
              animate={{
                y: isOpening ? -35 : 0,
                scale: isOpening ? 1.04 : 1,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="doodle-box p-6 sm:p-7 relative z-10 my-2 bg-white"
            >
              {/* Cute Header Pill */}
              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-script font-bold tracking-wide bg-[#FFF0F3] text-[#7D1128] border-2 border-[#7D1128] shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#B3394B]" />
                  Undangan Nikah Paling Bahagia!
                  <Sparkles className="w-3.5 h-3.5 text-[#B3394B]" />
                </span>
              </div>

              {/* Couple Names with Maroon Shimmer */}
              <h1 className="font-handwriting text-5xl sm:text-6xl maroon-shimmer-text my-2 leading-tight tracking-wide">
                Dimas <span className="font-script text-3xl sm:text-4xl text-[#7D1128]">&</span> Sarah
              </h1>

              <div className="inline-block bg-[#FFE58F] text-[#4A0812] px-3 py-0.5 rounded-full border-1.5 border-[#4A0812] text-xs font-mono font-bold my-1 rotate-[-1deg]">
                Sabtu, 12 Desember 2026 💍
              </div>

              {/* Recipient Letter Section */}
              <div className="border-2 border-dashed border-[#8A1C2C]/50 py-3.5 px-3 my-4 bg-[#FFF9FA] rounded-2xl">
                <p className="text-xs font-sans font-medium text-[#7D1128] uppercase tracking-wider mb-1">
                  Spesial Untuk Sahabat/Keluarga Tercinta:
                </p>
                <p className="font-script text-2xl sm:text-3xl text-[#4A0812] font-bold px-2 py-0.5 leading-snug">
                  {guestName}
                </p>
                <p className="text-[11px] text-[#9E2A3B] mt-1 font-sans italic flex items-center justify-center gap-1">
                  <Smile className="w-3 h-3 text-[#D63D56]" />
                  Harus dateng yaa, kita udah kangen!
                </p>
              </div>

              {/* Maroon Wax Seal Open Button */}
              <div className="mt-6 flex flex-col items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleOpenInvitation}
                  className="relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F5A8B8]/60 rounded-full"
                  aria-label="Buka Undangan Pernikahan"
                >
                  {/* Ribbon Ends */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-28 flex justify-center -z-10 pointer-events-none">
                    <div className="w-3.5 h-full bg-[#4A0812] shadow-sm transform -rotate-15 rounded-xs" />
                    <div className="w-3.5 h-full bg-[#7D1128] shadow-sm transform rotate-15 -ml-1 rounded-xs" />
                  </div>

                  {/* Wax Seal Disk in Maroon */}
                  <div className="w-20 h-20 sm:w-22 sm:h-22 wax-seal-maroon rounded-full flex flex-col items-center justify-center text-[#FFF0F3] p-1 shadow-xl">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-[#FAD2D8]/60 flex flex-col items-center justify-center text-center p-1">
                      <Heart className="w-4 h-4 text-[#FAD2D8] mb-0.5 fill-current animate-pulse" />
                      <span className="font-script font-bold tracking-wider text-[13px] text-white">
                        D & S
                      </span>
                      <span className="text-[8px] uppercase tracking-wider font-mono font-bold text-[#FAD2D8]">
                        BUKA YUK
                      </span>
                    </div>
                  </div>
                </motion.button>

                <span className="text-xs font-script font-bold text-[#7D1128] mt-4 flex items-center gap-1.5 animate-bounce">
                  <Mail className="w-3.5 h-3.5 text-[#B3394B]" />
                  Ketuk segel cinta untuk membuka surat! 💌
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
