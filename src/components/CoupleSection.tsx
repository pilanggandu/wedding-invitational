"use client";

import React from "react";
import { Heart, Sparkles, Coffee, ShoppingBag } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import {
  PhotoPlaceholder,
  KidsDrawingHeart,
  KidsDrawingStar,
  TornPaperDivider,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function CoupleSection() {
  const { groom, bride } = WEDDING_DATA.couple;
  const { quote, openingGreetings, openingMessage } = WEDDING_DATA.general;

  return (
    <section id="mempelai" className="relative py-16 bg-[#FEF9E7] overflow-hidden paper-texture">
      {/* Playful Floating Doodles */}
      <div className="absolute top-10 -right-2 pointer-events-none opacity-80">
        <KidsDrawingStar className="w-10 h-10 text-[#FBBF24]" />
      </div>
      <div className="absolute bottom-10 -left-2 pointer-events-none opacity-80">
        <KidsDrawingHeart className="w-10 h-10" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Holy Verse Crayon Card */}
        <MotionReveal variant="paper-unfold" delay={0.1}>
          <div className="crayon-box p-6 sm:p-8 max-w-2xl mx-auto text-center mb-16 relative bg-white">
            <div className="w-12 h-12 mx-auto -mt-11 mb-3 rounded-full bg-[#EF4444] text-white flex items-center justify-center border-2 border-[#222222] shadow-[2px_2px_0px_#222222] animate-gentle-pulse">
              <Heart className="w-6 h-6 fill-current text-[#FEF08A]" />
            </div>

            <p className="font-serif text-lg sm:text-xl text-[#222222] leading-relaxed mb-4 font-medium" dir="rtl">
              {quote.arabic}
            </p>

            <p className="font-script text-base sm:text-lg text-[#374151] font-bold leading-relaxed mb-2">
              &ldquo;{quote.translation}&rdquo;
            </p>

            <span className="inline-block bg-[#FEF08A] text-[#222222] px-3.5 py-0.5 rounded-full border-2 border-[#222222] text-[11px] font-mono font-bold tracking-wider shadow-[1px_2px_0px_#222222]">
              {quote.source}
            </span>
          </div>
        </MotionReveal>

        {/* Greetings Section */}
        <MotionReveal variant="fade-up" delay={0.2}>
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="font-script text-2xl text-[#EF4444] font-bold block mb-1">
              Kenalan Dulu Sama Kami! ✌️
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#222222] mb-2">
              Kedua Mempelai
            </h2>
            <p className="font-serif text-base sm:text-lg text-[#1F2937] font-bold mb-2">
              {openingGreetings}
            </p>
            <p className="text-xs sm:text-sm font-sans text-[#4B5563] leading-relaxed">
              {openingMessage}
            </p>
          </div>
        </MotionReveal>

        {/* Bride & Groom Childlike Drawing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-8 items-start max-w-3xl mx-auto">
          {/* Groom Profile */}
          <MotionReveal variant="slide-left" delay={0.3} className="w-full">
            <div className="flex flex-col items-center text-center">
              <PhotoPlaceholder
                variant="groom"
                caption="Dimas Arya Pratama"
                tag="MEMPELAI PRIA"
                stickerText="Calon Suami Idaman! 😎"
                tapePosition="top-left"
                tiltAngle="left"
                className="w-full max-w-[260px] mb-4"
              />

              <div className="crayon-box-blue p-5 w-full bg-white mt-2">
                <h3 className="font-handwriting text-4xl sm:text-5xl text-[#0284C7] mb-0.5">
                  {groom.name}
                </h3>
                <p className="font-mono font-bold text-xs text-[#0369A1] tracking-wider mb-2">
                  {groom.fullName}
                </p>

                <p className="text-xs font-script font-bold text-[#0284C7] text-sm mb-2 bg-[#E0F2FE] py-1.5 px-3 rounded-xl border border-[#BAE6FD]">
                  &ldquo;{groom.tagline}&rdquo;
                </p>

                <p className="text-xs font-sans text-[#374151] mb-3 leading-relaxed">
                  <Coffee className="w-3.5 h-3.5 inline mr-1 text-[#0284C7]" />
                  {groom.bioFunny}
                </p>

                <p className="text-xs font-sans text-[#4B5563] mb-4 border-t-2 border-dashed border-[#BAE6FD] pt-2 italic">
                  Putra tercinta dari: <br />
                  <span className="font-bold not-italic text-[#1F2937]">{groom.parents}</span>
                </p>

                <a
                  href={`https://instagram.com/${groom.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="crayon-button-alt inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                  @{groom.instagram}
                </a>
              </div>
            </div>
          </MotionReveal>

          {/* Bride Profile */}
          <MotionReveal variant="slide-right" delay={0.4} className="w-full">
            <div className="flex flex-col items-center text-center">
              <PhotoPlaceholder
                variant="bride"
                caption="Sarah Annisa Larasati"
                tag="MEMPELAI WANITA"
                stickerText="Tuan Putri Cantik! 👸"
                tapePosition="top-right"
                tiltAngle="right"
                className="w-full max-w-[260px] mb-4"
              />

              <div className="crayon-box-pink p-5 w-full bg-white mt-2">
                <h3 className="font-handwriting text-4xl sm:text-5xl text-[#DB2777] mb-0.5">
                  {bride.name}
                </h3>
                <p className="font-mono font-bold text-xs text-[#BE185D] tracking-wider mb-2">
                  {bride.fullName}
                </p>

                <p className="text-xs font-script font-bold text-[#DB2777] text-sm mb-2 bg-[#FCE7F3] py-1.5 px-3 rounded-xl border border-[#FBCFE8]">
                  &ldquo;{bride.tagline}&rdquo;
                </p>

                <p className="text-xs font-sans text-[#374151] mb-3 leading-relaxed">
                  <ShoppingBag className="w-3.5 h-3.5 inline mr-1 text-[#DB2777]" />
                  {bride.bioFunny}
                </p>

                <p className="text-xs font-sans text-[#4B5563] mb-4 border-t-2 border-dashed border-[#FBCFE8] pt-2 italic">
                  Putri tersayang dari: <br />
                  <span className="font-bold not-italic text-[#1F2937]">{bride.parents}</span>
                </p>

                <a
                  href={`https://instagram.com/${bride.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="crayon-button-alt inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#DB2777]" />
                  @{bride.instagram}
                </a>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FFFDF8" />
      </div>
    </section>
  );
}
