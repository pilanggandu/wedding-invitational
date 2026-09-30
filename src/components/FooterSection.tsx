"use client";

import React from "react";
import { Heart, Sparkles, Smile } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import { BotanicalLeaves, PaperStamp } from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function FooterSection() {
  const { general, couple } = WEDDING_DATA;

  return (
    <footer className="relative pt-12 pb-28 sm:pb-20 bg-[#FFF0F3] overflow-hidden text-center">
      {/* Decorative leaf cutouts with swaying breeze */}
      <BotanicalLeaves className="absolute -bottom-8 -left-8 w-44 h-60 opacity-25 rotate-45 pointer-events-none" />
      <BotanicalLeaves className="absolute -bottom-8 -right-8 w-44 h-60 opacity-25 -rotate-45 pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="paper-unfold">
          <div className="doodle-box p-8 sm:p-10 relative bg-white">
            {/* Postmark stamp in corner */}
            <div className="absolute top-4 right-4 hidden sm:block">
              <PaperStamp text="OFFICIALLY SAH" date="12 • 12 • 2026" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-script font-bold bg-[#FFF0F3] text-[#7D1128] border-2 border-[#7D1128] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D63D56]" />
              Terima Kasih Banyak!
              <Sparkles className="w-3.5 h-3.5 text-[#D63D56]" />
            </span>

            <p className="text-xs sm:text-sm font-sans text-[#7D1128] leading-relaxed max-w-lg mx-auto mb-6">
              {general.closingMessage}
            </p>

            <p className="font-script text-lg text-[#9E2A3B] mb-2 font-bold">
              Keluarga Besar Paling Bahagia:
            </p>

            <p className="font-sans text-xs sm:text-sm font-bold text-[#4A0812] mb-1">
              Keluarga Besar {couple.groom.parents}
            </p>
            <p className="font-sans text-xs sm:text-sm font-bold text-[#4A0812] mb-6">
              & Keluarga Besar {couple.bride.parents}
            </p>

            {/* Couple Signatures in handwriting font with maroon shimmer */}
            <div className="my-5">
              <h3 className="font-handwriting text-5xl sm:text-6xl maroon-shimmer-text tracking-wide">
                Dimas <span className="font-script text-3xl sm:text-4xl text-[#7D1128]">&</span> Sarah
              </h3>
              <span className="inline-block mt-2 text-xs font-mono font-bold tracking-widest text-[#7D1128] bg-[#FFE58F] px-3.5 py-1 rounded-full border-1.5 border-[#4A0812] rotate-[-1deg]">
                {general.hashtag}
              </span>
            </div>

            <div className="pt-5 border-t-2 border-dashed border-[#8A1C2C]/30 flex items-center justify-center gap-1.5 text-xs font-script font-bold text-[#7D1128]">
              <span>Dibuat dengan segenap cinta & tawa</span>
              <Heart className="w-3.5 h-3.5 text-[#D63D56] fill-current animate-pulse" />
              <span>Wedding Drawing Art</span>
            </div>
          </div>
        </MotionReveal>
      </div>
    </footer>
  );
}
