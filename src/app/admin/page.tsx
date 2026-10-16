"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminAuthView } from "./components/AdminAuthView";
import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";
import {
  getInvitationData,
  getGuests,
  getWishes,
  resetInvitationData,
  syncWithBackend,
} from "@/lib/invitationStore";
import { checkBackendHealth } from "@/lib/api";
import { AdminOverview } from "./components/AdminOverview";
import { TemplateThemeManager } from "./components/TemplateThemeManager";
import { CoupleEventManager } from "./components/CoupleEventManager";
import { GuestListManager } from "./components/GuestListManager";
import { RsvpManager } from "./components/RsvpManager";
import { LivePreviewModal } from "./components/LivePreviewModal";
import { CoupleSetupModal } from "./components/CoupleSetupModal";
import { TemplateEditorWorkspace } from "./components/TemplateEditorWorkspace";

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

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [invitationData, setInvitationData] = useState<WeddingInvitationData>(
    getInvitationData()
  );
  const [guests, setGuests] = useState<GuestItem[]>(getGuests());
  const [wishes, setWishes] = useState<WishMessage[]>(getWishes());
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewOverrideTemplate, setPreviewOverrideTemplate] = useState<string | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorTemplateId, setEditorTemplateId] = useState<string | null>(null);
  const [isCoupleModalOpen, setIsCoupleModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
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
    return <AdminAuthView />;
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#333A48] text-white shadow-xs font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-[#24303F]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-[#DFD2BD]" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        isActive
                          ? "bg-[#1C2434] text-[#DFD2BD] font-bold border border-slate-700"
                          : "bg-[#24303F] text-slate-300 border border-slate-800"
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
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
            aria-label="Toggle Sidebar Navigation"
            title={isSidebarOpen ? "Sembunyikan Menu" : "Buka Menu"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
            <span className="text-slate-400">Dashboard</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">{currentTabLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCoupleModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left cursor-pointer group shadow-2xs"
            title="Klik untuk mengatur nama mempelai"
          >
            <div className="w-6 h-6 rounded-md bg-[#1C2434] text-[#DFD2BD] flex items-center justify-center font-bold text-[10px] uppercase font-mono">
              {monogram}
            </div>
            <div className="max-w-[130px] sm:max-w-[200px] truncate">
              <span className="text-xs font-semibold text-slate-800 block truncate leading-none">
                {coupleDisplayTitle}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                {isCoupleConfigured ? "Klik untuk edit" : "Belum diisi"}
              </span>
            </div>
            {!isCoupleConfigured && (
              <span className="hidden md:inline px-1.5 py-0.5 rounded text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                Wajib
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5">
          {backendStatus && (
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono ${
                backendStatus.online
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus.online ? "bg-emerald-600" : "bg-amber-600"
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
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Salin tautan web undangan"
          >
            {isCopiedPublicLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden md:inline">
              {isCopiedPublicLink ? "Tersalin" : "Salin Link"}
            </span>
          </button>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Buka pratinjau mobile"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Pratinjau HP</span>
          </button>

          <Link
            href="/undangan"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#1C2434] hover:bg-[#24303F] text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            title="Buka halaman undangan langsung"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#DFD2BD]" />
            <span className="hidden sm:inline">Buka Undangan</span>
          </Link>

          <button
            onClick={handleResetData}
            className="p-1.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Kembalikan data ke awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-[#1C2434] text-[#DFD2BD] flex items-center justify-center font-bold text-xs uppercase border border-slate-700 shadow-2xs">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "A"}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">
                {user?.fullName || user?.username}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Admin</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer ml-1"
            title="Keluar dari akun (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>
      <div className="flex-1 flex w-full relative overflow-x-hidden">
        <aside
          className={`hidden lg:flex shrink-0 bg-[#1C2434] text-slate-200 border-r border-[#24303F] flex-col justify-between transition-all duration-300 ease-in-out ${
            isSidebarOpen
              ? "w-64 opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-full overflow-hidden pointer-events-none"
          }`}
        >
          <div className="w-64 p-4 space-y-6">
            <div className="px-2 pt-1 pb-3 flex items-center justify-between border-b border-[#2E3A4B]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#2E3A4B] text-[#DFD2BD] flex items-center justify-center font-mono font-bold text-xs border border-slate-600 shadow-2xs">
                  AU
                </div>
                <div>
                  <span className="text-xs font-bold text-white tracking-wider uppercase block">
                    ATELIER ADMIN
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Sistem Kelola Undangan
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#24303F] transition-colors cursor-pointer"
                title="Sembunyikan Menu"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {renderNavSection()}
          </div>
          <div className="w-64 p-4 border-t border-[#24303F] bg-[#171E2D]">
            <Link
              href="/undangan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#24303F] transition-colors border border-transparent hover:border-[#313D4A]"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#DFD2BD]" />
                <span className="font-medium">Web Undangan Tamu</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </aside>
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className="relative w-72 max-w-[85vw] bg-[#1C2434] text-slate-200 h-full p-4 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 border-r border-[#24303F]">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#2E3A4B]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#2E3A4B] text-[#DFD2BD] flex items-center justify-center font-mono font-bold text-xs border border-slate-600">
                      AU
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white tracking-wider uppercase block">
                        ATELIER ADMIN
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Sistem Kelola Undangan
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#24303F] transition-colors cursor-pointer"
                    aria-label="Tutup Menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {renderNavSection(() => setIsSidebarOpen(false))}
              </div>

              <div className="pt-3 border-t border-[#24303F]">
                <Link
                  href="/undangan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#24303F] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#DFD2BD]" />
                    <span>Buka Web Undangan</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <AdminOverview
              data={invitationData}
              guests={guests}
              wishes={wishes}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenPreview={() => setIsPreviewOpen(true)}
              onOpenCoupleModal={() => setIsCoupleModalOpen(true)}
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
        </main>
      </div>
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewOverrideTemplate(undefined);
        }}
        data={invitationData}
        overrideTemplateId={previewOverrideTemplate}
        onEditTemplate={(tmplId) => {
          setIsPreviewOpen(false);
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
            setInvitationData(savedData);
          }}
          onOpenPreview={(data, tmplId) => {
            setPreviewOverrideTemplate(tmplId);
            setIsPreviewOpen(true);
          }}
        />
      )}
    </div>
  );
}
