"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Copy, Check, Gift } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { CatPawPrint, BrushStrokeDivider } from "./PaintedDecorations";

export function PaintedCatsGift() {
  const data = useWeddingData();
  const accounts = data.gifts?.accounts || [];
  const physicalAddress = data.gifts?.physicalGiftAddress;

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
    <section id="gift" className="relative py-16 px-6 text-center text-[#2C2623] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-1.5">
            <CatPawPrint className="w-3.5 h-3.5 text-[#D97736]" color="#D97736" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C85A17]">
              Tanda Kasih
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2623]">
            Amplop Digital &amp; Kado
          </h2>
          <p className="text-xs text-[#7A6150] max-w-xs mx-auto leading-relaxed">
            Doa restu Anda adalah anugerah terindah bagi kami. Bagi yang ingin berbagi tanda kasih, kami menyediakan nomor rekening di bawah ini.
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
                className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-2 border-[#EAD8C7] shadow-[0_10px_30px_rgba(200,90,23,0.08)] text-left relative overflow-hidden"
              >
                {/* Bank Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EFE5DB]">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#D97736]" />
                    <span className="font-serif font-bold text-sm text-[#2C2623] tracking-wide">
                      {acc.bankName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#C85A17] uppercase tracking-wider">
                    Transfer Bank
                  </span>
                </div>

                {/* Account Number & Holder */}
                <div className="py-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#A07855] block">
                    Nomor Rekening
                  </span>
                  <p className="font-mono text-lg sm:text-xl font-bold text-[#2C2623] tracking-wider">
                    {acc.accountNumber}
                  </p>
                  <p className="text-xs text-[#5C4A3E] font-sans">
                    a.n. <strong className="text-[#2C2623]">{acc.accountHolder}</strong>
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(acc.accountNumber, String(idx))}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FAF6EE] hover:bg-[#F3E8DB] border border-[#E8D9CB] text-xs font-medium text-[#2C2623] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#24623E]" />
                      <span className="text-[#24623E] font-semibold">Nomor Rekening Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D97736]" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Physical Gift Address */}
        {physicalAddress && physicalAddress.address && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border-2 border-[#EAD8C7] shadow-xs text-left space-y-3"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-[#EFE5DB]">
              <Gift className="w-4 h-4 text-[#D97736]" />
              <h3 className="font-serif font-bold text-sm text-[#2C2623]">
                Kirim Kado Fisik
              </h3>
            </div>
            <p className="text-xs text-[#5C4A3E] leading-relaxed font-sans">
              {physicalAddress.address}
            </p>
            {physicalAddress.recipient && (
              <p className="text-[11px] font-mono text-[#C85A17]">
                Penerima: {physicalAddress.recipient} {physicalAddress.phone ? `(${physicalAddress.phone})` : ""}
              </p>
            )}
            <button
              type="button"
              onClick={() => handleCopyAddress(physicalAddress.address)}
              className="py-2 px-3 rounded-xl bg-[#FAF6EE] hover:bg-[#F3E8DB] border border-[#E8D9CB] text-xs text-[#2C2623] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3 h-3 text-[#24623E]" />
                  <span className="text-[#24623E]">Alamat Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#D97736]" />
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
