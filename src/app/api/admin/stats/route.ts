import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromReq } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromReq(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const [
      totalOrders,
      ordersAgg,
      totalCustomers,
      lowStockProducts,
      recentOrders,
      totalProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { orderStatus: { not: "CANCELLED" } },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.findMany({
        where: { stockCount: { lte: 10 } },
        select: { id: true, name: true, sku: true, stockCount: true, basePrice: true },
        take: 10,
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            take: 2,
            select: { productName: true, quantity: true, unitPrice: true },
          },
        },
      }),
      prisma.product.count(),
    ]);

    const totalRevenue = ordersAgg._sum.total || 0;

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts,
      recentOrders,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
