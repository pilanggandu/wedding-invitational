"use client";

import React from "react";
import { motion } from "framer-motion";

export function WashiTape({
  className = "",
  color = "peach",
  angle = -3,
}: {
  className?: string;
  color?: "peach" | "mint" | "butter" | "rose" | "lavender";
  angle?: number;
}) {
  const colorStyles = {
    peach: "bg-[#FDBA74]/80 border-t border-b border-[#FB923C]/40 text-[#C2633C]",
    mint: "bg-[#A7F3D0]/80 border-t border-b border-[#34D399]/40 text-[#047857]",
    butter: "bg-[#FEF08A]/85 border-t border-b border-[#FACC15]/40 text-[#A16207]",
    rose: "bg-[#FECDD3]/80 border-t border-b border-[#FB7185]/40 text-[#BE123C]",
    lavender: "bg-[#DDD6FE]/80 border-t border-b border-[#A78BFA]/40 text-[#6D28D9]",
  }[color];

  return (
    <div
      style={{ transform: `rotate(${angle}deg)` }}
      className={`h-5 px-3 flex items-center justify-center text-[9px] font-sans font-bold tracking-widest uppercase shadow-2xs pointer-events-none select-none relative backdrop-blur-xs ${colorStyles} ${className}`}
    >
      <span className="absolute -left-1.5 top-0 bottom-0 w-2 bg-inherit [clip-path:polygon(100%_0,0_25%,100%_50%,0_75%,100%_100%)]" />
      <span className="absolute -right-1.5 top-0 bottom-0 w-2 bg-inherit [clip-path:polygon(0_0,100%_25%,0_50%,100%_75%,0_100%)]" />
      <span className="opacity-70">&bull; &bull; &bull;</span>
    </div>
  );
}

export function DoodleHeartSticker({
  className = "w-8 h-8",
  color = "#F68A96",
  rotate = 6,
}: {
  className?: string;
  color?: string;
  rotate?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block filter drop-shadow-[0_4px_10px_rgba(246,138,150,0.35)] transition-transform hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M50 86C50 86 16 64 16 38C16 23 28 13 41 13C47 13 50 17 50 17C50 17 53 13 59 13C72 13 84 23 84 38C84 64 50 86 50 86Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinejoin="round"
        />
        <path
          d="M50 84C50 84 18 62 18 38C18 25 28 15 41 15C47 15 50 19 50 19C50 19 53 15 59 15C72 15 82 25 82 38C82 62 50 84 50 84Z"
          fill={color}
          stroke="#3D271D"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M28 28C24 33 24 40 25 45"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="35" cy="22" r="2.5" fill="#FFFFFF" opacity="0.85" />
      </svg>
    </div>
  );
}

export function DoodlePawSticker({
  className = "w-8 h-8",
  color = "#FFAAA6",
  rotate = -8,
}: {
  className?: string;
  color?: string;
  rotate?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block filter drop-shadow-[0_4px_10px_rgba(244,146,157,0.3)] transition-transform hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <g stroke="#FFFFFF" strokeWidth="10" strokeLinejoin="round" fill="#FFFFFF">
          <ellipse cx="50" cy="64" rx="23" ry="18" />
          <ellipse cx="28" cy="36" rx="8.5" ry="12" transform="rotate(-15 28 36)" />
          <ellipse cx="50" cy="28" rx="8.5" ry="12" />
          <ellipse cx="72" cy="36" rx="8.5" ry="12" transform="rotate(15 72 36)" />
        </g>
        <ellipse cx="50" cy="64" rx="22" ry="17" fill={color} stroke="#3D271D" strokeWidth="3.5" />
        <ellipse cx="28" cy="36" rx="8" ry="11" transform="rotate(-15 28 36)" fill={color} stroke="#3D271D" strokeWidth="3" />
        <ellipse cx="50" cy="28" rx="8" ry="11" fill={color} stroke="#3D271D" strokeWidth="3" />
        <ellipse cx="72" cy="36" rx="8" ry="11" transform="rotate(15 72 36)" fill={color} stroke="#3D271D" strokeWidth="3" />
        <ellipse cx="44" cy="60" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.85" />
        <circle cx="27" cy="33" r="2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="50" cy="25" r="2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="73" cy="33" r="2" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </div>
  );
}

export function DoodleFlowerSticker({
  className = "w-8 h-8",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block filter drop-shadow-[0_4px_10px_rgba(231,136,98,0.25)] transition-transform hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <g stroke="#FFFFFF" strokeWidth="10" strokeLinejoin="round" fill="#FFFFFF">
          <circle cx="50" cy="38" r="28" />
          <path d="M30 68L70 68L64 92L36 92Z" />
        </g>
        <path d="M30 68L70 68L64 92L36 92Z" fill="#C98A72" stroke="#3D271D" strokeWidth="3" strokeLinejoin="round" />
        <rect x="28" y="64" width="44" height="6" rx="2" fill="#DF9C84" stroke="#3D271D" strokeWidth="2.5" />
        <ellipse cx="32" cy="54" rx="10" ry="6" transform="rotate(-30 32 54)" fill="#8FA876" stroke="#3D271D" strokeWidth="2.5" />
        <ellipse cx="68" cy="54" rx="10" ry="6" transform="rotate(30 68 54)" fill="#8FA876" stroke="#3D271D" strokeWidth="2.5" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="50"
            cy="36"
            rx="8"
            ry="13"
            transform={`rotate(${deg} 50 36) translate(0 -10)`}
            fill="#F4929D"
            stroke="#3D271D"
            strokeWidth="2.5"
          />
        ))}
        <circle cx="50" cy="36" r="8" fill="#FBBF24" stroke="#3D271D" strokeWidth="2.5" />
        <circle cx="48" cy="34" r="2" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </div>
  );
}

