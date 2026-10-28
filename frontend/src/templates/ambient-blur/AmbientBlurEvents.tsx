"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink, CalendarCheck } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ExtractedColors } from "@/lib/colorExtractor";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

interface AmbientBlurEventsProps {
  palette?: ExtractedColors;
}

export function AmbientBlurEvents({ palette }: AmbientBlurEventsProps) {
  const data = useWeddingData();
  const events = data.events || [];
  const dresscode = data.dresscode;

  const accentColor = palette?.dominant || "#D97736";
  const glowColor = palette?.glow || "rgba(217,119,54,0.3)";

  const handleAddToCalendar = (evt: any) => {
    const title = encodeURIComponent(evt.calendarEvent?.title || evt.title || "Wedding Celebration");
    const details = encodeURIComponent(
      evt.calendarEvent?.description || `${evt.title} : ${evt.venueName || ""}`
    );
    const location = encodeURIComponent(evt.venueAddress || evt.venueName || "");
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleUrl, "_blank");
  };

  return (
    <SectionMotion id="event" className="relative py-16 px-6 text-center text-slate-800 overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <ItemMotion variant="slide-down" className="space-y-2">
          <div className="flex justify-center">
            <span
              style={{
                borderColor: `${accentColor}44`,
                backgroundColor: `${accentColor}12`,
                color: accentColor,
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest backdrop-blur-md font-semibold"
            >
              <span
                style={{ backgroundColor: accentColor }}
                className="w-1.5 h-1.5 rounded-full"
              />
              Waktu &amp; Tempat
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Agenda Acara
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kehormatan serta kebahagiaan terbesar bagi kami.
          </p>
        </ItemMotion>

        {/* Event Cards */}
        <div className="space-y-6">
          {events.map((evt, idx) => (
            <ItemMotion
              key={evt.id || idx}
              variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
              delay={idx * 0.15}
              style={{
                borderColor: `${accentColor}33`,
                boxShadow: `0 20px 45px rgba(15,23,42,0.06), 0 0 25px ${glowColor}`,
              }}
              className="bg-white/85 sm:bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border shadow-xl ring-1 ring-slate-900/5 space-y-5 text-left relative overflow-hidden"
            >
              {/* Event Badge Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <span
                  style={{ backgroundColor: accentColor }}
                  className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold text-white uppercase tracking-wider shadow-sm"
                >
                  {evt.title}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-medium">
                  {evt.displayDay}
                </span>
              </div>

              {/* Event Details */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div
                    style={{ borderColor: `${accentColor}33`, backgroundColor: `${accentColor}14`, color: accentColor }}
                    className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      Hari &amp; Tanggal
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {evt.displayDay}, {evt.displayDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    style={{ borderColor: `${accentColor}33`, backgroundColor: `${accentColor}14`, color: accentColor }}
                    className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      Waktu
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {evt.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    style={{ borderColor: `${accentColor}33`, backgroundColor: `${accentColor}14`, color: accentColor }}
                    className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      Lokasi Acara
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {evt.venueName}
                    </p>
                    {evt.venueAddress && (
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5 font-sans">
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
                    className="py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>Petunjuk Peta</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleAddToCalendar(evt)}
                  style={{
                    backgroundColor: accentColor,
                    borderColor: `${accentColor}dd`,
                  }}
                  className="py-2.5 px-4 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:brightness-110 cursor-pointer shadow-md"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-white" />
                  <span>Simpan ke Kalender</span>
                </button>
              </div>
            </ItemMotion>
          ))}
        </div>

        {/* Dresscode Card */}
        {dresscode && dresscode.colors && dresscode.colors.length > 0 && (
          <ItemMotion
            variant="slide-up"
            delay={0.2}
            style={{
              borderColor: `${accentColor}33`,
            }}
            className="bg-white/85 sm:bg-white/90 backdrop-blur-2xl rounded-3xl p-6 border shadow-lg ring-1 ring-slate-900/5 text-center space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 block">
              Aturan Busana
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Dress Code
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              {dresscode.description || "Kami menyarankan tamu undangan mengenakan busana bernuansa formal atau batik modern."}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              {dresscode.colors.map((c: any, i: number) => (
                <ItemMotion key={i} variant="pop" delay={0.25 + i * 0.05} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full border border-slate-300 shadow-sm"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                  <span className="text-[9px] font-mono text-slate-600">
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
