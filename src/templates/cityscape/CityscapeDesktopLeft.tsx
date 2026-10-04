"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, Heart, Building2, Send } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  SkyAirplane,
  PastelCloud,
  CitySkylineSvg,
  VintageStreetLamp,
  ParkBushes,
} from "./CityscapeDecorations";

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
      <PastelCloud className="w-36 h-16 absolute top-12 right-12 opacity-40" delay={0} />
      <PastelCloud className="w-28 h-12 absolute top-28 left-8 opacity-30" delay={3} />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white/15 backdrop-blur-xs text-[#FFE58F] border border-white/20 shadow-xs mb-3">
          <Building2 className="w-3.5 h-3.5 text-[#FFE58F]" />
          <span>Cityscape Romance: {groom.name} & {bride.name}</span>
        </div>

        <h1 className="font-handwriting text-6xl xl:text-7xl text-white drop-shadow-md my-1 leading-tight tracking-wide">
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

      {/* Middle: Promenade Artwork Spotlight Card */}
      <div className="my-5 relative z-10 flex items-center gap-6 bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-xl">
        <div className="relative w-36 h-48 shrink-0 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md">
          <Image
            src="/templates/cityscape-cover.jpeg"
            alt="Cityscape Walk"
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="bg-white/15 p-3 rounded-2xl border border-white/15">
            <span className="text-[10px] font-mono uppercase text-[#FFE58F] block">Akad Nikah</span>
            <p className="text-xs font-script font-bold text-white mt-0.5">
              {akadEvent.time} • {akadEvent.venueName || "Kediaman Mempelai"}
            </p>
          </div>

          <div className="bg-white/15 p-3 rounded-2xl border border-white/15">
            <span className="text-[10px] font-mono uppercase text-[#FFE58F] block">Resepsi Pernikahan</span>
            <p className="text-xs font-script font-bold text-white mt-0.5">
              {receptionEvent.time} • {receptionEvent.venueName || "Gedung Serbaguna"}
            </p>
          </div>

          {/* Countdown Grid in Frosted Glass */}
          <div className="pt-1">
            <span className="text-[11px] font-mono text-white/80 block mb-1.5">
              ⏰ Hitung Mundur Hari Bahagia:
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
              <div className="bg-white/20 p-1.5 rounded-xl border border-white/20">
                <span className="text-base font-extrabold text-[#FFE58F] block">{timeLeft.days}</span>
                <span className="text-[9px] uppercase text-white/80">Hari</span>
              </div>
              <div className="bg-white/20 p-1.5 rounded-xl border border-white/20">
                <span className="text-base font-extrabold text-[#FFE58F] block">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase text-white/80">Jam</span>
              </div>
              <div className="bg-white/20 p-1.5 rounded-xl border border-white/20">
                <span className="text-base font-extrabold text-[#FFE58F] block">{timeLeft.minutes}</span>
                <span className="text-[9px] uppercase text-white/80">Menit</span>
              </div>
              <div className="bg-white/20 p-1.5 rounded-xl border border-white/20">
                <span className="text-base font-extrabold text-[#FFE58F] block">{timeLeft.seconds}</span>
                <span className="text-[9px] uppercase text-white/80">Detik</span>
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
            className="px-5 py-2.5 rounded-full bg-[#38B6FF] hover:bg-[#209CEE] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/40 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <span>Buka Undangan Sekarang 💌</span>
          </button>
        )}

        <div className="text-[11px] font-mono text-white/70 ml-auto">
          {data.general?.hashtag || "#GilangSalsaHalal"}
        </div>
      </div>

      {/* Skyline Silhouette Background Anchor */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none opacity-30">
        <CitySkylineSvg className="w-full h-full" color="#FFFFFF" />
      </div>
    </div>
  );
}
