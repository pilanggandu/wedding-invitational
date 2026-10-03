"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { WeddingDataProvider } from "@/context/WeddingDataContext";
import { TemplateProps } from "@/templates/types";
import { DesktopLeftShowcase } from "@/components/DesktopLeftShowcase";
import { EnvelopeCover } from "@/components/EnvelopeCover";
import { HeroSection } from "@/components/HeroSection";
import { CoupleSection } from "@/components/CoupleSection";
import { EventSection } from "@/components/EventSection";
import { LoveStorySection } from "@/components/LoveStorySection";
import { GallerySection } from "@/components/GallerySection";
import { GiftSection } from "@/components/GiftSection";
import { RsvpSection } from "@/components/RsvpSection";
import { FooterSection } from "@/components/FooterSection";
import { NavigationDock } from "@/components/NavigationDock";
import { AudioPlayer } from "@/components/AudioPlayer";
import { FallingPaperPetals } from "@/components/FallingPaperPetals";

export function PaperArtTemplate({
  data,
  guestName,
  isPreview = false,
  onOpenChange,
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState<boolean>(isPreview);

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
      <div className="min-h-screen bg-[#FFF5F6] flex flex-col lg:flex-row relative paper-texture">
        {/* Desktop Left Showcase (hidden if preview mode) */}
        {!isPreview && (
          <DesktopLeftShowcase
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
          } bg-[#FFF5F6] relative`}
        >
          <main
            className={`w-full max-w-full ${
              isPreview ? "max-w-full" : "lg:max-w-[480px]"
            } min-h-screen bg-[#FFF9FA] ${
              isPreview
                ? "rounded-2xl border-2 border-[#4A0812]"
                : "lg:rounded-[44px] lg:border-[5px] lg:border-[#4A0812] lg:shadow-[8px_10px_0px_#660F1A]"
            } relative overflow-clip flex flex-col`}
          >
            {/* Top Phone Camera / Speaker Notch (Desktop View Only) */}
            {!isPreview && (
              <div className="hidden lg:flex justify-between items-center px-6 py-2.5 bg-[#4A0812] text-white shrink-0">
                <span className="text-[11px] font-mono font-bold text-[#FFE58F]">12:12 💖</span>
                <div className="w-20 h-3.5 bg-[#2D050B] rounded-full flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7D1128]" />
                  <span className="w-6 h-1 rounded-full bg-[#5A0B17]" />
                </div>
                <span className="text-[10px] font-mono text-[#E5B869]">100% 🔋</span>
              </div>
            )}

            {/* Envelope Opening Screen */}
            <AnimatePresence mode="wait">
              {!isOpened && (
                <EnvelopeCover
                  key="envelope-cover"
                  isOpen={isOpened}
                  onOpen={handleOpen}
                  initialGuestName={guestName}
                />
              )}
            </AnimatePresence>

            {/* Main Invitation Content */}
            {isOpened && (
              <div className="animate-in fade-in duration-1000 flex flex-col flex-1 relative">
                {/* Falling Hearts & Stars Particles */}
                {data.themePalette?.particlesEnabled !== false && <FallingPaperPetals />}

                <HeroSection />
                <CoupleSection />
                <EventSection />
                <LoveStorySection />
                <GallerySection />
                <GiftSection />
                <RsvpSection />
                <FooterSection />

                {/* Navigation Dock */}
                <NavigationDock />

                {/* Ambient Audio Player */}
                <AudioPlayer autoPlayTrigger={isOpened} />
              </div>
            )}
          </main>
        </div>
      </div>
    </WeddingDataProvider>
  );
}
export default PaperArtTemplate;
