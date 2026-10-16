"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Check, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";
import { useWeddingData } from "@/context/WeddingDataContext";
import { WishMessage } from "@/types/wedding";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { submitRsvpApi } from "@/lib/api";
import { ExtractedColors } from "@/lib/colorExtractor";

interface AmbientBlurRsvpProps {
  guestName?: string;
  guestItem?: {
    id: string;
    name: string;
    quota: number;
    token?: string;
    phone?: string;
  } | null;
  palette?: ExtractedColors;
}

export function AmbientBlurRsvp({ guestName, guestItem, palette }: AmbientBlurRsvpProps) {
  const data = useWeddingData();

  const accentColor = palette?.dominant || "#D97736";
  const glowColor = palette?.glow || "rgba(217,119,54,0.3)";

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
        colors: [accentColor, "#ffffff", palette?.secondary || "#cbd5e1"],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-16 px-6 text-center text-slate-800 overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="flex justify-center">
            <span
              style={{
                borderColor: `${accentColor}44`,
                backgroundColor: `${accentColor}12`,
                color: accentColor,
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest backdrop-blur-md font-semibold"
            >
              <span
                style={{ backgroundColor: accentColor }}
                className="w-1.5 h-1.5 rounded-full"
              />
              Konfirmasi &amp; Doa
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            RSVP &amp; Ucapan Doa
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
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
          style={{
            borderColor: `${accentColor}33`,
            boxShadow: `0 20px 45px rgba(15,23,42,0.06), 0 0 25px ${glowColor}`,
          }}
          className="bg-white/85 sm:bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border shadow-xl ring-1 ring-slate-900/5 text-left space-y-4"
        >
          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 shadow-sm">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Terima kasih! Konfirmasi kehadiran dan doa Anda telah tersimpan.</span>
            </div>
          )}

          {/* Guest Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1.5 font-semibold">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white/95 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 shadow-sm"
            />
          </div>

          {/* Attendance Radio Pills */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1.5 font-semibold">
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
                  style={{
                    backgroundColor: attendance === opt.key ? accentColor : "#F8FAFC",
                    borderColor: attendance === opt.key ? accentColor : "#E2E8F0",
                    color: attendance === opt.key ? "#FFFFFF" : "#475569",
                  }}
                  className={`py-2 px-2 rounded-xl text-xs border transition-all cursor-pointer text-center ${
                    attendance === opt.key ? "font-semibold shadow-md" : "hover:bg-slate-100 font-medium"
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
              <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1.5 font-semibold">
                Jumlah Hadir (Maksimal {maxQuota} Orang)
              </label>
              <div className="flex items-center gap-2">
                {Array.from({ length: maxQuota }, (_, i) => i + 1).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setAttendeeCount(cnt)}
                    style={{
                      backgroundColor: attendeeCount === cnt ? accentColor : "#F8FAFC",
                      borderColor: attendeeCount === cnt ? accentColor : "#E2E8F0",
                      color: attendeeCount === cnt ? "#FFFFFF" : "#475569",
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer text-center ${
                      attendeeCount === cnt ? "font-bold shadow-sm" : "hover:bg-slate-100 font-medium"
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
            <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1.5 font-semibold">
              Ucapan &amp; Doa Restu
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white/95 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 resize-none shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: accentColor,
            }}
            className="w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:brightness-110 cursor-pointer disabled:opacity-50 shadow-md"
          >
            <Send className="w-4 h-4 text-white" />
            <span>{isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}</span>
          </button>
        </motion.form>

        {/* Wishes List Feed */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Ucapan &amp; Doa ({wishes.length})
            </span>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            {wishes.map((w, idx) => (
              <div
                key={w.id || idx}
                style={{
                  borderColor: `${accentColor}25`,
                }}
                className="bg-white/85 sm:bg-white/90 backdrop-blur-xl rounded-2xl p-4 border ring-1 ring-slate-900/5 shadow-sm space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-slate-900">
                    {w.name}
                  </span>
                  {w.attendance && (
                    <span
                      style={{
                        borderColor: `${accentColor}33`,
                        backgroundColor: `${accentColor}12`,
                        color: accentColor,
                      }}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold"
                    >
                      {w.attendance}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {w.message}
                </p>
                {w.createdAt && (
                  <span className="text-[9px] font-mono text-slate-400 block">
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
