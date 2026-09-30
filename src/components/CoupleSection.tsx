"use client";

import React from "react";
import { Heart } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import { PhotoPlaceholder, BotanicalLeaves, TornPaperDivider } from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

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

export function CoupleSection() {
  const { groom, bride } = WEDDING_DATA.couple;
  const { quote, openingGreetings, openingMessage } = WEDDING_DATA.general;

  return (
    <section id="mempelai" className="relative py-16 bg-[#F4EFE6] overflow-hidden">
      {/* Decorative leaf cutouts with organic sway */}
      <BotanicalLeaves className="absolute top-10 -right-6 w-36 sm:w-48 h-56 opacity-35 -rotate-12 pointer-events-none" />
      <BotanicalLeaves className="absolute bottom-10 -left-6 w-36 sm:w-48 h-56 opacity-35 rotate-45 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Holy Verse Paper Scroll */}
        <MotionReveal variant="paper-unfold" delay={0.1}>
          <div className="paper-sheet rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto text-center border border-[#DECBB4] mb-16 shadow-md">
            <div className="w-10 h-10 mx-auto -mt-10 mb-3 rounded-full bg-[#A85A42] text-[#FEE8E1] flex items-center justify-center shadow-md animate-gentle-pulse">
              <Heart className="w-5 h-5 fill-current" />
            </div>

            <p className="font-serif text-lg sm:text-xl text-[#3A3027] leading-relaxed mb-4 font-medium" dir="rtl">
              {quote.arabic}
            </p>

            <p className="font-serif italic text-xs sm:text-sm text-[#665444] leading-relaxed mb-3">
              &ldquo;{quote.translation}&rdquo;
            </p>

            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#947358]">
              {quote.source}
            </span>
          </div>
        </MotionReveal>

        {/* Greetings Section */}
        <MotionReveal variant="fade-up" delay={0.2}>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-script text-3xl sm:text-4xl text-[#A85A42] mb-2">
              Kedua Mempelai
            </h2>
            <p className="font-serif text-base sm:text-lg text-[#352B24] font-medium mb-2">
              {openingGreetings}
            </p>
            <p className="text-xs sm:text-sm font-sans text-[#786452] leading-relaxed">
              {openingMessage}
            </p>
          </div>
        </MotionReveal>

        {/* Bride & Groom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-8 items-center max-w-3xl mx-auto">
          {/* Groom Profile */}
          <MotionReveal variant="slide-left" delay={0.3} className="w-full">
            <div className="flex flex-col items-center text-center">
              <PhotoPlaceholder
                variant="groom"
                caption="Dimas Arya Pratama"
                tag="THE GROOM"
                tapePosition="top-left"
                tiltAngle="left"
                className="w-full max-w-[260px] mb-4"
              />

              <h3 className="font-handwriting text-4xl sm:text-5xl text-[#352B24] mt-2 mb-1">
                {groom.name}
              </h3>
              <p className="font-serif font-bold text-sm sm:text-base text-[#564536] tracking-wide mb-1">
                {groom.fullName}
              </p>
              <p className="text-xs font-sans text-[#8C7A69] mb-1 italic">
                {groom.tagline}
              </p>
              <p className="text-xs sm:text-sm font-sans text-[#614F3F] mb-4 max-w-xs">
                {groom.parents}
              </p>

              <a
                href={`https://instagram.com/${groom.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans text-[#5A4B3E] bg-[#FFFDF9] hover:text-[#A85A42] border border-[#DECBB4] shadow-xs transition-colors hover:scale-105"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#C26D53]" />
                @{groom.instagram}
              </a>
            </div>
          </MotionReveal>

          {/* Bride Profile */}
          <MotionReveal variant="slide-right" delay={0.4} className="w-full">
            <div className="flex flex-col items-center text-center">
              <PhotoPlaceholder
                variant="bride"
                caption="Sarah Annisa Larasati"
                tag="THE BRIDE"
                tapePosition="top-right"
                tiltAngle="right"
                className="w-full max-w-[260px] mb-4"
              />

              <h3 className="font-handwriting text-4xl sm:text-5xl text-[#352B24] mt-2 mb-1">
                {bride.name}
              </h3>
              <p className="font-serif font-bold text-sm sm:text-base text-[#564536] tracking-wide mb-1">
                {bride.fullName}
              </p>
              <p className="text-xs font-sans text-[#8C7A69] mb-1 italic">
                {bride.tagline}
              </p>
              <p className="text-xs sm:text-sm font-sans text-[#614F3F] mb-4 max-w-xs">
                {bride.parents}
              </p>

              <a
                href={`https://instagram.com/${bride.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans text-[#5A4B3E] bg-[#FFFDF9] hover:text-[#A85A42] border border-[#DECBB4] shadow-xs transition-colors hover:scale-105"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#C26D53]" />
                @{bride.instagram}
              </a>
            </div>
          </MotionReveal>
        </div>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FAF6EE" />
      </div>
    </section>
  );
}
