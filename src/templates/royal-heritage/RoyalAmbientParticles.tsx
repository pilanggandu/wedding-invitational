"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number; // percentage 0 - 100
  size: number; // size in px
  duration: number; // duration in seconds
  delay: number; // delay in seconds
  opacity: number;
}

interface RoyalAmbientParticlesProps {
  count?: number;
  className?: string;
}

export function RoyalAmbientParticles({
  count = 18,
  className = "",
}: RoyalAmbientParticlesProps) {
  // Generate consistent pseudo-random particles
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.floor((i * 137.5) % 96) + 2, // Golden ratio distribution
      size: (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5),
      duration: 12 + (i % 7) * 2, // 12s - 24s slow graceful drift
      delay: (i * 0.8) % 10,
      opacity: 0.25 + (i % 4) * 0.1,
    }));
  }, [count]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden z-10 select-none ${className}`}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            y: "105%",
            x: `${p.x}%`,
            opacity: 0,
            scale: 0.6,
          }}
          animate={{
            y: "-5%",
            x: [`${p.x}%`, `${(p.x + (p.id % 2 === 0 ? 4 : -4)) % 100}%`, `${p.x}%`],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0.6, 1, 1, 0.6],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          className="absolute rounded-full bg-[#C8A97E] shadow-[0_0_8px_rgba(200,169,126,0.6)]"
        />
      ))}
    </div>
  );
}

export default RoyalAmbientParticles;
