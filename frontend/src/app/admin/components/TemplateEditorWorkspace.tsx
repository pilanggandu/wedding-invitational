"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  Smartphone,
  Monitor,
  RotateCcw,
  Sparkles,
  HeartHandshake,
  Calendar,
  Image as ImageIcon,
  CreditCard,
  MessageSquareHeart,
  Palette,
  AlertTriangle,
  Plus,
  Trash2,
  ExternalLink,
  X,
  Layers,
  Music,
} from "lucide-react";
import { WeddingInvitationData, BankAccount } from "@/types/wedding";
import { TYPOGRAPHY_OPTIONS } from "@/lib/typography";
import { AVAILABLE_TEMPLATES } from "@/data/templates";
import { TemplateRenderer } from "@/templates/TemplateRenderer";
import { normalizeWeddingData } from "@/context/WeddingDataContext";
import { PhotoPickerControl } from "./PhotoPickerControl";
import { InvitationMusicSettings } from "./InvitationMusicSettings";
import { getMusicUrlError, getMusicVolume } from "@/lib/musicSettings";
import { getTemplateScrollbarVars, normalizeTemplateThemeId } from "@/lib/templateTheme";

interface TemplateEditorWorkspaceProps {
  initialData: WeddingInvitationData;
  templateId: string;
  onClose: () => void;
  onSaveAndApply: (savedData: WeddingInvitationData) => void;
  onOpenPreview: (data: WeddingInvitationData, templateId: string) => void;
}

type EditorSection =
  | "cover"
  | "couple"
  | "events"
  | "gallery"
  | "gifts"
  | "rsvp"
  | "music"
  | "theme";

