import { NextResponse } from "next/server";
import clientPromise from "@/lib/db"; // หรือใช้ dbConnect จากที่แนะนำไป
import bcrypt from "bcryptjs"; // แนะนำ bcryptjs เพื่อความสะดวกบน Vercel
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { recordLog } from "@/models/logger"; // นำเข้าฟังก์ชันบันทึก Log ที่เราสร้างไว้

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 1. ค้นหาผู้ใช้
    const user = await db.collection("users").findOne({ username });

    // 2. ตรวจสอบรหัสผ่าน
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 },
      );
    }

    // 3. ตรวจสอบสถานะการใช้งาน (Active Status)
    if (user.isActive === false) {
      return NextResponse.json(
        { error: "บัญชีของคุณยังไม่ได้รับการอนุมัติ กรุณาติดต่อ super_admin" },
        { status: 403 },
      );
    }

    // 4. จัดเตรียม Secret Key สำหรับ JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret_key_ktltc_2024",
    );

    // 5. สร้าง Token (ฝัง Role: super_admin / admin / user)
    const token = await new SignJWT({
      userId: user._id.toString(),
      username: user.username,
      name: user.name,
      role: user.role, // ข้อมูลนี้สำคัญมากสำหรับ Middleware
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    // 6. บันทึก Activity Log (สำหรับรายงานประจำเดือน)
    // เราบันทึกว่ามีการ Login สำเร็จ พร้อมข้อมูล IP
    try {
      await recordLog({
        userId: user._id,
        userName: user.name,
        action: "LOGIN",
        details: `เข้าสู่ระบบสำเร็จ (Role: ${user.role})`,
        req: req,
      });
    } catch (logError) {
      console.error("Failed to record log:", logError);
      // ไม่หยุดการทำงานหลักถ้า Log พัง เพื่อให้ผู้ใช้เข้าสู่ระบบได้ปกติ
    }

    const cookieStore = await cookies();

    // 7. ตั้งค่า Cookie
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 วัน
    });

    return NextResponse.json({
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        name: user.name,
        role: user.role,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 },
    );
  }
}
