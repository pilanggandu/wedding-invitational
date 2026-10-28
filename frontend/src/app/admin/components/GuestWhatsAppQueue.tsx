"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { GuestItem, WeddingInvitationData } from "@/types/wedding";
import { getGuestInputError, normalizeGuestPhone } from "@/lib/guestData";
import {
  buildGuestWhatsAppMessage,
  DEFAULT_GUEST_WHATSAPP_TEMPLATE,
  getPersonalInvitationUrl,
  getWhatsAppWebUrl,
} from "@/lib/guestWhatsApp";

interface GuestWhatsAppQueueProps {
  guests: GuestItem[];
  data: WeddingInvitationData;
  onConfirmSent: (id: string) => Promise<void>;
  onClose: () => void;
}

interface QueueOutcome {
  id: string;
  status: "confirmed" | "skipped";
}

const subscribeToOrigin = () => () => undefined;
const readOrigin = () => window.location.origin;
const readServerOrigin = () => "";
const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";
const secondaryButton = `min-h-11 rounded-lg border border-slate-500 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 ${focusStyle}`;
const fieldStyle = `min-h-11 w-full rounded-lg border border-slate-500 bg-white px-3 py-2.5 text-base text-slate-900 disabled:bg-slate-100 ${focusStyle}`;

export function GuestWhatsAppQueue({ guests, data, onConfirmSent, onClose }: GuestWhatsAppQueueProps) {
  const [selection] = useState(() => {
    const seen = new Set<string>();
    return guests.filter((guest) => {
      if (seen.has(guest.id)) return false;
      seen.add(guest.id);
      return true;
    }).map((guest) => ({ ...guest }));
  });
  const [outcomes, setOutcomes] = useState<QueueOutcome[]>([]);
  const [websiteOverride, setWebsiteOverride] = useState<string | null>(null);
  const [template, setTemplate] = useState(DEFAULT_GUEST_WHATSAPP_TEMPLATE);
  const [openedGuestId, setOpenedGuestId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const origin = useSyncExternalStore(subscribeToOrigin, readOrigin, readServerOrigin);
  const websiteUrl = websiteOverride ?? (origin ? `${origin}/undangan` : "");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openLinkRef = useRef<HTMLAnchorElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  const inFlightId = useRef<string | null>(null);
  const handledIds = useRef(new Set<string>());
  const id = useId();

  useEffect(() => {
    mounted.current = true;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      mounted.current = false;
      dialog?.close();
    };
  }, []);

  useEffect(() => {
    if (outcomes.length) (openLinkRef.current ?? summaryRef.current)?.focus();
  }, [outcomes.length]);

  const excluded = selection.flatMap((guest) => {
    const reason = !normalizeGuestPhone(guest.phone)
      ? "Nomor WhatsApp belum diisi."
      : getGuestInputError({ name: guest.name, phone: guest.phone });
    return reason ? [{ guest, reason }] : [];
  });
  const excludedIds = new Set(excluded.map(({ guest }) => guest.id));
  const recipients = selection.filter((guest) => !excludedIds.has(guest.id));
  const currentGuest = recipients[outcomes.length];
  const complete = !currentGuest;
  const confirmedCount = outcomes.filter((outcome) => outcome.status === "confirmed").length;
  const skippedCount = outcomes.filter((outcome) => outcome.status === "skipped").length;

  let message = "";
  let personalUrl = "";
  let whatsAppUrl = "";
  let previewError: string | null = null;
  if (currentGuest) {
    try {
      personalUrl = getPersonalInvitationUrl(websiteUrl, currentGuest);
      message = buildGuestWhatsAppMessage(currentGuest, data, websiteUrl, template);
      whatsAppUrl = getWhatsAppWebUrl(currentGuest.phone, message);
    } catch (cause) {
      previewError = cause instanceof Error ? cause.message : "Pesan belum dapat dibuat.";
    }
  }

  const closeQueue = () => {
    if (!inFlightId.current) onClose();
  };

  const advance = (guestId: string, status: QueueOutcome["status"]) => {
    if (handledIds.current.has(guestId)) return;
    handledIds.current.add(guestId);
    setOutcomes((previous) => [...previous, { id: guestId, status }]);
    setOpenedGuestId(null);
    setError(null);
  };

  const confirmSent = async () => {
    if (!currentGuest || inFlightId.current || handledIds.current.has(currentGuest.id) || openedGuestId !== currentGuest.id) return;
    const guestId = currentGuest.id;
    inFlightId.current = guestId;
    setSaving(true);
    setError(null);
    try {
      await onConfirmSent(guestId);
      if (mounted.current && inFlightId.current === guestId) advance(guestId, "confirmed");
    } catch (cause) {
      if (mounted.current) setError(cause instanceof Error ? cause.message : "Status terkirim belum tersimpan. Silakan coba lagi.");
    } finally {
      inFlightId.current = null;
      if (mounted.current) setSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-instructions`}
      aria-busy={saving}
      onCancel={(event) => { event.preventDefault(); closeQueue(); }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-4xl overflow-y-auto rounded-xl border border-slate-300 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/50"
    >
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="min-w-0">
            <h2 id={`${id}-title`} className="text-xl font-bold">Antrean WhatsApp Web</h2>
            <p id={`${id}-instructions`} className="mt-2 text-sm leading-relaxed text-slate-600">
              Buka satu tamu, kirim pesannya di WhatsApp Web, lalu kembali untuk menandai terkirim dan melanjutkan.
              Membuka WhatsApp tidak mengubah status kirim.
            </p>
          </div>
          <button type="button" onClick={closeQueue} disabled={saving} className={secondaryButton}>Tutup</button>
        </div>

        <div className="space-y-2" aria-live="polite">
          <p className="text-sm font-semibold">
            {selection.length} tamu dipilih · {recipients.length} penerima dalam antrean
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
            <span>{complete ? "Antrean selesai" : `Tamu ${outcomes.length + 1} dari ${recipients.length}`}</span>
            <span>{outcomes.length}/{recipients.length} diproses</span>
          </div>
          <progress value={outcomes.length} max={recipients.length || 1} aria-label="Progres antrean" className="h-2 w-full accent-emerald-700" />
        </div>

        {excluded.length > 0 && (
          <details className="rounded-lg border border-amber-300 bg-amber-50 px-4 text-sm text-amber-950">
            <summary className={`min-h-11 cursor-pointer py-3 font-semibold ${focusStyle}`}>
              {excluded.length} tamu dikeluarkan karena nomor kosong atau data tidak valid
            </summary>
            <ul className="mb-4 list-disc space-y-2 pl-5">
              {excluded.map(({ guest, reason }) => <li key={guest.id}><strong>{guest.name || "Tanpa nama"}</strong>: {reason}</li>)}
            </ul>
          </details>
        )}

        {complete ? (
          <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 ref={summaryRef} tabIndex={-1} className={`text-lg font-bold ${focusStyle}`}>{recipients.length ? "Semua penerima telah diproses" : "Belum ada penerima yang dapat dikirim"}</h3>
            <p className="text-sm leading-relaxed text-slate-700">
              {confirmedCount} tamu dikonfirmasi terkirim · {skippedCount} tamu dilewati · {excluded.length} tamu dikeluarkan.
              Status tamu yang dilewati atau dikeluarkan tidak berubah.
            </p>
            <button type="button" onClick={closeQueue} className={secondaryButton}>Selesai &amp; tutup</button>
          </div>
        ) : (
          <>
            <div className="grid min-w-0 gap-5 md:grid-cols-2">
              <div className="min-w-0 space-y-5">
                <div>
                  <label htmlFor={`${id}-website`} className="mb-2 block text-sm font-semibold">URL website undangan</label>
                  <input
                    id={`${id}-website`}
                    type="url"
                    inputMode="url"
                    value={websiteUrl}
                    disabled={saving}
                    onChange={(event) => { setWebsiteOverride(event.target.value); setOpenedGuestId(null); setError(null); }}
                    aria-describedby={`${id}-website-help`}
                    className={fieldStyle}
                  />
                  <p id={`${id}-website-help`} className="mt-2 text-sm leading-relaxed text-slate-600">
                    Gunakan URL publik yang dapat dibuka tamu. Alamat localhost hanya dapat dibuka di komputer ini.
                    Parameter template tetap disertakan; token atau nama akan disesuaikan untuk setiap tamu.
                  </p>
                </div>
                <div>
                  <label htmlFor={`${id}-template`} className="mb-2 block text-sm font-semibold">Template pesan</label>
                  <textarea
                    id={`${id}-template`}
                    value={template}
                    rows={10}
                    disabled={saving}
                    onChange={(event) => { setTemplate(event.target.value); setOpenedGuestId(null); setError(null); }}
                    aria-describedby={`${id}-placeholders`}
                    className={`${fieldStyle} resize-y leading-relaxed`}
                  />
                  <p id={`${id}-placeholders`} className="mt-2 break-words text-sm leading-relaxed text-slate-600">
                    Variabel: {"{nama}, {mempelai_pria}, {mempelai_wanita}, {tanggal}, {link}"}. Tanggal mengikuti data acara; jika belum diisi, tanggal dikosongkan.
                  </p>
                </div>
              </div>
              <div className="min-w-0 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-600">Penerima saat ini</h3>
                  <p className="mt-1 break-words text-lg font-bold">{currentGuest.name}</p>
                  <p className="mt-1 break-all font-mono text-sm text-slate-700">+{normalizeGuestPhone(currentGuest.phone)}</p>
                  {currentGuest.isSent && <p className="mt-2 text-sm text-slate-600">Tamu ini sebelumnya sudah ditandai terkirim. Anda dapat mengirim ulang.</p>}
                </div>
                <div>
                  <label htmlFor={`${id}-preview`} className="mb-2 block text-sm font-semibold">Pratinjau pesan lengkap</label>
                  <textarea id={`${id}-preview`} readOnly value={message} rows={13} className={`${fieldStyle} resize-y leading-relaxed`} />
                </div>
                {personalUrl && <p className="break-all text-sm leading-relaxed text-slate-600">Tautan personal: {personalUrl}</p>}
                {previewError && <p role="alert" className="text-sm font-medium text-rose-800">{previewError}</p>}
              </div>
            </div>

            {error && <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">{error}</p>}

            <div className="space-y-3 border-t border-slate-200 pt-5">
              <p className="text-sm leading-relaxed text-slate-600">
                Setelah pesan benar-benar Anda kirim, pilih “Tandai terkirim &amp; lanjut”. Pilih “Lewati” untuk melanjutkan tanpa mengubah status tamu ini.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  ref={openLinkRef}
                  href={!saving && !previewError ? whatsAppUrl || undefined : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={saving || !!previewError}
                  tabIndex={saving || !!previewError ? -1 : 0}
                  onClick={(event) => {
                    if (inFlightId.current || !whatsAppUrl || previewError || handledIds.current.has(currentGuest.id)) { event.preventDefault(); return; }
                    setOpenedGuestId(currentGuest.id);
                    setError(null);
                  }}
                  className={`inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${focusStyle}`}
                >Buka WhatsApp</a>
                <button
                  type="button"
                  disabled={saving || openedGuestId !== currentGuest.id || !!previewError}
                  onClick={confirmSent}
                  className={`min-h-11 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 ${focusStyle}`}
                >{saving ? "Menyimpan status…" : "Tandai terkirim & lanjut"}</button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => { if (!inFlightId.current) advance(currentGuest.id, "skipped"); }}
                  className={secondaryButton}
                >Lewati</button>
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
