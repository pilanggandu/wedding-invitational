"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PetalItem {
  id: number;
  startX: number;
  size: number;
  duration: number;
  delay: number;
  rotationSpeed: number;
  variant: "terracotta" | "cream" | "gold" | "leaf";
}

export function FallingPaperPetals() {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [petals, setPetals] = useState<PetalItem[]>([]);

  useEffect(() => {
    // Generate randomized paper petal particles
    const generated: PetalItem[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      startX: Math.random() * 95, // 0% to 95% viewport width
      size: Math.random() * 12 + 10, // 10px to 22px
      duration: Math.random() * 8 + 9, // 9s to 17s fall time
      delay: Math.random() * 6,
      rotationSpeed: (Math.random() - 0.5) * 720,
      variant:
        i % 4 === 0
          ? "terracotta"
          : i % 4 === 1
          ? "cream"
          : i % 4 === 2
          ? "gold"
          : "leaf",
    }));

    setPetals(generated);
  }, []);

  if (!isEnabled) {
    return (
      <button
        onClick={() => setIsEnabled(true)}
        className="fixed top-4 right-4 z-40 p-2 rounded-full bg-[#FFFDF9]/90 border border-[#D5C2AA] text-[#8C7561] hover:text-[#A85A42] text-xs shadow-md backdrop-blur-xs transition-transform hover:scale-105 cursor-pointer"
        title="Aktifkan Efek Kelopak Kertas"
        aria-label="Aktifkan Efek Kelopak Kertas"
      >
        <Sparkles className="w-4 h-4" />
      </button>
    );
  }

  return (
    <>
      {/* Floating Toggle in header */}
      <button
        onClick={() => setIsEnabled(false)}
        className="fixed top-4 right-4 z-40 px-3 py-1.5 rounded-full bg-[#FFFDF9]/85 border border-[#DECBB4] text-[#7A6451] hover:text-[#A85A42] text-[11px] font-sans shadow-xs backdrop-blur-xs flex items-center gap-1.5 transition-all hover:shadow-md cursor-pointer"
        title="Matikan animasi kelopak melayang"
        aria-label="Matikan Efek Kelopak"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C26D53]" />
        <span className="hidden sm:inline">Efek Kelopak: Aktif</span>
      </button>

      {/* Ambient Petals Container */}
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
                  `${petal.startX + 6}%`,
                  `${petal.startX - 6}%`,
                  `${petal.startX + 3}%`,
                ],
                opacity: [0, 0.85, 0.9, 0],
                rotate: petal.rotationSpeed,
                scale: [0.8, 1.1, 0.9, 0.7],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute"
              style={{ width: petal.size, height: petal.size * 1.3 }}
            >
              {petal.variant === "terracotta" && (
                <svg viewBox="0 0 30 40" className="w-full h-full drop-shadow-xs">
                  {/* Terracotta paper rose petal */}
                  <path
                    d="M15 2 C25 2 28 15 26 28 C24 38 15 39 15 39 C15 39 6 38 4 28 C2 15 5 2 15 2 Z"
                    fill="#C26D53"
                    opacity="0.75"
                  />
                  <path
                    d="M15 5 Q14 20 15 35"
                    stroke="#A85A42"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.6"
                  />
                </svg>
              )}

              {petal.variant === "cream" && (
                <svg viewBox="0 0 30 40" className="w-full h-full drop-shadow-xs">
                  {/* Kraft cream paper petal */}
                  <path
                    d="M15 2 C24 4 27 16 25 27 C23 37 15 38 15 38 C15 38 7 37 5 27 C3 16 6 4 15 2 Z"
                    fill="#EADBC6"
                    opacity="0.85"
                  />
                  <path
                    d="M15 6 Q16 20 15 34"
                    stroke="#D5C2AA"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.7"
                  />
                </svg>
              )}

              {petal.variant === "gold" && (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
                  {/* Golden cut star sparkle */}
                  <polygon
                    points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"
                    fill="#D4AF37"
                    opacity="0.7"
                  />
                </svg>
              )}

              {petal.variant === "leaf" && (
                <svg viewBox="0 0 24 36" className="w-full h-full drop-shadow-xs">
                  {/* Sage green paper leaf */}
                  <path
                    d="M12 2 C20 8 22 22 12 34 C2 22 4 8 12 2 Z"
                    fill="#8A9A86"
                    opacity="0.7"
                  />
                  <line
                    x1="12"
                    y1="4"
                    x2="12"
                    y2="30"
                    stroke="#6F7E6B"
                    strokeWidth="0.8"
                  />
                </svg>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
