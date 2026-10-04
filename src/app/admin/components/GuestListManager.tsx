"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Send,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { GuestItem, WeddingInvitationData } from "@/types/wedding";
import {
  addGuest,
  deleteGuest,
  toggleGuestSent,
  generateWhatsAppInvitationUrl,
} from "@/lib/invitationStore";

interface GuestListManagerProps {
  data: WeddingInvitationData;
  guests: GuestItem[];
  onGuestsUpdated: (updated: GuestItem[]) => void;
}

export function GuestListManager({
  data,
  guests,
  onGuestsUpdated,
}: GuestListManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");
  const [filterStatus, setFilterStatus] = useState<"all" | "sent" | "unsent">("all");

  // New guest modal/form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<GuestItem["category"]>("Sahabat");
  const [notes, setNotes] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Copied feedback map
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const groomName = data.couple?.groom?.name || "Gilang";
  const brideName = data.couple?.bride?.name || "Salsadila";

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGuest = addGuest(name, phone, category, notes);
    onGuestsUpdated([newGuest, ...guests]);

    setName("");
    setPhone("");
    setNotes("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus tamu ini dari daftar undangan?")) {
      deleteGuest(id);
      onGuestsUpdated(guests.filter((g) => g.id !== id));
    }
  };

  const handleToggleSent = (id: string) => {
    toggleGuestSent(id);
    onGuestsUpdated(
      guests.map((g) => (g.id === id ? { ...g, isSent: !g.isSent } : g))
    );
  };

  const handleCopyLink = (guest: GuestItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const personalUrl = `${origin}?to=${encodeURIComponent(guest.name).replace(/%20/g, "+")}`;
    navigator.clipboard.writeText(personalUrl);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendWhatsApp = (guest: GuestItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const waUrl = generateWhatsAppInvitationUrl(
      guest.phone || "",
      guest.name,
      groomName,
      brideName,
      origin
    );

    // Auto mark as sent if not already
    if (!guest.isSent) {
      handleToggleSent(guest.id);
    }

    window.open(waUrl, "_blank");
  };

  // Filtered list
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm) ||
      (g.notes && g.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      filterCategory === "Semua" || g.category === filterCategory;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "sent" && g.isSent) ||
      (filterStatus === "unsent" && !g.isSent);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCount = guests.length;
  const sentCount = guests.filter((g) => g.isSent).length;
  const unsentCount = totalCount - sentCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-50 text-blue-700 mb-1">
            <Users className="w-3.5 h-3.5" />
            Manajemen Penerima Undangan
          </div>
          <h2 className="font-sans font-bold text-xl text-slate-900">
            Daftar Tamu & Generator WhatsApp
          </h2>
          <p className="text-xs text-slate-500">
            Kelola data tamu, generate tautan personal otomatis, dan kirim pesan resmi via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>{showAddForm ? "Tutup Form" : "Tambah Tamu Baru"}</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-500 block">Total Tamu</span>
          <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-emerald-200 bg-emerald-50/40 shadow-xs">
          <span className="text-xs font-semibold uppercase text-emerald-800 block">Sudah Dikirim</span>
          <span className="text-2xl font-bold text-emerald-950">{sentCount}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-amber-200 bg-amber-50/40 shadow-xs">
          <span className="text-xs font-semibold uppercase text-amber-800 block">Belum Dikirim</span>
          <span className="text-2xl font-bold text-amber-950">{unsentCount}</span>
        </div>
      </div>

      {/* Add Guest Form (Collapsible) */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-xs animate-in slide-in-from-top-4 duration-200 space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              Tambah Tamu Undangan Baru
            </h3>
            <span className="text-xs text-slate-500">Tautan personal akan digenerate otomatis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Tamu Lengkap *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso & Partner"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-sans text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp (opsional)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-sans text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Tamu
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-sans text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Sahabat">Sahabat</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Rekan Kerja">Rekan Kerja</option>
                <option value="VIP">VIP</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Khusus (opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Teman SMA / Rekan kantor lantai 3"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-sans text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs cursor-pointer"
            >
              Simpan Tamu
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, telepon, catatan..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-sans text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="VIP">VIP</option>
            <option value="Keluarga">Keluarga</option>
            <option value="Sahabat">Sahabat</option>
            <option value="Rekan Kerja">Rekan Kerja</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="sent">Sudah Dikirim</option>
            <option value="unsent">Belum Dikirim</option>
          </select>
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredGuests.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-sans font-bold text-sm text-slate-700">Tidak ada tamu yang sesuai pencarian</p>
            <p className="text-xs text-slate-500">Coba ubah kata kunci atau tambahkan tamu baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Nama Tamu</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">WhatsApp</th>
                  <th className="py-3 px-3 text-center">Status Kirim</th>
                  <th className="py-3 px-4 text-right">Aksi & Generator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuests.map((guest) => {
                  const origin = typeof window !== "undefined" ? window.location.origin : "";
                  const personalUrl = `${origin}?to=${encodeURIComponent(guest.name).replace(/%20/g, "+")}`;
                  const isCopied = copiedId === guest.id;

                  return (
                    <tr key={guest.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Notes */}
                      <td className="py-3.5 px-4">
                        <div className="font-sans font-bold text-sm text-slate-900">
                          {guest.name}
                        </div>
                        {guest.notes && (
                          <div className="text-[11px] text-slate-500 italic mt-0.5">
                            {guest.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                            guest.category === "VIP"
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : guest.category === "Keluarga"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : guest.category === "Sahabat"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {guest.category}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-3 font-mono text-slate-600">
                        {guest.phone ? guest.phone : "-"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleSent(guest.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border transition-colors cursor-pointer ${
                            guest.isSent
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                          }`}
                          title="Klik untuk ubah status terkirim"
                        >
                          {guest.isSent ? "✓ Sudah Terkirim" : "Belum Terkirim"}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send WhatsApp Button */}
                          <button
                            onClick={() => handleSendWhatsApp(guest)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Kirim pesan undangan resmi via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Copy Link Button */}
                          <button
                            onClick={() => handleCopyLink(guest)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Salin tautan personal khusus tamu ini"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span className="hidden sm:inline">
                              {isCopied ? "Disalin!" : "Salin Link"}
                            </span>
                          </button>

                          {/* Direct Preview Link */}
                          <a
                            href={personalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                            title="Buka undangan tamu di tab baru"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(guest.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Hapus tamu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
