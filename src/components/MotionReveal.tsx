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
      hidden: { opacity: 0, y: 28 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1.0] },
      },
    },
    "paper-unfold": {
      hidden: { opacity: 0, rotateX: -18, scale: 0.95, y: 20 },
      visible: {
        opacity: 1,
        rotateX: 0,
        scale: 1,
        y: 0,
        transition: { duration: duration + 0.2, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    "polaroid-drop": {
      hidden: { opacity: 0, y: -24, rotate: -4, scale: 0.93 },
      visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 120,
          damping: 14,
          delay,
        },
      },
    },
    "scale-in": {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
    "slide-left": {
      hidden: { opacity: 0, x: -30 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
    "slide-right": {
      hidden: { opacity: 0, x: 30 },
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
