"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { CatPawPrint } from "./PaintedDecorations";

export function PaintedCatsGallery() {
  const data = useWeddingData();

  const userPreweddings = data.general?.preweddingPhotos || [];
  const defaultArtworks = [
    {
      src: "/images/cats/cats-couple.jpg",
      title: "Cinta di Ambang Jendela",
      caption: "Kucing putih dan oranye corak putih berpelukan hangat di bawah cahaya mentari",
    },
    {
      src: "/images/cats/orange-cat-groom.jpg",
      title: "Sang Mempelai Pria (The Groom)",
      caption: "Potret gagah kucing oranye corak putih berbusana dasi kupu-kupu",
    },
    {
      src: "/images/cats/white-cat-bride.jpg",
      title: "Sang Mempelai Wanita (The Bride)",
      caption: "Potret anggun kucing putih bermata biru dengan mahkota bunga dan selubung",
    },
    {
      src: "/images/prewedding/couple-1.jpg",
      title: "Potret Kenangan Dua Hati",
      caption: "Genggaman tangan abadi menuju masa depan bahagia",
    },
  ];

  const artworks =
    userPreweddings.length > 0
      ? userPreweddings.map((src, idx) => ({
          src,
          title:
            data.gallery?.[idx]?.caption ||
            (idx === 0
              ? "Potret Dua Hati"
              : `Momen Bahagia 0${idx + 1}`),
          caption:
            data.gallery?.[idx]?.tag ||
            "Koleksi potret prewedding kedua mempelai",
        }))
      : defaultArtworks;

  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex - 1 + artworks.length) % artworks.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex + 1) % artworks.length);
    }
  };

  return (
    <section id="gallery" className="relative py-16 px-6 text-center text-[#2C2623] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-1.5">
            <CatPawPrint className="w-3.5 h-3.5 text-[#D97736]" color="#D97736" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A17]">
              Galeri Kanvas
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2623]">
            Koleksi Seni &amp; Potret
          </h2>
          <p className="text-xs text-[#7A6150] max-w-xs mx-auto leading-relaxed">
            Lukisan minyak dan potret kenangan indah penuh kehangatan serta rasa syukur.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {artworks.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onClick={() => setActiveModalIndex(idx)}
              className={`relative rounded-2xl overflow-hidden shadow-sm border-2 border-[#EAD8C7] bg-white group cursor-pointer ${
                idx === 0 ? "col-span-2 h-56 sm:h-64" : "h-44 sm:h-52"
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-left">
                <span className="text-xs font-serif font-bold text-white block">
                  {item.title}
                </span>
                <span className="text-[10px] text-white/80 font-sans truncate">
                  {item.caption}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white/90 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-[#FAF6EE] border-2 border-[#EAD8C7] shadow-2xl p-3 text-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalIndex(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Prev / Next Controls */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="max-h-[68vh] rounded-2xl overflow-hidden border border-[#E8D9CB] bg-black">
                <img
                  src={artworks[activeModalIndex].src}
                  alt={artworks[activeModalIndex].title}
                  className="w-full h-auto max-h-[68vh] object-contain mx-auto"
                />
              </div>

              <div className="p-4 text-center">
                <h4 className="font-serif font-bold text-base text-[#2C2623]">
                  {artworks[activeModalIndex].title}
                </h4>
                <p className="text-xs text-[#7A6150] font-sans mt-0.5">
                  {artworks[activeModalIndex].caption}
                </p>
                <span className="text-[10px] font-mono text-[#C85A17] block mt-1">
                  Karya {activeModalIndex + 1} dari {artworks.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
