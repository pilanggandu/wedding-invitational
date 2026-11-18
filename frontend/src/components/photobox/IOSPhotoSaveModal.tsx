"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Share2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Download,
} from "lucide-react";

export interface IOSPhotoSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  blob?: Blob;
  filename?: string;
  title?: string;
}

export function IOSPhotoSaveModal({
  isOpen,
  onClose,
  imageUrl,
  blob,
  filename = "photobox-kenangan.png",
  title = "Foto Photobox Gilang & Salsa",
}: IOSPhotoSaveModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen || !imageUrl) return null;

  const handleShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      setIsSharing(true);
      if (blob) {
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title,
            text: "Kenangan Photobox Pernikahan Gilang & Salsadila",
          });
          return;
        }
      }
      await navigator.share({
        title,
        url: imageUrl,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.warn("Gagal membagikan:", err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (blob && typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(imageUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      }
    } catch {
      alert("Browser tidak mendukung salin langsung.");
    }
  };

  const canShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-save-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm bg-[#FAF6EE] rounded-3xl p-4 sm:p-5 shadow-2xl border border-[#E8DFC8] flex flex-col items-center max-h-[92vh]"
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4A121A]/10 text-[#4A121A] flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-[#4A121A]" />
            </div>
            <div>
              <h3 id="ios-save-title" className="font-serif font-bold text-sm text-[#14161C]">
                Simpan ke Galeri iPhone
              </h3>
              <p className="text-[10px] text-[#717686]">Panduan unduh foto di perangkat iOS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#717686] transition-colors cursor-pointer"
            aria-label="Tutup jendela simpan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Petunjuk Simpan untuk iOS */}
        <div className="w-full my-3 p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-start gap-2.5 shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-950 leading-relaxed">
            <p className="font-semibold text-amber-900 mb-0.5">Cara Simpan ke Galeri Foto:</p>
            <p>
              Sentuh dan tahan (tekan lama) gambar di bawah, lalu pilih menu{" "}
              <strong className="underline decoration-amber-600">Simpan Gambar</strong> (Save Image).
            </p>
          </div>
        </div>

        {/* Tampilan Gambar dengan Touch-Callout aktif untuk iOS */}
        <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-auto my-1 py-1">
          <img
            src={imageUrl}
            alt="Hasil Foto Photobox Siap Simpan"
            className="max-h-[46vh] w-auto rounded-xl shadow-md border border-[#E8DFC8] cursor-pointer"
            style={{
              WebkitTouchCallout: "default",
              WebkitUserSelect: "auto",
              userSelect: "auto",
            }}
          />
        </div>

        {/* Tombol Aksi Tambahan */}
        <div className="w-full flex flex-col gap-2 pt-3 border-t border-[#E8DFC8]">
          {canShare && (
            <button
              type="button"
              onClick={handleShare}
              disabled={isSharing}
              className="w-full py-2.5 rounded-xl bg-[#4A121A] hover:bg-[#5C1D24] text-[#DFD2BD] text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all disabled:opacity-50 min-h-[42px]"
            >
              <Share2 className="w-4 h-4 text-[#DFD2BD]" />
              <span>{isSharing ? "Membuka Menu..." : "Buka Menu Simpan (Share Sheet)"}</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-white border border-[#E8DFC8] hover:bg-[#F5EFE4] text-[#4A121A] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-colors min-h-[40px] text-center"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>Buka di Tab Baru</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="py-2 px-3 rounded-xl bg-white border border-[#E8DFC8] hover:bg-[#F5EFE4] text-[#4A121A] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-colors min-h-[40px]"
            >
              {copySuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8C6239]" />
                  <span>Salin Foto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
