import React, { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ProductCard from "@/components/ui/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import ProductSortBar from "@/components/products/ProductSortBar";
import { ChevronLeft, ChevronRight, Glasses } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: {
    search?: string;
    category?: string;
    brand?: string;
    gender?: string;
    shape?: string;
    material?: string;
    rim?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const search = searchParams.search?.trim();
  const categorySlug = searchParams.category;
  const brandSlug = searchParams.brand;
  const gender = searchParams.gender?.toUpperCase();
  const shape = searchParams.shape?.toUpperCase();
  const material = searchParams.material?.toUpperCase();
  const rim = searchParams.rim?.toUpperCase();
  const size = searchParams.size?.toUpperCase();
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const sort = searchParams.sort || "newest";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const limit = 12;
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
        { parent: { slug: categorySlug } },
      ],
    };
  }

  if (brandSlug) {
    const brandSlugs = brandSlug.split(",").map((b) => b.trim());
    where.brand = { slug: { in: brandSlugs } };
  }

  if (gender && gender !== "ALL") {
    where.gender = gender;
  }

  if (shape && shape !== "ALL") {
    const shapes = shape.split(",").map((s) => s.trim());
    where.frameShape = { in: shapes };
  }

  if (material && material !== "ALL") {
    const materials = material.split(",").map((m) => m.trim());
    where.material = { in: materials };
  }

  if (rim && rim !== "ALL") {
    const rims = rim.split(",").map((r) => r.trim());
    where.rimType = { in: rims };
  }

  if (size && size !== "ALL") {
    const sizes = size.split(",").map((s) => s.trim());
    where.frameSize = { in: sizes };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {};
    if (minPrice !== undefined) where.basePrice.gte = minPrice;
    if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") {
    orderBy = { basePrice: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { basePrice: "desc" };
  } else if (sort === "bestseller") {
    orderBy = { isBestseller: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  const [products, totalCount, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.brand.findMany({
      select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Helper to generate pagination URLs
  const createPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categorySlug) params.set("category", categorySlug);
    if (brandSlug) params.set("brand", brandSlug);
    if (gender) params.set("gender", gender);
    if (shape) params.set("shape", shape);
    if (material) params.set("material", material);
    if (rim) params.set("rim", rim);
    if (size) params.set("size", size);
    if (minPrice !== undefined) params.set("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.set("maxPrice", maxPrice.toString());
    if (sort) params.set("sort", sort);
    params.set("page", targetPage.toString());
    return `/products?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Header */}
      <div className="mb-6">
        <nav className="text-xs text-gray-500 flex items-center gap-2 mb-2">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Eyewear Catalogue</span>
          {categorySlug && (
            <>
              <span>/</span>
              <span className="capitalize text-brand-700 font-bold">{categorySlug}</span>
            </>
          )}
        </nav>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-luxury-dark tracking-tight">
          Explore Eyewear & Sunglasses
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Handcrafted frames, authentic designer labels, and certified prescription lenses with 3D virtual try-on.
        </p>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <Suspense fallback={<div className="w-64 h-96 bg-gray-50 rounded-2xl animate-pulse" />}>
          <ProductFilters
            brands={brands}
            categories={categories}
            totalCount={totalCount}
          />
        </Suspense>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0">
          <Suspense fallback={<div className="h-14 bg-gray-50 rounded-2xl animate-pulse mb-6" />}>
            <ProductSortBar totalCount={totalCount} />
          </Suspense>

          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto my-8">
              <Glasses className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No frames matched your search</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Try loosening your filters or clear some options like shape, material, or price ranges.
              </p>
              <Link
                href="/products"
                className="px-6 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold hover:bg-brand-800 transition-colors inline-block"
              >
                Clear All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {page > 1 ? (
                <Link
                  href={createPageUrl(page - 1)}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Link>
              ) : (
                <span className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-xs font-semibold flex items-center gap-1 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </span>
              )}

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  const isCurrent = pNum === page;
                  return (
                    <Link
                      key={pNum}
                      href={createPageUrl(pNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-brand-700 text-white shadow-md"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pNum}
                    </Link>
                  );
                })}
              </div>

              {page < totalPages ? (
                <Link
                  href={createPageUrl(page + 1)}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-xs font-semibold flex items-center gap-1 cursor-not-allowed">
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
