import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. ดึงข้อมูล Token จาก Cookie
  const token = request.cookies.get("auth_token")?.value;

  // 2. ตรวจสอบเส้นทางที่ต้องการป้องกัน (Dashboard)
  // ตรวจสอบว่า user กำลังเข้าหน้า /dashboard หรือหน้าย่อยของมัน
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // ถ้าไม่มี Token ให้ส่งกลับไปหน้า Login ทันที
    if (!token) {
      // สร้าง URL สำหรับ Redirect ไปหน้า Login
      const loginUrl = new URL("/login", request.url);

      // (Optional) ส่ง path เดิมไปด้วยเพื่อให้ Login เสร็จแล้วเด้งกลับมาถูกหน้า
      // loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

      return NextResponse.redirect(loginUrl);
    }
  }

  // ถ้ามี Token หรือไม่ได้เข้าหน้า Dashboard ให้ทำงานต่อได้ปกติ
  return NextResponse.next();
}

// กำหนดขอบเขตการทำงานของ Middleware
export const config = {
  // Middleware จะทำงานเฉพาะเมื่อ User เข้ามาที่ Path เหล่านี้
  matcher: ["/dashboard/:path*"],
};
