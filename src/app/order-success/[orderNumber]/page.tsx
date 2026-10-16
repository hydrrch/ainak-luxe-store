import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Printer,
  ShoppingBag,
  Clock,
  Banknote,
} from "lucide-react";
import PrintButton from "@/components/order/PrintButton";

interface OrderSuccessPageProps {
  params: { orderNumber: string };
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  let addressData: { streetAddress?: string; city?: string; province?: string } = {};
  try {
    addressData = JSON.parse(order.shippingAddress);
  } catch {
    addressData = { streetAddress: order.shippingAddress, city: order.city };
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Hero */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl font-extrabold text-luxury-dark tracking-tight">
          Thank you, {order.customerName}!
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Your order has been received and sent to our optical laboratory. You will receive an SMS and email notification once your parcel is dispatched via TCS / Leopards Courier.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <span className="font-mono text-xs font-bold bg-gray-100 px-4 py-2 rounded-xl text-gray-800 border border-gray-200">
            Order Reference: {order.orderNumber}
          </span>
          <span className="text-xs font-semibold bg-brand-50 text-brand-800 px-4 py-2 rounded-xl border border-brand-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Status: {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Invoice Breakdown Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">
              Receipt & Optical Details
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PrintButton />
          </div>
        </div>

        {/* Customer & Shipping Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-100 text-xs">
          <div className="space-y-2">
            <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">
              Delivery Destination
            </span>
            <div className="text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{order.customerName}</p>
              <p>{addressData.streetAddress}</p>
              <p>
                {order.city}, {order.province} {order.postalCode || ""}
              </p>
              <p className="flex items-center gap-1.5 pt-1 text-gray-800">
                <Phone className="w-3.5 h-3.5 text-brand-700" />
                {order.customerPhone}
              </p>
              <p className="flex items-center gap-1.5 text-gray-800">
                <Mail className="w-3.5 h-3.5 text-brand-700" />
                {order.customerEmail}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px]">
              Payment & Courier Details
            </span>
            <div className="text-gray-600 space-y-1">
              <p>
                Method:{" "}
                <strong className="text-gray-900">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery (Pay to rider)"
                    : order.paymentMethod}
                </strong>
              </p>
              <p>
                Payment Status:{" "}
                <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {order.paymentStatus}
                </span>
              </p>
              <p className="pt-1">
                Courier: <strong>Leopards Express / TCS Tracked</strong>
              </p>
              {order.notes && (
                <p className="pt-1 italic text-gray-500">
                  Notes: &ldquo;{order.notes}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-4 pt-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">
            Order Items ({order.items.length})
          </h4>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => {
              let rx = null;
              if (item.prescriptionDetails) {
                try {
                  rx = JSON.parse(item.prescriptionDetails);
                } catch {
                  rx = null;
                }
              }

              return (
                <div key={item.id} className="py-4 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <h5 className="font-bold text-gray-900">
                      {item.productName} × {item.quantity}
                    </h5>
                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                      {item.variantName && (
                        <span>Color: <strong>{item.variantName}</strong></span>
                      )}
                      {item.lensName && (
                        <span className="font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          Lens: <strong>{item.lensName}</strong>
                        </span>
                      )}
                    </div>

                    {/* Prescription Details */}
                    {item.prescriptionImage && (
                      <div className="mt-2 p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.prescriptionImage}
                          alt="Doctor Slip"
                          className="w-12 h-12 object-cover rounded-lg border border-amber-300 shrink-0"
                        />
                        <div>
                          <span className="text-[11px] font-bold text-amber-900 block">
                            📸 Doctor Prescription Slip Uploaded
                          </span>
                          <a
                            href={item.prescriptionImage}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-brand-700 hover:underline"
                          >
                            View Uploaded Slip &rarr;
                          </a>
                        </div>
                      </div>
                    )}

                    {rx && !item.prescriptionImage && (
                      <div className="text-[11px] text-gray-700 bg-gray-50 p-2 rounded-xl border border-gray-100 space-y-0.5">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400 block">
                          Eyesight Prescription
                        </span>
                        <div>OD (Right): <strong>{rx?.sphereOD || "0.00"}</strong> | OS (Left): <strong>{rx?.sphereOS || "0.00"}</strong></div>
                        {rx?.pupillaryDistance && (
                          <div className="text-[10px] text-gray-500">Pupillary Distance: {rx.pupillaryDistance} mm</div>
                        )}
                      </div>
                    )}

                    {item.prescriptionDetails?.includes("WHATSAPP") && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                        📱 Prescription will be verified via WhatsApp with our optician.
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-brand-700 text-sm">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals Summary */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Coupon Discount ({order.couponCode})</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-luxury-dark pt-2 border-t">
            <span>Amount Due on Delivery</span>
            <span className="text-brand-700 text-base">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <Link
            href={`/track-order?orderNumber=${order.orderNumber}`}
            className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold text-center transition-colors"
          >
            Track Real-Time Status
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold text-center transition-colors shadow"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
