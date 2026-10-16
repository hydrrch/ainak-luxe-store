import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { TryOnProvider } from "@/context/TryOnContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/layout/WhatsAppWidget";
import CartDrawer from "@/components/cart/CartDrawer";
import VirtualTryOnModal from "@/components/tryon/VirtualTryOnModal";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Ainak Luxe | Luxury Eyewear & Virtual Try-On in Pakistan",
  description:
    "Shop premium eyeglasses, designer sunglasses, and high-precision prescription lenses in Pakistan. Features real-time AI Virtual Try-On, Cash on Delivery, and free nationwide shipping.",
  keywords: [
    "Ainak",
    "Eyeglasses Pakistan",
    "Sunglasses Lahore",
    "Ray-Ban Karachi",
    "Prescription glasses online Pakistan",
    "Virtual Try-On glasses",
    "Cash on Delivery eyewear",
    "OptiStyle",
  ],
  authors: [{ name: "Ainak Luxe" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-100 selection:text-brand-900">
        <AuthProvider>
          <CartProvider>
            <TryOnProvider>
              <AnnouncementBar />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <VirtualTryOnModal />
              <WhatsAppWidget />
            </TryOnProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
