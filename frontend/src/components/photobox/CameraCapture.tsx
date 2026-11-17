"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
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
  ArrowLeft,
  Play,
  RotateCcw,
  AlertCircle,
  Film,
  ChevronDown,
  X,
  Layers,
} from "lucide-react";
import {
  PhotoboxLayout,
  LAYOUT_OPTIONS,
  getLayoutShotsCount,
} from "./types";
import { playShutterSound, playCountdownBeep } from "./audio";
import { LayoutWireframe } from "./LayoutWireframe";

interface CameraCaptureProps {
  layout: PhotoboxLayout;
  onLayoutChange: (layout: PhotoboxLayout) => void;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  onProceedToFrames: () => void;
  onResetSession?: () => void;
  restoreMessage?: string | null;
}

export function CameraCapture({
  layout,
  onLayoutChange,
  photos,
  onPhotosChange,
  onProceedToFrames,
  onResetSession,
  restoreMessage,
}: CameraCaptureProps) {
  // Required photos count based on selected collage layout
  const requiredCount = getLayoutShotsCount(layout);

  const [activeSlot, setActiveSlot] = useState<number>(() => {
    const firstEmpty = photos.findIndex((p) => !p);
    return firstEmpty !== -1 ? firstEmpty : 0;
  });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [timerDuration, setTimerDuration] = useState<number>(3); // 0, 3, or 5 seconds
  const [countdown, setCountdown] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [isAutoSessionActive, setIsAutoSessionActive] = useState<boolean>(false);
  const [showLayoutModal, setShowLayoutModal] = useState<boolean>(false);
  const [layoutCategory, setLayoutCategory] = useState<"all" | "strip" | "grid">("all");

  // Arahkan ke slot kosong berikutnya jika slot saat ini sudah terisi
  useEffect(() => {
    const firstEmpty = photos.findIndex((p) => !p);
    if (firstEmpty !== -1 && activeSlot === 0 && photos[0]) {
      setActiveSlot(firstEmpty);
    }
  }, [photos]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Inisialisasi stream kamera dengan resolusi optimal
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Peramban (browser) kamu belum mendukung akses kamera langsung.");
        return;
      }

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1440 },
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
          ? "Izin kamera ditolak. Silakan izinkan kamera di browser kamu, atau gunakan tombol 'Unggah Galeri'."
          : "Kamera tidak dapat diakses atau sedang dipakai aplikasi lain.";
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
  }, [facingMode, startCamera]);

  // Putar kamera depan / belakang
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Tangkap frame saat ini ke canvas beresolusi tinggi
  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 960;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.save();
    // Efek cermin jika kamera depan agar natural seperti selfie
    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();

    // Efek kilatan shutter (flash)
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    // Audio shutter mekanik
    if (soundEnabled) {
      playShutterSound();
    }

    return canvas.toDataURL("image/jpeg", 0.92);
  }, [facingMode, soundEnabled]);

  // Ambil satu foto dengan timer
  const handleTakeSnapshot = useCallback(
    (targetSlot?: number) => {
      const slot = targetSlot !== undefined ? targetSlot : activeSlot;

      if (timerDuration === 0) {
        const photoUrl = capturePhoto();
        if (photoUrl) {
          const updated = [...photos];
          updated[slot] = photoUrl;
          onPhotosChange(updated);

          const nextSlot = (slot + 1) % requiredCount;
          setActiveSlot(nextSlot);
        }
        return;
      }

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

            const nextSlot = (slot + 1) % requiredCount;
            setActiveSlot(nextSlot);
          }
        }
      }, 1000);
    },
    [activeSlot, timerDuration, capturePhoto, photos, onPhotosChange, requiredCount, soundEnabled]
  );

  // Ambil semua pose secara otomatis berurutan (Korean Photobooth Style)
  const startAutoPhotoboxSession = async () => {
    setIsAutoSessionActive(true);
    const newPhotos = [...photos];

    for (let i = 0; i < requiredCount; i++) {
      setActiveSlot(i);

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

      if (i < requiredCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    setIsAutoSessionActive(false);
  };

  // Keyboard shortcut (Space) untuk jepret foto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        !showLayoutModal &&
        countdown === null &&
        !isAutoSessionActive
      ) {
        e.preventDefault();
        handleTakeSnapshot();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLayoutModal, countdown, isAutoSessionActive, handleTakeSnapshot]);

  // Upload fallback dari galeri
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

  const handleResetAll = () => {
    if (onResetSession) {
      onResetSession();
    } else {
      const confirmed = window.confirm("Bersihkan semua foto dan mulai dari awal?");
      if (confirmed) {
        onPhotosChange(Array(requiredCount).fill(""));
        setActiveSlot(0);
      }
    }
  };

  const isAllPhotosTaken =
    photos.filter((p) => Boolean(p)).length >= requiredCount;

  const activeLayoutOption =
    LAYOUT_OPTIONS.find((l) => l.id === layout) || LAYOUT_OPTIONS[3];

  const filteredLayouts =
    layoutCategory === "all"
      ? LAYOUT_OPTIONS
      : LAYOUT_OPTIONS.filter((l) => l.type === layoutCategory);

  // Rasio safe area guide disesuaikan dengan jenis layout aktif
  const isSquareLayout = layout === "grid-1";

  return (
    <div className="fixed inset-0 z-50 h-dvh min-h-dvh w-screen bg-[#0E0C0A] text-white flex flex-col justify-between overflow-hidden select-none overscroll-none font-sans">
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

      {/* 1. LAYER BACKGROUND: Full-Screen Live Video Feed */}
      <div className="absolute inset-0 z-0 bg-[#0E0C0A] overflow-hidden pointer-events-none">
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

        {/* Auto Session Pulsing Border Indicator */}
        {isAutoSessionActive && (
          <div className="absolute inset-0 border-4 border-amber-300/80 z-30 pointer-events-none animate-pulse" />
        )}
      </div>

      {/* 2. LAYER FLOATING: Top Bar Controls */}
      <header className="relative z-30 w-full pt-[max(0.75rem,env(safe-area-inset-top))] px-3 sm:px-6 pb-2 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Kembali ke Undangan & Slot Status */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/undangan"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/15 text-[#F7F3EB] text-xs font-semibold shadow-lg transition-all active:scale-95 min-h-[38px]"
            title="Kembali ke Halaman Undangan"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#DFD2BD]" />
            <span className="hidden xs:inline">Undangan</span>
          </Link>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white shadow-lg min-h-[38px]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[#DFD2BD]">
              {photos[activeSlot] ? `SLOT ${activeSlot + 1} (ISI)` : `SLOT ${activeSlot + 1}/${requiredCount}`}
            </span>
          </div>
        </div>

        {/* Center: Format Layout Pill (Klik untuk ganti kolase) */}
        <div className="flex items-center">
          <button
            onClick={() => setShowLayoutModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-[#DFD2BD]/40 text-[#DFD2BD] text-xs font-bold shadow-xl transition-all active:scale-95 cursor-pointer min-h-[38px]"
            title="Klik untuk ganti format photobox"
          >
            <Film className="w-3.5 h-3.5 text-amber-300" />
            <span className="max-w-[110px] xs:max-w-none truncate">
              {activeLayoutOption.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#DFD2BD]/70" />
          </button>
        </div>

        {/* Right: Quick Tools (Timer, Grid, Sound, & Ke Frame) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Timer Toggle */}
          <button
            onClick={() => {
              const nextTimer = timerDuration === 0 ? 3 : timerDuration === 3 ? 5 : 0;
              setTimerDuration(nextTimer);
            }}
            className="px-2.5 py-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white flex items-center gap-1 shadow-lg transition-all cursor-pointer min-h-[38px]"
            title={`Timer Kamera: ${timerDuration} detik`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{timerDuration}s</span>
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid((p) => !p)}
            className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shadow-lg ${
              showGrid
                ? "bg-[#4A121A]/80 border-[#DFD2BD] text-amber-200"
                : "bg-black/45 border-white/15 text-white/70 hover:bg-black/65"
            }`}
            title="Garis Panduan Pose (Rule of Thirds)"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled((p) => !p)}
            className="p-2 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/15 text-white/80 transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shadow-lg"
            title={soundEnabled ? "Suara Shutter Aktif" : "Suara Shutter Senyap"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/40" />
            )}
          </button>

          {/* Tombol Cepat ke Frame jika sudah ada foto */}
          {photos.some(Boolean) && (
            <button
              onClick={onProceedToFrames}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#DFD2BD] hover:bg-white text-[#4A121A] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer min-h-[38px]"
              title="Lanjut memilih frame & cetak"
            >
              <span>Frame</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Reassurance Banner jika sesi dipulihkan */}
      {restoreMessage && (
        <div className="relative z-30 mx-auto px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 text-amber-200 text-xs flex items-center gap-2 shadow-xl animate-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>{restoreMessage}</span>
        </div>
      )}

      {/* 3. LAYER TENGAH: Safe-Area Viewfinder Framing Guide & Countdown */}
      <div className="relative flex-1 w-full flex items-center justify-center p-3 sm:p-6 overflow-hidden pointer-events-none z-10">
        {/* Frame Box Presisi (Memberi tahu pengguna batas area yang akan tercetak) */}
        <div
          className={`relative w-[92vw] max-w-[540px] ${
            isSquareLayout ? "aspect-square max-h-[50vh]" : "aspect-4/3 max-h-[54vh] sm:max-h-[62vh]"
          } rounded-3xl transition-all duration-300 pointer-events-none flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] border border-white/25`}
        >
          {/* Viewfinder Corner Brackets Klasik (Gaya Kamera Analog / Photobox Kiosk) */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-200 rounded-tl-2xl -mt-0.5 -ml-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-200 rounded-tr-2xl -mt-0.5 -mr-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-200 rounded-bl-2xl -mb-0.5 -ml-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-200 rounded-br-2xl -mb-0.5 -mr-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />

          {/* Rule of Thirds Grid di dalam area safe frame */}
          {showGrid && !cameraError && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10 opacity-30">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div />
            </div>
          )}

          {/* Center Target Reticle */}
          <div className="w-5 h-5 flex items-center justify-center text-white/35 pointer-events-none font-mono text-xl font-light">
            +
          </div>

          {/* Viewfinder Badge Safe-Zone */}
          <div className="absolute bottom-2.5 px-3 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#DFD2BD] border border-white/15 drop-shadow-md">
            AREA CETAK • {activeLayoutOption.shots} POSE
          </div>
        </div>

        {/* Live Huge Animated Countdown in Center */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              key={countdown}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.15, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute z-40 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-black/80 backdrop-blur-md border-4 border-amber-300 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.9)] pointer-events-none"
            >
              <span className="text-7xl sm:text-8xl font-black font-mono text-amber-200 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State Viewfinder */}
        {cameraError && (
          <div className="absolute inset-0 bg-[#0E0C0A]/95 p-6 flex flex-col items-center justify-center text-center z-30 pointer-events-auto">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#F7F3EB] mb-1">
              Kamera Tidak Dapat Dibuka
            </h3>
            <p className="text-xs text-[#DFD2BD] max-w-sm mb-5 leading-relaxed">
              {cameraError}
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={startCamera}
                className="px-4 py-2.5 rounded-xl bg-[#DFD2BD] text-[#4A121A] hover:bg-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                Coba Buka Lagi
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-black/50 hover:bg-black/70 text-white border border-white/20 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg min-h-[44px]"
              >
                <Upload className="w-4 h-4 text-amber-300" />
                Unggah Foto dari Galeri
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. LAYER FLOATING: Bottom Ergonomic Dock (Slot Film Strip & Hero Shutter) */}
      <footer className="relative z-30 w-full pb-[max(1rem,env(safe-area-inset-bottom))] px-3 sm:px-6 flex flex-col items-center gap-2.5 pointer-events-auto">
        {/* Banner Navigasi Saat Semua Foto Selesai */}
        {isAllPhotosTaken && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={onProceedToFrames}
            className="w-full max-w-md py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-300 via-[#DFD2BD] to-amber-200 text-[#4A121A] font-bold text-xs sm:text-sm shadow-[0_4px_24px_rgba(223,210,189,0.4)] flex items-center justify-between border border-white cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8C6239]" />
              <span>{requiredCount} Foto Lengkap! Lanjut Pilih Frame</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#4A121A] text-[#DFD2BD] flex items-center justify-center shadow-xs">
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>
        )}

        {/* Film Strip Slot Mini Preview Bar */}
        <div className="w-full max-w-md bg-black/55 backdrop-blur-md p-2 rounded-2xl border border-white/15 shadow-2xl flex items-center justify-between gap-1.5">
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {Array.from({ length: requiredCount }).map((_, index) => {
              const photoUrl = photos[index];
              const isActive = activeSlot === index;

              return (
                <button
                  key={index}
                  onClick={() => setActiveSlot(index)}
                  className={`relative flex-1 aspect-4/3 min-w-[48px] max-h-[50px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isActive
                      ? "border-amber-300 ring-2 ring-amber-300/40 scale-102 bg-white/15"
                      : photoUrl
                      ? "border-emerald-400/80 bg-black/40"
                      : "border-dashed border-white/30 bg-white/5 hover:bg-white/10"
                  }`}
                  title={`Pilih Slot Foto #${index + 1}`}
                >
                  {photoUrl ? (
                    <>
                      <img
                        src={photoUrl}
                        alt={`Foto slot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </div>
                    </>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-white/70">
                      #{index + 1}
                    </span>
                  )}

                  {isActive && (
                    <div className="absolute bottom-0 inset-x-0 bg-amber-300 text-[#4A121A] text-[8px] font-bold text-center py-0.2 tracking-wider">
                      AKTIF
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Reset button jika ada foto terambil */}
          {photos.some(Boolean) && (
            <button
              onClick={handleResetAll}
              className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-950/60 transition-colors flex items-center justify-center cursor-pointer min-h-[40px] min-w-[40px]"
              title="Reset foto & mulai dari awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Shutter Bar with Native Mobile Thumb Alignment */}
        <div className="w-full max-w-md flex items-center justify-between px-2 pt-1">
          {/* Left Action: Gallery Upload or Auto Sequence */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-13 h-13 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-[#DFD2BD] hover:text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer min-h-[52px] min-w-[52px]"
              title="Unggah foto dari galeri perangkat"
              aria-label="Unggah foto dari galeri"
            >
              <Upload className="w-5 h-5 text-amber-300" />
              <span className="text-[9px] text-white/70">Galeri</span>
            </button>

            <button
              onClick={startAutoPhotoboxSession}
              disabled={countdown !== null || isAutoSessionActive}
              className="px-3 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-amber-300/40 text-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 min-h-[52px]"
              title="Ambil semua pose otomatis dengan timer pose"
            >
              <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span className="hidden xs:inline">Auto</span>
            </button>
          </div>

          {/* Center: Large Hero Shutter Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleTakeSnapshot()}
              disabled={countdown !== null || isAutoSessionActive}
              aria-label="Ambil foto sekarang"
              className="group relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-white/50 bg-black/30 backdrop-blur-xs shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="Tekan Spasi atau Klik untuk Jepret"
            >
              <div className="w-15 h-15 rounded-full bg-[#DFD2BD] group-hover:bg-white text-[#4A121A] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-90">
                <Camera className="w-7 h-7 text-[#4A121A]" />
              </div>
            </button>
          </div>

          {/* Right Action: Flip Camera (Depan / Belakang) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleCamera}
              aria-label="Balik kamera depan / belakang"
              className="w-13 h-13 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-[#DFD2BD] hover:text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer min-h-[52px] min-w-[52px]"
              title="Putar Kamera Depan/Belakang"
            >
              <RefreshCw className="w-5 h-5 text-amber-300" />
              <span className="text-[9px] text-white/70">Putar</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 5. MODAL BOTTOM-SHEET: Pemilihan Format Kolase (14 Opsi) */}
      <AnimatePresence>
        {showLayoutModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLayoutModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 pointer-events-auto"
            />

            {/* Slide-Up Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="fixed bottom-0 inset-x-0 max-h-[82dvh] bg-[#1A1613] text-[#FAF6EE] rounded-t-3xl border-t border-[#DFD2BD]/30 z-50 flex flex-col pointer-events-auto pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-2xl"
            >
              {/* Sheet Drag Handle & Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base font-serif font-bold text-amber-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-300" />
                    Pilih Format Kolase Photobox
                  </h3>
                  <p className="text-xs text-white/70">
                    Pilih jumlah foto dan gaya layout sebelum mengambil gambar
                  </p>
                </div>
                <button
                  onClick={() => setShowLayoutModal(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 overflow-x-auto scrollbar-none shrink-0">
                {[
                  { id: "all", label: "Semua Format (14)" },
                  { id: "strip", label: "🎞️ Strip Vertikal (1 - 6)" },
                  { id: "grid", label: "🔲 Kotak & Kolase (1 - 9)" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setLayoutCategory(cat.id as typeof layoutCategory)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
                      layoutCategory === cat.id
                        ? "bg-[#DFD2BD] text-[#4A121A] font-bold shadow-md"
                        : "bg-white/10 text-white/80 hover:bg-white/15"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Layouts Grid Catalog */}
              <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[55vh]">
                {filteredLayouts.map((opt) => {
                  const isSelected = layout === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onLayoutChange(opt.id);
                        setShowLayoutModal(false);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col xs:flex-row items-start xs:items-center gap-2.5 ${
                        isSelected
                          ? "border-amber-300 bg-amber-400/15 ring-2 ring-amber-300/40 shadow-lg"
                          : "border-white/15 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="shrink-0 mx-auto xs:mx-0">
                        <LayoutWireframe layout={opt.id} isSelected={isSelected} size="sm" />
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-white truncate">
                            {opt.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0 ml-1" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[9px] mb-0.5">
                          <span className="font-mono font-bold text-amber-200 bg-amber-400/20 px-1.5 py-0.2 rounded">
                            {opt.shots} Foto
                          </span>
                          <span className="text-[#DFD2BD] truncate">
                            {opt.badge || opt.tag}
                          </span>
                        </div>

                        <p className="text-[9.5px] text-white/60 line-clamp-1 hidden xs:block">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
