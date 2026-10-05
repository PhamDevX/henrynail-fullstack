import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/settings error:", error);

    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: "key is required" },
        { status: 400 }
      );
    }

    const setting = await prisma.setting.upsert({
      where: {
        key: key.trim(),
      },
      update: {
        value: value ?? "",
      },
      create: {
        key: key.trim(),
        value: value ?? "",
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("POST /api/settings error:", error);

    return NextResponse.json(
      { error: "Failed to save setting" },
      { status: 500 }
    );
  }
}