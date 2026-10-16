import type { Metadata } from "next";
import { BirthdayScrapbook } from "@/components/scrapbook/BirthdayScrapbook";

export const metadata: Metadata = {
  title: "Happy Birthday, Bestie! · Birthday Scrapbook",
  description: "Sepotong kenangan untuk hari istimewa. Buat scrapbook ulang tahun dengan foto, catatan kecil, dan kalender milikmu.",
};

export default function ScrapbookPage() {
  return <BirthdayScrapbook />;
}
