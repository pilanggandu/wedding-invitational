"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PhotoboxLayout, PhotoboxFilter, getLayoutShotsCount } from "./types";
import { CameraCapture } from "./CameraCapture";
import { PhotoboxPasscodeGate } from "./PhotoboxPasscodeGate";
import { isPhotoboxUnlockedSession } from "./passcode";
import { getInvitationData } from "@/lib/invitationStore";
import {
  savePhotoboxDraft,
  loadPhotoboxDraft,
  clearPhotoboxDraft,
} from "./photoboxStorage";
import { PhotoboxLayoutSelect, PhotoboxFlowLayout } from "./PhotoboxLayoutSelect";
import { PhotoboxFilterView } from "./PhotoboxFilterView";
import { PhotoboxDoneView } from "./PhotoboxDoneView";

export type PhotoboxStep = "layout" | "camera" | "filter" | "done";

export function PhotoboxStudio() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [configuredPasscode, setConfiguredPasscode] = useState<string>("2026");
  const [currentStep, setCurrentStep] = useState<PhotoboxStep>("layout");
  const [layout, setLayout] = useState<PhotoboxFlowLayout>("strip-3");
  const [photos, setPhotos] = useState<string[]>(["", "", ""]);
  const [filter, setFilter] = useState<PhotoboxFilter>("original");
  const [restoreToast, setRestoreToast] = useState<string | null>(null);

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
            const chosenLayout: PhotoboxFlowLayout =
              draft.layout === "strip-2" || draft.layout === "2-strip" ? "strip-2" : "strip-3";
            setLayout(chosenLayout);

            const count = chosenLayout === "strip-2" ? 2 : 3;
            const validPhotos = draft.photos.slice(0, count);
            while (validPhotos.length < count) validPhotos.push("");
            setPhotos(validPhotos);

            // Restore step safely
            if (
              draft.currentStep === "camera" ||
              draft.currentStep === "filter" ||
              draft.currentStep === "done"
            ) {
              setCurrentStep(draft.currentStep as PhotoboxStep);
            } else {
              setCurrentStep("camera");
            }

            setRestoreToast("Sesi foto sebelumnya dipulihkan otomatis ✨");
            setTimeout(() => setRestoreToast(null), 4000);
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

  // Konfirmasi sebelum unload / refresh jika sudah ada foto
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

  // Tangani gestur tombol "Back" di Android
  useEffect(() => {
    if (currentStep !== "layout") {
      window.history.pushState({ photoboxStep: currentStep }, "");

      const handlePopState = () => {
        if (currentStep === "done") setCurrentStep("filter");
        else if (currentStep === "filter") setCurrentStep("camera");
        else if (currentStep === "camera") setCurrentStep("layout");
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
        currentStep: currentStep === "layout" ? "camera" : currentStep,
        layout,
        photos,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [photos, layout, currentStep]);

  const handleResetSession = async () => {
    const confirmed = window.confirm(
      "Mulai sesi foto baru dari awal? Foto saat ini akan dibersihkan."
    );
    if (!confirmed) return;

    await clearPhotoboxDraft();
    const count = layout === "strip-2" ? 2 : 3;
    setPhotos(Array(count).fill(""));
    setFilter("original");
    setCurrentStep("layout");
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

  const handleLayoutChange = (newLayout: PhotoboxFlowLayout) => {
    setLayout(newLayout);
    const count = newLayout === "strip-2" ? 2 : 3;
    setPhotos((prev) => {
      const copy = [...prev].slice(0, count);
      while (copy.length < count) copy.push("");
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

  // STEP 1: PILIH LAYOUT (2 Foto atau 3 Foto)
  if (currentStep === "layout") {
    return (
      <PhotoboxLayoutSelect
        selectedLayout={layout}
        onSelectLayout={handleLayoutChange}
        onStartPhoto={() => setCurrentStep("camera")}
      />
    );
  }

  // STEP 2: MULAI FOTO (Kamera Capture)
  if (currentStep === "camera") {
    return (
      <CameraCapture
        layout={layout}
        onLayoutChange={(l) => handleLayoutChange(l === "strip-2" ? "strip-2" : "strip-3")}
        photos={photos}
        onPhotosChange={setPhotos}
        onProceedToFrames={() => setCurrentStep("filter")}
        onBackToLayout={() => setCurrentStep("layout")}
        onResetSession={handleResetSession}
        restoreMessage={restoreToast}
      />
    );
  }

  // STEP 3: PILIH FILTER
  if (currentStep === "filter") {
    return (
      <PhotoboxFilterView
        layout={layout}
        photos={photos}
        selectedFilter={filter}
        onSelectFilter={setFilter}
        onBackToCamera={() => setCurrentStep("camera")}
        onProceedToDone={() => setCurrentStep("done")}
      />
    );
  }

  // STEP 4: DONE (Download & Share Story IG 1080x1920)
  return (
    <PhotoboxDoneView
      layout={layout}
      photos={photos}
      filter={filter}
      onResetSession={handleResetSession}
    />
  );
}
