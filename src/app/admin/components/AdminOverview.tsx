"use client";

import React, { useState } from "react";
import {
  Users,
  Send,
  CheckCircle,
  HelpCircle,
  XCircle,
  MessageSquareHeart,
  Palette,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";
import { AVAILABLE_TEMPLATES } from "@/data/templates";

interface AdminOverviewProps {
  data: WeddingInvitationData;
  guests: GuestItem[];
  wishes: WishMessage[];
  onNavigateTab: (tab: "templates" | "wedding-data" | "guests" | "wishes") => void;
  onOpenPreview: () => void;
}

export function AdminOverview({
  data,
  guests,
  wishes,
  onNavigateTab,
  onOpenPreview,
}: AdminOverviewProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const totalGuests = guests.length;
  const sentGuests = guests.filter((g) => g.isSent).length;
  const pendingGuests = totalGuests - sentGuests;

  const attendingCount = wishes.filter((w) => w.attendance.includes("Hadir")).length;
  const unsureCount = wishes.filter((w) => w.attendance.includes("mikir")).length;
  const unableCount = wishes.filter((w) => w.attendance.includes("belum")).length;

  const currentTemplate = AVAILABLE_TEMPLATES.find((t) => t.id === data.activeTemplateId) || AVAILABLE_TEMPLATES[0];

  const handleCopyPublicLink = () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#7D1128] via-[#8F1630] to-[#590C1C] rounded-3xl p-6 sm:p-8 text-white border-2 border-[#4A0812] shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFE58F] text-[#4A0812] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#7D1128]" />
            Control Center Undangan Digital
          </div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Selamat Datang di Panel Undangan {data.couple?.groom?.name || "Gilang"} & {data.couple?.bride?.name || "Salsadila"}
          </h1>
          <p className="text-white/80 text-sm mt-2 leading-relaxed">
            Kelola template, data acara, daftar tamu, kirim tautan personal lewat WhatsApp, dan pantau kehadiran RSVP secara terpusat dalam satu dashboard.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={onOpenPreview}
              className="px-4 py-2.5 rounded-xl bg-[#FFE58F] hover:bg-[#FFD966] text-[#4A0812] font-sans font-bold text-xs sm:text-sm flex items-center gap-2 transition-transform hover:scale-105 shadow-md cursor-pointer"
            >
              <span>📱 Live Preview Undangan</span>
            </button>
            <button
              onClick={handleCopyPublicLink}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#FFE58F]" />}
              <span>{copiedLink ? "Link Tersalin!" : "Salin Link Publik"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Tamu */}
        <div className="bg-white rounded-2xl p-5 border-2 border-[#7D1128]/20 shadow-xs hover:border-[#7D1128]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-[#7D1128] tracking-wider">
              Total Tamu
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FFF0F3] text-[#7D1128] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#4A0812]">{totalGuests}</div>
          <div className="mt-2 text-xs text-[#7D1128] flex items-center justify-between">
            <span>{sentGuests} terkirim</span>
            <span className="text-amber-700 font-medium">{pendingGuests} antrean</span>
          </div>
        </div>

        {/* Konfirmasi Hadir */}
        <div className="bg-white rounded-2xl p-5 border-2 border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-emerald-800 tracking-wider">
              Konfirmasi Hadir
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-950">{attendingCount}</div>
          <p className="mt-2 text-xs text-emerald-800">
            Tamu telah menyatakan pasti hadir
          </p>
        </div>

        {/* Masih Ragu / Belum Bisa */}
        <div className="bg-white rounded-2xl p-5 border-2 border-amber-100 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-amber-800 tracking-wider">
              Ragu / Berhalangan
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-950">
            {unsureCount + unableCount}
          </div>
          <p className="mt-2 text-xs text-amber-800">
            {unsureCount} ragu-ragu • {unableCount} berhalangan
          </p>
        </div>

        {/* Total Doa Restu */}
        <div className="bg-white rounded-2xl p-5 border-2 border-rose-100 shadow-xs hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-rose-800 tracking-wider">
              Doa & Ucapan
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-950">{wishes.length}</div>
          <p className="mt-2 text-xs text-rose-800">
            Ucapan terkirim melalui buku tamu
          </p>
        </div>
      </div>

      {/* Middle Row: Active Template Spotlight & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Aktif Card */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#7D1128]/20 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase text-[#7D1128] tracking-wider">
                Template Aktif
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FFF0F3] text-[#7D1128] border border-[#7D1128]/30">
                {currentTemplate.category}
              </span>
            </div>

            <div className={`h-24 rounded-xl bg-gradient-to-r ${currentTemplate.previewGradient} flex items-center justify-center text-white font-bold p-3 text-center shadow-inner mb-4`}>
              <span className="drop-shadow-md text-sm">{currentTemplate.name}</span>
            </div>

            <h3 className="font-sans font-bold text-lg text-[#4A0812]">
              {currentTemplate.name}
            </h3>
            <p className="text-xs text-[#7D1128] mt-1 line-clamp-2">
              {currentTemplate.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#7D1128]/10 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab("templates")}
              className="text-xs font-mono font-bold text-[#7D1128] hover:text-[#4A0812] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ganti Template / Warna</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card: Kelola Tamu */}
          <div
            onClick={() => onNavigateTab("guests")}
            className="group bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-[#7D1128] transition-all cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#7D1128] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-base text-[#4A0812]">
                Daftar Tamu & WhatsApp
              </h4>
              <p className="text-xs text-[#7D1128] mt-1 leading-relaxed">
                Tambah nama tamu, kelola daftar penerima, dan kirim undangan personal dengan 1 klik via WhatsApp resmi.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-mono font-bold text-[#7D1128] group-hover:translate-x-1 transition-transform">
              <span>Buka Manajemen Tamu</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card: Edit Mempelai & Acara */}
          <div
            onClick={() => onNavigateTab("wedding-data")}
            className="group bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-[#7D1128] transition-all cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-base text-[#4A0812]">
                Data Mempelai & Acara
              </h4>
              <p className="text-xs text-[#7D1128] mt-1 leading-relaxed">
                Perbarui nama calon pengantin, orang tua, jadwal akad & resepsi, alamat maps gedung, dan rekening amplop digital.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-mono font-bold text-[#7D1128] group-hover:translate-x-1 transition-transform">
              <span>Edit Data Pernikahan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card: Moderasi RSVP */}
          <div
            onClick={() => onNavigateTab("wishes")}
            className="group bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-[#7D1128] transition-all cursor-pointer shadow-xs flex flex-col justify-between sm:col-span-2"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-base text-[#4A0812]">
                Buku Tamu & Moderasi RSVP
              </h4>
              <p className="text-xs text-[#7D1128] mt-1 leading-relaxed">
                Pantau seluruh doa dan konfirmasi kehadiran yang dikirimkan tamu. Anda dapat menghapus pesan yang tidak sesuai.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-mono font-bold text-[#7D1128] group-hover:translate-x-1 transition-transform">
              <span>Buka Moderasi Ucapan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Wishes Feed */}
      <div className="bg-white rounded-2xl p-6 border-2 border-[#7D1128]/20 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-sans font-bold text-lg text-[#4A0812]">
              Doa & Ucapan Terbaru
            </h3>
            <p className="text-xs text-[#7D1128]">
              Ucapan yang baru saja masuk dari para undangan
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("wishes")}
            className="text-xs font-mono font-bold text-[#7D1128] hover:text-[#4A0812] cursor-pointer"
          >
            Lihat Semua ({wishes.length})
          </button>
        </div>

        {wishes.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Belum ada ucapan masuk.
          </div>
        ) : (
          <div className="space-y-3">
            {wishes.slice(0, 4).map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-xl bg-[#FFF9FA] border border-[#7D1128]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-sm text-[#4A0812]">
                      {w.name}
                    </span>
                    <span className="text-[11px] font-mono text-[#7D1128]/70">
                      ({w.relationship})
                    </span>
                  </div>
                  <p className="text-xs text-[#4A0812] mt-1 font-sans italic">
                    &ldquo;{w.message}&rdquo;
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                      w.attendance.includes("Hadir")
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : w.attendance.includes("belum")
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {w.attendance}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {w.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
