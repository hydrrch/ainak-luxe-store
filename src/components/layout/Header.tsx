"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Glasses,
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Camera,
  ChevronDown,
  Sparkles,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTryOn } from "@/context/TryOnContext";

export default function Header() {
  const router = useRouter();
  const { totals, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const { openTryOn, allProducts } = useTryOn();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLaunchTryOn = () => {
    if (allProducts.length > 0) {
      openTryOn(allProducts[0]);
    } else {
      router.push("/products");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-brand-700 hover:bg-gray-100"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-md group-hover:bg-brand-800 transition-colors">
                  <Glasses className="w-6 h-6 text-gold-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl tracking-tight text-luxury-dark font-sans leading-none">
                    AINAK<span className="text-brand-700">LUXE</span>
                  </span>
                  <span className="text-[10px] tracking-widest text-luxury-muted uppercase font-semibold mt-0.5">
                    Premium Eyewear Pakistan
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-700">
              <Link
                href="/products?category=eyeglasses"
                className="hover:text-brand-700 transition-colors py-2 relative group"
              >
                Eyeglasses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-700 transition-all duration-200 group-hover:w-full" />
              </Link>
              <Link
                href="/products?category=sunglasses"
                className="hover:text-brand-700 transition-colors py-2 relative group"
              >
                Sunglasses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-700 transition-all duration-200 group-hover:w-full" />
              </Link>
              <Link
                href="/lenses"
                className="hover:text-brand-700 transition-colors py-2 relative group flex items-center gap-1.5"
              >
                <span>Lenses</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full border border-amber-300">
                  Blue Cut & Transitions
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-700 transition-all duration-200 group-hover:w-full" />
              </Link>
              <Link
                href="/products?gender=MEN"
                className="hover:text-brand-700 transition-colors py-2"
              >
                Men
              </Link>
              <Link
                href="/products?gender=WOMEN"
                className="hover:text-brand-700 transition-colors py-2"
              >
                Women
              </Link>
              <Link
                href="/products?gender=KIDS"
                className="hover:text-brand-700 transition-colors py-2"
              >
                Kids
              </Link>
              <Link
                href="/products"
                className="hover:text-brand-700 transition-colors py-2"
              >
                All Brands
              </Link>

              {/* Virtual Try-On Highlight Link */}
              <button
                onClick={handleLaunchTryOn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-700 to-rose-600 text-white hover:from-brand-800 hover:to-rose-700 shadow-sm hover:shadow transition-all group"
              >
                <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                Virtual Try-On
                <Sparkles className="w-3 h-3 text-gold-500" />
              </button>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-700 hover:text-brand-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href={user ? "/account?tab=wishlist" : "/account/login"}
                className="p-2 text-gray-700 hover:text-brand-700 hover:bg-gray-100 rounded-full transition-colors hidden sm:inline-flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline-block max-w-[90px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:inline-block" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          My Orders & Account
                        </Link>
                        <Link
                          href="/track-order"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          Track Live Shipment
                        </Link>
                        {user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-xs text-brand-700 hover:bg-brand-50 font-bold flex items-center gap-1"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/account/login"
                    className="p-2 text-gray-700 hover:text-brand-700 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1"
                    aria-label="Sign In"
                  >
                    <UserIcon className="w-5 h-5" />
                  </Link>
                )}
              </div>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl transition-all flex items-center gap-2 group"
                aria-label="View Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                <span className="hidden md:inline text-xs font-bold text-brand-900">
                  Bag
                </span>
                {totals.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-700 text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {totals.itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Overlay */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white p-4 shadow-md animate-in slide-in-from-top duration-150">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search frames, brands (Ray-Ban, Prada, Gucci), shapes (Aviator, Wayfarer)..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 text-sm"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/products?category=eyeglasses"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-800 border-b border-gray-100"
            >
              Eyeglasses
            </Link>
            <Link
              href="/products?category=sunglasses"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-800 border-b border-gray-100"
            >
              Sunglasses
            </Link>
            <Link
              href="/lenses"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-brand-700 font-bold border-b border-gray-100 flex items-center justify-between"
            >
              <span>Optical Lenses</span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                Blue Cut & Transitions
              </span>
            </Link>
            <Link
              href="/products?gender=MEN"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-800 border-b border-gray-100"
            >
              Men's Eyewear
            </Link>
            <Link
              href="/products?gender=WOMEN"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-800 border-b border-gray-100"
            >
              Women's Eyewear
            </Link>
            <Link
              href="/products?gender=KIDS"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-800 border-b border-gray-100"
            >
              Kids Eyewear
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-800 border-b border-gray-100"
            >
              Track Order Status
            </Link>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunchTryOn();
                }}
                className="w-full py-3 px-4 rounded-xl bg-brand-700 text-white font-semibold flex items-center justify-center gap-2 shadow"
              >
                <Camera className="w-4 h-4" />
                Launch Virtual Try-On
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
