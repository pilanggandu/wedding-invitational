"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  Palette,
  HeartHandshake,
  Users,
  MessageSquareHeart,
  ExternalLink,
  Smartphone,
  RotateCcw,
  ChevronRight,
  LogOut,
  Sparkles,
  Check,
  Copy,
  Heart,
  ShieldCheck,
  Camera,
  QrCode,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminAuthView } from "./components/AdminAuthView";
import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";
import {
  getInvitationData,
  getGuests,
  getWishes,
  resetInvitationData,
  saveInvitationData,
  syncWithBackend,
} from "@/lib/invitationStore";
import { checkBackendHealth, setStoredAuthToken } from "@/lib/api";
import { AdminOverview } from "./components/AdminOverview";
import { TemplateThemeManager } from "./components/TemplateThemeManager";
import { CoupleEventManager } from "./components/CoupleEventManager";
import { GuestListManager } from "./components/GuestListManager";
import { RsvpManager } from "./components/RsvpManager";
import { LivePreviewModal } from "./components/LivePreviewModal";
import { CoupleSetupModal } from "./components/CoupleSetupModal";
import { TemplateEditorWorkspace } from "./components/TemplateEditorWorkspace";
import { A3PosterModal } from "@/components/photobox/A3PosterModal";

type AdminTab = "overview" | "templates" | "wedding-data" | "guests" | "wishes";

