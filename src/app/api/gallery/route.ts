import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    
    const gallery = await prisma.gallery.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("GET /api/gallery error:", error);

    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    
const admin = await getCurrentAdmin();

if (!admin) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
    const body = await request.json();

    const { image, title } = body;

    if (!image || !title) {
      return NextResponse.json(
        { error: "image and title are required" },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.create({
      data: {
        image: image.trim(),
        title: title.trim(),
      },
    });

    return NextResponse.json(gallery, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/gallery error:", error);

    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    
const admin = await getCurrentAdmin();

if (!admin) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
    const body = await request.json();

    const { id, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.update({
      where: {
        id: Number(id),
      },
      data: {
        active: Boolean(active),
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("PATCH /api/gallery error:", error);

    return NextResponse.json(
      { error: "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    await prisma.gallery.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/gallery error:", error);

    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}