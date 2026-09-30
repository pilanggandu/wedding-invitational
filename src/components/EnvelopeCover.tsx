"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Mail, Heart, Sparkles } from "lucide-react";
import { BotanicalLeaves, PaperStamp } from "./PaperArtDecorations";

interface EnvelopeCoverProps {
  onOpen: () => void;
  isOpen: boolean;
}

export function EnvelopeCover({ onOpen, isOpen }: EnvelopeCoverProps) {
  const [guestName, setGuestName] = useState<string>("Tamu Undangan Terhormat");
  const [isOpening, setIsOpening] = useState<boolean>(false);

  useEffect(() => {
    // Parse guest name from query parameters (?to=... or ?u=...)
    try {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("u") || params.get("nama");
      if (to) {
        setGuestName(to.trim());
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsOpening(true);

    // Trigger romantic paper confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#C26D53", "#E8C2A0", "#F3EAD8", "#8A9A86", "#D4AF37"],
      });
    } catch {
      // Ignore if confetti blocked
    }

    setTimeout(() => {
      onOpen();
    }, 700);
  };

  if (isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-700 ${
        isOpening ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#FAF6EE",
        backgroundImage: `radial-gradient(circle at center, #FFFDF9 0%, #F5ECDD 100%)`,
      }}
    >
      {/* Decorative background paper cutouts */}
      <BotanicalLeaves className="absolute -top-10 -left-10 w-44 h-64 opacity-50 rotate-45" />
      <BotanicalLeaves className="absolute -bottom-10 -right-10 w-48 h-68 opacity-45 -rotate-135" />
      <div className="absolute top-8 right-8 hidden sm:block">
        <PaperStamp text="ROYAL WEDDING" date="12 • 12 • 2026" />
      </div>

      {/* Main Craft Envelope Box */}
      <div className="relative w-full max-w-md paper-sheet-kraft rounded-2xl p-6 sm:p-8 text-center border-2 border-[#D3BEA2] shadow-2xl overflow-hidden">
        {/* Washi tape accents on corners */}
        <div className="absolute -top-3.5 left-8 w-24 h-7 washi-tape -rotate-3" />
        <div className="absolute -top-3.5 right-8 w-24 h-7 washi-tape rotate-3" />

        {/* Envelope flap cut illusion */}
        <div className="absolute top-0 left-0 right-0 h-10 border-b border-[#CBB599] bg-[#E7D6C1]/50 pointer-events-none" />

        {/* Inner Card Presentation */}
        <div className="paper-sheet rounded-xl p-6 sm:p-8 border border-[#E0D0BB] relative z-10 my-2">
          {/* Subtle paper seal header */}
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif tracking-widest uppercase bg-[#F5EDE1] text-[#7A6652] border border-[#DECDB8]">
              <Sparkles className="w-3 h-3 text-[#C26D53]" />
              The Wedding Invitation
              <Sparkles className="w-3 h-3 text-[#C26D53]" />
            </span>
          </div>

          {/* Couple Names */}
          <h1 className="font-handwriting text-5xl sm:text-6xl text-[#3A3027] my-3 leading-tight tracking-wide">
            Dimas <span className="font-script text-3xl sm:text-4xl text-[#C26D53]">&</span> Sarah
          </h1>

          <p className="font-serif italic text-xs sm:text-sm text-[#7F6B58] tracking-widest uppercase mt-1 mb-6">
            Sabtu, 12 Desember 2026
          </p>

          {/* Recipient Letter Section */}
          <div className="border-t border-b border-[#E7DAC7] py-4 my-4 bg-[#FAF6EE]/80 rounded-md">
            <p className="text-xs font-sans text-[#8C7A6B] uppercase tracking-wider mb-1">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </p>
            <p className="font-script text-2xl sm:text-3xl text-[#2F261F] font-bold px-2 py-1 leading-snug">
              {guestName}
            </p>
            <p className="text-[11px] text-[#A08E7F] mt-1 font-sans italic">
              *Mohon maaf bila ada kesalahan penulisan nama/gelar
            </p>
          </div>

          {/* Wax Seal Open Button */}
          <div className="mt-7 flex flex-col items-center justify-center">
            <button
              onClick={handleOpenInvitation}
              className="relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#E5B6A0]/50 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
              aria-label="Buka Undangan Pernikahan"
            >
              {/* Ribbon Ends */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-28 flex justify-center -z-10 pointer-events-none">
                <div className="w-3.5 h-full bg-[#8E2818] shadow-sm transform -rotate-15 rounded-xs" />
                <div className="w-3.5 h-full bg-[#A83622] shadow-sm transform rotate-15 -ml-1 rounded-xs" />
              </div>

              {/* Wax Seal Disk */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 wax-seal rounded-full flex flex-col items-center justify-center text-[#FEE8E1] p-1 shadow-xl">
                <div className="w-full h-full rounded-full border-2 border-dashed border-[#FCA590]/50 flex flex-col items-center justify-center text-center p-1">
                  <Heart className="w-4 h-4 text-[#FDE5DC] mb-0.5 fill-current" />
                  <span className="font-serif font-bold tracking-widest text-[12px] drop-shadow-sm">
                    D & S
                  </span>
                  <span className="text-[8px] uppercase tracking-wider font-sans font-bold text-[#FEE8E1]/90">
                    BUKA
                  </span>
                </div>
              </div>
            </button>

            <span className="text-xs font-sans text-[#7A6755] mt-4 flex items-center gap-1.5 animate-pulse">
              <Mail className="w-3.5 h-3.5 text-[#C26D53]" />
              Ketuk segel lilin untuk membuka undangan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
