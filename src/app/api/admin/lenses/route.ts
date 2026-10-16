import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromReq } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const lenses = await prisma.lensOption.findMany({
      orderBy: { price: "asc" },
      include: {
        _count: {
          select: { orderItems: true, cartItems: true },
        },
      },
    });

    return NextResponse.json({ lenses });
  } catch (error) {
    console.error("Admin lenses GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lens options" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, type, price, description, features, isActive = true } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Name and Price are required" },
        { status: 400 }
      );
    }

    const lens = await prisma.lensOption.create({
      data: {
        name,
        type: type || "SINGLE_VISION",
        price: parseFloat(price),
        description: description || null,
        features: features || null,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({
      success: true,
      lens,
      message: "Lens option created successfully",
    });
  } catch (error) {
    console.error("Admin lens POST error:", error);
    return NextResponse.json(
      { error: "Failed to create lens option" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, name, type, price, description, features, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Lens ID is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.lensOption.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(description !== undefined && { description }),
        ...(features !== undefined && { features }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      lens: updated,
      message: "Lens option updated successfully",
    });
  } catch (error) {
    console.error("Admin lens PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update lens option" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Lens ID is required" },
        { status: 400 }
      );
    }

    await prisma.lensOption.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Lens option deleted successfully",
    });
  } catch (error) {
    console.error("Admin lens DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete lens option. It may be linked to existing orders." },
      { status: 500 }
    );
  }
}
