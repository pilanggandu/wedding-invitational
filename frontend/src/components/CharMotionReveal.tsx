"use client";

import React from "react";

export interface CharMotionRevealProps {
  text: string;
  className?: string;
  baseDelay?: number;
  delay?: number;
  stagger?: number;
  step?: number;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
}

/**
 * Universal letter-by-letter character reveal component.
 * Staggers characters organically while ensuring words never break across lines.
 */
export function CharMotionReveal({
  text,
  className = "",
  baseDelay,
  delay,
  stagger,
  step,
  as: Component = "span",
}: CharMotionRevealProps) {
  if (!text) return null;

  const actualBaseDelay = baseDelay ?? delay ?? 0.15;
  const actualStagger = stagger ?? step ?? 0.032;

  const words = text.split(" ");
  let charCounter = 0;

  return (
    <Component className={`cm-char-reveal ${className}`} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="cm-char-track">
        {words.map((word, wordIndex) => {
          const chars = word.split("");
          return (
            <span key={`w-${wordIndex}-${word}`} className="cm-char-word">
              {chars.map((char, charIndex) => {
                const charDelay = actualBaseDelay + charCounter * actualStagger;
                charCounter += 1;
                return (
                  <span
                    key={`c-${wordIndex}-${charIndex}-${char}`}
                    className="cm-char"
                    style={{ animationDelay: `${charDelay.toFixed(3)}s` }}
                  >
                    {char}
                  </span>
                );
              })}
              {wordIndex < words.length - 1 && (
                <span
                  key={`sp-${wordIndex}`}
                  className="cm-char cm-char-space"
                  style={{
                    animationDelay: `${(actualBaseDelay + charCounter * actualStagger).toFixed(3)}s`,
                  }}
                >
                  &nbsp;
                </span>
              )}
            </span>
          );
        })}
      </span>
    </Component>
  );
}
