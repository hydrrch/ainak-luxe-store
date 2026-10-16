import { prisma } from "./prisma";

export interface CartCalculation {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
}

export async function getOrCreateCart(userId?: string | null, sessionToken?: string | null) {
  if (userId) {
    let userCart = await prisma.cart.findUnique({
      where: { userId },
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

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId },
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
    }

    // If there is also a sessionToken with items, merge guest cart into user cart
    if (sessionToken) {
      const guestCart = await prisma.cart.findUnique({
        where: { sessionToken },
        include: { items: true },
      });

      if (guestCart && guestCart.items.length > 0) {
        for (const guestItem of guestCart.items) {
          const existingItem = userCart.items.find(
            (i) =>
              i.productId === guestItem.productId &&
              i.variantId === guestItem.variantId &&
              i.lensOptionId === guestItem.lensOptionId
          );

          if (existingItem) {
            await prisma.cartItem.update({
              where: { id: existingItem.id },
              data: { quantity: existingItem.quantity + guestItem.quantity },
            });
          } else {
            await prisma.cartItem.create({
              data: {
                cartId: userCart.id,
                productId: guestItem.productId,
                variantId: guestItem.variantId,
                lensOptionId: guestItem.lensOptionId,
                quantity: guestItem.quantity,
                prescriptionMethod: guestItem.prescriptionMethod,
                prescriptionImage: guestItem.prescriptionImage,
                prescriptionType: guestItem.prescriptionType,
                sphereOD: guestItem.sphereOD,
                cylinderOD: guestItem.cylinderOD,
                axisOD: guestItem.axisOD,
                additionOD: guestItem.additionOD,
                sphereOS: guestItem.sphereOS,
                cylinderOS: guestItem.cylinderOS,
                axisOS: guestItem.axisOS,
                additionOS: guestItem.additionOS,
                pupillaryDistance: guestItem.pupillaryDistance,
              },
            });
          }
        }

        // Delete guest cart after merge
        await prisma.cart.delete({ where: { id: guestCart.id } });

        // Refresh user cart
        userCart = (await prisma.cart.findUnique({
          where: { id: userCart.id },
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
        }))!;
      }
    }

    return userCart;
  }

  // Guest Cart by sessionToken
  if (!sessionToken) {
    sessionToken = "guest_" + Math.random().toString(36).substring(2) + Date.now();
  }

  let cart = await prisma.cart.findUnique({
    where: { sessionToken },
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

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionToken },
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
  }

  return cart;
}

export function calculateCartTotals(
  items: Array<{
    quantity: number;
    product: { basePrice: number; salePrice?: number | null };
    lensOption?: { price: number } | null;
  }>,
  coupon?: { discountType: string; discountValue: number; minOrderAmount: number } | null,
  shippingThreshold = 4000,
  standardShippingFee = 200
): CartCalculation {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of items) {
    const itemFramePrice = item.product.salePrice ?? item.product.basePrice;
    const itemLensPrice = item.lensOption ? item.lensOption.price : 0;
    const unitPrice = itemFramePrice + itemLensPrice;
    subtotal += unitPrice * item.quantity;
    itemCount += item.quantity;
  }

  let discount = 0;
  if (coupon && subtotal >= coupon.minOrderAmount) {
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }
  }

  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : standardShippingFee;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    subtotal,
    discount,
    shippingFee,
    total,
    itemCount,
  };
}
