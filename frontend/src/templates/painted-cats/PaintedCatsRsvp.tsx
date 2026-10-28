"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Check, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";
import { useWeddingData } from "@/context/WeddingDataContext";
import { WishMessage } from "@/types/wedding";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { submitRsvpApi } from "@/lib/api";
import { DoodlePawSticker, DoodleHeartSticker } from "./PaintedDecorations";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

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
        colors: ["#DF7B54", "#F4929D", "#FBBF24", "#8FA876", "#FFFDF9"],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionMotion id="rsvp" className="relative py-16 px-6 text-center text-[#38241B] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        <ItemMotion variant="slide-down" delay={0.06} className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF4EC] border border-[#FCD5CE] text-[11px] font-sans font-bold text-[#DF7B54] mx-auto shadow-2xs">
            <ItemMotion float={true} floatDistance={3} floatDuration={3}>
              <DoodlePawSticker className="w-3.5 h-3.5" rotate={0} />
            </ItemMotion>
            <span>Konfirmasi &amp; Doa Restu</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#38241B]">
            Buku Tamu &amp; RSVP
          </h2>
          <p className="text-xs text-[#6E5345] max-w-xs mx-auto leading-relaxed">
            Mohon konfirmasikan kehadiran Anda dan sampaikan doa tulus bagi kedua mempelai.
          </p>
        </ItemMotion>

        <ItemMotion variant="slide-left" delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-7 border-[4px] border-white ring-1 ring-[#F3DFD1] shadow-[0_20px_45px_rgba(222,125,84,0.12)] text-left space-y-4"
          >
          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] flex items-center gap-2.5 text-xs text-[#2E7D32]">
              <Check className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span>Terima kasih! Konfirmasi kehadiran dan doa restu Anda telah tersimpan.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans font-bold text-[#6E5345] mb-1.5">
              Nama Lengkap Tamu
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-2.5 rounded-2xl border border-[#F3DFD1] bg-[#FFFDF9] text-[#38241B] placeholder-[#8C6D58]/45 text-xs sm:text-sm focus:outline-none focus:border-[#DF7B54] focus:ring-2 focus:ring-[#DF7B54]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold text-[#6E5345] mb-1.5">
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
                  className={`py-2.5 px-2 rounded-2xl text-xs font-sans font-bold transition-all text-center border cursor-pointer ${
                    attendance === item.id
                      ? "bg-gradient-to-r from-[#DF7B54] to-[#F4929D] text-white shadow-xs border-transparent"
                      : "bg-[#FFFDF9] text-[#6E5345] border-[#F3DFD1] hover:bg-[#FFF4EC]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {attendance === "hadir" && (
            <div>
              <label className="block text-xs font-sans font-bold text-[#6E5345] mb-1.5">
                Jumlah Kehadiran (Pax)
              </label>
              <select
                value={attendeeCount}
                onChange={(e) => setAttendeeCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#F3DFD1] bg-[#FFFDF9] text-[#38241B] text-xs sm:text-sm focus:outline-none focus:border-[#DF7B54] focus:ring-2 focus:ring-[#DF7B54]/20"
              >
                {Array.from({ length: Math.max(1, maxQuota) }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} Orang
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans font-bold text-[#6E5345] mb-1.5">
              Untaian Doa Restu
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan doa tulus dan pesan manis Anda..."
              className="w-full px-4 py-2.5 rounded-2xl border border-[#F3DFD1] bg-[#FFFDF9] text-[#38241B] placeholder-[#8C6D58]/45 text-xs sm:text-sm focus:outline-none focus:border-[#DF7B54] focus:ring-2 focus:ring-[#DF7B54]/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#DF7B54] to-[#F4929D] hover:opacity-95 text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_8px_20px_rgba(223,123,84,0.3)] disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
            <span>{isSubmitting ? "Mengirim..." : "Kirim Konfirmasi &amp; Doa"}</span>
          </button>
          </form>
        </ItemMotion>

        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-[#F5E6DC]">
            <span className="text-xs font-sans uppercase tracking-wider text-[#DF7B54] font-bold">
              Koleksi Doa Restu
            </span>
            <span className="text-xs font-sans text-[#8C6D58] font-medium">
              {wishes.length} Pesan
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {wishes.map((item, idx) => (
              <ItemMotion
                key={item.id || idx}
                variant={idx % 2 === 0 ? "slide-right" : "slide-left"}
                delay={idx * 0.05}
                className="bg-white/95 backdrop-blur-md rounded-[24px] p-4 border-[2.5px] border-white ring-1 ring-[#F3DFD1] space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-sm text-[#38241B] block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#8C6D58] font-sans">
                      {item.relationship} • {item.date}
                    </span>
                  </div>
                  {item.attendance && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-[#FFF4EC] border border-[#FCD5CE] text-[#DF7B54]">
                      {item.attendance}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5C4A3E] leading-relaxed font-sans italic bg-[#FFF9F5] p-3 rounded-2xl border border-[#FCEADE]">
                  &ldquo;{item.message}&rdquo;
                </p>
              </ItemMotion>
            ))}
          </div>
        </div>
      </div>
    </SectionMotion>
  );
}

