"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, Building2, Mail } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  CoupleWalkingIllustration,
  CityBoulevardBackdrop,
} from "./CityscapeIllustrations";
import { SkyAirplane, PastelCloud, VintageStreetLamp } from "./CityscapeDecorations";
import { getFontFamilyCss } from "@/lib/typography";

interface CityscapeDesktopLeftProps {
  isOpened?: boolean;
  onOpen?: () => void;
}

export function CityscapeDesktopLeft({
  isOpened,
  onOpen,
}: CityscapeDesktopLeftProps) {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const akadEvent = data.events[0] || {
    time: "08:00 - 10:00 WIB",
    displayDay: "Sabtu",
    displayDate: "21 November 2026",
    venueAddress: "Merakurak, Tuban",
  };
  const receptionEvent = data.events[1] || akadEvent;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(
      data.countdownTarget || "2026-11-21T08:00:00+07:00"
    ).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data.countdownTarget]);

  return (
    <div
      onWheel={(e) => {
        if (!isOpened && onOpen && e.deltaY > 15) {
          onOpen();
        } else {
          window.scrollBy({ top: e.deltaY, behavior: "auto" });
        }
      }}
      className="hidden lg:flex lg:w-[48%] xl:w-[50%] lg:h-screen lg:sticky lg:top-0 p-8 xl:p-12 flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#1D78A0] via-[#2E8BC0] to-[#0C4A60] text-white border-r-[4px] border-[#0A3B4D] shadow-2xl relative select-none"
    >
      {/* Sky & Airplane Drift */}
      <SkyAirplane className="top-8 left-10" />
      <PastelCloud className="w-36 h-16 absolute top-12 right-12 opacity-35" delay={0} />
      <PastelCloud className="w-28 h-12 absolute top-28 left-8 opacity-25" delay={3} />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white/15 backdrop-blur-md text-[#FFE58F] border border-white/20 shadow-xs mb-3">
          <Building2 className="w-3.5 h-3.5 text-[#FFE58F]" />
          <span>Cityscape Romance: {groom.name} & {bride.name}</span>
        </div>

        <h1
          style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
          className="font-couple-title font-handwriting text-6xl xl:text-7xl text-white drop-shadow-md my-1 leading-tight tracking-wide"
        >
          {groom.name} <span className="font-script text-4xl text-[#FFE58F]">&</span> {bride.name}
        </h1>

        <p className="font-script text-xl xl:text-2xl text-[#E8F4F8] font-bold mt-1 max-w-md leading-relaxed">
          &ldquo;Dua langkah di tengah riuhnya kota, bertemu dalam satu cerita cinta yang abadi.&rdquo;
        </p>

        <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-mono font-bold">
          <span className="bg-black/25 backdrop-blur-xs text-[#FFE58F] px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#FFE58F]" />
            {akadEvent.displayDay || "Sabtu"}, {akadEvent.displayDate || "21 November 2026"}
          </span>
          <span className="bg-black/25 backdrop-blur-xs text-[#E8F4F8] px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#75BBE3]" />
            {akadEvent.venueAddress || "Merakurak, Tuban"}
          </span>
        </div>
      </div>

      {/* Middle: Live Vector Promenade Card Showcase */}
      <div className="my-5 relative z-10 flex items-center gap-6 bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-xl overflow-hidden">
        {/* Vector Couple Walk in Miniature Showcase */}
        <div className="relative w-40 h-52 shrink-0 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md bg-gradient-to-b from-[#BFE1F4] via-[#DCEDF8] to-[#F1F8FC] flex items-end justify-center p-2">
          <CoupleWalkingIllustration className="w-full h-auto max-w-[140px]" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="bg-white/15 p-3 rounded-2xl border border-white/15">
            <span className="text-[10px] font-mono uppercase text-[#FFE58F] block font-bold">Akad Nikah</span>
            <p className="text-xs font-script font-bold text-white mt-0.5">
              {akadEvent.time} • {akadEvent.venueName || "Kediaman Mempelai"}
            </p>
          </div>

          <div className="bg-white/15 p-3 rounded-2xl border border-white/15">
            <span className="text-[10px] font-mono uppercase text-[#FFE58F] block font-bold">Resepsi Pernikahan</span>
            <p className="text-xs font-script font-bold text-white mt-0.5">
              {receptionEvent.time} • {receptionEvent.venueName || "Gedung Serbaguna"}
            </p>
          </div>

          {/* Countdown Grid in Frosted Glass */}
          <div className="pt-1">
            <span className="text-[11px] font-mono text-white/90 block mb-1.5 font-bold">
              ⏰ Hitung Mundur Menuju Hari Bahagia:
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
              <div className="bg-white/20 p-1.5 rounded-xl border border-white/20">
                <span className="text-base font-black text-[#FFE58F] block">{timeLeft.days}</span>
                <span className="text-[9px] uppercase text-white/80 font-bold">Hari</span>
              </div>
              <div className="bg-white/20 p-1.5 rounded-xl border border-white/20">
                <span className="text-base font-black text-[#FFE58F] block">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase text-white/80 font-bold">Jam</span>
              </div>
              <div className="bg-white/20 p-1.5 rounded-xl border border-white/20">
                <span className="text-base font-black text-[#FFE58F] block">{timeLeft.minutes}</span>
                <span className="text-[9px] uppercase text-white/80 font-bold">Menit</span>
              </div>
              <div className="bg-white/20 p-1.5 rounded-xl border border-white/20">
                <span className="text-base font-black text-[#FFE58F] block">{timeLeft.seconds}</span>
                <span className="text-[9px] uppercase text-white/80 font-bold">Detik</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: City Skyline Silhouette & Action */}
      <div className="relative z-10 pt-2 flex items-center justify-between">
        {!isOpened && onOpen && (
          <button
            onClick={onOpen}
            className="px-6 py-3 rounded-full bg-[#38B6FF] hover:bg-[#209CEE] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-2 border-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-white animate-bounce" />
            <span>Buka Undangan 💌</span>
          </button>
        )}

        {data.general?.hashtag && (
          <div className="text-[11px] font-mono font-bold text-[#FFE58F] ml-auto">
            {data.general.hashtag}
          </div>
        )}
      </div>
    </div>
  );
}
