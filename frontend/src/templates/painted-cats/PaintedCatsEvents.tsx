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
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

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
    <SectionMotion id="event" className="relative py-16 px-6 text-center text-[#38241B] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#F3DFD1] shadow-2xs">
            <DoodlePawSticker className="w-3.5 h-3.5" rotate={0} />
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C2633C]">
              Rangkaian Acara
            </span>
            <DoodlePawSticker className="w-3.5 h-3.5" rotate={10} />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#38241B]">
            Agenda Pernikahan
          </h2>
          <p className="text-xs text-[#6E5345] max-w-xs mx-auto leading-relaxed">
            Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kebahagiaan terindah bagi kami.
          </p>
        </motion.div>

        <div className="space-y-6">
          {events.map((evt, idx) => (
            <ItemMotion
              key={evt.id || idx}
              variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
              delay={idx * 0.12}
              className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-7 border-[4px] border-white shadow-[0_14px_34px_rgba(222,125,84,0.12)] ring-1 ring-[#F3DFD1] space-y-5 text-left relative overflow-hidden"
            >
              <div className="absolute top-2 right-4 z-10">
                <ItemMotion variant="stamp" delay={0.22}>
                  <WashiTape
                    color={idx % 2 === 0 ? "peach" : "mint"}
                    angle={idx % 2 === 0 ? 3 : -3}
                    className="w-20 text-[7px]"
                  />
                </ItemMotion>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#F7ECE1]">
                <span className="px-3.5 py-1 rounded-full text-xs font-sans font-bold bg-gradient-to-r from-[#E78862] to-[#DF7B54] text-white uppercase tracking-wider shadow-2xs">
                  {evt.title}
                </span>
                <span className="text-xs font-sans text-[#C2633C] font-bold">
                  {evt.displayDay}
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#FFF4EC] border border-[#FCDCC9] flex items-center justify-center text-[#DF7B54] shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase text-[#9E7E6E] block">
                      Hari &amp; Tanggal
                    </span>
                    <p className="text-sm font-semibold text-[#38241B]">
                      {evt.displayDay}, {evt.displayDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#FFF4EC] border border-[#FCDCC9] flex items-center justify-center text-[#DF7B54] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase text-[#9E7E6E] block">
                      Waktu Acara
                    </span>
                    <p className="text-sm font-semibold text-[#38241B]">
                      {evt.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#FFF4EC] border border-[#FCDCC9] flex items-center justify-center text-[#DF7B54] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase text-[#9E7E6E] block">
                      Lokasi Acara
                    </span>
                    <p className="text-sm font-semibold text-[#38241B]">
                      {evt.venueName}
                    </p>
                    {evt.venueAddress && (
                      <p className="text-xs text-[#6E5345] leading-relaxed mt-0.5 font-sans">
                        {evt.venueAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <ItemMotion variant="pop" delay={0.16} className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {evt.mapUrl && (
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-full bg-[#FFF4EC] hover:bg-[#FFE8DA] border border-[#FCDCC9] text-xs font-sans font-semibold text-[#C2633C] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#DF7B54]" />
                    <span>Petunjuk Peta</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleAddToCalendar(evt)}
                  className="py-2.5 px-4 rounded-full bg-gradient-to-r from-[#E78862] to-[#DF7B54] hover:from-[#DF7B54] hover:to-[#C66239] text-white text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-white" />
                  <span>Simpan ke Kalender</span>
                </button>
              </ItemMotion>
            </ItemMotion>
          ))}
        </div>

        {dresscode && dresscode.colors && dresscode.colors.length > 0 && (
          <ItemMotion
            variant="pop"
            delay={0.15}
            className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 border-[3px] border-white ring-1 ring-[#F3DFD1] shadow-xs text-center space-y-3"
          >
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C2633C] block">
              Aturan Busana
            </span>
            <h3 className="font-serif text-lg font-bold text-[#38241B]">
              Dress Code
            </h3>
            <p className="text-xs text-[#6E5345] leading-relaxed max-w-xs mx-auto">
              {dresscode.description || "Kami menyarankan tamu undangan mengenakan busana bernuansa hangat, ceria, dan formal rapi."}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              {dresscode.colors.map((c: any, i: number) => (
                <ItemMotion key={i} variant="pop" delay={0.18 + i * 0.05} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm ring-1 ring-[#F3DFD1]"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                  <span className="text-[10px] font-sans font-medium text-[#7A5B4C]">
                    {c.name}
                  </span>
                </ItemMotion>
              ))}
            </div>
          </ItemMotion>
        )}
      </div>
    </SectionMotion>
  );
}
