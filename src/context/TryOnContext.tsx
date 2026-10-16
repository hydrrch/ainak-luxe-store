"use client";

import React, { createContext, useContext, useState } from "react";

export interface TryOnProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  virtualTryOnOverlay?: string | null;
  tryOnScale?: number;
  tryOnOffsetY?: number;
  tryOnOffsetX?: number;
  frameShape?: string;
  faceFit?: string | null;
  brand?: { name: string };
  images?: Array<{ url: string }>;
  variants?: Array<{
    id: string;
    colorName: string;
    colorCode?: string | null;
    tryOnOverlay?: string | null;
    image?: string | null;
  }>;
}

interface TryOnContextType {
  isOpen: boolean;
  selectedProduct: TryOnProduct | null;
  selectedVariantId: string | null;
  openTryOn: (product: TryOnProduct, variantId?: string) => void;
  closeTryOn: () => void;
  setSelectedVariantId: (variantId: string | null) => void;
  allProducts: TryOnProduct[];
  setAllProducts: (products: TryOnProduct[]) => void;
  switchProduct: (product: TryOnProduct) => void;
}

const TryOnContext = createContext<TryOnContextType>({
  isOpen: false,
  selectedProduct: null,
  selectedVariantId: null,
  openTryOn: () => {},
  closeTryOn: () => {},
  setSelectedVariantId: () => {},
  allProducts: [],
  setAllProducts: () => {},
  switchProduct: () => {},
});

export function TryOnProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TryOnProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<TryOnProduct[]>([]);

  const openTryOn = (product: TryOnProduct, variantId?: string) => {
    setSelectedProduct(product);
    setSelectedVariantId(variantId || (product.variants && product.variants.length > 0 ? product.variants[0].id : null));
    setIsOpen(true);
  };

  const closeTryOn = () => {
    setIsOpen(false);
  };

  const switchProduct = (product: TryOnProduct) => {
    setSelectedProduct(product);
    setSelectedVariantId(product.variants && product.variants.length > 0 ? product.variants[0].id : null);
  };

  return (
    <TryOnContext.Provider
      value={{
        isOpen,
        selectedProduct,
        selectedVariantId,
        openTryOn,
        closeTryOn,
        setSelectedVariantId,
        allProducts,
        setAllProducts,
        switchProduct,
      }}
    >
      {children}
    </TryOnContext.Provider>
  );
}

export function useTryOn() {
  return useContext(TryOnContext);
}
