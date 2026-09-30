"use client";

import React, { useState } from "react";
import { Heart, Sparkles } from "lucide-react";

// Drawing Art Photo Placeholder with Cute Doodles
interface PhotoPlaceholderProps {
  variant: "groom" | "bride" | "couple" | "rings" | "landscape" | "gallery";
  caption?: string;
  tag?: string;
  stickerText?: string;
  className?: string;
  tapePosition?: "top-center" | "top-left" | "top-right" | "both-top" | "none";
  tiltAngle?: "left" | "right" | "straight";
}

export function PhotoPlaceholder({
  variant,
  caption,
  tag,
  stickerText,
  className = "",
  tapePosition = "top-center",
  tiltAngle = "straight",
}: PhotoPlaceholderProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / (rect.height / 2)) * 6,
      y: (x / (rect.width / 2)) * 6,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const baseAngleClass = {
    left: "-rotate-2",
    right: "rotate-2",
    straight: "rotate-0",
  }[tiltAngle];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: rotate.x === 0 ? "transform 0.5s ease-out" : "transform 0.08s ease-out",
      }}
      className={`relative inline-block ${baseAngleClass} ${className}`}
    >
      {/* Cute Washi Tape Accents */}
      {tapePosition === "top-center" && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 w-24 h-7 washi-tape-cute rotate-[-2deg] rounded-xs flex items-center justify-center">
          <span className="text-[10px] font-mono font-bold text-[#8A5A10] tracking-wider">
            ★ LOVELY ★
          </span>
        </div>
      )}
      {tapePosition === "top-left" && (
        <div className="absolute -top-3.5 -left-3 z-20 w-20 h-7 washi-tape-cute -rotate-12 rounded-xs flex items-center justify-center">
          <span className="text-[9px] font-mono font-bold text-[#8A5A10]">
            ♥ CUTE
          </span>
        </div>
      )}
      {tapePosition === "top-right" && (
        <div className="absolute -top-3.5 -right-3 z-20 w-20 h-7 washi-tape-maroon rotate-12 rounded-xs flex items-center justify-center">
          <span className="text-[9px] font-mono font-bold text-[#FFF0F3]">
            BEST DAY
          </span>
        </div>
      )}
      {tapePosition === "both-top" && (
        <>
          <div className="absolute -top-3 -left-3 z-20 w-16 h-6 washi-tape-cute -rotate-12 rounded-xs" />
          <div className="absolute -top-3 -right-3 z-20 w-16 h-6 washi-tape-maroon rotate-12 rounded-xs" />
        </>
      )}

      {/* Floating Cute Sticker Badge */}
      {stickerText && (
        <div className="absolute -bottom-3 -right-3 z-20 bg-[#FFE58F] border-2 border-[#660F1A] text-[#660F1A] px-2.5 py-1 rounded-full text-[11px] font-script font-bold doodle-sticker rotate-6">
          {stickerText}
        </div>
      )}

      {/* Hand-Drawn Polaroid Sketch Card */}
      <div className="doodle-box p-3.5 pb-5 bg-white relative overflow-hidden group">
        {/* Inner Hand-Drawn Sketch Box */}
        <div className="border-2 border-dashed border-[#8A1C2C]/50 rounded-xl p-1 bg-[#FFF9FA]">
          <div className="relative aspect-[3/4] w-full min-w-[220px] bg-gradient-to-b from-[#FFF0F3] via-[#FFE5EB] to-[#FCE0E5] rounded-lg overflow-hidden flex flex-col items-center justify-center p-4">
            
            {/* Hand-Drawn Cartoon Drawing Art Illustrations */}
            {variant === "groom" && <DoodleGroom />}
            {variant === "bride" && <DoodleBride />}
            {variant === "couple" && <DoodleCouple />}
            {variant === "rings" && <DoodleRings />}
            {variant === "landscape" && <DoodleLandscape />}
            {variant === "gallery" && <DoodleBobaCamera />}

            {/* Tag Badge */}
            {tag && (
              <span className="absolute bottom-2.5 left-2.5 text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 rounded-full bg-white/95 text-[#660F1A] border-1.5 border-[#660F1A] shadow-xs">
                {tag}
              </span>
            )}
          </div>
        </div>

        {/* Polaroid Handwritten Caption with cute heart */}
        {caption && (
          <div className="mt-3 text-center px-1">
            <p className="font-script text-lg sm:text-xl text-[#660F1A] font-bold tracking-wide leading-tight flex items-center justify-center gap-1.5">
              <span>{caption}</span>
              <Heart className="w-3.5 h-3.5 text-[#B3394B] fill-current shrink-0 inline" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 Cute Chibi Groom Drawing
function DoodleGroom() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 120 120"
        className="w-28 h-28 text-[#660F1A] drop-shadow-xs"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Messy cute boy hair */}
        <path d="M40 32 C30 20 45 10 60 12 C75 10 90 20 80 32" fill="#4A0812" stroke="#4A0812" />
        <path d="M36 28 Q44 14 55 18 Q65 12 74 16 Q85 22 84 32" fill="#4A0812" stroke="#4A0812" />

        {/* Head */}
        <circle cx="60" cy="38" r="22" fill="#FFF5F6" stroke="#660F1A" />

        {/* Wink Eye & Happy Eye */}
        {/* Right eye wink */}
        <path d="M68 36 Q73 41 78 36" strokeWidth="3.5" />
        {/* Left eye happy open */}
        <circle cx="48" cy="36" r="3.5" fill="#660F1A" />
        <circle cx="49" cy="35" r="1.2" fill="#FFFFFF" />

        {/* Big Happy Smile */}
        <path d="M52 46 Q60 54 68 46" strokeWidth="3" fill="#D63D56" />

        {/* Rosy Blush Cheeks */}
        <ellipse cx="42" cy="42" rx="4" ry="2.5" fill="#F8B4C0" stroke="none" />
        <ellipse cx="78" cy="42" rx="4" ry="2.5" fill="#F8B4C0" stroke="none" />

        {/* Tuxedo Body */}
        <path d="M42 60 L32 105 L88 105 L78 60 Z" fill="#660F1A" stroke="#4A0812" />
        <path d="M52 60 L60 80 L68 60 Z" fill="#FFF9FA" stroke="#4A0812" strokeWidth="2.5" />

        {/* Cute Bowtie */}
        <polygon points="52,62 60,65 52,68" fill="#D63D56" stroke="#660F1A" strokeWidth="2" />
        <polygon points="68,62 60,65 68,68" fill="#D63D56" stroke="#660F1A" strokeWidth="2" />
        <circle cx="60" cy="65" r="2.5" fill="#FFE58F" stroke="#660F1A" strokeWidth="1.5" />
      </svg>
      <div className="mt-1 text-center bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#D63D56]/40">
        <span className="font-script font-bold text-xs text-[#7D1128]">
          Groom Drawing (Si Ganteng Lucu)
        </span>
      </div>
    </div>
  );
}

