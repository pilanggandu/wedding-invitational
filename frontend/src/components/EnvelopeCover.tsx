"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { Mail, Heart, Sparkles } from "lucide-react";
import { BotanicalLeaves } from "./PaperArtDecorations";
import { useWeddingData } from "@/context/WeddingDataContext";
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
      if (!shouldReduceMotion) {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.65 },
          colors: ["#7D1128", "#A3B899", "#E5B869", "#F5A8B8", "#FFFDF8"],
        });
      }
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
          style={{
            backgroundImage: "url('/images/paper-art/paper-texture-ivory.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "380px",
          }}
          className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none bg-[#FBF6EE] overflow-y-auto min-h-full"
        >
          {/* Subtle Botanical Corner Foliage */}
          <BotanicalLeaves className="absolute -top-8 -left-8 w-32 sm:w-40 h-44 sm:h-52 opacity-25 rotate-45 pointer-events-none" />
          <BotanicalLeaves className="absolute -bottom-8 -right-8 w-36 sm:w-44 h-48 sm:h-56 opacity-25 -rotate-135 pointer-events-none" />

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 16, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: MOTION_TRANSITIONS.romantic.ease }}
            className="relative w-full max-w-sm sm:max-w-md my-auto py-5 px-1 sm:px-2 overflow-visible"
          >
            {/* Authentic Ivory Sketchbook Card (No overflow-hidden to preserve flourished script glyphs and pins) */}
            <div className="relative bg-[#FFFDF8] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-center border-2 border-dashed border-[#7D1128]/35 shadow-[0_12px_36px_rgba(125,17,40,0.12),3px_5px_0px_#7D1128] overflow-visible">

              {/* Brass Paperclip Washi Accent (Pins naturally over the card edge) */}
              <img
                src="/images/paper-art/paperclip-washi-accent.png"
                alt="Paperclip Accent"
                className="absolute -top-6 -right-2 sm:-right-4 w-16 sm:w-20 pointer-events-none drop-shadow-md select-none z-30 rotate-[6deg]"
              />

              {/* Header Badge */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: MOTION_TRANSITIONS.romantic.ease }}
                className="flex justify-center mb-2 sm:mb-3"
              >
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase bg-[#FFF0F3] text-[#7D1128] border border-[#7D1128]/30 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#B3394B]" />
                  Buku Catatan Pernikahan
                  <Sparkles className="w-3 h-3 text-[#B3394B]" />
                </span>
              </motion.div>

              {(data.general?.heroPhotoUrl || data.general?.coverPhotoUrl) && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.12, ease: MOTION_TRANSITIONS.romantic.ease }}
                  className="relative w-32 sm:w-36 mx-auto aspect-[4/5] rounded-2xl overflow-hidden my-3 bg-[#FAF3EA] border-2 border-[#7D1128]/25 shadow-sm"
                >
                  <img
                    src={data.general.heroPhotoUrl || data.general.coverPhotoUrl}
                    alt={`${data.couple.groom.name} & ${data.couple.bride.name}`}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 border border-white/40 rounded-2xl pointer-events-none" />
                </motion.div>
              )}

              {/* Botanical Olive Wreath Monogram Emblem */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, delay: 0.16, ease: MOTION_TRANSITIONS.romantic.ease }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center my-1 select-none"
              >
                <img
                  src="/images/templates/paper-art/botanical-olive-wreath.svg"
                  alt="Botanical Wreath"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xs select-none"
                />
                <span
                  style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                  className="text-xl sm:text-2xl font-bold text-[#7D1128] tracking-widest z-10 select-none pl-0.5"
                >
                  {(data.couple?.groom?.name || "G")[0]} &amp; {(data.couple?.bride?.name || "S")[0]}
                </span>
              </motion.div>

              {/* Couple Names (Solid rich maroon text for flawless cross-platform WebKit compatibility & generous vertical room) */}
              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.22, ease: MOTION_TRANSITIONS.romantic.ease }}
                style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                className="font-couple-title text-3xl min-[380px]:text-4xl sm:text-5xl text-[#7D1128] my-1 sm:my-2 leading-[1.3] tracking-wide font-bold py-1 overflow-visible"
              >
                <CharMotionReveal text={data.couple?.groom?.name || "Gilang"} baseDelay={0.2} />{" "}
                <span className="font-script text-2xl min-[380px]:text-3xl sm:text-4xl text-[#7D1128]/85 mx-1">&amp;</span>{" "}
                <CharMotionReveal text={data.couple?.bride?.name || "Salsa"} baseDelay={0.45} />
              </motion.h1>

              {/* Crayon Underline Wave */}
              <div className="flex justify-center my-1 sm:my-1.5">
                <svg
                  viewBox="0 0 160 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-32 sm:w-40 h-2.5 pointer-events-none"
                >
                  <path
                    d="M 4 7 Q 40 2 80 7 T 156 5"
                    stroke="#7D1128"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </svg>
              </div>

              {/* Wedding Date Pill */}
              {data.events[0]?.displayDate && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.65, delay: 0.3, ease: MOTION_TRANSITIONS.romantic.ease }}
                  className="inline-block bg-[#FFE58F] text-[#4A0812] px-3.5 py-1 rounded-full border border-[#4A0812]/40 text-xs font-mono font-bold my-1 rotate-[-0.5deg] shadow-[2px_2px_0px_rgba(74,8,18,0.2)] max-w-full"
                >
                  {[data.events[0].displayDay, data.events[0].displayDate].filter(Boolean).join(", ")}
                </motion.div>
              )}

              {/* Dedicated Guest Recipient Card (Ample line-height and padding so flourishes never get clipped) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.68, delay: 0.38, ease: MOTION_TRANSITIONS.romantic.ease }}
                className="border-2 border-dashed border-[#7D1128]/30 py-3.5 px-3.5 sm:py-4 sm:px-5 my-3 sm:my-4 bg-[#FFF9FA] rounded-2xl overflow-visible"
              >
                <p className="text-xs font-mono font-bold text-[#7D1128] uppercase tracking-wider mb-1">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <p className="font-script text-2xl min-[380px]:text-3xl sm:text-4xl text-[#4A0812] font-bold px-2 py-2 leading-normal overflow-visible">
                  <CharMotionReveal text={displayGuestName} baseDelay={0.65} />
                </p>
                <p className="text-xs text-[#8A1C2C] mt-1 font-sans leading-relaxed">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.
                </p>
              </motion.div>

              {/* Wax Seal & Open Action */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.68, delay: 0.46, ease: MOTION_TRANSITIONS.romantic.ease }}
                className="mt-4 sm:mt-5 flex flex-col items-center justify-center overflow-visible"
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
                  className="relative mb-2.5 sm:mb-3 flex flex-col items-center cursor-pointer select-none"
                  title="Buka Undangan"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-16 flex justify-center -z-10 pointer-events-none">
                    <div className="w-3.5 h-full bg-[#4A0812] border border-[#2D050B] shadow-xs transform -rotate-12 rounded-xs" />
                    <div className="w-3.5 h-full bg-[#E5B869] border border-[#4A0812] shadow-xs transform rotate-12 -ml-1 rounded-xs" />
                  </div>

                  <div className="w-12 h-12 sm:w-14 sm:h-14 wax-seal-maroon rounded-full flex flex-col items-center justify-center text-[#FFF0F3] p-1 shadow-[2px_3px_0px_#4A0812]">
                    <div className="w-full h-full rounded-full border border-dashed border-[#FFE58F]/80 flex flex-col items-center justify-center text-center">
                      <Heart className="w-3.5 h-3.5 text-[#FAD2D8] fill-current" />
                      <span className="font-script font-bold tracking-wider text-[10px] sm:text-[11px] text-white">
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
                    <Mail className="w-4 h-4 text-[#7D1128] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-script font-bold text-lg sm:text-xl text-white leading-none">
                      {isOpening ? "Membuka Undangan..." : "Buka Undangan"}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#FFE58F] font-bold mt-0.5">
                      Open Invitation 💌
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
