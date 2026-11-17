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
        {/* Left: Format Layout & Slot Progress Pill */}
        <div className="flex items-center min-w-0">
          <button
            onClick={() => setShowLayoutModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 text-[#DFD2BD] text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer min-h-[40px] max-w-[240px] xs:max-w-none"
            title="Klik untuk ganti format photobox"
          >
            <Film className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate text-[#F7F3EB] font-medium">
              {activeLayoutOption.name.replace(/\s*\([^)]*\)/, "")}
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-200/90 bg-white/10 px-1.5 py-0.5 rounded-full shrink-0">
              {activeSlot + 1}/{requiredCount}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-white/50 shrink-0" />
          </button>
        </div>

        {/* Right: Quick Tools (Timer, Grid, Sound) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Timer Toggle */}
          <button
            onClick={() => {
              const nextTimer = timerDuration === 0 ? 3 : timerDuration === 3 ? 5 : 0;
              setTimerDuration(nextTimer);
            }}
            className="px-2.5 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-1 shadow-md transition-all cursor-pointer min-h-[40px]"
            title={`Timer Kamera: ${timerDuration} detik`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{timerDuration === 0 ? "Off" : `${timerDuration}s`}</span>
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid((p) => !p)}
            className={`w-10 h-10 rounded-full backdrop-blur-md border transition-all cursor-pointer flex items-center justify-center shadow-md ${
              showGrid
                ? "bg-[#4A121A]/80 border-amber-300/60 text-amber-200"
                : "bg-black/50 border-white/20 text-white/70 hover:bg-black/70"
            }`}
            title="Garis Panduan Pose (Rule of Thirds)"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled((p) => !p)}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white/80 transition-all cursor-pointer flex items-center justify-center shadow-md"
            title={soundEnabled ? "Suara Shutter Aktif" : "Suara Shutter Senyap"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/40" />
            )}
          </button>

          {/* Tombol Cepat ke Frame jika sudah ada foto (desktop) */}
          {photos.some(Boolean) && (
            <button
              onClick={onProceedToFrames}
              className="hidden md:flex items-center gap-1 px-3 py-2 rounded-full bg-[#DFD2BD] hover:bg-white text-[#4A121A] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer min-h-[40px]"
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
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>{restoreMessage}</span>
        </div>
      )}

      {/* 3. LAYER TENGAH: Safe-Area Viewfinder Framing Guide & Countdown */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-2 xs:p-4 my-auto overflow-hidden pointer-events-none z-10">
        {/* Frame Box Presisi (Memberi tahu pengguna batas area yang akan tercetak) */}
        <div
          className={`relative w-[90vw] max-w-[480px] ${
            isSquareLayout
              ? "aspect-square max-h-[36vh] xs:max-h-[42vh] sm:max-h-[50vh]"
              : "aspect-4/3 max-h-[38vh] xs:max-h-[44vh] sm:max-h-[56vh]"
          } rounded-2xl transition-all duration-300 pointer-events-none flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] border border-white/25`}
        >
          {/* Viewfinder Corner Brackets Klasik */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-amber-300 rounded-tl-xl -mt-0.5 -ml-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-amber-300 rounded-tr-xl -mt-0.5 -mr-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-amber-300 rounded-bl-xl -mb-0.5 -ml-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-amber-300 rounded-br-xl -mb-0.5 -mr-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />

          {/* Rule of Thirds Grid di dalam area safe frame */}
          {showGrid && !cameraError && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10 opacity-25">
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
          <div className="w-5 h-5 flex items-center justify-center text-white/30 pointer-events-none font-mono text-xl font-light">
            +
          </div>

          {/* Viewfinder Badge Safe-Zone */}
          <div className="absolute bottom-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono tracking-wider text-[#DFD2BD] border border-white/15 drop-shadow-md uppercase">
            Area Cetak • {activeLayoutOption.shots} Pose
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

      {/* 4. LAYER FLOATING: Bottom Ergonomic Dock (Slot Film Strip, Auto Mode & Hero Shutter) */}
      <footer className="relative z-30 w-full pb-[max(0.75rem,calc(env(safe-area-inset-bottom)+0.25rem))] px-3 sm:px-6 flex flex-col items-center gap-2 pointer-events-auto">
        {/* Banner Navigasi Saat Semua Foto Selesai */}
        {isAllPhotosTaken && (
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={onProceedToFrames}
            className="w-full max-w-md py-2 px-3.5 rounded-xl bg-[#DFD2BD] hover:bg-white text-[#4A121A] font-bold text-xs shadow-lg flex items-center justify-between border border-white/60 active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{requiredCount} Foto Lengkap! Lanjut Pilih Frame</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold bg-[#4A121A] text-[#DFD2BD] px-2.5 py-1 rounded-lg shadow-xs">
              <span>Lanjut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.button>
        )}

        {/* Film Strip Slot Mini Preview Bar */}
        <div className="w-full max-w-md bg-black/60 backdrop-blur-md p-1.5 px-2 rounded-2xl border border-white/15 shadow-2xl flex items-center justify-between gap-1.5">
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {Array.from({ length: requiredCount }).map((_, index) => {
              const photoUrl = photos[index];
              const isActive = activeSlot === index;

              return (
                <button
                  key={index}
                  onClick={() => setActiveSlot(index)}
                  className={`relative flex-1 aspect-4/3 min-w-[44px] max-h-[46px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
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
                    <div className="absolute bottom-0 inset-x-0 bg-amber-300 text-[#4A121A] text-[7.5px] font-bold text-center py-0.2 tracking-wider uppercase">
                      Aktif
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
              className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-950/60 transition-colors flex items-center justify-center cursor-pointer min-h-[38px] min-w-[38px] shrink-0"
              title="Reset foto & mulai dari awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Auto Photobox Mode Quick Pill */}
        <button
          onClick={startAutoPhotoboxSession}
          disabled={countdown !== null || isAutoSessionActive}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer disabled:opacity-50 ${
            isAutoSessionActive
              ? "bg-amber-400 text-[#4A121A] border-amber-300 animate-pulse"
              : "bg-black/50 hover:bg-black/70 border-white/20 text-[#DFD2BD] hover:text-white"
          }`}
          title="Ambil semua pose secara otomatis berurutan (jeda 3 detik per pose)"
        >
          <Play className="w-3 h-3 fill-current text-amber-300" />
          <span>{isAutoSessionActive ? `Auto Mode: Pose ${activeSlot + 1}/${requiredCount}...` : `Auto ${requiredCount} Pose (Timer)`}</span>
        </button>

        {/* Shutter Bar with Native Mobile Thumb Alignment (Symmetrical) */}
        <div className="w-full max-w-md flex items-center justify-between px-3 pt-0.5">
          {/* Left Action: Gallery Upload */}
          <div className="w-14 flex justify-start">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-[#DFD2BD] hover:text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
              title="Unggah foto dari galeri perangkat"
              aria-label="Unggah foto dari galeri"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span className="text-[9px] text-white/70 mt-0.5">Galeri</span>
            </button>
          </div>

          {/* Center: Large Hero Shutter Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleTakeSnapshot()}
              disabled={countdown !== null || isAutoSessionActive}
              aria-label="Ambil foto sekarang"
              className="group relative flex items-center justify-center w-18 h-18 rounded-full border-3 border-white/60 bg-black/30 backdrop-blur-xs shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="Tekan Spasi atau Klik untuk Jepret"
            >
              <div className="w-14 h-14 rounded-full bg-[#DFD2BD] group-hover:bg-white text-[#4A121A] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-90">
                <Camera className="w-6 h-6 text-[#4A121A]" />
              </div>
            </button>
          </div>

          {/* Right Action: Flip Camera (Depan / Belakang) */}
          <div className="w-14 flex justify-end">
            <button
              onClick={handleToggleCamera}
              aria-label="Balik kamera depan / belakang"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-[#DFD2BD] hover:text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
              title="Putar Kamera Depan/Belakang"
            >
              <RefreshCw className="w-4 h-4 text-amber-300" />
              <span className="text-[9px] text-white/70 mt-0.5">Putar</span>
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
