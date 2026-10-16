"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  DoodleOrangeCatGroomSticker,
  DoodleWhiteCatBrideSticker,
  DoodlePawSticker,
  DoodleHeartSticker,
  WashiTape,
  BrushStrokeDivider,
  DieCutArtSticker,
} from "./PaintedDecorations";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function PaintedCatsCouple() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <section id="couple" className="relative py-16 px-6 text-center text-[#2C2623] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-1.5">
            <DoodlePawSticker className="w-4 h-4 text-[#D97736]" color="#D97736" rotate={-10} />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A17]">
              Mempelai Yang Berbahagia
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2623]">
            Kedua Mempelai
          </h2>
          <p className="text-xs text-[#7A6150] max-w-xs mx-auto leading-relaxed">
            {data.general?.openingMessage ||
              "Dengan memohon ridho dan keberkahan, kami mengundang kehadiran Bapak/Ibu/Saudara/i untuk merayakan momen suci kami."}
          </p>
        </motion.div>

        {/* Groom Card (Asymmetric Tilt -1.5deg) */}
        <motion.div
          initial={{ opacity: 0, y: 25, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border-2 border-[#EAD8C7] shadow-[0_15px_35px_rgba(200,90,23,0.12)] space-y-4 text-center relative overflow-visible transform -rotate-1.5"
        >
          {/* Washi tape at top right */}
          <div className="absolute -top-2.5 right-6 z-30">
            <WashiTape color="butter" angle={4} className="w-24 text-[8px]" />
          </div>

          {/* Cat Paw Stamp in corner */}
          <div className="absolute top-3 left-4 opacity-40">
            <DoodlePawSticker className="w-5 h-5 text-[#D97736]" color="#D97736" rotate={-15} />
          </div>

          {/* Photo & Cat Duo Showcase */}
          <div className="pt-2 relative flex justify-center">
            {groom?.photoUrl ? (
              <div className="relative inline-block">
                <DieCutArtSticker
                  src={groom.photoUrl}
                  alt={groom?.fullName || "Groom"}
                  badgeText="The Groom"
                  rotate={-1}
                  className="w-48 h-56 mx-auto"
                />
                {/* Perched Orange Cat on corner of photo */}
                <div className="absolute -top-6 -right-6 z-20 w-16 h-16 pointer-events-none drop-shadow-md">
                  <DoodleOrangeCatGroomSticker className="w-full h-full" rotate={12} />
                </div>
              </div>
            ) : (
              <DoodleOrangeCatGroomSticker className="w-48 h-56 mx-auto" rotate={-2} />
            )}
          </div>

          <div className="space-y-1">
            <h3
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-2xl font-bold text-[#2C2623] tracking-tight"
            >
              {groom?.name}
            </h3>
            <p className="text-sm font-serif text-[#C85A17] font-medium">
              {groom?.fullName || groom?.name}
            </p>
          </div>

          {groom?.parents && (
            <p className="text-xs text-[#5C4A3E] leading-relaxed font-sans px-2">
              {groom.parents}
            </p>
          )}

          {groom?.instagram && (
            <div className="pt-1">
              <a
                href={`https://instagram.com/${groom.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6EE] hover:bg-[#F3E8DB] border border-[#E8D9CB] text-xs text-[#C85A17] transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@{groom.instagram.replace("@", "")}</span>
              </a>
            </div>
          )}
        </motion.div>

        {/* Center Ampersand Connector with Doodle Heart & Paw */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2"
        >
          <DoodleHeartSticker className="w-6 h-6" rotate={-10} />
          <div className="w-12 h-12 rounded-full bg-white border-2 border-[#D97736] flex items-center justify-center font-serif text-xl font-bold text-[#D97736] shadow-sm">
            &amp;
          </div>
          <DoodlePawSticker className="w-6 h-6" color="#D97736" rotate={10} />
        </motion.div>

        {/* Bride Card (Asymmetric Tilt +1.8deg) */}
        <motion.div
          initial={{ opacity: 0, y: 25, rotate: 3 }}
          whileInView={{ opacity: 1, y: 0, rotate: 1.8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border-2 border-[#EAD8C7] shadow-[0_15px_35px_rgba(200,90,23,0.12)] space-y-4 text-center relative overflow-visible transform rotate-1.8"
        >
          {/* Washi tape at top left */}
          <div className="absolute -top-2.5 left-6 z-30">
            <WashiTape color="rose" angle={-4} className="w-24 text-[8px]" />
          </div>

          {/* Cat Paw Stamp in corner */}
          <div className="absolute top-3 right-4 opacity-40">
            <DoodlePawSticker className="w-5 h-5 text-[#D97736]" color="#D97736" rotate={15} />
          </div>

          {/* Photo & Cat Duo Showcase */}
          <div className="pt-2 relative flex justify-center">
            {bride?.photoUrl ? (
              <div className="relative inline-block">
                <DieCutArtSticker
                  src={bride.photoUrl}
                  alt={bride?.fullName || "Bride"}
                  badgeText="The Bride"
                  rotate={1.5}
                  className="w-48 h-56 mx-auto"
                />
                {/* Perched White Cat on corner of photo */}
                <div className="absolute -top-6 -left-6 z-20 w-16 h-16 pointer-events-none drop-shadow-md">
                  <DoodleWhiteCatBrideSticker className="w-full h-full" rotate={-10} />
                </div>
              </div>
            ) : (
              <DoodleWhiteCatBrideSticker className="w-48 h-56 mx-auto" rotate={2} />
            )}
          </div>

          <div className="space-y-1">
            <h3
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-2xl font-bold text-[#2C2623] tracking-tight"
            >
              {bride?.name}
            </h3>
            <p className="text-sm font-serif text-[#C85A17] font-medium">
              {bride?.fullName || bride?.name}
            </p>
          </div>

          {bride?.parents && (
            <p className="text-xs text-[#5C4A3E] leading-relaxed font-sans px-2">
              {bride.parents}
            </p>
          )}

          {bride?.instagram && (
            <div className="pt-1">
              <a
                href={`https://instagram.com/${bride.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6EE] hover:bg-[#F3E8DB] border border-[#E8D9CB] text-xs text-[#C85A17] transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@{bride.instagram.replace("@", "")}</span>
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
