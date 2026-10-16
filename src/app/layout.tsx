import type { Metadata } from "next";
import { Great_Vibes, Caveat, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "The Wedding of Gilang & Salsadila - Undangan Digital Paper Art",
  description: "Undangan Pernikahan Digital Eksklusif dengan tema Paper Art Craft & Handcrafted Typography",
  icons: {
    icon: "/favicon.ico",
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
        {children}
      </body>
    </html>
  );
}
