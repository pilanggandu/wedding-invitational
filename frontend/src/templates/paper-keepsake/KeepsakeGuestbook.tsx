"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { useWeddingData } from "@/context/WeddingDataContext";
import { submitRsvpApi } from "@/lib/api";
import { getWishes, submitWish } from "@/lib/invitationStore";
import { triggerKeepsakeCelebration } from "./keepsakeCelebration";
import type { WishMessage } from "@/types/wedding";
import type { TemplateProps } from "../types";

type GuestbookProps = Pick<
  TemplateProps,
  "guestName" | "guestItem" | "isPreview" | "isEditor"
>;
type WishPayload = Parameters<typeof submitWish>[0];
type Feedback = {
  tone: "success" | "error" | "notice";
  message: string;
} | null;

const EMPTY_WISHES: WishMessage[] = [];
let cachedWishes = EMPTY_WISHES;
let cachedWishesJson: string | undefined;

function readWishesSnapshot(): WishMessage[] {
  const wishes = getWishes();
  const serialized = JSON.stringify(wishes);
  if (serialized !== cachedWishesJson) {
    cachedWishes = wishes;
    cachedWishesJson = serialized;
  }
  return cachedWishes;
}

function subscribeWishes(onChange: () => void) {
  window.addEventListener("wedding-wishes-changed", onChange);
  return () => window.removeEventListener("wedding-wishes-changed", onChange);
}

function subscribePreview() {
  return () => {};
}

function sendWish(payload: WishPayload, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      resolve(false);
      return;
    }
    const previousIds = new Set(getWishes().map((wish) => wish.id));
    let localWish: WishMessage | undefined;

    const cleanup = () => {
      window.clearTimeout(timeout);
      window.removeEventListener("wedding-wishes-changed", checkConfirmation);
      signal.removeEventListener("abort", abort);
    };
    const finish = (confirmed: boolean) => {
      cleanup();
      resolve(confirmed);
    };
    const abort = () => finish(false);
    const checkConfirmation = () => {
      if (!localWish) return;
      const pending = localWish;
      const confirmed = getWishes().some(
        (wish) =>
          wish.name === pending.name &&
          wish.message === pending.message &&
          wish.attendance === pending.attendance &&
          (!previousIds.has(wish.id) || wish.id === pending.id) &&
          (wish.id !== pending.id ||
            wish.date !== pending.date ||
            wish.createdAt !== pending.createdAt),
      );
      if (confirmed) finish(true);
    };

    const timeout = window.setTimeout(() => finish(false), 5500);
    window.addEventListener("wedding-wishes-changed", checkConfirmation);
    signal.addEventListener("abort", abort, { once: true });

    try {
      localWish = submitWish(payload);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}

