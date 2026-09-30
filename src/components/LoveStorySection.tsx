"use client";

import React from "react";
import { Sparkles, Heart } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import {
  PhotoPlaceholder,
  BotanicalLeaves,
  KidsDrawingHeart,
  KidsDrawingStar,
  TornPaperDivider,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function LoveStorySection() {
  const { stories } = WEDDING_DATA;

  return (
    <section id="cerita" className="relative py-16 bg-[#FFF0F3] overflow-hidden paper-texture">
      {/* Decorative Accents */}
      <BotanicalLeaves className="absolute top-1/3 -left-8 w-40 h-60 opacity-25 rotate-45 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-2 pointer-events-none opacity-75">
        <KidsDrawingHeart className="w-9 h-9" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="font-script text-2xl text-[#B3394B] font-bold block mb-1">
              Dari Orang Asing Jadi Belahan Jiwa 📖
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#660F1A] mb-2">
              Kisah Cinta Kami
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#7D1128]">
              Perjalanan absurd tapi romantis yang membawa kami berdua sampai ke pelaminan:
            </p>
          </div>
        </MotionReveal>

        {/* Scrapbook Timeline */}
        <div className="relative">
          {/* Central Dashed Thread Line in Maroon */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-1 border-l-2 border-dashed border-[#8A1C2C]/50 -translate-x-1/2 hidden sm:block" />

          <div className="space-y-12 sm:space-y-16">
            {stories.map((story, index) => {
              const isEven = index % 2 === 0;

              return (
                <MotionReveal
                  key={story.year}
                  variant={isEven ? "slide-left" : "slide-right"}
                  delay={0.15 * (index + 1)}
                >
                  <div
                    className={`flex flex-col sm:flex-row items-center gap-6 sm:gap-10 ${
                      isEven ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Childlike Photo Drawing Placeholder Card */}
                    <div className="w-full sm:w-1/2 flex justify-center">
                      <PhotoPlaceholder
                        variant={index === 0 ? "landscape" : index === 1 ? "boba" : index === 2 ? "rings" : "couple"}
                        caption={story.photoCaption}
                        tag={`BAB 0${index + 1}`}
                        stickerText={story.year}
                        tapePosition={isEven ? "top-right" : "top-left"}
                        tiltAngle={isEven ? "right" : "left"}
                        className="max-w-[260px] sm:max-w-[280px]"
                      />
                    </div>

                    {/* Text Note Scrapbook Card */}
                    <div className="w-full sm:w-1/2">
                      <div className="crayon-box p-6 sm:p-7 relative bg-white border-[#660F1A] transform transition-transform duration-300 hover:-translate-y-1">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b-2 border-dashed border-[#8A1C2C]/30 pb-2 mb-3">
                          <span className="font-script text-3xl font-bold text-[#660F1A] tracking-wide">
                            Tahun {story.year}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#7D1128] bg-[#FFF0F3] px-3 py-0.5 rounded-full border border-[#D63D56]/50">
                            <Heart className="w-3 h-3 text-[#D63D56] fill-current animate-pulse" />
                            Episode {index + 1}
                          </span>
                        </div>

                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#4A0812] mb-2">
                          {story.title}
                        </h3>

                        <p className="text-xs sm:text-sm font-sans text-[#5A0B17] leading-relaxed mb-4">
                          {story.story}
                        </p>

                        {/* Childlike Reaction Badge */}
                        <div className="bg-[#FFE58F] text-[#4A0812] text-xs font-script font-bold p-2.5 rounded-xl border border-[#4A0812] inline-block rotate-[-1deg] shadow-xs">
                          {story.cuteReaction}
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FFF9FA" />
      </div>
    </section>
  );
}
