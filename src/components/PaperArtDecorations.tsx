"use client";

import React from "react";

// Realistic Paper Art Photo Placeholder
interface PhotoPlaceholderProps {
  variant: "groom" | "bride" | "couple" | "rings" | "landscape" | "gallery";
  caption?: string;
  tag?: string;
  className?: string;
  tapePosition?: "top-center" | "top-left" | "top-right" | "both-top" | "none";
  tiltAngle?: "left" | "right" | "straight";
}

export function PhotoPlaceholder({
  variant,
  caption,
  tag,
  className = "",
  tapePosition = "top-center",
  tiltAngle = "straight",
}: PhotoPlaceholderProps) {
  const tiltClasses = {
    left: "-rotate-2 hover:rotate-0 transition-transform duration-500",
    right: "rotate-2 hover:rotate-0 transition-transform duration-500",
    straight: "hover:-translate-y-1 transition-transform duration-500",
  }[tiltAngle];

  return (
    <div className={`relative inline-block ${tiltClasses} ${className}`}>
      {/* Washi Tape Accent */}
      {tapePosition === "top-center" && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 w-24 h-7 washi-tape rotate-[-1.5deg] opacity-90" />
      )}
      {tapePosition === "top-left" && (
        <div className="absolute -top-3.5 -left-3 z-20 w-20 h-7 washi-tape -rotate-12 opacity-90" />
      )}
      {tapePosition === "top-right" && (
        <div className="absolute -top-3.5 -right-3 z-20 w-20 h-7 washi-tape rotate-12 opacity-90" />
      )}
      {tapePosition === "both-top" && (
        <>
          <div className="absolute -top-3 -left-3 z-20 w-16 h-6 washi-tape -rotate-12 opacity-85" />
          <div className="absolute -top-3 -right-3 z-20 w-16 h-6 washi-tape rotate-12 opacity-85" />
        </>
      )}

      {/* Polaroid / Paper Card Frame */}
      <div className="paper-sheet p-3.5 pb-5 rounded-md relative overflow-hidden group">
        {/* Subtle Paper Inner Border */}
        <div className="border border-[#E7DAC7]/70 rounded p-1 bg-[#FAF6EE]">
          {/* Visual Container */}
          <div className="relative aspect-[3/4] w-full min-w-[220px] bg-gradient-to-b from-[#F2E8DC] via-[#E8DCCB] to-[#DECDB8] rounded overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Paper Cut Layer Accents */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(#C2A789_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Silhouette / Paper Illustration depending on variant */}
            {variant === "groom" && <GroomSilhouette />}
            {variant === "bride" && <BrideSilhouette />}
            {variant === "couple" && <CoupleSilhouette />}
            {variant === "rings" && <RingsSilhouette />}
            {variant === "landscape" && <LandscapeSilhouette />}
            {variant === "gallery" && <FloralSilhouette />}

            {/* Subtle paper art frame badge */}
            {tag && (
              <span className="absolute bottom-2.5 left-2.5 text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 rounded bg-[#FAF6EE]/90 text-[#6B5A4B] shadow-xs border border-[#DFD1BD]">
                {tag}
              </span>
            )}
          </div>
        </div>

        {/* Polaroid Handwritten Caption */}
        {caption && (
          <div className="mt-3 text-center px-1">
            <p className="font-script text-lg sm:text-xl text-[#4A3E37] tracking-wide leading-tight">
              {caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Paper Art Groom Silhouette SVG
function GroomSilhouette() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full text-[#6D5845]">
      <svg
        viewBox="0 0 120 120"
        className="w-24 h-24 text-[#8C735C] drop-shadow-[0_2px_4px_rgba(70,50,30,0.15)]"
        fill="currentColor"
      >
        {/* Paper Art Layered Bowtie & Tuxedo Silhouette */}
        <path d="M60 12 C69 12 76 19 76 28 C76 37 69 44 60 44 C51 44 44 37 44 28 C44 19 51 12 60 12 Z" opacity="0.9" />
        <path d="M42 50 C32 54 26 64 24 80 L96 80 C94 64 88 54 78 50 L68 58 L60 52 L52 58 Z" opacity="0.85" />
        <polygon points="53,52 60,57 67,52 65,60 60,58 55,60" fill="#4B392B" />
        <circle cx="60" cy="55" r="1.5" fill="#FAF6EE" />
        <path d="M22 84 C21 95 20 110 20 118 L100 118 C100 110 99 95 98 84 Z" opacity="0.75" />
      </svg>
      <div className="mt-2 text-center">
        <span className="font-serif italic text-xs text-[#7F6B58] block">
          [Placeholder Foto Pria]
        </span>
        <span className="text-[10px] text-[#A38F7C] block font-sans">
          Groom Portrait
        </span>
      </div>
    </div>
  );
}

// Paper Art Bride Silhouette SVG
function BrideSilhouette() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full text-[#8C6453]">
      <svg
        viewBox="0 0 120 120"
        className="w-24 h-24 text-[#9C705D] drop-shadow-[0_2px_4px_rgba(70,50,30,0.15)]"
        fill="currentColor"
      >
        {/* Paper Veil & Floral Tiara Silhouette */}
        <path d="M60 14 C68 14 74 20 74 28 C74 36 68 42 60 42 C52 42 46 36 46 28 C46 20 52 14 60 14 Z" opacity="0.9" />
        {/* Veil flowing */}
        <path d="M50 14 C40 18 34 32 30 55 C26 78 24 100 22 118 L98 118 C96 100 94 78 90 55 C86 32 80 18 70 14 Z" opacity="0.45" />
        {/* Dress bodice */}
        <path d="M48 48 C42 56 38 68 36 82 L84 82 C82 68 78 56 72 48 C66 52 54 52 48 48 Z" opacity="0.85" />
        <path d="M35 84 C33 96 30 110 28 118 L92 118 C90 110 87 96 85 84 Z" opacity="0.7" />
        {/* Crown/Floral accent */}
        <circle cx="60" cy="12" r="3" fill="#D49A7F" />
        <circle cx="53" cy="14" r="2.5" fill="#D49A7F" />
        <circle cx="67" cy="14" r="2.5" fill="#D49A7F" />
      </svg>
      <div className="mt-2 text-center">
        <span className="font-serif italic text-xs text-[#8F6C5C] block">
          [Placeholder Foto Wanita]
        </span>
        <span className="text-[10px] text-[#AC8D7E] block font-sans">
          Bride Portrait
        </span>
      </div>
    </div>
  );
}

// Paper Art Couple Silhouette SVG
function CoupleSilhouette() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full text-[#7B6352]">
      <svg
        viewBox="0 0 140 120"
        className="w-28 h-24 text-[#8A715F] drop-shadow-[0_2px_4px_rgba(70,50,30,0.15)]"
        fill="currentColor"
      >
        {/* Groom */}
        <circle cx="52" cy="24" r="12" opacity="0.9" />
        <path d="M38 42 C32 46 28 56 26 74 L68 74 C66 56 62 46 56 42 Z" opacity="0.85" />
        <path d="M25 76 L22 118 L70 118 L68 76 Z" opacity="0.7" />
        
        {/* Bride */}
        <circle cx="86" cy="28" r="11" opacity="0.9" />
        {/* Veil */}
        <path d="M78 22 C68 28 66 45 64 70 L112 70 C110 45 106 28 94 22 Z" opacity="0.4" />
        {/* Dress */}
        <path d="M74 46 C70 54 66 66 65 76 L108 76 C106 66 102 54 98 46 Z" opacity="0.8" />
        <path d="M64 78 L58 118 L116 118 L108 78 Z" opacity="0.65" />
        
        {/* Heart between them */}
        <path
          d="M70 15 C70 10 65 6 60 9 C55 12 70 24 70 24 C70 24 85 12 80 9 C75 6 70 10 70 15 Z"
          fill="#C26D53"
        />
      </svg>
      <div className="mt-2 text-center">
        <span className="font-serif italic text-xs text-[#7F6B58] block">
          [Placeholder Foto Berdua]
        </span>
        <span className="text-[10px] text-[#A38F7C] block font-sans">
          Our Special Moments
        </span>
      </div>
    </div>
  );
}

// Rings Silhouette
function RingsSilhouette() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full text-[#B58547]">
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#C49557] drop-shadow-[0_2px_4px_rgba(70,50,30,0.15)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      >
        <circle cx="38" cy="52" r="22" opacity="0.85" />
        <circle cx="62" cy="46" r="22" strokeDasharray="120" strokeDashoffset="25" opacity="0.9" />
        {/* Diamond on second ring */}
        <polygon points="62,16 68,22 62,28 56,22" fill="#FAF6EE" stroke="#A97E3E" strokeWidth="2" />
      </svg>
      <span className="font-serif italic text-xs text-[#8F6C5C] mt-2 block">
        [Placeholder Momen Cincin]
      </span>
    </div>
  );
}