// 🎨 Cute Chibi Bride Drawing
function DoodleBride() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 120 120"
        className="w-28 h-28 text-[#660F1A] drop-shadow-xs"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Flowing Veil */}
        <path
          d="M30 30 C20 50 18 85 24 105 C40 110 80 110 96 105 C102 85 100 50 90 30"
          fill="#FFF0F3"
          stroke="#D63D56"
          strokeDasharray="4 4"
        />

        {/* Tiara flowers */}
        <circle cx="50" cy="16" r="4" fill="#F8B4C0" stroke="#660F1A" strokeWidth="2" />
        <circle cx="60" cy="13" r="5" fill="#FFE58F" stroke="#660F1A" strokeWidth="2" />
        <circle cx="70" cy="16" r="4" fill="#F8B4C0" stroke="#660F1A" strokeWidth="2" />

        {/* Head */}
        <circle cx="60" cy="38" r="22" fill="#FFF5F6" stroke="#660F1A" />

        {/* Cute bun hair */}
        <path d="M40 30 Q60 18 80 30" stroke="#4A0812" strokeWidth="3.5" />
        <path d="M38 32 C38 45 42 48 42 48" stroke="#4A0812" strokeWidth="3" />
        <path d="M82 32 C82 45 78 48 78 48" stroke="#4A0812" strokeWidth="3" />

        {/* Joyful closed anime eyes ( ^ ▽ ^ ) */}
        <path d="M45 35 Q50 30 55 35" strokeWidth="3.5" />
        <path d="M65 35 Q70 30 75 35" strokeWidth="3.5" />

        {/* Big joyful smile */}
        <path d="M52 44 Q60 52 68 44" strokeWidth="3" fill="#D63D56" />

        {/* Super Rosy Blush Cheeks */}
        <circle cx="43" cy="42" r="4.5" fill="#F5A8B8" stroke="none" />
        <circle cx="77" cy="42" r="4.5" fill="#F5A8B8" stroke="none" />

        {/* Wedding Dress Bodice */}
        <path d="M46 60 L36 105 L84 105 L74 60 Z" fill="#FFFFFF" stroke="#660F1A" />
        <path d="M50 60 Q60 66 70 60" stroke="#D63D56" strokeWidth="2" />

        {/* Flower Bouquet in hands */}
        <circle cx="60" cy="76" r="7" fill="#D63D56" stroke="#660F1A" strokeWidth="2" />
        <circle cx="53" cy="75" r="5" fill="#F8B4C0" stroke="#660F1A" strokeWidth="2" />
        <circle cx="67" cy="75" r="5" fill="#FFE58F" stroke="#660F1A" strokeWidth="2" />
      </svg>
      <div className="mt-1 text-center bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#D63D56]/40">
        <span className="font-script font-bold text-xs text-[#7D1128]">
          Bride Drawing (Si Cantik Imut)
        </span>
      </div>
    </div>
  );
}

