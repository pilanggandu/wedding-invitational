"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Check, ArrowRight, RotateCcw } from "lucide-react";
import { PhotoboxFlowLayout } from "./PhotoboxLayoutSelect";
import { PhotoboxStoryFrame, FILTER_PRESETS } from "./PhotoboxStoryFrame";
import { PhotoboxFilter } from "./types";

interface PhotoboxFilterViewProps {
  layout: PhotoboxFlowLayout;
  photos: string[];
  selectedFilter: PhotoboxFilter;
  onSelectFilter: (filter: PhotoboxFilter) => void;
  onBackToCamera: () => void;
  onProceedToDone: () => void;
}

export function PhotoboxFilterView({
  layout,
  photos,
  selectedFilter,
  onSelectFilter,
  onBackToCamera,
  onProceedToDone,
}: PhotoboxFilterViewProps) {
  return (
    <div className="min-h-dvh bg-[#FAF6EE] text-[#3A332C] flex flex-col font-sans selection:bg-[#DFD2BD] selection:text-[#4A121A]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E8DFC8] px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={onBackToCamera}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#786551] hover:text-[#4A121A] transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Foto Ulang</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A121A]/10 text-[#4A121A] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#C99A45]" />
          <span>Step 3: Pilih Filter</span>
        </div>

        <button
          onClick={onProceedToDone}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#4A121A] text-[#FAF1D9] text-xs font-semibold hover:bg-[#380D13] transition-all cursor-pointer shadow-xs"
        >
          <span>Selesai</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-between gap-4">
        {/* Title */}
        <div className="text-center">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4A121A]">
            Pilih Tone Foto Favoritmu
          </h2>
          <p className="text-xs text-[#786551] mt-0.5">
            Frame pernikahan sudah terkunci. Pilih filter untuk menyempurnakan fotomu.
          </p>
        </div>

        {/* Live Frame Preview (9:16) */}
        <div className="w-full flex justify-center items-center py-1">
          <div className="w-[230px] xs:w-[260px] sm:w-[290px] drop-shadow-xl transition-all">
            <PhotoboxStoryFrame layout={layout} photos={photos} filter={selectedFilter} />
          </div>
        </div>

        {/* Filter Selector Carousel */}
        <div className="w-full space-y-3">
          <div className="text-[11px] font-semibold text-[#786551] uppercase tracking-wider text-center">
            Pilihan Filter Studio
          </div>

          <div className="w-full overflow-x-auto no-scrollbar scrollbar-none py-2 px-1">
            <div className="flex items-center gap-2 min-w-max mx-auto px-2">
              {FILTER_PRESETS.map((preset) => {
                const isSelected = selectedFilter === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectFilter(preset.id)}
                    className={`px-3 py-2 rounded-xl text-center transition-all cursor-pointer border flex flex-col items-center shrink-0 min-w-[70px] ${
                      isSelected
                        ? "bg-[#4A121A] text-[#FAF1D9] border-[#4A121A] shadow-md scale-105"
                        : "bg-white text-[#5C4A3A] border-[#E8DFC8] hover:border-[#C5B7A1] hover:bg-[#FAF6EE]"
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight">{preset.label}</span>
                    <span
                      className={`text-[9px] mt-0.5 ${
                        isSelected ? "text-[#DFD2BD]" : "text-[#9E8B75]"
                      }`}
                    >
                      {preset.tone}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onProceedToDone}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#4A121A] hover:bg-[#380D13] text-[#FAF1D9] font-semibold text-sm shadow-lg shadow-[#4A121A]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#C99A45]" />
              <span>Selesai & Simpan Foto ✨</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
