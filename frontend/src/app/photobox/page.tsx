import type { Metadata } from "next";
import { PhotoboxStudio } from "@/components/photobox/PhotoboxStudio";

export const metadata: Metadata = {
  title: "Photobox Studio Kenangan • Gilang & Salsa Wedding",
  description:
    "Ambil foto seru ala photobox dengan frame bordir renda & beludru resmi Sadil & Gilang (limit 2 pose) untuk mengabadikan momen spesialmu.",
};

export default function PhotoboxPage() {
  return <PhotoboxStudio />;
}
