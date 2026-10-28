"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { getMusicUrlError, getMusicVolume, type MusicSettingsValue } from "@/lib/musicSettings";
import { FolderOpen, Loader2, Check, Music, Upload, RotateCcw } from "lucide-react";

export function InvitationMusicSettings({
  value,
  onChange,
  appearance = "light",
}: {
  value: MusicSettingsValue;
  onChange: (value: MusicSettingsValue) => void;
  appearance?: "light" | "dark";
}) {
  const id = useId();
  const preview = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = value.musicUrl?.trim() || "";
  const sourceError = getMusicUrlError(source);
  const volume = getMusicVolume(value.musicVolume);
  const dark = appearance === "dark";
  const text = dark ? "text-[#D7DAE2]" : "text-[#343844]";
  const muted = dark ? "text-[#A6ABB9]" : "text-[#626879]";
  const field = `w-full min-h-11 px-3 py-2 rounded-lg border text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9D815B] ${dark ? "bg-[#14161C] border-[#454B5D] text-white" : "bg-white border-[#C9CCD3] text-[#14161C]"}`;

  useEffect(() => {
    if (preview.current) preview.current.volume = volume / 100;
  }, [volume, source]);

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]+/g, " ")
      .trim();

    // Pemutaran instan tanpa jeda melalui URL lokal browser
    const localBlob = URL.createObjectURL(file);
    onChange({
      ...value,
      musicUrl: localBlob,
      musicTitle: value.musicTitle || cleanTitle,
    });
    setFailedSource(null);

    // Unggah ke server Next.js di latar belakang
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onChange({
            ...value,
            musicUrl: data.url,
            musicTitle: value.musicTitle || data.title || cleanTitle,
          });
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
      }
    } catch (err) {
      console.warn("Upload audio ke server gagal, tetap menggunakan sesi lokal:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-4 min-w-0 ${text}`}>
      {/* KARTU PILIH DARI FILE EXPLORER KOMPUTER */}
      <div className={`p-4 rounded-xl border ${dark ? "bg-[#161822] border-[#2E3344]" : "bg-[#F8F9FA] border-[#DCE0E8]"} space-y-2.5`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#9D815B]">
            <FolderOpen className="w-4 h-4" />
            Pilih Berkas dari Komputer (File Explorer)
          </span>
          {isUploading && (
            <span className="text-[11px] font-semibold text-[#9D815B] flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Mengunggah...
            </span>
          )}
          {uploadSuccess && !isUploading && (
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Tersimpan di Server
            </span>
          )}
        </div>
        <p className={`text-xs leading-relaxed ${muted}`}>
          Pilih file lagu (MP3, WAV, M4A, OGG) langsung dari laptop atau PC Anda via File Explorer. Lagu akan langsung tersambung dan siap diputar.
        </p>
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 bg-[#9D815B] hover:bg-[#886F4C] text-white shadow-xs"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan File Audio...</span>
            </>
          ) : (
            <>
              <FolderOpen className="w-4 h-4" />
              <span>Buka File Explorer &amp; Pilih Lagu</span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,audio/m4a,audio/flac,audio/*"
          className="hidden"
          onChange={handleFileChosen}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={`${id}-url`} className="block text-sm font-medium">Tautan audio lagu</label>
          {source && (
            <button
              type="button"
              onClick={() => onChange({ ...value, musicUrl: "", musicTitle: "", musicArtist: "" })}
              className={`text-xs flex items-center gap-1 hover:underline cursor-pointer ${muted}`}
            >
              <RotateCcw className="w-3 h-3" />
              Reset Bawaan
            </button>
          )}
        </div>
        <input
          id={`${id}-url`}
          type="text"
          inputMode="url"
          autoComplete="off"
          value={value.musicUrl || ""}
          onChange={(event) => onChange({ ...value, musicUrl: event.target.value })}
          placeholder="https://domain.com/lagu.mp3 atau /audio/lagu.mp3"
          aria-invalid={Boolean(sourceError)}
          aria-describedby={`${id}-help ${sourceError ? `${id}-error` : ""}`.trim()}
          className={field}
        />
        <div className="flex items-center justify-between mt-2">
          <p id={`${id}-help`} className={`text-xs leading-relaxed ${muted}`}>
            Dapat berupa file dari File Explorer di atas, path lokal <code>/audio/...</code>, atau tautan langsung MP3/WAV.
          </p>
        </div>
        {sourceError && <p id={`${id}-error`} role="alert" className={`text-sm mt-2 ${dark ? "text-red-300" : "text-red-700"}`}>{sourceError}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-title`} className="block text-sm font-medium mb-1.5">Judul lagu</label>
          <input id={`${id}-title`} type="text" value={value.musicTitle} onChange={(event) => onChange({ ...value, musicTitle: event.target.value })} className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-artist`} className="block text-sm font-medium mb-1.5">Penyanyi / artis</label>
          <input id={`${id}-artist`} type="text" value={value.musicArtist} onChange={(event) => onChange({ ...value, musicArtist: event.target.value })} className={field} />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-volume`} className="flex justify-between gap-3 text-sm font-medium">
          Volume musik <output htmlFor={`${id}-volume`}>{volume}%</output>
        </label>
        <input id={`${id}-volume`} type="range" min="0" max="100" step="1" value={volume} onChange={(event) => onChange({ ...value, musicVolume: Number(event.target.value) })} className="block w-full h-11 accent-[#9D815B] cursor-pointer" />
      </div>
      {source && !sourceError ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Dengarkan preview</p>
          <audio key={source} ref={preview} src={source} controls preload="none" aria-label="Preview lagu undangan" className="block w-full max-w-full" onError={() => setFailedSource(source)} />
          {failedSource === source && <p role="status" className={`text-sm ${dark ? "text-red-300" : "text-red-700"}`}>Lagu belum bisa diputar. Periksa apakah tautan membuka berkas audio yang dapat diakses.</p>}
        </div>
      ) : !source ? <p className={`text-sm ${muted}`}>Undangan akan memakai instrumental bawaan.</p> : null}
    </div>
  );
}
