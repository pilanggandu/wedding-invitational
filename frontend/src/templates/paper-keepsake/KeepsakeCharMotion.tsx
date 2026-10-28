"use client";

import React from "react";

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
  baseDelay = 0.15,
  stagger = 0.035,
  as: Component = "span",
}: KeepsakeCharMotionProps) {
  const words = text.split(" ");
  let runningIndex = 0;

  return (
    <Component className={`pk-char-motion ${className}`} aria-label={text}>
      <span className="pk-char-screenreader sr-only">{text}</span>
      <span aria-hidden="true" className="pk-char-track">
        {words.map((word, wordIndex) => {
          const chars = word.split("");
          return (
            <span key={`word-${wordIndex}-${word}`} className="pk-char-word">
              {chars.map((char, charIndex) => {
                const delay = baseDelay + runningIndex * stagger;
                runningIndex += 1;
                return (
                  <span
                    key={`char-${wordIndex}-${charIndex}-${char}`}
                    className="pk-char"
                    style={{ animationDelay: `${delay.toFixed(3)}s` }}
                  >
                    {char}
                  </span>
                );
              })}
              {wordIndex < words.length - 1 && (
                <span
                  key={`space-${wordIndex}`}
                  className="pk-char pk-char-space"
                  style={{
                    animationDelay: `${(baseDelay + runningIndex * stagger).toFixed(3)}s`,
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
