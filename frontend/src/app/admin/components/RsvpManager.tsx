"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareHeart,
  Trash2,
  Search,
  CalendarCheck,
} from "lucide-react";
import { WishMessage } from "@/types/wedding";
import { deleteWish } from "@/lib/invitationStore";
import { fetchRsvpsApi } from "@/lib/api";

interface RsvpManagerProps {
  wishes: WishMessage[];
  onWishesUpdated: (updated: WishMessage[]) => void;
}

export function RsvpManager({ wishes, onWishesUpdated }: RsvpManagerProps) {
  const [activeTab, setActiveTab] = useState<"rsvps" | "wishes">("rsvps");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [rsvpList, setRsvpList] = useState<any[]>([]);
  const [rsvpSummary, setRsvpSummary] = useState<any>(null);

  useEffect(() => {
    fetchRsvpsApi().then((res) => {
      if (res) {
        setRsvpSummary(res.summary);
        setRsvpList(res.rsvps || []);
      }
    });
  }, [wishes]);

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
              KEHADIRAN &amp; DOA RESTU
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Buku Tamu &amp; Konfirmasi RSVP
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Pantau data kehadiran real-time dan untaian doa restu dari para tamu undangan.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "rsvps"
                ? "bg-[#1C2434] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Konfirmasi RSVP ({rsvpList.length})
          </button>
          <button
            onClick={() => setActiveTab("wishes")}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "wishes"
                ? "bg-[#1C2434] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Buku Tamu ({wishes.length})
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
            Total Undangan
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 block tracking-tight font-mono">
            {rsvpSummary?.totalGuests ?? wishes.length}
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
            Basis data direktori
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 block font-medium">
            Pasti Hadir
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-800 mt-1 block tracking-tight font-mono">
            {rsvpSummary?.attending ?? attendingCount}
          </span>
          <span className="text-[10px] font-mono text-emerald-700 mt-0.5 block font-medium">
            Est. {rsvpSummary?.estimatedHeads ?? attendingCount} Porsi Katering
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 block font-medium">
            Masih Ragu
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-amber-800 mt-1 block tracking-tight font-mono">
            {unsureCount}
          </span>
          <span className="text-[10px] font-mono text-amber-700 mt-0.5 block">
            Menunggu kepastian
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
            Berhalangan
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-700 mt-1 block tracking-tight font-mono">
            {rsvpSummary?.notAttending ?? unableCount}
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
            Kirim doa restu
          </span>
        </div>
      </div>
      {activeTab === "rsvps" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {rsvpList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <CalendarCheck className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-sm text-slate-900">Belum ada konfirmasi RSVP masuk</p>
              <p className="text-xs text-slate-500">
                Tamu yang membuka undangan dan mengisi kehadiran akan tercatat di sini secara otomatis.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nama Tamu &amp; Kontak</th>
                    <th className="py-3 px-3">Grup Tamu</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Jumlah Pax</th>
                    <th className="py-3 px-4">Pesan RSVP</th>
                    <th className="py-3 px-4 text-right">Waktu Konfirmasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rsvpList.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-xs sm:text-sm text-slate-900">
                          {r.guestName}
                        </div>
                        {r.guestPhone && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {r.guestPhone}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {r.groupName}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                            r.status === 1
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {r.status === 1 ? "Pasti Hadir" : "Tidak Hadir"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-slate-900">
                        {r.status === 1 ? `${r.attendeeCount} Orang` : "0"}
                        <span className="text-[10px] text-slate-400 block font-normal font-mono">
                          Maks. {r.guestQuota} Pax
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {r.message || "-"}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono text-[10px]">
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleString("id-ID") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {activeTab === "wishes" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari pengirim, pesan, relasi..."
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#1C2434] focus:ring-1 focus:ring-[#1C2434]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-[#1C2434]"
              >
                <option value="all">Semua Status Kehadiran</option>
                <option value="hadir">Pasti Hadir</option>
                <option value="ragu">Masih Ragu</option>
                <option value="tidak">Berhalangan</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {filteredWishes.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200 shadow-xs">
                <MessageSquareHeart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-sm text-slate-900">Tidak ada ucapan yang cocok</p>
                <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
              </div>
            ) : (
              filteredWishes.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({item.relationship})
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 ml-auto sm:ml-0">
                        • {item.date}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium border ${
                        item.attendance.includes("Hadir")
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : item.attendance.includes("belum")
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {item.attendance}
                    </span>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
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
      )}
    </div>
  );
}
