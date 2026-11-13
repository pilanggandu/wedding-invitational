"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_INVITATION_DATA,
  getInvitationData,
  syncWithBackend,
  isGuestDeletedLocally,
} from "@/lib/invitationStore";
import { verifyGuestTokenApi, checkGuestAccessApi } from "@/lib/api";
import { WeddingInvitationData } from "@/types/wedding";
import { TemplateRenderer } from "@/templates/TemplateRenderer";
import { AccessDeniedInvitation } from "@/components/AccessDeniedInvitation";

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
  const [isAccessDenied, setIsAccessDenied] = useState<boolean>(() => {
    return isGuestDeletedLocally({ token: tokenParam, name: rawTo });
  });

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

  // Cek apakah tamu terhapus di penyimpanan lokal
  useEffect(() => {
    if (isGuestDeletedLocally({ token: tokenParam, name: rawTo })) {
      setIsAccessDenied(true);
      try {
        sessionStorage.removeItem("verified_wedding_guest");
      } catch {}
    }
  }, [tokenParam, rawTo]);

  // Resolusi token tamu & validasi akses dari backend
  useEffect(() => {
    let isCancelled = false;

    if (tokenParam) {
      verifyGuestTokenApi(tokenParam).then((res) => {
        if (isCancelled) return;
        if (res.isDeleted) {
          setIsAccessDenied(true);
          try {
            sessionStorage.removeItem("verified_wedding_guest");
          } catch {}
          return;
        }
        if (res.success && res.guest) {
          setVerifiedGuest(res.guest);
          setResolvedName(res.guest.name);
          try {
            sessionStorage.setItem("verified_wedding_guest", JSON.stringify(res.guest));
          } catch {}
        }
      });
    }

    if (rawTo || tokenParam) {
      checkGuestAccessApi({ token: tokenParam, name: rawTo }).then((access) => {
        if (isCancelled) return;
        if (access.isDeleted) {
          setIsAccessDenied(true);
          try {
            sessionStorage.removeItem("verified_wedding_guest");
          } catch {}
        }
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [tokenParam, rawTo]);

  if (isAccessDenied) {
    const coupleTitle =
      weddingData.couple?.groom?.name && weddingData.couple?.bride?.name
        ? `${weddingData.couple.groom.name} & ${weddingData.couple.bride.name}`
        : "Gilang & Salsadila";

    return (
      <AccessDeniedInvitation
        guestName={resolvedName || rawTo || undefined}
        coupleName={coupleTitle}
      />
    );
  }

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
