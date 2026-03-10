// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");

      if (isDashboardPage) {
        if (isLoggedIn) return true;
        return false; // ถ้าไม่ login ให้ redirect ไปหน้า login
      }
      return true;
    },
  },
  providers: [], // ปล่อยว่างไว้ จะไปใส่ตัวเต็มใน lib/auth.ts
} satisfies NextAuthConfig;
