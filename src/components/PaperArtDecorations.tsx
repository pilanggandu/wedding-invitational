"use client";

import React, { useState } from "react";
import { Heart, Sparkles } from "lucide-react";

// Childlike Drawing Art Photo Placeholder
interface PhotoPlaceholderProps {
  variant: "groom" | "bride" | "couple" | "rings" | "landscape" | "gallery" | "boba";
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
      {/* Cute Colorful Crayon Washi Tape */}
      {tapePosition === "top-center" && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 w-24 h-7 washi-tape-yellow rotate-[-2deg] rounded-xs flex items-center justify-center">
          <span className="text-[10px] font-mono font-bold text-[#78350F] tracking-wider">
            ★ CRAYON ART ★
          </span>
        </div>
      )}
      {tapePosition === "top-left" && (
        <div className="absolute -top-3.5 -left-3 z-20 w-20 h-7 washi-tape-pink -rotate-12 rounded-xs flex items-center justify-center">
          <span className="text-[9px] font-mono font-bold text-white">
            ♥ SWEET
          </span>
        </div>
      )}
      {tapePosition === "top-right" && (
        <div className="absolute -top-3.5 -right-3 z-20 w-20 h-7 washi-tape-blue rotate-12 rounded-xs flex items-center justify-center">
          <span className="text-[9px] font-mono font-bold text-white">
            HAPPY DAY
          </span>
        </div>
      )}
      {tapePosition === "both-top" && (
        <>
          <div className="absolute -top-3 -left-3 z-20 w-16 h-6 washi-tape-yellow -rotate-12 rounded-xs" />
          <div className="absolute -top-3 -right-3 z-20 w-16 h-6 washi-tape-green rotate-12 rounded-xs" />
        </>
      )}

      {/* Floating Childlike Sticker Badge */}
      {stickerText && (
        <div className="absolute -bottom-3 -right-3 z-20 bg-[#FDE047] border-2 border-[#222222] text-[#222222] px-2.5 py-1 rounded-full text-xs font-script font-bold doodle-sticker rotate-6 shadow-xs">
          {stickerText}
        </div>
      )}

      {/* Hand-Drawn Polaroid Sketch Card */}
      <div className="crayon-box p-3.5 pb-5 bg-white relative overflow-hidden group">
        {/* Inner Crayon Drawing Sheet */}
        <div className="border-2 border-dashed border-[#222222]/40 rounded-xl p-1 bg-[#FFFDF8]">
          <div className="relative aspect-[3/4] w-full min-w-[220px] bg-gradient-to-b from-[#FEFCE8] via-[#FFFBEB] to-[#FEF3C7] rounded-lg overflow-hidden flex flex-col items-center justify-center p-4">
            
            {/* Childlike Drawings */}
            {variant === "groom" && <KidsDrawingGroom />}
            {variant === "bride" && <KidsDrawingBride />}
            {variant === "couple" && <KidsDrawingCouple />}
            {variant === "rings" && <KidsDrawingRings />}
            {variant === "landscape" && <KidsDrawingLandscape />}
            {(variant === "gallery" || variant === "boba") && <KidsDrawingBoba />}

            {/* Tag Badge */}
            {tag && (
              <span className="absolute bottom-2.5 left-2.5 text-[10px] tracking-wider uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-white text-[#222222] border-1.5 border-[#222222] shadow-xs">
                {tag}
              </span>
            )}
          </div>
        </div>

        {/* Polaroid Handwritten Caption with childlike heart */}
        {caption && (
          <div className="mt-3 text-center px-1">
            <p className="font-script text-lg sm:text-xl text-[#222222] font-bold tracking-wide leading-tight flex items-center justify-center gap-1.5">
              <span>{caption}</span>
              <Heart className="w-3.5 h-3.5 text-[#EF4444] fill-current shrink-0 inline" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🖍️ Childlike Groom Drawing (Crayon Sketch Style)
export function KidsDrawingGroom() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 120 120"
        className="w-28 h-28 text-[#222222] drop-shadow-xs"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Childlike scribbled hair */}
        <path d="M42 30 Q35 15 50 18 Q60 12 70 16 Q85 15 78 30" fill="#3B82F6" stroke="#222222" strokeWidth="3" />
        <path d="M48 24 L52 14 L60 22 L68 14 L72 24" stroke="#222222" strokeWidth="2.5" />

        {/* Round Head */}
        <circle cx="60" cy="38" r="21" fill="#FFFFFF" stroke="#222222" strokeWidth="3.5" />

        {/* Crayon Dot Eyes */}
        <circle cx="50" cy="36" r="3" fill="#222222" />
        <circle cx="70" cy="36" r="3" fill="#222222" />

        {/* Big Happy Curved Crayon Smile */}
        <path d="M51 46 Q60 56 69 46" strokeWidth="3.5" stroke="#222222" fill="#EF4444" />

        {/* Pink Crayon Scribble Cheeks */}
        <ellipse cx="43" cy="43" rx="4" ry="2.5" fill="#F472B6" stroke="none" />
        <ellipse cx="77" cy="43" rx="4" ry="2.5" fill="#F472B6" stroke="none" />

        {/* Blue Crayon Suit / Shirt Body */}
        <path d="M44 60 L32 105 L88 105 L76 60 Z" fill="#3B82F6" stroke="#222222" strokeWidth="3.5" />
        <path d="M52 60 L60 76 L68 60 Z" fill="#FFFFFF" stroke="#222222" strokeWidth="2.5" />

        {/* Red Bowtie */}
        <polygon points="52,62 60,65 52,68" fill="#EF4444" stroke="#222222" strokeWidth="2" />
        <polygon points="68,62 60,65 68,68" fill="#EF4444" stroke="#222222" strokeWidth="2" />
        <circle cx="60" cy="65" r="2.5" fill="#FBBF24" stroke="#222222" strokeWidth="1.5" />

        {/* Yellow Crayon Flower in pocket */}
        <circle cx="72" cy="74" r="3.5" fill="#FBBF24" stroke="#222222" strokeWidth="1.5" />
      </svg>
      <div className="mt-1 text-center bg-white px-2.5 py-0.5 rounded-full border-1.5 border-[#222222] shadow-xs">
        <span className="font-script font-bold text-xs text-[#2563EB]">
          Mas Dimas (Si Pengantin Ganteng)
        </span>
      </div>
    </div>
  );
}

