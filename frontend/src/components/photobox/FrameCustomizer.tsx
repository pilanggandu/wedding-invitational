"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Download,
  Copy,
  Printer,
  Sparkles,
  ArrowLeft,
  Check,
  RotateCcw,
  Palette,
  Sliders,
  Type,
  Smile,
  LayoutGrid,
  Trash2,
  Share2,
  Eye,
  Camera,
  ChevronRight,
  Film,
  QrCode,
} from "lucide-react";
import {
  PhotoboxLayout,
  PhotoboxFilter,
  PhotoboxTemplate,
  StickerItem,
  TemplateCategory,
  LAYOUT_OPTIONS,
  getLayoutShotsCount,
  isGridLayout,
  COUPLE_PHOTO_STICKERS,
} from "./types";
import {
  PHOTOBOX_TEMPLATES,
  CATEGORIES,
  PHOTO_FILTERS,
  STICKER_LIST,
} from "./templates";
import { generatePhotoboxCanvas } from "./canvasExport";
import { A3PosterModal } from "./A3PosterModal";
import { LayoutWireframe } from "./LayoutWireframe";

interface FrameCustomizerProps {
  layout: PhotoboxLayout;
  onLayoutChange: (layout: PhotoboxLayout) => void;
  photos: string[];
  onBackToCamera: () => void;
}

