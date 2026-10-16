"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Globe,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  Check,
  Clipboard,
} from "lucide-react";

export interface PhotoPresetItem {
  label: string;
  url: string;
  subtitle?: string;
}

export const TEMPLATE_PHOTO_PRESETS: Record<
  string,
  {
    themeLabel: string;
    cover: PhotoPresetItem[];
    groom: PhotoPresetItem[];
    bride: PhotoPresetItem[];
    gallery: PhotoPresetItem[];
  }
> = {
  "painted-cats": {
    themeLabel: "Purrfect Romance (Cat Doodle)",
    cover: [
      { label: "Duo Kucing Manis", url: "/images/cats/cats-couple.jpg", subtitle: "Stiker Kucing" },
      { label: "Potret Couple Kasih", url: "/images/prewedding/couple-1.jpg", subtitle: "Foto Alami" },
      { label: "Potret Kasih 3", url: "/images/prewedding/couple-3.jpg", subtitle: "Foto Alami" },
      { label: "Potret Kasih 4", url: "/images/prewedding/couple-4.jpg", subtitle: "Foto Alami" },
    ],
    groom: [
      { label: "Kucing Oranye (Groom)", url: "/images/cats/orange-cat-groom.jpg", subtitle: "Stiker Kucing" },
      { label: "Potret Mempelai Pria", url: "/images/prewedding/couple-3.jpg", subtitle: "Foto Asli" },
      { label: "Potret Mempelai Studio", url: "/images/prewedding/couple-1.jpg", subtitle: "Foto Asli" },
    ],
    bride: [
      { label: "Kucing Putih (Bride)", url: "/images/cats/white-cat-bride.jpg", subtitle: "Stiker Kucing" },
      { label: "Potret Mempelai Wanita", url: "/images/prewedding/couple-4.jpg", subtitle: "Foto Asli" },
      { label: "Potret Mempelai Studio", url: "/images/prewedding/couple-2.jpg", subtitle: "Foto Asli" },
    ],
    gallery: [
      { label: "Duo Kucing Kasih", url: "/images/cats/cats-couple.jpg", subtitle: "Stiker Kucing" },
      { label: "Kucing Oranye", url: "/images/cats/orange-cat-groom.jpg", subtitle: "Stiker Kucing" },
      { label: "Kucing Putih", url: "/images/cats/white-cat-bride.jpg", subtitle: "Stiker Kucing" },
      { label: "Potret 1", url: "/images/prewedding/couple-1.jpg", subtitle: "Prewedding" },
      { label: "Potret 2", url: "/images/prewedding/couple-2.jpg", subtitle: "Prewedding" },
      { label: "Potret 3", url: "/images/prewedding/couple-3.jpg", subtitle: "Prewedding" },
    ],
  },
  "paper-art-maroon": {
    themeLabel: "2D Paper Art Craft",
    cover: [
      { label: "Sketsa Maroon Romantis", url: "/images/prewedding/couple-3.jpg", subtitle: "Sketsa Kertas" },
      { label: "Gading Scrapbook", url: "/images/prewedding/couple-1.jpg", subtitle: "Sketsa Kertas" },
      { label: "Nostalgia Gading", url: "/images/prewedding/couple-4.jpg", subtitle: "Sketsa Kertas" },
      { label: "Sunset Maroon", url: "/images/prewedding/couple-2.jpg", subtitle: "Sketsa Kertas" },
    ],
    groom: [
      { label: "Potret Groom Mat Kertas", url: "/images/prewedding/couple-3.jpg", subtitle: "Deckle Mat" },
      { label: "Potret Groom Studio", url: "/images/prewedding/couple-1.jpg", subtitle: "Deckle Mat" },
    ],
    bride: [
      { label: "Potret Bride Mat Kertas", url: "/images/prewedding/couple-4.jpg", subtitle: "Deckle Mat" },
      { label: "Potret Bride Studio", url: "/images/prewedding/couple-2.jpg", subtitle: "Deckle Mat" },
    ],
    gallery: [
      { label: "Kenangan 1", url: "/images/prewedding/couple-1.jpg", subtitle: "Paper Sketch" },
      { label: "Kenangan 2", url: "/images/prewedding/couple-2.jpg", subtitle: "Paper Sketch" },
      { label: "Kenangan 3", url: "/images/prewedding/couple-3.jpg", subtitle: "Paper Sketch" },
      { label: "Kenangan 4", url: "/images/prewedding/couple-4.jpg", subtitle: "Paper Sketch" },
      { label: "Kenangan 5", url: "/images/prewedding/couple-5.jpg", subtitle: "Paper Sketch" },
    ],
  },
  "ambient-blur": {
    themeLabel: "Ambient Chroma",
    cover: [
      { label: "Golden Sunset Glow", url: "/images/prewedding/couple-1.jpg", subtitle: "Ekstrak Emas" },
      { label: "Warm Earthy Sunset", url: "/images/prewedding/couple-2.jpg", subtitle: "Ekstrak Hangat" },
      { label: "Emerald Soft Vibe", url: "/images/prewedding/couple-3.jpg", subtitle: "Ekstrak Hijau" },
      { label: "Twilight Deep Azure", url: "/images/prewedding/couple-4.jpg", subtitle: "Ekstrak Biru" },
      { label: "Editorial Monochrome", url: "/images/prewedding/couple-5.jpg", subtitle: "Ekstrak Netral" },
    ],
    groom: [
      { label: "Potret Mempelai Pria", url: "/images/prewedding/couple-3.jpg", subtitle: "Ambient Vibe" },
      { label: "Studio Pria", url: "/images/prewedding/couple-1.jpg", subtitle: "Ambient Vibe" },
    ],
    bride: [
      { label: "Potret Mempelai Wanita", url: "/images/prewedding/couple-4.jpg", subtitle: "Ambient Vibe" },
      { label: "Studio Wanita", url: "/images/prewedding/couple-2.jpg", subtitle: "Ambient Vibe" },
    ],
    gallery: [
      { label: "Ambient Photo 1", url: "/images/prewedding/couple-1.jpg", subtitle: "Adaptif" },
      { label: "Ambient Photo 2", url: "/images/prewedding/couple-2.jpg", subtitle: "Adaptif" },
      { label: "Ambient Photo 3", url: "/images/prewedding/couple-3.jpg", subtitle: "Adaptif" },
      { label: "Ambient Photo 4", url: "/images/prewedding/couple-4.jpg", subtitle: "Adaptif" },
      { label: "Ambient Photo 5", url: "/images/prewedding/couple-5.jpg", subtitle: "Adaptif" },
    ],
  },
  "cinematic-blur": {
    themeLabel: "Ethereal Dreamscape",
    cover: [
      { label: "Widescreen Sunset 2.39:1", url: "/images/prewedding/couple-1.jpg", subtitle: "Sinematik" },
      { label: "Dramatic Flare", url: "/images/prewedding/couple-2.jpg", subtitle: "Sinematik" },
      { label: "Moody Nightscape", url: "/images/prewedding/couple-5.jpg", subtitle: "Sinematik" },
    ],
    groom: [
      { label: "Groom Cinema Cut", url: "/images/prewedding/couple-3.jpg", subtitle: "Sinematik" },
      { label: "Groom Close-Up", url: "/images/prewedding/couple-1.jpg", subtitle: "Sinematik" },
    ],
    bride: [
      { label: "Bride Cinema Cut", url: "/images/prewedding/couple-4.jpg", subtitle: "Sinematik" },
      { label: "Bride Close-Up", url: "/images/prewedding/couple-2.jpg", subtitle: "Sinematik" },
    ],
    gallery: [
      { label: "Shot 1", url: "/images/prewedding/couple-1.jpg", subtitle: "Widescreen" },
      { label: "Shot 2", url: "/images/prewedding/couple-2.jpg", subtitle: "Widescreen" },
      { label: "Shot 3", url: "/images/prewedding/couple-3.jpg", subtitle: "Widescreen" },
      { label: "Shot 4", url: "/images/prewedding/couple-4.jpg", subtitle: "Widescreen" },
      { label: "Shot 5", url: "/images/prewedding/couple-5.jpg", subtitle: "Widescreen" },
    ],
  },
  "royal-heritage": {
    themeLabel: "Royal Heritage",
    cover: [
      { label: "Kemegahan Keraton", url: "/images/prewedding/couple-2.jpg", subtitle: "Royal Gold" },
      { label: "Zamrud Keagungan", url: "/images/prewedding/couple-3.jpg", subtitle: "Royal Gold" },
      { label: "Tradisi Kasih", url: "/images/prewedding/couple-1.jpg", subtitle: "Royal Gold" },
    ],
    groom: [
      { label: "Potret Resmi Groom", url: "/images/prewedding/couple-3.jpg", subtitle: "Frame Arch" },
      { label: "Potret Adat Groom", url: "/images/prewedding/couple-1.jpg", subtitle: "Frame Arch" },
    ],
    bride: [
      { label: "Potret Resmi Bride", url: "/images/prewedding/couple-4.jpg", subtitle: "Frame Arch" },
      { label: "Potret Adat Bride", url: "/images/prewedding/couple-2.jpg", subtitle: "Frame Arch" },
    ],
    gallery: [
      { label: "Dokumentasi 1", url: "/images/prewedding/couple-1.jpg", subtitle: "Royal Heritage" },
      { label: "Dokumentasi 2", url: "/images/prewedding/couple-2.jpg", subtitle: "Royal Heritage" },
      { label: "Dokumentasi 3", url: "/images/prewedding/couple-3.jpg", subtitle: "Royal Heritage" },
      { label: "Dokumentasi 4", url: "/images/prewedding/couple-4.jpg", subtitle: "Royal Heritage" },
      { label: "Dokumentasi 5", url: "/images/prewedding/couple-5.jpg", subtitle: "Royal Heritage" },
    ],
  },
  "cityscape-skyline": {
    themeLabel: "Cityscape Urban Romance",
    cover: [
      { label: "Panorama Metropolitan", url: "/images/prewedding/couple-1.jpg", subtitle: "Urban View" },
      { label: "Skyline High-Rise", url: "/images/prewedding/couple-4.jpg", subtitle: "Urban View" },
      { label: "Modern Rooftop", url: "/images/prewedding/couple-3.jpg", subtitle: "Urban View" },
    ],
    groom: [
      { label: "Urban Groom Portrait", url: "/images/prewedding/couple-3.jpg", subtitle: "Urban Profile" },
      { label: "Metropolitan Groom", url: "/images/prewedding/couple-1.jpg", subtitle: "Urban Profile" },
    ],
    bride: [
      { label: "Urban Bride Portrait", url: "/images/prewedding/couple-4.jpg", subtitle: "Urban Profile" },
      { label: "Metropolitan Bride", url: "/images/prewedding/couple-2.jpg", subtitle: "Urban Profile" },
    ],
    gallery: [
      { label: "City Story 1", url: "/images/prewedding/couple-1.jpg", subtitle: "Urban Romance" },
      { label: "City Story 2", url: "/images/prewedding/couple-2.jpg", subtitle: "Urban Romance" },
      { label: "City Story 3", url: "/images/prewedding/couple-3.jpg", subtitle: "Urban Romance" },
      { label: "City Story 4", url: "/images/prewedding/couple-4.jpg", subtitle: "Urban Romance" },
      { label: "City Story 5", url: "/images/prewedding/couple-5.jpg", subtitle: "Urban Romance" },
    ],
  },
};

