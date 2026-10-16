"use client";

import React, { useState } from "react";
import ProductCard, { ProductCardProps } from "@/components/ui/ProductCard";
import { Sparkles, Flame, Clock } from "lucide-react";

interface HomeTabsProps {
  featuredProducts: ProductCardProps["product"][];
  bestsellerProducts: ProductCardProps["product"][];
  newArrivalProducts: ProductCardProps["product"][];
}

export default function HomeTabs({
  featuredProducts,
  bestsellerProducts,
  newArrivalProducts,
}: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState<"bestsellers" | "new" | "featured">("bestsellers");

  let currentList = bestsellerProducts;
  if (activeTab === "new") currentList = newArrivalProducts;
  if (activeTab === "featured") currentList = featuredProducts;

  return (
    <div>
      {/* Tab Switcher Headers */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4 mb-8 gap-4">
        <div>
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Trending Looks
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-luxury-dark tracking-tight mt-1">
            Top Eyewear Picks
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("bestsellers")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "bestsellers"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-brand-700" />
            Bestsellers
          </button>

          <button
            onClick={() => setActiveTab("new")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "new"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-brand-700" />
            New Arrivals
          </button>

          <button
            onClick={() => setActiveTab("featured")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "featured"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            Featured
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
