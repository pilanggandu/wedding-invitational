"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  KeyRound,
  Delete,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  verifyPhotoboxPasscode,
  setPhotoboxUnlockedSession,
} from "./passcode";

interface PhotoboxPasscodeGateProps {
  onUnlock: () => void;
  configuredPasscode?: string;
}

export function PhotoboxPasscodeGate({
  onUnlock,
  configuredPasscode,
}: PhotoboxPasscodeGateProps) {
  const [pin, setPin] = useState<string>("");
  const [errorShake, setErrorShake] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Trigger verifikasi PIN saat panjang digit mencapai 4
  const handleVerify = useCallback(
    (codeToVerify: string) => {
      if (verifyPhotoboxPasscode(codeToVerify, configuredPasscode)) {
        setIsSuccess(true);
        setErrorMessage("");
        setPhotoboxUnlockedSession(true);

        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#D4AF37", "#4A121A", "#E8DFC8", "#FFFFFF"],
          });
        } catch {
          // Abaikan jika confetti gagal di browser tertentu
        }

        setTimeout(() => {
          onUnlock();
        }, 650);
      } else {
        setErrorShake(true);
        setErrorMessage("Passcode belum tepat. Silakan coba lagi.");
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          try {
            navigator.vibrate(200);
          } catch {
            // Abaikan jika perangkat tidak mendukung getar
          }
        }
        setTimeout(() => {
          setPin("");
          setErrorShake(false);
        }, 700);
      }
    },
    [onUnlock, configuredPasscode]
  );

  // Tambah digit ke input PIN
  const handleAddDigit = useCallback(
    (digit: string) => {
      if (isSuccess || pin.length >= 4) return;
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMessage("");

      if (nextPin.length === 4) {
        handleVerify(nextPin);
      }
    },
    [pin, isSuccess, handleVerify]
  );

  // Hapus satu digit terakhir
  const handleBackspace = useCallback(() => {
    if (isSuccess || pin.length === 0) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage("");
  }, [isSuccess, pin.length]);

  // Hapus seluruh digit
  const handleClear = useCallback(() => {
    if (isSuccess) return;
    setPin("");
    setErrorMessage("");
  }, [isSuccess]);

  // Keyboard listener untuk pengguna desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess) return;

      if (/^[0-9]$/.test(e.key)) {
        handleAddDigit(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSuccess, handleAddDigit, handleBackspace, handleClear]);

  // Cek jika terdapat parameter URL pin/code/passcode saat pertama kali dimuat
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("pin") || params.get("code") || params.get("passcode");
      if (urlCode && verifyPhotoboxPasscode(urlCode, configuredPasscode)) {
        setIsSuccess(true);
        setPhotoboxUnlockedSession(true);
        onUnlock();
      }
    } catch {
      // Abaikan error pembacaan URL
    }
  }, [onUnlock, configuredPasscode]);

  const keypadButtons = [
    { label: "1", value: "1", type: "digit" as const },
    { label: "2", value: "2", type: "digit" as const },
    { label: "3", value: "3", type: "digit" as const },
    { label: "4", value: "4", type: "digit" as const },
    { label: "5", value: "5", type: "digit" as const },
    { label: "6", value: "6", type: "digit" as const },
    { label: "7", value: "7", type: "digit" as const },
    { label: "8", value: "8", type: "digit" as const },
    { label: "9", value: "9", type: "digit" as const },
    { label: "Hapus", value: "clear", type: "action" as const, action: handleClear },
    { label: "0", value: "0", type: "digit" as const },
    { label: "Backspace", value: "backspace", type: "action" as const, action: handleBackspace },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#3A332C] flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden select-none">
      {/* Background Ornament Lembut */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#EADCC7] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E2CEB5] blur-3xl" />
      </div>

      {/* Main Passcode Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-md border border-[#E8DFC8] rounded-3xl p-6 sm:p-8 shadow-xl relative z-10 flex flex-col items-center text-center"
      >
        {/* Top Header Badge & Seal */}
        <div className="relative mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FAF6EE] border-2 border-[#E8DFC8] p-1 shadow-md flex items-center justify-center relative overflow-hidden">
            <Image
              src="/images/paper-keepsake/real-gold-wax-seal.png"
              alt="Wax Seal Gilang & Salsa"
              width={76}
              height={76}
              className="w-full h-full object-contain filter drop-shadow-sm"
              priority
            />
            {/* Overlay Lock/Unlock Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="unlocked"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="p-2 rounded-full bg-emerald-600 text-white shadow-md"
                  >
                    <Unlock className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-1.5 rounded-full bg-[#4A121A]/85 text-[#DFD2BD] shadow-xs"
                  >
                    <Lock className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Title & Microcopy */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#4A121A]/10 text-[#4A121A] mb-2">
          <Camera className="w-3.5 h-3.5 text-[#8C6239]" />
          <span>Bilik Foto Spesial</span>
        </div>

        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#4A121A] tracking-tight">
          Photobox Gilang & Salsa
        </h1>
        <p className="text-xs sm:text-sm text-[#786551] mt-1 max-w-xs leading-relaxed">
          Silakan masukkan 4 digit passcode untuk membuka studio foto pernikahan.
        </p>

        {/* PIN 4 Slots Indicator */}
        <motion.div
          animate={
            errorShake
              ? { x: [-10, 10, -8, 8, -4, 4, 0] }
              : isSuccess
              ? { scale: [1, 1.06, 1] }
              : {}
          }
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-3 sm:gap-4 my-6"
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length;
            return (
              <div
                key={index}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 ${
                  isSuccess
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : errorShake
                    ? "border-rose-400 bg-rose-50 shadow-sm"
                    : isFilled
                    ? "border-[#4A121A] bg-[#FAF6EE] shadow-sm"
                    : "border-[#E8DFC8] bg-white shadow-xs"
                }`}
              >
                <AnimatePresence>
                  {isFilled && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      className="flex items-center justify-center"
                    >
                      {isSuccess ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[#4A121A] shadow-xs" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* Error Feedback Message */}
        <div className="min-h-[22px] flex items-center justify-center mb-3">
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200"
            >
              {errorMessage}
            </motion.p>
          )}
          {isSuccess && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Passcode benar! Membuka studio foto...</span>
            </motion.p>
          )}
        </div>

        {/* Touch / Click Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[290px] sm:max-w-[320px]">
          {keypadButtons.map((btn, idx) => {
            if (btn.type === "digit") {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddDigit(btn.value)}
                  disabled={isSuccess || pin.length >= 4}
                  className="h-12 sm:h-14 rounded-2xl bg-white hover:bg-[#FAF6EE] active:scale-95 border border-[#E8DFC8] text-lg sm:text-xl font-bold text-[#4A121A] transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus:ring-2 focus:ring-[#8C6239]"
                  aria-label={`Digit ${btn.label}`}
                >
                  {btn.label}
                </button>
              );
            }

            if (btn.value === "clear") {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={btn.action}
                  disabled={isSuccess || pin.length === 0}
                  className="h-12 sm:h-14 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2E8D5] active:scale-95 border border-[#E8DFC8] text-xs font-bold text-[#786551] transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-hidden"
                  aria-label="Bersihkan input PIN"
                >
                  C
                </button>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={btn.action}
                disabled={isSuccess || pin.length === 0}
                className="h-12 sm:h-14 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2E8D5] active:scale-95 border border-[#E8DFC8] text-[#786551] transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-hidden"
                aria-label="Hapus satu angka terakhir"
              >
                <Delete className="w-5 h-5" />
              </button>
            );
          })}
        </div>

        {/* Hint Accordion Toggle */}
        <div className="mt-5 w-full flex flex-col items-center">
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6239] hover:text-[#4A121A] transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-[#FAF6EE]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? "Tutup petunjuk" : "Butuh petunjuk passcode?"}</span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-2"
              >
                <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#E8DFC8] text-xs text-[#5C4A3A] text-left leading-relaxed max-w-xs shadow-xs">
                  <p className="font-semibold text-[#4A121A] mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#8C6239]" />
                    <span>Petunjuk Passcode:</span>
                  </p>
                  <p>
                    {configuredPasscode ? (
                      <>
                        Gunakan passcode yang ditentukan oleh pengelola (<strong>{configuredPasscode}</strong>) atau tahun pernikahan (<strong>2026</strong>).
                      </>
                    ) : (
                      <>
                        Gunakan tahun pernikahan mempelai (<strong>2026</strong>) atau tanggal resepsi (<strong>2111</strong>).
                      </>
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Exit Link to Main Invitation */}
        <div className="mt-6 pt-4 border-t border-[#E8DFC8] w-full flex items-center justify-center">
          <Link
            href="/undangan"
            className="inline-flex items-center gap-1.5 text-xs text-[#786551] hover:text-[#4A121A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Undangan</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
