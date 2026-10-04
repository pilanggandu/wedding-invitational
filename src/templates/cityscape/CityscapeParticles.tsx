"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ParticleItem {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  type: "heart" | "star" | "leaf";
  color: string;
}

export function CityscapeParticles() {
  const [particles, setParticles] = useState<ParticleItem[]>([]);

  useEffect(() => {
    const generated: ParticleItem[] = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95, // % from left
      delay: Math.random() * 8,
      duration: 9 + Math.random() * 8,
      size: 10 + Math.random() * 12,
      type: i % 3 === 0 ? "heart" : i % 3 === 1 ? "star" : "leaf",
      color:
        i % 4 === 0
          ? "#38B6FF"
          : i % 4 === 1
          ? "#FFE58F"
          : i % 4 === 2
          ? "#84CC16"
          : "#F472B6",
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -30, opacity: 0, x: `${p.x}vw`, rotate: 0 }}
          animate={{
            y: "105vh",
            opacity: [0, 0.8, 0.8, 0],
            rotate: [0, 180, 360],
            x: [`${p.x}vw`, `${p.x + (p.id % 2 === 0 ? 5 : -5)}vw`, `${p.x}vw`],
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{ width: p.size, height: p.size }}
          className="absolute"
        >
          {p.type === "heart" && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full filter drop-shadow-xs">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.type === "star" && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full filter drop-shadow-xs">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
          )}
          {p.type === "leaf" && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full filter drop-shadow-xs">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.75C6.2 7.5 4 10 4 10s2.5-1 5-1.5c4.5-.9 7-1.5 8-.5z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
