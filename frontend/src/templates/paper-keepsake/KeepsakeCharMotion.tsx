"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface KeepsakeCharMotionProps {
  text: string;
  className?: string;
  baseDelay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
}

export function KeepsakeCharMotion({
  text,
  className = "",
  baseDelay = 0.2,
  stagger = 0.045,
  as: Component = "span",
}: KeepsakeCharMotionProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <Component className={`pk-char-motion ${className}`}>{text}</Component>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: baseDelay,
      },
    },
  };

  const charVariants = {
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
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const MotionComponent = motion(Component as React.ElementType);

  return (
    <MotionComponent
      className={`pk-char-motion ${className}`}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
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
