"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Navigation, Video, Sparkles, Smile } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import { BotanicalLeaves, TornPaperDivider } from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function EventSection() {
  const { events, dresscode } = WEDDING_DATA;

  return (
    <section id="acara" className="relative py-16 paper-texture overflow-hidden">
      {/* Botanical accents */}
      <BotanicalLeaves className="absolute -top-6 -right-6 w-36 sm:w-44 h-52 opacity-35 -rotate-45 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="font-script text-2xl text-[#B3394B] font-bold block mb-1">
              Catat Tanggal & Jangan Nyasar! 🗺️
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#660F1A] mb-2">
              Rangkaian Acara
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#7D1128]">
              Berikut jadwal keseruan pesta hari bahagia kami yang wajib kamu hadiri:
            </p>
          </div>
        </MotionReveal>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {events.map((event, index) => (
            <MotionReveal
              key={event.id}
              variant={index === 0 ? "slide-left" : "slide-right"}
              delay={0.2 * (index + 1)}
              className="h-full"
            >
              <div className="doodle-box p-6 sm:p-7 relative group flex flex-col justify-between h-full bg-white">
                {/* Cute Washi Tape */}
                <div
                  className={`absolute -top-3.5 ${
                    index === 0 ? "left-6 -rotate-2" : "right-6 rotate-2"
                  } w-26 h-7 washi-tape-cute rounded-xs flex items-center justify-center`}
                >
                  <span className="text-[9px] font-mono font-bold text-[#8A5A10]">
                    {index === 0 ? "★ AKAD NIKAH ★" : "♥ PESTA RESEPSI ♥"}
                  </span>
                </div>

                {/* Event Content */}
                <div>
                  <div className="border-b-2 border-dashed border-[#8A1C2C]/30 pb-4 mb-4 text-center mt-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-script font-bold bg-[#FFF0F3] text-[#7D1128] border border-[#FAD2D8] mb-2">
                      {event.badgeCute}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A0812]">
                      {event.title}
                    </h3>
                  </div>

                  {/* Details list */}
                  <div className="space-y-4 my-5 text-left text-[#5A0B17]">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#7D1128] border border-[#7D1128] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-sans font-bold text-sm text-[#4A0812]">
                          {event.displayDay}, {event.displayDate}
                        </p>
                        <p className="text-xs text-[#9E2A3B] font-sans">
                          Tahun 2026
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#7D1128] border border-[#7D1128] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-sans font-bold text-sm text-[#4A0812]">
                          {event.time}
                        </p>
                        <p className="text-xs text-[#9E2A3B] font-sans">
                          Jangan sampai telat yaa!
                        </p>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#7D1128] border border-[#7D1128] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-sans font-bold text-sm text-[#4A0812]">
                          {event.venueName}
                        </p>
                        <p className="text-xs text-[#7D1128] font-sans leading-relaxed mt-0.5">
                          {event.venueAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 border-t-2 border-dashed border-[#8A1C2C]/30 flex flex-col gap-2">
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doodle-button w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Buka Google Maps (Petunjuk Arah)
                  </a>

                  {index === 0 && (
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doodle-button-alt w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 text-[#7D1128]" />
                      Nonton Live Streaming Akad 📺
                    </a>
                  )}
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

        {/* Dresscode Palette Card */}
        <MotionReveal variant="paper-unfold" delay={0.4}>
          <div className="mt-14 max-w-xl mx-auto doodle-box p-6 sm:p-7 text-center bg-[#FFF0F3]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-script font-bold bg-[#FFE58F] text-[#4A0812] border-1.5 border-[#4A0812] mb-2 rotate-[-1deg]">
              <Sparkles className="w-3.5 h-3.5" />
              Inspirasi Outfit Biar Kembaran! 👗👔
            </div>
            <p className="text-xs sm:text-sm font-sans text-[#7D1128] mb-5 font-medium">
              {dresscode.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {dresscode.colors.map((color) => (
                <div key={color.name} className="flex flex-col items-center group">
                  <motion.div
                    whileHover={{ scale: 1.25, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#4A0812] shadow-[2px_3px_0px_#4A0812] cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[11px] font-mono font-bold text-[#4A0812] mt-1.5 group-hover:text-[#D63D56] transition-colors">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] font-script text-[#9E2A3B] mt-4 flex items-center justify-center gap-1 font-bold">
              <Smile className="w-3.5 h-3.5 text-[#D63D56]" />
              Warna apa aja tetep cakep kok, yang penting dateng bawa senyuman!
            </p>
          </div>
        </MotionReveal>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FFF0F3" />
      </div>
    </section>
  );
}
