import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  weba: "audio/webm",
  flac: "audio/flac",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ file: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const fileSegments = resolvedParams?.file;

    if (!fileSegments || !Array.isArray(fileSegments) || fileSegments.length === 0) {
      return new NextResponse("File not specified", { status: 400 });
    }

    const safeFile = path.basename(fileSegments.join("/"));
    const audioDir = path.join(process.cwd(), "public", "audio");
    const targetFile = path.join(audioDir, safeFile);

    if (!fsSync.existsSync(targetFile)) {
      return new NextResponse("Audio not found", { status: 404 });
    }

    const ext = path.extname(targetFile).toLowerCase().replace(".", "");
    const contentType = MIME_TYPES[ext] || "audio/mpeg";
    const fileBuffer = await fs.readFile(targetFile);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Accept-Ranges": "bytes",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("Error serving uploaded audio:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
