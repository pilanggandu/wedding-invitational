"use client";

import React from "react";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { FilmTimecodeBadge, ModernHairlineDivider } from "./CinematicDecorations";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

export function CinematicLoveStory() {
  const data = useWeddingData();
  const stories = data.stories || [];

  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <SectionMotion id="story" className="relative py-16 px-6 text-center text-white overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <ItemMotion variant="slide-down" className="space-y-2">
          <FilmTimecodeBadge scene="SCENE 04" take="THE STORYLINE" className="mb-2" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Perjalanan Cerita
          </h2>
          <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
            Rangkaian adegan bermakna dari pertemuan awal hingga melangkah menuju komitmen abadi.
          </p>
        </ItemMotion>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 space-y-8 text-left border-l-2 border-white/20 ml-4 sm:ml-6">
          {stories.map((story, idx) => (
            <ItemMotion
              key={idx}
              variant={idx % 2 === 0 ? "slide-right" : "slide-left"}
              delay={idx * 0.12}
              className="relative space-y-2"
            >
              {/* Timeline Pin (Film Icon) with floating motion */}
              <ItemMotion
                variant="pop"
                delay={0.15 + idx * 0.08}
                float={true}
                floatDistance={3}
                floatDuration={4 + (idx % 2)}
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-black border border-white/40 flex items-center justify-center text-white shadow-md z-10"
              >
                <Film className="w-3 h-3 text-white/80" />
              </ItemMotion>

              {/* Story Card */}
              <div className="bg-black/45 backdrop-blur-2xl rounded-2xl p-5 border border-white/20 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white text-black inline-block">
                    {story.year}
                  </span>
                  <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">
                    Chapter 0{idx + 1}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-white">
                  {story.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  {story.story}
                </p>
                {story.cuteReaction && (
                  <p className="text-[11px] font-mono text-white/70 italic pt-1">
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