export function KeepsakeGuestbook({
  guestName,
  guestItem,
  isPreview = false,
  isEditor = false,
}: GuestbookProps) {
  const data = useWeddingData();
  const formId = useId();
  const previewMode = isPreview || isEditor;
  const [editedName, setEditedName] = useState<string | null>(null);
  const name = editedName ?? (guestItem?.name || guestName || "");
  const [attendance, setAttendance] = useState<"" | "attending" | "absent">("");
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [message, setMessage] = useState("");
  const wishes = useSyncExternalStore(
    previewMode ? subscribePreview : subscribeWishes,
    previewMode ? () => data.initialWishes || EMPTY_WISHES : readWishesSnapshot,
    () => data.initialWishes || EMPTY_WISHES,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const submittingRef = useRef(false);
  const pendingWish = useRef<AbortController | null>(null);
  const maxQuota =
    guestItem && Number.isFinite(guestItem.quota)
      ? Math.max(1, Math.floor(guestItem.quota))
      : 2;

  useEffect(() => () => pendingWish.current?.abort(), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    setFeedback(null);

    if (!name.trim() || !attendance) {
      setFeedback({
        tone: "error",
        message: "Isi nama dan pilih kehadiran terlebih dahulu.",
      });
      return;
    }
    if (
      attendance === "attending" &&
      (!Number.isInteger(attendeeCount) ||
        attendeeCount < 1 ||
        attendeeCount > maxQuota)
    ) {
      setFeedback({
        tone: "error",
        message: `Jumlah tamu harus antara 1 dan ${maxQuota} orang.`,
      });
      return;
    }
    if (previewMode) {
      setFeedback({
        tone: "notice",
        message:
          "Ini pratinjau. Konfirmasi dan ucapan tidak dikirim atau disimpan.",
      });
      return;
    }
    if (!guestItem?.id && !message.trim()) {
      setFeedback({
        tone: "error",
        message:
          "Gunakan tautan undangan pribadi untuk mencatat kehadiran, atau tulis ucapan untuk dikirim.",
      });
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    const controller = new AbortController();
    pendingWish.current = controller;
    let rsvpSaved = false;

    try {
      if (guestItem?.id) {
        const result = await submitRsvpApi({
          guestId: guestItem.id,
          status: attendance === "attending" ? 1 : 2,
          attendeeCount: attendance === "attending" ? attendeeCount : 0,
          message: message.trim(),
        });
        if (controller.signal.aborted) return;
        if (!result.success)
          throw new Error(
            result.error || "Konfirmasi belum tersimpan. Silakan coba lagi.",
          );
        rsvpSaved = true;
      }

      if (message.trim()) {
        setFeedback({
          tone: "notice",
          message: rsvpSaved
            ? "Kehadiran tersimpan. Ucapan sedang dikirim…"
            : "Ucapan sedang dikirim…",
        });
        const wishConfirmed = await sendWish(
          {
            name: name.trim(),
            relationship: "Tamu Undangan",
            attendance:
              attendance === "attending" ? "Hadir" : "Berhalangan Hadir",
            message: message.trim(),
            guestId: guestItem?.id,
          },
          controller.signal,
        );

        if (controller.signal.aborted) return;
        if (wishConfirmed) {
          setFeedback({
            tone: "success",
            message: rsvpSaved
              ? "Terima kasih. Kehadiran dan ucapan Anda sudah tersimpan."
              : "Terima kasih. Ucapan Anda sudah tersimpan. Kehadiran belum tercatat tanpa tautan undangan pribadi.",
          });
          setMessage("");
          triggerKeepsakeCelebration();
        } else {
          setFeedback({
            tone: "notice",
            message: `${rsvpSaved ? "Kehadiran tersimpan. " : ""}Penyimpanan ucapan ke server belum terkonfirmasi. Periksa koneksi sebelum mencoba lagi.`,
          });
        }
      } else {
        setFeedback({
          tone: "success",
          message: "Terima kasih. Konfirmasi kehadiran Anda sudah tersimpan.",
        });
        triggerKeepsakeCelebration();
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setFeedback({
        tone: "error",
        message: rsvpSaved
          ? "Kehadiran sudah tersimpan, tetapi ucapan belum berhasil dikirim. Silakan coba lagi."
          : error instanceof Error
            ? error.message
            : "Belum berhasil dikirim. Periksa koneksi lalu coba lagi.",
      });
    } finally {
      pendingWish.current = null;
      submittingRef.current = false;
      if (!controller.signal.aborted) setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      data-editor-section="rsvp"
      className="pk-section pk-rsvp"
      aria-labelledby={`${formId}-heading`}
    >
      <header className="pk-section-heading">
        <img
          src="/images/paper-keepsake/mini-envelope.svg"
          alt=""
          aria-hidden="true"
          className="pk-envelope-art"
          width="100"
          height="76"
          loading="lazy"
        />
        <h2 id={`${formId}-heading`}>Sepucuk kabar darimu</h2>
        <p>Konfirmasikan kehadiran dan titipkan doa untuk hari bahagia kami.</p>
      </header>

      <div className="pk-guestbook-layout">
        <form
          onSubmit={handleSubmit}
          className="pk-paper-slip pk-rsvp-form"
          aria-busy={isSubmitting}
        >
          <div className="pk-form-field">
            <label htmlFor={`${formId}-name`}>Nama</label>
            <input
              id={`${formId}-name`}
              name="name"
              autoComplete="name"
              required
              maxLength={150}
              value={name}
              onChange={(event) => setEditedName(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="pk-form-field">
            <label htmlFor={`${formId}-attendance`}>Kehadiran</label>
            <select
              id={`${formId}-attendance`}
              name="attendance"
              required
              value={attendance}
              onChange={(event) =>
                setAttendance(event.target.value as typeof attendance)
              }
              disabled={isSubmitting}
            >
              <option value="">Pilih kehadiran</option>
              <option value="attending">Saya akan hadir</option>
              <option value="absent">Maaf, belum bisa hadir</option>
            </select>
          </div>

          <div className="pk-form-field">
            <label htmlFor={`${formId}-count`}>Jumlah tamu</label>
            <input
              id={`${formId}-count`}
              name="attendeeCount"
              type="number"
              inputMode="numeric"
              min={1}
              max={maxQuota}
              step={1}
              required={attendance === "attending"}
              disabled={attendance !== "attending" || isSubmitting}
              value={
                attendance === "absent"
                  ? 0
                  : Number.isFinite(attendeeCount)
                    ? attendeeCount
                    : ""
              }
              onChange={(event) => setAttendeeCount(event.target.valueAsNumber)}
              aria-describedby={`${formId}-quota`}
            />
            <p id={`${formId}-quota`} className="pk-form-note">
              {guestItem
                ? `Termasuk Anda, maksimal ${maxQuota} orang sesuai undangan.`
                : "Pencatatan kehadiran memerlukan tautan undangan pribadi."}
            </p>
          </div>

          <div className="pk-form-field">
            <label htmlFor={`${formId}-message`}>
              Ucapan &amp; doa <span className="pk-form-note">(opsional)</span>
            </label>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={4}
              maxLength={2000}
              placeholder="Tulis pesan untuk kedua mempelai…"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {previewMode && (
            <p className="pk-form-note">
              Mode pratinjau: formulir dapat dicoba tanpa mengirim data.
            </p>
          )}
          <button type="submit" className="pk-button" disabled={isSubmitting}>
            {isSubmitting
              ? "Sedang mengirim…"
              : guestItem
                ? "Kirim kabar & doa"
                : "Kirim ucapan"}
          </button>
          <div aria-live="polite" aria-atomic="true">
            {feedback && (
              <p
                className="pk-feedback"
                data-tone={feedback.tone}
                role={feedback.tone === "error" ? "alert" : "status"}
              >
                {feedback.message}
              </p>
            )}
          </div>
        </form>

        <div className="pk-wishes" aria-labelledby={`${formId}-wishes`}>
          <h3 id={`${formId}-wishes`}>Catatan penuh kasih</h3>
          {wishes.length > 0 ? (
            <ul className="pk-wish-list">
              {wishes.slice(0, 20).map((wish) => (
                <li key={wish.id} className="pk-paper-slip pk-wish">
                  <div className="pk-wish-heading">
                    <h4>{wish.name}</h4>
                    <span className="pk-wish-meta">{wish.date}</span>
                  </div>
                  <p className="pk-wish-message">{wish.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pk-empty">
              Belum ada catatan. Doa Anda akan menjadi kenangan pertama di sini.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function KeepsakeGifts() {
  const data = useWeddingData();
  const headingId = useId();
  const accounts = (data.gifts?.accounts || []).filter((account) =>
    account.accountNumber.trim(),
  );
  const address = data.gifts?.physicalGiftAddress;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copyingKey, setCopyingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const copyingRef = useRef(false);

  const copyText = async (value: string, key: string, label: string) => {
    if (copyingRef.current) return;
    copyingRef.current = true;
    setCopyingKey(key);
    setCopiedKey(null);
    setFeedback(null);
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setFeedback({ tone: "success", message: `${label} sudah disalin.` });
    } catch {
      setFeedback({
        tone: "error",
        message: `Belum bisa menyalin ${label.toLowerCase()}. Pilih dan salin teks di atas secara manual.`,
      });
    } finally {
      copyingRef.current = false;
      setCopyingKey(null);
    }
  };

  return (
    <section
      id="gift"
      data-editor-section="gift"
      className="pk-section pk-gifts"
      aria-labelledby={headingId}
    >
      <header className="pk-section-heading">
        <img
          src="/images/paper-keepsake/paper-hearts.svg"
          alt=""
          aria-hidden="true"
          className="pk-envelope-art"
          width="100"
          height="76"
          loading="lazy"
        />
        <h2 id={headingId}>Tanda kasih</h2>
        <p>
          Kehadiran dan doa Anda berarti bagi kami. Jika ingin mengirim hadiah,
          berikut informasi yang dapat digunakan.
        </p>
      </header>
      <div className="pk-gift-list">
        {accounts.map((account, index) => {
          const key = `account-${index}`;
          return (
            <article
              className="pk-paper-slip pk-gift-card"
              key={`${account.bankName}-${account.accountNumber}-${index}`}
            >
              {index === 0 && (
                <img
                  src="/images/paper-keepsake/paperclip-washi-accent.png"
                  alt=""
                  aria-hidden="true"
                  className="pk-gift-clip-accent"
                  width="90"
                  height="80"
                  loading="lazy"
                />
              )}
              <h3 className="pk-bank-name">{account.bankName}</h3>
              <p className="pk-account-number">{account.accountNumber}</p>
              <p className="pk-account-holder">
                Atas nama {account.accountHolder}
              </p>
              <button
                type="button"
                className="pk-button pk-button-secondary"
                disabled={copyingKey !== null}
                onClick={() =>
                  copyText(
                    account.accountNumber,
                    key,
                    `Nomor rekening ${account.bankName}`,
                  )
                }
              >
                {copyingKey === key
                  ? "Menyalin…"
                  : copiedKey === key
                    ? "Nomor rekening tersalin"
                    : "Salin nomor rekening"}
              </button>
            </article>
          );
        })}
        {address?.address?.trim() && (
          <article className="pk-paper-slip pk-gift-card">
            <h3>Alamat pengiriman</h3>
            <address className="pk-gift-address">
              {address.recipient && <strong>{address.recipient}</strong>}
              <span>{address.address}</span>
              {address.phone && <span>{address.phone}</span>}
            </address>
            <button
              type="button"
              className="pk-button pk-button-secondary"
              disabled={copyingKey !== null}
              onClick={() =>
                copyText(
                  [address.recipient, address.address, address.phone]
                    .filter(Boolean)
                    .join("\n"),
                  "address",
                  "Alamat pengiriman",
                )
              }
            >
              {copyingKey === "address"
                ? "Menyalin…"
                : copiedKey === "address"
                  ? "Alamat tersalin"
                  : "Salin alamat pengiriman"}
            </button>
          </article>
        )}
        {!accounts.length && !address?.address?.trim() && (
          <p className="pk-empty">Informasi tanda kasih belum ditambahkan.</p>
        )}
      </div>
      <div aria-live="polite" aria-atomic="true">
        {feedback && (
          <p
            className="pk-feedback"
            data-tone={feedback.tone}
            role={feedback.tone === "error" ? "alert" : "status"}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </section>
  );
}
