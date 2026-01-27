import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ เปลี่ยนชื่อจาก middleware เป็น proxy
export function proxy(request: NextRequest) {
  // 1. ดึงข้อมูล Token จาก Cookie
  const token = request.cookies.get("auth_token")?.value;

  // 2. ตรวจสอบเส้นทางที่ต้องการป้องกัน (Dashboard)
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // ถ้าไม่มี Token ให้ส่งกลับไปหน้า Login ทันที
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ถ้ามี Token หรือไม่ได้เข้าหน้า Dashboard ให้ทำงานต่อได้ปกติ
  return NextResponse.next();
}

// กำหนดขอบเขตการทำงาน (ยังใช้ชื่อ config และ matcher ได้เหมือนเดิม)
export const config = {
  matcher: ["/dashboard/:path*"],
};
