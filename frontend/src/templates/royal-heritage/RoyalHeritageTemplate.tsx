"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  CreditCard,
  Copy,
  Check,
  Send,
  Navigation,
  ExternalLink,
  X,
  ZoomIn,
  MessageSquare,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WeddingDataProvider, useWeddingData } from "@/context/WeddingDataContext";
import { TemplateProps } from "@/templates/types";
import { WishMessage } from "@/types/wedding";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { submitRsvpApi } from "@/lib/api";
import { RoyalCover } from "./RoyalCover";
import { RoyalDesktopLeft } from "./RoyalDesktopLeft";
import { RoyalAmbientParticles } from "./RoyalAmbientParticles";
import { RoyalMotionReveal } from "./RoyalMotionReveal";
import {
  RoyalMonogram,
  BismillahCalligraphy,
  CornerFiligree,
  DividerOrnament,
  RoyalArchFrame,
} from "./RoyalDecorations";
import { NavigationDock } from "@/components/NavigationDock";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getFontFamilyCss } from "@/lib/typography";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// ----------------------------------------------------------------------
// 1. HERO SECTION (Bismillah, Salam, Ayat Ar-Rum & Countdown)
// ----------------------------------------------------------------------
function RoyalHero() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;
  const akadDate = data.events[0]?.displayDate || "21 November 2026";
  const akadDay = data.events[0]?.displayDay || "Sabtu";

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(
      data.countdownTarget || "2026-11-21T08:00:00+07:00"
    ).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data.countdownTarget]);

  return (
    <section
      id="hero"
      className="relative pt-12 pb-16 px-6 sm:px-10 text-center bg-[#FAF8F5] text-[#1A2521] overflow-hidden"
    >
      {/* Background Subtle Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center">
        <RoyalMonogram className="w-[500px] h-[500px]" color="#C8A97E" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        {/* Monogram Emblem */}
        <RoyalMotionReveal variant="scale-up" delay={0.1} className="flex justify-center">
          <RoyalMonogram className="w-20 h-20" color="#C8A97E" />
        </RoyalMotionReveal>

        {/* Bismillah Calligraphy */}
        <RoyalMotionReveal variant="fade-up" delay={0.2}>
          <BismillahCalligraphy className="w-auto mx-auto my-1" color="#C8A97E" />
        </RoyalMotionReveal>

        {/* Greetings */}
        <RoyalMotionReveal variant="fade-up" delay={0.3} className="space-y-2">
          <p className="text-xs font-serif uppercase tracking-[0.25em] text-[#8C7456]">
            Assalamu&lsquo;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="text-xs font-sans text-zinc-600 leading-relaxed max-w-md mx-auto">
            Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta&lsquo;ala, kami
            bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:
          </p>
        </RoyalMotionReveal>

        {/* Couple Big Headline */}
        <RoyalMotionReveal variant="fade-up" delay={0.4} className="py-2">
          <h2
            style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
            className="font-couple-title font-serif text-2xl min-[380px]:text-3xl sm:text-4xl text-[#0F2D24] tracking-tight leading-tight"
          >
            {groom.name} &amp; {bride.name}
          </h2>
          <p className="text-xs font-serif uppercase tracking-[0.2em] text-[#C8A97E] mt-2">
            {akadDay}, {akadDate}
          </p>
        </RoyalMotionReveal>

        <DividerOrnament className="w-44 mx-auto my-2" color="#C8A97E" />

        {/* Quran Verse Ar-Rum 21 in Framed Ivory Card */}
        <RoyalMotionReveal variant="scale-up" delay={0.45}>
          <div className="relative p-6 rounded-xl border border-[#C8A97E]/30 bg-white shadow-xs text-center space-y-3 transition-shadow hover:shadow-md">
            <p
              className="font-serif text-sm sm:text-base text-[#0F2D24] leading-loose dir-rtl"
              dir="rtl"
            >
              {data.general.quote?.arabic ||
                "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"}
            </p>
            <p className="text-[11px] font-sans italic text-zinc-600 leading-relaxed">
              &ldquo;
              {data.general.quote?.translation ||
                "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."}
              &rdquo;
            </p>
            <p className="text-[10px] font-serif uppercase tracking-widest text-[#8C7456] font-medium">
              (QS. Ar-Rum: 21)
            </p>
          </div>
        </RoyalMotionReveal>

        {/* Countdown Timer */}
        <RoyalMotionReveal variant="fade-up" delay={0.5} className="pt-4">
          <span className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#8C7456] block mb-3">
            Menuju Hari Bahagia
          </span>

          <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
            {[
              { val: timeLeft.days, unit: "Hari" },
              { val: timeLeft.hours, unit: "Jam" },
              { val: timeLeft.minutes, unit: "Menit" },
              { val: timeLeft.seconds, unit: "Detik" },
            ].map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(200,169,126,0.25)" }}
                className="p-3 rounded-lg bg-white border border-[#C8A97E]/30 shadow-xs transition-colors cursor-default"
              >
                <span className="font-serif text-2xl font-bold text-[#0F2D24] block">
                  {t.val}
                </span>
                <span className="text-[9px] font-serif uppercase tracking-widest text-[#8C7456] block mt-0.5">
                  {t.unit}
                </span>
              </motion.div>
            ))}
          </div>
        </RoyalMotionReveal>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 2. COUPLE SECTION (Mempelai Pria & Wanita)
