"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  HelpCircle,
  MessageSquareHeart,
  Palette,
  Copy,
  Check,
  Smartphone,
  ArrowRight,
  MessageCircle,
  HeartHandshake,
  Calendar,
  Sparkles,
  Heart,
} from "lucide-react";
import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";
import { AVAILABLE_TEMPLATES } from "@/data/templates";
import {
  generateWhatsAppInvitationUrl,
} from "@/lib/invitationStore";
import { fetchRsvpsApi } from "@/lib/api";

interface AdminOverviewProps {
  data: WeddingInvitationData;
  guests: GuestItem[];
  wishes: WishMessage[];
  onNavigateTab: (tab: "templates" | "wedding-data" | "guests" | "wishes") => void;
  onOpenPreview: () => void;
  onOpenCoupleModal?: () => void;
}

export function AdminOverview({
  data,
  guests,
  wishes,
  onNavigateTab,
  onOpenPreview,
  onOpenCoupleModal,
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
              RINGKASAN UTAMA
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[11px] font-mono text-slate-500 font-medium">
              Desain Aktif: {currentTemplate.name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Ikhtisar Undangan Pernikahan
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            {hasCoupleNames
              ? `Pernikahan ${groomName} & ${brideName} • ${eventDateStr}`
              : "Nama kedua mempelai belum ditentukan • Silakan isi nama mempelai"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono max-w-xs truncate">
            <span className="truncate">{publicUrl || "http://localhost:3000"}</span>
          </div>

          <button
            onClick={handleCopyPublicLink}
            className="px-3.5 py-2 rounded-lg bg-[#1C2434] hover:bg-[#24303F] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            title="Salin tautan web undangan"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Tersalin" : "Salin Link"}</span>
          </button>

          <button
            onClick={onOpenPreview}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            <span>Pratinjau HP</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">
              Total Undangan
            </span>
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {totalGuests}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-700 font-semibold">{sentGuests} terkirim</span>
              <span>•</span>
              <span>{openedGuests} telah buka</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">
              Pasti Hadir
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-800 tracking-tight font-mono">
              {attendingCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Est. {estimatedHeads} Porsi Katering
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">
              Ragu / Izin
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-800 tracking-tight font-mono">
              {unsureCount + unableCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {unsureCount} ragu • {unableCount} berhalangan
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">
              Doa Restu
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {wishes.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Tercatat di buku tamu digital
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1C2434] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0">
              <Sparkles className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Tahap Persiapan Menuju Publikasi
              </h3>
              <p className="text-xs text-slate-500">
                Alur bertahap untuk memastikan isi dan visual undangan siap sebelum dibagikan
              </p>
            </div>
          </div>
          <span
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md font-medium self-start sm:self-auto ${
              hasCoupleNames
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {hasCoupleNames ? "Langkah 1 Selesai" : "Langkah 1 Perlu Diisi"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              hasCoupleNames
                ? "bg-emerald-50/40 border-emerald-200"
                : "bg-amber-50/40 border-amber-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                  01 / UTAMA
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                    hasCoupleNames
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {hasCoupleNames ? "Siap" : "Wajib Diisi"}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                Data Pasangan Mempelai
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
                {hasCoupleNames
                  ? `${groomName} & ${brideName}`
                  : "Nama kedua mempelai belum ditentukan. Masukkan nama agar undangan terpersonalisasi."}
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
                  ? "bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                  : "bg-[#1C2434] hover:bg-[#24303F] text-white shadow-xs"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#DFD2BD]" />
              <span>{hasCoupleNames ? "Ubah Nama Pasangan" : "Input Nama Pasangan"}</span>
            </button>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                  02 / VISUAL
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Tema
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                Template &amp; Visual
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
                Desain Aktif: <strong className="text-slate-900">{currentTemplate.name}</strong>
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("templates")}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span>Pilih &amp; Edit Desain</span>
            </button>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                  03 / JADWAL
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
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
              className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Atur Lokasi &amp; Waktu</span>
            </button>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                  04 / DISPATCH
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
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
              className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Kelola Tamu &amp; WA</span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Progres Konfirmasi Kehadiran &amp; Katering
            </h3>
            <p className="text-xs text-slate-500">
              Total {totalGuests} undangan terdaftar • {responsePercentage}% telah mengisi konfirmasi kehadiran
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("wishes")}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 self-start sm:self-auto cursor-pointer transition-colors"
          >
            <span>Buku Tamu Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{
                width: `${totalGuests > 0 ? (attendingCount / totalGuests) * 100 : 0}%`,
              }}
              className="bg-emerald-600 h-full transition-all"
              title={`Hadir: ${attendingCount}`}
            />
            <div
              style={{
                width: `${totalGuests > 0 ? (unsureCount / totalGuests) * 100 : 0}%`,
              }}
              className="bg-amber-500 h-full transition-all"
              title={`Masih Ragu: ${unsureCount}`}
            />
            <div
              style={{
                width: `${totalGuests > 0 ? (unableCount / totalGuests) * 100 : 0}%`,
              }}
              className="bg-slate-400 h-full transition-all"
              title={`Berhalangan: ${unableCount}`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Pasti Hadir: <strong className="text-slate-900 font-semibold">{attendingCount} orang</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Masih Ragu: <strong className="text-slate-900 font-semibold">{unsureCount} orang</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              Berhalangan: <strong className="text-slate-900 font-semibold">{unableCount} orang</strong>
            </span>
            <span className="text-slate-400 font-mono">
              Belum Merespon: {unansweredCount} orang
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Antrean Kirim WhatsApp
                </h3>
                <p className="text-xs text-slate-500">
                  {pendingSendGuests.length} tamu belum dikirimi pesan personal
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("guests")}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Semua Tamu ({totalGuests})</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {pendingSendGuests.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-600 mb-2 opacity-90" />
                <p className="font-semibold text-slate-900">Semua undangan sudah terkirim</p>
                <p className="text-slate-400 mt-0.5">Tidak ada antrean tamu yang menunggu pengiriman.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-1">
                {pendingSendGuests.slice(0, 4).map((guest) => {
                  const isCopied = copiedGuestId === guest.id;
                  return (
                    <div
                      key={guest.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {guest.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                            {guest.category}
                          </span>
                          <span className="font-mono">{guest.phone ? guest.phone : "Tanpa No. WA"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyGuestLink(guest)}
                          className="px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] transition-colors cursor-pointer"
                          title="Salin tautan personal"
                        >
                          {isCopied ? "Tersalin" : "Link"}
                        </button>
                        <button
                          onClick={() => handleSendWhatsApp(guest)}
                          className="px-3 py-1.5 rounded-md bg-[#1C2434] hover:bg-[#24303F] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          title="Buka WhatsApp langsung"
                        >
                          <MessageCircle className="w-3 h-3 text-[#DFD2BD]" />
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
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-semibold font-mono uppercase tracking-wider">
                Desain Template Aktif
              </span>
              <button
                onClick={() => onNavigateTab("templates")}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Ganti Desain</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            <div className="mt-3.5 flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-base text-slate-900">
                  {currentTemplate.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {currentTemplate.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2.5">
                  <span className="font-mono">Kategori: {currentTemplate.category}</span>
                  <span>•</span>
                  <span className="font-mono">Aksen: {currentTemplate.accentHex}</span>
                </div>
              </div>

              <div
                className={`w-16 h-12 rounded-lg bg-gradient-to-tr ${currentTemplate.previewGradient} shrink-0 border border-slate-200 shadow-inner flex items-center justify-center text-[10px] text-white font-bold`}
              >
                {currentTemplate.tag}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Doa Restu Terbaru
              </h3>
              <button
                onClick={() => onNavigateTab("wishes")}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Semua ({wishes.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {wishes.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Belum ada doa atau ucapan masuk dari tamu.
              </div>
            ) : (
              <div className="space-y-2.5">
                {wishes.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-slate-900 truncate">
                        {w.name}
                        <span className="text-[11px] text-slate-500 font-normal ml-1">
                          ({w.relationship})
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${
                          w.attendance.includes("Hadir")
                            ? "bg-emerald-100 text-emerald-800"
                            : w.attendance.includes("belum")
                            ? "bg-slate-200 text-slate-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {w.attendance}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 italic line-clamp-2 leading-relaxed">
                      &quot;{w.message}&quot;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
