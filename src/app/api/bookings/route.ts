import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";


export async function GET() {
  try {
    // ตรวจสอบสิทธิ์ Admin ก่อนอ่านข้อมูลการจอง
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        service: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);

    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      instagram,
      serviceId,
      date,
      note,
    } = body;

    if (!name || !serviceId || !date) {
      return NextResponse.json(
        { error: "name, serviceId and date are required" },
        { status: 400 }
      );
    }

    const parsedServiceId = Number(serviceId);
    const bookingDate = new Date(date);

    if (
      !Number.isInteger(parsedServiceId) ||
      parsedServiceId <= 0 ||
      Number.isNaN(bookingDate.getTime())
    ) {
      return NextResponse.json(
        { error: "Invalid serviceId or date" },
        { status: 400 }
      );
    }

    // อนุญาตเฉพาะเวลาเริ่มต้นทุก 60 นาที
    if (
      bookingDate.getMinutes() !== 0 ||
      bookingDate.getSeconds() !== 0 ||
      bookingDate.getMilliseconds() !== 0
    ) {
      return NextResponse.json(
        {
          error:
            "กรุณาเลือกเวลาเริ่มต้นเป็นช่วงชั่วโมง เช่น 14:00 หรือ 15:00",
        },
        { status: 400 }
      );
    }

    // ตรวจสอบบริการที่เปิดใช้งาน
    const service = await prisma.service.findFirst({
      where: {
        id: parsedServiceId,
        active: true,
      },
    });

    if (!service || service.duration <= 0) {
      return NextResponse.json(
        { error: "Service not found or inactive" },
        { status: 400 }
      );
    }

    const newEnd = new Date(
      bookingDate.getTime() + service.duration * 60 * 1000
    );
    
    // ตรวจสอบว่าวันที่ลูกค้าเลือกเป็นวันหยุดร้านหรือไม่
    const dateKey = [
      bookingDate.getFullYear(),
      String(bookingDate.getMonth() + 1).padStart(2, "0"),
      String(bookingDate.getDate()).padStart(2, "0"),
    ].join("-");

    const holiday = await prisma.shopHoliday.findUnique({
      where: {
        dateKey,
      },
    });

    if (holiday) {
      return NextResponse.json(
        {
          error: "วันที่เลือกเป็นวันหยุดของร้าน กรุณาเลือกวันอื่น",
        },
        { status: 409 }
      );
    }

    // ตรวจสอบคิวที่ยังใช้งานอยู่เท่านั้น
    const existingBookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      include: {
        service: true,
      },
    });

    const hasConflict = existingBookings.some((booking) => {
      const existingStart = new Date(booking.date);
      const existingEnd = new Date(
        existingStart.getTime() +
          booking.service.duration * 60 * 1000
      );

      // ป้องกันทั้งเวลาเริ่มต้นซ้ำและช่วงเวลาทำงานทับซ้อน
      return (
        bookingDate < existingEnd &&
        newEnd > existingStart
      );
    });

    if (hasConflict) {
      return NextResponse.json(
        {
          error:
            "ช่วงเวลานี้มีคิวจองแล้ว กรุณาเลือกเวลาอื่น",
        },
        { status: 409 }
      );
    }

    // สร้างลูกค้าและคิวหลังผ่านการตรวจสอบ
    const booking = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          name,
          phone,
          instagram,
        },
      });

      return tx.booking.create({
        data: {
          customerId: customer.id,
          serviceId: parsedServiceId,
          date: bookingDate,
          note,
        },
        include: {
          customer: true,
          service: true,
        },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
 export async function PATCH(request: Request) {
try {
// ตรวจสอบสิทธิ์ Admin จากระบบ Auth เดิม
const admin = await getCurrentAdmin();

if (!admin) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const body = await request.json();
const { id, status } = body;

if (
  !Number.isInteger(Number(id)) ||
  Number(id) <= 0 ||
  !status
) {
  return NextResponse.json(
    { error: "Valid id and status are required" },
    { status: 400 }
  );
}

const allowedStatuses = 
[ "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", ];

if (!allowedStatuses.includes(status)) {
  return NextResponse.json(
    { error: "Invalid status" },
    { status: 400 }
  );
}

const booking = await prisma.booking.update({
  where: {
    id: Number(id),
  },
  data: {
    status,
  },
  include: {
    customer: true,
    service: true,
  },
});

return NextResponse.json(booking);

} catch (error) {
console.error("PATCH /api/bookings error:", error);

return NextResponse.json(
  { error: "Failed to update booking" },
  { status: 500 }
);

}
}