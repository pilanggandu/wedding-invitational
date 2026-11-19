"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Download,
  Camera,
} from "lucide-react";

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export interface InstagramShareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  blob?: Blob;
  filename?: string;
}

export function InstagramShareGuideModal({
  isOpen,
  onClose,
  imageUrl,
  blob,
  filename = "photobox-gilang-salsa.png",
}: InstagramShareGuideModalProps) {
  const [copiedTag, setCopiedTag] = useState<boolean>(false);

  if (!isOpen) return null;

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

  const handleCopyTag = async () => {
    const textToCopy = "@gilangpermadi @salsadila.nanda #GilangSalsa2026";
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopiedTag(true);
        setTimeout(() => setCopiedTag(false), 2200);
      }
    } catch {}
  };

  const instagramLink = isMobile
    ? "instagram://story-camera"
    : "https://www.instagram.com";

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ig-guide-title"
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-[#FAF6EE] text-[#3A332C] border border-[#E8DFC8] rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Tutup panduan"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#786551] hover:text-[#4A121A] border border-[#E8DFC8] flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-md">
              <InstagramIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-[#8C6239]">
                <Sparkles className="w-3 h-3 text-[#C99A45]" />
                <span>Foto HD Tersimpan</span>
              </div>
              <h3
                id="ig-guide-title"
                className="font-serif font-bold text-lg text-[#4A121A] leading-tight"
              >
                Bagikan ke Story IG
              </h3>
            </div>
          </div>

          {/* Guide Steps */}
          <div className="space-y-2.5 text-xs text-[#5C4D3E] bg-white/70 border border-[#E8DFC8] rounded-2xl p-3.5 my-3.5">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#4A121A] text-[#FAF1D9] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p className="leading-relaxed">
                Foto photobox telah <strong>otomatis diunduh</strong> ke galeri / berkas perangkat Anda.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#4A121A] text-[#FAF1D9] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p className="leading-relaxed">
                Buka Instagram, pilih menu <strong>Cerita Anda (Story)</strong>, lalu pilih foto photobox dari galeri.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#4A121A] text-[#FAF1D9] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="space-y-1.5 flex-1">
                <p className="leading-relaxed">
                  Sertakan mention & tagar pernikahan:
                </p>
                <button
                  type="button"
                  onClick={handleCopyTag}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#FAF1D9] border border-[#E8DFC8] text-[#4A121A] text-[11px] font-mono flex items-center justify-between gap-1 hover:bg-[#F3E7C9] transition-all cursor-pointer"
                >
                  <span className="truncate">@gilangpermadi #GilangSalsa2026</span>
                  <span className="shrink-0 flex items-center gap-1 font-sans text-[10px] font-semibold text-[#8C6239]">
                    {copiedTag ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <a
              href={instagramLink}
              target={isMobile ? "_self" : "_blank"}
              rel="noopener noreferrer"
              onClick={() => {
                // Delay close slightly so native app has time to trigger
                setTimeout(onClose, 600);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center"
            >
              <InstagramIcon className="w-4 h-4 text-white" />
              <span>{isMobile ? "Buka Instagram Story" : "Buka Instagram Web"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/90" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-[#786551] hover:text-[#4A121A] hover:bg-white/60 transition-all cursor-pointer"
            >
              Selesai & Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
