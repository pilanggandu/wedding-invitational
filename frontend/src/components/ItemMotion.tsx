"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_TRANSITIONS } from "@/lib/motion";

export type MotionVariantType =
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "card-lift"
  | "pop"
  | "stamp"
  | "frame-mount"
  | "fade";

export interface ItemMotionProps {
  children: React.ReactNode;
  variant?: MotionVariantType;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  float?: boolean;
  floatDuration?: number;
  floatDistance?: number;
  rotate?: number;
  viewportOnce?: boolean;
  amount?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function ItemMotion({
  children,
  variant = "slide-up",
  delay = 0,
  duration = MOTION_TRANSITIONS.romantic.duration,
  className = "",
  style,
  float = false,
  floatDuration = 5.2,
  floatDistance = 4,
  rotate = 0,
  viewportOnce = true,
  amount = 0.12,
  onClick,
}: ItemMotionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style} onClick={onClick}>
        {children}
      </div>
    );
  }

  const getInitial = () => {
    switch (variant) {
      case "slide-left":
        return { opacity: 0, x: -16, y: 0, rotate };
      case "slide-right":
        return { opacity: 0, x: 16, y: 0, rotate };
      case "slide-down":
        return { opacity: 0, y: -14, x: 0, rotate };
      case "card-lift":
        return { opacity: 0, scale: 0.985, y: 12, rotate };
      case "pop":
        return { opacity: 0, scale: 0.94, y: 8, rotate };
      case "stamp":
        return { opacity: 0, scale: 1.05, y: -8, rotate: rotate - 2 };
      case "frame-mount":
        return { opacity: 0, scale: 1.07, y: -36, rotate: rotate ? rotate - 4 : -4 };
      case "fade":
        return { opacity: 0, rotate };
      case "slide-up":
      default:
        return { opacity: 0, y: 16, x: 0, rotate };
    }
  };

  const transitionConfig = {
    duration: variant === "frame-mount" ? duration || 0.95 : duration,
    delay,
    ease:
      variant === "frame-mount"
        ? ([0.2, 0.9, 0.3, 1] as const)
        : MOTION_TRANSITIONS.romantic.ease,
  };

  if (float) {
    return (
      <motion.div
        initial={getInitial()}
        whileInView={{
          opacity: 1,
          x: 0,
          y: [0, -floatDistance, 0],
          scale: 1,
          rotate: [rotate - 0.8, rotate + 0.8, rotate - 0.8],
          transition: {
            opacity: { duration, delay, ease: MOTION_TRANSITIONS.romantic.ease },
            x: { duration, delay, ease: MOTION_TRANSITIONS.romantic.ease },
            scale: { duration, delay, ease: MOTION_TRANSITIONS.romantic.ease },
            rotate: {
              delay: delay + duration * 0.3,
              duration: floatDuration * 1.25,
              repeat: Infinity,
              ease: "easeInOut",
            },
            y: {
              delay: delay + duration * 0.3,
              duration: floatDuration,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
        }}
        viewport={{ once: viewportOnce, amount }}
        className={className}
        style={style}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate,
      }}
      viewport={{ once: viewportOnce, amount }}
      transition={transitionConfig}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
  stagger = 0.08,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
