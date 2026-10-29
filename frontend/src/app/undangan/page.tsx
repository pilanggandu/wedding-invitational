"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_INVITATION_DATA, getInvitationData, syncWithBackend } from "@/lib/invitationStore";
import { verifyGuestTokenApi } from "@/lib/api";
import { WeddingInvitationData } from "@/types/wedding";
import { TemplateRenderer } from "@/templates/TemplateRenderer";

function InvitationContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("u") || searchParams.get("token") || "";
  const rawTo = searchParams.get("to") || searchParams.get("nama") || "";
  const templateParam = searchParams.get("template") || searchParams.get("theme") || "";

  const [weddingData, setWeddingData] = useState<WeddingInvitationData>(DEFAULT_INVITATION_DATA);
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
