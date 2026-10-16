"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Washi Tape strip holding stickers to the scrapbook page
 */
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
    peach: "bg-[#FDBA74]/80 border-t border-b border-[#FB923C]/40 text-[#C2410C]",
    mint: "bg-[#A7F3D0]/80 border-t border-b border-[#34D399]/40 text-[#047857]",
    butter: "bg-[#FEF08A]/85 border-t border-b border-[#FACC15]/40 text-[#A16207]",
    rose: "bg-[#FECDD3]/80 border-t border-b border-[#FB7185]/40 text-[#BE123C]",
    lavender: "bg-[#DDD6FE]/80 border-t border-b border-[#A78BFA]/40 text-[#6D28D9]",
  }[color];

  return (
    <div
      style={{ transform: `rotate(${angle}deg)` }}
      className={`h-5 px-3 flex items-center justify-center text-[9px] font-mono font-bold tracking-widest uppercase shadow-xs pointer-events-none select-none relative backdrop-blur-xs ${colorStyles} ${className}`}
    >
      {/* Jagged left edge */}
      <span className="absolute -left-1.5 top-0 bottom-0 w-2 bg-inherit [clip-path:polygon(100%_0,0_25%,100%_50%,0_75%,100%_100%)]" />
      {/* Jagged right edge */}
      <span className="absolute -right-1.5 top-0 bottom-0 w-2 bg-inherit [clip-path:polygon(0_0,100%_25%,0_50%,100%_75%,0_100%)]" />
      <span className="opacity-70">&bull; &bull; &bull;</span>
    </div>
  );
}

/**
 * Hand-drawn Doodle Heart Sticker with die-cut white border
 */
export function DoodleHeartSticker({
  className = "w-8 h-8",
  color = "#FB7185",
  rotate = 6,
}: {
  className?: string;
  color?: string;
  rotate?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block filter drop-shadow-[0_4px_8px_rgba(251,113,133,0.35)] transition-transform hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Die-cut white border */}
        <path
          d="M50 86C50 86 16 64 16 38C16 23 28 13 41 13C47 13 50 17 50 17C50 17 53 13 59 13C72 13 84 23 84 38C84 64 50 86 50 86Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinejoin="round"
        />
        {/* Heart body */}
        <path
          d="M50 84C50 84 18 62 18 38C18 25 28 15 41 15C47 15 50 19 50 19C50 19 53 15 59 15C72 15 82 25 82 38C82 62 50 84 50 84Z"
          fill={color}
        />
        {/* Cute shine highlight */}
        <path
          d="M28 28C24 33 24 40 25 45"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="35" cy="22" r="2.5" fill="#FFFFFF" opacity="0.85" />
      </svg>
    </div>
  );
}

/**
 * Hand-drawn Doodle Paw Print Sticker with die-cut white border
 */
export function DoodlePawSticker({
  className = "w-8 h-8",
  color = "#F97316",
  rotate = -8,
}: {
  className?: string;
  color?: string;
  rotate?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block filter drop-shadow-[0_4px_8px_rgba(249,115,22,0.3)] transition-transform hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Die-cut thick white outline */}
        <g stroke="#FFFFFF" strokeWidth="9" strokeLinejoin="round" fill="#FFFFFF">
          <ellipse cx="50" cy="64" rx="23" ry="18" />
          <ellipse cx="25" cy="40" rx="9" ry="13" transform="rotate(-15 25 40)" />
          <ellipse cx="42" cy="30" rx="8.5" ry="13" />
          <ellipse cx="58" cy="30" rx="8.5" ry="13" />
          <ellipse cx="75" cy="40" rx="9" ry="13" transform="rotate(15 75 40)" />
        </g>
        {/* Main pad */}
        <ellipse cx="50" cy="64" rx="22" ry="17" fill={color} />
        {/* 4 Toe pads */}
        <ellipse cx="25" cy="40" rx="8.5" ry="12" transform="rotate(-15 25 40)" fill={color} />
        <ellipse cx="42" cy="30" rx="8" ry="12" fill={color} />
        <ellipse cx="58" cy="30" rx="8" ry="12" fill={color} />
        <ellipse cx="75" cy="40" rx="8.5" ry="12" transform="rotate(15 75 40)" fill={color} />
        {/* Cute shine highlight */}
        <circle cx="44" cy="59" r="3" fill="#FFFFFF" opacity="0.75" />
        <circle cx="58" cy="62" r="2" fill="#FFFFFF" opacity="0.6" />
      </svg>
    </div>
  );
}

/**
 * Cute Doodle Fishbone Sticker
 */
export function DoodleFishboneSticker({
  className = "w-8 h-8",
  color = "#F97316",
  rotate = 12,
}: {
  className?: string;
  color?: string;
  rotate?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] transition-transform hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Die-cut white backing */}
        <path
          d="M10 30L85 30M30 15L30 45M45 12L45 48M60 15L60 45M75 18L75 42M85 30L95 18M85 30L95 42M10 30C10 30 5 22 2 30C5 38 10 30 10 30Z"
          stroke="#FFFFFF"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Main spine */}
        <line x1="12" y1="30" x2="84" y2="30" stroke={color} strokeWidth="5" strokeLinecap="round" />
        {/* Ribs */}
        <line x1="30" y1="16" x2="30" y2="44" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="46" y1="13" x2="46" y2="47" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="62" y1="16" x2="62" y2="44" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="76" y1="20" x2="76" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
        {/* Tail fin */}
        <path d="M84 30L94 18M84 30L94 42" stroke={color} strokeWidth="5" strokeLinecap="round" />
        {/* Head */}
        <path d="M12 30C12 30 7 20 2 30C7 40 12 30 12 30Z" fill={color} />
        <circle cx="6" cy="27" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

