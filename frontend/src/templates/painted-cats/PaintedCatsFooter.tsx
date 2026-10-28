"use client";

import React from "react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  DoodleCatCoupleSticker,
  BrushStrokeDivider,
} from "./PaintedDecorations";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

export function PaintedCatsFooter() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <SectionMotion id="closing" className="relative pt-12 pb-28 px-6 text-center text-[#38241B] overflow-hidden border-t border-[#F3DFD1] bg-white/60">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <ItemMotion variant="stamp" float={true} floatDistance={6} floatDuration={3.6} rotate={-1}>
            <DoodleCatCoupleSticker className="w-44 h-40 mx-auto drop-shadow-md" rotate={-1} />
          </ItemMotion>
        </div>

        <ItemMotion variant="fade" delay={0.1} className="space-y-2">
          <p className="text-xs text-[#6E5345] leading-relaxed max-w-xs mx-auto">
            {data.general?.closingMessage ||
              "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami."}
          </p>
        </ItemMotion>

        <BrushStrokeDivider />

        <ItemMotion variant="slide-up" delay={0.16} className="space-y-1">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-sans font-bold bg-[#FFF4EC] text-[#DF7B54] border border-[#FCD5CE] inline-block mb-1">
            Kami Yang Berbahagia
          </span>
          <h2
            style={{ fontFamily: "var(--font-couple-custom, serif)" }}
            className="text-2xl sm:text-3xl font-bold text-[#38241B] tracking-tight"
          >
            {groom?.name} &amp; {bride?.name}
          </h2>
          {data.general?.hashtag && (
            <ItemMotion variant="pop" delay={0.24}>
              <span className="text-xs font-sans text-[#DF7B54] block pt-1 font-bold">
                {data.general.hashtag}
              </span>
            </ItemMotion>
          )}
        </ItemMotion>

        <div className="pt-6 text-[11px] font-sans text-[#8C6D58] space-y-1">
          <p>Dibuat dengan cinta untuk pernikahan kami</p>
          <p className="font-sans text-[10px] text-[#A07855]">
            Cute Chibi Cat Scrapbook Edition
          </p>
        </div>
      </div>
    </SectionMotion>
  );
}

