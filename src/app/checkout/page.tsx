"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  CreditCard,
  Banknote,
  Building,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, PAKISTANI_CITIES } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, appliedCoupon, refreshCart } = useCart();
  const { user } = useAuth();

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("Lahore");
  const [province, setProvince] = useState("Punjab");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "SANDBOX_GATEWAY" | "BANK_TRANSFER">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Update province when common cities change
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (["Karachi", "Hyderabad", "Sukkur"].includes(newCity)) {
      setProvince("Sindh");
    } else if (["Islamabad"].includes(newCity)) {
      setProvince("Islamabad Capital Territory");
    } else if (["Peshawar", "Mardan", "Abbottabad"].includes(newCity)) {
      setProvince("Khyber Pakhtunkhwa");
    } else if (["Quetta"].includes(newCity)) {
      setProvince("Balochistan");
    } else {
      setProvince("Punjab");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !streetAddress || !city) {
      setErrorMsg("Please fill in all required customer and address fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          streetAddress,
          city,
          province,
          postalCode,
          paymentMethod,
          couponCode: appliedCoupon?.code,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to place order.");
        setIsSubmitting(false);
      } else {
        await refreshCart();
        router.push(`/order-success/${data.orderNumber}`);
      }
    } catch {
      setErrorMsg("Network error occurred while placing order.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Items to Checkout</h2>
        <p className="text-xs text-gray-500 mb-6">Your shopping bag is empty.</p>
        <Link
          href="/products"
          className="px-6 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold"
        >
          Browse Eyewear
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <nav className="text-xs text-gray-500 flex items-center gap-2 mb-2">
          <Link href="/cart" className="hover:text-brand-700">Shopping Bag</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Secure Checkout</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-luxury-dark tracking-tight">
          Checkout & Shipping
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete your delivery details for courier dispatch across Pakistan.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Contact */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-700 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Hamza Ali"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. hamza@example.com"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Pakistani Mobile Number (For Courier SMS & Call) *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0300-1234567 or +923001234567"
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                The TCS/Leopards delivery rider will call this number prior to arrival.
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-700 text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              Delivery Address in Pakistan
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                House # / Street / Apartment / Building *
              </label>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="e.g. House 42-B, Street 7, Sector F-8/3"
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-white focus:ring-1 focus:ring-brand-700 focus:outline-none"
                >
                  {PAKISTANI_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 54000"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Order Notes / Special Delivery Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Please deliver between 2pm-5pm or leave with guard"
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-700 text-white text-[11px] font-bold flex items-center justify-center">
                3
              </span>
              Payment Method
            </h3>

            <div className="space-y-3">
              {/* Cash On Delivery (COD) */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-brand-700 bg-brand-50/50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1 text-brand-700 focus:ring-brand-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-gray-900">
                        Cash on Delivery (COD) — Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Pay cash to the courier rider upon physical inspection of your package at your doorstep. Zero advance payment required.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Most Popular
                </span>
              </label>

              {/* Online / Sandbox Card Payment */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                  paymentMethod === "SANDBOX_GATEWAY"
                    ? "border-brand-700 bg-brand-50/50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="SANDBOX_GATEWAY"
                    checked={paymentMethod === "SANDBOX_GATEWAY"}
                    onChange={() => setPaymentMethod("SANDBOX_GATEWAY")}
                    className="mt-1 text-brand-700 focus:ring-brand-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-brand-700" />
                      <span className="font-bold text-xs text-gray-900">
                        Online Card Payment (Visa / MasterCard — Sandbox Gateway)
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Tested via certified Pakistani payment gateway sandbox integration.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  Instant
                </span>
              </label>

              {/* Bank Transfer / JazzCash */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-brand-700 bg-brand-50/50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={() => setPaymentMethod("BANK_TRANSFER")}
                    className="mt-1 text-brand-700 focus:ring-brand-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-700" />
                      <span className="font-bold text-xs text-gray-900">
                        Direct Bank Transfer / JazzCash / EasyPaisa
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Bank account details and JazzCash wallet number will be provided on the order receipt.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary Review & Final CTA */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-28">
          <h3 className="font-bold text-base text-gray-900 pb-3 border-b">
            Order Review ({totals.itemCount} items)
          </h3>

          {/* Mini Items List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {items.map((item) => {
              const framePrice = item.product.salePrice ?? item.product.basePrice;
              const lensPrice = item.lensOption ? item.lensOption.price : 0;
              const unitPrice = framePrice + lensPrice;

              return (
                <div key={item.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="font-bold text-gray-900 truncate">
                      {item.product.name} × {item.quantity}
                    </p>
                    <div className="text-[11px] text-gray-500 truncate">
                      {item.variant?.colorName && `Color: ${item.variant.colorName} `}
                      {item.lensOption && `| Lens: ${item.lensOption.name}`}
                    </div>
                    {item.prescriptionImage && (
                      <span className="inline-block text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5">
                        📸 Rx Slip Attached
                      </span>
                    )}
                    {item.prescriptionMethod === "WHATSAPP" && (
                      <span className="inline-block text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                        📱 Rx via WhatsApp
                      </span>
                    )}
                    {item.prescriptionMethod === "ZERO_POWER" && (
                      <span className="inline-block text-[10px] text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded mt-0.5">
                        👓 Zero Power (Plano)
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-800 shrink-0">
                    {formatPrice(unitPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">{formatPrice(totals.subtotal)}</span>
            </div>

            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(totals.discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Fee ({city})</span>
              <span>
                {totals.shippingFee === 0 ? (
                  <strong className="text-emerald-600 font-bold">FREE Delivery</strong>
                ) : (
                  formatPrice(totals.shippingFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-luxury-dark pt-3 border-t">
              <span>Amount Due</span>
              <span className="text-brand-700">{formatPrice(totals.total)}</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Payment mode: {paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-brand-700 hover:bg-brand-800 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all disabled:opacity-60"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? "Confirming Order..." : "Confirm & Place Order"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Security & Support Guarantee */}
          <div className="p-4 bg-gray-50 rounded-2xl text-[11px] text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero risk: Pay Cash on Delivery at your door</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-700" />
              <span>Dispatched via Leopards / TCS Express Courier</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
