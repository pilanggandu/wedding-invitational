"use client";

import React, { useState } from "react";
import { Check, Music, Eye, Type, Sparkles, SlidersHorizontal } from "lucide-react";
import { WeddingInvitationData } from "@/types/wedding";
import { AVAILABLE_TEMPLATES } from "@/data/templates";
import { saveInvitationData } from "@/lib/invitationStore";
import { getMusicUrlError, getMusicVolume, type MusicSettingsValue } from "@/lib/musicSettings";
import { InvitationMusicSettings } from "./InvitationMusicSettings";
import {
  TYPOGRAPHY_OPTIONS,
  TypographyCategory,
  getTypographyById,
} from "@/lib/typography";

interface TemplateThemeManagerProps {
  data: WeddingInvitationData;
  onUpdate: (updated: WeddingInvitationData) => void;
  onOpenPreview: (templateId?: string) => void;
  onEditTemplate: (templateId: string) => void;
  onOpenCoupleModal?: () => void;
}

function TemplateCardThumbnail({
  templateId,
  coupleText,
  eventDate,
}: {
  templateId: string;
  coupleText: string;
  eventDate: string;
}) {
  switch (templateId) {
    case "craft-book":
      return (
        <div className="relative mb-3.5 h-36 overflow-hidden rounded-xl border border-[#B39F8D] bg-[#DFD7CC] p-3 text-[#2B231F] flex flex-col justify-between">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase bg-[#FAF7F2] text-[#6E5441] px-2 py-0.5 rounded border border-[#B39F8D] shadow-2xs">
              Book View &amp; Tabs
            </span>
            <span className="text-[9px] font-mono text-[#8C3B24] font-semibold flex items-center gap-1">
              🏷️ Scrapbook
            </span>
          </div>
          <div className="relative mx-auto flex h-full w-4/5 flex-col items-center justify-center bg-[#FAF7F2] border border-dashed border-[#CAA98C] rounded my-1 px-2 text-center shadow-xs">
            <div className="w-12 h-2 bg-[#D4A753]/80 rounded-xs mb-1 -mt-2 border border-dashed border-[#966F28]/50" />
            <p className="font-serif font-bold text-base leading-tight text-[#2B231F]">{coupleText}</p>
            <p className="text-[9px] font-mono text-[#6E5E54] mt-0.5">{eventDate}</p>
          </div>
          <div className="text-[8px] font-mono text-center text-[#6E5441] tracking-widest uppercase">
            Handcrafted Paper Album
          </div>
        </div>
      );

    case "paper-keepsake":
      return (
        <div className="relative mb-3.5 h-36 overflow-hidden rounded-xl border border-[#D8C4B8] bg-[#F3EBDD] p-3 text-[#331F22]">
          <img
            src="/images/paper-keepsake/hero-paper-keepsake.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative mx-auto flex h-full w-3/4 flex-col items-center justify-center bg-[#FBF8F1]/50 px-2 text-center rounded-lg border border-[#541E24]/20 shadow-xs">
            <span className="text-[8px] uppercase tracking-[0.24em] text-[#541E24] font-semibold">
              A letter to remember
            </span>
            <p className="my-1.5 font-serif text-xl leading-tight text-[#331F22]">{coupleText}</p>
            <p className="text-[9px] tracking-wider text-[#541E24]">{eventDate}</p>
            <span className="mt-1.5 text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-[#541E24] text-[#FBF8F1] font-semibold">
              Paper Keepsake · Mahogany
            </span>
          </div>
        </div>
      );

    case "ambient-blur":
      return (
        <div className="h-36 rounded-xl bg-[#F8FAFC] border border-slate-200/90 p-3.5 flex flex-col justify-between text-slate-800 shadow-inner relative overflow-hidden mb-3.5">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-amber-400/30 via-rose-400/25 to-sky-400/20 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase bg-white/90 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
              Adaptive Chroma
            </span>
            <span className="text-[9px] font-mono text-slate-500 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Live Color
            </span>
          </div>
          <div className="text-center relative z-10 my-auto py-1">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-white shadow-md overflow-hidden mb-1 bg-slate-200">
              <img src="/images/prewedding/couple-1.jpg" alt="Preview" className="w-full h-full object-cover" />
            </div>
            <p className="font-serif font-bold text-sm text-slate-900 tracking-tight leading-tight">
              {coupleText}
            </p>
            <p className="text-[9px] font-mono text-slate-500 mt-0.5">
              {eventDate}
            </p>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 relative z-10 pt-1 border-t border-slate-200/70">
            <span>Atmosphere: Luminous</span>
            <span className="font-bold text-amber-700">Auto Palette</span>
          </div>
        </div>
      );

    case "painted-cats":
      return (
        <div className="h-36 rounded-xl bg-[#FAF6EE] border-2 border-[#EAD8C7] p-3 flex flex-col justify-between text-[#2C2623] shadow-inner relative overflow-hidden mb-3.5">
          <div className="absolute top-1 left-4 w-12 h-3 bg-amber-200/80 -rotate-3 border border-amber-300/60 z-10" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/90 text-[#D97736] px-2 py-0.5 rounded-md border border-[#EAD8C7]">
              Cat Scrapbook
            </span>
            <span className="text-xs">🐾</span>
          </div>
          <div className="text-center relative z-10 my-auto py-1">
            <div className="text-2xl my-0.5 animate-bounce">🐱🧡🐱</div>
            <p className="font-handwriting text-xl text-[#2C2623] drop-shadow-2xs leading-none">
              {coupleText}
            </p>
            <p className="text-[9px] font-mono text-[#8C5D38] mt-0.5">
              {eventDate}
            </p>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-[#A8734C] relative z-10 pt-1 border-t border-[#EAD8C7]/60">
            <span>Doodle Die-Cut</span>
            <span className="font-bold text-[#EA580C]">Purrfect Romance</span>
          </div>
        </div>
      );

    case "cinematic-blur":
      return (
        <div className="h-36 rounded-xl bg-[#090B10] border border-[#232734] p-3 flex flex-col justify-between text-white shadow-inner relative overflow-hidden mb-3.5">
          <div className="absolute inset-x-0 top-0 h-3 bg-black z-20 flex items-center justify-between px-2 text-[7px] font-mono text-white/50">
            <span>2.39:1 LETTERBOX</span>
            <span>REC [●] 24FPS</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-3 bg-black z-20" />
          <div className="flex items-center justify-between relative z-10 mt-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-black/60 text-[#DFD2BD] px-2 py-0.5 rounded border border-[#DFD2BD]/30">
              35mm Film Noir
            </span>
            <span className="text-[9px] font-mono text-[#DFD2BD]/80">SCENE 01</span>
          </div>
          <div className="text-center relative z-10 my-auto py-1">
            <p className="font-serif font-bold text-base text-[#DFD2BD] tracking-wider uppercase drop-shadow-sm">
              {coupleText}
            </p>
            <p className="text-[9px] font-mono text-white/60 tracking-widest uppercase">
              {eventDate}
            </p>
          </div>
          <div className="flex items-center justify-between text-[8px] font-mono text-white/50 relative z-10 mb-2">
            <span>DIRECTOR&apos;S CUT</span>
            <span className="text-[#DFD2BD]">MOTION BLUR</span>
          </div>
        </div>
      );

    case "royal-heritage":
      return (
        <div className="h-36 rounded-xl bg-[#0B2820] border-2 border-[#C8A97E] p-3 flex flex-col justify-between text-[#FAF7F0] shadow-inner relative overflow-hidden mb-3.5">
          <div className="absolute top-1 left-1 text-[10px] text-[#C8A97E]">⚜</div>
          <div className="absolute top-1 right-1 text-[10px] text-[#C8A97E]">⚜</div>
          <div className="flex items-center justify-center relative z-10">
            <span className="text-[8px] font-serif uppercase tracking-[0.2em] text-[#C8A97E] border-b border-[#C8A97E]/40 pb-0.5">
              Piagam Keraton Agung
            </span>
          </div>
          <div className="text-center relative z-10 my-auto py-1">
            <div className="w-6 h-6 mx-auto rounded-full border border-[#C8A97E] flex items-center justify-center text-[10px] font-serif text-[#C8A97E] bg-[#071914] mb-0.5">
              ⚜
            </div>
            <p className="font-serif font-bold text-base text-[#FAF7F0] tracking-wide">
              {coupleText}
            </p>
            <p className="text-[9px] font-serif text-[#C8A97E] tracking-wider">
              {eventDate}
            </p>
          </div>
          <div className="flex items-center justify-between text-[8px] font-serif text-[#C8A97E] relative z-10 pt-1 border-t border-[#C8A97E]/30">
            <span>RESMI &amp; KHIDMAT</span>
            <span className="font-mono">EMERALD &amp; GOLD</span>
          </div>
        </div>
      );

    case "cityscape-skyline":
      return (
        <div className="h-36 rounded-xl bg-gradient-to-b from-[#1D78A0] via-[#2A8EB8] to-[#E2F1F8] border border-sky-300 p-3 flex flex-col justify-between text-white shadow-inner relative overflow-hidden mb-3.5">
          <svg className="absolute bottom-0 inset-x-0 h-14 w-full text-[#0B2C42]/85 pointer-events-none" viewBox="0 0 200 60" preserveAspectRatio="none">
            <rect x="10" y="20" width="16" height="40" fill="currentColor" opacity="0.8" />
            <rect x="30" y="10" width="22" height="50" fill="currentColor" opacity="0.9" />
            <polygon points="41,2 35,10 47,10" fill="currentColor" opacity="0.9" />
            <rect x="56" y="26" width="14" height="34" fill="currentColor" opacity="0.75" />
            <rect x="74" y="8" width="20" height="52" fill="currentColor" opacity="0.95" />
            <line x1="84" y1="0" x2="84" y2="8" stroke="currentColor" strokeWidth="1.5" />
            <rect x="98" y="24" width="18" height="36" fill="currentColor" opacity="0.85" />
            <rect x="120" y="16" width="24" height="44" fill="currentColor" opacity="0.9" />
            <rect x="148" y="30" width="16" height="30" fill="currentColor" opacity="0.75" />
            <rect x="168" y="14" width="22" height="46" fill="currentColor" opacity="0.85" />
          </svg>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/90 text-[#0F2B46] px-2 py-0.5 rounded shadow-2xs">
              Metropolitan Blueprint
            </span>
            <span className="text-[9px] font-mono text-white/90 font-bold bg-[#0F2B46]/70 px-1.5 py-0.5 rounded">
              Line 01
            </span>
          </div>
          <div className="text-center relative z-10 my-auto py-1">
            <p className="font-sans font-black text-base text-white tracking-tight drop-shadow-md">
              {coupleText}
            </p>
            <p className="text-[9px] font-mono text-white/90 drop-shadow-sm font-semibold">
              {eventDate}
            </p>
          </div>
          <div className="flex items-center justify-between text-[8px] font-mono text-[#0F2B46] relative z-10 pt-1 font-bold">
            <span>GRID: 07-METRO</span>
            <span>URBAN ROMANCE</span>
          </div>
        </div>
      );

    case "paper-art-maroon":
    default:
      return (
        <div
          style={{
            backgroundImage: "url('/images/paper-art/paper-texture-ivory.png')",
            backgroundSize: "160px",
          }}
          className="h-36 rounded-xl bg-[#F7EFE2] border-2 border-dashed border-[#7D1128] p-3 flex flex-col justify-between text-[#3A2328] shadow-inner relative overflow-hidden mb-3.5"
        >
          <img
            src="/images/paper-art/paperclip-washi-accent.png"
            alt="Paperclip"
            className="absolute -top-3.5 right-2 w-8 pointer-events-none drop-shadow-xs rotate-[8deg]"
          />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#7D1128] text-white px-2 py-0.5 rounded shadow-2xs">
              Maroon Sketchbook
            </span>
            <span className="text-[9px] font-mono text-[#7D1128] font-bold">Vol. 01</span>
          </div>
          <div className="text-center relative z-10 my-auto py-1">
            <p className="font-handwriting text-2xl text-[#7D1128] font-bold leading-tight">
              {coupleText}
            </p>
            <p className="text-[9px] font-mono text-[#5A383F] italic">
              {eventDate}
            </p>
          </div>
          <div className="flex items-center justify-between text-[8px] font-mono text-[#7D1128] relative z-10 pt-1 border-t border-[#7D1128]/30">
            <span>Deckle Paper &amp; Botanical</span>
            <span className="font-bold">2D Papercraft</span>
          </div>
        </div>
      );
  }
}

export function TemplateThemeManager({
  data,
  onUpdate,
  onOpenPreview,
  onEditTemplate,
  onOpenCoupleModal,
}: TemplateThemeManagerProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    data.activeTemplateId || "cityscape-skyline"
  );
  const [fontStyle, setFontStyle] = useState<string>(
    data.themePalette?.fontStyle || "caveat"
  );
  const [selectedCategory, setSelectedCategory] =
    useState<TypographyCategory>("all");
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(
    data.themePalette?.particlesEnabled ?? true
  );
  const [musicAutoplay, setMusicAutoplay] = useState<boolean>(
    data.themePalette?.musicAutoplay ?? true
  );
  const persistedAutoplay = data.themePalette?.musicAutoplay ?? true;
  const [savedAutoplay, setSavedAutoplay] = useState(persistedAutoplay);
  if (savedAutoplay !== persistedAutoplay) {
    setSavedAutoplay(persistedAutoplay);
    setMusicAutoplay(persistedAutoplay);
  }
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [musicDraft, setMusicDraft] = useState<MusicSettingsValue>({
    musicUrl: data.general.musicUrl || "",
    musicTitle: data.general.musicTitle || "",
    musicArtist: data.general.musicArtist || "",
    musicVolume: getMusicVolume(data.general.musicVolume),
  });
  const musicDataKey = JSON.stringify([
    data.general.musicUrl,
    data.general.musicTitle,
    data.general.musicArtist,
    data.general.musicVolume,
  ]);
  const [savedMusicKey, setSavedMusicKey] = useState(musicDataKey);
  if (savedMusicKey !== musicDataKey) {
    setSavedMusicKey(musicDataKey);
    setMusicDraft({
      musicUrl: data.general.musicUrl || "",
      musicTitle: data.general.musicTitle || "",
      musicArtist: data.general.musicArtist || "",
      musicVolume: getMusicVolume(data.general.musicVolume),
    });
  }

  const activeFont = getTypographyById(fontStyle);
  const groomName = data.couple?.groom?.name?.trim() || "";
  const brideName = data.couple?.bride?.name?.trim() || "";
  const isCoupleConfigured = Boolean(groomName && brideName);
  const couplePreviewText = isCoupleConfigured
    ? `${groomName} & ${brideName}`
    : "Nama Mempelai";
  const displayEventDate = data.events?.[0]?.displayDate || "Tanggal Belum Diatur";

  const categories: { id: TypographyCategory; label: string; count: number }[] =
    [
      { id: "all", label: "Semua", count: TYPOGRAPHY_OPTIONS.length },
      {
        id: "calligraphy",
        label: "Kaligrafi & Kursif",
        count: TYPOGRAPHY_OPTIONS.filter((f) => f.category === "calligraphy")
          .length,
      },
      {
        id: "handwriting",
        label: "Handwritten",
        count: TYPOGRAPHY_OPTIONS.filter((f) => f.category === "handwriting")
          .length,
      },
      {
        id: "serif",
        label: "Serif Kerajaan",
        count: TYPOGRAPHY_OPTIONS.filter((f) => f.category === "serif").length,
      },
      {
        id: "modern",
        label: "Modern & Clean",
        count: TYPOGRAPHY_OPTIONS.filter((f) => f.category === "modern").length,
      },
    ];

  const filteredFonts =
    selectedCategory === "all"
      ? TYPOGRAPHY_OPTIONS
      : TYPOGRAPHY_OPTIONS.filter((f) => f.category === selectedCategory);

  const handleCardSelect = (id: string) => {
    setSelectedTemplateId(id);
  };

  const handleSelectFont = (newFontId: string) => {
    setFontStyle(newFontId);
    const updated: WeddingInvitationData = {
      ...data,
      activeTemplateId: data.activeTemplateId,
      themePalette: {
        ...data.themePalette,
        fontStyle: newFontId,
        particlesEnabled,
        musicAutoplay,
      },
    };
    saveInvitationData(updated);
    onUpdate(updated);
    showNotice();
  };

  const handleSaveThemeSettings = () => {
    if (getMusicUrlError(musicDraft.musicUrl || "")) return;
    const updated: WeddingInvitationData = {
      ...data,
      activeTemplateId: data.activeTemplateId,
      general: {
        ...data.general,
        ...musicDraft,
        musicUrl: musicDraft.musicUrl?.trim() || "",
        musicTitle: musicDraft.musicTitle.trim(),
        musicArtist: musicDraft.musicArtist.trim(),
        musicVolume: getMusicVolume(musicDraft.musicVolume),
      },
      themePalette: {
        ...data.themePalette,
        fontStyle,
        particlesEnabled,
        musicAutoplay,
      },
    };
    saveInvitationData(updated);
    onUpdate(updated);
    showNotice();
  };

  const showNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {!isCoupleConfigured && (
        <div className="bg-[#FDFBF7] border border-[#F0E0BF] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF3E0] text-[#8C6218] border border-[#F0DFB0] flex items-center justify-center font-bold text-xs shrink-0">
              <Sparkles className="w-4 h-4 text-[#8C6218]" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-[#14161C]">
                Tahap Persiapan: Nama Pasangan Mempelai Belum Diisi
              </p>
              <p className="text-xs text-[#5E6373] mt-0.5">
                Disarankan mengisi nama kedua mempelai terlebih dahulu agar pratinjau kartu template dan tipografi langsung terpersonalisasi.
              </p>
            </div>
          </div>
          {onOpenCoupleModal && (
            <button
              type="button"
              onClick={onOpenCoupleModal}
              className="px-4 py-2 rounded-xl bg-[#14161C] hover:bg-[#232734] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors shadow-xs"
            >
              Input Nama Pasangan
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-2xl border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#888D9C] font-medium">
              ESTETIKA &amp; TEMA UNDANGAN
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#14161C] tracking-tight">
            Katalog Template &amp; Gaya Visual
          </h2>
          <p className="text-xs text-[#717686] mt-1 font-sans">
            Pilih konsep arsitektur visual utama dan sesuaikan tipografi nama pengantin secara presisi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {savedNotice && (
            <span className="text-xs font-medium text-[#24623E] bg-[#F3F8F5] px-3.5 py-1.5 rounded-xl border border-[#D4EADB] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-[#2E7A4A]" />
              Perubahan Disimpan
            </span>
          )}
          <button
            onClick={() => onOpenPreview(selectedTemplateId)}
            className="px-4 py-2 rounded-xl bg-white border border-[#E2E2DC] hover:bg-[#F5F5F0] text-[#2C303B] font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Eye className="w-4 h-4 text-[#717686]" />
            <span>Pratinjau Layar HP</span>
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
              Pilihan Template Desain ({AVAILABLE_TEMPLATES.length})
            </h3>
            <p className="text-xs text-[#717686] mt-0.5">
              Klik kartu untuk memilih. Gunakan tombol &quot;Preview&quot; untuk melihat atau &quot;Edit Template&quot; untuk menyesuaikan sebelum menerapkan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenPreview(selectedTemplateId)}
              className="px-3 py-1.5 rounded-xl border border-[#E2E2DC] hover:bg-[#F5F5F0] text-[#2C303B] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#717686]" />
              <span>Preview Terpilih</span>
            </button>
            <button
              type="button"
              onClick={() => onEditTemplate(selectedTemplateId)}
              className="px-3.5 py-1.5 rounded-xl bg-[#14161C] hover:bg-[#232734] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#DFD2BD]" />
              <span>Edit Template Terpilih</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AVAILABLE_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplateId === tmpl.id;
            const isActive = data.activeTemplateId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => handleCardSelect(tmpl.id)}
                className={`relative bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between cursor-pointer select-none ${
                  isSelected
                    ? "border-[#14161C] ring-2 ring-[#14161C]/15 bg-[#FAF9F6]/50 shadow-sm"
                    : "border-[#E7E7E1] hover:border-[#D6D6CF] hover:bg-[#FCFCFB]"
                }`}
              >
                {isActive && (
                  <div className="absolute -top-3 right-5 bg-emerald-700 text-white text-[10px] font-mono px-3 py-1 rounded-md shadow-xs flex items-center gap-1.5 z-10 border border-emerald-600 font-semibold">
                    <Check className="w-3 h-3 text-white" />
                    <span>Tema Aktif Saat Ini</span>
                  </div>
                )}
                {!isActive && isSelected && (
                  <div className="absolute -top-3 right-5 bg-[#14161C] text-[#DFD2BD] text-[10px] font-mono px-3 py-1 rounded-md shadow-xs flex items-center gap-1.5 z-10 border border-[#2D313E] font-medium">
                    <Check className="w-3 h-3 text-[#DFD2BD]" />
                    <span>Dipilih untuk Dilihat</span>
                  </div>
                )}

                <div>
                  <TemplateCardThumbnail
                    templateId={tmpl.id}
                    coupleText={couplePreviewText}
                    eventDate={displayEventDate}
                  />

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-sm text-zinc-900 tracking-tight">
                      {tmpl.name}
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPreview(tmpl.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title={`Pratinjau baca-saja ${tmpl.name}`}
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTemplate(tmpl.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#14161C] hover:bg-[#232734] active:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    title={`Buka draf editor untuk ${tmpl.name}`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#DFD2BD]" />
                    <span>Edit Template</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="border-b border-[#F0F0EA] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#14161C] flex items-center gap-2">
              <Type className="w-4 h-4 text-[#717686]" />
              <span>Koleksi Tipografi Nama Pasangan ({TYPOGRAPHY_OPTIONS.length} Pilihan Font)</span>
            </h3>
            <p className="text-xs text-[#717686] mt-0.5">
              Pilih tipografi untuk judul nama kedua mempelai. Diterapkan otomatis ke seluruh kartu, sampul, dan bagian isi undangan.
            </p>
          </div>
          <span className="text-xs font-medium text-[#2C303B] bg-[#F5F5F0] border border-[#E2E2DC] px-3 py-1 rounded-lg self-start sm:self-auto">
            Font Aktif: <strong className="text-[#14161C] font-semibold">{activeFont.name}</strong>
          </span>
        </div>
        <div className="rounded-2xl border border-[#E7E7E1] bg-[#FAF9F6] p-6 text-center">
          <span className="text-[10px] uppercase font-mono tracking-widest font-semibold text-[#888D9C] block mb-1">
            PRATINJAU TIPOGRAFI AKTIF
          </span>
          <p
            className={`text-4xl sm:text-5xl text-[#14161C] py-3 leading-tight ${activeFont.fontClass}`}
          >
            {couplePreviewText}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <span className="text-xs font-semibold text-[#14161C] bg-white border border-[#E2E2DC] px-3 py-1 rounded-lg shadow-2xs">
              {activeFont.name}
            </span>
            <span className="text-xs text-[#5E6373] bg-[#F4F4F0] px-3 py-1 rounded-lg border border-[#EAEAE4]">
              Karakter: {activeFont.vibe}
            </span>
            <span className="text-xs text-[#5E6373] bg-[#F4F4F0] px-3 py-1 rounded-lg border border-[#EAEAE4]">
              Pasangan Ideal: {activeFont.bestFor}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#F0F0EA]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-[#14161C] text-white shadow-xs"
                  : "bg-[#F5F5F0] hover:bg-[#EBEBE5] text-[#555966]"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  selectedCategory === cat.id
                    ? "bg-[#2A2E3B] text-[#DFD2BD]"
                    : "bg-[#E5E5DF] text-[#717686]"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFonts.map((f) => {
            const isSelected = fontStyle === f.id;

            return (
              <div
                key={f.id}
                onClick={() => handleSelectFont(f.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[#14161C] ring-2 ring-[#14161C]/10 bg-[#FAF9F6] shadow-xs"
                    : "border-[#E7E7E1] hover:border-[#D6D6CF] bg-white hover:bg-[#FCFCFB]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#14161C]">
                          {f.name}
                        </span>
                        {f.badge && (
                          <span className="text-[10px] font-medium bg-[#F2F2EC] text-[#555966] px-2 py-0.5 rounded-md">
                            {f.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#717686]">
                        {f.vibe}
                      </span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-[#14161C] bg-[#14161C] text-[#DFD2BD]"
                          : "border-[#D6D6CF]"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="py-3 my-2 border-y border-[#F0F0EA] bg-[#FAF9F6] rounded-xl px-2 text-center overflow-hidden">
                    <p className={`text-2xl text-[#14161C] leading-tight ${f.fontClass}`}>
                      {couplePreviewText}
                    </p>
                  </div>

                  <p className="text-[11px] text-[#717686] leading-relaxed mt-1 line-clamp-2">
                    {f.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#F0F0EA] flex items-center justify-between text-[11px] text-[#717686]">
                  <span>Cocok: {f.bestFor}</span>
                  <span
                    className={`font-semibold ${
                      isSelected ? "text-[#14161C]" : "text-[#888D9C]"
                    }`}
                  >
                    {isSelected ? "Terpilih" : "Pilih Font"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <section aria-label="Pengaturan lagu undangan" className="pt-5 border-t border-[#F0F0EA] space-y-4">
          <h3 className="text-lg font-semibold text-[#14161C]">Lagu undangan</h3>
          <InvitationMusicSettings value={musicDraft} onChange={setMusicDraft} />
        </section>
        <div className="pt-4 border-t border-[#F0F0EA] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[#E7E7E1] bg-[#FCFCFB] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#717686]" />
                <span className="font-semibold text-xs text-[#14161C]">
                  Animasi Kelopak &amp; Partikel Melayang
                </span>
              </div>
              <p className="text-[11px] text-[#717686] mt-1 leading-relaxed">
                Efek partikel kelopak bunga dan ornamen halus yang melayang perlahan di latar belakang.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={particlesEnabled}
                onChange={(e) => {
                  setParticlesEnabled(e.target.checked);
                  const updated: WeddingInvitationData = {
                    ...data,
                    themePalette: {
                      ...data.themePalette,
                      particlesEnabled: e.target.checked,
                    },
                  };
                  saveInvitationData(updated);
                  onUpdate(updated);
                  showNotice();
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#E2E2DC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E2E2DC] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#14161C]" />
            </label>
          </div>
          <div className="p-4 rounded-xl border border-[#E7E7E1] bg-[#FCFCFB] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#717686]" />
                <span className="font-semibold text-xs text-[#14161C]">
                  Putar Musik Saat Amplop Dibuka
                </span>
              </div>
              <p className="text-[11px] text-[#717686] mt-1 leading-relaxed">
                Lagu latar syahdu akan diputar otomatis begitu tamu menekan tombol Buka Undangan.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={musicAutoplay}
                onChange={(e) => {
                  setMusicAutoplay(e.target.checked);
                  const updated: WeddingInvitationData = {
                    ...data,
                    themePalette: {
                      ...data.themePalette,
                      musicAutoplay: e.target.checked,
                    },
                  };
                  saveInvitationData(updated);
                  onUpdate(updated);
                  showNotice();
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900" />
            </label>
          </div>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveThemeSettings}
            disabled={Boolean(getMusicUrlError(musicDraft.musicUrl || ""))}
            className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 text-white" />
            <span>Simpan Pengaturan Tampilan &amp; Musik</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateThemeManager;