// Landscape Silhouette
function LandscapeSilhouette() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full text-[#7B8B77]">
      <svg viewBox="0 0 120 80" className="w-28 h-20 text-[#859881]" fill="currentColor">
        {/* Sun */}
        <circle cx="60" cy="30" r="14" fill="#E8B48B" opacity="0.8" />
        {/* Layered paper hills */}
        <path d="M0 60 Q 30 38 60 55 T 120 50 L 120 80 L 0 80 Z" opacity="0.6" fill="#889C84" />
        <path d="M0 66 Q 40 50 80 62 T 120 60 L 120 80 L 0 80 Z" opacity="0.9" fill="#5F735B" />
        {/* Birds */}
        <path d="M30 20 Q 35 15 40 20 Q 45 15 50 20" stroke="#5F735B" strokeWidth="1.5" fill="none" />
      </svg>
      <span className="font-serif italic text-xs text-[#6A7867] mt-2 block">
        [Placeholder Panorama Alam]
      </span>
    </div>
  );
}

// Floral Silhouette
function FloralSilhouette() {
  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full h-full text-[#9C7561]">
      <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#AD846F]" fill="currentColor">
        <circle cx="50" cy="50" r="10" fill="#E3B394" />
        <ellipse cx="50" cy="30" rx="7" ry="14" opacity="0.7" />
        <ellipse cx="50" cy="70" rx="7" ry="14" opacity="0.7" />
        <ellipse cx="30" cy="50" rx="14" ry="7" opacity="0.7" />
        <ellipse cx="70" cy="50" rx="14" ry="7" opacity="0.7" />
        <ellipse cx="36" cy="36" rx="12" ry="7" transform="rotate(-45 36 36)" opacity="0.6" />
        <ellipse cx="64" cy="36" rx="12" ry="7" transform="rotate(45 64 36)" opacity="0.6" />
        <ellipse cx="36" cy="64" rx="12" ry="7" transform="rotate(45 36 64)" opacity="0.6" />
        <ellipse cx="64" cy="64" rx="12" ry="7" transform="rotate(-45 64 64)" opacity="0.6" />
      </svg>
      <span className="font-serif italic text-xs text-[#8F6C5C] mt-2 block">
        [Placeholder Momen Bahagia]
      </span>
    </div>
  );
}

