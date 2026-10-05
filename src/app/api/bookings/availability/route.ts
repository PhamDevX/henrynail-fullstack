
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const serviceId = Number(searchParams.get("serviceId"));

    if (
      !date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isInteger(serviceId) ||
      serviceId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid date or serviceId" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        active: true,
      },
    });

    if (!service || service.duration <= 0) {
      return NextResponse.json(
        { error: "Service not found or inactive" },
        { status: 400 }
      );
    }

    // ใช้เวลาไทย UTC+7 ให้ตรงกับวันที่ลูกค้าเลือก
    const dayStart = new Date(`${date}T00:00:00+07:00`);
    const dayEnd = new Date(`${date}T23:59:59.999+07:00`);

    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        date: {
          gte: new Date(
            dayStart.getTime() - 24 * 60 * 60 * 1000
          ),
          lte: dayEnd,
        },
      },
      include: {
        service: true,
      },
    });

    const availableTimes: string[] = [];

    // ตรวจสอบเวลาเริ่มจองทุกชั่วโมง ตั้งแต่ 10:00 ถึง 21:00
    for (let hour = 10; hour <= 21; hour++) {
      const time = `${String(hour).padStart(2, "0")}:00`;
      const start = new Date(`${date}T${time}:00+07:00`);
      const end = new Date(
        start.getTime() + service.duration * 60 * 1000
      );

      const hasConflict = bookings.some((booking) => {
        const existingStart = new Date(booking.date);
        const existingEnd = new Date(
          existingStart.getTime() +
            booking.service.duration * 60 * 1000
        );

        return start < existingEnd && end > existingStart;
      });

      if (!hasConflict) {
        availableTimes.push(time);
      }
    }

    return NextResponse.json({
      date,
      serviceId,
      availableTimes,
    });
  } catch (error) {
    console.error("GET /api/bookings/availability error:", error);

    return NextResponse.json(
      { error: "Failed to check available times" },
      { status: 500 }
    );
  }
}