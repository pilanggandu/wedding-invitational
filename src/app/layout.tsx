import type { Metadata } from "next";
import { Great_Vibes, Caveat, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Wedding of Dimas & Sarah - Undangan Digital Paper Art",
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
      <body className="bg-[#FAF6EE] text-[#3A332C] font-sans antialiased selection:bg-[#E5B6A0] selection:text-[#2A241D] min-h-screen">
        {children}
      </body>
    </html>
  );
}
