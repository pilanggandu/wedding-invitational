"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { GuestItem } from "@/types/wedding";
import {
  getGuestDuplicateKey,
  getGuestInputError,
  normalizeGuestPhone,
  type GuestDraft,
} from "@/lib/guestData";
import {
  createGuestExcelTemplate,
  parseGuestExcelFile,
  type GuestExcelRow,
} from "@/lib/guestExcel";

interface GuestExcelImportProps {
  guests: GuestItem[];
  progress?: { completed: number; total: number };
  onImport: (rows: Array<{ rowNumber: number; guest: GuestDraft }>) => Promise<{
    created: number;
    failed: Array<{ rowNumber: number; message: string; unconfirmed?: boolean }>;
  }>;
  onClose: () => void;
}

type RowStatus = "valid" | "duplicate" | "invalid" | "saved" | "failed" | "unconfirmed";
interface PreviewRow extends GuestExcelRow {
  status: RowStatus;
  message: string;
}

const PAGE_SIZE = 50;
const buttonClass = "min-h-11 rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const statusLabel: Record<RowStatus, string> = {
  valid: "Siap diimpor",
  duplicate: "Duplikat",
  invalid: "Perlu diperbaiki",
  saved: "Tersimpan",
  failed: "Gagal disimpan",
  unconfirmed: "Belum terkonfirmasi",
};

