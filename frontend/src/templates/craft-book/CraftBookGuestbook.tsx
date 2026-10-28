"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { Check, Heart, MessageSquare, Send, UserCheck } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { submitRsvpApi } from "@/lib/api";
import { triggerKeepsakeCelebration } from "../paper-keepsake/keepsakeCelebration";
import type { WishMessage } from "@/types/wedding";
import type { TemplateProps } from "../types";

const NOTE_COLORS = [
  "note-yellow",
  "note-sage",
  "note-terracotta",
  "note-kraft",
];

const TILTS = ["tilt-left", "tilt-right", "tilt-1", "tilt-2"];

export function CraftBookGuestbook({
  guestName: initialGuestName,
  guestItem,
  isPreview = false,
  isEditor = false,
}: Pick<TemplateProps, "guestName" | "guestItem" | "isPreview" | "isEditor">) {
  const data = useWeddingData();
  const [name, setName] = useState(initialGuestName || guestItem?.name || "");
  const [attendance, setAttendance] = useState<"attending" | "declined">("attending");
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error" | "notice";
    text: string;
  } | null>(null);

  const [wishes, setWishes] = useState<WishMessage[]>([]);

  useEffect(() => {
    setWishes(getWishes());
    const handleWishesChange = () => setWishes(getWishes());
    window.addEventListener("wedding-wishes-changed", handleWishesChange);
    return () => window.removeEventListener("wedding-wishes-changed", handleWishesChange);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ tone: "error", text: "Mohon cantumkan nama Anda." });
      return;
    }
    if (!message.trim()) {
      setFeedback({ tone: "error", text: "Mohon tuliskan pesan doa atau ucapan Anda." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (isPreview || isEditor) {
        submitWish({
          name: name.trim(),
          relationship: "Tamu Undangan",
          attendance: attendance === "attending" ? "Hadir" : "Berhalangan Hadir",
          message: message.trim(),
        });
        setFeedback({
          tone: "success",
          text: "Mode preview: Ucapan berhasil ditempelkan di papan doa!",
        });
        setMessage("");
        triggerKeepsakeCelebration();
        return;
      }

      // Submit RSVP
      if (guestItem?.id) {
        await submitRsvpApi({
          guestId: guestItem.id,
          status: attendance === "attending" ? 1 : 2,
          attendeeCount: attendance === "attending" ? attendeeCount : 0,
          message: message.trim(),
        });
      }

      // Submit Wish
      submitWish({
        name: name.trim(),
        relationship: "Tamu Undangan",
        attendance: attendance === "attending" ? "Hadir" : "Berhalangan Hadir",
        message: message.trim(),
        guestId: guestItem?.id,
      });

      setFeedback({
        tone: "success",
        text: "Terima kasih banyak! Konfirmasi dan doa Anda berhasil ditempel di papan kenangan.",
      });
      setMessage("");
      triggerKeepsakeCelebration();
    } catch (err) {
      setFeedback({
        tone: "error",
        text: err instanceof Error ? err.message : "Gagal mengirimkan pesan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cb-guestbook-section">
      <div className="cb-page-header">
        <div className="cb-washi-strip tape-mustard">KONFIRMASI &amp; DOA RESTU</div>
        <h2 className="cb-page-title">Papan Doa Tempel</h2>
        <p className="cb-page-subtitle">
          Tinggalkan doa restu dan konfirmasi kehadiran untuk melengkapi lembaran kisah kami.
        </p>
      </div>

      {/* RSVP FORM */}
      <div className="cb-rsvp-card">
        <div className="flex items-center gap-2 mb-4 text-[#c26d53] font-mono font-bold text-xs uppercase tracking-wider">
          <UserCheck size={16} />
          <span>Formulir Kehadiran &amp; Memo Doa:</span>
        </div>

        {feedback && (
          <div
            className={`p-3.5 mb-4 rounded text-xs font-semibold ${
              feedback.tone === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="cb-form-group">
            <label htmlFor="cb-guest-name">Nama Tamu Undangan</label>
            <input
              id="cb-guest-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sarah &amp; Pasangan"
              className="cb-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="cb-form-group">
              <label htmlFor="cb-attendance">Konfirmasi Kehadiran</label>
              <select
                id="cb-attendance"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value as "attending" | "declined")}
                className="cb-select"
              >
                <option value="attending">Insya Allah Hadir</option>
                <option value="declined">Mohon Maaf Berhalangan</option>
              </select>
            </div>

            {attendance === "attending" && (
              <div className="cb-form-group">
                <label htmlFor="cb-attendee-count">Jumlah Tamu Hadir</label>
                <select
                  id="cb-attendee-count"
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(Number(e.target.value))}
                  className="cb-select"
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                </select>
              </div>
            )}
          </div>

          <div className="cb-form-group">
            <label htmlFor="cb-wish-msg">Pesan Doa Restu (Ditempel di Sticky Note)</label>
            <textarea
              id="cb-wish-msg"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan hangat dan doa Anda di sini..."
              className="cb-textarea"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cb-submit-btn"
          >
            <Send size={16} />
            {isSubmitting ? "Menempelkan Memo..." : "Kirim Doa Restu &amp; Tempel di Album"}
          </button>
        </form>
      </div>

      {/* STICKY NOTES BOARD */}
      <div className="mt-10">
        <div className="text-center mb-6">
          <div className="cb-washi-strip tape-olive">MEMO TERSIMPAN</div>
          <h3 className="font-serif text-2xl text-[#2b231f]">
            {wishes.length} Doa Hangat dari Sahabat &amp; Kerabat
          </h3>
        </div>

        <div className="cb-wishes-board">
          {wishes.length > 0 ? (
            wishes.map((w, index) => {
              const colorClass = NOTE_COLORS[index % NOTE_COLORS.length];
              const tiltClass = TILTS[index % TILTS.length];
              return (
                <div key={w.id || index} className={`cb-wish-memo ${colorClass} ${tiltClass}`}>
                  <span className="cb-sticky-pin" aria-hidden="true">📌</span>
                  <div className="cb-wish-author">{w.name}</div>
                  <div className="text-[10px] font-mono text-[#c26d53] mb-2 font-bold uppercase">
                    {w.attendance || "Tamu Undangan"}
                  </div>
                  <p className="cb-wish-text">"{w.message}"</p>
                  <span className="cb-wish-date">{w.date || "Hari Bahagia"}</span>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 bg-[#fdfaf6] border border-dashed border-[#caa98c] rounded">
              <p className="text-sm text-[#6e5e54]">
                Belum ada ucapan tertempel. Jadilah yang pertama memberikan doa restu!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
