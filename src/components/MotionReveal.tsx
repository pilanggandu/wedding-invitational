"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface MotionRevealProps {
  children: React.ReactNode;
  variant?:
    | "fade-up"
    | "paper-unfold"
    | "polaroid-drop"
    | "scale-in"
    | "slide-left"
    | "slide-right"
    | "float-gentle";
  delay?: number;
  duration?: number;
  className?: string;
}

export function MotionReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.7,
  className = "",
}: MotionRevealProps) {
  const variantsMap: Record<string, Variants> = {
    "fade-up": {
      hidden: { opacity: 0, y: 28 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 85,
          damping: 18,
          mass: 0.8,
          delay,
        },
      },
    },
    // Pure 2D Flat Paper Reveal with Silky Spring
    "paper-unfold": {
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 75,
          damping: 17,
          mass: 0.9,
          delay,
        },
      },
    },
    // Pure 2D Flat Polaroid Drop with bouncy natural overshoot
    "polaroid-drop": {
      hidden: { opacity: 0, y: -24, scale: 0.94 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 14,
          delay,
        },
      },
    },
    "scale-in": {
      hidden: { opacity: 0, scale: 0.92 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 90,
          damping: 18,
          delay,
        },
      },
    },
    "slide-left": {
      hidden: { opacity: 0, x: -32 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 85,
          damping: 18,
          delay,
        },
      },
    },
    "slide-right": {
      hidden: { opacity: 0, x: 32 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 85,
          damping: 18,
          delay,
        },
      },
    },
    // Gentle ambient floating
    "float-gentle": {
      hidden: { opacity: 0, y: 15 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        },
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
