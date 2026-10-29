"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
import { getFontFamilyCss } from "@/lib/typography";
import { CharMotionReveal } from "@/components/CharMotionReveal";
import { MOTION_TRANSITIONS } from "@/lib/motion";

interface EnvelopeCoverProps {
  onOpen: () => void;
  isOpen: boolean;
  initialGuestName?: string;
}

export function EnvelopeCover({ onOpen, isOpen, initialGuestName }: EnvelopeCoverProps) {
  const data = useWeddingData();
  const shouldReduceMotion = useReducedMotion();
  const [paramGuestName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const to = params.get("to") || params.get("nama");
        if (to) return to.trim();
      } catch {
      }
    }
    return "";
  });
  const [isOpening, setIsOpening] = useState<boolean>(false);

  const displayGuestName = initialGuestName?.trim() || paramGuestName || "Tamu Undangan";

  const handleOpenInvitation = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    try {
      if (!shouldReduceMotion) confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.65 },
        colors: ["#7D1128", "#A3B899", "#E5B869", "#F5A8B8", "#FFFDF8"],
      });
    } catch {
    }

    const durationMs = shouldReduceMotion ? 120 : 820;
    setTimeout(() => {
      onOpen();
    }, durationMs);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="envelope-cover-root"
          initial={{ opacity: 0 }}
          animate={
            isOpening
              ? shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -24, scale: 0.99 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          exit={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : -20,
            transition: { duration: shouldReduceMotion ? 0.2 : 0.65, ease: MOTION_TRANSITIONS.romantic.ease },
          }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : MOTION_TRANSITIONS.opening.duration,
            ease: MOTION_TRANSITIONS.romantic.ease,
          }}
          className="fixed lg:absolute inset-0 z-50 flex items-center justify-center p-4 select-none paper-texture bg-[#FFF5F6]"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [-3, 3, -3], rotate: [-1.5, 1.5, -1.5] }}
            transition={{ repeat: Infinity, duration: 6.8, ease: "easeInOut" }}
            className="absolute top-6 left-6 pointer-events-none opacity-80"
          >
            <KidsDrawingSun className="w-14 h-14" />
          </motion.div>

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [3, -3, 3], rotate: [1.8, -1.8, 1.8] }}
            transition={{ repeat: Infinity, duration: 6.2, ease: "easeInOut", delay: 0.4 }}
            className="absolute top-12 right-10 pointer-events-none opacity-75"
          >
            <KidsDrawingStar className="w-8 h-8 text-[#FFE58F]" />
          </motion.div>

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [-2.5, 2.5, -2.5], scale: [0.98, 1.02, 0.98] }}
            transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut", delay: 0.8 }}
            className="absolute bottom-10 left-8 pointer-events-none opacity-75"
          >
            <KidsDrawingHeart className="w-9 h-9" />
          </motion.div>

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [2.5, -2.5, 2.5], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 6.4, ease: "easeInOut", delay: 0.6 }}
            className="absolute bottom-12 right-8 pointer-events-none opacity-75"
          >
            <KidsDrawingHeart className="w-8 h-8" />
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.72, delay: 0.2, ease: MOTION_TRANSITIONS.romantic.ease }}
            className="absolute top-8 right-8 hidden sm:block"
          >
            <PaperStamp text="RESMI SAH" date="28 • 11 • 2026" />
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 16, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: MOTION_TRANSITIONS.romantic.ease }}
            className="relative w-full max-w-md my-auto py-2 sm:py-4"
          >
            <div className="relative bg-[#FFF0F3] rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 text-center border-[3px] border-[#660F1A] shadow-[4px_6px_0px_#660F1A] sm:shadow-[6px_8px_0px_#660F1A] overflow-hidden">
              <CrayonWashiTape
                text="♥ SPESIAL UNTUKMU ♥"
                color="gold"
                className="absolute -top-3.5 left-4 sm:left-8 z-30"
              />
              <CrayonWashiTape
                text="★ HARI BAHAGIA ★"
                color="maroon"
                className="absolute -top-3.5 right-4 sm:right-8 z-30"
              />

              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: MOTION_TRANSITIONS.romantic.ease }}
                className="w-full h-8 -mx-3.5 sm:-mx-7 -mt-3.5 sm:-mt-7 bg-gradient-to-r from-[#7D1128] via-[#8A1C2C] to-[#7D1128] border-b-2 border-[#4A0812] flex items-center justify-center mb-3"
              >
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFE58F] uppercase">
                  ✦ OFFICIAL WEDDING INVITATION ✦
                </span>
              </motion.div>

              <motion.div
                animate={
                  isOpening
                    ? shouldReduceMotion
                      ? { opacity: 0 }
                      : { y: -20, scale: 0.99, opacity: 0 }
                    : { y: 0, scale: 1, opacity: 1 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0.2 : MOTION_TRANSITIONS.opening.duration,
                  ease: MOTION_TRANSITIONS.romantic.ease,
                }}
                className="crayon-box p-3.5 sm:p-7 relative z-10 my-1.5 sm:my-2 bg-white"
              >
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.16, ease: MOTION_TRANSITIONS.romantic.ease }}
                  className="flex justify-center mb-2 sm:mb-3"
                >
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-script font-bold tracking-wide bg-[#FFF0F3] text-[#7D1128] border-2 border-[#7D1128] shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#B3394B]" />
                    Undangan Pernikahan
                    <Sparkles className="w-3.5 h-3.5 text-[#B3394B]" />
                  </span>
                </motion.div>

                <motion.h1
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.72, delay: 0.22, ease: MOTION_TRANSITIONS.romantic.ease }}
                  style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
                  className="font-couple-title font-handwriting text-3xl min-[380px]:text-4xl sm:text-6xl maroon-shimmer-text my-1.5 sm:my-2 leading-tight tracking-wide"
                >
                  <CharMotionReveal text={data.couple?.groom?.name || "Gilang"} baseDelay={0.2} />{" "}
                  <span className="font-script text-2xl min-[380px]:text-3xl sm:text-4xl text-[#7D1128]">&amp;</span>{" "}
                  <CharMotionReveal text={data.couple?.bride?.name || "Salsa"} baseDelay={0.45} />
                </motion.h1>

                {data.events[0]?.displayDate && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.65, delay: 0.3, ease: MOTION_TRANSITIONS.romantic.ease }}
                  className="inline-block bg-[#FFE58F] text-[#4A0812] px-3.5 py-1 rounded-full border-2 border-[#4A0812] text-xs font-mono font-bold my-1 rotate-[-1deg] shadow-[2px_2px_0px_#4A0812] max-w-full"
                >
                  {[data.events[0].displayDay, data.events[0].displayDate].filter(Boolean).join(", ")}
                </motion.div>
                )}

                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.68, delay: 0.38, ease: MOTION_TRANSITIONS.romantic.ease }}
                  className="border-2 border-dashed border-[#8A1C2C]/40 py-3 px-3 sm:py-4 sm:px-4 my-3 sm:my-4 bg-[#FFF9FA] rounded-2xl"
                >
                  <p className="text-xs font-mono font-bold text-[#7D1128] uppercase tracking-wider mb-1">
                    Kepada Yth. Bapak/Ibu/Saudara/i:
                  </p>
                  <p className="font-script text-xl min-[380px]:text-2xl sm:text-3xl text-[#4A0812] font-bold px-1 sm:px-2 py-0.5 leading-snug">
                    <CharMotionReveal text={displayGuestName} baseDelay={0.65} />
                  </p>
                  <p className="text-xs text-[#8A1C2C] mt-1.5 font-sans leading-relaxed">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.
                  </p>
                </motion.div>

                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.68, delay: 0.46, ease: MOTION_TRANSITIONS.romantic.ease }}
                  className="mt-4 sm:mt-5 flex flex-col items-center justify-center"
                >
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    onClick={handleOpenInvitation}
                    animate={
                      isOpening
                        ? { scale: [1, 1.06, 0.9], opacity: [1, 0.9, 0], y: -6 }
                        : shouldReduceMotion
                        ? {}
                        : { y: [-1.5, 1.5, -1.5] }
                    }
                    transition={
                      isOpening
                        ? { duration: 0.6, ease: MOTION_TRANSITIONS.romantic.ease }
                        : { repeat: Infinity, duration: 4.2, ease: "easeInOut" }
                    }
                    className="relative mb-2.5 sm:mb-3 flex flex-col items-center cursor-pointer"
                    title="Buka Undangan"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-16 flex justify-center -z-10 pointer-events-none">
                      <div className="w-3 h-full bg-[#4A0812] border border-[#2D050B] shadow-xs transform -rotate-15 rounded-xs" />
                      <div className="w-3 h-full bg-[#E5B869] border border-[#4A0812] shadow-xs transform rotate-15 -ml-1 rounded-xs" />
                    </div>

                    <div className="w-11 h-11 sm:w-12 sm:h-12 wax-seal-maroon rounded-full flex flex-col items-center justify-center text-[#FFF0F3] p-1 shadow-[2px_3px_0px_#4A0812]">
                      <div className="w-full h-full rounded-full border border-dashed border-[#FFE58F]/80 flex flex-col items-center justify-center text-center">
                        <Heart className="w-3.5 h-3.5 text-[#FAD2D8] fill-current" />
                        <span className="font-script font-bold tracking-wider text-[9px] sm:text-[10px] text-white">
                          {(data.couple?.groom?.name || "G")[0]} &amp; {(data.couple?.bride?.name || "S")[0]}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    onClick={handleOpenInvitation}
                    disabled={isOpening}
                    className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-full bg-[#7D1128] hover:bg-[#660F1A] text-white border-2 border-[#4A0812] shadow-[4px_5px_0px_#4A0812] flex items-center justify-center gap-3 transition-colors cursor-pointer group min-h-[48px] focus:outline-none focus:ring-4 focus:ring-[#F5A8B8]/60"
                    aria-label="Buka Undangan (Open Invitation)"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFF0F3] border border-[#FFE58F] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-[#7D1128] group-hover:scale-108 transition-transform" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-script font-bold text-lg sm:text-xl text-white leading-none">
                        {isOpening ? "Membuka Surat..." : "Buka Undangan"}
                      </span>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#FFE58F] font-bold mt-0.5">
                        Open Invitation 💌
                      </span>
                    </div>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
