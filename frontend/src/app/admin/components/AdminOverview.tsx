"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  HelpCircle,
  MessageSquareHeart,
  Palette,
  Copy,
  Check,
  Smartphone,
  ArrowRight,
  MessageCircle,
  Calendar,
  Sparkles,
  Heart,
  Utensils,
  Share2,
  Send,
  Eye,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  Camera,
  QrCode,
} from "lucide-react";
import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";
import { AVAILABLE_TEMPLATES } from "@/data/templates";
import { generateWhatsAppInvitationUrl } from "@/lib/invitationStore";
import { fetchRsvpsApi } from "@/lib/api";

interface AdminOverviewProps {
  data: WeddingInvitationData;
  guests: GuestItem[];
  wishes: WishMessage[];
  onNavigateTab: (tab: "templates" | "wedding-data" | "guests" | "wishes") => void;
  onOpenPreview: () => void;
  onOpenCoupleModal?: () => void;
  onOpenA3Poster?: () => void;
}

export function AdminOverview({
  data,
  guests,
  wishes,
  onNavigateTab,
  onOpenPreview,
  onOpenCoupleModal,
  onOpenA3Poster,
}: AdminOverviewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);
  const [rsvpSummary, setRsvpSummary] = useState<{
    totalGuests: number;
    attending: number;
    notAttending: number;
    estimatedHeads: number;
  } | null>(null);

  useEffect(() => {
    fetchRsvpsApi().then((res) => {
      if (res && res.summary) {
        setRsvpSummary(res.summary);
      }
    });
  }, [guests, wishes]);

  const totalGuests = guests.length;
  const sentGuests = guests.filter((g) => g.isSent).length;
  const openedGuests = guests.filter((g) => (g.openCount || 0) > 0).length;
  const pendingSendGuests = guests.filter((g) => !g.isSent);

  const attendingCount =
    rsvpSummary?.attending ??
    wishes.filter((w) => w.attendance.includes("Hadir")).length;
  const unsureCount = wishes.filter((w) => w.attendance.includes("mikir")).length;
  const unableCount =
    rsvpSummary?.notAttending ??
    wishes.filter((w) => w.attendance.includes("belum")).length;
  const unansweredCount = Math.max(
    0,
    totalGuests - (attendingCount + unsureCount + unableCount)
  );
  const estimatedHeads = rsvpSummary?.estimatedHeads || attendingCount;

  const currentTemplate =
    AVAILABLE_TEMPLATES.find((t) => t.id === data.activeTemplateId) ||
    AVAILABLE_TEMPLATES[0];

  const groomName = data.couple?.groom?.name?.trim() || "";
  const brideName = data.couple?.bride?.name?.trim() || "";
  const hasCoupleNames = Boolean(groomName && brideName);
  const mainEvent = data.events?.[0];
  const eventDateStr = mainEvent?.displayDate
    ? `${mainEvent.displayDay || "Sabtu"}, ${mainEvent.displayDate}`
    : "28 November 2026";

  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/undangan` : "";

  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyGuestLink = (guest: GuestItem) => {
    const personalUrl = guest.token
      ? `${publicUrl}?u=${guest.token}`
      : `${publicUrl}?to=${encodeURIComponent(guest.name).replace(/%20/g, "+")}`;
    navigator.clipboard.writeText(personalUrl);
    setCopiedGuestId(guest.id);
    setTimeout(() => setCopiedGuestId(null), 2000);
  };

  const handleSendWhatsApp = (guest: GuestItem) => {
    const targetUrl = guest.token
      ? `${publicUrl}?u=${guest.token}`
      : publicUrl;
    const waUrl = generateWhatsAppInvitationUrl(
      guest.phone || "",
      guest.name,
      groomName || "Mempelai Pria",
      brideName || "Mempelai Wanita",
      targetUrl,
      eventDateStr
    );
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const responsePercentage =
    totalGuests > 0 ? Math.round((wishes.length / totalGuests) * 100) : 0;
  const sentPercentage =
    totalGuests > 0 ? Math.round((sentGuests / totalGuests) * 100) : 0;
  const openedPercentage =
    totalGuests > 0 ? Math.round((openedGuests / totalGuests) * 100) : 0;
  const attendPercentage =
    totalGuests > 0 ? Math.round((attendingCount / totalGuests) * 100) : 0;
  const unsurePercentage =
    totalGuests > 0 ? Math.round((unsureCount / totalGuests) * 100) : 0;
  const unablePercentage =
    totalGuests > 0 ? Math.round((unableCount / totalGuests) * 100) : 0;
  const unansweredPercentage = Math.max(
    0,
    100 - (attendPercentage + unsurePercentage + unablePercentage)
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Bergaya MyFin Dashboard */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Dasbor Manajemen Aktif
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono text-slate-500 font-medium">
              Tema: {currentTemplate.name}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Ringkasan Undangan Digital
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans">
            {hasCoupleNames
              ? `Pernikahan bahagia ${groomName} & ${brideName} • ${eventDateStr}`
              : "Nama kedua mempelai belum ditentukan • Silakan lengkapi data mempelai"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-600 font-mono max-w-xs truncate shadow-2xs">
            <span className="truncate">{publicUrl || "http://localhost:3000/undangan"}</span>
          </div>

          <button
            onClick={handleCopyPublicLink}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            title="Salin tautan web undangan"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-300" />
            )}
            <span>{copiedLink ? "Tersalin" : "Salin Link"}</span>
          </button>

          <button
            onClick={onOpenPreview}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            <span>Pratinjau HP</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Kartu Metrik KPI Finansial / MyFin Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tamu Undangan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Total Tamu Terdaftar
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {totalGuests}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              <span className="text-emerald-700 font-semibold">{sentGuests} terkirim</span>
              <span>•</span>
              <span>{openedGuests} telah buka</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
              <span>Progres Pengiriman WA</span>
              <span className="font-mono text-slate-700 font-bold">{sentPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${sentPercentage}%` }}
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Konfirmasi Pasti Hadir */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Konfirmasi Pasti Hadir
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-700 tracking-tight font-mono">
              {attendingCount}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1">
              <Utensils className="w-3.5 h-3.5 text-emerald-600" />
              <span>Est. {estimatedHeads} Porsi Katering</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
              <span>Rasio Kehadiran</span>
              <span className="font-mono text-emerald-700 font-bold">{attendPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${attendPercentage}%` }}
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Ragu / Berhalangan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Ragu &amp; Berhalangan
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-800 tracking-tight font-mono">
              {unsureCount + unableCount}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              <span>{unsureCount} ragu</span>
              <span>•</span>
              <span>{unableCount} izin</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
              <span>Menunggu Respon</span>
              <span className="font-mono text-slate-700 font-bold">{unansweredCount} Tamu</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${unsurePercentage + unablePercentage}%` }}
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Buku Tamu & Doa Restu */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Doa Restu Digital
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {wishes.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {responsePercentage}% respon dari total undangan
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
              <span>Tingkat Interaksi</span>
              <span className="font-mono text-purple-700 font-bold">{responsePercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${responsePercentage}%` }}
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Analisis Finansial: Distribusi Kehadiran & Funnel Pengiriman (MyFin Analytics Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri (2 Span): Visual Segmented Bar Kehadiran */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Distribusi Konfirmasi Kehadiran Tamu
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  Real-time
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pemetaan respon RSVP terhadap kapasitas katering dan meja resepsi
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("wishes")}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Buka Rekap RSVP</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Segmented Progress Bar */}
          <div className="space-y-2.5">
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 gap-0.5">
              <div
                style={{
                  width: `${totalGuests > 0 ? (attendingCount / totalGuests) * 100 : 0}%`,
                }}
                className="bg-emerald-600 h-full rounded-l-full transition-all duration-500"
                title={`Pasti Hadir: ${attendingCount}`}
              />
              <div
                style={{
                  width: `${totalGuests > 0 ? (unsureCount / totalGuests) * 100 : 0}%`,
                }}
                className="bg-amber-400 h-full transition-all duration-500"
                title={`Masih Ragu: ${unsureCount}`}
              />
              <div
                style={{
                  width: `${totalGuests > 0 ? (unableCount / totalGuests) * 100 : 0}%`,
                }}
                className="bg-rose-400 h-full transition-all duration-500"
                title={`Berhalangan: ${unableCount}`}
              />
              <div
                style={{
                  width: `${totalGuests > 0 ? (unansweredCount / totalGuests) * 100 : 100}%`,
                }}
                className="bg-slate-200 h-full rounded-r-full transition-all duration-500"
                title={`Belum Merespon: ${unansweredCount}`}
              />
            </div>

            {/* Metric Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-[11px] font-medium text-slate-600">Pasti Hadir</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {attendingCount}{" "}
                  <span className="text-[11px] font-normal text-slate-500">
                    ({attendPercentage}%)
                  </span>
                </div>
                <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                  Est. {estimatedHeads} Porsi
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-[11px] font-medium text-slate-600">Masih Ragu</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {unsureCount}{" "}
                  <span className="text-[11px] font-normal text-slate-500">
                    ({unsurePercentage}%)
                  </span>
                </div>
                <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                  Perlu Konfirmasi
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="text-[11px] font-medium text-slate-600">Berhalangan</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {unableCount}{" "}
                  <span className="text-[11px] font-normal text-slate-500">
                    ({unablePercentage}%)
                  </span>
                </div>
                <div className="text-[10px] text-rose-700 font-medium mt-0.5">
                  Izin Tidak Hadir
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-[11px] font-medium text-slate-600">Belum Respon</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {unansweredCount}{" "}
                  <span className="text-[11px] font-normal text-slate-500">
                    ({unansweredPercentage}%)
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Menunggu Balasan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (1 Span): Delivery Funnel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Corong Penyaluran
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {sentGuests}/{totalGuests}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    Terkirim via WhatsApp
                  </span>
                  <span className="font-mono font-bold text-slate-900">{sentPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${sentPercentage}%` }}
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    Telah Dibuka Tamu
                  </span>
                  <span className="font-mono font-bold text-slate-900">{openedPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${openedPercentage}%` }}
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Konfirmasi Kehadiran
                  </span>
                  <span className="font-mono font-bold text-slate-900">{responsePercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${responsePercentage}%` }}
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab("guests")}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Kelola Daftar Tamu</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Feeds: Antrean Kirim WhatsApp & Aktivitas Doa Restu (MyFin Transaction Feeds) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antrean WhatsApp */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Antrean Kirim WhatsApp
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {pendingSendGuests.length} tamu belum dikirimi tautan personal
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("guests")}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Lihat Semua ({totalGuests})</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {pendingSendGuests.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-slate-900">Semua Undangan Terkirim</p>
                <p className="text-slate-400 mt-1 max-w-xs mx-auto">
                  Seluruh tamu dalam daftar telah menerima tautan undangan via WhatsApp.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {pendingSendGuests.slice(0, 4).map((guest) => {
                  const isCopied = copiedGuestId === guest.id;
                  const initial = guest.name.trim().charAt(0).toUpperCase() || "T";
                  return (
                    <div
                      key={guest.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">
                            {guest.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
                              {guest.category}
                            </span>
                            <span className="font-mono text-slate-400">
                              {guest.phone ? guest.phone : "Tanpa WhatsApp"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyGuestLink(guest)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-medium transition-colors cursor-pointer"
                          title="Salin tautan personal tamu"
                        >
                          {isCopied ? "Tersalin" : "Link"}
                        </button>
                        <button
                          onClick={() => handleSendWhatsApp(guest)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                          title="Kirim pesan personal WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Kirim</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-sans">
            Klik tombol Kirim untuk otomatis membuka template chat WhatsApp resmi.
          </div>
        </div>

        {/* Doa Restu Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Doa Restu &amp; Buku Tamu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pesan kebahagiaan terbaru yang dikirimkan para sahabat dan keluarga
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("wishes")}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Semua ({wishes.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {wishes.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <MessageSquareHeart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-800">Belum Ada Ucapan Masuk</p>
                <p className="text-slate-400 mt-0.5">
                  Doa dan ucapan tamu akan otomatis tampil di sini saat mereka mengisi RSVP.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mt-3">
                {wishes.slice(0, 3).map((w) => {
                  const isAttend = w.attendance.includes("Hadir");
                  const isUnsure = w.attendance.includes("mikir");
                  return (
                    <div
                      key={w.id}
                      className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                          <span>{w.name}</span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            ({w.relationship})
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium shrink-0 ${
                            isAttend
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                              : isUnsure
                              ? "bg-amber-50 text-amber-800 border border-amber-200/80"
                              : "bg-slate-100 text-slate-700 border border-slate-200/80"
                          }`}
                        >
                          {w.attendance}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1.5 italic line-clamp-2 leading-relaxed">
                        &quot;{w.message}&quot;
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-sans">
            Menampilkan 3 doa restu paling baru dari tamu yang telah mengisi form online.
          </div>
        </div>
      </div>

      {/* 5. Alur Persiapan Menuju Publikasi (MyFin Milestone Workflow Cards) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Alur Kerja &amp; Panduan Publikasi
              </h3>
              <p className="text-xs text-slate-500">
                Langkah bertahap untuk memastikan visual, data mempelai, dan daftar tamu siap disebarkan
              </p>
            </div>
          </div>
          <span
            className={`text-[11px] font-mono px-3 py-1 rounded-full font-medium self-start sm:self-auto ${
              hasCoupleNames
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                : "bg-amber-50 text-amber-800 border border-amber-200/80"
            }`}
          >
            {hasCoupleNames ? "Langkah 1 Selesai" : "Langkah 1 Perlu Diisi"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Step 1 */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              hasCoupleNames
                ? "bg-emerald-50/30 border-emerald-200/80"
                : "bg-amber-50/30 border-amber-200/80"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                  01 / UTAMA
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    hasCoupleNames
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {hasCoupleNames ? "Selesai" : "Wajib"}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                Data Mempelai
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
                {hasCoupleNames
                  ? `${groomName} & ${brideName}`
                  : "Isi nama kedua mempelai dan orang tua untuk personalisasi undangan."}
              </p>
            </div>
            <button
              onClick={() => {
                if (onOpenCoupleModal) {
                  onOpenCoupleModal();
                } else {
                  onNavigateTab("wedding-data");
                }
              }}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasCoupleNames
                  ? "bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                  : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-amber-300" />
              <span>{hasCoupleNames ? "Ubah Nama Pasangan" : "Input Nama Pasangan"}</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                  02 / VISUAL
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Tema
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                Template &amp; Desain
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
                Desain Aktif: <strong className="text-slate-900">{currentTemplate.name}</strong>
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("templates")}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span>Pilih Desain</span>
            </button>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                  03 / JADWAL
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Lokasi
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                Waktu &amp; Lokasi Acara
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-4 truncate">
                {eventDateStr}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("wedding-data")}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Atur Jadwal &amp; Lokasi</span>
            </button>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                  04 / DISPATCH
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Tamu
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                Daftar Tamu &amp; WhatsApp
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
                {totalGuests} terdaftar • {sentGuests} terkirim
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("guests")}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Kirim Undangan WA</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Bilik Foto (Photobox) & Poster Standee Venue */}
      <div className="bg-gradient-to-r from-[#FAF6EE] to-[#FFFDF9] rounded-2xl border border-[#E8DFC8] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4A121A] text-[#DFD2BD] flex items-center justify-center shrink-0 shadow-xs">
            <Camera className="w-6 h-6 text-[#DFD2BD]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-serif font-bold text-base text-[#4A121A] tracking-tight">
                Bilik Foto Tamu (Photobox Studio)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#4A121A]/10 text-[#4A121A]">
                Passcode: {data.general?.photoboxPasscode || "2026"}
              </span>
            </div>
            <p className="text-xs text-[#786551] max-w-xl leading-relaxed">
              Tamu dapat mengambil foto seru ala photobox Korea di venue. Passcode diatur dari panel pengelola dan otomatis dicetak pada poster standee A3.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => onNavigateTab("wedding-data")}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] border border-[#E8DFC8] text-xs font-semibold text-[#786551] hover:text-[#4A121A] transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Ubah Passcode
          </button>
          {onOpenA3Poster && (
            <button
              type="button"
              onClick={onOpenA3Poster}
              className="px-4 py-2 rounded-xl bg-[#4A121A] hover:bg-[#5C1D24] text-[#DFD2BD] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Cetak Poster QR Code Standee (A3, A4, A5, A6, F4)"
            >
              <QrCode className="w-3.5 h-3.5 text-[#DFD2BD]" />
              <span>Cetak Poster QR Standee</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
