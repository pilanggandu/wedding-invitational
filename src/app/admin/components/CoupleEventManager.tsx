"use client";

import React, { useState } from "react";
import { Check, Save, User, Calendar, MapPin, CreditCard, Heart, Sparkles } from "lucide-react";
import { WeddingInvitationData } from "@/types/wedding";
import { saveInvitationData } from "@/lib/invitationStore";

interface CoupleEventManagerProps {
  data: WeddingInvitationData;
  onUpdate: (updated: WeddingInvitationData) => void;
}

export function CoupleEventManager({ data, onUpdate }: CoupleEventManagerProps) {
  // Groom states
  const [groomName, setGroomName] = useState(data.couple?.groom?.name || "Gilang");
  const [groomFullName, setGroomFullName] = useState(data.couple?.groom?.fullName || "");
  const [groomParents, setGroomParents] = useState(data.couple?.groom?.parents || "");
  const [groomInstagram, setGroomInstagram] = useState(data.couple?.groom?.instagram || "");
  const [groomTagline, setGroomTagline] = useState(data.couple?.groom?.tagline || "");

  // Bride states
  const [brideName, setBrideName] = useState(data.couple?.bride?.name || "Salsadila");
  const [brideFullName, setBrideFullName] = useState(data.couple?.bride?.fullName || "");
  const [brideParents, setBrideParents] = useState(data.couple?.bride?.parents || "");
  const [brideInstagram, setBrideInstagram] = useState(data.couple?.bride?.instagram || "");
  const [brideTagline, setBrideTagline] = useState(data.couple?.bride?.tagline || "");

  // Events
  const akad = data.events[0] || {} as any;
  const resepsi = data.events[1] || akad || {} as any;

  const [akadDay, setAkadDay] = useState(akad.displayDay || "Sabtu");
  const [akadDate, setAkadDate] = useState(akad.displayDate || "21 November 2026");
  const [akadTime, setAkadTime] = useState(akad.time || "08:00 - 10:00 WIB");
  const [akadVenue, setAkadVenue] = useState(akad.venueName || "Kediaman Mempelai Wanita");
  const [akadAddress, setAkadAddress] = useState(akad.venueAddress || "Merakurak, Tuban, Jawa Timur");
  const [akadMapUrl, setAkadMapUrl] = useState(akad.mapUrl || "https://maps.google.com");

  const [resepsiDay, setResepsiDay] = useState(resepsi.displayDay || "Sabtu");
  const [resepsiDate, setResepsiDate] = useState(resepsi.displayDate || "21 November 2026");
  const [resepsiTime, setResepsiTime] = useState(resepsi.time || "11:00 - Selesai");
  const [resepsiVenue, setResepsiVenue] = useState(resepsi.venueName || "Gedung Serbaguna Merakurak");
  const [resepsiAddress, setResepsiAddress] = useState(resepsi.venueAddress || "Jl. Raya Merakurak, Tuban, Jawa Timur");
  const [resepsiMapUrl, setResepsiMapUrl] = useState(resepsi.mapUrl || "https://maps.google.com");

  // General details
  const [funTagline, setFunTagline] = useState(
    data.general?.funTagline || "Menemukan cinta itu mudah, tapi menemukan yang sefrekuensi itu anugerah!"
  );
  const [hashtag, setHashtag] = useState(data.general?.hashtag || "#GilangSalsaHalal");
  const [closingMessage, setClosingMessage] = useState(
    data.general?.closingMessage ||
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami."
  );

  // Bank accounts
  const acc1 = data.gifts?.accounts?.[0] || { bankName: "BCA", accountNumber: "1234567890", accountHolder: "Gilang Pandu Permadi" };
  const acc2 = data.gifts?.accounts?.[1] || { bankName: "Mandiri", accountNumber: "0987654321", accountHolder: "Salsadila Nanda Octavia" };

  const [bank1Name, setBank1Name] = useState(acc1.bankName);
  const [bank1Number, setBank1Number] = useState(acc1.accountNumber);
  const [bank1Holder, setBank1Holder] = useState(acc1.accountHolder);

  const [bank2Name, setBank2Name] = useState(acc2.bankName);
  const [bank2Number, setBank2Number] = useState(acc2.accountNumber);
  const [bank2Holder, setBank2Holder] = useState(acc2.accountHolder);

  const [physicalAddress, setPhysicalAddress] = useState(
    data.gifts?.physicalGiftAddress?.address || "Merakurak, Tuban, Jawa Timur"
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

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
        },
        bride: {
          ...data.couple.bride,
          name: brideName.trim(),
          fullName: brideFullName.trim(),
          parents: brideParents.trim(),
          instagram: brideInstagram.trim().replace(/^@/, ""),
          tagline: brideTagline.trim(),
        },
      },
      general: {
        ...data.general,
        funTagline: funTagline.trim(),
        hashtag: hashtag.trim(),
        closingMessage: closingMessage.trim(),
      },
      events: [
        {
          ...(data.events[0] || {}),
          id: "event_akad",
          title: "Akad Nikah",
          subTitle: "Momen Sakral Ijab Kabul",
          badgeCute: "Momen Paling Sakral 💍",
          colorTheme: "red",
          dateStr: "2026-11-21",
          displayDate: akadDate.trim(),
          displayDay: akadDay.trim(),
          time: akadTime.trim(),
          venueName: akadVenue.trim(),
          venueAddress: akadAddress.trim(),
          mapUrl: akadMapUrl.trim(),
          calendarEvent: {
            title: `Akad Nikah ${groomName} & ${brideName}`,
            description: `Akad Nikah ${groomFullName} & ${brideFullName}`,
            location: akadAddress.trim(),
            startDate: "20261121T010000Z",
            endDate: "20261121T030000Z",
          },
        },
        {
          ...(data.events[1] || {}),
          id: "event_resepsi",
          title: "Resepsi Pernikahan",
          subTitle: "Pesta Syukuran & Temu Kangen",
          badgeCute: "Pesta Bahagia & Makan Enak! 🍛",
          colorTheme: "yellow",
          dateStr: "2026-11-21",
          displayDate: resepsiDate.trim(),
          displayDay: resepsiDay.trim(),
          time: resepsiTime.trim(),
          venueName: resepsiVenue.trim(),
          venueAddress: resepsiAddress.trim(),
          mapUrl: resepsiMapUrl.trim(),
          calendarEvent: {
            title: `Resepsi Pernikahan ${groomName} & ${brideName}`,
            description: `Pesta Resepsi ${groomFullName} & ${brideFullName}`,
            location: resepsiAddress.trim(),
            startDate: "20261121T040000Z",
            endDate: "20261121T090000Z",
          },
        },
      ],
      gifts: {
        accounts: [
          {
            bankName: bank1Name.trim(),
            accountNumber: bank1Number.trim(),
            accountHolder: bank1Holder.trim(),
            logoText: bank1Name.trim(),
            cuteLabel: `Rekening ${groomName}`,
            cardColor: "maroon",
          },
          {
            bankName: bank2Name.trim(),
            accountNumber: bank2Number.trim(),
            accountHolder: bank2Holder.trim(),
            logoText: bank2Name.trim(),
            cuteLabel: `Rekening ${brideName}`,
            cardColor: "gold",
          },
        ],
        physicalGiftAddress: {
          recipient: `${groomName} & ${brideName}`,
          phone: "081234567890",
          address: physicalAddress.trim(),
        },
      },
    };

    saveInvitationData(updated);
    onUpdate(updated);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs sticky top-4 z-20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-50 text-blue-700 mb-1">
            <Heart className="w-3.5 h-3.5" />
            Editor Data Mempelai & Acara
          </div>
          <h2 className="font-sans font-bold text-xl text-slate-900">
            Data Mempelai, Acara & Amplop
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-300 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Tersimpan Sukses!
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-white" />
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </div>

      {/* Grid: Groom & Bride Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mempelai Pria */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900">
              Profil Mempelai Pria (Groom)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Panggilan
            </label>
            <input
              type="text"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
              placeholder="Contoh: Gilang"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap & Gelar
            </label>
            <input
              type="text"
              value={groomFullName}
              onChange={(e) => setGroomFullName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
              placeholder="Contoh: Gilang Pandu Permadi, S.Kom."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Orang Tua / Keluarga
            </label>
            <input
              type="text"
              value={groomParents}
              onChange={(e) => setGroomParents(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
              placeholder="Contoh: Putra pertama dari Bpk. Permadi & Ibu Rahayu"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instagram (@username)
              </label>
              <input
                type="text"
                value={groomInstagram}
                onChange={(e) => setGroomInstagram(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
                placeholder="gilang"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gelar / Julukan Santai
              </label>
              <input
                type="text"
                value={groomTagline}
                onChange={(e) => setGroomTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
                placeholder="Calon Suami Idaman"
              />
            </div>
          </div>
        </div>

        {/* Mempelai Wanita */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900">
              Profil Mempelai Wanita (Bride)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Panggilan
            </label>
            <input
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
              placeholder="Contoh: Salsadila"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap & Gelar
            </label>
            <input
              type="text"
              value={brideFullName}
              onChange={(e) => setBrideFullName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
              placeholder="Contoh: Salsadila Nanda Octavia, S.M."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Orang Tua / Keluarga
            </label>
            <input
              type="text"
              value={brideParents}
              onChange={(e) => setBrideParents(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
              placeholder="Contoh: Putri kedua dari Bpk. Mokhamad Mokharom & Ibu Siti"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instagram (@username)
              </label>
              <input
                type="text"
                value={brideInstagram}
                onChange={(e) => setBrideInstagram(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
                placeholder="salsadila"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gelar / Julukan Santai
              </label>
              <input
                type="text"
                value={brideTagline}
                onChange={(e) => setBrideTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
                placeholder="Tuan Putri Cantik"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Jadwal Acara (Akad & Resepsi) */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Calendar className="w-5 h-5 text-slate-600" />
          <h3 className="font-sans font-bold text-base text-slate-900">
            Jadwal Rangkaian Acara Pernikahan
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Akad Nikah */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-600 text-white">
              Acara 1: Akad Nikah
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hari</label>
                <input
                  type="text"
                  value={akadDay}
                  onChange={(e) => setAkadDay(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
                <input
                  type="text"
                  value={akadDate}
                  onChange={(e) => setAkadDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Waktu</label>
              <input
                type="text"
                value={akadTime}
                onChange={(e) => setAkadTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Tempat/Gedung</label>
              <input
                type="text"
                value={akadVenue}
                onChange={(e) => setAkadVenue(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={akadAddress}
                onChange={(e) => setAkadAddress(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Google Maps URL</label>
              <input
                type="text"
                value={akadMapUrl}
                onChange={(e) => setAkadMapUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
              />
            </div>
          </div>

          {/* Resepsi */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 text-white">
              Acara 2: Resepsi Pernikahan
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hari</label>
                <input
                  type="text"
                  value={resepsiDay}
                  onChange={(e) => setResepsiDay(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
                <input
                  type="text"
                  value={resepsiDate}
                  onChange={(e) => setResepsiDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Waktu</label>
              <input
                type="text"
                value={resepsiTime}
                onChange={(e) => setResepsiTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Tempat/Gedung</label>
              <input
                type="text"
                value={resepsiVenue}
                onChange={(e) => setResepsiVenue(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={resepsiAddress}
                onChange={(e) => setResepsiAddress(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Google Maps URL</label>
              <input
                type="text"
                value={resepsiMapUrl}
                onChange={(e) => setResepsiMapUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Amplop Digital & Rekening Bank */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <CreditCard className="w-5 h-5 text-slate-600" />
          <h3 className="font-sans font-bold text-base text-slate-900">
            Amplop Digital & Hadiah Pernikahan
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rekening 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-semibold text-slate-700">
              Rekening Bank 1 ({groomName})
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Bank</label>
                <input
                  type="text"
                  value={bank1Name}
                  onChange={(e) => setBank1Name(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  value={bank1Number}
                  onChange={(e) => setBank1Number(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Atas Nama</label>
              <input
                type="text"
                value={bank1Holder}
                onChange={(e) => setBank1Holder(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Rekening 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-semibold text-slate-700">
              Rekening Bank 2 ({brideName})
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Bank</label>
                <input
                  type="text"
                  value={bank2Name}
                  onChange={(e) => setBank2Name(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  value={bank2Number}
                  onChange={(e) => setBank2Number(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Atas Nama</label>
              <input
                type="text"
                value={bank2Holder}
                onChange={(e) => setBank2Holder(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Alamat Pengiriman Kado Fisik
          </label>
          <input
            type="text"
            value={physicalAddress}
            onChange={(e) => setPhysicalAddress(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
            placeholder="Alamat lengkap penerimaan kado"
          />
        </div>
      </div>

      {/* Tagline & Pesan */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-sans font-bold text-base text-slate-900">
          Tagline & Pesan Penutup
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fun Tagline Santai
            </label>
            <input
              type="text"
              value={funTagline}
              onChange={(e) => setFunTagline(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hashtag Resmi
            </label>
            <input
              type="text"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pesan Penutup Undangan
          </label>
          <textarea
            rows={3}
            value={closingMessage}
            onChange={(e) => setClosingMessage(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans text-slate-900"
          />
        </div>
      </div>

      {/* Bottom Save CTA */}
      <div className="flex justify-end pt-2 pb-6">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4 text-white" />
          <span>Simpan Seluruh Data Mempelai & Acara</span>
        </button>
      </div>
    </form>
  );
}
