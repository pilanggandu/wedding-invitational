"use client";

import React, { useState } from "react";
import { X, ExternalLink, Smartphone, RefreshCw } from "lucide-react";
import { WeddingInvitationData } from "@/types/wedding";
import { TemplateRenderer } from "@/templates/TemplateRenderer";

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeddingInvitationData;
}

export function LivePreviewModal({ isOpen, onClose, data }: LivePreviewModalProps) {
  const [reloadKey, setReloadKey] = useState<number>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-sans font-bold text-sm text-white">
                Live Preview Undangan
              </h3>
              <p className="text-[11px] text-slate-400">
                Pratinjau tampilan undangan sesuai pengaturan tersimpan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset Tampilan Preview"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ulangi Amplop</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Tab Baru</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Phone Simulator Frame */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-slate-100">
          <div className="w-full max-w-[420px] bg-white rounded-[36px] border-[6px] border-slate-800 shadow-2xl overflow-hidden relative min-h-[640px]">
            {/* Phone speaker notch */}
            <div className="flex justify-between items-center px-5 py-2 bg-slate-900 text-white shrink-0">
              <span className="text-[10px] font-mono font-medium text-slate-300">12:12</span>
              <div className="w-16 h-3 bg-black rounded-full flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="w-4 h-0.5 rounded-full bg-slate-700" />
              </div>
              <span className="text-[9px] font-mono text-slate-300">100% 🔋</span>
            </div>

            {/* Template renderer container */}
            <div key={reloadKey} className="w-full">
              <TemplateRenderer data={data} isPreview={true} guestName="Tamu Terhormat Preview" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