export function TemplateEditorWorkspace({
  initialData,
  templateId,
  onClose,
  onSaveAndApply,
  onOpenPreview,
}: TemplateEditorWorkspaceProps) {
  const [draftData, setDraftData] = useState<WeddingInvitationData>(() => ({
    ...JSON.parse(JSON.stringify(initialData)),
    activeTemplateId: templateId,
  }));
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<EditorSection>("cover");
  const [deviceView, setDeviceView] = useState<"mobile" | "desktop">("mobile");
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);
  const [canvasKey, setCanvasKey] = useState<number>(0);
  const canvasScrollContainerRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasScrollContainerRef.current || !previewContentRef.current) return;

    if (activeSection === "cover" || activeSection === "theme" || activeSection === "music") {
      canvasScrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const selectorMap: Record<EditorSection, string[]> = {
      cover: ["#hero", "#beranda", "#cover", "#sampul"],
      couple: ["#couple", "#mempelai"],
      events: ["#event", "#events", "#acara"],
      gallery: ["#gallery", "#galeri"],
      gifts: ["#gift", "#gifts", "#hadiah", "#kado", "#amplop"],
      rsvp: ["#rsvp", "#ucapan", "#doa"],
      theme: ["#hero", "#beranda", "#cover", "#sampul"],
      music: ["#hero", "#beranda", "#cover", "#sampul"],
    };

    const selectors = selectorMap[activeSection] || [];
    let targetEl: HTMLElement | null = null;
    for (const sel of selectors) {
      const found = previewContentRef.current.querySelector<HTMLElement>(sel);
      if (found) {
        targetEl = found;
        break;
      }
    }

    if (targetEl) {
      const containerRect = canvasScrollContainerRef.current.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const currentScroll = canvasScrollContainerRef.current.scrollTop;
      const targetTop = targetRect.top - containerRect.top + currentScroll - 24;
      canvasScrollContainerRef.current.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    }
  }, [activeSection, canvasKey]);

  const templateMeta = AVAILABLE_TEMPLATES.find((t) => t.id === templateId) || {
    id: templateId,
    name: templateId,
    category: "Tema Undangan",
    tag: "Custom",
  };

  const updateDraft = (updater: (prev: WeddingInvitationData) => WeddingInvitationData) => {
    setDraftData((prev) => {
      const next = updater(prev);
      return next;
    });
    setIsDirty(true);
  };

  const handleBackAttempt = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      onClose();
    }
  };

  const handleSaveAndApplyClick = () => {
    if (getMusicUrlError(draftData.general.musicUrl || "")) {
      setActiveSection("music");
      return;
    }
    const finalData: WeddingInvitationData = {
      ...draftData,
      activeTemplateId: templateId,
      general: {
        ...draftData.general,
        musicUrl: draftData.general.musicUrl?.trim() || "",
        musicVolume: getMusicVolume(draftData.general.musicVolume),
      },
    };
    onSaveAndApply(finalData);
    setIsDirty(false);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 3500);
  };

  const sectionsList: { id: EditorSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "cover", label: "Sampul & Kutipan", icon: Sparkles },
    { id: "couple", label: "Pasangan Mempelai", icon: HeartHandshake },
    { id: "events", label: "Rangkaian Acara", icon: Calendar },
    { id: "gallery", label: "Galeri Foto", icon: ImageIcon },
    { id: "gifts", label: "Kado & Rekening", icon: CreditCard },
    { id: "rsvp", label: "Buku Tamu & RSVP", icon: MessageSquareHeart },
    { id: "music", label: "Lagu Undangan", icon: Music },
    { id: "theme", label: "Gaya & Tipografi", icon: Palette },
  ];

  const safePreviewData = {
    ...normalizeWeddingData(draftData),
    activeTemplateId: templateId,
  };

  const normalizedTmpl = normalizeTemplateThemeId(templateId);
  const scrollbarVars = getTemplateScrollbarVars(normalizedTmpl);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-template-theme", normalizedTmpl);
      return () => {
        document.documentElement.removeAttribute("data-template-theme");
      };
    }
  }, [normalizedTmpl]);

  return (
    <div
      data-template-theme={normalizedTmpl}
      style={scrollbarVars}
      className="fixed inset-0 z-50 bg-[#0F1116] text-[#FAF8F5] flex flex-col overflow-hidden font-sans editor-workspace-theme"
    >
      {/* Top Header Workspace Bar (Operate) */}
      <header className="h-14 bg-[#14161C] border-b border-[#232734] px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackAttempt}
            className="p-2 rounded-xl bg-[#1C1F28] hover:bg-[#282C38] text-[#A6ABB9] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Kembali ke Katalog"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Katalog</span>
          </button>

          <div className="h-5 w-px bg-[#232734]" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-sm text-white truncate max-w-[200px] sm:max-w-xs">
                {templateMeta.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#232734] text-[#DFD2BD] border border-[#2F3444] hidden sm:inline-block">
                Draf Editor
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDirty ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                }`}
              />
              <span className="text-[10px] font-mono text-[#8E93A2]">
                {isDirty ? "Perubahan belum disimpan" : "Semua perubahan tersimpan"}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Control Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center bg-[#1A1D26] p-1 rounded-xl border border-[#272B38]">
            <button
              type="button"
              onClick={() => setDeviceView("mobile")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceView === "mobile"
                  ? "bg-[#272B38] text-white shadow-xs"
                  : "text-[#8E93A2] hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Ponsel</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceView("desktop")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceView === "desktop"
                  ? "bg-[#272B38] text-white shadow-xs"
                  : "text-[#8E93A2] hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenPreview(draftData, templateId)}
            className="px-3 py-1.5 rounded-xl bg-[#1C1F28] hover:bg-[#272B38] border border-[#272B38] text-[#E0E2EC] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Pratinjau Layar Penuh"
          >
            <Eye className="w-3.5 h-3.5 text-[#DFD2BD]" />
            <span className="hidden sm:inline">Pratinjau</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndApplyClick}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer group"
          >
            <Check className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Simpan &amp; Terapkan</span>
          </button>
        </div>
      </header>

      {/* Success Notification Alert */}
      {saveSuccessNotice && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-2 flex items-center justify-between text-xs text-emerald-200 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>
              Perubahan template <strong>{templateMeta.name}</strong> berhasil disimpan dan aktif sebagai tema utama!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessNotice(false)}
            className="p-1 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Workspace Body (3-Panel Operative Setup) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Section Navigator (Operate) */}
        <aside className="w-16 sm:w-56 shrink-0 bg-[#12141A] border-r border-[#1E222D] flex flex-col justify-between p-2 sm:p-3 select-none">
          <div className="space-y-1">
            <div className="px-2 py-1.5 hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-wider text-[#636879] uppercase">
              <Layers className="w-3 h-3" />
              <span>Bagian Undangan</span>
            </div>

            {sectionsList.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 sm:px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1F232E] text-white font-semibold border border-[#2E3343] shadow-xs text-amber-200"
                      : "text-[#858A9A] hover:text-white hover:bg-[#181B22]"
                  }`}
                  title={sec.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#DFD2BD]" : "text-[#636879]"}`} />
                  <span className="hidden sm:inline truncate">{sec.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#1E222D]">
            <button
              type="button"
              onClick={() => setCanvasKey((k) => k + 1)}
              className="w-full flex items-center justify-center sm:justify-start gap-2 px-2.5 py-2 rounded-xl bg-[#181A22] hover:bg-[#20232E] text-[#8E93A2] hover:text-white text-xs font-mono transition-colors cursor-pointer"
              title="Buka Ulang Amplop / Cover"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-[11px]">Ulangi Cover</span>
            </button>
          </div>
        </aside>

        {/* Center: Live Experience Canvas (Experience) */}
        <main
          ref={canvasScrollContainerRef}
          style={scrollbarVars}
          className="flex-1 bg-[#090A0D] p-3 sm:p-6 flex flex-col items-center justify-start overflow-y-auto relative"
        >
          <div className="w-full flex items-center justify-between max-w-md pb-2 text-[11px] font-mono text-[#717686]">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shadow-xs"
                style={{ backgroundColor: (scrollbarVars as Record<string, string>)["--scrollbar-thumb"] }}
              />
              <span>Kanvas Langsung Undangan</span>
            </span>
            <span className="text-[#A6ABB9]">{deviceView === "mobile" ? "Lebar Ponsel (420px)" : "Layar Penuh"}</span>
          </div>

          <div
            className={`w-full transition-all duration-300 ${
              deviceView === "mobile"
                ? "max-w-[420px] rounded-[36px] border-4 border-[#252834] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
                : "max-w-4xl rounded-2xl border border-[#252834] shadow-2xl overflow-hidden"
            } bg-black min-h-[640px]`}
          >
            {deviceView === "mobile" && (
              <div className="flex justify-between items-center px-6 py-2 bg-black text-[#717686] text-[10px] font-mono shrink-0 select-none border-b border-white/5">
                <span>09:41</span>
                <div className="w-16 h-3 bg-zinc-900 rounded-full flex items-center justify-center gap-1 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="w-4 h-0.5 rounded-full bg-white/20" />
                </div>
                <span>100%</span>
              </div>
            )}

            <div key={canvasKey} ref={previewContentRef} className="w-full">
              <TemplateRenderer
                data={safePreviewData}
                isPreview={true}
                isEditor={true}
                guestName="Tamu Undangan Terhormat"
              />
            </div>
          </div>
        </main>

        {/* Right Panel: Section Inspector Form Controls (Operate) */}
        <aside
          style={scrollbarVars}
          className="w-72 sm:w-80 lg:w-96 shrink-0 bg-[#14161C] border-l border-[#1E222D] flex flex-col justify-between overflow-y-auto p-4 sm:p-5 select-none"
        >
          <div className="space-y-5">
            <div className="border-b border-[#232734] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-[#DFD2BD] uppercase font-bold">
                  PENGATURAN BAGIAN
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-white mt-0.5">
                {sectionsList.find((s) => s.id === activeSection)?.label}
              </h3>
              <p className="text-[11px] text-[#787D8E] mt-0.5">
                Perubahan pada formulir ini akan langsung terlihat di kanvas preview secara real-time.
              </p>
            </div>

            {/* 1. COVER & HERO INSPECTOR */}
            {activeSection === "cover" && (
              <div className="space-y-4">
                <PhotoPickerControl
                  label="Foto Sampul & Latar Utama"
                  value={draftData.general?.coverPhotoUrl || draftData.general?.backgroundPhotoUrl || ""}
                  onChange={(newUrl) =>
                    updateDraft((prev) => ({
                      ...prev,
                      general: {
                        ...prev.general,
                        coverPhotoUrl: newUrl,
                        heroPhotoUrl: newUrl,
                        backgroundPhotoUrl: newUrl,
                      },
                    }))
                  }
                  templateId={templateId}
                  slot="cover"
                  aspectHint={
                    templateId === "cinematic-blur"
                      ? "Rasio Sinematik Widescreen (2.39:1)"
                      : templateId === "ambient-blur"
                      ? "Pusat Ekstraksi Warna & Latar Adaptif"
                      : "Foto Orientasi Lanskap / Potret"
                  }
                  helpText={
                    templateId === "ambient-blur"
                      ? "Foto ini menjadi sumber utama ekstraksi palet warna cerah, glow, dan blur atmosfer kanvas undangan."
                      : templateId === "cinematic-blur"
                      ? "Ditampilkan sebagai latar sinematik ultra widescreen yang memukau tamu."
                      : templateId === "cityscape-skyline"
                      ? "Ditampilkan sebagai panorama terminal metropolitan dan latar utama hero."
                      : templateId === "painted-cats"
                      ? "Foto sampul pembuka undangan bertema kucing dan scrapbook."
                      : templateId === "paper-art-maroon"
                      ? "Latar buku sketsa ivory maroon bernuansa scrapbook 2D."
                      : "Foto pembuka utama yang menyambut tamu undangan."
                  }
                />

                <div>
                  <label className="text-xs font-mono font-medium text-[#A6ABB9] block mb-1">
                    Tagline Undangan
                  </label>
                  <input
                    type="text"
                    value={draftData.general?.funTagline || ""}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        general: { ...prev.general, funTagline: e.target.value },
                      }))
                    }
                    placeholder="Contoh: Menemukan cinta di antara jutaan cerita..."
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1F28] border border-[#2A2E3D] text-xs text-white focus:outline-none focus:border-[#DFD2BD]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-medium text-[#A6ABB9] block mb-1">
                    Teks Arab Kutipan / Ayat
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={draftData.general?.quote?.arabic || ""}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        general: {
                          ...prev.general,
                          quote: {
                            arabic: e.target.value,
                            translation: prev.general?.quote?.translation || "",
                            source: prev.general?.quote?.source || "",
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1F28] border border-[#2A2E3D] text-xs font-serif text-white focus:outline-none focus:border-[#DFD2BD]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-medium text-[#A6ABB9] block mb-1">
                    Terjemahan Kutipan
                  </label>
                  <textarea
                    rows={3}
                    value={draftData.general?.quote?.translation || ""}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        general: {
                          ...prev.general,
                          quote: {
                            arabic: prev.general?.quote?.arabic || "",
                            translation: e.target.value,
                            source: prev.general?.quote?.source || "",
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1F28] border border-[#2A2E3D] text-xs text-white focus:outline-none focus:border-[#DFD2BD]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-medium text-[#A6ABB9] block mb-1">
                    Sumber Kutipan (Misal: QS. Ar-Rum: 21)
                  </label>
                  <input
                    type="text"
                    value={draftData.general?.quote?.source || ""}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        general: {
                          ...prev.general,
                          quote: {
                            arabic: prev.general?.quote?.arabic || "",
                            translation: prev.general?.quote?.translation || "",
                            source: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1F28] border border-[#2A2E3D] text-xs text-white focus:outline-none focus:border-[#DFD2BD]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-medium text-[#A6ABB9] block mb-1">
                    Target Tanggal Hitung Mundur (ISO / Tanggal Acara)
                  </label>
                  <input
                    type="text"
                    value={draftData.countdownTarget || "2026-11-21T08:00:00+07:00"}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        countdownTarget: e.target.value,
                      }))
                    }
                    placeholder="2026-11-21T08:00:00+07:00"
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1F28] border border-[#2A2E3D] text-xs font-mono text-white focus:outline-none focus:border-[#DFD2BD]"
                  />
                </div>
              </div>
            )}

            {/* 2. COUPLE INSPECTOR */}
            {activeSection === "couple" && (
              <div className="space-y-5">
                <div className="p-3.5 rounded-xl bg-[#1A1D26] border border-[#272B38] space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DFD2BD] block">
                    Mempelai Pria (Groom)
                  </span>

                  <PhotoPickerControl
                    label="Foto Mempelai Pria"
                    value={draftData.couple?.groom?.photoUrl || ""}
                    onChange={(newUrl) =>
                      updateDraft((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: { ...prev.couple.groom, photoUrl: newUrl },
                        },
                      }))
                    }
                    templateId={templateId}
                    slot="groom"
                    aspectHint={
                      templateId === "painted-cats"
                        ? "Stiker Doodle Kucing / Pas Foto"
                        : "Rasio Pas Foto (3:4 / Persegi)"
                    }
                    helpText={
                      templateId === "painted-cats"
                        ? "Pilih stiker kucing doodle oranye atau unggah foto asli mempelai pria."
                        : templateId === "paper-art-maroon"
                        ? "Foto otomatis dibingkai deckle photo mat bertekstur kertas gading."
                        : "Foto personal mempelai pria untuk bagian profil kedua mempelai."
                    }
                  />

                  <div>
                    <label className="text-[11px] font-mono text-[#8E93A2] block mb-1">
                      Nama Panggilan
                    </label>
                    <input
                      type="text"
                      value={draftData.couple?.groom?.name || ""}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            groom: { ...prev.couple.groom, name: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#8E93A2] block mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={draftData.couple?.groom?.fullName || ""}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            groom: { ...prev.couple.groom, fullName: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#8E93A2] block mb-1">
                      Keluarga / Orang Tua
                    </label>
                    <input
                      type="text"
                      value={draftData.couple?.groom?.parents || ""}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            groom: { ...prev.couple.groom, parents: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#8E93A2] block mb-1">
                      Username Instagram
                    </label>
                    <input
                      type="text"
                      value={draftData.couple?.groom?.instagram || ""}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            groom: { ...prev.couple.groom, instagram: e.target.value },
                          },
                        }))
                      }
                      placeholder="@username"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1A1D26] border border-[#272B38] space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DFD2BD] block">
                    Mempelai Wanita (Bride)
                  </span>

                  <PhotoPickerControl
                    label="Foto Mempelai Wanita"
                    value={draftData.couple?.bride?.photoUrl || ""}
                    onChange={(newUrl) =>
                      updateDraft((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: { ...prev.couple.bride, photoUrl: newUrl },
                        },
                      }))
                    }
                    templateId={templateId}
                    slot="bride"
                    aspectHint={
                      templateId === "painted-cats"
                        ? "Stiker Doodle Kucing / Pas Foto"
                        : "Rasio Pas Foto (3:4 / Persegi)"
                    }
                    helpText={
                      templateId === "painted-cats"
                        ? "Pilih stiker kucing doodle putih atau unggah foto asli mempelai wanita."
                        : templateId === "paper-art-maroon"
                        ? "Foto otomatis dibingkai deckle photo mat bertekstur kertas gading."
                        : "Foto personal mempelai wanita untuk bagian profil kedua mempelai."
                    }
                  />

                  <div>
                    <label className="text-[11px] font-mono text-[#8E93A2] block mb-1">
                      Nama Panggilan
                    </label>
                    <input
                      type="text"
                      value={draftData.couple?.bride?.name || ""}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            bride: { ...prev.couple.bride, name: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#8E93A2] block mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={draftData.couple?.bride?.fullName || ""}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            bride: { ...prev.couple.bride, fullName: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#8E93A2] block mb-1">
                      Keluarga / Orang Tua
                    </label>
                    <input
                      type="text"
                      value={draftData.couple?.bride?.parents || ""}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            bride: { ...prev.couple.bride, parents: e.target.value },
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#8E93A2] block mb-1">
                      Username Instagram
                    </label>
                    <input
                      type="text"
                      value={draftData.couple?.bride?.instagram || ""}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            bride: { ...prev.couple.bride, instagram: e.target.value },
                          },
                        }))
                      }
                      placeholder="@username"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. EVENTS INSPECTOR */}
            {activeSection === "events" && (
              <div className="space-y-4">
                {(draftData.events || []).map((evt, idx) => (
                  <div
                    key={evt.id || idx}
                    className="p-3.5 rounded-xl bg-[#1A1D26] border border-[#272B38] space-y-2.5"
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DFD2BD] block">
                      Acara 0{idx + 1}: {evt.title}
                    </span>

                    <div>
                      <label className="text-[10px] font-mono text-[#8E93A2] block mb-0.5">
                        Judul Acara
                      </label>
                      <input
                        type="text"
                        value={evt.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => {
                            const newEvents = [...(prev.events || [])];
                            newEvents[idx] = { ...newEvents[idx], title: val };
                            return { ...prev, events: newEvents };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-[#8E93A2] block mb-0.5">
                          Hari (Misal: Sabtu)
                        </label>
                        <input
                          type="text"
                          value={evt.displayDay}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft((prev) => {
                              const newEvents = [...(prev.events || [])];
                              newEvents[idx] = { ...newEvents[idx], displayDay: val };
                              return { ...prev, events: newEvents };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-[#8E93A2] block mb-0.5">
                          Tanggal Acara
                        </label>
                        <input
                          type="text"
                          value={evt.displayDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft((prev) => {
                              const newEvents = [...(prev.events || [])];
                              newEvents[idx] = { ...newEvents[idx], displayDate: val };
                              return { ...prev, events: newEvents };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[#8E93A2] block mb-0.5">
                        Waktu / Jam
                      </label>
                      <input
                        type="text"
                        value={evt.time}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => {
                            const newEvents = [...(prev.events || [])];
                            newEvents[idx] = { ...newEvents[idx], time: val };
                            return { ...prev, events: newEvents };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[#8E93A2] block mb-0.5">
                        Nama Gedung / Lokasi
                      </label>
                      <input
                        type="text"
                        value={evt.venueName}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => {
                            const newEvents = [...(prev.events || [])];
                            newEvents[idx] = { ...newEvents[idx], venueName: val };
                            return { ...prev, events: newEvents };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[#8E93A2] block mb-0.5">
                        Alamat Lengkap
                      </label>
                      <input
                        type="text"
                        value={evt.venueAddress}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => {
                            const newEvents = [...(prev.events || [])];
                            newEvents[idx] = { ...newEvents[idx], venueAddress: val };
                            return { ...prev, events: newEvents };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. GALLERY INSPECTOR */}
            {activeSection === "gallery" && (() => {
              const galleryList = (draftData.gallery && draftData.gallery.length > 0)
                ? draftData.gallery
                : (draftData.general?.preweddingPhotos || []).map((url, i) => ({
                    id: i + 1,
                    caption: `Foto Kenangan ${i + 1}`,
                    tag: "Prewedding",
                    doodleSticker: "paw",
                    stickerBg: "#ffffff",
                    aspectRatio: "portrait" as const,
                    imageUrl: url,
                  }));

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#8E93A2] block">
                        Koleksi Foto Galeri Prewedding
                      </span>
                      <span className="text-[10px] font-mono text-[#6B7280]">
                        {galleryList.length} foto terdaftar
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updateDraft((prev) => {
                          const base = (prev.gallery && prev.gallery.length > 0) ? prev.gallery : galleryList;
                          const newGallery = [
                            ...base,
                            {
                              id: Date.now(),
                              caption: `Foto Kenangan ${base.length + 1}`,
                              tag: "Prewedding",
                              doodleSticker: "paw",
                              stickerBg: "#ffffff",
                              aspectRatio: "portrait" as const,
                              imageUrl: "",
                            },
                          ];
                          const newPreweddings = [
                            ...(prev.general?.preweddingPhotos || []),
                            "",
                          ];
                          return {
                            ...prev,
                            gallery: newGallery,
                            general: {
                              ...prev.general,
                              preweddingPhotos: newPreweddings,
                            },
                          };
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1F232E] hover:bg-[#282D3B] text-emerald-400 text-xs font-mono font-medium flex items-center gap-1 cursor-pointer transition-colors border border-[#2D3242]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Foto</span>
                    </button>
                  </div>

                  {galleryList.map((item, idx) => {
                    const currentPhotoUrl =
                      item.imageUrl ||
                      draftData.general?.preweddingPhotos?.[idx] ||
                      "";

                    return (
                      <div
                        key={item.id || idx}
                        className="p-3.5 rounded-xl bg-[#1A1D26] border border-[#272B38] space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#232734] pb-2">
                          <span className="text-[10px] font-mono text-[#DFD2BD] font-bold">
                            Foto Galeri #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              updateDraft((prev) => {
                                const currentGal = (prev.gallery && prev.gallery.length > 0) ? prev.gallery : galleryList;
                                const newGallery = currentGal.filter((_, i) => i !== idx);
                                const newPreweddings = (prev.general?.preweddingPhotos || []).filter((_, i) => i !== idx);
                                return {
                                  ...prev,
                                  gallery: newGallery,
                                  general: {
                                    ...prev.general,
                                    preweddingPhotos: newPreweddings,
                                  },
                                };
                              });
                            }}
                            className="text-[#8E93A2] hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <PhotoPickerControl
                          label={`Pilihan Foto #${idx + 1}`}
                          value={currentPhotoUrl}
                          onChange={(newUrl) => {
                            updateDraft((prev) => {
                              const baseGal = (prev.gallery && prev.gallery.length > 0) ? [...prev.gallery] : [...galleryList];
                              if (!baseGal[idx]) {
                                baseGal[idx] = {
                                  id: Date.now() + idx,
                                  caption: item.caption || `Foto Kenangan ${idx + 1}`,
                                  tag: "Prewedding",
                                  doodleSticker: "paw",
                                  stickerBg: "#ffffff",
                                  aspectRatio: "portrait",
                                  imageUrl: newUrl,
                                };
                              } else {
                                baseGal[idx] = {
                                  ...baseGal[idx],
                                  imageUrl: newUrl,
                                };
                              }

                              const newPreweddings = [
                                ...(prev.general?.preweddingPhotos || []),
                              ];
                              newPreweddings[idx] = newUrl;

                              return {
                                ...prev,
                                gallery: baseGal,
                                general: {
                                  ...prev.general,
                                  preweddingPhotos: newPreweddings,
                                },
                              };
                            });
                          }}
                          templateId={templateId}
                          slot="gallery"
                          aspectHint="Lokal, Cloud URL, atau Preset"
                        />

                        <div>
                          <label className="text-[10px] font-mono text-[#8E93A2] block mb-1">
                            Keterangan / Caption Foto
                          </label>
                          <input
                            type="text"
                            value={item.caption || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => {
                                const baseGal = (prev.gallery && prev.gallery.length > 0) ? [...prev.gallery] : [...galleryList];
                                if (!baseGal[idx]) {
                                  baseGal[idx] = {
                                    id: Date.now() + idx,
                                    caption: val,
                                    tag: "Prewedding",
                                    doodleSticker: "paw",
                                    stickerBg: "#ffffff",
                                    aspectRatio: "portrait",
                                    imageUrl: currentPhotoUrl,
                                  };
                                } else {
                                  baseGal[idx] = {
                                    ...baseGal[idx],
                                    caption: val,
                                  };
                                }
                                return { ...prev, gallery: baseGal };
                              });
                            }}
                            placeholder="Judul / Caption foto..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-[#DFD2BD]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* 5. GIFTS & ACCOUNTS INSPECTOR */}
            {activeSection === "gifts" && (
              <div className="space-y-4">
                <span className="text-[11px] font-mono text-[#8E93A2] block">
                  Daftar Rekening Bank &amp; Dompet Digital
                </span>
                {(draftData.gifts?.accounts || []).map((acc: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#1A1D26] border border-[#272B38] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#DFD2BD] font-bold">
                        Rekening #{idx + 1}
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[#8E93A2] block mb-0.5">
                        Nama Bank
                      </label>
                      <input
                        type="text"
                        value={acc.bankName}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => {
                            const newAccs = [...(prev.gifts?.accounts || [])];
                            newAccs[idx] = { ...newAccs[idx], bankName: val };
                            return {
                              ...prev,
                              gifts: {
                                physicalGiftAddress: prev.gifts?.physicalGiftAddress || { recipientName: "", phone: "", fullAddress: "" },
                                accounts: newAccs,
                              },
                            };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[#8E93A2] block mb-0.5">
                        Nomor Rekening
                      </label>
                      <input
                        type="text"
                        value={acc.accountNumber}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => {
                            const newAccs = [...(prev.gifts?.accounts || [])];
                            newAccs[idx] = { ...newAccs[idx], accountNumber: val };
                            return {
                              ...prev,
                              gifts: {
                                physicalGiftAddress: prev.gifts?.physicalGiftAddress || { recipientName: "", phone: "", fullAddress: "" },
                                accounts: newAccs,
                              },
                            };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs font-mono text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[#8E93A2] block mb-0.5">
                        Atas Nama
                      </label>
                      <input
                        type="text"
                        value={acc.accountHolder}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => {
                            const newAccs = [...(prev.gifts?.accounts || [])];
                            newAccs[idx] = { ...newAccs[idx], accountHolder: val };
                            return {
                              ...prev,
                              gifts: {
                                physicalGiftAddress: prev.gifts?.physicalGiftAddress || { recipientName: "", phone: "", fullAddress: "" },
                                accounts: newAccs,
                              },
                            };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. RSVP INSPECTOR */}
            {activeSection === "rsvp" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-medium text-[#A6ABB9] block mb-1">
                    Pesan Pembuka RSVP
                  </label>
                  <textarea
                    rows={3}
                    value={draftData.general?.openingMessage || ""}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        general: { ...prev.general, openingMessage: e.target.value },
                      }))
                    }
                    placeholder="Merupakan suatu kehormatan dan kebahagiaan bagi kami..."
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1F28] border border-[#2A2E3D] text-xs text-white focus:outline-none focus:border-[#DFD2BD]"
                  />
                </div>
              </div>
            )}

            {activeSection === "music" && (
              <div className="space-y-5">
                <InvitationMusicSettings
                  appearance="dark"
                  value={draftData.general}
                  onChange={(music) => updateDraft((prev) => ({
                    ...prev,
                    general: { ...prev.general, ...music },
                  }))}
                />
                <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#1A1D26] border border-[#454B5D] cursor-pointer">
                  <span className="text-sm text-white">Putar saat undangan dibuka</span>
                  <input
                    type="checkbox"
                    checked={draftData.themePalette?.musicAutoplay !== false}
                    onChange={(event) => updateDraft((prev) => ({
                      ...prev,
                      themePalette: { ...prev.themePalette, musicAutoplay: event.target.checked },
                    }))}
                    className="w-5 h-5 accent-[#DFD2BD]"
                  />
                </label>
                <p className="text-sm text-[#A6ABB9]">Tekan Simpan &amp; Terapkan untuk memakai lagu ini di undangan.</p>
              </div>
            )}

            {/* 7. THEME & TYPOGRAPHY INSPECTOR */}
            {activeSection === "theme" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-medium text-[#A6ABB9] block mb-1.5">
                    Pilihan Gaya Tipografi Pasangan
                  </label>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {TYPOGRAPHY_OPTIONS.map((f) => {
                      const isSelected = (draftData.themePalette?.fontStyle || "caveat") === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() =>
                            updateDraft((prev) => ({
                              ...prev,
                              themePalette: {
                                ...prev.themePalette,
                                fontStyle: f.id,
                              },
                            }))
                          }
                          className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-[#252A38] border-[#DFD2BD] text-white"
                              : "bg-[#181B23] border-[#252834] text-[#A6ABB9] hover:bg-[#1E222C]"
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold block">{f.name}</span>
                            <span className="text-[10px] font-mono text-[#787D8E]">
                              {f.sampleText}
                            </span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#DFD2BD]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#232734] space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#1A1D26] border border-[#272B38] cursor-pointer">
                    <span className="text-xs text-white">Animasi Partikel Halus</span>
                    <input
                      type="checkbox"
                      checked={draftData.themePalette?.particlesEnabled !== false}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          themePalette: {
                            ...prev.themePalette,
                            particlesEnabled: e.target.checked,
                          },
                        }))
                      }
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                    />
                  </label>

                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full bg-[#161820] rounded-2xl border border-[#2E3344] p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg text-white">
                Perubahan Belum Disimpan
              </h4>
              <p className="text-xs text-[#8E93A2] mt-1.5 leading-relaxed">
                Anda memiliki perubahan draf pada template <strong>{templateMeta.name}</strong>. Jika keluar sekarang tanpa menekan &quot;Simpan &amp; Terapkan&quot;, draf perubahan ini tidak akan diterapkan ke undangan aktif.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowUnsavedModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#232734] hover:bg-[#2F3444] text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Lanjutkan Mengedit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUnsavedModal(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Buang Perubahan &amp; Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateEditorWorkspace;
