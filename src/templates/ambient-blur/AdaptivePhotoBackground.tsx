"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Sparkles, Palette } from "lucide-react";
import { extractColorsFromImage, ExtractedColors, FALLBACK_PALETTE } from "@/lib/colorExtractor";

export const DEFAULT_AMBIENT_IMAGES = [
  "/images/prewedding/couple-1.jpg",
  "/images/prewedding/couple-2.jpg",
  "/images/prewedding/couple-3.jpg",
  "/images/prewedding/couple-4.jpg",
  "/images/prewedding/couple-5.jpg",
];

interface AdaptivePhotoBackgroundProps {
  images?: string[];
  initialBlur?: "heavy" | "medium" | "crisp";
  intervalSeconds?: number;
  showControls?: boolean;
  onPaletteChange?: (palette: ExtractedColors) => void;
}

export function AdaptivePhotoBackground({
  images,
  initialBlur = "medium",
  intervalSeconds = 8,
  showControls = true,
  onPaletteChange,
}: AdaptivePhotoBackgroundProps) {
  const photoList = images && images.length > 0 ? images : DEFAULT_AMBIENT_IMAGES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blurMode, setBlurMode] = useState<"heavy" | "medium" | "crisp">(initialBlur);
  const [palette, setPalette] = useState<ExtractedColors>(FALLBACK_PALETTE);
  const [showColorPill, setShowColorPill] = useState(false);

  // Auto crossfade loop
  useEffect(() => {
    if (photoList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photoList.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [photoList.length, intervalSeconds]);

  // Extract colors whenever the current photo changes
  useEffect(() => {
    const currentSrc = photoList[currentIndex] || photoList[0];
    let isMounted = true;

    extractColorsFromImage(currentSrc).then((extracted) => {
      if (isMounted) {
        setPalette(extracted);
        onPaletteChange?.(extracted);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentIndex, photoList, onPaletteChange]);

  const getBlurFilter = () => {
    switch (blurMode) {
      case "crisp":
        return "blur(0px) brightness(0.85) contrast(1.05) saturate(1.1)";
      case "medium":
        return "blur(8px) brightness(0.80) contrast(1.08) saturate(1.2)";
      case "heavy":
      default:
        return "blur(18px) brightness(0.75) contrast(1.1) saturate(1.25)";
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F8FAFC",
        transition: "background-color 1.5s ease",
      }}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Motion Fade In/Out Background Layer with Ken Burns Pan */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: 0.45,
            scale: 1.05,
            transition: {
              opacity: { duration: 1.8, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: intervalSeconds + 2, ease: "linear" },
            },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 1.6, ease: [0.4, 0, 0.2, 1] },
          }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${photoList[currentIndex]})`,
            backgroundPosition: "center 32%",
            backgroundSize: "cover",
            filter:
              blurMode === "crisp"
                ? "blur(0px) brightness(1.02) saturate(1.15)"
                : blurMode === "medium"
                ? "blur(20px) brightness(1.04) saturate(1.2)"
                : "blur(40px) brightness(1.06) saturate(1.25)",
            transform: "translate3d(0, 0, 0)",
            willChange: "transform, opacity",
          }}
        />
      </AnimatePresence>

      {/* 2. Vibrant Fluid Chromatic Aurora Bloom (Tints background with photo's lively palette) */}
      <div
        style={{
          background: `radial-gradient(circle at 15% 20%, ${palette.dominant}38 0%, transparent 55%),
                       radial-gradient(circle at 85% 30%, ${palette.secondary}32 0%, transparent 55%),
                       radial-gradient(circle at 50% 80%, ${palette.light}70 0%, transparent 60%)`,
          transition: "background 1.5s ease",
        }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* 3. Luminous Pearl Gradient Wash */}
      <div
        style={{
          background: `linear-gradient(to bottom, rgba(248, 250, 252, 0.65) 0%, rgba(248, 250, 252, 0.25) 40%, rgba(248, 250, 252, 0.75) 100%)`,
        }}
        className="absolute inset-0"
      />

      {/* 4. Soft Floating Luminous Chromatic Aurora Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <motion.div
          animate={{
            x: [0, 45, -30, 0],
            y: [0, -35, 25, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundColor: palette.dominant,
            filter: "blur(70px)",
            transition: "background-color 1.5s ease",
          }}
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 35, -20, 0],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundColor: palette.secondary,
            filter: "blur(80px)",
            transition: "background-color 1.5s ease",
          }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full"
        />
      </div>

      {/* 5. Subtle Fine Film Grain */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* 6. Interactive Controls & Live Adaptive Swatch Pill */}
      {showControls && (
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20 pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-slate-200/80 text-slate-700 hover:text-slate-900 transition-colors text-[10px] font-mono shadow-lg ring-1 ring-slate-900/5">
          {/* Extracted Color Swatch Indicator */}
          <button
            type="button"
            onClick={() => setShowColorPill((prev) => !prev)}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer group"
            title="Warna atmosfer otomatis diekstrak dari foto"
          >
            <span
              style={{ backgroundColor: palette.dominant }}
              className="w-2.5 h-2.5 rounded-full border border-white shadow-xs inline-block animate-pulse"
            />
            <span className="hidden sm:inline text-slate-500">Aura:</span>
            <span style={{ color: palette.dominant }} className="font-bold uppercase tracking-wider">
              {palette.dominant}
            </span>
          </button>

          <span className="text-slate-300">|</span>

          {/* Focus mode button */}
          <button
            type="button"
            onClick={() => {
              setBlurMode((prev) =>
                prev === "medium" ? "crisp" : prev === "crisp" ? "heavy" : "medium"
              );
            }}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
            title="Ubah intensitas blur latar belakang"
          >
            {blurMode === "heavy" ? (
              <EyeOff className="w-3 h-3 text-slate-500" />
            ) : (
              <Eye className="w-3 h-3 text-slate-800" />
            )}
            <span className="capitalize text-slate-700 font-medium">
              {blurMode === "heavy"
                ? "Dreamy Bokeh"
                : blurMode === "medium"
                ? "Soft Focus"
                : "Fokus Jelas"}
            </span>
          </button>

          <span className="text-slate-300">|</span>

          {/* Photo Dots */}
          <div className="flex items-center gap-1">
            {photoList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                style={{
                  backgroundColor: currentIndex === idx ? palette.dominant : undefined,
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "w-3"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                title={`Lihat foto ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
