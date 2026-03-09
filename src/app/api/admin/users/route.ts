import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 1. ตรวจสอบสิทธิ์ว่าเป็น Super Admin หรือไม่
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "ไม่พบ Token การเข้าถึง" },
        { status: 401 },
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "super_admin") {
      return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });
    }

    // 2. เชื่อมต่อ MongoDB ตาม URI ใน .env
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 3. ดึงรายชื่อผู้ใช้ทั้งหมด เรียงตาม orderIndex
    const users = await db
      .collection("users")
      .find({})
      .sort({ orderIndex: 1 })
      .project({ password: 0 }) // ไม่ส่ง password ออกไปเพื่อความปลอดภัย
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
