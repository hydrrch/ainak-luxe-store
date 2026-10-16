import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromReq } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    const body = await req.json();
    const { productId, rating, comment, title, authorName, authorEmail } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Product ID, rating, and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5 stars" },
        { status: 400 }
      );
    }

    // Check if user has an order containing this product for verified purchase badge
    let isVerifiedPurchase = false;
    const finalAuthorName = user?.name || authorName || "Anonymous Customer";
    const finalAuthorEmail = user?.email || authorEmail || null;

    if (user) {
      const pastOrder = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: {
            userId: user.id,
            paymentStatus: { in: ["PAID", "PENDING"] },
          },
        },
      });
      if (pastOrder) {
        isVerifiedPurchase = true;
      }
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user?.id || null,
        authorName: finalAuthorName,
        authorEmail: finalAuthorEmail,
        rating: parseInt(rating, 10),
        title: title || null,
        comment,
        isVerifiedPurchase,
        isApproved: true, // auto-approve for seamless store experience
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Thank you! Your review has been published.",
    });
  } catch (error) {
    console.error("Review submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
