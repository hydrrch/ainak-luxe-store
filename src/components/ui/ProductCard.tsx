"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, Heart, ShoppingBag, Star, Sparkles, Check } from "lucide-react";
import { useTryOn, TryOnProduct } from "@/context/TryOnContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    basePrice: number;
    salePrice?: number | null;
    isBestseller?: boolean;
    isNewArrival?: boolean;
    inStock: boolean;
    stockCount: number;
    frameShape?: string;
    material?: string;
    faceFit?: string | null;
    virtualTryOnOverlay?: string | null;
    tryOnScale?: number;
    tryOnOffsetY?: number;
    tryOnOffsetX?: number;
    brand?: { name: string };
    images?: Array<{ url: string; alt?: string | null }>;
    variants?: Array<{
      id: string;
      colorName: string;
      colorCode?: string | null;
      tryOnOverlay?: string | null;
      image?: string | null;
    }>;
    rating?: number;
    reviewCount?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { openTryOn } = useTryOn();
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const activeVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const displayImage =
    activeVariant?.image ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80";

  const handleLaunchTryOn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openTryOn(product as unknown as TryOnProduct, selectedVariantId || undefined);
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    const res = await addToCart({
      productId: product.id,
      variantId: selectedVariantId || undefined,
      quantity: 1,
    });
    setIsAdding(false);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsWishlisted(data.saved);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentPrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestseller && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-gold-500 text-white shadow-sm">
            Bestseller
          </span>
        )}
        {hasDiscount && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-brand-700 text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.isNewArrival && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-gray-900 text-white shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isWishlisted
            ? "bg-rose-50 text-rose-600 border border-rose-200"
            : "bg-white/80 hover:bg-white text-gray-400 hover:text-rose-600 border border-gray-100 shadow-sm"
        }`}
        aria-label="Save to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-600" : ""}`} />
      </button>

      {/* Image Container with Link */}
      <Link href={`/product/${product.slug}`} className="block relative pt-[75%] bg-gray-50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Quick Action: Virtual Try-On */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleLaunchTryOn}
            className="flex-1 py-2 px-3 bg-luxury-dark/95 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold backdrop-blur-sm shadow-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-gold-500" />
            <span>Virtual Try-On</span>
          </button>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Shape */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mb-1">
            <span className="uppercase tracking-wider font-semibold text-gray-700">
              {product.brand?.name || "Ainak Luxe"}
            </span>
            <span className="text-gray-400 capitalize">{product.frameShape?.toLowerCase()}</span>
          </div>

          {/* Product Title */}
          <Link
            href={`/product/${product.slug}`}
            className="block font-bold text-sm text-gray-900 group-hover:text-brand-700 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Face Fit Tag */}
          {product.faceFit && (
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              ✓ {product.faceFit}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center text-gold-500">
              <Star className="w-3.5 h-3.5 fill-gold-500" />
            </div>
            <span className="text-xs font-bold text-gray-800">
              {product.rating || 5.0}
            </span>
            <span className="text-[11px] text-gray-400">
              ({product.reviewCount || 12})
            </span>
          </div>
        </div>

        {/* Bottom Section: Color Swatches & Price */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          {/* Swatches */}
          {product.variants && product.variants.length > 0 ? (
            <div className="flex items-center gap-1.5">
              {product.variants.slice(0, 4).map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantId(v.id);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedVariantId === v.id
                      ? "ring-2 ring-brand-700 scale-110 border-white"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: v.colorCode || "#111827" }}
                  title={v.colorName}
                />
              ))}
            </div>
          ) : (
            <div />
          )}

          {/* Price */}
          <div className="text-right">
            <span className="text-sm font-extrabold text-brand-700">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="block text-[11px] text-gray-400 line-through">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdding || !product.inStock}
          className={`mt-3 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 hover:bg-brand-700 hover:text-white text-gray-800"
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              {product.inStock ? "Add to Bag" : "Out of Stock"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
