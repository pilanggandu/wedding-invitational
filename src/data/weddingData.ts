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
      fullName: "Gilang Pratama, S.Kom.",
      tagline: "Cowok yang hobi gambar dan selalu ngalah sama Salsadila",
      bioFunny: "Suka kopi susu gula aren, jago bikin lelucon konyol yang cuma Salsadila yang paham.",
      parents: "Bapak Bambang Wijaya & Ibu Sri Rahayu",
      instagram: "gilangpratama_",
      photoPlaceholder: {
        title: "The Groom",
        caption: "Gilang si anak baik yang siap jadi suami",
        aspectRatio: "3/4",
        variant: "groom",
      },
    } as GroomBrideInfo,
    bride: {
      name: "Salsadila",
      fullName: "Salsadila Annisa Larasati, S.Ds.",
      tagline: "Cewek ceria yang suka warna-warni dan jajan es krim",
      bioFunny: "Paling suka es krim vanila, suka merajuk lucu kalau laper, tapi hatinya sehangat matahari pagi.",
      parents: "Bapak Ir. Hendra Kusuma & Ibu Hj. Ratna Sari",
      instagram: "salsadilaannisa_",
      photoPlaceholder: {
        title: "The Bride",
        caption: "Salsadila si tuan putri penuh warna",
        aspectRatio: "3/4",
        variant: "bride",
      },
    } as GroomBrideInfo,
  },

  general: {
    hashtag: "#GilangSalsadilaSah",
    funTagline: "Perayaan cinta dua manusia gemas yang dipenuhi tawa, doa, dan rasa syukur!",
    musicTitle: "Acoustic Serenade of Joy",
    musicArtist: "Melodi Cinta Gilang & Salsadila",
    quote: {
      arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
      translation: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram dan damai kepadanya.",
      source: "QS. Ar-Rum: 21",
    },
    openingGreetings: "Assalamu'alaikum & Halo Teman-Teman Semua!",
    openingMessage: "Dengan rasa syukur yang melimpah dan senyum paling bahagia, kami mengundang teman-teman dan keluarga untuk hadir di hari pernikahan kami:",
    closingMessage: "Kehadiran serta doa restu teman-teman adalah hadiah terbaik buat kami berdua. Sampai jumpa di pesta pernikahan kami, jangan lupa makan yang kenyang ya!",
  },

  countdownTarget: "2026-11-21T09:00:00+07:00",

  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      subTitle: "Upacara Ijab Kabul Sakral",
      badgeCute: "Momen Sakral & Janji Suci 💍",
      colorTheme: "red",
      dateStr: "2026-11-21T08:00:00+07:00",
      displayDate: "21 November 2026",
      displayDay: "Sabtu Pagi",
      time: "08:00 - 10:00 WIB",
      venueName: "Masjid Agung Kubah Emas & Pavilion",
      venueAddress: "Jl. Meruyung Raya No. 45, Limo, Kota Depok, Jawa Barat",
      mapUrl: "https://maps.google.com/?q=Masjid+Dian+Al-Mahri+Kubah+Emas+Depok",
      calendarEvent: {
        title: "Akad Nikah Gilang & Salsadila",
        description: "Janji suci pernikahan Gilang Pratama dan Salsadila Annisa",
        location: "Masjid Agung Kubah Emas & Pavilion, Depok",
        startDate: "20261121T080000",
        endDate: "20261121T100000",
      },
    },
    {
      id: "resepsi",
      title: "Pesta Resepsi",
      subTitle: "Makan Enak & Rayakan Bahagia",
      badgeCute: "Makan Enak, Foto & Ceria Bersama! 🍰",
      colorTheme: "yellow",
      dateStr: "2026-11-21T11:00:00+07:00",
      displayDate: "21 November 2026",
      displayDay: "Sabtu Siang",
      time: "11:00 - 14:00 WIB",
      venueName: "Grand Cempaka Ballroom & Glasshouse",
      venueAddress: "Jl. Letjen Suprapto No. 100, Cempaka Putih, Jakarta Pusat",
      mapUrl: "https://maps.google.com/?q=Grand+Cempaka+Jakarta",
      calendarEvent: {
        title: "Resepsi Pernikahan Gilang & Salsadila",
        description: "Pesta perayaan pernikahan penuh warna Gilang Pratama dan Salsadila Annisa",
        location: "Grand Cempaka Ballroom & Glasshouse, Jakarta Pusat",
        startDate: "20261121T110000",
        endDate: "20261121T140000",
      },
    },
  ] as EventDetail[],

  stories: [
    {
      year: "2020",
      title: "Kenalan Gara-Gara Es Kopi",
      story: "Waktu workshop gambar di Jogja, Gilang ga sengaja menumpahkan es kopi ke buku sketsa Salsadila. Dari minta maaf panik, malah berlanjut ngobrol seru berjam-jam!",
      cuteReaction: "Awal mula takdir gambar bareng ☕🎨",
      photoCaption: "Wajah malu-malu pas pertama kenal",
      badgeColor: "bg-[#FDE047]",
    },
    {
      year: "2022",
      title: "Resmi Pacaran & Partner Makan Es Krim",
      story: "Setelah ratusan mangkok bakso dan es krim dilahap berdua, Gilang akhirnya memberanikan diri menyatakan cinta sambil bawain cilok hangat favorit Salsadila.",
      cuteReaction: "Langsung diterima karena ciloknya enak! 🍡❤️",
      photoCaption: "Masa-masa jalan sore berdua",
      badgeColor: "bg-[#F472B6]",
    },
    {
      year: "2025",
      title: "Lamaran & Cincin Janji",
      story: "Gilang datang bersama keluarga besar membawa cincin dan senyum cerah. Salsadila langsung menjawab 'Iya!' dengan hati gembira.",
      cuteReaction: "Cincinnya berkilau indah 💍✨",
      photoCaption: "Hari tukar cincin penuh senyum",
      badgeColor: "bg-[#60A5FA]",
    },
    {
      year: "2026",
      title: "Menuju Pelaminan Bahagia",
      story: "Bismillah, petualangan terbesar kami dimulai. Siap jadi tim paling kompak seumur hidup dan selalu saling menjaga dalam suka maupun duka.",
      cuteReaction: "Sah, halal, dan ceria selamanya! 🥳🌈",
      photoCaption: "Siap melangkah ke masa depan!",
      badgeColor: "bg-[#4ADE80]",
    },
  ] as LoveStoryItem[],

  gallery: [
    {
      id: 1,
      caption: "Potret berdua dengan senyum paling lebar",
      tag: "Foto 01",
      doodleSticker: "Cute Couple 👫",
      stickerBg: "bg-[#FDE047]",
      aspectRatio: "portrait",
    },
    {
      id: 2,
      caption: "Momen sore di pantai sambil kejar-kejaran ombak",
      tag: "Pantai Senja",
      doodleSticker: "Sunny Day ☀️",
      stickerBg: "bg-[#F472B6]",
      aspectRatio: "landscape",
    },
    {
      id: 3,
      caption: "Tawa lepas waktu Gilang pura-pura jadi robot",
      tag: "Tawa Ceria",
      doodleSticker: "Haha Lucu! 😂",
      stickerBg: "bg-[#60A5FA]",
      aspectRatio: "square",
    },
    {
      id: 4,
      caption: "Dua cincin janji suci di atas kertas gambar",
      tag: "Cincin Emas",
      doodleSticker: "Shining Star ⭐",
      stickerBg: "bg-[#FDE047]",
      aspectRatio: "landscape",
    },
    {
      id: 5,
      caption: "Salsadila yang cantik bersinar seperti bunga matahari",
      tag: "Foto 02",
      doodleSticker: "Tuan Putri 🌻",
      stickerBg: "bg-[#4ADE80]",
      aspectRatio: "portrait",
    },
    {
      id: 6,
      caption: "Jalan bergandengan tangan di taman pinus yang teduh",
      tag: "Taman Asri",
      doodleSticker: "Forever Together 🌲",
      stickerBg: "bg-[#C084FC]",
      aspectRatio: "square",
    },
  ] as GalleryPhoto[],

  gifts: {
    accounts: [
      {
        bankName: "Bank Central Asia (BCA)",
        accountNumber: "8410294821",
        accountHolder: "GILANG PRATAMA",
        logoText: "BCA",
        cuteLabel: "Celengan Rumah Masa Depan 🏡",
        cardColor: "gold",
      },
      {
        bankName: "Bank Mandiri",
        accountNumber: "1370019283742",
        accountHolder: "SALSADILA ANNISA LARASATI",
        logoText: "MANDIRI",
        cuteLabel: "Tabungan Honeymoon & Jajan Boba 🧋✈️",
        cardColor: "maroon",
      },
    ] as BankAccount[],
    physicalGiftAddress: {
      recipient: "Gilang & Salsadila (Kotak Kado Cinta)",
      phone: "+62 812-3456-7890",
      address: "Jl. Cempaka Indah No. 18, RT 04 / RW 07, Kebayoran Baru, Jakarta Selatan, 12150",
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

  initialWishes: [
    {
      id: "w1",
      name: "Raditya Maulana (Sahabat Gilang)",
      relationship: "Sahabat Kuliah",
      attendance: "Hadir dong! 😋",
      message: "Alhamdulillah akhirnya sah! Selamat ya Gilang dan Salsadila! Semoga selalu rukun, bahagia, dan rumah tangganya penuh tawa ceria!",
      date: "1 jam lalu",
    },
    {
      id: "w2",
      name: "dr. Nabila Putri (Sahabat Salsadila)",
      relationship: "Teman SMA Salsadila",
      attendance: "Hadir dong! 😋",
      message: "Salsadila cantiku gemas banget! Mas Gilang tolong dijaga baik-baik tuan putri ini ya. Selamat menempuh hidup baru kalian berdua!",
      date: "3 jam lalu",
    },
    {
      id: "w3",
      name: "Yoga & Keluarga",
      relationship: "Rekan Kantor Gilang",
      attendance: "Hadir dong! 😋",
      message: "Selamat untuk Gilang dan Salsadila beserta keluarga besar. Semoga acaranya berjalan lancar dari awal sampai akhir!",
      date: "Kemarin, 20:15",
    },
    {
      id: "w4",
      name: "Geng Kuliner Jogja",
      relationship: "Teman Nostalgia",
      attendance: "Hadir dong! 😋",
      message: "Undangan paling ceria tahun ini! Siap hadir meramaikan pesta resepsi ya! Samawa untuk kalian berdua!",
      date: "Kemarin, 21:40",
    },
  ] as WishMessage[],
};
