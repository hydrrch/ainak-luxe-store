"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ShoppingBag,
  Zap,
  Check,
  Sparkles,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  X,
  Glasses,
  Upload,
  FileText,
  PhoneCall,
  CheckCircle2,
  HelpCircle,
  Eye,
  Sliders,
  Image as ImageIcon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTryOn, TryOnProduct } from "@/context/TryOnContext";
import { formatPrice } from "@/lib/utils";

export interface LensOption {
  id: string;
  name: string;
  description?: string | null;
  features?: string | null;
  price: number;
  type: string;
  isActive?: boolean;
}

interface ProductPurchaseBoxProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    basePrice: number;
    salePrice?: number | null;
    inStock: boolean;
    stockCount: number;
    faceFit?: string | null;
    virtualTryOnOverlay?: string | null;
    tryOnScale?: number;
    tryOnOffsetY?: number;
    tryOnOffsetX?: number;
    frameShape?: string;
    brand?: { name: string };
    images?: Array<{ url: string }>;
    variants?: Array<{
      id: string;
      colorName: string;
      colorCode?: string | null;
      tryOnOverlay?: string | null;
      image?: string | null;
    }>;
  };
  lensOptions: LensOption[];
}

export default function ProductPurchaseBox({
  product,
  lensOptions,
}: ProductPurchaseBoxProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { openTryOn } = useTryOn();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );

  // Default to Frame Only (first option or null)
  const [selectedLensOptionId, setSelectedLensOptionId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLensModalOpen, setIsLensModalOpen] = useState(false);

  // Prescription method: "UPLOAD" | "MANUAL" | "WHATSAPP" | "ZERO_POWER"
  const [prescriptionMethod, setPrescriptionMethod] = useState<"UPLOAD" | "MANUAL" | "WHATSAPP" | "ZERO_POWER">("UPLOAD");
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Manual prescription fields
  const [prescriptionType, setPrescriptionType] = useState<string>("DISTANCE");
  const [sphereOD, setSphereOD] = useState("0.00");
  const [cylinderOD, setCylinderOD] = useState("0.00");
  const [axisOD, setAxisOD] = useState("0");
  const [additionOD, setAdditionOD] = useState("");
  const [sphereOS, setSphereOS] = useState("0.00");
  const [cylinderOS, setCylinderOS] = useState("0.00");
  const [axisOS, setAxisOS] = useState("0");
  const [additionOS, setAdditionOS] = useState("");
  const [pupillaryDistance, setPupillaryDistance] = useState("62");

  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const activeVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const activeLens = lensOptions.find((l) => l.id === selectedLensOptionId);

  const framePrice = product.salePrice ?? product.basePrice;
  const lensPrice = activeLens ? activeLens.price : 0;
  const singleUnitPrice = framePrice + lensPrice;
  const totalPrice = singleUnitPrice * quantity;

  // Handle Prescription Slip Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/prescription", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Failed to upload image");
      } else {
        setPrescriptionImage(data.url);
      }
    } catch {
      setUploadError("Network error while uploading prescription.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddToCart = async (goToCheckout = false) => {
    setIsAdding(true);
    const res = await addToCart({
      productId: product.id,
      variantId: selectedVariantId || undefined,
      lensOptionId: selectedLensOptionId || undefined,
      quantity,
      prescriptionMethod: selectedLensOptionId ? prescriptionMethod : undefined,
      prescriptionImage: selectedLensOptionId && prescriptionMethod === "UPLOAD" ? prescriptionImage || undefined : undefined,
      prescriptionType: selectedLensOptionId ? prescriptionType : undefined,
      sphereOD: selectedLensOptionId && prescriptionMethod === "MANUAL" ? sphereOD : undefined,
      cylinderOD: selectedLensOptionId && prescriptionMethod === "MANUAL" ? cylinderOD : undefined,
      axisOD: selectedLensOptionId && prescriptionMethod === "MANUAL" ? axisOD : undefined,
      additionOD: selectedLensOptionId && prescriptionMethod === "MANUAL" ? additionOD : undefined,
      sphereOS: selectedLensOptionId && prescriptionMethod === "MANUAL" ? sphereOS : undefined,
      cylinderOS: selectedLensOptionId && prescriptionMethod === "MANUAL" ? cylinderOS : undefined,
      axisOS: selectedLensOptionId && prescriptionMethod === "MANUAL" ? axisOS : undefined,
      additionOS: selectedLensOptionId && prescriptionMethod === "MANUAL" ? additionOS : undefined,
      pupillaryDistance: selectedLensOptionId && prescriptionMethod === "MANUAL" ? pupillaryDistance : undefined,
    });
    setIsAdding(false);

    if (res.success) {
      if (goToCheckout) {
        setIsCartOpen(false);
        router.push("/checkout");
      } else {
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 3000);
      }
    }
  };

  const handleLaunchTryOn = () => {
    openTryOn(product as unknown as TryOnProduct, selectedVariantId || undefined);
  };

  return (
    <div className="space-y-6">
      {/* Price Header */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-brand-700 tracking-tight">
          {formatPrice(totalPrice)}
        </span>
        {product.salePrice && (
          <span className="text-base text-gray-400 line-through">
            {formatPrice(product.basePrice * quantity)}
          </span>
        )}
        {activeLens && (
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Includes {activeLens.name}
          </span>
        )}
      </div>

      {/* Face Fit Tag */}
      {product.faceFit && (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <Glasses className="w-4 h-4 text-emerald-600" />
          <span>Fit Assessment: <strong>{product.faceFit}</strong></span>
        </div>
      )}

      {/* Color Variant Swatches */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
            Frame Color: <span className="text-brand-700">{activeVariant?.colorName}</span>
          </label>
          <div className="flex items-center gap-3">
            {product.variants.map((v) => {
              const isSelected = selectedVariantId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`relative p-1 rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-brand-700 scale-110 shadow-md ring-2 ring-brand-200"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  title={v.colorName}
                >
                  <span
                    className="block w-6 h-6 rounded-full"
                    style={{ backgroundColor: v.colorCode || "#111827" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Virtual Try-On Banner Trigger */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-950 via-luxury-dark to-gray-900 text-white flex items-center justify-between gap-4 shadow-md border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">Unsure About The Fit?</h4>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Launch our 3D mirror with your webcam or photo
            </p>
          </div>
        </div>
        <button
          onClick={handleLaunchTryOn}
          className="px-4 py-2 bg-gradient-to-r from-brand-700 to-rose-600 hover:from-brand-800 hover:to-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow shrink-0"
        >
          Try On Now
        </button>
      </div>

      {/* LENS SELECTION & PRESCRIPTION SECTION (PROMINENT WIZARD) */}
      <div className="p-5 rounded-3xl border-2 border-brand-200 bg-brand-50/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center">
              <Eye className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">
                Lens & Eyesight Prescription
              </h4>
              <p className="text-[11px] text-gray-500">
                {activeLens ? `${activeLens.name} (+${formatPrice(activeLens.price)})` : "Frame Only (Clear display lenses)"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLensModalOpen(true)}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{activeLens ? "Change Lens" : "Add Lenses"}</span>
          </button>
        </div>

        {/* Selected Lens Summary Badge */}
        {activeLens ? (
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {activeLens.name}
              </span>
              <span className="font-bold text-brand-700">+{formatPrice(activeLens.price)}</span>
            </div>

            {/* Prescription state indication */}
            {prescriptionMethod === "UPLOAD" && prescriptionImage && (
              <div className="p-2 bg-emerald-50 rounded-xl flex items-center justify-between text-[11px] text-emerald-800 border border-emerald-100">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Prescription slip uploaded
                </span>
                <button
                  onClick={() => setIsLensModalOpen(true)}
                  className="text-emerald-700 font-bold underline"
                >
                  View / Change
                </button>
              </div>
            )}

            {prescriptionMethod === "MANUAL" && (
              <div className="p-2 bg-gray-50 rounded-xl text-[11px] text-gray-700 border border-gray-100 font-mono">
                OD: SPH {sphereOD} CYL {cylinderOD} Axis {axisOD} | OS: SPH {sphereOS} CYL {cylinderOS} Axis {axisOS} | PD: {pupillaryDistance}mm
              </div>
            )}

            {prescriptionMethod === "WHATSAPP" && (
              <div className="p-2 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 border border-emerald-100 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp slip submission selected
              </div>
            )}

            {prescriptionMethod === "ZERO_POWER" && (
              <div className="p-2 bg-blue-50 rounded-xl text-[11px] text-blue-800 border border-blue-100">
                Zero Power (Plano screen / fashion protection)
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-white/80 rounded-2xl border border-dashed border-gray-300 text-center">
            <p className="text-xs text-gray-600 mb-2">
              Need Blue Cut, Photochromic Transition, or eyesight power?
            </p>
            <button
              onClick={() => setIsLensModalOpen(true)}
              className="text-xs font-bold text-brand-700 hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <span>Click here to customize your lenses</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Quantity & CTAs */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-4 text-xs font-bold text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={() => handleAddToCart(false)}
            disabled={isAdding || !product.inStock}
            className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              addedSuccess
                ? "bg-emerald-600 text-white"
                : "bg-brand-700 hover:bg-brand-800 text-white"
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Added to Bag!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                {isAdding ? "Adding..." : "Add to Bag"}
              </>
            )}
          </button>
        </div>

        {/* Buy Now Instant Checkout Button */}
        <button
          onClick={() => handleAddToCart(true)}
          disabled={isAdding || !product.inStock}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-gray-900 hover:bg-black text-white flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Zap className="w-4 h-4 text-gold-400" />
          <span>Buy Now — Cash on Delivery</span>
        </button>
      </div>

      {/* Delivery & Warranty Guarantees */}
      <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Free delivery across Pakistan on orders above Rs. 4,000</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-700" />
          <span>100% genuine frame with 7-day hassle-free replacement</span>
        </div>
      </div>

      {/* FULL-FEATURED LENS & PRESCRIPTION SELECTION MODAL */}
      {isLensModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto border border-gray-100">
            <button
              onClick={() => setIsLensModalOpen(false)}
              className="absolute top-5 right-5 p-2.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                Step 1: Choose Your Optical Lenses
              </span>
              <h3 className="text-2xl font-extrabold text-luxury-dark tracking-tight mt-1">
                Customize Lenses & Eyesight
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                All lenses are manufactured using computerized robotic surfacing and coated with hydrophobic anti-reflective seals.
              </p>
            </div>

            {/* Lens Option Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {/* Frame Only */}
              <div
                onClick={() => setSelectedLensOptionId(null)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedLensOptionId === null
                    ? "border-brand-700 bg-brand-50/60 shadow-md ring-2 ring-brand-200"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-gray-900">Frame Only (Clear Demo Lenses)</h4>
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Rs. 0</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Clear acrylic display lenses with zero prescription. Ideal if you already have an optician or want fashion glasses.
                </p>
              </div>

              {/* Lenses from database */}
              {lensOptions.map((lens) => {
                const isSelected = selectedLensOptionId === lens.id;
                const featuresList = lens.features ? lens.features.split(",") : [];

                return (
                  <div
                    key={lens.id}
                    onClick={() => setSelectedLensOptionId(lens.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand-700 bg-brand-50/60 shadow-md ring-2 ring-brand-200"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-gray-900">{lens.name}</h4>
                      <span className="text-xs font-bold text-brand-700 bg-brand-100/60 px-2.5 py-0.5 rounded">
                        +{formatPrice(lens.price)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {lens.description}
                    </p>
                    {featuresList.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {featuresList.slice(0, 3).map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md"
                          >
                            ✓ {feat.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* STEP 2: PRESCRIPTION INPUT (Appears when a lens option is selected) */}
            {selectedLensOptionId && (
              <div className="border-t border-gray-200 pt-6 space-y-5 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      Step 2: Provide Your Eyesight Prescription
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 mt-0.5">
                      How would you like to provide your eyesight details?
                    </h4>
                  </div>
                </div>

                {/* Method Switcher Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod("UPLOAD")}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      prescriptionMethod === "UPLOAD"
                        ? "border-brand-700 bg-brand-50 text-brand-900 font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <Upload className="w-5 h-5 text-brand-700" />
                    <span className="text-xs">Upload Slip Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod("MANUAL")}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      prescriptionMethod === "MANUAL"
                        ? "border-brand-700 bg-brand-50 text-brand-900 font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <Sliders className="w-5 h-5 text-brand-700" />
                    <span className="text-xs">Enter Numbers Manually</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod("WHATSAPP")}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      prescriptionMethod === "WHATSAPP"
                        ? "border-brand-700 bg-brand-50 text-brand-900 font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <PhoneCall className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">Send via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrescriptionMethod("ZERO_POWER")}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      prescriptionMethod === "ZERO_POWER"
                        ? "border-brand-700 bg-brand-50 text-brand-900 font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Zero Power (Plano)</span>
                  </button>
                </div>

                {/* Sub-form 1: Prescription Slip Upload */}
                {prescriptionMethod === "UPLOAD" && (
                  <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 text-center space-y-3">
                    {prescriptionImage ? (
                      <div className="space-y-3">
                        <div className="max-w-xs mx-auto aspect-[4/3] rounded-xl overflow-hidden border bg-white shadow-sm flex items-center justify-center p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prescriptionImage}
                            alt="Uploaded prescription slip"
                            className="max-h-full object-contain"
                          />
                        </div>
                        <p className="text-xs text-emerald-700 font-bold">
                          ✓ Prescription slip attached successfully!
                        </p>
                        <button
                          type="button"
                          onClick={() => setPrescriptionImage(null)}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Remove and upload a different photo
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-brand-700 mx-auto opacity-80" />
                        <h5 className="font-bold text-sm text-gray-900">
                          Upload Doctor&apos;s Prescription or Eyesight Card
                        </h5>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                          Take a clear photo with your phone or select an image file (JPG, PNG, PDF up to 10MB). Our opticians will verify your exact numbers.
                        </p>
                        <div>
                          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow transition-all">
                            <Upload className="w-4 h-4" />
                            <span>{uploadingImage ? "Uploading slip..." : "Choose Image File"}</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {uploadError && (
                          <p className="text-xs text-red-600 font-medium">{uploadError}</p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Sub-form 2: Manual Eyesight Number Input */}
                {prescriptionMethod === "MANUAL" && (
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                    {/* Prescription Type */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Prescription Usage
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["DISTANCE", "READING", "BIFOCAL", "PROGRESSIVE"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPrescriptionType(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              prescriptionType === type
                                ? "bg-brand-700 text-white border-brand-700 shadow-sm"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* OD & OS Values Table */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Right Eye (OD) */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                        <span className="font-extrabold text-gray-900 block border-b pb-1.5">
                          Right Eye (OD / Oculus Dexter)
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-500 font-bold block mb-1">Sphere (SPH)</label>
                            <input
                              type="text"
                              value={sphereOD}
                              onChange={(e) => setSphereOD(e.target.value)}
                              placeholder="-2.00"
                              className="w-full p-2 border rounded-lg text-xs font-mono text-center focus:ring-1 focus:ring-brand-700"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 font-bold block mb-1">Cylinder (CYL)</label>
                            <input
                              type="text"
                              value={cylinderOD}
                              onChange={(e) => setCylinderOD(e.target.value)}
                              placeholder="-0.50"
                              className="w-full p-2 border rounded-lg text-xs font-mono text-center focus:ring-1 focus:ring-brand-700"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 font-bold block mb-1">Axis</label>
                            <input
                              type="text"
                              value={axisOD}
                              onChange={(e) => setAxisOD(e.target.value)}
                              placeholder="180"
                              className="w-full p-2 border rounded-lg text-xs font-mono text-center focus:ring-1 focus:ring-brand-700"
                            />
                          </div>
                        </div>

                        {(prescriptionType === "BIFOCAL" || prescriptionType === "PROGRESSIVE") && (
                          <div>
                            <label className="text-[10px] text-gray-500 font-bold block mb-1">Addition (ADD)</label>
                            <input
                              type="text"
                              value={additionOD}
                              onChange={(e) => setAdditionOD(e.target.value)}
                              placeholder="+1.75"
                              className="w-full p-2 border rounded-lg text-xs font-mono text-center"
                            />
                          </div>
                        )}
                      </div>

                      {/* Left Eye (OS) */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                        <span className="font-extrabold text-gray-900 block border-b pb-1.5">
                          Left Eye (OS / Oculus Sinister)
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-500 font-bold block mb-1">Sphere (SPH)</label>
                            <input
                              type="text"
                              value={sphereOS}
                              onChange={(e) => setSphereOS(e.target.value)}
                              placeholder="-1.75"
                              className="w-full p-2 border rounded-lg text-xs font-mono text-center focus:ring-1 focus:ring-brand-700"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 font-bold block mb-1">Cylinder (CYL)</label>
                            <input
                              type="text"
                              value={cylinderOS}
                              onChange={(e) => setCylinderOS(e.target.value)}
                              placeholder="0.00"
                              className="w-full p-2 border rounded-lg text-xs font-mono text-center focus:ring-1 focus:ring-brand-700"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 font-bold block mb-1">Axis</label>
                            <input
                              type="text"
                              value={axisOS}
                              onChange={(e) => setAxisOS(e.target.value)}
                              placeholder="0"
                              className="w-full p-2 border rounded-lg text-xs font-mono text-center focus:ring-1 focus:ring-brand-700"
                            />
                          </div>
                        </div>

                        {(prescriptionType === "BIFOCAL" || prescriptionType === "PROGRESSIVE") && (
                          <div>
                            <label className="text-[10px] text-gray-500 font-bold block mb-1">Addition (ADD)</label>
                            <input
                              type="text"
                              value={additionOS}
                              onChange={(e) => setAdditionOS(e.target.value)}
                              placeholder="+1.75"
                              className="w-full p-2 border rounded-lg text-xs font-mono text-center"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pupillary Distance (PD) */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-gray-900 block">Pupillary Distance (PD in mm)</span>
                        <span className="text-[11px] text-gray-500">
                          Average adult PD is between 58mm – 68mm. Found on your prescription card.
                        </span>
                      </div>
                      <input
                        type="text"
                        value={pupillaryDistance}
                        onChange={(e) => setPupillaryDistance(e.target.value)}
                        placeholder="e.g. 62"
                        className="w-24 p-2 border rounded-lg text-xs font-mono text-center font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-form 3: WhatsApp Submission */}
                {prescriptionMethod === "WHATSAPP" && (
                  <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-900">
                    <h5 className="font-bold text-emerald-950 flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-emerald-600" />
                      Send Prescription on WhatsApp After Ordering
                    </h5>
                    <p className="leading-relaxed">
                      Don&apos;t have your slip right now? No problem! Complete your order with Cash on Delivery, and our senior optician will message you on WhatsApp at your phone number to collect your doctor&apos;s slip before lens glazing.
                    </p>
                  </div>
                )}

                {/* Sub-form 4: Zero Power */}
                {prescriptionMethod === "ZERO_POWER" && (
                  <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1 text-xs text-blue-900">
                    <h5 className="font-bold text-blue-950">Non-Prescription / Plano Lenses</h5>
                    <p className="leading-relaxed">
                      Your chosen lenses ({activeLens?.name || "Selected Lenses"}) will be glazed with zero vision power (0.00). Perfect for computer screen blue-light protection or fashion outdoor wear.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-xs text-gray-600">
                Total Price: <strong className="text-brand-700 text-sm">{formatPrice(singleUnitPrice)}</strong>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsLensModalOpen(false)}
                  className="flex-1 sm:flex-none px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                >
                  Save & Confirm Lens
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
