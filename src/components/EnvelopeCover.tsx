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
      // Burst of colorful celebratory wedding confetti
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#EF4444", "#FBBF24", "#3B82F6", "#22C55E", "#EC4899", "#F59E0B"],
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ["#EF4444", "#FBBF24", "#3B82F6", "#22C55E"],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ["#EC4899", "#FBBF24", "#3B82F6", "#F59E0B"],
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
        className="fixed lg:absolute inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none paper-texture bg-[#FEF9E7]"
      >
        {/* Childlike Floating Doodles */}
        <div className="absolute top-6 left-6 pointer-events-none opacity-85">
          <KidsDrawingSun className="w-16 h-16 animate-gentle-pulse" />
        </div>
        <div className="absolute top-12 right-10 pointer-events-none opacity-80">
          <KidsDrawingStar className="w-8 h-8 text-[#FBBF24]" />
        </div>
        <div className="absolute bottom-10 left-8 pointer-events-none opacity-75">
          <KidsDrawingHeart className="w-10 h-10" />
        </div>
        <div className="absolute bottom-12 right-8 pointer-events-none opacity-75">
          <KidsDrawingHeart className="w-8 h-8" />
        </div>

        <div className="absolute top-8 right-8 hidden sm:block">
          <PaperStamp text="RESMI SAH" date="12 • 12 • 2026" />
        </div>

        {/* 3D Envelope Presentation */}
        <div
          className="relative w-full max-w-md"
          style={{ perspective: "1400px" }}
        >
          {/* Main Envelope Box with Childlike Crayon Border */}
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 text-center border-[4px] border-[#222222] shadow-[6px_8px_0px_#222222] overflow-hidden"
          >
            {/* Cute Crayon Washi Tape Accents */}
            <CrayonWashiTape
              text="♥ SPESIAL UNTUKMU ♥"
              color="yellow"
              className="absolute -top-3.5 left-8 z-30"
            />
            <CrayonWashiTape
              text="★ HARI BAHAGIA ★"
              color="pink"
              className="absolute -top-3.5 right-8 z-30"
            />

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
              className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#EF4444] to-[#DC2626] border-b-3 border-[#222222] shadow-sm z-20 pointer-events-none rounded-t-2xl"
            />

            {/* Inner Letter Card */}
            <motion.div
              animate={{
                y: isOpening ? -35 : 0,
                scale: isOpening ? 1.04 : 1,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="crayon-box p-6 sm:p-7 relative z-10 my-2 bg-white"
            >
              {/* Cute Header Pill */}
              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-script font-bold tracking-wide bg-[#FEF08A] text-[#222222] border-2 border-[#222222] shadow-[2px_2px_0px_#222222]">
                  <Sparkles className="w-3.5 h-3.5 text-[#EF4444]" />
                  Undangan Nikah Paling Bahagia!
                  <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                </span>
              </div>

              {/* Couple Names with Rainbow Shimmer */}
              <h1 className="font-handwriting text-5xl sm:text-6xl rainbow-shimmer-text my-2 leading-tight tracking-wide">
                Dimas <span className="font-script text-3xl sm:text-4xl text-[#EF4444]">&</span> Sarah
              </h1>

              <div className="inline-block bg-[#BAE6FD] text-[#0369A1] px-3.5 py-0.5 rounded-full border-2 border-[#222222] text-xs font-mono font-bold my-1 rotate-[-1deg] shadow-[2px_2px_0px_#222222]">
                Sabtu, 12 Desember 2026 💍
              </div>

              {/* Recipient Letter Section */}
              <div className="border-2 border-dashed border-[#222222]/40 py-3.5 px-3 my-4 bg-[#FFFBEB] rounded-2xl">
                <p className="text-xs font-mono font-bold text-[#854D0E] uppercase tracking-wider mb-1">
                  Spesial Untuk Sahabat / Keluarga Tercinta:
                </p>
                <p className="font-script text-2xl sm:text-3xl text-[#222222] font-bold px-2 py-0.5 leading-snug">
                  {guestName}
                </p>
                <p className="text-[11px] text-[#4B5563] mt-1 font-sans italic flex items-center justify-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-[#EF4444]" />
                  Harus dateng yaa, kita udah kangen banget!
                </p>
              </div>

              {/* Colorful Wax Seal Open Button */}
              <div className="mt-6 flex flex-col items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleOpenInvitation}
                  className="relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#FBBF24]/70 rounded-full"
                  aria-label="Buka Undangan Pernikahan"
                >
                  {/* Ribbon Ends */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-28 flex justify-center -z-10 pointer-events-none">
                    <div className="w-3.5 h-full bg-[#EF4444] shadow-sm transform -rotate-15 rounded-xs border-r border-[#222222]" />
                    <div className="w-3.5 h-full bg-[#FBBF24] shadow-sm transform rotate-15 -ml-1 rounded-xs border-l border-[#222222]" />
                  </div>

                  {/* Wax Seal Disk in Colorful Festive Style */}
                  <div className="w-20 h-20 sm:w-22 sm:h-22 wax-seal-colorful rounded-full flex flex-col items-center justify-center text-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-[#FEF08A]/80 flex flex-col items-center justify-center text-center p-1">
                      <Heart className="w-4 h-4 text-[#FEF08A] mb-0.5 fill-current animate-pulse" />
                      <span className="font-script font-bold tracking-wider text-[13px] text-white">
                        D & S
                      </span>
                      <span className="text-[8px] uppercase tracking-wider font-mono font-bold text-[#FEF08A]">
                        BUKA YUK
                      </span>
                    </div>
                  </div>
                </motion.button>

                <span className="text-xs font-script font-bold text-[#222222] mt-4 flex items-center gap-1.5 animate-bounce">
                  <Mail className="w-3.5 h-3.5 text-[#EF4444]" />
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
