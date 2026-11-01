"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { WeddingInvitationData } from "@/types/wedding";
import { resolveThemeColors } from "@/lib/colorPalettes";
import { collectInvitationAssets, preloadAllAssets } from "@/lib/assetPreloader";

interface InvitationPreloaderProps {
  data: WeddingInvitationData;
  onComplete: () => void;
}

export function InvitationPreloader({ data, onComplete }: InvitationPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const isCompletedRef = useRef(false);

  const { groom, bride } = data.couple || {};
  const groomInitial = (groom?.name || "G").trim().charAt(0).toUpperCase();
  const brideInitial = (bride?.name || "S").trim().charAt(0).toUpperCase();
  const coupleMonogram = `${groomInitial}&${brideInitial}`;

  const { primaryColor, secondaryColor, paperColor } = resolveThemeColors(data.themePalette);

  useEffect(() => {
    let isMounted = true;
    const urls = collectInvitationAssets(data);
    setTotalCount(urls.length);

    preloadAllAssets(urls, (pct, loaded, total) => {
      if (!isMounted) return;
      setProgress(pct);
      setLoadedCount(loaded);
      setTotalCount(total);
    }).then(() => {
      if (!isMounted) return;
      setTimeout(() => {
        if (!isCompletedRef.current && isMounted) {
          isCompletedRef.current = true;
          onComplete();
        }
      }, 350);
    });

    return () => {
      isMounted = false;
    };
  }, [data, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ backgroundColor: primaryColor }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-[#FFFDFB] select-none"
    >
      {/* Ambient warm parchment card */}
      <div
        style={{ backgroundColor: paperColor }}
        className="relative w-full max-w-sm rounded-3xl p-7 text-center border-2 border-dashed border-[#541E24]/35 shadow-[0_16px_48px_rgba(44,10,14,0.35)] flex flex-col items-center"
      >
        {/* Header sticker */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#F8EFEA] text-[#541E24] border border-[#541E24]/30 mb-4 shadow-2xs">
          <Sparkles className="w-3 h-3 text-[#541E24]" />
          <span>Menyiapkan Lembar Kenangan</span>
          <Sparkles className="w-3 h-3 text-[#541E24]" />
        </div>

        {/* Monogram circle emblem */}
        <div className="relative w-24 h-24 my-2 flex items-center justify-center">
          <img
            src="/images/templates/paper-art/real-botanical-olive-wreath.png"
            alt="Olive Wreath"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-xs"
          />
          <span
            style={{ fontFamily: "var(--font-couple-custom, serif)" }}
            className="text-2xl font-bold text-[#541E24] tracking-widest pl-0.5 -mt-1"
          >
            {coupleMonogram}
          </span>
        </div>

        {/* Names */}
        <h2
          style={{ fontFamily: "var(--font-couple-custom, serif)" }}
          className="text-2xl sm:text-3xl font-bold text-[#541E24] mt-2 mb-1"
        >
          {groom?.name || "Gilang"} &amp; {bride?.name || "Salsa"}
        </h2>

        <p className="text-xs font-serif italic text-[#6B4B3E] mb-5">
          {data.general?.funTagline || "Menemukan yang sefrekuensi itu anugerah"}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs space-y-2">
          <div className="relative w-full h-3 rounded-full bg-[#3A1116]/15 border border-[#541E24]/30 overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#8C2B38] to-[#541E24] shadow-xs"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#541E24] px-1 font-semibold">
            <span>{progress}%</span>
            <span>
              {totalCount > 0 ? `${loadedCount} / ${totalCount} aset` : "Memuat..."}
            </span>
          </div>
        </div>

        <p className="text-[10px] font-mono text-[#8C6D60] mt-4 flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-[#8C2B38] animate-pulse" />
          <span>Mengunduh foto dan ilustrasi beresolusi penuh</span>
        </p>
      </div>
    </motion.div>
  );
}
