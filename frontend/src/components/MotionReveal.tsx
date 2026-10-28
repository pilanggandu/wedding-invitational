"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { MOTION_TRANSITIONS } from "@/lib/motion";

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
  duration = MOTION_TRANSITIONS.romantic.duration,
  className = "",
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variantsMap: Record<string, Variants> = {
    "fade-up": {
      hidden: { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: MOTION_TRANSITIONS.romantic.ease,
        },
      },
    },
    "paper-unfold": {
      hidden: { opacity: 0, scale: 0.98, y: 12 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: duration * 1.05,
          delay,
          ease: MOTION_TRANSITIONS.romantic.ease,
        },
      },
    },
    "polaroid-drop": {
      hidden: { opacity: 0, y: -12, scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: duration * 0.9,
          delay,
          ease: MOTION_TRANSITIONS.romantic.ease,
        },
      },
    },
    "scale-in": {
      hidden: { opacity: 0, scale: 0.96 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: MOTION_TRANSITIONS.romantic.ease,
        },
      },
    },
    "slide-left": {
      hidden: { opacity: 0, x: -16 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: MOTION_TRANSITIONS.romantic.ease,
        },
      },
    },
    "slide-right": {
      hidden: { opacity: 0, x: 16 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: MOTION_TRANSITIONS.romantic.ease,
        },
      },
    },
    "float-gentle": {
      hidden: { opacity: 0, y: 12 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: MOTION_TRANSITIONS.romantic.ease,
        },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      variants={variantsMap[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default MotionReveal;
