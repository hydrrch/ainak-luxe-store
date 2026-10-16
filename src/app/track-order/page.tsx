"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_STEPS = [
  { key: "PENDING", label: "Order Received", desc: "Your order details have been verified" },
  { key: "CONFIRMED", label: "Confirmed", desc: "Optical frame reserved in inventory" },
  { key: "PROCESSING", label: "Lens Glazing", desc: "Digital lab cut & prescription fitting" },
  { key: "SHIPPED", label: "Dispatched", desc: "Handed over to TCS / Leopards Courier" },
  { key: "DELIVERED", label: "Delivered", desc: "Package received and payment completed" },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchOrder = async (queryNumber: string) => {
    if (!queryNumber.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(queryNumber.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Order not found. Please verify your order number.");
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch {
      setErrorMsg("Failed to connect to tracking service.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  const getStepStatus = (stepKey: string) => {
    if (!order) return "upcoming";
    const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
    const currentIndex = statusOrder.indexOf(order.orderStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (order.orderStatus === "CANCELLED") return "cancelled";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Live Shipment Radar
        </span>
        <h1 className="text-3xl font-extrabold text-luxury-dark tracking-tight">
          Track Your Eyewear Order
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Enter your unique Ainak Luxe order reference number (e.g. <code>OPT-2026-1001</code>) to track your delivery status.
        </p>
      </div>

      {/* Tracking Search Input Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleTrackSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Package className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="Enter Order Number (e.g. OPT-2026-1001)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 text-xs font-mono uppercase focus:ring-2 focus:ring-brand-700 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl text-xs font-bold transition-all shadow flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "Searching..." : "Track"}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Active Tracking Result */}
      {order && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in-50">
          {/* Order Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Order Tracking
              </span>
              <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">
                {order.orderNumber}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Ordered by <strong>{order.customerName}</strong> on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                {order.orderStatus}
              </span>
              {order.trackingNumber && (
                <p className="text-[11px] font-mono text-gray-600 mt-1">
                  Courier Tracking: <strong>{order.trackingNumber}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {STATUS_STEPS.map((step) => {
                const status = getStepStatus(step.key);
                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        status === "completed"
                          ? "bg-emerald-600 text-white shadow"
                          : status === "current"
                          ? "bg-brand-700 text-white ring-4 ring-brand-100 shadow-md animate-pulse"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-bold text-xs text-gray-900 mt-2">
                      {step.label}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5 max-w-[130px]">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100 text-xs text-gray-600">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-1.5">
              <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px] mb-2">
                Destination
              </span>
              <p className="font-semibold text-gray-900">{order.customerName}</p>
              <p>{order.city}, {order.province}</p>
              <p>Phone: {order.customerPhone}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-1.5">
              <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px] mb-2">
                Financials
              </span>
              <p>Payment Mode: <strong>{order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}</strong></p>
              <p>Payment Status: <strong>{order.paymentStatus}</strong></p>
              <p>Total Due: <strong className="text-brand-700 text-sm">{formatPrice(order.total)}</strong></p>
            </div>
          </div>

          {/* Items In Shipment */}
          <div className="pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-3">
              Shipment Contents ({order.items.length})
            </h4>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-2.5 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{item.productName}</span>
                    <span className="text-gray-500"> × {item.quantity}</span>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px]">
                      {item.variantName && (
                        <span className="text-gray-500">Color: <strong>{item.variantName}</strong></span>
                      )}
                      {item.lensName && (
                        <span className="text-purple-900 bg-purple-50 px-1.5 py-0.5 rounded font-medium border border-purple-200">
                          Lens: <strong>{item.lensName}</strong>
                        </span>
                      )}
                      {item.prescriptionImage && (
                        <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold border border-amber-200">
                          📸 Rx Slip Attached
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-gray-800">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading order tracker...</p>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
