"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Send, MessageSquareHeart, CheckCircle2 } from "lucide-react";
import { WishMessage } from "@/types/wedding";
import { useWeddingData } from "@/context/WeddingDataContext";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { submitRsvpApi } from "@/lib/api";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

interface CityscapeRsvpProps {
  guestName?: string;
  guestItem?: {
    id: string;
    name: string;
    quota: number;
    token?: string;
    phone?: string;
  } | null;
}

export function CityscapeRsvp({ guestName, guestItem }: CityscapeRsvpProps = {}) {
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
      }).catch((err) => console.warn("Notice Cityscape RSVP submit:", err));
    }

    setName(defaultName || "");
    setMessage("");
    setIsSuccess(true);

    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.7 },
        colors: ["#38B6FF", "#2E8BC0", "#FFE58F", "#0C4A60"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => setIsSuccess(false), 3500);
  };

  return (
    <SectionMotion
      id="rsvp"
      className="relative py-16 px-4 bg-gradient-to-b from-[#F5FAFC] via-[#EBF4F8] to-[#FFFFFF] overflow-hidden"
    >
      <div className="max-w-md mx-auto relative z-10 text-center space-y-8">
        <ItemMotion variant="slide-down">
          <span className="text-xs font-mono font-bold text-[#1D78A0] uppercase tracking-wider block mb-1">
            Konfirmasi Kehadiran
          </span>
          <h2 className="font-handwriting text-5xl text-[#0C4A60] mb-2">
            Buku Tamu &amp; Doa Restu
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Kehadiran dan untaian doa Anda merupakan kado terindah bagi awal langkah kehidupan kami.
          </p>
        </ItemMotion>

        {/* RSVP Form Card */}
        <ItemMotion variant="slide-left" delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-sky-100 shadow-[0_8px_30px_rgba(29,120,160,0.08)] text-left space-y-4"
          >
            <div>
              <label className="block text-xs font-mono font-bold text-[#0C4A60] mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tuliskan nama Anda"
                className="w-full px-4 py-2.5 rounded-xl border border-sky-200 bg-[#F8FCFD] text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1D78A0] focus:ring-1 focus:ring-[#1D78A0] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#0C4A60] mb-1">
                Konfirmasi Kehadiran
              </label>
              <select
                value={attendance}
                onChange={(e) => setAttendance(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-sky-200 bg-[#F8FCFD] text-xs font-sans text-slate-800 focus:outline-none focus:border-[#1D78A0] focus:ring-1 focus:ring-[#1D78A0] transition-colors"
              >
                <option value="Hadir">Pasti Hadir</option>
                <option value="Ragu-ragu">Masih Ragu-ragu</option>
                <option value="Berhalangan">Berhalangan Hadir</option>
              </select>
            </div>

            {attendance === "Hadir" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono font-bold text-[#0C4A60]">
                    Jumlah Hadir
                  </label>
                  {activeGuest?.quota && (
                    <span className="text-[10px] font-mono text-[#1D78A0] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      Maks. {activeGuest.quota} Orang
                    </span>
                  )}
                </div>
                <select
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-200 bg-[#F8FCFD] text-xs font-sans text-slate-800 focus:outline-none focus:border-[#1D78A0] focus:ring-1 focus:ring-[#1D78A0] transition-colors"
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
              <label className="block text-xs font-mono font-bold text-[#0C4A60] mb-1">
                Ucapan &amp; Doa Restu
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan doa restu untuk kedua mempelai..."
                className="w-full px-4 py-2.5 rounded-xl border border-sky-200 bg-[#F8FCFD] text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1D78A0] focus:ring-1 focus:ring-[#1D78A0] transition-colors"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-3 rounded-xl bg-[#2E8BC0] hover:bg-[#1D78A0] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Kirim Doa &amp; Konfirmasi</span>
            </motion.button>

            {isSuccess && (
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 py-2 rounded-xl animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Doa Anda telah berhasil terkirim. Terima kasih!</span>
              </div>
            )}
          </form>
        </ItemMotion>

        {/* Wishes List Feed */}
        <ItemMotion variant="slide-right" delay={0.2} className="space-y-3 max-h-96 overflow-y-auto pr-1 text-left">
          {wishes.map((item, idx) => (
            <ItemMotion
              key={item.id || idx}
              variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
              delay={Math.min(idx * 0.05, 0.35)}
              className="bg-white rounded-2xl p-4 border border-sky-100 shadow-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#0C4A60]">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.date}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &ldquo;{item.message}&rdquo;
              </p>
            </ItemMotion>
          ))}
        </ItemMotion>
      </div>
    </SectionMotion>
  );
}

export default CityscapeRsvp;
