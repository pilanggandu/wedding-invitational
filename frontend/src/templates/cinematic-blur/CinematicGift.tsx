"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Copy, Check, Gift, MapPin } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { FilmTimecodeBadge, ModernHairlineDivider } from "./CinematicDecorations";

export function CinematicGift() {
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
    <section id="gift" className="relative py-16 px-6 text-center text-white overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <FilmTimecodeBadge scene="SCENE 06" take="TANDA KASIH" className="mb-2" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Amplop Digital &amp; Kado
          </h2>
          <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
            Doa restu Anda adalah karunia terindah bagi kami. Bagi yang berkenan memberikan tanda kasih, kami menyediakan nomor rekening di bawah ini.
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
                className="bg-black/45 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.4)] text-left relative overflow-hidden"
              >
                {/* Bank Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-white/80" />
                    <span className="font-serif font-bold text-sm text-white tracking-wide">
                      {acc.bankName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">
                    Transfer Bank
                  </span>
                </div>

                {/* Account Number & Holder */}
                <div className="py-3.5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-white/50 block">
                    Nomor Rekening
                  </span>
                  <p className="font-mono text-lg sm:text-xl font-bold text-white tracking-wider">
                    {acc.accountNumber}
                  </p>
                  <p className="text-xs text-white/80 font-sans">
                    a.n. <strong className="text-white font-semibold">{acc.accountHolder}</strong>
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(acc.accountNumber, String(idx))}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Nomor Rekening Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white/80" />
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
            className="bg-black/45 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-lg text-left space-y-3"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-white/15">
              <Gift className="w-4 h-4 text-white/80" />
              <h3 className="font-serif font-bold text-sm text-white">
                Kirim Kado Fisik
              </h3>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              {physicalAddress.address}
            </p>
            {physicalAddress.recipient && (
              <p className="text-[11px] font-mono text-white/60">
                Penerima: {physicalAddress.recipient} {physicalAddress.phone ? `(${physicalAddress.phone})` : ""}
              </p>
            )}
            <button
              type="button"
              onClick={() => handleCopyAddress(physicalAddress.address)}
              className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Alamat Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-white/80" />
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
