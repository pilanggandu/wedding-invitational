"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import type { GuestItem, WeddingInvitationData } from "@/types/wedding";
import { fetchGuestsFromBackend, GuestSaveError } from "@/lib/api";
import { deleteGuestMaster, getGuests, saveGuestMaster, saveGuests, setGuestSentStatus } from "@/lib/invitationStore";
import { getGuestDuplicateKey, getGuestInputError, normalizeGuestPhone, type GuestDraft } from "@/lib/guestData";
import { getPersonalInvitationUrl } from "@/lib/guestWhatsApp";
import { GuestExcelImport } from "./GuestExcelImport";
import { GuestWhatsAppQueue } from "./GuestWhatsAppQueue";

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
const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";
const buttonStyle = `min-h-11 rounded-lg border border-slate-500 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 ${focusStyle}`;
const primaryStyle = `min-h-11 rounded-lg bg-[#1C2434] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#24303F] disabled:cursor-not-allowed disabled:opacity-50 ${focusStyle}`;
const fieldStyle = `min-h-11 w-full min-w-0 rounded-lg border border-slate-500 bg-white px-3 py-2.5 text-base text-slate-900 disabled:bg-slate-100 ${focusStyle}`;
const errorMessage = (cause: unknown) => cause instanceof Error ? cause.message : "Permintaan gagal. Silakan coba lagi.";

