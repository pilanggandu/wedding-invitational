"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink, CalendarCheck } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { FilmTimecodeBadge, ModernHairlineDivider } from "./CinematicDecorations";

export function CinematicEvents() {
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
    <section id="event" className="relative py-16 px-6 text-center text-white overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <FilmTimecodeBadge scene="SCENE 03" take="THE ITINERARY" className="mb-2" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Agenda Pernikahan
          </h2>
          <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
            Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.
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
              className="bg-black/45 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-5 text-left relative overflow-hidden"
            >
              {/* Event Badge Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-medium bg-white text-black uppercase tracking-wider">
                  {evt.title}
                </span>
                <span className="text-[11px] font-mono text-white/70">
                  {evt.displayDay}
                </span>
              </div>

              {/* Event Details */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-white/60 block">
                      Hari &amp; Tanggal
                    </span>
                    <p className="text-sm font-semibold text-white">
                      {evt.displayDay}, {evt.displayDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-white/60 block">
                      Waktu Acara
                    </span>
                    <p className="text-sm font-semibold text-white">
                      {evt.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-white/60 block">
                      Lokasi Acara
                    </span>
                    <p className="text-sm font-semibold text-white">
                      {evt.venueName}
                    </p>
                    {evt.venueAddress && (
                      <p className="text-xs text-white/70 leading-relaxed mt-0.5 font-sans">
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
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                    <span>Petunjuk Peta</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleAddToCalendar(evt)}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-black" />
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
            className="bg-black/45 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-lg text-center space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/60 block">
              Aturan Busana
            </span>
            <h3 className="font-serif text-lg font-bold text-white">
              Dress Code
            </h3>
            <p className="text-xs text-white/70 leading-relaxed max-w-xs mx-auto">
              {dresscode.description || "Kami menyarankan tamu undangan mengenakan busana bernuansa formal atau batik modern."}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              {dresscode.colors.map((c: any, i: number) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full border border-white/30 shadow-md"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                  <span className="text-[9px] font-mono text-white/60">
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
