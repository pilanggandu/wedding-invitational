"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Palette,
  Heart,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { PhotoboxLayout, getLayoutShotsCount } from "./types";
import { CameraCapture } from "./CameraCapture";
import { FrameCustomizer } from "./FrameCustomizer";
import { PhotoboxPasscodeGate } from "./PhotoboxPasscodeGate";
import { isPhotoboxUnlockedSession } from "./passcode";
import { getInvitationData } from "@/lib/invitationStore";
import {
  savePhotoboxDraft,
  loadPhotoboxDraft,
  clearPhotoboxDraft,
  PhotoboxCustomizerDraft,
} from "./photoboxStorage";

export function PhotoboxStudio() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [configuredPasscode, setConfiguredPasscode] = useState<string>("2026");
  const [currentStep, setCurrentStep] = useState<"camera" | "frames">("camera");
  const [layout, setLayout] = useState<PhotoboxLayout>("4-strip");
  const [photos, setPhotos] = useState<string[]>(["", "", "", ""]);
  const [restoredCustomizerState, setRestoredCustomizerState] = useState<PhotoboxCustomizerDraft | null>(null);
  const [restoreToast, setRestoreToast] = useState<string | null>(null);
  const customizerStateRef = useRef<PhotoboxCustomizerDraft | null>(null);

  // Pencegahan refresh tak sengaja & pemulihan sesi otomatis di HP
  useEffect(() => {
    // 1. Kunci gesture pull-to-refresh bawaan browser mobile (Chrome / Safari)
    const origHtmlOverscroll = document.documentElement.style.overscrollBehaviorY;
    const origBodyOverscroll = document.body.style.overscrollBehaviorY;
    document.documentElement.style.overscrollBehaviorY = "contain";
    document.body.style.overscrollBehaviorY = "contain";

    // 2. Pulihkan sesi foto sebelumnya dari penyimpanan lokal jika tersedia
    const restoreActiveSession = async () => {
      try {
        const draft = await loadPhotoboxDraft();
        if (draft && Array.isArray(draft.photos) && draft.photos.some((p) => Boolean(p))) {
          const isRecent = Date.now() - draft.timestamp < 24 * 60 * 60 * 1000;
          if (isRecent) {
            if (draft.layout) setLayout(draft.layout);
            setPhotos(draft.photos);
            if (draft.currentStep) setCurrentStep(draft.currentStep);
            if (draft.customizerState) {
              setRestoredCustomizerState(draft.customizerState);
              customizerStateRef.current = draft.customizerState;
            }
            setRestoreToast("Sesi foto sebelumnya dipulihkan otomatis ✨ Editan kamu aman.");
            setTimeout(() => setRestoreToast(null), 5000);
          }
        }
      } catch (err) {
        console.debug("Tidak ada draft photobox tersimpan:", err);
      }
    };

    restoreActiveSession();

    return () => {
      document.documentElement.style.overscrollBehaviorY = origHtmlOverscroll;
      document.body.style.overscrollBehaviorY = origBodyOverscroll;
    };
  }, []);

  // Konfirmasi sebelum unload / refresh jika sudah ada foto atau sedang mengedit
  useEffect(() => {
    const hasPhotos = photos.some((p) => Boolean(p));
    if (!hasPhotos) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [photos]);

  // Tangani gestur tombol "Back" di Android agar tidak menutup halaman web saat mengedit
  useEffect(() => {
    if (currentStep === "frames") {
      window.history.pushState({ photoboxStep: "frames" }, "");

      const handlePopState = () => {
        // Alihkan kembali ke langkah kamera tanpa reload halaman
        setCurrentStep("camera");
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [currentStep]);

  // Simpan otomatis ke IndexedDB/sessionStorage setiap ada foto atau layout baru
  useEffect(() => {
    const hasPhotos = photos.some((p) => Boolean(p));
    if (!hasPhotos) return;

    const timer = setTimeout(() => {
      savePhotoboxDraft({
        version: 1,
        timestamp: Date.now(),
        currentStep,
        layout,
        photos,
        customizerState: customizerStateRef.current || undefined,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [photos, layout, currentStep]);

  const handleCustomizerStateChange = useCallback(
    (newState: PhotoboxCustomizerDraft) => {
      customizerStateRef.current = newState;
      const hasPhotos = photos.some((p) => Boolean(p));
      if (!hasPhotos) return;

      savePhotoboxDraft({
        version: 1,
        timestamp: Date.now(),
        currentStep: "frames",
        layout,
        photos,
        customizerState: newState,
      });
    },
    [layout, photos]
  );

  const handleResetSession = async () => {
    const confirmed = window.confirm(
      "Mulai sesi foto baru dari awal? Foto dan editan frame saat ini akan dibersihkan."
    );
    if (!confirmed) return;

    await clearPhotoboxDraft();
    const count = getLayoutShotsCount(layout);
    setPhotos(Array(count).fill(""));
    setRestoredCustomizerState(null);
    customizerStateRef.current = null;
    setCurrentStep("camera");
    setRestoreToast(null);
  };

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

  // Jika di langkah Kamera, tampilkan bilik Full Kamera imersif (100dvh kiosk mode)
  if (currentStep === "camera") {
    return (
      <CameraCapture
        layout={layout}
        onLayoutChange={handleLayoutChange}
        photos={photos}
        onPhotosChange={setPhotos}
        onProceedToFrames={() => setCurrentStep("frames")}
        onResetSession={handleResetSession}
        restoreMessage={restoreToast}
      />
    );
  }

  const hasPhotosTaken = photos.some((p) => Boolean(p));

  return (
    <div className="min-h-dvh bg-[#FAF6EE] text-[#3A332C] flex flex-col font-sans selection:bg-[#DFD2BD] selection:text-[#4A121A] overscroll-y-contain">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E8DFC8] px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 overscroll-contain">
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
          {/* Tombol Mulai Baru jika sudah ada foto */}
          {hasPhotosTaken && (
            <button
              onClick={handleResetSession}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white hover:bg-rose-50 text-[#786551] hover:text-rose-700 border border-[#E8DFC8] text-[11px] font-semibold transition-all shadow-xs active:scale-95 cursor-pointer min-h-[32px] sm:min-h-[34px]"
              title="Reset foto & mulai dari awal"
            >
              <RotateCcw className="w-3 h-3 text-[#8C6239]" />
              <span className="hidden sm:inline">Mulai Baru</span>
            </button>
          )}

          {/* Step Navigation Pill Indicator */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white p-1 sm:px-2.5 sm:py-1 rounded-full border border-[#E8DFC8] shadow-xs">
            <button
              onClick={() => setCurrentStep("camera")}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-[#786551] hover:text-[#2A241D] transition-all cursor-pointer min-h-[32px] sm:min-h-[34px]"
              aria-label="Kembali ke Langkah 1: Kamera"
            >
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">1. Kamera</span>
              <span className="xs:hidden font-mono font-bold">1</span>
            </button>

            <span className="text-[#C5B7A1] text-[10px] sm:text-xs">/</span>

            <button
              onClick={() => setCurrentStep("frames")}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#4A121A] text-[#DFD2BD] shadow-xs cursor-pointer min-h-[32px] sm:min-h-[34px]"
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

      {/* Reassurance Banner jika sesi dipulihkan otomatis */}
      {restoreToast && (
        <div className="bg-[#4A121A] text-[#DFD2BD] px-4 py-2 text-xs flex items-center justify-between gap-2 shadow-sm animate-in slide-in-from-top-2 duration-200 border-b border-[#E8DFC8]/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C99A45] shrink-0" />
            <span className="font-medium">{restoreToast}</span>
          </div>
          <button
            onClick={handleResetSession}
            className="text-[11px] font-bold text-[#E5B869] underline hover:text-white cursor-pointer px-2 py-0.5"
          >
            Mulai Ulang
          </button>
        </div>
      )}

      {/* Main Studio Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 overscroll-contain">
        <FrameCustomizer
          layout={layout}
          onLayoutChange={handleLayoutChange}
          photos={photos}
          onPhotosChange={setPhotos}
          initialCustomizerState={restoredCustomizerState}
          onCustomizerStateChange={handleCustomizerStateChange}
          onBackToCamera={() => setCurrentStep("camera")}
          onResetSession={handleResetSession}
        />
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
