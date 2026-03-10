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

// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; // ตรวจสอบว่ามี session หรือไม่
  const userRole = (req.auth?.user as any)?.role;

  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  // 1. ถ้าพยายามเข้าหน้า Dashboard แต่ยังไม่ Login ให้ไปหน้า Login
  if (isDashboardPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 2. ถ้า Login แล้ว ห้ามเข้าหน้า Login/Register ซ้ำ
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // 3. การจัดการสิทธิ์ (RBAC)
  if (isDashboardPage && isLoggedIn) {
    // กั้นหน้าเฉพาะ super_admin
    if (
      nextUrl.pathname.startsWith("/dashboard/users") ||
      nextUrl.pathname.startsWith("/dashboard/settings")
    ) {
      if (userRole !== "super_admin") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
    }

    // กั้นหน้าจัดการเนื้อหาภาพรวม (admin และ super_admin เท่านั้น)
    if (nextUrl.pathname.startsWith("/dashboard/manage-all")) {
      if (userRole === "user") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  // ดักจับทุกหน้ายกเว้นหน้า static และหน้าแรก
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
