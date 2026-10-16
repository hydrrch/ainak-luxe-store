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

    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

    return NextResponse.json({ products, brands, categories });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin products" },
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
    const {
      name,
      sku,
      description,
      brandId,
      categoryId,
      gender = "UNISEX",
      basePrice,
      salePrice,
      stockCount = 10,
      frameShape = "WAYFARER",
      material = "ACETATE",
      rimType = "FULL_RIM",
      frameSize = "MEDIUM",
      faceFit = "For normal faces",
      lensWidth = 50,
      bridgeWidth = 20,
      templeLength = 145,
      lensHeight = 44,
      totalWidth = 140,
      virtualTryOnOverlay = "/glasses/wayfarer-black.svg",
      imageUrl,
      colorName = "Classic Black",
    } = body;

    if (!name || !sku || !brandId || !categoryId || !basePrice) {
      return NextResponse.json(
        { error: "Name, SKU, Brand, Category, and Base Price are required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        description: description || name,
        brandId,
        categoryId,
        gender,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stockCount: parseInt(stockCount, 10),
        inStock: parseInt(stockCount, 10) > 0,
        frameShape,
        material,
        rimType,
        frameSize,
        faceFit,
        lensWidth: parseInt(lensWidth, 10) || 50,
        bridgeWidth: parseInt(bridgeWidth, 10) || 20,
        templeLength: parseInt(templeLength, 10) || 145,
        lensHeight: parseInt(lensHeight, 10) || 44,
        totalWidth: parseInt(totalWidth, 10) || 140,
        virtualTryOnOverlay,
        tryOnScale: 1.0,
        tryOnOffsetY: 0.0,
        images: {
          create: [
            {
              url: imageUrl || "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
              alt: name,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        variants: {
          create: [
            {
              colorName,
              colorCode: "#111827",
              sku: `${sku}-01`,
              stockCount: parseInt(stockCount, 10),
              tryOnOverlay: virtualTryOnOverlay,
            },
          ],
        },
      },
      include: {
        brand: true,
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({
      success: true,
      product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Admin product POST error:", error);
    return NextResponse.json(
      { error: "Failed to create product. Ensure SKU is unique." },
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
    const { id, basePrice, salePrice, stockCount, inStock, name, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(basePrice !== undefined && { basePrice: parseFloat(basePrice) }),
        ...(salePrice !== undefined && { salePrice: salePrice ? parseFloat(salePrice) : null }),
        ...(stockCount !== undefined && {
          stockCount: parseInt(stockCount, 10),
          inStock: parseInt(stockCount, 10) > 0,
        }),
        ...(inStock !== undefined && { inStock }),
      },
    });

    return NextResponse.json({
      success: true,
      product: updated,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Admin product PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Admin product DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
