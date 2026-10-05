
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // ตรวจสอบว่าผู้ใช้ล็อกอินเป็น Admin อยู่หรือไม่
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currentPassword = String(body.currentPassword ?? "");
    const newPassword = String(body.newPassword ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "รหัสผ่านใหม่ไม่ตรงกัน" },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านเดิม" },
        { status: 400 }
      );
    }

    // อ่านรหัสผ่านล่าสุดจากฐานข้อมูล
    const currentAdmin = await prisma.admin.findUnique({
      where: { id: admin.id },
    });

    if (!currentAdmin) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูล Admin" },
        { status: 404 }
      );
    }

    const passwordValid = await bcrypt.compare(
      currentPassword,
      currentAdmin.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.admin.update({
      where: { id: currentAdmin.id },
      data: { passwordHash },
    });

    // เพิกถอน Session เดิมทั้งหมด เพื่อให้ต้องล็อกอินใหม่
    await prisma.adminSession.deleteMany({
      where: { adminId: currentAdmin.id },
    });

    const response = NextResponse.json({
      success: true,
      message: "เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่",
    });

    response.cookies.delete("henrynail_admin_session");

    return response;
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" },
      { status: 500 }
    );
  }
}