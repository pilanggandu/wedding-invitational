"use client";

import React from "react";
import { PhotoboxFilter } from "./types";
import { PhotoboxFlowLayout, FILTER_CSS_MAP, FILTER_PRESETS } from "./photoboxConfig";

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

  // 1. Layout 2 Foto (Spiral Album - Image 3)
  if (layout === "strip-2") {
    return (
      <div
        id={id}
        className={`relative aspect-9/16 bg-[#260304] overflow-hidden rounded-2xl shadow-2xl select-none ${className}`}
      >
        {/* Slot 1: Foto Atas */}
        <div
          style={{
            left: "22.870%",
            top: "25.677%",
            width: "54.259%",
            height: "22.708%",
            borderRadius: "6px",
          }}
          className="absolute overflow-hidden bg-black/40 flex items-center justify-center z-10 shadow-inner"
        >
          {photos[0] ? (
            <img
              src={photos[0]}
              alt="Pose 1 (Atas)"
              style={{ filter: filterStyle }}
              className="w-full h-full object-cover transition-all duration-200"
            />
          ) : (
            <div className="text-center px-2">
              <span className="text-xs font-mono font-bold text-[#FAF1D9]/80 block">Pose 1</span>
              <span className="text-[10px] text-white/50 block">Atas</span>
            </div>
          )}
        </div>

        {/* Slot 2: Foto Bawah */}
        <div
          style={{
            left: "22.870%",
            top: "52.135%",
            width: "54.259%",
            height: "22.552%",
            borderRadius: "6px",
          }}
          className="absolute overflow-hidden bg-black/40 flex items-center justify-center z-10 shadow-inner"
        >
          {photos[1] ? (
            <img
              src={photos[1]}
              alt="Pose 2 (Bawah)"
              style={{ filter: filterStyle }}
              className="w-full h-full object-cover transition-all duration-200"
            />
          ) : (
            <div className="text-center px-2">
              <span className="text-xs font-mono font-bold text-[#FAF1D9]/80 block">Pose 2</span>
              <span className="text-[10px] text-white/50 block">Bawah</span>
            </div>
          )}
        </div>

        {/* Real Overlay: Spiral Album Sadil & Gilang */}
        <img
          src="/images/frame-sadil-gilang-duo.png"
          alt="Frame Resmi Sadil & Gilang"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20"
        />
      </div>
    );
  }

  // 2. Layout 1 Foto (Kartu Renda Polaroid - Image 2)
  if (layout === "single-card") {
    return (
      <div
        id={id}
        className={`relative aspect-9/16 bg-[#260304] overflow-hidden rounded-2xl shadow-2xl select-none ${className}`}
      >
        <div
          style={{
            left: "22.870%",
            top: "25.677%",
            width: "54.259%",
            height: "49.010%",
            borderRadius: "8px",
          }}
          className="absolute overflow-hidden bg-black/40 flex items-center justify-center z-10 shadow-inner"
        >
          {photos[0] ? (
            <img
              src={photos[0]}
              alt="Pose Foto"
              style={{ filter: filterStyle }}
              className="w-full h-full object-cover transition-all duration-200"
            />
          ) : (
            <div className="text-center px-2">
              <span className="text-sm font-mono font-bold text-[#FAF1D9]/80 block">Pose Utama</span>
              <span className="text-xs text-white/50 block">Belum ada foto</span>
            </div>
          )}
        </div>

        {/* Real Overlay: Card Frame Sadil & Gilang */}
        <img
          src="/images/frame-sadil-gilang-single.png"
          alt="Frame Kartu Renda Sadil & Gilang"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20"
        />
      </div>
    );
  }

  // 3. Layout 1 Foto (Full Lace Frame - Image 1)
  if (layout === "single-full") {
    return (
      <div
        id={id}
        className={`relative aspect-9/16 bg-[#260304] overflow-hidden rounded-2xl shadow-2xl select-none ${className}`}
      >
        <div
          style={{
            left: "11.574%",
            top: "17.813%",
            width: "74.907%",
            height: "71.198%",
            borderRadius: "10px",
          }}
          className="absolute overflow-hidden bg-black/40 flex items-center justify-center z-10 shadow-inner"
        >
          {photos[0] ? (
            <img
              src={photos[0]}
              alt="Pose Foto Besar"
              style={{ filter: filterStyle }}
              className="w-full h-full object-cover transition-all duration-200"
            />
          ) : (
            <div className="text-center px-2">
              <span className="text-sm font-mono font-bold text-[#FAF1D9]/80 block">Potret Megah</span>
              <span className="text-xs text-white/50 block">Belum ada foto</span>
            </div>
          )}
        </div>

        {/* Real Overlay: Full Lace Frame Sadil & Gilang */}
        <img
          src="/images/frame-sadil-gilang-full.png"
          alt="Frame Renda Megah Sadil & Gilang"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20"
        />
      </div>
    );
  }

  // 4. Layout 3 Foto (Strip Trio bertingkat di dalam frame renda megah)
  return (
    <div
      id={id}
      className={`relative aspect-9/16 bg-[#260304] overflow-hidden rounded-2xl shadow-2xl select-none ${className}`}
    >
      {[0, 1, 2].map((idx) => {
        const topOffsets = ["20.00%", "42.97%", "65.99%"];
        return (
          <div
            key={idx}
            style={{
              left: "13.43%",
              top: topOffsets[idx],
              width: "73.15%",
              height: "21.00%",
              borderRadius: "8px",
            }}
            className="absolute overflow-hidden bg-black/40 flex items-center justify-center z-10 shadow-inner border border-white/20"
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
                <span className="text-xs font-mono font-bold text-[#FAF1D9]/80 block">
                  Pose {idx + 1}
                </span>
                <span className="text-[10px] text-white/50 block">Belum ada foto</span>
              </div>
            )}
            <div className="absolute top-1 left-1.5 px-1 rounded-xs bg-black/60 text-[8px] font-mono text-[#FAF1D9] border border-white/20">
              0{idx + 1}
            </div>
          </div>
        );
      })}

      {/* Real Overlay: Full Lace Frame Sadil & Gilang */}
      <img
        src="/images/frame-sadil-gilang-full.png"
        alt="Frame Resmi Sadil & Gilang 3-Cut"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20"
      />
    </div>
  );
}
