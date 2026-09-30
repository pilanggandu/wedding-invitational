"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check, CreditCard, MapPin, Send } from "lucide-react";
import { WEDDING_DATA } from "@/data/weddingData";
import { BotanicalLeaves, TornPaperDivider } from "./PaperArtDecorations";
import { MotionReveal } from "./MotionReveal";

export function GiftSection() {
  const { accounts, physicalGiftAddress } = WEDDING_DATA.gifts;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2500);
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => {
      setCopiedAddress(false);
    }, 2500);
  };

  return (
    <section id="hadiah" className="relative py-16 bg-[#F4EFE6] overflow-hidden">
      {/* Decorative leaf cutouts */}
      <BotanicalLeaves className="absolute top-10 -right-6 w-36 h-56 opacity-30 -rotate-12 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF6EE] text-[#A85A42] border border-[#DECBB4] flex items-center justify-center shadow-xs animate-gentle-pulse">
              <Gift className="w-6 h-6" />
            </div>
            <span className="font-serif italic text-xs tracking-widest uppercase text-[#947358] block mb-1">
              Tanda Kasih
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#3A3027] mb-2">
              Amplop Digital
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#786452] leading-relaxed">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberi tanda kasih secara digital, fitur ini kami sediakan untuk memudahkan:
            </p>
          </div>
        </MotionReveal>

        {/* Bank Transfer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
          {accounts.map((acc, index) => {
            const isCopied = copiedIndex === index;

            return (
              <MotionReveal
                key={acc.accountNumber}
                variant={index === 0 ? "slide-left" : "slide-right"}
                delay={0.15 * (index + 1)}
                className="h-full"
              >
                <div className="paper-sheet rounded-2xl p-6 border border-[#DECBB4] shadow-md relative overflow-hidden flex flex-col justify-between h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {/* Washi tape accent */}
                  <div className="absolute -top-3.5 right-6 w-20 h-6 washi-tape rotate-2 opacity-85" />

                  <div>
                    <div className="flex items-center justify-between border-b border-[#E8D9C5] pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#A85A42]" />
                        <span className="font-serif font-bold text-sm text-[#3E3126]">
                          {acc.bankName}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#8A715A] bg-[#F5EDE1] px-2 py-0.5 rounded border border-[#DFD0BD]">
                        {acc.logoText}
                      </span>
                    </div>

                    <p className="text-[11px] font-sans text-[#8C7A6A] uppercase tracking-wider mb-1">
                      Nomor Rekening:
                    </p>
                    <p className="font-mono font-bold text-xl sm:text-2xl text-[#2F241C] tracking-wider mb-2">
                      {acc.accountNumber}
                    </p>
                    <p className="text-xs font-sans text-[#6B5A4B] mb-5">
                      a.n <span className="font-semibold text-[#352B24]">{acc.accountHolder}</span>
                    </p>
                  </div>

                  {/* Copy button with motion */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCopy(acc.accountNumber, index)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-medium transition-all duration-300 shadow-xs cursor-pointer ${
                      isCopied
                        ? "bg-[#557357] text-[#FFFDF9]"
                        : "bg-[#FFFDF9] hover:bg-[#FAF6EE] text-[#564536] border border-[#DECBB4] hover:border-[#C49B7F]"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Nomor Rekening Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#A85A42]" />
                        Salin Nomor Rekening
                      </>
                    )}
                  </motion.button>
                </div>
              </MotionReveal>
            );
          })}
        </div>

        {/* Physical Gift Delivery Address */}
        <MotionReveal variant="paper-unfold" delay={0.35}>
          <div className="max-w-xl mx-auto paper-sheet-kraft rounded-2xl p-6 border border-[#DECBB4] shadow-sm text-center">
            <div className="flex items-center justify-center gap-2 mb-3 text-[#6E5946]">
              <MapPin className="w-4 h-4 text-[#A85A42]" />
              <span className="font-serif uppercase tracking-widest text-xs font-bold">
                Kirim Kado Fisik
              </span>
            </div>

            <p className="text-xs sm:text-sm font-sans text-[#544335] leading-relaxed mb-1">
              Penerima: <span className="font-semibold text-[#352B24]">{physicalGiftAddress.recipient}</span> ({physicalGiftAddress.phone})
            </p>
            <p className="text-xs font-sans text-[#695646] max-w-md mx-auto leading-relaxed mb-4">
              {physicalGiftAddress.address}
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCopyAddress(`${physicalGiftAddress.recipient} - ${physicalGiftAddress.phone}\n${physicalGiftAddress.address}`)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                copiedAddress
                  ? "bg-[#557357] text-[#FFFDF9]"
                  : "bg-[#FFFDF9] hover:bg-[#F7EFE4] text-[#554538] border border-[#D5C2AA] shadow-xs"
              }`}
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Alamat Berhasil Disalin!
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#A85A42]" />
                  Salin Alamat Lengkap
                </>
              )}
            </motion.button>
          </div>
        </MotionReveal>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FAF6EE" />
      </div>
    </section>
  );
}
