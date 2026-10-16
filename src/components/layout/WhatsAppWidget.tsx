"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "923001234567";
  const defaultMessage = "Hi Ainak Luxe, I need assistance choosing eyewear / lenses.";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  AL
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-emerald-600" />
              </div>
              <div>
                <h6 className="font-bold text-sm">Ainak Luxe Support</h6>
                <p className="text-[11px] text-emerald-100">Typically replies within minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded"
              aria-label="Close chat bubble"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-gray-50 text-xs text-gray-700 space-y-3">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <p className="font-medium text-gray-900 mb-1">Assalam-o-Alaikum! 👋</p>
              <p className="text-gray-600 leading-relaxed">
                Need help picking the right frame size for your face or attaching your prescription? We are here to help!
              </p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Start WhatsApp Chat
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-105"
        aria-label="Chat with Optician on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          Need Help? Chat with Us
        </span>
      </button>
    </div>
  );
}
