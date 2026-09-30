"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Heart } from "lucide-react";
import { WEDDING_DATA, GalleryPhoto } from "@/data/weddingData";
import { PhotoPlaceholder, BotanicalLeaves, TornPaperDivider } from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function GallerySection() {
  const { gallery } = WEDDING_DATA;
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  return (
    <section id="galeri" className="relative py-16 paper-texture overflow-hidden">
      {/* Decorative leaf cutouts */}
      <BotanicalLeaves className="absolute -top-10 -left-6 w-36 h-56 opacity-35 rotate-12 pointer-events-none" />
      <BotanicalLeaves className="absolute bottom-10 -right-8 w-44 h-64 opacity-35 -rotate-45 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="font-serif italic text-xs tracking-widest uppercase text-[#947358] block mb-1">
              Galeri Momen
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#3A3027] mb-2">
              Potret Bahagia
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#786452]">
              Koleksi potret kenangan yang merekam jejak langkah kami menuju pelaminan
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
                          : photo.id === 4
                          ? "rings"
                          : photo.id === 5
                          ? "bride"
                          : "gallery"
                      }
                      caption={photo.caption}
                      tag={photo.tag}
                      tapePosition={tapePos}
                      tiltAngle={tilt}
                      className="w-full"
                    />

                    {/* Hover overlay hint */}
                    <div className="absolute inset-0 bg-[#35261B]/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="p-2.5 rounded-full bg-[#FAF6EE]/95 text-[#352B24] shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                        <ZoomIn className="w-5 h-5 text-[#A85A42]" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231A14]/75 backdrop-blur-xs"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="paper-sheet rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl border-2 border-[#D9C6AE]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF6EE] text-[#6A5745] hover:text-[#A85A42] border border-[#DECBB4] shadow-xs cursor-pointer hover:scale-110 transition-transform"
                aria-label="Tutup Pratinjau"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Washi Tape */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 washi-tape opacity-90" />

              <div className="mt-2 text-center">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-[#F3E9DA] text-[#7A6451] mb-3">
                  {selectedPhoto.tag}
                </span>

                {/* Photo Display Placeholder */}
                <div className="my-2 flex justify-center">
                  <PhotoPlaceholder
                    variant={
                      selectedPhoto.id === 1
                        ? "couple"
                        : selectedPhoto.id === 2
                        ? "landscape"
                        : selectedPhoto.id === 4
                        ? "rings"
                        : selectedPhoto.id === 5
                        ? "bride"
                        : "gallery"
                    }
                    caption=""
                    tapePosition="none"
                    tiltAngle="straight"
                    className="w-full max-w-sm"
                  />
                </div>

                <p className="font-script text-xl sm:text-2xl text-[#3A3027] mt-4 mb-2">
                  {selectedPhoto.caption}
                </p>

                <div className="flex items-center justify-center gap-1.5 text-xs text-[#9E8C7C] font-sans">
                  <Heart className="w-3.5 h-3.5 text-[#C26D53] fill-current animate-pulse" />
                  <span>Dokumentasi Prewedding Dimas & Sarah</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#F4EFE6" />
      </div>
    </section>
  );
}
