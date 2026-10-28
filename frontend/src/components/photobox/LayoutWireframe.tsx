"use client";

import React from "react";
import { PhotoboxLayout } from "./types";

interface LayoutWireframeProps {
  layout: PhotoboxLayout;
  isSelected?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LayoutWireframe({
  layout,
  isSelected = false,
  size = "md",
  className = "",
}: LayoutWireframeProps) {
  // Styles depending on selection
  const outerBorder = isSelected ? "border-[#4A121A] ring-1 ring-[#4A121A]/30" : "border-[#DFD2BD]";
  const outerBg = isSelected ? "bg-[#FAF6EE]" : "bg-white";
  const slotBg = isSelected ? "bg-[#4A121A] text-[#DFD2BD]" : "bg-[#D8C7B0] text-[#5A4D3E]";

  // Size scale
  const scaleClass =
    size === "sm"
      ? "scale-85 origin-center"
      : size === "lg"
      ? "scale-110 origin-center"
      : "";

  return (
    <div
      className={`shrink-0 flex items-center justify-center select-none ${scaleClass} ${className}`}
      title={`Bentuk layout: ${layout}`}
    >
      {/* 1. STRIP 1 / POLAROID */}
      {(layout === "strip-1" || layout === "polaroid") && (
        <div
          className={`w-9 h-14 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col items-center justify-between`}
        >
          <div className="w-4 h-1 rounded-xs bg-black/10 mt-0.5" />
          <div className={`w-7 h-7 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[8px]`}>
            1
          </div>
          <div className="w-5 h-1 rounded-xs bg-black/10 mb-0.5" />
        </div>
      )}

      {/* 2. STRIP 2 (DUO) */}
      {(layout === "strip-2" || layout === "2-strip") && (
        <div
          className={`w-9 h-14 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col justify-between`}
        >
          <div className="w-4 h-1 rounded-xs bg-black/10 mx-auto" />
          <div className="flex flex-col gap-1 w-full my-auto">
            <div className={`w-full h-4 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[7px]`}>
              1
            </div>
            <div className={`w-full h-4 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[7px]`}>
              2
            </div>
          </div>
          <div className="w-5 h-1 rounded-xs bg-black/10 mx-auto" />
        </div>
      )}

      {/* 3. STRIP 3 (TRIO) */}
      {(layout === "strip-3" || layout === "3-strip") && (
        <div
          className={`w-9 h-15 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col justify-between`}
        >
          <div className="w-4 h-1 rounded-xs bg-black/10 mx-auto" />
          <div className="flex flex-col gap-0.5 w-full my-auto">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`w-full h-3 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[6px]`}>
                {n}
              </div>
            ))}
          </div>
          <div className="w-5 h-1 rounded-xs bg-black/10 mx-auto" />
        </div>
      )}

      {/* 4. STRIP 4 (4-CUT KOREA POPULER) */}
      {(layout === "strip-4" || layout === "4-strip") && (
        <div
          className={`w-9 h-16 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col justify-between`}
        >
          <div className="w-4 h-1 rounded-xs bg-black/10 mx-auto" />
          <div className="flex flex-col gap-0.5 w-full my-auto">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`w-full h-2.5 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[6px]`}>
                {n}
              </div>
            ))}
          </div>
          <div className="w-5 h-1 rounded-xs bg-black/10 mx-auto" />
        </div>
      )}

      {/* 5. STRIP 5 */}
      {layout === "strip-5" && (
        <div
          className={`w-9 h-16 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-0.5 flex flex-col justify-between`}
        >
          <div className="w-4 h-0.5 rounded-xs bg-black/10 mx-auto mt-0.5" />
          <div className="flex flex-col gap-0.5 w-full my-auto">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`w-full h-2 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[5px]`}>
                {n}
              </div>
            ))}
          </div>
          <div className="w-4 h-0.5 rounded-xs bg-black/10 mx-auto mb-0.5" />
        </div>
      )}

      {/* 6. STRIP 6 (MEGA 6-CUT) */}
      {layout === "strip-6" && (
        <div
          className={`w-9 h-18 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-0.5 flex flex-col justify-between`}
        >
          <div className="w-4 h-0.5 rounded-xs bg-black/10 mx-auto mt-0.5" />
          <div className="flex flex-col gap-0.5 w-full my-auto">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`w-full h-1.5 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[5px]`}>
                {n}
              </div>
            ))}
          </div>
          <div className="w-4 h-0.5 rounded-xs bg-black/10 mx-auto mb-0.5" />
        </div>
      )}

      {/* 7. GRID 1 (SQUARE 1:1) */}
      {layout === "grid-1" && (
        <div
          className={`w-12 h-13 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col justify-between items-center`}
        >
          <div className="w-5 h-1 rounded-xs bg-black/10" />
          <div className={`w-9 h-8 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[8px]`}>
            1
          </div>
          <div className="w-6 h-1 rounded-xs bg-black/10" />
        </div>
      )}

      {/* 8. GRID 2 (2 HORIZONTAL COLUMNS) */}
      {layout === "grid-2" && (
        <div
          className={`w-13 h-12 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col justify-between`}
        >
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
          <div className="grid grid-cols-2 gap-1 w-full my-auto">
            <div className={`h-6 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[7px]`}>
              1
            </div>
            <div className={`h-6 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[7px]`}>
              2
            </div>
          </div>
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
        </div>
      )}

      {/* 9. GRID 3 (1 HERO TOP + 2 BOTTOM) */}
      {layout === "grid-3" && (
        <div
          className={`w-12 h-14 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col justify-between`}
        >
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
          <div className="space-y-0.5 w-full my-auto">
            <div className={`w-full h-4 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[6px]`}>
              1 (Hero)
            </div>
            <div className="grid grid-cols-2 gap-0.5 w-full">
              <div className={`h-3.5 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[6px]`}>
                2
              </div>
              <div className={`h-3.5 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[6px]`}>
                3
              </div>
            </div>
          </div>
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
        </div>
      )}

      {/* 10. GRID 4 (2x2 GRID) */}
      {(layout === "grid-4" || layout === "2x2-grid") && (
        <div
          className={`w-12 h-14 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col justify-between`}
        >
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
          <div className="grid grid-cols-2 gap-1 w-full my-auto">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-4 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[6px]`}>
                {n}
              </div>
            ))}
          </div>
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
        </div>
      )}

      {/* 11. GRID 5 (1 HERO TOP + 4 GRID (2x2) BOTTOM) */}
      {layout === "grid-5" && (
        <div
          className={`w-12 h-15 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col justify-between`}
        >
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
          <div className="space-y-0.5 w-full my-auto">
            <div className={`w-full h-3.5 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[6px]`}>
              1 (Hero)
            </div>
            <div className="grid grid-cols-2 gap-0.5 w-full">
              {[2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`h-3 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[5px]`}>
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
        </div>
      )}

      {/* 12. GRID 6 (2x3 GRID) */}
      {layout === "grid-6" && (
        <div
          className={`w-12 h-15 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-1 flex flex-col justify-between`}
        >
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
          <div className="grid grid-cols-2 gap-0.5 w-full my-auto">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`h-3 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[5px]`}>
                {n}
              </div>
            ))}
          </div>
          <div className="w-6 h-1 rounded-xs bg-black/10 mx-auto" />
        </div>
      )}

      {/* 13. GRID 8 (2x4 GRID) */}
      {layout === "grid-8" && (
        <div
          className={`w-12 h-16 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-0.5 flex flex-col justify-between`}
        >
          <div className="w-6 h-0.5 rounded-xs bg-black/10 mx-auto mt-0.5" />
          <div className="grid grid-cols-2 gap-0.5 w-full my-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className={`h-2.5 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[5px]`}>
                {n}
              </div>
            ))}
          </div>
          <div className="w-6 h-0.5 rounded-xs bg-black/10 mx-auto mb-0.5" />
        </div>
      )}

      {/* 14. GRID 9 (3x3 GRID INSTAGRAM) */}
      {layout === "grid-9" && (
        <div
          className={`w-13 h-14 rounded-md border ${outerBorder} ${outerBg} shadow-2xs p-0.5 flex flex-col justify-between`}
        >
          <div className="w-6 h-0.5 rounded-xs bg-black/10 mx-auto mt-0.5" />
          <div className="grid grid-cols-3 gap-0.5 w-full my-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div
                key={n}
                className={`h-3 rounded-xs ${slotBg} flex items-center justify-center font-mono font-bold text-[5px]`}>
                {n}
              </div>
            ))}
          </div>
          <div className="w-6 h-0.5 rounded-xs bg-black/10 mx-auto mb-0.5" />
        </div>
      )}
    </div>
  );
}
