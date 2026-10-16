"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Copy, Check, Gift } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { ExtractedColors } from "@/lib/colorExtractor";

interface AmbientBlurGiftProps {
  palette?: ExtractedColors;
}

export function AmbientBlurGift({ palette }: AmbientBlurGiftProps) {
  const data = useWeddingData();
  const accounts = data.gifts?.accounts || [];
  const physicalAddress = data.gifts?.physicalGiftAddress;

  const accentColor = palette?.dominant || "#D97736";
  const glowColor = palette?.glow || "rgba(217,119,54,0.3)";

  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <section id="gift" className="relative py-16 px-6 text-center text-slate-800 overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="flex justify-center">
            <span
              style={{
                borderColor: `${accentColor}44`,
                backgroundColor: `${accentColor}12`,
                color: accentColor,
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest backdrop-blur-md font-semibold"
            >
              <span
                style={{ backgroundColor: accentColor }}
                className="w-1.5 h-1.5 rounded-full"
              />
              Tanda Kasih
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Amplop Digital &amp; Kado
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Doa restu Anda merupakan kado terindah bagi kami. Apabila Anda berkehendak memberikan tanda kasih, dapat melalui tautan rekening berikut.
          </p>
        </motion.div>

        {/* Bank Account Cards */}
        <div className="space-y-4">
          {accounts.map((acc, idx) => {
            const isCopied = copiedAccount === String(idx);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                style={{
                  borderColor: `${accentColor}33`,
                  boxShadow: `0 15px 40px rgba(15,23,42,0.06), 0 0 20px ${glowColor}`,
                }}
                className="bg-white/85 sm:bg-white/90 backdrop-blur-2xl rounded-3xl p-6 border text-left relative overflow-hidden ring-1 ring-slate-900/5 shadow-lg"
              >
                {/* Bank Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-600" />
                    <span className="font-serif font-bold text-sm text-slate-900 tracking-wide">
                      {acc.bankName}
                    </span>
                  </div>
                  <span
                    style={{ color: accentColor }}
                    className="text-[10px] font-mono uppercase tracking-wider font-semibold"
                  >
                    Transfer Bank
                  </span>
                </div>

                {/* Account Number & Holder */}
                <div className="py-3.5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Nomor Rekening
                  </span>
                  <p className="font-mono text-lg sm:text-xl font-bold text-slate-900 tracking-wider">
                    {acc.accountNumber}
                  </p>
                  <p className="text-xs text-slate-600 font-sans">
                    a.n. <strong className="text-slate-900 font-semibold">{acc.accountHolder}</strong>
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(acc.accountNumber, String(idx))}
                  style={{
                    backgroundColor: isCopied ? "rgba(16, 185, 129, 0.12)" : `${accentColor}14`,
                    borderColor: isCopied ? "rgba(16, 185, 129, 0.35)" : `${accentColor}44`,
                    color: isCopied ? "#059669" : accentColor,
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:brightness-105 cursor-pointer shadow-sm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nomor Rekening Berhasil Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Physical Gift Address (Optional) */}
        {physicalAddress && physicalAddress.address && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              borderColor: `${accentColor}33`,
            }}
            className="bg-white/85 sm:bg-white/90 backdrop-blur-2xl rounded-3xl p-6 border shadow-lg ring-1 ring-slate-900/5 text-left space-y-3"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
              <Gift className="w-4 h-4 text-slate-600" />
              <h3 className="font-serif font-bold text-sm text-slate-900">
                Kirim Kado Fisik
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {physicalAddress.address}
            </p>
            {physicalAddress.recipient && (
              <p className="text-[11px] font-mono text-slate-500">
                Penerima: {physicalAddress.recipient} {physicalAddress.phone ? `(${physicalAddress.phone})` : ""}
              </p>
            )}
            <button
              type="button"
              onClick={() => handleCopyAddress(physicalAddress.address)}
              className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Alamat Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-600" />
                  <span>Salin Alamat</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
