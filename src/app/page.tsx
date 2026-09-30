"use client";

import React, { useState } from "react";
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

export default function WeddingInvitationPage() {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <main className="min-h-screen relative text-[#3A332C]">
      {/* Envelope Opening Screen (With Wax Seal & Personalized Guest Name) */}
      <EnvelopeCover
        isOpen={isOpened}
        onOpen={() => setIsOpened(true)}
      />

      {/* Main Wedding Invitation Content */}
      {isOpened && (
        <div className="animate-in fade-in duration-1000">
          <HeroSection />
          <CoupleSection />
          <EventSection />
          <LoveStorySection />
          <GallerySection />
          <GiftSection />
          <RsvpSection />
          <FooterSection />

          {/* Floating Navigation Dock */}
          <NavigationDock />

          {/* Ambient Music Player */}
          <AudioPlayer autoPlayTrigger={isOpened} />
        </div>
      )}
    </main>
  );
}
