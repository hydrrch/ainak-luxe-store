import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("prescription")) as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No prescription image file provided" },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file format. Please upload a JPG, PNG, or PDF image of your prescription." },
        { status: 400 }
      );
    }

    // Limit file size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Prescription file size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "prescriptions");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `rx-${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/prescriptions/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      message: "Prescription slip uploaded successfully!",
    });
  } catch (error) {
    console.error("Prescription upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload prescription slip." },
      { status: 500 }
    );
  }
}