export interface PhotoPickerControlProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  templateId: string;
  slot: "cover" | "groom" | "bride" | "gallery";
  helpText?: string;
  aspectHint?: string;
}

export function PhotoPickerControl({
  label,
  value,
  onChange,
  templateId,
  slot,
  helpText,
  aspectHint,
}: PhotoPickerControlProps) {
  const getInitialTab = (): "local" | "cloud" | "preset" => {
    if (value?.startsWith("data:")) return "local";
    if (value?.startsWith("http://") || value?.startsWith("https://")) return "cloud";
    return "preset";
  };

  const [activeTab, setActiveTab] = useState<"local" | "cloud" | "preset">(getInitialTab);
  const [cloudInput, setCloudInput] = useState<string>(
    value?.startsWith("http") ? value : ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetsConfig = TEMPLATE_PHOTO_PRESETS[templateId] || TEMPLATE_PHOTO_PRESETS["ambient-blur"];
  const slotPresets = presetsConfig[slot] || [];

  const getSourceBadge = () => {
    if (!value) {
      return { text: "Kosong", bg: "bg-zinc-800 text-zinc-400 border-zinc-700" };
    }
    if (value.startsWith("data:")) {
      return { text: "Berkas Lokal", bg: "bg-emerald-950 text-emerald-300 border-emerald-700/50" };
    }
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return { text: "Cloud URL", bg: "bg-sky-950 text-sky-300 border-sky-700/50" };
    }
    return { text: "Preset Tema", bg: "bg-amber-950 text-amber-300 border-amber-700/50" };
  };

  const badge = getSourceBadge();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCloudUrl = () => {
    const trimmed = cloudInput.trim();
    if (trimmed) {
      onChange(trimmed);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setCloudInput(text);
          onChange(text.trim());
        }
      }
    } catch {
    }
  };

  return (
    <div className="p-3.5 rounded-xl bg-[#1A1D26] border border-[#272B38] space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <label className="text-xs font-mono font-medium text-white block truncate">
            {label}
          </label>
          {aspectHint && (
            <span className="text-[10px] font-mono text-[#787D8E]">
              {aspectHint}
            </span>
          )}
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[9px] font-mono border font-semibold shrink-0 ${badge.bg}`}
        >
          {badge.text}
        </span>
      </div>

      {helpText && (
        <p className="text-[11px] text-[#8E93A2] leading-relaxed">
          {helpText}
        </p>
      )}

      <div className="flex items-center gap-3 p-2 rounded-lg bg-[#14161C] border border-[#222530]">
        <div className="w-14 h-14 rounded-lg bg-[#0F1116] border border-[#292D3B] overflow-hidden flex items-center justify-center shrink-0 relative">
          {value ? (
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-[#5A6072]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-mono text-zinc-300 truncate">
            {value ? (value.startsWith("data:") ? "Berkas gambar dari perangkat lokal" : value) : "Belum ada foto yang dipilih"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setCloudInput("");
                }}
                className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Hapus Foto</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 bg-[#12141A] p-1 rounded-lg border border-[#222633]">
        <button
          type="button"
          onClick={() => setActiveTab("local")}
          className={`py-1.5 px-2 rounded-md text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "local"
              ? "bg-[#242836] text-white shadow-xs"
              : "text-[#7B8092] hover:text-zinc-200"
          }`}
        >
          <Upload className="w-3 h-3 text-emerald-400" />
          <span>Lokal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cloud")}
          className={`py-1.5 px-2 rounded-md text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "cloud"
              ? "bg-[#242836] text-white shadow-xs"
              : "text-[#7B8092] hover:text-zinc-200"
          }`}
        >
          <Globe className="w-3 h-3 text-sky-400" />
          <span>Cloud URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preset")}
          className={`py-1.5 px-2 rounded-md text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "preset"
              ? "bg-[#242836] text-white shadow-xs"
              : "text-[#7B8092] hover:text-zinc-200"
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Preset</span>
        </button>
      </div>

      {activeTab === "local" && (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-3 rounded-xl border border-dashed border-[#343A4D] hover:border-emerald-500/70 bg-[#161821] hover:bg-[#1A1D27] text-zinc-300 text-xs font-mono flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
          >
            <Upload className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white">Pilih Berkas dari Komputer</span>
            <span className="text-[10px] text-[#717688]">JPG, PNG, WebP (langsung aktif di kanvas)</span>
          </button>
        </div>
      )}

      {activeTab === "cloud" && (
        <div className="space-y-2">
          <div className="flex gap-1.5">
            <input
              type="url"
              value={cloudInput}
              onChange={(e) => {
                setCloudInput(e.target.value);
                onChange(e.target.value);
              }}
              placeholder="https://domain.com/foto-wedding.jpg"
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#2A2E3D] text-xs text-white placeholder-[#5A6072] focus:outline-none focus:border-sky-400"
            />
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="px-2.5 py-1.5 rounded-lg bg-[#1F232E] hover:bg-[#282D3B] text-zinc-300 border border-[#2B303E] text-xs flex items-center gap-1 cursor-pointer"
              title="Tempel dari Clipboard"
            >
              <Clipboard className="w-3 h-3" />
              <span className="text-[10px] font-mono hidden sm:inline">Tempel</span>
            </button>
          </div>
          <p className="text-[10px] font-mono text-[#787D8E]">
            Mendukung tautan foto dari Supabase, Cloudinary, AWS S3, Google Drive, atau Unsplash.
          </p>
        </div>
      )}

      {activeTab === "preset" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8E93A2]">
            <span>Preset Rekomendasi Tema</span>
            <span className="text-[#DFD2BD] font-semibold">{presetsConfig.themeLabel}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {slotPresets.map((preset, idx) => {
              const isSelected = value === preset.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? "bg-[#252A38] border-amber-400/80 text-white shadow-xs"
                      : "bg-[#14161C] border-[#252834] text-[#A6ABB9] hover:bg-[#1C202A] hover:text-white"
                  }`}
                >
                  <div className="w-9 h-9 rounded-md overflow-hidden bg-black/40 shrink-0 border border-white/10 relative">
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white drop-shadow-xs" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold block truncate leading-tight">
                      {preset.label}
                    </span>
                    {preset.subtitle && (
                      <span className="text-[9px] font-mono text-[#787D8E] block truncate">
                        {preset.subtitle}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
