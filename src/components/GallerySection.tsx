"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Heart, Sparkles } from "lucide-react";
import { WEDDING_DATA, GalleryPhoto } from "@/data/weddingData";
import {
  PhotoPlaceholder,
  KidsDrawingHeart,
  KidsDrawingStar,
  KidsDrawingSun,
  CrayonWashiTape,
  TornPaperDivider,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function GallerySection() {
  const { gallery } = WEDDING_DATA;
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  return (
    <section id="galeri" className="relative py-16 paper-texture bg-[#FFFDF8] overflow-hidden">
      {/* Decorative Doodles */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-80">
        <KidsDrawingSun className="w-14 h-14" />
      </div>
      <div className="absolute bottom-10 -right-2 pointer-events-none opacity-80">
        <KidsDrawingStar className="w-10 h-10 text-[#FBBF24]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="font-script text-2xl text-[#EF4444] font-bold block mb-1">
              Dokumentasi Hasil Jepretan Lucu 📸
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#222222] mb-2">
              Galeri Momen
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#4B5563]">
              Sedikit cuplikan gaya sok keren kami sebelum resmi jadi suami istri:
            </p>
          </div>
        </MotionReveal>

        {/* Polaroid Scrapbook Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {gallery.map((photo, index) => {
            const tilt = index % 3 === 0 ? "left" : index % 3 === 1 ? "right" : "straight";
            const tapePos = index % 2 === 0 ? "top-left" : "top-right";

            return (
              <MotionReveal
                key={photo.id}
                variant="polaroid-drop"
                delay={0.1 * index}
                className="w-full max-w-[270px]"
              >
                <div
                  onClick={() => setSelectedPhoto(photo)}
                  className="cursor-pointer group transform transition-all duration-300 w-full"
                >
                  <div className="relative">
                    <PhotoPlaceholder
                      variant={
                        photo.id === 1
                          ? "couple"
                          : photo.id === 2
                          ? "landscape"
                          : photo.id === 3
                          ? "groom"
                          : photo.id === 4
                          ? "rings"
                          : photo.id === 5
                          ? "bride"
                          : "boba"
                      }
                      caption={photo.caption}
                      tag={photo.tag}
                      stickerText={photo.doodleSticker}
                      tapePosition={tapePos}
                      tiltAngle={tilt}
                      className="w-full"
                    />

                    {/* Hover overlay hint */}
                    <div className="absolute inset-0 bg-[#222222]/15 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="p-3 rounded-full bg-white text-[#222222] border-2 border-[#222222] shadow-[2px_3px_0px_#222222] transform scale-90 group-hover:scale-110 transition-transform">
                        <ZoomIn className="w-5 h-5 text-[#EF4444]" />
                      </span>
                    </div>
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222222]/80 backdrop-blur-xs"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="crayon-box p-6 sm:p-8 max-w-lg w-full relative bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button with >=44px touch target */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-[#FEF08A] text-[#222222] border-2 border-[#222222] shadow-[2px_2px_0px_#222222] hover:bg-[#FDE047] cursor-pointer hover:scale-110 transition-transform"
                aria-label="Tutup Pratinjau"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cute Crayon Washi Tape */}
              <CrayonWashiTape
                text="♥ FOTO FAVORIT ♥"
                color="pink"
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20"
              />

              <div className="mt-2 text-center">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-script font-bold bg-[#FEF08A] text-[#222222] border-2 border-[#222222] mb-3 shadow-[2px_2px_0px_#222222]">
                  {selectedPhoto.doodleSticker}
                </span>

                {/* Photo Display Placeholder */}
                <div className="my-2 flex justify-center">
                  <PhotoPlaceholder
                    variant={
                      selectedPhoto.id === 1
                        ? "couple"
                        : selectedPhoto.id === 2
                        ? "landscape"
                        : selectedPhoto.id === 3
                        ? "groom"
                        : selectedPhoto.id === 4
                        ? "rings"
                        : selectedPhoto.id === 5
                        ? "bride"
                        : "boba"
                    }
                    caption=""
                    tapePosition="none"
                    tiltAngle="straight"
                    className="w-full max-w-sm"
                  />
                </div>

                <p className="font-script text-xl sm:text-2xl text-[#222222] font-bold mt-4 mb-2">
                  &ldquo;{selectedPhoto.caption}&rdquo;
                </p>

                <div className="flex items-center justify-center gap-1.5 text-xs text-[#4B5563] font-mono font-semibold">
                  <Heart className="w-3.5 h-3.5 text-[#EF4444] fill-current animate-pulse" />
                  <span>Album Prewedding Dimas & Sarah</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FEF9E7" />
      </div>
    </section>
  );
}
