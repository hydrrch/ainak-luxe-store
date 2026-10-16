"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Tag, Check, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    totals,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 4000;
  const progressPercent = Math.min(100, Math.round((totals.subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totals.subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    const res = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput("");
    }
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-luxury-light">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-700" />
              <h3 className="font-bold text-base text-luxury-dark">
                Your Shopping Bag ({totals.itemCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-brand-50/60 border-b border-brand-100 text-xs text-brand-900">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-700" />
                {totals.subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-bold">🎉 You qualify for FREE Nationwide Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-brand-700">{formatPrice(remainingForFreeShipping)}</strong> more for FREE Delivery
                  </span>
                )}
              </span>
              <span className="font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-700 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h4 className="text-base font-bold text-gray-800 mb-1">Your bag is empty</h4>
                <p className="text-xs text-gray-500 mb-6">
                  Explore our luxury eyeglasses and sunglasses catalogue to find your look.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold shadow transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemFramePrice = item.product.salePrice ?? item.product.basePrice;
                const itemLensPrice = item.lensOption ? item.lensOption.price : 0;
                const unitPrice = itemFramePrice + itemLensPrice;
                const img = item.product.images?.[0]?.url || "/glasses/wayfarer-black.svg";

                return (
                  <div key={item.id} className="py-4 flex gap-3.5 items-start">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] text-luxury-muted font-medium uppercase">
                            {item.product.brand?.name}
                          </p>
                          <h4 className="text-xs font-bold text-gray-900 truncate max-w-[170px]">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Attributes */}
                      <div className="mt-1 space-y-0.5">
                        {item.variant && (
                          <span className="inline-block text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded mr-1">
                            Color: {item.variant.colorName}
                          </span>
                        )}
                        {item.lensOption && (
                          <span className="inline-block text-[10px] bg-brand-50 text-brand-800 px-2 py-0.5 rounded font-medium">
                            Lens: {item.lensOption.name} (+{formatPrice(item.lensOption.price)})
                          </span>
                        )}
                        {item.prescriptionImage && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-300">
                            📸 Doctor Slip Attached
                          </span>
                        )}
                        {item.prescriptionMethod === "WHATSAPP" && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-300">
                            📱 WhatsApp Rx Request
                          </span>
                        )}
                        {item.prescriptionMethod === "ZERO_POWER" && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                            👓 Zero Power (Plano)
                          </span>
                        )}
                        {(item.sphereOD || item.sphereOS) && !item.prescriptionImage && (
                          <span className="block text-[10px] text-gray-600 font-mono">
                            Rx: OD {item.sphereOD || "0.00"} | OS {item.sphereOS || "0.00"}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 rounded-l"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 rounded-r"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-brand-700">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer with Totals & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-white space-y-3">
              {/* Coupon Form */}
              <div className="pb-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      Applied: <strong>{appliedCoupon.code}</strong>
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon Code (e.g. AINAK10)"
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Summary Rows */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {totals.shippingFee === 0 ? (
                      <strong className="text-emerald-600">FREE</strong>
                    ) : (
                      formatPrice(totals.shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-luxury-dark pt-2 border-t">
                  <span>Estimated Total</span>
                  <span className="text-brand-700 text-base">{formatPrice(totals.total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleGoToCheckout}
                className="w-full py-3.5 px-4 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex justify-center">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="text-xs text-gray-500 hover:text-brand-700 underline text-center"
                >
                  View Full Cart & Prescription Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