// ----------------------------------------------------------------------
function RoyalCouple() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <section
      id="couple"
      className="py-16 px-6 sm:px-10 bg-[#F4EFEA] text-[#1A2521] border-y border-[#C8A97E]/20"
    >
      <div className="max-w-xl mx-auto space-y-12">
        <RoyalMotionReveal variant="fade-up" className="text-center space-y-2">
          <span className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#8C7456] block">
            Maha Suci Allah
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0F2D24]">
            Kedua Mempelai
          </h2>
          <DividerOrnament className="w-36 mx-auto my-2" color="#C8A97E" />
        </RoyalMotionReveal>

        {/* Groom Profile */}
        <RoyalMotionReveal variant="slide-left" delay={0.15} className="flex flex-col items-center text-center space-y-4">
          <motion.div whileHover={{ y: -4, transition: { duration: 0.25 } }}>
            <RoyalArchFrame
              className="w-44 h-56 bg-white shadow-xs overflow-hidden flex items-center justify-center relative cursor-default"
              borderColor="#C8A97E"
            >
              {groom.photoUrl ? (
                <div className="w-full h-full relative group">
                  <img
                    src={groom.photoUrl}
                    alt={groom.fullName || groom.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D24]/80 via-transparent to-transparent flex items-end justify-center pb-2">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#E8D7B8]">
                      The Groom
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-[#0F2D24]/5 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-[#0F2D24] text-[#FAF8F5] flex items-center justify-center font-serif text-xl font-bold mb-2 shadow-xs">
                    {groom.name.charAt(0)}
                  </div>
                  <span className="text-[11px] font-serif uppercase tracking-wider text-[#0F2D24]">
                    The Groom
                  </span>
                </div>
              )}
            </RoyalArchFrame>
          </motion.div>

          <div className="space-y-1.5 max-w-sm">
            <h3
              style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
              className="font-couple-title font-serif text-xl sm:text-2xl font-bold text-[#0F2D24]"
            >
              {groom.fullName || groom.name}
            </h3>
            <p className="text-xs font-sans text-zinc-600">
              {groom.parents || "Putra pertama dari Bpk. Permadi & Ibu"}
            </p>

            {groom.instagram && (
              <a
                href={`https://instagram.com/${groom.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full border border-[#C8A97E]/40 bg-white text-[#0F2D24] hover:bg-[#FAF8F5] text-xs font-medium transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#C8A97E]" />
                <span>@{groom.instagram.replace(/^@/, "")}</span>
              </a>
            )}
          </div>
        </RoyalMotionReveal>

        {/* Center Golden Ampersand */}
        <RoyalMotionReveal variant="scale-up" delay={0.25} className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-[#C8A97E] flex items-center justify-center font-serif text-xl text-[#0F2D24] bg-white shadow-xs">
            &amp;
          </div>
        </RoyalMotionReveal>

        {/* Bride Profile */}
        <RoyalMotionReveal variant="slide-right" delay={0.35} className="flex flex-col items-center text-center space-y-4">
          <motion.div whileHover={{ y: -4, transition: { duration: 0.25 } }}>
            <RoyalArchFrame
              className="w-44 h-56 bg-white shadow-xs overflow-hidden flex items-center justify-center relative cursor-default"
              borderColor="#C8A97E"
            >
              {bride.photoUrl ? (
                <div className="w-full h-full relative group">
                  <img
                    src={bride.photoUrl}
                    alt={bride.fullName || bride.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D24]/80 via-transparent to-transparent flex items-end justify-center pb-2">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#E8D7B8]">
                      The Bride
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-[#0F2D24]/5 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-[#0F2D24] text-[#FAF8F5] flex items-center justify-center font-serif text-xl font-bold mb-2 shadow-xs">
                    {bride.name.charAt(0)}
                  </div>
                  <span className="text-[11px] font-serif uppercase tracking-wider text-[#0F2D24]">
                    The Bride
                  </span>
                </div>
              )}
            </RoyalArchFrame>
          </motion.div>

          <div className="space-y-1.5 max-w-sm">
            <h3
              style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
              className="font-couple-title font-serif text-xl sm:text-2xl font-bold text-[#0F2D24]"
            >
              {bride.fullName || bride.name}
            </h3>
            <p className="text-xs font-sans text-zinc-600">
              {bride.parents ||
                "Putri kedua dari Bpk. Mokhamad Mokharom & Ibu"}
            </p>

            {bride.instagram && (
              <a
                href={`https://instagram.com/${bride.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full border border-[#C8A97E]/40 bg-white text-[#0F2D24] hover:bg-[#FAF8F5] text-xs font-medium transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#C8A97E]" />
                <span>@{bride.instagram.replace(/^@/, "")}</span>
              </a>
            )}
          </div>
        </RoyalMotionReveal>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 3. EVENTS SECTION (Akad Nikah & Resepsi Pernikahan)
// ----------------------------------------------------------------------
function RoyalEvents() {
  const data = useWeddingData();
  const events = data.events;

  const handleSaveToCalendar = (evt: (typeof events)[0]) => {
    const title = encodeURIComponent(
      evt.calendarEvent?.title ||
        `${evt.title} ${data.couple?.groom?.name || ""} & ${data.couple?.bride?.name || ""}`.trim()
    );
    const details = encodeURIComponent(
      evt.calendarEvent?.description || `Acara ${evt.title}`
    );
    const location = encodeURIComponent(evt.venueAddress);
    const dates = `${evt.calendarEvent?.startDate || "20261121T010000Z"}/${evt.calendarEvent?.endDate || "20261121T050000Z"}`;

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleUrl, "_blank");
  };

  return (
    <section
      id="events"
      className="py-16 px-6 sm:px-10 bg-[#FAF8F5] text-[#1A2521]"
    >
      <div className="max-w-xl mx-auto space-y-10">
        <RoyalMotionReveal variant="fade-up" className="text-center space-y-2">
          <span className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#8C7456] block">
            Waktu &amp; Tempat
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0F2D24]">
            Rangkaian Acara
          </h2>
          <DividerOrnament className="w-36 mx-auto my-2" color="#C8A97E" />
        </RoyalMotionReveal>

        <div className="space-y-8">
          {events.map((evt, idx) => (
            <RoyalMotionReveal
              key={evt.id || idx}
              variant="fade-up"
              delay={0.15 + idx * 0.15}
            >
              <motion.div
                whileHover={{
                  y: -4,
                  borderColor: "rgba(200, 169, 126, 0.8)",
                  boxShadow: "0 12px 30px -8px rgba(15, 45, 36, 0.12)",
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-7 sm:p-9 rounded-2xl bg-white border border-[#C8A97E]/40 shadow-xs text-center space-y-5 transition-colors"
              >
                <CornerFiligree
                  className="absolute top-2 left-2 w-5 h-5"
                  position="top-left"
                  color="#C8A97E"
                />
                <CornerFiligree
                  className="absolute top-2 right-2 w-5 h-5"
                  position="top-right"
                  color="#C8A97E"
                />

                <div className="space-y-1">
                  <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8C7456] block">
                    {idx === 0 ? "Momen Ijab Kabul" : "Pesta Syukuran"}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0F2D24]">
                    {evt.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 border-y border-[#C8A97E]/20 text-xs">
                  <div className="flex items-center justify-center gap-2 text-zinc-700">
                    <Calendar className="w-4 h-4 text-[#C8A97E] shrink-0" />
                    <span>
                      {evt.displayDay}, {evt.displayDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-zinc-700">
                    <Clock className="w-4 h-4 text-[#C8A97E] shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-serif text-base font-semibold text-[#0F2D24]">
                    {evt.venueName}
                  </p>
                  <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed">
                    {evt.venueAddress}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  <motion.a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#0F2D24] hover:bg-[#0A221A] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C8A97E]" />
                    <span>Petunjuk Arah (Maps)</span>
                  </motion.a>

                  <motion.button
                    onClick={() => handleSaveToCalendar(evt)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#C8A97E] hover:bg-[#FAF8F5] text-[#0F2D24] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C8A97E]" />
                    <span>Simpan ke Kalender</span>
                  </motion.button>
                </div>
              </motion.div>
            </RoyalMotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 4. GALLERY SECTION (Potret Bahagia)
// ----------------------------------------------------------------------
function RoyalGallery() {
  const data = useWeddingData();
  const gallery = data.gallery;
  const userPreweddings = data.general?.preweddingPhotos || [];
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  const getPhotoSrc = (photo: any, index: number) => {
    return (
      photo?.imageUrl ||
      userPreweddings[index] ||
      (index < 5 ? `/images/prewedding/couple-${index + 1}.jpg` : undefined)
    );
  };

  return (
    <section
      id="gallery"
      className="py-16 px-6 sm:px-10 bg-[#F4EFEA] text-[#1A2521] border-t border-[#C8A97E]/20"
    >
      <div className="max-w-xl mx-auto space-y-10">
        <RoyalMotionReveal variant="fade-up" className="text-center space-y-2">
          <span className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#8C7456] block">
            Dokumentasi Cinta
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0F2D24]">
            Potret Bahagia
          </h2>
          <DividerOrnament className="w-36 mx-auto my-2" color="#C8A97E" />
        </RoyalMotionReveal>

        <div className="grid grid-cols-2 gap-3.5">
          {gallery.map((photo, i) => {
            const photoSrc = getPhotoSrc(photo, i);
            return (
              <RoyalMotionReveal
                key={photo.id}
                variant="scale-up"
                delay={0.06 * i}
              >
                <motion.div
                  onClick={() => setActivePhoto(i)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative rounded-xl border border-[#C8A97E]/40 overflow-hidden bg-white shadow-xs cursor-pointer aspect-4/5"
                >
                  {photoSrc ? (
                    <div className="w-full h-full relative">
                      <img
                        src={photoSrc}
                        alt={photo.caption || `Foto ${i + 1}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D24]/80 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-serif uppercase tracking-wider text-[#FAF8F5] line-clamp-1">
                          {photo.caption}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#0F2D24]/10 flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-2xl mb-1 font-serif text-[#0F2D24]">
                        {i + 1}
                      </span>
                      <span className="text-[10px] font-serif uppercase tracking-wider text-[#8C7456]">
                        {photo.caption}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[#0F2D24]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                    <ZoomIn className="w-5 h-5 text-[#C8A97E]" />
                  </div>
                </motion.div>
              </RoyalMotionReveal>
            );
          })}
        </div>

        {/* Lightbox Modal with AnimatePresence */}
        <AnimatePresence>
          {activePhoto !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setActivePhoto(null)}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-md w-full bg-white rounded-2xl p-6 border-2 border-[#C8A97E] text-center space-y-4 shadow-2xl"
              >
                <button
                  onClick={() => setActivePhoto(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {getPhotoSrc(gallery[activePhoto], activePhoto) ? (
                  <div className="w-full max-h-[60vh] rounded-xl overflow-hidden border border-[#C8A97E]/30 bg-black/5">
                    <img
                      src={getPhotoSrc(gallery[activePhoto], activePhoto)}
                      alt={gallery[activePhoto]?.caption || "Foto"}
                      className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="aspect-4/5 w-full bg-[#0F2D24]/10 rounded-xl flex items-center justify-center border border-[#C8A97E]/30">
                    <span className="font-serif text-4xl text-[#0F2D24]">
                      {activePhoto + 1}
                    </span>
                  </div>
                )}

                <p className="font-serif text-sm text-[#0F2D24] font-medium">
                  {gallery[activePhoto]?.caption}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 5. GIFTS SECTION (Amplop Digital & Kado Fisik)
// ----------------------------------------------------------------------
function RoyalGifts() {
  const data = useWeddingData();
  const accounts = data.gifts?.accounts || [];
  const address = data.gifts?.physicalGiftAddress;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (num: string, idx: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section
      id="gifts"
      className="py-16 px-6 sm:px-10 bg-[#FAF8F5] text-[#1A2521] border-t border-[#C8A97E]/20"
    >
      <div className="max-w-xl mx-auto space-y-10">
        <RoyalMotionReveal variant="fade-up" className="text-center space-y-2">
          <span className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#8C7456] block">
            Tanda Kasih
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0F2D24]">
            Amplop Digital
          </h2>
          <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
            Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang ingin
            memberikan tanda kasih, dapat mengirimkan melalui rekening berikut:
          </p>
          <DividerOrnament className="w-36 mx-auto my-2" color="#C8A97E" />
        </RoyalMotionReveal>

        <div className="space-y-4">
          {accounts.map((acc, idx) => {
            const isCopied = copiedIndex === idx;

            return (
              <RoyalMotionReveal
                key={idx}
                variant="fade-up"
                delay={0.12 * idx}
              >
                <motion.div
                  whileHover={{
                    y: -3,
                    borderColor: "rgba(200, 169, 126, 0.8)",
                    boxShadow: "0 10px 24px -6px rgba(15, 45, 36, 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative p-6 rounded-xl bg-white border border-[#C8A97E]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-colors"
                >
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-serif uppercase tracking-widest bg-[#0F2D24]/10 text-[#0F2D24]">
                      {acc.bankName}
                    </div>
                    <div className="font-mono text-base font-bold text-[#0F2D24] tracking-wider pt-1">
                      {acc.accountNumber}
                    </div>
                    <div className="text-xs text-zinc-600">
                      a.n. {acc.accountHolder}
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleCopy(acc.accountNumber, idx)}
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#0F2D24] hover:bg-[#0A221A] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#C8A97E]" />
                    )}
                    <span>{isCopied ? "Disalin!" : "Salin Rekening"}</span>
                  </motion.button>
                </motion.div>
              </RoyalMotionReveal>
            );
          })}
        </div>

        {address && (
          <RoyalMotionReveal variant="scale-up" delay={0.2}>
            <div className="p-6 rounded-xl bg-white border border-[#C8A97E]/30 text-center space-y-2">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#8C7456] block">
                Pengiriman Kado Fisik
              </span>
              <p className="text-xs font-semibold text-[#0F2D24]">
                {address.recipient}
              </p>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mx-auto">
                {address.address}
              </p>
            </div>
          </RoyalMotionReveal>
        )}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 6. FORMAL RSVP & GUESTBOOK (Buku Tamu & Konfirmasi Kehadiran)
// ----------------------------------------------------------------------
function RoyalRsvp({
  guestName,
  guestItem,
}: {
  guestName?: string;
  guestItem?: {
    id: string;
    name: string;
    quota: number;
    token?: string;
    phone?: string;
  } | null;
}) {
  const data = useWeddingData();
  const [wishes, setWishes] = useState<WishMessage[]>(data.initialWishes || []);

  const [activeGuest, setActiveGuest] = useState<{
    id: string;
    name: string;
    quota: number;
  } | null>(guestItem || null);

  useEffect(() => {
    if (guestItem) {
      setActiveGuest(guestItem);
      return;
    }
    try {
      const stored = sessionStorage.getItem("verified_wedding_guest");
      if (stored) {
        setActiveGuest(JSON.parse(stored));
      }
    } catch {}
  }, [guestItem]);

  const defaultName = guestName || activeGuest?.name || "";
  const [name, setName] = useState(defaultName);
  const [attendeeCount, setAttendeeCount] = useState("1");
  const [attendance, setAttendance] = useState<
    "Hadir" | "Ragu-ragu" | "Berhalangan"
  >("Hadir");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (defaultName && !name) {
      setName(defaultName);
    }
  }, [defaultName]);

  useEffect(() => {
    const loaded = getWishes();
    if (loaded && loaded.length > 0) {
      setWishes(loaded);
    }

    const handleUpdate = () => {
      setWishes(getWishes());
    };
    window.addEventListener("wedding-wishes-changed", handleUpdate);
    return () => window.removeEventListener("wedding-wishes-changed", handleUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    submitWish({
      name: name.trim(),
      relationship: "Tamu Undangan",
      attendance: attendance as any,
      message: message.trim(),
      guestId: activeGuest?.id,
    });

    if (activeGuest?.id) {
      const isAttending = attendance === "Hadir";
      const count = parseInt(attendeeCount) || 1;
      submitRsvpApi({
        guestId: activeGuest.id,
        status: isAttending ? 1 : 2,
        attendeeCount: isAttending ? Math.min(count, activeGuest.quota || 1) : 0,
        message: message.trim(),
      }).catch((err) => console.warn("Notice Royal RSVP submit:", err));
    }

    setName(defaultName || "");
    setMessage("");
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        colors: ["#C8A97E", "#0F2D24", "#FAF8F5"],
      });
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="rsvp"
      className="py-16 px-6 sm:px-10 bg-[#F4EFEA] text-[#1A2521] border-t border-[#C8A97E]/20"
    >
      <div className="max-w-xl mx-auto space-y-10">
        <RoyalMotionReveal variant="fade-up" className="text-center space-y-2">
          <span className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#8C7456] block">
            Konfirmasi Kehadiran
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0F2D24]">
            Buku Tamu &amp; Doa Restu
          </h2>
          <DividerOrnament className="w-36 mx-auto my-2" color="#C8A97E" />
        </RoyalMotionReveal>

        {/* RSVP Submission Form */}
        <RoyalMotionReveal variant="scale-up" delay={0.15}>
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-[#C8A97E]/40 shadow-xs space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tuliskan nama Anda"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C8A97E]/40 bg-[#FAF8F5] text-xs font-sans text-zinc-900 focus:outline-none focus:border-[#0F2D24]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Konfirmasi Kehadiran
              </label>
              <select
                value={attendance}
                onChange={(e) => setAttendance(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C8A97E]/40 bg-[#FAF8F5] text-xs font-sans text-zinc-900 focus:outline-none focus:border-[#0F2D24]"
              >
                <option value="Hadir">Pasti Hadir</option>
                <option value="Ragu-ragu">Masih Ragu-ragu</option>
                <option value="Berhalangan">Berhalangan Hadir</option>
              </select>
            </div>

            {attendance === "Hadir" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-zinc-700">
                    Jumlah Kehadiran
                  </label>
                  {activeGuest?.quota && (
                    <span className="text-[10px] font-mono text-[#8C7456] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#C8A97E]/30">
                      Maks. {activeGuest.quota} Orang
                    </span>
                  )}
                </div>
                <select
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#C8A97E]/40 bg-[#FAF8F5] text-xs font-sans text-zinc-900 focus:outline-none focus:border-[#0F2D24]"
                >
                  {Array.from({
                    length: Math.min(10, Math.max(1, activeGuest?.quota || 2)),
                  }).map((_, i) => (
                    <option key={i + 1} value={`${i + 1}`}>
                      {i + 1} Orang
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Untaian Doa &amp; Ucapan
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan pesan doa restu bagi kedua mempelai"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#C8A97E]/40 bg-[#FAF8F5] text-xs font-sans text-zinc-900 focus:outline-none focus:border-[#0F2D24]"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-3 rounded-lg bg-[#0F2D24] hover:bg-[#0A221A] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#C8A97E]" />
              <span>Kirim Konfirmasi &amp; Doa Restu</span>
            </motion.button>

            {isSuccess && (
              <p className="text-xs text-center font-medium text-emerald-800 animate-in fade-in">
                Doa restu Anda telah berhasil dikirimkan. Terima kasih banyak.
              </p>
            )}
          </form>
        </RoyalMotionReveal>

        {/* Wishes List Feed */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {wishes.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
              className="p-4 rounded-xl bg-white border border-[#C8A97E]/20 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-[#0F2D24]">
                  {item.name}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {item.date}
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed italic">
                &ldquo;{item.message}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 7. FOOTER SECTION (Salam Penutup & Ucapan Terima Kasih)
// ----------------------------------------------------------------------
function RoyalFooter() {
  const data = useWeddingData();
  const { groom, bride } = data.couple;

  return (
    <footer className="py-16 px-6 sm:px-10 bg-[#09221B] text-[#FAF8F5] text-center space-y-6">
      <RoyalMotionReveal variant="fade-up" className="max-w-md mx-auto space-y-4">
        <RoyalMonogram className="w-16 h-16 mx-auto" color="#C8A97E" />

        <p className="text-xs text-[#E8D7B8]/80 leading-relaxed">
          {data.general.closingMessage ||
            "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami."}
        </p>

        <DividerOrnament className="w-36 mx-auto my-3" color="#C8A97E" />

        <div className="space-y-1 pt-1">
          <p className="text-[11px] font-serif uppercase tracking-[0.2em] text-[#C8A97E]">
            Kami yang berbahagia,
          </p>
          <h3
            style={{ fontFamily: getFontFamilyCss(data.themePalette?.fontStyle) }}
            className="font-couple-title font-serif text-2xl text-[#FAF8F5]"
          >
            {groom.name} &amp; {bride.name}
          </h3>
          <p className="text-[10px] font-sans text-[#E8D7B8]/60 pt-1">
            Beserta Keluarga Besar Kedua Mempelai
          </p>
        </div>

        {data.general?.hashtag && (
          <p className="text-xs font-serif text-[#C8A97E] tracking-widest pt-4">
            {data.general.hashtag}
          </p>
        )}
      </RoyalMotionReveal>
    </footer>
  );
}

// ----------------------------------------------------------------------
// MAIN EXPORT: RoyalHeritageTemplate
// ----------------------------------------------------------------------
export function RoyalHeritageTemplate({
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
        className="min-h-screen bg-[#071913] flex flex-col lg:flex-row items-start relative"
      >
        {/* Desktop Left Showcase (hidden if in miniature preview) */}
        {!isPreview && (
          <RoyalDesktopLeft isOpened={isOpened} onOpen={handleOpen} />
        )}

        {/* Right Side: Phone mockup frame on desktop, Full native on mobile */}
        <div
          className={`w-full ${
            isPreview ? "w-full" : "lg:w-[52%] xl:w-[50%]"
          } min-h-screen flex justify-center py-0 ${
            isPreview ? "p-0" : "lg:py-8 lg:px-6"
          } bg-[#071913] relative`}
        >
          <main
            className={`w-full max-w-full ${
              isPreview ? "max-w-full" : "lg:max-w-[480px]"
            } min-h-screen bg-[#FAF8F5] ${
              isPreview
                ? "rounded-2xl border-2 border-[#C8A97E]"
                : "lg:rounded-[44px] lg:border-[5px] lg:border-[#C8A97E] lg:shadow-[0_12px_48px_rgba(0,0,0,0.6)]"
            } relative overflow-clip flex flex-col`}
          >
            {/* Top Phone Camera / Speaker Notch (Desktop View Only) */}
            {!isPreview && (
              <div className="hidden lg:flex justify-between items-center px-6 py-2.5 bg-[#09221B] text-[#C8A97E] shrink-0 border-b border-[#C8A97E]/30">
                <span className="text-[11px] font-serif font-bold tracking-wider">
                  12:12
                </span>
                <div className="w-16 h-3 bg-[#071913] rounded-full flex items-center justify-center gap-1.5 border border-[#C8A97E]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]/60" />
                  <span className="w-5 h-0.5 rounded-full bg-[#C8A97E]/40" />
                </div>
                <span className="text-[10px] font-serif tracking-widest text-[#E8D7B8]">
                  5G
                </span>
              </div>
            )}

            {/* Royal Cover Screen */}
            <AnimatePresence mode="wait">
              {!isOpened && (
                <RoyalCover
                  key="royal-cover"
                  isOpen={isOpened}
                  onOpen={handleOpen}
                  initialGuestName={guestName}
                />
              )}
            </AnimatePresence>

            {/* Main Invitation Content Once Opened */}
            {isOpened && (
              <div className="animate-in fade-in duration-1000 flex flex-col flex-1 relative bg-[#FAF8F5]">
                {/* Ambient Golden Particles in background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                  <RoyalAmbientParticles count={14} />
                </div>

                <RoyalHero />
                <RoyalCouple />
                <RoyalEvents />
                <RoyalGallery />
                <RoyalGifts />
                <RoyalRsvp guestName={guestName} guestItem={guestItem} />
                <RoyalFooter />

                {!isEditor && <NavigationDock theme="royal" />}
                {!isEditor && <AudioPlayer autoPlayTrigger={isOpened} theme="royal" />}
              </div>
            )}
          </main>
        </div>
      </div>
    </WeddingDataProvider>
  );
}

export default RoyalHeritageTemplate;
