"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Copy, Check, Gift } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { DoodlePawSticker, DoodleHeartSticker } from "./PaintedDecorations";
import { SectionMotion } from "@/components/SectionMotion";
import { ItemMotion } from "@/components/ItemMotion";

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
    <SectionMotion id="gift" className="relative py-16 px-6 text-center text-[#38241B] overflow-hidden">
      <div className="max-w-md mx-auto space-y-10">
        <ItemMotion variant="slide-down" delay={0.06} className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF4EC] border border-[#FCD5CE] text-[11px] font-sans font-bold text-[#DF7B54] mx-auto shadow-2xs">
            <ItemMotion float={true} floatDistance={3} floatDuration={3}>
              <DoodlePawSticker className="w-3.5 h-3.5" rotate={0} />
            </ItemMotion>
            <span>Tanda Kasih</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#38241B]">
            Amplop Digital &amp; Kado
          </h2>
          <p className="text-xs text-[#6E5345] max-w-xs mx-auto leading-relaxed">
            Doa restu Anda adalah anugerah terindah bagi kami. Bagi yang ingin berbagi tanda kasih, kami menyediakan nomor rekening di bawah ini.
          </p>
        </ItemMotion>

        <ItemMotion variant="pop" delay={0.12} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFF4EC] border border-[#FCD5CE] text-xs text-[#6E5345] font-sans shadow-2xs">
          <ItemMotion float={true} floatDistance={4} floatDuration={2.6}>
            <DoodleHeartSticker className="w-4 h-4 shrink-0" rotate={-5} />
          </ItemMotion>
          <span>Terima kasih banyak atas doa dan kasih sayang yang tulus!</span>
        </ItemMotion>

        <div className="space-y-4">
          {accounts.map((acc, idx) => {
            const isCopied = copiedAccount === String(idx);
            return (
              <ItemMotion
                key={idx}
                variant={idx % 2 === 0 ? "slide-left" : "slide-right"}
                delay={idx * 0.12}
                className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 border-[3.5px] border-white ring-1 ring-[#F3DFD1] shadow-[0_16px_36px_rgba(222,125,84,0.1)] text-left relative overflow-hidden"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#F5E6DC]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FFF4EC] flex items-center justify-center text-[#DF7B54]">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="font-serif font-bold text-base text-[#38241B] tracking-wide">
                      {acc.bankName}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-[#FFF4EC] text-[#DF7B54] border border-[#FCD5CE]">
                    Transfer Bank
                  </span>
                </div>

                <div className="py-4 space-y-1">
                  <span className="text-[10px] font-sans uppercase font-bold text-[#8C6D58] block">
                    Nomor Rekening
                  </span>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#38241B] tracking-wider">
                    {acc.accountNumber}
                  </p>
                  <p className="text-xs text-[#6E5345] font-sans pt-0.5">
                    a.n. <strong className="text-[#38241B] font-semibold">{acc.accountHolder}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(acc.accountNumber, String(idx))}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isCopied
                      ? "bg-[#E8F5E9] border border-[#A5D6A7] text-[#2E7D32]"
                      : "bg-gradient-to-r from-[#DF7B54] to-[#F4929D] hover:opacity-95 text-white"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-[#2E7D32]" />
                      <span>Nomor Rekening Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-white" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </ItemMotion>
            );
          })}
        </div>

        {physicalAddress && physicalAddress.address && (
          <ItemMotion
            variant="pop"
            delay={0.15}
            className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 border-[3.5px] border-white ring-1 ring-[#F3DFD1] shadow-[0_16px_36px_rgba(222,125,84,0.1)] text-left space-y-3"
          >
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#F5E6DC]">
              <div className="w-8 h-8 rounded-full bg-[#FFF4EC] flex items-center justify-center text-[#DF7B54]">
                <Gift className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#38241B]">
                Kirim Kado Fisik
              </h3>
            </div>
            <p className="text-xs text-[#5C4A3E] leading-relaxed font-sans">
              {physicalAddress.address}
            </p>
            {physicalAddress.recipient && (
              <p className="text-xs font-sans text-[#DF7B54] font-medium">
                Penerima: {physicalAddress.recipient} {physicalAddress.phone ? `(${physicalAddress.phone})` : ""}
              </p>
            )}
            <button
              type="button"
              onClick={() => handleCopyAddress(physicalAddress.address)}
              className="py-2.5 px-4 rounded-xl bg-[#FFF4EC] hover:bg-[#FCEADE] border border-[#FCD5CE] text-xs font-sans font-bold text-[#DF7B54] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-4 h-4 text-[#2E7D32]" />
                  <span className="text-[#2E7D32]">Alamat Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#DF7B54]" />
                  <span>Salin Alamat</span>
                </>
              )}
            </button>
          </ItemMotion>
        )}
      </div>
    </SectionMotion>
  );
}