interface NavGroup {
  groupTitle: string;
  items: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number | null;
  }[];
}

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [invitationData, setInvitationData] = useState<WeddingInvitationData>(
    getInvitationData()
  );
  const [guests, setGuests] = useState<GuestItem[]>(getGuests());
  const [wishes, setWishes] = useState<WishMessage[]>(getWishes());
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewOverrideTemplate, setPreviewOverrideTemplate] = useState<string | undefined>(undefined);
  const [previewOverrideData, setPreviewOverrideData] = useState<WeddingInvitationData | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorTemplateId, setEditorTemplateId] = useState<string | null>(null);
  const [isCoupleModalOpen, setIsCoupleModalOpen] = useState<boolean>(false);
  const [isA3PosterOpen, setIsA3PosterOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCopiedPublicLink, setIsCopiedPublicLink] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<{
    online: boolean;
    database: string;
  } | null>(null);

  useEffect(() => {
    setInvitationData(getInvitationData());
    setGuests(getGuests());
    setWishes(getWishes());

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    syncWithBackend();

    checkBackendHealth().then((status) => {
      setBackendStatus(status);
    });

    const handleDataChange = () => setInvitationData(getInvitationData());
    const handleGuestsChange = () => setGuests(getGuests());
    const handleWishesChange = () => setWishes(getWishes());

    window.addEventListener("wedding-data-changed", handleDataChange);
    window.addEventListener("wedding-guests-changed", handleGuestsChange);
    window.addEventListener("wedding-wishes-changed", handleWishesChange);

    return () => {
      window.removeEventListener("wedding-data-changed", handleDataChange);
      window.removeEventListener("wedding-guests-changed", handleGuestsChange);
      window.removeEventListener("wedding-wishes-changed", handleWishesChange);
    };
  }, []);

  useEffect(() => {
    const ssoToken = searchParams.get("token");
    if (ssoToken) {
      setStoredAuthToken(ssoToken);
      window.location.replace("/admin");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleResetData = () => {
    if (confirm("Kembalikan seluruh data undangan ke pengaturan bawaan awal?")) {
      const reset = resetInvitationData();
      setInvitationData(reset);
    }
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const publicUrl = `${origin}/undangan`;
    navigator.clipboard.writeText(publicUrl);
    setIsCopiedPublicLink(true);
    setTimeout(() => setIsCopiedPublicLink(false), 2000);
  };

  const defaultPosterPhoto = useMemo(() => {
    return (
      invitationData.general?.coverPhotoUrl ||
      invitationData.general?.heroPhotoUrl ||
      invitationData.general?.preweddingPhotos?.[0] ||
      invitationData.couple?.groom?.photoUrl ||
      "/images/paper-keepsake/couple-watercolor-keepsake.jpg"
    );
  }, [invitationData]);

  const posterAvailablePhotos = useMemo(() => {
    const raw = [
      ...(invitationData.general?.coverPhotoUrl
        ? [
            {
              id: "cover",
              label: "Foto Sampul Undangan",
              url: invitationData.general.coverPhotoUrl,
              category: "Undangan",
            },
          ]
        : []),
      ...(invitationData.general?.heroPhotoUrl
        ? [
            {
              id: "hero",
              label: "Foto Utama (Hero)",
              url: invitationData.general.heroPhotoUrl,
              category: "Undangan",
            },
          ]
        : []),
      ...(invitationData.general?.closingPhotoUrl
        ? [
            {
              id: "closing",
              label: "Foto Penutup Undangan",
              url: invitationData.general.closingPhotoUrl,
              category: "Undangan",
            },
          ]
        : []),
      ...(invitationData.general?.preweddingPhotos || []).map((url, idx) => ({
        id: `prewed-${idx}`,
        label: `Prewedding #${idx + 1}`,
        url,
        category: "Prewedding",
      })),
      ...(invitationData.couple?.groom?.photoUrl
        ? [
            {
              id: "groom",
              label: "Foto Pengantin Pria",
              url: invitationData.couple.groom.photoUrl,
              category: "Pengantin",
            },
          ]
        : []),
      ...(invitationData.couple?.bride?.photoUrl
        ? [
            {
              id: "bride",
              label: "Foto Pengantin Wanita",
              url: invitationData.couple.bride.photoUrl,
              category: "Pengantin",
            },
          ]
        : []),
      {
        id: "watercolor-default",
        label: "Ilustrasi Cat Air",
        url: "/images/paper-keepsake/couple-watercolor-keepsake.jpg",
        category: "Ilustrasi",
      },
    ];

    const seen = new Set<string>();
    return raw.filter((item) => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  }, [invitationData]);

  const navGroups: NavGroup[] = [
    {
      groupTitle: "MENU UTAMA",
      items: [
        {
          id: "overview",
          label: "Ringkasan",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupTitle: "DESAIN & TAMPILAN",
      items: [
        {
          id: "templates",
          label: "Template & Tema",
          icon: Palette,
          badge: "6 Desain",
        },
        {
          id: "wedding-data",
          label: "Data Mempelai & Acara",
          icon: HeartHandshake,
        },
      ],
    },
    {
      groupTitle: "MANAJEMEN TAMU",
      items: [
        {
          id: "guests",
          label: "Daftar Tamu & WhatsApp",
          icon: Users,
          badge: guests.length,
        },
        {
          id: "wishes",
          label: "Buku Tamu & RSVP",
          icon: MessageSquareHeart,
          badge: wishes.length,
        },
      ],
    },
  ];

  const currentTabLabel =
    navGroups
      .flatMap((g) => g.items)
      .find((item) => item.id === activeTab)?.label || "Ringkasan";

  const groomName = invitationData.couple?.groom?.name?.trim() || "";
  const brideName = invitationData.couple?.bride?.name?.trim() || "";
  const isCoupleConfigured = Boolean(groomName && brideName);
  const monogram = isCoupleConfigured
    ? `${groomName.charAt(0)}${brideName.charAt(0)}`.toUpperCase()
    : "WD";
  const coupleDisplayTitle = isCoupleConfigured
    ? `${groomName} & ${brideName}`
    : "Atur Nama Mempelai";
  const mainEventDate = invitationData.events?.[0]?.displayDate || "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#1C2434] border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Memeriksa sesi pengelola...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#1C2434] border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Mengarahkan ke gerbang masuk pengelola...</p>
        </div>
      </div>
    );
  }

  const renderNavSection = (onItemClick?: () => void) => (
    <div className="space-y-6">
      {navGroups.map((group) => (
        <div key={group.groupTitle} className="space-y-1.5">
          <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            {group.groupTitle}
          </div>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onItemClick?.();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-amber-300" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                        isActive
                          ? "bg-slate-800 text-amber-200 border border-slate-700"
                          : "bg-slate-100 text-slate-600 border border-slate-200/60"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer flex items-center justify-center shadow-2xs shrink-0"
            aria-label="Toggle Sidebar Navigation"
            title={isSidebarOpen ? "Sembunyikan Menu" : "Buka Menu"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium shrink-0">
            <span className="text-slate-500">Dashboard</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">{currentTabLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCoupleModalOpen(true)}
            className="min-h-[44px] flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left cursor-pointer group shadow-2xs bg-white min-w-0 max-w-[150px] xs:max-w-[190px] sm:max-w-[240px]"
            title="Klik untuk mengatur nama mempelai"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-900 text-amber-200 flex items-center justify-center font-bold text-[10px] uppercase font-mono shadow-2xs shrink-0">
              {monogram}
            </div>
            <div className="min-w-0 truncate">
              <span className="text-xs font-semibold text-slate-900 block truncate leading-tight">
                {coupleDisplayTitle}
              </span>
              <span className="text-[10px] text-slate-500 block truncate leading-none mt-0.5">
                {isCoupleConfigured ? "Edit data" : "Belum diisi"}
              </span>
            </div>
            {!isCoupleConfigured && (
              <span className="hidden md:inline px-1.5 py-0.5 rounded-full text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-medium shrink-0">
                Wajib
              </span>
            )}
          </button>
        </div>

        {/* Toolbar: Desktop View (lg+) */}
        <div className="hidden lg:flex items-center gap-2 sm:gap-2.5">
          {backendStatus && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono ${
                backendStatus.online
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus.online ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span>
                {backendStatus.online
                  ? `${backendStatus.database.toUpperCase()} Terhubung`
                  : "Offline"}
              </span>
            </div>
          )}

          <button
            onClick={handleCopyLink}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Salin tautan web undangan"
          >
            {isCopiedPublicLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span>{isCopiedPublicLink ? "Tersalin" : "Salin Link"}</span>
          </button>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Buka pratinjau mobile"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-600" />
            <span>Pratinjau HP</span>
          </button>

          <Link
            href="/undangan"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-[0.98]"
            title="Buka halaman undangan langsung"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            <span>Buka Undangan</span>
          </Link>

          <Link
            href="/photobox"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 border border-amber-200/80 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Buka Photobox Studio"
          >
            <Camera className="w-3.5 h-3.5 text-amber-700" />
            <span>Photobox</span>
          </Link>

          <button
            onClick={() => setIsA3PosterOpen(true)}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Generate & Cetak Poster QR Code Standee (A3, A4, A5, A6, F4, 4R/5R)"
          >
            <QrCode className="w-3.5 h-3.5 text-rose-700" />
            <span>Cetak Poster QR</span>
          </button>

          <button
            onClick={handleResetData}
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center"
            title="Kembalikan data ke awal"
            aria-label="Kembalikan data ke awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-200 flex items-center justify-center font-bold text-xs uppercase shadow-2xs font-mono">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "A"}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">
                {user?.fullName || user?.username}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Administrator</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center justify-center ml-1"
            title="Keluar dari akun (Logout)"
            aria-label="Keluar dari akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar: Mobile & Tablet View (< lg) */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="min-h-[44px] px-2.5 sm:px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Buka pratinjau mobile"
          >
            <Smartphone className="w-4 h-4 text-slate-700" />
            <span className="hidden xs:inline">Preview</span>
          </button>

          {/* Quick Tools Dropdown Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer flex items-center justify-center shadow-2xs bg-white"
              aria-label="Menu Aksi Cepat"
              title="Menu Aksi Cepat"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-56 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Aksi Cepat
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {user?.username || "Admin"}
                    </span>
                  </div>

                  <Link
                    href="/undangan"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-100 font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span>Buka Web Undangan</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      handleCopyLink();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-100 font-medium transition-colors cursor-pointer text-left"
                  >
                    {isCopiedPublicLink ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500" />
                    )}
                    <span>{isCopiedPublicLink ? "Link Tersalin!" : "Salin Link Undangan"}</span>
                  </button>

                  <Link
                    href="/photobox"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-amber-900 bg-amber-50/50 hover:bg-amber-100/70 font-semibold transition-colors"
                  >
                    <Camera className="w-4 h-4 text-amber-700" />
                    <span>Buka Photobox Studio</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsA3PosterOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-900 bg-rose-50/50 hover:bg-rose-100/70 font-semibold transition-colors cursor-pointer text-left"
                  >
                    <QrCode className="w-4 h-4 text-rose-700" />
                    <span>Cetak Poster QR Standee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleResetData();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium transition-colors cursor-pointer text-left"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    <span>Reset Pengaturan Awal</span>
                  </button>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => logout()}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center justify-center"
            title="Keluar dari akun (Logout)"
            aria-label="Keluar dari akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>
      <div className="flex-1 flex w-full relative overflow-x-hidden">
        <aside
          className={`hidden lg:flex shrink-0 bg-white text-slate-800 border-r border-slate-200/80 flex-col justify-between transition-all duration-300 ease-in-out shadow-[1px_0_12px_rgba(0,0,0,0.02)] ${
            isSidebarOpen
              ? "w-64 opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-full overflow-hidden pointer-events-none"
          }`}
        >
          <div className="w-64 p-4 space-y-6">
            <div className="px-2 pt-1 pb-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  AU
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 tracking-wider uppercase block">
                      ATELIER
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    MyFin Dasbor
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Sembunyikan Menu"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {renderNavSection()}
          </div>
          <div className="w-64 p-4 border-t border-slate-100 bg-slate-50/50">
            <Link
              href="/undangan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-white transition-all border border-transparent hover:border-slate-200 hover:shadow-2xs"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">Web Undangan Tamu</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </aside>
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className="relative w-80 max-w-[85vw] bg-white text-slate-800 h-full p-4 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 border-r border-slate-200 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                      AU
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 tracking-wider uppercase block">
                        ATELIER
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Dasbor Pengelola
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Tutup Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {renderNavSection(() => setIsSidebarOpen(false))}
              </div>

              {/* Mobile Drawer Bottom Shortcuts */}
              <div className="pt-4 border-t border-slate-100 space-y-1.5 mt-4">
                <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                  Akses Cepat
                </div>

                <Link
                  href="/undangan"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors border border-slate-200/60"
                >
                  <span className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold">Web Undangan Tamu</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/photobox"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-amber-900 bg-amber-50/60 hover:bg-amber-100/70 transition-colors border border-amber-200/70"
                >
                  <span className="flex items-center gap-2.5">
                    <Camera className="w-4 h-4 text-amber-700" />
                    <span className="font-semibold">Photobox Studio</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setIsA3PosterOpen(true);
                  }}
                  className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-rose-900 bg-rose-50/60 hover:bg-rose-100/70 transition-colors border border-rose-200/70 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <QrCode className="w-4 h-4 text-rose-700" />
                    <span className="font-semibold">Cetak Poster Standee QR</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-700" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsSidebarOpen(false);
                  }}
                  className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer font-semibold"
                >
                  <span className="flex items-center gap-2.5">
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Keluar (Logout)</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {activeTab === "overview" && (
                <AdminOverview
                  data={invitationData}
                  guests={guests}
                  wishes={wishes}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenPreview={() => setIsPreviewOpen(true)}
                  onOpenCoupleModal={() => setIsCoupleModalOpen(true)}
                  onOpenA3Poster={() => setIsA3PosterOpen(true)}
                />
              )}

              {activeTab === "templates" && (
                <TemplateThemeManager
                  data={invitationData}
                  onUpdate={(updated) => setInvitationData(updated)}
                  onOpenPreview={(tmplId) => {
                    setPreviewOverrideTemplate(tmplId);
                    setIsPreviewOpen(true);
                  }}
                  onEditTemplate={(tmplId) => {
                    setEditorTemplateId(tmplId);
                    setIsEditorOpen(true);
                  }}
                  onOpenCoupleModal={() => setIsCoupleModalOpen(true)}
                />
              )}

              {activeTab === "wedding-data" && (
                <CoupleEventManager
                  data={invitationData}
                  onUpdate={(updated) => setInvitationData(updated)}
                  onOpenA3Poster={() => setIsA3PosterOpen(true)}
                />
              )}

              {activeTab === "guests" && (
                <GuestListManager
                  data={invitationData}
                  guests={guests}
                  onGuestsUpdated={(updated) => setGuests(updated)}
                />
              )}

              {activeTab === "wishes" && (
                <RsvpManager
                  wishes={wishes}
                  onWishesUpdated={(updated) => setWishes(updated)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewOverrideTemplate(undefined);
          setPreviewOverrideData(undefined);
        }}
        data={previewOverrideData || invitationData}
        overrideTemplateId={previewOverrideTemplate}
        onEditTemplate={(tmplId) => {
          setIsPreviewOpen(false);
          setPreviewOverrideData(undefined);
          setPreviewOverrideTemplate(undefined);
          setEditorTemplateId(tmplId);
          setIsEditorOpen(true);
        }}
      />
      <CoupleSetupModal
        isOpen={isCoupleModalOpen}
        onClose={() => setIsCoupleModalOpen(false)}
        data={invitationData}
        onSave={(updated) => setInvitationData(updated)}
      />
      {isEditorOpen && editorTemplateId && (
        <TemplateEditorWorkspace
          initialData={invitationData}
          templateId={editorTemplateId}
          onClose={() => {
            setIsEditorOpen(false);
            setEditorTemplateId(null);
          }}
          onSaveAndApply={(savedData) => {
            saveInvitationData(savedData);
            setInvitationData(savedData);
          }}
          onOpenPreview={(data, tmplId) => {
            setPreviewOverrideData(data);
            setPreviewOverrideTemplate(tmplId);
            setIsPreviewOpen(true);
          }}
        />
      )}
      <A3PosterModal
        isOpen={isA3PosterOpen}
        onClose={() => setIsA3PosterOpen(false)}
        defaultPasscode={invitationData.general?.photoboxPasscode || "2111"}
        coupleNames={
          invitationData.couple?.groom?.name && invitationData.couple?.bride?.name
            ? `${invitationData.couple.groom.name} & ${invitationData.couple.bride.name}`.toUpperCase()
            : "GILANG & SALSADILA"
        }
        weddingDate={
          invitationData.events?.[0]?.displayDate
            ? `${invitationData.events[0].displayDate} • Jakarta`
            : "Rabu, 28 Oktober 2026 • Jakarta"
        }
        hashtag={invitationData.general?.hashtag || "#GilangSalsaWedding"}
        defaultCouplePhoto={defaultPosterPhoto}
        availablePhotos={posterAvailablePhotos}
      />

      {/* Mobile Fixed Bottom Navigation Bar (< lg) */}
      <nav
        aria-label="Navigasi Utama Mobile"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] pb-[max(0.35rem,env(safe-area-inset-bottom))] px-1"
      >
        <div className="flex items-center justify-around">
          {[
            { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
            { id: "templates", label: "Tema", icon: Palette },
            { id: "wedding-data", label: "Mempelai", icon: HeartHandshake },
            { id: "guests", label: "Tamu", icon: Users, badge: guests.length },
            { id: "wishes", label: "RSVP", icon: MessageSquareHeart, badge: wishes.length },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`min-h-[48px] flex-1 py-1 px-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors cursor-pointer ${
                  isActive ? "text-slate-950 font-bold" : "text-slate-500 hover:text-slate-800 font-medium"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? "text-slate-950 stroke-[2.2]" : "text-slate-500"}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-3.5 rounded-full bg-slate-900 text-amber-200 text-[8px] font-mono font-bold flex items-center justify-center border border-white">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] leading-none tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="w-4 h-0.5 rounded-full bg-slate-900 absolute bottom-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center font-sans">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#1C2434] border-t-transparent animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Memuat dashboard pengelola...</p>
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </React.Suspense>
  );
}
