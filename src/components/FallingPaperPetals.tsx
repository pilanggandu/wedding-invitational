"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface PetalItem {
  id: number;
  startX: number;
  size: number;
  duration: number;
  delay: number;
  rotationSpeed: number;
  variant: "maroon-heart" | "blush-heart" | "gold-star" | "sage-leaf" | "gold-dot";
}

export function FallingPaperPetals() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [petals, setPetals] = useState<PetalItem[]>([]);

  useEffect(() => {
    const generated: PetalItem[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      startX: Math.random() * 95,
      size: Math.random() * 12 + 14, // 14px to 26px
      duration: Math.random() * 7 + 8,
      delay: Math.random() * 5,
      rotationSpeed: (Math.random() - 0.5) * 540,
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

    setPetals(generated);
  }, []);

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
        <Heart className="w-3.5 h-3.5 text-[#D63D56] fill-current animate-pulse" />
        <span className="hidden sm:inline">Efek Cinta: Aktif ♥</span>
      </button>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
        <AnimatePresence>
          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{
                top: "-5%",
                left: `${petal.startX}%`,
                opacity: 0,
                rotate: 0,
                scale: 0.8,
              }}
              animate={{
                top: "105%",
                left: [
                  `${petal.startX}%`,
                  `${petal.startX + 5}%`,
                  `${petal.startX - 5}%`,
                  `${petal.startX + 2}%`,
                ],
                opacity: [0, 0.95, 0.95, 0],
                rotate: petal.rotationSpeed,
                scale: [0.8, 1.15, 0.95, 0.75],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute"
              style={{ width: petal.size, height: petal.size }}
            >
              {petal.variant === "maroon-heart" && (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#7D1128"
                    stroke="#4A0812"
                    strokeWidth="1.5"
                  />
                </svg>
              )}

              {petal.variant === "blush-heart" && (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#F8B4C0"
                    stroke="#660F1A"
                    strokeWidth="1.5"
                  />
                </svg>
              )}

              {petal.variant === "gold-star" && (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
                  <polygon
                    points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"
                    fill="#FFE58F"
                    stroke="#8A5A10"
                    strokeWidth="1.5"
                  />
                </svg>
              )}

              {petal.variant === "sage-leaf" && (
                <svg viewBox="0 0 20 20" className="w-full h-full drop-shadow-xs">
                  <path
                    d="M10 2 C15 5 18 10 16 16 C10 18 5 15 2 10 C4 5 7 3 10 2 Z"
                    fill="#8FA89B"
                    stroke="#4A0812"
                    strokeWidth="1.2"
                  />
                </svg>
              )}

              {petal.variant === "gold-dot" && (
                <svg viewBox="0 0 20 20" className="w-full h-full">
                  <circle cx="10" cy="10" r="5" fill="#E5B869" stroke="#4A0812" strokeWidth="1.5" />
                  <circle cx="12" cy="8" r="1.5" fill="#FFFFFF" />
                </svg>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
