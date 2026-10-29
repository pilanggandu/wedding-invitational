export interface GroomBrideInfo {
  name: string;
  fullName: string;
  tagline: string;
  bioFunny: string;
  parents: string;
  instagram: string;
  photoPlaceholder: {
    title: string;
    caption: string;
    aspectRatio: string;
    variant: "groom" | "bride" | "couple";
  };
}

export interface EventDetail {
  id: string;
  title: string;
  subTitle: string;
  badgeCute: string;
  colorTheme: "red" | "blue" | "yellow" | "green";
  dateStr: string;
  displayDate: string;
  displayDay: string;
  time: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  calendarEvent: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
  };
}

export interface LoveStoryItem {
  year: string;
  title: string;
  story: string;
  cuteReaction: string;
  photoCaption: string;
  badgeColor: string;
}

export interface GalleryPhoto {
  id: number;
  caption: string;
  tag: string;
  doodleSticker: string;
  stickerBg: string;
  aspectRatio: "square" | "portrait" | "landscape";
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoText: string;
  cuteLabel: string;
  cardColor: "gold" | "maroon";
}

export interface WishMessage {
  id: string;
  name: string;
  relationship: string;
  attendance: "Hadir dong! 😋" | "Maaf belum bisa 🥺" | "Masih mikir-mikir 👀";
  message: string;
  date: string;
}

