import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: {
          include: {
            parent: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Related products (same category or brand)
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          { brandId: product.brandId },
        ],
      },
      include: {
        brand: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      take: 4,
    });

    // Available lens options
    const lensOptions = await prisma.lensOption.findMany({
      orderBy: { price: "asc" },
    });

    // Average rating
    const ratingCount = product.reviews.length;
    const averageRating =
      ratingCount > 0
        ? Number(
            (
              product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              ratingCount
            ).toFixed(1)
          )
        : 5.0;

    return NextResponse.json({
      product: {
        ...product,
        rating: averageRating,
        reviewCount: ratingCount,
      },
      relatedProducts,
      lensOptions,
    });
  } catch (error) {
    console.error("Product detail GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
