import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price).replace("PKR", "Rs.");
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `OPT-${dateStr}-${randomSuffix}`;
}

export const PAKISTANI_CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Sukkur",
  "Sheikhupura",
  "Mardan",
  "Gujrat",
  "Sahiwal",
  "Kasur",
  "Rahim Yar Khan",
  "Wah Cantt",
  "Attock",
  "Jhelum"
] as const;

export const FRAME_SHAPES = [
  { value: "WAYFARER", label: "Wayfarer" },
  { value: "AVIATOR", label: "Aviator" },
  { value: "ROUND", label: "Round" },
  { value: "SQUARE", label: "Square" },
  { value: "CAT_EYE", label: "Cat Eye" },
  { value: "RECTANGLE", label: "Rectangle" },
  { value: "CLUBMASTER", label: "Clubmaster" },
  { value: "HEXAGONAL", label: "Hexagonal" },
  { value: "OVAL", label: "Oval" },
] as const;

export const FRAME_MATERIALS = [
  { value: "ACETATE", label: "Acetate (Premium)" },
  { value: "METAL", label: "Metal / Alloy" },
  { value: "TITANIUM", label: "Pure Titanium" },
  { value: "TR90", label: "TR-90 Flexible" },
  { value: "MIX_MATERIAL", label: "Mixed Material" },
] as const;

export const RIM_TYPES = [
  { value: "FULL_RIM", label: "Full Rim" },
  { value: "HALF_RIM", label: "Half Rim / Semi-Rimless" },
  { value: "RIMLESS", label: "Rimless" },
] as const;

export const FRAME_SIZES = [
  { value: "SMALL", label: "Small (Narrow)" },
  { value: "MEDIUM", label: "Medium (Standard)" },
  { value: "LARGE", label: "Large (Wide)" },
] as const;