export function DoodleFishboneSticker({
  className = "w-8 h-8",
  color = "#E78862",
  rotate = 12,
}: {
  className?: string;
  color?: string;
  rotate?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-transform hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M10 30L85 30M30 15L30 45M45 12L45 48M60 15L60 45M75 18L75 42M85 30L95 18M85 30L95 42M10 30C10 30 5 22 2 30C5 38 10 30 10 30Z"
          stroke="#FFFFFF"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="12" y1="30" x2="84" y2="30" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <line x1="30" y1="16" x2="30" y2="44" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="46" y1="13" x2="46" y2="47" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="62" y1="16" x2="62" y2="44" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="76" y1="20" x2="76" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M84 30L94 18M84 30L94 42" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <path d="M12 30C12 30 7 20 2 30C7 40 12 30 12 30Z" fill={color} />
        <circle cx="6" cy="27" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function DoodleSparkleSticker({
  className = "w-6 h-6",
  color = "#FBBF24",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`inline-block filter drop-shadow-[0_2px_6px_rgba(251,191,36,0.35)] ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M50 8C50 32 68 50 92 50C68 50 50 68 50 92C50 68 32 50 8 50C32 50 50 32 50 8Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path
          d="M50 10C50 33 67 50 90 50C67 50 50 67 50 90C50 67 33 50 10 50C33 50 50 33 50 10Z"
          fill={color}
        />
        <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function DoodleCatCoupleSticker({
  className = "w-64 h-64",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <motion.div
      style={{ transform: `rotate(${rotate}deg)` }}
      whileHover={{ scale: 1.04, rotate: rotate + 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative select-none filter drop-shadow-[0_16px_32px_rgba(222,125,84,0.22)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer inline-flex items-center justify-center ${className}`}
    >
      <img
        src="/images/cats/cats-couple.png"
        alt="Wedding Cat Couple"
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />
    </motion.div>
  );
}

export function DoodleWhiteCatGroomSticker({
  className = "w-48 h-56",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <motion.div
      style={{ transform: `rotate(${rotate}deg)` }}
      whileHover={{ scale: 1.05, rotate: rotate + 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative select-none filter drop-shadow-[0_14px_28px_rgba(222,125,84,0.2)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)] cursor-pointer inline-flex items-center justify-center ${className}`}
    >
      <img
        src="/images/cats/white-cat-groom.png"
        alt="Groom Cat"
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />
    </motion.div>
  );
}

export function DoodleOrangeCatBrideSticker({
  className = "w-48 h-56",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <motion.div
      style={{ transform: `rotate(${rotate}deg)` }}
      whileHover={{ scale: 1.05, rotate: rotate - 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative select-none filter drop-shadow-[0_14px_28px_rgba(244,146,157,0.25)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)] cursor-pointer inline-flex items-center justify-center ${className}`}
    >
      <img
        src="/images/cats/orange-cat-bride.png"
        alt="Bride Cat"
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />
    </motion.div>
  );
}

export const DoodleOrangeCatGroomSticker = DoodleWhiteCatGroomSticker;
export const DoodleWhiteCatBrideSticker = DoodleOrangeCatBrideSticker;


export function DieCutArtSticker({
  src,
  alt = "Cat Sticker",
  className = "w-48 h-56",
  rotate = 2,
  badgeText,
}: {
  src: string;
  alt?: string;
  className?: string;
  rotate?: number;
  badgeText?: string;
}) {
  return (
    <motion.div
      style={{ transform: `rotate(${rotate}deg)` }}
      whileHover={{ scale: 1.05, rotate: rotate + 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative select-none filter drop-shadow-[0_16px_32px_rgba(222,125,84,0.18)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] cursor-pointer p-2.5 bg-white rounded-[32px] border-[5px] border-white ring-1 ring-[#F2E4D8] ${className}`}
    >
      <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-[#FFF9F5]">
        <img src={src} alt={alt} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none" />
      </div>

      {badgeText && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-sans font-bold tracking-wider uppercase bg-gradient-to-r from-[#E78862] to-[#DF7B54] text-white border-2 border-white shadow-sm">
            {badgeText}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function BrushStrokeDivider({
  className = "my-6",
  color = "#FFAAA6",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-2 max-w-xs mx-auto ${className}`}>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#E78862]/30 to-transparent" />
      <div className="flex items-center gap-1.5 opacity-90">
        <DoodleHeartSticker className="w-3.5 h-3.5" rotate={-10} />
        <DoodlePawSticker className="w-5 h-5" color={color} rotate={0} />
        <DoodleHeartSticker className="w-3.5 h-3.5" rotate={10} />
      </div>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#E78862]/30 to-transparent" />
    </div>
  );
}

export function PainterPaletteIcon({
  className = "w-6 h-6",
  color = "#E78862",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z" />
    </svg>
  );
}

export function CatPawPrint({
  className = "w-6 h-6",
  color = "#FFAAA6",
}: {
  className?: string;
  color?: string;
}) {
  return <DoodlePawSticker className={className} color={color} rotate={0} />;
}