// Wax Seal Component (Button or decorative badge)
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

  const content = (
    <div
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Decorative Silk Ribbon Ends */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-28 flex justify-center -z-10 pointer-events-none">
        <div className="w-3 h-full bg-[#8E2818] shadow-sm transform -rotate-12 rounded-xs" />
        <div className="w-3 h-full bg-[#A83622] shadow-sm transform rotate-12 -ml-1 rounded-xs" />
      </div>

      {/* 3D Wax Seal Body */}
      <div
        className={`${sizeClasses} wax-seal rounded-full flex flex-col items-center justify-center text-[#FEE8E1] p-1.5 transition-transform duration-300 group-hover:scale-105 active:scale-95`}
      >
        {/* Inner concentric ring */}
        <div className="w-full h-full rounded-full border-2 border-dashed border-[#FCA590]/50 flex flex-col items-center justify-center text-center p-1">
          <span className="font-serif font-bold tracking-widest text-[11px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
            {initials}
          </span>
          {label && (
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold opacity-90 -mt-0.5">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return content;
}

// Paper Art Botanical Leaf Silhouette Decorator
export function BotanicalLeaves({
  className = "",
  variant = "olive",
}: {
  className?: string;
  variant?: "olive" | "fern" | "eucalyptus";
}) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 120 180"
        className="w-full h-full text-[#7B8A78]/70 drop-shadow-[0_3px_5px_rgba(50,60,45,0.08)]"
        fill="currentColor"
      >
        {/* Curving Stem */}
        <path
          d="M 60 170 Q 55 100 85 20"
          stroke="#5F6F5C"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Layered Paper Leaves */}
        <path d="M 60 140 Q 30 135 25 115 Q 45 120 60 135 Z" fill="#8B9B88" opacity="0.85" />
        <path d="M 62 125 Q 95 120 100 100 Q 80 105 63 120 Z" fill="#788875" opacity="0.9" />
        <path d="M 66 100 Q 35 95 30 75 Q 50 80 66 95 Z" fill="#8B9B88" opacity="0.85" />
        <path d="M 70 80 Q 105 75 110 55 Q 88 60 70 75 Z" fill="#6B7B68" opacity="0.95" />
        <path d="M 75 55 Q 45 50 42 32 Q 62 38 75 50 Z" fill="#8B9B88" opacity="0.9" />
        <path d="M 80 35 Q 110 30 112 12 Q 92 18 80 30 Z" fill="#788875" opacity="0.9" />
        <path d="M 85 20 Q 85 2 95 0 Q 88 12 85 20 Z" fill="#5F6F5C" />
      </svg>
    </div>
  );
}

