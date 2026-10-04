"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  CreditCard,
  Copy,
  Check,
  Send,
  Building2,
  Navigation,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { TemplateProps } from "@/templates/types";
import { CityscapeCover } from "./CityscapeCover";
import { CityscapeDesktopLeft } from "./CityscapeDesktopLeft";
import {
  SkyAirplane,
  PastelCloud,
  CitySkylineSvg,
  VintageStreetLamp,
  ParkBushes,
} from "./CityscapeDecorations";
import { NavigationDock } from "@/components/NavigationDock";
import { AudioPlayer } from "@/components/AudioPlayer";
import { RsvpSection } from "@/components/RsvpSection";

// ----------------------------------------------------------------------
// Internal Section Components for Cityscape Template
// ----------------------------------------------------------------------

function CityscapeHero() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const akadEvent = data.events[0] || {
    displayDay: "Sabtu",
    displayDate: "21 November 2026",
    venueAddress: "Merakurak, Tuban",
    time: "08:00 - 10:00 WIB",
  };

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
    <section id="beranda" className="relative pt-12 pb-16 px-4 bg-gradient-to-b from-[#CBE6F6] via-[#E8F4F8] to-[#FFFFFF] overflow-hidden text-center">
      {/* Sky & Airplane Drift */}
      <SkyAirplane className="top-4 left-4" />
      <PastelCloud className="w-28 h-12 absolute top-8 right-4 opacity-70" delay={1} />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-white/80 text-[#1D78A0] border border-sky-100 shadow-xs mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#2E8BC0]" />
          <span>The Wedding Celebration</span>
        </div>

        <h1 className="font-handwriting text-5xl sm:text-6xl text-[#1D78A0] tracking-wide my-1">
          {groom.name} <span className="font-script text-3xl sm:text-4xl text-[#38B6FF]">&</span> {bride.name}
        </h1>

        <p className="font-script text-base sm:text-lg text-[#2E8BC0] font-bold max-w-sm mx-auto mb-4">
          &ldquo;{data.general?.funTagline || "Menemukan cinta di antara jutaan cerita di kota ini."}&rdquo;
        </p>

        {/* Hero Artwork Frame */}
        <div className="relative w-full max-w-[280px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-xl my-4">
          <Image
            src="/templates/cityscape-cover.jpeg"
            alt={`${groom.name} & ${bride.name}`}
            fill
            className="object-cover object-top"
          />
        </div>

        {/* Date & Location Pill */}
        <div className="inline-block bg-[#1D78A0] text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-md my-2">
          📅 {akadEvent.displayDay}, {akadEvent.displayDate} • {akadEvent.venueAddress}
        </div>

        {/* Modern Frosted Countdown Box */}
        <div className="mt-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-sky-100 shadow-md">
          <span className="text-xs font-mono font-bold text-[#1D78A0] block mb-2.5">
            ⏰ Menuju Ijab Kabul & Pesta Bahagia:
          </span>
          <div className="grid grid-cols-4 gap-2 font-mono">
            <div className="bg-[#F0F8FF] p-2 rounded-xl border border-sky-200">
              <span className="text-xl font-black text-[#1D78A0] block">{timeLeft.days}</span>
              <span className="text-[10px] text-slate-500 uppercase">Hari</span>
            </div>
            <div className="bg-[#F0F8FF] p-2 rounded-xl border border-sky-200">
              <span className="text-xl font-black text-[#1D78A0] block">{timeLeft.hours}</span>
              <span className="text-[10px] text-slate-500 uppercase">Jam</span>
            </div>
            <div className="bg-[#F0F8FF] p-2 rounded-xl border border-sky-200">
              <span className="text-xl font-black text-[#1D78A0] block">{timeLeft.minutes}</span>
              <span className="text-[10px] text-slate-500 uppercase">Menit</span>
            </div>
            <div className="bg-[#F0F8FF] p-2 rounded-xl border border-sky-200">
              <span className="text-xl font-black text-[#1D78A0] block">{timeLeft.seconds}</span>
              <span className="text-[10px] text-slate-500 uppercase">Detik</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CityscapeCouple() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const quote = data.general?.quote;

  return (
    <section id="mempelai" className="relative py-14 px-4 bg-[#F8FCFD] overflow-hidden">
      <div className="max-w-md mx-auto relative z-10 text-center">
        {/* Quranic Verse / Blessing */}
        {quote && (
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm mb-10 text-center">
            <div className="w-9 h-9 mx-auto -mt-9 mb-2 rounded-full bg-[#2E8BC0] text-white flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 fill-current text-white" />
            </div>
            <p className="font-serif text-sm text-[#0C4A60] leading-relaxed mb-2" dir="rtl">
              {quote.arabic}
            </p>
            <p className="font-script text-xs sm:text-sm text-[#1D78A0] font-bold leading-relaxed">
              &ldquo;{quote.translation}&rdquo;
            </p>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">
              ({quote.source})
            </span>
          </div>
        )}

        <span className="text-xs font-mono font-bold text-[#2E8BC0] uppercase tracking-wider block mb-1">
          Dua Hati yang Bertemu
        </span>
        <h2 className="font-handwriting text-4xl text-[#0C4A60] mb-8">
          Pasangan Mempelai
        </h2>

        {/* Groom Profile */}
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-sm text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#E8F4F8] border-3 border-[#2E8BC0] flex items-center justify-center text-3xl mb-3 shadow-inner">
            👨‍💼
          </div>
          <h3 className="font-handwriting text-3xl text-[#1D78A0]">
            {groom.name}
          </h3>
          <p className="font-sans font-bold text-xs text-[#0C4A60] mt-0.5">
            {groom.fullName}
          </p>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            {groom.parents}
          </p>
          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F8FF] text-[#1D78A0] border border-sky-200 text-xs font-mono font-bold mt-3 hover:bg-sky-100 transition-colors"
            >
              <span>@{groom.instagram}</span>
            </a>
          )}
        </div>

        {/* Bride Profile */}
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-sm text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF0F3] border-3 border-[#38B6FF] flex items-center justify-center text-3xl mb-3 shadow-inner">
            👰‍♀️
          </div>
          <h3 className="font-handwriting text-3xl text-[#1D78A0]">
            {bride.name}
          </h3>
          <p className="font-sans font-bold text-xs text-[#0C4A60] mt-0.5">
            {bride.fullName}
          </p>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            {bride.parents}
          </p>
          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F8FF] text-[#1D78A0] border border-sky-200 text-xs font-mono font-bold mt-3 hover:bg-sky-100 transition-colors"
            >
              <span>@{bride.instagram}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function CityscapeEvents() {
  const data = useWeddingData();
  const { events, dresscode } = data;

  return (
    <section id="acara" className="relative py-14 px-4 bg-gradient-to-b from-[#FFFFFF] via-[#E8F4F8] to-[#CBE6F6] overflow-hidden">
      <div className="max-w-md mx-auto relative z-10 text-center">
        <span className="text-xs font-mono font-bold text-[#1D78A0] uppercase tracking-wider block mb-1">
          Rangkaian Acara di Kota Kami
        </span>
        <h2 className="font-handwriting text-4xl text-[#0C4A60] mb-8">
          Waktu & Lokasi Acara
        </h2>

        <div className="space-y-6">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-md text-center relative overflow-hidden"
            >
              {/* Skyline Banner Header */}
              <div className="h-10 -mx-6 -mt-6 bg-[#1D78A0] text-white flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest mb-4">
                {idx === 0 ? "🏙️ Akad Nikah" : "✨ Resepsi Pernikahan"}
              </div>

              <h3 className="font-sans font-extrabold text-lg text-[#0C4A60]">
                {evt.title}
              </h3>
              <p className="text-xs font-mono font-bold text-[#2E8BC0] mt-1">
                {evt.displayDay}, {evt.displayDate}
              </p>
              <p className="text-xs font-mono text-slate-600 mt-1">
                ⏰ {evt.time}
              </p>

              <div className="my-4 pt-3 border-t border-sky-100">
                <p className="font-sans font-bold text-xs text-[#0C4A60]">
                  {evt.venueName}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {evt.venueAddress}
                </p>
              </div>

              {evt.mapUrl && (
                <a
                  href={evt.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E8BC0] hover:bg-[#1D78A0] text-white text-xs font-mono font-bold shadow-md transition-transform hover:scale-105"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FFE58F]" />
                  <span>Buka Google Maps</span>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Dresscode Palette */}
        {dresscode?.colors && dresscode.colors.length > 0 && (
          <div className="mt-8 bg-white/90 p-5 rounded-2xl border border-sky-200 shadow-xs">
            <span className="text-xs font-mono font-bold text-[#1D78A0] uppercase block mb-1">
              🎨 Rekomendasi Dress Code Tamu
            </span>
            <p className="text-[11px] text-slate-600 mb-3">
              {dresscode.description || "Sentuhan nuansa elegan modern perkotaan:"}
            </p>
            <div className="flex justify-center items-center gap-3">
              {dresscode.colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] font-mono text-slate-600">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CityscapeGifts() {
  const data = useWeddingData();
  const { accounts, physicalGiftAddress } = data.gifts;
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (num: string, idx: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIdx(idx);
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ["#2E8BC0", "#FFE58F", "#38B6FF"],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  return (
    <section id="hadiah" className="relative py-14 px-4 bg-[#F5FAFC] overflow-hidden">
      <div className="max-w-md mx-auto relative z-10 text-center">
        <span className="text-xs font-mono font-bold text-[#1D78A0] uppercase tracking-wider block mb-1">
          Tanda Kasih & Amplop Digital
        </span>
        <h2 className="font-handwriting text-4xl text-[#0C4A60] mb-2">
          Kado Pernikahan
        </h2>
        <p className="text-xs text-slate-600 max-w-xs mx-auto mb-6 leading-relaxed">
          Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika hendak memberikan tanda kasih, dapat melalui:
        </p>

        <div className="space-y-4">
          {accounts.map((acc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border-2 border-sky-100 shadow-sm text-left flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#1D78A0] block">
                  {acc.bankName} • {acc.cuteLabel || "Rekening Hadiah"}
                </span>
                <p className="font-mono font-black text-base text-[#0C4A60] tracking-wider my-0.5">
                  {acc.accountNumber}
                </p>
                <p className="text-xs text-slate-500">{acc.accountHolder}</p>
              </div>

              <button
                onClick={() => handleCopy(acc.accountNumber, idx)}
                className="px-3.5 py-2 rounded-xl bg-[#2E8BC0] hover:bg-[#1D78A0] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIdx === idx ? "Tersalin!" : "Salin"}</span>
              </button>
            </div>
          ))}

          {physicalGiftAddress?.address && (
            <div className="bg-white rounded-2xl p-5 border border-sky-100 text-left">
              <span className="text-xs font-mono font-bold text-[#1D78A0] block mb-1">
                📦 Pengiriman Kado Fisik
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {physicalGiftAddress.address}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CityscapeFooter() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <footer className="relative pt-12 pb-24 px-4 bg-gradient-to-b from-[#1D78A0] to-[#0A3B4D] text-white text-center overflow-hidden">
      {/* Background Skyline Silhouette */}
      <div className="absolute inset-x-0 bottom-0 h-32 opacity-20 pointer-events-none">
        <CitySkylineSvg className="w-full h-full" color="#FFFFFF" />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/15 text-[#FFE58F] border border-white/20 mb-3">
          Terima Kasih Banyak
        </span>

        <p className="text-xs text-sky-100 max-w-sm mx-auto leading-relaxed mb-6">
          {data.general?.closingMessage ||
            "Merupakan kehormatan dan kebahagiaan bagi kami atas kehadiran dan doa restu Anda."}
        </p>

        <h3 className="font-handwriting text-5xl text-white my-1">
          {groom.name} <span className="font-script text-3xl text-[#FFE58F]">&</span> {bride.name}
        </h3>

        <div className="mt-3 text-xs font-mono text-[#FFE58F]">
          {data.general?.hashtag || "#GilangSalsaHalal"}
        </div>
      </div>
    </footer>
  );
}

// ----------------------------------------------------------------------
// Main Cityscape Template Component
// ----------------------------------------------------------------------

export function CityscapeTemplate({
  data,
  guestName,
  isPreview = false,
  onOpenChange,
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState<boolean>(isPreview);

  useEffect(() => {
    if (isPreview) {
      setIsOpened(true);
    }
  }, [isPreview]);

  const handleOpen = () => {
    setIsOpened(true);
    onOpenChange?.(true);
  };

  return (
    <WeddingDataProvider data={data}>
      <div className="min-h-screen bg-[#EBF4F8] flex flex-col lg:flex-row relative">
        {/* Desktop Left Showcase (only when not in miniature preview) */}
        {!isPreview && (
          <CityscapeDesktopLeft isOpened={isOpened} onOpen={handleOpen} />
        )}

        {/* Right Side: Phone mockup frame on desktop, Full native on mobile */}
        <div
          className={`w-full ${
            isPreview ? "w-full" : "lg:w-[52%] xl:w-[50%]"
          } min-h-screen flex justify-center py-0 ${
            isPreview ? "p-0" : "lg:py-8 lg:px-6"
          } bg-[#EBF4F8] relative`}
        >
          <main
            className={`w-full max-w-full ${
              isPreview ? "max-w-full" : "lg:max-w-[480px]"
            } min-h-screen bg-white ${
              isPreview
                ? "rounded-2xl border-2 border-[#1D78A0]"
                : "lg:rounded-[44px] lg:border-[5px] lg:border-[#1D78A0] lg:shadow-[0_12px_36px_rgba(29,120,160,0.3)]"
            } relative overflow-clip flex flex-col`}
          >
            {/* Top Phone Camera / Speaker Notch (Desktop View Only) */}
            {!isPreview && (
              <div className="hidden lg:flex justify-between items-center px-6 py-2.5 bg-[#1D78A0] text-white shrink-0">
                <span className="text-[11px] font-mono font-bold text-[#FFE58F]">
                  12:12 🏙️
                </span>
                <div className="w-20 h-3.5 bg-[#0C4A60] rounded-full flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38B6FF]" />
                  <span className="w-6 h-1 rounded-full bg-[#2E8BC0]" />
                </div>
                <span className="text-[10px] font-mono text-[#E8F4F8]">
                  100% 🔋
                </span>
              </div>
            )}

            {/* Cityscape Cover Screen (Replicating TikTok Video) */}
            <AnimatePresence mode="wait">
              {!isOpened && (
                <CityscapeCover
                  key="cityscape-cover"
                  isOpen={isOpened}
                  onOpen={handleOpen}
                  initialGuestName={guestName}
                />
              )}
            </AnimatePresence>

            {/* Main Invitation Content Once Opened */}
            {isOpened && (
              <div className="animate-in fade-in duration-1000 flex flex-col flex-1 relative bg-white">
                <CityscapeHero />
                <CityscapeCouple />
                <CityscapeEvents />
                <CityscapeGifts />
                <RsvpSection />
                <CityscapeFooter />

                {/* Floating Navigation & Audio Player */}
                <NavigationDock />
                <AudioPlayer autoPlayTrigger={isOpened} />
              </div>
            )}
          </main>
        </div>
      </div>
    </WeddingDataProvider>
  );
}

export default CityscapeTemplate;
