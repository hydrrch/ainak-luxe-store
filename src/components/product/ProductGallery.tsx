"use client";

import React, { useState } from "react";
import { ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: Array<{ id: string; url: string; alt?: string | null }>;
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const fallback = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80";
  const currentUrl = images[selectedIdx]?.url || fallback;

  return (
    <div className="space-y-4">
      {/* Main Large Image Container */}
      <div
        className="relative bg-gray-50 rounded-3xl p-8 border border-gray-100 overflow-hidden flex items-center justify-center min-h-[380px] sm:min-h-[460px] group cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentUrl}
          alt={productName}
          className={`max-h-[360px] w-auto object-contain transition-transform duration-300 drop-shadow-md ${
            isZoomed ? "scale-150" : "group-hover:scale-105"
          }`}
        />

        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-gray-500 shadow-sm border border-gray-200 text-xs flex items-center gap-1.5 pointer-events-none">
          <ZoomIn className="w-4 h-4 text-brand-700" />
          <span>{isZoomed ? "Click to reset" : "Click to zoom"}</span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => {
            const isCurrent = idx === selectedIdx;
            return (
              <button
                key={img.id}
                onClick={() => {
                  setSelectedIdx(idx);
                  setIsZoomed(false);
                }}
                className={`relative w-20 h-20 rounded-2xl p-2 bg-gray-50 border-2 transition-all shrink-0 overflow-hidden ${
                  isCurrent
                    ? "border-brand-700 shadow-md ring-2 ring-brand-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || `${productName} view ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
