"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Check, MessageSquare, Users } from "lucide-react";
import confetti from "canvas-confetti";
import { useWeddingData } from "@/context/WeddingDataContext";
import { WishMessage } from "@/types/wedding";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { submitRsvpApi } from "@/lib/api";
import { FilmTimecodeBadge, ModernHairlineDivider } from "./CinematicDecorations";

interface CinematicRsvpProps {
  guestName?: string;
  guestItem?: {
    id: string;
    name: string;
    quota: number;
    token?: string;
    phone?: string;
  } | null;
}

export function CinematicRsvp({ guestName, guestItem }: CinematicRsvpProps) {
  const data = useWeddingData();

  const [name, setName] = useState(guestItem?.name || guestName || "");
  const [attendance, setAttendance] = useState<"hadir" | "ragu" | "tidak">("hadir");
  const [attendeeCount, setAttendeeCount] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [wishes, setWishes] = useState<WishMessage[]>([]);

  useEffect(() => {
    if (guestItem?.name) {
      setName(guestItem.name);
    } else if (guestName) {
      setName(guestName);
    }
  }, [guestItem, guestName]);

  useEffect(() => {
    const list = getWishes();
    if (list && list.length > 0) {
      setWishes(list);
    } else if (data.initialWishes && data.initialWishes.length > 0) {
      setWishes(data.initialWishes);
    }
  }, [data.initialWishes]);

  const maxQuota = guestItem?.quota || 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    try {
      if (guestItem?.id) {
        await submitRsvpApi({
          guestId: guestItem.id,
          status: attendance === "hadir" ? 1 : attendance === "tidak" ? 2 : 0,
          attendeeCount: attendance === "hadir" ? attendeeCount : 0,
          message: message.trim(),
        });
      }

      const attendanceText =
        attendance === "hadir"
          ? "Hadir"
          : attendance === "ragu"
          ? "Masih Ragu"
          : "Berhalangan Hadir";

      const newWish = submitWish({
        name: name.trim(),
        relationship: "Tamu Undangan",
        attendance: attendanceText,
        message: message.trim(),
        guestId: guestItem?.id,
      });

      setWishes((prev) => [newWish, ...prev]);
      setIsSuccess(true);
      setMessage("");

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#ffffff", "#cbd5e1", "#f43f5e"],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-16 px-6 text-center text-white overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <FilmTimecodeBadge scene="SCENE 07" take="RED CARPET RSVP" className="mb-2" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Konfirmasi RSVP &amp; Doa
          </h2>
          <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
            Konfirmasikan kehadiran Anda serta sampaikan untaian doa restu untuk kedua mempelai.
          </p>
        </motion.div>

        {/* RSVP Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/45 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left space-y-4"
        >
          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/30 flex items-center gap-2.5 text-xs text-white">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Terima kasih! Konfirmasi kehadiran dan doa Anda telah tersimpan.</span>
            </div>
          )}

          {/* Guest Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-black/40 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          {/* Attendance Radio Pills */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "hadir", label: "Hadir" },
                { key: "ragu", label: "Ragu-ragu" },
                { key: "tidak", label: "Berhalangan" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAttendance(opt.key as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer text-center ${
                    attendance === opt.key
                      ? "bg-white text-black border-white font-semibold shadow-md"
                      : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Attendee Count Stepper (if Hadir) */}
          {attendance === "hadir" && (
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
                Jumlah Hadir (Maksimal {maxQuota} Orang)
              </label>
              <div className="flex items-center gap-2">
                {Array.from({ length: maxQuota }, (_, i) => i + 1).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setAttendeeCount(cnt)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer text-center ${
                      attendeeCount === cnt
                        ? "bg-white text-black border-white font-bold"
                        : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {cnt} Orang
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message / Wish Textarea */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-white/60 mb-1.5">
              Ucapan &amp; Doa Restu
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
              className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-black/40 text-white placeholder-white/40 text-xs sm:text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-white/90 text-black font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md"
          >
            <Send className="w-4 h-4 text-black" />
            <span>{isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}</span>
          </button>
        </motion.form>

        {/* Wishes List Feed */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/60">
              Ucapan &amp; Doa ({wishes.length})
            </span>
            <MessageSquare className="w-4 h-4 text-white/50" />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            {wishes.map((w, idx) => (
              <div
                key={w.id || idx}
                className="bg-black/35 backdrop-blur-xl rounded-2xl p-4 border border-white/15 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-white">
                    {w.name}
                  </span>
                  {w.attendance && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15">
                      {w.attendance}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  {w.message}
                </p>
                {w.createdAt && (
                  <span className="text-[9px] font-mono text-white/40 block">
                    {new Date(w.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
