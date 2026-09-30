"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { MessageSquareHeart, Send, CheckCircle2, User, Users, Heart } from "lucide-react";
import { WEDDING_DATA, WishMessage } from "@/data/weddingData";
import { BotanicalLeaves, TornPaperDivider } from "./PaperArtDecorations";

export function RsvpSection() {
  const [wishes, setWishes] = useState<WishMessage[]>(WEDDING_DATA.initialWishes);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Sahabat",
    attendance: "Hadir" as "Hadir" | "Tidak Hadir" | "Masih Ragu",
    guestsCount: "1 Orang",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Load saved wishes from localStorage on client
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wedding_wishes_dimas_sarah");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(parsed);
        }
      }
    } catch {
      // Fallback to initial
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
      localStorage.setItem("wedding_wishes_dimas_sarah", JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#C26D53", "#8A9A86", "#DECBB4", "#557357"],
      });
    } catch {
      // ignore
    }

    setFormData({
      name: "",
      relationship: "Sahabat",
      attendance: "Hadir",
      guestsCount: "1 Orang",
      message: "",
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <section id="rsvp" className="relative py-16 paper-texture overflow-hidden">
      {/* Decorative leaf cutouts */}
      <BotanicalLeaves className="absolute -top-8 -left-6 w-36 h-56 opacity-35 rotate-25" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FFFDF9] text-[#A85A42] border border-[#DECBB4] flex items-center justify-center shadow-xs">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <span className="font-serif italic text-xs tracking-widest uppercase text-[#947358] block mb-1">
            Konfirmasi & Doa
          </span>
          <h2 className="font-handwriting text-5xl sm:text-6xl text-[#3A3027] mb-2">
            Buku Tamu & RSVP
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#786452]">
            Mohon kesediaan Bapak/Ibu/Saudara/i untuk mengonfirmasi kehadiran dan menguntai doa restu
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* RSVP Form Card */}
          <div className="lg:col-span-6">
            <div className="paper-sheet rounded-2xl p-6 sm:p-8 border border-[#DECBB4] shadow-md relative">
              {/* Washi tape header */}
              <div className="absolute -top-3 left-8 w-24 h-6 washi-tape -rotate-2 opacity-90" />

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#352B24] mb-4">
                Formulir Kehadiran
              </h3>

              {isSubmitted && (
                <div className="mb-6 p-4 rounded-xl bg-[#E8EFE5] border border-[#BACBB7] text-[#3F5A3E] flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#4D714C]" />
                  <p className="text-xs sm:text-sm font-sans font-medium">
                    Terima kasih! Konfirmasi kehadiran dan ucapan doa Anda telah terkirim.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#5A4A3C] uppercase tracking-wider mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AA] bg-[#FFFDF9] text-[#352B24] text-sm focus:outline-none focus:ring-2 focus:ring-[#A85A42]/50 placeholder:text-[#AFA193]"
                    />
                    <User className="w-4 h-4 text-[#A89888] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#5A4A3C] uppercase tracking-wider mb-1.5">
                    Hubungan / Kerabat
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AA] bg-[#FFFDF9] text-[#352B24] text-sm focus:outline-none focus:ring-2 focus:ring-[#A85A42]/50"
                  >
                    <option value="Sahabat Dimas">Sahabat Dimas</option>
                    <option value="Sahabat Sarah">Sahabat Sarah</option>
                    <option value="Keluarga Mempelai Pria">Keluarga Mempelai Pria</option>
                    <option value="Keluarga Mempelai Wanita">Keluarga Mempelai Wanita</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="Tamu Undangan">Tamu Undangan</option>
                  </select>
                </div>

                {/* Attendance */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#5A4A3C] uppercase tracking-wider mb-1.5">
                    Konfirmasi Kehadiran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Hadir", "Tidak Hadir", "Masih Ragu"] as const).map((status) => (
                      <button
                        type="button"
                        key={status}
                        onClick={() => setFormData({ ...formData, attendance: status })}
                        className={`py-2 px-1 text-xs font-sans font-medium rounded-xl border transition-all cursor-pointer ${
                          formData.attendance === status
                            ? "bg-[#A85A42] text-[#FFFDF9] border-[#A85A42] shadow-xs"
                            : "bg-[#FFFDF9] text-[#695646] border-[#D5C2AA] hover:bg-[#FAF6EE]"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guests Count (Only if Hadir) */}
                {formData.attendance === "Hadir" && (
                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#5A4A3C] uppercase tracking-wider mb-1.5">
                      Jumlah Tamu
                    </label>
                    <div className="relative">
                      <select
                        value={formData.guestsCount}
                        onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AA] bg-[#FFFDF9] text-[#352B24] text-sm focus:outline-none focus:ring-2 focus:ring-[#A85A42]/50"
                      >
                        <option value="1 Orang">1 Orang</option>
                        <option value="2 Orang">2 Orang</option>
                      </select>
                      <Users className="w-4 h-4 text-[#A89888] absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Message / Wishes */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#5A4A3C] uppercase tracking-wider mb-1.5">
                    Untaian Doa & Ucapan
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C2AA] bg-[#FFFDF9] text-[#352B24] text-sm focus:outline-none focus:ring-2 focus:ring-[#A85A42]/50 placeholder:text-[#AFA193] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-sans font-medium bg-[#A85A42] hover:bg-[#8F4731] text-[#FFFDF9] shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Kirim Konfirmasi & Doa Restu
                </button>
              </form>
            </div>
          </div>

          {/* Wishes Feed */}
          <div className="lg:col-span-6">
            <div className="paper-sheet-kraft rounded-2xl p-6 sm:p-7 border border-[#DECBB4] shadow-md">
              <div className="flex items-center justify-between border-b border-[#D8C4AA] pb-3 mb-4">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#352B24]">
                  Untaian Doa ({wishes.length})
                </h3>
                <span className="text-xs font-sans text-[#7E6957]">
                  Terbaru
                </span>
              </div>

              {/* Scrollable list */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
                {wishes.map((item) => (
                  <div
                    key={item.id}
                    className="paper-sheet rounded-xl p-4 border border-[#E0D0BD] shadow-xs relative"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#352B24]">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-sans text-[#8C7A68]">
                          {item.relationship}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${
                          item.attendance === "Hadir"
                            ? "bg-[#E2EDE0] text-[#3C6439] border border-[#C2D8BE]"
                            : item.attendance === "Tidak Hadir"
                            ? "bg-[#F7E5E5] text-[#8A3A3A] border border-[#E9C2C2]"
                            : "bg-[#FDF3E2] text-[#8A6A2C] border border-[#EFE0BC]"
                        }`}
                      >
                        {item.attendance}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-[#564536] leading-relaxed my-2">
                      &ldquo;{item.message}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-[#EFE2D2] text-[10px] text-[#A39182]">
                      <span>{item.date}</span>
                      <Heart className="w-3 h-3 text-[#C26D53] fill-current" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#F4EFE6" />
      </div>
    </section>
  );
}