export function GuestExcelImport({ guests, progress, onImport, onClose }: GuestExcelImportProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const importInFlight = useRef(false);
  const titleId = useId();
  const descriptionId = useId();
  const fileId = useId();
  const [rows, setRows] = useState<GuestExcelRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [reading, setReading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [savedRows, setSavedRows] = useState<Set<number>>(new Set());
  const [unconfirmedRows, setUnconfirmedRows] = useState<Set<number>>(new Set());
  const [failures, setFailures] = useState<Record<number, string>>({});
  const [createdCount, setCreatedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [page, setPage] = useState(0);
  const busy = reading || importing;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, []);

  const preview = useMemo<PreviewRow[]>(() => {
    const existing = new Set(guests.map((guest) => getGuestDuplicateKey(guest.name, guest.phone || "")));
    const inFile = new Set<string>();
    return (rows ?? []).map((row) => {
      const key = getGuestDuplicateKey(row.guest.name, row.guest.phone);
      if (savedRows.has(row.rowNumber)) {
        inFile.add(key);
        return { ...row, status: "saved", message: "Tamu berhasil disimpan." };
      }
      const validationError = row.error || getGuestInputError(row.guest);
      if (validationError) return { ...row, status: "invalid", message: validationError };
      if (existing.has(key) || inFile.has(key)) {
        return { ...row, status: "duplicate", message: existing.has(key) ? "Nama dan nomor yang sama sudah ada di daftar tamu." : "Nama dan nomor yang sama sudah ada pada baris sebelumnya di file ini." };
      }
      inFile.add(key);
      if (unconfirmedRows.has(row.rowNumber)) return { ...row, status: "unconfirmed", message: failures[row.rowNumber] || "Status simpan belum dapat dipastikan. Periksa daftar tamu sebelum mengimpor ulang." };
      if (failures[row.rowNumber]) return { ...row, status: "failed", message: failures[row.rowNumber] };
      return { ...row, status: "valid", message: row.guest.phone ? "Data valid." : "Data valid, tanpa nomor WhatsApp." };
    });
  }, [rows, guests, savedRows, failures, unconfirmedRows]);

  const importable = preview.filter((row) => row.status === "valid" || row.status === "failed");
  const duplicates = preview.filter((row) => row.status === "duplicate").length;
  const invalid = preview.filter((row) => row.status === "invalid").length;
  const failed = preview.filter((row) => row.status === "failed").length;
  const unconfirmed = preview.filter((row) => row.status === "unconfirmed").length;
  const pageCount = Math.max(1, Math.ceil(preview.length / PAGE_SIZE));
  const visibleRows = preview.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleFile = async (file: File) => {
    setReading(true);
    setError("");
    setRows(null);
    setSavedRows(new Set());
    setUnconfirmedRows(new Set());
    setFailures({});
    setCreatedCount(0);
    setFileName(file.name);
    setPage(0);
    try {
      setRows(await parseGuestExcelFile(file));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "File Excel tidak dapat dibaca. Coba simpan ulang sebagai .xlsx.");
    } finally {
      setReading(false);
    }
  };

  const downloadTemplate = async () => {
    setDownloading(true);
    setError("");
    try {
      const blob = await createGuestExcelTemplate();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "template-daftar-tamu.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Template gagal diunduh. Coba kembali.");
    } finally {
      setDownloading(false);
    }
  };

  const saveImport = async () => {
    if (busy || importInFlight.current || !importable.length) return;
    const batch = importable.map((row) => ({
      rowNumber: row.rowNumber,
      guest: { ...row.guest, phone: normalizeGuestPhone(row.guest.phone) },
    }));
    importInFlight.current = true;
    setImporting(true);
    setActiveCount(batch.length);
    setError("");
    try {
      const result = await onImport(batch);
      const batchNumbers = new Set(batch.map((row) => row.rowNumber));
      const failedNumbers = new Set(result.failed.map((row) => row.rowNumber));
      const consistent = Number.isInteger(result.created) && result.created >= 0 &&
        result.created + failedNumbers.size === batch.length &&
        failedNumbers.size === result.failed.length &&
        result.failed.every((row) => batchNumbers.has(row.rowNumber));
      if (!consistent) {
        setUnconfirmedRows((previous) => new Set([...previous, ...batchNumbers]));
        setError("Hasil simpan belum lengkap. Periksa daftar tamu sebelum mengimpor ulang file ini agar data tidak tersimpan dua kali.");
        return;
      }
      setCreatedCount((previous) => previous + result.created);
      setSavedRows((previous) => new Set([...previous, ...batch.filter((row) => !failedNumbers.has(row.rowNumber)).map((row) => row.rowNumber)]));
      setUnconfirmedRows((previous) => new Set([...previous, ...result.failed.filter((row) => row.unconfirmed).map((row) => row.rowNumber)]));
      setFailures(Object.fromEntries(result.failed.map((row) => [row.rowNumber, row.message || "Tamu gagal disimpan. Silakan coba lagi."])));
      if (result.failed.some((row) => row.unconfirmed)) setError("Ada baris yang status simpannya belum terkonfirmasi dan tidak akan dicoba ulang. Periksa master tamu sebelum mengimpor ulang file. Baris yang belum dikirim tetap dapat dilanjutkan.");
      else if (result.failed.length) setError(`${result.failed.length} baris gagal disimpan. Baris yang berhasil tidak akan diimpor ulang saat mencoba lagi.`);
    } catch (cause) {
      setUnconfirmedRows((previous) => new Set([...previous, ...batch.map((row) => row.rowNumber)]));
      setError(`${cause instanceof Error ? cause.message : "Proses impor terhenti."} Status simpan belum dapat dipastikan. Periksa daftar tamu sebelum mengimpor ulang.`);
    } finally {
      importInFlight.current = false;
      setImporting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-busy={busy}
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
      className="m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-5xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/50"
    >
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-bold">Impor tamu dari Excel</h2>
            <p id={descriptionId} className="mt-2 text-sm leading-6 text-slate-600">
              Unduh template, isi data tamu, lalu periksa pratinjau sebelum menyimpan.
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} className={`${buttonClass} shrink-0 border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}>
            Tutup
          </button>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Kolom: Nama, WhatsApp, Kategori, Kuota, Catatan. Nama wajib diisi; WhatsApp boleh kosong. Gunakan format Teks untuk nomor agar angka 0 di awal tetap tersimpan.
          </p>
          <button type="button" onClick={downloadTemplate} disabled={downloading || busy} className={`${buttonClass} shrink-0 border-slate-300 bg-white text-slate-800 hover:bg-slate-50`}>
            {downloading ? "Menyiapkan template..." : "Unduh template .xlsx"}
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label htmlFor={fileId} className="block text-sm font-semibold text-slate-900">Pilih file Excel</label>
          <input
            id={fileId}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            disabled={busy}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (file) void handleFile(file);
            }}
            aria-describedby={`${fileId}-hint`}
            className="mt-2 min-h-11 w-full min-w-0 rounded-lg text-sm text-slate-700 file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-lg file:border file:border-slate-300 file:bg-white file:px-4 file:py-2 file:font-medium file:text-slate-800 hover:file:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 disabled:opacity-50"
          />
          <p id={`${fileId}-hint`} className="mt-2 text-xs leading-5 text-slate-600">Format .xlsx, maksimal 5 MB dan 1.000 tamu. Sheet Tamu / Data Tamu diprioritaskan; jika tidak ada, sheet pertama dibaca. Rumus tidak didukung.</p>
          {fileName && <p className="mt-2 break-all text-sm text-slate-700">File: {fileName}</p>}
        </div>

        <div aria-live="polite" aria-atomic="true" className="space-y-3">
          {reading && <p className="text-sm text-slate-700">Membaca dan memeriksa file Excel...</p>}
          {importing && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">{progress && progress.total > 0 ? `Menyimpan ${progress.completed} dari ${progress.total} tamu.` : `Menyimpan ${activeCount} tamu.`} Tunggu hingga proses selesai.</p>
              {progress && progress.total > 0 && <progress aria-label="Progres simpan tamu" value={progress.completed} max={progress.total} className="h-2 w-full accent-slate-800" />}
            </div>
          )}
          {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-800">{error}</p>}
          {createdCount > 0 && <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{createdCount} tamu berhasil disimpan.</p>}
        </div>

        {rows !== null && (
          <section aria-label="Pratinjau hasil impor" className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold text-slate-900">Pratinjau {preview.length} baris tamu</h3>
              <p className="text-sm text-slate-700" aria-live="polite">{importable.length} siap diimpor · {duplicates} duplikat · {invalid} perlu diperbaiki{failed > 0 ? ` · ${failed} gagal disimpan` : ""}{unconfirmed > 0 ? ` · ${unconfirmed} belum terkonfirmasi` : ""}</p>
            </div>
            {preview.length === 0 ? (
              <p className="rounded-lg border border-slate-200 p-5 text-sm leading-6 text-slate-600">Belum ada data tamu. Isi sheet Tamu mulai baris 2, simpan file, lalu pilih file kembali.</p>
            ) : (
              <>
                <p className="text-xs leading-5 text-slate-600">Duplikat diperiksa dari gabungan nama dan nomor WhatsApp. Perbaiki baris bermasalah di Excel lalu pilih file kembali, atau impor baris yang sudah valid.</p>
                <div tabIndex={0} role="region" aria-label="Tabel pratinjau Excel, geser untuk melihat semua kolom" className="max-h-96 overflow-auto rounded-lg border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="sticky top-0 bg-slate-100 text-xs text-slate-700">
                      <tr>
                        {['Baris', 'Nama', 'WhatsApp', 'Kategori / Kuota', 'Catatan', 'Hasil pemeriksaan'].map((label) => <th key={label} scope="col" className="px-3 py-3 font-semibold">{label}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {visibleRows.map((row) => (
                        <tr key={row.rowNumber} className="align-top">
                          <th scope="row" className="px-3 py-3 font-medium text-slate-600">{row.rowNumber}</th>
                          <td className="max-w-48 break-words px-3 py-3 font-medium text-slate-900">{row.guest.name || "Nama kosong"}</td>
                          <td className="max-w-44 break-all px-3 py-3 text-slate-700">{row.guest.phone || "Tanpa nomor"}</td>
                          <td className="max-w-40 break-words px-3 py-3 text-slate-700">{row.guest.category}<br />{row.guest.quota} orang</td>
                          <td className="max-w-48 break-words px-3 py-3 text-slate-600">{row.guest.notes || "Tidak ada"}</td>
                          <td className="min-w-56 max-w-72 px-3 py-3">
                            <span className={`font-semibold ${row.status === "invalid" || row.status === "failed" ? "text-rose-800" : row.status === "valid" || row.status === "saved" ? "text-emerald-800" : "text-slate-700"}`}>{statusLabel[row.status]}</span>
                            <p className="mt-1 text-xs leading-5 text-slate-600">{row.message}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {pageCount > 1 && (
                  <nav aria-label="Halaman pratinjau" className="flex flex-wrap items-center justify-between gap-2">
                    <button type="button" disabled={page === 0 || busy} onClick={() => setPage((value) => Math.max(0, value - 1))} className={`${buttonClass} border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}>Sebelumnya</button>
                    <span className="text-sm text-slate-600">Halaman {page + 1} dari {pageCount}</span>
                    <button type="button" disabled={page + 1 >= pageCount || busy} onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))} className={`${buttonClass} border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}>Berikutnya</button>
                  </nav>
                )}
              </>
            )}
          </section>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-xs leading-5 text-slate-600">Hanya baris valid yang disimpan. Duplikat dan baris bermasalah dilewati.</p>
        <button type="button" onClick={saveImport} disabled={busy || importable.length === 0} className={`${buttonClass} shrink-0 border-[#1C2434] bg-[#1C2434] text-white hover:bg-[#24303F]`}>
          {importing ? "Menyimpan tamu..." : failed > 0 ? `Coba lagi ${importable.length} tamu` : `Impor ${importable.length} tamu`}
        </button>
      </div>
    </dialog>
  );
}
