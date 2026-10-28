"use client";

import React, { useState } from "react";
import { Check, Copy, Gift, Mail, MapPin } from "lucide-react";
import { useWeddingData } from "@/context/WeddingDataContext";
import type { BankAccount } from "@/types/wedding";

export function CraftBookEnvelope() {
  const data = useWeddingData();
  const [isOpen, setIsOpen] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const bankAccounts: BankAccount[] = data.gifts?.accounts || [];
  const physical = data.gifts?.physicalGiftAddress;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div className="cb-envelope-stage">
      <div className={`cb-kraft-envelope ${isOpen ? "open" : ""}`}>
        <div className="flex justify-center -mb-2 relative z-10 pointer-events-none select-none">
          <img
            src="/images/templates/craft-book/kraft-pocket-flap.svg"
            alt=""
            aria-hidden="true"
            className="w-48 sm:w-56 h-auto object-contain drop-shadow-sm"
          />
        </div>
        <div className="cb-envelope-header">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[#f7dfba]" />
            <h3>Amplop Tanda Kasih Digital</h3>
          </div>
          <button
            type="button"
            className="cb-envelope-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            {isOpen ? "Tutup Amplop" : "Buka Amplop"}
          </button>
        </div>

        {isOpen && (
          <div className="cb-envelope-content">
            <p className="text-sm text-[#6e5e54] mb-5 text-center leading-relaxed">
              Doa restu Anda adalah karunia terindah bagi kami. Namun apabila Anda
              berkenan memberikan tanda kasih, amplop digital dan alamat kado
              tersedia di bawah ini:
            </p>

            {bankAccounts.length > 0 ? (
              <div className="space-y-4">
                {bankAccounts.map((account, idx) => (
                  <div key={idx} className="cb-bank-card">
                    <div className="cb-bank-header">
                      <span className="cb-bank-name">{account.bankName}</span>
                      <button
                        type="button"
                        className="cb-copy-btn"
                        onClick={() => handleCopy(account.accountNumber, idx)}
                        aria-label={`Salin nomor rekening ${account.bankName}`}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={14} className="text-emerald-600 inline mr-1" />
                            Tersalin
                          </>
                        ) : (
                          <>
                            <Copy size={14} className="inline mr-1" />
                            Salin Rekening
                          </>
                        )}
                      </button>
                    </div>
                    <div className="cb-bank-number">{account.accountNumber}</div>
                    <div className="cb-bank-holder">
                      a.n. <strong>{account.accountHolder}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cb-bank-card text-center py-6">
                <Gift size={28} className="mx-auto text-[#c26d53] mb-2" />
                <p className="text-sm text-[#6e5e54]">
                  Informasi tanda kasih dapat disampaikan langsung kepada kedua mempelai.
                </p>
              </div>
            )}

            {physical && physical.address && (
              <div className="cb-bank-card mt-5 bg-[#fdfaf6]">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#c26d53]">
                    <MapPin size={15} />
                    <span>ALAMAT PENGIRIMAN KADO:</span>
                  </div>
                  <button
                    type="button"
                    className="cb-copy-btn"
                    onClick={() => handleCopyAddress(`${physical.recipient || ""}\n${physical.address}\n${physical.phone || ""}`.trim())}
                    aria-label="Salin alamat kado"
                  >
                    {copiedAddress ? (
                      <>
                        <Check size={14} className="text-emerald-600 inline mr-1" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="inline mr-1" />
                        Salin Alamat
                      </>
                    )}
                  </button>
                </div>
                <div className="text-sm text-[#2b231f] leading-relaxed">
                  {physical.recipient && <p className="font-bold">{physical.recipient}</p>}
                  {physical.phone && <p className="text-xs text-[#6e5e54] mb-1">{physical.phone}</p>}
                  <p>{physical.address}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
