"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Palette,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { PhotoboxLayout, getLayoutShotsCount } from "./types";
import { CameraCapture } from "./CameraCapture";
import { FrameCustomizer } from "./FrameCustomizer";
import { PhotoboxPasscodeGate } from "./PhotoboxPasscodeGate";
import { isPhotoboxUnlockedSession } from "./passcode";
import { getInvitationData } from "@/lib/invitationStore";

export function PhotoboxStudio() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [configuredPasscode, setConfiguredPasscode] = useState<string>("2026");
  const [currentStep, setCurrentStep] = useState<"camera" | "frames">("camera");
  const [layout, setLayout] = useState<PhotoboxLayout>("4-strip");
  const [photos, setPhotos] = useState<string[]>(["", "", "", ""]);

  useEffect(() => {
    setHasMounted(true);
    try {
      const inv = getInvitationData();
      const pin = inv?.general?.photoboxPasscode?.toString()?.trim();
      if (pin) setConfiguredPasscode(pin);
    } catch {}

    if (isPhotoboxUnlockedSession()) {
      setIsUnlocked(true);
    }
  }, []);

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

  if (!hasMounted) {
    return (
      <div className="min-h-dvh bg-[#FAF6EE] flex items-center justify-center p-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#4A121A]/20 border-t-[#4A121A] animate-spin" />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <PhotoboxPasscodeGate
        onUnlock={() => setIsUnlocked(true)}
        configuredPasscode={configuredPasscode}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF6EE] text-[#3A332C] flex flex-col font-sans selection:bg-[#DFD2BD] selection:text-[#4A121A]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E8DFC8] px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E8DFC8] text-[#4A121A] shadow-xs w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0"
            title="The Wedding Photobox of Gilang & Salsa"
          >
            <Camera className="w-4 h-4 text-[#8C6239]" />
          </div>

          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-serif font-bold text-sm sm:text-lg text-[#4A121A]">
                Photobox
              </span>
              <span className="hidden xs:inline px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-[#4A121A]/10 text-[#4A121A]">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-[#786551] hidden md:block">
              Bilik Foto & Frame ala Korea untuk momen spesial Gilang & Salsa
            </p>
          </div>
        </div>

        {/* Right Navigation & Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Step Navigation Pill Indicator */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white p-1 sm:px-2.5 sm:py-1 rounded-full border border-[#E8DFC8] shadow-xs">
            <button
              onClick={() => setCurrentStep("camera")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer min-h-[32px] sm:min-h-[34px] ${
                currentStep === "camera"
                  ? "bg-[#4A121A] text-[#DFD2BD] shadow-xs"
                  : "text-[#786551] hover:text-[#2A241D]"
              }`}
              aria-label="Langkah 1: Ambil Foto"
            >
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">1. Kamera</span>
              <span className="xs:hidden font-mono font-bold">1</span>
            </button>

            <span className="text-[#C5B7A1] text-[10px] sm:text-xs">/</span>

            <button
              onClick={() => setCurrentStep("frames")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer min-h-[32px] sm:min-h-[34px] ${
                currentStep === "frames"
                  ? "bg-[#4A121A] text-[#DFD2BD] shadow-xs"
                  : "text-[#786551] hover:text-[#2A241D]"
              }`}
              aria-label="Langkah 2: Pilih Frame"
            >
              <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">2. Frame</span>
              <span className="xs:hidden font-mono font-bold">2</span>
            </button>
          </div>

          {/* Link Kembali ke Halaman Undangan */}
          <Link
            href="/undangan"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-white hover:bg-[#FAF6EE] text-[#786551] hover:text-[#4A121A] border border-[#E8DFC8] font-semibold text-xs transition-all shadow-xs active:scale-95 min-h-[36px]"
            title="Kembali ke Halaman Undangan Pernikahan"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8C6239]" />
            <span className="hidden sm:inline">Halaman Undangan</span>
            <span className="sm:hidden text-[11px]">Undangan</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
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
                onPhotosChange={setPhotos}
                onBackToCamera={() => setCurrentStep("camera")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Friendly Bottom Footer */}
      <footer className="border-t border-[#E8DFC8] bg-[#FAF6EE] py-4 px-4 text-center text-xs text-[#786551] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <p className="flex items-center justify-center gap-1.5">
          <span>Dibuat dengan</span>
          <Heart className="w-3.5 h-3.5 text-[#B85461] fill-current" />
          <span>untuk merayakan cinta Gilang & Salsadila</span>
        </p>
      </footer>
    </div>
  );
}
