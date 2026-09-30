"use client";

import React, { useState } from "react";
import { Gift, Copy, Check, CreditCard, MapPin, Send, Smile } from "lucide-react";
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
    <section id="hadiah" className="relative py-16 bg-[#FFF0F3] overflow-hidden">
      {/* Decorative leaf cutouts */}
      <BotanicalLeaves className="absolute top-10 -right-6 w-36 h-56 opacity-30 -rotate-12 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionReveal variant="fade-up">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#7D1128] text-white flex items-center justify-center border-2 border-[#4A0812] shadow-sm animate-gentle-pulse">
              <Gift className="w-6 h-6 text-[#FAD2D8]" />
            </div>
            <span className="font-script text-2xl text-[#B3394B] font-bold block mb-1">
              Tanda Kasih & Kado Online 🎁
            </span>
            <h2 className="font-handwriting text-5xl sm:text-6xl text-[#660F1A] mb-2">
              Amplop Digital
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#7D1128] leading-relaxed">
              Doa restu kalian udah bikin kami hepi maksimal! Tapi kalau mau kasih jajan tambahan buat bekal honeymoon atau beli boba berdua, fitur ini siap menampung:
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
                <div className="doodle-box p-6 relative overflow-hidden flex flex-col justify-between h-full bg-white">
                  {/* Washi tape accent */}
                  <div className="absolute -top-3.5 right-6 w-20 h-6 washi-tape-cute rotate-2 rounded-xs" />

                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-script font-bold bg-[#FFF0F3] text-[#7D1128] border border-[#FAD2D8] mb-3">
                      {acc.cuteLabel}
                    </span>

                    <div className="flex items-center justify-between border-b-2 border-dashed border-[#8A1C2C]/30 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#7D1128]" />
                        <span className="font-serif font-bold text-sm text-[#4A0812]">
                          {acc.bankName}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#7D1128] bg-[#FFF0F3] px-2 py-0.5 rounded border border-[#8A1C2C]/40">
                        {acc.logoText}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-[#9E2A3B] uppercase tracking-wider mb-1">
                      Nomor Rekening:
                    </p>
                    <p className="font-mono font-bold text-xl sm:text-2xl text-[#660F1A] tracking-wider mb-2">
                      {acc.accountNumber}
                    </p>
                    <p className="text-xs font-sans text-[#7D1128] mb-5">
                      a.n <span className="font-bold text-[#4A0812]">{acc.accountHolder}</span>
                    </p>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(acc.accountNumber, index)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-sans font-bold cursor-pointer transition-all ${
                      isCopied
                        ? "bg-[#2E7D32] text-white border-2 border-[#1B5E20] shadow-[2px_2px_0px_#1B5E20]"
                        : "doodle-button"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Tersalin! Makasih Orang Baik 🥰
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Salin Nomor Rekening
                      </>
                    )}
                  </button>
                </div>
              </MotionReveal>
            );
          })}
        </div>

        {/* Physical Gift Delivery Address */}
        <MotionReveal variant="paper-unfold" delay={0.35}>
          <div className="max-w-xl mx-auto doodle-box p-6 bg-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-[#7D1128]">
              <MapPin className="w-4 h-4 text-[#D63D56]" />
              <span className="font-script font-bold text-xl">
                Alamat Kirim Kado Fisik 📦
              </span>
            </div>

            <p className="text-xs sm:text-sm font-sans text-[#4A0812] mb-1">
              Penerima: <span className="font-bold">{physicalGiftAddress.recipient}</span> ({physicalGiftAddress.phone})
            </p>
            <p className="text-xs font-sans text-[#7D1128] max-w-md mx-auto leading-relaxed mb-4">
              {physicalGiftAddress.address}
            </p>

            <button
              onClick={() => handleCopyAddress(`${physicalGiftAddress.recipient} - ${physicalGiftAddress.phone}\n${physicalGiftAddress.address}`)}
              className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold cursor-pointer transition-all ${
                copiedAddress
                  ? "bg-[#2E7D32] text-white rounded-2xl border-2 border-[#1B5E20]"
                  : "doodle-button-alt"
              }`}
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Alamat Berhasil Disalin!
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#7D1128]" />
                  Salin Alamat Lengkap
                </>
              )}
            </button>
          </div>
        </MotionReveal>
      </div>

      <div className="mt-16">
        <TornPaperDivider position="bottom" color="#FFF5F6" />
      </div>
    </section>
  );
}
