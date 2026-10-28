"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

interface PetalItem {
  id: number;
  startX: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  rotationSpeed: number;
  variant: "maroon-heart" | "blush-heart" | "gold-star" | "sage-leaf" | "gold-dot";
}

const STATIC_PETALS: PetalItem[] = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  startX: ((i * 19) % 90) + 5,
  size: ((i * 3) % 8) + 14,
  duration: ((i * 2) % 5) + 11,
  delay: (i * 0.4) % 4,
  driftX: (i % 2 === 0 ? 1 : -1) * (14 + (i % 5) * 3),
  rotationSpeed: (i % 2 === 0 ? 1 : -1) * (120 + (i % 4) * 30),
  variant:
    i % 5 === 0
      ? "maroon-heart"
      : i % 5 === 1
      ? "blush-heart"
      : i % 5 === 2
      ? "gold-star"
      : i % 5 === 3
      ? "sage-leaf"
      : "gold-dot",
}));

export function FallingPaperPetals() {
  const shouldReduceMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  if (shouldReduceMotion) {
    return null;
  }

  if (!isEnabled) {
    return (
      <button
        onClick={() => setIsEnabled(true)}
        className="fixed top-4 right-4 lg:absolute lg:top-14 lg:right-4 z-40 p-2.5 rounded-full bg-white/95 border-2 border-[#660F1A] text-[#660F1A] hover:bg-[#FFF0F3] text-xs shadow-[2px_3px_0px_#660F1A] transition-transform hover:scale-105 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center pointer-events-auto"
        title="Aktifkan Efek Kelopak Cinta"
        aria-label="Aktifkan Efek Kelopak Cinta"
      >
        <Heart className="w-4 h-4 fill-current text-[#D63D56]" />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsEnabled(false)}
        className="fixed top-4 right-4 lg:absolute lg:top-14 lg:right-4 z-40 px-3.5 py-1.5 rounded-full bg-white/95 border-2 border-[#660F1A] text-[#660F1A] hover:bg-[#FFF0F3] text-[11px] font-script font-bold shadow-[2px_3px_0px_#660F1A] flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer min-h-[44px] pointer-events-auto"
        title="Matikan animasi kelopak cinta melayang"
        aria-label="Matikan Efek Kelopak Cinta"
      >
        <Heart className="w-3.5 h-3.5 text-[#D63D56] fill-current" />
        <span className="hidden sm:inline">Efek Cinta: Aktif ♥</span>
      </button>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
        <AnimatePresence>
          {STATIC_PETALS.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{
                top: -30,
                left: `${petal.startX}%`,
                opacity: 0,
                y: 0,
                x: 0,
                rotate: 0,
                scaleX: 1,
              }}
              animate={{
                y: "108vh",
                x: [0, petal.driftX, -petal.driftX * 0.6, petal.driftX * 0.8, 0],
                scaleX: [1, 0.6, -0.6, 0.8, 1],
                rotate: [0, petal.rotationSpeed],
                opacity: [0, 0.85, 0.85, 0],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: petal.size,
                height: petal.size,
                willChange: "transform, opacity",
              }}
              className="absolute pointer-events-none flex items-center justify-center select-none"
            >
              {petal.variant === "maroon-heart" && (
                <svg viewBox="0 0 24 24" fill="#7D1128" className="w-full h-full drop-shadow-xs opacity-85">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
              {petal.variant === "blush-heart" && (
                <svg viewBox="0 0 24 24" fill="#F5A8B8" className="w-full h-full drop-shadow-xs opacity-90">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
              {petal.variant === "gold-star" && (
                <svg viewBox="0 0 24 24" fill="#E5B869" className="w-full h-full drop-shadow-xs opacity-85">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              )}
              {petal.variant === "sage-leaf" && (
                <svg viewBox="0 0 24 24" fill="#A3B899" className="w-full h-full drop-shadow-xs opacity-85">
                  <path d="M17 8C8 10 5 16 5 21C10 21 16 18 18 9C19 4 17 8 17 8Z" />
                </svg>
              )}
              {petal.variant === "gold-dot" && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#E5B869] opacity-75 shadow-xs" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
