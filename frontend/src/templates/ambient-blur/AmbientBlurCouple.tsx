"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ExtractedColors } from "@/lib/colorExtractor";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

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

interface AmbientBlurCoupleProps {
  palette?: ExtractedColors;
}

export function AmbientBlurCouple({ palette }: AmbientBlurCoupleProps) {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  const groomPhoto = groom?.photoUrl || "/images/prewedding/couple-3.jpg";
  const bridePhoto = bride?.photoUrl || "/images/prewedding/couple-4.jpg";

  const accentColor = palette?.dominant || "#D97736";
  const glowColor = palette?.glow || "rgba(217,119,54,0.3)";

  return (
    <SectionMotion id="couple" className="relative py-16 px-6 text-center text-slate-800 overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Title */}
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
              Mempelai Pernikahan
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Kedua Mempelai
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed font-sans">
            {data.general?.openingMessage ||
              "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang kehadiran Bapak/Ibu/Saudara/i untuk menyaksikan ikrar suci kami."}
          </p>
        </ItemMotion>

        {/* Groom Asymmetric Editorial Card */}
        <ItemMotion
          variant="slide-left"
          delay={0.1}
          style={{
            borderColor: `${accentColor}33`,
            boxShadow: `0 20px 45px rgba(15,23,42,0.06), 0 0 35px ${glowColor}`,
          }}
          className="bg-white/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border shadow-xl ring-1 ring-slate-900/5 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div
              style={{ borderColor: `${accentColor}77` }}
              className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-2xl overflow-hidden shadow-lg border-2 shrink-0 group"
            >
              <img
                src={groomPhoto}
                alt={groom?.fullName || "Groom"}
                className="w-full h-full object-cover object-top scale-102 group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              <ItemMotion
                variant="slide-down"
                delay={0.2}
                float={true}
                floatDistance={3}
                floatDuration={3.5}
                className="absolute bottom-2 left-0 right-0 flex justify-center"
              >
                <span
                  style={{ backgroundColor: `${accentColor}EE` }}
                  className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider text-white shadow-md backdrop-blur-md"
                >
                  The Groom
                </span>
              </ItemMotion>
            </div>

            <div className="space-y-2 flex-1">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold block">
                  Mempelai Pria
                </span>
                <h3
                  style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                  className="text-2xl font-bold text-slate-900 tracking-tight"
                >
                  {groom?.name}
                </h3>
                <p className="text-xs font-sans text-slate-600 font-medium">
                  {groom?.fullName || groom?.name}
                </p>
              </div>

              {groom?.parents && (
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Putra dari: {groom.parents}
                </p>
              )}

              {groom?.instagram && (
                <div className="pt-1">
                  <a
                    href={`https://instagram.com/${groom.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/90 text-xs text-slate-700 hover:text-slate-900 transition-colors shadow-2xs font-medium"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-slate-600" />
                    <span>@{groom.instagram.replace("@", "")}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </ItemMotion>

        {/* Center Chromatic Harmony Connector */}
        <ItemMotion
          variant="pop"
          delay={0.15}
          className="flex items-center justify-center gap-3 my-2"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <div
            style={{
              borderColor: `${accentColor}55`,
              backgroundColor: `${accentColor}15`,
            }}
            className="w-10 h-10 rounded-full border flex items-center justify-center font-serif text-base font-bold text-slate-800 shadow-sm"
          >
            &amp;
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </ItemMotion>

        {/* Bride Asymmetric Editorial Card (Mirrored) */}
        <ItemMotion
          variant="slide-right"
          delay={0.2}
          style={{
            borderColor: `${accentColor}33`,
            boxShadow: `0 20px 45px rgba(15,23,42,0.06), 0 0 35px ${glowColor}`,
          }}
          className="bg-white/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border shadow-xl ring-1 ring-slate-900/5 relative overflow-hidden"
        >
          <div className="flex flex-col-reverse sm:flex-row items-center gap-5 text-center sm:text-right">
            <div className="space-y-2 flex-1">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold block">
                  Mempelai Wanita
                </span>
                <h3
                  style={{ fontFamily: "var(--font-couple-custom, serif)" }}
                  className="text-2xl font-bold text-slate-900 tracking-tight"
                >
                  {bride?.name}
                </h3>
                <p className="text-xs font-sans text-slate-600 font-medium">
                  {bride?.fullName || bride?.name}
                </p>
              </div>

              {bride?.parents && (
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Putri dari: {bride.parents}
                </p>
              )}

              {bride?.instagram && (
                <div className="pt-1 flex sm:justify-end justify-center">
                  <a
                    href={`https://instagram.com/${bride.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/90 text-xs text-slate-700 hover:text-slate-900 transition-colors shadow-2xs font-medium"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-slate-600" />
                    <span>@{bride.instagram.replace("@", "")}</span>
                  </a>
                </div>
              )}
            </div>

            <div
              style={{ borderColor: `${accentColor}77` }}
              className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-2xl overflow-hidden shadow-lg border-2 shrink-0 group"
            >
              <img
                src={bridePhoto}
                alt={bride?.fullName || "Bride"}
                className="w-full h-full object-cover object-top scale-102 group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              <ItemMotion
                variant="slide-down"
                delay={0.25}
                float={true}
                floatDistance={3}
                floatDuration={3.5}
                className="absolute bottom-2 left-0 right-0 flex justify-center"
              >
                <span
                  style={{ backgroundColor: `${accentColor}EE` }}
                  className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider text-white shadow-md backdrop-blur-md"
                >
                  The Bride
                </span>
              </ItemMotion>
            </div>
          </div>
        </ItemMotion>
      </div>
    </SectionMotion>
  );
}
