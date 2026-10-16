"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { CatPawPrint, BrushStrokeDivider } from "./PaintedDecorations";

export function PaintedCatsStory() {
  const data = useWeddingData();
  const stories = data.stories || [];

  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <section id="story" className="relative py-16 px-6 text-center text-[#2C2623] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-1.5">
            <CatPawPrint className="w-3.5 h-3.5 text-[#D97736]" color="#D97736" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A17]">
              Jejak Langkah Cerita
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2623]">
            Kisah Perjalanan Kami
          </h2>
          <p className="text-xs text-[#7A6150] max-w-xs mx-auto leading-relaxed">
            Setiap langkah kecil yang kami lalui bersama telah menuntun kami pada takdir bahagia ini.
          </p>
        </motion.div>

        {/* Timeline Items with Paw Track Border */}
        <div className="relative pl-6 sm:pl-8 space-y-8 text-left border-l-2 border-[#D97736]/40 ml-4 sm:ml-6">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="relative space-y-2"
            >
              {/* Timeline Paw Pin */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#D97736] flex items-center justify-center text-[#D97736] shadow-xs">
                <CatPawPrint className="w-3 h-3 text-[#D97736]" color="#D97736" />
              </div>

              {/* Story Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#EAD8C7] shadow-xs space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#FAF6EE] text-[#C85A17] border border-[#E8D9CB] inline-block">
                  {story.year}
                </span>
                <h3 className="font-serif font-bold text-base text-[#2C2623]">
                  {story.title}
                </h3>
                <p className="text-xs text-[#5C4A3E] leading-relaxed font-sans">
                  {story.story}
                </p>
                {story.cuteReaction && (
                  <p className="text-[11px] font-mono text-[#C85A17] italic pt-1">
                    &ldquo;{story.cuteReaction}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
