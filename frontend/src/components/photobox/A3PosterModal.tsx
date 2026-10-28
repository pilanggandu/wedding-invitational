"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Eye,
  Sliders,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  A3PosterTheme,
  A3PosterOptions,
  generateA3PosterCanvas,
} from "./a3PosterCanvas";

interface A3PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUrl?: string;
}

export function A3PosterModal({
  isOpen,
  onClose,
  defaultUrl,
}: A3PosterModalProps) {
  const [theme, setTheme] = useState<A3PosterTheme>("royal-maroon");
  const [targetUrl, setTargetUrl] = useState<string>(
    defaultUrl || "https://cut-fishing-postal-violations.trycloudflare.com/photobox"
  );
  const [includeWifi, setIncludeWifi] = useState<boolean>(false);
  const [wifiSsid, setWifiSsid] = useState<string>("WiFi-Wedding-Venue");
  const [wifiPassword, setWifiPassword] = useState<string>("gilangsalsa2026");
  const [previewDataUrl, setPreviewDataUrl] = useState<string>("");
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Initialize URL on mount based on window.location
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!defaultUrl) {
        // If current host is localhost and cloudflare is active, prefer Cloudflare for testing
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const cloudflareUrl = "https://cut-fishing-postal-violations.trycloudflare.com/photobox";
        setTargetUrl(isLocal ? cloudflareUrl : `${window.location.origin}/photobox`);
      }
    }
  }, [defaultUrl]);

  // Regenerate preview whenever theme, URL, or WiFi changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const updatePreview = async () => {
      try {
        setIsRendering(true);
        const canvas = await generateA3PosterCanvas({
          theme,
          targetUrl: targetUrl.trim() || "https://cut-fishing-postal-violations.trycloudflare.com/photobox",
          weddingTitle: "THE WEDDING CELEBRATION OF",
          coupleNames: "GILANG & SALSADILA",
          weddingDate: "Rabu, 28 Oktober 2026 • Jakarta",
          hashtag: "#GilangSalsaWedding",
          wifiInfo: includeWifi
            ? {
                enabled: true,
                ssid: wifiSsid,
                password: wifiPassword,
              }
            : undefined,
        });

        if (isMounted) {
          // Downscaled preview for fast DOM rendering
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
  }, [isOpen, theme, targetUrl, includeWifi, wifiSsid, wifiPassword]);

  // Full-Res 300 DPI Download
  const handleDownloadA3 = async () => {
    try {
      setIsExporting(true);
      const canvas = await generateA3PosterCanvas({
        theme,
        targetUrl: targetUrl.trim() || "https://cut-fishing-postal-violations.trycloudflare.com/photobox",
        weddingTitle: "THE WEDDING CELEBRATION OF",
        coupleNames: "GILANG & SALSADILA",
        weddingDate: "Rabu, 28 Oktober 2026 • Jakarta",
        hashtag: "#GilangSalsaWedding",
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

      const link = document.createElement("a");
      link.download = `poster-qrcode-photobox-A3-${theme}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export error:", err);
      alert("Gagal mengunduh poster A3. Silakan coba kembali.");
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Print A3 (Supports 1-click native printing or Save to PDF in A3 format)
  const handlePrintA3 = async () => {
    try {
      setIsExporting(true);
      const canvas = await generateA3PosterCanvas({
        theme,
        targetUrl: targetUrl.trim() || "https://cut-fishing-postal-violations.trycloudflare.com/photobox",
        weddingTitle: "THE WEDDING CELEBRATION OF",
        coupleNames: "GILANG & SALSADILA",
        weddingDate: "Rabu, 28 Oktober 2026 • Jakarta",
        hashtag: "#GilangSalsaWedding",
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
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cetak Poster QR Code Photobox A3 - Gilang & Salsadila</title>
            <style>
              @page {
                size: A3 portrait;
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
                object-fit: cover;
                display: block;
              }
              @media print {
                html, body {
                  width: 297mm;
                  height: 420mm;
                }
                img {
                  width: 297mm;
                  height: 420mm;
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

  // Copy target URL
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-[#FAF6EE] rounded-3xl border border-[#E8DFC8] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E8DFC8] bg-white">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4A121A] text-[#DFD2BD] flex items-center justify-center shadow-xs shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-[#4A121A]">
                  Generator QR Code Standee A3
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#4A121A]/10 text-[#4A121A]">
                  Ukuran Cetak A3
                </span>
              </div>
              <p className="text-xs text-[#786551]">
                Desain poster standee meja / pintu masuk photobox sesuai tema undangan pernikahan
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

        {/* Modal Body: Split into Left (Controls) and Right (A3 Live Preview) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: CONTROLS & SETTINGS (5 COLS) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Theme Presets */}
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
                    desc: "Tema utama undangan: deep burgundy mewah dengan ornamen emas & cameo",
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
                    desc: "Gaya modern studio photobooth Korea yang bersih dan kontemporer",
                    badge: "Modern",
                    color: "bg-white text-zinc-900 border-zinc-400",
                  },
                ].map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as A3PosterTheme)}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-[#4A121A] bg-[#FAF6EE] ring-2 ring-[#4A121A]/20 shadow-xs"
                          : "border-[#E8DFC8] bg-white hover:bg-[#FAF6EE]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-12 rounded-md border flex flex-col items-center justify-center shadow-xs shrink-0 ${t.color}`}
                        >
                          <div className="w-5 h-5 rounded-full border border-current/40 mb-1 opacity-70" />
                          <div className="w-4 h-1 bg-current/40 rounded-xs" />
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

            {/* 2. Target URL Configuration */}
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
                className="w-full px-3 py-2.5 text-xs font-mono rounded-xl border border-[#E8DFC8] bg-[#FAF6EE]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A121A] text-[#3A332C]"
              />

              {/* Quick Link Selector Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() =>
                    setTargetUrl(
                      "https://cut-fishing-postal-violations.trycloudflare.com/photobox"
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#F3ECE0] border border-[#E8DFC8] text-[10px] font-semibold text-[#4A121A] cursor-pointer"
                >
                  🌐 Gunakan Link Cloudflare (Publik)
                </button>

                {typeof window !== "undefined" && (
                  <button
                    onClick={() =>
                      setTargetUrl(`${window.location.origin}/photobox`)
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#F3ECE0] border border-[#E8DFC8] text-[10px] font-semibold text-[#5A4D3E] cursor-pointer"
                  >
                    🏠 Gunakan Domain Web Saat Ini
                  </button>
                )}
              </div>
            </div>

            {/* 3. Optional WiFi Details for Wedding Guests */}
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
                      placeholder="Nama WiFi"
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
                      placeholder="Password"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E8DFC8]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Specifications Info Box */}
            <div className="p-3.5 rounded-2xl bg-[#4A121A]/5 border border-[#4A121A]/10 text-xs text-[#5A4D3E] space-y-1">
              <p className="font-bold text-[#4A121A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C99A45]" />
                <span>Standar Spesifikasi Cetak A3:</span>
              </p>
              <ul className="text-[11px] space-y-0.5 list-disc list-inside text-[#786551]">
                <li>Ukuran: <strong>297 mm × 420 mm (A3 Portrait)</strong></li>
                <li>Resolusi File: <strong>3508 × 4960 Pixel (300 DPI Ultra HD)</strong></li>
                <li>Cocok untuk: Roll banner, x-banner meja, atau bingkai akrilik A3</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: A3 SCALED LIVE PREVIEW & EXPORT ACTIONS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Live A3 Poster Canvas Preview */}
            <div className="w-full flex flex-col items-center">
              <div className="flex items-center justify-between w-full max-w-[380px] mb-2 px-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#A67A53]">
                  Pratinjau Asli A3 (1:1.414)
                </span>
                {isRendering && (
                  <span className="text-[10px] font-medium text-[#8C6239] animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Memperbarui...
                  </span>
                )}
              </div>

              {/* Scaled A3 Preview Frame */}
              <div className="relative w-full max-w-[340px] xs:max-w-[370px] sm:max-w-[400px] aspect-[1/1.414] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-black/10 flex items-center justify-center">
                {previewDataUrl ? (
                  <img
                    src={previewDataUrl}
                    alt="Pratinjau Poster QR Code A3"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2 text-[#4A121A]" />
                    <p className="text-xs font-semibold">Sedang merender poster A3...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-[400px] mt-5 space-y-2.5">
              <button
                onClick={handleDownloadA3}
                disabled={isExporting || isRendering}
                className="w-full py-3.5 rounded-xl bg-[#4A121A] hover:bg-[#5C1D24] text-[#DFD2BD] font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-98 disabled:opacity-50 min-h-[48px] transition-all"
              >
                <Download className="w-5 h-5 text-[#DFD2BD]" />
                <span>
                  {isExporting ? "Memproses Resolusi 300 DPI..." : "Unduh Poster A3 (File PNG HD)"}
                </span>
              </button>

              <button
                onClick={handlePrintA3}
                disabled={isExporting || isRendering}
                className="w-full py-3 rounded-xl bg-white border border-[#E8DFC8] hover:bg-[#FAF6EE] text-[#4A121A] font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 disabled:opacity-50 min-h-[44px] transition-all"
              >
                <Printer className="w-4 h-4 text-[#8C6239]" />
                <span>Cetak Langsung A3 / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 border-t border-[#E8DFC8] bg-white flex items-center justify-between text-xs text-[#786551]">
          <span>Format A3 • 300 DPI • Siap Dibawa ke Percetakan</span>
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
