"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Film } from "lucide-react";

export const DEFAULT_PREWEDDING_IMAGES = [
  "/images/prewedding/couple-1.jpg",
  "/images/prewedding/couple-2.jpg",
  "/images/prewedding/couple-3.jpg",
  "/images/prewedding/couple-4.jpg",
  "/images/prewedding/couple-5.jpg",
];

interface BlurredCoupleBackgroundProps {
  images?: string[];
  initialBlur?: "heavy" | "medium" | "crisp";
  intervalSeconds?: number;
  showControls?: boolean;
}

export function BlurredCoupleBackground({
  images = DEFAULT_PREWEDDING_IMAGES,
  initialBlur = "medium",
  intervalSeconds = 8,
  showControls = true,
}: BlurredCoupleBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blurMode, setBlurMode] = useState<"heavy" | "medium" | "crisp">(initialBlur);
  const [timecode, setTimecode] = useState("00:01:24:08");

  const photoList = images && images.length > 0 ? images : DEFAULT_PREWEDDING_IMAGES;

  // Auto crossfade loop
  useEffect(() => {
    if (photoList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photoList.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [photoList.length, intervalSeconds]);

  // Rolling timecode ticker
  useEffect(() => {
    const startSec = 84;
    let frames = 0;
    const interval = setInterval(() => {
      frames++;
      const totalFrames = frames % 24;
      const sec = Math.floor(frames / 24) + startSec;
      const mm = String(Math.floor(sec / 60)).padStart(2, "0");
      const ss = String(sec % 60).padStart(2, "0");
      const ff = String(totalFrames).padStart(2, "0");
      setTimecode(`00:${mm}:${ss}:${ff}`);
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  // Determine blur filter
  const getBlurFilter = () => {
    switch (blurMode) {
      case "crisp":
        return "blur(0px) brightness(0.85) contrast(1.05) saturate(1.1)";
      case "medium":
        return "blur(6px) brightness(0.82) contrast(1.05) saturate(1.15)";
      case "heavy":
      default:
        return "blur(14px) brightness(0.78) contrast(1.08) saturate(1.2)";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#090B10]">
      {/* 1. Motion Fade In/Out Background Layer with Ken Burns Pan */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: 1,
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
            filter: getBlurFilter(),
            transform: "translate3d(0, 0, 0)",
            willChange: "transform, opacity",
          }}
        />
      </AnimatePresence>

      {/* 2. Cinema Contrast Gradients & Vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_35%,rgba(9,11,16,0.65)_80%,rgba(9,11,16,0.92)_100%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#090B10]/60 via-transparent to-[#090B10]/80" />

      {/* 3. Subtle Anamorphic Lens Flare Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-cyan-500/20 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 20, -15, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-rose-500/15 blur-[110px]"
        />
      </div>

      {/* 4. Fine Film Grain Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.45) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* 5. Top & Bottom Cinematic Letterbox Borders */}
      <div className="hidden sm:block absolute top-0 left-0 right-0 h-3 bg-black z-10 border-b border-white/5" />
      <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-3 bg-black z-10 border-t border-white/5" />

      {/* 6. Top Camera HUD Indicator (Desktop & Tablet) */}
      <div className="hidden lg:flex absolute top-5 left-8 right-8 z-20 justify-between items-center text-[10px] font-mono tracking-widest text-white/50 pointer-events-none select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/50 border border-white/10 text-white/80">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>REC</span>
          </span>
          <span>4K PRORES • 24 FPS</span>
          <span className="text-white/20">|</span>
          <span>SHUTTER 180°</span>
        </div>
        <div className="flex items-center gap-3">
          <span>TC {timecode}</span>
          <span className="text-white/20">|</span>
          <span>SCENE 01 / TAKE 01</span>
        </div>
      </div>

      {/* 7. Interactive Discrete Background Controls (Bottom Corner) */}
      {showControls && (
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20 pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/15 text-white/80 hover:text-white transition-colors text-[10px] font-mono shadow-xl">
          <Film className="w-3 h-3 text-rose-400 hidden xs:inline" />
          <button
            type="button"
            onClick={() => {
              setBlurMode((prev) =>
                prev === "medium" ? "crisp" : prev === "crisp" ? "heavy" : "medium"
              );
            }}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            title="Ganti mode fokus latar belakang foto"
          >
            {blurMode === "heavy" ? (
              <EyeOff className="w-3 h-3 text-white/60" />
            ) : (
              <Eye className="w-3 h-3 text-white/90" />
            )}
            <span className="capitalize">
              {blurMode === "heavy"
                ? "Dreamy Bokeh"
                : blurMode === "medium"
                ? "Soft Focus"
                : "Fokus Jelas"}
            </span>
          </button>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1">
            {photoList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "bg-white w-3"
                    : "bg-white/30 hover:bg-white/60"
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
