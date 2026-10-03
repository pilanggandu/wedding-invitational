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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-[#FFF5F6] rounded-3xl border-2 border-[#4A0812] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#4A0812] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-[#FFE58F]" />
            <div>
              <h3 className="font-sans font-bold text-sm text-[#FFE58F]">
                Live Preview Undangan
              </h3>
              <p className="text-[11px] text-white/70">
                Pratinjau tampilan undangan sesuai pengaturan tersimpan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset Tampilan Preview"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ulangi Amplop</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#FFE58F] text-[#4A0812] hover:bg-[#FFD966] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Tab Baru</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Phone Simulator Frame */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-[#EFE4E6]">
          <div className="w-full max-w-[420px] bg-white rounded-[36px] border-[5px] border-[#4A0812] shadow-2xl overflow-hidden relative min-h-[640px]">
            {/* Phone speaker notch */}
            <div className="flex justify-between items-center px-5 py-2 bg-[#4A0812] text-white shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#FFE58F]">12:12 💖</span>
              <div className="w-16 h-3 bg-[#2D050B] rounded-full flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7D1128]" />
                <span className="w-4 h-0.5 rounded-full bg-[#5A0B17]" />
              </div>
              <span className="text-[9px] font-mono text-[#E5B869]">100% 🔋</span>
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
