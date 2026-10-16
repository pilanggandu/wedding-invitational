"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight, Film } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { FilmTimecodeBadge, CameraCropMarks } from "./CinematicDecorations";

export function CinematicGallery() {
  const data = useWeddingData();
  const userPreweddings = data.general?.preweddingPhotos || [];
  const defaultImages = [
    "/images/prewedding/couple-1.jpg",
    "/images/prewedding/couple-2.jpg",
    "/images/prewedding/couple-3.jpg",
    "/images/prewedding/couple-4.jpg",
    "/images/prewedding/couple-5.jpg",
  ];
  const photoList = userPreweddings.length > 0 ? userPreweddings : defaultImages;
  const galleryItems = photoList.map((src, idx) => ({
    src,
    title: data.gallery?.[idx]?.caption || (idx === 0 ? "Momen Senja di Tepi Pantai" : idx === 1 ? "Tatapan Penuh Makna" : idx === 2 ? "Genggaman Abadi" : idx === 3 ? "Siluet Temu Bahagia" : "Tawa yang Sefrekuensi"),
    caption: data.gallery?.[idx]?.tag || "Potret Kenangan Prewedding",
    frameNumber: `FRAME ${String(idx + 21).padStart(2, "0")}A`,
  }));

  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex + 1) % galleryItems.length);
    }
  };

  return (
    <section id="gallery" className="relative py-14 px-4 text-center text-white overflow-hidden">
      <div className="max-w-md mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <FilmTimecodeBadge scene="SEQUENCE 04" take="35MM ARCHIVE" className="mb-2" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Galeri Prewedding
          </h2>
          <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed font-sans">
            Rekaman visual dan potongan adegan sebelum melangkah ke babak kehidupan baru.
          </p>
        </motion.div>

        <div className="space-y-4">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              onClick={() => setActiveModalIndex(idx)}
              className="bg-black rounded-2xl overflow-hidden border border-white/20 shadow-xl cursor-pointer group"
            >
              <div className="bg-zinc-950 py-1 px-3 flex items-center justify-between border-b border-white/10 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  <span className="text-[8px] font-mono tracking-widest text-white/50 ml-1">KODAK 500T</span>
                </div>
                <span className="text-[8px] font-mono tracking-widest text-amber-300">{item.frameNumber}</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                </div>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <CameraCropMarks className="opacity-50" />
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between z-20 text-left">
                  <div>
                    <span className="text-xs font-serif font-bold text-white block">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-white/70 font-sans truncate block">
                      {item.caption}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 py-1 px-3 flex items-center justify-between border-t border-white/10 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                </div>
                <span className="text-[8px] font-mono tracking-widest text-white/40">35MM NEGATIVE FILM</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-sm bg-white/40" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeModalIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveModalIndex(null)}
              className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-white/25 bg-black shadow-2xl"
            >
              <div className="bg-zinc-950 py-1.5 px-4 flex items-center justify-between text-[10px] font-mono text-white/60 border-b border-white/15">
                <span className="text-amber-400 font-bold">{galleryItems[activeModalIndex].frameNumber}</span>
                <span>{activeModalIndex + 1} / {galleryItems.length}</span>
              </div>
              <img
                src={galleryItems[activeModalIndex].src}
                alt={galleryItems[activeModalIndex].title}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
              <div className="p-4 bg-zinc-950 border-t border-white/15 text-left">
                <h4 className="text-sm font-serif font-bold text-white">
                  {galleryItems[activeModalIndex].title}
                </h4>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  {galleryItems[activeModalIndex].caption}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
