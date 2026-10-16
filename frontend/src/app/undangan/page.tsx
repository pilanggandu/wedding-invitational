"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";
import { getInvitationData, syncWithBackend } from "@/lib/invitationStore";
import { verifyGuestTokenApi } from "@/lib/api";
import { WeddingInvitationData } from "@/types/wedding";
import { TemplateRenderer } from "@/templates/TemplateRenderer";

function InvitationContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("u") || searchParams.get("token") || "";
  const rawTo = searchParams.get("to") || searchParams.get("nama") || "";
  const templateParam = searchParams.get("template") || searchParams.get("theme") || "";

  const [weddingData, setWeddingData] = useState<WeddingInvitationData>(getInvitationData());
  const [verifiedGuest, setVerifiedGuest] = useState<{
    id: string;
    name: string;
    quota: number;
    token?: string;
    phone?: string;
  } | null>(null);
  const [resolvedName, setResolvedName] = useState<string | undefined>(
    rawTo ? rawTo.trim() : undefined
  );

  useEffect(() => {
    // Initial fetch on mount and sync with SQLite/Supabase/PostgreSQL backend
    setWeddingData(getInvitationData());
    syncWithBackend();

    const handleDataChanged = () => {
      setWeddingData(getInvitationData());
    };

    window.addEventListener("wedding-data-changed", handleDataChanged);
    return () => {
      window.removeEventListener("wedding-data-changed", handleDataChanged);
    };
  }, []);

  // Resolusi token tamu secara otomatis & pencatatan open tracking
  useEffect(() => {
    if (tokenParam) {
      verifyGuestTokenApi(tokenParam).then((res) => {
        if (res.success && res.guest) {
          setVerifiedGuest(res.guest);
          setResolvedName(res.guest.name);
          try {
            sessionStorage.setItem("verified_wedding_guest", JSON.stringify(res.guest));
          } catch {}
        }
      });
    }
  }, [tokenParam]);

  const effectiveData = templateParam
    ? { ...weddingData, activeTemplateId: templateParam }
    : weddingData;

  return (
    <div className="relative min-h-screen">
      <TemplateRenderer
        data={effectiveData}
        guestName={resolvedName}
        guestItem={verifiedGuest}
      />

      {/* Discreet floating shortcut to Admin Panel for the wedding host */}
      <div className="fixed top-3.5 right-3.5 sm:top-auto sm:bottom-4 sm:left-4 z-40">
        <Link
          href="/admin"
          className="group flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-white border border-zinc-700/80 shadow-lg text-xs font-sans font-medium backdrop-blur-xs transition-all hover:scale-105 min-h-[44px] min-w-[44px] justify-center"
          title="Buka Dashboard Manajemen Undangan"
        >
          <Settings className="w-3.5 h-3.5 text-zinc-300 group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline">Dashboard Admin</span>
          <span className="sm:hidden text-[11px] font-sans font-medium">Admin</span>
        </Link>
      </div>
    </div>
  );
}

export default function WeddingInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF5F6] flex items-center justify-center text-[#7D1128] font-script text-xl">
          Memuat undangan penuh kebahagiaan...
        </div>
      }
    >
      <InvitationContent />
    </Suspense>
  );
}
