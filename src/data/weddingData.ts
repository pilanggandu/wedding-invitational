export interface GroomBrideInfo {
  name: string;
  fullName: string;
  tagline: string;
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
  dateStr: string; // ISO string for calendar/countdown
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
    startDate: string; // YYYYMMDDTHHmmss
    endDate: string;
  };
}

export interface LoveStoryItem {
  year: string;
  title: string;
  story: string;
  photoCaption: string;
}

export interface GalleryPhoto {
  id: number;
  caption: string;
  tag: string;
  aspectRatio: "square" | "portrait" | "landscape";
  orientationClass: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoText: string;
  colorScheme: "blue" | "yellow" | "red" | "green";
}

export interface WishMessage {
  id: string;
  name: string;
  relationship: string;
  attendance: "Hadir" | "Tidak Hadir" | "Masih Ragu";
  message: string;
  date: string;
}

export const WEDDING_DATA = {
  couple: {
    groom: {
      name: "Dimas",
      fullName: "Dimas Arya Pratama, S.T.",
      tagline: "Putra pertama dari dua bersaudara",
      parents: "Bapak Bambang Wijaya & Ibu Sri Rahayu",
      instagram: "dimaspratama_",
      photoPlaceholder: {
        title: "The Groom",
        caption: "Dimas Arya Pratama",
        aspectRatio: "3/4",
        variant: "groom",
      },
    } as GroomBrideInfo,
    bride: {
      name: "Sarah",
      fullName: "Sarah Annisa Larasati, S.Ds.",
      tagline: "Putri bungsu dari tiga bersaudara",
      parents: "Bapak Ir. Hendra Kusuma & Ibu Hj. Ratna Sari",
      instagram: "sarahlarasati_",
      photoPlaceholder: {
        title: "The Bride",
        caption: "Sarah Annisa Larasati",
        aspectRatio: "3/4",
        variant: "bride",
      },
    } as GroomBrideInfo,
  },
  
  general: {
    hashtag: "#DimasMenemukanSarah",
    musicTitle: "A Thousand Years - Instrumental Acoustic Guitar",
    musicArtist: "The Wedding Ensemble",
    quote: {
      arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
      translation: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
      source: "QS. Ar-Rum: 21",
    },
    openingGreetings: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    openingMessage: "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri perayaan pernikahan putra-putri kami:",
    closingMessage: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.",
  },

  countdownTarget: "2026-12-12T09:00:00+07:00", // Wedding Day Date

  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      subTitle: "Upacara Ijab Kabul Sakral",
      dateStr: "2026-12-12T08:00:00+07:00",
      displayDate: "12 Desember 2026",
      displayDay: "Sabtu",
      time: "08:00 - 10:00 WIB",
      venueName: "Masjid Agung Kubah Emas & Pavilion",
      venueAddress: "Jl. Meruyung Raya No. 45, Limo, Kota Depok, Jawa Barat",
      mapUrl: "https://maps.google.com/?q=Masjid+Dian+Al-Mahri+Kubah+Emas+Depok",
      calendarEvent: {
        title: "Akad Nikah Dimas & Sarah",
        description: "Akad Nikah pernikahan Dimas Arya Pratama & Sarah Annisa Larasati",
        location: "Masjid Agung Kubah Emas & Pavilion, Depok",
        startDate: "20261212T080000",
        endDate: "20261212T100000",
      },
    },
    {
      id: "resepsi",
      title: "Resepsi Pernikahan",
      subTitle: "Ramah Tamah & Perayaan Bahagia",
      dateStr: "2026-12-12T11:00:00+07:00",
      displayDate: "12 Desember 2026",
      displayDay: "Sabtu",
      time: "11:00 - 14:00 WIB",
      venueName: "Grand Cempaka Ballroom & Glasshouse",
      venueAddress: "Jl. Letjen Suprapto No. 100, Cempaka Putih, Jakarta Pusat",
      mapUrl: "https://maps.google.com/?q=Grand+Cempaka+Jakarta",
      calendarEvent: {
        title: "Resepsi Pernikahan Dimas & Sarah",
        description: "Resepsi pernikahan Dimas Arya Pratama & Sarah Annisa Larasati",
        location: "Grand Cempaka Ballroom & Glasshouse, Jakarta Pusat",
        startDate: "20261212T110000",
        endDate: "20261212T140000",
      },
    },
  ] as EventDetail[],

  stories: [
    {
      year: "2020",
      title: "Pertemuan Pertama",
      story: "Takdir mempertemukan kami di sebuah workshop desain dan arsitektur di Yogyakarta. Sebuah obrolan hangat tentang secangkir kopi saring mengawali perjalanan cerita kami.",
      photoCaption: "Kenangan Pertama di Malioboro, 2020",
    },
    {
      year: "2022",
      title: "Menjalin Komitmen",
      story: "Setelah dua tahun saling berbagi cerita, tawa, dan suka duka, kami memutuskan untuk saling melengkapi dan melangkah bersama dengan keyakinan yang mantap.",
      photoCaption: "Langkah Bersama di Kebun Raya Bogor, 2022",
    },
    {
      year: "2025",
      title: "Hari Lamaran",
      story: "Di hadapan kedua keluarga besar tercinta, sebuah janji diikrarkan. Langkah menuju babak baru yang penuh berkah diiringi doa dan restu orang tua.",
      photoCaption: "Momen Tukar Cincin & Restu Keluarga, 2025",
    },
    {
      year: "2026",
      title: "Menuju Babak Abadi",
      story: "Kini, kami bersiap menyatukan doa, mimpi, dan cita-cita dalam ikatan suci pernikahan yang diridhoi-Nya seumur hidup.",
      photoCaption: "Menatap Masa Depan Berdua, 2026",
    },
  ] as LoveStoryItem[],

  gallery: [
    {
      id: 1,
      caption: "Potret Bersama dalam Balutan Busana Tradisional Nusantara",
      tag: "Prewedding I",
      aspectRatio: "portrait",
      orientationClass: "col-span-1 row-span-2",
    },
    {
      id: 2,
      caption: "Momen Hangat Berdua di Pinggir Pantai Kala Senja",
      tag: "Sunset Vows",
      aspectRatio: "landscape",
      orientationClass: "col-span-1 row-span-1",
    },
    {
      id: 3,
      caption: "Tawa Spontan yang Mengabadikan Kebahagiaan Kami",
      tag: "Candid Moments",
      aspectRatio: "square",
      orientationClass: "col-span-1 row-span-1",
    },
    {
      id: 4,
      caption: "Cincin Pengikat Janji di Atas Kertas Surat Cinta",
      tag: "The Rings",
      aspectRatio: "landscape",
      orientationClass: "col-span-1 row-span-1",
    },
    {
      id: 5,
      caption: "Tatapan Penuh Syukur Menyambut Hari yang Dinantikan",
      tag: "Prewedding II",
      aspectRatio: "portrait",
      orientationClass: "col-span-1 row-span-2",
    },
    {
      id: 6,
      caption: "Langkah Bersama di Tengah Keasrian Taman Pinus",
      tag: "Nature Serenade",
      aspectRatio: "square",
      orientationClass: "col-span-1 row-span-1",
    },
  ] as GalleryPhoto[],

  gifts: {
    accounts: [
      {
        bankName: "Bank Central Asia (BCA)",
        accountNumber: "8410294821",
        accountHolder: "DIMAS ARYA PRATAMA",
        logoText: "BCA",
        colorScheme: "blue",
      },
      {
        bankName: "Bank Mandiri",
        accountNumber: "1370019283742",
        accountHolder: "SARAH ANNISA LARASATI",
        logoText: "MANDIRI",
        colorScheme: "yellow",
      },
    ] as BankAccount[],
    physicalGiftAddress: {
      recipient: "Dimas & Sarah (Wedding Gift)",
      phone: "+62 812-3456-7890",
      address: "Jl. Cempaka Indah No. 18, RT 04 / RW 07, Kebayoran Baru, Jakarta Selatan, 12150",
    },
  },

  dresscode: {
    description: "Kami mengapresiasi kehadiran tamu dalam nuansa warna hangat bertema Earthy Paper & Terracotta:",
    colors: [
      { name: "Terracotta", hex: "#C26D53" },
      { name: "Warm Cream", hex: "#F3EAD8" },
      { name: "Kraft Sand", hex: "#D6C2A7" },
      { name: "Soft Sage", hex: "#8A9A86" },
      { name: "Espresso", hex: "#4A3E37" },
    ],
  },

  initialWishes: [
    {
      id: "w1",
      name: "Raditya Maulana & Keluarga",
      relationship: "Sahabat Kuliah Dimas",
      attendance: "Hadir",
      message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Selamat melangkah ke jenjang baru saudaraku Dimas dan Sarah! Semoga langgeng dan selalu dilimpahi keberkahan.",
      date: "Kemarin, 14:20",
    },
    {
      id: "w2",
      name: "dr. Nabila Putri, Sp.A",
      relationship: "Teman SMA Sarah",
      attendance: "Hadir",
      message: "Masya Allah Sarah cantik, akhirnya berlabuh juga di pelabuhan terbaik. Selamat menempuh hidup baru ya, semoga sakinah mawaddah warahmah selalu! See you at the wedding!",
      date: "Kemarin, 18:45",
    },
    {
      id: "w3",
      name: "Keluarga Besar Bpk. H. Sutrisno",
      relationship: "Kerabat Keluarga",
      attendance: "Hadir",
      message: "Selamat untuk Dimas dan Sarah beserta kedua keluarga besar. Semoga Allah SWT memberkahi kedua mempelai dengan keturunan yang sholeh dan sholehah.",
      date: "Hari ini, 09:12",
    },
    {
      id: "w4",
      name: "Yoga Anggoro & Istri",
      relationship: "Rekan Kerja Sarah",
      attendance: "Hadir",
      message: "Selamat ya Sarah dan Mas Dimas! Semoga acaranya dilancarkan dari akad hingga resepsi. Doa terbaik untuk rumah tangga kalian.",
      date: "Hari ini, 11:30",
    },
  ] as WishMessage[],
};
