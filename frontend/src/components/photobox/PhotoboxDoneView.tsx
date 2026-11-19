"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Camera,
  Heart,
  Loader2,
  Check,
} from "lucide-react";
import { PhotoboxFlowLayout } from "./PhotoboxLayoutSelect";
import { PhotoboxStoryFrame } from "./PhotoboxStoryFrame";
import { PhotoboxFilter } from "./types";
import { generatePhotoboxStoryCanvas } from "./canvasExport";
import { downloadCanvasImage } from "./photoDownload";
import { IOSPhotoSaveModal } from "./IOSPhotoSaveModal";
import {
  InstagramShareGuideModal,
  InstagramIcon,
} from "./InstagramShareGuideModal";

interface PhotoboxDoneViewProps {
  layout: PhotoboxFlowLayout;
  photos: string[];
  filter: PhotoboxFilter;
  onResetSession: () => void;
}

interface ExportedMedia {
  canvas: HTMLCanvasElement;
  blob: Blob;
  blobUrl: string;
  file: File;
  filename: string;
}

export function PhotoboxDoneView({
  layout,
  photos,
  filter,
  onResetSession,
}: PhotoboxDoneViewProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shareGuideModalOpen, setShareGuideModalOpen] = useState<boolean>(false);
  const [iosModalData, setIosModalData] = useState<{
    blobUrl: string;
    filename: string;
  } | null>(null);

  const [preparedExport, setPreparedExport] = useState<ExportedMedia | null>(null);
  const preparedExportRef = useRef<ExportedMedia | null>(null);
  preparedExportRef.current = preparedExport;

  // Trigger celebration confetti when screen loads
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C99A45", "#FAF1D9", "#4A121A", "#DFD2BD"],
      });
    } catch {}
  }, []);

  // Pre-generate HD canvas and file in background so downloads & sharing are instant
  useEffect(() => {
    let isCancelled = false;

    const prepare = async () => {
      try {
        const canvas = await generatePhotoboxStoryCanvas({
          layout,
          photos,
          filter,
        });
        if (isCancelled) return;

        const dataUrl = canvas.toDataURL("image/png");
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        if (isCancelled) return;

        const filename = `photobox-gilang-salsa-${layout}-${Date.now()}.png`;
        const file = new File([blob], filename, { type: "image/png" });
        const blobUrl = URL.createObjectURL(blob);

        const exported: ExportedMedia = {
          canvas,
          blob,
          blobUrl,
          file,
          filename,
        };

        preparedExportRef.current = exported;
        setPreparedExport(exported);
      } catch (err) {
        console.warn("Pre-render canvas error:", err);
      }
    };

    prepare();

    return () => {
      isCancelled = true;
    };
  }, [layout, photos, filter]);

  // Helper to ensure media is ready
  const getOrGenerateExport = async (): Promise<ExportedMedia> => {
    if (preparedExportRef.current) {
      return preparedExportRef.current;
    }
    const canvas = await generatePhotoboxStoryCanvas({
      layout,
      photos,
      filter,
    });
    const dataUrl = canvas.toDataURL("image/png");
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const filename = `photobox-gilang-salsa-${layout}-${Date.now()}.png`;
    const file = new File([blob], filename, { type: "image/png" });
    const blobUrl = URL.createObjectURL(blob);

    const exported: ExportedMedia = {
      canvas,
      blob,
      blobUrl,
      file,
      filename,
    };
    preparedExportRef.current = exported;
    setPreparedExport(exported);
    return exported;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Unduh HD
  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const exported = await getOrGenerateExport();

      const result = await downloadCanvasImage(exported.canvas, {
        filename: exported.filename,
        title: "Photobox Gilang & Salsa Wedding",
        text: "Kenangan Photobox Pernikahan Gilang & Salsa • 28 November 2026",
        precomputedBlob: exported.blob,
        precomputedFile: exported.file,
      });

      if (result.method === "modal") {
        setIosModalData({
          blobUrl: result.blobUrl,
          filename: result.filename,
        });
      } else {
        showToast("Foto HD berhasil diunduh ✨");
      }
    } catch (err) {
      console.error("Gagal export canvas photobox:", err);
      alert("Gagal mengunduh foto. Silakan coba kembali.");
    } finally {
      setIsExporting(false);
    }
  };

  // Bagikan ke Instagram
  const handleShareStory = async () => {
    const exp = preparedExportRef.current;

    // 1. Direct Web Share API attempt on supported devices (iOS Safari & Android Chrome)
    // Synchronous execution ensures the browser transient user gesture is strictly preserved
    const canNativeShare =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function";

    if (exp && canNativeShare && navigator.canShare({ files: [exp.file] })) {
      try {
        await navigator.share({
          files: [exp.file],
          title: "Photobox Gilang & Salsa",
          text: "Momen kenangan di pernikahan Gilang & Salsa #GilangSalsa2026",
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // User closed share sheet without selecting an app
          return;
        }
        console.warn("navigator.share failed, fallback to download & IG guide:", err);
      }
    }

    // 2. Fallback for Desktop PC, in-app browsers, or when native file share is unsupported:
    // Automatically save the photo, copy to clipboard, and open Instagram guidance / deep link
    try {
      setIsSharing(true);
      const exported = await getOrGenerateExport();

      // Trigger download so the image is safely saved in user device
      const link = document.createElement("a");
      link.href = exported.blobUrl;
      link.download = exported.filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 1000);

      // Copy image to clipboard if supported
      if (
        typeof navigator !== "undefined" &&
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard?.write
      ) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": exported.blob }),
          ]);
        } catch {}
      }

      // Check if on mobile device to attempt opening Instagram app directly
      const isMobile =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

      if (isMobile) {
        setTimeout(() => {
          window.location.href = "instagram://story-camera";
        }, 350);
      }

      setShareGuideModalOpen(true);
    } catch (err) {
      console.error("Gagal fallback bagikan ke Instagram:", err);
      handleDownload();
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#FAF6EE] text-[#3A332C] flex flex-col font-sans selection:bg-[#DFD2BD] selection:text-[#4A121A]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E8DFC8] px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#4A121A] text-[#FAF1D9] flex items-center justify-center">
            <Heart className="w-4 h-4 fill-current text-[#C99A45]" />
          </div>
          <div>
            <div className="font-serif font-bold text-sm text-[#4A121A]">
              Gilang & Salsa Wedding
            </div>
            <p className="text-[10px] text-[#786551]">28 November 2026</p>
          </div>
        </div>

        <button
          onClick={onResetSession}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 text-[#786551] hover:text-rose-700 border border-[#E8DFC8] text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#8C6239]" />
          <span>Foto Lagi</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-between gap-4">
        {/* Celebration Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C99A45]/15 text-[#8C6239] text-xs font-bold mb-1.5 border border-[#C99A45]/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6239]" />
            <span>Foto Berhasil Dibuat</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#4A121A]">
            Foto Siap Dibagikan! ✨
          </h2>
          <p className="text-xs text-[#786551] mt-0.5">
            Format 9:16 pas untuk layar HP. Jangan lupa tag <strong>#GilangSalsa2026</strong> ya!
          </p>
        </div>

        {/* Live Frame Preview (9:16) */}
        <div className="w-full flex justify-center items-center py-1">
          <div className="w-[230px] xs:w-[260px] sm:w-[290px] drop-shadow-2xl transition-all">
            <PhotoboxStoryFrame layout={layout} photos={photos} filter={filter} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-1">
          {/* Tombol Unduh HD */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-4 px-6 rounded-2xl bg-[#4A121A] hover:bg-[#380D13] disabled:opacity-70 text-[#FAF1D9] font-semibold text-sm sm:text-base shadow-lg shadow-[#4A121A]/20 flex items-center justify-center gap-2.5 cursor-pointer transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#C99A45]" />
                <span>Menyiapkan HD...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 text-[#C99A45]" />
                <span>Unduh HD</span>
              </>
            )}
          </motion.button>

          {/* Tombol Bagikan ke Instagram */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleShareStory}
            disabled={isSharing}
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-[#FAF6EE] text-[#4A121A] border-2 border-[#4A121A]/30 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#4A121A]" />
                <span>Membuka Instagram...</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Bagikan ke Instagram</span>
              </>
            )}
          </motion.button>

          {/* Tombol Foto Lagi */}
          <button
            onClick={onResetSession}
            className="w-full py-3 px-4 rounded-xl text-center text-xs font-semibold text-[#786551] hover:text-[#4A121A] hover:bg-white/60 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Camera className="w-4 h-4 text-[#8C6239]" />
            <span>Mulai Sesi Foto Baru</span>
          </button>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#4A121A] text-[#FAF1D9] border border-[#C99A45]/40 px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 text-[#C99A45]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instagram Share Guide Modal (for desktop & fallback) */}
      <InstagramShareGuideModal
        isOpen={shareGuideModalOpen}
        onClose={() => setShareGuideModalOpen(false)}
        imageUrl={preparedExport?.blobUrl}
        blob={preparedExport?.blob}
        filename={preparedExport?.filename}
      />

      {/* iOS Safari Save Modal */}
      {iosModalData && (
        <IOSPhotoSaveModal
          isOpen={Boolean(iosModalData)}
          imageUrl={iosModalData.blobUrl}
          filename={iosModalData.filename}
          onClose={() => setIosModalData(null)}
        />
      )}
    </div>
  );
}
