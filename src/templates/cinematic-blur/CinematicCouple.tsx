"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import {
  FilmTimecodeBadge,
  ModernHairlineDivider,
  CameraCropMarks,
} from "./CinematicDecorations";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function CinematicCouple() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <section id="couple" className="relative py-14 px-4 text-center text-white overflow-hidden">
      <div className="max-w-md mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <FilmTimecodeBadge scene="SEQUENCE 02" take="LEAD CAST" className="mb-2" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Kedua Mempelai
          </h2>
          <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed font-sans">
            {data.general?.openingMessage ||
              "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami mengundang kehadiran Bapak/Ibu/Saudara/i untuk menyaksikan ikrar suci kami."}
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-black/60 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl text-left"
          >
            <div className="bg-zinc-950 py-1.5 px-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-white/50 border-b border-white/10">
              <span className="text-white/80 font-bold uppercase">ROLE: GROOM</span>
              <span>CAM A &bull; PRIMES 85MM</span>
            </div>

            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden group">
              <CameraCropMarks className="opacity-60" />
              <img
                src={groom?.photoUrl || "/images/prewedding/couple-3.jpg"}
                alt={groom?.fullName || "Groom"}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-20">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-rose-300 block">
                    Lead Actor
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                    className="text-2xl font-bold text-white tracking-tight"
                  >
                    {groom?.name}
                  </h3>
                </div>
                {groom?.instagram && (
                  <a
                    href={`https://instagram.com/${groom.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/20 text-xs text-white transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@{groom.instagram.replace("@", "")}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 space-y-2 bg-zinc-950/70 border-t border-white/10">
              <p className="text-sm font-sans text-white/90 font-medium">
                {groom?.fullName || groom?.name}
              </p>
              {groom?.parents && (
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  {groom.parents}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 py-1"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/25" />
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-serif text-sm font-bold text-white shadow-lg">
              &amp;
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/25" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="bg-black/60 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl text-left"
          >
            <div className="bg-zinc-950 py-1.5 px-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-white/50 border-b border-white/10">
              <span className="text-white/80 font-bold uppercase">ROLE: BRIDE</span>
              <span>CAM B &bull; PRIMES 85MM</span>
            </div>

            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden group">
              <CameraCropMarks className="opacity-60" />
              <img
                src={bride?.photoUrl || "/images/prewedding/couple-4.jpg"}
                alt={bride?.fullName || "Bride"}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-20">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-rose-300 block">
                    Lead Actress
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                    className="text-2xl font-bold text-white tracking-tight"
                  >
                    {bride?.name}
                  </h3>
                </div>
                {bride?.instagram && (
                  <a
                    href={`https://instagram.com/${bride.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/20 text-xs text-white transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@{bride.instagram.replace("@", "")}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 space-y-2 bg-zinc-950/70 border-t border-white/10">
              <p className="text-sm font-sans text-white/90 font-medium">
                {bride?.fullName || bride?.name}
              </p>
              {bride?.parents && (
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  {bride.parents}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
