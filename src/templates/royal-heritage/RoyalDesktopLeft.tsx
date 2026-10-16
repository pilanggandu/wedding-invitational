"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Image as ImageIcon,
  Gift,
  Heart,
  Sparkles,
} from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { getFontFamilyCss } from "@/lib/typography";
import {
  RoyalMonogram,
  CornerFiligree,
  DividerOrnament,
  BismillahCalligraphy,
} from "./RoyalDecorations";
import { RoyalAmbientParticles } from "./RoyalAmbientParticles";

interface RoyalDesktopLeftProps {
  isOpened?: boolean;
  onOpen?: () => void;
}

export function RoyalDesktopLeft({ isOpened, onOpen }: RoyalDesktopLeftProps) {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const akadEvent = data.events[0] || {
    time: "08:00 - 10:00 WIB",
    displayDay: "Sabtu",
    displayDate: "21 November 2026",
    venueAddress:
      "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
    venueName: "Kediaman Mempelai Wanita",
    mapUrl: "https://maps.google.com/?q=-6.8943,111.9845",
  };

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string>("Tamu Terhormat");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const toParam = urlParams.get("to") || urlParams.get("u");
      if (toParam) {
        setRecipient(decodeURIComponent(toParam.replace(/\+/g, " ")));
      }
    }
  }, []);

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

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCalendar = () => {
    const title = encodeURIComponent(
      `Pernikahan ${groom.name} & ${bride.name}`
    );
    const details = encodeURIComponent(
      `Walimatul 'Ursy Pernikahan ${groom.fullName || groom.name} & ${bride.fullName || bride.name}`
    );
    const location = encodeURIComponent(akadEvent.venueAddress);
    const dates = "20261121T010000Z/20261121T050000Z";
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleUrl, "_blank");
  };

  return (
    <aside
      onWheel={(e) => {
        if (!isOpened && onOpen && e.deltaY > 15) {
          onOpen();
        } else {
          window.scrollBy({ top: e.deltaY, behavior: "auto" });
        }
      }}
      className="hidden lg:flex lg:w-[48%] xl:w-[50%] lg:h-screen lg:max-h-screen lg:sticky lg:top-0 lg:shrink-0 bg-[#061812] text-[#FAF8F5] flex-col justify-between p-5 xl:p-8 relative overflow-y-auto scrollbar-none select-none border-r border-[#C8A97E]/30"
    >
      {/* Serene Ambient Gold Dust Particles */}
      <RoyalAmbientParticles count={16} className="z-0" />

      {/* Layered Architectural Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
        <RoyalMonogram className="w-[850px] h-[850px]" color="#C8A97E" />
      </div>

      {/* Outer Viewport Corner Baroque Accents */}
      <CornerFiligree
        className="absolute top-4 left-4 w-7 h-7 pointer-events-none opacity-40"
        position="top-left"
        color="#C8A97E"
      />
      <CornerFiligree
        className="absolute bottom-4 left-4 w-7 h-7 pointer-events-none opacity-40"
        position="bottom-left"
        color="#C8A97E"
      />

      {/* Top Header: Monogram Emblem & Ceremonial Title */}
      <header className="relative z-10 flex items-center justify-between pb-3 border-b border-[#C8A97E]/20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-full border border-[#C8A97E]/40 bg-[#09221B] shadow-xs">
            <RoyalMonogram className="w-8 h-8 xl:w-9 xl:h-9" color="#C8A97E" />
          </div>
          <div>
            <span className="text-[10px] font-serif uppercase tracking-[0.28em] text-[#C8A97E] block font-semibold leading-tight">
              Walimatul &lsquo;Ursy
            </span>
            <span className="text-[10px] font-sans tracking-[0.18em] text-[#E8D7B8]/75 uppercase leading-tight">
              The Royal Heritage Ceremony
            </span>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A261E] border border-[#C8A97E]/30 text-[10px] font-serif tracking-wider text-[#C8A97E]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOpened ? "bg-emerald-400" : "bg-[#C8A97E] animate-pulse"
            }`}
          />
          <span>{isOpened ? "Undangan Terbuka" : "Warkah Resmi"}</span>
        </div>
      </header>

      {/* Main Centerpiece: Grand Heraldic Portal (Kubah Mahligai Pusaka) */}
      <div className="relative z-10 max-w-md mx-auto w-full my-auto py-3">
        <div className="relative rounded-t-[150px] rounded-b-2xl border-2 border-[#C8A97E]/60 p-6 xl:p-7 bg-gradient-to-b from-[#0B2A20]/95 via-[#082018]/95 to-[#061913]/95 backdrop-blur-md shadow-[0_24px_70px_rgba(0,0,0,0.65)] text-center space-y-3">
          {/* Inner Hairline Gold Border */}
          <div className="absolute inset-2 rounded-t-[142px] rounded-b-xl border border-[#C8A97E]/30 pointer-events-none" />

          {/* Corner Filigrees on Bottom Corners */}
          <CornerFiligree
            className="absolute bottom-2.5 left-2.5 w-5 h-5"
            position="bottom-left"
            color="#C8A97E"
          />
          <CornerFiligree
            className="absolute bottom-2.5 right-2.5 w-5 h-5"
            position="bottom-right"
            color="#C8A97E"
          />

          {/* Top Pinnacle: Royal Monogram Crest */}
          <div className="pt-1 flex justify-center">
            <div className="relative">
              <RoyalMonogram className="w-16 h-16 xl:w-20 xl:h-20 mx-auto" color="#C8A97E" />
              <div className="absolute inset-0 bg-[#C8A97E]/10 rounded-full blur-xl pointer-events-none" />
            </div>
          </div>

          {/* Bismillah Calligraphy */}
          <div className="py-0.5">
            <BismillahCalligraphy className="w-auto mx-auto" color="#C8A97E" />
          </div>

          {/* Couple Full Names in Classical Dignified Serif */}
          <div className="space-y-0.5 pt-0.5">
            <span className="text-[9px] font-serif uppercase tracking-[0.28em] text-[#C8A97E] block font-medium">
              Syukuran Pernikahan Putra-Putri
            </span>

            <h1
              style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
              className="font-couple-title font-serif text-2xl xl:text-3xl text-[#FAF8F5] tracking-tight font-normal leading-tight"
            >
              {groom.fullName || groom.name}
            </h1>

            <div className="flex items-center justify-center gap-2.5 py-0.5">
              <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#C8A97E]/50" />
              <span className="font-serif italic text-sm text-[#C8A97E]">&amp;</span>
              <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#C8A97E]/50" />
            </div>

            <h2
              style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
              className="font-couple-title font-serif text-2xl xl:text-3xl text-[#FAF8F5] tracking-tight font-normal leading-tight"
            >
              {bride.fullName || bride.name}
            </h2>
          </div>

          {/* Ceremony Day, Date & City */}
          <p className="text-[11px] font-serif tracking-[0.2em] text-[#E8D7B8] uppercase">
            {akadEvent.displayDay}, {akadEvent.displayDate}
          </p>

          <DividerOrnament className="w-32 mx-auto my-1.5" color="#C8A97E" />

          {/* Quran Quote Excerpt Card */}
          <div className="p-2.5 rounded-xl bg-[#051610]/80 border border-[#C8A97E]/25 text-center space-y-0.5">
            <p className="font-serif text-[11px] text-[#E8D7B8]/90 italic leading-relaxed">
              &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu...&rdquo;
            </p>
            <span className="text-[9px] font-serif uppercase tracking-widest text-[#C8A97E] block font-medium">
              (QS. Ar-Rum: 21)
            </span>
          </div>

          {/* Countdown Pedestals */}
          <div className="grid grid-cols-4 gap-2 pt-0.5 text-center">
            {[
              { val: timeLeft.days, unit: "Hari" },
              { val: timeLeft.hours, unit: "Jam" },
              { val: timeLeft.minutes, unit: "Menit" },
              { val: timeLeft.seconds, unit: "Detik" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{
                  y: -2,
                  borderColor: "rgba(200, 169, 126, 0.7)",
                  boxShadow: "0 6px 20px rgba(200,169,126,0.18)",
                }}
                transition={{ duration: 0.2 }}
                className="p-2 rounded-lg bg-[#051610]/90 border border-[#C8A97E]/30 cursor-default"
              >
                <span className="font-serif text-lg xl:text-xl font-bold text-[#FAF8F5] block leading-none">
                  {item.val}
                </span>
                <span className="text-[8px] font-serif uppercase tracking-widest text-[#C8A97E] block mt-1">
                  {item.unit}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Contextual Action Area: Interactive based on isOpened state */}
          <div className="pt-1">
            {!isOpened ? (
              <div className="space-y-2.5">
                {/* Personalized Guest Badge */}
                <div className="px-3 py-1 rounded-lg bg-[#051610]/60 border border-[#C8A97E]/20 text-[10px] text-[#E8D7B8]/80 font-sans">
                  Undangan Ditujukan Kepada:{" "}
                  <span className="font-serif font-bold text-[#FAF8F5]">
                    {recipient}
                  </span>
                </div>

                {onOpen && (
                  <motion.button
                    onClick={onOpen}
                    whileHover={{
                      scale: 1.025,
                      boxShadow: "0 10px 30px rgba(200,169,126,0.45)",
                    }}
                    whileTap={{ scale: 0.975 }}
                    className="w-full py-3 px-5 rounded-xl bg-[#C8A97E] hover:bg-[#B8986D] text-[#071913] font-serif text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-[0_6px_20px_rgba(200,169,126,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#071913]" />
                    <span>Buka Lembaran Undangan</span>
                  </motion.button>
                )}
              </div>
            ) : (
              /* Opened State: Navigation Shortcuts & Calendar Reminders */
              <div className="space-y-2 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <motion.button
                    onClick={handleCalendar}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-2 px-3 rounded-lg bg-[#C8A97E] text-[#071913] font-serif font-semibold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Simpan Kalender</span>
                  </motion.button>

                  <motion.a
                    href={akadEvent.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-2 px-3 rounded-lg border border-[#C8A97E] hover:bg-[#0E3329] text-[#FAF8F5] font-serif font-medium text-[10px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-[#C8A97E]" />
                    <span>Petunjuk Lokasi</span>
                  </motion.a>
                </div>

                {/* Section Quick Jump Anchors */}
                <div className="pt-0.5 flex items-center justify-center gap-1.5 flex-wrap text-[9px] font-serif tracking-wider text-[#C8A97E]/80">
                  <button
                    onClick={() => handleScrollTo("events")}
                    className="px-2 py-0.5 rounded-md bg-[#051610] hover:bg-[#0E3329] border border-[#C8A97E]/25 cursor-pointer transition-colors"
                  >
                    Rangkaian Acara
                  </button>
                  <button
                    onClick={() => handleScrollTo("gallery")}
                    className="px-2 py-0.5 rounded-md bg-[#051610] hover:bg-[#0E3329] border border-[#C8A97E]/25 cursor-pointer transition-colors"
                  >
                    Potret Bahagia
                  </button>
                  <button
                    onClick={() => handleScrollTo("gifts")}
                    className="px-2 py-0.5 rounded-md bg-[#051610] hover:bg-[#0E3329] border border-[#C8A97E]/25 cursor-pointer transition-colors"
                  >
                    Amplop Digital
                  </button>
                  <button
                    onClick={() => handleScrollTo("rsvp")}
                    className="px-2 py-0.5 rounded-md bg-[#051610] hover:bg-[#0E3329] border border-[#C8A97E]/25 cursor-pointer transition-colors"
                  >
                    Kirim Doa RSVP
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section: Share Link & Family Dedication */}
      <footer className="relative z-10 flex items-center justify-between pt-3 border-t border-[#C8A97E]/20 text-xs text-[#E8D7B8]/70 shrink-0">
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 hover:text-[#C8A97E] transition-colors cursor-pointer text-xs"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[#C8A97E]" />
          )}
          <span>{isCopied ? "Tautan Berhasil Disalin" : "Salin Tautan Undangan"}</span>
        </motion.button>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#E8D7B8]/60 font-sans hidden xl:inline">
            Beserta Keluarga Besar Kedua Mempelai
          </span>
          {data.general?.hashtag && (
            <span className="font-serif italic text-xs text-[#C8A97E] tracking-wider font-semibold">
              {data.general.hashtag}
            </span>
          )}
        </div>
      </footer>
    </aside>
  );
}

export default RoyalDesktopLeft;
