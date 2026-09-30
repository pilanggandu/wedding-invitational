"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Navigation, Video, Sparkles } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import {
  CrayonWashiTape,
  KidsDrawingStar,
  KidsDrawingHeart,
  TornPaperDivider,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function EventSection() {
  const { events, dresscode } = WEDDING_DATA;

  return (
    <section id="acara" className="relative py-16 paper-texture bg-[#FFFDF8] overflow-hidden">
      {/* Decorative Doodles */}
      <div className="absolute -top-4 -right-2 pointer-events-none opacity-80">
        <KidsDrawingStar className="w-12 h-12 text-[#FBBF24]" />
      </div>
      <div className="absolute top-1/2 -left-2 pointer-events-none opacity-75">
        <KidsDrawingHeart className="w-9 h-9" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="font-script text-2xl text-[#EF4444] font-bold block mb-1">
              Catat Tanggal & Jangan Nyasar! 🗺️
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#222222] mb-2">
              Rangkaian Acara
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#4B5563]">
              Berikut jadwal keseruan pesta hari bahagia kami yang wajib kamu hadiri:
            </p>
          </div>
        </MotionReveal>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {events.map((event, index) => {
            const isFirst = index === 0;

            return (
              <MotionReveal
                key={event.id}
                variant={isFirst ? "slide-left" : "slide-right"}
                delay={0.2 * (index + 1)}
                className="h-full"
              >
                <div
                  className={`${
                    isFirst ? "crayon-box-yellow" : "crayon-box-pink"
                  } p-6 sm:p-7 relative group flex flex-col justify-between h-full bg-white`}
                >
                  {/* Crayon Washi Tape */}
                  <CrayonWashiTape
                    text={isFirst ? "★ AKAD NIKAH ★" : "♥ PESTA RESEPSI ♥"}
                    color={isFirst ? "yellow" : "pink"}
                    className={`absolute -top-3.5 ${isFirst ? "left-6" : "right-6"} z-20`}
                  />

                  {/* Event Content */}
                  <div>
                    <div className="border-b-2 border-dashed border-[#222222]/20 pb-4 mb-4 text-center mt-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-script font-bold bg-[#FEF08A] text-[#222222] border-2 border-[#222222] mb-2 shadow-[2px_2px_0px_#222222]">
                        {event.badgeCute}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2937]">
                        {event.title}
                      </h3>
                    </div>

                    {/* Details list */}
                    <div className="space-y-4 my-5 text-left text-[#374151]">
                      {/* Date */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FEF08A] text-[#854D0E] border-2 border-[#222222] flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_2px_0px_#222222]">
                          <Calendar className="w-4 h-4 text-[#854D0E]" />
                        </div>
                        <div>
                          <p className="font-sans font-bold text-sm text-[#1F2937]">
                            {event.displayDay}, {event.displayDate}
                          </p>
                          <p className="text-xs text-[#6B7280] font-sans">
                            Tahun 2026
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#BAE6FD] text-[#0369A1] border-2 border-[#222222] flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_2px_0px_#222222]">
                          <Clock className="w-4 h-4 text-[#0369A1]" />
                        </div>
                        <div>
                          <p className="font-sans font-bold text-sm text-[#1F2937]">
                            {event.time}
                          </p>
                          <p className="text-xs text-[#6B7280] font-sans">
                            Jangan sampai telat yaa!
                          </p>
                        </div>
                      </div>

                      {/* Venue */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#BBF7D0] text-[#15803D] border-2 border-[#222222] flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_2px_0px_#222222]">
                          <MapPin className="w-4 h-4 text-[#15803D]" />
                        </div>
                        <div>
                          <p className="font-sans font-bold text-sm text-[#1F2937]">
                            {event.venueName}
                          </p>
                          <p className="text-xs text-[#4B5563] font-sans leading-relaxed mt-0.5">
                            {event.venueAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 border-t-2 border-dashed border-[#222222]/20 flex flex-col gap-2.5">
                    <a
                      href={event.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="crayon-button w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Buka Google Maps (Petunjuk Arah)
                    </a>

                    {isFirst && (
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="crayon-button-alt w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-[#EF4444]" />
                        Nonton Live Streaming Akad 📺
                      </a>
                    )}
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>

        {/* Dresscode Palette Card */}
        <MotionReveal variant="paper-unfold" delay={0.4}>
          <div className="mt-14 max-w-xl mx-auto crayon-box p-6 sm:p-7 text-center bg-[#FEF9E7]">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-script font-bold bg-[#FEF08A] text-[#222222] border-2 border-[#222222] mb-2 rotate-[-1deg] shadow-[2px_2px_0px_#222222]">
              <Sparkles className="w-3.5 h-3.5 text-[#EF4444]" />
              Inspirasi Outfit Biar Kembaran! 👗👔
            </div>
            <p className="text-xs sm:text-sm font-sans text-[#4B5563] mb-5 font-medium">
              {dresscode.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {dresscode.colors.map((color) => (
                <div key={color.name} className="flex flex-col items-center group">
                  <motion.div
                    whileHover={{ scale: 1.25, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#222222] shadow-[2px_3px_0px_#222222] cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[11px] font-mono font-bold text-[#1F2937] mt-2 group-hover:text-[#EF4444] transition-colors">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FEF9E7" />
      </div>
    </section>
  );
}
