"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Palette,
  HeartHandshake,
  Users,
  MessageSquareHeart,
  ExternalLink,
  Smartphone,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { WeddingInvitationData, GuestItem, WishMessage } from "@/types/wedding";
import {
  getInvitationData,
  getGuests,
  getWishes,
  resetInvitationData,
} from "@/lib/invitationStore";
import { AdminOverview } from "./components/AdminOverview";
import { TemplateThemeManager } from "./components/TemplateThemeManager";
import { CoupleEventManager } from "./components/CoupleEventManager";
import { GuestListManager } from "./components/GuestListManager";
import { RsvpManager } from "./components/RsvpManager";
import { LivePreviewModal } from "./components/LivePreviewModal";

type AdminTab = "overview" | "templates" | "wedding-data" | "guests" | "wishes";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [invitationData, setInvitationData] = useState<WeddingInvitationData>(getInvitationData());
  const [guests, setGuests] = useState<GuestItem[]>(getGuests());
  const [wishes, setWishes] = useState<WishMessage[]>(getWishes());
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  useEffect(() => {
    // Initial mount hydration
    setInvitationData(getInvitationData());
    setGuests(getGuests());
    setWishes(getWishes());

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

  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "Ringkasan",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "templates" as AdminTab,
      label: "Template & Tema",
      icon: Palette,
      badge: "Pilih Desain",
    },
    {
      id: "wedding-data" as AdminTab,
      label: "Data Mempelai & Acara",
      icon: HeartHandshake,
      badge: null,
    },
    {
      id: "guests" as AdminTab,
      label: "Daftar Tamu & WhatsApp",
      icon: Users,
      badge: `${guests.length}`,
    },
    {
      id: "wishes" as AdminTab,
      label: "Buku Tamu & RSVP",
      icon: MessageSquareHeart,
      badge: `${wishes.length}`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F9] text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#4A0812] text-white border-b border-[#36050C] shadow-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFE58F] text-[#4A0812] flex items-center justify-center font-black shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-base sm:text-lg text-[#FFE58F] leading-tight">
              Admin Undangan Digital
            </h1>
            <p className="text-[11px] text-white/70 font-mono">
              {invitationData.couple?.groom?.name || "Gilang"} & {invitationData.couple?.bride?.name || "Salsadila"}
            </p>
          </div>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3 sm:px-4 py-2 rounded-xl bg-[#FFE58F] hover:bg-[#FFD966] text-[#4A0812] font-mono font-bold text-xs flex items-center gap-2 transition-transform hover:scale-105 shadow-sm cursor-pointer"
            title="Buka pratinjau mobile"
          >
            <Smartphone className="w-4 h-4 text-[#7D1128]" />
            <span className="hidden sm:inline">Preview Undangan</span>
          </button>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs flex items-center gap-2 transition-colors border border-white/20"
            title="Lihat halaman web undangan asli"
          >
            <ExternalLink className="w-4 h-4 text-[#FFE58F]" />
            <span className="hidden sm:inline">Buka Undangan</span>
          </Link>

          <button
            onClick={handleResetData}
            className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Reset ke data bawaan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-3 border-2 border-[#7D1128]/20 shadow-xs lg:sticky lg:top-20 space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono font-bold text-[#7D1128] uppercase tracking-wider">
              Menu Navigasi
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#7D1128] text-white shadow-sm"
                      : "text-slate-700 hover:bg-[#FFF0F3] hover:text-[#7D1128]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-[#FFE58F]" : "text-[#7D1128]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-white/20 text-[#FFE58F]"
                          : "bg-[#FFF0F3] text-[#7D1128]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100 px-3">
              <Link
                href="/"
                className="w-full flex items-center justify-between text-xs text-[#7D1128] hover:text-[#4A0812] font-mono font-bold py-1.5 transition-colors"
              >
                <span>Halaman Utama</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === "overview" && (
            <AdminOverview
              data={invitationData}
              guests={guests}
              wishes={wishes}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenPreview={() => setIsPreviewOpen(true)}
            />
          )}

          {activeTab === "templates" && (
            <TemplateThemeManager
              data={invitationData}
              onUpdate={(updated) => setInvitationData(updated)}
              onOpenPreview={() => setIsPreviewOpen(true)}
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

      {/* In-Dashboard Live Phone Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={invitationData}
      />
    </div>
  );
}
