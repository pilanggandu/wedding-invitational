"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaintedTextRevealProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  mode?: "letters" | "words" | "lines";
  loopFade?: boolean; // font muncul lalu fade out satu per satu dan berulang
  intervalSeconds?: number;
  highlightColor?: string;
}

export function PaintedTextReveal({
  text,
  className = "",
  staggerDelay = 0.08,
  mode = "words",
  loopFade = true,
  intervalSeconds = 6,
  highlightColor = "#D97736",
}: PaintedTextRevealProps) {
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (!loopFade) return;

    const timer = setInterval(() => {
      setCycleKey((prev) => prev + 1);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [loopFade, intervalSeconds]);

  // Split text based on mode
  const units = mode === "words" ? text.split(" ") : text.split("");

  return (
    <div className={`inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={cycleKey}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.1,
              },
            },
            exit: {
              opacity: 0,
              transition: {
                staggerChildren: staggerDelay * 0.7,
                staggerDirection: -1,
                duration: 0.8,
              },
            },
          }}
          className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
        >
          {units.map((unit, index) => (
            <motion.span
              key={`${cycleKey}-${index}`}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 12,
                  scale: 0.88,
                  filter: "blur(6px)",
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
                exit: {
                  opacity: 0,
                  y: -10,
                  scale: 0.92,
                  filter: "blur(5px)",
                  transition: {
                    duration: 0.5,
                    ease: "easeInOut",
                  },
                },
              }}
              style={{
                textShadow: "0 2px 10px rgba(217, 119, 54, 0.15)",
              }}
              className="inline-block relative select-none will-change-transform"
            >
              {unit === " " ? "\u00A0" : unit}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/**
 * Text specifically styled like wet acrylic brush stroke on textured canvas
 */
export function BrushStrokeText({
  children,
  className = "",
  color = "#D97736",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span
      style={{
        color,
        fontFamily: "'Caveat', 'Marck Script', 'Playfair Display', cursive, serif",
        textShadow: "0 1px 2px rgba(0,0,0,0.08)",
      }}
      className={`inline-block tracking-wide font-bold italic ${className}`}
    >
      {children}
    </span>
  );
}
