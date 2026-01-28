// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
// ... imports อื่นๆ

export async function GET() {
  // 1. เช็ค Token ก่อน
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret_key_change_me",
    );
    const { payload } = await jwtVerify(token, secret);

    // 2. ⛔️ ถ้าไม่ใช่ Super Admin ห้ามดูข้อมูล!
    if (payload.role !== "super_admin") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    // ... (โค้ดดึงข้อมูลจาก DB ปกติ) ...
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
