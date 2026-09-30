"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { MessageSquareHeart, Send, CheckCircle2, User, Users, Heart, Sparkles } from "lucide-react";
import { WEDDING_DATA, WishMessage } from "@/data/weddingData";
import {
  CrayonWashiTape,
  KidsDrawingHeart,
  KidsDrawingStar,
  TornPaperDivider,
} from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function RsvpSection() {
  const [wishes, setWishes] = useState<WishMessage[]>(WEDDING_DATA.initialWishes);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Sahabat Seperjuangan",
    attendance: "Hadir dong! 😋" as "Hadir dong! 😋" | "Maaf belum bisa 🥺" | "Masih mikir-mikir 👀",
    guestsCount: "1 Orang",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wedding_wishes_dimas_sarah_kids_art");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(parsed);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    const newWish: WishMessage = {
      id: "w_" + Date.now(),
      name: formData.name.trim(),
      relationship: formData.relationship,
      attendance: formData.attendance,
      message: formData.message.trim(),
      date: "Baru saja",
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);

    try {
      localStorage.setItem("wedding_wishes_dimas_sarah_kids_art", JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#EF4444", "#FBBF24", "#3B82F6", "#22C55E", "#EC4899"],
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
    <section id="rsvp" className="relative py-16 paper-texture bg-[#FFFDF8] overflow-hidden">
      {/* Decorative Doodles */}
      <div className="absolute -top-6 -left-2 pointer-events-none opacity-80">
        <KidsDrawingStar className="w-10 h-10 text-[#FBBF24]" />
      </div>
      <div className="absolute top-1/2 -right-2 pointer-events-none opacity-75">
        <KidsDrawingHeart className="w-9 h-9" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FEF08A] text-[#222222] flex items-center justify-center border-2 border-[#222222] shadow-[2px_2px_0px_#222222] animate-gentle-pulse">
              <MessageSquareHeart className="w-6 h-6 text-[#EF4444]" />
            </div>
            <span className="font-script text-2xl text-[#EF4444] font-bold block mb-1">
              Buku Tamu & Kasih Kabar Yaa! ✍️
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#222222] mb-2">
              Konfirmasi & Doa
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#4B5563]">
              Biar kami bisa siapin porsi makanan yang pas dan ga kehabisan rendang:
            </p>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* RSVP Form Card */}
          <div className="lg:col-span-6">
            <MotionReveal variant="slide-left" delay={0.2}>
              <div className="crayon-box p-6 sm:p-8 relative bg-white">
                {/* Washi tape header */}
                <CrayonWashiTape
                  text="★ FORM RSVP ★"
                  color="yellow"
                  className="absolute -top-3.5 left-8 z-20"
                />

                <h3 className="font-script text-2xl sm:text-3xl font-bold text-[#222222] mb-3">
                  Kamu Bakal Dateng Kan? 🥺
                </h3>

                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-5 p-3.5 rounded-2xl bg-[#DCFCE7] border-2 border-[#222222] text-[#15803D] flex items-center gap-2.5 shadow-[2px_2px_0px_#222222]"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-[#16A34A]" />
                      <p className="text-xs sm:text-sm font-script font-bold">
                        Yey terima kasih banyak! Doa dan konfirmasi kamu sudah masuk! 🎉
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#222222] uppercase tracking-wider mb-1">
                      Nama Kamu Siapa?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso Si Gemas"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#222222] bg-[#FFFBEB] text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24] placeholder:text-[#9CA3AF]"
                      />
                      <User className="w-4 h-4 text-[#6B7280] absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#222222] uppercase tracking-wider mb-1">
                      Hubungan Sama Siapa Nih?
                    </label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#222222] bg-[#FFFBEB] text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24] cursor-pointer font-medium"
                    >
                      <option value="Sahabat Seperjuangan">Sahabat Seperjuangan Dimas</option>
                      <option value="Bestie Cantik Sarah">Bestie Cantik Sarah</option>
                      <option value="Keluarga Mempelai Pria">Keluarga Mempelai Pria</option>
                      <option value="Keluarga Mempelai Wanita">Keluarga Mempelai Wanita</option>
                      <option value="Teman Kantor / Bisnis">Teman Kantor / Bisnis</option>
                      <option value="Sobat Kuliner & Nongkrong">Sobat Kuliner & Nongkrong</option>
                    </select>
                  </div>

                  {/* Attendance */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#222222] uppercase tracking-wider mb-1.5">
                      Bisa Hadir Nggak?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Hadir dong! 😋", "Maaf belum bisa 🥺", "Masih mikir-mikir 👀"] as const).map((status) => {
                        const isSelected = formData.attendance === status;
                        const bgActive =
                          status.startsWith("Hadir")
                            ? "bg-[#BBF7D0] text-[#14532D]"
                            : status.startsWith("Maaf")
                            ? "bg-[#FECACA] text-[#7F1D1D]"
                            : "bg-[#FEF08A] text-[#713F12]";

                        return (
                          <button
                            type="button"
                            key={status}
                            onClick={() => setFormData({ ...formData, attendance: status })}
                            className={`py-2 px-1 text-xs font-script font-bold rounded-xl border-2 border-[#222222] transition-all cursor-pointer ${
                              isSelected
                                ? `${bgActive} shadow-[2px_2px_0px_#222222] scale-102`
                                : "bg-[#FFFDF8] text-[#374151] hover:bg-[#FEF9C3]"
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
                      <label className="block text-xs font-mono font-bold text-[#222222] uppercase tracking-wider mb-1">
                        Bawa Berapa Pasukan?
                      </label>
                      <div className="relative">
                        <select
                          value={formData.guestsCount}
                          onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#222222] bg-[#FFFBEB] text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24] cursor-pointer font-medium"
                        >
                          <option value="1 Orang">1 Orang (Solo Fighter)</option>
                          <option value="2 Orang">2 Orang (Sama Pasangan / Bestie)</option>
                        </select>
                        <Users className="w-4 h-4 text-[#6B7280] absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </motion.div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#222222] uppercase tracking-wider mb-1">
                      Doa / Pesan Lucu Buat Pengantin
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tulis ucapan, ledekan sayang, atau doa terbaikmu di sini..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#222222] bg-[#FFFBEB] text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24] placeholder:text-[#9CA3AF] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="crayon-button w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold cursor-pointer"
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
              <div className="crayon-box p-6 sm:p-7 bg-[#FEF9E7]">
                <div className="flex items-center justify-between border-b-2 border-dashed border-[#222222]/20 pb-3 mb-4">
                  <h3 className="font-script text-2xl font-bold text-[#222222]">
                    Untaian Doa Hangat ({wishes.length}) 💌
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#222222] bg-[#FEF08A] px-2.5 py-0.5 rounded-full border-2 border-[#222222] shadow-[1px_2px_0px_#222222]">
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
                        className="bg-white rounded-2xl p-4 border-2 border-[#222222] shadow-[2px_3px_0px_#222222] relative"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <h4 className="font-sans font-bold text-sm text-[#111827]">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-mono text-[#6B7280]">
                              {item.relationship}
                            </span>
                          </div>
                          <span className="text-[10px] font-script font-bold px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#222222] border border-[#222222]">
                            {item.attendance}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-sans text-[#374151] leading-relaxed my-2">
                          &ldquo;{item.message}&rdquo;
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t-2 border-dashed border-[#222222]/15 text-[10px] text-[#6B7280] font-mono">
                          <span>{item.date}</span>
                          <Heart className="w-3.5 h-3.5 text-[#EF4444] fill-current animate-pulse" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FEF9E7" />
      </div>
    </section>
  );
}
