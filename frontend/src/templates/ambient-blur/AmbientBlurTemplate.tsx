"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { WeddingDataProvider } from "@/context/WeddingDataContext";
import { TemplateProps } from "@/templates/types";
import { getFontFamilyCss } from "@/lib/typography";
import { ExtractedColors, FALLBACK_PALETTE } from "@/lib/colorExtractor";

import { AdaptivePhotoBackground } from "./AdaptivePhotoBackground";
import { AmbientBlurCover } from "./AmbientBlurCover";
import { AmbientBlurDesktopLeft } from "./AmbientBlurDesktopLeft";
import { AmbientBlurHero } from "./AmbientBlurHero";
import { AmbientBlurCouple } from "./AmbientBlurCouple";
import { AmbientBlurEvents } from "./AmbientBlurEvents";
import { AmbientBlurStory } from "./AmbientBlurStory";
import { AmbientBlurGallery } from "./AmbientBlurGallery";
import { AmbientBlurGift } from "./AmbientBlurGift";
import { AmbientBlurRsvp } from "./AmbientBlurRsvp";
import { AmbientBlurFooter } from "./AmbientBlurFooter";

import { NavigationDock } from "@/components/NavigationDock";
import { AudioPlayer } from "@/components/AudioPlayer";

export function AmbientBlurTemplate({
  data,
  guestName,
  guestItem,
  isPreview = false,
  isEditor = false,
  onOpenChange,
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState<boolean>(isPreview);
  const [palette, setPalette] = useState<ExtractedColors>(FALLBACK_PALETTE);
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

  const photoList =
    data.general?.preweddingPhotos && data.general.preweddingPhotos.length > 0
      ? data.general.preweddingPhotos
      : undefined;

  return (
    <WeddingDataProvider data={data}>
      <div
        style={
          {
            "--font-couple-custom": fontFamilyCss,
            "--ambient-accent": palette.dominant,
            "--ambient-secondary": palette.secondary,
            "--ambient-light": palette.light,
            "--ambient-glow": palette.glow,
          } as React.CSSProperties
        }
        className="min-h-screen bg-[#F8FAFC]/80 text-slate-800 flex flex-col lg:flex-row relative overflow-x-hidden selection:bg-[var(--ambient-accent)] selection:text-white"
      >
        {/* Dynamic Canvas-Adaptive Blurred Background Engine */}
        <AdaptivePhotoBackground
          images={photoList}
          onPaletteChange={(newPalette) => setPalette(newPalette)}
        />

        {/* Desktop Left Showcase Monitor (hidden in preview mode) */}
        {!isPreview && (
          <AmbientBlurDesktopLeft
            isOpened={isOpened}
            onOpen={handleOpen}
            palette={palette}
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
            style={{
              borderColor: `${palette.dominant}40`,
              boxShadow: `0 30px 80px rgba(15, 23, 42, 0.12), 0 0 60px ${palette.glow}`,
            }}
            className={`w-full max-w-full ${
              isPreview ? "max-w-full" : "lg:max-w-[480px]"
            } min-h-screen bg-white/85 backdrop-blur-3xl ${
              isPreview
                ? "rounded-2xl border"
                : "lg:rounded-[44px] lg:border-[4px] lg:border-white/80"
            } relative overflow-clip flex flex-col`}
          >
            {/* Top Phone Mockup Speaker Notch (Desktop View Only) */}
            {!isPreview && (
              <div className="hidden lg:flex justify-between items-center px-7 py-3 bg-white/85 border-b border-slate-200/80 text-slate-700 shrink-0">
                <span className="text-[11px] font-mono text-slate-600 font-bold">12:12</span>
                <div className="w-20 h-4 bg-slate-100 rounded-full flex items-center justify-center gap-2 border border-slate-200">
                  <span
                    style={{ backgroundColor: palette.dominant }}
                    className="w-2 h-2 rounded-full shadow-xs"
                  />
                  <span className="w-7 h-1 rounded-full bg-slate-300" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
                  <span>5G</span>
                  <div className="w-3.5 h-2 rounded-xs border border-slate-400 p-0.5 flex items-center">
                    <div style={{ backgroundColor: palette.dominant }} className="w-full h-full rounded-2xs" />
                  </div>
                </div>
              </div>
            )}

            {/* Opening Cover Screen */}
            <AnimatePresence mode="wait">
              {!isOpened && (
                <AmbientBlurCover
                  key="ambient-blur-cover"
                  isOpen={isOpened}
                  onOpen={handleOpen}
                  initialGuestName={guestName}
                  palette={palette}
                />
              )}
            </AnimatePresence>

            {/* Main Invitation Stream */}
            {isOpened && (
              <div className="flex-1 flex flex-col relative z-10 animate-in fade-in duration-700 bg-white/40">
                <AmbientBlurHero palette={palette} />
                <AmbientBlurCouple palette={palette} />
                <AmbientBlurEvents palette={palette} />
                <AmbientBlurStory palette={palette} />
                <AmbientBlurGallery palette={palette} />
                <AmbientBlurGift palette={palette} />
                <AmbientBlurRsvp guestName={guestName} guestItem={guestItem} palette={palette} />
                <AmbientBlurFooter palette={palette} />

                {!isEditor && <NavigationDock theme="ambient" />}
                {!isEditor && <AudioPlayer autoPlayTrigger={isOpened} theme="ambient" />}
              </div>
            )}
          </main>
        </div>
      </div>
    </WeddingDataProvider>
  );
}
export default AmbientBlurTemplate;
