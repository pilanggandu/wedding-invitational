"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";
import { getInvitationData } from "@/lib/invitationStore";
import { WeddingInvitationData } from "@/types/wedding";
import { TemplateRenderer } from "@/templates/TemplateRenderer";

function InvitationContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || searchParams.get("u") || searchParams.get("nama") || "";
  const guestName = rawTo ? rawTo.trim() : undefined;

  const [weddingData, setWeddingData] = useState<WeddingInvitationData>(getInvitationData());

  useEffect(() => {
    // Initial fetch on mount
    setWeddingData(getInvitationData());

    const handleDataChanged = () => {
      setWeddingData(getInvitationData());
    };

    window.addEventListener("wedding-data-changed", handleDataChanged);
    return () => {
      window.removeEventListener("wedding-data-changed", handleDataChanged);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <TemplateRenderer data={weddingData} guestName={guestName} />

      {/* Discreet floating shortcut to Admin Panel for the wedding host */}
      <div className="fixed bottom-4 left-4 z-40">
        <Link
          href="/admin"
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#4A0812]/90 hover:bg-[#4A0812] text-[#FFE58F] border border-[#E5B869]/70 shadow-lg text-xs font-mono font-bold backdrop-blur-xs transition-all hover:scale-105"
          title="Buka Dashboard Manajemen Undangan"
        >
          <Settings className="w-3.5 h-3.5 text-[#FFE58F] group-hover:rotate-45 transition-transform" />
          <span>Dashboard Admin</span>
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
