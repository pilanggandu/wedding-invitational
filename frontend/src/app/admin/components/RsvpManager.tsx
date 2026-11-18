"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareHeart,
  Trash2,
  Search,
  CalendarCheck,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Users,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { WishMessage } from "@/types/wedding";
import { deleteWish } from "@/lib/invitationStore";
import { fetchRsvpsApi, deleteRsvpApi } from "@/lib/api";

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
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>("");
  const [error, setError] = useState<string>("");

  const refreshRsvps = async () => {
    try {
      const res = await fetchRsvpsApi();
      if (res) {
        setRsvpSummary(res.summary);
        setRsvpList(res.rsvps || []);
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    refreshRsvps();
  }, [wishes]);

  const handleDeleteWish = async (id: string, name?: string) => {
    const label = name ? `dari "${name}"` : "ini";
    if (!window.confirm(`Hapus ucapan doa restu ${label}?`)) return;

    setBusyId(`wish_${id}`);
    setError("");
    setNotice("");
    try {
      await deleteWish(id);
      onWishesUpdated(wishes.filter((w) => w.id !== id));
      setNotice(`Ucapan doa restu ${name ? `dari ${name}` : ""} berhasil dihapus.`);
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus ucapan doa restu.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteRsvp = async (id: string | number, guestName?: string) => {
    const label = guestName ? `dari "${guestName}"` : "ini";
    if (!window.confirm(`Hapus data konfirmasi kehadiran dan pesan RSVP ${label}?`)) return;

    setBusyId(`rsvp_${id}`);
    setError("");
    setNotice("");
    try {
      const ok = await deleteRsvpApi(id);
      if (!ok) throw new Error("Server gagal menghapus data konfirmasi RSVP.");

      setRsvpList((prev) => prev.filter((r) => r.id !== id && String(r.id) !== String(id)));
      await refreshRsvps();
      setNotice(`Konfirmasi RSVP dan pesan ${guestName ? `dari ${guestName}` : ""} berhasil dihapus.`);
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus konfirmasi RSVP.");
    } finally {
      setBusyId(null);
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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Kehadiran &amp; Doa Restu
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Buku Tamu &amp; Konfirmasi RSVP
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
            Pantau data kehadiran real-time dan untaian doa restu dari para tamu undangan.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="w-full sm:w-auto flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
              activeTab === "rsvps"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            Konfirmasi RSVP ({rsvpList.length})
          </button>
          <button
            onClick={() => setActiveTab("wishes")}
            className={`min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
              activeTab === "wishes"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            Buku Tamu ({wishes.length})
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {notice && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice("")}
            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-100 transition-colors"
            title="Tutup pesan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError("")}
            className="p-1 rounded-md text-rose-600 hover:bg-rose-100 transition-colors"
            title="Tutup pesan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Total Undangan
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {rsvpSummary?.totalGuests ?? wishes.length}
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
              Basis data direktori
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
              Pasti Hadir
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700 tracking-tight font-mono">
              {rsvpSummary?.attending ?? attendingCount}
            </span>
            <span className="text-[10px] font-mono text-emerald-700 mt-1 block font-medium">
              Est. {rsvpSummary?.estimatedHeads ?? attendingCount} Porsi Katering
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 font-semibold">
              Masih Ragu
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-amber-800 tracking-tight font-mono">
              {unsureCount}
            </span>
            <span className="text-[10px] font-mono text-amber-700 mt-1 block">
              Menunggu kepastian
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Berhalangan
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-700 tracking-tight font-mono">
              {rsvpSummary?.notAttending ?? unableCount}
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
              Kirim doa restu
            </span>
          </div>
        </div>
      </div>

      {/* Tab 1: Konfirmasi RSVP */}
      {activeTab === "rsvps" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          {rsvpList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <CalendarCheck className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-sm text-slate-900">Belum ada konfirmasi RSVP masuk</p>
              <p className="text-xs text-slate-500">
                Tamu yang membuka undangan dan mengisi kehadiran akan tercatat di sini secara otomatis.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW (md+) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-mono uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3.5 px-5">Nama Tamu &amp; Kontak</th>
                      <th className="py-3.5 px-4">Grup Tamu</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Jumlah Pax</th>
                      <th className="py-3.5 px-5">Pesan RSVP</th>
                      <th className="py-3.5 px-5 text-right">Waktu Konfirmasi</th>
                      <th className="py-3.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rsvpList.map((r) => {
                      const initial = r.guestName?.charAt(0).toUpperCase() || "T";
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                                {initial}
                              </div>
                              <div>
                                <div className="font-semibold text-xs sm:text-sm text-slate-900">
                                  {r.guestName}
                                </div>
                                {r.guestPhone && (
                                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                    {r.guestPhone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
                              {r.groupName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                                r.status === 1
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                                    : "bg-rose-50 text-rose-800 border-rose-200/80"
                              }`}
                            >
                              {r.status === 1 ? "Pasti Hadir" : "Tidak Hadir"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-900">
                            {r.status === 1 ? `${r.attendeeCount} Orang` : "0"}
                            <span className="text-[10px] text-slate-500 block font-normal font-mono">
                              Maks. {r.guestQuota} Pax
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-slate-600 max-w-xs truncate">
                            {r.message || "-"}
                          </td>
                          <td className="py-3.5 px-5 text-right text-slate-500 font-mono text-[10px]">
                            {r.submittedAt ? new Date(r.submittedAt).toLocaleString("id-ID") : "-"}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleDeleteRsvp(r.id, r.guestName)}
                              disabled={busyId === `rsvp_${r.id}`}
                              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                              title="Hapus konfirmasi kehadiran & komentar ini"
                            >
                              {busyId === `rsvp_${r.id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW (< md) */}
              <div className="md:hidden divide-y divide-slate-100">
                {rsvpList.map((r) => {
                  const initial = r.guestName?.charAt(0).toUpperCase() || "T";
                  return (
                    <div key={r.id} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {r.guestName}
                            </h4>
                            {r.guestPhone && (
                              <p className="text-[11px] font-mono text-slate-500">
                                {r.guestPhone}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${
                            r.status === 1
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {r.status === 1 ? "Pasti Hadir" : "Tidak Hadir"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500 block">
                            Kategori / Grup
                          </span>
                          <span className="font-semibold text-slate-800">
                            {r.groupName || "Umum"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500 block">
                            Jumlah Kehadiran
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            {r.status === 1 ? `${r.attendeeCount} Orang` : "0 Orang"}
                            <span className="text-[10px] font-normal text-slate-500 ml-1">
                              (Maks {r.guestQuota})
                            </span>
                          </span>
                        </div>
                      </div>

                      {r.message && (
                        <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                          &ldquo;{r.message}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-mono text-slate-500">
                          {r.submittedAt ? new Date(r.submittedAt).toLocaleString("id-ID") : "-"}
                        </div>
                        <button
                          onClick={() => handleDeleteRsvp(r.id, r.guestName)}
                          disabled={busyId === `rsvp_${r.id}`}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/80 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus konfirmasi kehadiran & komentar ini"
                        >
                          {busyId === `rsvp_${r.id}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 2: Buku Tamu */}
      {activeTab === "wishes" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row gap-3 items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari pengirim, pesan, relasi..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-slate-900 shadow-2xs"
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
              <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <MessageSquareHeart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-sm text-slate-900">Tidak ada ucapan yang cocok</p>
                <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
              </div>
            ) : (
              filteredWishes.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm text-slate-900">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({item.relationship})
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 ml-auto sm:ml-0">
                        • {item.date}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border ${
                        item.attendance.includes("Hadir")
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                          : item.attendance.includes("belum")
                          ? "bg-slate-100 text-slate-700 border-slate-200/80"
                          : "bg-amber-50 text-amber-800 border-amber-200/80"
                      }`}
                    >
                      {item.attendance}
                    </span>

                    <button
                      onClick={() => handleDeleteWish(item.id, item.name)}
                      disabled={busyId === `wish_${item.id}`}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/60 hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      title="Hapus ucapan doa restu ini"
                    >
                      {busyId === `wish_${item.id}` ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
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
