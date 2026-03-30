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
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  // 1. จัดการหน้า Login/Register (ถ้าเข้าแล้วให้ไป Dashboard)
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // 2. ถ้าไม่ได้ Login แต่จะเข้า Dashboard (ปกติ callback authorized จะช่วยเช็ค แต่ดักซ้ำเพื่อความชัวร์)
  if (isDashboardPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 3. การจัดการสิทธิ์ (RBAC) สำหรับ Dashboard เดิม
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

    // กั้นหน้าจัดการเนื้อหาภาพรวม (ถ้าเป็น user ทั่วไปให้ดีดออก)
    if (nextUrl.pathname.startsWith("/dashboard/manage-all")) {
      if (userRole === "user") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
    }
  }

  // 4. การจัดการสิทธิ์ระบบ Attendance (WFH & Reports)
  const isWfhPage = nextUrl.pathname.startsWith("/wfh") || nextUrl.pathname.startsWith("/check-in") || nextUrl.pathname.startsWith("/leave-request");
  
  // แบ่งหมวดหมู่หน้า Admin เพื่อจัดการสิทธิ์แยกตามระดับ
  const isAttendanceDashboard = nextUrl.pathname.startsWith("/attendance-dashboard");
  const isFullAdminAttendance = nextUrl.pathname.startsWith("/attendance-report") || 
                               nextUrl.pathname.startsWith("/leave-approvals") || 
                               nextUrl.pathname.startsWith("/attendance-settings") ||
                               nextUrl.pathname.startsWith("/work-reports");

  if ((isWfhPage || isAttendanceDashboard || isFullAdminAttendance) && !isLoggedIn) {
     return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn) {
    // 4.1 สิทธิ์เข้าหน้า Dashboard ภาพรวม (สำหรับทุก Deputy)
    if (isAttendanceDashboard) {
      const allowedDashboardRoles = ["super_admin", "admin", "hr", "director", "deputy_resource", "deputy_strategy", "deputy_activities", "deputy_student_affairs", "editor", "staff"];
      if (!allowedDashboardRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/wfh", nextUrl));
      }
    }

    // 4.2 สิทธิ์เข้าหน้าจัดการเต็มรูปแบบ (Report, Approvals, Settings, Work Reports)
    // รองฝ่ายบริหารทรัพยากร (deputy_resource) เข้าได้ทุกหน้า
    // รองฝ่ายอื่นๆ เข้าไม่ได้
    if (isFullAdminAttendance) {
      const allowedFullAdminRoles = ["super_admin", "admin", "hr", "director", "deputy_resource", "editor", "staff"];
      if (!allowedFullAdminRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/attendance-dashboard", nextUrl));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/wfh/:path*",
    "/check-in/:path*",
    "/attendance-dashboard/:path*",
    "/attendance-report/:path*",
    "/login",
    "/register",
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
