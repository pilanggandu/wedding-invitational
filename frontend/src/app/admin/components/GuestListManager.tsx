"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Send,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  MessageCircle,
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

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<GuestItem["category"]>("Sahabat");
  const [notes, setNotes] = useState("");
  const [quota, setQuota] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const groomName = data.couple?.groom?.name || "Mempelai Pria";
  const brideName = data.couple?.bride?.name || "Mempelai Wanita";
  const mainEvent = data.events?.[0];
  const eventDateStr = mainEvent?.displayDate
    ? `${mainEvent.displayDay ? `${mainEvent.displayDay}, ` : ""}${mainEvent.displayDate}`
    : undefined;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGuest = addGuest(name, phone, category, notes, quota);
    onGuestsUpdated([newGuest, ...guests]);

    setName("");
    setPhone("");
    setNotes("");
    setQuota(1);
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
    const personalUrl = guest.token
      ? `${origin}/undangan?u=${guest.token}`
      : `${origin}/undangan?to=${encodeURIComponent(guest.name).replace(/%20/g, "+")}`;
    navigator.clipboard.writeText(personalUrl);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendWhatsApp = (guest: GuestItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const targetUrl = guest.token
      ? `${origin}/undangan?u=${guest.token}`
      : `${origin}/undangan`;
    const waUrl = generateWhatsAppInvitationUrl(
      guest.phone || "",
      guest.name,
      groomName,
      brideName,
      targetUrl,
      eventDateStr
    );

    if (!guest.isSent) {
      handleToggleSent(guest.id);
    }

    window.open(waUrl, "_blank");
  };

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
              DIREKTORI TAMU &amp; DISPATCH
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Tamu &amp; Generator WhatsApp
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Kelola data tamu, generate link personal otomatis, dan kirim pesan resmi via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-lg bg-[#1C2434] hover:bg-[#24303F] text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-[#DFD2BD]" />
            <span>{showAddForm ? "Tutup Form" : "Tambah Tamu Baru"}</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
              Total Undangan
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 block tracking-tight font-mono">
              {totalCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 block font-medium">
              Sudah Terkirim
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-800 mt-1 block tracking-tight font-mono">
              {sentCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 block font-medium">
              Menunggu Kirim
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-amber-800 mt-1 block tracking-tight font-mono">
              {unsentCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
        </div>
      </div>
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1C2434] text-[#DFD2BD] flex items-center justify-center">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Tambah Tamu Undangan Baru
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Link personal otomatis dibuatkan token
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-medium">
                Nama Tamu Lengkap *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso & Partner"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#1C2434] focus:ring-1 focus:ring-[#1C2434]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-medium">
                Nomor WhatsApp (opsional)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-[#1C2434] focus:ring-1 focus:ring-[#1C2434]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-medium">
                Kategori Tamu
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#1C2434]"
              >
                <option value="Sahabat">Sahabat</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Rekan Kerja">Rekan Kerja</option>
                <option value="VIP">VIP</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-medium">
                Kuota Tamu (Pax)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={quota}
                onChange={(e) => setQuota(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-[#1C2434] focus:ring-1 focus:ring-[#1C2434]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-medium">
              Catatan Khusus (opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Rekan kantor divisi produk"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#1C2434] focus:ring-1 focus:ring-[#1C2434]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#1C2434] hover:bg-[#24303F] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Simpan Tamu
            </button>
          </div>
        </form>
      )}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, telepon, catatan..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1C2434] focus:ring-1 focus:ring-[#1C2434]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-[#1C2434]"
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
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-[#1C2434]"
          >
            <option value="all">Semua Status</option>
            <option value="sent">Sudah Dikirim</option>
            <option value="unsent">Belum Dikirim</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredGuests.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-bold text-sm text-slate-900">Tidak ada tamu yang cocok</p>
            <p className="text-xs text-slate-500">
              Coba sesuaikan kata kunci pencarian atau tambahkan tamu baru ke direktori.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Tamu &amp; Token</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Kuota</th>
                  <th className="py-3 px-3">WhatsApp</th>
                  <th className="py-3 px-3 text-center">Status Kirim</th>
                  <th className="py-3 px-3 text-center">RSVP</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuests.map((guest) => {
                  const origin = typeof window !== "undefined" ? window.location.origin : "";
                  const personalUrl = guest.token
                    ? `${origin}/undangan?u=${guest.token}`
                    : `${origin}/undangan?to=${encodeURIComponent(guest.name).replace(/%20/g, "+")}`;
                  const isCopied = copiedId === guest.id;
                  const isOpened = guest.openCount && guest.openCount > 0;

                  return (
                    <tr key={guest.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-xs sm:text-sm text-slate-900">
                          {guest.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {guest.token && (
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              token: {guest.token}
                            </span>
                          )}
                          {guest.notes && (
                            <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                              {guest.notes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                            guest.category === "VIP"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : guest.category === "Keluarga"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : guest.category === "Sahabat"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {guest.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-800 font-medium">
                        {guest.quota || 1} Pax
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {guest.phone ? guest.phone : "-"}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {isOpened ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Dibuka ({guest.openCount}x)
                            </span>
                          ) : (
                            <button
                              onClick={() => handleToggleSent(guest.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border transition-colors cursor-pointer ${
                                guest.isSent
                                  ? "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                                  : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                              }`}
                              title="Klik untuk ubah status pengiriman"
                            >
                              {guest.isSent ? "Terkirim" : "Belum Kirim"}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {guest.rsvp ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                              guest.rsvp.status === 1
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            {guest.rsvp.status === 1 ? `Hadir (${guest.rsvp.count})` : "Tidak Hadir"}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSendWhatsApp(guest)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            title="Kirim pesan undangan via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WA</span>
                          </button>
                          <button
                            onClick={() => handleCopyLink(guest)}
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Salin link personal tamu ini"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span className="hidden sm:inline">
                              {isCopied ? "Tersalin" : "Link"}
                            </span>
                          </button>
                          <a
                            href={personalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                            title="Buka undangan tamu di tab baru"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDelete(guest.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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
