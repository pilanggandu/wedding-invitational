"use client";

import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  BotanicalLeaves,
  KidsDrawingHeart,
  KidsDrawingStar,
  PaperStamp,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";
import { SectionMotion } from "./SectionMotion";
import { ItemMotion } from "./ItemMotion";
import { getFontFamilyCss } from "@/lib/typography";
import { CharMotionReveal } from "./CharMotionReveal";

export function FooterSection() {
  const data = useWeddingData();
  const { general, couple } = data;
  const families = [couple.groom?.parents, couple.bride?.parents].filter(Boolean);

  return (
    <SectionMotion id="penutup" className="relative pt-12 pb-28 sm:pb-20 bg-[#FFF0F3] overflow-hidden text-center paper-texture">
      {/* Decorative Accents */}
      <BotanicalLeaves className="absolute -bottom-8 -left-8 w-44 h-60 opacity-25 rotate-45 pointer-events-none" />
      <BotanicalLeaves className="absolute -bottom-8 -right-8 w-44 h-60 opacity-25 -rotate-45 pointer-events-none" />
      <ItemMotion
        variant="pop"
        float={true}
        floatDistance={3}
        floatDuration={4}
        className="absolute bottom-6 right-6 pointer-events-none opacity-80"
      >
        <KidsDrawingStar className="w-10 h-10 text-[#FFE58F]" />
      </ItemMotion>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="paper-unfold">
          <div className="crayon-box p-8 sm:p-10 relative bg-white border-[#660F1A]">
            {/* Postmark stamp in corner */}
            <ItemMotion
              variant="stamp"
              float={true}
              floatDistance={3}
              floatDuration={4}
              className="absolute top-4 right-4 hidden sm:block"
            >
              <PaperStamp text="RESMI SAH" date="28 • 11 • 2026" />
            </ItemMotion>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-script font-bold bg-[#FFF0F3] text-[#7D1128] border-2 border-[#7D1128] mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D63D56]" />
              Terima Kasih Banyak!
              <Sparkles className="w-3.5 h-3.5 text-[#D63D56]" />
            </span>

            <p className="text-xs sm:text-sm font-sans text-[#7D1128] leading-relaxed max-w-lg mx-auto mb-6">
              {general.closingMessage}
            </p>

            {families.length > 0 && <>
              <p className="font-script text-lg text-[#9E2A3B] mb-2 font-bold">
                Keluarga Besar
              </p>
              <p className="font-sans text-xs sm:text-sm font-bold text-[#4A0812] mb-6">
                {families.join(" & ")}
              </p>
            </>}

            {/* Couple Signatures in handwriting font with maroon shimmer */}
            <div className="my-5">
              <h3
                style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
                className="font-couple-title font-handwriting text-3xl min-[380px]:text-4xl sm:text-6xl maroon-shimmer-text tracking-wide"
              >
                <CharMotionReveal text={couple.groom?.name || "Gilang"} baseDelay={0.2} />{" "}
                <span className="font-script text-2xl min-[380px]:text-3xl sm:text-4xl text-[#7D1128]">&</span>{" "}
                <CharMotionReveal text={couple.bride?.name || "Salsadila"} baseDelay={0.45} />
              </h3>
              <span className="inline-block mt-2 text-xs font-mono font-bold tracking-widest text-[#4A0812] bg-[#FFE58F] px-3.5 py-1 rounded-full border-1.5 border-[#4A0812] rotate-[-1deg] shadow-xs">
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
    </SectionMotion>
  );
}
