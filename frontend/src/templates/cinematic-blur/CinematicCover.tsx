"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Calendar, Film, Ticket } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { CharMotionReveal } from "@/components/CharMotionReveal";
import {
  FilmClapperIcon,
  FilmTimecodeBadge,
  ModernHairlineDivider,
  CameraCropMarks,
} from "./CinematicDecorations";

interface CinematicCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  initialGuestName?: string;
}

export function CinematicCover({
  isOpen,
  onOpen,
  initialGuestName,
}: CinematicCoverProps) {
  const data = useWeddingData();
  const [recipient, setRecipient] = useState<string>("Tamu Terhormat");

  useEffect(() => {
    if (initialGuestName && initialGuestName.trim() !== "") {
      setRecipient(initialGuestName.trim());
      return;
    }
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const toParam = urlParams.get("to");
      if (toParam) {
        setRecipient(decodeURIComponent(toParam.replace(/\+/g, " ")));
      }
    }
  }, [initialGuestName]);

  const groomName = data.couple?.groom?.name || "Mempelai Pria";
  const brideName = data.couple?.bride?.name || "Mempelai Wanita";
  const mainEvent = data.events?.[0];
  const dateStr = mainEvent?.displayDate || "21 November 2026";
  const dayStr = mainEvent?.displayDay || "Sabtu";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        y: -40,
        scale: 0.98,
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
      }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between p-5 sm:p-8 text-[#FAF8F5] overflow-y-auto min-h-full"
    >
      {/* Top Film Badge Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center pt-3 sm:pt-4"
      >
        <FilmTimecodeBadge
          scene="SCENE 01"
          take="PRELUDE"
          fps="24 FPS"
          className="mb-2"
        />
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-white/70 block">
          The Wedding Premiere
        </span>
      </motion.div>

      {/* Center Premiere Poster & VIP Admission Ticket */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm my-auto rounded-3xl p-5 sm:p-7 text-center bg-black/55 backdrop-blur-2xl border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.6)] relative overflow-hidden"
      >
        {/* Subtle Glass Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 pointer-events-none" />

        {/* Widescreen Film Still with Camera Marks */}
        <div className="relative w-full h-52 sm:h-56 mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/20 mb-5 group">
          <CameraCropMarks />
          <img
            src={data.general?.coverPhotoUrl || data.general?.preweddingPhotos?.[0] || "/images/prewedding/couple-1.jpg"}
            alt={`${groomName} & ${brideName}`}
            className="w-full h-full object-cover object-top scale-102 group-hover:scale-106 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Film Aspect & Reel Badges */}
          <div className="absolute top-2.5 left-3 z-20 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>2.39:1 CINEMASCOPE</span>
          </div>

          <div className="absolute bottom-2.5 left-3 right-3 z-20 flex justify-between items-end text-left">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/60 block">
                Official Invitation
              </span>
              <span className="text-xs font-semibold text-white tracking-wide">
                Directed by Destiny
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/60">
              PROD. 2026
            </span>
          </div>
        </div>

        {/* Film Festival Laurels Emblem */}
        <div className="flex justify-center -mb-2 pointer-events-none select-none opacity-90">
          <img
            src="/images/templates/cinematic-blur/cinema-laurel-wreath.svg"
            alt=""
            aria-hidden="true"
            className="w-32 h-auto object-contain"
          />
        </div>

        {/* Couple Names */}
        <div className="space-y-1 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/60 block">
            A Love Story Starring
          </span>
          <h1
            style={{ fontFamily: "var(--font-couple-custom, serif)" }}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight drop-shadow-md"
          >
            <CharMotionReveal text={groomName} baseDelay={0.2} /> &amp;{" "}
            <CharMotionReveal text={brideName} baseDelay={0.45} />
          </h1>
          <p className="text-xs text-white/80 font-mono tracking-wider pt-0.5">
            {dayStr}, {dateStr}
          </p>
        </div>

        <ModernHairlineDivider className="my-4" />

        {/* VIP Pass Recipient Ticket Box */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center mb-5 relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-white/60">
            <Ticket className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">
              VIP Admission Pass
            </span>
          </div>
          <span className="text-[10px] font-sans text-white/50 block mb-1">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <p className="font-serif font-bold text-base sm:text-lg text-white tracking-wide truncate">
            <CharMotionReveal text={recipient} baseDelay={0.65} />
          </p>
        </div>

        {/* Primary CTA: Putar Sinema Undangan */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.25)] hover:bg-white/90 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-3 h-3 text-black fill-current translate-x-0.5" />
          </div>
          <span>Putar Sinema Undangan</span>
        </motion.button>
      </motion.div>

      {/* Bottom Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center pb-2 text-[11px] font-sans text-white/50 space-y-0.5"
      >
        <p>Mohon maaf apabila terdapat kesalahan penulisan nama atau gelar</p>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
          Original Wedding Soundtrack Included
        </p>
      </motion.div>
    </motion.div>
  );
}
