"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Animated cute airplane with gentle drift and soft trail
 */
export function SkyAirplane({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ x: -120, y: 0 }}
      animate={{ x: 380, y: -20 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className={`pointer-events-none absolute z-10 flex items-center gap-1.5 opacity-85 ${className}`}
    >
      <span className="text-sm tracking-widest text-sky-400/80 font-mono text-[9px] select-none">
        - - - ✈️
      </span>
    </motion.div>
  );
}

/**
 * Floating fluffy pastel cloud
 */
export function PastelCloud({
  className = "",
  delay = 0,
  duration = 24,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ x: -60 }}
      animate={{ x: 60 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration,
        delay,
        ease: "easeInOut",
      }}
      className={`pointer-events-none select-none ${className}`}
    >
      <svg
        viewBox="0 0 120 48"
        fill="currentColor"
        className="w-full h-full text-white/80 filter drop-shadow-sm"
      >
        <path d="M20 38h80a14 14 0 0 0 0-28 20 20 0 0 0-38-6 16 16 0 0 0-28 10A14 14 0 0 0 20 38z" />
      </svg>
    </motion.div>
  );
}

/**
 * Modern glass skyscrapers skyline silhouette with glowing windows
 */
export function CitySkylineSvg({
  className = "w-full h-32",
  color = "#2E8BC0",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`relative overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 800 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
      >
        {/* Background Layer Towers (Lighter) */}
        <g opacity="0.45" fill="#75BBE3">
          <rect x="20" y="40" width="45" height="200" rx="3" />
          <polygon points="42,20 35,40 50,40" />
          <rect x="80" y="70" width="55" height="170" rx="2" />
          <rect x="150" y="30" width="65" height="210" rx="4" />
          <polygon points="182,10 176,30 190,30" />
          <rect x="230" y="80" width="40" height="160" rx="2" />
          <rect x="520" y="50" width="60" height="190" rx="3" />
          <polygon points="550,25 542,50 558,50" />
          <rect x="600" y="75" width="50" height="165" rx="2" />
          <rect x="670" y="35" width="70" height="205" rx="4" />
          <polygon points="705,12 698,35 712,35" />
          <rect x="755" y="80" width="35" height="160" rx="2" />
        </g>

        {/* Foreground Layer Skyscrapers (Crisp) */}
        <g fill={color}>
          <rect x="0" y="90" width="65" height="150" rx="4" />
          <rect x="75" y="50" width="55" height="190" rx="3" />
          <polygon points="102,28 95,50 110,50" />
          {/* Windows on left building */}
          <rect x="83" y="65" width="10" height="14" fill="#FFE58F" opacity="0.8" rx="1" />
          <rect x="97" y="65" width="10" height="14" fill="#E8F4F8" opacity="0.8" rx="1" />
          <rect x="111" y="65" width="10" height="14" fill="#FFE58F" opacity="0.7" rx="1" />
          <rect x="83" y="88" width="10" height="14" fill="#E8F4F8" opacity="0.8" rx="1" />
          <rect x="97" y="88" width="10" height="14" fill="#FFE58F" opacity="0.9" rx="1" />
          <rect x="111" y="88" width="10" height="14" fill="#E8F4F8" opacity="0.7" rx="1" />

          {/* Center Low-rise & Bridge */}
          <rect x="140" y="120" width="75" height="120" rx="3" />
          <rect x="225" y="100" width="80" height="140" rx="4" />

          {/* Right Main Towers */}
          <rect x="500" y="110" width="65" height="130" rx="3" />
          <rect x="580" y="60" width="60" height="180" rx="4" />
          <polygon points="610,35 602,60 618,60" />
          <rect x="655" y="45" width="70" height="195" rx="3" />
          <polygon points="690,20 682,45 698,45" />

          {/* Windows on right building */}
          <rect x="665" y="60" width="12" height="15" fill="#FFE58F" opacity="0.85" rx="1" />
          <rect x="683" y="60" width="12" height="15" fill="#E8F4F8" opacity="0.8" rx="1" />
          <rect x="701" y="60" width="12" height="15" fill="#FFE58F" opacity="0.7" rx="1" />
          <rect x="665" y="85" width="12" height="15" fill="#E8F4F8" opacity="0.8" rx="1" />
          <rect x="683" y="85" width="12" height="15" fill="#FFE58F" opacity="0.9" rx="1" />
          <rect x="701" y="85" width="12" height="15" fill="#E8F4F8" opacity="0.7" rx="1" />

          <rect x="735" y="95" width="65" height="145" rx="4" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Vintage Park Lamp Post with warm glowing lantern
 */
export function VintageStreetLamp({
  className = "w-6 h-28",
  isGlowing = true,
}: {
  className?: string;
  isGlowing?: boolean;
}) {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Warm Ambient Glow Aura */}
      {isGlowing && (
        <div className="absolute -top-3 w-12 h-12 rounded-full bg-amber-300/35 blur-md animate-pulse" />
      )}

      {/* Lamp Head */}
      <svg
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 z-10"
      >
        {/* Cap Spire */}
        <path d="M12 2L14 7H10L12 2Z" fill="#1E293B" />
        <path d="M8 7H16L17 9H7L8 7Z" fill="#334155" />
        {/* Lantern Glass Cage */}
        <polygon points="7,9 17,9 15,22 9,22" fill={isGlowing ? "#FDE68A" : "#E2E8F0"} />
        <line x1="12" y1="9" x2="12" y2="22" stroke="#1E293B" strokeWidth="1.2" />
        {/* Lamp Base Collar */}
        <rect x="8" y="22" width="8" height="4" fill="#1E293B" rx="1" />
      </svg>

      {/* Cast Iron Pole */}
      <div className="w-1.5 flex-1 bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-t-xs" />
      {/* Ground Base */}
      <div className="w-5 h-2 bg-[#0F172A] rounded-full shadow-xs" />
    </div>
  );
}

/**
 * Lush Park Foliage Cluster
 */
export function ParkBushes({ className = "w-20 h-14" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 80 50" fill="none" className="w-full h-full">
        <circle cx="22" cy="30" r="18" fill="#557C55" opacity="0.9" />
        <circle cx="45" cy="24" r="22" fill="#7A9D54" />
        <circle cx="62" cy="32" r="16" fill="#A1C181" />
        {/* Little yellow park flower dots */}
        <circle cx="32" cy="20" r="2" fill="#FFE58F" />
        <circle cx="48" cy="18" r="2" fill="#FFE58F" />
        <circle cx="56" cy="28" r="2" fill="#FFE58F" />
      </svg>
    </div>
  );
}
