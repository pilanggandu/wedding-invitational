"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Save,
  Loader2,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Heart,
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Palette,
  Sparkles,
} from "lucide-react";
import { WeddingInvitationData } from "@/types/wedding";
import { saveInvitationData } from "@/lib/invitationStore";
import { extractColorsFromImage, ExtractedColors, FALLBACK_PALETTE } from "@/lib/colorExtractor";

interface CoupleEventManagerProps {
  data: WeddingInvitationData;
  onUpdate: (updated: WeddingInvitationData) => void;
}

export function CoupleEventManager({ data, onUpdate }: CoupleEventManagerProps) {
  // Groom states
  const [groomName, setGroomName] = useState(data.couple?.groom?.name || "");
  const [groomFullName, setGroomFullName] = useState(data.couple?.groom?.fullName || "");
  const [groomParents, setGroomParents] = useState(data.couple?.groom?.parents || "");
  const [groomInstagram, setGroomInstagram] = useState(data.couple?.groom?.instagram || "");
  const [groomTagline, setGroomTagline] = useState(data.couple?.groom?.tagline || "");
  const [groomPhotoUrl, setGroomPhotoUrl] = useState(
    data.couple?.groom?.photoUrl || "/images/prewedding/couple-3.jpg"
  );

  // Bride states
  const [brideName, setBrideName] = useState(data.couple?.bride?.name || "");
  const [brideFullName, setBrideFullName] = useState(data.couple?.bride?.fullName || "");
  const [brideParents, setBrideParents] = useState(data.couple?.bride?.parents || "");
  const [brideInstagram, setBrideInstagram] = useState(data.couple?.bride?.instagram || "");
  const [brideTagline, setBrideTagline] = useState(data.couple?.bride?.tagline || "");
  const [bridePhotoUrl, setBridePhotoUrl] = useState(
    data.couple?.bride?.photoUrl || "/images/prewedding/couple-4.jpg"
  );

  // Photos & Album states
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(
    data.general?.coverPhotoUrl || "/images/prewedding/couple-1.jpg"
  );
  const [preweddingPhotos, setPreweddingPhotos] = useState<string[]>(
    data.general?.preweddingPhotos && data.general.preweddingPhotos.length > 0
      ? data.general.preweddingPhotos
      : [
          "/images/prewedding/couple-1.jpg",
          "/images/prewedding/couple-2.jpg",
          "/images/prewedding/couple-3.jpg",
          "/images/prewedding/couple-4.jpg",
          "/images/prewedding/couple-5.jpg",
        ]
  );
  const [newPhotoInput, setNewPhotoInput] = useState("");
  const [extractedPreview, setExtractedPreview] = useState<ExtractedColors | null>(null);
  const [previewingPhotoSrc, setPreviewingPhotoSrc] = useState<string>(
    coverPhotoUrl || "/images/prewedding/couple-1.jpg"
  );

  // Extract color sample on photo change
  useEffect(() => {
    if (!previewingPhotoSrc) return;
    let isMounted = true;
    extractColorsFromImage(previewingPhotoSrc).then((colors) => {
      if (isMounted) setExtractedPreview(colors);
    });
    return () => {
      isMounted = false;
    };
  }, [previewingPhotoSrc]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setter(reader.result);
        setPreviewingPhotoSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPreweddingPhoto = () => {
    if (!newPhotoInput.trim()) return;
    setPreweddingPhotos((prev) => [...prev, newPhotoInput.trim()]);
    setPreviewingPhotoSrc(newPhotoInput.trim());
    setNewPhotoInput("");
  };

  const handleRemovePreweddingPhoto = (idxToRemove: number) => {
    setPreweddingPhotos((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Events
  const akad = data.events[0] || {} as any;
  const resepsi = data.events[1] || akad || {} as any;

  const [akadDay, setAkadDay] = useState(akad.displayDay || "Sabtu");
  const [akadDate, setAkadDate] = useState(akad.displayDate || "28 November 2026");
  const [akadTime, setAkadTime] = useState(akad.time || "08:00 - 10:00 WIB");
  const [akadVenue, setAkadVenue] = useState(akad.venueName || "Kediaman Mempelai Wanita");
  const [akadAddress, setAkadAddress] = useState(akad.venueAddress || "Merakurak, Tuban, Jawa Timur");
  const [akadMapUrl, setAkadMapUrl] = useState(akad.mapUrl || "https://maps.google.com");

  const [resepsiDay, setResepsiDay] = useState(resepsi.displayDay || "Sabtu");
  const [resepsiDate, setResepsiDate] = useState(resepsi.displayDate || "28 November 2026");
  const [resepsiTime, setResepsiTime] = useState(resepsi.time || "11:00 - Selesai");
  const [resepsiVenue, setResepsiVenue] = useState(resepsi.venueName || "Gedung Serbaguna Merakurak");
  const [resepsiAddress, setResepsiAddress] = useState(resepsi.venueAddress || "Jl. Raya Merakurak, Tuban, Jawa Timur");
  const [resepsiMapUrl, setResepsiMapUrl] = useState(resepsi.mapUrl || "https://maps.google.com");

  // General details
  const [funTagline, setFunTagline] = useState(
    data.general?.funTagline || "Menemukan cinta itu mudah, tapi menemukan yang sefrekuensi itu anugerah!"
  );
  const [hashtag, setHashtag] = useState(data.general?.hashtag || "");
  const [closingMessage, setClosingMessage] = useState(
    data.general?.closingMessage ||
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami."
  );

  // Bank accounts
  const acc1 = data.gifts?.accounts?.[0] || { bankName: "BCA", accountNumber: "", accountHolder: "" };
  const acc2 = data.gifts?.accounts?.[1] || { bankName: "Mandiri", accountNumber: "", accountHolder: "" };

  const [bank1Name, setBank1Name] = useState(acc1.bankName);
  const [bank1Number, setBank1Number] = useState(acc1.accountNumber);
  const [bank1Holder, setBank1Holder] = useState(acc1.accountHolder);

  const [bank2Name, setBank2Name] = useState(acc2.bankName);
  const [bank2Number, setBank2Number] = useState(acc2.accountNumber);
  const [bank2Holder, setBank2Holder] = useState(acc2.accountHolder);

  const [physicalAddress, setPhysicalAddress] = useState(
    data.gifts?.physicalGiftAddress?.address || "Merakurak, Tuban, Jawa Timur"
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setSaveError(null);

    // Validasi eksplisit sebelum submit
    if (!groomName.trim()) {
      const msg = "Nama panggilan mempelai pria wajib diisi.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 4000);
      return;
    }
    if (!groomFullName.trim()) {
      const msg = "Nama lengkap mempelai pria wajib diisi.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 4000);
      return;
    }
    if (!brideName.trim()) {
      const msg = "Nama panggilan mempelai wanita wajib diisi.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 4000);
      return;
    }
    if (!brideFullName.trim()) {
      const msg = "Nama lengkap mempelai wanita wajib diisi.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 4000);
      return;
    }

    setIsSaving(true);

    try {
      const updated: WeddingInvitationData = {
        ...data,
        couple: {
          ...data.couple,
          groom: {
            ...data.couple.groom,
            name: groomName.trim(),
            fullName: groomFullName.trim(),
            parents: groomParents.trim(),
            instagram: groomInstagram.trim().replace(/^@/, ""),
            tagline: groomTagline.trim(),
            photoUrl: groomPhotoUrl.trim(),
          },
          bride: {
            ...data.couple.bride,
            name: brideName.trim(),
            fullName: brideFullName.trim(),
            parents: brideParents.trim(),
            instagram: brideInstagram.trim().replace(/^@/, ""),
            tagline: brideTagline.trim(),
            photoUrl: bridePhotoUrl.trim(),
          },
        },
        general: {
          ...data.general,
          funTagline: funTagline.trim(),
          hashtag: hashtag.trim(),
          closingMessage: closingMessage.trim(),
          coverPhotoUrl: coverPhotoUrl.trim(),
          heroPhotoUrl: coverPhotoUrl.trim(),
          preweddingPhotos: preweddingPhotos,
        },
        events: [
          {
            ...(data.events[0] || {}),
            id: "event_akad",
            title: "Akad Nikah",
            subTitle: "Momen Sakral Ijab Kabul",
            badgeCute: "Momen Paling Sakral",
            colorTheme: "red",
            dateStr: "2026-11-28",
            displayDate: akadDate.trim(),
            displayDay: akadDay.trim(),
            time: akadTime.trim(),
            venueName: akadVenue.trim(),
            venueAddress: akadAddress.trim(),
            mapUrl: akadMapUrl.trim(),
            calendarEvent: {
              title: `Akad Nikah ${groomName.trim()} & ${brideName.trim()}`,
              description: `Akad Nikah ${groomFullName.trim()} & ${brideFullName.trim()}`,
              location: akadAddress.trim(),
              startDate: "20261128T010000Z",
              endDate: "20261128T030000Z",
            },
          },
          {
            ...(data.events[1] || {}),
            id: "event_resepsi",
            title: "Resepsi Pernikahan",
            subTitle: "Pesta Syukuran & Temu Kangen",
            badgeCute: "Pesta Bahagia & Temu Syukuran",
            colorTheme: "yellow",
            dateStr: "2026-11-28",
            displayDate: resepsiDate.trim(),
            displayDay: resepsiDay.trim(),
            time: resepsiTime.trim(),
            venueName: resepsiVenue.trim(),
            venueAddress: resepsiAddress.trim(),
            mapUrl: resepsiMapUrl.trim(),
            calendarEvent: {
              title: `Resepsi Pernikahan ${groomName.trim()} & ${brideName.trim()}`,
              description: `Pesta Resepsi ${groomFullName.trim()} & ${brideFullName.trim()}`,
              location: resepsiAddress.trim(),
              startDate: "20261128T040000Z",
              endDate: "20261128T090000Z",
            },
          },
        ],
        gifts: {
          accounts: [
            {
              bankName: bank1Name.trim(),
              accountNumber: bank1Number.trim(),
              accountHolder: bank1Holder.trim(),
              logoText: bank1Name.trim(),
              cuteLabel: `Rekening ${groomName.trim()}`,
              cardColor: "maroon",
            },
            {
              bankName: bank2Name.trim(),
              accountNumber: bank2Number.trim(),
              accountHolder: bank2Holder.trim(),
              logoText: bank2Name.trim(),
              cuteLabel: `Rekening ${brideName.trim()}`,
              cardColor: "gold",
            },
          ],
          physicalGiftAddress: {
            recipient: `${groomName.trim()} & ${brideName.trim()}`,
            phone: "081234567890",
            address: physicalAddress.trim(),
          },
        },
      };

      const serverSaved = await saveInvitationData(updated);
      onUpdate(updated);

      setIsSaved(true);
      setToastNotification({
        text: serverSaved
          ? "Seluruh data mempelai & acara berhasil disimpan ke server!"
          : "Data tersimpan di penyimpanan lokal browser.",
        type: "success",
      });

      setTimeout(() => setIsSaved(false), 3500);
      setTimeout(() => setToastNotification(null), 4000);
    } catch (err: any) {
      console.error("Error saving wedding data:", err);
      const msg = err?.message || "Gagal menyimpan data ke server. Periksa koneksi Anda.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 animate-in fade-in duration-300"
    >
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] sticky top-4 z-20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#888D9C] font-medium">
              DATA PERSONALISASI INTI
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#14161C] tracking-tight">
            Data Mempelai, Acara &amp; Rekening
          </h2>
          <p className="text-xs text-[#717686] mt-1 font-sans">
            Perbarui data lengkap kedua mempelai, susunan jadwal acara, rekening amplop, dan pesan penutup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveError && (
            <span className="text-xs font-medium text-[#B91C1C] bg-[#FEF2F2] px-3.5 py-1.5 rounded-xl border border-[#FCA5A5] flex items-center gap-1.5 animate-in fade-in">
              {saveError}
            </span>
          )}
          {isSaved && (
            <span className="text-xs font-medium text-[#24623E] bg-[#F3F8F5] px-3.5 py-1.5 rounded-xl border border-[#D4EADB] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-[#2E7A4A]" />
              Tersimpan Sukses!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#14161C] hover:bg-[#232734] disabled:opacity-75 disabled:cursor-not-allowed text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 text-[#DFD2BD] animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4 text-[#2E7A4A]" />
                <span className="text-[#DFD2BD]">Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#DFD2BD]" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Groom & Bride Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mempelai Pria */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F0F0EA]">
            <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
              <User className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
                Profil Mempelai Pria (Groom)
              </h3>
              <p className="text-[11px] text-[#717686]">
                Identitas dan keluarga mempelai pria
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Dimas"
                required
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Dimas Pratama, S.Kom."
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Orang Tua / Keluarga
              </label>
              <input
                type="text"
                value={groomParents}
                onChange={(e) => setGroomParents(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Putra pertama dari Bpk. Bambang &amp; Ibu Sri"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Instagram (@username)
                </label>
                <input
                  type="text"
                  value={groomInstagram}
                  onChange={(e) => setGroomInstagram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                  placeholder="dimaspratama"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Gelar / Julukan Santai
                </label>
                <input
                  type="text"
                  value={groomTagline}
                  onChange={(e) => setGroomTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                  placeholder="Calon Suami Idaman"
                />
              </div>
            </div>

            {/* Foto Mempelai Pria */}
            <div className="pt-3 border-t border-[#F0F0EA] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#717686] font-medium">
                  Foto Mempelai Pria
                </label>
                <span className="text-[10px] text-[#888D9C]">URL Gambar / Unggah File</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={groomPhotoUrl}
                  onChange={(e) => {
                    setGroomPhotoUrl(e.target.value);
                    setPreviewingPhotoSrc(e.target.value);
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] placeholder:text-[#A0A4B0] focus:outline-none focus:border-[#14161C]"
                  placeholder="https://... atau path gambar"
                />
                <label className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-[#F7F7F4] hover:bg-[#EFEFEA] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#717686]" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setGroomPhotoUrl)}
                  />
                </label>
              </div>

              {/* Thumbnail & Quick Presets */}
              <div className="flex items-center gap-2.5 pt-1">
                {groomPhotoUrl && (
                  <div className="w-11 h-14 rounded-lg overflow-hidden border border-[#DCDCD5] bg-zinc-100 shrink-0 shadow-2xs">
                    <img
                      src={groomPhotoUrl}
                      alt="Groom Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {[
                    { label: "Foto 1 (Couple 3)", src: "/images/prewedding/couple-3.jpg" },
                    { label: "Foto 2 (Couple 1)", src: "/images/prewedding/couple-1.jpg" },
                    { label: "Kucing Groom", src: "/images/cats/orange-cat-groom.jpg" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setGroomPhotoUrl(preset.src);
                        setPreviewingPhotoSrc(preset.src);
                      }}
                      className="px-2 py-0.5 rounded-md bg-[#F4F4EE] hover:bg-[#E8E8DE] text-[#5C6070] border border-[#E0E0D6] cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mempelai Wanita */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F0F0EA]">
            <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
              <Heart className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
                Profil Mempelai Wanita (Bride)
              </h3>
              <p className="text-[11px] text-[#717686]">
                Identitas dan keluarga mempelai wanita
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Anisa"
                required
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Anisa Rahmawati, S.M."
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Orang Tua / Keluarga
              </label>
              <input
                type="text"
                value={brideParents}
                onChange={(e) => setBrideParents(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Putri kedua dari Bpk. Suryo &amp; Ibu Endang"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Instagram (@username)
                </label>
                <input
                  type="text"
                  value={brideInstagram}
                  onChange={(e) => setBrideInstagram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                  placeholder="anisarahma"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Gelar / Julukan Santai
                </label>
                <input
                  type="text"
                  value={brideTagline}
                  onChange={(e) => setBrideTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                  placeholder="Tuan Putri Cantik"
                />
              </div>
            </div>

            {/* Foto Mempelai Wanita */}
            <div className="pt-3 border-t border-[#F0F0EA] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#717686] font-medium">
                  Foto Mempelai Wanita
                </label>
                <span className="text-[10px] text-[#888D9C]">URL Gambar / Unggah File</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bridePhotoUrl}
                  onChange={(e) => {
                    setBridePhotoUrl(e.target.value);
                    setPreviewingPhotoSrc(e.target.value);
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] placeholder:text-[#A0A4B0] focus:outline-none focus:border-[#14161C]"
                  placeholder="https://... atau path gambar"
                />
                <label className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-[#F7F7F4] hover:bg-[#EFEFEA] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#717686]" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setBridePhotoUrl)}
                  />
                </label>
              </div>

              {/* Thumbnail & Quick Presets */}
              <div className="flex items-center gap-2.5 pt-1">
                {bridePhotoUrl && (
                  <div className="w-11 h-14 rounded-lg overflow-hidden border border-[#DCDCD5] bg-zinc-100 shrink-0 shadow-2xs">
                    <img
                      src={bridePhotoUrl}
                      alt="Bride Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {[
                    { label: "Foto 1 (Couple 4)", src: "/images/prewedding/couple-4.jpg" },
                    { label: "Foto 2 (Couple 2)", src: "/images/prewedding/couple-2.jpg" },
                    { label: "Kucing Bride", src: "/images/cats/white-cat-bride.jpg" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBridePhotoUrl(preset.src);
                        setPreviewingPhotoSrc(preset.src);
                      }}
                      className="px-2 py-0.5 rounded-md bg-[#F4F4EE] hover:bg-[#E8E8DE] text-[#5C6070] border border-[#E0E0D6] cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Foto Sampul & Album Prewedding (Adaptif Latar Belakang & Semua Template) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0F0EA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
              <ImageIcon className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
                Foto Sampul &amp; Album Prewedding
              </h3>
              <p className="text-[11px] text-[#717686]">
                Kelola foto sampul, koleksi album, dan uji ekstraksi warna atmosfer otomatis
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E5E0D5] text-[11px] font-mono text-[#8C6218]">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>Ekstraksi Warna Otomatis Aktif</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Cover Photo & Album Gallery Manager (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Foto Sampul Utama */}
            <div className="p-4 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
                <span className="text-xs font-semibold text-[#14161C]">
                  Foto Sampul / Hero Undangan
                </span>
                <span className="text-[10px] font-mono text-[#717686]">Layar Pembuka &amp; Hero</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverPhotoUrl}
                  onChange={(e) => {
                    setCoverPhotoUrl(e.target.value);
                    setPreviewingPhotoSrc(e.target.value);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] focus:outline-none focus:border-[#14161C]"
                  placeholder="https://... atau /images/prewedding/couple-1.jpg"
                />
                <label className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white hover:bg-[#F5F5F0] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#717686]" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setCoverPhotoUrl)}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[10px]">
                <span className="text-[#888D9C]">Pilihan Cepat:</span>
                {[
                  { label: "Foto 1", src: "/images/prewedding/couple-1.jpg" },
                  { label: "Foto 2", src: "/images/prewedding/couple-2.jpg" },
                  { label: "Kucing Pasangan", src: "/images/cats/cats-couple.jpg" },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCoverPhotoUrl(p.src);
                      setPreviewingPhotoSrc(p.src);
                    }}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-[#F0F0EB] text-[#5C6070] border border-[#DCDCD5] cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Album Foto Prewedding (Daftar Foto) */}
            <div className="p-4 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
                <div>
                  <span className="text-xs font-semibold text-[#14161C] block">
                    Daftar Foto Album Prewedding ({preweddingPhotos.length})
                  </span>
                  <span className="text-[10px] text-[#717686]">
                    Foto ini berputar di latar blur dan muncul di galeri
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const sampleList = [
                      "/images/prewedding/couple-1.jpg",
                      "/images/prewedding/couple-2.jpg",
                      "/images/prewedding/couple-3.jpg",
                      "/images/prewedding/couple-4.jpg",
                      "/images/prewedding/couple-5.jpg",
                    ];
                    setPreweddingPhotos(sampleList);
                    setPreviewingPhotoSrc(sampleList[0]);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#DCDCD5] text-[10px] font-mono text-[#5C6070] hover:bg-[#F5F5F0] cursor-pointer"
                >
                  Gunakan 5 Foto Bawaan
                </button>
              </div>

              {/* Form Tambah Foto */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newPhotoInput}
                  onChange={(e) => setNewPhotoInput(e.target.value)}
                  placeholder="Ketik atau tempel URL foto tambahan..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] focus:outline-none focus:border-[#14161C]"
                />
                <button
                  type="button"
                  onClick={handleAddPreweddingPhoto}
                  className="px-3 py-2 rounded-xl bg-[#14161C] hover:bg-[#252834] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
                <label className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white hover:bg-[#F5F5F0] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#717686]" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          setPreweddingPhotos((prev) => [...prev, reader.result as string]);
                          setPreviewingPhotoSrc(reader.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>

              {/* Grid Thumbnails Prewedding */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-2">
                {preweddingPhotos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewingPhotoSrc(photoUrl)}
                    className={`relative rounded-xl overflow-hidden aspect-3/4 border-2 group cursor-pointer transition-all ${
                      previewingPhotoSrc === photoUrl
                        ? "border-[#14161C] ring-2 ring-[#14161C]/20 shadow-md scale-102"
                        : "border-[#E5E5DE] hover:border-[#14161C]/50"
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Foto Prewedding ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePreweddingPhoto(idx);
                        }}
                        className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                        title="Hapus foto dari album"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 text-white">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Atmospheric Color Extractor Tester (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full p-5 rounded-2xl bg-[#0B0D13] text-white border border-[#232734] shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#E07A5F]" />
                    <span className="font-serif font-bold text-sm text-white">
                      Uji Ekstraksi Atmosfer Warna
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    Live Analyzer
                  </span>
                </div>

                <p className="text-[11px] text-white/70 leading-relaxed font-sans mt-3">
                  Warna berikut diekstrak secara otomatis dari foto terpilih. Latar belakang blur dan aksen tema{" "}
                  <strong className="text-white">Ambient Chroma</strong> akan otomatis menyesuaikan diri.
                </p>

                {/* Inspected Image Preview */}
                <div className="mt-3.5 relative rounded-xl overflow-hidden aspect-16/9 border border-white/15 bg-black/50">
                  <img
                    src={previewingPhotoSrc}
                    alt="Inspected Sample"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-white/80">
                      Foto Aktif Sedang Dianalisis
                    </span>
                  </div>
                </div>

                {/* 5 Extracted Swatches */}
                {extractedPreview ? (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      {[
                        { label: "Dominant", color: extractedPreview.dominant },
                        { label: "Secondary", color: extractedPreview.secondary },
                        { label: "Deep BG", color: extractedPreview.deep },
                        { label: "Light", color: extractedPreview.light },
                        { label: "Glow", color: extractedPreview.glow },
                      ].map((swatch, idx) => (
                        <div key={idx} className="space-y-1">
                          <div
                            style={{ backgroundColor: swatch.color }}
                            className="w-full h-8 rounded-lg border border-white/20 shadow-xs"
                          />
                          <span className="text-[9px] font-mono text-white/60 block truncate">
                            {swatch.label}
                          </span>
                          <span className="text-[8px] font-mono text-white/90 block truncate uppercase">
                            {swatch.color.startsWith("#") ? swatch.color : "rgba"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Gradient preview bar */}
                    <div
                      style={{
                        background: `radial-gradient(circle at center, ${extractedPreview.glow} 0%, ${extractedPreview.deep} 100%)`,
                        borderColor: `${extractedPreview.dominant}66`,
                      }}
                      className="p-3 rounded-xl border text-center mt-3 shadow-inner"
                    >
                      <span className="text-[10px] font-mono text-white/90">
                        Pratinjau Aura Latar Belakang Blur
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-white/50 animate-pulse">
                    Mengekstrak atmosfer warna dari foto...
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-white/50 flex items-center justify-between">
                <span>Algoritma: Canvas Chroma-Sampler</span>
                <span className="text-[#E07A5F]">Otomatis &bull; Siap Pakai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jadwal Acara (Akad & Resepsi) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F0F0EA]">
          <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
            <Calendar className="w-4 h-4 text-[#DFD2BD]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
              Jadwal Rangkaian Acara Pernikahan
            </h3>
            <p className="text-[11px] text-[#717686]">
              Atur waktu pelaksanaan, lokasi seremoni akad, dan resepsi perayaan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Akad Nikah */}
          <div className="p-5 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#14161C] text-[#DFD2BD]">
                Acara 01: Akad Nikah
              </span>
              <span className="text-[11px] font-mono text-[#717686]">Seremoni Sakral</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Hari</label>
                <input
                  type="text"
                  value={akadDay}
                  onChange={(e) => setAkadDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Tanggal</label>
                <input
                  type="text"
                  value={akadDate}
                  onChange={(e) => setAkadDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Waktu Pelaksanaan</label>
              <input
                type="text"
                value={akadTime}
                onChange={(e) => setAkadTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Nama Tempat / Gedung</label>
              <input
                type="text"
                value={akadVenue}
                onChange={(e) => setAkadVenue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Alamat Lengkap</label>
              <input
                type="text"
                value={akadAddress}
                onChange={(e) => setAkadAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Tautan Google Maps</label>
              <div className="relative">
                <input
                  type="text"
                  value={akadMapUrl}
                  onChange={(e) => setAkadMapUrl(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                />
                <MapPin className="w-3.5 h-3.5 text-[#888D9C] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Resepsi */}
          <div className="p-5 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#2C303B] text-white">
                Acara 02: Resepsi Pernikahan
              </span>
              <span className="text-[11px] font-mono text-[#717686]">Perayaan Utama</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Hari</label>
                <input
                  type="text"
                  value={resepsiDay}
                  onChange={(e) => setResepsiDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Tanggal</label>
                <input
                  type="text"
                  value={resepsiDate}
                  onChange={(e) => setResepsiDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Waktu Pelaksanaan</label>
              <input
                type="text"
                value={resepsiTime}
                onChange={(e) => setResepsiTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Nama Tempat / Gedung</label>
              <input
                type="text"
                value={resepsiVenue}
                onChange={(e) => setResepsiVenue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Alamat Lengkap</label>
              <input
                type="text"
                value={resepsiAddress}
                onChange={(e) => setResepsiAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Tautan Google Maps</label>
              <div className="relative">
                <input
                  type="text"
                  value={resepsiMapUrl}
                  onChange={(e) => setResepsiMapUrl(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                />
                <MapPin className="w-3.5 h-3.5 text-[#888D9C] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amplop Digital & Rekening Bank */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F0F0EA]">
          <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
            <CreditCard className="w-4 h-4 text-[#DFD2BD]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
              Amplop Digital &amp; Hadiah Pernikahan
            </h3>
            <p className="text-[11px] text-[#717686]">
              Nomor rekening untuk kemudahan transfer hadiah serta alamat penerimaan kado fisik
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rekening 1 */}
          <div className="p-5 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
              <span className="text-xs font-semibold text-[#14161C]">
                Rekening 01 ({groomName || "Groom"})
              </span>
              <span className="text-[10px] font-mono text-[#717686] uppercase">Tersimpan</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Bank</label>
                <input
                  type="text"
                  value={bank1Name}
                  onChange={(e) => setBank1Name(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Nomor Rekening</label>
                <input
                  type="text"
                  value={bank1Number}
                  onChange={(e) => setBank1Number(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm font-mono text-[#14161C] focus:outline-none focus:border-[#14161C]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Atas Nama Pemilik</label>
              <input
                type="text"
                value={bank1Holder}
                onChange={(e) => setBank1Holder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C]"
              />
            </div>
          </div>

          {/* Rekening 2 */}
          <div className="p-5 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
              <span className="text-xs font-semibold text-[#14161C]">
                Rekening 02 ({brideName || "Bride"})
              </span>
              <span className="text-[10px] font-mono text-[#717686] uppercase">Tersimpan</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Bank</label>
                <input
                  type="text"
                  value={bank2Name}
                  onChange={(e) => setBank2Name(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Nomor Rekening</label>
                <input
                  type="text"
                  value={bank2Number}
                  onChange={(e) => setBank2Number(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm font-mono text-[#14161C] focus:outline-none focus:border-[#14161C]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">Atas Nama Pemilik</label>
              <input
                type="text"
                value={bank2Holder}
                onChange={(e) => setBank2Holder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
            Alamat Pengiriman Kado Fisik
          </label>
          <input
            type="text"
            value={physicalAddress}
            onChange={(e) => setPhysicalAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
            placeholder="Alamat lengkap penerimaan kado fisik"
          />
        </div>
      </div>

      {/* Tagline & Pesan */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
        <div className="pb-4 border-b border-[#F0F0EA]">
          <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
            Tagline &amp; Pesan Penutup
          </h3>
          <p className="text-[11px] text-[#717686]">
            Kalimat pembuka santai, tagar media sosial, dan ucapan penutup penghormatan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
              Tagline Santai / Kutipan Cinta
            </label>
            <input
              type="text"
              value={funTagline}
              onChange={(e) => setFunTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
              Hashtag Resmi Acara
            </label>
            <input
              type="text"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
              placeholder="Contoh: #DimasAnisaWedding"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
            Pesan Penutup Undangan
          </label>
          <textarea
            rows={3}
            value={closingMessage}
            onChange={(e) => setClosingMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
          />
        </div>
      </div>

      {/* Bottom Save CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 pb-8">
        {saveError && (
          <span className="text-xs font-medium text-[#B91C1C] bg-[#FEF2F2] px-4 py-2 rounded-xl border border-[#FCA5A5] flex items-center gap-1.5 animate-in fade-in w-full sm:w-auto">
            {saveError}
          </span>
        )}
        {isSaved && (
          <span className="text-xs font-medium text-[#24623E] bg-[#F3F8F5] px-4 py-2 rounded-xl border border-[#D4EADB] flex items-center gap-1.5 animate-in fade-in w-full sm:w-auto">
            <Check className="w-3.5 h-3.5 text-[#2E7A4A]" />
            Tersimpan Sukses!
          </span>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#14161C] hover:bg-[#232734] disabled:opacity-75 disabled:cursor-not-allowed text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 text-[#DFD2BD] animate-spin" />
              <span>Menyimpan Data...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="w-4 h-4 text-[#2E7A4A]" />
              <span className="text-[#DFD2BD]">Tersimpan Sukses!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#DFD2BD]" />
              <span>Simpan Seluruh Data Mempelai &amp; Acara</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastNotification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
            toastNotification.type === "success"
              ? "bg-[#14161C] text-white border-[#2E7A4A]/50 shadow-[0_10px_25px_rgba(20,22,28,0.25)]"
              : "bg-[#7F1D1D] text-white border-red-500 shadow-red-900/30"
          }`}
        >
          {toastNotification.type === "success" ? (
            <div className="w-5 h-5 rounded-full bg-[#24623E] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">
              !
            </div>
          )}
          <span>{toastNotification.text}</span>
        </div>
      )}
    </form>
  );
}
