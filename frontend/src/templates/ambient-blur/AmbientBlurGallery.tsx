"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ExtractedColors } from "@/lib/colorExtractor";

interface AmbientBlurGalleryProps {
  palette?: ExtractedColors;
}

export function AmbientBlurGallery({ palette }: AmbientBlurGalleryProps) {
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
  }));

  const accentColor = palette?.dominant || "#D97736";
  const glowColor = palette?.glow || "rgba(217,119,54,0.3)";

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
    <section id="gallery" className="relative py-16 px-6 text-center text-slate-800 overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="flex justify-center">
            <span
              style={{
                borderColor: `${accentColor}44`,
                backgroundColor: `${accentColor}12`,
                color: accentColor,
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest backdrop-blur-md font-semibold"
            >
              <span
                style={{ backgroundColor: accentColor }}
                className="w-1.5 h-1.5 rounded-full"
              />
              Album Kenangan
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Galeri Prewedding
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Koleksi potret kebahagiaan kami menjelang ikrar suci pernikahan.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onClick={() => setActiveModalIndex(idx)}
              style={{
                borderColor: `${accentColor}33`,
              }}
              className={`relative rounded-2xl overflow-hidden shadow-lg border group cursor-pointer bg-slate-100 ring-1 ring-slate-900/5 ${
                idx === 0 ? "col-span-2 h-56 sm:h-64" : "h-40 sm:h-48"
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 text-left">
                <span className="text-xs font-serif font-bold text-white block">
                  {item.title}
                </span>
                <span className="text-[10px] text-white/80 font-sans truncate">
                  {item.caption}
                </span>
              </div>
              <div
                style={{
                  borderColor: `${accentColor}55`,
                }}
                className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md border flex items-center justify-center text-slate-700 group-hover:text-slate-950 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {activeModalIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                borderColor: `${accentColor}44`,
                boxShadow: `0 25px 80px rgba(15,23,42,0.4), 0 0 40px ${glowColor}`,
              }}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-white/95 backdrop-blur-2xl border shadow-2xl p-2.5 text-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalIndex(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Prev / Next Controls */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={galleryItems[activeModalIndex].src}
                  alt={galleryItems[activeModalIndex].title}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                />
              </div>

              <div className="p-4 text-center">
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  {galleryItems[activeModalIndex].title}
                </h4>
                <p className="text-xs text-slate-600 font-sans mt-0.5">
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
