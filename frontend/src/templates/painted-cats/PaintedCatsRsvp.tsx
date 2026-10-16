"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Check, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";
import { useWeddingData } from "@/context/WeddingDataContext";
import { WishMessage } from "@/types/wedding";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { submitRsvpApi } from "@/lib/api";
import { CatPawPrint, BrushStrokeDivider } from "./PaintedDecorations";

interface PaintedCatsRsvpProps {
  guestName?: string;
  guestItem?: {
    id: string;
    name: string;
    quota: number;
    token?: string;
    phone?: string;
  } | null;
}

export function PaintedCatsRsvp({ guestName, guestItem }: PaintedCatsRsvpProps) {
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#D97736", "#FAF6EE", "#C85A17"],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-16 px-6 text-center text-[#2C2623] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-1.5">
            <CatPawPrint className="w-3.5 h-3.5 text-[#D97736]" color="#D97736" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A17]">
              Konfirmasi &amp; Doa Restu
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2623]">
            Buku Tamu &amp; RSVP
          </h2>
          <p className="text-xs text-[#7A6150] max-w-xs mx-auto leading-relaxed">
            Mohon konfirmasikan kehadiran Anda dan sampaikan doa tulus bagi kedua mempelai.
          </p>
        </motion.div>

        {/* RSVP Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border-2 border-[#EAD8C7] shadow-[0_15px_35px_rgba(200,90,23,0.08)] text-left space-y-4"
        >
          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-[#F0F8F3] border border-[#BDE0C7] flex items-center gap-2.5 text-xs text-[#24623E]">
              <Check className="w-4 h-4 text-[#2E7A4A] shrink-0" />
              <span>Terima kasih! Konfirmasi kehadiran dan doa restu Anda telah tersimpan.</span>
            </div>
          )}

          {/* Guest Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A07855] mb-1.5 font-medium">
              Nama Lengkap Tamu
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DCD0C5] bg-[#FAF6EE] text-[#2C2623] placeholder-[#A07855]/50 text-xs sm:text-sm focus:outline-none focus:border-[#D97736] focus:ring-1 focus:ring-[#D97736]"
            />
          </div>

          {/* Attendance Radio Pills */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A07855] mb-1.5 font-medium">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "hadir", label: "Pasti Hadir" },
                { id: "ragu", label: "Masih Ragu" },
                { id: "tidak", label: "Berhalangan" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAttendance(item.id as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium transition-all text-center border cursor-pointer ${
                    attendance === item.id
                      ? "bg-[#D97736] text-white border-[#D97736] font-semibold shadow-xs"
                      : "bg-[#FAF6EE] text-[#5C4A3E] border-[#E8D9CB] hover:bg-[#F3E8DB]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pax count if Attending */}
          {attendance === "hadir" && (
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#A07855] mb-1.5 font-medium">
                Jumlah Kehadiran (Pax)
              </label>
              <select
                value={attendeeCount}
                onChange={(e) => setAttendeeCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD0C5] bg-[#FAF6EE] text-[#2C2623] text-xs sm:text-sm focus:outline-none focus:border-[#D97736]"
              >
                {Array.from({ length: Math.max(1, maxQuota) }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} Orang
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Wishes Message */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A07855] mb-1.5 font-medium">
              Untaian Doa Restu
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan doa tulus dan pesan manis Anda..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#DCD0C5] bg-[#FAF6EE] text-[#2C2623] placeholder-[#A07855]/50 text-xs sm:text-sm focus:outline-none focus:border-[#D97736] focus:ring-1 focus:ring-[#D97736]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 rounded-2xl bg-[#D97736] hover:bg-[#C85A17] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
            <span>{isSubmitting ? "Mengirim..." : "Kirim Konfirmasi &amp; Doa"}</span>
          </button>
        </motion.form>

        {/* Wishes Feed */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8D9CB]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C85A17] font-semibold">
              Koleksi Doa Restu
            </span>
            <span className="text-xs font-mono text-[#8C6D58]">
              {wishes.length} Pesan
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {wishes.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#EAD8C7] space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-sm text-[#2C2623] block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#A07855] font-mono">
                      {item.relationship} • {item.date}
                    </span>
                  </div>
                  {item.attendance && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FAF6EE] border border-[#E8D9CB] text-[#C85A17]">
                      {item.attendance}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4A3B31] leading-relaxed font-sans italic bg-[#FAF6EE] p-3 rounded-xl border border-[#EFE5DB]">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
