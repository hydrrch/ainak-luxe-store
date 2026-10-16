"use client";

import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, Truck, Sparkles, ShieldCheck } from "lucide-react";

const announcements = [
  {
    icon: Truck,
    text: "FREE Express Delivery Across Pakistan on Orders Above Rs. 4,000",
  },
  {
    icon: Sparkles,
    text: "Use Code AINAK10 for 10% OFF Your First Pair",
  },
  {
    icon: ShieldCheck,
    text: "100% Authentic Luxury Eyewear with 7-Day Hassle-Free Replacement",
  },
];

export default function AnnouncementBar() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIdx];
  const Icon = current.icon;

  return (
    <div className="bg-luxury-dark text-white text-xs border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Contact Hotline */}
        <div className="hidden md:flex items-center gap-4 text-gray-300">
          <a
            href="tel:+923001234567"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold-500" />
            <span>0300-1234567</span>
          </a>
          <span className="text-gray-600">|</span>
          <a
            href="https://wa.me/923001234567?text=Hi%20Ainak%20Luxe,%20I%20have%20an%20eyewear%20inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Support</span>
          </a>
        </div>

        {/* Center Rotating Notification */}
        <div className="flex-1 flex items-center justify-center gap-2 font-medium tracking-wide">
          <Icon className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
          <span className="transition-opacity duration-500">{current.text}</span>
        </div>

        {/* Right Cities Served */}
        <div className="hidden lg:flex items-center gap-2 text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Serving Lahore, Karachi, Islamabad & All Pakistan</span>
        </div>
      </div>
    </div>
  );
}
