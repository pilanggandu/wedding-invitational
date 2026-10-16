"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RoyalMotionRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  variant?: "fade-up" | "fade" | "scale-up" | "slide-left" | "slide-right";
  className?: string;
}

export function RoyalMotionReveal({
  children,
  delay = 0,
  duration = 0.8,
  variant = "fade-up",
  className = "",
}: RoyalMotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitial = () => {
    switch (variant) {
      case "fade":
        return { opacity: 0 };
      case "scale-up":
        return { opacity: 0, scale: 0.95 };
      case "slide-left":
        return { opacity: 0, x: -24 };
      case "slide-right":
        return { opacity: 0, x: 24 };
      case "fade-up":
      default:
        return { opacity: 0, y: 22 };
    }
  };

  const getTarget = () => {
    switch (variant) {
      case "fade":
        return { opacity: 1 };
      case "scale-up":
        return { opacity: 1, scale: 1 };
      case "slide-left":
      case "slide-right":
        return { opacity: 1, x: 0 };
      case "fade-up":
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getTarget()}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Cubic bezier for majestic, smooth deceleration
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default RoyalMotionReveal;
