import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchaseBox from "@/components/product/ProductPurchaseBox";
import ProductReviewSection from "@/components/product/ProductReviewSection";
import ProductCard from "@/components/ui/ProductCard";
import { Ruler, ShieldCheck, Truck, RefreshCw, Star, Info } from "lucide-react";

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const [lensOptions, relatedProducts] = await Promise.all([
    prisma.lensOption.findMany({ orderBy: { price: "asc" } }),
    prisma.product.findMany({
      where: {
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          { brandId: product.brandId },
        ],
      },
      include: {
        brand: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      take: 4,
    }),
  ]);

  const ratingCount = product.reviews.length;
  const averageRating =
    ratingCount > 0
      ? Number(
          (
            product.reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
          ).toFixed(1)
        )
      : 5.0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-700">Catalogue</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-700 capitalize">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery on Left, Purchase Configuration on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Product Imagery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />

          {/* Optical Frame Dimensions Specs Table */}
          <div className="mt-10 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-luxury-dark">
              <Ruler className="w-5 h-5 text-brand-700" />
              <h3 className="font-bold text-sm uppercase tracking-wider">
                Precision Measurements (mm)
              </h3>
            </div>
            <p className="text-xs text-gray-500">
              Compare these measurements with your existing comfortable glasses (printed on the inside temple arm).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 bg-gray-50 rounded-2xl text-center border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-semibold uppercase">Lens Width</span>
                <span className="text-base font-bold text-gray-900">{product.lensWidth || 50} mm</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl text-center border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-semibold uppercase">Bridge</span>
                <span className="text-base font-bold text-gray-900">{product.bridgeWidth || 20} mm</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl text-center border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-semibold uppercase">Temple</span>
                <span className="text-base font-bold text-gray-900">{product.templeLength || 145} mm</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl text-center border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-semibold uppercase">Lens Height</span>
                <span className="text-base font-bold text-gray-900">{product.lensHeight || 44} mm</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl text-center border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-semibold uppercase">Total Width</span>
                <span className="text-base font-bold text-brand-700">{product.totalWidth || 140} mm</span>
              </div>
            </div>

            {/* Specifications Key Value Details */}
            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-gray-400">Frame Shape:</span>{" "}
                <span className="font-semibold text-gray-800 capitalize">{product.frameShape.toLowerCase()}</span>
              </div>
              <div>
                <span className="text-gray-400">Material:</span>{" "}
                <span className="font-semibold text-gray-800 capitalize">{product.material.toLowerCase()}</span>
              </div>
              <div>
                <span className="text-gray-400">Rim Type:</span>{" "}
                <span className="font-semibold text-gray-800 capitalize">{product.rimType.replace("_", " ").toLowerCase()}</span>
              </div>
              <div>
                <span className="text-gray-400">Frame Size:</span>{" "}
                <span className="font-semibold text-gray-800">{product.frameSize}</span>
              </div>
              <div>
                <span className="text-gray-400">SKU Code:</span>{" "}
                <span className="font-mono font-semibold text-gray-800">{product.sku}</span>
              </div>
              <div>
                <span className="text-gray-400">Availability:</span>{" "}
                <span className="font-semibold text-emerald-700">
                  {product.inStock ? `In Stock (${product.stockCount} units)` : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Purchase Box */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-28">
          <div className="mb-4">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
              {product.brand.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-luxury-dark tracking-tight mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? "fill-gold-500 text-gold-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">{averageRating}</span>
              <span className="text-xs text-gray-400">({ratingCount} verified reviews)</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <ProductPurchaseBox product={product as any} lensOptions={lensOptions} />
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
        <ProductReviewSection
          productId={product.id}
          initialReviews={product.reviews as any}
          rating={averageRating}
          reviewCount={ratingCount}
        />
      </section>

      {/* Related Frames */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
                Similar Aesthetics
              </span>
              <h2 className="text-2xl font-extrabold text-luxury-dark tracking-tight mt-1">
                You May Also Like
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-brand-700 hover:underline"
            >
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
