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
  variant: "red-heart" | "pink-heart" | "yellow-star" | "blue-sparkle" | "green-dot";
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
          ? "red-heart"
          : i % 5 === 1
          ? "pink-heart"
          : i % 5 === 2
          ? "yellow-star"
          : i % 5 === 3
          ? "blue-sparkle"
          : "green-dot",
    }));

    setPetals(generated);
  }, []);

  if (!isEnabled) {
    return (
      <button
        onClick={() => setIsEnabled(true)}
        className="fixed top-4 right-4 z-40 p-2.5 rounded-full bg-[#FEF08A] border-2 border-[#222222] text-[#222222] hover:bg-[#FDE047] text-xs shadow-[2px_2px_0px_#222222] transition-transform hover:scale-110 cursor-pointer"
        title="Aktifkan Efek Konfeti Lucu"
        aria-label="Aktifkan Efek Konfeti Lucu"
      >
        <Heart className="w-5 h-5 fill-current text-[#EF4444]" />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsEnabled(false)}
        className="fixed top-4 right-4 z-40 px-3.5 py-1.5 rounded-full bg-[#FEF08A] border-2 border-[#222222] text-[#222222] hover:bg-[#FDE047] text-[11px] font-script font-bold shadow-[2px_2px_0px_#222222] flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
        title="Matikan animasi konfeti cinta melayang"
        aria-label="Matikan Efek Konfeti"
      >
        <Heart className="w-3.5 h-3.5 text-[#EF4444] fill-current animate-pulse" />
        <span className="hidden sm:inline">Efek Ceria: Aktif ✨</span>
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
              {petal.variant === "red-heart" && (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#EF4444"
                    stroke="#222222"
                    strokeWidth="1.5"
                  />
                </svg>
              )}

              {petal.variant === "pink-heart" && (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#EC4899"
                    stroke="#222222"
                    strokeWidth="1.5"
                  />
                </svg>
              )}

              {petal.variant === "yellow-star" && (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
                  <polygon
                    points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"
                    fill="#FBBF24"
                    stroke="#222222"
                    strokeWidth="1.5"
                  />
                </svg>
              )}

              {petal.variant === "blue-sparkle" && (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
                  <circle cx="12" cy="12" r="7" fill="#3B82F6" stroke="#222222" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="2" fill="#FFFFFF" />
                </svg>
              )}

              {petal.variant === "green-dot" && (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
                  <circle cx="12" cy="12" r="6" fill="#22C55E" stroke="#222222" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="1.5" fill="#FFFFFF" />
                </svg>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
