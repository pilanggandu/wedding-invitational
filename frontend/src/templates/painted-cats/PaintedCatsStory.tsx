"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import { DoodlePawSticker } from "./PaintedDecorations";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

export function PaintedCatsStory() {
  const data = useWeddingData();
  const stories = data.stories || [];

  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <SectionMotion id="story" className="relative py-16 px-6 text-center text-[#38241B] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        <ItemMotion variant="slide-down" delay={0.06} className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF4EC] border border-[#FCD5CE] text-[11px] font-sans font-bold text-[#DF7B54] mx-auto shadow-2xs">
            <ItemMotion float={true} floatDistance={3} floatDuration={3}>
              <DoodlePawSticker className="w-3.5 h-3.5" rotate={0} />
            </ItemMotion>
            <span>Jejak Langkah Cerita</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#38241B]">
            Kisah Perjalanan Kami
          </h2>
          <p className="text-xs text-[#6E5345] max-w-xs mx-auto leading-relaxed">
            Setiap langkah kecil yang kami lalui bersama telah menuntun kami pada takdir bahagia ini.
          </p>
        </ItemMotion>

        <div className="relative pl-6 sm:pl-8 space-y-8 text-left border-l-2 border-[#DF7B54]/30 ml-4 sm:ml-6">
          {stories.map((story, idx) => (
            <div key={idx} className="relative space-y-2">
              <ItemMotion
                variant="pop"
                delay={idx * 0.12}
                float={true}
                floatDistance={3}
                floatDuration={3.2}
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full bg-white border-2 border-[#DF7B54] flex items-center justify-center shadow-xs z-10"
              >
                <DoodlePawSticker className="w-4 h-4" rotate={idx % 2 === 0 ? 10 : -10} />
              </ItemMotion>

              <ItemMotion
                variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
                delay={idx * 0.12}
                className="bg-white/95 backdrop-blur-md rounded-[24px] p-5 border-[3px] border-white ring-1 ring-[#F3DFD1] shadow-[0_12px_28px_rgba(222,125,84,0.08)] space-y-2"
              >
                <span className="px-3 py-0.5 rounded-full text-[11px] font-sans font-bold bg-[#FFF4EC] text-[#DF7B54] border border-[#FCD5CE] inline-block">
                  {story.year}
                </span>
                <h3 className="font-serif font-bold text-base text-[#38241B]">
                  {story.title}
                </h3>
                <p className="text-xs text-[#5C4A3E] leading-relaxed font-sans">
                  {story.story}
                </p>
                {story.cuteReaction && (
                  <ItemMotion variant="pop" delay={idx * 0.12 + 0.18}>
                    <p className="text-[11px] font-sans font-medium text-[#DF7B54] italic pt-1 bg-[#FFF9F5] px-2.5 py-1 rounded-xl border border-[#FCEADE] inline-block">
                      &ldquo;{story.cuteReaction}&rdquo;
                    </p>
                  </ItemMotion>
                )}
              </ItemMotion>
            </div>
          ))}
        </div>
      </div>
    </SectionMotion>
  );
}

