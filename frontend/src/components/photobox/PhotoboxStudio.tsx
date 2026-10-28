"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Palette,
  Sparkles,
  Heart,
  HelpCircle,
  Share2,
  QrCode,
} from "lucide-react";
import { PhotoboxLayout, getLayoutShotsCount } from "./types";
import { CameraCapture } from "./CameraCapture";
import { FrameCustomizer } from "./FrameCustomizer";
import { A3PosterModal } from "./A3PosterModal";

export function PhotoboxStudio() {
  const [currentStep, setCurrentStep] = useState<"camera" | "frames">("camera");
  const [layout, setLayout] = useState<PhotoboxLayout>("4-strip");
  const [photos, setPhotos] = useState<string[]>(["", "", "", ""]);
  const [isA3ModalOpen, setIsA3ModalOpen] = useState<boolean>(false);

  // Adjust photos array length when layout changes if needed
  const handleLayoutChange = (newLayout: PhotoboxLayout) => {
    setLayout(newLayout);
    const count = getLayoutShotsCount(newLayout);

    setPhotos((prev) => {
      const copy = [...prev];
      if (copy.length < count) {
        while (copy.length < count) copy.push("");
      }
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#3A332C] flex flex-col font-sans selection:bg-[#DFD2BD] selection:text-[#4A121A]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E8DFC8] px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E8DFC8] text-[#4A121A] shadow-xs min-w-[38px] min-h-[38px] flex items-center justify-center shrink-0"
            title="The Wedding Photobox of Gilang & Salsa"
          >
            <Camera className="w-4 h-4 text-[#8C6239]" />
          </div>

          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-serif font-bold text-sm sm:text-lg text-[#4A121A] truncate max-w-[130px] sm:max-w-none">
                Photobox
              </span>
              <span className="hidden xs:inline px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-[#4A121A]/10 text-[#4A121A]">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-[#786551] hidden sm:block">
              Bilik Foto & Frame ala Korea untuk momen spesial Gilang & Salsa
            </p>
          </div>
        </div>

        {/* Right Navigation & Tools */}
        <div className="flex items-center gap-2">
          {/* Step Navigation Pill Indicator */}
          <div className="flex items-center gap-1 bg-white px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#E8DFC8] shadow-xs">
            <button
              onClick={() => setCurrentStep("camera")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                currentStep === "camera"
                  ? "bg-[#4A121A] text-[#DFD2BD] shadow-xs"
                  : "text-[#786551] hover:text-[#2A241D]"
              }`}
            >
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>1. Kamera</span>
            </button>

            <span className="text-[#C5B7A1] text-xs">/</span>

            <button
              onClick={() => setCurrentStep("frames")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                currentStep === "frames"
                  ? "bg-[#4A121A] text-[#DFD2BD] shadow-xs"
                  : "text-[#786551] hover:text-[#2A241D]"
              }`}
            >
              <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>2. Frame</span>
            </button>
          </div>

          {/* Button Generate QR Code A3 */}
          <button
            onClick={() => setIsA3ModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#4A121A] hover:bg-[#5C1D24] text-[#DFD2BD] font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95 min-h-[38px]"
            title="Generate & Cetak Poster QR Code A3 untuk Meja/Standee Acara"
          >
            <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFD2BD]" />
            <span className="hidden sm:inline">Cetak Poster QR (A3)</span>
            <span className="sm:hidden font-mono text-[11px]">QR A3</span>
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {currentStep === "camera" ? (
            <motion.div
              key="camera-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <CameraCapture
                layout={layout}
                onLayoutChange={handleLayoutChange}
                photos={photos}
                onPhotosChange={setPhotos}
                onProceedToFrames={() => setCurrentStep("frames")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="frames-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <FrameCustomizer
                layout={layout}
                onLayoutChange={handleLayoutChange}
                photos={photos}
                onBackToCamera={() => setCurrentStep("camera")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Friendly Bottom Footer */}
      <footer className="border-t border-[#E8DFC8] bg-[#FAF6EE] py-4 px-4 text-center text-xs text-[#786551]">
        <p className="flex items-center justify-center gap-1.5">
          <span>Dibuat dengan</span>
          <Heart className="w-3.5 h-3.5 text-[#B85461] fill-current" />
          <span>untuk merayakan cinta Gilang & Salsadila</span>
        </p>
      </footer>

      {/* A3 Poster Standee Generator Modal */}
      <A3PosterModal
        isOpen={isA3ModalOpen}
        onClose={() => setIsA3ModalOpen(false)}
      />
    </div>
  );
}
