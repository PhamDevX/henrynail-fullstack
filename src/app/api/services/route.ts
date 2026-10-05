import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth"; 

export async function GET() {
  try {
    const services = await prisma.service.findMany({
  orderBy: {
    id: "asc",
  },
});

    return NextResponse.json(services);
    } catch (error) {
    console.error("GET /api/services error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch services",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}export async function POST(request: Request) {
  try {
    
const admin = await getCurrentAdmin();

if (!admin) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
    const body = await request.json();

    const { name, description, price, duration } = body;

    if (!name || !duration) {
      return NextResponse.json(
        { error: "name and duration are required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: Number(price) || 0,
        duration: Number(duration),
      },
    });

    return NextResponse.json(service, { status: 201 });
 } catch (error) {
  console.error("GET /api/services error:", error);

  const dbUrl = process.env.DATABASE_URL || "";

  let dbHost = "unknown";

  try {
    dbHost = new URL(dbUrl).hostname;
  } catch {}

  return NextResponse.json(
    {
      error: "Failed to fetch services",
      dbHost,
      details: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
}export async function PATCH(request: Request) {
  try {
    
const admin = await getCurrentAdmin();

if (!admin) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
    const body = await request.json();

    const { id, name, description, price, duration, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(price !== undefined && {
          price: Number(price),
        }),
        ...(duration !== undefined && {
          duration: Number(duration),
        }),
        ...(active !== undefined && {
          active: Boolean(active),
        }),
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("PATCH /api/services error:", error);

    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}export async function DELETE(request: Request) {
  try {
    
const admin = await getCurrentAdmin();

if (!admin) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await prisma.service.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/services error:", error);

    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}