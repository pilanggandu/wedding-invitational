"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Camera,
  Heart,
  Loader2,
} from "lucide-react";
import { PhotoboxFlowLayout } from "./PhotoboxLayoutSelect";
import { PhotoboxStoryFrame } from "./PhotoboxStoryFrame";
import { PhotoboxFilter } from "./types";
import { generatePhotoboxStoryCanvas } from "./canvasExport";
import { downloadCanvasImage } from "./photoDownload";
import { IOSPhotoSaveModal } from "./IOSPhotoSaveModal";

interface PhotoboxDoneViewProps {
  layout: PhotoboxFlowLayout;
  photos: string[];
  filter: PhotoboxFilter;
  onResetSession: () => void;
}

export function PhotoboxDoneView({
  layout,
  photos,
  filter,
  onResetSession,
}: PhotoboxDoneViewProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [iosModalData, setIosModalData] = useState<{
    blobUrl: string;
    filename: string;
  } | null>(null);

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

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const canvas = await generatePhotoboxStoryCanvas({
        layout,
        photos,
        filter,
      });

      const filename = `photobox-gilang-salsa-${layout}-${Date.now()}.png`;
      const result = await downloadCanvasImage(canvas, {
        filename,
        title: "Photobox Gilang & Salsa Wedding",
        text: "Kenangan Photobox Pernikahan Gilang & Salsa • 28 November 2026",
      });

      if (result.method === "modal") {
        setIosModalData({
          blobUrl: result.blobUrl,
          filename: result.filename,
        });
      }
    } catch (err) {
      console.error("Gagal export canvas photobox:", err);
      alert("Gagal mengunduh foto. Silakan coba kembali.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareStory = async () => {
    try {
      setIsSharing(true);
      const canvas = await generatePhotoboxStoryCanvas({
        layout,
        photos,
        filter,
      });

      const filename = `photobox-gilang-salsa-${Date.now()}.png`;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsSharing(false);
          return;
        }

        const file = new File([blob], filename, { type: "image/png" });

        if (
          typeof navigator !== "undefined" &&
          typeof navigator.canShare === "function" &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              files: [file],
              title: "Photobox Gilang & Salsa",
              text: "Momen kenangan di pernikahan Gilang & Salsa #GilangSalsa2026",
            });
          } catch (e: unknown) {
            if (e instanceof Error && e.name !== "AbortError") {
              handleDownload();
            }
          }
        } else {
          // Fallback to normal download if share is not supported
          handleDownload();
        }
        setIsSharing(false);
      }, "image/png");
    } catch (err) {
      console.error("Share error:", err);
      setIsSharing(false);
      handleDownload();
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
            Siap untuk Story Instagram! ✨
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
          {/* Tombol Download HD */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-4 px-6 rounded-2xl bg-[#4A121A] hover:bg-[#380D13] disabled:opacity-70 text-[#FAF1D9] font-semibold text-sm sm:text-base shadow-lg shadow-[#4A121A]/20 flex items-center justify-center gap-2.5 cursor-pointer transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#C99A45]" />
                <span>Menyiapkan Gambar HD...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 text-[#C99A45]" />
                <span>Unduh Foto Story IG (HD)</span>
              </>
            )}
          </motion.button>

          {/* Tombol Share ke Instagram Story */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleShareStory}
            disabled={isSharing}
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-[#FAF6EE] text-[#4A121A] border-2 border-[#4A121A]/30 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#4A121A]" />
                <span>Membuka Menu Berbagi...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#8C6239]" />
                <span>Bagikan ke Instagram Story</span>
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
