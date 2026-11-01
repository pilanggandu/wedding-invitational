"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import type { GuestItem, WeddingInvitationData } from "@/types/wedding";
import { fetchGuestsFromBackend, GuestSaveError } from "@/lib/api";
import { deleteGuestMaster, getGuests, saveGuestMaster, saveGuests, setGuestSentStatus } from "@/lib/invitationStore";
import { getGuestDuplicateKey, getGuestInputError, normalizeGuestPhone, type GuestDraft } from "@/lib/guestData";
import { getPersonalInvitationUrl } from "@/lib/guestWhatsApp";
import { GuestExcelImport } from "./GuestExcelImport";
import { GuestWhatsAppQueue } from "./GuestWhatsAppQueue";
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  RotateCcw,
  Search,
  X,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  CalendarCheck,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Send,
  Phone,
  Sparkles,
  Filter,
} from "lucide-react";

interface GuestListManagerProps {
  data: WeddingInvitationData;
  guests: GuestItem[];
  onGuestsUpdated: (updated: GuestItem[]) => void;
}

type ImportRow = { rowNumber: number; guest: GuestDraft };
type ImportResult = { created: number; failed: Array<{ rowNumber: number; message: string; unconfirmed?: boolean }> };
type BusyAction = "save" | "delete" | "status" | "refresh" | "import";

const PAGE_SIZE = 25;
const defaultCategories = ["Keluarga", "Sahabat", "Rekan Kerja", "VIP", "Lainnya"];
const newDraft = (): GuestDraft => ({ name: "", phone: "", category: "Sahabat", quota: 1, notes: "" });
const subscribeToOrigin = () => () => undefined;
const readOrigin = () => window.location.origin;
const readServerOrigin = () => "";

const focusRing = "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1";
const errorMessage = (cause: unknown) => (cause instanceof Error ? cause.message : "Permintaan gagal. Silakan coba lagi.");

