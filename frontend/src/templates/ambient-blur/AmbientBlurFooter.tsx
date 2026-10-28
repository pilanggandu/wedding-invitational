"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ExtractedColors } from "@/lib/colorExtractor";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

interface AmbientBlurFooterProps {
  palette?: ExtractedColors;
}

export function AmbientBlurFooter({ palette }: AmbientBlurFooterProps) {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  const accentColor = palette?.dominant || "#D97736";
  const glowColor = palette?.glow || "rgba(217,119,54,0.3)";

  return (
    <SectionMotion id="closing" className="relative pt-12 pb-24 px-6 text-center text-slate-800 overflow-hidden border-t border-slate-200/80">
      <div className="max-w-md mx-auto space-y-6">
        <ItemMotion
          variant="stamp"
          float={true}
          floatDistance={3}
          floatDuration={3.5}
          className="flex justify-center"
        >
          <div
            style={{
              borderColor: `${accentColor}44`,
              backgroundColor: `${accentColor}14`,
              boxShadow: `0 0 25px ${glowColor}`,
            }}
            className="w-12 h-12 rounded-2xl border flex items-center justify-center text-white shadow-md ring-1 ring-slate-900/5"
          >
            <Heart style={{ color: accentColor }} className="w-5 h-5 fill-current" />
          </div>
        </ItemMotion>

        <ItemMotion variant="fade" delay={0.1} className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500 block font-semibold">
            Ungkapan Terima Kasih
          </span>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto font-sans">
            {data.general?.closingMessage ||
              "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami."}
          </p>
        </ItemMotion>

        <div className="flex items-center justify-center gap-3 max-w-xs mx-auto my-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <div
            style={{ backgroundColor: accentColor }}
            className="w-1.5 h-1.5 rounded-full"
          />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>

        {/* Couple & Family Card */}
        <ItemMotion
          variant="slide-up"
          delay={0.15}
          style={{
            borderColor: `${accentColor}33`,
          }}
          className="bg-white/85 sm:bg-white/90 backdrop-blur-xl rounded-2xl p-5 border ring-1 ring-slate-900/5 shadow-lg space-y-4 text-center"
        >
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block font-semibold">
              Kami yang Berbahagia
            </span>
            <h2
              style={{ fontFamily: "var(--font-couple-custom, serif)" }}
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              {groom?.name} &amp; {bride?.name}
            </h2>
          </div>

          {(groom?.parents || bride?.parents) && (
            <div className="space-y-1 pt-2 border-t border-slate-200/80">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block font-semibold">
                Beserta Keluarga Besar
              </span>
              {groom?.parents && (
                <p className="text-[11px] text-slate-600 font-sans">
                  Keluarga {groom.name}: {groom.parents}
                </p>
              )}
              {bride?.parents && (
                <p className="text-[11px] text-slate-600 font-sans">
                  Keluarga {bride.name}: {bride.parents}
                </p>
              )}
            </div>
          )}

          {data.general?.hashtag && (
            <ItemMotion variant="pop" delay={0.25} className="pt-1">
              <span
                style={{
                  borderColor: `${accentColor}44`,
                  backgroundColor: `${accentColor}12`,
                  color: accentColor,
                }}
                className="text-xs font-mono px-3 py-1 rounded-full border inline-block font-semibold shadow-sm"
              >
                {data.general.hashtag}
              </span>
            </ItemMotion>
          )}
        </ItemMotion>

        <div className="pt-4 text-[10px] font-mono text-slate-500 space-y-1">
          <p className="tracking-widest uppercase font-semibold">The Wedding Celebration 2026</p>
          <p className="text-slate-400">Semua Hak Cipta Dilindungi Undang-Undang</p>
        </div>
      </div>
    </SectionMotion>
  );
}
