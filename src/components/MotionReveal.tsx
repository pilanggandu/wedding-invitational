"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface MotionRevealProps {
  children: React.ReactNode;
  variant?: "fade-up" | "paper-unfold" | "polaroid-drop" | "scale-in" | "slide-left" | "slide-right";
  delay?: number;
  duration?: number;
  className?: string;
}

export function MotionReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.65,
  className = "",
}: MotionRevealProps) {
  const variantsMap: Record<string, Variants> = {
    "fade-up": {
      hidden: { opacity: 0, y: 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1.0] },
      },
    },
    // Pure 2D Flat Paper Reveal
    "paper-unfold": {
      hidden: { opacity: 0, scale: 0.94, y: 18 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: duration + 0.15, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    // Pure 2D Flat Polaroid Drop
    "polaroid-drop": {
      hidden: { opacity: 0, y: -20, scale: 0.94 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 140,
          damping: 15,
          delay,
        },
      },
    },
    "scale-in": {
      hidden: { opacity: 0, scale: 0.92 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
    "slide-left": {
      hidden: { opacity: 0, x: -28 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
    "slide-right": {
      hidden: { opacity: 0, x: 28 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variantsMap[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
