import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getUploadsDir(): string {
  const cwd = process.cwd();
  if (path.basename(cwd) === "frontend") {
    return path.join(cwd, "public", "uploads");
  }
  if (fsSync.existsSync(path.join(cwd, "frontend", "public"))) {
    return path.join(cwd, "frontend", "public", "uploads");
  }
  return path.join(cwd, "public", "uploads");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan" }, { status: 400 });
    }

    const rawExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const validExts = ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"];
    const ext = validExts.includes(rawExt) ? rawExt : "jpg";

    const baseName =
      file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_\- ]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .slice(0, 40) || "photo";

    const fileName = `${baseName}_${Date.now()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicUploadDir = getUploadsDir();
    await fs.mkdir(publicUploadDir, { recursive: true });
    await fs.writeFile(path.join(publicUploadDir, fileName), buffer);

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      fileName,
      size: buffer.length,
    });
  } catch (err: unknown) {
    console.error("Upload image error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengunggah file gambar" },
      { status: 500 }
    );
  }
}