export function GuestListManager({ data, guests, onGuestsUpdated }: GuestListManagerProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "sent" | "unsent">("all");
  const [rsvpFilter, setRsvpFilter] = useState<"all" | "attending" | "not_attending" | "pending">("all");
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [draft, setDraft] = useState<GuestDraft>(newDraft);
  const [busy, setBusy] = useState<BusyAction | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importProgress, setImportProgress] = useState<{ completed: number; total: number }>();
  const [queueGuests, setQueueGuests] = useState<GuestItem[] | null>(null);

  const mutationInFlight = useRef(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const origin = useSyncExternalStore(subscribeToOrigin, readOrigin, readServerOrigin);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (formOpen) nameInputRef.current?.focus();
  }, [formOpen, editingId]);

  const categories = useMemo(() => {
    return Array.from(new Set([...defaultCategories, ...guests.map((g) => g.category).filter(Boolean)]));
  }, [guests]);

  const query = search.trim().toLocaleLowerCase("id-ID");
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        !query ||
        [guest.name, guest.phone, guest.category, guest.notes || ""].some((value) =>
          value.toLocaleLowerCase("id-ID").includes(query)
        );
      const matchesCategory = !categoryFilter || guest.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "sent" ? guest.isSent : !guest.isSent);
      const matchesRsvp =
        rsvpFilter === "all" ||
        (rsvpFilter === "attending" && guest.rsvp && guest.rsvp.status === 1) ||
        (rsvpFilter === "not_attending" && guest.rsvp && guest.rsvp.status === 2) ||
        (rsvpFilter === "pending" && !guest.rsvp);

      return matchesSearch && matchesCategory && matchesStatus && matchesRsvp;
    });
  }, [guests, query, categoryFilter, statusFilter, rsvpFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredGuests.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount - 1);
  const visibleGuests = useMemo(() => {
    return filteredGuests.slice(activePage * PAGE_SIZE, (activePage + 1) * PAGE_SIZE);
  }, [filteredGuests, activePage]);

  const selectedGuests = useMemo(() => {
    return guests.filter((guest) => selectedIds.has(guest.id));
  }, [guests, selectedIds]);

  const allVisibleSelected =
    visibleGuests.length > 0 && visibleGuests.every((guest) => selectedIds.has(guest.id));

  // Perhitungan Ringkasan Statistik
  const sentCount = guests.filter((guest) => guest.isSent).length;
  const unsentCount = guests.length - sentCount;
  const sentPercent = guests.length > 0 ? Math.round((sentCount / guests.length) * 100) : 0;
  const attendingGuests = guests.filter((g) => g.rsvp && g.rsvp.status === 1);
  const attendingCount = attendingGuests.length;
  const totalAttendingHeads = attendingGuests.reduce((acc, g) => acc + (g.rsvp?.count || g.quota || 1), 0);
  const totalQuota = guests.reduce((acc, g) => acc + (g.quota || 1), 0);

  const publish = (updated: GuestItem[]) => {
    saveGuests(updated);
    onGuestsUpdated(updated);
  };

  const beginMutation = (action: BusyAction) => {
    if (mutationInFlight.current) return false;
    mutationInFlight.current = true;
    setBusy(action);
    setError("");
    setNotice("");
    return true;
  };

  const endMutation = () => {
    mutationInFlight.current = false;
    setBusy(null);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(undefined);
    setDraft(newDraft());
  };

  const editGuest = (guest?: GuestItem) => {
    setEditingId(guest?.id);
    setDraft(
      guest
        ? {
            name: guest.name,
            phone: guest.phone || "",
            category: guest.category || "Lainnya",
            quota: guest.quota ?? 1,
            notes: guest.notes || "",
          }
        : newDraft()
    );
    setFormOpen(true);
    setError("");
    setNotice("");
  };

  const saveForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mutationInFlight.current) return;
    const validationError = getGuestInputError(draft);
    if (validationError) {
      setError(validationError);
      return;
    }
    const key = getGuestDuplicateKey(draft.name, draft.phone);
    if (
      guests.some(
        (guest) =>
          guest.id !== editingId && getGuestDuplicateKey(guest.name, guest.phone) === key
      )
    ) {
      setError("Tamu dengan nama dan nomor WhatsApp yang sama sudah ada.");
      return;
    }
    if (!beginMutation("save")) return;
    try {
      await saveGuestMaster(draft, editingId);
      onGuestsUpdated(getGuests());
      setNotice(editingId ? "Perubahan tamu berhasil disimpan." : "Tamu baru berhasil ditambahkan.");
      closeForm();
    } catch (cause) {
      const refreshed = await fetchGuestsFromBackend();
      if (refreshed) publish(refreshed);
      const confirmed = refreshed?.find(
        (guest) =>
          (!editingId || guest.id === editingId) &&
          getGuestDuplicateKey(guest.name, guest.phone) === key &&
          guest.category === (draft.category.trim() || "Lainnya") &&
          (guest.quota ?? 1) === draft.quota &&
          (guest.notes || "") === draft.notes.trim()
      );
      if (confirmed) {
        setNotice("Data tamu telah dikonfirmasi tersimpan di server.");
        closeForm();
      } else {
        setError(
          `${errorMessage(cause)} Data formulir tetap tersedia. Muat ulang daftar sebelum mencoba lagi jika koneksi terputus.`
        );
      }
    } finally {
      endMutation();
    }
  };

  const removeGuest = async (guest: GuestItem) => {
    if (mutationInFlight.current || !window.confirm(`Hapus ${guest.name} dari daftar tamu?`)) return;
    if (!beginMutation("delete")) return;
    try {
      await deleteGuestMaster(guest.id);
      onGuestsUpdated(getGuests());
      setSelectedIds((previous) => {
        const next = new Set(previous);
        next.delete(guest.id);
        return next;
      });
      if (editingId === guest.id) closeForm();
      setNotice(`Tamu ${guest.name} berhasil dihapus.`);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      endMutation();
    }
  };

  const updateSent = async (guestId: string, isSent: boolean) => {
    if (!beginMutation("status")) throw new Error("Tunggu hingga perubahan sebelumnya selesai.");
    try {
      await setGuestSentStatus(guestId, isSent);
      onGuestsUpdated(getGuests());
    } finally {
      endMutation();
    }
  };

  const refreshGuests = async () => {
    if (!beginMutation("refresh")) return;
    try {
      const updated = await fetchGuestsFromBackend();
      if (!updated)
        throw new Error("Daftar tamu belum dapat dimuat dari server. Data yang ada tetap dipertahankan.");
      publish(updated);
      setNotice("Daftar tamu berhasil disinkronkan dari server.");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      endMutation();
    }
  };

  const copyLink = async (guest: GuestItem) => {
    try {
      const link = getPersonalInvitationUrl(`${window.location.origin}/undangan`, guest);
      await navigator.clipboard.writeText(link);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      setCopiedId(guest.id);
      copyTimer.current = setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("Tautan belum dapat disalin. Gunakan tombol Buka untuk melihat undangan personal.");
    }
  };

  const importGuests = async (rows: ImportRow[]): Promise<ImportResult> => {
    const failAll = (message: string): ImportResult => ({
      created: 0,
      failed: rows.map((row) => ({ rowNumber: row.rowNumber, message })),
    });
    if (!beginMutation("import")) return failAll("Tunggu hingga proses sebelumnya selesai.");
    setImportProgress({ completed: 0, total: rows.length });
    const result: ImportResult = { created: 0, failed: [] };
    try {
      const serverGuests = await fetchGuestsFromBackend();
      if (!serverGuests)
        return failAll("Daftar server belum dapat diperiksa. Silakan coba lagi setelah koneksi pulih.");
      publish(serverGuests);
      const known = new Set(
        serverGuests.map((guest) => getGuestDuplicateKey(guest.name, guest.phone))
      );
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        const key = getGuestDuplicateKey(row.guest.name, row.guest.phone);
        const validationError = getGuestInputError(row.guest);
        if (validationError) {
          result.failed.push({ rowNumber: row.rowNumber, message: validationError });
        } else if (known.has(key)) {
          result.created++;
        } else {
          try {
            const saved = await saveGuestMaster(row.guest);
            known.add(key);
            known.add(getGuestDuplicateKey(saved.name, saved.phone));
            result.created++;
            onGuestsUpdated(getGuests());
          } catch (cause) {
            const reconciled = await fetchGuestsFromBackend();
            if (reconciled) publish(reconciled);
            const confirmed = new Set(
              (reconciled || []).map((guest) => getGuestDuplicateKey(guest.name, guest.phone))
            );
            for (const pending of rows.slice(index)) {
              if (confirmed.has(getGuestDuplicateKey(pending.guest.name, pending.guest.phone))) {
                result.created++;
              } else {
                result.failed.push({
                  rowNumber: pending.rowNumber,
                  unconfirmed:
                    pending.rowNumber === row.rowNumber &&
                    (!(cause instanceof GuestSaveError) || cause.unconfirmed),
                  message:
                    pending.rowNumber === row.rowNumber
                      ? `${errorMessage(cause)} ${
                          reconciled
                            ? "Data belum ditemukan di server."
                            : "Status simpan belum dapat dipastikan; periksa koneksi."
                        }`
                      : "Belum dicoba karena impor berhenti setelah terjadi gangguan.",
                });
              }
            }
            setImportProgress({ completed: index + 1, total: rows.length });
            return result;
          }
        }
        setImportProgress({ completed: index + 1, total: rows.length });
      }
      return result;
    } finally {
      endMutation();
    }
  };

  const toggleSelected = (guestId: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(guestId)) next.delete(guestId);
      else next.add(guestId);
      return next;
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "VIP":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Keluarga":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Sahabat":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Rekan Kerja":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* 1. HEADER SECTION */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Master Daftar Tamu
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {guests.length} Tamu
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kelola penerima undangan, pantau status kirim WhatsApp, impor Excel massal, dan catat konfirmasi kehadiran.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled={!!busy}
            onClick={refreshGuests}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer ${focusRing}`}
            title="Sinkronkan data dengan server"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${busy === "refresh" ? "animate-spin text-slate-900" : ""}`} />
            <span className="hidden sm:inline">Segarkan</span>
          </button>

          <button
            type="button"
            disabled={!!busy}
            onClick={() => setImportOpen(true)}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer ${focusRing}`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Impor Excel</span>
          </button>

          <button
            type="button"
            disabled={!!busy}
            onClick={() => editGuest()}
            className={`min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer ${focusRing}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Tamu</span>
          </button>
        </div>
      </section>

      {/* 2. STATS OVERVIEW CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Tamu */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
              Total Tamu
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight">
              {guests.length}
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-1">
              Est. {totalQuota} Kuota Undangan
            </div>
          </div>
        </div>

        {/* Card 2: Sudah Terkirim */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-700">
              Sudah Terkirim
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-800 font-mono tracking-tight">
              {sentCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <span>{sentPercent}% terkirim via WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Card 3: Belum Terkirim */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-amber-700">
              Belum Terkirim
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-800 font-mono tracking-tight">
              {unsentCount}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              Menunggu jadwal kirim
            </div>
          </div>
        </div>

        {/* Card 4: Pasti Hadir */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-teal-700">
              Pasti Hadir (RSVP)
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-teal-800 font-mono tracking-tight">
              {attendingCount}
            </div>
            <div className="text-[11px] text-teal-700 font-medium mt-1">
              Est. {totalAttendingHeads} Porsi Katering
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALERTS & NOTICES */}
      <div aria-live="polite" className="space-y-2">
        {error && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs sm:text-sm text-rose-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError("")} className="text-rose-500 hover:text-rose-700 p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {notice && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs sm:text-sm text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">{notice}</div>
            <button onClick={() => setNotice("")} className="text-emerald-500 hover:text-emerald-700 p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4. FORMULIR TAMBAH / EDIT TAMU (COLLAPSIBLE CARD) */}
      {formOpen && (
        <form
          onSubmit={saveForm}
          aria-busy={busy === "save"}
          className="bg-white rounded-2xl border border-slate-300 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                {editingId ? <Pencil className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {editingId ? "Edit Informasi Tamu" : "Tambah Tamu Undangan"}
              </h3>
            </div>
            <button
              type="button"
              disabled={!!busy}
              onClick={closeForm}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Tutup formulir"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-name`} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nama Tamu <span className="text-rose-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                id={`${id}-name`}
                required
                maxLength={150}
                value={draft.name}
                disabled={!!busy}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Contoh: Bpk. Bambang & Keluarga"
                className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-slate-800 ${focusRing}`}
              />
            </div>

            <div>
              <label htmlFor={`${id}-phone`} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nomor WhatsApp
              </label>
              <input
                id={`${id}-phone`}
                type="tel"
                inputMode="tel"
                value={draft.phone}
                disabled={!!busy}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder="081234567890 atau +6281234567890"
                className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-slate-800 ${focusRing}`}
              />
              <span className="block mt-1 text-[11px] text-slate-500">
                Gunakan 08 atau +62 (opsional, untuk pengiriman via WhatsApp).
              </span>
            </div>

            <div>
              <label htmlFor={`${id}-category`} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kategori Tamu
              </label>
              <input
                id={`${id}-category`}
                list={`${id}-categories`}
                maxLength={80}
                value={draft.category}
                disabled={!!busy}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                placeholder="Pilih atau tulis kategori"
                className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-slate-800 ${focusRing}`}
              />
              <datalist id={`${id}-categories`}>
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor={`${id}-quota`} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kuota Kehadiran (Orang)
              </label>
              <input
                id={`${id}-quota`}
                type="number"
                min={1}
                max={20}
                step={1}
                required
                value={draft.quota || 1}
                disabled={!!busy}
                onChange={(e) => setDraft({ ...draft, quota: Math.max(1, Number(e.target.value)) })}
                className={`w-full min-h-[42px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-slate-800 ${focusRing}`}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${id}-notes`} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Catatan Khusus (Opsional)
              </label>
              <textarea
                id={`${id}-notes`}
                rows={2}
                maxLength={1000}
                value={draft.notes}
                disabled={!!busy}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                placeholder="Contoh: Rekan kantor alumni kampus, meja khusus VIP depan..."
                className={`w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-slate-800 resize-y ${focusRing}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={!!busy}
              onClick={closeForm}
              className={`min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition ${focusRing}`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!!busy}
              className={`min-h-[40px] px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer ${focusRing}`}
            >
              <Check className="w-4 h-4" />
              <span>{busy === "save" ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Tamu"}</span>
            </button>
          </div>
        </form>
      )}

      {/* 5. FILTER & SEARCH TOOLBAR */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Input Pencarian */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id={`${id}-search`}
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Cari nama, WhatsApp, catatan..."
              className={`w-full min-h-[42px] pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-400 transition ${focusRing}`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Kategori */}
          <div>
            <select
              id={`${id}-filter-category`}
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
              className={`w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-slate-400 transition cursor-pointer ${focusRing}`}
            >
              <option value="">Semua Kategori ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  Kategori: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status Kirim */}
          <div>
            <select
              id={`${id}-filter-status`}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "sent" | "unsent");
                setPage(0);
              }}
              className={`w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-slate-400 transition cursor-pointer ${focusRing}`}
            >
              <option value="all">Semua Status Kirim</option>
              <option value="sent">Sudah Terkirim ({sentCount})</option>
              <option value="unsent">Belum Terkirim ({unsentCount})</option>
            </select>
          </div>

          {/* Filter Status RSVP */}
          <div>
            <select
              id={`${id}-filter-rsvp`}
              value={rsvpFilter}
              onChange={(e) => {
                setRsvpFilter(e.target.value as "all" | "attending" | "not_attending" | "pending");
                setPage(0);
              }}
              className={`w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-slate-400 transition cursor-pointer ${focusRing}`}
            >
              <option value="all">Semua Status RSVP</option>
              <option value="attending">Pasti Hadir</option>
              <option value="not_attending">Berhalangan Hadir</option>
              <option value="pending">Belum Konfirmasi</option>
            </select>
          </div>
        </div>

        {/* BATCH ACTION BAR (TAMPIL KETIKA ADA ITEM DIPILIH) */}
        {selectedGuests.length > 0 && (
          <div className="bg-slate-900 text-white rounded-xl p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-900 font-bold text-xs flex items-center justify-center shrink-0">
                {selectedGuests.length}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                Tamu dipilih untuk pengiriman massal
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Batal Pilih
              </button>

              <button
                type="button"
                disabled={!!busy}
                onClick={() => setQueueGuests(selectedGuests)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Buka Antrean WhatsApp ({selectedGuests.length})</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 6. DAFTAR TAMU: TABEL DESKTOP & KARTU RESPONSIVE MOBILE */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Subheader Jumlah & Quick Selection */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-200 bg-slate-50/70 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{filteredGuests.length}</span>
            <span>tamu sesuai kriteria filter</span>
            <span>·</span>
            <span>Halaman {activePage + 1} dari {pageCount}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!!busy || !filteredGuests.some((g) => !g.isSent)}
              onClick={() =>
                setSelectedIds(
                  (prev) =>
                    new Set([
                      ...prev,
                      ...filteredGuests.filter((g) => !g.isSent).map((g) => g.id),
                    ])
                )
              }
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition hover:underline"
            >
              Pilih semua belum terkirim
            </button>

            <label className={`inline-flex items-center gap-2 cursor-pointer font-medium text-slate-800 ${focusRing}`}>
              <input
                type="checkbox"
                checked={allVisibleSelected}
                disabled={!!busy || !visibleGuests.length}
                onChange={() =>
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    visibleGuests.forEach((g) => {
                      if (allVisibleSelected) next.delete(g.id);
                      else next.add(g.id);
                    });
                    return next;
                  })
                }
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <span>Pilih semua di halaman ini</span>
            </label>
          </div>
        </div>

        {/* KONDISI DATA KOSONG */}
        {!visibleGuests.length ? (
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {guests.length ? "Tidak ada tamu yang cocok dengan filter" : "Belum ada daftar tamu"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {guests.length
                ? "Coba ubah kata kunci pencarian, filter kategori, atau reset status kirim."
                : "Mulai masukkan data tamu baru atau impor dari file Excel."}
            </p>
            {!guests.length && (
              <button
                type="button"
                onClick={() => editGuest()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Tamu Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* VIEW A: TABEL BESAR UNTUK DESKTOP (MD+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th scope="col" className="w-12 px-4 py-3 text-center">
                      #
                    </th>
                    <th scope="col" className="px-4 py-3 min-w-[200px]">
                      Nama Tamu &amp; Keterangan
                    </th>
                    <th scope="col" className="px-3 py-3 w-32">
                      Kategori
                    </th>
                    <th scope="col" className="px-3 py-3 w-24">
                      Kuota
                    </th>
                    <th scope="col" className="px-3 py-3 w-36">
                      WhatsApp
                    </th>
                    <th scope="col" className="px-3 py-3 w-36">
                      Status Kirim
                    </th>
                    <th scope="col" className="px-3 py-3 w-36">
                      Status RSVP
                    </th>
                    <th scope="col" className="px-4 py-3 w-56 text-right">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {visibleGuests.map((guest, idx) => {
                    const personalUrl = origin
                      ? getPersonalInvitationUrl(`${origin}/undangan`, guest)
                      : undefined;
                    const phoneValid =
                      !!normalizeGuestPhone(guest.phone || "") &&
                      !getGuestInputError({ name: guest.name, phone: guest.phone || "" });
                    const isSelected = selectedIds.has(guest.id);

                    return (
                      <tr
                        key={guest.id}
                        className={`transition hover:bg-slate-50/80 ${
                          isSelected ? "bg-indigo-50/40" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3 text-center align-middle">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!!busy}
                            onChange={() => toggleSelected(guest.id)}
                            aria-label={`Pilih ${guest.name}`}
                            className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                          />
                        </td>

                        {/* Nama Tamu */}
                        <td className="px-4 py-3 align-middle">
                          <div className="font-semibold text-slate-900 text-sm leading-snug">
                            {guest.name}
                          </div>
                          {guest.notes && (
                            <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              {guest.notes}
                            </div>
                          )}
                          {guest.token && (
                            <span className="inline-block mt-0.5 font-mono text-[10px] text-slate-400">
                              token: {guest.token}
                            </span>
                          )}
                        </td>

                        {/* Kategori Badge */}
                        <td className="px-3 py-3 align-middle">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryColor(
                              guest.category || "Lainnya"
                            )}`}
                          >
                            {guest.category || "Lainnya"}
                          </span>
                        </td>

                        {/* Kuota */}
                        <td className="px-3 py-3 align-middle text-slate-700 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{guest.quota ?? 1} org</span>
                          </span>
                        </td>

                        {/* WhatsApp */}
                        <td className="px-3 py-3 align-middle">
                          {guest.phone ? (
                            <span className="font-mono text-xs text-slate-800">
                              {guest.phone}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Tanpa nomor</span>
                          )}
                        </td>

                        {/* Status Kirim Toggle */}
                        <td className="px-3 py-3 align-middle">
                          <button
                            type="button"
                            disabled={!!busy}
                            onClick={() => {
                              void updateSent(guest.id, !guest.isSent).catch((cause) =>
                                setError(errorMessage(cause))
                              );
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                              guest.isSent
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                            }`}
                            title="Klik untuk mengubah status kirim"
                          >
                            {guest.isSent ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Terkirim</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>Belum Kirim</span>
                              </>
                            )}
                          </button>
                          {!!guest.openCount && guest.openCount > 0 && (
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-700 font-medium">
                              <Eye className="w-3 h-3" />
                              <span>Dibuka {guest.openCount}x</span>
                            </div>
                          )}
                        </td>

                        {/* Status RSVP */}
                        <td className="px-3 py-3 align-middle">
                          {guest.rsvp ? (
                            guest.rsvp.status === 1 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Hadir ({guest.rsvp.count})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                                <X className="w-3 h-3 text-rose-600" />
                                <span>Tidak Hadir</span>
                              </span>
                            )
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Belum respon</span>
                          )}
                        </td>

                        {/* Tombol Tindakan Cepat */}
                        <td className="px-4 py-3 align-middle text-right">
                          <div className="inline-flex items-center gap-1 justify-end">
                            {/* WhatsApp Action */}
                            <button
                              type="button"
                              disabled={!!busy || !phoneValid}
                              onClick={() => setQueueGuests([guest])}
                              title={
                                phoneValid
                                  ? `Buka pesan WhatsApp personal untuk ${guest.name}`
                                  : "Isi nomor WhatsApp valid untuk kirim pesan"
                              }
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                phoneValid
                                  ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                              }`}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            {/* Salin Link */}
                            <button
                              type="button"
                              onClick={() => {
                                void copyLink(guest);
                              }}
                              title="Salin tautan undangan personal"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                            >
                              {copiedId === guest.id ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            {/* Buka Undangan */}
                            <a
                              href={personalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Buka undangan personal di tab baru"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition inline-flex items-center justify-center cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            {/* Edit */}
                            <button
                              type="button"
                              disabled={!!busy}
                              onClick={() => editGuest(guest)}
                              title="Edit tamu ini"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Hapus */}
                            <button
                              type="button"
                              disabled={!!busy}
                              onClick={() => {
                                void removeGuest(guest);
                              }}
                              title="Hapus tamu ini"
                              className="p-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* VIEW B: KARTU MOBILE RESPONSIVE (< MD) */}
            <div className="md:hidden divide-y divide-slate-100">
              {visibleGuests.map((guest) => {
                const personalUrl = origin
                  ? getPersonalInvitationUrl(`${origin}/undangan`, guest)
                  : undefined;
                const phoneValid =
                  !!normalizeGuestPhone(guest.phone || "") &&
                  !getGuestInputError({ name: guest.name, phone: guest.phone || "" });
                const isSelected = selectedIds.has(guest.id);

                return (
                  <div
                    key={guest.id}
                    className={`p-4 space-y-3 transition ${
                      isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!!busy}
                          onChange={() => toggleSelected(guest.id)}
                          aria-label={`Pilih ${guest.name}`}
                          className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 mt-1 cursor-pointer shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug break-words">
                            {guest.name}
                          </h4>
                          {guest.notes && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {guest.notes}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryColor(
                                guest.category || "Lainnya"
                              )}`}
                            >
                              {guest.category || "Lainnya"}
                            </span>
                            <span className="text-[11px] text-slate-600 font-medium">
                              Kuota: {guest.quota ?? 1} org
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!!busy}
                        onClick={() => {
                          void updateSent(guest.id, !guest.isSent).catch((cause) =>
                            setError(errorMessage(cause))
                          );
                        }}
                        className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          guest.isSent
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {guest.isSent ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Terkirim</span>
                          </>
                        ) : (
                          <span>Belum Kirim</span>
                        )}
                      </button>
                    </div>

                    {/* Info Nomor & RSVP Mobile */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono text-[11px]">
                          {guest.phone || "Tanpa nomor"}
                        </span>
                      </div>

                      <div>
                        {guest.rsvp ? (
                          guest.rsvp.status === 1 ? (
                            <span className="text-emerald-700 font-semibold text-[11px]">
                              Pasti Hadir ({guest.rsvp.count})
                            </span>
                          ) : (
                            <span className="text-rose-700 font-semibold text-[11px]">
                              Tidak Hadir
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Belum respon</span>
                        )}
                      </div>
                    </div>

                    {/* Tombol Aksi Mobile */}
                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={!!busy || !phoneValid}
                          onClick={() => setQueueGuests([guest])}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 ${
                            phoneValid
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            void copyLink(guest);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                        >
                          {copiedId === guest.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === guest.id ? "Tersalin" : "Link"}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <a
                          href={personalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                          title="Buka Undangan"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          disabled={!!busy}
                          onClick={() => editGuest(guest)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          disabled={!!busy}
                          onClick={() => {
                            void removeGuest(guest);
                          }}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* 7. PAGINASI ELEGAN */}
        {pageCount > 1 && (
          <nav
            aria-label="Navigasi halaman daftar tamu"
            className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-600"
          >
            <button
              type="button"
              disabled={activePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${focusRing}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="font-medium text-slate-700 text-xs">
              Halaman <strong className="text-slate-900 font-mono">{activePage + 1}</strong> dari{" "}
              <strong className="text-slate-900 font-mono">{pageCount}</strong>
            </span>

            <button
              type="button"
              disabled={activePage + 1 >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${focusRing}`}
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </section>

      {/* MODAL IMPOR EXCEL & MODAL ANTREAN WHATSAPP */}
      {importOpen && (
        <GuestExcelImport
          guests={guests}
          onImport={importGuests}
          progress={importProgress}
          onClose={() => {
            if (!mutationInFlight.current) {
              setImportOpen(false);
              setImportProgress(undefined);
            }
          }}
        />
      )}

      {queueGuests && (
        <GuestWhatsAppQueue
          guests={queueGuests}
          data={data}
          onConfirmSent={(guestId) => updateSent(guestId, true)}
          onClose={() => {
            if (!mutationInFlight.current) setQueueGuests(null);
          }}
        />
      )}
    </div>
  );
}
