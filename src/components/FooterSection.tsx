"use client";

import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import { BotanicalLeaves, PaperStamp } from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function FooterSection() {
  const { general, couple } = WEDDING_DATA;

  return (
    <footer className="relative pt-12 pb-28 sm:pb-20 bg-[#F4EFE6] overflow-hidden text-center">
      {/* Decorative leaf cutouts with swaying breeze */}
      <BotanicalLeaves className="absolute -bottom-8 -left-8 w-44 h-60 opacity-25 rotate-45 pointer-events-none" />
      <BotanicalLeaves className="absolute -bottom-8 -right-8 w-44 h-60 opacity-25 -rotate-45 pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="paper-unfold">
          <div className="paper-sheet rounded-2xl p-8 sm:p-10 border border-[#DECBB4] shadow-md relative">
            {/* Postmark stamp in corner */}
            <div className="absolute top-4 right-4 hidden sm:block">
              <PaperStamp text="WITH LOVE" date="12 • 12 • 2026" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-medium uppercase tracking-wider bg-[#F5EDE1] text-[#9A5B46] mb-4">
              <Sparkles className="w-3 h-3 text-[#C26D53]" />
              Terima Kasih
              <Sparkles className="w-3 h-3 text-[#C26D53]" />
            </span>

            <p className="text-xs sm:text-sm font-sans text-[#6B5746] leading-relaxed max-w-lg mx-auto mb-6">
              {general.closingMessage}
            </p>

            <p className="font-serif italic text-xs text-[#8E7864] mb-4">
              Kami yang berbahagia,
            </p>

            <p className="font-sans text-xs sm:text-sm font-semibold text-[#44362A] mb-1">
              Keluarga Besar {couple.groom.parents}
            </p>
            <p className="font-sans text-xs sm:text-sm font-semibold text-[#44362A] mb-6">
              & Keluarga Besar {couple.bride.parents}
            </p>

            {/* Couple Signatures in handwriting font with gold foil shimmer */}
            <div className="my-6">
              <h3 className="font-handwriting text-5xl sm:text-6xl gold-foil-text tracking-wide">
                Dimas <span className="font-script text-3xl sm:text-4xl text-[#C26D53]">&</span> Sarah
              </h3>
              <span className="inline-block mt-2 text-xs font-mono tracking-widest text-[#8F7C6B] bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#E0D0BD]">
                {general.hashtag}
              </span>
            </div>

            <div className="pt-6 border-t border-[#E8D9C5] flex items-center justify-center gap-1 text-[11px] font-sans text-[#968474]">
              <span>Dibuat dengan</span>
              <Heart className="w-3 h-3 text-[#C26D53] fill-current animate-pulse" />
              <span>Digital Wedding Invitation</span>
            </div>
          </div>
        </MotionReveal>
      </div>
    </footer>
  );
}
