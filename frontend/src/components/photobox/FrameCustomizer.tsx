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
  Upload,
  Image as ImageIcon,
  RotateCw,
  FlipHorizontal,
  Layers,
  Move,
  Plus,
  Minus,
  Link as LinkIcon,
  X,
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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("real-botanical-pressed");
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

  // Advanced sticker editing states
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [isDraggingSticker, setIsDraggingSticker] = useState<boolean>(false);
  const [customImages, setCustomImages] = useState<
    Array<{ id: string; title: string; imageUrl: string; hasFrame: boolean }>
  >([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [imageHasFrameOption, setImageHasFrameOption] = useState<boolean>(false);
  const [isUrlInputOpen, setIsUrlInputOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Keyboard shortcut listener for sticker delete / deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedStickerId) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handleRemoveSticker(selectedStickerId);
      } else if (e.key === "Escape") {
        setSelectedStickerId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedStickerId]);

  // Active Template Object
  const currentTemplate =
    PHOTOBOX_TEMPLATES.find((t) => t.id === selectedTemplateId) || PHOTOBOX_TEMPLATES[0];

  // Filter templates by category
  const filteredTemplates =
    selectedCategory === "all"
      ? PHOTOBOX_TEMPLATES
      : PHOTOBOX_TEMPLATES.filter((t) => t.category === selectedCategory);

  // Sticker actions
  const handleAddSticker = (
    emoji: string,
    imageUrl?: string,
    hasFrame?: boolean,
    customCoords?: { x: number; y: number }
  ) => {
    const newSticker: StickerItem = {
      id: "stk_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      emoji: imageUrl ? "🖼️" : emoji,
      imageUrl,
      hasFrame: hasFrame !== undefined ? hasFrame : !!imageUrl,
      x: customCoords ? customCoords.x : 35 + Math.random() * 30,
      y: customCoords ? customCoords.y : 25 + Math.random() * 45,
      scale: imageUrl ? 1.15 : 1,
      rotation: Math.floor(Math.random() * 20) - 10,
      opacity: 1,
      isFlipped: false,
      zIndex: stickers.length + 1,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const handleUpdateSticker = (id: string, updates: Partial<StickerItem>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleDuplicateSticker = (id: string) => {
    const target = stickers.find((s) => s.id === id);
    if (!target) return;
    const duplicated: StickerItem = {
      ...target,
      id: "stk_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      x: Math.min(92, target.x + 5),
      y: Math.min(92, target.y + 5),
      zIndex: stickers.length + 1,
    };
    setStickers((prev) => [...prev, duplicated]);
    setSelectedStickerId(duplicated.id);
  };

  const handleBringToFront = (id: string) => {
    const maxZ = Math.max(...stickers.map((s) => s.zIndex || 0), 0);
    handleUpdateSticker(id, { zIndex: maxZ + 1 });
  };

  const handleSendToBack = (id: string) => {
    const minZ = Math.min(...stickers.map((s) => s.zIndex || 0), 0);
    handleUpdateSticker(id, { zIndex: Math.max(1, minZ - 1) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Mohon pilih file gambar yang valid (PNG, JPG, WebP, SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const newCustom = {
        id: "cust_" + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, "").slice(0, 15),
        imageUrl: dataUrl,
        hasFrame: imageHasFrameOption,
      };

      setCustomImages((prev) => [newCustom, ...prev]);
      handleAddSticker("", dataUrl, imageHasFrameOption);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();

    const newCustom = {
      id: "cust_url_" + Date.now(),
      title: "Gambar URL",
      imageUrl: url,
      hasFrame: imageHasFrameOption,
    };

    setCustomImages((prev) => [newCustom, ...prev]);
    handleAddSticker("", url, imageHasFrameOption);
    setImageUrlInput("");
    setIsUrlInputOpen(false);
  };

  const handleStickerPointerDown = (
    e: React.PointerEvent,
    sticker: StickerItem
  ) => {
    e.stopPropagation();
    setSelectedStickerId(sticker.id);

    const container = previewContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = sticker.x;
    const origY = sticker.y;

    let hasDragged = false;

    const onPointerMove = (moveEvt: PointerEvent) => {
      const deltaX = moveEvt.clientX - startX;
      const deltaY = moveEvt.clientY - startY;

      if (!hasDragged && Math.hypot(deltaX, deltaY) > 4) {
        hasDragged = true;
        setIsDraggingSticker(true);
      }

      if (hasDragged) {
        const deltaPercentX = (deltaX / rect.width) * 100;
        const deltaPercentY = (deltaY / rect.height) * 100;

        const newX = Math.max(3, Math.min(97, Math.round((origX + deltaPercentX) * 10) / 10));
        const newY = Math.max(2, Math.min(98, Math.round((origY + deltaPercentY) * 10) / 10));

        setStickers((prev) =>
          prev.map((s) => (s.id === sticker.id ? { ...s, x: newX, y: newY } : s))
        );
      }
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      setTimeout(() => setIsDraggingSticker(false), 50);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  const handleRemoveSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
  };

  const handleClearStickers = () => {
    setStickers([]);
    setSelectedStickerId(null);
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
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedStickerId(null);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(e) => {
          e.preventDefault();
          try {
            const raw = e.dataTransfer.getData("application/json");
            if (!raw) return;
            const data = JSON.parse(raw);
            const container = previewContainerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const dropX = ((e.clientX - rect.left) / rect.width) * 100;
            const dropY = ((e.clientY - rect.top) / rect.height) * 100;
            const clampedX = Math.max(5, Math.min(95, Math.round(dropX)));
            const clampedY = Math.max(5, Math.min(95, Math.round(dropY)));
            handleAddSticker(data.emoji || "", data.imageUrl, data.hasFrame, {
              x: clampedX,
              y: clampedY,
            });
          } catch {
            // Ignore invalid drop data
          }
        }}
        className={`relative shadow-2xl transition-all duration-300 select-none overflow-hidden mx-auto ${
          isGrid
            ? "w-[280px] xs:w-[310px] sm:w-[340px]"
            : "w-[230px] xs:w-[250px] sm:w-[270px]"
        }`}
      >
        {/* Real Texture Background Asset (Menggunakan asset kertas tekstur asli) */}
        {currentTemplate.realAssets?.bgTextureUrl && (
          <div
            className="absolute inset-0 pointer-events-none z-0 bg-repeat opacity-50 mix-blend-multiply"
            style={{
              backgroundImage: `url(${currentTemplate.realAssets.bgTextureUrl})`,
              backgroundSize: "280px auto",
            }}
          />
        )}

        {/* Real Frame Border Overlay (Border asli di sekeliling canvas) */}
        {currentTemplate.realAssets?.frameBorderUrl && (
          <div
            className="absolute inset-0 pointer-events-none z-20 bg-center bg-no-repeat bg-contain"
            style={{
              backgroundImage: `url(${currentTemplate.realAssets.frameBorderUrl})`,
            }}
          />
        )}

        {/* Real Corner Sprigs/Flourishes Assets (4 sudut berornamen asli) */}
        {currentTemplate.realAssets?.cornerAssetUrl && (
          <>
            <img
              src={currentTemplate.realAssets.cornerAssetUrl}
              alt="Corner decoration"
              className="absolute top-1.5 left-1.5 w-8 h-8 pointer-events-none z-20 object-contain drop-shadow-xs"
            />
            <img
              src={currentTemplate.realAssets.cornerAssetUrl}
              alt="Corner decoration"
              className="absolute top-1.5 right-1.5 w-8 h-8 pointer-events-none z-20 object-contain scale-x-[-1] drop-shadow-xs"
            />
            <img
              src={currentTemplate.realAssets.cornerAssetUrl}
              alt="Corner decoration"
              className="absolute bottom-1.5 left-1.5 w-8 h-8 pointer-events-none z-20 object-contain scale-y-[-1] drop-shadow-xs"
            />
            <img
              src={currentTemplate.realAssets.cornerAssetUrl}
              alt="Corner decoration"
              className="absolute bottom-1.5 right-1.5 w-8 h-8 pointer-events-none z-20 object-contain scale-x-[-1] scale-y-[-1] drop-shadow-xs"
            />
          </>
        )}

        {/* Real Top Ornament (Pita Sutra / Washi Tape / Golden Scroll) */}
        {currentTemplate.realAssets?.topOrnamentUrl && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 z-30 pointer-events-none">
            <img
              src={currentTemplate.realAssets.topOrnamentUrl}
              alt="Top ornament"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
            />
          </div>
        )}

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

        {/* Placed Stickers on Preview (Draggable, Rotatable, Scalable with Quick Actions) */}
        {stickers.map((stk) => {
          const isSelected = stk.id === selectedStickerId;

          return (
            <div
              key={stk.id}
              onPointerDown={(e) => handleStickerPointerDown(e, stk)}
              style={{
                left: `${stk.x}%`,
                top: `${stk.y}%`,
                transform: `translate(-50%, -50%) rotate(${stk.rotation || 0}deg) scale(${stk.scale || 1}) scaleX(${
                  stk.isFlipped ? -1 : 1
                })`,
                opacity: stk.opacity !== undefined ? stk.opacity : 1,
                zIndex: isSelected ? 50 : stk.zIndex || 20,
              }}
              className={`absolute select-none cursor-grab active:cursor-grabbing touch-none group transition-[box-shadow,opacity] ${
                isSelected
                  ? "ring-2 ring-[#8C6239] ring-offset-2 ring-offset-transparent rounded-lg"
                  : "hover:scale-105"
              }`}
              title="Geser (drag) untuk memindahkan, ketuk untuk mengedit"
            >
              {/* Sticker Content */}
              {stk.imageUrl ? (
                stk.hasFrame ? (
                  <div className="w-12 h-12 xs:w-14 xs:h-14 rounded-lg overflow-hidden border-2 border-white shadow-md bg-white">
                    <img
                      src={stk.imageUrl}
                      alt="Stiker Kustom"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 xs:w-14 xs:h-14 flex items-center justify-center filter drop-shadow-md">
                    <img
                      src={stk.imageUrl}
                      alt="Stiker Kustom Transparan"
                      className="max-w-full max-h-full object-contain pointer-events-none"
                    />
                  </div>
                )
              ) : (
                <span className="text-2xl sm:text-3xl leading-none filter drop-shadow-sm block pointer-events-none">
                  {stk.emoji}
                </span>
              )}

              {/* Floating Quick Action Mini-Toolbar (shows when selected) */}
              {isSelected && (
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#3A332C]/95 backdrop-blur-xs text-white px-2 py-1 rounded-full shadow-lg border border-white/20 z-50 text-[10px] whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    transform: `translateX(-50%) scaleX(${stk.isFlipped ? -1 : 1})`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateSticker(stk.id, {
                        rotation: ((stk.rotation || 0) + 45) % 360,
                      })
                    }
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    title="Putar 45°"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateSticker(stk.id, {
                        isFlipped: !stk.isFlipped,
                      })
                    }
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    title="Cermin Horizontal"
                  >
                    <FlipHorizontal className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateSticker(stk.id)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    title="Gandakan"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSticker(stk.id)}
                    className="p-1 hover:bg-red-500 rounded-full transition-colors text-red-300 hover:text-white"
                    title="Hapus"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Footer Section */}
        <div
          className={`pt-3 pb-5 px-4 text-center ${
            currentTemplate.themeStyle.filmSprockets ? "px-6" : ""
          }`}
        >
          {/* Real Bottom Ornament (Gold Wax Seal / Wedding Rings / Cats Couple) */}
          {currentTemplate.realAssets?.bottomOrnamentUrl && (
            <div className="flex justify-center -mt-0.5 mb-2.5 z-20 relative pointer-events-none">
              <img
                src={currentTemplate.realAssets.bottomOrnamentUrl}
                alt="Bottom ornament"
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-md"
              />
            </div>
          )}

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
                      {/* Real texture preview if present */}
                      {tmpl.realAssets?.bgTextureUrl && (
                        <div
                          className="absolute inset-0 pointer-events-none bg-repeat opacity-40 mix-blend-multiply z-0"
                          style={{
                            backgroundImage: `url(${tmpl.realAssets.bgTextureUrl})`,
                            backgroundSize: "60px auto",
                          }}
                        />
                      )}

                      {tmpl.badge && (
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-mono font-bold bg-[#4A121A] text-[#DFD2BD] z-10 shadow-xs">
                          {tmpl.badge}
                        </span>
                      )}

                      <div className="w-full text-center relative z-10">
                        <span
                          style={{ color: tmpl.textColor }}
                          className="text-[8px] sm:text-[9px] font-bold block truncate"
                        >
                          {tmpl.name}
                        </span>
                      </div>

                      {/* Miniature dummy photos preview with couple photo or real ornament if present */}
                      <div className="flex gap-1 justify-center items-center my-0.5 relative z-10">
                        {tmpl.realAssets?.bottomOrnamentUrl ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 flex items-center justify-center">
                            <img
                              src={tmpl.realAssets.bottomOrnamentUrl}
                              alt="Ornamen Asli"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : tmpl.coupleBadge ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden border border-white shrink-0 shadow-2xs">
                            <img
                              src={tmpl.coupleBadge.imageUrl}
                              alt="Foto Pengantin"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : null}
                        <div className="w-4 sm:w-5 h-5 sm:h-6 rounded-xs bg-black/15 shadow-2xs" />
                        <div className="w-4 sm:w-5 h-5 sm:h-6 rounded-xs bg-black/15 shadow-2xs" />
                        <div className="w-4 sm:w-5 h-5 sm:h-6 rounded-xs bg-black/15 shadow-2xs" />
                      </div>

                      <div className="w-full text-center relative z-10">
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
            {/* ACTIVE SELECTED STICKER EDITOR PANEL */}
            {(() => {
              const selectedSticker = stickers.find((s) => s.id === selectedStickerId);
              if (!selectedSticker) {
                return (
                  <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#E8DFC8] text-xs text-[#5C4A3A] flex items-start gap-2.5">
                    <span className="text-base select-none shrink-0">✨</span>
                    <div>
                      <p className="font-bold text-[#3A332C] mb-0.5">Tip Stiker Interaktif:</p>
                      <p className="text-[11px] leading-relaxed text-[#705A46]">
                        Kamu bisa langsung <strong>menggeser (drag & drop)</strong> stiker di atas lembar foto. Ketuk stiker mana saja untuk memutar, memperbesar, mencerminkan, atau mengatur transparansinya.
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFFBF4] to-[#F5ECE0] border-2 border-[#8C6239]/50 shadow-sm space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  {/* Header of Active Editor */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC8]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#8C6239]/30 flex items-center justify-center overflow-hidden shadow-2xs">
                        {selectedSticker.imageUrl ? (
                          <img
                            src={selectedSticker.imageUrl}
                            alt="Stiker Aktif"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-lg leading-none">{selectedSticker.emoji}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#3A332C]">Edit Stiker Terpilih</h4>
                        <span className="text-[10px] text-[#8C6239] font-medium block">
                          Tarik langsung di foto untuk memindahkan posisi
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedStickerId(null)}
                      className="text-xs text-[#8C6239] hover:text-[#4A121A] flex items-center gap-1 font-bold px-2 py-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Selesai
                    </button>
                  </div>

                  {/* Scale Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#3A332C]">Ukuran / Skala:</span>
                      <span className="font-mono text-[11px] font-bold text-[#8C6239]">
                        {(selectedSticker.scale || 1).toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="2.5"
                      step="0.05"
                      value={selectedSticker.scale || 1}
                      onChange={(e) =>
                        handleUpdateSticker(selectedSticker.id, {
                          scale: parseFloat(e.target.value),
                        })
                      }
                      className="w-full h-1.5 bg-[#E8DFC8] rounded-lg appearance-none cursor-pointer accent-[#8C6239]"
                    />
                    <div className="flex gap-1.5">
                      {[0.7, 1.0, 1.4, 1.8].map((sVal) => (
                        <button
                          key={sVal}
                          type="button"
                          onClick={() =>
                            handleUpdateSticker(selectedSticker.id, { scale: sVal })
                          }
                          className={`flex-1 py-1 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                            Math.abs((selectedSticker.scale || 1) - sVal) < 0.05
                              ? "bg-[#8C6239] text-white border-[#8C6239]"
                              : "bg-white text-[#5C4A3A] border-[#E8DFC8] hover:bg-[#FAF6EE]"
                          }`}
                        >
                          {sVal}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rotation Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#3A332C]">Rotasi Putaran:</span>
                      <span className="font-mono text-[11px] font-bold text-[#8C6239]">
                        {selectedSticker.rotation || 0}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={selectedSticker.rotation || 0}
                      onChange={(e) =>
                        handleUpdateSticker(selectedSticker.id, {
                          rotation: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full h-1.5 bg-[#E8DFC8] rounded-lg appearance-none cursor-pointer accent-[#8C6239]"
                    />
                    <div className="flex gap-1">
                      {[-90, -45, 0, 45, 90].map((deg) => (
                        <button
                          key={deg}
                          type="button"
                          onClick={() =>
                            handleUpdateSticker(selectedSticker.id, { rotation: deg })
                          }
                          className={`flex-1 py-1 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                            (selectedSticker.rotation || 0) === deg
                              ? "bg-[#8C6239] text-white border-[#8C6239]"
                              : "bg-white text-[#5C4A3A] border-[#E8DFC8] hover:bg-[#FAF6EE]"
                          }`}
                        >
                          {deg === 0 ? "Tegak" : `${deg}°`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Opacity Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#3A332C]">Transparansi:</span>
                      <span className="font-mono text-[11px] font-bold text-[#8C6239]">
                        {Math.round((selectedSticker.opacity ?? 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={selectedSticker.opacity ?? 1}
                      onChange={(e) =>
                        handleUpdateSticker(selectedSticker.id, {
                          opacity: parseFloat(e.target.value),
                        })
                      }
                      className="w-full h-1.5 bg-[#E8DFC8] rounded-lg appearance-none cursor-pointer accent-[#8C6239]"
                    />
                  </div>

                  {/* Quick Action Button Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E8DFC8]">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateSticker(selectedSticker.id, {
                          isFlipped: !selectedSticker.isFlipped,
                        })
                      }
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedSticker.isFlipped
                          ? "bg-[#8C6239] text-white border-[#8C6239]"
                          : "bg-white text-[#3A332C] border-[#E8DFC8] hover:bg-[#FAF6EE]"
                      }`}
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>{selectedSticker.isFlipped ? "Cermin: Aktif" : "Cermin (Flip)"}</span>
                    </button>

                    {selectedSticker.imageUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateSticker(selectedSticker.id, {
                            hasFrame: !selectedSticker.hasFrame,
                          })
                        }
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          selectedSticker.hasFrame
                            ? "bg-[#8C6239] text-white border-[#8C6239]"
                            : "bg-white text-[#3A332C] border-[#E8DFC8] hover:bg-[#FAF6EE]"
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{selectedSticker.hasFrame ? "Bingkai Polaroid" : "Transparan"}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateSticker(selectedSticker.id, {
                            rotation: ((selectedSticker.rotation || 0) + 45) % 360,
                          })
                        }
                        className="px-2.5 py-1.5 rounded-xl border border-[#E8DFC8] bg-white hover:bg-[#FAF6EE] text-xs font-semibold text-[#3A332C] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-[#8C6239]" />
                        <span>Putar +45°</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleBringToFront(selectedSticker.id)}
                      className="px-2.5 py-1.5 rounded-xl border border-[#E8DFC8] bg-white hover:bg-[#FAF6EE] text-xs font-semibold text-[#3A332C] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#8C6239]" />
                      <span>Paling Depan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicateSticker(selectedSticker.id)}
                      className="px-2.5 py-1.5 rounded-xl border border-[#E8DFC8] bg-white hover:bg-[#FAF6EE] text-xs font-semibold text-[#3A332C] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#8C6239]" />
                      <span>Gandakan</span>
                    </button>
                  </div>

                  {/* Centering and Delete */}
                  <div className="flex gap-2 pt-1 border-t border-[#E8DFC8]">
                    <button
                      type="button"
                      onClick={() => handleUpdateSticker(selectedSticker.id, { x: 50 })}
                      className="flex-1 py-1.5 text-[11px] font-semibold text-[#5C4A3A] bg-white rounded-lg border border-[#E8DFC8] hover:bg-[#FAF6EE] cursor-pointer"
                    >
                      Pusatkan Horisontal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSticker(selectedSticker.id)}
                      className="flex-1 py-1.5 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus Stiker
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* SECTION 1: UNGGAH GAMBAR / STIKER KUSTOM (EXTERNAL IMAGE) */}
            <div className="space-y-2.5 pt-2 border-t border-[#E8DFC8]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#8C6239]" />
                  <span>Unggah Gambar / Stiker Sendiri:</span>
                </span>
                <span className="text-[10px] text-[#8C6239] font-medium">PNG / JPG / WebP</span>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Action Buttons: File Picker & URL */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl border border-[#8C6239] bg-white hover:bg-[#FAF6EE] text-[#4A121A] text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer min-h-[44px]"
                >
                  <Upload className="w-4 h-4 text-[#8C6239]" />
                  <span>Pilih dari Galeri</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsUrlInputOpen(!isUrlInputOpen)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer min-h-[44px] ${
                    isUrlInputOpen
                      ? "bg-[#8C6239] text-white border-[#8C6239]"
                      : "bg-white text-[#4A121A] border-[#E8DFC8] hover:bg-[#FAF6EE]"
                  }`}
                >
                  <LinkIcon className="w-4 h-4 text-[#8C6239]" />
                  <span>Tempel Link URL</span>
                </button>
              </div>

              {/* Image Border Option Toggle */}
              <div className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-[#E8DFC8] text-xs">
                <span className="text-[#3A332C] font-semibold">Model Stiker Baru:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setImageHasFrameOption(false)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                      !imageHasFrameOption
                        ? "bg-[#8C6239] text-white"
                        : "text-[#705A46] hover:bg-[#FAF6EE]"
                    }`}
                  >
                    Transparan Asli
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageHasFrameOption(true)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                      imageHasFrameOption
                        ? "bg-[#8C6239] text-white"
                        : "text-[#705A46] hover:bg-[#FAF6EE]"
                    }`}
                  >
                    Bingkai Polaroid
                  </button>
                </div>
              </div>

              {/* Inline URL Input Form */}
              {isUrlInputOpen && (
                <div className="p-3 bg-white rounded-xl border border-[#8C6239]/40 space-y-2 shadow-2xs animate-in fade-in duration-150">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://example.com/stiker.png"
                      className="flex-1 px-3 py-2 text-xs border border-[#E8DFC8] rounded-lg focus:outline-none focus:border-[#8C6239] bg-[#FFFBF4]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={!imageUrlInput.trim()}
                      className="px-3 py-2 bg-[#8C6239] text-white text-xs font-bold rounded-lg hover:bg-[#724e2c] disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>
                  <p className="text-[10px] text-[#8C6239]">
                    Mendukung link gambar transparan (PNG) atau foto dari web mana pun.
                  </p>
                </div>
              )}

              {/* Uploaded Custom Images Tray */}
              {customImages.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-[#5C4A3A] block">
                    Gambar Kustom Kamu (Ketuk untuk menambah lagi):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1.5">
                    {customImages.map((cImg) => (
                      <button
                        key={cImg.id}
                        type="button"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData(
                            "application/json",
                            JSON.stringify({
                              emoji: "",
                              imageUrl: cImg.imageUrl,
                              hasFrame: cImg.hasFrame,
                            })
                          );
                        }}
                        onClick={() =>
                          handleAddSticker("", cImg.imageUrl, cImg.hasFrame)
                        }
                        className="w-14 h-14 shrink-0 rounded-xl border-2 border-[#E8DFC8] hover:border-[#8C6239] bg-white p-1 overflow-hidden shadow-2xs hover:scale-105 transition-all cursor-pointer relative group"
                        title={cImg.title}
                      >
                        <img
                          src={cImg.imageUrl}
                          alt={cImg.title}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: STIKER FOTO PENGANTIN (GILANG & SALSA) */}
            <div className="space-y-2 pt-2 border-t border-[#E8DFC8]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C99A45]" />
                  <span>Stiker Foto Pengantin (Gilang & Salsa):</span>
                </span>
                <span className="text-[10px] text-[#8C6239] font-medium">Bisa drag ke foto</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COUPLE_PHOTO_STICKERS.map((stk) => {
                  const isPhotoCard = stk.type === "couple";

                  return (
                    <button
                      key={stk.id}
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "application/json",
                          JSON.stringify({
                            emoji: "",
                            imageUrl: stk.imageUrl,
                            hasFrame: isPhotoCard,
                          })
                        );
                      }}
                      onClick={() =>
                        handleAddSticker("", stk.imageUrl, isPhotoCard)
                      }
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
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: EMOJIS & PURIKURA */}
            <div className="space-y-2 pt-2 border-t border-[#E8DFC8]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-[#8C6239]" />
                  <span>Stiker & Purikura Lucu:</span>
                </span>
                {stickers.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearStickers}
                    className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Semua ({stickers.length})
                  </button>
                )}
              </div>

              {/* Sticker Tray Grid with Draggable Support */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 bg-[#FAF6EE] p-3 rounded-xl border border-[#E8DFC8]">
                {STICKER_LIST.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        "application/json",
                        JSON.stringify({ emoji, imageUrl: "", hasFrame: false })
                      );
                    }}
                    onClick={() => handleAddSticker(emoji)}
                    className="text-2xl p-2 rounded-lg hover:bg-white hover:scale-125 transition-all cursor-pointer flex items-center justify-center shadow-2xs active:scale-95 min-h-[44px] min-w-[44px]"
                    title="Klik atau geser langsung ke foto"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
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
            title="Cetak Poster Standee QR Code (A3, A4, A5, A6, F4) untuk Acara"
          >
            <QrCode className="w-4 h-4 text-[#8C6239]" />
            <span>Poster QR (A3-A6)</span>
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
