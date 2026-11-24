import type { Metadata, Viewport } from "next";
import { Great_Vibes, Caveat, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const siteBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://wedding-invitational.vercel.app");

export const viewport: Viewport = {
  themeColor: "#541E24",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: "The Wedding of Gilang & Salsadila | Undangan Pernikahan Digital",
    template: "%s | The Wedding of Gilang & Salsa",
  },
  description:
    "Undangan Pernikahan Digital Eksklusif Gilang Pandu Permadi & Salsadila Nanda Octavia. Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu.",
  applicationName: "The Wedding of Gilang & Salsa",
  authors: [{ name: "Gilang & Salsadila" }],
  keywords: [
    "Undangan Pernikahan Digital",
    "Wedding Invitation",
    "Gilang & Salsa",
    "Paper Art Wedding",
    "The Wedding of Gilang & Salsadila",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/undangan",
    siteName: "The Wedding of Gilang & Salsa",
    title: "The Wedding of Gilang & Salsadila",
    description:
      "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia pernikahan kami.",
    images: [
      {
        url: "/images/og-wedding-preview.png",
        width: 1200,
        height: 630,
        alt: "The Wedding of Gilang & Salsadila - Undangan Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wedding of Gilang & Salsadila",
    description:
      "Undangan Pernikahan Digital Eksklusif Gilang Pandu Permadi & Salsadila Nanda Octavia.",
    images: ["/images/og-wedding-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${greatVibes.variable} ${caveat.variable} ${playfair.variable} ${jakarta.variable} scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Amiri:ital,wght@0,400;0,700;1,400&family=Caveat:wght@400..700&family=Cinzel:wght@400..900&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Dancing+Script:wght@400..700&family=Great+Vibes&family=Lora:ital,wght@0,400..700;1,400..700&family=Marck+Script&family=Montserrat:wght@300..800&family=Pacifico&family=Parisienne&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Prata&family=Sacramento&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF6EE] text-[#3A332C] font-sans antialiased selection:bg-[#E5B6A0] selection:text-[#2A241D] min-h-screen">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
