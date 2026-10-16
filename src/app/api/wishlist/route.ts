import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromReq } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ wishlist: [] });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            brand: true,
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ wishlist: items });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to add items to your wishlist" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existing) {
      // Toggle off
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({
        saved: false,
        message: "Removed from wishlist",
      });
    }

    await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId,
      },
    });

    return NextResponse.json({
      saved: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
