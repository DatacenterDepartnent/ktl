import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "ชื่อผู้ใช้งาน", type: "text" },
        password: { label: "รหัสผ่าน", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const client = await clientPromise;
        const db = client.db("ktltc_db");

        const user = await db.collection("users").findOne({
          username: credentials.username,
        });

        if (!user) {
          throw new Error("ไม่พบผู้ใช้งานในระบบ");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordCorrect) {
          throw new Error("รหัสผ่านไม่ถูกต้อง");
        }

        // ✅ ส่งข้อมูลออกไปให้ครบถ้วนเพื่อให้ JWT นำไปใช้ต่อได้
        return {
          id: user._id.toString(),
          name: user.name,
          username: user.username, // เพิ่ม username
          email: user.email || null, // เพิ่ม email (ถ้ามี)
          image: user.image || null,
          role: user.role || "user",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // ครั้งแรกที่ Login ข้อมูลจาก authorize จะส่งมาที่ user
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username; // ✅ เก็บ username ลง Token
        token.email = user.email; // ✅ เก็บ email ลง Token
        token.name = (user as any).name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username; // ✅ ส่ง username ให้หน้าบ้าน/API
        session.user.email = token.email as string; // ✅ ส่ง email ให้หน้าบ้าน/API
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
});
