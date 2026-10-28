"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { DoodlePawSticker } from "./PaintedDecorations";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

export function PaintedCatsGallery() {
  const data = useWeddingData();

  const userPreweddings = data.general?.preweddingPhotos || [];
  const defaultArtworks = [
    {
      src: "/images/cats/cats-couple.png",
      title: "Cinta di Ambang Jendela",
      caption: "Kucing putih dan oranye corak putih berpelukan hangat di bawah cahaya mentari",
    },
    {
      src: "/images/cats/white-cat-groom.png",
      title: "Sang Mempelai Pria (The Groom)",
      caption: "Potret gagah kucing putih berbusana dasi kupu-kupu",
    },
    {
      src: "/images/cats/orange-cat-bride.png",
      title: "Sang Mempelai Wanita (The Bride)",
      caption: "Potret anggun kucing oren corak putih dengan mahkota bunga dan selubung",
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
    <SectionMotion id="gallery" className="relative py-16 px-6 text-center text-[#38241B] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        <ItemMotion variant="slide-down" delay={0.06} className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF4EC] border border-[#FCD5CE] text-[11px] font-sans font-bold text-[#DF7B54] mx-auto shadow-2xs">
            <ItemMotion float={true} floatDistance={3} floatDuration={3}>
              <DoodlePawSticker className="w-3.5 h-3.5" rotate={0} />
            </ItemMotion>
            <span>Galeri Scrapbook</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#38241B]">
            Koleksi Momen Manis
          </h2>
          <p className="text-xs text-[#6E5345] max-w-xs mx-auto leading-relaxed">
            Potret penuh keceriaan, kasih sayang, dan kehangatan bersama orang-orang tercinta.
          </p>
        </ItemMotion>

        <div className="grid grid-cols-2 gap-3.5">
          {artworks.map((item, idx) => (
            <ItemMotion
              key={idx}
              variant={idx === 0 ? "pop" : idx % 2 === 1 ? "slide-left" : "slide-right"}
              delay={idx * 0.08}
              onClick={() => setActiveModalIndex(idx)}
              className={`relative rounded-[24px] overflow-hidden shadow-[0_12px_28px_rgba(222,125,84,0.1)] border-[3.5px] border-white ring-1 ring-[#F3DFD1] bg-white group cursor-pointer ${
                idx === 0 ? "col-span-2 h-56 sm:h-64" : "h-44 sm:h-52"
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 text-left">
                <span className="text-xs font-serif font-bold text-white block">
                  {item.title}
                </span>
                <span className="text-[10px] text-white/85 font-sans truncate">
                  {item.caption}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#DF7B54] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ZoomIn className="w-4 h-4" />
              </div>
            </ItemMotion>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-[32px] overflow-hidden bg-[#FFFDF9] border-[4px] border-white ring-1 ring-[#F3DFD1] shadow-2xl p-3.5 text-center"
            >
              <button
                type="button"
                onClick={() => setActiveModalIndex(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#38241B] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#DF7B54] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#DF7B54] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="max-h-[68vh] rounded-[22px] overflow-hidden border border-[#F3DFD1] bg-[#FAF5ED]">
                <img
                  src={artworks[activeModalIndex].src}
                  alt={artworks[activeModalIndex].title}
                  className="w-full h-auto max-h-[68vh] object-contain mx-auto"
                />
              </div>

              <div className="p-4 text-center">
                <h4 className="font-serif font-bold text-base text-[#38241B]">
                  {artworks[activeModalIndex].title}
                </h4>
                <p className="text-xs text-[#6E5345] font-sans mt-0.5">
                  {artworks[activeModalIndex].caption}
                </p>
                <span className="text-[11px] font-sans font-bold text-[#DF7B54] block mt-1.5">
                  Foto {activeModalIndex + 1} dari {artworks.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionMotion>
  );
}

