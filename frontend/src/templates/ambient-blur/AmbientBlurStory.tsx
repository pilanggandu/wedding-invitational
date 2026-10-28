"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ExtractedColors } from "@/lib/colorExtractor";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

interface AmbientBlurStoryProps {
  palette?: ExtractedColors;
}

export function AmbientBlurStory({ palette }: AmbientBlurStoryProps) {
  const data = useWeddingData();
  const stories = data.stories || [];

  if (!stories || stories.length === 0) {
    return null;
  }

  const accentColor = palette?.dominant || "#D97736";
  const glowColor = palette?.glow || "rgba(217,119,54,0.3)";

  return (
    <SectionMotion id="story" className="relative py-16 px-6 text-center text-slate-800 overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <ItemMotion variant="slide-down" className="space-y-2">
          <div className="flex justify-center">
            <span
              style={{
                borderColor: `${accentColor}44`,
                backgroundColor: `${accentColor}12`,
                color: accentColor,
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest backdrop-blur-md font-semibold"
            >
              <span
                style={{ backgroundColor: accentColor }}
                className="w-1.5 h-1.5 rounded-full"
              />
              Kisah Kami
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Perjalanan Cerita
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Rangkaian momen berharga dari pertemuan pertama hingga melangkah bersama menuju ikrar suci.
          </p>
        </ItemMotion>

        {/* Timeline Items */}
        <div
          style={{ borderColor: `${accentColor}33` }}
          className="relative pl-6 sm:pl-8 space-y-8 text-left border-l-2 ml-4 sm:ml-6"
        >
          {stories.map((story, idx) => (
            <ItemMotion
              key={idx}
              variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
              delay={idx * 0.15}
              className="relative space-y-2"
            >
              {/* Timeline Pin */}
              <ItemMotion
                variant="pop"
                delay={idx * 0.15 + 0.1}
                float={true}
                floatDistance={3}
                floatDuration={3.5}
                style={{
                  borderColor: accentColor,
                  backgroundColor: "#FFFFFF",
                  boxShadow: `0 0 14px ${glowColor}`,
                }}
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-white z-10"
              >
                <Heart style={{ color: accentColor }} className="w-2.5 h-2.5 fill-current" />
              </ItemMotion>

              {/* Story Card */}
              <div
                style={{
                  borderColor: `${accentColor}33`,
                  boxShadow: `0 15px 40px rgba(15,23,42,0.06), 0 0 20px ${glowColor}`,
                }}
                className="bg-white/85 sm:bg-white/90 backdrop-blur-2xl rounded-2xl p-5 border shadow-lg ring-1 ring-slate-900/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{ backgroundColor: accentColor }}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-white inline-block shadow-sm"
                  >
                    {story.year}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    Chapter 0{idx + 1}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  {story.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {story.story}
                </p>
                {story.cuteReaction && (
                  <p
                    style={{ color: accentColor }}
                    className="text-[11px] font-mono italic pt-1 font-medium"
                  >
                    &ldquo;{story.cuteReaction}&rdquo;
                  </p>
                )}
              </div>
            </ItemMotion>
          ))}
        </div>
      </div>
    </SectionMotion>
  );
}
