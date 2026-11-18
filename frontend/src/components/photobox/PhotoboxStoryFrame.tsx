"use client";

import React from "react";
import { PhotoboxFlowLayout } from "./PhotoboxLayoutSelect";
import { PhotoboxFilter } from "./types";
import { FILTER_CSS_MAP, FILTER_PRESETS } from "./photoboxConfig";

export { FILTER_CSS_MAP, FILTER_PRESETS };

interface PhotoboxStoryFrameProps {
  layout: PhotoboxFlowLayout;
  photos: string[];
  filter: PhotoboxFilter;
  className?: string;
  id?: string;
}

export function PhotoboxStoryFrame({
  layout,
  photos,
  filter,
  className = "",
  id,
}: PhotoboxStoryFrameProps) {
  const filterStyle = FILTER_CSS_MAP[filter] || "none";

  if (layout === "strip-2") {
    return (
      <div
        id={id}
        className={`relative aspect-9/16 bg-[#260304] overflow-hidden rounded-2xl shadow-2xl select-none ${className}`}
      >
        {/* Slot 1: Foto Atas */}
        <div
          style={{
            left: "21.667%",
            top: "28.854%",
            width: "56.111%",
            height: "18.542%",
            borderRadius: "6px",
          }}
          className="absolute overflow-hidden bg-black/40 flex items-center justify-center z-10 shadow-inner"
        >
          {photos[0] ? (
            <img
              src={photos[0]}
              alt="Pose 1"
              style={{ filter: filterStyle }}
              className="w-full h-full object-cover transition-all duration-200"
            />
          ) : (
            <div className="text-center px-2">
              <span className="text-xs font-mono font-bold text-[#FAF1D9]/80 block">Pose 1</span>
              <span className="text-[10px] text-white/50 block">Belum ada foto</span>
            </div>
          )}
        </div>

        {/* Slot 2: Foto Bawah */}
        <div
          style={{
            left: "21.667%",
            top: "54.792%",
            width: "56.111%",
            height: "18.542%",
            borderRadius: "6px",
          }}
          className="absolute overflow-hidden bg-black/40 flex items-center justify-center z-10 shadow-inner"
        >
          {photos[1] ? (
            <img
              src={photos[1]}
              alt="Pose 2"
              style={{ filter: filterStyle }}
              className="w-full h-full object-cover transition-all duration-200"
            />
          ) : (
            <div className="text-center px-2">
              <span className="text-xs font-mono font-bold text-[#FAF1D9]/80 block">Pose 2</span>
              <span className="text-[10px] text-white/50 block">Belum ada foto</span>
            </div>
          )}
        </div>

        {/* Real Full Frame Overlay (Bordir beludru, renda, dan tipografi resmi) */}
        <img
          src="/images/frame-photobox-sadil-gilang.png"
          alt="Frame Resmi Sadil & Gilang"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20"
        />
      </div>
    );
  }

  // Layout 3 Foto (Strip Trio)
  return (
    <div
      id={id}
      className={`relative aspect-9/16 bg-[#260304] overflow-hidden rounded-2xl shadow-2xl select-none flex flex-col justify-between p-[4.5%] ${className}`}
    >
      {/* Background Vignette & Frame Borders */}
      <div className="absolute inset-2 border border-[#C99A45]/40 rounded-xl pointer-events-none z-20" />
      <div className="absolute inset-3 border border-[#E8D7B8]/20 rounded-lg pointer-events-none z-20" />

      {/* Corner Filigrees (Baroque SVG) */}
      <img
        src="/images/templates/royal-heritage/baroque-corner-filigree.svg"
        alt=""
        className="absolute top-2 left-2 w-8 h-8 pointer-events-none z-20 opacity-80"
      />
      <img
        src="/images/templates/royal-heritage/baroque-corner-filigree.svg"
        alt=""
        className="absolute top-2 right-2 w-8 h-8 pointer-events-none z-20 opacity-80 -scale-x-100"
      />
      <img
        src="/images/templates/royal-heritage/baroque-corner-filigree.svg"
        alt=""
        className="absolute bottom-2 left-2 w-8 h-8 pointer-events-none z-20 opacity-80 -scale-y-100"
      />
      <img
        src="/images/templates/royal-heritage/baroque-corner-filigree.svg"
        alt=""
        className="absolute bottom-2 right-2 w-8 h-8 pointer-events-none z-20 opacity-80 -scale-x-100 -scale-y-100"
      />

      {/* Header Section */}
      <div className="text-center pt-2 sm:pt-3 z-10 shrink-0">
        <div className="text-[9px] tracking-[0.25em] text-[#DFD2BD] uppercase font-serif">
          The Wedding Of
        </div>
        <div className="font-serif text-base sm:text-lg font-bold text-[#FAF1D9] tracking-wide my-0.5">
          GILANG & SALSA
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[8px] text-[#C99A45]">
          <span>✦</span>
          <span className="tracking-widest uppercase text-[7px] text-[#DFD2BD]/80">
            Studio Kenangan
          </span>
          <span>✦</span>
        </div>
      </div>

      {/* 3 Photos Slot Container */}
      <div className="flex-1 flex flex-col justify-center gap-2 my-2 z-10 px-1">
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className="flex-1 min-h-0 bg-black/40 rounded-lg overflow-hidden border-2 border-[#C99A45]/70 relative shadow-inner flex items-center justify-center"
          >
            {photos[idx] ? (
              <img
                src={photos[idx]}
                alt={`Pose ${idx + 1}`}
                style={{ filter: filterStyle }}
                className="w-full h-full object-cover transition-all duration-200"
              />
            ) : (
              <div className="text-center px-2">
                <span className="text-[11px] font-mono font-bold text-[#FAF1D9]/80 block">
                  Pose {idx + 1}
                </span>
                <span className="text-[9px] text-white/50 block">Belum ada foto</span>
              </div>
            )}
            <div className="absolute top-1 left-1.5 px-1 rounded-xs bg-black/50 text-[7px] font-mono text-[#FAF1D9]/90 border border-white/20">
              0{idx + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="text-center pb-2 z-10 shrink-0">
        <div className="w-16 h-px bg-[#C99A45]/50 mx-auto mb-1" />
        <div className="text-[8px] sm:text-[9px] tracking-wider text-[#DFD2BD] font-serif">
          28 NOVEMBER 2026 • TUBAN
        </div>
        <div className="text-[9px] sm:text-[10px] font-bold text-[#FAF1D9] tracking-wide">
          #GilangSalsa2026
        </div>
      </div>
    </div>
  );
}
