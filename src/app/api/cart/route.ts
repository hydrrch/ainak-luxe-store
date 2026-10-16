import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromReq } from "@/lib/auth";
import { getOrCreateCart, calculateCartTotals } from "@/lib/cart";

export const dynamic = "force-dynamic";

const GUEST_COOKIE_NAME = "optistyle_guest_cart";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    const guestToken = req.cookies.get(GUEST_COOKIE_NAME)?.value || null;

    const cart = await getOrCreateCart(user?.id, guestToken);

    // Check if coupon is passed in query
    const couponCode = req.nextUrl.searchParams.get("coupon");
    let activeCoupon = null;

    if (couponCode) {
      const foundCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });
      if (
        foundCoupon &&
        foundCoupon.isActive &&
        (!foundCoupon.validUntil || foundCoupon.validUntil > new Date())
      ) {
        activeCoupon = foundCoupon;
      }
    }

    const totals = calculateCartTotals(cart.items, activeCoupon);

    const response = NextResponse.json({
      cart,
      totals,
      appliedCoupon: activeCoupon
        ? {
            code: activeCoupon.code,
            discountType: activeCoupon.discountType,
            discountValue: activeCoupon.discountValue,
          }
        : null,
    });

    if (!user && !guestToken && cart.sessionToken) {
      response.cookies.set(GUEST_COOKIE_NAME, cart.sessionToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    let guestToken = req.cookies.get(GUEST_COOKIE_NAME)?.value || null;

    const body = await req.json();
    const {
      productId,
      variantId,
      lensOptionId,
      quantity = 1,
      prescriptionMethod,
      prescriptionImage,
      prescriptionType,
      sphereOD,
      cylinderOD,
      axisOD,
      additionOD,
      sphereOS,
      cylinderOS,
      axisOS,
      additionOS,
      pupillaryDistance,
    } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.inStock || product.stockCount < quantity) {
      return NextResponse.json(
        { error: "Product is out of stock or insufficient quantity" },
        { status: 400 }
      );
    }

    const cart = await getOrCreateCart(user?.id, guestToken);

    // Look for matching item in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        lensOptionId: lensOptionId || null,
        prescriptionType: prescriptionType || null,
        prescriptionImage: prescriptionImage || null,
        sphereOD: sphereOD || null,
        sphereOS: sphereOS || null,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          lensOptionId: lensOptionId || null,
          quantity,
          prescriptionMethod: prescriptionMethod || null,
          prescriptionImage: prescriptionImage || null,
          prescriptionType: prescriptionType || null,
          sphereOD: sphereOD || null,
          cylinderOD: cylinderOD || null,
          axisOD: axisOD || null,
          additionOD: additionOD || null,
          sphereOS: sphereOS || null,
          cylinderOS: cylinderOS || null,
          axisOS: axisOS || null,
          additionOS: additionOS || null,
          pupillaryDistance: pupillaryDistance || null,
        },
      });
    }

    // Refetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                brand: true,
              },
            },
            variant: true,
            lensOption: true,
          },
        },
      },
    });

    const totals = calculateCartTotals(updatedCart?.items || []);

    const response = NextResponse.json({
      success: true,
      cart: updatedCart,
      totals,
    });

    if (!user && !guestToken && cart.sessionToken) {
      response.cookies.set(GUEST_COOKIE_NAME, cart.sessionToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    const guestToken = req.cookies.get(GUEST_COOKIE_NAME)?.value || null;
    const { itemId, quantity } = await req.json();

    if (!itemId || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "Item ID and valid quantity required" },
        { status: 400 }
      );
    }

    const cart = await getOrCreateCart(user?.id, guestToken);

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: { id: itemId, cartId: cart.id },
      });
    } else {
      await prisma.cartItem.updateMany({
        where: { id: itemId, cartId: cart.id },
        data: { quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                brand: true,
              },
            },
            variant: true,
            lensOption: true,
          },
        },
      },
    });

    const totals = calculateCartTotals(updatedCart?.items || []);

    return NextResponse.json({
      success: true,
      cart: updatedCart,
      totals,
    });
  } catch (error) {
    console.error("Cart PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    const guestToken = req.cookies.get(GUEST_COOKIE_NAME)?.value || null;
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    const clearAll = searchParams.get("clear") === "true";

    const cart = await getOrCreateCart(user?.id, guestToken);

    if (clearAll) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    } else if (itemId) {
      await prisma.cartItem.deleteMany({
        where: { id: itemId, cartId: cart.id },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                brand: true,
              },
            },
            variant: true,
            lensOption: true,
          },
        },
      },
    });

    const totals = calculateCartTotals(updatedCart?.items || []);

    return NextResponse.json({
      success: true,
      cart: updatedCart,
      totals,
    });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
