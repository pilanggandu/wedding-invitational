"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Navigation, Video } from "lucide-react";
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
            <span className="font-serif italic text-xs tracking-widest uppercase text-[#947358] block mb-1">
              Waktu & Lokasi
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#3A3027] mb-2">
              Rangkaian Acara
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#786452]">
              Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada:
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
              <div className="paper-sheet rounded-2xl p-6 sm:p-7 border border-[#DECBB4] shadow-md relative group flex flex-col justify-between h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Paper Washi Tape */}
                <div
                  className={`absolute -top-3 ${
                    index === 0 ? "left-6 -rotate-2" : "right-6 rotate-2"
                  } w-24 h-6 washi-tape opacity-90`}
                />

                {/* Event Content */}
                <div>
                  <div className="border-b border-[#E7D6C1] pb-4 mb-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase bg-[#F5EDE1] text-[#9A5B46] mb-2">
                      {event.subTitle}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#352B24]">
                      {event.title}
                    </h3>
                  </div>

                  {/* Details list */}
                  <div className="space-y-3.5 my-5 text-left text-[#564536]">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F5EDE1] text-[#9A5B46] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-sm text-[#352B24]">
                          {event.displayDay}, {event.displayDate}
                        </p>
                        <p className="text-xs text-[#826F5F] font-sans">
                          Tahun 2026
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F5EDE1] text-[#9A5B46] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-sm text-[#352B24]">
                          {event.time}
                        </p>
                        <p className="text-xs text-[#826F5F] font-sans">
                          Waktu Indonesia Barat (WIB)
                        </p>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F5EDE1] text-[#9A5B46] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-sm text-[#352B24]">
                          {event.venueName}
                        </p>
                        <p className="text-xs text-[#7B6858] font-sans leading-relaxed mt-0.5">
                          {event.venueAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 border-t border-[#E7D6C1] flex flex-col gap-2">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-medium bg-[#A85A42] hover:bg-[#8F4731] text-[#FFFDF9] shadow-sm transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Petunjuk Arah (Google Maps)
                  </motion.a>

                  {index === 0 && (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium bg-[#FFFDF9] hover:bg-[#F7EFE4] text-[#695444] border border-[#D5C2AA] transition-all"
                    >
                      <Video className="w-3.5 h-3.5 text-[#C26D53]" />
                      Live Streaming Akad
                    </motion.a>
                  )}
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

        {/* Dresscode Palette Card */}
        <MotionReveal variant="paper-unfold" delay={0.4}>
          <div className="mt-14 max-w-xl mx-auto paper-sheet-kraft rounded-2xl p-6 border border-[#DECBB4] text-center shadow-sm">
            <span className="font-serif uppercase tracking-widest text-xs font-bold text-[#7E654F] block mb-2">
              Panduan Busana (Dresscode)
            </span>
            <p className="text-xs sm:text-sm font-sans text-[#564536] mb-5">
              {dresscode.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {dresscode.colors.map((color) => (
                <div key={color.name} className="flex flex-col items-center group">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/80 shadow-md cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[11px] font-sans font-medium text-[#5A493A] mt-1.5 group-hover:text-[#A85A42] transition-colors">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#F4EFE6" />
      </div>
    </section>
  );
}
