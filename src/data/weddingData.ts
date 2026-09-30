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
}

export interface GalleryPhoto {
  id: number;
  caption: string;
  tag: string;
  doodleSticker: string;
  aspectRatio: "square" | "portrait" | "landscape";
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoText: string;
  cuteLabel: string;
}

export interface WishMessage {
  id: string;
  name: string;
  relationship: string;
  attendance: "Hadir dong! 😋" | "Maaf ga bisa 🥺" | "Masih mikir 👀";
  message: string;
  date: string;
}

export const WEDDING_DATA = {
  couple: {
    groom: {
      name: "Dimas",
      fullName: "Dimas Arya Pratama, S.T.",
      tagline: "Putra pertama yang akhirnya nemu pawang seumur hidup",
      bioFunny: "Pencinta kopi tubruk, tukang ngelawak garing yang untungnya selalu diketawain Sarah (walau kasihan).",
      parents: "Bapak Bambang Wijaya & Ibu Sri Rahayu",
      instagram: "dimaspratama_",
      photoPlaceholder: {
        title: "The Groom",
        caption: "Dimas Si Calon Suami Siaga",
        aspectRatio: "3/4",
        variant: "groom",
      },
    } as GroomBrideInfo,
    bride: {
      name: "Sarah",
      fullName: "Sarah Annisa Larasati, S.Ds.",
      tagline: "Putri bungsu yang hobi jajan matcha dan minta difotoin",
      bioFunny: "Overthinker handal, ratu scrolling Shopee, tapi hatinya langsung tenang pas ketemu Mas Dimas.",
      parents: "Bapak Ir. Hendra Kusuma & Ibu Hj. Ratna Sari",
      instagram: "sarahlarasati_",
      photoPlaceholder: {
        title: "The Bride",
        caption: "Sarah Si Tuan Putri Lucu",
        aspectRatio: "3/4",
        variant: "bride",
      },
    } as GroomBrideInfo,
  },

  general: {
    hashtag: "#AkhirnyaDimasSarahSah",
    funTagline: "Dua bocah yang doyan makan akhirnya memutuskan untuk patungan seumur hidup! 🎉",
    musicTitle: "Can't Take My Eyes Off You - Ukulele & Acoustic Lullaby",
    musicArtist: "The Happy Wedding Band",
    quote: {
      arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
      translation: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram dan damai kepadanya.",
      source: "QS. Ar-Rum: 21",
    },
    openingGreetings: "Assalamu'alaikum & Halo Semuanya! ✨",
    openingMessage: "Setelah melewati perdebatan panjang milih tempat makan mau di mana, akhirnya kami berdua sepakat untuk melangkah ke jenjang yang paling sah dan penuh cinta!",
    closingMessage: "Kehadiran dan doa restu kalian adalah hadiah paling berharga buat kami berdua. Sampai ketemu di hari bahagia kami yaa, jangan lupa makan yang kenyang!",
  },

  countdownTarget: "2026-12-12T09:00:00+07:00",

  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      subTitle: "Momen Sakral Ijab Kabul",
      badgeCute: "Janji Suci Sehidup Semati 💍",
      dateStr: "2026-12-12T08:00:00+07:00",
      displayDate: "12 Desember 2026",
      displayDay: "Sabtu Pagi",
      time: "08:00 - 10:00 WIB",
      venueName: "Masjid Agung Kubah Emas & Pavilion",
      venueAddress: "Jl. Meruyung Raya No. 45, Limo, Kota Depok, Jawa Barat",
      mapUrl: "https://maps.google.com/?q=Masjid+Dian+Al-Mahri+Kubah+Emas+Depok",
      calendarEvent: {
        title: "Akad Nikah Dimas & Sarah",
        description: "Momen sakral janji nikah Dimas Arya Pratama & Sarah Annisa Larasati",
        location: "Masjid Agung Kubah Emas & Pavilion, Depok",
        startDate: "20261212T080000",
        endDate: "20261212T100000",
      },
    },
    {
      id: "resepsi",
      title: "Pesta Resepsi",
      subTitle: "Makan Enak & Ramah Tamah",
      badgeCute: "Makan, Foto & Joget Bareng! 🍰",
      dateStr: "2026-12-12T11:00:00+07:00",
      displayDate: "12 Desember 2026",
      displayDay: "Sabtu Siang",
      time: "11:00 - 14:00 WIB",
      venueName: "Grand Cempaka Ballroom & Glasshouse",
      venueAddress: "Jl. Letjen Suprapto No. 100, Cempaka Putih, Jakarta Pusat",
      mapUrl: "https://maps.google.com/?q=Grand+Cempaka+Jakarta",
      calendarEvent: {
        title: "Resepsi Pernikahan Dimas & Sarah",
        description: "Pesta perayaan pernikahan Dimas Arya Pratama & Sarah Annisa Larasati",
        location: "Grand Cempaka Ballroom & Glasshouse, Jakarta Pusat",
        startDate: "20261212T110000",
        endDate: "20261212T140000",
      },
    },
  ] as EventDetail[],

  stories: [
    {
      year: "2020",
      title: "Ketemu Gara-Gara Es Kopi",
      story: "Lagi workshop desain di Jogja, Dimas ga sengaja numpahin es kopi ke sketchbook Sarah. Dari minta maaf panik, malah berlanjut ngobrol 4 jam nonstop!",
      cuteReaction: "Oops, takdir berkedok keteledoran ☕😅",
      photoCaption: "Wajah canggung waktu baru kenal!",
    },
    {
      year: "2022",
      title: "Resmi Pacaran & Partner Jajan",
      story: "Setelah ratusan mangkok bakso dan mie ayam dilahap berdua, Dimas akhirnya memberanikan diri nembak Sarah di puncak bukit sambil bawa cilok kesukaan Sarah.",
      cuteReaction: "Diterima karena bawa cilok yang masih anget 🍡❤️",
      photoCaption: "Masa-masa bucin tingkat dewa",
    },
    {
      year: "2025",
      title: "Dilamar di Hadapan Keluarga",
      story: "Dimas datang bersama keluarga besar sambil bawa seserahan dan senyum gemeteran. Sarah langsung bilang 'YES!' tanpa mikir dua kali (keburu laper).",
      cuteReaction: "Cincinnya pas, makanannya ludes! 💍✨",
      photoCaption: "Resmi tukar cincin & restu orang tua",
    },
    {
      year: "2026",
      title: "Hari Paling Sah & Bahagia",
      story: "Bismillah, babak baru resmi dimulai! Siap jadi tim kompak seumur hidup, saling support, dan ga berantem rebutan remot TV.",
      cuteReaction: "Sah, halal, dan bahagia selamanya! 🥳🎉",
      photoCaption: "Ready for our biggest adventure!",
    },
  ] as LoveStoryItem[],

  gallery: [
    {
      id: 1,
      caption: "Muka sok estetik padahal lagi nahan ketawa",
      tag: "Prewedding 01",
      doodleSticker: "Cute Couple 💑",
      aspectRatio: "portrait",
    },
    {
      id: 2,
      caption: "Di pantai senja, pura-pura romantis padahal kelilipan pasir",
      tag: "Sunset Vows",
      doodleSticker: "Golden Hour 🌅",
      aspectRatio: "landscape",
    },
    {
      id: 3,
      caption: "Foto candid waktu Dimas keceplosan ngelawak garing",
      tag: "Laughter",
      doodleSticker: "Haha Lucu Banget 😂",
      aspectRatio: "square",
    },
    {
      id: 4,
      caption: "Dua cincin pengikat janji anti kabur-kabur club",
      tag: "The Rings",
      doodleSticker: "Shinning Bright 💎",
      aspectRatio: "landscape",
    },
    {
      id: 5,
      caption: "Sarah yang cantik maksimal dan Dimas yang beruntung banget",
      tag: "Prewedding 02",
      doodleSticker: "Bidadari Dimas 👸",
      aspectRatio: "portrait",
    },
    {
      id: 6,
      caption: "Jalan santai di taman pinus sambil mikirin mau makan apa abis ini",
      tag: "Nature Vibe",
      doodleSticker: "Forever Together 🌲",
      aspectRatio: "square",
    },
  ] as GalleryPhoto[],

  gifts: {
    accounts: [
      {
        bankName: "Bank Central Asia (BCA)",
        accountNumber: "8410294821",
        accountHolder: "DIMAS ARYA PRATAMA",
        logoText: "BCA",
        cuteLabel: "Celengan Modal Rumah Tangga 🏡",
      },
      {
        bankName: "Bank Mandiri",
        accountNumber: "1370019283742",
        accountHolder: "SARAH ANNISA LARASATI",
        logoText: "MANDIRI",
        cuteLabel: "Tabungan Boba & Honeymoon 🧋✈️",
      },
    ] as BankAccount[],
    physicalGiftAddress: {
      recipient: "Dimas & Sarah (Markas Cinta)",
      phone: "+62 812-3456-7890",
      address: "Jl. Cempaka Indah No. 18, RT 04 / RW 07, Kebayoran Baru, Jakarta Selatan, 12150",
    },
  },

  dresscode: {
    description: "Dresscode bebas yang penting sopan, cakep, dan nyaman! Tapi kalau mau kembaran warna sama kami:",
    colors: [
      { name: "Deep Maroon", hex: "#7D1128" },
      { name: "Rose Blush", hex: "#F5A8B8" },
      { name: "Marshmallow Cream", hex: "#FFF0F3" },
      { name: "Warm Mocha", hex: "#6E453B" },
      { name: "Golden Honey", hex: "#E5A93C" },
    ],
  },

  initialWishes: [
    {
      id: "w1",
      name: "Raditya Maulana (Bestie Dimas)",
      relationship: "Sahabat Seperjuangan",
      attendance: "Hadir dong! 😋",
      message: "AKHIRNYA SAHHH!! Selamat ya Mas Dimas dan Sarah! Jangan lupa Sarah, Dimas kalau tidur suka ngorok kayak knalpot bobokan. Siap-siap earplug yaa wkwk. Happy wedding lovebirds!",
      date: "1 jam lalu",
    },
    {
      id: "w2",
      name: "dr. Nabila Putri (Bestie Sarah)",
      relationship: "Teman Ghibah Halal",
      attendance: "Hadir dong! 😋",
      message: "Sarah cantiku gemessss banget! Mas Dimas tolong dijaga tuan putri ini ya, jangan sampai telat makan nanti ngamuk hehe. Can't wait to see you both on stage!",
      date: "3 jam lalu",
    },
    {
      id: "w3",
      name: "Yoga & Istri",
      relationship: "Rekan Kantor Dimas",
      attendance: "Hadir dong! 😋",
      message: "Selamat menempuh hidup baru Dimas & Sarah! Semoga rumah tangganya selalu penuh tawa, berkah, dan rezeki melimpah ruah!",
      date: "Kemarin, 20:15",
    },
    {
      id: "w4",
      name: "Geng Bakso & Cilok",
      relationship: "Sobat Kuliner",
      attendance: "Hadir dong! 😋",
      message: "Kondangan paling ditunggu tahun ini! Siap menghabiskan zuppa soup dan kambing guling di resepsi yaa! Samawa kalian berdua!",
      date: "Kemarin, 21:40",
    },
  ] as WishMessage[],
};
