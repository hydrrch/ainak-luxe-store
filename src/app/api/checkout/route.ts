import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromReq } from "@/lib/auth";
import { getOrCreateCart, calculateCartTotals } from "@/lib/cart";
import { generateOrderNumber } from "@/lib/utils";

const GUEST_COOKIE_NAME = "optistyle_guest_cart";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    const guestToken = req.cookies.get(GUEST_COOKIE_NAME)?.value || null;

    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      streetAddress,
      city,
      province = "Punjab",
      postalCode,
      paymentMethod = "COD",
      couponCode,
      notes,
    } = body;

    // Validate customer fields
    if (!customerName || !customerEmail || !customerPhone || !streetAddress || !city) {
      return NextResponse.json(
        { error: "Name, email, phone number, address, and city are required." },
        { status: 400 }
      );
    }

    // Validate Pakistani phone number format
    const cleanPhone = customerPhone.replace(/[\s-]/g, "");
    if (!/^(03\d{9}|\+923\d{9})$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid Pakistani mobile number (e.g. 0300-1234567 or +923001234567)" },
        { status: 400 }
      );
    }

    // Fetch user or guest cart
    const cart = await getOrCreateCart(user?.id, guestToken);

    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty. Please add items before checking out." },
        { status: 400 }
      );
    }

    // Inventory check before order placement
    for (const item of cart.items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!dbProduct || !dbProduct.inStock || dbProduct.stockCount < item.quantity) {
        return NextResponse.json(
          {
            error: `Sorry, "${item.product.name}" has insufficient stock (${dbProduct?.stockCount ?? 0} available).`,
          },
          { status: 400 }
        );
      }

      if (item.variantId) {
        const dbVariant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });
        if (dbVariant && dbVariant.stockCount < item.quantity) {
          return NextResponse.json(
            {
              error: `Sorry, "${item.product.name} (${dbVariant.colorName})" has insufficient stock.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Coupon verification
    let activeCoupon = null;
    if (couponCode) {
      const foundCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });
      if (
        foundCoupon &&
        foundCoupon.isActive &&
        (!foundCoupon.validUntil || foundCoupon.validUntil > new Date()) &&
        (!foundCoupon.maxUses || foundCoupon.usedCount < foundCoupon.maxUses)
      ) {
        activeCoupon = foundCoupon;
      }
    }

    // Server-side calculation
    const totals = calculateCartTotals(cart.items, activeCoupon);

    // Payment status
    let paymentStatus = "PENDING";
    if (paymentMethod === "COD") {
      paymentStatus = "PENDING"; // Paid on arrival
    } else if (paymentMethod === "SANDBOX_GATEWAY") {
      // Sandbox online transaction check
      paymentStatus = "PAID";
    }

    const orderNumber = generateOrderNumber();
    const fullAddressJson = JSON.stringify({
      streetAddress,
      city,
      province,
      postalCode: postalCode || null,
      country: "Pakistan",
    });

    // Create Order and decrement inventory inside a database transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id || null,
          customerName,
          customerEmail: customerEmail.toLowerCase().trim(),
          customerPhone: cleanPhone,
          shippingAddress: fullAddressJson,
          city,
          province,
          postalCode: postalCode || null,
          subtotal: totals.subtotal,
          discount: totals.discount,
          shippingFee: totals.shippingFee,
          total: totals.total,
          couponCode: activeCoupon ? activeCoupon.code : null,
          paymentMethod,
          paymentStatus,
          orderStatus: "PENDING",
          notes: notes || null,
          items: {
            create: cart.items.map((item) => {
              const framePrice = item.product.salePrice ?? item.product.basePrice;
              const lensPrice = item.lensOption ? item.lensOption.price : 0;
              const itemUnitPrice = framePrice + lensPrice;

              const rxDetails = item.prescriptionType || item.prescriptionImage || item.prescriptionMethod
                ? JSON.stringify({
                    prescriptionMethod: item.prescriptionMethod,
                    prescriptionImage: item.prescriptionImage,
                    prescriptionType: item.prescriptionType,
                    sphereOD: item.sphereOD,
                    cylinderOD: item.cylinderOD,
                    axisOD: item.axisOD,
                    additionOD: item.additionOD,
                    sphereOS: item.sphereOS,
                    cylinderOS: item.cylinderOS,
                    axisOS: item.axisOS,
                    additionOS: item.additionOS,
                    pupillaryDistance: item.pupillaryDistance,
                  })
                : null;

              return {
                productId: item.productId,
                variantId: item.variantId,
                lensOptionId: item.lensOptionId,
                productName: item.product.name,
                variantName: item.variant ? item.variant.colorName : null,
                lensName: item.lensOption ? item.lensOption.name : null,
                unitPrice: itemUnitPrice,
                quantity: item.quantity,
                subtotal: itemUnitPrice * item.quantity,
                prescriptionDetails: rxDetails,
                prescriptionImage: item.prescriptionImage || null,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      // Decrement product inventory
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockCount: { decrement: item.quantity },
          },
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockCount: { decrement: item.quantity },
            },
          });
        }
      }

      // Increment coupon usage count
      if (activeCoupon) {
        await tx.coupon.update({
          where: { id: activeCoupon.id },
          data: {
            usedCount: { increment: 1 },
          },
        });
      }

      // Clear cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
      paymentMethod: order.paymentMethod,
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("Checkout order creation error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
