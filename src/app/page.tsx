"use client";

import React, { useState } from "react";
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

export default function WeddingInvitationPage() {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#FFF5F6] flex flex-col lg:flex-row relative paper-texture">
      {/* 🖥️ Desktop Left Showcase (Visible on lg+ screens, hidden on mobile) */}
      <DesktopLeftShowcase />

      {/* 📱 Right Side: Phone-style frame on desktop, Full-screen native on mobile */}
      <div className="w-full lg:w-[52%] xl:w-[50%] lg:h-screen lg:overflow-y-auto flex justify-center py-0 lg:py-6 px-0 lg:px-6 bg-[#FFF5F6] relative">
        <main className="w-full max-w-full lg:max-w-[460px] min-h-screen bg-[#FFF9FA] lg:rounded-[44px] lg:border-[5px] lg:border-[#4A0812] lg:shadow-[8px_10px_0px_#660F1A] relative overflow-hidden flex flex-col">
          {/* Top Phone Camera / Speaker Notch (Desktop View Only) */}
          <div className="hidden lg:flex justify-between items-center px-6 py-2.5 bg-[#4A0812] text-white shrink-0">
            <span className="text-[11px] font-mono font-bold text-[#FFE58F]">12:12 💖</span>
            <div className="w-20 h-3.5 bg-[#2D050B] rounded-full flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7D1128]" />
              <span className="w-6 h-1 rounded-full bg-[#5A0B17]" />
            </div>
            <span className="text-[10px] font-mono text-[#E5B869]">100% 🔋</span>
          </div>

          {/* Envelope Opening Screen */}
          <EnvelopeCover
            isOpen={isOpened}
            onOpen={() => setIsOpened(true)}
          />

          {/* Main Invitation Content */}
          {isOpened && (
            <div className="animate-in fade-in duration-1000 flex flex-col flex-1 relative">
              {/* Falling Hearts & Stars Particles */}
              <FallingPaperPetals />

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
  );
}
