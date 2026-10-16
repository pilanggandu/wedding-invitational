"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink, CalendarCheck } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  DoodlePawSticker,
  DoodleFishboneSticker,
  WashiTape,
  BrushStrokeDivider,
} from "./PaintedDecorations";

export function PaintedCatsEvents() {
  const data = useWeddingData();
  const events = data.events || [];
  const dresscode = data.dresscode;

  const handleAddToCalendar = (evt: any) => {
    const title = encodeURIComponent(evt.calendarEvent?.title || evt.title || "Wedding Celebration");
    const details = encodeURIComponent(
      evt.calendarEvent?.description || `${evt.title} - ${evt.venueName || ""}`
    );
    const location = encodeURIComponent(evt.venueAddress || evt.venueName || "");
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleUrl, "_blank");
  };

  return (
    <section id="event" className="relative py-16 px-6 text-center text-[#2C2623] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-1.5">
            <DoodlePawSticker className="w-3.5 h-3.5 text-[#D97736]" color="#D97736" rotate={0} />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A17]">
              Rangkaian Acara
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2623]">
            Agenda Pernikahan
          </h2>
          <p className="text-xs text-[#7A6150] max-w-xs mx-auto leading-relaxed">
            Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kebahagiaan terindah bagi kami.
          </p>
        </motion.div>

        {/* Event Cards */}
        <div className="space-y-6">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border-2 border-[#EAD8C7] shadow-[0_15px_35px_rgba(200,90,23,0.08)] space-y-5 text-left relative overflow-hidden"
            >
              {/* Washi tape at top right */}
              <div className="absolute top-2 right-4 z-10">
                <WashiTape
                  color={idx % 2 === 0 ? "peach" : "mint"}
                  angle={idx % 2 === 0 ? 3 : -3}
                  className="w-20 text-[7px]"
                />
              </div>

              {/* Event Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE5DB]">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-medium bg-[#D97736] text-white uppercase tracking-wider">
                  {evt.title}
                </span>
                <span className="text-[11px] font-mono text-[#C85A17] font-semibold">
                  {evt.displayDay}
                </span>
              </div>

              {/* Event Details */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#E8D9CB] flex items-center justify-center text-[#D97736] shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#A07855] block">
                      Hari &amp; Tanggal
                    </span>
                    <p className="text-sm font-semibold text-[#2C2623]">
                      {evt.displayDay}, {evt.displayDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#E8D9CB] flex items-center justify-center text-[#D97736] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#A07855] block">
                      Waktu Acara
                    </span>
                    <p className="text-sm font-semibold text-[#2C2623]">
                      {evt.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#E8D9CB] flex items-center justify-center text-[#D97736] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#A07855] block">
                      Lokasi Acara
                    </span>
                    <p className="text-sm font-semibold text-[#2C2623]">
                      {evt.venueName}
                    </p>
                    {evt.venueAddress && (
                      <p className="text-xs text-[#7A6150] leading-relaxed mt-0.5 font-sans">
                        {evt.venueAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {evt.mapUrl && (
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-[#FAF6EE] hover:bg-[#F3E8DB] border border-[#E8D9CB] text-xs font-medium text-[#C85A17] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#D97736]" />
                    <span>Petunjuk Peta</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleAddToCalendar(evt)}
                  className="py-2.5 px-4 rounded-xl bg-[#D97736] hover:bg-[#C85A17] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-white" />
                  <span>Simpan ke Kalender</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dresscode Card */}
        {dresscode && dresscode.colors && dresscode.colors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-2 border-[#EAD8C7] shadow-xs text-center space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A17] block">
              Aturan Busana
            </span>
            <h3 className="font-serif text-lg font-bold text-[#2C2623]">
              Dress Code
            </h3>
            <p className="text-xs text-[#7A6150] leading-relaxed max-w-xs mx-auto">
              {dresscode.description || "Kami menyarankan tamu undangan mengenakan busana bernuansa hangat, ceria, dan formal rapi."}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              {dresscode.colors.map((c: any, i: number) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                  <span className="text-[9px] font-mono text-[#8C6D58]">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
