"use client";

import React from "react";
import Link from "next/link";
import { Glasses, Phone, Mail, MapPin, ShieldCheck, RefreshCw, Truck, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-luxury-dark text-white pt-16 pb-8 border-t border-gray-800">
      {/* Value Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-700/20 text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-gray-100">Nationwide Free Delivery</h5>
              <p className="text-xs text-gray-400 mt-0.5">On all orders above Rs. 4,000</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-gray-100">100% Authentic Eyewear</h5>
              <p className="text-xs text-gray-400 mt-0.5">Original brand imports & warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-gray-100">7-Day Easy Exchange</h5>
              <p className="text-xs text-gray-400 mt-0.5">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-gray-100">Cash on Delivery</h5>
              <p className="text-xs text-gray-400 mt-0.5">Pay safely at your doorstep</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white">
                <Glasses className="w-6 h-6 text-gold-500" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
                AINAK<span className="text-brand-700">LUXE</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Pakistan&apos;s premier destination for luxury prescription glasses, designer sunglasses, and smart virtual try-on technology. Delivering high-precision lenses with uncompromised aesthetic elegance.
            </p>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-500" />
                <span>+92 300 1234567 (Mon-Sat, 10am-9pm PKT)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-500" />
                <span>support@ainakluxe.pk</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span>Gulberg III, Lahore | Clifton, Karachi | Blue Area, Islamabad</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="font-bold text-sm tracking-wider uppercase text-gray-200 mb-4">
              Categories
            </h6>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/products?category=eyeglasses" className="hover:text-white transition-colors">
                  Eyeglasses
                </Link>
              </li>
              <li>
                <Link href="/products?category=sunglasses" className="hover:text-white transition-colors">
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link href="/products?gender=MEN" className="hover:text-white transition-colors">
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/products?gender=WOMEN" className="hover:text-white transition-colors">
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/products?gender=KIDS" className="hover:text-white transition-colors">
                  Kids&apos; Frames
                </Link>
              </li>
            </ul>
          </div>

          {/* Lens & Prescription */}
          <div>
            <h6 className="font-bold text-sm tracking-wider uppercase text-gray-200 mb-4">
              Lenses & Service
            </h6>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Blue Light Blocking Lenses
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Photochromic Transition
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Progressive & Bifocal
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Live Shipment
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h6 className="font-bold text-sm tracking-wider uppercase text-gray-200 mb-4">
              Stay in Touch
            </h6>
            <p className="text-xs text-gray-400 mb-3">
              Subscribe for VIP discounts, secret sales, and seasonal frame drops.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-700"
              />
              <button
                type="submit"
                className="w-full py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Join VIP Club
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-800 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Ainak Luxe PK. All rights reserved.</p>
        <div className="flex items-center gap-3 text-gray-400">
          <span className="px-2.5 py-1 bg-gray-900 rounded border border-gray-800 font-mono text-[10px]">
            Cash on Delivery
          </span>
          <span className="px-2.5 py-1 bg-gray-900 rounded border border-gray-800 font-mono text-[10px]">
            JazzCash
          </span>
          <span className="px-2.5 py-1 bg-gray-900 rounded border border-gray-800 font-mono text-[10px]">
            EasyPaisa
          </span>
          <span className="px-2.5 py-1 bg-gray-900 rounded border border-gray-800 font-mono text-[10px]">
            Visa / MC
          </span>
        </div>
      </div>
    </footer>
  );
}