export const WEDDING_DATA = {
  couple: {
    groom: {
      name: "Gilang",
      fullName: "Gilang Pandu Permadi",
      tagline: "",
      bioFunny: "",
      parents: "",
      instagram: "",
      photoPlaceholder: {
        title: "The Groom",
        caption: "Gilang",
        aspectRatio: "3/4",
        variant: "groom",
      },
      photoUrl: "/images/prewedding/couple-3.jpg",
    } as GroomBrideInfo,
    bride: {
      name: "Salsa",
      fullName: "Salsadila Nanda Octavia",
      tagline: "",
      bioFunny: "",
      parents: "",
      instagram: "",
      photoPlaceholder: {
        title: "The Bride",
        caption: "Salsa",
        aspectRatio: "3/4",
        variant: "bride",
      },
      photoUrl: "/images/prewedding/couple-4.jpg",
    } as GroomBrideInfo,
  },

  general: {
    hashtag: "#GilangSalsa2026",
    funTagline: "Perayaan pernikahan yang dipenuhi tawa, doa, dan rasa syukur.",
    musicTitle: "Acoustic Serenade of Joy",
    musicArtist: "Melodi Cinta Gilang & Salsa",
    quote: {
      arabic: "",
      translation: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram dan damai kepadanya.",
      source: "QS. Ar-Rum: 21",
    },
    openingGreetings: "Assalamu'alaikum warahmatullahi wabarakatuh",
    openingMessage: "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan berbagi kebahagiaan di hari pernikahan kami.",
    closingMessage: "Kehadiran dan doa restu Anda akan menjadi kebahagiaan bagi kami.",
    coverPhotoUrl: "/images/prewedding/couple-1.jpg",
    heroPhotoUrl: "/images/prewedding/couple-2.jpg",
    backgroundPhotoUrl: "/images/prewedding/couple-1.jpg",
    preweddingPhotos: [
      "/images/prewedding/couple-1.jpg",
      "/images/prewedding/couple-2.jpg",
      "/images/prewedding/couple-3.jpg",
      "/images/prewedding/couple-4.jpg",
      "/images/prewedding/couple-5.jpg",
    ],
  },

  countdownTarget: "2026-11-28T08:00:00+07:00",

  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      subTitle: "Upacara Ijab Kabul Sakral",
      badgeCute: "Momen Sakral & Janji Suci 💍",
      colorTheme: "red",
      dateStr: "2026-11-28T08:00:00+07:00",
      displayDate: "28 November 2026",
      displayDay: "Sabtu Pagi",
      time: "08:00 WIB",
      venueName: "Desa Mandirejo",
      venueAddress: "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
      mapUrl: "https://maps.app.goo.gl/X4bCF1AkZJfpPy8p8",
      calendarEvent: {
        title: "Akad Nikah Gilang & Salsa",
        description: "Pernikahan Gilang Pandu Permadi dan Salsadila Nanda Octavia",
        location: "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
        startDate: "20261128T010000Z",
        endDate: "",
      },
    },
    {
      id: "resepsi",
      title: "Pesta Resepsi",
      subTitle: "Makan Enak & Rayakan Bahagia",
      badgeCute: "Makan Enak, Foto & Ceria Bersama! 🍰",
      colorTheme: "yellow",
      dateStr: "2026-11-28T13:00:00+07:00",
      displayDate: "28 November 2026",
      displayDay: "Sabtu Siang",
      time: "13:00 - 15:00 WIB",
      venueName: "Desa Mandirejo",
      venueAddress: "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
      mapUrl: "https://maps.app.goo.gl/X4bCF1AkZJfpPy8p8",
      calendarEvent: {
        title: "Resepsi Pernikahan Gilang & Salsa",
        description: "Pernikahan Gilang Pandu Permadi dan Salsadila Nanda Octavia",
        location: "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
        startDate: "20261128T060000Z",
        endDate: "20261128T080000Z",
      },
    },
  ] as EventDetail[],

  stories: [] as LoveStoryItem[],

  gallery: [
    {
      id: 1,
      caption: "Ilustrasi pasangan",
      tag: "Ilustrasi",
      doodleSticker: "Cute Couple 👫",
      stickerBg: "bg-[#FDE047]",
      aspectRatio: "portrait",
    },
    {
      id: 2,
      caption: "Lanskap",
      tag: "Gambar",
      doodleSticker: "Sunny Day ☀️",
      stickerBg: "bg-[#F472B6]",
      aspectRatio: "landscape",
    },
    {
      id: 3,
      caption: "Ilustrasi wajah",
      tag: "Gambar",
      doodleSticker: "Haha Lucu! 😂",
      stickerBg: "bg-[#60A5FA]",
      aspectRatio: "square",
    },
    {
      id: 4,
      caption: "Sepasang cincin",
      tag: "Gambar",
      doodleSticker: "Shining Star ⭐",
      stickerBg: "bg-[#FDE047]",
      aspectRatio: "landscape",
    },
    {
      id: 5,
      caption: "Ilustrasi bunga",
      tag: "Gambar",
      doodleSticker: "Tuan Putri 🌻",
      stickerBg: "bg-[#4ADE80]",
      aspectRatio: "portrait",
    },
    {
      id: 6,
      caption: "Ilustrasi pasangan",
      tag: "Gambar",
      doodleSticker: "Forever Together 🌲",
      stickerBg: "bg-[#C084FC]",
      aspectRatio: "square",
    },
  ] as GalleryPhoto[],

  gifts: {
    accounts: [] as BankAccount[],
    physicalGiftAddress: {
      recipient: "Gilang Pandu Permadi & Salsadila Nanda Octavia",
      phone: "",
      address: "Dusun Mendalan, RT 02 RW 04, Desa Mandirejo, Kecamatan Merakurak, Kabupaten Tuban",
    },
  },

  dresscode: {
    description: "Kenakan pakaian terbaikmu yang rapi dan nyaman. Kalau ingin serasi dengan tema maroon hangat kami:",
    colors: [
      { name: "Royal Maroon", hex: "#7D1128" },
      { name: "Champagne Gold", hex: "#E5B869" },
      { name: "Dusty Rose", hex: "#F5A8B8" },
      { name: "Warm Sage", hex: "#8FA89B" },
      { name: "Ivory Cream", hex: "#FFF0F3" },
    ],
  },

  initialWishes: [] as WishMessage[],
};
