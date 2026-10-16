"use client";

import React from "react";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
      title="Print invoice receipt"
    >
      <Printer className="w-4 h-4 text-brand-700" />
      <span>Print Invoice</span>
    </button>
  );
}
