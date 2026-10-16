"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { MessageSquareHeart, Send, CheckCircle2, User, Users, Heart, Sparkles } from "lucide-react";
import { WishMessage } from "@/types/wedding";
import { useWeddingData } from "@/context/WeddingDataContext";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { submitRsvpApi } from "@/lib/api";
import {
  CrayonWashiTape,
  BotanicalLeaves,
  KidsDrawingHeart,
  TornPaperDivider,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

interface RsvpSectionProps {
  guestName?: string;
  guestItem?: {
    id: string;
    name: string;
    quota: number;
    token?: string;
    phone?: string;
  } | null;
}

export function RsvpSection({ guestName, guestItem }: RsvpSectionProps = {}) {
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
  const [formData, setFormData] = useState({
    name: defaultName,
    relationship: "Sahabat Seperjuangan",
    attendance: "Hadir dong! 😋" as "Hadir dong! 😋" | "Maaf belum bisa 🥺" | "Masih mikir-mikir 👀",
    guestsCount: "1 Orang",
    message: "",
  });

  useEffect(() => {
    if (defaultName && !formData.name) {
      setFormData((prev) => ({ ...prev, name: defaultName }));
    }
  }, [defaultName]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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
    if (!formData.name.trim() || !formData.message.trim()) return;

    submitWish({
      name: formData.name.trim(),
      relationship: formData.relationship,
      attendance: formData.attendance,
      message: formData.message.trim(),
      guestId: activeGuest?.id,
    });

    if (activeGuest?.id) {
      const isAttending = formData.attendance.startsWith("Hadir");
      const count = parseInt(formData.guestsCount) || 1;
      submitRsvpApi({
        guestId: activeGuest.id,
        status: isAttending ? 1 : 2,
        attendeeCount: isAttending ? Math.min(count, activeGuest.quota || 1) : 0,
        message: formData.message.trim(),
      }).catch((err) => console.warn("Notice RSVP submit:", err));
    }

    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 55,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#7D1128", "#E5B869", "#F5A8B8", "#D63D56", "#4A0812"],
      });
    } catch {
      // ignore
    }

    setFormData({
      name: "",
      relationship: "Sahabat Seperjuangan",
      attendance: "Hadir dong! 😋",
      guestsCount: "1 Orang",
      message: "",
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <section id="rsvp" className="relative py-16 paper-texture bg-[#FFF9FA] overflow-hidden">
      {/* Decorative Accents */}
      <BotanicalLeaves className="absolute -top-8 -left-6 w-36 h-56 opacity-30 rotate-25 pointer-events-none" />
      <div className="absolute top-1/2 -right-2 pointer-events-none opacity-75">
        <KidsDrawingHeart className="w-9 h-9" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#7D1128] text-white flex items-center justify-center border-2 border-[#4A0812] shadow-xs animate-gentle-pulse">
              <MessageSquareHeart className="w-6 h-6 text-[#FAD2D8]" />
            </div>
            <span className="font-script text-xl sm:text-2xl text-[#B3394B] font-bold block mb-1">
              Buku Tamu & Kasih Kabar Yaa! ✍️
            </span>
            <h2 className="font-handwriting text-4xl min-[380px]:text-5xl sm:text-6xl text-[#660F1A] mb-2">
              Konfirmasi & Doa
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#7D1128]">
              Biar kami bisa siapin porsi makanan yang pas dan ga kehabisan rendang:
            </p>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* RSVP Form Card */}
          <div className="lg:col-span-6">
            <MotionReveal variant="slide-left" delay={0.2}>
              <div className="crayon-box p-4 sm:p-8 relative bg-white border-[#660F1A]">
                {/* Washi tape header in gold */}
                <CrayonWashiTape
                  text="★ FORM RSVP ★"
                  color="gold"
                  className="absolute -top-3.5 left-6 sm:left-8 z-20"
                />

                <h3 className="font-script text-2xl sm:text-3xl font-bold text-[#660F1A] mb-3">
                  Kamu Bakal Dateng Kan? 🥺
                </h3>

                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-5 p-3.5 rounded-2xl bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#1B5E20] flex items-center gap-2.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2E7D32]" />
                      <p className="text-xs sm:text-sm font-script font-bold">
                        Yey terima kasih banyak! Doa dan konfirmasi kamu sudah masuk! 🎉
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#7D1128] uppercase tracking-wider mb-1">
                      Nama Kamu Siapa?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso Si Gemas"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#7D1128] bg-[#FFF9FA] text-[#4A0812] text-sm focus:outline-none focus:ring-2 focus:ring-[#D63D56]/40 placeholder:text-[#C48C95]"
                      />
                      <User className="w-4 h-4 text-[#9E2A3B] absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#7D1128] uppercase tracking-wider mb-1">
                      Hubungan Sama Siapa Nih?
                    </label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#7D1128] bg-[#FFF9FA] text-[#4A0812] text-sm focus:outline-none focus:ring-2 focus:ring-[#D63D56]/40 cursor-pointer font-medium"
                    >
                      <option value="Sahabat Seperjuangan">Sahabat Seperjuangan Gilang</option>
                      <option value="Bestie Cantik Salsadila">Bestie Cantik Salsadila</option>
                      <option value="Keluarga Mempelai Pria">Keluarga Mempelai Pria</option>
                      <option value="Keluarga Mempelai Wanita">Keluarga Mempelai Wanita</option>
                      <option value="Teman Kantor / Bisnis">Teman Kantor / Bisnis</option>
                      <option value="Sobat Kuliner & Nongkrong">Sobat Kuliner & Nongkrong</option>
                    </select>
                  </div>

                  {/* Attendance */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#7D1128] uppercase tracking-wider mb-1.5">
                      Bisa Hadir Nggak?
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {(["Hadir dong! 😋", "Maaf belum bisa 🥺", "Masih mikir-mikir 👀"] as const).map((status) => {
                        const isSelected = formData.attendance === status;
                        const bgActive =
                          status.startsWith("Hadir")
                            ? "bg-[#7D1128] text-white border-[#4A0812]"
                            : status.startsWith("Maaf")
                            ? "bg-[#4A0812] text-white border-[#2A040A]"
                            : "bg-[#E5B869] text-[#4A0812] border-[#8A5A10]";

                        return (
                          <button
                            type="button"
                            key={status}
                            onClick={() => setFormData({ ...formData, attendance: status })}
                            className={`py-2 px-1 text-[11px] sm:text-xs font-script font-bold rounded-xl border-2 transition-all cursor-pointer min-h-[44px] flex items-center justify-center text-center leading-tight ${
                              isSelected
                                ? `${bgActive} shadow-[2px_2px_0px_#4A0812] scale-102`
                                : "bg-[#FFF9FA] text-[#7D1128] border-[#7D1128] hover:bg-[#FFE5EB]"
                            }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Guests Count */}
                  {formData.attendance === "Hadir dong! 😋" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono font-bold text-[#7D1128] uppercase tracking-wider">
                          Bawa Berapa Pasukan?
                        </label>
                        {activeGuest?.quota && (
                          <span className="text-[10px] font-mono text-[#9E2A3B] bg-[#FFF0F2] px-2 py-0.5 rounded-md border border-[#FAD2D8]">
                            Maks. {activeGuest.quota} Orang
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <select
                          value={formData.guestsCount}
                          onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#7D1128] bg-[#FFF9FA] text-[#4A0812] text-sm focus:outline-none focus:ring-2 focus:ring-[#D63D56]/40 cursor-pointer font-medium"
                        >
                          {Array.from({
                            length: Math.min(10, Math.max(1, activeGuest?.quota || 2)),
                          }).map((_, i) => (
                            <option key={i + 1} value={`${i + 1} Orang`}>
                              {i + 1} Orang{" "}
                              {i === 0
                                ? "(Solo Fighter)"
                                : i === 1
                                ? "(Sama Pasangan / Bestie)"
                                : ""}
                            </option>
                          ))}
                        </select>
                        <Users className="w-4 h-4 text-[#9E2A3B] absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </motion.div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#7D1128] uppercase tracking-wider mb-1">
                      Doa / Pesan Lucu Buat Pengantin
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tulis ucapan, ledekan sayang, atau doa terbaikmu di sini..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#7D1128] bg-[#FFF9FA] text-[#4A0812] text-sm focus:outline-none focus:ring-2 focus:ring-[#D63D56]/40 placeholder:text-[#C48C95] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="crayon-button w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold cursor-pointer min-h-[48px]"
                  >
                    <Send className="w-4 h-4" />
                    Kirim Konfirmasi & Doa Restu 🚀
                  </button>
                </form>
              </div>
            </MotionReveal>
          </div>

          {/* Wishes Feed */}
          <div className="lg:col-span-6">
            <MotionReveal variant="slide-right" delay={0.3}>
              <div className="crayon-box p-4 sm:p-7 bg-[#FFF0F3] border-[#660F1A]">
                <div className="flex items-center justify-between border-b-2 border-dashed border-[#8A1C2C]/30 pb-3 mb-4">
                  <h3 className="font-script text-xl sm:text-2xl font-bold text-[#660F1A]">
                    Untaian Doa Hangat ({wishes.length}) 💌
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#7D1128] bg-white px-2.5 py-0.5 rounded-full border border-[#7D1128]">
                    LIVE
                  </span>
                </div>

                {/* Animated scrollable list */}
                <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-2">
                  <AnimatePresence initial={false}>
                    {wishes.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-2xl p-4 border-2 border-[#7D1128] shadow-[2px_3px_0px_#7D1128] relative"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <h4 className="font-sans font-bold text-sm text-[#4A0812]">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-mono text-[#9E2A3B]">
                              {item.relationship}
                            </span>
                          </div>
                          <span className="text-[10px] font-script font-bold px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#7D1128] border border-[#7D1128]">
                            {item.attendance}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-sans text-[#5A0B17] leading-relaxed my-2">
                          &ldquo;{item.message}&rdquo;
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-[#F8B4C0] text-[10px] text-[#9E2A3B] font-mono">
                          <span>{item.date}</span>
                          <Heart className="w-3.5 h-3.5 text-[#D63D56] fill-current animate-pulse" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {wishes.length === 0 && (
                    <p className="text-xs font-sans text-[#7D1128]">Belum ada ucapan yang tersimpan.</p>
                  )}
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FFF0F3" />
      </div>
    </section>
  );
}
