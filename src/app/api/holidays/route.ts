
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const holidays = await prisma.shopHoliday.findMany({
    orderBy: { date: "asc" },
  });

  return NextResponse.json(holidays);
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const dateKey = String(body.dateKey ?? "");
    const reason = body.reason
      ? String(body.reason).trim()
      : null;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return NextResponse.json(
        { error: "วันที่ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const date = new Date(`${dateKey}T00:00:00.000Z`);

    const holiday = await prisma.shopHoliday.create({
      data: {
        date,
        dateKey,
        reason,
      },
    });

    return NextResponse.json(holiday, { status: 201 });
  } catch (error) {
  console.error("CREATE HOLIDAY ERROR:", error);

  return NextResponse.json(
    { error: "เกิดข้อผิดพลาดขณะเพิ่มวันหยุด กรุณาตรวจสอบ Terminal" },
    { status: 500 }
  );
}
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const dateKey = String(body.dateKey ?? "");

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return NextResponse.json(
        { error: "วันที่ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const holiday = await prisma.shopHoliday.delete({
      where: { dateKey },
    });

    return NextResponse.json(holiday);
  } catch {
    return NextResponse.json(
      { error: "ไม่พบวันหยุดนี้ หรือไม่สามารถลบได้" },
      { status: 400 }
    );
  }
}