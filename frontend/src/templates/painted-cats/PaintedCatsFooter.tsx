"use client";

import React from "react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  DoodleCatCoupleSticker,
  DoodlePawSticker,
  DoodleHeartSticker,
  BrushStrokeDivider,
  WashiTape,
} from "./PaintedDecorations";

export function PaintedCatsFooter() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <footer className="relative pt-12 pb-24 px-6 text-center text-[#2C2623] overflow-hidden border-t border-[#E8D9CB] bg-white/50">
      <div className="max-w-md mx-auto space-y-6">
        {/* Cute Couple Cat Sticker */}
        <div className="flex justify-center">
          <DoodleCatCoupleSticker className="w-40 h-36 mx-auto" rotate={-1} />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-[#5C4A3E] leading-relaxed max-w-xs mx-auto">
            {data.general?.closingMessage ||
              "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami."}
          </p>
        </div>

        <BrushStrokeDivider />

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A17] block">
            Kami Yang Berbahagia
          </span>
          <h2
            style={{ fontFamily: "var(--font-couple-custom, serif)" }}
            className="text-2xl sm:text-3xl font-bold text-[#2C2623] tracking-tight"
          >
            {groom?.name} &amp; {bride?.name}
          </h2>
          {data.general?.hashtag && (
            <span className="text-xs font-mono text-[#D97736] block pt-1 font-semibold">
              {data.general.hashtag}
            </span>
          )}
        </div>

        <div className="pt-6 text-[11px] font-sans text-[#8C6D58] space-y-1">
          <p>Dibuat dengan cinta untuk pernikahan kami</p>
          <p className="font-mono text-[10px] text-[#A07855]">
            Cute Doodle Cat Sticker Edition
          </p>
        </div>
      </div>
    </footer>
  );
}
