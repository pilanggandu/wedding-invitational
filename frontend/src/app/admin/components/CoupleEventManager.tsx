"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Save,
  Loader2,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Heart,
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Palette,
  Sparkles,
  Camera,
  QrCode,
  KeyRound,
  Star,
  CheckCircle2,
  CalendarCheck,
  Clock,
  ArrowRightLeft,
} from "lucide-react";
import {
  WeddingInvitationData,
  BankAccount,
  EventDetail,
  getMainEvent,
  getEventCountdownTarget,
} from "@/types/wedding";
import { saveInvitationData } from "@/lib/invitationStore";
import { extractColorsFromImage, ExtractedColors, FALLBACK_PALETTE } from "@/lib/colorExtractor";
import { uploadImageFile } from "@/lib/imageUpload";

interface CoupleEventManagerProps {
  data: WeddingInvitationData;
  onUpdate: (updated: WeddingInvitationData) => void;
  onOpenA3Poster?: () => void;
}

export function CoupleEventManager({
  data,
  onUpdate,
  onOpenA3Poster,
}: CoupleEventManagerProps) {
  // Groom states
  const [groomName, setGroomName] = useState(data.couple?.groom?.name || "");
  const [groomFullName, setGroomFullName] = useState(data.couple?.groom?.fullName || "");
  const [groomParents, setGroomParents] = useState(data.couple?.groom?.parents || "");
  const [groomInstagram, setGroomInstagram] = useState(data.couple?.groom?.instagram || "");
  const [groomTagline, setGroomTagline] = useState(data.couple?.groom?.tagline || "");
  const [groomPhotoUrl, setGroomPhotoUrl] = useState(
    data.couple?.groom?.photoUrl || "/images/prewedding/couple-3.jpg"
  );

  // Bride states
  const [brideName, setBrideName] = useState(data.couple?.bride?.name || "");
  const [brideFullName, setBrideFullName] = useState(data.couple?.bride?.fullName || "");
  const [brideParents, setBrideParents] = useState(data.couple?.bride?.parents || "");
  const [brideInstagram, setBrideInstagram] = useState(data.couple?.bride?.instagram || "");
  const [brideTagline, setBrideTagline] = useState(data.couple?.bride?.tagline || "");
  const [bridePhotoUrl, setBridePhotoUrl] = useState(
    data.couple?.bride?.photoUrl || "/images/prewedding/couple-4.jpg"
  );

  // Photos & Album states
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(
    data.general?.coverPhotoUrl || "/images/prewedding/couple-1.jpg"
  );
  const [closingPhotoUrl, setClosingPhotoUrl] = useState(
    data.general?.closingPhotoUrl || data.general?.coverPhotoUrl || "/images/prewedding/couple-1.jpg"
  );
  const [preweddingPhotos, setPreweddingPhotos] = useState<string[]>(
    data.general?.preweddingPhotos && data.general.preweddingPhotos.length > 0
      ? data.general.preweddingPhotos
      : [
          "/images/prewedding/couple-1.jpg",
          "/images/prewedding/couple-2.jpg",
          "/images/prewedding/couple-3.jpg",
          "/images/prewedding/couple-4.jpg",
          "/images/prewedding/couple-5.jpg",
        ]
  );
  const [newPhotoInput, setNewPhotoInput] = useState("");
  const [extractedPreview, setExtractedPreview] = useState<ExtractedColors | null>(null);
  const [previewingPhotoSrc, setPreviewingPhotoSrc] = useState<string>(
    coverPhotoUrl || "/images/prewedding/couple-1.jpg"
  );

  // Extract color sample on photo change
  useEffect(() => {
    if (!previewingPhotoSrc) return;
    let isMounted = true;
    extractColorsFromImage(previewingPhotoSrc).then((colors) => {
      if (isMounted) setExtractedPreview(colors);
    });
    return () => {
      isMounted = false;
    };
  }, [previewingPhotoSrc]);

  // Sinkronisasi seluruh field form ketika data diperbarui dari server atau background sync
  useEffect(() => {
    if (!data) return;

    if (data.couple?.groom) {
      if (data.couple.groom.name !== undefined) setGroomName(data.couple.groom.name);
      if (data.couple.groom.fullName !== undefined) setGroomFullName(data.couple.groom.fullName);
      if (data.couple.groom.parents !== undefined) setGroomParents(data.couple.groom.parents);
      if (data.couple.groom.instagram !== undefined) setGroomInstagram(data.couple.groom.instagram);
      if (data.couple.groom.tagline !== undefined) setGroomTagline(data.couple.groom.tagline);
      if (data.couple.groom.photoUrl) setGroomPhotoUrl(data.couple.groom.photoUrl);
    }

    if (data.couple?.bride) {
      if (data.couple.bride.name !== undefined) setBrideName(data.couple.bride.name);
      if (data.couple.bride.fullName !== undefined) setBrideFullName(data.couple.bride.fullName);
      if (data.couple.bride.parents !== undefined) setBrideParents(data.couple.bride.parents);
      if (data.couple.bride.instagram !== undefined) setBrideInstagram(data.couple.bride.instagram);
      if (data.couple.bride.tagline !== undefined) setBrideTagline(data.couple.bride.tagline);
      if (data.couple.bride.photoUrl) setBridePhotoUrl(data.couple.bride.photoUrl);
    }

    if (data.general) {
      if (data.general.coverPhotoUrl) {
        setCoverPhotoUrl(data.general.coverPhotoUrl);
        setPreviewingPhotoSrc((prev) => (prev.startsWith("blob:") ? prev : data.general.coverPhotoUrl!));
      }
      if (data.general.closingPhotoUrl) {
        setClosingPhotoUrl(data.general.closingPhotoUrl);
      }
      if (Array.isArray(data.general.preweddingPhotos) && data.general.preweddingPhotos.length > 0) {
        setPreweddingPhotos(data.general.preweddingPhotos);
      }
      if (data.general.funTagline !== undefined) setFunTagline(data.general.funTagline);
      if (data.general.hashtag !== undefined) setHashtag(data.general.hashtag);
      if (data.general.closingMessage !== undefined) setClosingMessage(data.general.closingMessage);
      if (data.general.photoboxPasscode !== undefined) setPhotoboxPasscode(data.general.photoboxPasscode);
    }

    if (Array.isArray(data.events) && data.events.length > 0) {
      setEventsList(
        data.events.map((evt, idx) => ({
          ...evt,
          isMain: data.mainEventId ? evt.id === data.mainEventId : (evt.isMain ?? (idx === 0)),
          hostSide: evt.hostSide || (idx === 0 ? "wanita" : (idx === 1 ? "bersama" : "pria")),
          eventType: evt.eventType || (idx === 0 ? "akad" : "resepsi"),
        }))
      );
      const foundMain = data.mainEventId
        ? data.events.find((e) => e.id === data.mainEventId)
        : data.events.find((e) => e.isMain) || data.events[0];
      if (foundMain) {
        setSelectedMainEventId(foundMain.id);
      }
    }

    if (data.gifts?.accounts && data.gifts.accounts.length > 0) {
      setAccounts(data.gifts.accounts);
    }
    if (data.gifts?.physicalGiftAddress) {
      if (data.gifts.physicalGiftAddress.recipient !== undefined) {
        setPhysicalRecipient(data.gifts.physicalGiftAddress.recipient);
      }
      if (data.gifts.physicalGiftAddress.phone !== undefined) {
        setPhysicalPhone(data.gifts.physicalGiftAddress.phone);
      }
      if (data.gifts.physicalGiftAddress.address !== undefined) {
        setPhysicalAddress(data.gifts.physicalGiftAddress.address);
      }
    }
  }, [data]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tampilkan preview lokal instan
    const tempUrl = URL.createObjectURL(file);
    setter(tempUrl);
    setPreviewingPhotoSrc(tempUrl);

    try {
      const permanentUrl = await uploadImageFile(file);
      if (permanentUrl) {
        setter(permanentUrl);
        setPreviewingPhotoSrc(permanentUrl);
      }
    } catch (err) {
      console.warn("Gagal mengunggah foto ke server:", err);
    }
  };

  const handleAddPreweddingPhoto = () => {
    if (!newPhotoInput.trim()) return;
    setPreweddingPhotos((prev) => [...prev, newPhotoInput.trim()]);
    setPreviewingPhotoSrc(newPhotoInput.trim());
    setNewPhotoInput("");
  };

  const handleRemovePreweddingPhoto = (idxToRemove: number) => {
    setPreweddingPhotos((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Events (Dynamic & Switchable Main/Highlight Event)
  const [eventsList, setEventsList] = useState<EventDetail[]>(() => {
    if (Array.isArray(data.events) && data.events.length > 0) {
      return data.events.map((evt, idx) => ({
        ...evt,
        isMain: data.mainEventId ? evt.id === data.mainEventId : (evt.isMain ?? (idx === 0)),
        hostSide: evt.hostSide || (idx === 0 ? "wanita" : (idx === 1 ? "bersama" : "pria")),
        eventType: evt.eventType || (idx === 0 ? "akad" : "resepsi"),
      }));
    }
    return [
      {
        id: "event_akad",
        title: "Akad Nikah",
        subTitle: "Momen Sakral Ijab Kabul",
        badgeCute: "Momen Paling Sakral",
        colorTheme: "red",
        dateStr: "2026-11-28",
        displayDate: "28 November 2026",
        displayDay: "Sabtu",
        time: "08:00 - 10:00 WIB",
        venueName: "Kediaman Mempelai Wanita",
        venueAddress: "Merakurak, Tuban, Jawa Timur",
        mapUrl: "https://maps.google.com",
        isMain: true,
        hostSide: "wanita",
        eventType: "akad",
        calendarEvent: {
          title: "Akad Nikah",
          description: "Momen Sakral Ijab Kabul",
          location: "Merakurak, Tuban, Jawa Timur",
          startDate: "20261128T010000Z",
          endDate: "20261128T030000Z",
        },
      },
      {
        id: "event_resepsi",
        title: "Resepsi Pernikahan",
        subTitle: "Pesta Syukuran & Temu Kangen",
        badgeCute: "Pesta Bahagia & Temu Syukuran",
        colorTheme: "yellow",
        dateStr: "2026-11-28",
        displayDate: "28 November 2026",
        displayDay: "Sabtu",
        time: "11:00 - Selesai",
        venueName: "Gedung Serbaguna Merakurak",
        venueAddress: "Jl. Raya Merakurak, Tuban, Jawa Timur",
        mapUrl: "https://maps.google.com",
        isMain: false,
        hostSide: "bersama",
        eventType: "resepsi",
        calendarEvent: {
          title: "Resepsi Pernikahan",
          description: "Pesta Syukuran",
          location: "Jl. Raya Merakurak, Tuban, Jawa Timur",
          startDate: "20261128T040000Z",
          endDate: "20261128T090000Z",
        },
      },
    ];
  });

  const [selectedMainEventId, setSelectedMainEventId] = useState<string>(() => {
    if (data.mainEventId) return data.mainEventId;
    const main = data.events?.find((e) => e.isMain);
    return main?.id || data.events?.[0]?.id || "event_akad";
  });

  const [autoSyncCountdown, setAutoSyncCountdown] = useState<boolean>(true);

  const handleSelectMainEvent = (eventId: string) => {
    setSelectedMainEventId(eventId);
    setEventsList((prev) =>
      prev.map((e) => ({
        ...e,
        isMain: e.id === eventId,
      }))
    );
  };

  const handleUpdateEventField = (index: number, field: keyof EventDetail, value: any) => {
    setEventsList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddEvent = (preset?: "resepsi_pria" | "resepsi_wanita" | "custom") => {
    const newId = `event_${Date.now()}`;
    let newEvt: EventDetail;

    if (preset === "resepsi_pria") {
      newEvt = {
        id: newId,
        title: "Resepsi Mempelai Pria (Ngunduh Mantu)",
        subTitle: "Tasyakuran & Ramah Tamah Pihak Pria",
        badgeCute: "Ngunduh Mantu Bahagia 🏛️",
        colorTheme: "blue",
        dateStr: "2026-11-28",
        displayDate: "28 November 2026",
        displayDay: "Sabtu",
        time: "10:00 - 14:00 WIB",
        venueName: "Kediaman Mempelai Pria",
        venueAddress: "Tuban, Jawa Timur",
        mapUrl: "https://maps.google.com",
        isMain: false,
        hostSide: "pria",
        eventType: "resepsi_pria",
        calendarEvent: {
          title: `Resepsi Mempelai Pria ${groomName || "Gilang"} & ${brideName || "Salsa"}`,
          description: "Tasyakuran Pernikahan",
          location: "Kediaman Mempelai Pria",
          startDate: "20261128T030000Z",
          endDate: "20261128T070000Z",
        },
      };
    } else if (preset === "resepsi_wanita") {
      newEvt = {
        id: newId,
        title: "Resepsi Mempelai Wanita",
        subTitle: "Pesta Syukuran Mempelai Wanita",
        badgeCute: "Pesta Bahagia Wanita 🌸",
        colorTheme: "yellow",
        dateStr: "2026-11-28",
        displayDate: "28 November 2026",
        displayDay: "Sabtu",
        time: "11:00 - 15:00 WIB",
        venueName: "Kediaman Mempelai Wanita",
        venueAddress: "Merakurak, Tuban",
        mapUrl: "https://maps.google.com",
        isMain: false,
        hostSide: "wanita",
        eventType: "resepsi_wanita",
        calendarEvent: {
          title: `Resepsi Mempelai Wanita ${groomName || "Gilang"} & ${brideName || "Salsa"}`,
          description: "Pesta Syukuran",
          location: "Kediaman Mempelai Wanita",
          startDate: "20261128T040000Z",
          endDate: "20261128T080000Z",
        },
      };
    } else {
      newEvt = {
        id: newId,
        title: `Acara Tambahan 0${eventsList.length + 1}`,
        subTitle: "Rangkaian Perayaan Pernikahan",
        badgeCute: "Momen Istimewa ✨",
        colorTheme: "green",
        dateStr: "2026-11-28",
        displayDate: "28 November 2026",
        displayDay: "Sabtu",
        time: "10:00 - Selesai",
        venueName: "Lokasi Acara",
        venueAddress: "Alamat Lengkap",
        mapUrl: "https://maps.google.com",
        isMain: false,
        hostSide: "bersama",
        eventType: "custom",
        calendarEvent: {
          title: `Acara Pernikahan ${groomName || "Gilang"} & ${brideName || "Salsa"}`,
          description: "Rangkaian Acara",
          location: "Lokasi Acara",
          startDate: "20261128T030000Z",
          endDate: "20261128T060000Z",
        },
      };
    }

    setEventsList((prev) => [...prev, newEvt]);
  };

  const handleRemoveEvent = (idxToRemove: number) => {
    if (eventsList.length <= 1) return;
    const removedId = eventsList[idxToRemove]?.id;
    const next = eventsList.filter((_, idx) => idx !== idxToRemove);
    setEventsList(next);
    if (selectedMainEventId === removedId) {
      const newMain = next[0];
      setSelectedMainEventId(newMain.id);
      next[0].isMain = true;
    }
  };

  // General details
  const [funTagline, setFunTagline] = useState(
    data.general?.funTagline || "Menemukan cinta itu mudah, tapi menemukan yang sefrekuensi itu anugerah!"
  );
  const [hashtag, setHashtag] = useState(data.general?.hashtag || "");
  const [closingMessage, setClosingMessage] = useState(
    data.general?.closingMessage ||
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami."
  );
  const [photoboxPasscode, setPhotoboxPasscode] = useState(
    data.general?.photoboxPasscode || "2111"
  );

  // Bank accounts (Dynamic)
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    if (data.gifts?.accounts && data.gifts.accounts.length > 0) {
      return data.gifts.accounts;
    }
    return [
      {
        bankName: "BCA",
        accountNumber: "",
        accountHolder: data.couple?.groom?.fullName || data.couple?.groom?.name || "Gilang Pandu Permadi",
        logoText: "BCA",
        cuteLabel: `Rekening 01 (${data.couple?.groom?.name || "Gilang"})`,
        cardColor: "maroon",
      },
      {
        bankName: "Bank Mandiri",
        accountNumber: "",
        accountHolder: data.couple?.bride?.fullName || data.couple?.bride?.name || "Salsadila Nanda Octavia",
        logoText: "Mandiri",
        cuteLabel: `Rekening 02 (${data.couple?.bride?.name || "Salsadila"})`,
        cardColor: "gold",
      },
    ];
  });

  const handleAddAccount = () => {
    const nextIdx = accounts.length + 1;
    const padIdx = String(nextIdx).padStart(2, "0");
    const newAcc: BankAccount = {
      bankName: "BCA",
      accountNumber: "",
      accountHolder: "",
      logoText: "BCA",
      cuteLabel: `Rekening ${padIdx}`,
      cardColor: nextIdx % 2 === 0 ? "gold" : "maroon",
    };
    setAccounts((prev) => [...prev, newAcc]);
  };

  const handleRemoveAccount = (index: number) => {
    setAccounts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAccountChange = (index: number, field: keyof BankAccount, value: string) => {
    setAccounts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        ...(field === "bankName" ? { logoText: value } : {}),
      };
      return updated;
    });
  };

  const [physicalRecipient, setPhysicalRecipient] = useState(
    data.gifts?.physicalGiftAddress?.recipient || ""
  );
  const [physicalPhone, setPhysicalPhone] = useState(
    data.gifts?.physicalGiftAddress?.phone || ""
  );
  const [physicalAddress, setPhysicalAddress] = useState(
    data.gifts?.physicalGiftAddress?.address || ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setSaveError(null);

    // Validasi eksplisit sebelum submit
    if (!groomName.trim()) {
      const msg = "Nama panggilan mempelai pria wajib diisi.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 4000);
      return;
    }
    if (!groomFullName.trim()) {
      const msg = "Nama lengkap mempelai pria wajib diisi.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 4000);
      return;
    }
    if (!brideName.trim()) {
      const msg = "Nama panggilan mempelai wanita wajib diisi.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 4000);
      return;
    }
    if (!brideFullName.trim()) {
      const msg = "Nama lengkap mempelai wanita wajib diisi.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 4000);
      return;
    }

    setIsSaving(true);

    const preparedEvents = eventsList.map((evt) => {
      const isThisMain = evt.id === selectedMainEventId;
      return {
        ...evt,
        isMain: isThisMain,
        title: (evt.title || "").trim() || "Acara Pernikahan",
        subTitle: (evt.subTitle || "").trim(),
        badgeCute: (evt.badgeCute || "").trim() || (isThisMain ? "Acara Utama" : "Rangkaian Bahagia"),
        colorTheme: evt.colorTheme || "red",
        dateStr: (evt.dateStr || "").trim() || "2026-11-28",
        displayDate: (evt.displayDate || "").trim() || "28 November 2026",
        displayDay: (evt.displayDay || "").trim() || "Sabtu",
        time: (evt.time || "").trim() || "08:00 WIB",
        venueName: (evt.venueName || "").trim() || "Kediaman Mempelai",
        venueAddress: (evt.venueAddress || "").trim() || "Tuban, Jawa Timur",
        mapUrl: (evt.mapUrl || "").trim() || "https://maps.google.com",
        calendarEvent: {
          title: evt.calendarEvent?.title || `${evt.title || "Acara"} ${groomName.trim()} & ${brideName.trim()}`,
          description: evt.calendarEvent?.description || `${evt.title || "Acara"} ${groomFullName.trim()} & ${brideFullName.trim()}`,
          location: evt.venueAddress?.trim() || "",
          startDate: evt.calendarEvent?.startDate || "20261128T010000Z",
          endDate: evt.calendarEvent?.endDate || "20261128T030000Z",
        },
      };
    });

    const chosenMain = preparedEvents.find((e) => e.id === selectedMainEventId) || preparedEvents[0];
    const newCountdownTarget = autoSyncCountdown
      ? getEventCountdownTarget(chosenMain)
      : (data.countdownTarget || getEventCountdownTarget(chosenMain));

    try {
      const updated: WeddingInvitationData = {
        ...data,
        couple: {
          ...data.couple,
          groom: {
            ...data.couple.groom,
            name: groomName.trim(),
            fullName: groomFullName.trim(),
            parents: groomParents.trim(),
            instagram: groomInstagram.trim().replace(/^@/, ""),
            tagline: groomTagline.trim(),
            photoUrl: groomPhotoUrl.trim(),
          },
          bride: {
            ...data.couple.bride,
            name: brideName.trim(),
            fullName: brideFullName.trim(),
            parents: brideParents.trim(),
            instagram: brideInstagram.trim().replace(/^@/, ""),
            tagline: brideTagline.trim(),
            photoUrl: bridePhotoUrl.trim(),
          },
        },
        general: {
          ...data.general,
          funTagline: funTagline.trim(),
          hashtag: hashtag.trim(),
          closingMessage: closingMessage.trim(),
          photoboxPasscode: photoboxPasscode.trim() || "2111",
          coverPhotoUrl: coverPhotoUrl.trim(),
          heroPhotoUrl: coverPhotoUrl.trim(),
          closingPhotoUrl: closingPhotoUrl.trim(),
          preweddingPhotos: preweddingPhotos,
        },
        mainEventId: chosenMain.id,
        countdownTarget: newCountdownTarget,
        events: preparedEvents,
        gifts: {
          accounts: accounts
            .filter((acc) => acc.bankName.trim() || acc.accountNumber.trim())
            .map((acc, idx) => ({
              bankName: acc.bankName.trim() || "BCA",
              accountNumber: acc.accountNumber.trim(),
              accountHolder: acc.accountHolder.trim(),
              logoText: acc.logoText?.trim() || acc.bankName.trim() || "BANK",
              cuteLabel: acc.cuteLabel?.trim() || `Rekening 0${idx + 1}`,
              cardColor: acc.cardColor || (idx % 2 === 0 ? "maroon" : "gold"),
            })),
          physicalGiftAddress: {
            recipient: physicalRecipient.trim() || `${groomName.trim()} & ${brideName.trim()}`,
            phone: physicalPhone.trim(),
            address: physicalAddress.trim(),
          },
        },
      };

      const serverSaved = await saveInvitationData(updated);
      try {
        localStorage.setItem("wedding_photobox_pin", photoboxPasscode.trim() || "2111");
      } catch {}
      onUpdate(updated);

      setIsSaved(true);
      setToastNotification({
        text: serverSaved
          ? "Seluruh data mempelai & acara berhasil disimpan ke server!"
          : "Data tersimpan di penyimpanan lokal browser.",
        type: "success",
      });

      setTimeout(() => setIsSaved(false), 3500);
      setTimeout(() => setToastNotification(null), 4000);
    } catch (err: any) {
      console.error("Error saving wedding data:", err);
      const msg = err?.message || "Gagal menyimpan data ke server. Periksa koneksi Anda.";
      setSaveError(msg);
      setToastNotification({ text: msg, type: "error" });
      setTimeout(() => setToastNotification(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 animate-in fade-in duration-300"
    >
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] static sm:sticky sm:top-16 z-20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-600 font-semibold">
              DATA PERSONALISASI INTI
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#14161C] tracking-tight">
            Data Mempelai, Acara &amp; Rekening
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Perbarui data lengkap kedua mempelai, susunan jadwal acara, rekening amplop, dan pesan penutup.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          {saveError && (
            <span className="text-xs font-medium text-[#B91C1C] bg-[#FEF2F2] px-3.5 py-1.5 rounded-xl border border-[#FCA5A5] flex items-center gap-1.5 animate-in fade-in">
              {saveError}
            </span>
          )}
          {isSaved && (
            <span className="text-xs font-medium text-[#24623E] bg-[#F3F8F5] px-3.5 py-1.5 rounded-xl border border-[#D4EADB] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-[#2E7A4A]" />
              Tersimpan Sukses!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#14161C] hover:bg-[#232734] disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 text-[#DFD2BD] animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4 text-[#2E7A4A]" />
                <span className="text-[#DFD2BD]">Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#DFD2BD]" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Groom & Bride Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mempelai Pria */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F0F0EA]">
            <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
              <User className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
                Profil Mempelai Pria (Groom)
              </h3>
              <p className="text-[11px] text-[#717686]">
                Identitas dan keluarga mempelai pria
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Dimas"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Lengkap &amp; Gelar
              </label>
              <input
                type="text"
                value={groomFullName}
                onChange={(e) => setGroomFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Dimas Pratama, S.Kom."
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Orang Tua / Keluarga
              </label>
              <input
                type="text"
                value={groomParents}
                onChange={(e) => setGroomParents(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Putra pertama dari Bpk. Bambang &amp; Ibu Sri"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Instagram (@username)
                </label>
                <input
                  type="text"
                  value={groomInstagram}
                  onChange={(e) => setGroomInstagram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                  placeholder="dimaspratama"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Gelar / Julukan Santai
                </label>
                <input
                  type="text"
                  value={groomTagline}
                  onChange={(e) => setGroomTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                  placeholder="Calon Suami Idaman"
                />
              </div>
            </div>

            {/* Foto Mempelai Pria */}
            <div className="pt-3 border-t border-[#F0F0EA] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#717686] font-medium">
                  Foto Mempelai Pria
                </label>
                <span className="text-[10px] text-[#888D9C]">URL Gambar / Unggah File</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={groomPhotoUrl}
                  onChange={(e) => {
                    setGroomPhotoUrl(e.target.value);
                    setPreviewingPhotoSrc(e.target.value);
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] placeholder:text-[#A0A4B0] focus:outline-none focus:border-[#14161C]"
                  placeholder="https://... atau path gambar"
                />
                <label className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-[#F7F7F4] hover:bg-[#EFEFEA] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#717686]" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setGroomPhotoUrl)}
                  />
                </label>
              </div>

              {/* Thumbnail & Quick Presets */}
              <div className="flex items-center gap-2.5 pt-1">
                {groomPhotoUrl && (
                  <div className="w-11 h-14 rounded-lg overflow-hidden border border-[#DCDCD5] bg-zinc-100 shrink-0 shadow-2xs">
                    <img
                      src={groomPhotoUrl}
                      alt="Groom Preview"
                      onError={(e) => {
                        e.currentTarget.src = "/images/prewedding/couple-3.jpg";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {[
                    { label: "Foto 1 (Couple 3)", src: "/images/prewedding/couple-3.jpg" },
                    { label: "Foto 2 (Couple 1)", src: "/images/prewedding/couple-1.jpg" },
                    { label: "Kucing Groom", src: "/images/cats/orange-cat-groom.jpg" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setGroomPhotoUrl(preset.src);
                        setPreviewingPhotoSrc(preset.src);
                      }}
                      className="px-2 py-0.5 rounded-md bg-[#F4F4EE] hover:bg-[#E8E8DE] text-[#5C6070] border border-[#E0E0D6] cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mempelai Wanita */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F0F0EA]">
            <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
              <Heart className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
                Profil Mempelai Wanita (Bride)
              </h3>
              <p className="text-[11px] text-[#717686]">
                Identitas dan keluarga mempelai wanita
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Anisa"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Lengkap &amp; Gelar
              </label>
              <input
                type="text"
                value={brideFullName}
                onChange={(e) => setBrideFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Anisa Rahmawati, S.M."
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                Nama Orang Tua / Keluarga
              </label>
              <input
                type="text"
                value={brideParents}
                onChange={(e) => setBrideParents(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: Putri kedua dari Bpk. Suryo &amp; Ibu Endang"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Instagram (@username)
                </label>
                <input
                  type="text"
                  value={brideInstagram}
                  onChange={(e) => setBrideInstagram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                  placeholder="anisarahma"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                  Gelar / Julukan Santai
                </label>
                <input
                  type="text"
                  value={brideTagline}
                  onChange={(e) => setBrideTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                  placeholder="Tuan Putri Cantik"
                />
              </div>
            </div>

            {/* Foto Mempelai Wanita */}
            <div className="pt-3 border-t border-[#F0F0EA] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#717686] font-medium">
                  Foto Mempelai Wanita
                </label>
                <span className="text-[10px] text-[#888D9C]">URL Gambar / Unggah File</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bridePhotoUrl}
                  onChange={(e) => {
                    setBridePhotoUrl(e.target.value);
                    setPreviewingPhotoSrc(e.target.value);
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] placeholder:text-[#A0A4B0] focus:outline-none focus:border-[#14161C]"
                  placeholder="https://... atau path gambar"
                />
                <label className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-[#F7F7F4] hover:bg-[#EFEFEA] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#717686]" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setBridePhotoUrl)}
                  />
                </label>
              </div>

              {/* Thumbnail & Quick Presets */}
              <div className="flex items-center gap-2.5 pt-1">
                {bridePhotoUrl && (
                  <div className="w-11 h-14 rounded-lg overflow-hidden border border-[#DCDCD5] bg-zinc-100 shrink-0 shadow-2xs">
                    <img
                      src={bridePhotoUrl}
                      alt="Bride Preview"
                      onError={(e) => {
                        e.currentTarget.src = "/images/prewedding/couple-4.jpg";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {[
                    { label: "Foto 1 (Couple 4)", src: "/images/prewedding/couple-4.jpg" },
                    { label: "Foto 2 (Couple 2)", src: "/images/prewedding/couple-2.jpg" },
                    { label: "Kucing Bride", src: "/images/cats/white-cat-bride.jpg" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBridePhotoUrl(preset.src);
                        setPreviewingPhotoSrc(preset.src);
                      }}
                      className="px-2 py-0.5 rounded-md bg-[#F4F4EE] hover:bg-[#E8E8DE] text-[#5C6070] border border-[#E0E0D6] cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Foto Sampul & Album Prewedding (Adaptif Latar Belakang & Semua Template) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0F0EA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
              <ImageIcon className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
                Foto Sampul &amp; Album Prewedding
              </h3>
              <p className="text-[11px] text-[#717686]">
                Kelola foto sampul, koleksi album, dan uji ekstraksi warna atmosfer otomatis
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E5E0D5] text-[11px] font-mono text-[#8C6218]">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>Ekstraksi Warna Otomatis Aktif</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Cover Photo & Album Gallery Manager (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Foto Sampul Utama */}
            <div className="p-4 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
                <span className="text-xs font-semibold text-[#14161C]">
                  Foto Sampul / Hero Undangan
                </span>
                <span className="text-[10px] font-mono text-[#717686]">Layar Pembuka &amp; Hero</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverPhotoUrl}
                  onChange={(e) => {
                    setCoverPhotoUrl(e.target.value);
                    setPreviewingPhotoSrc(e.target.value);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] focus:outline-none focus:border-[#14161C]"
                  placeholder="https://... atau /images/prewedding/couple-1.jpg"
                />
                <label className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white hover:bg-[#F5F5F0] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#717686]" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setCoverPhotoUrl)}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[10px]">
                <span className="text-[#888D9C]">Pilihan Cepat:</span>
                {[
                  { label: "Foto 1", src: "/images/prewedding/couple-1.jpg" },
                  { label: "Foto 2", src: "/images/prewedding/couple-2.jpg" },
                  { label: "Kucing Pasangan", src: "/images/cats/cats-couple.jpg" },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCoverPhotoUrl(p.src);
                      setPreviewingPhotoSrc(p.src);
                    }}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-[#F0F0EB] text-[#5C6070] border border-[#DCDCD5] cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Foto Bersama Penutup (Closing Photo) */}
            <div className="p-4 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
                <div>
                  <span className="text-xs font-semibold text-[#14161C] block">
                    Foto Bersama Penutup (Closing Photo)
                  </span>
                  <span className="text-[10px] text-[#717686]">
                    Foto berdua yang dibingkai indah di bagian footer / penutup undangan
                  </span>
                </div>
                {closingPhotoUrl && (
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#DCDCD5] shrink-0 bg-[#EFE6DC]">
                    <img
                      src={closingPhotoUrl}
                      alt="Closing Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={closingPhotoUrl}
                  onChange={(e) => setClosingPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] focus:outline-none focus:border-[#14161C]"
                  placeholder="https://... atau /images/prewedding/couple-1.jpg"
                />
                <label className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white hover:bg-[#F5F5F0] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#717686]" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setClosingPhotoUrl)}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[10px]">
                <span className="text-[#888D9C]">Pilihan Cepat:</span>
                {[
                  { label: "Foto 1 (Berdua)", src: "/images/prewedding/couple-1.jpg" },
                  { label: "Foto 2 (Sunset)", src: "/images/prewedding/couple-2.jpg" },
                  { label: "Foto 5 (Casual)", src: "/images/prewedding/couple-5.jpg" },
                  { label: "Kucing Pasangan", src: "/images/cats/cats-couple.jpg" },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setClosingPhotoUrl(p.src)}
                    className={`px-2 py-0.5 rounded-md border cursor-pointer transition-colors ${
                      closingPhotoUrl === p.src
                        ? "bg-[#14161C] text-white border-[#14161C] font-medium"
                        : "bg-white hover:bg-[#F0F0EB] text-[#5C6070] border-[#DCDCD5]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Album Foto Prewedding (Daftar Foto) */}
            <div className="p-4 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
                <div>
                  <span className="text-xs font-semibold text-[#14161C] block">
                    Daftar Foto Album Prewedding ({preweddingPhotos.length})
                  </span>
                  <span className="text-[10px] text-[#717686]">
                    Foto ini berputar di latar blur dan muncul di galeri
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const sampleList = [
                      "/images/prewedding/couple-1.jpg",
                      "/images/prewedding/couple-2.jpg",
                      "/images/prewedding/couple-3.jpg",
                      "/images/prewedding/couple-4.jpg",
                      "/images/prewedding/couple-5.jpg",
                    ];
                    setPreweddingPhotos(sampleList);
                    setPreviewingPhotoSrc(sampleList[0]);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#DCDCD5] text-[10px] font-mono text-[#5C6070] hover:bg-[#F5F5F0] cursor-pointer"
                >
                  Gunakan 5 Foto Bawaan
                </button>
              </div>

              {/* Form Tambah Foto */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newPhotoInput}
                  onChange={(e) => setNewPhotoInput(e.target.value)}
                  placeholder="Ketik atau tempel URL foto tambahan..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] focus:outline-none focus:border-[#14161C]"
                />
                <button
                  type="button"
                  onClick={handleAddPreweddingPhoto}
                  className="px-3 py-2 rounded-xl bg-[#14161C] hover:bg-[#252834] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
                <label className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white hover:bg-[#F5F5F0] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#717686]" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const tempUrl = URL.createObjectURL(file);
                      setPreweddingPhotos((prev) => [...prev, tempUrl]);
                      setPreviewingPhotoSrc(tempUrl);
                      try {
                        const permanentUrl = await uploadImageFile(file);
                        if (permanentUrl) {
                          setPreweddingPhotos((prev) =>
                            prev.map((p) => (p === tempUrl ? permanentUrl : p))
                          );
                          setPreviewingPhotoSrc(permanentUrl);
                        }
                      } catch (err) {
                        console.warn("Gagal upload prewedding photo:", err);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Grid Thumbnails Prewedding */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-2">
                {preweddingPhotos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewingPhotoSrc(photoUrl)}
                    className={`relative rounded-xl overflow-hidden aspect-3/4 border-2 group cursor-pointer transition-all ${
                      previewingPhotoSrc === photoUrl
                        ? "border-[#14161C] ring-2 ring-[#14161C]/20 shadow-md scale-102"
                        : "border-[#E5E5DE] hover:border-[#14161C]/50"
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Foto Prewedding ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = "/images/prewedding/couple-1.jpg";
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePreweddingPhoto(idx);
                        }}
                        className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                        title="Hapus foto dari album"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 text-white">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Atmospheric Color Extractor Tester (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full p-5 rounded-2xl bg-[#0B0D13] text-white border border-[#232734] shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#E07A5F]" />
                    <span className="font-serif font-bold text-sm text-white">
                      Uji Ekstraksi Atmosfer Warna
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    Live Analyzer
                  </span>
                </div>

                <p className="text-[11px] text-white/70 leading-relaxed font-sans mt-3">
                  Warna berikut diekstrak secara otomatis dari foto terpilih. Latar belakang blur dan aksen tema{" "}
                  <strong className="text-white">Ambient Chroma</strong> akan otomatis menyesuaikan diri.
                </p>

                {/* Inspected Image Preview */}
                <div className="mt-3.5 relative rounded-xl overflow-hidden aspect-16/9 border border-white/15 bg-black/50">
                  <img
                    src={previewingPhotoSrc}
                    alt="Inspected Sample"
                    onError={(e) => {
                      if (previewingPhotoSrc !== "/images/prewedding/couple-1.jpg") {
                        e.currentTarget.src = "/images/prewedding/couple-1.jpg";
                      }
                    }}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-white/80">
                      Foto Aktif Sedang Dianalisis
                    </span>
                  </div>
                </div>

                {/* 5 Extracted Swatches */}
                {extractedPreview ? (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      {[
                        { label: "Dominant", color: extractedPreview.dominant },
                        { label: "Secondary", color: extractedPreview.secondary },
                        { label: "Deep BG", color: extractedPreview.deep },
                        { label: "Light", color: extractedPreview.light },
                        { label: "Glow", color: extractedPreview.glow },
                      ].map((swatch, idx) => (
                        <div key={idx} className="space-y-1">
                          <div
                            style={{ backgroundColor: swatch.color }}
                            className="w-full h-8 rounded-lg border border-white/20 shadow-xs"
                          />
                          <span className="text-[9px] font-mono text-white/60 block truncate">
                            {swatch.label}
                          </span>
                          <span className="text-[8px] font-mono text-white/90 block truncate uppercase">
                            {swatch.color.startsWith("#") ? swatch.color : "rgba"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Gradient preview bar */}
                    <div
                      style={{
                        background: `radial-gradient(circle at center, ${extractedPreview.glow} 0%, ${extractedPreview.deep} 100%)`,
                        borderColor: `${extractedPreview.dominant}66`,
                      }}
                      className="p-3 rounded-xl border text-center mt-3 shadow-inner"
                    >
                      <span className="text-[10px] font-mono text-white/90">
                        Pratinjau Aura Latar Belakang Blur
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-white/50 animate-pulse">
                    Mengekstrak atmosfer warna dari foto...
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-white/50 flex items-center justify-between">
                <span>Algoritma: Canvas Chroma-Sampler</span>
                <span className="text-[#E07A5F]">Otomatis &bull; Siap Pakai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jadwal Acara (Akad, Resepsi Wanita, Resepsi Pria / Ngunduh Mantu) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0F0EA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
              <Calendar className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
                Jadwal Rangkaian Acara Pernikahan
              </h3>
              <p className="text-[11px] text-[#717686]">
                Atur seluruh rangkaian seremoni, tentukan tanggal utama (highlight), dan sesuaikan detail akad &amp; resepsi
              </p>
            </div>
          </div>

          {eventsList.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E5E0D5] text-[11px] font-mono text-[#8C6218]">
              <Star className="w-3.5 h-3.5 text-[#C85A17] fill-[#C85A17]" />
              <span>
                Acara Utama: {eventsList.find((e) => e.id === selectedMainEventId)?.title || eventsList[0]?.title}
              </span>
            </div>
          )}
        </div>

        {/* Panel Pemilihan Acara Utama (Highlight Tanggal di Undangan) */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#FCFCFA] border border-[#EAE6DD] space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C85A17] fill-[#C85A17]" />
              <span className="text-xs sm:text-sm font-semibold text-[#14161C]">
                Pilih Tanggal Acara yang Di-Highlight di Undangan
              </span>
            </div>
            <label className="flex items-center gap-2 text-[11px] text-[#555A68] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoSyncCountdown}
                onChange={(e) => setAutoSyncCountdown(e.target.checked)}
                className="rounded border-[#DCDCD5] text-[#14161C] focus:ring-0"
              />
              <span>Sinkronkan Countdown Otomatis</span>
            </label>
          </div>

          <p className="text-[11px] text-[#717686] leading-relaxed">
            Pilih acara yang menjadi tanggal sorotan utama. Tanggal dan hitung mundur pada <strong>Sampul (Cover), Hero, dan Save-the-Date</strong> undangan akan otomatis menampilkan acara ini. Sangat berguna bila Akad diadakan di pihak mempelai wanita dan Resepsi di mempelai pria, atau jika Anda ingin mengarahkan highlight ke resepsi tertentu.
          </p>

          {/* Switcher Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {eventsList.map((evt, idx) => {
              const isSelected = evt.id === selectedMainEventId;
              const hostLabel =
                evt.hostSide === "wanita"
                  ? "👰 Pihak Wanita"
                  : evt.hostSide === "pria"
                  ? "🤵 Pihak Pria"
                  : "💍 Pihak Bersama";

              return (
                <button
                  key={evt.id || idx}
                  type="button"
                  onClick={() => handleSelectMainEvent(evt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "bg-white border-[#14161C] shadow-sm ring-1 ring-[#14161C]"
                      : "bg-white/70 border-[#E2DFD8] hover:border-[#C4BFB4] hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-xs text-[#14161C] line-clamp-1">
                      {evt.title || `Acara 0${idx + 1}`}
                    </span>
                    {isSelected ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#14161C] text-[#DFD2BD] shrink-0 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-[#DFD2BD]" />
                        HIGHLIGHT
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#8C91A0] shrink-0 hover:text-[#14161C]">
                        Pilih ini
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-[#555A68] space-y-0.5">
                    <div className="font-medium text-[#14161C]">
                      {evt.displayDay ? `${evt.displayDay}, ` : ""}
                      {evt.displayDate || "Tanggal belum diatur"}
                    </div>
                    <div className="text-[10px] text-[#717686] truncate">
                      {evt.time || "Waktu belum diatur"} • {evt.venueName || "Lokasi"}
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-[#F0EFEA] flex items-center justify-between text-[10px]">
                    <span className="text-[#717686] font-mono">{hostLabel}</span>
                    {isSelected && (
                      <span className="text-[#C85A17] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Aktif
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daftar Kartu Acara */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {eventsList.map((evt, idx) => {
            const isSelected = evt.id === selectedMainEventId;

            return (
              <div
                key={evt.id || idx}
                className={`p-5 rounded-xl border space-y-4 transition-colors ${
                  isSelected
                    ? "bg-[#FFFDFB] border-[#D9CEBA] shadow-[0_2px_8px_rgba(200,90,23,0.04)]"
                    : "bg-[#FCFCFB] border-[#EBEBE5]"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-medium ${
                        isSelected
                          ? "bg-[#14161C] text-[#DFD2BD]"
                          : "bg-[#2C303B] text-white"
                      }`}
                    >
                      Acara 0{idx + 1}: {evt.title || "Acara"}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF2E6] text-[#A24810] border border-[#ECD9BD] flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-[#A24810]" />
                        Utama (Cover)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isSelected && (
                      <button
                        type="button"
                        onClick={() => handleSelectMainEvent(evt.id)}
                        className="text-[11px] font-medium text-[#717686] hover:text-[#14161C] flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer"
                        title="Jadikan tanggal acara ini sebagai sorotan utama di Cover & Countdown"
                      >
                        <Star className="w-3 h-3" />
                        <span>Sorot Ini</span>
                      </button>
                    )}
                    {eventsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEvent(idx)}
                        className="text-[11px] text-[#A0A4B0] hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus acara ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Judul & Subtitle Acara */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                      Nama / Judul Acara
                    </label>
                    <input
                      type="text"
                      value={evt.title}
                      onChange={(e) => handleUpdateEventField(idx, "title", e.target.value)}
                      placeholder="Contoh: Akad Nikah / Resepsi Mempelai Pria"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                      Sub-judul / Badge Keterangan
                    </label>
                    <input
                      type="text"
                      value={evt.subTitle}
                      onChange={(e) => handleUpdateEventField(idx, "subTitle", e.target.value)}
                      placeholder="Contoh: Momen Sakral Ijab Kabul / Pesta Syukuran Bersama"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                    />
                  </div>
                </div>

                {/* Pihak Penyelenggara */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
                    Pihak Penyelenggara
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: "wanita", label: "👰 Mempelai Wanita" },
                      { value: "pria", label: "🤵 Mempelai Pria (Ngunduh Mantu)" },
                      { value: "bersama", label: "💍 Pihak Bersama" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleUpdateEventField(idx, "hostSide", opt.value)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-medium border text-center transition-colors cursor-pointer ${
                          evt.hostSide === opt.value
                            ? "bg-[#14161C] text-white border-[#14161C]"
                            : "bg-white hover:bg-[#F2F2EE] text-[#555A68] border-[#DCDCD5]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hari & Tanggal */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                      Hari
                    </label>
                    <input
                      type="text"
                      value={evt.displayDay}
                      onChange={(e) => handleUpdateEventField(idx, "displayDay", e.target.value)}
                      placeholder="Sabtu"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                      Tanggal Tampilan
                    </label>
                    <input
                      type="text"
                      value={evt.displayDate}
                      onChange={(e) => handleUpdateEventField(idx, "displayDate", e.target.value)}
                      placeholder="28 November 2026"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                    />
                  </div>
                </div>

                {/* Tanggal Kalender (ISO / dateStr) & Waktu Pelaksanaan */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                      Format Kalender (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      value={
                        evt.dateStr && evt.dateStr.includes("T")
                          ? evt.dateStr.split("T")[0]
                          : evt.dateStr || "2026-11-28"
                      }
                      onChange={(e) => handleUpdateEventField(idx, "dateStr", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                      Waktu Pelaksanaan
                    </label>
                    <input
                      type="text"
                      value={evt.time}
                      onChange={(e) => handleUpdateEventField(idx, "time", e.target.value)}
                      placeholder="08:00 - 10:00 WIB"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                    />
                  </div>
                </div>

                {/* Lokasi / Gedung */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                    Nama Tempat / Gedung
                  </label>
                  <input
                    type="text"
                    value={evt.venueName}
                    onChange={(e) => handleUpdateEventField(idx, "venueName", e.target.value)}
                    placeholder="Contoh: Gedung Serbaguna Merakurak"
                    className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                  />
                </div>

                {/* Alamat Lengkap */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    value={evt.venueAddress}
                    onChange={(e) => handleUpdateEventField(idx, "venueAddress", e.target.value)}
                    placeholder="Alamat lengkap lokasi acara..."
                    className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                  />
                </div>

                {/* Maps URL */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                    Tautan Google Maps
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={evt.mapUrl}
                      onChange={(e) => handleUpdateEventField(idx, "mapUrl", e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs text-[#14161C] focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]"
                    />
                    <MapPin className="w-3.5 h-3.5 text-[#888D9C] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tombol Tambah Rangkaian Acara (Presets) */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#717686] mr-1">Tambah Rangkaian Acara:</span>
          <button
            type="button"
            onClick={() => handleAddEvent("resepsi_pria")}
            className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white hover:bg-[#F5F5F0] text-xs text-[#14161C] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#717686]" />
            <span>+ Resepsi Mempelai Pria (Ngunduh Mantu)</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddEvent("resepsi_wanita")}
            className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white hover:bg-[#F5F5F0] text-xs text-[#14161C] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#717686]" />
            <span>+ Resepsi Mempelai Wanita</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddEvent("custom")}
            className="px-3 py-2 rounded-xl border border-[#DCDCD5] bg-[#FAF9F6] hover:bg-[#F0EEE8] text-xs text-[#555A68] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#717686]" />
            <span>+ Acara Lainnya</span>
          </button>
        </div>
      </div>

      {/* Amplop Digital & Rekening Bank (Dinamis) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0F0EA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14161C] text-[#DFD2BD] flex items-center justify-center font-bold text-xs shrink-0 border border-[#2D313E]">
              <CreditCard className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
                Amplop Digital &amp; Hadiah Pernikahan
              </h3>
              <p className="text-[11px] text-[#717686]">
                Nomor rekening untuk kemudahan transfer hadiah serta alamat penerimaan kado fisik
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddAccount}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#14161C] bg-[#F5F5F0] hover:bg-[#EBEBE5] border border-[#DCDCD5] rounded-xl transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Rekening
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((acc, index) => {
            const padIdx = String(index + 1).padStart(2, "0");
            const defaultLabel =
              index === 0
                ? `Rekening 01 (${groomName || "Groom"})`
                : index === 1
                ? `Rekening 02 (${brideName || "Bride"})`
                : `Rekening ${padIdx}`;
            const displayTitle = acc.cuteLabel || defaultLabel;

            return (
              <div
                key={index}
                className="p-5 rounded-xl bg-[#FCFCFB] border border-[#EBEBE5] space-y-3 relative group transition-all hover:border-[#D0D0C8]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#EFEFE8]">
                  <span className="text-xs font-semibold text-[#14161C]">
                    {displayTitle}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#717686] uppercase">
                      Tersimpan
                    </span>
                    {accounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAccount(index)}
                        className="text-[#9E9E94] hover:text-[#DC2626] p-1 rounded-md transition-colors"
                        title="Hapus rekening"
                        aria-label={`Hapus ${displayTitle}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                      Bank
                    </label>
                    <input
                      type="text"
                      value={acc.bankName}
                      onChange={(e) => handleAccountChange(index, "bankName", e.target.value)}
                      placeholder="BCA"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      value={acc.accountNumber}
                      onChange={(e) => handleAccountChange(index, "accountNumber", e.target.value)}
                      placeholder="Nomor rekening / e-wallet"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm font-mono text-[#14161C] focus:outline-none focus:border-[#14161C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                    Atas Nama Pemilik
                  </label>
                  <input
                    type="text"
                    value={acc.accountHolder}
                    onChange={(e) => handleAccountChange(index, "accountHolder", e.target.value)}
                    placeholder="Nama pemilik rekening"
                    className="w-full px-3 py-2 rounded-xl border border-[#DCDCD5] bg-white text-xs sm:text-sm text-[#14161C] focus:outline-none focus:border-[#14161C]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={handleAddAccount}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#14161C] bg-[#F5F5F0] hover:bg-[#EAEAE4] border border-[#D4D4CD] rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#14161C]" />
            Tambah Rekening Baru
          </button>
        </div>

        <div className="pt-4 border-t border-[#EFEFE8] space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#14161C] font-bold">
              Kirim Kado Fisik
            </h4>
            <span className="text-[11px] text-[#717686]">
              Alamat &amp; kontak penerimaan kado/paket
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                Nama Penerima Paket
              </label>
              <input
                type="text"
                value={physicalRecipient}
                onChange={(e) => setPhysicalRecipient(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder={`${groomName.trim() || "Gilang"} & ${brideName.trim() || "Salsadila"}`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
                Nomor Telepon / WhatsApp Penerima
              </label>
              <input
                type="text"
                value={physicalPhone}
                onChange={(e) => setPhysicalPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] font-mono text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
                placeholder="Contoh: 081234567890"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1 font-medium">
              Alamat Lengkap Pengiriman
            </label>
            <textarea
              rows={2}
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
              placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kabupaten, kode pos..."
            />
          </div>
        </div>
      </div>

      {/* Tagline & Pesan */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
        <div className="pb-4 border-b border-[#F0F0EA]">
          <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
            Tagline &amp; Pesan Penutup
          </h3>
          <p className="text-[11px] text-[#717686]">
            Kalimat pembuka santai, tagar media sosial, dan ucapan penutup penghormatan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
              Tagline Santai / Kutipan Cinta
            </label>
            <input
              type="text"
              value={funTagline}
              onChange={(e) => setFunTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
              Hashtag Resmi Acara
            </label>
            <input
              type="text"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
              placeholder="Contoh: #DimasAnisaWedding"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
            Pesan Penutup Undangan
          </label>
          <textarea
            rows={3}
            value={closingMessage}
            onChange={(e) => setClosingMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
          />
        </div>

        <div className="pt-2 border-t border-[#EFEFE8] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#DCDCD5] bg-[#EFE6DC] shrink-0 shadow-xs">
              <img
                src={closingPhotoUrl || "/images/prewedding/couple-1.jpg"}
                alt="Foto Penutup"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#14161C] block">
                Foto Bersama Penutup
              </span>
              <span className="text-[11px] text-[#717686]">
                Foto ini tampil dalam bingkai elegan di akhir undangan
              </span>
            </div>
          </div>
          <label className="px-3 py-1.5 rounded-xl border border-[#DCDCD5] bg-white hover:bg-[#F5F5F0] text-xs text-[#14161C] font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-[#717686]" />
            <span>Ganti Foto Penutup</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, setClosingPhotoUrl)}
            />
          </label>
        </div>
      </div>

      {/* Akses Bilik Foto & Cetak Poster Standee */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E7E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
        <div className="pb-4 border-b border-[#F0F0EA] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4A121A] text-[#DFD2BD] flex items-center justify-center shadow-xs shrink-0">
              <Camera className="w-4 h-4 text-[#DFD2BD]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#14161C] tracking-tight">
                Akses Bilik Foto (Photobox) &amp; Poster Standee
              </h3>
              <p className="text-[11px] text-[#717686]">
                Kelola passcode keamanan tamu saat membuka photobox dan cetak poster standee acara
              </p>
            </div>
          </div>
          {onOpenA3Poster && (
            <button
              type="button"
              onClick={onOpenA3Poster}
              className="px-3.5 py-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F3ECE0] border border-[#E8DFC8] text-xs font-bold text-[#4A121A] flex items-center gap-2 cursor-pointer transition-colors shadow-2xs active:scale-95"
              title="Cetak Poster QR Code Standee (A3, A4, A5, A6, F4)"
            >
              <QrCode className="w-3.5 h-3.5 text-[#8C6239]" />
              <span>Cetak Poster QR Standee (A3-A6)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#717686] mb-1.5 font-medium">
              Passcode Bilik Foto (4 Digit)
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={8}
                value={photoboxPasscode}
                onChange={(e) => setPhotoboxPasscode(e.target.value)}
                placeholder="2111"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDCD5] bg-white focus:outline-none focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C] font-mono text-xs sm:text-sm text-[#14161C] placeholder:text-[#A0A4B0] transition-colors"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#717686] mt-1.5 leading-relaxed">
              Passcode ini wajib dimasukkan tamu saat membuka photobox dan otomatis tertera pada poster cetak A3.
            </p>
          </div>

          <div className="bg-[#FAF6EE]/70 rounded-xl p-3.5 border border-[#E8DFC8] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#4A121A] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8C6239]" />
                <span>Format Passcode yang Didukung:</span>
              </span>
              <p className="text-[11px] text-[#786551] leading-relaxed">
                Tamu wajib memasukkan passcode aktif ini (saat ini: <strong className="font-mono text-[#4A121A]">{photoboxPasscode || "2111"}</strong>). Pincode lama otomatis tidak dapat digunakan lagi setelah passcode diubah.
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-[#E8DFC8]/60 flex items-center justify-between text-[11px]">
              <span className="text-[#8C6239] font-medium">Proteksi Bilik Foto:</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold font-mono text-[10px]">
                Aktif Terproteksi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 pb-8">
        {saveError && (
          <span className="text-xs font-medium text-[#B91C1C] bg-[#FEF2F2] px-4 py-2 rounded-xl border border-[#FCA5A5] flex items-center gap-1.5 animate-in fade-in w-full sm:w-auto">
            {saveError}
          </span>
        )}
        {isSaved && (
          <span className="text-xs font-medium text-[#24623E] bg-[#F3F8F5] px-4 py-2 rounded-xl border border-[#D4EADB] flex items-center gap-1.5 animate-in fade-in w-full sm:w-auto">
            <Check className="w-3.5 h-3.5 text-[#2E7A4A]" />
            Tersimpan Sukses!
          </span>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#14161C] hover:bg-[#232734] disabled:opacity-75 disabled:cursor-not-allowed text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 text-[#DFD2BD] animate-spin" />
              <span>Menyimpan Data...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="w-4 h-4 text-[#2E7A4A]" />
              <span className="text-[#DFD2BD]">Tersimpan Sukses!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#DFD2BD]" />
              <span>Simpan Seluruh Data Mempelai &amp; Acara</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastNotification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
            toastNotification.type === "success"
              ? "bg-[#14161C] text-white border-[#2E7A4A]/50 shadow-[0_10px_25px_rgba(20,22,28,0.25)]"
              : "bg-[#7F1D1D] text-white border-red-500 shadow-red-900/30"
          }`}
        >
          {toastNotification.type === "success" ? (
            <div className="w-5 h-5 rounded-full bg-[#24623E] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">
              !
            </div>
          )}
          <span>{toastNotification.text}</span>
        </div>
      )}
    </form>
  );
}
