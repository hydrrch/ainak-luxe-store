"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Camera, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useTryOn, TryOnProduct } from "@/context/TryOnContext";

export default function TryOnHeroBanner({ initialProducts }: { initialProducts: TryOnProduct[] }) {
  const { openTryOn, setAllProducts } = useTryOn();

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setAllProducts(initialProducts);
    }
  }, [initialProducts, setAllProducts]);

  const handleLaunchTryOn = () => {
    if (initialProducts && initialProducts.length > 0) {
      openTryOn(initialProducts[0]);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-950 via-luxury-dark to-slate-900 text-white overflow-hidden py-16 sm:py-24">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-gold-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pakistan&apos;s #1 Virtual Eyewear Mirror</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Experience Frames on Your Face <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-rose-300 to-gold-400">
                Before You Order.
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Explore 100% authentic Ray-Ban, Prada, Gucci, and luxury optical frames. Use your camera to preview true-to-life fit, scale, and color—with zero guesswork and guaranteed fit.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleLaunchTryOn}
                className="px-8 py-4 bg-gradient-to-r from-brand-700 to-rose-600 hover:from-brand-800 hover:to-rose-700 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center gap-2.5 transition-all group scale-100 hover:scale-[1.02]"
              >
                <Camera className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform" />
                <span>Launch Virtual Try-On</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </button>

              <Link
                href="/products?category=eyeglasses"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Micro-Trust Features */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-gray-400 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Live Camera & Photo Upload
              </span>
              <span className="flex items-center gap-1.5 text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Cash on Delivery (All Pakistan)
              </span>
              <span className="flex items-center gap-1.5 text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                7-Day Free Exchange
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
              {/* Top Bar of Mock Mirror */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">OptiMirror AI v2.4</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-mono text-[10px]">
                  PUPIL TRACKING
                </span>
              </div>

              {/* Visual Model Portrait with Glass Overlay */}
              <div className="relative my-4 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                  alt="Virtual Try-On Demonstration"
                  className="w-full h-full object-cover"
                />
                {/* Simulated Glass Overlay aligned to portrait eyes */}
                <div className="absolute top-[37%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 pointer-events-none drop-shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/glasses/wayfarer-black.svg"
                    alt="Simulated frame"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md py-1.5 px-3 rounded-xl text-center text-[11px] text-gray-200 border border-white/15">
                  ✨ Instant 3D facial fit calculation
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="font-bold text-sm text-white">Ray-Ban Original Wayfarer</h4>
                  <p className="text-xs text-gold-400 font-semibold">Rs. 18,500</p>
                </div>
                <button
                  onClick={handleLaunchTryOn}
                  className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow"
                >
                  Try on You
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