// Paper Torn Edge Divider
export function TornPaperDivider({
  position = "bottom",
  color = "#FAF6EE",
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
        viewBox="0 0 1200 36"
        className="w-full h-7 sm:h-9 text-[#FAF6EE] drop-shadow-[0_2px_4px_rgba(60,45,30,0.06)]"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L0,18 Q35,8 70,20 Q110,6 150,18 Q195,10 240,24 Q290,8 340,22 Q395,6 450,20 Q500,12 550,24 Q600,6 650,20 Q710,10 770,22 Q820,8 870,20 Q920,12 970,24 Q1030,8 1090,20 Q1145,10 1200,18 L1200,0 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

// Vintage Postmark Stamp Badge
export function PaperStamp({
  text = "SAVE THE DATE",
  date = "12 • 12 • 2026",
}: {
  text?: string;
  date?: string;
}) {
  return (
    <div className="inline-block p-2 border-2 border-dashed border-[#B8987B]/70 rounded-full text-[#8C6D50] select-none rotate-[-6deg] opacity-80 shadow-xs">
      <div className="w-20 h-20 rounded-full border border-[#B8987B]/40 flex flex-col items-center justify-center p-1 text-center">
        <span className="text-[8px] font-mono tracking-widest uppercase font-bold">
          {text}
        </span>
        <div className="w-8 h-[1px] bg-[#B8987B]/50 my-0.5" />
        <span className="text-[10px] font-serif font-bold tracking-wider">
          {date}
        </span>
        <div className="w-8 h-[1px] bg-[#B8987B]/50 my-0.5" />
        <span className="text-[7px] font-mono uppercase tracking-widest">
          INVITATION
        </span>
      </div>
    </div>
  );
}
