import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // ✅ ใช้ jose เพื่อเช็คว่า Token ของจริงไหม

export async function middleware(request: NextRequest) {
  // 1. ✅ แก้ชื่อ Cookie ให้ตรงกับ Login API (จาก auth_token เป็น token)
  const token = request.cookies.get("token")?.value;

  // คีย์ลับสำหรับตรวจสอบ (ต้องตรงกับใน .env)
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_key_change_me",
  );

  // 2. กรณีเข้าหน้า Dashboard (พื้นที่หวงห้าม)
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // ถ้าไม่มี Token -> ดีดไป Login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // มี Token แต่ต้องเช็คว่าเป็นของจริงไหม (ป้องกันการปลอม Cookie)
    try {
      await jwtVerify(token, secret);
      return NextResponse.next(); // ผ่าน!
    } catch (error) {
      // Token ปลอมหรือหมดอายุ -> ดีดไป Login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. ✅ (แถม) กรณีเข้าหน้า Login แต่มี Token อยู่แล้ว -> ให้เด้งไป Dashboard เลย
  if (request.nextUrl.pathname === "/login" && token) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      // Token เสีย ให้ login ใหม่ได้ปกติ
    }
  }

  return NextResponse.next();
}

// กำหนดขอบเขตให้ทำงานทั้งหน้า Dashboard และหน้า Login
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
