import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  ico: "image/x-icon",
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
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const targetFile = path.join(uploadsDir, safeFile);

    if (!fsSync.existsSync(targetFile)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const ext = path.extname(targetFile).toLowerCase().replace(".", "");
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileBuffer = await fs.readFile(targetFile);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("Error serving uploaded image:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
