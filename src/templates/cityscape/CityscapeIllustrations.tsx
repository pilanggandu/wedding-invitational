"use client";

import React from "react";
import { motion } from "framer-motion";
import { VintageStreetLamp, ParkBushes } from "./CityscapeDecorations";

/**
 * Handcrafted SVG Illustration: The Manhwa Couple Walking Hand-in-Hand
 * Recreating the reference couple:
 * Groom: White casual button-up shirt, light denim jeans, white sneakers, brown wavy hair, warm smile.
 * Bride: Flowy white modest maxi dress, soft sandy beige hijab, crossbody bag, holding groom's hand.
 */
export function CoupleWalkingIllustration({
  className = "w-full max-w-[280px] h-auto",
}: {
  className?: string;
}) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 320 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-md"
      >
        <defs>
          {/* Subtle skin tones */}
          <linearGradient id="skinGroom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE0BD" />
            <stop offset="100%" stopColor="#F7C8A0" />
          </linearGradient>
          <linearGradient id="skinBride" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF0E0" />
            <stop offset="100%" stopColor="#F9D7BE" />
          </linearGradient>

          {/* Hair Groom */}
          <linearGradient id="hairGroom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A3728" />
            <stop offset="100%" stopColor="#2E1F14" />
          </linearGradient>

          {/* Hijab Bride */}
          <linearGradient id="hijabGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAD8C7" />
            <stop offset="100%" stopColor="#D8C3AE" />
          </linearGradient>

          {/* Groom Jeans */}
          <linearGradient id="jeansGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8AB4D5" />
            <stop offset="100%" stopColor="#5E8FB5" />
          </linearGradient>

          {/* White Dress Shading */}
          <linearGradient id="whiteDress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EEF4F8" />
          </linearGradient>

          {/* Ground Soft Shadow */}
          <radialGradient id="coupleShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(15, 23, 42, 0.28)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
          </radialGradient>
        </defs>

        {/* 1. Ground Ambient Shadow */}
        <ellipse cx="160" cy="426" rx="90" ry="10" fill="url(#coupleShadow)" />

        {/* ========================================================
            GROOM (Left Side)
            ======================================================== */}
        <g id="groom">
          {/* Groom Left Leg */}
          <path
            d="M95 270 L88 385 L106 385 L112 270 Z"
            fill="url(#jeansGrad)"
          />
          {/* Groom Right Leg (Forward) */}
          <path
            d="M120 270 L115 375 L133 375 L136 270 Z"
            fill="url(#jeansGrad)"
          />
          {/* Jeans Cuffs & Seams */}
          <line x1="88" y1="382" x2="106" y2="382" stroke="#486D8A" strokeWidth="2" />
          <line x1="115" y1="372" x2="133" y2="372" stroke="#486D8A" strokeWidth="2" />

          {/* Groom Shoes (White Sneakers) */}
          {/* Left Shoe */}
          <path
            d="M84 385 C84 380 92 380 96 385 L108 388 C108 393 102 396 90 396 C82 396 82 390 84 385 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          {/* Right Shoe */}
          <path
            d="M112 375 C112 370 120 370 124 375 L136 378 C136 383 130 386 118 386 C110 386 110 380 112 375 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Groom Shirt (Crisp White Button-up with folds) */}
          <path
            d="M75 160 C75 145 92 140 115 140 C138 140 152 145 152 160 L146 275 C146 280 135 282 115 282 C95 282 82 280 80 275 Z"
            fill="url(#whiteDress)"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />
          {/* Shirt Placket & Buttons */}
          <line x1="115" y1="148" x2="115" y2="280" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="1 6" />
          <circle cx="115" cy="170" r="1.5" fill="#94A3B8" />
          <circle cx="115" cy="190" r="1.5" fill="#94A3B8" />
          <circle cx="115" cy="210" r="1.5" fill="#94A3B8" />
          <circle cx="115" cy="230" r="1.5" fill="#94A3B8" />
          {/* Shirt Pocket */}
          <rect x="92" y="172" width="12" height="15" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          {/* Collar */}
          <path d="M104 142 L115 152 L100 154 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M126 142 L115 152 L130 154 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />

          {/* Groom Left Arm (Pocket) */}
          <path
            d="M78 160 L68 220 L76 255 L86 245 L80 215 Z"
            fill="url(#whiteDress)"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          {/* Hand in pocket */}
          <circle cx="78" cy="256" r="6" fill="url(#skinGroom)" />

          {/* Groom Right Arm (Reaching to Hold Bride's Hand) */}
          <path
            d="M148 160 L158 205 L156 245 L146 245 L144 200 Z"
            fill="url(#whiteDress)"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          {/* Rolled cuff */}
          <rect x="145" y="240" width="13" height="6" rx="2" fill="#E2E8F0" />
          {/* Groom Hand Holding Bride's Hand */}
          <ellipse cx="154" cy="254" rx="6" ry="7" fill="url(#skinGroom)" />

          {/* Groom Neck */}
          <rect x="108" y="130" width="14" height="15" rx="3" fill="url(#skinGroom)" />

          {/* Groom Head */}
          <ellipse cx="115" cy="108" rx="22" ry="24" fill="url(#skinGroom)" />
          {/* Groom Ears */}
          <circle cx="92" cy="110" r="4.5" fill="url(#skinGroom)" />
          <circle cx="138" cy="110" r="4.5" fill="url(#skinGroom)" />

          {/* Groom Cute Manhwa Face */}
          {/* Gentle Blush */}
          <circle cx="102" cy="116" r="4" fill="#FCA5A5" opacity="0.45" />
          <circle cx="128" cy="116" r="4" fill="#FCA5A5" opacity="0.45" />
          {/* Eyes (Smiling Arches) */}
          <path d="M102 108 Q107 104 112 108" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M120 108 Q125 104 130 108" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Sweet Smile */}
          <path d="M113 120 Q117 125 122 120" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Groom Hair (Fluffy Manhwa Wavy Hair) */}
          <path
            d="M90 102 C88 80 104 70 120 70 C138 70 146 82 144 100 C140 92 134 88 126 88 C116 88 114 94 104 94 C96 94 92 98 90 102 Z"
            fill="url(#hairGroom)"
          />
          {/* Sideburns & Locks */}
          <path d="M91 100 L95 112 L98 102 Z" fill="url(#hairGroom)" />
          <path d="M141 100 L137 112 L135 102 Z" fill="url(#hairGroom)" />
          {/* Hair Top Strands texture */}
          <path d="M110 74 Q116 68 122 74" stroke="#66462C" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>

        {/* ========================================================
            BRIDE (Right Side)
            ======================================================== */}
        <g id="bride">
          {/* Bride Maxi Dress / Abaya (Flowing Chiffon White) */}
          <path
            d="M175 190 C175 180 188 178 202 178 C216 178 228 180 228 190 L248 375 C248 385 220 392 202 392 C184 392 155 385 155 375 Z"
            fill="url(#whiteDress)"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />
          {/* Dress pleats/folds */}
          <path d="M185 240 Q188 310 180 382" stroke="#E2E8F0" strokeWidth="1.2" fill="none" />
          <path d="M202 230 Q202 310 202 390" stroke="#E2E8F0" strokeWidth="1.2" fill="none" />
          <path d="M218 240 Q215 310 222 382" stroke="#E2E8F0" strokeWidth="1.2" fill="none" />

          {/* Bride Shoes (White Flats / Heels peeking) */}
          <path
            d="M186 386 C186 382 192 382 195 386 L200 388 C200 392 196 394 190 394 C185 394 185 390 186 386 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          <path
            d="M205 386 C205 382 211 382 214 386 L219 388 C219 392 215 394 209 394 C204 394 204 390 205 386 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />

          {/* Bride Left Arm (Holding Groom's Hand) */}
          <path
            d="M178 185 L164 220 L160 252 L168 252 L176 215 Z"
            fill="url(#whiteDress)"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          {/* Rolled Puff Sleeve */}
          <ellipse cx="178" cy="186" rx="8" ry="10" fill="url(#whiteDress)" stroke="#E2E8F0" strokeWidth="1" />
          {/* Bride Hand clasping Groom Hand */}
          <ellipse cx="162" cy="254" rx="5.5" ry="6" fill="url(#skinBride)" />
          {/* Cute subtle pink heart over clasped hands */}
          <path
            d="M158 242 C158 239 154 238 152 241 C150 238 146 239 146 242 C146 246 152 250 152 250 C152 250 158 246 158 242 Z"
            fill="#F472B6"
            opacity="0.8"
          />

          {/* Bride Right Arm & Handbag */}
          <path
            d="M226 185 L234 220 L230 255 L222 250 L220 215 Z"
            fill="url(#whiteDress)"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          <ellipse cx="226" cy="186" rx="8" ry="10" fill="url(#whiteDress)" stroke="#E2E8F0" strokeWidth="1" />
          <ellipse cx="230" cy="256" rx="5" ry="6" fill="url(#skinBride)" />
          {/* Crossbody Bag Strap & Bag */}
          <path d="M190 178 L232 250" stroke="#D1B89D" strokeWidth="2.5" fill="none" />
          <rect x="224" y="246" width="18" height="22" rx="4" fill="#EAD8C7" stroke="#C4A88B" strokeWidth="1.2" />
          <circle cx="233" cy="256" r="2" fill="#D97706" />

          {/* Bride Hijab Draping (Soft Beige-Gold Cashmere) */}
          <path
            d="M178 135 C172 155 174 190 190 205 C202 215 212 210 220 195 C228 175 228 155 224 135 Z"
            fill="url(#hijabGrad)"
            stroke="#CBB5A0"
            strokeWidth="1.2"
          />
          {/* Hijab front fold */}
          <path d="M198 155 Q204 185 200 205" stroke="#BF9B7B" strokeWidth="1.5" fill="none" opacity="0.6" />

          {/* Bride Face */}
          <ellipse cx="201" cy="120" rx="18" ry="19" fill="url(#skinBride)" />
          {/* Hijab Inner Frame around Face */}
          <path
            d="M184 116 C184 94 218 94 218 116 C218 136 210 142 201 142 C192 142 184 136 184 116 Z"
            fill="url(#hijabGrad)"
          />
          <ellipse cx="201" cy="120" rx="14" ry="15" fill="url(#skinBride)" />

          {/* Bride Manhwa Sweet Face */}
          {/* Soft Peachy Blush */}
          <circle cx="192" cy="125" r="3.5" fill="#FDA4AF" opacity="0.5" />
          <circle cx="210" cy="125" r="3.5" fill="#FDA4AF" opacity="0.5" />
          {/* Big Sparkling Doe Eyes */}
          <ellipse cx="193" cy="119" rx="3" ry="3.5" fill="#1E293B" />
          <circle cx="192" cy="117.5" r="1.2" fill="#FFFFFF" />
          <path d="M189 114 Q194 112 197 115" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          <ellipse cx="209" cy="119" rx="3" ry="3.5" fill="#1E293B" />
          <circle cx="208" cy="117.5" r="1.2" fill="#FFFFFF" />
          <path d="M205 115 Q208 112 213 114" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Sweet Coral Smile */}
          <path d="M198 128 Q201 132 204 128" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Handcrafted Full Boulevard & Cityscape Scene
 * Recreating the entire romantic city avenue from the TikTok video:
 * - Layered high-rise towers with glass windows and spires
 * - Leafy green canopy trees flanking the road
 * - Classic Victorian cast-iron street lamps with warm amber light
 * - Perspective stone tile walkway path leading forward
 */