export function GuestListManager({ data, guests, onGuestsUpdated }: GuestListManagerProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "sent" | "unsent">("all");
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

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);
  useEffect(() => { if (formOpen) nameInputRef.current?.focus(); }, [formOpen, editingId]);

  const categories = Array.from(new Set([...defaultCategories, ...guests.map((guest) => guest.category).filter(Boolean)]));
  const query = search.trim().toLocaleLowerCase("id-ID");
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = !query || [guest.name, guest.phone, guest.category, guest.notes || ""].some((value) => value.toLocaleLowerCase("id-ID").includes(query));
    return matchesSearch && (!categoryFilter || guest.category === categoryFilter) &&
      (statusFilter === "all" || (statusFilter === "sent" ? guest.isSent : !guest.isSent));
  });
  const pageCount = Math.max(1, Math.ceil(filteredGuests.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount - 1);
  const visibleGuests = filteredGuests.slice(activePage * PAGE_SIZE, (activePage + 1) * PAGE_SIZE);
  const selectedGuests = guests.filter((guest) => selectedIds.has(guest.id));
  const allVisibleSelected = visibleGuests.length > 0 && visibleGuests.every((guest) => selectedIds.has(guest.id));
  const sentCount = guests.filter((guest) => guest.isSent).length;

  const publish = (updated: GuestItem[]) => { saveGuests(updated); onGuestsUpdated(updated); };
  const beginMutation = (action: BusyAction) => {
    if (mutationInFlight.current) return false;
    mutationInFlight.current = true;
    setBusy(action);
    setError("");
    setNotice("");
    return true;
  };
  const endMutation = () => { mutationInFlight.current = false; setBusy(null); };
  const closeForm = () => { setFormOpen(false); setEditingId(undefined); setDraft(newDraft()); };

  const editGuest = (guest?: GuestItem) => {
    setEditingId(guest?.id);
    setDraft(guest ? { name: guest.name, phone: guest.phone || "", category: guest.category || "Lainnya", quota: guest.quota ?? 1, notes: guest.notes || "" } : newDraft());
    setFormOpen(true);
    setError("");
    setNotice("");
  };

  const saveForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mutationInFlight.current) return;
    const validationError = getGuestInputError(draft);
    if (validationError) { setError(validationError); return; }
    const key = getGuestDuplicateKey(draft.name, draft.phone);
    if (guests.some((guest) => guest.id !== editingId && getGuestDuplicateKey(guest.name, guest.phone) === key)) {
      setError("Tamu dengan nama dan nomor WhatsApp yang sama sudah ada.");
      return;
    }
    if (!beginMutation("save")) return;
    try {
      await saveGuestMaster(draft, editingId);
      onGuestsUpdated(getGuests());
      setNotice(editingId ? "Perubahan tamu berhasil disimpan." : "Tamu berhasil ditambahkan.");
      closeForm();
    } catch (cause) {
      const refreshed = await fetchGuestsFromBackend();
      if (refreshed) publish(refreshed);
      const confirmed = refreshed?.find((guest) => (!editingId || guest.id === editingId) &&
        getGuestDuplicateKey(guest.name, guest.phone) === key &&
        guest.category === (draft.category.trim() || "Lainnya") && (guest.quota ?? 1) === draft.quota && (guest.notes || "") === draft.notes.trim());
      if (confirmed) {
        setNotice("Data tamu telah dikonfirmasi tersimpan di server.");
        closeForm();
      } else setError(`${errorMessage(cause)} Data formulir tetap tersedia. Muat ulang daftar sebelum mencoba lagi jika koneksi terputus.`);
    } finally { endMutation(); }
  };

  const removeGuest = async (guest: GuestItem) => {
    if (mutationInFlight.current || !window.confirm(`Hapus ${guest.name} dari daftar tamu?`)) return;
    if (!beginMutation("delete")) return;
    try {
      await deleteGuestMaster(guest.id);
      onGuestsUpdated(getGuests());
      setSelectedIds((previous) => { const next = new Set(previous); next.delete(guest.id); return next; });
      if (editingId === guest.id) closeForm();
      setNotice("Tamu berhasil dihapus.");
    } catch (cause) { setError(errorMessage(cause)); }
    finally { endMutation(); }
  };

  const updateSent = async (guestId: string, isSent: boolean) => {
    if (!beginMutation("status")) throw new Error("Tunggu hingga perubahan sebelumnya selesai.");
    try {
      await setGuestSentStatus(guestId, isSent);
      onGuestsUpdated(getGuests());
    } finally { endMutation(); }
  };

  const refreshGuests = async () => {
    if (!beginMutation("refresh")) return;
    try {
      const updated = await fetchGuestsFromBackend();
      if (!updated) throw new Error("Daftar tamu belum dapat dimuat dari server. Data yang ada tetap dipertahankan.");
      publish(updated);
      setNotice("Daftar tamu berhasil dimuat dari server.");
    } catch (cause) { setError(errorMessage(cause)); }
    finally { endMutation(); }
  };

  const copyLink = async (guest: GuestItem) => {
    try {
      await navigator.clipboard.writeText(getPersonalInvitationUrl(`${window.location.origin}/undangan`, guest));
      if (copyTimer.current) clearTimeout(copyTimer.current);
      setCopiedId(guest.id);
      copyTimer.current = setTimeout(() => setCopiedId(null), 2000);
    } catch { setError("Tautan belum dapat disalin. Gunakan tombol Buka untuk melihat undangan personal."); }
  };

  const importGuests = async (rows: ImportRow[]): Promise<ImportResult> => {
    const failAll = (message: string): ImportResult => ({ created: 0, failed: rows.map((row) => ({ rowNumber: row.rowNumber, message })) });
    if (!beginMutation("import")) return failAll("Tunggu hingga perubahan sebelumnya selesai, lalu coba lagi.");
    setImportProgress({ completed: 0, total: rows.length });
    const result: ImportResult = { created: 0, failed: [] };
    try {
      const serverGuests = await fetchGuestsFromBackend();
      if (!serverGuests) return failAll("Daftar server belum dapat diperiksa. Tidak ada data baru yang dikirim; coba lagi setelah koneksi pulih.");
      publish(serverGuests);
      const known = new Set(serverGuests.map((guest) => getGuestDuplicateKey(guest.name, guest.phone)));
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        const key = getGuestDuplicateKey(row.guest.name, row.guest.phone);
        const validationError = getGuestInputError(row.guest);
        if (validationError) result.failed.push({ rowNumber: row.rowNumber, message: validationError });
        else if (known.has(key)) result.created++;
        else {
          try {
            const saved = await saveGuestMaster(row.guest);
            known.add(key);
            known.add(getGuestDuplicateKey(saved.name, saved.phone));
            result.created++;
            onGuestsUpdated(getGuests());
          } catch (cause) {
            const reconciled = await fetchGuestsFromBackend();
            if (reconciled) publish(reconciled);
            const confirmed = new Set((reconciled || []).map((guest) => getGuestDuplicateKey(guest.name, guest.phone)));
            for (const pending of rows.slice(index)) {
              if (confirmed.has(getGuestDuplicateKey(pending.guest.name, pending.guest.phone))) result.created++;
              else result.failed.push({
                rowNumber: pending.rowNumber,
                unconfirmed: pending.rowNumber === row.rowNumber && (!(cause instanceof GuestSaveError) || cause.unconfirmed),
                message: pending.rowNumber === row.rowNumber
                  ? `${errorMessage(cause)} ${reconciled ? "Data belum ditemukan di server." : "Status simpan belum dapat dipastikan; periksa koneksi sebelum mencoba lagi."}`
                  : "Belum dicoba. Impor dihentikan setelah kegagalan koneksi atau penyimpanan; baris ini dapat dicoba lagi.",
              });
            }
            setImportProgress({ completed: index + 1, total: rows.length });
            return result;
          }
        }
        setImportProgress({ completed: index + 1, total: rows.length });
      }
      return result;
    } finally { endMutation(); }
  };

  const toggleSelected = (guestId: string) => setSelectedIds((previous) => {
    const next = new Set(previous);
    if (next.has(guestId)) next.delete(guestId); else next.add(guestId);
    return next;
  });

  return (
    <div className="min-w-0 space-y-5">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Master Tamu</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Kelola data tamu, impor Excel, dan siapkan undangan WhatsApp personal.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={!!busy} onClick={() => setImportOpen(true)} className={buttonStyle}>Impor Excel</button>
          <button type="button" disabled={!!busy} onClick={() => editGuest()} className={primaryStyle}>Tambah tamu</button>
        </div>
      </section>

      <dl className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
        {[['Total tamu', guests.length], ['Sudah terkirim', sentCount], ['Belum terkirim', guests.length - sentCount]].map(([label, count]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 sm:block">
            <dt className="text-sm font-medium text-slate-600">{label}</dt>
            <dd className="text-2xl font-bold text-slate-900 sm:mt-1">{count}</dd>
          </div>
        ))}
      </dl>

      <div aria-live="polite" className="space-y-2">
        {error && <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm leading-6 text-rose-900">{error}</p>}
        {notice && <p className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">{notice}</p>}
        {busy && busy !== "import" && busy !== "status" && <p className="text-sm text-slate-700">{busy === "refresh" ? "Memuat daftar tamu..." : busy === "delete" ? "Menghapus tamu..." : "Menyimpan data tamu..."}</p>}
      </div>

      {formOpen && (
        <form onSubmit={saveForm} aria-busy={busy === "save"} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900">{editingId ? "Edit tamu" : "Tambah tamu"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-name`} className="mb-2 block text-sm font-semibold text-slate-800">Nama tamu *</label>
              <input ref={nameInputRef} id={`${id}-name`} required maxLength={150} value={draft.name} disabled={!!busy} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={fieldStyle} />
            </div>
            <div>
              <label htmlFor={`${id}-phone`} className="mb-2 block text-sm font-semibold text-slate-800">Nomor WhatsApp</label>
              <input id={`${id}-phone`} type="tel" inputMode="tel" value={draft.phone} disabled={!!busy} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} aria-describedby={`${id}-phone-help`} placeholder="081234567890 atau +6281234567890" className={fieldStyle} />
              <p id={`${id}-phone-help`} className="mt-2 text-xs leading-5 text-slate-600">Opsional. Gunakan 08 atau kode negara seperti +62; nomor disimpan dalam format internasional.</p>
            </div>
            <div>
              <label htmlFor={`${id}-category`} className="mb-2 block text-sm font-semibold text-slate-800">Kategori</label>
              <input id={`${id}-category`} list={`${id}-categories`} maxLength={80} value={draft.category} disabled={!!busy} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className={fieldStyle} />
              <datalist id={`${id}-categories`}>{categories.map((category) => <option key={category} value={category} />)}</datalist>
              <p className="mt-2 text-xs text-slate-600">Pilih kategori atau tulis kategori sendiri.</p>
            </div>
            <div>
              <label htmlFor={`${id}-quota`} className="mb-2 block text-sm font-semibold text-slate-800">Kuota kehadiran</label>
              <input id={`${id}-quota`} type="number" min={1} max={20} step={1} required value={draft.quota || ""} disabled={!!busy} onChange={(event) => setDraft({ ...draft, quota: Number(event.target.value) })} className={fieldStyle} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-notes`} className="mb-2 block text-sm font-semibold text-slate-800">Catatan</label>
              <textarea id={`${id}-notes`} rows={3} maxLength={1000} value={draft.notes} disabled={!!busy} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} className={`${fieldStyle} resize-y`} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={!!busy} className={primaryStyle}>{busy === "save" ? "Menyimpan..." : editingId ? "Simpan perubahan" : "Simpan tamu"}</button>
            <button type="button" disabled={!!busy} onClick={closeForm} className={buttonStyle}>Batal</button>
          </div>
        </form>
      )}

      <section aria-label="Filter dan pilihan tamu" className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 md:items-end xl:grid-cols-4">
          <div>
            <label htmlFor={`${id}-search`} className="mb-2 block text-sm font-medium text-slate-700">Cari tamu</label>
            <input id={`${id}-search`} type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Nama, nomor, kategori, atau catatan" className={fieldStyle} />
          </div>
          <div>
            <label htmlFor={`${id}-filter-category`} className="mb-2 block text-sm font-medium text-slate-700">Kategori</label>
            <select id={`${id}-filter-category`} value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(0); }} className={fieldStyle}>
              <option value="">Semua kategori</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-filter-status`} className="mb-2 block text-sm font-medium text-slate-700">Status kirim</label>
            <select id={`${id}-filter-status`} value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as "all" | "sent" | "unsent"); setPage(0); }} className={fieldStyle}>
              <option value="all">Semua status</option><option value="sent">Sudah terkirim</option><option value="unsent">Belum terkirim</option>
            </select>
          </div>
          <button type="button" disabled={!!busy} onClick={refreshGuests} className={buttonStyle}>{busy === "refresh" ? "Memuat..." : "Muat ulang"}</button>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-2 text-sm font-semibold text-slate-800" aria-live="polite">{selectedGuests.length} tamu dipilih</p>
            <button type="button" disabled={!!busy || !filteredGuests.some((guest) => !guest.isSent)} onClick={() => setSelectedIds((previous) => new Set([...previous, ...filteredGuests.filter((guest) => !guest.isSent).map((guest) => guest.id)]))} className={buttonStyle}>Pilih belum terkirim (hasil filter)</button>
            <button type="button" disabled={!!busy || !selectedGuests.length} onClick={() => setSelectedIds(new Set())} className={buttonStyle}>Hapus pilihan</button>
          </div>
          <button type="button" disabled={!!busy || !selectedGuests.length} onClick={() => setQueueGuests(selectedGuests)} className={primaryStyle}>Antrean WhatsApp ({selectedGuests.length})</button>
        </div>
        <p className="text-xs leading-5 text-slate-600">Pilihan tetap tersimpan saat berpindah filter atau halaman. Antrean membuka WhatsApp satu tamu setiap kali; status terkirim menunggu konfirmasi Anda.</p>
      </section>

      <section aria-label="Daftar tamu" className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-4 text-sm text-slate-600">
          <p>{filteredGuests.length} tamu sesuai filter · {PAGE_SIZE} tamu per halaman</p>
          <label className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 font-medium text-slate-800 ${focusStyle}`}>
            <input type="checkbox" checked={allVisibleSelected} disabled={!!busy || !visibleGuests.length} onChange={() => setSelectedIds((previous) => { const next = new Set(previous); visibleGuests.forEach((guest) => { if (allVisibleSelected) next.delete(guest.id); else next.add(guest.id); }); return next; })} className="h-5 w-5 accent-slate-900" />
            Pilih semua di halaman ini
          </label>
        </div>
        {!visibleGuests.length ? (
          <div className="space-y-2 p-8 text-center">
            <h3 className="font-semibold text-slate-900">{guests.length ? "Tidak ada tamu yang cocok" : "Belum ada tamu"}</h3>
            <p className="text-sm text-slate-600">{guests.length ? "Sesuaikan pencarian atau filter untuk melihat tamu lain." : "Tambahkan tamu satu per satu atau impor file Excel."}</p>
          </div>
        ) : (
          <div tabIndex={0} role="region" aria-label="Tabel tamu, geser untuk melihat semua kolom" className={`overflow-x-auto ${focusStyle}`}>
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-700">
                <tr>{['Pilih', 'Nama tamu', 'Kategori', 'Kuota', 'WhatsApp', 'Status kirim', 'RSVP', 'Tindakan'].map((label) => <th key={label} scope="col" className="px-3 py-3 font-semibold">{label}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {visibleGuests.map((guest) => {
                  const personalUrl = origin ? getPersonalInvitationUrl(`${origin}/undangan`, guest) : undefined;
                  const phoneValid = !!normalizeGuestPhone(guest.phone || "") && !getGuestInputError({ name: guest.name, phone: guest.phone || "" });
                  return (
                    <tr key={guest.id} className="align-top hover:bg-slate-50">
                      <td className="px-3 py-3">
                        <label className={`flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg ${focusStyle}`}>
                          <input type="checkbox" checked={selectedIds.has(guest.id)} disabled={!!busy} onChange={() => toggleSelected(guest.id)} aria-label={`Pilih ${guest.name}`} className="h-5 w-5 accent-slate-900" />
                        </label>
                      </td>
                      <th scope="row" className="max-w-64 px-3 py-4 font-normal">
                        <p className="break-words font-semibold text-slate-900">{guest.name}</p>
                        {guest.notes && <p className="mt-1 break-words text-xs leading-5 text-slate-600">{guest.notes}</p>}
                        {guest.token && <p className="mt-1 break-all font-mono text-[11px] text-slate-600">Token: {guest.token}</p>}
                      </th>
                      <td className="max-w-40 break-words px-3 py-4 text-slate-700">{guest.category || "Lainnya"}</td>
                      <td className="px-3 py-4 text-slate-700">{guest.quota ?? 1} orang</td>
                      <td className="max-w-44 break-all px-3 py-4 font-mono text-xs text-slate-700">{guest.phone || "Tanpa nomor"}</td>
                      <td className="px-3 py-3">
                        <button type="button" disabled={!!busy} onClick={() => { void updateSent(guest.id, !guest.isSent).catch((cause) => setError(errorMessage(cause))); }} title={`Ubah status kirim ${guest.name}`} className={`${buttonStyle} whitespace-nowrap ${guest.isSent ? "text-emerald-800" : "text-slate-800"}`}>{guest.isSent ? "Terkirim" : "Belum terkirim"}</button>
                        {!!guest.openCount && guest.openCount > 0 && <p className="mt-1 text-xs text-emerald-800">Dibuka {guest.openCount}x</p>}
                      </td>
                      <td className="px-3 py-4 text-xs text-slate-700">{guest.rsvp ? guest.rsvp.status === 1 ? `Hadir (${guest.rsvp.count})` : "Tidak hadir" : "Belum menjawab"}</td>
                      <td className="px-3 py-3">
                        <div className="flex max-w-72 flex-wrap gap-2">
                          <button type="button" disabled={!!busy || !phoneValid} onClick={() => setQueueGuests([guest])} title={phoneValid ? `Siapkan WhatsApp untuk ${guest.name}` : "Isi nomor WhatsApp yang valid terlebih dahulu"} className={buttonStyle}>WhatsApp</button>
                          <button type="button" onClick={() => { void copyLink(guest); }} className={buttonStyle} aria-label={`Salin tautan ${guest.name}`}>{copiedId === guest.id ? "Tersalin" : "Salin link"}</button>
                          <a href={personalUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center ${buttonStyle}`} aria-label={`Buka undangan ${guest.name}`}>Buka</a>
                          <button type="button" disabled={!!busy} onClick={() => editGuest(guest)} className={buttonStyle} aria-label={`Edit ${guest.name}`}>Edit</button>
                          <button type="button" disabled={!!busy} onClick={() => { void removeGuest(guest); }} className={`${buttonStyle} text-rose-800`} aria-label={`Hapus ${guest.name}`}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <nav aria-label="Halaman daftar tamu" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4">
          <button type="button" disabled={activePage === 0} onClick={() => setPage(activePage - 1)} className={buttonStyle}>Sebelumnya</button>
          <p className="text-sm text-slate-600">Halaman {activePage + 1} dari {pageCount}</p>
          <button type="button" disabled={activePage + 1 >= pageCount} onClick={() => setPage(activePage + 1)} className={buttonStyle}>Berikutnya</button>
        </nav>
      </section>

      {importOpen && <GuestExcelImport guests={guests} onImport={importGuests} progress={importProgress} onClose={() => { if (!mutationInFlight.current) { setImportOpen(false); setImportProgress(undefined); } }} />}
      {queueGuests && <GuestWhatsAppQueue guests={queueGuests} data={data} onConfirmSent={(guestId) => updateSent(guestId, true)} onClose={() => { if (!mutationInFlight.current) setQueueGuests(null); }} />}
    </div>
  );
}
