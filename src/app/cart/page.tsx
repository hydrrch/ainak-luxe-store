"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    totals,
    loading,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold">Loading your shopping bag...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-700 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-luxury-dark mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          Looks like you haven&apos;t added any eyeglasses or sunglasses yet. Try on frames in our 3D mirror and find your perfect look.
        </p>
        <Link
          href="/products"
          className="px-8 py-3.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-lg transition-all inline-flex items-center gap-2"
        >
          <span>Explore Eyewear Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-luxury-dark tracking-tight">
          Shopping Bag ({totals.itemCount} items)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review your selected frames, customized lenses, and prescription values before checkout.
        </p>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-900">
        <div className="flex items-center gap-2 font-medium">
          <Truck className="w-4 h-4 text-brand-700" />
          {totals.subtotal >= freeShippingThreshold ? (
            <span className="font-bold text-emerald-700">
              🎉 Congratulations! You have unlocked FREE Express Delivery across Pakistan!
            </span>
          ) : (
            <span>
              Add <strong className="text-brand-700">{formatPrice(remainingForFreeShipping)}</strong> more to your cart to get FREE Shipping!
            </span>
          )}
        </div>
        <div className="w-full sm:w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-brand-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Grid: Items Table on Left, Order Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const framePrice = item.product.salePrice ?? item.product.basePrice;
              const lensPrice = item.lensOption ? item.lensOption.price : 0;
              const unitPrice = framePrice + lensPrice;
              const img = item.product.images?.[0]?.url || "/glasses/wayfarer-black.svg";

              return (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-5 items-start">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {item.product.brand?.name}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 mt-0.5">
                          <Link href={`/product/${item.product.slug}`} className="hover:text-brand-700">
                            {item.product.name}
                          </Link>
                        </h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Attributes */}
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      {item.variant && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
                          Color: <strong>{item.variant.colorName}</strong>
                        </span>
                      )}
                      {item.lensOption ? (
                        <span className="px-2.5 py-1 bg-brand-50 text-brand-800 rounded-lg font-medium">
                          Lens: <strong>{item.lensOption.name}</strong> (+{formatPrice(item.lensOption.price)})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
                          Frame Only (Demo Clear Lenses)
                        </span>
                      )}
                    </div>

                    {/* Prescription Details */}
                    {item.prescriptionType && (
                      <div className="mt-2 p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-600 border border-gray-100">
                        <span className="font-semibold text-gray-800">
                          Prescription ({item.prescriptionType}):
                        </span>{" "}
                        OD (Right): Sph {item.sphereOD || "0.00"}, Cyl {item.cylinderOD || "0.00"}, Axis {item.axisOD || "0"} |{" "}
                        OS (Left): Sph {item.sphereOS || "0.00"}, Cyl {item.cylinderOS || "0.00"}, Axis {item.axisOS || "0"} |{" "}
                        PD: {item.pupillaryDistance || "62"}mm
                      </div>
                    )}

                    {/* Quantity Stepper & Line Total */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 rounded"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-brand-700">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[11px] text-gray-400">
                            ({formatPrice(unitPrice)} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/products"
              className="text-xs font-bold text-brand-700 hover:underline"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-xs text-gray-400 hover:text-red-500 font-medium"
            >
              Clear Entire Bag
            </button>
          </div>
        </div>

        {/* Order Summary on Right */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="font-extrabold text-base text-luxury-dark pb-3 border-b">
            Order Summary
          </h3>

          {/* Coupon Box */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Have a Promo Code?
            </label>
            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  Code Applied: {appliedCoupon.code}
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 hover:underline font-bold text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. AINAK10"
                  className="flex-1 p-2.5 border border-gray-300 rounded-xl text-xs uppercase font-mono focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </form>
            )}
            {couponError && (
              <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">{formatPrice(totals.subtotal)}</span>
            </div>

            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(totals.discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>
                {totals.shippingFee === 0 ? (
                  <strong className="text-emerald-600 font-bold">FREE</strong>
                ) : (
                  formatPrice(totals.shippingFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-luxury-dark pt-3 border-t">
              <span>Grand Total</span>
              <span className="text-brand-700">{formatPrice(totals.total)}</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Tax included. Cash on Delivery available at checkout.
            </p>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => router.push("/checkout")}
            className="w-full py-4 px-6 bg-brand-700 hover:bg-brand-800 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Trust Guarantees */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cash on Delivery (No advance payment needed)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
              <span>7-Day Return & Replacement Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
