import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import TryOnHeroBanner from "@/components/home/TryOnHeroBanner";
import HomeTabs from "@/components/home/HomeTabs";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Glasses,
  Eye,
  CheckCircle2,
  HelpCircle,
  Sun,
  Monitor,
  UploadCloud,
  Phone,
} from "lucide-react";

export const revalidate = 60; // ISR 60s

export default async function HomePage() {
  const [
    featuredProducts,
    bestsellerProducts,
    newArrivalProducts,
    brands,
    categories,
    recentReviews,
  ] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isBestseller: true },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isNewArrival: true },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      take: 8,
    }),
    prisma.brand.findMany({
      take: 8,
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.review.findMany({
      where: { isApproved: true, rating: { gte: 4 } },
      include: {
        product: { select: { name: true, slug: true } },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const allTryOnList = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    basePrice: p.basePrice,
    salePrice: p.salePrice,
    virtualTryOnOverlay: p.virtualTryOnOverlay,
    tryOnScale: p.tryOnScale,
    tryOnOffsetY: p.tryOnOffsetY,
    tryOnOffsetX: p.tryOnOffsetX,
    frameShape: p.frameShape,
    faceFit: p.faceFit,
    brand: p.brand,
    images: p.images,
    variants: p.variants,
  }));

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Campaign Section with Virtual Try-On Trigger */}
      <TryOnHeroBanner initialProducts={allTryOnList} />

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-900 via-luxury-dark to-gray-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center border border-white/10">
          <div className="flex flex-col items-center">
            <Truck className="w-8 h-8 text-gold-500 mb-2" />
            <span className="font-bold text-sm">Free Express Delivery</span>
            <span className="text-xs text-gray-400 mt-1">Across 200+ Pakistani Cities</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-gold-500 mb-2" />
            <span className="font-bold text-sm">100% Genuine Brands</span>
            <span className="text-xs text-gray-400 mt-1">Authentic frames with warranty</span>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw className="w-8 h-8 text-gold-500 mb-2" />
            <span className="font-bold text-sm">7-Day Free Exchange</span>
            <span className="text-xs text-gray-400 mt-1">Hassle-free return policy</span>
          </div>
          <div className="flex flex-col items-center">
            <Eye className="w-8 h-8 text-gold-500 mb-2" />
            <span className="font-bold text-sm">Prescription Precision</span>
            <span className="text-xs text-gray-400 mt-1">Digital robotic lens cutting</span>
          </div>
        </div>
      </section>

      {/* Category Discovery Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-luxury-dark tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Eyeglasses */}
          <Link
            href="/products?category=eyeglasses"
            className="group relative h-72 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80"
              alt="Eyeglasses"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                Daily Prescription
              </span>
              <h3 className="text-xl font-bold mt-1">Eyeglasses</h3>
              <p className="text-xs text-gray-300 mt-1 flex items-center gap-1">
                Explore 100+ Designer Frames <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          {/* Sunglasses */}
          <Link
            href="/products?category=sunglasses"
            className="group relative h-72 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
              alt="Sunglasses"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                UV400 & Polarized
              </span>
              <h3 className="text-xl font-bold mt-1">Sunglasses</h3>
              <p className="text-xs text-gray-300 mt-1 flex items-center gap-1">
                Iconic Ray-Ban, Gucci & Prada <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          {/* Men's Collection */}
          <Link
            href="/products?gender=MEN"
            className="group relative h-72 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80"
              alt="Men Eyewear"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                Sharp & Bold
              </span>
              <h3 className="text-xl font-bold mt-1">Men&apos;s Collection</h3>
              <p className="text-xs text-gray-300 mt-1 flex items-center gap-1">
                Aviator, Wayfarer & Clubmaster <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          {/* Women's Collection */}
          <Link
            href="/products?gender=WOMEN"
            className="group relative h-72 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80"
              alt="Women Eyewear"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                Chic & Glamorous
              </span>
              <h3 className="text-xl font-bold mt-1">Women&apos;s Collection</h3>
              <p className="text-xs text-gray-300 mt-1 flex items-center gap-1">
                Cat-Eye, Oversized & Round <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Interactive Product Showcase Tabs (Bestsellers / New Arrivals / Featured) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeTabs
          featuredProducts={featuredProducts as any}
          bestsellerProducts={bestsellerProducts as any}
          newArrivalProducts={newArrivalProducts as any}
        />
      </section>

      {/* Optical Laboratory & Precision Lenses Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
                Optical Laboratory & Glazing
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                Doctor Approved
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-luxury-dark tracking-tight mt-1">
              Precision Eyewear Lenses for Every Lifestyle
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Glazed in our certified laboratory in Pakistan. Add your choice of lenses to any frame with instant doctor slip upload, manual numbers, or WhatsApp.
            </p>
          </div>
          <Link
            href="/lenses"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 group shrink-0"
          >
            <span>Explore All Lens Types & Guide</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Optical Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Blue Cut */}
          <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-gray-950 text-white p-6 rounded-3xl border border-blue-800/40 shadow-xl flex flex-col justify-between hover:border-blue-500 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Monitor className="w-6 h-6" />
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                Screen Protection
              </span>
              <h3 className="font-extrabold text-base text-white">
                Blue Cut Lenses
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Blocks 99.8% of harmful 420nm blue light from screens. Eliminates digital eye strain, dryness & fatigue.
              </p>
              <div className="space-y-1 text-[11px] text-gray-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Full UV400 Solar Protection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Hydrophobic Smudge-Free Coat</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Glazing</span>
                <span className="text-sm font-extrabold text-white">+Rs. 1,500</span>
              </div>
              <Link
                href="/lenses#blue-cut"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Photochromic Transition */}
          <div className="bg-gradient-to-b from-amber-950 via-stone-900 to-gray-950 text-white p-6 rounded-3xl border border-amber-800/40 shadow-xl flex flex-col justify-between hover:border-amber-500 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-900/60 border border-amber-700/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6" />
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                Light-Adaptive
              </span>
              <h3 className="font-extrabold text-base text-white">
                Transition Lenses
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Crystal clear indoors, transforms into dark sunglasses under the sun in 30 seconds. 2-in-1 convenience.
              </p>
              <div className="space-y-1 text-[11px] text-gray-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>100% UVA & UVB Ray Block</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rapid 30s Clear-to-Dark Shift</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Glazing</span>
                <span className="text-sm font-extrabold text-white">+Rs. 3,500</span>
              </div>
              <Link
                href="/lenses#transition"
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Progressive Multi-Focal */}
          <div className="bg-gradient-to-b from-purple-950 via-slate-900 to-gray-950 text-white p-6 rounded-3xl border border-purple-800/40 shadow-xl flex flex-col justify-between hover:border-purple-500 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Digital Free-Form
              </span>
              <h3 className="font-extrabold text-base text-white">
                Progressive Lenses
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Seamless vision for distance, computer, and reading — with zero line. Modern diamond robotic surfacing.
              </p>
              <div className="space-y-1 text-[11px] text-gray-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>No Visible Dividing Line</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>35% Wider Viewing Corridors</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Glazing</span>
                <span className="text-sm font-extrabold text-white">+Rs. 6,500</span>
              </div>
              <Link
                href="/lenses#progressive"
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Anti-Glare Night Driving */}
          <div className="bg-gradient-to-b from-emerald-950 via-slate-900 to-gray-950 text-white p-6 rounded-3xl border border-emerald-800/40 shadow-xl flex flex-col justify-between hover:border-emerald-500 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                High Clarity AR
              </span>
              <h3 className="font-extrabold text-base text-white">
                Anti-Glare Lenses
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                99.4% light transmission cuts blinding highway high-beams and streetlamp reflections. Crisp night driving.
              </p>
              <div className="space-y-1 text-[11px] text-gray-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Vacuum Multi-Layer AR Film</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Scratch-Proof Hard Polymer</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Glazing</span>
                <span className="text-sm font-extrabold text-white">+Rs. 1,200</span>
              </div>
              <Link
                href="/lenses#antiglare"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Prescription Submission Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-luxury-dark to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-gray-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-400 px-2.5 py-0.5 rounded border border-gold-500/30">
              Simple Prescription Ordering
            </span>
            <h4 className="text-lg sm:text-xl font-extrabold">
              Have an Eyesight Slip from Your Eye Doctor?
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              When adding any frame to your cart, snap a photo of your slip, type your numbers manually, or select &quot;Send via WhatsApp Later&quot;. Our certified optometrists verify all numbers before robotic glazing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/products?category=eyeglasses"
              className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              Shop Eyeglass Frames
            </Link>
            <Link
              href="/lenses"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 backdrop-blur-md transition-all"
            >
              Optical Guide & FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Luxury Brands Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            World-Class Eyewear
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-luxury-dark tracking-tight mt-1">
            Official Brand Collections
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/products?brand=${b.slug}`}
              className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand-700 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-brand-50 flex items-center justify-center text-gray-700 group-hover:text-brand-700 transition-colors mb-2">
                <Glasses className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-brand-700 transition-colors">
                {b.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Verified Pakistani Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-luxury-dark tracking-tight mt-1">
              What Pakistani Customers Say
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ★ 4.9/5 Rating from 1,200+ Buyers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-500 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                {rev.title && <h5 className="font-bold text-sm text-gray-900 mb-1">{rev.title}</h5>}
                <p className="text-xs text-gray-600 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-800">{rev.authorName}</span>
                  {rev.isVerifiedPurchase && (
                    <span className="block text-[10px] text-emerald-600 font-medium">
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">
                  {rev.product.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Optical FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Help & Guidance
          </span>
          <h2 className="text-2xl font-extrabold text-luxury-dark tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              How do I use the Virtual Try-On mirror?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Click &quot;Virtual Try-On&quot; on any frame card or the top bar. You can either allow your webcam for a real-time live video preview or upload a selfie portrait. The virtual mirror calculates your eye distance, face angle, and automatically scales the glasses onto your face!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              How do I submit my optical prescription?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              On any frame detail page, click &quot;Select Lenses&quot;. Choose your preferred lens type (Blue Light blocking, Anti-Glare, Photochromic Transition, or Progressive), and enter your Sphere (SPH), Cylinder (CYL), Axis, and Pupillary Distance (PD). You can also WhatsApp your doctor&apos;s slip to 0300-1234567!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              What are the delivery times and charges across Pakistan?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Orders above Rs. 4,000 qualify for FREE delivery across Pakistan. For smaller orders, standard shipping is Rs. 200. Lahore, Karachi, and Islamabad deliveries take 24–48 hours, while other cities take 2–4 business days via Leopards & TCS Courier with live SMS tracking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              Can I pay with Cash on Delivery (COD)?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Yes! Cash on Delivery is available for all addresses across Pakistan without extra surcharge. Pay the rider upon checking your package at the doorstep.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
