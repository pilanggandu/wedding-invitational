"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { WeddingDataProvider } from "@/context/WeddingDataContext";
import { TemplateProps } from "@/templates/types";
import { getFontFamilyCss } from "@/lib/typography";

import { BlurredCoupleBackground } from "./BlurredCoupleBackground";
import { CinematicCover } from "./CinematicCover";
import { CinematicDesktopLeft } from "./CinematicDesktopLeft";
import { CinematicHero } from "./CinematicHero";
import { CinematicCouple } from "./CinematicCouple";
import { CinematicEvents } from "./CinematicEvents";
import { CinematicLoveStory } from "./CinematicLoveStory";
import { CinematicGallery } from "./CinematicGallery";
import { CinematicGift } from "./CinematicGift";
import { CinematicRsvp } from "./CinematicRsvp";
import { CinematicFooter } from "./CinematicFooter";

import { NavigationDock } from "@/components/NavigationDock";
import { AudioPlayer } from "@/components/AudioPlayer";

export function CinematicBlurTemplate({
  data,
  guestName,
  guestItem,
  isPreview = false,
  isEditor = false,
  onOpenChange,
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState<boolean>(isPreview);
  const fontFamilyCss = getFontFamilyCss(data.themePalette?.fontStyle);

  useEffect(() => {
    if (isPreview) {
      setIsOpened(true);
    }
  }, [isPreview]);

  const handleOpen = () => {
    setIsOpened(true);
    onOpenChange?.(true);
  };

  return (
    <WeddingDataProvider data={data}>
      <div
        style={{ "--font-couple-custom": fontFamilyCss } as React.CSSProperties}
        className="min-h-screen bg-[#090B10] text-white flex flex-col lg:flex-row relative overflow-x-hidden selection:bg-rose-500 selection:text-white"
      >
        {/* Global Motion Fade In/Out Blurred Couple Background Engine */}
        <BlurredCoupleBackground images={data.general?.preweddingPhotos} />

        {/* Desktop Left Showcase (hidden in preview mode) */}
        {!isPreview && (
          <CinematicDesktopLeft
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
            } min-h-screen bg-black/50 backdrop-blur-xl ${
              isPreview
                ? "rounded-2xl border border-white/20"
                : "lg:rounded-[44px] lg:border-[4px] lg:border-white/20 lg:shadow-[0_25px_80px_rgba(0,0,0,0.9)]"
            } relative overflow-clip flex flex-col`}
          >
            {/* Top Phone Mockup Speaker Notch (Desktop View Only) */}
            {!isPreview && (
              <div className="hidden lg:flex justify-between items-center px-7 py-3 bg-black/70 border-b border-white/10 text-white shrink-0">
                <span className="text-[11px] font-mono text-white/70 font-medium">12:12</span>
                <div className="w-20 h-4 bg-black/90 rounded-full flex items-center justify-center gap-2 border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-white/70" />
                  <span className="w-7 h-1 rounded-full bg-white/40" />
                </div>
                <span className="text-[10px] font-mono text-white/70">100%</span>
              </div>
            )}

            {/* Opening Cover Screen */}
            <AnimatePresence mode="wait">
              {!isOpened && (
                <CinematicCover
                  key="cinematic-cover"
                  isOpen={isOpened}
                  onOpen={handleOpen}
                  initialGuestName={guestName}
                />
              )}
            </AnimatePresence>

            {/* Main Invitation Stream */}
            {isOpened && (
              <div className="flex-1 flex flex-col relative z-10 animate-in fade-in duration-700">
                <CinematicHero />
                <CinematicCouple />
                <CinematicEvents />
                <CinematicLoveStory />
                <CinematicGallery />
                <CinematicGift />
                <CinematicRsvp guestName={guestName} guestItem={guestItem} />
                <CinematicFooter />

                {!isEditor && <NavigationDock theme="cinematic" />}
              </div>
            )}
          </main>
        </div>

        {!isEditor && <AudioPlayer autoPlayTrigger={isOpened} theme="cinematic" />}
      </div>
    </WeddingDataProvider>
  );
}
