"use client";

import React from "react";
import { Sparkles, Heart } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import { PhotoPlaceholder, BotanicalLeaves, TornPaperDivider } from "./PaperArtDecorations";

export function LoveStorySection() {
  const { stories } = WEDDING_DATA;

  return (
    <section id="cerita" className="relative py-16 bg-[#F4EFE6] overflow-hidden">
      {/* Decorative leaf cutouts */}
      <BotanicalLeaves className="absolute top-1/3 -left-8 w-40 h-60 opacity-30 rotate-45" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="font-serif italic text-xs tracking-widest uppercase text-[#947358] block mb-1">
            Kilas Jejak Kasih
          </span>
          <h2 className="font-handwriting text-5xl sm:text-6xl text-[#3A3027] mb-2">
            Kisah Cinta Kami
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#786452]">
            Sebuah untaian takdir yang mempertemukan dua hati dalam satu ikatan janji suci
          </p>
        </div>

        {/* Scrapbook Timeline */}
        <div className="relative">
          {/* Central Dashed Thread Line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-[#C5B095] -translate-x-1/2 hidden sm:block" />

          <div className="space-y-12 sm:space-y-16">
            {stories.map((story, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={story.year}
                  className={`flex flex-col sm:flex-row items-center gap-6 sm:gap-10 ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Photo Placeholder Card */}
                  <div className="w-full sm:w-1/2 flex justify-center">
                    <PhotoPlaceholder
                      variant={index === 0 ? "landscape" : index === 1 ? "couple" : index === 2 ? "rings" : "bride"}
                      caption={story.photoCaption}
                      tag={story.year}
                      tapePosition={isEven ? "top-right" : "top-left"}
                      tiltAngle={isEven ? "right" : "left"}
                      className="max-w-[260px] sm:max-w-[280px]"
                    />
                  </div>

                  {/* Text Note Scrapbook Card */}
                  <div className="w-full sm:w-1/2">
                    <div className="paper-sheet rounded-2xl p-6 sm:p-7 border border-[#DECBB4] shadow-sm relative">
                      {/* Decorative small pin / stamp */}
                      <div className="flex items-center justify-between border-b border-[#E8D9C5] pb-2 mb-3">
                        <span className="font-serif text-2xl font-bold text-[#A85A42] tracking-wide">
                          {story.year}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans text-[#8C7A68] bg-[#FAF6EE] px-2.5 py-0.5 rounded-full border border-[#E0D0BD]">
                          <Heart className="w-3 h-3 text-[#C26D53] fill-current" />
                          Babak {index + 1}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#352B24] mb-2">
                        {story.title}
                      </h3>

                      <p className="text-xs sm:text-sm font-sans text-[#6B5A4B] leading-relaxed">
                        {story.story}
                      </p>

                      <div className="mt-4 pt-2 flex items-center justify-end text-[11px] font-script text-[#998370]">
                        <Sparkles className="w-3 h-3 text-[#C26D53] mr-1" />
                        Sebuah catatan perjalanan
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FAF6EE" />
      </div>
    </section>
  );
}
