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
  LayoutDashboard,
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Control Center Undangan Digital
          </div>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Selamat Datang di Panel Undangan {data.couple?.groom?.name || "Gilang"} & {data.couple?.bride?.name || "Salsadila"}
          </h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Kelola template, data acara, daftar tamu, kirim tautan personal lewat WhatsApp, dan pantau kehadiran RSVP secara terpusat dalam satu dashboard.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={onOpenPreview}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Preview Undangan</span>
            </button>
            <button
              onClick={handleCopyPublicLink}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedLink ? "Link Tersalin!" : "Salin Link Publik"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Tamu */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Total Tamu
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalGuests}</div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{sentGuests} terkirim</span>
            <span className="text-amber-600 font-medium">{pendingGuests} antrean</span>
          </div>
        </div>

        {/* Konfirmasi Hadir */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Konfirmasi Hadir
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{attendingCount}</div>
          <p className="mt-2 text-xs text-emerald-600 font-medium">
            Tamu telah menyatakan pasti hadir
          </p>
        </div>

        {/* Masih Ragu / Belum Bisa */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Ragu / Berhalangan
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {unsureCount + unableCount}
          </div>
          <p className="mt-2 text-xs text-amber-600 font-medium">
            {unsureCount} ragu-ragu • {unableCount} berhalangan
          </p>
        </div>

        {/* Total Doa Restu */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Doa & Ucapan
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{wishes.length}</div>
          <p className="mt-2 text-xs text-purple-600 font-medium">
            Ucapan terkirim melalui buku tamu
          </p>
        </div>
      </div>

      {/* Middle Row: Active Template Spotlight & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Aktif Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                Template Aktif
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {currentTemplate.category}
              </span>
            </div>

            <div className={`h-24 rounded-xl bg-gradient-to-r ${currentTemplate.previewGradient} flex items-center justify-center text-white font-bold p-3 text-center shadow-inner mb-4`}>
              <span className="drop-shadow-md text-sm">{currentTemplate.name}</span>
            </div>

            <h3 className="font-sans font-bold text-lg text-slate-900">
              {currentTemplate.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {currentTemplate.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab("templates")}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
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
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-500 transition-all cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-base text-slate-900">
                Daftar Tamu & WhatsApp
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tambah nama tamu, kelola daftar penerima, dan kirim undangan personal dengan 1 klik via WhatsApp resmi.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Buka Manajemen Tamu</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card: Edit Mempelai & Acara */}
          <div
            onClick={() => onNavigateTab("wedding-data")}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-amber-500 transition-all cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-base text-slate-900">
                Data Mempelai & Acara
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Perbarui nama calon pengantin, orang tua, jadwal akad & resepsi, alamat maps gedung, dan rekening amplop digital.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>Edit Data Pernikahan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card: Moderasi RSVP */}
          <div
            onClick={() => onNavigateTab("wishes")}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-purple-500 transition-all cursor-pointer shadow-xs flex flex-col justify-between sm:col-span-2"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-base text-slate-900">
                Buku Tamu & Moderasi RSVP
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pantau seluruh doa dan konfirmasi kehadiran yang dikirimkan tamu. Anda dapat menghapus pesan yang tidak sesuai.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Buka Moderasi Ucapan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Wishes Feed */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-sans font-bold text-base text-slate-900">
              Doa & Ucapan Terbaru
            </h3>
            <p className="text-xs text-slate-500">
              Ucapan yang baru saja masuk dari para undangan
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("wishes")}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
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
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-sm text-slate-900">
                      {w.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({w.relationship})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-sans italic">
                    &ldquo;{w.message}&rdquo;
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      w.attendance.includes("Hadir")
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : w.attendance.includes("belum")
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {w.attendance}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
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
