"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  images: Array<{ url: string; alt?: string | null }>;
  brand?: { name: string };
  virtualTryOnOverlay?: string | null;
}

export interface CartItem {
  id: string;
  productId: string;
  product: CartItemProduct;
  variantId?: string | null;
  variant?: { id: string; colorName: string; colorCode?: string | null; tryOnOverlay?: string | null } | null;
  lensOptionId?: string | null;
  lensOption?: { id: string; name: string; price: number } | null;
  quantity: number;
  prescriptionMethod?: string | null;
  prescriptionImage?: string | null;
  prescriptionType?: string | null;
  sphereOD?: string | null;
  cylinderOD?: string | null;
  axisOD?: string | null;
  additionOD?: string | null;
  sphereOS?: string | null;
  cylinderOS?: string | null;
  axisOS?: string | null;
  additionOS?: string | null;
  pupillaryDistance?: string | null;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
}

interface CartContextType {
  items: CartItem[];
  totals: CartTotals;
  loading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: { code: string; discountType: string; discountValue: number } | null;
  addToCart: (itemData: {
    productId: string;
    variantId?: string;
    lensOptionId?: string;
    quantity?: number;
    prescriptionMethod?: string;
    prescriptionImage?: string;
    prescriptionType?: string;
    sphereOD?: string;
    cylinderOD?: string;
    axisOD?: string;
    additionOD?: string;
    sphereOS?: string;
    cylinderOS?: string;
    axisOS?: string;
    additionOS?: string;
    pupillaryDistance?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  refreshCart: () => Promise<void>;
}

const defaultTotals: CartTotals = {
  subtotal: 0,
  discount: 0,
  shippingFee: 0,
  total: 0,
  itemCount: 0,
};

const CartContext = createContext<CartContextType>({
  items: [],
  totals: defaultTotals,
  loading: true,
  isCartOpen: false,
  setIsCartOpen: () => {},
  appliedCoupon: null,
  addToCart: async () => ({ success: false }),
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  applyCoupon: async () => ({ success: false, message: "" }),
  removeCoupon: () => {},
  refreshCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState<CartTotals>(defaultTotals);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
  } | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      const couponQuery = appliedCoupon ? `?coupon=${appliedCoupon.code}` : "";
      const res = await fetch(`/api/cart${couponQuery}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.cart?.items || []);
        setTotals(data.totals || defaultTotals);
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
    } finally {
      setLoading(false);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart, user]);

  const addToCart = async (itemData: {
    productId: string;
    variantId?: string;
    lensOptionId?: string;
    quantity?: number;
    prescriptionType?: string;
    sphereOD?: string;
    cylinderOD?: string;
    axisOD?: string;
    sphereOS?: string;
    cylinderOS?: string;
    axisOS?: string;
    pupillaryDistance?: string;
  }) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to add to cart" };
      }
      setItems(data.cart?.items || []);
      setTotals(data.totals || defaultTotals);
      setIsCartOpen(true); // Open drawer on addition
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred" };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.cart?.items || []);
        setTotals(data.totals || defaultTotals);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.cart?.items || []);
        setTotals(data.totals || defaultTotals);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch("/api/cart?clear=true", {
        method: "DELETE",
      });
      if (res.ok) {
        setItems([]);
        setTotals(defaultTotals);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cartSubtotal: totals.subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Invalid coupon" };
      }
      setAppliedCoupon({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
      });
      await refreshCart();
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Network error occurred" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totals,
        loading,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
