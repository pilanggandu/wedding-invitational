"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Smile, Mail } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  CoupleWalkingIllustration,
  CityBoulevardBackdrop,
} from "./CityscapeIllustrations";
import { SkyAirplane, PastelCloud } from "./CityscapeDecorations";

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
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.65 },
        colors: ["#38B6FF", "#2E8BC0", "#FFE58F", "#F0F8FF", "#84CC16", "#F4D160"],
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
        animate={{ opacity: isOpening ? 0 : 1, scale: isOpening ? 1.04 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
        className="fixed lg:absolute inset-0 z-50 flex flex-col justify-between overflow-hidden select-none bg-[#DCEDF8]"
      >
        {/* Pure Vector Boulevard & Cityscape Scene Backdrop */}
        <CityBoulevardBackdrop />

        {/* Animated Sky Elements */}
        <SkyAirplane className="top-10 left-6" />
        <PastelCloud className="w-32 h-14 absolute top-6 right-6 opacity-75" delay={0} />
        <PastelCloud className="w-24 h-10 absolute top-20 left-10 opacity-60" delay={4} />

        {/* Top Header & Couple Names (Arched & Cursive aesthetic like TikTok) */}
        <div className="relative z-20 pt-8 sm:pt-10 px-4 text-center">
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/85 backdrop-blur-md text-[#1D78A0] text-xs font-mono font-bold border border-white/80 shadow-xs mb-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#38B6FF]" />
            <span>The Wedding of</span>
            <Sparkles className="w-3.5 h-3.5 text-[#38B6FF]" />
          </motion.div>

          {/* Cursive Handwriting Couple Name */}
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-handwriting text-5xl sm:text-6xl text-[#1D78A0] tracking-wide my-1 drop-shadow-sm"
          >
            {groomName} <span className="font-script text-3xl sm:text-4xl text-[#38B6FF]">&</span> {brideName}
          </motion.h1>

          {/* Clean Modern Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs sm:text-sm font-mono font-bold tracking-widest text-[#2E8BC0] mt-0.5"
          >
            {eventDateStr.replace(/[^0-9]/g, " ").trim().replace(/\s+/g, " . ") || "21 . 11 . 2026"}
          </motion.div>
        </div>

        {/* Center: Handcrafted Couple Illustration Walking on Boulevard Path */}
        <div className="relative flex-1 flex flex-col items-center justify-end z-20 pb-4 px-4">
          {/* Guest Recipient Floating Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[280px] bg-white/95 backdrop-blur-md rounded-2xl p-3 text-center border border-sky-100 shadow-lg mb-2"
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1D78A0] block">
              Spesial Untuk Sahabat / Keluarga:
            </span>
            <p className="font-script text-xl sm:text-2xl font-bold text-[#0C4A60] leading-snug truncate mt-0.5">
              {guestName}
            </p>
          </motion.div>

          {/* The Pure SVG Couple Walking Hand-in-Hand Illustration */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="w-full max-w-[260px] sm:max-w-[280px]"
          >
            <CoupleWalkingIllustration />
          </motion.div>

          {/* The Iconic TikTok Pill-Shaped "OPEN" Button */}
          <div className="w-full max-w-[280px] flex flex-col items-center justify-center mt-2 z-30">
            <motion.button
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleOpen}
              disabled={isOpening}
              className="w-full max-w-[210px] py-3.5 px-8 rounded-full bg-[#38B6FF] hover:bg-[#209CEE] active:bg-[#1D78A0] text-white font-mono font-bold text-sm tracking-widest uppercase border-2 border-white shadow-[0_8px_24px_rgba(56,182,255,0.6)] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              aria-label="Open Wedding Invitation"
            >
              <Mail className="w-4 h-4 text-white group-hover:scale-110 transition-transform animate-bounce" />
              <span>{isOpening ? "MEMBUKA..." : "OPEN"}</span>
            </motion.button>

            <span className="text-[11px] font-sans font-medium text-[#1D78A0] bg-white/80 backdrop-blur-xs px-3 py-0.5 rounded-full mt-2.5 flex items-center gap-1 shadow-2xs">
              <Smile className="w-3.5 h-3.5 text-[#38B6FF]" />
              Ketuk tombol untuk membuka undangan
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
