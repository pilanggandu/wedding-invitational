"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Mail, Heart, Sparkles } from "lucide-react";
import { BotanicalLeaves, PaperStamp } from "./PaperArtDecorations";

interface EnvelopeCoverProps {
  onOpen: () => void;
  isOpen: boolean;
}

export function EnvelopeCover({ onOpen, isOpen }: EnvelopeCoverProps) {
  const [guestName, setGuestName] = useState<string>("Tamu Undangan Terhormat");
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

    // Multi-stage confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C26D53", "#E8C2A0", "#F3EAD8", "#8A9A86", "#D4AF37"],
      });

      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#D4AF37", "#C26D53", "#FFFDF9"],
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#D4AF37", "#C26D53", "#FFFDF9"],
        });
      }, 250);
    } catch {
      // ignore
    }

    // Smooth delay for 3D unfold animation
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none"
        style={{
          backgroundColor: "#FAF6EE",
          backgroundImage: `radial-gradient(circle at center, #FFFDF9 0%, #F5ECDD 100%)`,
        }}
      >
        {/* Decorative background paper cutouts with gentle sway */}
        <BotanicalLeaves className="absolute -top-10 -left-10 w-44 h-64 opacity-50 rotate-45 pointer-events-none" />
        <BotanicalLeaves className="absolute -bottom-10 -right-10 w-48 h-68 opacity-45 -rotate-135 pointer-events-none" />
        
        <div className="absolute top-8 right-8 hidden sm:block">
          <PaperStamp text="ROYAL WEDDING" date="12 • 12 • 2026" />
        </div>

        {/* 3D Envelope Presentation Container */}
        <div
          className="relative w-full max-w-md"
          style={{ perspective: "1400px" }}
        >
          {/* Main Envelope Pocket Box */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative paper-sheet-kraft rounded-2xl p-6 sm:p-8 text-center border-2 border-[#D3BEA2] shadow-2xl overflow-hidden"
          >
            {/* Washi tape accents on corners */}
            <div className="absolute -top-3.5 left-8 w-24 h-7 washi-tape -rotate-3 z-30" />
            <div className="absolute -top-3.5 right-8 w-24 h-7 washi-tape rotate-3 z-30" />

            {/* 3D Flap of Envelope */}
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
              className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#DECBB5] to-[#EADBCC] border-b border-[#C5AF94] shadow-sm z-20 pointer-events-none rounded-t-xl"
            />

            {/* Inner Letter Card (Slides upward when envelope opens) */}
            <motion.div
              animate={{
                y: isOpening ? -35 : 0,
                scale: isOpening ? 1.04 : 1,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="paper-sheet rounded-xl p-6 sm:p-8 border border-[#E0D0BB] relative z-10 my-2"
            >
              {/* Subtle paper seal header */}
              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif tracking-widest uppercase bg-[#F5EDE1] text-[#7A6652] border border-[#DECDB8]">
                  <Sparkles className="w-3 h-3 text-[#C26D53]" />
                  The Wedding Invitation
                  <Sparkles className="w-3 h-3 text-[#C26D53]" />
                </span>
              </div>

              {/* Couple Names with Gold Foil Shimmer */}
              <h1 className="font-handwriting text-5xl sm:text-6xl gold-foil-text my-3 leading-tight tracking-wide">
                Dimas <span className="font-script text-3xl sm:text-4xl text-[#C26D53]">&</span> Sarah
              </h1>

              <p className="font-serif italic text-xs sm:text-sm text-[#7F6B58] tracking-widest uppercase mt-1 mb-6">
                Sabtu, 12 Desember 2026
              </p>

              {/* Recipient Letter Section */}
              <div className="border-t border-b border-[#E7DAC7] py-4 my-4 bg-[#FAF6EE]/80 rounded-md">
                <p className="text-xs font-sans text-[#8C7A6B] uppercase tracking-wider mb-1">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <p className="font-script text-2xl sm:text-3xl text-[#2F261F] font-bold px-2 py-1 leading-snug">
                  {guestName}
                </p>
                <p className="text-[11px] text-[#A08E7F] mt-1 font-sans italic">
                  *Mohon maaf bila ada kesalahan penulisan nama/gelar
                </p>
              </div>

              {/* Wax Seal Open Button */}
              <div className="mt-7 flex flex-col items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleOpenInvitation}
                  className="relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#E5B6A0]/50 rounded-full"
                  aria-label="Buka Undangan Pernikahan"
                >
                  {/* Silk Ribbon Ends */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-28 flex justify-center -z-10 pointer-events-none">
                    <div className="w-3.5 h-full bg-[#8E2818] shadow-sm transform -rotate-15 rounded-xs" />
                    <div className="w-3.5 h-full bg-[#A83622] shadow-sm transform rotate-15 -ml-1 rounded-xs" />
                  </div>

                  {/* Wax Seal Disk with Animated Glow */}
                  <div className="w-20 h-20 sm:w-22 sm:h-22 wax-seal animate-wax-glow rounded-full flex flex-col items-center justify-center text-[#FEE8E1] p-1 shadow-xl">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-[#FCA590]/50 flex flex-col items-center justify-center text-center p-1">
                      <Heart className="w-4 h-4 text-[#FDE5DC] mb-0.5 fill-current animate-pulse" />
                      <span className="font-serif font-bold tracking-widest text-[12px] drop-shadow-sm">
                        D & S
                      </span>
                      <span className="text-[8px] uppercase tracking-wider font-sans font-bold text-[#FEE8E1]/90">
                        BUKA
                      </span>
                    </div>
                  </div>
                </motion.button>

                <span className="text-xs font-sans text-[#7A6755] mt-4 flex items-center gap-1.5 animate-pulse">
                  <Mail className="w-3.5 h-3.5 text-[#C26D53]" />
                  Ketuk segel lilin untuk membuka undangan
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
