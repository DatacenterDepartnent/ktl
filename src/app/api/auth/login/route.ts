import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose"; // ใช้สำหรับสร้าง Token
import { cookies } from "next/headers"; // ใช้สำหรับจัดการ Cookie

export async function POST(req: Request) {
  try {
    // 1. รับข้อมูลจากหน้าบ้าน
    const { username, password } = await req.json();

    // 2. เชื่อมต่อฐานข้อมูล
    const client = await clientPromise;
    const user = await client
      .db("ktltc_db")
      .collection("users")
      .findOne({ username });

    // 3. ตรวจสอบว่ามี User หรือไม่ และรหัสผ่านถูกต้องไหม
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 },
      );
    }

    // 4. 🔴 ตรวจสอบสถานะการอนุมัติ (Active Check)
    if (user.isActive === false) {
      return NextResponse.json(
        { error: "บัญชีของคุณยังไม่ได้รับการอนุมัติ กรุณาติดต่อผู้ดูแลระบบ" },
        { status: 403 }, // 403 Forbidden
      );
    }

    // 5. ✅ Login สำเร็จ -> สร้าง Session (JWT Token)

    // กำหนด Secret Key (ควรเก็บใน .env)
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret_key_change_me",
    );

    // สร้าง Token
    const token = await new SignJWT({
      userId: user._id.toString(),
      username: user.username,
      role: user.role, // ใส่ Role เข้าไปใน Token ด้วยเพื่อเช็คสิทธิ์ภายหลัง
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d") // หมดอายุใน 1 วัน
      .sign(secret);

    // ฝัง Token ลงใน Cookie
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true, // JavaScript เข้าถึงไม่ได้ (ป้องกัน XSS)
      secure: process.env.NODE_ENV === "production", // ใช้ HTTPS ใน Production
      sameSite: "strict", // ป้องกัน CSRF
      path: "/", // ใช้ได้ทุกหน้า
      maxAge: 60 * 60 * 24, // 1 วัน (หน่วยเป็นวินาที)
    });

    // ส่ง Response กลับไปบอกหน้าบ้าน
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
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
