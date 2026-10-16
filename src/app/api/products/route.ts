import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim();
    const categorySlug = searchParams.get("category");
    const brandSlug = searchParams.get("brand");
    const gender = searchParams.get("gender")?.toUpperCase();
    const shape = searchParams.get("shape")?.toUpperCase();
    const material = searchParams.get("material")?.toUpperCase();
    const rim = searchParams.get("rim")?.toUpperCase();
    const size = searchParams.get("size")?.toUpperCase();
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const inStockOnly = searchParams.get("inStock") === "true";
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
        { brand: { name: { contains: search } } },
      ];
    }

    if (categorySlug) {
      where.category = {
        OR: [
          { slug: categorySlug },
          { parent: { slug: categorySlug } }
        ]
      };
    }

    if (brandSlug) {
      const brandSlugs = brandSlug.split(",").map(b => b.trim());
      where.brand = { slug: { in: brandSlugs } };
    }

    if (gender && gender !== "ALL") {
      where.gender = gender;
    }

    if (shape && shape !== "ALL") {
      const shapes = shape.split(",").map(s => s.trim());
      where.frameShape = { in: shapes };
    }

    if (material && material !== "ALL") {
      const materials = material.split(",").map(m => m.trim());
      where.material = { in: materials };
    }

    if (rim && rim !== "ALL") {
      const rims = rim.split(",").map(r => r.trim());
      where.rimType = { in: rims };
    }

    if (size && size !== "ALL") {
      const sizes = size.split(",").map(s => s.trim());
      where.frameSize = { in: sizes };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    if (inStockOnly) {
      where.inStock = true;
      where.stockCount = { gt: 0 };
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderBy = { basePrice: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { basePrice: "desc" };
    } else if (sort === "bestseller" || sort === "popular") {
      orderBy = { isBestseller: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
          reviews: {
            where: { isApproved: true },
            select: { rating: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((product) => {
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

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        brand: product.brand,
        category: product.category,
        gender: product.gender,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        isBestseller: product.isBestseller,
        isNewArrival: product.isNewArrival,
        isFeatured: product.isFeatured,
        inStock: product.inStock,
        stockCount: product.stockCount,
        frameShape: product.frameShape,
        material: product.material,
        rimType: product.rimType,
        frameSize: product.frameSize,
        faceFit: product.faceFit,
        lensWidth: product.lensWidth,
        bridgeWidth: product.bridgeWidth,
        templeLength: product.templeLength,
        lensHeight: product.lensHeight,
        totalWidth: product.totalWidth,
        virtualTryOnOverlay: product.virtualTryOnOverlay,
        tryOnScale: product.tryOnScale,
        tryOnOffsetY: product.tryOnOffsetY,
        tryOnOffsetX: product.tryOnOffsetX,
        images: product.images,
        variants: product.variants,
        rating: averageRating,
        reviewCount: ratingCount,
      };
    });

    // Also get filter counts and bounds for facet UI
    const [brands, categories] = await Promise.all([
      prisma.brand.findMany({
        select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.category.findMany({
        where: { parentId: null },
        include: {
          children: {
            select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
          },
          _count: { select: { products: true } },
        },
      }),
    ]);

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      facets: {
        brands,
        categories,
      },
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
