"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, RotateCcw, Check } from "lucide-react";
import {
  FRAME_SHAPES,
  FRAME_MATERIALS,
  RIM_TYPES,
  FRAME_SIZES,
  formatPrice,
} from "@/lib/utils";

interface ProductFiltersProps {
  brands: Array<{ id: string; name: string; slug: string; _count: { products: number } }>;
  categories: Array<{ id: string; name: string; slug: string; _count: { products: number } }>;
  totalCount: number;
}

export default function ProductFilters({
  brands,
  categories,
  totalCount,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read current filters
  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentGender = searchParams.get("gender") || "";
  const currentShape = searchParams.get("shape") || "";
  const currentMaterial = searchParams.get("material") || "";
  const currentRim = searchParams.get("rim") || "";
  const currentSize = searchParams.get("size") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search") || "";

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset pagination on filter change
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  const hasActiveFilters =
    Boolean(currentCategory) ||
    Boolean(currentBrand) ||
    Boolean(currentGender) ||
    Boolean(currentShape) ||
    Boolean(currentMaterial) ||
    Boolean(currentRim) ||
    Boolean(currentSize) ||
    Boolean(currentMinPrice) ||
    Boolean(currentMaxPrice) ||
    Boolean(currentSearch);

  const filterContent = (
    <div className="space-y-6 text-sm">
      {/* Active Filter Clear Header */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Active Filters
          </span>
          <button
            onClick={clearAllFilters}
            className="text-xs text-brand-700 hover:text-brand-800 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      )}

      {/* Gender Collection */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
          Collection / Gender
        </h4>
        <div className="flex flex-wrap gap-2">
          {["MEN", "WOMEN", "UNISEX", "KIDS"].map((g) => {
            const isSelected = currentGender === g;
            return (
              <button
                key={g}
                onClick={() => updateFilter("gender", isSelected ? null : g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-brand-700 border-brand-700 text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
          Category
        </h4>
        <div className="space-y-1.5">
          {categories.map((c) => {
            const isSelected = currentCategory === c.slug;
            return (
              <label
                key={c.id}
                className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-1"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => updateFilter("category", isSelected ? null : c.slug)}
                    className="rounded border-gray-300 text-brand-700 focus:ring-brand-700"
                  />
                  <span>{c.name}</span>
                </div>
                <span className="text-gray-400 text-[11px]">({c._count.products})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
          Brand
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
          {brands.map((b) => {
            const isSelected = currentBrand === b.slug;
            return (
              <label
                key={b.id}
                className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-1"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => updateFilter("brand", isSelected ? null : b.slug)}
                    className="rounded border-gray-300 text-brand-700 focus:ring-brand-700"
                  />
                  <span>{b.name}</span>
                </div>
                <span className="text-gray-400 text-[11px]">({b._count.products})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Frame Shapes */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
          Frame Shape
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {FRAME_SHAPES.map((shape) => {
            const isSelected = currentShape === shape.value;
            return (
              <button
                key={shape.value}
                onClick={() => updateFilter("shape", isSelected ? null : shape.value)}
                className={`py-1.5 px-2 text-left rounded-lg text-xs font-medium border truncate transition-all ${
                  isSelected
                    ? "bg-brand-50 border-brand-700 text-brand-700 font-bold"
                    : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                }`}
              >
                {shape.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rim Type */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
          Rim Type
        </h4>
        <div className="space-y-1.5">
          {RIM_TYPES.map((rim) => {
            const isSelected = currentRim === rim.value;
            return (
              <label
                key={rim.value}
                className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => updateFilter("rim", isSelected ? null : rim.value)}
                  className="rounded border-gray-300 text-brand-700 focus:ring-brand-700"
                />
                <span>{rim.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Frame Material */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
          Material
        </h4>
        <div className="space-y-1.5">
          {FRAME_MATERIALS.map((mat) => {
            const isSelected = currentMaterial === mat.value;
            return (
              <label
                key={mat.value}
                className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => updateFilter("material", isSelected ? null : mat.value)}
                  className="rounded border-gray-300 text-brand-700 focus:ring-brand-700"
                />
                <span>{mat.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Frame Size */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
          Frame Size
        </h4>
        <div className="flex gap-2">
          {FRAME_SIZES.map((sz) => {
            const isSelected = currentSize === sz.value;
            return (
              <button
                key={sz.value}
                onClick={() => updateFilter("size", isSelected ? null : sz.value)}
                className={`flex-1 py-1.5 text-center rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-brand-700 border-brand-700 text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                }`}
              >
                {sz.value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2.5">
          Price Range (PKR)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentMinPrice}
            onBlur={(e) => updateFilter("minPrice", e.target.value || null)}
            className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentMaxPrice}
            onBlur={(e) => updateFilter("maxPrice", e.target.value || null)}
            className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex items-center justify-between pb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-700" />
          <span>Filters & Specs</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-700" />
          )}
        </button>

        <span className="text-xs text-gray-500 font-medium">
          {totalCount} frames found
        </span>
      </div>

      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm self-start sticky top-28">
        {filterContent}
      </aside>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-700" />
                  Filter Eyewear
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {filterContent}
              </div>
              <div className="p-4 border-t bg-gray-50">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-brand-700 text-white font-bold rounded-xl text-xs"
                >
                  Show {totalCount} Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
