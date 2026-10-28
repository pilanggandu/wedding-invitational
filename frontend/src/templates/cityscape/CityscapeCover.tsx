"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Building2, Navigation, Compass, MapPin, ArrowRight } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { getFontFamilyCss } from "@/lib/typography";
import { CharMotionReveal } from "@/components/CharMotionReveal";

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

  const groomName = data.couple?.groom?.name || "Mempelai Pria";
  const brideName = data.couple?.bride?.name || "Mempelai Wanita";
  const mainEvent = data.events?.[0];
  const eventDateStr = mainEvent?.displayDate || "21 November 2026";
  const eventCity = mainEvent?.venueAddress?.split(",")?.pop()?.trim() || "Tuban, Jawa Timur";

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#1D78A0", "#0F2B46", "#38B6FF", "#F0F8FF", "#F4D160"],
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
        animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -30 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="fixed lg:absolute inset-0 z-50 flex flex-col justify-between overflow-hidden select-none bg-[#0B1E2E] text-white"
      >
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />

        <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none">
          <svg viewBox="0 0 1000 450" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="skylineGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B4264" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0B1E2E" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="skylineGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#255A88" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0B1E2E" stopOpacity="1" />
              </linearGradient>
            </defs>

            <g fill="url(#skylineGrad1)">
              <rect x="30" y="80" width="70" height="370" />
              <polygon points="65,40 55,80 75,80" />
              <rect x="120" y="140" width="85" height="310" />
              <rect x="230" y="70" width="100" height="380" />
              <line x1="280" y1="20" x2="280" y2="70" stroke="#38B6FF" strokeWidth="2" opacity="0.6" />
              <rect x="350" y="160" width="80" height="290" />
              <rect x="450" y="90" width="95" height="360" />
              <polygon points="497,45 487,90 507,90" />
              <rect x="570" y="130" width="110" height="320" />
              <rect x="710" y="60" width="90" height="390" />
              <line x1="755" y1="15" x2="755" y2="60" stroke="#38B6FF" strokeWidth="2" opacity="0.6" />
              <rect x="825" y="150" width="85" height="300" />
              <rect x="930" y="100" width="70" height="350" />
            </g>

            <g fill="url(#skylineGrad2)">
              <rect x="0" y="180" width="60" height="270" />
              <rect x="80" y="120" width="75" height="330" />
              <polygon points="117,80 108,120 126,120" />
              <g fill="#FDE047" opacity="0.85">
                <rect x="92" y="140" width="8" height="12" rx="1" />
                <rect x="108" y="140" width="8" height="12" rx="1" />
                <rect x="124" y="140" width="8" height="12" rx="1" />
                <rect x="92" y="165" width="8" height="12" rx="1" />
                <rect x="108" y="165" width="8" height="12" rx="1" />
                <rect x="124" y="165" width="8" height="12" rx="1" />
                <rect x="92" y="190" width="8" height="12" rx="1" />
                <rect x="124" y="190" width="8" height="12" rx="1" />
              </g>
              <rect x="175" y="190" width="90" height="260" />
              <rect x="285" y="130" width="80" height="320" />
              <polygon points="325,85 315,130 335,130" />
              <g fill="#FDE047" opacity="0.85">
                <rect x="300" y="150" width="8" height="12" rx="1" />
                <rect x="316" y="150" width="8" height="12" rx="1" />
                <rect x="332" y="150" width="8" height="12" rx="1" />
                <rect x="300" y="175" width="8" height="12" rx="1" />
                <rect x="332" y="175" width="8" height="12" rx="1" />
              </g>
              <rect x="385" y="170" width="105" height="280" />
              <rect x="510" y="110" width="85" height="340" />
              <line x1="552" y1="65" x2="552" y2="110" stroke="#FDE047" strokeWidth="2.5" />
              <circle cx="552" cy="63" r="3" fill="#F43F5E" className="animate-ping" />
              <g fill="#FDE047" opacity="0.85">
                <rect x="525" y="130" width="8" height="12" rx="1" />
                <rect x="541" y="130" width="8" height="12" rx="1" />
                <rect x="557" y="130" width="8" height="12" rx="1" />
                <rect x="573" y="130" width="8" height="12" rx="1" />
                <rect x="525" y="155" width="8" height="12" rx="1" />
                <rect x="557" y="155" width="8" height="12" rx="1" />
              </g>
              <rect x="615" y="160" width="95" height="290" />
              <rect x="730" y="100" width="85" height="350" />
              <polygon points="772,50 762,100 782,100" />
              <g fill="#FDE047" opacity="0.85">
                <rect x="745" y="125" width="8" height="12" rx="1" />
                <rect x="765" y="125" width="8" height="12" rx="1" />
                <rect x="785" y="125" width="8" height="12" rx="1" />
                <rect x="745" y="150" width="8" height="12" rx="1" />
                <rect x="785" y="150" width="8" height="12" rx="1" />
              </g>
              <rect x="835" y="170" width="90" height="280" />
              <rect x="945" y="140" width="60" height="310" />
            </g>
          </svg>
        </div>

        <div className="relative z-20 pt-8 sm:pt-10 px-5 text-center">
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-widest text-[#7DD3FC] mb-4"
          >
            <Compass className="w-3 h-3 text-[#38B6FF]" />
            <span>METROPOLITAN REGISTRY // LAT -7.16° LONG 112.05°</span>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
            className="text-4xl min-[380px]:text-5xl sm:text-6xl text-white font-extrabold tracking-tight drop-shadow-md leading-none my-1"
          >
            <CharMotionReveal
              text={`${groomName} × ${brideName}`}
              delay={0.2}
              step={0.03}
              className="justify-center"
            />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-[#93C5FD] uppercase mt-2 flex items-center justify-center gap-2"
          >
            <Building2 className="w-3.5 h-3.5 text-[#38B6FF]" />
            <span>URBAN ROMANCE &bull; {eventDateStr}</span>
          </motion.div>
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-end z-20 pb-8 px-5">
          <div className="flex justify-center mb-3 pointer-events-none select-none opacity-90">
            <img
              src="/images/templates/cityscape/metro-transit-ticket.svg"
              alt="Metro Transit Ticket"
              aria-hidden="true"
              className="w-72 sm:w-80 h-auto object-contain drop-shadow-lg"
            />
          </div>

          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-xs bg-[#0F2B46]/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-[#38B6FF]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden mb-5 text-left"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-3 text-[9px] font-mono uppercase tracking-widest text-[#7DD3FC]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38B6FF]" />
                TRANSIT PASS
              </span>
              <span>SPECIAL INVITATION</span>
            </div>

            <span className="text-[9px] font-mono uppercase tracking-wider text-white/60 block">
              DITUJUKAN KEPADA:
            </span>
            <div className="font-sans text-lg sm:text-xl font-bold text-white truncate mt-0.5">
              <CharMotionReveal
                text={guestName}
                delay={0.35}
                step={0.03}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-white/70 pt-3 mt-3 border-t border-white/10">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#38B6FF]" />
                {eventCity}
              </span>
              <span className="text-[#FDE047] font-semibold">GATE ADMIT 01</span>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-dashed border-white/15">
              <div className="flex items-center gap-1">
                <div className="w-1 h-4 bg-white/40" />
                <div className="w-2 h-4 bg-white/70" />
                <div className="w-0.5 h-4 bg-white/30" />
                <div className="w-3 h-4 bg-white/80" />
                <div className="w-1.5 h-4 bg-white/50" />
                <div className="w-0.5 h-4 bg-white/40" />
                <div className="w-2.5 h-4 bg-white/70" />
              </div>
              <span className="text-[8px] font-mono tracking-widest text-white/40">CITY-ROUTE #2026</span>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleOpen}
            disabled={isOpening}
            className="w-full max-w-xs py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#1D78A0] via-[#0284C7] to-[#0369A1] hover:brightness-110 active:brightness-95 text-white font-mono font-bold text-xs tracking-[0.2em] uppercase border border-[#7DD3FC]/40 shadow-[0_10px_30px_rgba(2,132,199,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>{isOpening ? "MEMVERIFIKASI TIKET..." : "BUKA UNDANGAN"}</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
