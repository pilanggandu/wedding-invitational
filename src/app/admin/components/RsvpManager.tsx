"use client";

import React, { useState } from "react";
import {
  MessageSquareHeart,
  CheckCircle,
  HelpCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";
import { WishMessage } from "@/types/wedding";
import { deleteWish } from "@/lib/invitationStore";

interface RsvpManagerProps {
  wishes: WishMessage[];
  onWishesUpdated: (updated: WishMessage[]) => void;
}

export function RsvpManager({ wishes, onWishesUpdated }: RsvpManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleDelete = (id: string) => {
    if (confirm("Hapus ucapan doa restu ini?")) {
      deleteWish(id);
      onWishesUpdated(wishes.filter((w) => w.id !== id));
    }
  };

  const attendingCount = wishes.filter((w) => w.attendance.includes("Hadir")).length;
  const unsureCount = wishes.filter((w) => w.attendance.includes("mikir")).length;
  const unableCount = wishes.filter((w) => w.attendance.includes("belum")).length;

  const filteredWishes = wishes.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.relationship.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "hadir" && w.attendance.includes("Hadir")) ||
      (filterStatus === "ragu" && w.attendance.includes("mikir")) ||
      (filterStatus === "tidak" && w.attendance.includes("belum"));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border-2 border-[#7D1128]/20 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFF0F3] text-[#7D1128] mb-1">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            Buku Tamu & Konfirmasi Kehadiran
          </div>
          <h2 className="font-sans font-bold text-xl text-[#4A0812]">
            Buku Tamu & Moderasi RSVP
          </h2>
          <p className="text-xs text-[#7D1128]">
            Pantau dan kelola doa restu serta konfirmasi kehadiran yang dikirimkan para tamu.
          </p>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <span className="text-xs font-mono text-slate-500 block">Total Pesan</span>
          <span className="text-2xl font-extrabold text-[#4A0812]">{wishes.length}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-emerald-200 bg-emerald-50/30">
          <span className="text-xs font-mono text-emerald-800 block">Konfirmasi Hadir</span>
          <span className="text-2xl font-extrabold text-emerald-950">{attendingCount}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-amber-200 bg-amber-50/30">
          <span className="text-xs font-mono text-amber-800 block">Masih Ragu</span>
          <span className="text-2xl font-extrabold text-amber-950">{unsureCount}</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-rose-200 bg-rose-50/30">
          <span className="text-xs font-mono text-rose-800 block">Berhalangan</span>
          <span className="text-2xl font-extrabold text-rose-950">{unableCount}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pengirim, pesan, relasi..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-sans focus:outline-none focus:border-[#7D1128]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono bg-white"
          >
            <option value="all">Semua Status Kehadiran</option>
            <option value="hadir">Pasti Hadir</option>
            <option value="ragu">Masih Ragu</option>
            <option value="tidak">Berhalangan</option>
          </select>
        </div>
      </div>

      {/* Wishes Feed */}
      <div className="space-y-3">
        {filteredWishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            <MessageSquareHeart className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="font-sans font-bold text-sm">Tidak ada ucapan yang cocok</p>
          </div>
        ) : (
          filteredWishes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-[#7D1128]/30 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-sm text-[#4A0812]">
                    {item.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    ({item.relationship})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 ml-auto sm:ml-0">
                    • {item.date}
                  </span>
                </div>

                <p className="text-xs text-[#333] leading-relaxed italic bg-[#FFF9FA] p-3 rounded-xl border border-[#7D1128]/10 font-sans">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                    item.attendance.includes("Hadir")
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : item.attendance.includes("belum")
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {item.attendance}
                </span>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2.5 py-1 rounded-lg hover:bg-rose-50 text-rose-600 border border-transparent hover:border-rose-200 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  title="Hapus ucapan ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
