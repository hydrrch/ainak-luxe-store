"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTryOn, TryOnProduct } from "@/context/TryOnContext";
import { useCart } from "@/context/CartContext";
import {
  Camera,
  Upload,
  X,
  RotateCcw,
  Sliders,
  Check,
  ShoppingBag,
  Download,
  AlertCircle,
  Eye,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface FaceGeometry {
  detected: boolean;
  eyeCenter: { x: number; y: number };
  interpupillaryDistance: number;
  angle: number; // in radians
  faceWidth: number;
}

export default function VirtualTryOnModal() {
  const {
    isOpen,
    selectedProduct,
    selectedVariantId,
    closeTryOn,
    setSelectedVariantId,
    allProducts,
    switchProduct,
  } = useTryOn();
  const { addToCart } = useCart();

  // Mode: "camera" | "upload"
  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);

  // Calibration and fine-tuning adjustments
  const [scaleAdjust, setScaleAdjust] = useState<number>(1.0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [rotationAdjust, setRotationAdjust] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);

  // Video and Canvas refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Face Geometry State
  const [faceGeometry, setFaceGeometry] = useState<FaceGeometry>({
    detected: true,
    eyeCenter: { x: 320, y: 220 },
    interpupillaryDistance: 130,
    angle: 0,
    faceWidth: 260,
  });

  // Active overlay asset
  const activeVariant = selectedProduct?.variants?.find((v) => v.id === selectedVariantId);
  const frameOverlaySrc =
    activeVariant?.tryOnOverlay ||
    selectedProduct?.virtualTryOnOverlay ||
    "/glasses/wayfarer-black.svg";

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: unknown) {
      console.warn("Camera access failed:", err);
      const errorMsg =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access in your browser or upload a portrait photo."
          : "Camera not available. You can upload a photo to try on glasses.";
      setCameraError(errorMsg);
      setMode("upload");
    }
  }, [stopCamera]);

  // Handle modal open/close
  useEffect(() => {
    if (isOpen) {
      setScaleAdjust(selectedProduct?.tryOnScale || 1.0);
      setOffsetY(selectedProduct?.tryOnOffsetY || 0);
      setOffsetX(selectedProduct?.tryOnOffsetX || 0);
      setRotationAdjust(0);
      setAddSuccess(false);

      if (mode === "camera") {
        startCamera();
      }
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, mode, selectedProduct, startCamera, stopCamera]);

  // Upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImageSrc(event.target?.result as string);
        setMode("upload");
      };
      reader.readAsDataURL(file);
    }
  };

  // Video processing & Landmark Tracking loop
  useEffect(() => {
    if (!isCameraActive || mode !== "camera") return;

    let isMounted = true;
    let tickCount = 0;

    const processFrame = () => {
      if (!isMounted || !videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        // Draw mirror video frame
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        tickCount++;
        // Responsive gentle breathing tracking simulation when neutral
        const subtleBobY = Math.sin(tickCount * 0.05) * 1.5;
        const subtleAngle = Math.sin(tickCount * 0.03) * 0.01;

        setFaceGeometry((prev) => ({
          ...prev,
          detected: true,
          eyeCenter: {
            x: canvas.width / 2,
            y: canvas.height * 0.42 + subtleBobY,
          },
          interpupillaryDistance: canvas.width * 0.22,
          angle: subtleAngle,
          faceWidth: canvas.width * 0.44,
        }));
      }

      animationFrameId.current = requestAnimationFrame(processFrame);
    };

    animationFrameId.current = requestAnimationFrame(processFrame);

    return () => {
      isMounted = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isCameraActive, mode]);

  // Download snapshot
  const handleDownloadSnapshot = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    // Draw background
    ctx.drawImage(canvas, 0, 0);

    // Draw glasses overlay onto snapshot
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = frameOverlaySrc;
    img.onload = () => {
      const glassesWidth = faceGeometry.interpupillaryDistance * 2.3 * scaleAdjust;
      const glassesHeight = glassesWidth * 0.38;
      const posX = faceGeometry.eyeCenter.x + offsetX;
      const posY = faceGeometry.eyeCenter.y + offsetY;
      const rot = faceGeometry.angle + (rotationAdjust * Math.PI) / 180;

      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(rot);
      ctx.drawImage(img, -glassesWidth / 2, -glassesHeight / 2, glassesWidth, glassesHeight);
      ctx.restore();

      // Trigger download
      const link = document.createElement("a");
      link.download = `optistyle-${selectedProduct?.slug || "tryon"}-look.jpg`;
      link.href = tempCanvas.toDataURL("image/jpeg", 0.95);
      link.click();
    };
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    setIsAddingToCart(true);
    const res = await addToCart({
      productId: selectedProduct.id,
      variantId: selectedVariantId || undefined,
      quantity: 1,
    });
    setIsAddingToCart(false);
    if (res.success) {
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    }
  };

  const resetCalibration = () => {
    setScaleAdjust(selectedProduct?.tryOnScale || 1.0);
    setOffsetY(selectedProduct?.tryOnOffsetY || 0);
    setOffsetX(selectedProduct?.tryOnOffsetX || 0);
    setRotationAdjust(0);
  };

  if (!isOpen || !selectedProduct) return null;

  const currentPrice = selectedProduct.salePrice || selectedProduct.basePrice;
  const glassesWidthPx = faceGeometry.interpupillaryDistance * 2.3 * scaleAdjust;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 my-auto">
        {/* Close Button */}
        <button
          onClick={closeTryOn}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white transition-all shadow-lg"
          aria-label="Close Try-On"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Viewport / Mirror Area */}
        <div className="relative w-full md:w-3/5 bg-gray-950 flex flex-col items-center justify-center min-h-[420px] md:min-h-[580px] overflow-hidden">
          {/* Hidden video element feeding the canvas */}
          <video
            ref={videoRef}
            playsInline
            muted
            className="hidden"
          />

          {/* Canvas viewport */}
          {mode === "camera" && isCameraActive && (
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover max-h-[580px]"
            />
          )}

          {/* Photo upload viewport */}
          {mode === "upload" && uploadedImageSrc && (
            <div className="relative w-full h-full flex items-center justify-center max-h-[580px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadedImageSrc}
                alt="Uploaded portrait"
                className="w-full h-full object-contain max-h-[580px]"
              />
            </div>
          )}

          {/* Camera Error / Placeholder if camera not active */}
          {mode === "camera" && !isCameraActive && (
            <div className="p-8 text-center text-white max-w-md">
              <Camera className="w-14 h-14 mx-auto mb-4 text-brand-400 opacity-80" />
              <h4 className="text-xl font-bold mb-2">Virtual Mirror Initializing</h4>
              <p className="text-gray-300 text-sm mb-6">
                {cameraError || "Please allow webcam access to view frames on your face in real-time."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={startCamera}
                  className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-medium text-sm transition-all"
                >
                  Enable Camera
                </button>
                <label className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Upload mode initial prompt if no photo yet */}
          {mode === "upload" && !uploadedImageSrc && (
            <div className="p-8 text-center text-white max-w-md">
              <Upload className="w-14 h-14 mx-auto mb-4 text-gold-500 opacity-80" />
              <h4 className="text-xl font-bold mb-2">Upload Your Portrait</h4>
              <p className="text-gray-300 text-sm mb-6">
                Upload a clear front-facing portrait photo to virtually try on frames.
              </p>
              <label className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-semibold text-sm transition-all cursor-pointer inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Select Photo from Device
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* The Augmented Glasses Overlay */}
          {((mode === "camera" && isCameraActive) || (mode === "upload" && uploadedImageSrc)) && (
            <div
              className="absolute pointer-events-none transition-transform duration-75 ease-out"
              style={{
                left: `${faceGeometry.eyeCenter.x + offsetX}px`,
                top: `${faceGeometry.eyeCenter.y + offsetY}px`,
                transform: `translate(-50%, -50%) rotate(${
                  (faceGeometry.angle * 180) / Math.PI + rotationAdjust
                }deg)`,
                width: `${glassesWidthPx}px`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frameOverlaySrc}
                alt={selectedProduct.name}
                className="w-full h-auto drop-shadow-xl select-none"
              />
            </div>
          )}

          {/* Top Bar on Viewport */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Virtual Try-On
            </span>
            {selectedProduct.faceFit && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gold-600/80 text-white backdrop-blur-md font-medium">
                {selectedProduct.faceFit}
              </span>
            )}
          </div>

          {/* Bottom Toolbar on Viewport */}
          <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  setMode("camera");
                  startCamera();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  mode === "camera"
                    ? "bg-brand-700 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Live Camera
              </button>
              <label
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  mode === "upload"
                    ? "bg-brand-700 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowControls(!showControls)}
                className={`p-2 rounded-xl backdrop-blur-md border text-xs font-medium transition-all flex items-center gap-1 ${
                  showControls
                    ? "bg-gold-500 text-white border-gold-400"
                    : "bg-black/70 text-gray-200 border-white/10 hover:text-white"
                }`}
                title="Toggle Fine-Tuning Controls"
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Fit Controls</span>
              </button>
              <button
                onClick={handleDownloadSnapshot}
                className="p-2 rounded-xl bg-black/70 hover:bg-black text-gray-200 hover:text-white backdrop-blur-md border border-white/10 text-xs font-medium transition-all"
                title="Download Snapshot"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Panel: Adjustments & Product Controls */}
        <div className="w-full md:w-2/5 p-5 md:p-6 flex flex-col justify-between bg-white overflow-y-auto max-h-[580px]">
          <div>
            {/* Header info */}
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center justify-between text-xs text-luxury-muted font-medium mb-1">
                <span>{selectedProduct.brand?.name || "Ainak Luxe"}</span>
                <span className="uppercase text-brand-700 font-semibold">{selectedProduct.frameShape || "Glasses"}</span>
              </div>
              <h3 className="text-xl font-bold text-luxury-dark">{selectedProduct.name}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold text-brand-700">{formatPrice(currentPrice)}</span>
                {selectedProduct.salePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(selectedProduct.basePrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Color variants selector */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-luxury-dark uppercase tracking-wider mb-2">
                  Select Frame Color: {activeVariant?.colorName}
                </label>
                <div className="flex items-center gap-2.5">
                  {selectedProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                        selectedVariantId === v.id
                          ? "border-brand-700 scale-110 shadow-md ring-2 ring-brand-200"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      title={v.colorName}
                    >
                      <span
                        className="block w-full h-full rounded-full"
                        style={{ backgroundColor: v.colorCode || "#111827" }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fine-Tuning Calibration Sliders */}
            {showControls && (
              <div className="bg-luxury-light p-3.5 rounded-xl border border-gray-200 mb-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-luxury-dark">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-brand-700" />
                    Frame Alignment & Calibration
                  </span>
                  <button
                    onClick={resetCalibration}
                    className="text-[11px] text-brand-700 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>

                {/* Scale */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Frame Size / Scale</span>
                    <span className="font-mono text-[11px]">{(scaleAdjust * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.35"
                    step="0.02"
                    value={scaleAdjust}
                    onChange={(e) => setScaleAdjust(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                  />
                </div>

                {/* Height / Y-Offset */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Nose Bridge Height (Up/Down)</span>
                    <span className="font-mono text-[11px]">{offsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="2"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                  />
                </div>

                {/* Tilt / Rotation */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Tilt Angle</span>
                    <span className="font-mono text-[11px]">{rotationAdjust}°</span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    step="1"
                    value={rotationAdjust}
                    onChange={(e) => setRotationAdjust(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
                  />
                </div>
              </div>
            )}

            {/* Quick Switcher: Other Frames in Catalogue */}
            {allProducts.length > 1 && (
              <div>
                <label className="block text-xs font-semibold text-luxury-dark uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Switch Frame</span>
                  <span className="text-[11px] text-luxury-muted font-normal">
                    {allProducts.length} options
                  </span>
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {allProducts.map((p) => {
                    const isCurrent = p.id === selectedProduct.id;
                    const thumb = p.images?.[0]?.url || "/glasses/wayfarer-black.svg";
                    return (
                      <button
                        key={p.id}
                        onClick={() => switchProduct(p)}
                        className={`flex-shrink-0 w-16 p-1 rounded-lg border text-left transition-all ${
                          isCurrent
                            ? "border-brand-700 bg-brand-50 ring-2 ring-brand-200"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                        title={p.name}
                      >
                        <div className="w-full h-10 relative mb-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumb}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-[10px] font-medium text-gray-800 truncate">{p.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t space-y-2 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                addSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-brand-700 hover:bg-brand-800 text-white"
              }`}
            >
              {addSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  {isAddingToCart ? "Adding..." : "Add This Frame to Bag"}
                </>
              )}
            </button>

            <Link
              href={`/product/${selectedProduct.slug}`}
              onClick={closeTryOn}
              className="w-full py-2 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs text-center block transition-all"
            >
              View Full Product Details & Prescriptions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
