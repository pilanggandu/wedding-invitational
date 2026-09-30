"use client";

import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import {
  KidsDrawingHeart,
  KidsDrawingStar,
  KidsDrawingSun,
  PaperStamp,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function FooterSection() {
  const { general, couple } = WEDDING_DATA;

  return (
    <footer className="relative pt-12 pb-28 sm:pb-20 bg-[#FEF9E7] overflow-hidden text-center paper-texture">
      {/* Decorative Doodles */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-80">
        <KidsDrawingSun className="w-14 h-14" />
      </div>
      <div className="absolute bottom-6 right-6 pointer-events-none opacity-80">
        <KidsDrawingStar className="w-10 h-10 text-[#FBBF24]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="paper-unfold">
          <div className="crayon-box p-8 sm:p-10 relative bg-white">
            {/* Postmark stamp in corner */}
            <div className="absolute top-4 right-4 hidden sm:block">
              <PaperStamp text="RESMI SAH" date="12 • 12 • 2026" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-script font-bold bg-[#FEF08A] text-[#222222] border-2 border-[#222222] mb-4 shadow-[2px_2px_0px_#222222]">
              <Sparkles className="w-3.5 h-3.5 text-[#EF4444]" />
              Terima Kasih Banyak!
              <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
            </span>

            <p className="text-xs sm:text-sm font-sans text-[#4B5563] leading-relaxed max-w-lg mx-auto mb-6">
              {general.closingMessage}
            </p>

            <p className="font-script text-lg text-[#222222] mb-2 font-bold">
              Keluarga Besar Paling Bahagia:
            </p>

            <p className="font-sans text-xs sm:text-sm font-bold text-[#111827] mb-1">
              Keluarga Besar {couple.groom.parents}
            </p>
            <p className="font-sans text-xs sm:text-sm font-bold text-[#111827] mb-6">
              & Keluarga Besar {couple.bride.parents}
            </p>

            {/* Couple Signatures in handwriting font with rainbow shimmer */}
            <div className="my-5">
              <h3 className="font-handwriting text-5xl sm:text-6xl rainbow-shimmer-text tracking-wide">
                Dimas <span className="font-script text-3xl sm:text-4xl text-[#EF4444]">&</span> Sarah
              </h3>
              <span className="inline-block mt-2 text-xs font-mono font-bold tracking-widest text-[#222222] bg-[#FEF08A] px-3.5 py-1 rounded-full border-2 border-[#222222] rotate-[-1deg] shadow-[2px_2px_0px_#222222]">
                {general.hashtag}
              </span>
            </div>

            <div className="pt-5 border-t-2 border-dashed border-[#222222]/20 flex items-center justify-center gap-1.5 text-xs font-script font-bold text-[#374151]">
              <span>Dibuat dengan segenap cinta & tawa</span>
              <Heart className="w-3.5 h-3.5 text-[#EF4444] fill-current animate-pulse" />
              <span>Wedding Drawing Art</span>
            </div>
          </div>
        </MotionReveal>
      </div>
    </footer>
  );
}
