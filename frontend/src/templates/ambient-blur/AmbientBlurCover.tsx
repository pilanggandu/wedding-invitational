"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, Heart } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ExtractedColors } from "@/lib/colorExtractor";
import { CharMotionReveal } from "@/components/CharMotionReveal";

interface AmbientBlurCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  initialGuestName?: string;
  palette?: ExtractedColors;
}

export function AmbientBlurCover({
  isOpen,
  onOpen,
  initialGuestName,
  palette,
}: AmbientBlurCoverProps) {
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

  const coverPhoto =
    data.general?.coverPhotoUrl ||
    data.general?.preweddingPhotos?.[0] ||
    "/images/prewedding/couple-1.jpg";

  const accentColor = palette?.dominant || "#D97736";
  const glowColor = palette?.glow || "rgba(217,119,54,0.3)";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        y: -40,
        scale: 0.98,
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
      }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between p-5 sm:p-8 text-slate-800 overflow-y-auto min-h-full"
    >
      {/* Top Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center pt-3"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-[10px] font-mono tracking-widest text-slate-700 shadow-sm ring-1 ring-slate-900/5">
          <span
            style={{ backgroundColor: accentColor }}
            className="w-2 h-2 rounded-full animate-ping"
          />
          <span className="uppercase font-semibold">Atmosfer Dinamis &bull; Live Chroma</span>
        </div>
      </motion.div>

      {/* Radiant Aurora Halo Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-10 opacity-60">
        <img
          src="/images/templates/ambient-blur/aurora-glow-halo.svg"
          alt=""
          aria-hidden="true"
          className="w-[450px] sm:w-[550px] h-auto object-contain"
        />
      </div>

      {/* Center Adaptive Pearl Glass Card with Focal Portrait */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          boxShadow: `0 25px 60px rgba(15, 23, 42, 0.08), 0 0 50px ${glowColor}`,
        }}
        className="w-full max-w-sm my-auto rounded-3xl p-5 sm:p-7 text-center bg-white/85 backdrop-blur-2xl border border-white/90 relative overflow-hidden"
      >
        {/* Subtle Pearl Glass Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none" />

        {/* Center Prewedding Portrait Frame with Chromatic Halo */}
        <div
          style={{
            borderColor: `${accentColor}55`,
            boxShadow: `0 15px 35px rgba(15, 23, 42, 0.1), 0 0 25px ${glowColor}`,
          }}
          className="relative w-40 h-52 sm:w-44 sm:h-56 mx-auto rounded-2xl overflow-hidden border-2 mb-5 group bg-slate-100"
        >
          <img
            src={coverPhoto}
            alt={`${groomName} & ${brideName}`}
            className="w-full h-full object-cover object-top scale-102 group-hover:scale-108 transition-transform duration-700"
          />
          <div className="absolute top-2 right-2 w-5 h-5 z-20 pointer-events-none select-none opacity-85">
            <img
              src="/images/templates/ambient-blur/glass-crystal-sparkle.svg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 left-0 right-0 text-center">
            <span
              className="text-[10px] font-mono uppercase tracking-widest text-white/95 font-semibold"
            >
              The Celebration
            </span>
          </div>
        </div>

        {/* Couple Names */}
        <div className="space-y-1 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 font-bold block">
            The Wedding of
          </span>
          <h1
            style={{ fontFamily: "var(--font-couple-custom, serif)" }}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight drop-shadow-xs"
          >
            <CharMotionReveal
              text={`${groomName} & ${brideName}`}
              delay={0.25}
              step={0.035}
              className="justify-center"
            />
          </h1>
          <p className="text-xs text-slate-600 font-mono tracking-wider pt-0.5">
            {dayStr}, {dateStr}
          </p>
        </div>

        {/* Hairline Divider */}
        <div className="flex items-center justify-center gap-3 max-w-xs mx-auto my-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <div
            style={{ backgroundColor: accentColor }}
            className="w-2 h-2 rounded-full"
          />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>

        {/* VIP Guest Recipient Card */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 text-center mb-5 relative shadow-xs">
          <span className="text-[10px] font-sans text-slate-500 block mb-1">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <div className="font-serif font-bold text-base sm:text-lg text-slate-900 tracking-wide truncate">
            <CharMotionReveal
              text={recipient}
              delay={0.4}
              step={0.03}
              className="justify-center"
            />
          </div>
        </div>

        {/* Primary CTA: Buka Undangan with Dynamic Halo */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${palette?.secondary || accentColor})`,
            boxShadow: `0 10px 28px ${glowColor}`,
          }}
          className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer group shadow-lg"
        >
          <Mail className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span>Buka Undangan</span>
        </motion.button>
      </motion.div>

      {/* Bottom Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center pb-2 text-[11px] font-sans text-slate-500 space-y-0.5"
      >
        <p>Mohon maaf apabila terdapat kesalahan penulisan nama atau gelar</p>
      </motion.div>
    </motion.div>
  );
}
