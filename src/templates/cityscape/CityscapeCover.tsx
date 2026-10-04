"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart, Smile } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  SkyAirplane,
  PastelCloud,
  CitySkylineSvg,
  VintageStreetLamp,
  ParkBushes,
} from "./CityscapeDecorations";

interface CityscapeCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  initialGuestName?: string;
}

export function CityscapeCover({
  isOpen,
  onOpen,
  initialGuestName,
}: CityscapeCoverProps) {
  const data = useWeddingData();
  const [guestName, setGuestName] = useState<string>(
    initialGuestName || "Tamu Undangan Terhormat"
  );
  const [isOpening, setIsOpening] = useState<boolean>(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("u") || params.get("nama");
      if (to) {
        setGuestName(to.trim());
      } else if (initialGuestName) {
        setGuestName(initialGuestName);
      }
    } catch {
      // Fallback
    }
  }, [initialGuestName]);

  const groomName = data.couple?.groom?.name || "Gilang";
  const brideName = data.couple?.bride?.name || "Salsadila";
  const eventDateStr = data.events[0]?.displayDate || "21 . 11 . 2026";

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    try {
      // Sky blue, gold, ivory, and soft green confetti celebration
      confetti({
        particleCount: 80,
        spread: 85,
        origin: { y: 0.65 },
        colors: ["#2E8BC0", "#FFE58F", "#F0F8FF", "#7A9D54", "#38B6FF", "#F4D160"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onOpen();
    }, 450);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isOpening ? 0 : 1, scale: isOpening ? 1.05 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="fixed lg:absolute inset-0 z-50 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#CBE6F6] via-[#E8F4F8] to-[#F5FAFC] select-none"
      >
        {/* Animated Sky Elements */}
        <SkyAirplane className="top-10 left-4" />
        <PastelCloud className="w-28 h-12 absolute top-6 right-6 opacity-80" delay={0} />
        <PastelCloud className="w-24 h-10 absolute top-16 left-8 opacity-70" delay={4} />

        {/* Top Header & Couple Names */}
        <div className="relative z-20 pt-8 sm:pt-10 px-4 text-center">
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs text-[#1D78A0] text-xs font-mono font-bold border border-white shadow-xs mb-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2E8BC0]" />
            <span>The Wedding of</span>
            <Sparkles className="w-3.5 h-3.5 text-[#2E8BC0]" />
          </motion.div>

          {/* Flowing Manhwa Script Couple Name (Cyan/Blue Theme like TikTok) */}
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-handwriting text-5xl sm:text-6xl text-[#1D78A0] tracking-wide my-1 drop-shadow-xs"
          >
            {groomName} <span className="font-script text-3xl sm:text-4xl text-[#38B6FF]">&</span> {brideName}
          </motion.h1>

          {/* Modern Date Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#2E8BC0] mt-1"
          >
            {eventDateStr.replace(/[^0-9]/g, " ").trim().replace(/\s+/g, " . ") || "21 . 11 . 2026"}
          </motion.div>
        </div>

        {/* Center Artwork: Couple Walking Hand-in-Hand on City Boulevard */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-4 my-auto">
          {/* Main Visual Card */}
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative w-full max-w-[340px] aspect-[9/14] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-white"
          >
            {/* The Authentic Manhwa Cityscape Illustration */}
            <Image
              src="/templates/cityscape-cover.jpeg"
              alt={`${groomName} & ${brideName} Cityscape Walk`}
              fill
              priority
              className="object-cover object-center"
            />

            {/* Subtle Gradient Vignette at Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Recipient Letter Overlay Badge on Artwork */}
            <div className="absolute top-4 inset-x-4 bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 text-center border border-sky-100 shadow-md">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1D78A0] block">
                Kepada Yth. Sahabat / Keluarga:
              </span>
              <p className="font-script text-xl sm:text-2xl font-bold text-[#0C4A60] leading-tight truncate mt-0.5">
                {guestName}
              </p>
            </div>

            {/* The Iconic TikTok "OPEN" Button Floating on the Paved Path */}
            <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-center px-6 z-30">
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleOpen}
                disabled={isOpening}
                className="w-full max-w-[200px] py-3 px-8 rounded-full bg-[#38B6FF] hover:bg-[#209CEE] active:bg-[#1D78A0] text-white font-mono font-bold text-sm tracking-widest uppercase border-2 border-white shadow-[0_6px_20px_rgba(56,182,255,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                aria-label="Open Wedding Invitation"
              >
                <span>{isOpening ? "MEMBUKA..." : "OPEN"}</span>
              </motion.button>

              <span className="text-[11px] font-sans font-medium text-white/90 drop-shadow-md mt-2 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" />
                Ketuk tombol untuk membuka undangan
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Skyline Sillhouette Accent */}
        <div className="relative w-full h-12 shrink-0">
          <CitySkylineSvg className="w-full h-12" color="#75BBE3" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
