import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File audio tidak ditemukan" }, { status: 400 });
    }

    const rawExt = file.name.split(".").pop()?.toLowerCase() || "mp3";
    const validExts = ["mp3", "wav", "ogg", "m4a", "aac", "weba", "flac"];
    const ext = validExts.includes(rawExt) ? rawExt : "mp3";

    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_\- ]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 40) || "custom_audio";

    const fileName = `${baseName}_${Date.now()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicAudioDir = path.join(process.cwd(), "public", "audio");
    await fs.mkdir(publicAudioDir, { recursive: true });
    await fs.writeFile(path.join(publicAudioDir, fileName), buffer);

    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]+/g, " ")
      .trim();

    return NextResponse.json({
      url: `/audio/${fileName}`,
      fileName,
      title: cleanTitle,
      size: buffer.length,
    });
  } catch (err: unknown) {
    console.error("Upload audio error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengunggah file audio" },
      { status: 500 }
    );
  }
}