// 🎨 Cute Chibi Couple Hugging
function DoodleCouple() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 140 120"
        className="w-32 h-28 text-[#660F1A] drop-shadow-xs"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Floating Heart with wings */}
        <path
          d="M70 14 C70 9 64 5 59 8 C54 11 70 24 70 24 C70 24 86 11 81 8 C76 5 70 9 70 14 Z"
          fill="#D63D56"
          stroke="#660F1A"
          strokeWidth="2"
        />

        {/* Groom Chibi (Left) */}
        <circle cx="50" cy="38" r="18" fill="#FFF5F6" stroke="#660F1A" />
        <path d="M34 32 Q50 18 64 32" stroke="#4A0812" strokeWidth="3" fill="#4A0812" />
        {/* Eyes & Smile */}
        <circle cx="44" cy="38" r="2.5" fill="#660F1A" />
        <circle cx="56" cy="38" r="2.5" fill="#660F1A" />
        <path d="M46 45 Q50 49 54 45" strokeWidth="2.5" />
        <circle cx="39" cy="42" r="3" fill="#F8B4C0" stroke="none" />
        {/* Groom Suit */}
        <path d="M36 56 L30 102 L66 102 L62 56 Z" fill="#660F1A" stroke="#4A0812" />
        <polygon points="46,58 52,60 46,62" fill="#D63D56" stroke="#660F1A" strokeWidth="1.5" />
        <polygon points="58,58 52,60 58,62" fill="#D63D56" stroke="#660F1A" strokeWidth="1.5" />

        {/* Bride Chibi (Right) */}
        {/* Veil */}
        <path d="M80 26 C98 32 108 55 106 100 C92 104 78 104 74 100" fill="#FFF0F3" stroke="#D63D56" strokeDasharray="3 3" />
        <circle cx="90" cy="40" r="18" fill="#FFF5F6" stroke="#660F1A" />
        {/* Tiara */}
        <circle cx="90" cy="22" r="3" fill="#FFE58F" stroke="#660F1A" strokeWidth="1.5" />
        {/* Joyful Eyes & Smile */}
        <path d="M82 39 Q86 34 90 39" strokeWidth="2.5" />
        <path d="M94 39 Q98 34 102 39" strokeWidth="2.5" />
        <path d="M88 47 Q92 51 96 47" strokeWidth="2.5" fill="#D63D56" />
        <circle cx="102" cy="44" r="3" fill="#F8B4C0" stroke="none" />
        {/* Bride Dress */}
        <path d="M74 58 L70 102 L108 102 L100 58 Z" fill="#FFFFFF" stroke="#660F1A" />

        {/* Hands Holding Boba Cup */}
        <rect x="62" y="70" width="16" height="22" rx="3" fill="#FFE58F" stroke="#660F1A" strokeWidth="2" />
        <line x1="70" y1="65" x2="70" y2="70" stroke="#D63D56" strokeWidth="3" />
        <circle cx="67" cy="84" r="1.5" fill="#4A0812" />
        <circle cx="73" cy="85" r="1.5" fill="#4A0812" />
      </svg>
      <div className="mt-1 text-center bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#D63D56]/40">
        <span className="font-script font-bold text-xs text-[#7D1128]">
          Dua Sejoli Suka Jajan Boba 🧋
        </span>
      </div>
    </div>
  );
}

