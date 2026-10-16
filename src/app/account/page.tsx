"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Package,
  Heart,
  LogOut,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatDate } from "@/lib/utils";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile">(
    (searchParams.get("tab") as any) || "orders"
  );

  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [ordersRes, wishlistRes] = await Promise.all([
            fetch("/api/account/orders"),
            fetch("/api/wishlist"),
          ]);
          if (ordersRes.ok) {
            const data = await ordersRes.json();
            setOrders(data.orders || []);
          }
          if (wishlistRes.ok) {
            const data = await wishlistRes.json();
            setWishlist(data.wishlist || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setDataLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        <div className="w-8 h-8 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading customer dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-950 via-luxury-dark to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-700 flex items-center justify-center text-xl font-extrabold text-white shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Hello, {user.name}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-brand-50 text-brand-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-700" />
              Order History
            </span>
            <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === "wishlist"
                ? "bg-brand-50 text-brand-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              My Wishlist
            </span>
            <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border">
              {wishlist.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === "profile"
                ? "bg-brand-50 text-brand-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-700" />
              Profile Settings
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 min-h-[400px]">
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-extrabold text-base text-gray-900">
                  Your Orders ({orders.length})
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 space-y-3">
                  <Package className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-xs font-medium">You haven&apos;t placed any orders yet.</p>
                  <Link
                    href="/products"
                    className="inline-block px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all bg-gray-50/50 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200 text-xs">
                        <div>
                          <span className="font-mono font-bold text-gray-900">
                            {ord.orderNumber}
                          </span>
                          <span className="text-gray-400 block text-[11px] mt-0.5">
                            Placed on {formatDate(ord.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                            {ord.orderStatus}
                          </span>
                          <Link
                            href={`/track-order?orderNumber=${ord.orderNumber}`}
                            className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200 flex items-center gap-1 shadow-sm"
                          >
                            <span>Track</span>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </Link>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2">
                        {ord.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-start text-xs py-1 border-b border-gray-100 last:border-b-0">
                            <div>
                              <span className="font-semibold text-gray-900">
                                {item.productName} × {item.quantity}
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px]">
                                {item.lensName && (
                                  <span className="text-purple-900 bg-purple-50 px-1.5 py-0.5 rounded font-medium border border-purple-200">
                                    Lens: {item.lensName}
                                  </span>
                                )}
                                {item.prescriptionImage && (
                                  <a
                                    href={item.prescriptionImage}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-amber-800 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded font-bold border border-amber-200"
                                  >
                                    📸 View Rx Slip &rarr;
                                  </a>
                                )}
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-xs font-bold">
                        <span>Grand Total ({ord.paymentMethod})</span>
                        <span className="text-brand-700 text-sm">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-extrabold text-base text-gray-900">
                  Saved Frames ({wishlist.length})
                </h3>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-gray-500 space-y-3">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-xs font-medium">Your wishlist is empty.</p>
                  <Link
                    href="/products"
                    className="inline-block px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Browse Frames
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-gray-100 flex gap-4 items-center bg-gray-50/50"
                    >
                      <div className="w-16 h-16 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.images?.[0]?.url || "/glasses/wayfarer-black.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          {item.product.brand?.name}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-xs font-bold text-brand-700 mt-1 block">
                          {formatPrice(item.product.salePrice || item.product.basePrice)}
                        </span>
                      </div>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="px-3 py-1.5 bg-brand-700 text-white rounded-lg text-xs font-semibold shrink-0"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6 max-w-lg">
              <h3 className="font-extrabold text-base text-gray-900 pb-4 border-b border-gray-100">
                Personal Information
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    disabled
                    value={user.phone || "Not provided"}
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Account Role</label>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-gray-100 text-gray-700 border">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading customer dashboard...</p>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
