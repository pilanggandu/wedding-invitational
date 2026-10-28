"use client";

import React, { Component, ErrorInfo, ReactNode, useState } from "react";
import {
  X,
  ExternalLink,
  Smartphone,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import { WeddingInvitationData } from "@/types/wedding";
import { AVAILABLE_TEMPLATES } from "@/data/templates";
import { normalizeTemplateId, TemplateRenderer } from "@/templates/TemplateRenderer";
import { normalizeWeddingData } from "@/context/WeddingDataContext";
import { getTemplateScrollbarVars } from "@/lib/templateTheme";

interface PreviewErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface PreviewErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PreviewErrorBoundary extends Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Preview render error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-white space-y-3 min-h-[360px] flex flex-col items-center justify-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mb-1" />
          <h4 className="font-semibold text-sm text-zinc-900">
            Terjadi Kendala Memuat Pratinjau
          </h4>
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
            {this.state.error?.message ||
              "Sedang menyelaraskan data template undangan."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onReset();
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium cursor-pointer transition-colors hover:bg-zinc-800"
          >
            Muat Ulang Pratinjau
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeddingInvitationData;
  overrideTemplateId?: string;
  onEditTemplate?: (templateId: string) => void;
}

export function LivePreviewModal({
  isOpen,
  onClose,
  data,
  overrideTemplateId,
  onEditTemplate,
}: LivePreviewModalProps) {
  const [reloadKey, setReloadKey] = useState<number>(0);

  if (!isOpen) return null;

  const rawTmpl = overrideTemplateId || data.activeTemplateId || "cityscape-skyline";
  const activeTmpl = normalizeTemplateId(rawTmpl);
  const tmplMeta = AVAILABLE_TEMPLATES.find((t) => t.id === activeTmpl);
  const tmplName = tmplMeta?.name || activeTmpl;

  const safeData = {
    ...normalizeWeddingData(data),
    activeTemplateId: activeTmpl,
  };

  const previewUrl = `/undangan?template=${activeTmpl}`;
  const scrollbarVars = getTemplateScrollbarVars(activeTmpl);

  return (
    <div
      data-template-theme={activeTmpl}
      style={scrollbarVars}
      className="fixed inset-0 z-70 flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[96vh] sm:max-h-[95vh] bg-white rounded-2xl border border-zinc-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 bg-zinc-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Kembali ke Katalog"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kembali</span>
            </button>

            <div className="h-4 w-px bg-zinc-700 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-xs sm:text-sm text-white truncate max-w-[180px] sm:max-w-none">
                  {tmplName}
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Pratinjau Baca-Saja
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-zinc-400">
                Tema aktif saat ini tidak berubah sampai Anda menyimpannya dari Editor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {onEditTemplate && (
              <button
                onClick={() => onEditTemplate(activeTmpl)}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Buka template ini di editor"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Edit Template</span>
              </button>
            )}

            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Ulangi Buka Amplop"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Ulangi Amplop</span>
            </button>

            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Buka di tab browser baru"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tab Baru</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              aria-label="Tutup Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content / Phone Simulator Frame */}
        <div style={scrollbarVars} className="flex-1 overflow-y-auto p-2 sm:p-6 flex justify-center items-start bg-zinc-100">
          <div className="w-full max-w-[420px] bg-white rounded-xl sm:rounded-[32px] border-2 sm:border-[6px] border-zinc-800 shadow-xl sm:shadow-2xl overflow-hidden relative min-h-[580px] sm:min-h-[640px] [transform:translateZ(0)]">
            {/* Phone speaker notch (desktop simulator only) */}
            <div className="hidden sm:flex justify-between items-center px-6 py-2 bg-zinc-900 text-zinc-400 text-[11px] font-mono shrink-0 select-none">
              <span>09:41</span>
              <div className="w-16 h-3 bg-zinc-800 rounded-full flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span className="w-4 h-0.5 rounded-full bg-zinc-600" />
              </div>
              <span>5G</span>
            </div>

            {/* Template renderer container */}
            <div key={reloadKey} className="w-full">
              <PreviewErrorBoundary onReset={() => setReloadKey((k) => k + 1)}>
                <TemplateRenderer
                  data={safeData}
                  isPreview={true}
                  guestName="Tamu Terhormat Preview"
                />
              </PreviewErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LivePreviewModal;