// 🎨 Cute Smiling Rings
function DoodleRings() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 text-[#D4AF37] drop-shadow-xs"
        fill="none"
        stroke="#660F1A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Left Ring (Groom) */}
        <circle cx="38" cy="52" r="22" fill="#FFE58F" stroke="#660F1A" strokeWidth="3" />
        <circle cx="38" cy="52" r="14" fill="#FFF0F3" stroke="#660F1A" strokeWidth="2" />
        {/* Cute face on ring */}
        <circle cx="34" cy="48" r="1.5" fill="#660F1A" />
        <circle cx="42" cy="48" r="1.5" fill="#660F1A" />
        <path d="M36 53 Q38 56 40 53" strokeWidth="1.5" />

        {/* Right Ring (Bride with Diamond) */}
        <circle cx="64" cy="48" r="22" fill="#FFE58F" stroke="#660F1A" strokeWidth="3" />
        <circle cx="64" cy="48" r="14" fill="#FFF0F3" stroke="#660F1A" strokeWidth="2" />
        {/* Diamond on top */}
        <polygon points="64,16 72,24 64,30 56,24" fill="#FFFDFE" stroke="#660F1A" strokeWidth="2.5" />
        <path d="M58 24 L70 24" stroke="#660F1A" strokeWidth="1.5" />
        {/* Cute face on ring */}
        <path d="M60 46 Q62 43 64 46" strokeWidth="1.5" />
        <path d="M66 46 Q68 43 70 46" strokeWidth="1.5" />
        <path d="M63 51 Q65 54 67 51" strokeWidth="1.5" fill="#D63D56" />
        <circle cx="58" cy="48" r="1.5" fill="#F8B4C0" />
        <circle cx="71" cy="48" r="1.5" fill="#F8B4C0" />
      </svg>
      <span className="font-script font-bold text-xs text-[#7D1128] mt-1 block">
        Cincin Anti Lepas-Lepas Club 💍
      </span>
    </div>
  );
}

// 🎨 Cute Smiling Sun & Hills
function DoodleLandscape() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 120 80"
        className="w-28 h-20 text-[#660F1A]"
        fill="none"
        stroke="#660F1A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Smiling Sun with cute glasses */}
        <circle cx="60" cy="28" r="16" fill="#FFE58F" stroke="#660F1A" strokeWidth="2.5" />
        {/* Sun rays */}
        <line x1="60" y1="6" x2="60" y2="10" strokeWidth="3" />
        <line x1="38" y1="28" x2="42" y2="28" strokeWidth="3" />
        <line x1="78" y1="28" x2="82" y2="28" strokeWidth="3" />
        {/* Sunglasses */}
        <rect x="52" y="24" width="7" height="6" rx="2" fill="#4A0812" />
        <rect x="61" y="24" width="7" height="6" rx="2" fill="#4A0812" />
        <line x1="59" y1="26" x2="61" y2="26" stroke="#4A0812" strokeWidth="2" />
        <path d="M57 34 Q60 37 63 34" strokeWidth="2" />

        {/* Wobbly Doodle Hills in Maroon/Pink */}
        <path d="M0 64 Q 30 42 60 58 T 120 52 L 120 80 L 0 80 Z" fill="#F8B4C0" stroke="#660F1A" strokeWidth="2.5" />
        <path d="M0 68 Q 40 54 80 64 T 120 62 L 120 80 L 0 80 Z" fill="#7D1128" stroke="#4A0812" strokeWidth="2.5" />
      </svg>
      <span className="font-script font-bold text-xs text-[#7D1128] mt-1 block">
        Petualangan Baru Menanti! 🌄
      </span>
    </div>
  );
}

// 🎨 Cute Boba & Camera Doodle
function DoodleBobaCamera() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 100 100"
        className="w-22 h-22 text-[#660F1A]"
        fill="none"
        stroke="#660F1A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Cute Camera */}
        <rect x="20" y="30" width="60" height="45" rx="10" fill="#FFF0F3" stroke="#660F1A" strokeWidth="3" />
        <rect x="35" y="22" width="20" height="8" rx="2" fill="#FFE58F" stroke="#660F1A" strokeWidth="2" />
        <circle cx="50" cy="52" r="16" fill="#F8B4C0" stroke="#660F1A" strokeWidth="2.5" />
        <circle cx="50" cy="52" r="8" fill="#660F1A" stroke="none" />
        <circle cx="53" cy="49" r="2.5" fill="#FFFFFF" stroke="none" />
        <circle cx="68" cy="38" r="3" fill="#D63D56" stroke="none" />
      </svg>
      <span className="font-script font-bold text-xs text-[#7D1128] mt-1 block">
        Cekrek! Momen Bahagia 📸
      </span>
    </div>
  );
}

