"use client";

import React from "react";
import Link from "next/link";
import { Lock, HeartHandshake, AlertCircle, Home } from "lucide-react";

interface AccessDeniedInvitationProps {
  reason?: "deleted" | "invalid";
  guestName?: string;
  coupleName?: string;
}

export function AccessDeniedInvitation({
  reason = "deleted",
  guestName,
  coupleName = "Gilang & Salsadila",
}: AccessDeniedInvitationProps) {
  const isInvalid = reason === "invalid";

  const title = isInvalid
    ? "Tautan Undangan Tidak Ditemukan"
    : "Akses Undangan Dinonaktifkan";

  const badgeText = isInvalid ? "Tautan Tidak Valid" : "Informasi Undangan";

  const primaryMessage = isInvalid
    ? "Mohon maaf, tautan undangan dengan kode ini tidak valid atau tidak terdaftar dalam daftar undangan resmi kami."
    : "Mohon maaf, tautan undangan pernikahan ini sudah tidak aktif atau telah dinonaktifkan oleh pihak mempelai.";

  const secondaryMessage = isInvalid
    ? "Pastikan Anda membuka tautan resmi yang dikirimkan langsung oleh kedua mempelai, atau hubungi mempelai apabila Anda membutuhkan bantuan."
    : "Apabila Anda merasa hal ini merupakan kekeliruan atau membutuhkan konfirmasi lebih lanjut, silakan menghubungi kedua mempelai secara langsung.";

  return (
    <main
      role="region"
      aria-label="Pemberitahuan Akses Undangan"
      className="min-h-screen bg-[#FFF9FA] text-[#2D2424] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#F2DFBA] p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Decorative corner accent */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-28 h-28 bg-[#7D1128]/5 rounded-full pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#E5B869]/10 rounded-full pointer-events-none"
        />

        {/* Icon Header */}
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[#7D1128]/10 text-[#7D1128] flex items-center justify-center border border-[#7D1128]/20 shadow-inner">
          {isInvalid ? (
            <AlertCircle className="w-8 h-8" aria-hidden="true" />
          ) : (
            <Lock className="w-8 h-8" aria-hidden="true" />
          )}
        </div>

        {/* Badge status */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5A8B8]/20 text-[#7D1128] border border-[#F5A8B8]/40 mb-3">
          {isInvalid ? (
            <AlertCircle className="w-3.5 h-3.5" />
          ) : (
            <HeartHandshake className="w-3.5 h-3.5" />
          )}
          <span>{badgeText}</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#7D1128] mb-2 leading-tight">
          {title}
        </h1>

        {guestName && !isInvalid && (
          <p className="text-sm font-medium text-[#49271B] mb-3">
            Kepada Yth. <span className="font-semibold underline decoration-[#E5B869] decoration-2">{guestName}</span>
          </p>
        )}

        <div className="bg-[#FFF5F6] border border-[#F5A8B8]/30 rounded-2xl p-4 mb-6 text-sm text-[#4A3B32] leading-relaxed">
          <p className="mb-2">{primaryMessage}</p>
          <p className="text-xs text-[#6B5A50]">{secondaryMessage}</p>
        </div>

        {/* Couple Sign */}
        <div className="border-t border-[#F2DFBA]/70 pt-4 pb-2 mb-6">
          <p className="text-xs uppercase tracking-widest text-[#8C6D62] font-medium mb-1">
            Salam Hangat
          </p>
          <p className="font-serif text-lg font-bold text-[#7D1128]">
            {coupleName}
          </p>
        </div>

        {/* Action Link */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl bg-[#7D1128] text-white font-medium hover:bg-[#600C1E] active:scale-[0.98] transition shadow-md shadow-[#7D1128]/20 focus:outline-none focus:ring-2 focus:ring-[#7D1128] focus:ring-offset-2"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </main>
  );
}