// 🖍️ Childlike Bride Drawing (Crayon Sketch Style)
export function KidsDrawingBride() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 120 120"
        className="w-28 h-28 text-[#222222] drop-shadow-xs"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Childlike Crayon Veil */}
        <path
          d="M32 30 C20 50 16 85 22 105 C40 112 80 112 98 105 C104 85 100 50 88 30"
          fill="#FFF1F5"
          stroke="#F472B6"
          strokeWidth="3"
          strokeDasharray="4 4"
        />

        {/* Yellow Crayon Princess Crown */}
        <polygon points="46,24 53,10 60,20 67,10 74,24" fill="#FBBF24" stroke="#222222" strokeWidth="2.5" />

        {/* Round Head */}
        <circle cx="60" cy="38" r="21" fill="#FFFFFF" stroke="#222222" strokeWidth="3.5" />

        {/* Crayon Hair with pigtails */}
        <path d="M40 30 Q60 18 80 30" stroke="#222222" strokeWidth="3.5" fill="#F472B6" />
        <path d="M38 36 C32 46 36 54 34 60" stroke="#222222" strokeWidth="3" />
        <path d="M82 36 C88 46 84 54 86 60" stroke="#222222" strokeWidth="3" />

        {/* Joyful closed eyes */}
        <path d="M47 36 Q52 30 57 36" strokeWidth="3.5" stroke="#222222" />
        <path d="M63 36 Q68 30 73 36" strokeWidth="3.5" stroke="#222222" />

        {/* Big joyful smile */}
        <path d="M52 44 Q60 54 68 44" strokeWidth="3.5" stroke="#222222" fill="#EF4444" />

        {/* Rosy Blush Cheeks */}
        <circle cx="43" cy="42" r="4.5" fill="#F472B6" stroke="none" />
        <circle cx="77" cy="42" r="4.5" fill="#F472B6" stroke="none" />

        {/* White & Pink Crayon Wedding Dress */}
        <path d="M46 60 L34 105 L86 105 L74 60 Z" fill="#FFFFFF" stroke="#222222" strokeWidth="3.5" />
        <path d="M40 85 Q60 92 80 85" stroke="#F472B6" strokeWidth="2.5" />

        {/* Colorful Flower Bouquet */}
        <circle cx="60" cy="74" r="6" fill="#EF4444" stroke="#222222" strokeWidth="2" />
        <circle cx="53" cy="74" r="5" fill="#FBBF24" stroke="#222222" strokeWidth="2" />
        <circle cx="67" cy="74" r="5" fill="#3B82F6" stroke="#222222" strokeWidth="2" />
      </svg>
      <div className="mt-1 text-center bg-white px-2.5 py-0.5 rounded-full border-1.5 border-[#222222] shadow-xs">
        <span className="font-script font-bold text-xs text-[#DB2777]">
          Mbak Sarah (Si Putri Ceria)
        </span>
      </div>
    </div>
  );
}

