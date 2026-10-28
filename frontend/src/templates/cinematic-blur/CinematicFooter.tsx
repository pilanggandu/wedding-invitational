"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import { FilmClapperIcon, ModernHairlineDivider } from "./CinematicDecorations";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

export function CinematicFooter() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <SectionMotion id="closing" className="relative pt-12 pb-24 px-6 text-center text-white overflow-hidden border-t border-white/10">
      <div className="max-w-md mx-auto space-y-6">
        <ItemMotion
          variant="stamp"
          delay={0.08}
          float={true}
          floatDistance={4}
          floatDuration={5}
          className="flex justify-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-lg">
            <FilmClapperIcon className="w-6 h-6" color="#FFFFFF" />
          </div>
        </ItemMotion>

        <ItemMotion variant="fade" delay={0.12} className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/50 block">
            End Credits &bull; Penutup
          </span>
          <p className="text-xs text-white/80 leading-relaxed max-w-xs mx-auto font-sans">
            {data.general?.closingMessage ||
              "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami."}
          </p>
        </ItemMotion>

        <ItemMotion variant="pop" delay={0.16}>
          <ModernHairlineDivider />
        </ItemMotion>

        {/* Film Production Credits Card */}
        <ItemMotion
          variant="slide-up"
          delay={0.2}
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-white/15 space-y-4 text-center"
        >
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
              Starring
            </span>
            <h2
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-2xl font-bold text-white tracking-tight"
            >
              {groom?.name} &amp; {bride?.name}
            </h2>
          </div>

          {(groom?.parents || bride?.parents) && (
            <div className="space-y-1 pt-1 border-t border-white/10">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
                Executive Producers
              </span>
              {groom?.parents && (
                <p className="text-[11px] text-white/70 font-sans">
                  Keluarga Besar {groom.name}: {groom.parents}
                </p>
              )}
              {bride?.parents && (
                <p className="text-[11px] text-white/70 font-sans">
                  Keluarga Besar {bride.name}: {bride.parents}
                </p>
              )}
            </div>
          )}

          {data.general?.hashtag && (
            <div className="pt-1">
              <span className="text-xs font-mono text-white/80 px-3 py-1 rounded-full bg-white/10 border border-white/15 inline-block">
                {data.general.hashtag}
              </span>
            </div>
          )}
        </ItemMotion>

        <ItemMotion variant="pop" delay={0.25} className="pt-4 text-[10px] font-mono text-white/40 space-y-1">
          <p className="tracking-widest uppercase">Cinema Release MMXXVI</p>
          <p className="text-white/30">All Rights Reserved &bull; The Wedding Production</p>
        </ItemMotion>
      </div>
    </SectionMotion>
  );
}
