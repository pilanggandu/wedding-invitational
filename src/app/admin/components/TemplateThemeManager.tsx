"use client";

import React, { useState } from "react";
import { Check, Sparkles, Music, Eye, Palette, Type } from "lucide-react";
import { WeddingInvitationData } from "@/types/wedding";
import { AVAILABLE_TEMPLATES } from "@/data/templates";
import { saveInvitationData } from "@/lib/invitationStore";

interface TemplateThemeManagerProps {
  data: WeddingInvitationData;
  onUpdate: (updated: WeddingInvitationData) => void;
  onOpenPreview: () => void;
}

export function TemplateThemeManager({
  data,
  onUpdate,
  onOpenPreview,
}: TemplateThemeManagerProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    data.activeTemplateId || "paper-art-maroon"
  );
  const [fontStyle, setFontStyle] = useState<"caveat" | "dancing" | "great-vibes">(
    data.themePalette?.fontStyle || "caveat"
  );
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(
    data.themePalette?.particlesEnabled ?? true
  );
  const [musicAutoplay, setMusicAutoplay] = useState<boolean>(
    data.themePalette?.musicAutoplay ?? true
  );
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const updated: WeddingInvitationData = {
      ...data,
      activeTemplateId: id,
    };
    saveInvitationData(updated);
    onUpdate(updated);
    showNotice();
  };

  const handleSaveThemeSettings = () => {
    const updated: WeddingInvitationData = {
      ...data,
      activeTemplateId: selectedTemplateId,
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border-2 border-[#7D1128]/20 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFF0F3] text-[#7D1128] mb-1">
            <Palette className="w-3.5 h-3.5" />
            Katalog Desain & Gaya Visual
          </div>
          <h2 className="font-sans font-bold text-xl text-[#4A0812]">
            Manajemen Template & Tema
          </h2>
          <p className="text-xs text-[#7D1128]">
            Pilih tema tampilan undangan pernikahan dan sesuaikan preferensi estetika.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-300 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Perubahan Disimpan!
            </span>
          )}
          <button
            onClick={onOpenPreview}
            className="px-4 py-2.5 rounded-xl bg-[#FFE58F] hover:bg-[#FFD966] text-[#4A0812] font-mono font-bold text-xs flex items-center gap-2 transition-transform hover:scale-105 shadow-xs cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#7D1128]" />
            <span>Lihat Live Preview</span>
          </button>
        </div>
      </div>

      {/* Template Selection Cards */}
      <div className="space-y-4">
        <h3 className="font-sans font-bold text-base text-[#4A0812] flex items-center gap-2">
          <span>1. Pilihan Template Tersedia</span>
          <span className="text-xs font-mono font-normal text-[#7D1128]">
            ({AVAILABLE_TEMPLATES.length} Template)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AVAILABLE_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplateId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`relative bg-white rounded-3xl p-5 border-3 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#7D1128] shadow-[0_8px_24px_rgba(125,17,40,0.18)] scale-[1.02]"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* Active selection badge */}
                {isSelected && (
                  <div className="absolute -top-3 right-6 bg-[#7D1128] text-white text-[11px] font-mono font-bold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10">
                    <Check className="w-3.5 h-3.5 text-[#FFE58F]" />
                    <span>Aktif Digunakan</span>
                  </div>
                )}

                <div>
                  {/* Banner Gradient Mockup */}
                  <div
                    className={`h-36 rounded-2xl bg-gradient-to-tr ${tmpl.previewGradient} p-4 flex flex-col justify-between text-white shadow-inner relative overflow-hidden mb-4`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                        {tmpl.category}
                      </span>
                      <span className="text-xs">{tmpl.tag}</span>
                    </div>

                    <div className="text-center my-auto">
                      <p className="font-handwriting text-2xl text-white drop-shadow-md">
                        Gilang & Salsadila
                      </p>
                      <p className="text-[10px] font-mono text-[#FFE58F]">
                        21 November 2026
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
                      <span>Paper Art Craft</span>
                      <span>12:12 💖</span>
                    </div>
                  </div>

                  <h4 className="font-sans font-bold text-base text-[#4A0812]">
                    {tmpl.name}
                  </h4>
                  <p className="text-xs text-[#7D1128] mt-1.5 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    Aksen: <strong style={{ color: tmpl.accentHex }}>{tmpl.accentHex}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(tmpl.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#7D1128] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "Sedang Aktif" : "Terapkan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme Typography & Experience Controls */}
      <div className="bg-white rounded-2xl p-6 border-2 border-[#7D1128]/20 shadow-xs space-y-6">
        <h3 className="font-sans font-bold text-base text-[#4A0812] flex items-center gap-2">
          <Type className="w-4 h-4 text-[#7D1128]" />
          <span>2. Preferensi Tipografi & Efek Animasi</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Font Selector */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#7D1128] mb-2">
              Gaya Font Handwriting (Nama Pasangan)
            </label>
            <div className="space-y-2.5">
              {[
                {
                  id: "caveat",
                  label: "Caveat (Rekomendasi Utama)",
                  desc: "Gaya tulisan tangan santai, ramah, dan sangat estetik pada tema scrapbook kertas.",
                  sample: "Gilang & Salsadila",
                  fontClass: "font-handwriting",
                },
                {
                  id: "dancing",
                  label: "Dancing Script (Kaligrafi Halus)",
                  desc: "Sentuhan kursif anggun dengan ritme mengalir manis.",
                  sample: "Gilang & Salsadila",
                  fontClass: "font-script",
                },
                {
                  id: "great-vibes",
                  label: "Great Vibes (Formal Klasik)",
                  desc: "Gaya kaligrafi elegan dan formal untuk nuansa megah.",
                  sample: "Gilang & Salsadila",
                  fontClass: "font-serif",
                },
              ].map((f) => (
                <label
                  key={f.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    fontStyle === f.id
                      ? "border-[#7D1128] bg-[#FFF0F3]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="fontStyle"
                    value={f.id}
                    checked={fontStyle === f.id}
                    onChange={() => setFontStyle(f.id as any)}
                    className="mt-1 accent-[#7D1128]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-xs text-[#4A0812]">
                        {f.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7D1128] mt-0.5">{f.desc}</p>
                    <p className={`text-xl text-[#7D1128] mt-1.5 ${f.fontClass}`}>
                      {f.sample}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Interactive Toggles */}
          <div className="space-y-4">
            <label className="block text-xs font-mono font-bold uppercase text-[#7D1128]">
              Efek Visual & Interaksi Pengunjung
            </label>

            {/* Falling Particles Toggle */}
            <div className="p-4 rounded-xl border-2 border-slate-200 bg-[#FFF9FA] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D63D56]" />
                  <span className="font-sans font-bold text-xs text-[#4A0812]">
                    Hujan Kelopak Cinta & Bintang (Particles)
                  </span>
                </div>
                <p className="text-[11px] text-[#7D1128] mt-1 leading-relaxed">
                  Menampilkan animasi lembut kelopak cinta hati dan bintang kertas melayang di layar undangan.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={particlesEnabled}
                  onChange={(e) => setParticlesEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1128]" />
              </label>
            </div>

            {/* Music Autoplay Toggle */}
            <div className="p-4 rounded-xl border-2 border-slate-200 bg-[#FFF9FA] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#7D1128]" />
                  <span className="font-sans font-bold text-xs text-[#4A0812]">
                    Autoplay Musik Saat Buka Amplop
                  </span>
                </div>
                <p className="text-[11px] text-[#7D1128] mt-1 leading-relaxed">
                  Secara otomatis memutar lagu pengiring lembut saat tamu mengklik tombol &ldquo;Buka Undangan&rdquo;.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={musicAutoplay}
                  onChange={(e) => setMusicAutoplay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7D1128]" />
              </label>
            </div>

            {/* Save Button for Theme Options */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveThemeSettings}
                className="w-full py-3 rounded-xl bg-[#7D1128] hover:bg-[#660F1A] text-white font-mono font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-[#FFE58F]" />
                <span>Simpan Pengaturan Tema & Tipografi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
