"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Camera, Check, Heart, ArrowRight } from "lucide-react";

export type PhotoboxFlowLayout = "strip-3" | "strip-2";

interface PhotoboxLayoutSelectProps {
  selectedLayout: PhotoboxFlowLayout;
  onSelectLayout: (layout: PhotoboxFlowLayout) => void;
  onStartPhoto: () => void;
}

export function PhotoboxLayoutSelect({
  selectedLayout,
  onSelectLayout,
  onStartPhoto,
}: PhotoboxLayoutSelectProps) {
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
            <p className="text-[11px] text-[#786551]">Gilang & Salsa • 28 Nov 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E8DFC8] text-[11px] font-semibold text-[#786551]">
          <Sparkles className="w-3.5 h-3.5 text-[#C99A45]" />
          <span>Story IG (9:16)</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Welcome Text */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A121A]/10 text-[#4A121A] text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-[#4A121A] text-[#4A121A]" />
              <span>Step 1: Pilih Layout Foto</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A121A] tracking-tight">
              Mau 3 Foto atau 2 Foto?
            </h2>
            <p className="text-xs sm:text-sm text-[#786551] max-w-sm mx-auto">
              Frame eksklusif pernikahan Gilang & Salsa sudah siap. Pilih jumlah foto yang kamu inginkan.
            </p>
          </div>

          {/* Layout Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {/* Opsi 1: 3 Foto */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLayout("strip-3")}
              className={`relative rounded-2xl p-3.5 sm:p-5 text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                selectedLayout === "strip-3"
                  ? "bg-white border-[#4A121A] shadow-lg ring-2 ring-[#4A121A]/20"
                  : "bg-white/70 border-[#E8DFC8] hover:border-[#C5B7A1] hover:bg-white"
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C99A45]/20 text-[#8C6239] border border-[#C99A45]/30">
                  Favorit ⭐
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    selectedLayout === "strip-3"
                      ? "bg-[#4A121A] text-white"
                      : "border border-[#C5B7A1]"
                  }`}
                >
                  {selectedLayout === "strip-3" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Wireframe Mockup Preview */}
              <div className="w-full aspect-9/16 max-h-[190px] sm:max-h-[220px] bg-[#260304] rounded-lg p-2 flex flex-col justify-between border border-[#C99A45]/40 shadow-inner my-1 mx-auto max-w-[120px]">
                <div className="text-center pt-0.5">
                  <div className="text-[6px] tracking-widest text-[#DFD2BD] font-serif uppercase">
                    The Wedding Of
                  </div>
                  <div className="text-[7px] font-serif font-bold text-[#FAF1D9]">
                    Gilang & Salsa
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-1 my-1">
                  <div className="h-[26%] bg-[#FAF1D9]/20 rounded-xs border border-[#C99A45]/50 flex items-center justify-center">
                    <span className="text-[8px] text-[#FAF1D9]">1</span>
                  </div>
                  <div className="h-[26%] bg-[#FAF1D9]/20 rounded-xs border border-[#C99A45]/50 flex items-center justify-center">
                    <span className="text-[8px] text-[#FAF1D9]">2</span>
                  </div>
                  <div className="h-[26%] bg-[#FAF1D9]/20 rounded-xs border border-[#C99A45]/50 flex items-center justify-center">
                    <span className="text-[8px] text-[#FAF1D9]">3</span>
                  </div>
                </div>

                <div className="text-center pb-0.5">
                  <div className="text-[5px] text-[#DFD2BD]">28 Nov 2026</div>
                </div>
              </div>

              {/* Info Text */}
              <div className="mt-3">
                <div className="font-serif font-bold text-sm sm:text-base text-[#4A121A]">
                  3 Foto (Trio)
                </div>
                <p className="text-[11px] text-[#786551] mt-0.5 leading-snug">
                  Format strip Korea klasik. Pas untuk ekspresi seru bertingkat.
                </p>
              </div>
            </motion.button>

            {/* Opsi 2: 2 Foto */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLayout("strip-2")}
              className={`relative rounded-2xl p-3.5 sm:p-5 text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                selectedLayout === "strip-2"
                  ? "bg-white border-[#4A121A] shadow-lg ring-2 ring-[#4A121A]/20"
                  : "bg-white/70 border-[#E8DFC8] hover:border-[#C5B7A1] hover:bg-white"
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4A121A]/10 text-[#4A121A] border border-[#4A121A]/20">
                  Resmi 💍
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    selectedLayout === "strip-2"
                      ? "bg-[#4A121A] text-white"
                      : "border border-[#C5B7A1]"
                  }`}
                >
                  {selectedLayout === "strip-2" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Wireframe Mockup Preview */}
              <div className="w-full aspect-9/16 max-h-[190px] sm:max-h-[220px] bg-[#260304] rounded-lg p-2 flex flex-col justify-between border border-[#C99A45]/40 shadow-inner my-1 mx-auto max-w-[120px] relative overflow-hidden">
                <div className="text-center pt-1">
                  <div className="text-[6px] tracking-widest text-[#DFD2BD] font-serif uppercase">
                    The Wedding Of
                  </div>
                  <div className="text-[7px] font-serif font-bold text-[#FAF1D9]">
                    Sadil & Gilang
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-1.5 my-1">
                  <div className="h-[36%] bg-[#FAF1D9]/20 rounded-xs border border-[#C99A45]/60 flex items-center justify-center">
                    <span className="text-[8px] text-[#FAF1D9]">1</span>
                  </div>
                  <div className="h-[36%] bg-[#FAF1D9]/20 rounded-xs border border-[#C99A45]/60 flex items-center justify-center">
                    <span className="text-[8px] text-[#FAF1D9]">2</span>
                  </div>
                </div>

                <div className="text-center pb-1">
                  <div className="text-[5px] text-[#DFD2BD]">28 Nov 2026</div>
                </div>
              </div>

              {/* Info Text */}
              <div className="mt-3">
                <div className="font-serif font-bold text-sm sm:text-base text-[#4A121A]">
                  2 Foto (Duo)
                </div>
                <p className="text-[11px] text-[#786551] mt-0.5 leading-snug">
                  Frame resmi beludru Sadil & Gilang. Lebih lega & pas untuk berdua.
                </p>
              </div>
            </motion.button>
          </div>

          {/* Information Reassurance */}
          <div className="bg-white/80 rounded-xl p-3.5 border border-[#E8DFC8] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4A121A]/5 text-[#4A121A] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#C99A45]" />
            </div>
            <p className="text-xs text-[#786551] leading-relaxed">
              Frame sudah otomatis dikunci dengan nama & tanggal pernikahan. Hasil unduhan siap diunggah ke Instagram Story tanpa crop.
            </p>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-6 sm:pt-8">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onStartPhoto}
            className="w-full py-4 px-6 rounded-2xl bg-[#4A121A] hover:bg-[#380D13] text-[#FAF1D9] font-semibold text-sm sm:text-base shadow-lg shadow-[#4A121A]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Camera className="w-5 h-5 text-[#C99A45]" />
            <span>Mulai Foto ({selectedLayout === "strip-3" ? "3 Pose" : "2 Pose"})</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </main>
    </div>
  );
}