/**
 * Cute Doodle Sparkle Star
 */
export function DoodleSparkleSticker({
  className = "w-6 h-6",
  color = "#F59E0B",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`inline-block filter drop-shadow-[0_2px_6px_rgba(245,158,11,0.35)] ${className}`}>
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

/**
 * ======================================================================
 * AUTHENTIC KAWAII CHIBI CAT STICKERS (DOODLE STIKER GEMAS)
 * Chubby squishy mochi cheeks, sparkling manga eyes, blushing cheeks with
 * tick marks, dapper bowtie with bell, floral veil, die-cut vinyl border,
 * and realistic glossy resin dome shine overlays.
 * ======================================================================
 */

/**
 * MAIN HERO STICKER: Doodle Cat Couple (Orange Tabby Groom & White Cat Bride)
 * Snuggled cheek-to-cheek with entwined tails forming a heart, holding a mini heart.
 */
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
      className={`relative select-none filter drop-shadow-[0_16px_32px_rgba(234,88,12,0.24)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)] cursor-pointer ${className}`}
    >
      <svg viewBox="0 0 360 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          {/* Warm Orange Fur Gradient */}
          <linearGradient id="orangeFurGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="60%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Soft White Cat Contour */}
          <linearGradient id="whiteCatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          {/* Glossy Resin Dome Vinyl Sheen */}
          <linearGradient id="vinylGloss" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Veil Shimmer Gradient */}
          <linearGradient id="coupleVeilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#F8FAFC" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* 1. DIE-CUT THICK WHITE VINYL STICKER CONTOUR BACKING */}
        <path
          d="
            M 180 32
            C 210 12, 255 18, 275 48
            C 290 42, 318 55, 322 88
            C 328 120, 335 160, 325 195
            C 315 235, 290 270, 245 282
            C 210 290, 185 280, 180 276
            C 175 280, 150 290, 115 282
            C 70 270, 45 235, 35 195
            C 25 160, 32 120, 38 88
            C 42 55, 70 42, 85 48
            C 105 18, 150 12, 180 32
            Z
          "
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="18"
          strokeLinejoin="round"
        />

        {/* 2. OVERLAPPING TAILS FORMING A SWEET HEART AT TOP-CENTER */}
        <g id="heartTails">
          {/* Orange Cat Tail */}
          <path
            d="M 68 225 Q 40 260 70 276 Q 105 284 140 256 Q 165 235 178 200"
            stroke="url(#orangeFurGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="178" cy="200" r="7" fill="#FFFDF8" />

          {/* White Cat Tail */}
          <path
            d="M 292 225 Q 320 260 290 276 Q 255 284 220 256 Q 195 235 182 200"
            stroke="#FFFFFF"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tail loop forming heart peak */}
          <path
            d="M 168 195 Q 180 180 192 195"
            stroke="#FB7185"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 3. LEFT CAT: SQUISHY CHIBI ORANGE TABBY GROOM */}
        <g id="chibiOrangeGroom">
          {/* Chubby Body */}
          <ellipse cx="125" cy="205" rx="55" ry="62" fill="url(#orangeFurGrad)" />
          {/* Fluffy Cream Chest & Belly */}
          <ellipse cx="140" cy="214" rx="28" ry="42" fill="#FFFDF8" />

          {/* Squishy Mochi Head (wider at chubby jowls) */}
          <path
            d="
              M 72 125
              C 68 85, 92 60, 125 60
              C 158 60, 182 85, 178 125
              C 182 152, 162 168, 125 168
              C 88 168, 68 152, 72 125
              Z
            "
            fill="url(#orangeFurGrad)"
          />

          {/* Left Ear */}
          <path d="M 85 80 C 76 56, 72 40, 88 35 C 104 30, 114 48, 118 70 Z" fill="#EA580C" stroke="#EA580C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 89 74 C 84 55, 80 44, 92 41 C 100 39, 107 50, 112 66 Z" fill="#FECDD3" />
          {/* Fluffy ear tuft */}
          <circle cx="94" cy="74" r="3.5" fill="#FFFDF8" />

          {/* Right Ear */}
          <path d="M 132 70 C 136 48, 146 30, 162 35 C 178 40, 174 56, 165 80 Z" fill="#EA580C" stroke="#EA580C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 138 66 C 143 50, 150 39, 158 41 C 170 44, 166 55, 161 74 Z" fill="#FECDD3" />
          <circle cx="156" cy="74" r="3.5" fill="#FFFDF8" />

          {/* Forehead Warm Tabby Stripes */}
          <path d="M 125 68 L 125 84 M 115 72 Q 117 80 119 86 M 135 72 Q 133 80 131 86" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
          {/* Cheek stripes */}
          <path d="M 76 122 L 88 124 M 75 130 L 89 131" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />

          {/* Chubby White Snout / Mochi Cheeks Puff */}
          <ellipse cx="115" cy="136" rx="14" ry="11" fill="#FFFDF8" />
          <ellipse cx="135" cy="136" rx="14" ry="11" fill="#FFFDF8" />
          <ellipse cx="125" cy="144" rx="12" ry="8" fill="#FFFDF8" />

          {/* Big Gleaming Chibi Anime Eyes */}
          {/* Left Eye */}
          <g>
            <ellipse cx="102" cy="116" rx="8" ry="10" fill="#24140D" />
            <ellipse cx="100" cy="112" rx="3.5" ry="4" fill="#FFFFFF" />
            <ellipse cx="103" cy="122" rx="3" ry="1.5" fill="#FDBA74" opacity="0.8" />
            <circle cx="105" cy="117" r="1.3" fill="#FFFFFF" />
          </g>
          {/* Right Eye (Happy Squint or Sparkling Wink) */}
          <g>
            <ellipse cx="148" cy="116" rx="8" ry="10" fill="#24140D" />
            <ellipse cx="146" cy="112" rx="3.5" ry="4" fill="#FFFFFF" />
            <ellipse cx="149" cy="122" rx="3" ry="1.5" fill="#FDBA74" opacity="0.8" />
            <circle cx="151" cy="117" r="1.3" fill="#FFFFFF" />
          </g>

          {/* Sweet Coral-Pink Heart Nose & Omega Mouth (ω) */}
          <path d="M 123 128 C 123 125, 124.5 124, 125 125.5 C 125.5 124, 127 125, 127 128 C 127 130, 125 132, 125 132 C 125 132, 123 130, 123 128 Z" fill="#FB7185" />
          <path d="M 117 135 Q 121 140 125 135 Q 129 140 133 135" stroke="#382314" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Tiny Cute Tongue */}
          <path d="M 123 137 C 123 140.5, 127 140.5, 127 137 Z" fill="#FB7185" />

          {/* Soft Blushing Rosy Cheeks with // Ticks */}
          <ellipse cx="90" cy="132" rx="8" ry="5.5" fill="#FB7185" opacity="0.6" />
          <line x1="86" y1="130" x2="89" y2="134" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="91" y1="130" x2="94" y2="134" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />

          <ellipse cx="160" cy="132" rx="8" ry="5.5" fill="#FB7185" opacity="0.6" />
          <line x1="156" y1="130" x2="159" y2="134" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="161" y1="130" x2="164" y2="134" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />

          {/* Whisker Lines */}
          <path d="M 80 135 Q 66 133 60 135" stroke="#382314" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M 80 141 Q 67 142 62 146" stroke="#382314" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

          {/* Dapper Groom Bowtie with Golden Bell */}
          <g transform="translate(136, 175)">
            {/* Navy Bowtie Wings */}
            <path d="M 0 0 L -15 -8 L -15 8 Z" fill="#0F172A" />
            <path d="M 0 0 L 15 -8 L 15 8 Z" fill="#0F172A" />
            {/* Center Golden Bell */}
            <circle cx="0" cy="0" r="5" fill="#F59E0B" />
            <circle cx="-1" cy="-1.5" r="1.5" fill="#FEF08A" />
            <line x1="-3" y1="1" x2="3" y2="1" stroke="#92400E" strokeWidth="1" />
          </g>

          {/* Cute Chubby Front Paw */}
          <ellipse cx="132" cy="235" rx="14" ry="10" fill="#FFFDF8" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Pink toe pads */}
          <circle cx="127" cy="236" r="2.2" fill="#FECDD3" />
          <circle cx="132" cy="234" r="2.2" fill="#FECDD3" />
          <circle cx="137" cy="236" r="2.2" fill="#FECDD3" />
        </g>

        {/* 4. RIGHT CAT: FLUFFY CHIBI WHITE CAT BRIDE WITH VEIL */}
        <g id="chibiWhiteBride">
          {/* Cascading Sheer Bridal Veil (Back Layer) */}
          <path
            d="
              M 235 70
              C 275 65, 312 95, 320 155
              C 325 205, 298 250, 265 256
              C 240 235, 230 190, 226 160
              Z
            "
            fill="url(#coupleVeilGrad)"
          />
          {/* Scalloped lace hem */}
          <path
            d="M 312 115 Q 318 126 315 138 Q 321 150 318 162 Q 323 175 318 188 Q 320 202 312 216 Q 305 230 292 242"
            stroke="#E2E8F0"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Chubby White Body */}
          <ellipse cx="235" cy="205" rx="55" ry="62" fill="url(#whiteCatGrad)" stroke="#F1F5F9" strokeWidth="2" />

          {/* Squishy Mochi Head */}
          <path
            d="
              M 182 125
              C 178 85, 202 60, 235 60
              C 268 60, 292 85, 288 125
              C 292 152, 272 168, 235 168
              C 198 168, 178 152, 182 125
              Z
            "
            fill="url(#whiteCatGrad)"
            stroke="#F1F5F9"
            strokeWidth="2"
          />

          {/* Left Ear */}
          <path d="M 195 80 C 186 56, 182 40, 198 35 C 214 30, 224 48, 228 70 Z" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 199 74 C 194 55, 190 44, 202 41 C 210 39, 217 50, 222 66 Z" fill="#FECDD3" />
          <circle cx="204" cy="74" r="3.5" fill="#FFFFFF" />

          {/* Right Ear */}
          <path d="M 242 70 C 246 48, 256 30, 272 35 C 288 40, 284 56, 275 80 Z" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 248 66 C 253 50, 260 39, 268 41 C 280 44, 276 55, 271 74 Z" fill="#FECDD3" />
          <circle cx="266" cy="74" r="3.5" fill="#FFFFFF" />

          {/* Bridal Flower Tiara */}
          <g transform="translate(235, 68)">
            {/* Mint Leaves */}
            <ellipse cx="-20" cy="-2" rx="6" ry="3" fill="#86EFAC" transform="rotate(-20 -20 -2)" />
            <ellipse cx="20" cy="-2" rx="6" ry="3" fill="#86EFAC" transform="rotate(20 20 -2)" />
            {/* 3 Blooming Flowers */}
            <circle cx="-13" cy="0" r="6" fill="#F472B6" />
            <circle cx="-13" cy="0" r="2.2" fill="#FEF08A" />
            <circle cx="0" cy="-3" r="7.5" fill="#FB7185" />
            <circle cx="0" cy="-3" r="2.8" fill="#FEF08A" />
            <circle cx="13" cy="0" r="6" fill="#F472B6" />
            <circle cx="13" cy="0" r="2.2" fill="#FEF08A" />
          </g>

          {/* Chubby White Mochi Cheeks Puff */}
          <ellipse cx="225" cy="136" rx="14" ry="11" fill="#FFFFFF" />
          <ellipse cx="245" cy="136" rx="14" ry="11" fill="#FFFFFF" />
          <ellipse cx="235" cy="144" rx="12" ry="8" fill="#FFFFFF" />

          {/* Big Sparkling Jewel-Blue Anime Chibi Eyes with Fluttery Lashes */}
          {/* Left Eye */}
          <g>
            <ellipse cx="212" cy="116" rx="8" ry="10" fill="#0C4A60" />
            <ellipse cx="210" cy="112" rx="3.5" ry="4" fill="#FFFFFF" />
            <ellipse cx="213" cy="122" rx="3" ry="1.5" fill="#38B6FF" opacity="0.85" />
            <circle cx="215" cy="117" r="1.3" fill="#FFFFFF" />
            {/* Fluttery eyelashes */}
            <path d="M 206 110 L 202 106 M 218 110 L 222 107" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          {/* Right Eye */}
          <g>
            <ellipse cx="258" cy="116" rx="8" ry="10" fill="#0C4A60" />
            <ellipse cx="256" cy="112" rx="3.5" ry="4" fill="#FFFFFF" />
            <ellipse cx="259" cy="122" rx="3" ry="1.5" fill="#38B6FF" opacity="0.85" />
            <circle cx="261" cy="117" r="1.3" fill="#FFFFFF" />
            <path d="M 252 110 L 248 107 M 264 110 L 268 106" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Sweet Coral-Pink Nose & Omega Mouth (ω) */}
          <path d="M 233 128 C 233 125, 234.5 124, 235 125.5 C 235.5 124, 237 125, 237 128 C 237 130, 235 132, 235 132 C 235 132, 233 130, 233 128 Z" fill="#FB7185" />
          <path d="M 227 135 Q 231 140 235 135 Q 239 140 243 135" stroke="#382314" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Rosy Blushing Cheeks with // Ticks */}
          <ellipse cx="200" cy="132" rx="8" ry="5.5" fill="#FB7185" opacity="0.65" />
          <line x1="196" y1="130" x2="199" y2="134" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="201" y1="130" x2="204" y2="134" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />

          <ellipse cx="270" cy="132" rx="8" ry="5.5" fill="#FB7185" opacity="0.65" />
          <line x1="266" y1="130" x2="269" y2="134" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="271" y1="130" x2="274" y2="134" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />

          {/* Whiskers */}
          <path d="M 280 135 Q 294 133 300 135" stroke="#382314" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M 280 141 Q 293 142 298 146" stroke="#382314" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

          {/* Delicate Pearl Necklace */}
          <g transform="translate(235, 172)">
            <circle cx="-12" cy="0" r="3" fill="#F1F5F9" />
            <circle cx="-6" cy="2" r="3.5" fill="#F8FAFC" />
            <circle cx="0" cy="3" r="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
            <circle cx="6" cy="2" r="3.5" fill="#F8FAFC" />
            <circle cx="12" cy="0" r="3" fill="#F1F5F9" />
          </g>

          {/* Front Paw Holding Mini Bouquet */}
          <ellipse cx="228" cy="235" rx="14" ry="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="223" cy="236" r="2.2" fill="#FECDD3" />
          <circle cx="228" cy="234" r="2.2" fill="#FECDD3" />
          <circle cx="233" cy="236" r="2.2" fill="#FECDD3" />
        </g>

        {/* 5. CENTERPIECE: PAWS TOGETHER HOLDING A GLOWING HEART */}
        <g transform="translate(180, 222)">
          {/* Die-Cut Mini Heart */}
          <path
            d="M 0 12 C 0 12 -14 -4 -14 -14 C -14 -21 -8 -26 0 -19 C 8 -26 14 -21 14 -14 C 14 -4 0 12 0 12 Z"
            fill="#FB7185"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Heart shine */}
          <circle cx="-4" cy="-14" r="2" fill="#FFFFFF" opacity="0.85" />
        </g>

        {/* 6. FLOATING DOODLE HEARTS & SPARKLES ABOVE */}
        <g id="sparkleHearts">
          {/* Main Top Heart */}
          <path
            d="M 180 50 C 180 50 168 36 168 25 C 168 18 174 13 180 20 C 186 13 192 18 192 25 C 192 36 180 50 180 50 Z"
            fill="#FB7185"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Mini Left Pink Heart */}
          <path
            d="M 148 28 C 148 28 140 18 140 11 C 140 6 144 3 148 7 C 152 3 156 6 156 11 C 156 18 148 28 148 28 Z"
            fill="#F472B6"
            stroke="#FFFFFF"
            strokeWidth="2.2"
          />
          {/* Gold Sparkle Stars */}
          <path d="M 210 18 C 210 23 213 26 218 26 C 213 26 210 29 210 34 C 210 29 207 26 202 26 C 207 26 210 23 210 18 Z" fill="#FBBF24" />
          <circle cx="178" cy="12" r="2" fill="#FBBF24" />
        </g>

        {/* 7. GLOSSY RESIN DOME VINYL SHINE OVERLAY */}
        <path
          d="
            M 180 34
            C 210 16, 250 20, 270 48
            C 285 42, 310 55, 314 85
            C 255 110, 160 145, 65 175
            C 50 145, 52 110, 58 92
            C 62 60, 88 50, 100 55
            C 118 25, 155 20, 180 34
            Z
          "
          fill="url(#vinylGloss)"
          pointerEvents="none"
        />

        {/* 8. CUTE DIE-CUT BANNER AT BOTTOM */}
        <g transform="translate(180, 296)">
          <rect x="-92" y="-14" width="184" height="28" rx="14" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2.5" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#C2410C"
            fontFamily="monospace"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2.5"
          >
            PURRFECT ROMANCE
          </text>
        </g>
      </svg>
    </motion.div>
  );
}

