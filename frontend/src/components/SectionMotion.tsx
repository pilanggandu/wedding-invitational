"use client";

import React from "react";
import { useScrollMotion } from "./ScrollMotionContext";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_TRANSITIONS } from "@/lib/motion";

export interface SectionMotionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  variant?: "fade-up" | "fade" | "scale-up" | "slide-left" | "slide-right";
}

export function SectionMotion({
  children,
  id,
  className = "",
  style,
  delay = 0,
  duration = MOTION_TRANSITIONS.romantic.duration,
  variant = "fade-up",
}: SectionMotionProps) {
  const shouldReduceMotion = useReducedMotion();
  const scrollMotion = useScrollMotion();

  if (shouldReduceMotion || scrollMotion) {
    return (
      <section id={id} className={className} style={style}>
        {children}
      </section>
    );
  }

  const getInitial = () => {
    switch (variant) {
      case "fade":
        return { opacity: 0 };
      case "scale-up":
        return { opacity: 0, scale: 0.985, y: 12 };
      case "slide-left":
        return { opacity: 0, x: -16 };
      case "slide-right":
        return { opacity: 0, x: 16 };
      case "fade-up":
      default:
        return { opacity: 0, y: 16 };
    }
  };

  return (
    <motion.section
      id={id}
      initial={getInitial()}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -30px 0px" }}
      transition={{
        duration,
        delay,
        ease: MOTION_TRANSITIONS.romantic.ease,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  );
}

export default SectionMotion;
export { ItemMotion, StaggerContainer } from "./ItemMotion";
export type { ItemMotionProps, MotionVariantType } from "./ItemMotion";
