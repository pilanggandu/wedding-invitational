"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WeddingDataProvider } from "@/context/WeddingDataContext";
import { TemplateProps } from "@/templates/types";
import { getFontFamilyCss } from "@/lib/typography";

import { PaintedCanvasBackground } from "./PaintedCanvasBackground";
import { PaintedCatsCover } from "./PaintedCatsCover";
import { PaintedCatsDesktopLeft } from "./PaintedCatsDesktopLeft";
import { PaintedCatsHero } from "./PaintedCatsHero";
import { PaintedCatsCouple } from "./PaintedCatsCouple";
import { PaintedCatsEvents } from "./PaintedCatsEvents";
import { PaintedCatsStory } from "./PaintedCatsStory";
import { PaintedCatsGallery } from "./PaintedCatsGallery";
import { PaintedCatsGift } from "./PaintedCatsGift";
import { PaintedCatsRsvp } from "./PaintedCatsRsvp";
import { PaintedCatsFooter } from "./PaintedCatsFooter";

import { NavigationDock } from "@/components/NavigationDock";
import { AudioPlayer } from "@/components/AudioPlayer";

export function PaintedCatsTemplate({
  data,
  guestName,
  guestItem,
  isPreview = false,
  isEditor = false,
  onOpenChange,
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState<boolean>(isEditor);
  const fontFamilyCss = getFontFamilyCss(data.themePalette?.fontStyle);

  useEffect(() => {
    if (isEditor) {
      setIsOpened(true);
    }
  }, [isEditor]);

  const handleOpen = () => {
    setIsOpened(true);
    onOpenChange?.(true);
  };

  return (
    <WeddingDataProvider data={data}>
      <div
        style={{ "--font-couple-custom": fontFamilyCss } as React.CSSProperties}
        className="min-h-screen bg-[#FAF6EE] text-[#2C2623] flex flex-col lg:flex-row relative overflow-x-hidden"
      >
        {/* Background Textured Linen Canvas & Watercolor Washes */}
        <PaintedCanvasBackground />

        {/* Desktop Left Showcase (hidden in preview mode) */}
        {!isPreview && (
          <PaintedCatsDesktopLeft
            isOpened={isOpened}
            onOpen={handleOpen}
          />
        )}

        {/* Right Side: Phone mockup frame on desktop, Full native on mobile */}
        <div
          className={`w-full ${
            isPreview ? "w-full" : "lg:w-[52%] xl:w-[50%]"
          } min-h-screen flex justify-center py-0 ${
            isPreview ? "p-0" : "lg:py-8 lg:px-6"
          } relative z-10`}
        >
          <main
            className={`w-full max-w-full ${
              isPreview ? "max-w-full" : "lg:max-w-[480px]"
            } min-h-screen bg-[#FAF6EE]/90 backdrop-blur-sm ${
              isPreview
                ? "rounded-2xl border-2 border-[#EAD8C7]"
                : "lg:rounded-[44px] lg:border-[5px] lg:border-[#EAD8C7] lg:shadow-[0_25px_60px_rgba(200,90,23,0.15)]"
            } relative overflow-clip flex flex-col`}
          >
            {/* Top Phone Mockup Speaker Notch (Desktop View Only) */}
            {!isPreview && (
              <div className="hidden lg:flex justify-between items-center px-7 py-3 bg-[#F0E4D5] border-b border-[#E8D9CB] text-[#2C2623] shrink-0">
                <span className="text-[11px] font-mono text-[#C85A17] font-semibold">12:12</span>
                <div className="w-20 h-4 bg-[#E2D4C3] rounded-full flex items-center justify-center gap-2 border border-[#D5C5B2]">
                  <span className="w-2 h-2 rounded-full bg-[#D97736]" />
                  <span className="w-7 h-1 rounded-full bg-[#C8B6A2]" />
                </div>
                <span className="text-[10px] font-mono text-[#C85A17]">100%</span>
              </div>
            )}

            {/* Opening Cover Screen */}
            <AnimatePresence mode="wait">
              {!isOpened && (
                <PaintedCatsCover
                  key="painted-cats-cover"
                  isOpen={isOpened}
                  onOpen={handleOpen}
                  initialGuestName={guestName}
                />
              )}
            </AnimatePresence>

            {/* Main Invitation Stream */}
            {isOpened && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col relative z-10"
              >
                <PaintedCatsHero />
                <PaintedCatsCouple />
                <PaintedCatsEvents />
                <PaintedCatsStory />
                <PaintedCatsGallery />
                <PaintedCatsGift />
                <PaintedCatsRsvp guestName={guestName} guestItem={guestItem} />
                <PaintedCatsFooter />

                {!isEditor && <NavigationDock theme="cats" />}
              </motion.div>
            )}
          </main>
        </div>

        {!isEditor && <AudioPlayer autoPlayTrigger={isOpened} theme="cats" />}
      </div>
    </WeddingDataProvider>
  );
}