/**
 * INDIVIDUAL STICKER: Doodle Orange Cat Groom (Super Gemas Chibi)
 */
export function DoodleOrangeCatGroomSticker({
  className = "w-48 h-56",
  rotate = -3,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <motion.div
      style={{ transform: `rotate(${rotate}deg)` }}
      whileHover={{ scale: 1.05, rotate: rotate + 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative select-none filter drop-shadow-[0_14px_28px_rgba(234,88,12,0.26)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer ${className}`}
    >
      <svg viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="singleOrangeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="60%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="singleGloss" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. DIE-CUT WHITE BACKING */}
        <path
          d="
            M 110 24
            C 142 10, 175 28, 180 65
            C 195 90, 198 135, 190 170
            C 184 210, 155 242, 110 242
            C 65 242, 36 210, 30 170
            C 22 135, 25 90, 40 65
            C 45 28, 78 10, 110 24
            Z
          "
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinejoin="round"
        />

        {/* 2. CHUBBY PEAR BODY */}
        <ellipse cx="110" cy="175" rx="55" ry="60" fill="url(#singleOrangeGrad)" />
        {/* Fluffy Cream Chest */}
        <ellipse cx="110" cy="184" rx="28" ry="42" fill="#FFFDF8" />

        {/* Fluffy Tail on Right */}
        <path
          d="M 160 190 Q 188 200 182 225 Q 175 238 155 232"
          stroke="url(#singleOrangeGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="180" cy="225" r="6" fill="#FFFDF8" />

        {/* 3. SQUISHY MOCHI HEAD */}
        <path
          d="
            M 48 108
            C 44 68, 70 45, 110 45
            C 150 45, 176 68, 172 108
            C 176 138, 152 155, 110 155
            C 68 155, 44 138, 48 108
            Z
          "
          fill="url(#singleOrangeGrad)"
        />

        {/* Ears */}
        {/* Left Ear */}
        <path d="M 64 68 C 55 45, 52 28, 68 24 C 84 20, 94 38, 98 60 Z" fill="#EA580C" stroke="#EA580C" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 68 62 C 63 45, 60 33, 72 30 C 82 28, 88 40, 92 56 Z" fill="#FECDD3" />
        <circle cx="74" cy="62" r="3" fill="#FFFDF8" />

        {/* Right Ear */}
        <path d="M 122 60 C 126 38, 136 20, 152 24 C 168 28, 165 45, 156 68 Z" fill="#EA580C" stroke="#EA580C" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 128 56 C 132 40, 138 28, 148 30 C 160 33, 157 45, 152 62 Z" fill="#FECDD3" />
        <circle cx="146" cy="62" r="3" fill="#FFFDF8" />

        {/* Forehead Stripes */}
        <path d="M 110 52 L 110 68 M 100 56 Q 102 64 104 70 M 120 56 Q 118 64 116 70" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
        <path d="M 50 106 L 64 108 M 49 114 L 65 115" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 170 106 L 156 108 M 171 114 L 155 115" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />

        {/* Chubby White Snout / Cheeks */}
        <ellipse cx="98" cy="120" rx="15" ry="12" fill="#FFFDF8" />
        <ellipse cx="122" cy="120" rx="15" ry="12" fill="#FFFDF8" />
        <ellipse cx="110" cy="130" rx="13" ry="9" fill="#FFFDF8" />

        {/* Gleaming Chibi Anime Eyes */}
        {/* Left Eye */}
        <ellipse cx="84" cy="98" rx="8.5" ry="10.5" fill="#24140D" />
        <ellipse cx="82" cy="94" rx="3.5" ry="4" fill="#FFFFFF" />
        <ellipse cx="85" cy="104" rx="3.5" ry="2" fill="#FDBA74" opacity="0.8" />
        <circle cx="87" cy="99" r="1.3" fill="#FFFFFF" />

        {/* Right Eye (Playful Sparkling Wink or Matching Eye) */}
        <ellipse cx="136" cy="98" rx="8.5" ry="10.5" fill="#24140D" />
        <ellipse cx="134" cy="94" rx="3.5" ry="4" fill="#FFFFFF" />
        <ellipse cx="137" cy="104" rx="3.5" ry="2" fill="#FDBA74" opacity="0.8" />
        <circle cx="139" cy="99" r="1.3" fill="#FFFFFF" />

        {/* Coral Pink Nose & Omega Mouth (ω) */}
        <path d="M 108 112 C 108 109, 109.5 108, 110 109.5 C 110.5 108, 112 109, 112 112 C 112 114, 110 116, 110 116 C 110 116, 108 114, 108 112 Z" fill="#FB7185" />
        <path d="M 100 120 Q 105 125 110 120 Q 115 125 120 120" stroke="#382314" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 108 122 C 108 126, 112 126, 112 122 Z" fill="#FB7185" />

        {/* Rosy Blushing Cheeks with // Ticks */}
        <ellipse cx="68" cy="116" rx="8.5" ry="6" fill="#FB7185" opacity="0.6" />
        <line x1="64" y1="114" x2="67" y2="118" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="69" y1="114" x2="72" y2="118" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />

        <ellipse cx="152" cy="116" rx="8.5" ry="6" fill="#FB7185" opacity="0.6" />
        <line x1="148" y1="114" x2="151" y2="118" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="153" y1="114" x2="156" y2="118" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />

        {/* Whiskers */}
        <path d="M 58 118 Q 44 116 38 118" stroke="#382314" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        <path d="M 58 124 Q 45 125 40 129" stroke="#382314" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        <path d="M 162 118 Q 176 116 182 118" stroke="#382314" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        <path d="M 162 124 Q 175 125 180 129" stroke="#382314" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />

        {/* Dapper Groom Bowtie with Bell */}
        <g transform="translate(110, 150)">
          <path d="M 0 0 L -16 -9 L -16 9 Z" fill="#0F172A" />
          <path d="M 0 0 L 16 -9 L 16 9 Z" fill="#0F172A" />
          <circle cx="0" cy="0" r="5" fill="#F59E0B" />
          <circle cx="-1" cy="-1.5" r="1.5" fill="#FEF08A" />
        </g>

        {/* Two Chubby White Paws folded neatly */}
        <ellipse cx="92" cy="216" rx="14" ry="10" fill="#FFFDF8" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="88" cy="217" r="2.2" fill="#FECDD3" />
        <circle cx="92" cy="215" r="2.2" fill="#FECDD3" />
        <circle cx="96" cy="217" r="2.2" fill="#FECDD3" />

        <ellipse cx="128" cy="216" rx="14" ry="10" fill="#FFFDF8" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="124" cy="217" r="2.2" fill="#FECDD3" />
        <circle cx="128" cy="215" r="2.2" fill="#FECDD3" />
        <circle cx="132" cy="217" r="2.2" fill="#FECDD3" />

        {/* Glossy Sheen Overlay */}
        <path
          d="
            M 110 26
            C 138 12, 168 25, 172 56
            C 135 78, 80 105, 32 128
            C 25 105, 30 75, 42 56
            C 50 28, 82 12, 110 26
            Z
          "
          fill="url(#singleGloss)"
          pointerEvents="none"
        />

        {/* Bottom Badge Tag */}
        <g transform="translate(110, 238)">
          <rect x="-52" y="-11" width="104" height="22" rx="11" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="1.8">
            THE GROOM
          </text>
        </g>
      </svg>
    </motion.div>
  );
}

/**
 * INDIVIDUAL STICKER: Doodle White Cat Bride (Super Gemas Chibi)
 */
export function DoodleWhiteCatBrideSticker({
  className = "w-48 h-56",
  rotate = 3,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <motion.div
      style={{ transform: `rotate(${rotate}deg)` }}
      whileHover={{ scale: 1.05, rotate: rotate - 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative select-none filter drop-shadow-[0_14px_28px_rgba(244,114,182,0.24)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer ${className}`}
    >
      <svg viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="singleWhiteGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          <linearGradient id="singleVeilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#F8FAFC" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* 1. DIE-CUT WHITE BACKING */}
        <path
          d="
            M 110 24
            C 142 10, 175 28, 182 65
            C 198 90, 200 135, 192 170
            C 185 210, 155 242, 110 242
            C 65 242, 35 210, 28 170
            C 20 135, 22 90, 38 65
            C 45 28, 78 10, 110 24
            Z
          "
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinejoin="round"
        />

        {/* Flowing Bridal Veil behind Head & Body */}
        <path
          d="M 52 75 C 18 95 20 160 32 210 C 65 232 155 232 188 210 C 200 160 202 95 168 75 Z"
          fill="url(#singleVeilGrad)"
          stroke="#E2E8F0"
          strokeWidth="1.8"
        />
        {/* Veil gold twinkle stars */}
        <path d="M 42 135 C 42 138 44 140 47 140 C 44 140 42 142 42 145 C 42 142 40 140 37 140 C 40 140 42 138 42 135 Z" fill="#FBBF24" />
        <path d="M 178 135 C 178 138 180 140 183 140 C 180 140 178 142 178 145 C 178 142 176 140 173 140 C 176 140 178 138 178 135 Z" fill="#FBBF24" />

        {/* 2. CHUBBY PEAR BODY */}
        <ellipse cx="110" cy="175" rx="55" ry="60" fill="url(#singleWhiteGrad)" stroke="#F1F5F9" strokeWidth="2" />

        {/* Fluffy White Tail with Pink Bow */}
        <path
          d="M 160 190 Q 188 200 182 225 Q 175 238 155 232"
          stroke="#FFFFFF"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        {/* Pink Ribbon on Tail */}
        <g transform="translate(178, 218)">
          <path d="M 0 0 L -6 -3 L -6 3 Z" fill="#F472B6" />
          <path d="M 0 0 L 6 -3 L 6 3 Z" fill="#F472B6" />
          <circle cx="0" cy="0" r="2" fill="#FEF08A" />
        </g>

        {/* 3. SQUISHY MOCHI HEAD */}
        <path
          d="
            M 48 108
            C 44 68, 70 45, 110 45
            C 150 45, 176 68, 172 108
            C 176 138, 152 155, 110 155
            C 68 155, 44 138, 48 108
            Z
          "
          fill="url(#singleWhiteGrad)"
          stroke="#F1F5F9"
          strokeWidth="2"
        />

        {/* Ears */}
        {/* Left Ear */}
        <path d="M 64 68 C 55 45, 52 28, 68 24 C 84 20, 94 38, 98 60 Z" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 68 62 C 63 45, 60 33, 72 30 C 82 28, 88 40, 92 56 Z" fill="#FECDD3" />
        <circle cx="74" cy="62" r="3" fill="#FFFFFF" />

        {/* Right Ear */}
        <path d="M 122 60 C 126 38, 136 20, 152 24 C 168 28, 165 45, 156 68 Z" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 128 56 C 132 40, 138 28, 148 30 C 160 33, 157 45, 152 62 Z" fill="#FECDD3" />
        <circle cx="146" cy="62" r="3" fill="#FFFFFF" />

        {/* Floral Tiara on Head */}
        <g transform="translate(110, 48)">
          <ellipse cx="-20" cy="-2" rx="6" ry="3" fill="#86EFAC" transform="rotate(-18 -20 -2)" />
          <ellipse cx="20" cy="-2" rx="6" ry="3" fill="#86EFAC" transform="rotate(18 20 -2)" />
          <circle cx="-13" cy="0" r="6" fill="#F472B6" />
          <circle cx="-13" cy="0" r="2.2" fill="#FEF08A" />
          <circle cx="0" cy="-3" r="7.5" fill="#FB7185" />
          <circle cx="0" cy="-3" r="2.8" fill="#FEF08A" />
          <circle cx="13" cy="0" r="6" fill="#F472B6" />
          <circle cx="13" cy="0" r="2.2" fill="#FEF08A" />
        </g>

        {/* Chubby White Snout */}
        <ellipse cx="98" cy="120" rx="15" ry="12" fill="#FFFFFF" />
        <ellipse cx="122" cy="120" rx="15" ry="12" fill="#FFFFFF" />
        <ellipse cx="110" cy="130" rx="13" ry="9" fill="#FFFFFF" />

        {/* Big Sparkling Jewel-Blue Anime Eyes with Eyelashes */}
        {/* Left Eye */}
        <g>
          <ellipse cx="84" cy="98" rx="8.5" ry="10.5" fill="#0C4A60" />
          <ellipse cx="82" cy="94" rx="3.5" ry="4" fill="#FFFFFF" />
          <ellipse cx="85" cy="104" rx="3.5" ry="2" fill="#38B6FF" opacity="0.85" />
          <circle cx="87" cy="99" r="1.3" fill="#FFFFFF" />
          <path d="M 77 92 L 73 88 M 90 92 L 94 89" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        {/* Right Eye */}
        <g>
          <ellipse cx="136" cy="98" rx="8.5" ry="10.5" fill="#0C4A60" />
          <ellipse cx="134" cy="94" rx="3.5" ry="4" fill="#FFFFFF" />
          <ellipse cx="137" cy="104" rx="3.5" ry="2" fill="#38B6FF" opacity="0.85" />
          <circle cx="139" cy="99" r="1.3" fill="#FFFFFF" />
          <path d="M 129 92 L 125 89 M 143 92 L 147 88" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Coral Pink Nose & Omega Mouth */}
        <path d="M 108 112 C 108 109, 109.5 108, 110 109.5 C 110.5 108, 112 109, 112 112 C 112 114, 110 116, 110 116 C 110 116, 108 114, 108 112 Z" fill="#FB7185" />
        <path d="M 100 120 Q 105 125 110 120 Q 115 125 120 120" stroke="#382314" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Rosy Blushing Cheeks with // Ticks */}
        <ellipse cx="68" cy="116" rx="8.5" ry="6" fill="#FB7185" opacity="0.65" />
        <line x1="64" y1="114" x2="67" y2="118" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="69" y1="114" x2="72" y2="118" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />

        <ellipse cx="152" cy="116" rx="8.5" ry="6" fill="#FB7185" opacity="0.65" />
        <line x1="148" y1="114" x2="151" y2="118" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="153" y1="114" x2="156" y2="118" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />

        {/* Whiskers */}
        <path d="M 58 118 Q 44 116 38 118" stroke="#382314" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        <path d="M 58 124 Q 45 125 40 129" stroke="#382314" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        <path d="M 162 118 Q 176 116 182 118" stroke="#382314" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        <path d="M 162 124 Q 175 125 180 129" stroke="#382314" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />

        {/* Pearl Necklace */}
        <g transform="translate(110, 150)">
          <circle cx="-12" cy="0" r="3" fill="#F1F5F9" />
          <circle cx="-6" cy="2" r="3.5" fill="#F8FAFC" />
          <circle cx="0" cy="3" r="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="6" cy="2" r="3.5" fill="#F8FAFC" />
          <circle cx="12" cy="0" r="3" fill="#F1F5F9" />
        </g>

        {/* Paws Holding Mini Bouquet */}
        <ellipse cx="92" cy="216" rx="14" ry="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="88" cy="217" r="2.2" fill="#FECDD3" />
        <circle cx="92" cy="215" r="2.2" fill="#FECDD3" />
        <circle cx="96" cy="217" r="2.2" fill="#FECDD3" />

        <ellipse cx="128" cy="216" rx="14" ry="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="124" cy="217" r="2.2" fill="#FECDD3" />
        <circle cx="128" cy="215" r="2.2" fill="#FECDD3" />
        <circle cx="132" cy="217" r="2.2" fill="#FECDD3" />

        {/* Mini Bouquet in Center of Paws */}
        <g transform="translate(110, 212)">
          <circle cx="-4" cy="-2" r="4.5" fill="#FB7185" />
          <circle cx="4" cy="-2" r="4.5" fill="#F472B6" />
          <circle cx="0" cy="2" r="4.5" fill="#FDE047" />
          <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
        </g>

        {/* Glossy Sheen Overlay */}
        <path
          d="
            M 110 26
            C 138 12, 168 25, 172 56
            C 135 78, 80 105, 32 128
            C 25 105, 30 75, 42 56
            C 50 28, 82 12, 110 26
            Z
          "
          fill="url(#singleGloss)"
          pointerEvents="none"
        />

        {/* Bottom Badge Tag */}
        <g transform="translate(110, 238)">
          <rect x="-52" y="-11" width="104" height="22" rx="11" fill="#BE185D" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="1.8">
            THE BRIDE
          </text>
        </g>
      </svg>
    </motion.div>
  );
}

/**
 * DIE-CUT ARTWORK STICKER: Frames painted cat art or user photo as an authentic
 * die-cut physical sticker with white border, peel shadow, and washi tape.
 */
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
      className={`relative select-none filter drop-shadow-[0_16px_32px_rgba(200,90,23,0.2)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)] cursor-pointer p-2.5 bg-white rounded-[28px] border-[5px] border-white ${className}`}
    >
      <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-amber-50">
        <img src={src} alt={alt} className="w-full h-full object-cover object-center" />
        {/* Glossy sticker shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/60 pointer-events-none" />
      </div>

      {badgeText && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10">
          <span className="px-3.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase bg-[#C85A17] text-white border-2 border-white shadow-md">
            {badgeText}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Brush Stroke Divider with Paw Print Accent
 */
export function BrushStrokeDivider({
  className = "my-6",
  color = "#D97736",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-2 max-w-xs mx-auto ${className}`}>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#D97736]/35 to-transparent" />
      <DoodlePawSticker className="w-5 h-5" color={color} rotate={0} />
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#D97736]/35 to-transparent" />
    </div>
  );
}

/**
 * Palette Icon
 */
export function PainterPaletteIcon({
  className = "w-6 h-6",
  color = "#D97736",
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

/**
 * Legacy CatPawPrint export for backward compatibility
 */
export function CatPawPrint({
  className = "w-6 h-6",
  color = "#D97736",
}: {
  className?: string;
  color?: string;
}) {
  return <DoodlePawSticker className={className} color={color} rotate={0} />;
}