export function FrameCustomizer({
  layout,
  onLayoutChange,
  photos,
  onBackToCamera,
}: FrameCustomizerProps) {
  // State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("korean-classic-white");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("all");
  const [filter, setFilter] = useState<PhotoboxFilter>("none");
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customSubtitle, setCustomSubtitle] = useState<string>("");
  const [showDate, setShowDate] = useState<boolean>(true);
  const [customDate, setCustomDate] = useState<string>("28 Okt 2026");
  const [customBgColor, setCustomBgColor] = useState<string>("");
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [activeTab, setActiveTab] = useState<"templates" | "filters" | "stickers" | "text" | "layout">("templates");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isA3ModalOpen, setIsA3ModalOpen] = useState<boolean>(false);

  // Dedicated mobile view switcher: "editor" (pick frames) or "preview" (inspect result)
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Set localized date on client mount to eliminate SSR hydration mismatch
  useEffect(() => {
    try {
      setCustomDate(
        new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    } catch {
      // Ignore fallback
    }
  }, []);

  // Active Template Object
  const currentTemplate =
    PHOTOBOX_TEMPLATES.find((t) => t.id === selectedTemplateId) || PHOTOBOX_TEMPLATES[0];

  // Filter templates by category
  const filteredTemplates =
    selectedCategory === "all"
      ? PHOTOBOX_TEMPLATES
      : PHOTOBOX_TEMPLATES.filter((t) => t.category === selectedCategory);

  // Sticker actions
  const handleAddSticker = (emoji: string, imageUrl?: string) => {
    const newSticker: StickerItem = {
      id: "stk_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      emoji: imageUrl ? "🖼️" : emoji,
      imageUrl,
      x: 35 + Math.random() * 30, // randomized near center
      y: 20 + Math.random() * 60,
      scale: imageUrl ? 1.15 : 1,
      rotation: Math.floor(Math.random() * 24) - 12,
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const handleRemoveSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearStickers = () => {
    setStickers([]);
  };

  // High-Res Export Download
  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const canvas = await generatePhotoboxCanvas({
        layout,
        template: currentTemplate,
        photos,
        filter,
        customTitle,
        customSubtitle,
        showDate,
        customDate,
        customBgColor: customBgColor || undefined,
        stickers,
      });

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#DFD2BD", "#4A121A", "#8C6239", "#FAF6EE"],
        });
      } catch {
        // Confetti fallback
      }

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeTitle = (customTitle || currentTemplate.name).toLowerCase().replace(/\s+/g, "-");
      link.download = `photobox-${safeTitle}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error:", err);
      alert("Terjadi kesalahan saat memproses gambar. Silakan coba kembali.");
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to Clipboard (for instant paste in chat/IG)
  const handleCopyToClipboard = async () => {
    try {
      setIsExporting(true);
      const canvas = await generatePhotoboxCanvas({
        layout,
        template: currentTemplate,
        photos,
        filter,
        customTitle,
        customSubtitle,
        showDate,
        customDate,
        customBgColor: customBgColor || undefined,
        stickers,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2500);
        } catch {
          alert("Browser tidak mendukung salin langsung gambar ke papan klip.");
        }
      });
    } catch (err) {
      console.error("Copy error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Print
  const handlePrint = async () => {
    try {
      setIsExporting(true);
      const canvas = await generatePhotoboxCanvas({
        layout,
        template: currentTemplate,
        photos,
        filter,
        customTitle,
        customSubtitle,
        showDate,
        customDate,
        customBgColor: customBgColor || undefined,
        stickers,
      });

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const imgUrl = canvas.toDataURL("image/png");
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Photobox</title>
            <style>
              body { margin: 0; display: flex; align-items: center; justify-content: center; background: #fff; min-height: 100vh; }
              img { max-height: 96vh; width: auto; object-fit: contain; }
              @media print {
                body { margin: 0; padding: 0; }
                img { max-height: 100vh; width: auto; }
              }
            </style>
          </head>
          <body>
            <img src="${imgUrl}" onload="window.print(); window.close();" />
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

  // Filter CSS resolver for live HTML preview
  const activeFilterCss =
    PHOTO_FILTERS.find((f) => f.id === filter)?.filterCss || "none";

  // Required slots based on layout
  const slotCount = getLayoutShotsCount(layout);

  // Reusable Photobox Strip Renderer
  const renderPhotoboxStrip = () => {
    const isGrid = isGridLayout(layout);
    const isSingle = layout === "strip-1" || layout === "polaroid" || layout === "grid-1";

    return (
      <div
        ref={previewContainerRef}
        style={{
          backgroundColor: customBgColor || currentTemplate.bgColor,
          borderColor: currentTemplate.borderColor || "#E5E5E5",
          borderWidth: currentTemplate.borderWidth ? `${currentTemplate.borderWidth}px` : "1px",
          borderRadius: `${currentTemplate.borderRadius || 8}px`,
        }}
        className={`relative shadow-2xl transition-all duration-300 select-none overflow-hidden mx-auto ${
          isGrid
            ? "w-[280px] xs:w-[310px] sm:w-[340px]"
            : "w-[230px] xs:w-[250px] sm:w-[270px]"
        }`}
      >
        {/* Film Sprockets Simulation */}
        {currentTemplate.themeStyle.filmSprockets && (
          <>
            <div className="absolute left-1.5 top-6 bottom-6 flex flex-col justify-between pointer-events-none z-10">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-2.5 h-3.5 rounded-xs bg-[#242424]" />
              ))}
            </div>
            <div className="absolute right-1.5 top-6 bottom-6 flex flex-col justify-between pointer-events-none z-10">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-2.5 h-3.5 rounded-xs bg-[#242424]" />
              ))}
            </div>
          </>
        )}

        {/* Corner Badge Cameo (Gilang & Salsa) */}
        {currentTemplate.coupleBadge &&
          (currentTemplate.coupleBadge.position === "top-right" ||
            currentTemplate.coupleBadge.position === "bottom-right") && (
            <div
              className={`absolute z-20 pointer-events-none ${
                currentTemplate.coupleBadge.position === "top-right"
                  ? "top-3 right-3"
                  : "bottom-3 right-3"
              }`}
            >
              <div
                style={{ borderColor: currentTemplate.accentColor || "#DFD2BD" }}
                className="w-11 h-11 xs:w-12 xs:h-12 rounded-full overflow-hidden border-2 shadow-lg bg-white ring-1 ring-black/10"
              >
                <img
                  src={currentTemplate.coupleBadge.imageUrl}
                  alt="Gilang & Salsa"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

        {/* Header Title Section */}
        <div
          className={`pt-5 pb-3 px-4 text-center ${
            currentTemplate.themeStyle.filmSprockets ? "px-6" : ""
          }`}
        >
          {/* Couple Badge (Header Position) */}
          {currentTemplate.coupleBadge && currentTemplate.coupleBadge.position === "header" && (
            <div className="flex flex-col items-center justify-center mb-2">
              <div
                style={{
                  borderColor: currentTemplate.accentColor || "#DFD2BD",
                }}
                className={`relative overflow-hidden shadow-md ${
                  currentTemplate.coupleBadge.shape === "cutout"
                    ? "w-20 h-14 bg-transparent shadow-none"
                    : currentTemplate.coupleBadge.shape === "polaroid"
                    ? "w-16 h-18 rounded-md bg-white p-1 pb-3.5 border border-black/10 shadow-md"
                    : currentTemplate.coupleBadge.shape === "stamp"
                    ? "w-14 h-16 rounded-xs border-2 border-dashed bg-white p-0.5 shadow-xs"
                    : "w-14 h-14 rounded-full border-2 shadow-md bg-white/20"
                }`}
              >
                <img
                  src={currentTemplate.coupleBadge.imageUrl}
                  alt={currentTemplate.coupleBadge.title || "Pengantin Gilang & Salsa"}
                  className={`w-full h-full ${
                    currentTemplate.coupleBadge.shape === "cutout"
                      ? "object-contain"
                      : "object-cover rounded-xs"
                  }`}
                />
              </div>
              {currentTemplate.coupleBadge.title && (
                <span
                  style={{ color: currentTemplate.subtextColor }}
                  className="text-[9px] font-semibold tracking-wider mt-1"
                >
                  {currentTemplate.coupleBadge.title}
                </span>
              )}
            </div>
          )}

          <h3
            style={{ color: currentTemplate.textColor }}
            className={`text-sm sm:text-base font-bold leading-tight ${
              currentTemplate.fontFamily === "serif"
                ? "font-serif tracking-wider"
                : currentTemplate.fontFamily === "handwriting"
                ? "font-caveat text-xl"
                : currentTemplate.fontFamily === "mono"
                ? "font-mono tracking-widest text-xs"
                : "font-sans font-extrabold uppercase tracking-widest text-xs"
            }`}
          >
            {customTitle || currentTemplate.themeStyle.headerTitle || currentTemplate.name}
          </h3>
          {(customSubtitle || currentTemplate.themeStyle.headerSubtitle) && !isSingle && (
            <p
              style={{ color: currentTemplate.subtextColor }}
              className="text-[10px] font-medium tracking-wider mt-0.5"
            >
              {customSubtitle || currentTemplate.themeStyle.headerSubtitle}
            </p>
          )}
        </div>

        {/* Photos Container (Dynamic collage rendering for all layouts!) */}
        <div
          className={`px-3.5 pb-2 ${
            currentTemplate.themeStyle.filmSprockets ? "px-6" : ""
          }`}
        >
          {isSingle ? (
            /* Single Photo / Polaroid (1 Pose) */
            <div
              style={{ borderRadius: `${currentTemplate.themeStyle.photoRadius || 4}px` }}
              className="relative overflow-hidden bg-black/5 aspect-square flex items-center justify-center border border-black/10 my-1"
            >
              {photos[0] ? (
                <img
                  src={photos[0]}
                  alt="Pose 1"
                  style={{ filter: activeFilterCss }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-mono text-slate-400">Foto 1</span>
              )}
            </div>
          ) : layout === "grid-3" ? (
            /* Kotak 3: 1 Hero Top + 2 Grid Bottom */
            <div className="space-y-2">
              <div
                style={{ borderRadius: `${currentTemplate.themeStyle.photoRadius || 4}px` }}
                className="relative overflow-hidden bg-black/5 aspect-16/9 flex items-center justify-center border border-black/10"
              >
                {photos[0] ? (
                  <img
                    src={photos[0]}
                    alt="Pose 1"
                    style={{ filter: activeFilterCss }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">Foto 1 (Hero)</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map((idx) => (
                  <div
                    key={idx}
                    style={{ borderRadius: `${currentTemplate.themeStyle.photoRadius || 4}px` }}
                    className="relative overflow-hidden bg-black/5 aspect-4/3 flex items-center justify-center border border-black/10"
                  >
                    {photos[idx] ? (
                      <img
                        src={photos[idx]}
                        alt={`Pose ${idx + 1}`}
                        style={{ filter: activeFilterCss }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">Foto {idx + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : layout === "grid-5" ? (
            /* Kotak 5: 1 Hero Top + 4 Grid (2x2) Bottom */
            <div className="space-y-2">
              <div
                style={{ borderRadius: `${currentTemplate.themeStyle.photoRadius || 4}px` }}
                className="relative overflow-hidden bg-black/5 aspect-16/9 flex items-center justify-center border border-black/10"
              >
                {photos[0] ? (
                  <img
                    src={photos[0]}
                    alt="Pose 1"
                    style={{ filter: activeFilterCss }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">Foto 1 (Hero)</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    style={{ borderRadius: `${currentTemplate.themeStyle.photoRadius || 4}px` }}
                    className="relative overflow-hidden bg-black/5 aspect-4/3 flex items-center justify-center border border-black/10"
                  >
                    {photos[idx] ? (
                      <img
                        src={photos[idx]}
                        alt={`Pose ${idx + 1}`}
                        style={{ filter: activeFilterCss }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">Foto {idx + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : layout === "grid-9" ? (
            /* Kotak 9: 3 Kolom x 3 Baris */
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  style={{ borderRadius: `${currentTemplate.themeStyle.photoRadius || 4}px` }}
                  className="relative overflow-hidden bg-black/5 aspect-square flex items-center justify-center border border-black/10"
                >
                  {photos[idx] ? (
                    <img
                      src={photos[idx]}
                      alt={`Pose ${idx + 1}`}
                      style={{ filter: activeFilterCss }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[9px] font-mono text-slate-400">#{idx + 1}</span>
                  )}
                </div>
              ))}
            </div>
          ) : isGrid ? (
            /* Kotak Grid 2, 4 (2x2), 6 (2x3), 8 (2x4) */
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: slotCount }).map((_, idx) => (
                <div
                  key={idx}
                  style={{ borderRadius: `${currentTemplate.themeStyle.photoRadius || 4}px` }}
                  className="relative overflow-hidden bg-black/5 aspect-4/3 flex items-center justify-center border border-black/10"
                >
                  {photos[idx] ? (
                    <img
                      src={photos[idx]}
                      alt={`Pose ${idx + 1}`}
                      style={{ filter: activeFilterCss }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">Foto {idx + 1}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Vertical Strip (1, 2, 3, 4, 5, 6) */
            <div className="flex flex-col gap-2">
              {Array.from({ length: slotCount }).map((_, idx) => (
                <div
                  key={idx}
                  style={{ borderRadius: `${currentTemplate.themeStyle.photoRadius || 4}px` }}
                  className="relative overflow-hidden bg-black/5 aspect-4/3 flex items-center justify-center border border-black/10"
                >
                  {photos[idx] ? (
                    <img
                      src={photos[idx]}
                      alt={`Pose ${idx + 1}`}
                      style={{ filter: activeFilterCss }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">Foto {idx + 1}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Placed Stickers on Preview (Emoji & Couple Photo Stickers) */}
        {stickers.map((stk) => (
          <motion.button
            key={stk.id}
            onClick={() => handleRemoveSticker(stk.id)}
            whileHover={{ scale: 1.15 }}
            style={{
              left: `${stk.x}%`,
              top: `${stk.y}%`,
              transform: `translate(-50%, -50%) rotate(${stk.rotation}deg) scale(${stk.scale})`,
            }}
            className="absolute z-20 select-none cursor-pointer filter drop-shadow-md hover:opacity-75 transition-opacity"
            title="Ketuk untuk menghapus stiker"
          >
            {stk.imageUrl ? (
              <div className="w-12 h-12 xs:w-14 xs:h-14 rounded-lg overflow-hidden border-2 border-white shadow-md bg-white">
                <img
                  src={stk.imageUrl}
                  alt="Stiker Foto Pengantin"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl leading-none">{stk.emoji}</span>
            )}
          </motion.button>
        ))}

        {/* Footer Section */}
        <div
          className={`pt-3 pb-5 px-4 text-center ${
            currentTemplate.themeStyle.filmSprockets ? "px-6" : ""
          }`}
        >
          {/* Couple Badge (Footer Position) */}
          {currentTemplate.coupleBadge &&
            (!currentTemplate.coupleBadge.position ||
              currentTemplate.coupleBadge.position === "footer") && (
              <div className="flex flex-col items-center justify-center my-2">
                <div
                  style={{
                    borderColor: currentTemplate.accentColor || "#DFD2BD",
                  }}
                  className={`relative overflow-hidden shadow-md ${
                    currentTemplate.coupleBadge.shape === "cutout"
                      ? "w-20 h-14 bg-transparent shadow-none"
                      : currentTemplate.coupleBadge.shape === "polaroid"
                      ? "w-16 h-18 rounded-md bg-white p-1 pb-3.5 border border-black/10 shadow-md"
                      : currentTemplate.coupleBadge.shape === "stamp"
                      ? "w-14 h-16 rounded-xs border-2 border-dashed bg-white p-0.5 shadow-xs"
                      : "w-14 h-14 rounded-full border-2 shadow-md bg-white/20"
                  }`}
                >
                  <img
                    src={currentTemplate.coupleBadge.imageUrl}
                    alt={currentTemplate.coupleBadge.title || "Pengantin Gilang & Salsa"}
                    className={`w-full h-full ${
                      currentTemplate.coupleBadge.shape === "cutout"
                        ? "object-contain"
                        : "object-cover rounded-xs"
                    }`}
                  />
                </div>
                {currentTemplate.coupleBadge.title && (
                  <span
                    style={{ color: currentTemplate.accentColor || currentTemplate.textColor }}
                    className="text-[9px] font-bold tracking-wider mt-1"
                  >
                    {currentTemplate.coupleBadge.title}
                  </span>
                )}
              </div>
            )}

          <h4
            style={{ color: currentTemplate.textColor }}
            className={`text-xs font-bold leading-tight ${
              currentTemplate.fontFamily === "serif"
                ? "font-serif tracking-wider"
                : currentTemplate.fontFamily === "handwriting"
                ? "font-caveat text-lg"
                : currentTemplate.fontFamily === "mono"
                ? "font-mono text-[11px]"
                : "font-sans uppercase text-[11px]"
            }`}
          >
            {currentTemplate.themeStyle.footerTitle || "MEMORIES"}
          </h4>
          {currentTemplate.themeStyle.footerSubtitle && (
            <p
              style={{ color: currentTemplate.subtextColor }}
              className="text-[9px] font-medium tracking-wide mt-0.5"
            >
              {currentTemplate.themeStyle.footerSubtitle}
            </p>
          )}

          {/* Date Stamp */}
          {showDate && (
            <div
              style={{ color: currentTemplate.accentColor || currentTemplate.subtextColor }}
              className="mt-1 text-[9px] font-mono font-semibold tracking-wider"
            >
              • {customDate} •
            </div>
          )}
        </div>
      </div>
    );
  };

  // Editor Tools Content (Tabs & Grid)
  const renderEditorControls = () => (
    <div className="w-full bg-white rounded-2xl border border-[#E8DFC8] shadow-sm overflow-hidden">
      {/* Tab Navigation Bar */}
      <div className="flex border-b border-[#E8DFC8] bg-[#FAF6EE]/50 overflow-x-auto scrollbar-none">
        {[
          { id: "templates", label: `Frame (${filteredTemplates.length})`, icon: Palette },
          { id: "layout", label: `Format (${LAYOUT_OPTIONS.length})`, icon: LayoutGrid },
          { id: "filters", label: "Filter", icon: Sliders },
          { id: "stickers", label: "Stiker", icon: Smile },
          { id: "text", label: "Teks & Info", icon: Type },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border-b-2 min-h-[44px] ${
                isActive
                  ? "border-[#4A121A] text-[#4A121A] bg-white font-bold"
                  : "border-transparent text-[#6B5A49] hover:text-[#2A241D] hover:bg-white/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-3.5 sm:p-5">
        {/* TAB 1: TEMPLATES SELECTION ("frame template yg banyak yaa xixi") */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            {/* Category Pills Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 min-h-[38px] ${
                    selectedCategory === cat.id
                      ? "bg-[#4A121A] text-[#DFD2BD] font-semibold shadow-xs"
                      : "bg-[#FAF6EE] text-[#5A4D3E] hover:bg-[#F3ECE0] border border-[#E8DFC8]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Templates Grid List (Fully responsive, no sticky overlap!) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredTemplates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id);
                      setCustomBgColor(""); // reset override color when selecting template
                    }}
                    className={`group relative p-2 sm:p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#4A121A] bg-[#FAF6EE] shadow-md ring-2 ring-[#4A121A]/20"
                        : "border-[#E8DFC8] bg-white hover:border-[#8C6239]/50 hover:bg-[#FAF6EE]/30"
                    }`}
                  >
                    {/* Frame Visual Swatch Card */}
                    <div
                      style={{
                        backgroundColor: tmpl.bgColor,
                        borderColor: tmpl.borderColor || "#E5E5E5",
                        borderWidth: "1px",
                      }}
                      className="w-full h-16 sm:h-20 rounded-lg p-1.5 flex flex-col justify-between mb-2 shadow-2xs overflow-hidden relative"
                    >
                      {tmpl.badge && (
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-mono font-bold bg-[#4A121A] text-[#DFD2BD]">
                          {tmpl.badge}
                        </span>
                      )}

                      <div className="w-full text-center">
                        <span
                          style={{ color: tmpl.textColor }}
                          className="text-[8px] sm:text-[9px] font-bold block truncate"
                        >
                          {tmpl.name}
                        </span>
                      </div>

                      {/* Miniature dummy photos preview with couple photo badge if present */}
                      <div className="flex gap-1 justify-center items-center my-0.5">
                        {tmpl.coupleBadge && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden border border-white shrink-0 shadow-2xs">
                            <img
                              src={tmpl.coupleBadge.imageUrl}
                              alt="Foto Pengantin"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="w-4 sm:w-5 h-5 sm:h-6 rounded-xs bg-black/15" />
                        <div className="w-4 sm:w-5 h-5 sm:h-6 rounded-xs bg-black/15" />
                        <div className="w-4 sm:w-5 h-5 sm:h-6 rounded-xs bg-black/15" />
                      </div>

                      <div className="w-full text-center">
                        <span
                          style={{ color: tmpl.subtextColor }}
                          className="text-[7px] font-mono block truncate"
                        >
                          {tmpl.themeStyle.footerTitle || "MEMORIES"}
                        </span>
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] sm:text-xs font-bold text-[#3A332C] truncate">
                          {tmpl.name}
                        </h5>
                        {isSelected && (
                          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#4A121A] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-[#786551] line-clamp-1 mt-0.5">
                        {tmpl.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional Custom Background Color Override */}
            <div className="pt-3 border-t border-[#E8DFC8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#5A4D3E]">
                  Kustom Warna Background:
                </span>
                <input
                  type="color"
                  value={customBgColor || currentTemplate.bgColor}
                  onChange={(e) => setCustomBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-[#E8DFC8] cursor-pointer"
                  title="Pilih warna custom"
                />
              </div>
              {customBgColor && (
                <button
                  onClick={() => setCustomBgColor("")}
                  className="text-xs text-[#8C6239] hover:underline cursor-pointer"
                >
                  Kembalikan Tema
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TATA LETAK & KOLASE (Varian Kotak & Strip Vertikal Lengkap) */}
        {activeTab === "layout" && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5 mb-2">
                <Film className="w-4 h-4 text-[#8C6239]" />
                <span>Model Strip Vertikal (1 sampai 6 Foto):</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {LAYOUT_OPTIONS.filter((l) => l.type === "strip").map((l) => {
                  const isSelected = layout === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => onLayoutChange(l.id)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 min-h-[72px] ${
                        isSelected
                          ? "border-[#4A121A] bg-[#FAF6EE] ring-2 ring-[#4A121A]/20 shadow-xs"
                          : "border-[#E8DFC8] hover:bg-[#FAF6EE]/50 bg-white"
                      }`}
                    >
                      {/* Wireframe Illustration */}
                      <LayoutWireframe layout={l.id} isSelected={isSelected} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-[#3A332C] truncate">
                            {l.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#4A121A] shrink-0 ml-1" />}
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#4A121A]/10 text-[#4A121A]">
                            {l.tag}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-[#8C6239]">
                            {l.shots} Foto
                          </span>
                        </div>
                        <p className="text-[10px] text-[#786551] line-clamp-1">
                          {l.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DFC8]">
              <span className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5 mb-2">
                <LayoutGrid className="w-4 h-4 text-[#8C6239]" />
                <span>Model Kotak & Kolase Grid (1 sampai 9 Foto):</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {LAYOUT_OPTIONS.filter((l) => l.type === "grid").map((l) => {
                  const isSelected = layout === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => onLayoutChange(l.id)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 min-h-[72px] ${
                        isSelected
                          ? "border-[#4A121A] bg-[#FAF6EE] ring-2 ring-[#4A121A]/20 shadow-xs"
                          : "border-[#E8DFC8] hover:bg-[#FAF6EE]/50 bg-white"
                      }`}
                    >
                      {/* Wireframe Illustration */}
                      <LayoutWireframe layout={l.id} isSelected={isSelected} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-[#3A332C] truncate">
                            {l.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#4A121A] shrink-0 ml-1" />}
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#4A121A]/10 text-[#4A121A]">
                            {l.tag}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-[#8C6239]">
                            {l.shots} Foto
                          </span>
                        </div>
                        <p className="text-[10px] text-[#786551] line-clamp-1">
                          {l.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PHOTO FILTERS */}
        {activeTab === "filters" && (
          <div className="space-y-4">
            <p className="text-xs text-[#786551]">
              Pilih sentuhan filter foto untuk memberikan vibe photobooth yang autentik:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {PHOTO_FILTERS.map((f) => {
                const isSelected = filter === f.id;
                const samplePhoto = photos.find(Boolean) || "/favicon.ico";

                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as PhotoboxFilter)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#4A121A] bg-[#FAF6EE] ring-2 ring-[#4A121A]/20 shadow-xs"
                        : "border-[#E8DFC8] hover:bg-[#FAF6EE]/50 bg-white"
                    }`}
                  >
                    <div className="w-full aspect-4/3 rounded-lg overflow-hidden mb-2 bg-black/10 border border-black/5">
                      {samplePhoto ? (
                        <img
                          src={samplePhoto}
                          alt={f.name}
                          style={{
                            filter: f.filterCss,
                          }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-mono">
                          Contoh
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3A332C]">
                        {f.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#4A121A]" />}
                    </div>
                    <p className="text-[10px] text-[#786551] mt-0.5 line-clamp-1">
                      {f.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: STICKERS & PURIKURA */}
        {activeTab === "stickers" && (
          <div className="space-y-4">
            {/* SECTION 1: STIKER FOTO PENGANTIN (GILANG & SALSA) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C99A45]" />
                  <span>Stiker Foto Pengantin (Gilang & Salsa):</span>
                </span>
                <span className="text-[10px] text-[#8C6239] font-medium">Ketuk untuk menempel</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COUPLE_PHOTO_STICKERS.map((stk) => (
                  <button
                    key={stk.id}
                    onClick={() => handleAddSticker("", stk.imageUrl)}
                    className="p-2 rounded-xl border border-[#E8DFC8] bg-white hover:bg-[#FAF6EE] hover:border-[#8C6239] transition-all flex items-center gap-2 text-left cursor-pointer shadow-2xs group active:scale-95 min-h-[48px]"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-black/10 shrink-0 bg-black/5 shadow-2xs">
                      <img
                        src={stk.imageUrl}
                        alt={stk.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[#3A332C] truncate leading-tight">
                        {stk.title}
                      </p>
                      <span className="text-[9px] text-[#8C6239] font-medium block truncate">
                        {stk.type === "couple"
                          ? "Foto Bersama"
                          : stk.type === "seal"
                          ? "Ornamen Emas"
                          : stk.type === "groom" || stk.type === "bride"
                          ? "Karakter"
                          : "Prangko Pos"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 2: EMOJIS & PURIKURA */}
            <div className="space-y-2 pt-3 border-t border-[#E8DFC8]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-[#8C6239]" />
                  <span>Stiker & Purikura Lucu:</span>
                </span>
                {stickers.length > 0 && (
                  <button
                    onClick={handleClearStickers}
                    className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Semua ({stickers.length})
                  </button>
                )}
              </div>

              {/* Sticker Tray Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 bg-[#FAF6EE] p-3 rounded-xl border border-[#E8DFC8]">
                {STICKER_LIST.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddSticker(emoji)}
                    className="text-2xl p-2 rounded-lg hover:bg-white hover:scale-125 transition-all cursor-pointer flex items-center justify-center shadow-2xs active:scale-95 min-h-[44px] min-w-[44px]"
                    title="Klik untuk menambahkan stiker"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Stickers Counter & Instructions */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <p className="font-semibold mb-0.5">✨ Info Stiker:</p>
              <p className="text-[11px] leading-relaxed">
                Stiker foto pengantin atau emoji yang kamu pilih akan muncul di atas lembar photobox. Kamu bisa mengetuk langsung stiker di atas foto untuk membuangnya.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOM TEXT & DATE */}
        {activeTab === "text" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A4D3E] mb-1">
                  Judul Frame Atas
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={currentTemplate.themeStyle.headerTitle || "Nama / Judul Acara"}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DFC8] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A121A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4D3E] mb-1">
                  Subjudul / Lokasi
                </label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder={currentTemplate.themeStyle.headerSubtitle || "Contoh: Jakarta • 2026"}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DFC8] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A121A]"
                />
              </div>

              <div className="pt-2 border-t border-[#E8DFC8]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#5A4D3E]">
                    Tampilkan Stempel Tanggal
                  </label>
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={(e) => setShowDate(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4A121A] cursor-pointer"
                  />
                </div>

                {showDate && (
                  <input
                    type="text"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    placeholder="Contoh: 28 Okt 2026"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DFC8] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A121A]"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center pb-20 lg:pb-8">
      {/* Top Action Bar (Desktop only, or compact on mobile) */}
      <div className="w-full flex items-center justify-between gap-2 mb-4 px-1 sm:px-2">
        <button
          onClick={onBackToCamera}
          className="px-3 py-2 rounded-xl bg-white border border-[#E8DFC8] text-[#5A4D3E] hover:text-[#2A241D] hover:bg-[#FAF6EE] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4 text-[#8C6239]" />
          <span>Kembali ke Kamera</span>
        </button>

        {/* Desktop Quick Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setIsA3ModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FAF6EE] border border-[#E8DFC8] hover:bg-[#F3ECE0] text-[#4A121A] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Cetak Poster Standee QR Code A3 untuk Acara"
          >
            <QrCode className="w-4 h-4 text-[#8C6239]" />
            <span>Poster QR (A3)</span>
          </button>

          <button
            onClick={handleCopyToClipboard}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E8DFC8] hover:bg-[#FAF6EE] text-[#4A121A] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Salin gambar ke clipboard"
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#8C6239]" />
                <span>Salin</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            disabled={isExporting}
            className="px-3 py-2 rounded-xl bg-white border border-[#E8DFC8] hover:bg-[#FAF6EE] text-[#5A4D3E] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Cetak foto"
          >
            <Printer className="w-4 h-4 text-[#8C6239]" />
            <span>Cetak</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-[#4A121A] hover:bg-[#5C1D24] text-[#DFD2BD] text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-102 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#DFD2BD]" />
            <span>{isExporting ? "Memproses..." : "Unduh Foto HD"}</span>
          </button>
        </div>

        {/* Mobile Mini Quick Download & QR Button in Header */}
        <div className="lg:hidden flex items-center gap-1.5">
          <button
            onClick={() => setIsA3ModalOpen(true)}
            className="px-2.5 py-2 rounded-xl bg-white border border-[#E8DFC8] text-[#4A121A] text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
            title="Poster QR A3"
          >
            <QrCode className="w-3.5 h-3.5 text-[#8C6239]" />
            <span>QR A3</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-3 py-2 rounded-xl bg-[#4A121A] text-[#DFD2BD] text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#DFD2BD]" />
            <span>{isExporting ? "Proses..." : "Unduh HD"}</span>
          </button>
        </div>
      </div>

      {/* MOBILE SEGMENTED VIEW SWITCHER (< lg) */}
      <div className="lg:hidden w-full flex items-center bg-white p-1 rounded-2xl border border-[#E8DFC8] shadow-xs mb-4">
        <button
          onClick={() => setMobileView("editor")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
            mobileView === "editor"
              ? "bg-[#4A121A] text-[#DFD2BD] shadow-xs"
              : "text-[#6B5A49] hover:text-[#2A241D]"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Pilih Desain Frame</span>
        </button>

        <button
          onClick={() => setMobileView("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
            mobileView === "preview"
              ? "bg-[#4A121A] text-[#DFD2BD] shadow-xs"
              : "text-[#6B5A49] hover:text-[#2A241D]"
          }`}
        >
          <Eye className="w-4 h-4 text-[#C99A45]" />
          <span>Lihat Hasil Strip</span>
        </button>
      </div>

      {/* MOBILE VIEW 1: EDITOR WITH COMPACT PREVIEW BANNER */}
      <div className={`w-full lg:hidden ${mobileView === "editor" ? "block" : "hidden"}`}>
        {/* Compact Live Preview Ribbon */}
        <div className="w-full bg-[#FAF6EE] p-3 rounded-2xl border border-[#E8DFC8] mb-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div
              style={{
                backgroundColor: customBgColor || currentTemplate.bgColor,
                borderColor: currentTemplate.borderColor || "#DFD2BD",
              }}
              className="w-10 h-14 rounded-md border flex flex-col justify-center items-center shadow-xs overflow-hidden shrink-0"
            >
              <div className="w-6 h-3 bg-black/20 rounded-xs mb-1" />
              <div className="w-6 h-3 bg-black/20 rounded-xs" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#3A332C] truncate max-w-[150px]">
                  {currentTemplate.name}
                </span>
                {currentTemplate.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-[#4A121A] text-[#DFD2BD] font-bold">
                    {currentTemplate.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#786551] mt-0.5">
                Format: {layout} • {photos.filter(Boolean).length}/{slotCount} Foto
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileView("preview")}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] hover:bg-[#FAF6EE] text-[#4A121A] text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer min-h-[38px]"
          >
            <span>Lihat Strip</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8C6239]" />
          </button>
        </div>

        {/* Tabbed Editor Controls */}
        {renderEditorControls()}
      </div>

      {/* MOBILE VIEW 2: FULL PREVIEW STRIP & ACTIONS */}
      <div className={`w-full lg:hidden ${mobileView === "preview" ? "flex flex-col items-center" : "hidden"}`}>
        <div className="text-center mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#A67A53] font-bold">
            Pratinjau Hasil Photobox
          </span>
          <p className="text-xs text-[#786551]">
            Ketuk stiker pada foto jika ingin menghapusnya
          </p>
        </div>

        {/* Live Photobox Strip (NO STICKY ON MOBILE!) */}
        <div className="w-full flex justify-center py-2">
          {renderPhotoboxStrip()}
        </div>

        {/* Mobile Full Action Buttons Bar */}
        <div className="w-full max-w-[340px] mt-6 space-y-2.5 px-2">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-3.5 rounded-xl bg-[#4A121A] hover:bg-[#5C1D24] text-[#DFD2BD] font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-98 disabled:opacity-50 min-h-[48px]"
          >
            <Download className="w-5 h-5 text-[#DFD2BD]" />
            <span>{isExporting ? "Sedang Memproses..." : "Unduh Foto HD (Siap Cetak)"}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyToClipboard}
              disabled={isExporting}
              className="py-2.5 rounded-xl bg-white border border-[#E8DFC8] text-[#4A121A] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 min-h-[44px]"
            >
              {copySuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8C6239]" />
                  <span>Salin Gambar</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              disabled={isExporting}
              className="py-2.5 rounded-xl bg-white border border-[#E8DFC8] text-[#5A4D3E] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 min-h-[44px]"
            >
              <Printer className="w-4 h-4 text-[#8C6239]" />
              <span>Cetak / Print</span>
            </button>
          </div>

          <button
            onClick={() => setMobileView("editor")}
            className="w-full py-2.5 rounded-xl bg-[#FAF6EE] border border-[#E8DFC8] text-[#4A121A] font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer min-h-[44px]"
          >
            <Palette className="w-4 h-4 text-[#8C6239]" />
            <span>Ubah Desain Frame / Format</span>
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW (>= lg): SIDE-BY-SIDE SPLIT SCREEN */}
      <div className="hidden lg:grid w-full grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Live Photobox Preview (Sticky ONLY on desktop lg:) */}
        <div className="lg:col-span-5 flex flex-col items-center relative lg:sticky lg:top-20">
          <div className="text-center mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A67A53] font-bold">
              Pratinjau Hasil Cetak
            </span>
            <p className="text-xs text-[#786551]">
              Ketuk stiker pada foto jika ingin menghapusnya
            </p>
          </div>

          {/* Strip Canvas Preview Card */}
          {renderPhotoboxStrip()}
        </div>

        {/* Right Column: Customizer Tabs Studio */}
        <div className="lg:col-span-7 w-full">
          {renderEditorControls()}
        </div>
      </div>

      {/* Floating Bottom Navigation Bar for Mobile (< lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-t border-[#E8DFC8] px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <button
          onClick={() => setMobileView((prev) => (prev === "editor" ? "preview" : "editor"))}
          className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-[#E8DFC8] text-[#4A121A] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[44px]"
        >
          {mobileView === "editor" ? (
            <>
              <Eye className="w-4 h-4 text-[#C99A45]" />
              <span>Lihat Hasil Strip</span>
            </>
          ) : (
            <>
              <Palette className="w-4 h-4 text-[#8C6239]" />
              <span>Ganti Frame</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#4A121A] text-[#DFD2BD] font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 disabled:opacity-50 min-h-[44px]"
        >
          <Download className="w-4 h-4 text-[#DFD2BD]" />
          <span>{isExporting ? "Memproses..." : "Unduh HD"}</span>
        </button>
      </div>

      {/* A3 Poster Standee Generator Modal */}
      <A3PosterModal
        isOpen={isA3ModalOpen}
        onClose={() => setIsA3ModalOpen(false)}
      />
    </div>
  );
}
