// // src/auth.config.ts
// import type { NextAuthConfig } from "next-auth";

// export const authConfig = {
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");

//       if (isDashboardPage) {
//         if (isLoggedIn) return true;
//         return false; // ถ้าไม่ login ให้ redirect ไปหน้า login
//       }
//       return true;
//     },
//   },
//   providers: [], // ปล่อยว่างไว้ จะไปใส่ตัวเต็มใน lib/auth.ts
// } satisfies NextAuthConfig;

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // ปล่อยว่างไว้ เดี๋ยวไปใส่ใน auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
