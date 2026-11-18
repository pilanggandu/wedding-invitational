"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Camera, Check, Heart, ArrowRight } from "lucide-react";
import { PhotoboxFlowLayout, getFlowLayoutShotsCount } from "./photoboxConfig";

export { type PhotoboxFlowLayout };

interface PhotoboxLayoutSelectProps {
  selectedLayout: PhotoboxFlowLayout;
  onSelectLayout: (layout: PhotoboxFlowLayout) => void;
  onStartPhoto: () => void;
}

interface FrameOption {
  id: PhotoboxFlowLayout;
  name: string;
  badge: string;
  shots: number;
  description: string;
  previewUrl: string;
}

const FRAME_OPTIONS: FrameOption[] = [
  {
    id: "strip-2",
    name: "2 Foto • Album Spiral",
    badge: "Favorit Duo 💍",
    shots: 2,
    description: "2 foto bertingkat dengan aksen spiral binder album di tengah.",
    previewUrl: "/images/frame-sadil-gilang-duo.png",
  },
  {
    id: "strip-3",
    name: "3 Foto • Trio Strip",
    badge: "Strip Populer ⭐",
    shots: 3,
    description: "3 pose berekspresi bertingkat di dalam bingkai renda bunga.",
    previewUrl: "/images/frame-sadil-gilang-full.png",
  },
  {
    id: "single-card",
    name: "1 Foto • Kartu Renda",
    badge: "Solo Elegan ✨",
    shots: 1,
    description: "1 pose fokus di kartu renda tengah berhias kembang sepatu.",
    previewUrl: "/images/frame-sadil-gilang-single.png",
  },
  {
    id: "single-full",
    name: "1 Foto • Potret Megah",
    badge: "Lace Window 🌺",
    shots: 1,
    description: "1 foto potret besar memenuhi seluruh bingkai renda bordir.",
    previewUrl: "/images/frame-sadil-gilang-full.png",
  },
];

export function PhotoboxLayoutSelect({
  selectedLayout,
  onSelectLayout,
  onStartPhoto,
}: PhotoboxLayoutSelectProps) {
  const currentOption =
    FRAME_OPTIONS.find((f) => f.id === selectedLayout) || FRAME_OPTIONS[0];

  return (
    <div className="min-h-dvh bg-[#FAF6EE] text-[#3A332C] flex flex-col font-sans selection:bg-[#DFD2BD] selection:text-[#4A121A]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E8DFC8] px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E8DFC8] text-[#8C6239] flex items-center justify-center shadow-xs">
            <Camera className="w-4 h-4 text-[#8C6239]" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base text-[#4A121A] leading-tight">
              Photobox Kenangan
            </h1>
            <p className="text-[11px] text-[#786551]">Sadil & Gilang • 21 Nov 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E8DFC8] text-[11px] font-semibold text-[#786551]">
          <Sparkles className="w-3.5 h-3.5 text-[#C99A45]" />
          <span>Story IG (9:16)</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 sm:py-8 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Welcome Text */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A121A]/10 text-[#4A121A] text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-[#4A121A] text-[#4A121A]" />
              <span>Step 1: Pilih Frame & Layout</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A121A] tracking-tight">
              Pilih Gaya Frame Favoritmu
            </h2>
            <p className="text-xs sm:text-sm text-[#786551] max-w-md mx-auto">
              Frame resmi bordir beludru Sadil & Gilang. Pilih jumlah foto yang ingin kamu ambil.
            </p>
          </div>

          {/* Layout Grid Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {FRAME_OPTIONS.map((opt) => {
              const isSelected = selectedLayout === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectLayout(opt.id)}
                  className={`relative rounded-2xl p-3 sm:p-4 text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#4A121A] shadow-lg ring-2 ring-[#4A121A]/20"
                      : "bg-white/70 border-[#E8DFC8] hover:border-[#C5B7A1] hover:bg-white"
                  }`}
                >
                  {/* Badge Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4A121A]/10 text-[#4A121A]">
                      {opt.badge}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#4A121A] text-white"
                          : "border border-[#C5B7A1]"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Frame Image Thumbnail */}
                  <div className="w-full aspect-9/16 max-h-[170px] sm:max-h-[200px] rounded-lg overflow-hidden border border-[#4A121A]/20 shadow-md my-1 mx-auto max-w-[110px] bg-[#260304] relative">
                    <img
                      src={opt.previewUrl}
                      alt={opt.name}
                      className="w-full h-full object-contain"
                    />
                    {/* Visual slot indicator overlay */}
                    {opt.id === "strip-3" && (
                      <div className="absolute inset-0 flex flex-col justify-center items-center gap-1.5 p-3 pointer-events-none">
                        <div className="w-[70%] h-[20%] border border-amber-300/80 bg-black/30 rounded-xs" />
                        <div className="w-[70%] h-[20%] border border-amber-300/80 bg-black/30 rounded-xs" />
                        <div className="w-[70%] h-[20%] border border-amber-300/80 bg-black/30 rounded-xs" />
                      </div>
                    )}
                  </div>

                  {/* Info Text */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs sm:text-sm text-[#4A121A] truncate">
                        {opt.name}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#786551] mt-0.5 line-clamp-2 leading-tight">
                      {opt.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Reassurance Banner */}
          <div className="bg-white/80 rounded-xl p-3 border border-[#E8DFC8] flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#C99A45] shrink-0" />
            <p className="text-xs text-[#786551]">
              Frame terkunci dengan identitas resmi Sadil & Gilang. Hasil otomatis 1080×1920 untuk Instagram Story.
            </p>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-4 sm:pt-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onStartPhoto}
            className="w-full py-4 px-6 rounded-2xl bg-[#4A121A] hover:bg-[#380D13] text-[#FAF1D9] font-semibold text-sm sm:text-base shadow-lg shadow-[#4A121A]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Camera className="w-5 h-5 text-[#C99A45]" />
            <span>Mulai Foto ({currentOption.shots} Pose)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </main>
    </div>
  );
}
