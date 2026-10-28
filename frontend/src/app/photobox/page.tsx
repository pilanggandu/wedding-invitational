import type { Metadata } from "next";
import { PhotoboxStudio } from "@/components/photobox/PhotoboxStudio";

export const metadata: Metadata = {
  title: "Photobox Studio Kenangan • Gilang & Salsa Wedding",
  description:
    "Ambil foto seru ala photobox Korea (Life Four Cuts / Haru Film) dengan 25+ template frame estetik untuk mengabadikan momen spesialmu.",
};

export default function PhotoboxPage() {
  return <PhotoboxStudio />;
}
