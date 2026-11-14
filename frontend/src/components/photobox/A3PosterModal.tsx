"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  Wifi,
  ExternalLink,
  Palette,
  RefreshCw,
  KeyRound,
  FileText,
  ChevronDown,
  Layers,
  Scissors,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  A3PosterTheme,
  PosterPaperSize,
  POSTER_SIZES,
  generatePosterCanvas,
} from "./a3PosterCanvas";

export interface A3PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUrl?: string;
  defaultPasscode?: string;
  defaultPaperSize?: PosterPaperSize;
  weddingTitle?: string;
  coupleNames?: string;
  weddingDate?: string;
  hashtag?: string;
}

export function A3PosterModal({
  isOpen,
  onClose,
  defaultUrl,
  defaultPasscode,
  defaultPaperSize = "a4",
  weddingTitle = "THE WEDDING CELEBRATION OF",
  coupleNames = "GILANG & SALSADILA",
  weddingDate = "Rabu, 28 Oktober 2026 • Jakarta",
  hashtag = "#GilangSalsaWedding",
}: A3PosterModalProps) {
  const [theme, setTheme] = useState<A3PosterTheme>("royal-maroon");
  const [paperSize, setPaperSize] = useState<PosterPaperSize>(defaultPaperSize);
  const [multiUpOnA4, setMultiUpOnA4] = useState<boolean>(false);

  const [targetUrl, setTargetUrl] = useState<string>(
    defaultUrl || "https://cut-fishing-postal-violations.trycloudflare.com/photobox"
  );
  const [posterPasscode, setPosterPasscode] = useState<string>(
    defaultPasscode || "2026"
  );

  // Editable wedding text details
  const [customCoupleNames, setCustomCoupleNames] = useState<string>(coupleNames);
  const [customWeddingDate, setCustomWeddingDate] = useState<string>(weddingDate);
  const [customHashtag, setCustomHashtag] = useState<string>(hashtag);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);

  // WiFi information
  const [includeWifi, setIncludeWifi] = useState<boolean>(false);
  const [wifiSsid, setWifiSsid] = useState<string>("WiFi-Wedding-Venue");
  const [wifiPassword, setWifiPassword] = useState<string>("gilangsalsa2026");

  const [previewDataUrl, setPreviewDataUrl] = useState<string>("");
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Initialize URL and couple names on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!defaultUrl) {
        const isLocal =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        const cloudflareUrl =
          "https://cut-fishing-postal-violations.trycloudflare.com/photobox";
        setTargetUrl(isLocal ? cloudflareUrl : `${window.location.origin}/photobox`);
      }
    }
  }, [defaultUrl]);

  useEffect(() => {
    if (defaultPasscode) setPosterPasscode(defaultPasscode);
    if (coupleNames) setCustomCoupleNames(coupleNames);
    if (weddingDate) setCustomWeddingDate(weddingDate);
    if (hashtag) setCustomHashtag(hashtag);
  }, [defaultPasscode, coupleNames, weddingDate, hashtag]);

  // When switching paper size, reset multiUp if the new size doesn't support it
  const currentSizeConfig = POSTER_SIZES[paperSize] || POSTER_SIZES.a4;
  useEffect(() => {
    if (!currentSizeConfig.supportsA4MultiUp && multiUpOnA4) {
      setMultiUpOnA4(false);
    }
  }, [paperSize, currentSizeConfig.supportsA4MultiUp, multiUpOnA4]);

  // Re-generate preview whenever options change
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const updatePreview = async () => {
      try {
        setIsRendering(true);
        const canvas = await generatePosterCanvas({
          theme,
          targetUrl:
            targetUrl.trim() ||
            "https://cut-fishing-postal-violations.trycloudflare.com/photobox",
          paperSize,
          multiUpOnA4,
          weddingTitle,
          coupleNames: customCoupleNames.trim() || "GILANG & SALSADILA",
          weddingDate: customWeddingDate.trim() || "Rabu, 28 Oktober 2026 • Jakarta",
          hashtag: customHashtag.trim() || "#GilangSalsaWedding",
          passcode: posterPasscode.trim(),
          wifiInfo: includeWifi
            ? {
                enabled: true,
                ssid: wifiSsid,
                password: wifiPassword,
              }
            : undefined,
        });

        if (isMounted) {
          setPreviewDataUrl(canvas.toDataURL("image/jpeg", 0.88));
        }
      } catch (err) {
        console.error("Error generating poster preview:", err);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    };

    const timer = setTimeout(updatePreview, 250);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    isOpen,
    theme,
    paperSize,
    multiUpOnA4,
    targetUrl,
    posterPasscode,
    customCoupleNames,
    customWeddingDate,
    customHashtag,
    weddingTitle,
    includeWifi,
    wifiSsid,
    wifiPassword,
  ]);

  // Full-Res 300 DPI Download
  const handleDownloadPoster = async () => {
    try {
      setIsExporting(true);
      const canvas = await generatePosterCanvas({
        theme,
        targetUrl:
          targetUrl.trim() ||
          "https://cut-fishing-postal-violations.trycloudflare.com/photobox",
        paperSize,
        multiUpOnA4,
        weddingTitle,
        coupleNames: customCoupleNames.trim() || "GILANG & SALSADILA",
        weddingDate: customWeddingDate.trim() || "Rabu, 28 Oktober 2026 • Jakarta",
        hashtag: customHashtag.trim() || "#GilangSalsaWedding",
        passcode: posterPasscode.trim(),
        wifiInfo: includeWifi
          ? {
              enabled: true,
              ssid: wifiSsid,
              password: wifiPassword,
            }
          : undefined,
      });

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#DFD2BD", "#4A121A", "#8C6239", "#FAF6EE"],
        });
      } catch {
        // Confetti fallback
      }

      const sizePrefix = multiUpOnA4
        ? `${paperSize.toUpperCase()}-multiup-A4`
        : paperSize.toUpperCase();

      const link = document.createElement("a");
      link.download = `poster-qrcode-photobox-${sizePrefix}-${theme}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export error:", err);
      alert("Gagal mengunduh poster. Silakan coba kembali.");
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Print with exact @page size matching the chosen paper format
  const handlePrintPoster = async () => {
    try {
      setIsExporting(true);
      const canvas = await generatePosterCanvas({
        theme,
        targetUrl:
          targetUrl.trim() ||
          "https://cut-fishing-postal-violations.trycloudflare.com/photobox",
        paperSize,
        multiUpOnA4,
        weddingTitle,
        coupleNames: customCoupleNames.trim() || "GILANG & SALSADILA",
        weddingDate: customWeddingDate.trim() || "Rabu, 28 Oktober 2026 • Jakarta",
        hashtag: customHashtag.trim() || "#GilangSalsaWedding",
        passcode: posterPasscode.trim(),
        wifiInfo: includeWifi
          ? {
              enabled: true,
              ssid: wifiSsid,
              password: wifiPassword,
            }
          : undefined,
      });

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Pop-up diblokir oleh browser. Izinkan pop-up untuk mencetak langsung.");
        return;
      }

      const imgUrl = canvas.toDataURL("image/png");

      // Determine print page CSS size
      let printPageSize = currentSizeConfig.cssPageSize;
      let printWidthMm = currentSizeConfig.widthMm;
      let printHeightMm = currentSizeConfig.heightMm;

      if (multiUpOnA4) {
        if (currentSizeConfig.multiUpOrientation === "landscape") {
          printPageSize = "A4 landscape";
          printWidthMm = 297;
          printHeightMm = 210;
        } else {
          printPageSize = "A4 portrait";
          printWidthMm = 210;
          printHeightMm = 297;
        }
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cetak Poster QR Code (${currentSizeConfig.code}) - ${customCoupleNames}</title>
            <style>
              @page {
                size: ${printPageSize};
                margin: 0;
              }
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
              }
              img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
              }
              @media print {
                html, body {
                  width: ${printWidthMm}mm;
                  height: ${printHeightMm}mm;
                  margin: 0;
                  padding: 0;
                }
                img {
                  width: ${printWidthMm}mm;
                  height: ${printHeightMm}mm;
                  object-fit: contain;
                }
              }
            </style>
          </head>
          <body>
            <img src="${imgUrl}" onload="setTimeout(() => { window.print(); window.close(); }, 400);" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("Print error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert("Tidak dapat menyalin tautan.");
    }
  };

  if (!isOpen) return null;

  // Aspect ratio for preview frame
  const isLandscapeMultiUp = multiUpOnA4 && currentSizeConfig.multiUpOrientation === "landscape";
  const previewAspect = isLandscapeMultiUp
    ? "aspect-[1.414/1]"
    : "aspect-[1/1.414]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-[#FAF6EE] rounded-3xl border border-[#E8DFC8] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E8DFC8] bg-white shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4A121A] text-[#DFD2BD] flex items-center justify-center shadow-xs shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-serif text-[#4A121A]">
                  Generator Poster &amp; Standee QR Code
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#4A121A]/10 text-[#4A121A]">
                  Pilihan: A3 • A4 • A5 • A6 • F4 • 5R • 4R
                </span>
              </div>
              <p className="text-xs text-[#786551]">
                Cetak poster QR Code bilik foto photobox dengan beragam ukuran standee meja, tent card, atau easel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Controls (5 cols) & Right Preview (7 cols) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: CONTROLS */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Paper Size Selector */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#8C6239]" />
                  <span>Pilih Ukuran Kertas / Standee:</span>
                </label>
                <span className="text-[10px] font-mono font-bold text-[#8C6239] bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#E8DFC8]">
                  {currentSizeConfig.dimensionsCm}
                </span>
              </div>

              {/* Primary Paper Size Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {(["a4", "a3", "a5", "a6"] as PosterPaperSize[]).map((szKey) => {
                  const cfg = POSTER_SIZES[szKey];
                  const isSelected = paperSize === szKey;
                  return (
                    <button
                      key={szKey}
                      type="button"
                      onClick={() => setPaperSize(szKey)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                        isSelected
                          ? "border-[#4A121A] bg-[#4A121A] text-[#DFD2BD] shadow-xs font-bold ring-2 ring-[#4A121A]/20"
                          : "border-[#E8DFC8] bg-white hover:bg-[#FAF6EE] text-[#3A332C]"
                      }`}
                    >
                      <span className="text-xs font-bold font-mono">{cfg.code}</span>
                      <span className={`text-[9px] mt-0.5 ${isSelected ? "text-[#DFD2BD]/80" : "text-[#786551]"}`}>
                        {cfg.dimensionsCm}
                      </span>
                      {szKey === "a4" && (
                        <span className={`absolute -top-1.5 px-1 py-0.2 rounded text-[7px] font-bold ${
                          isSelected ? "bg-[#DFD2BD] text-[#4A121A]" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          Meja
                        </span>
                      )}
                      {szKey === "a3" && (
                        <span className={`absolute -top-1.5 px-1 py-0.2 rounded text-[7px] font-bold ${
                          isSelected ? "bg-[#DFD2BD] text-[#4A121A]" : "bg-amber-100 text-amber-800"
                        }`}>
                          Easel
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Extended Sizes (F4, 5R, 4R) */}
              <div className="pt-1 border-t border-[#E8DFC8]/60 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-[#786551] font-medium mr-1">Lainnya:</span>
                {(["f4", "5r", "4r"] as PosterPaperSize[]).map((szKey) => {
                  const cfg = POSTER_SIZES[szKey];
                  const isSelected = paperSize === szKey;
                  return (
                    <button
                      key={szKey}
                      type="button"
                      onClick={() => setPaperSize(szKey)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] border font-mono transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#4A121A] bg-[#4A121A] text-[#DFD2BD] font-bold"
                          : "border-[#E8DFC8] bg-[#FAF6EE]/50 hover:bg-[#FAF6EE] text-[#5A4D3E]"
                      }`}
                      title={cfg.description}
                    >
                      {cfg.code} ({cfg.dimensionsCm})
                    </button>
                  );
                })}
              </div>

              {/* Selected Size Details Banner */}
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#E8DFC8] text-[11px] text-[#5A4D3E]">
                <div className="font-bold text-[#4A121A] flex items-center justify-between">
                  <span>{currentSizeConfig.name}</span>
                  <span className="text-[10px] font-mono text-[#8C6239] font-medium">
                    {currentSizeConfig.widthPx} × {currentSizeConfig.heightPx} px @ 300 DPI
                  </span>
                </div>
                <p className="text-[10px] text-[#786551] mt-0.5">
                  <strong>Rekomendasi:</strong> {currentSizeConfig.useCase}
                </p>
              </div>

              {/* Optional Multi-up on A4 Sheet Toggle for A5 & A6 */}
              {currentSizeConfig.supportsA4MultiUp && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5 cursor-pointer">
                      <Scissors className="w-3.5 h-3.5 text-amber-700" />
                      <span>{currentSizeConfig.multiUpLabel}</span>
                    </label>
                    <input
                      type="checkbox"
                      checked={multiUpOnA4}
                      onChange={(e) => setMultiUpOnA4(e.target.checked)}
                      className="w-4 h-4 rounded text-[#4A121A] cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-amber-900/80 leading-relaxed">
                    Mencetak langsung {currentSizeConfig.multiUpCount}x kartu {currentSizeConfig.code} pada 1 lembar kertas A4 standar lengkap dengan tanda garis potong (cut guide) rapi. Hemat kertas printer rumahan!
                  </p>
                </div>
              )}
            </div>

            {/* 2. Theme Presets */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs">
              <label className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5 mb-2.5">
                <Palette className="w-4 h-4 text-[#8C6239]" />
                <span>Pilih Tema Desain Poster:</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: "royal-maroon",
                    name: "Royal Maroon & Gold",
                    desc: "Burgundy mewah dengan aksen emas filigree & medallion cameo",
                    badge: "Rekomendasi",
                    color: "bg-[#3E0F16] text-[#DFD2BD] border-[#DFD2BD]",
                  },
                  {
                    id: "paper-keepsake",
                    name: "Paper Keepsake & Botanical",
                    desc: "Kertas antik bertekstur ivory dengan lukisan cat air & segel lilin",
                    badge: "Artistik",
                    color: "bg-[#FAF6EE] text-[#4A121A] border-[#8C6239]",
                  },
                  {
                    id: "korean-studio",
                    name: "Korean Minimalist Studio",
                    desc: "Gaya modern studio photobooth Korea yang bersih dan elegan",
                    badge: "Modern",
                    color: "bg-white text-zinc-900 border-zinc-400",
                  },
                ].map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as A3PosterTheme)}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-[#4A121A] bg-[#FAF6EE] ring-2 ring-[#4A121A]/20 shadow-xs"
                          : "border-[#E8DFC8] bg-white hover:bg-[#FAF6EE]/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-10 rounded-md border flex flex-col items-center justify-center shadow-xs shrink-0 ${t.color}`}
                        >
                          <div className="w-4 h-4 rounded-full border border-current/40 mb-0.5 opacity-70" />
                          <div className="w-3 h-0.5 bg-current/40 rounded-xs" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#3A332C]">
                              {t.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-[#4A121A]/10 text-[#4A121A]">
                              {t.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#786551] line-clamp-1 mt-0.5">
                            {t.desc}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#4A121A] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Target Link & Passcode */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-[#8C6239]" />
                  <span>Target Link Photobox:</span>
                </label>
                <button
                  onClick={handleCopyUrl}
                  className="text-xs text-[#8C6239] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E8DFC8] bg-[#FAF6EE]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A121A] text-[#3A332C]"
              />

              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#8C6239]" />
                  <span>Passcode Akses:</span>
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={posterPasscode}
                  onChange={(e) => setPosterPasscode(e.target.value)}
                  placeholder="2026"
                  className="w-24 px-2.5 py-1 text-xs font-mono font-bold text-center rounded-lg border border-[#E8DFC8] bg-[#FAF6EE]/50 focus:bg-white text-[#4A121A]"
                />
              </div>
            </div>

            {/* 4. Collapsible Text Customization */}
            <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-[#4A121A] hover:bg-[#FAF6EE]/40 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#8C6239]" />
                  <span>Kustomisasi Teks &amp; Nama Pasangan</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8C6239] transition-transform duration-200 ${
                    isDetailsExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDetailsExpanded && (
                <div className="p-4 pt-1 border-t border-[#E8DFC8] space-y-2.5 bg-[#FAF6EE]/30">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#5A4D3E] mb-1">
                      Nama Pasangan di Poster
                    </label>
                    <input
                      type="text"
                      value={customCoupleNames}
                      onChange={(e) => setCustomCoupleNames(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E8DFC8] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#5A4D3E] mb-1">
                      Tanggal &amp; Lokasi Acara
                    </label>
                    <input
                      type="text"
                      value={customWeddingDate}
                      onChange={(e) => setCustomWeddingDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E8DFC8] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#5A4D3E] mb-1">
                      Hashtag Pernikahan
                    </label>
                    <input
                      type="text"
                      value={customHashtag}
                      onChange={(e) => setCustomHashtag(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E8DFC8] bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. Optional WiFi Details */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5 cursor-pointer">
                  <Wifi className="w-4 h-4 text-[#8C6239]" />
                  <span>Sertakan Info WiFi Gedung di Poster</span>
                </label>
                <input
                  type="checkbox"
                  checked={includeWifi}
                  onChange={(e) => setIncludeWifi(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4A121A] cursor-pointer"
                />
              </div>

              {includeWifi && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8DFC8]">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#5A4D3E] mb-1">
                      Nama WiFi (SSID)
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E8DFC8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#5A4D3E] mb-1">
                      Password WiFi
                    </label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E8DFC8]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: SCALED LIVE PREVIEW & EXPORT ACTIONS */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Header info over preview */}
            <div className="w-full flex items-center justify-between max-w-[420px] mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C6239]">
                  {multiUpOnA4
                    ? `${currentSizeConfig.multiUpCount}x ${currentSizeConfig.code} pada Lembar A4`
                    : `Format ${currentSizeConfig.code} (${currentSizeConfig.dimensionsCm})`}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-[#4A121A]/10 text-[#4A121A]">
                  300 DPI
                </span>
              </div>
              {isRendering && (
                <span className="text-[10px] font-medium text-[#8C6239] animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Memperbarui...
                </span>
              )}
            </div>

            {/* Scaled Preview Frame */}
            <div
              className={`relative w-full max-w-[340px] xs:max-w-[370px] sm:max-w-[420px] ${previewAspect} rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-black/10 flex items-center justify-center`}
            >
              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt={`Pratinjau Poster QR Code ${currentSizeConfig.code}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mb-2 text-[#4A121A]" />
                  <p className="text-xs font-semibold">Sedang merender poster...</p>
                </div>
              )}
            </div>

            {/* Print Spec Card */}
            <div className="w-full max-w-[420px] mt-4 p-3 rounded-xl bg-white border border-[#E8DFC8] text-xs text-[#5A4D3E] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#4A121A] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C99A45]" />
                  <span>Siap Cetak / Frame:</span>
                </p>
                <p className="text-[11px] text-[#786551]">
                  {multiUpOnA4
                    ? `Dicetak pada lembar A4 landscape/portrait, potong menjadi ${currentSizeConfig.multiUpCount} lembar.`
                    : `Ukuran standar ${currentSizeConfig.dimensionsMm} pas dengan bingkai / standee akrilik.`}
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#8C6239] bg-[#FAF6EE] px-2 py-1 rounded-md shrink-0 border border-[#E8DFC8]">
                {multiUpOnA4 ? "A4 Paper" : currentSizeConfig.code}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-[420px] mt-3 space-y-2.5">
              <button
                onClick={handleDownloadPoster}
                disabled={isExporting || isRendering}
                className="w-full py-3.5 rounded-xl bg-[#4A121A] hover:bg-[#5C1D24] text-[#DFD2BD] font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-98 disabled:opacity-50 min-h-[48px] transition-all"
              >
                <Download className="w-5 h-5 text-[#DFD2BD]" />
                <span>
                  {isExporting
                    ? "Memproses Resolusi 300 DPI..."
                    : `Unduh Format ${multiUpOnA4 ? "Multi-Up A4" : currentSizeConfig.code} (File PNG HD)`}
                </span>
              </button>

              <button
                onClick={handlePrintPoster}
                disabled={isExporting || isRendering}
                className="w-full py-3 rounded-xl bg-white border border-[#E8DFC8] hover:bg-[#FAF6EE] text-[#4A121A] font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 disabled:opacity-50 min-h-[44px] transition-all"
              >
                <Printer className="w-4 h-4 text-[#8C6239]" />
                <span>
                  Cetak Langsung {multiUpOnA4 ? "Kertas A4" : currentSizeConfig.code} / Simpan PDF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 border-t border-[#E8DFC8] bg-white flex items-center justify-between text-xs text-[#786551] shrink-0">
          <span>
            Format {currentSizeConfig.code} ({currentSizeConfig.dimensionsCm}) • 300 DPI Ultra HD • Siap Cetak Langsung
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#5A4D3E] font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}
