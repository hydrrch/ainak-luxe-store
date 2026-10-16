import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const lenses = await prisma.lensOption.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ lenses });
  } catch (error) {
    console.error("Public lenses GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lenses" },
      { status: 500 }
    );
  }
}