// 🖍️ Childlike Couple Drawing Holding Hands with Rainbow
export function KidsDrawingCouple({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center relative z-10 w-full h-full ${className}`}>
      <svg
        viewBox="0 0 140 120"
        className="w-full h-full text-[#222222] drop-shadow-xs"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Cute Crayon Rainbow Arc */}
        <path d="M30 30 Q70 2 110 30" stroke="#EF4444" strokeWidth="3" />
        <path d="M34 33 Q70 8 106 33" stroke="#F59E0B" strokeWidth="3" />
        <path d="M38 36 Q70 14 102 36" stroke="#10B981" strokeWidth="3" />
        <path d="M42 39 Q70 20 98 39" stroke="#3B82F6" strokeWidth="3" />

        {/* Floating Heart */}
        <path
          d="M70 26 C70 22 66 18 61 21 C56 24 70 34 70 34 C70 34 84 24 79 21 C74 18 70 22 70 26 Z"
          fill="#EF4444"
          stroke="#222222"
          strokeWidth="2"
        />

        {/* Groom Figure (Left) */}
        <circle cx="50" cy="46" r="15" fill="#FFFFFF" stroke="#222222" strokeWidth="3" />
        <circle cx="45" cy="45" r="2" fill="#222222" />
        <circle cx="55" cy="45" r="2" fill="#222222" />
        <path d="M47 52 Q50 56 53 52" strokeWidth="2.5" />
        <path d="M38 62 L32 102 L64 102 L58 62 Z" fill="#3B82F6" stroke="#222222" strokeWidth="3" />
        <polygon points="46,64 50,66 46,68" fill="#EF4444" stroke="#222222" strokeWidth="1.5" />
        <polygon points="54,64 50,66 54,68" fill="#EF4444" stroke="#222222" strokeWidth="1.5" />

        {/* Bride Figure (Right) */}
        <circle cx="90" cy="48" r="15" fill="#FFFFFF" stroke="#222222" strokeWidth="3" />
        <polygon points="84,36 88,26 92,34 96,26 100,36" fill="#FBBF24" stroke="#222222" strokeWidth="1.5" />
        <path d="M84 46 Q87 42 90 46" strokeWidth="2.5" />
        <path d="M94 46 Q97 42 100 46" strokeWidth="2.5" />
        <path d="M88 54 Q92 58 96 54" strokeWidth="2.5" fill="#EF4444" />
        <path d="M78 64 L72 102 L106 102 L98 64 Z" fill="#FFFFFF" stroke="#222222" strokeWidth="3" />

        {/* Holding hands with big love */}
        <path d="M58 78 Q70 86 78 78" stroke="#222222" strokeWidth="3.5" />
      </svg>
      <div className="mt-1 text-center bg-white px-2.5 py-0.5 rounded-full border-1.5 border-[#222222] shadow-xs">
        <span className="font-script font-bold text-xs text-[#DC2626]">
          Bergandengan Tangan Selamanya 🌈
        </span>
      </div>
    </div>
  );
}

// 🖍️ Childlike Interlocking Rings
export function KidsDrawingRings() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 drop-shadow-xs"
        fill="none"
        stroke="#222222"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Left Ring */}
        <circle cx="38" cy="52" r="22" fill="#FDE047" stroke="#222222" strokeWidth="3.5" />
        <circle cx="38" cy="52" r="13" fill="#FFFDF8" stroke="#222222" strokeWidth="2.5" />
        <circle cx="34" cy="48" r="2" fill="#222222" />
        <circle cx="42" cy="48" r="2" fill="#222222" />
        <path d="M35 53 Q38 57 41 53" strokeWidth="2" />

        {/* Right Ring with Diamond */}
        <circle cx="64" cy="48" r="22" fill="#FBBF24" stroke="#222222" strokeWidth="3.5" />
        <circle cx="64" cy="48" r="13" fill="#FFFDF8" stroke="#222222" strokeWidth="2.5" />
        <polygon points="64,14 74,24 64,32 54,24" fill="#60A5FA" stroke="#222222" strokeWidth="3" />
        <circle cx="60" cy="46" r="2" fill="#222222" />
        <circle cx="68" cy="46" r="2" fill="#222222" />
        <path d="M62 51 Q64 55 66 51" strokeWidth="2" />
      </svg>
      <span className="font-script font-bold text-xs text-[#D97706] mt-1 block">
        Cincin Janji Suci Berkilau ⭐
      </span>
    </div>
  );
}

// 🖍️ Childlike Sun & Rainbow Hills
export function KidsDrawingLandscape() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full">
      <svg
        viewBox="0 0 120 80"
        className="w-28 h-20"
        fill="none"
        stroke="#222222"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Big Yellow Smiling Sun */}
        <circle cx="60" cy="26" r="16" fill="#FDE047" stroke="#222222" strokeWidth="3" />
        <line x1="60" y1="4" x2="60" y2="8" strokeWidth="3.5" stroke="#F59E0B" />
        <line x1="38" y1="26" x2="42" y2="26" strokeWidth="3.5" stroke="#F59E0B" />
        <line x1="78" y1="26" x2="82" y2="26" strokeWidth="3.5" stroke="#F59E0B" />
        <line x1="44" y1="12" x2="48" y2="15" strokeWidth="3.5" stroke="#F59E0B" />
        <line x1="76" y1="12" x2="72" y2="15" strokeWidth="3.5" stroke="#F59E0B" />
        {/* Sun Eyes & Smile */}
        <circle cx="55" cy="24" r="2" fill="#222222" />
        <circle cx="65" cy="24" r="2" fill="#222222" />
        <path d="M56 29 Q60 34 64 29" strokeWidth="2.5" fill="#EF4444" />

        {/* Wobbly Green & Blue Hills */}
        <path d="M0 64 Q 30 42 60 58 T 120 52 L 120 80 L 0 80 Z" fill="#60A5FA" stroke="#222222" strokeWidth="3" />
        <path d="M0 68 Q 40 54 80 64 T 120 62 L 120 80 L 0 80 Z" fill="#4ADE80" stroke="#222222" strokeWidth="3" />
      </svg>
      <span className="font-script font-bold text-xs text-[#16A34A] mt-1 block">
        Hari Paling Cerah & Bahagia ☀️
      </span>
    </div>
  );
}

// 🖍️ Childlike Boba / Camera Sketch
export function KidsDrawingBoba({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center relative z-10 w-full h-full ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-22 h-22"
        fill="none"
        stroke="#222222"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Childlike Colorful Camera */}
        <rect x="20" y="30" width="60" height="46" rx="10" fill="#F472B6" stroke="#222222" strokeWidth="3.5" />
        <rect x="35" y="22" width="20" height="8" rx="3" fill="#FDE047" stroke="#222222" strokeWidth="2.5" />
        <circle cx="50" cy="53" r="16" fill="#FFFFFF" stroke="#222222" strokeWidth="3" />
        <circle cx="50" cy="53" r="8" fill="#3B82F6" stroke="none" />
        <circle cx="53" cy="50" r="2.5" fill="#FFFFFF" stroke="none" />
        <circle cx="68" cy="38" r="3.5" fill="#EF4444" stroke="none" />
      </svg>
      <span className="font-script font-bold text-xs text-[#DB2777] mt-1 block">
        Cekrek! Senyum Paling Lebar 📸
      </span>
    </div>
  );
}

// 🖍️ Childlike Sun Floating Doodle
export function KidsDrawingSun({ className = "" }: { className?: string }) {
  return (
    <div className={`select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-xs" fill="none">
        <circle cx="40" cy="40" r="18" fill="#FDE047" stroke="#222222" strokeWidth="3" />
        <line x1="40" y1="14" x2="40" y2="4" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="40" y1="66" x2="40" y2="76" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="14" y1="40" x2="4" y2="40" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="66" y1="40" x2="76" y2="40" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="22" y1="22" x2="14" y2="14" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="58" y1="22" x2="66" y2="14" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="22" y1="58" x2="14" y2="66" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="58" y1="58" x2="66" y2="66" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="34" cy="37" r="2" fill="#222222" />
        <circle cx="46" cy="37" r="2" fill="#222222" />
        <path d="M35 43 Q40 48 45 43" stroke="#222222" strokeWidth="2.5" fill="#EF4444" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// 🖍️ Childlike Heart Floating Doodle
export function KidsDrawingHeart({ className = "" }: { className?: string }) {
  return (
    <div className={`select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-xs" fill="none">
        <path
          d="M20 34 C19 33 6 23 6 13 C6 7.5 10.5 4 15.5 4 C17.8 4 20 6.2 20 6.2 C20 6.2 22.2 4 24.5 4 C29.5 4 34 7.5 34 13 C34 23 21 33 20 34 Z"
          fill="#EF4444"
          stroke="#222222"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="11" r="2" fill="#FFF" />
      </svg>
    </div>
  );
}

// 🖍️ Childlike Star Floating Doodle
export function KidsDrawingStar({ className = "", text = "" }: { className?: string; text?: string }) {
  return (
    <div className={`select-none pointer-events-none relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-xs" fill="none">
        <polygon
          points="25,4 31,18 46,20 35,31 38,46 25,38 12,46 15,31 4,20 19,18"
          fill="#FDE047"
          stroke="#222222"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="21" cy="24" r="1.5" fill="#222222" />
        <circle cx="29" cy="24" r="1.5" fill="#222222" />
        <path d="M22 28 Q25 31 28 28" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {text && (
        <span className="absolute text-[8px] font-mono font-bold text-[#222222]">
          {text}
        </span>
      )}
    </div>
  );
}

// 🖍️ Childlike Crayon Washi Tape
export function CrayonWashiTape({
  text,
  color = "yellow",
  className = "",
}: {
  text?: string;
  color?: "yellow" | "pink" | "blue" | "green";
  className?: string;
}) {
  const colorMap = {
    yellow: "washi-tape-yellow text-[#78350F]",
    pink: "washi-tape-pink text-white",
    blue: "washi-tape-blue text-white",
    green: "washi-tape-green text-white",
  }[color];

  return (
    <div
      className={`px-3 py-1 rounded-xs flex items-center justify-center select-none shadow-xs ${colorMap} ${className}`}
    >
      {text && (
        <span className="text-[9px] font-mono font-bold tracking-wider whitespace-nowrap">
          {text}
        </span>
      )}
    </div>
  );
}

// Colorful Crayon Wax Seal
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
      {/* Playful Colorful Ribbon Ends */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-28 flex justify-center -z-10 pointer-events-none">
        <div className="w-3.5 h-full bg-[#EF4444] border border-[#222222] shadow-xs transform -rotate-12 rounded-xs" />
        <div className="w-3.5 h-full bg-[#FBBF24] border border-[#222222] shadow-xs transform rotate-12 -ml-1 rounded-xs" />
      </div>

      {/* 3D Wax Seal with Crayon Charm */}
      <div
        className={`${sizeClasses} wax-seal-colorful rounded-full flex flex-col items-center justify-center text-white p-1.5 transition-transform duration-300 group-hover:scale-105 active:scale-95`}
      >
        <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center text-center p-1">
          <Heart className="w-3.5 h-3.5 text-white mb-0.5 fill-current animate-pulse" />
          <span className="font-script font-bold tracking-wider text-[14px] drop-shadow-sm text-white">
            {initials}
          </span>
          {label && (
            <span className="text-[8px] uppercase tracking-wider font-mono font-bold text-[#FEF08A]">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Childlike Botanical Drawing (Playful leaves & crayon flowers)
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
        className="w-full h-full drop-shadow-xs"
        fill="none"
        stroke="#222222"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Curving Stem */}
        <path d="M 60 170 Q 55 100 85 20" stroke="#16A34A" strokeWidth="4" />
        {/* Childlike Crayon Leaves */}
        <path d="M 60 140 Q 30 135 25 115 Q 45 120 60 135 Z" fill="#4ADE80" />
        <path d="M 62 125 Q 95 120 100 100 Q 80 105 63 120 Z" fill="#22C55E" />
        <path d="M 66 100 Q 35 95 30 75 Q 50 80 66 95 Z" fill="#F472B6" />
        <path d="M 70 80 Q 105 75 110 55 Q 88 60 70 75 Z" fill="#FBBF24" />
        <path d="M 75 55 Q 45 50 42 32 Q 62 38 75 50 Z" fill="#60A5FA" />
        {/* Flower at top */}
        <circle cx="85" cy="20" r="8" fill="#EF4444" stroke="#222222" strokeWidth="2.5" />
        <circle cx="85" cy="20" r="3.5" fill="#FDE047" stroke="none" />
      </svg>
    </div>
  );
}

// Childlike Wobbly Crayon Border Divider
export function TornPaperDivider({
  position = "bottom",
  color = "#FFFDF8",
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
          stroke="#222222"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
}

// Childlike Postmark Stamp Badge
export function PaperStamp({
  text = "RESMI SAH",
  date = "12 • 12 • 2026",
}: {
  text?: string;
  date?: string;
}) {
  return (
    <div className="inline-block p-1.5 border-3 border-dashed border-[#EF4444] rounded-full text-[#222222] select-none rotate-[-6deg] doodle-sticker bg-[#FEF08A]/90">
      <div className="w-22 h-22 rounded-full border-2 border-[#222222] flex flex-col items-center justify-center p-1 text-center bg-white">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] mb-0.5" />
        <span className="text-[8px] font-mono tracking-wider uppercase font-bold text-[#222222]">
          {text}
        </span>
        <span className="text-[12px] font-script font-bold tracking-wider text-[#EF4444]">
          {date}
        </span>
        <span className="text-[7px] font-mono uppercase tracking-widest text-[#2563EB]">
          ★ LOVE & JOY ★
        </span>
      </div>
    </div>
  );
}
