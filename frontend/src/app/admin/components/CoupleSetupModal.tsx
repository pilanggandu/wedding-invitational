"use client";
import React, { useState, useEffect } from "react";
import { X, Heart, Check, Calendar, User } from "lucide-react";
import { WeddingInvitationData } from "@/types/wedding";
import { saveInvitationData } from "@/lib/invitationStore";

interface CoupleSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeddingInvitationData;
  onSave: (updated: WeddingInvitationData) => void;
}

export function CoupleSetupModal({
  isOpen,
  onClose,
  data,
  onSave,
}: CoupleSetupModalProps) {
  const [groomName, setGroomName] = useState("");
  const [groomFullName, setGroomFullName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [brideFullName, setBrideFullName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDay, setEventDay] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data?.couple) {
      setGroomName(data.couple.groom?.name || "");
      setGroomFullName(data.couple.groom?.fullName || "");
      setBrideName(data.couple.bride?.name || "");
      setBrideFullName(data.couple.bride?.fullName || "");
    }
    const mainEvent = data?.events?.[0];
    if (mainEvent) {
      setEventDate(mainEvent.displayDate || "21 November 2026");
      setEventDay(mainEvent.displayDay || "Sabtu");
    }
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomName.trim() || !brideName.trim()) return;

    setIsSaving(true);

    const cleanGroom = groomName.trim();
    const cleanBride = brideName.trim();

    const updatedEvents = data.events ? [...data.events] : [];
    if (updatedEvents.length > 0) {
      updatedEvents[0] = {
        ...updatedEvents[0],
        displayDate: eventDate.trim() || updatedEvents[0].displayDate,
        displayDay: eventDay.trim() || updatedEvents[0].displayDay,
      };
    }

    const updated: WeddingInvitationData = {
      ...data,
      couple: {
        ...data.couple,
        groom: {
          ...data.couple?.groom,
          name: cleanGroom,
          fullName: groomFullName.trim() || cleanGroom,
        },
        bride: {
          ...data.couple?.bride,
          name: cleanBride,
          fullName: brideFullName.trim() || cleanBride,
        },
      },
      events: updatedEvents,
      general: {
        ...data.general,
        hashtag: `#${cleanGroom.replace(/[^a-zA-Z0-9]/g, "")}${cleanBride.replace(/[^a-zA-Z0-9]/g, "")}Wedding`,
      },
    };

    saveInvitationData(updated);
    onSave(updated);

    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F1116]/80 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E7E7E1] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-[#0F1116] text-white flex items-center justify-between shrink-0 border-b border-[#232734]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14161C] border border-[#2D313E] flex items-center justify-center text-[#DFD2BD]">
              <Heart className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white tracking-tight">
                Persiapan: Identitas Pasangan Mempelai
              </h3>
              <p className="text-[11px] text-[#A0A4B0] font-sans mt-0.5">
                Langkah pertama sebelum menyesuaikan template &amp; membagikan undangan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#232734] text-[#888D9C] hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          <div className="bg-[#FAF9F7] border border-[#E8DEC8] rounded-xl p-3.5 text-xs text-[#6A5228] leading-relaxed">
            <p className="font-serif font-bold text-[#8C6218] flex items-center gap-1.5 mb-1 text-xs">
              Pentingnya Tahap Persiapan
            </p>
            Nama panggilan kedua mempelai akan otomatis dijadikan judul pada sampul undangan, pratinjau tipografi template, format pesan WhatsApp tamu, dan buku doa.
          </div>

          {/* Groom Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#717686] font-medium">
              <User className="w-3.5 h-3.5 text-[#14161C]" />
              <span>Mempelai Pria (Groom)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Nama Panggilan <span className="text-[#9A2D2D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="Contoh: Dimas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  value={groomFullName}
                  onChange={(e) => setGroomFullName(e.target.value)}
                  placeholder="Contoh: Dimas Pratama, S.T."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bride Section */}
          <div className="space-y-3 pt-3 border-t border-[#F0F0EA]">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#717686] font-medium">
              <User className="w-3.5 h-3.5 text-[#14161C]" />
              <span>Mempelai Wanita (Bride)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Nama Panggilan <span className="text-[#9A2D2D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="Contoh: Anisa"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  value={brideFullName}
                  onChange={(e) => setBrideFullName(e.target.value)}
                  placeholder="Contoh: Anisa Rahmawati, S.Farm."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Date Section */}
          <div className="space-y-3 pt-3 border-t border-[#F0F0EA]">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#717686] font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#14161C]" />
              <span>Hari &amp; Tanggal Utama Acara</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Hari
                </label>
                <input
                  type="text"
                  value={eventDay}
                  onChange={(e) => setEventDay(e.target.value)}
                  placeholder="Contoh: Sabtu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Tanggal Lengkap
                </label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="Contoh: 21 November 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#F0F0EA] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-semibold text-[#2C303B] hover:bg-[#F5F5F0] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#14161C] hover:bg-[#232734] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#DFD2BD]" />
              <span>{isSaving ? "Menyimpan..." : "Simpan &amp; Terapkan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
