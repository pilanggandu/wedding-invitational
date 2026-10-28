"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  DoodleWhiteCatGroomSticker,
  DoodleOrangeCatBrideSticker,
  DoodlePawSticker,
  DoodleHeartSticker,
  WashiTape,
  BrushStrokeDivider,
  DieCutArtSticker,
} from "./PaintedDecorations";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

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
    <SectionMotion id="couple" className="relative py-16 px-6 text-center text-[#38241B] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#F3DFD1] shadow-2xs">
            <DoodlePawSticker className="w-3.5 h-3.5" rotate={-10} />
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C2633C]">
              Mempelai Yang Berbahagia
            </span>
            <DoodlePawSticker className="w-3.5 h-3.5" rotate={10} />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#38241B]">
            Kedua Mempelai
          </h2>
          <p className="text-xs text-[#6E5345] max-w-xs mx-auto leading-relaxed">
            {data.general?.openingMessage ||
              "Dengan memohon ridho dan keberkahan, kami mengundang kehadiran Bapak/Ibu/Saudara/i untuk merayakan momen suci kami."}
          </p>
        </motion.div>

        {/* Groom Card - Slides in from Left */}
        <ItemMotion
          variant="slide-left"
          delay={0.08}
          rotate={-1.5}
          className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-7 border-[4px] border-white shadow-[0_16px_36px_rgba(222,125,84,0.12)] ring-1 ring-[#F3DFD1] space-y-4 text-center relative overflow-visible transform -rotate-1.5"
        >
          <div className="absolute -top-2.5 right-6 z-30">
            <ItemMotion variant="stamp" delay={0.22}>
              <WashiTape color="butter" angle={4} className="w-24 text-[8px]" />
            </ItemMotion>
          </div>

          <div className="absolute top-3 left-4 opacity-50">
            <DoodlePawSticker className="w-5 h-5" rotate={-15} />
          </div>

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
                <ItemMotion
                  float={true}
                  floatDistance={6}
                  floatDuration={3.2}
                  className="absolute -top-8 -right-8 z-20 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none drop-shadow-md"
                >
                  <DoodleWhiteCatGroomSticker className="w-full h-full" rotate={12} />
                </ItemMotion>
              </div>
            ) : (
              <ItemMotion float={true} floatDistance={6} floatDuration={3.2}>
                <DoodleWhiteCatGroomSticker className="w-48 h-56 mx-auto" rotate={-2} />
              </ItemMotion>
            )}
          </div>

          <div className="space-y-1">
            <h3
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-2xl font-bold text-[#38241B] tracking-tight"
            >
              {groom?.name}
            </h3>
            <p className="text-sm font-serif text-[#C2633C] font-semibold">
              {groom?.fullName || groom?.name}
            </p>
          </div>

          {groom?.parents && (
            <p className="text-xs text-[#6E5345] leading-relaxed font-sans px-2">
              {groom.parents}
            </p>
          )}

          {groom?.instagram && (
            <div className="pt-1">
              <a
                href={`https://instagram.com/${groom.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF4EC] hover:bg-[#FFE8DA] border border-[#FCDCC9] text-xs text-[#C2633C] font-sans font-medium transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@{groom.instagram.replace("@", "")}</span>
              </a>
            </div>
          )}
        </ItemMotion>

        {/* Center Heart Pop Connector */}
        <ItemMotion
          variant="pop"
          delay={0.12}
          className="flex items-center justify-center gap-2"
        >
          <DoodleHeartSticker className="w-6 h-6" rotate={-10} />
          <div className="w-12 h-12 rounded-full bg-white border-2 border-white ring-2 ring-[#F4929D] flex items-center justify-center font-serif text-xl font-bold text-[#E78862] shadow-sm">
            &amp;
          </div>
          <DoodlePawSticker className="w-6 h-6" rotate={10} />
        </ItemMotion>

        {/* Bride Card - Slides in from Right */}
        <ItemMotion
          variant="slide-right"
          delay={0.14}
          rotate={1.5}
          className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-7 border-[4px] border-white shadow-[0_16px_36px_rgba(222,125,84,0.12)] ring-1 ring-[#F3DFD1] space-y-4 text-center relative overflow-visible transform rotate-1.5"
        >
          <div className="absolute -top-2.5 left-6 z-30">
            <ItemMotion variant="stamp" delay={0.24}>
              <WashiTape color="rose" angle={-4} className="w-24 text-[8px]" />
            </ItemMotion>
          </div>

          <div className="absolute top-3 right-4 opacity-50">
            <DoodlePawSticker className="w-5 h-5" rotate={15} />
          </div>

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
                <ItemMotion
                  float={true}
                  floatDistance={6}
                  floatDuration={3.4}
                  className="absolute -top-8 -left-8 z-20 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none drop-shadow-md"
                >
                  <DoodleOrangeCatBrideSticker className="w-full h-full" rotate={-10} />
                </ItemMotion>
              </div>
            ) : (
              <ItemMotion float={true} floatDistance={6} floatDuration={3.4}>
                <DoodleOrangeCatBrideSticker className="w-48 h-56 mx-auto" rotate={2} />
              </ItemMotion>
            )}
          </div>

          <div className="space-y-1">
            <h3
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-2xl font-bold text-[#38241B] tracking-tight"
            >
              {bride?.name}
            </h3>
            <p className="text-sm font-serif text-[#C2633C] font-semibold">
              {bride?.fullName || bride?.name}
            </p>
          </div>

          {bride?.parents && (
            <p className="text-xs text-[#6E5345] leading-relaxed font-sans px-2">
              {bride.parents}
            </p>
          )}

          {bride?.instagram && (
            <div className="pt-1">
              <a
                href={`https://instagram.com/${bride.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF4EC] hover:bg-[#FFE8DA] border border-[#FCDCC9] text-xs text-[#C2633C] font-sans font-medium transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@{bride.instagram.replace("@", "")}</span>
              </a>
            </div>
          )}
        </ItemMotion>
      </div>
    </SectionMotion>
  );
}