// Maroon Cute Wax Seal
interface WaxSealProps {
  label?: string;
  initials?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WaxSeal({
  label = "BUKA",
  initials = "D & S",
  onClick,
  size = "md",
  className = "",
}: WaxSealProps) {
  const sizeClasses = {
    sm: "w-14 h-14 text-xs",
    md: "w-20 h-20 text-sm",
    lg: "w-24 h-24 text-base",
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Cute Ribbon in Maroon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-28 flex justify-center -z-10 pointer-events-none">
        <div className="w-3.5 h-full bg-[#4A0812] shadow-sm transform -rotate-12 rounded-xs" />
        <div className="w-3.5 h-full bg-[#7D1128] shadow-sm transform rotate-12 -ml-1 rounded-xs" />
      </div>

      {/* 3D Maroon Wax Seal */}
      <div
        className={`${sizeClasses} wax-seal-maroon rounded-full flex flex-col items-center justify-center text-[#FFF0F3] p-1.5 transition-transform duration-300 group-hover:scale-105 active:scale-95`}
      >
        <div className="w-full h-full rounded-full border-2 border-dashed border-[#FAD2D8]/60 flex flex-col items-center justify-center text-center p-1">
          <Heart className="w-3.5 h-3.5 text-[#FAD2D8] mb-0.5 fill-current animate-pulse" />
          <span className="font-script font-bold tracking-wider text-[13px] drop-shadow-sm text-white">
            {initials}
          </span>
          {label && (
            <span className="text-[8px] uppercase tracking-wider font-mono font-bold text-[#FAD2D8]">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Cute Botanical Leaf Cutout with Maroon & Blush tones
export function BotanicalLeaves({
  className = "",
}: {
  className?: string;
  variant?: "olive" | "fern" | "eucalyptus";
}) {
  return (
    <div className={`pointer-events-none select-none animate-botanical-sway ${className}`}>
      <svg
        viewBox="0 0 120 180"
        className="w-full h-full text-[#7D1128]/45 drop-shadow-xs"
        fill="currentColor"
      >
        {/* Curving Stem */}
        <path
          d="M 60 170 Q 55 100 85 20"
          stroke="#4A0812"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hand-drawn cute leaves with blush & maroon */}
        <path d="M 60 140 Q 30 135 25 115 Q 45 120 60 135 Z" fill="#9E2A3B" opacity="0.85" />
        <path d="M 62 125 Q 95 120 100 100 Q 80 105 63 120 Z" fill="#7D1128" opacity="0.95" />
        <path d="M 66 100 Q 35 95 30 75 Q 50 80 66 95 Z" fill="#F5A8B8" opacity="0.8" />
        <path d="M 70 80 Q 105 75 110 55 Q 88 60 70 75 Z" fill="#9E2A3B" opacity="0.9" />
        <path d="M 75 55 Q 45 50 42 32 Q 62 38 75 50 Z" fill="#F8B4C0" opacity="0.85" />
        <path d="M 80 35 Q 110 30 112 12 Q 92 18 80 30 Z" fill="#7D1128" opacity="0.9" />
        <circle cx="88" cy="12" r="5" fill="#FFE58F" stroke="#4A0812" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// Hand-Drawn Wobbly Torn Paper Divider
export function TornPaperDivider({
  position = "bottom",
  color = "#FFF5F6",
}: {
  position?: "top" | "bottom";
  color?: string;
}) {
  const isTop = position === "top";
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${
        isTop ? "rotate-180 -mt-1" : "-mb-1"
      }`}
    >
      <svg
        viewBox="0 0 1200 40"
        className="w-full h-8 sm:h-10"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L0,18 Q40,6 80,24 Q130,8 180,22 Q240,6 290,26 Q350,10 400,24 Q470,8 530,26 Q600,10 670,22 Q740,6 810,26 Q880,10 950,22 Q1020,8 1090,26 Q1150,12 1200,20 L1200,0 Z"
          fill={color}
          stroke="#660F1A"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

// Cute Postmark Stamp Badge
export function PaperStamp({
  text = "OFFICIALLY SAH",
  date = "12 • 12 • 2026",
}: {
  text?: string;
  date?: string;
}) {
  return (
    <div className="inline-block p-1.5 border-2 border-dashed border-[#7D1128] rounded-full text-[#660F1A] select-none rotate-[-6deg] opacity-90 doodle-sticker bg-[#FFF0F3]/80">
      <div className="w-22 h-22 rounded-full border-2 border-[#7D1128] flex flex-col items-center justify-center p-1 text-center">
        <Sparkles className="w-3 h-3 text-[#B3394B] mb-0.5" />
        <span className="text-[8px] font-mono tracking-wider uppercase font-bold text-[#660F1A]">
          {text}
        </span>
        <span className="text-[11px] font-script font-bold tracking-wider text-[#7D1128]">
          {date}
        </span>
        <span className="text-[7px] font-mono uppercase tracking-widest text-[#9E2A3B]">
          ★ LOVE IS SWEET ★
        </span>
      </div>
    </div>
  );
}
