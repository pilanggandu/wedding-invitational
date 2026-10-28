"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  RefreshCw,
  Clock,
  Volume2,
  VolumeX,
  Upload,
  Sparkles,
  Grid,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  LayoutGrid,
  Film,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  PhotoboxLayout,
  LAYOUT_OPTIONS,
  getLayoutShotsCount,
  isGridLayout,
} from "./types";
import { playShutterSound, playCountdownBeep } from "./audio";
import { LayoutWireframe } from "./LayoutWireframe";

interface CameraCaptureProps {
  layout: PhotoboxLayout;
  onLayoutChange: (layout: PhotoboxLayout) => void;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  onProceedToFrames: () => void;
}

export function CameraCapture({
  layout,
  onLayoutChange,
  photos,
  onPhotosChange,
  onProceedToFrames,
}: CameraCaptureProps) {
  // Required photos based on layout
  const requiredCount = getLayoutShotsCount(layout);

  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [timerDuration, setTimerDuration] = useState<number>(3); // 0, 3, or 5 seconds
  const [countdown, setCountdown] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [isAutoSessionActive, setIsAutoSessionActive] = useState<boolean>(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState<boolean>(false);
  const [layoutCategory, setLayoutCategory] = useState<"all" | "strip" | "grid">("all");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Camera Stream with resilient fallback
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Perangkat peramban kamu belum mendukung akses kamera langsung.");
        return;
      }

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
      } catch (firstErr) {
        console.debug("Mencoba fallback stream kamera umum...", firstErr);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.warn("Camera access error:", err);
      const errorMsg =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Izin kamera ditolak. Silakan aktifkan izin kamera di browser, atau gunakan tombol 'Unggah Foto' di bawah."
          : "Kamera tidak dapat diakses atau sedang digunakan oleh aplikasi lain.";
      setCameraError(errorMsg);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [facingMode]);

  // Flip camera between front & back
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Capture current video frame to data URL
  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Use high resolution from video stream
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 960;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.save();
    // Mirror horizontally if front camera for natural selfie view
    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();

    // Trigger visual flash
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    // Trigger mechanical audio shutter
    if (soundEnabled) {
      playShutterSound();
    }

    return canvas.toDataURL("image/jpeg", 0.92);
  }, [facingMode, soundEnabled]);

  // Perform single shot with timer
  const handleTakeSnapshot = useCallback(
    (targetSlot?: number) => {
      const slot = targetSlot !== undefined ? targetSlot : activeSlot;

      if (timerDuration === 0) {
        const photoUrl = capturePhoto();
        if (photoUrl) {
          const updated = [...photos];
          updated[slot] = photoUrl;
          onPhotosChange(updated);

          // Advance to next unfilled slot if exists
          const nextSlot = (slot + 1) % requiredCount;
          setActiveSlot(nextSlot);
        }
        return;
      }

      // Countdown timer
      let timeLeft = timerDuration;
      setCountdown(timeLeft);
      if (soundEnabled) playCountdownBeep(false);

      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      countdownIntervalRef.current = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft > 0) {
          setCountdown(timeLeft);
          if (soundEnabled) playCountdownBeep(false);
        } else {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          setCountdown(null);
          if (soundEnabled) playCountdownBeep(true);

          const photoUrl = capturePhoto();
          if (photoUrl) {
            const updated = [...photos];
            updated[slot] = photoUrl;
            onPhotosChange(updated);

            // Move to next slot
            const nextSlot = (slot + 1) % requiredCount;
            setActiveSlot(nextSlot);
          }
        }
      }, 1000);
    },
    [activeSlot, timerDuration, capturePhoto, photos, onPhotosChange, requiredCount, soundEnabled]
  );

  // Auto-Sequence Photobox Mode (Takes all slots automatically with poses!)
  const startAutoPhotoboxSession = async () => {
    setIsAutoSessionActive(true);
    const newPhotos = [...photos];

    for (let i = 0; i < requiredCount; i++) {
      setActiveSlot(i);

      // Countdown loop for this frame
      const waitCountdown = async (seconds: number) => {
        for (let s = seconds; s > 0; s--) {
          setCountdown(s);
          if (soundEnabled) playCountdownBeep(false);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        setCountdown(null);
        if (soundEnabled) playCountdownBeep(true);
      };

      await waitCountdown(3);
      const snap = capturePhoto();
      if (snap) {
        newPhotos[i] = snap;
        onPhotosChange([...newPhotos]);
      }

      // Pause before next shot to allow switching pose
      if (i < requiredCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    setIsAutoSessionActive(false);
  };

  // Upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).slice(0, requiredCount);
    const updated = [...photos];

    fileList.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const targetIndex = (activeSlot + index) % requiredCount;
          updated[targetIndex] = result;
          onPhotosChange([...updated]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isAllPhotosTaken =
    photos.filter((p) => Boolean(p)).length >= requiredCount;

  // Active Layout Info
  const activeLayoutOption =
    LAYOUT_OPTIONS.find((l) => l.id === layout) || LAYOUT_OPTIONS[3];

  const filteredLayouts =
    layoutCategory === "all"
      ? LAYOUT_OPTIONS
      : LAYOUT_OPTIONS.filter((l) => l.type === layoutCategory);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input for gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Header & Session Status */}
      <div className="w-full flex items-center justify-between mb-3 px-1 sm:px-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#A67A53] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Langkah 1: Ambil Foto ({photos.filter(Boolean).length}/{requiredCount})
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3A332C]">
            Bilik Foto Photobox
          </h2>
        </div>

        {/* Sound & Camera Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? "Nonaktifkan suara shutter" : "Aktifkan suara shutter"}
            className="p-2 sm:p-2.5 rounded-full bg-white border border-[#E8DFC8] text-[#5A4D3E] hover:text-[#2A241D] hover:bg-[#FAF6EE] transition-all cursor-pointer shadow-xs min-h-[40px] min-w-[40px] flex items-center justify-center"
            title={soundEnabled ? "Suara Aktif" : "Suara Senyap"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#8C6239]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={() => setShowGrid((prev) => !prev)}
            aria-label="Toggle garis panduan pose"
            className={`p-2 sm:p-2.5 rounded-full border transition-all cursor-pointer shadow-xs min-h-[40px] min-w-[40px] flex items-center justify-center ${
              showGrid
                ? "bg-[#4A121A] text-[#DFD2BD] border-[#4A121A]"
                : "bg-white border-[#E8DFC8] text-[#5A4D3E] hover:bg-[#FAF6EE]"
            }`}
            title="Garis Panduan Pose (Rule of Thirds)"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleCamera}
            aria-label="Balik kamera depan / belakang"
            className="p-2 sm:p-2.5 rounded-full bg-white border border-[#E8DFC8] text-[#5A4D3E] hover:text-[#2A241D] hover:bg-[#FAF6EE] transition-all cursor-pointer shadow-xs min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Putar Kamera Depan/Belakang"
          >
            <RefreshCw className="w-4 h-4 text-[#8C6239]" />
          </button>
        </div>
      </div>

      {/* --- SEBELUM TAKE FOTO: PILIH VARIAN FORMAT & KOLASE --- */}
      <div className="w-full max-w-[640px] mb-3 bg-white rounded-2xl border border-[#E8DFC8] p-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LayoutWireframe layout={layout} isSelected={true} size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#3A332C]">
                  {activeLayoutOption.name}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#4A121A] text-[#DFD2BD]">
                  {activeLayoutOption.tag}
                </span>
              </div>
              <p className="text-[10px] text-[#786551] hidden xs:block">
                {activeLayoutOption.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLayoutMenu((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#4A121A] border border-[#E8DFC8] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
          >
            <span>{showLayoutMenu ? "Tutup Pilihan" : "Ganti Format"}</span>
            {showLayoutMenu ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Layouts Catalog */}
        <AnimatePresence>
          {showLayoutMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 mt-3 border-t border-[#E8DFC8]"
            >
              {/* Category tabs */}
              <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "all", label: "Semua Format (14)" },
                  { id: "strip", label: "🎞️ Strip Vertikal (1 - 6)" },
                  { id: "grid", label: "🔲 Kotak & Kolase (1 - 9)" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setLayoutCategory(cat.id as typeof layoutCategory)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
                      layoutCategory === cat.id
                        ? "bg-[#4A121A] text-[#DFD2BD] shadow-xs"
                        : "bg-[#FAF6EE] text-[#5A4D3E] hover:bg-[#F3ECE0] border border-[#E8DFC8]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Layout Options Grid With Visual Wireframe Illustrations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredLayouts.map((opt) => {
                  const isSelected = layout === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onLayoutChange(opt.id);
                        setShowLayoutMenu(false);
                      }}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 min-h-[64px] ${
                        isSelected
                          ? "border-[#4A121A] bg-[#FAF6EE] ring-2 ring-[#4A121A]/20 shadow-xs"
                          : "border-[#E8DFC8] bg-white hover:bg-[#FAF6EE]/50"
                      }`}
                    >
                      {/* Visual Wireframe Preview */}
                      <LayoutWireframe layout={opt.id} isSelected={isSelected} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-[#3A332C] truncate">
                            {opt.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#4A121A] shrink-0 ml-1" />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] mb-0.5">
                          <span className="font-mono font-bold text-[#4A121A] bg-[#4A121A]/10 px-1.5 py-0.2 rounded">
                            {opt.shots} Foto
                          </span>
                          <span className="text-[#8C6239] font-medium truncate">
                            {opt.badge || opt.tag}
                          </span>
                        </div>

                        <p className="text-[10px] text-[#786551] line-clamp-1">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Viewfinder Window */}
      <div className="relative w-full aspect-4/3 max-w-[640px] bg-[#1A1816] rounded-2xl overflow-hidden shadow-xl border-4 border-[#3A332C]/10 flex items-center justify-center">
        {/* Live Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-transform duration-200 ${
            facingMode === "user" ? "scale-x-[-1]" : ""
          }`}
        />

        {/* Shutter Flash Effect Simulation */}
        <AnimatePresence>
          {isFlashActive && (
            <motion.div
              initial={{ opacity: 0.95 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-white z-40 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Rule of Thirds Grid Overlay */}
        {showGrid && !cameraError && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10 opacity-35">
            <div className="border-r border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div className="border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div className="border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div />
          </div>
        )}

        {/* Live Countdown Display */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.15, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute z-30 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center border-4 border-[#DFD2BD] shadow-2xl pointer-events-none"
            >
              <span className="text-5xl sm:text-6xl font-bold font-mono text-[#F7F3EB] drop-shadow-md">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera Error or Fallback State */}
        {cameraError && (
          <div className="absolute inset-0 bg-[#2A241D]/95 text-white p-6 flex flex-col items-center justify-center text-center z-20">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#F7F3EB] mb-1">
              Kamera Tidak Dapat Dibuka
            </h3>
            <p className="text-xs text-[#DFD2BD] max-w-sm mb-4 leading-relaxed">
              {cameraError}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-lg bg-[#FAF6EE] text-[#3A332C] hover:bg-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors min-h-[44px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Lagi
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-[#8C6239] hover:bg-[#A67A53] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors min-h-[44px]"
              >
                <Upload className="w-3.5 h-3.5" />
                Unggah Foto dari Galeri
              </button>
            </div>
          </div>
        )}

        {/* Top Viewfinder Stamp */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
          <div className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-xs text-white text-[10px] font-mono flex items-center gap-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            LIVE REC • {photos[activeSlot] ? `SLOT ${activeSlot + 1} (ISI)` : `SLOT ${activeSlot + 1}/${requiredCount}`}
          </div>
        </div>

        {/* Auto Session Badge */}
        {isAutoSessionActive && (
          <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-md bg-[#4A121A]/90 text-[#DFD2BD] text-[11px] font-mono font-bold border border-[#DFD2BD]/30 animate-pulse">
            ★ AUTO SESI BERJALAN ★
          </div>
        )}
      </div>

      {/* Camera Controls Bar */}
      <div className="w-full max-w-[640px] mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E8DFC8] shadow-xs">
        {/* Timer Selector */}
        <div className="flex items-center gap-1 bg-[#FAF6EE] p-1 rounded-lg border border-[#E8DFC8]/60">
          <Clock className="w-3.5 h-3.5 text-[#8C6239] ml-1.5 mr-0.5" />
          <span className="text-[11px] font-medium text-[#6B5A49] mr-1 hidden xs:inline">Timer:</span>
          {[
            { sec: 0, label: "0s" },
            { sec: 3, label: "3s" },
            { sec: 5, label: "5s" },
          ].map(({ sec, label }) => (
            <button
              key={sec}
              onClick={() => setTimerDuration(sec)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer min-h-[34px] min-w-[34px] ${
                timerDuration === sec
                  ? "bg-[#4A121A] text-[#F7F3EB] shadow-xs"
                  : "text-[#6B5A49] hover:text-[#2A241D] hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Center Main Shutter Trigger Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleTakeSnapshot()}
            disabled={countdown !== null || isAutoSessionActive}
            aria-label="Ambil foto sekarang"
            className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-[#4A121A] hover:bg-[#5C1D24] text-[#DFD2BD] shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-[#FAF6EE]"
            title="Tekan untuk Ambil Foto"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[#DFD2BD] flex items-center justify-center transition-transform group-hover:scale-105">
              <Camera className="w-6 h-6 text-[#DFD2BD]" />
            </div>
          </button>
        </div>

        {/* Action Buttons: Auto Session & File Upload */}
        <div className="flex items-center gap-2">
          <button
            onClick={startAutoPhotoboxSession}
            disabled={countdown !== null || isAutoSessionActive}
            className="px-3 py-2 rounded-lg bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#4A121A] text-xs font-semibold flex items-center gap-1.5 border border-[#E8DFC8] transition-colors cursor-pointer disabled:opacity-50 min-h-[38px]"
            title="Ambil semua pose secara otomatis dengan jeda waktu"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Sesi Otomatis</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-lg bg-white hover:bg-[#FAF6EE] text-[#6B5A49] hover:text-[#2A241D] border border-[#E8DFC8] transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Unggah foto dari perangkat"
            aria-label="Unggah foto dari galeri"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photo Slots Film Strip Preview (Dynamic Grid for 1, 2, 3, 4, 5, 6, 8, 9 slots) */}
      <div className="w-full max-w-[640px] mt-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-semibold text-[#5A4D3E] flex items-center gap-1">
            Slot Foto ({photos.filter(Boolean).length} dari {requiredCount} terisi):
          </span>
          <button
            onClick={() => onPhotosChange(Array(requiredCount).fill(""))}
            className="text-[11px] text-red-700 hover:text-red-900 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Foto
          </button>
        </div>

        <div
          className={`grid gap-2 ${
            requiredCount === 1
              ? "grid-cols-1 max-w-[200px] mx-auto"
              : requiredCount === 2
              ? "grid-cols-2 max-w-[320px] mx-auto"
              : requiredCount === 3
              ? "grid-cols-3"
              : requiredCount === 4
              ? "grid-cols-4"
              : requiredCount === 5
              ? "grid-cols-5"
              : requiredCount === 6
              ? "grid-cols-3 sm:grid-cols-6"
              : "grid-cols-4 sm:grid-cols-8"
          }`}
        >
          {Array.from({ length: requiredCount }).map((_, index) => {
            const photoUrl = photos[index];
            const isActive = activeSlot === index;

            return (
              <button
                key={index}
                onClick={() => setActiveSlot(index)}
                className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col items-center justify-center p-1 min-h-[50px] ${
                  isActive
                    ? "border-[#4A121A] ring-2 ring-[#4A121A]/20 shadow-md scale-102 bg-[#FAF6EE]"
                    : photoUrl
                    ? "border-emerald-500/80 bg-white shadow-2xs"
                    : "border-dashed border-[#D2C2A4] bg-[#FAF6EE]/60 hover:bg-[#FAF6EE]"
                }`}
              >
                {photoUrl ? (
                  <>
                    <img
                      src={photoUrl}
                      alt={`Foto slot ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-[#8C6239]">
                    <Camera className="w-4 h-4 opacity-40 mb-0.5" />
                    <span className="text-[9px] font-mono font-bold">
                      #{index + 1}
                    </span>
                  </div>
                )}

                {isActive && (
                  <div className="absolute bottom-1 px-1 py-0.2 rounded bg-[#4A121A] text-[#DFD2BD] text-[8px] font-mono font-bold uppercase">
                    Aktif
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guided Next Step Banner when photos are ready */}
      {isAllPhotosTaken && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[640px] mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#4A121A] to-[#631B25] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#DFD2BD]/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DFD2BD]/20 text-[#DFD2BD] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-base text-[#F7F3EB]">
                Yeay! {requiredCount} foto sudah lengkap 🎉
              </p>
              <p className="text-xs text-[#DFD2BD] mt-0.5">
                Sekarang saatnya memilih dari 25+ template frame estetik!
              </p>
            </div>
          </div>

          <button
            onClick={onProceedToFrames}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#DFD2BD] hover:bg-[#ECE4D4] text-[#4A121A] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:scale-103 min-h-[44px]"
          >
            <span>Pilih Frame Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Quick Pose Tip Helper */}
      <div className="mt-4 text-center">
        <p className="text-[11px] text-[#786551] flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#A67A53]" />
          <span>Tips: Kamu bisa memilih format kolase kotak atau strip vertikal di menu atas kapan saja sebelum take foto!</span>
        </p>
      </div>
    </div>
  );
}
