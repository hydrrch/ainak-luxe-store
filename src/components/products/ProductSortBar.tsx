"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, X } from "lucide-react";

interface ProductSortBarProps {
  totalCount: number;
}

export default function ProductSortBar({ totalCount }: ProductSortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-700">
          Showing <strong className="text-gray-900">{totalCount}</strong> frames
        </span>

        {currentSearch && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-medium border border-brand-200">
            Search: &ldquo;{currentSearch}&rdquo;
            <button
              onClick={clearSearch}
              className="text-brand-700 hover:text-brand-900 ml-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <label htmlFor="sortSelect" className="text-xs text-gray-500 font-medium flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5" />
          Sort by:
        </label>
        <select
          id="sortSelect"
          value={currentSort}
          onChange={handleSortChange}
          className="text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-brand-700 focus:outline-none cursor-pointer"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="bestseller">Bestsellers First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
