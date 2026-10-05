import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalBookings,
      pendingBookings,
      totalCustomers,
      activeServices,
      todayBookings,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count(),

      prisma.booking.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.customer.count(),

      prisma.service.count({
        where: {
          active: true,
        },
      }),

      prisma.booking.count({
        where: {
          date: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),

      prisma.booking.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          customer: true,
          service: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalBookings,
        pendingBookings,
        totalCustomers,
        activeServices,
        todayBookings,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);

    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}