export function CityBoulevardBackdrop({
  className = "w-full h-full",
}: {
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* 1. Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#BFE1F4] via-[#DCEDF8] to-[#F1F8FC]" />

      {/* 2. Distant Skyline Layer (Pastel Blue-Grey Silhouettes) */}
      <div className="absolute top-12 inset-x-0 h-72 opacity-50">
        <svg viewBox="0 0 600 300" preserveAspectRatio="none" className="w-full h-full">
          {/* Distant Towers */}
          <rect x="20" y="70" width="45" height="230" fill="#87CEEB" rx="3" />
          <polygon points="42,40 36,70 48,70" fill="#87CEEB" />
          <rect x="75" y="110" width="55" height="190" fill="#98D8F0" rx="3" />
          <rect x="140" y="60" width="60" height="240" fill="#78BEE0" rx="4" />
          <line x1="170" y1="30" x2="170" y2="60" stroke="#78BEE0" strokeWidth="3" />

          <rect x="380" y="80" width="60" height="220" fill="#78BEE0" rx="4" />
          <rect x="450" y="50" width="55" height="250" fill="#87CEEB" rx="3" />
          <polygon points="477,20 470,50 484,50" fill="#87CEEB" />
          <rect x="515" y="100" width="65" height="200" fill="#98D8F0" rx="4" />
        </svg>
      </div>

      {/* 3. Midground Modern Skyscrapers with Glass Panes & Lit Windows */}
      <div className="absolute top-20 inset-x-0 h-80 opacity-90">
        <svg viewBox="0 0 600 320" preserveAspectRatio="none" className="w-full h-full">
          {/* Left Main Skyscraper (Teal-Blue with Gold Trims) */}
          <rect x="-10" y="30" width="110" height="290" fill="#2E8BC0" rx="5" />
          <rect x="15" y="5" width="60" height="30" fill="#F4D160" rx="2" />
          <polygon points="45,-15 40,5 50,5" fill="#F4D160" />
          {/* Windows Left Tower */}
          <g fill="#FFEAA7" opacity="0.85">
            <rect x="5" y="45" width="14" height="22" rx="2" />
            <rect x="25" y="45" width="14" height="22" rx="2" />
            <rect x="45" y="45" width="14" height="22" rx="2" />
            <rect x="65" y="45" width="14" height="22" rx="2" />
            <rect x="25" y="75" width="14" height="22" rx="2" />
            <rect x="45" y="75" width="14" height="22" rx="2" />
            <rect x="5" y="105" width="14" height="22" rx="2" />
            <rect x="65" y="105" width="14" height="22" rx="2" />
          </g>

          {/* Right Main Skyscraper (Towering Glass Skyscraper) */}
          <rect x="495" y="10" width="120" height="310" fill="#2E8BC0" rx="5" />
          <rect x="530" y="-10" width="50" height="25" fill="#F4D160" rx="2" />
          <line x1="555" y1="-30" x2="555" y2="-10" stroke="#F4D160" strokeWidth="4" />
          {/* Windows Right Tower */}
          <g fill="#FFEAA7" opacity="0.85">
            <rect x="510" y="25" width="14" height="22" rx="2" />
            <rect x="530" y="25" width="14" height="22" rx="2" />
            <rect x="550" y="25" width="14" height="22" rx="2" />
            <rect x="570" y="25" width="14" height="22" rx="2" />
            <rect x="510" y="55" width="14" height="22" rx="2" />
            <rect x="550" y="55" width="14" height="22" rx="2" />
            <rect x="530" y="85" width="14" height="22" rx="2" />
            <rect x="570" y="85" width="14" height="22" rx="2" />
          </g>
        </svg>
      </div>

      {/* 4. Perspective Cobblestone Boulevard Promenade Walkway */}
      <div className="absolute bottom-0 inset-x-0 h-64">
        <svg viewBox="0 0 600 240" preserveAspectRatio="none" className="w-full h-full">
          {/* Pavement Gradient Base */}
          <polygon points="170,0 430,0 600,240 0,240" fill="#E2E8F0" />
          <polygon points="190,0 410,0 560,240 40,240" fill="#F1F5F9" />

          {/* Stone Tile Perspective Lines */}
          <g stroke="#CBD5E1" strokeWidth="1.2" opacity="0.75">
            <line x1="190" y1="0" x2="40" y2="240" />
            <line x1="240" y1="0" x2="160" y2="240" />
            <line x1="300" y1="0" x2="300" y2="240" />
            <line x1="360" y1="0" x2="440" y2="240" />
            <line x1="410" y1="0" x2="560" y2="240" />

            {/* Horizontal Tile Seams */}
            <line x1="175" y1="30" x2="425" y2="30" />
            <line x1="155" y1="70" x2="445" y2="70" />
            <line x1="125" y1="120" x2="475" y2="120" />
            <line x1="85" y1="180" x2="515" y2="180" />
          </g>
        </svg>
      </div>

      {/* 5. Lush Side Trees & Greenery Canopies */}
      {/* Left Tree Cluster */}
      <div className="absolute top-28 -left-12 w-48 h-96">
        <svg viewBox="0 0 160 320" fill="none" className="w-full h-full">
          {/* Tree Trunk */}
          <path d="M40 320 Q55 240 60 160" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
          {/* Foliage Watercolor Blobs */}
          <circle cx="65" cy="80" r="55" fill="#4D7C0F" opacity="0.9" />
          <circle cx="95" cy="110" r="45" fill="#65A30D" />
          <circle cx="45" cy="130" r="40" fill="#84CC16" />
          <circle cx="75" cy="150" r="42" fill="#A3E635" opacity="0.85" />
        </svg>
      </div>

      {/* Right Tree Cluster */}
      <div className="absolute top-28 -right-12 w-48 h-96">
        <svg viewBox="0 0 160 320" fill="none" className="w-full h-full">
          {/* Tree Trunk */}
          <path d="M120 320 Q105 240 100 160" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
          {/* Foliage Watercolor Blobs */}
          <circle cx="95" cy="80" r="55" fill="#4D7C0F" opacity="0.9" />
          <circle cx="65" cy="110" r="45" fill="#65A30D" />
          <circle cx="115" cy="130" r="40" fill="#84CC16" />
          <circle cx="85" cy="150" r="42" fill="#A3E635" opacity="0.85" />
        </svg>
      </div>

      {/* 6. Authentic Victorian Park Street Lamps with Glowing Lanterns */}
      {/* Left Lamp Post */}
      <div className="absolute bottom-28 left-6 sm:left-12 z-10">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <VintageStreetLamp className="w-7 h-48" isGlowing={true} />
        </motion.div>
      </div>

      {/* Right Lamp Post */}
      <div className="absolute bottom-28 right-6 sm:right-12 z-10">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
        >
          <VintageStreetLamp className="w-7 h-48" isGlowing={true} />
        </motion.div>
      </div>

      {/* 7. Foreground Shrubbery / Bushes */}
      <div className="absolute bottom-4 left-0 pointer-events-none">
        <ParkBushes className="w-32 h-20 opacity-95" />
      </div>
      <div className="absolute bottom-4 right-0 pointer-events-none transform scale-x-[-1]">
        <ParkBushes className="w-32 h-20 opacity-95" />
      </div>
    </div>
  );
}
