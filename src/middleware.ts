// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("token")?.value;

//   const secret = new TextEncoder().encode(
//     process.env.JWT_SECRET || "default_secret_key_change_me",
//   );

//   // 1. ถ้าพยายามเข้าหน้า Dashboard
//   if (pathname.startsWith("/dashboard")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     try {
//       await jwtVerify(token, secret);
//       return NextResponse.next();
//     } catch (err) {
//       const res = NextResponse.redirect(new URL("/login", request.url));
//       res.cookies.delete("token");
//       return res;
//     }
//   }

//   // 2. ถ้า Login แล้ว ห้ามเข้าหน้า Login ซ้ำ
//   if (pathname === "/login") {
//     if (token) {
//       try {
//         await jwtVerify(token, secret);
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       } catch (err) {
//         return NextResponse.next();
//       }
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // สำคัญมาก: Matcher ต้องครอบคลุมแค่ Dashboard และ Login
//   matcher: ["/dashboard/:path*", "/login"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_key_change_me",
  );

  // 1. ตรวจสอบการเข้าถึงหน้า Dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // ถอดรหัส Token เพื่อเอาข้อมูล payload (เช่น role)
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role as string;

      // --- ส่วนการจัดการสิทธิ์ (RBAC) ---

      // กั้นหน้าจัดการสมาชิก และ การตั้งค่าระบบ (เฉพาะ super_admin เท่านั้น)
      // ตัวอย่าง: /dashboard/users หรือ /dashboard/settings
      if (
        pathname.startsWith("/dashboard/users") ||
        pathname.startsWith("/dashboard/settings")
      ) {
        if (userRole !== "super_admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }

      // กั้นหน้าจัดการเนื้อหาภาพรวม (admin และ super_admin เท่านั้น)
      // ถ้าเป็น user ปกติพยายามเข้าหน้าจัดการ User อื่น ให้ดีดออก
      if (pathname.startsWith("/dashboard/manage-all")) {
        if (userRole === "user") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }

      return NextResponse.next();
    } catch (err) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }

  // 2. ถ้า Login แล้ว ห้ามเข้าหน้า Login หรือ Register ซ้ำ
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (err) {
        // ถ้า Token หมดอายุ ให้ปล่อยให้เข้าหน้า Login ได้ตามปกติ
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // เพิ่มการดักจับหน้า Register ด้วยเพื่อความปลอดภัย
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
