"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface KeepsakeCharMotionProps {
  text: string;
  className?: string;
  baseDelay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
}

const MOTION_ELEMENTS = {
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
} as const;

const CHAR_EASE = [0.16, 1, 0.3, 1] as const;

export function KeepsakeCharMotion({
  text,
  className = "",
  baseDelay = 0.2,
  stagger = 0.045,
  as: Component = "span",
}: KeepsakeCharMotionProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);
  const MotionComponent = MOTION_ELEMENTS[Component] || motion.span;

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: stagger,
          delayChildren: baseDelay,
        },
      },
    }),
    [stagger, baseDelay],
  );

  const charVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 10,
        rotate: 2.5,
      },
      visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        transition: {
          duration: 0.55,
          ease: CHAR_EASE,
        },
      },
    }),
    [],
  );

  if (shouldReduceMotion) {
    return <Component className={`pk-char-motion ${className}`}>{text}</Component>;
  }

  return (
    <MotionComponent
      className={`pk-char-motion ${className}`}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3, margin: "0px 0px -30px 0px" }}
      variants={containerVariants}
    >
      <span className="pk-char-screenreader sr-only">{text}</span>
      <span aria-hidden="true" className="pk-char-track">
        {words.map((word, wordIndex) => {
          const chars = word.split("");
          return (
            <span key={`word-${wordIndex}-${word}`} className="pk-char-word">
              {chars.map((char, charIndex) => (
                <motion.span
                  key={`char-${wordIndex}-${charIndex}-${char}`}
                  className="pk-char"
                  variants={charVariants}
                >
                  {char}
                </motion.span>
              ))}
              {wordIndex < words.length - 1 && (
                <span className="pk-char pk-char-space">&nbsp;</span>
              )}
            </span>
          );
        })}
      </span>
    </MotionComponent>
  );
}
