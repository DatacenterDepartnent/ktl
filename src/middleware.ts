import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // ต้องติดตั้ง npm install jose

export async function middleware(request: NextRequest) {
  // 1. รับ Token จาก Cookies (ชื่อ 'token' ต้องตรงกับตอน Login)
  const token = request.cookies.get("token")?.value;

  // 2. เตรียม Secret Key (ต้องแปลงเป็น Uint8Array สำหรับ jose)
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_key_change_me",
  );

  const { pathname } = request.nextUrl;

  // --- LOGIC 1: ป้องกันหน้า Dashboard (คนนอกห้ามเข้า) ---
  if (pathname.startsWith("/dashboard")) {
    // ถ้าไม่มี Token เลย -> ดีดไป Login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // ถ้ามี Token ต้องเช็คว่าของจริงไหม
    try {
      await jwtVerify(token, secret);
      // ถ้าผ่าน: อนุญาตให้ไปต่อ
      return NextResponse.next();
    } catch (error) {
      // ถ้า Token ปลอมหรือหมดอายุ -> ดีดไป Login และลบ Cookie ทิ้ง (ถ้าทำได้)
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // --- LOGIC 2: คนที่ Login แล้ว ห้ามเข้าหน้า Login ซ้ำ ---
  if (pathname === "/login") {
    if (token) {
      try {
        await jwtVerify(token, secret);
        // ถ้า Token ยังดีอยู่ -> ดีดไป Dashboard เลย
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (error) {
        // ถ้า Token เสีย -> ปล่อยให้อยู่หน้า Login ต่อไปเพื่อ Login ใหม่
        return NextResponse.next();
      }
    }
  }

  // เส้นทางอื่นๆ ปล่อยผ่านปกติ
  return NextResponse.next();
}

// กำหนดขอบเขตการทำงาน (Matcher) เพื่อประสิทธิภาพ
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. .*\\..* (files with extensions like .jpg, .css, .js)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
