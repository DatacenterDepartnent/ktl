import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

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
        const user = await db
          .collection("users")
          .findOne({ username: { $regex: new RegExp(`^${(credentials.username as string).trim()}$`, "i") } });

        if (!user) throw new Error("ไม่พบผู้ใช้งานในระบบ");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!isPasswordCorrect) throw new Error("รหัสผ่านไม่ถูกต้อง");

        // ✅ ตรวจสอบว่า Super Admin อนุมัติบัญชีแล้วหรือยัง
        if (user.isActive === false) {
          throw new Error("บัญชีของคุณยังรอการอนุมัติจาก Super Admin กรุณาติดต่อผู้ดูแลระบบ");
        }

        // ✅ สร้างเลข session ID ใหม่ทุกครั้งที่ล็อกอิน
        const sessionId = crypto.randomUUID();

        // ✅ ล้าง global session cache ของ user คนนี้ออกทั้งหมด
        if ((global as any)._sessionCache) {
          const userId = user._id.toString();
          Object.keys((global as any)._sessionCache).forEach((key) => {
            if (key.startsWith(`sess_${userId}_`)) {
              delete (global as any)._sessionCache[key];
            }
          });
        }

        // ✅ บันทึก sessionId ของปัจจุบันทับลงในฐานข้อมูล
        await db.collection("users").updateOne(
          { _id: user._id },
          { $set: { currentSessionId: sessionId } }
        );

        return {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          email: user.email || null,
          role: user.role || "user",
          sessionId, // ส่งต่อไปให้ jwt callback
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 1. กำหนดค่าเริ่มต้นเมื่อล็อกอินใหม่ ๆ
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.sessionId = (user as any).sessionId;
        token.loginTimestamp = Date.now();
      }

      const role = token.role as string;

      // 2. ตรวจสอบเงื่อนไขหมดเวลา 1 ชั่วโมง (ยกเว้น super_admin)
      if (role !== "super_admin" && token.loginTimestamp) {
        const ONE_HOUR_MS = 60 * 60 * 1000;
        if (Date.now() - (token.loginTimestamp as number) > ONE_HOUR_MS) {
          token.error = "SessionExpired";
          return token;
        }
      }

      // 3. ตรวจสอบการเข้าสู่ระบบซ้อนกัน (เช็ค Device ที่เข้าหลังสุด)
      if (token.id && token.sessionId && !token.error) {
        const cacheKey = `sess_${token.id}_${token.sessionId}`;
        const now = Date.now();
        const cached = (global as any)._sessionCache?.[cacheKey];
        
        if (cached && (now - cached.timestamp < 60000)) { // 60s cache
           if (cached.error) {
             token.error = cached.error;
             return token;
           }
           // Valid cache, skip DB
        } else {
            // ✅ ยกเว้น super_admin จากการเช็ค Concurrent Login เพื่อลดภาระ DB และป้องกันการถูกดีดออกจากการเปิดหลายหน้าต่าง
            if (role === "super_admin") {
              if (!(global as any)._sessionCache) (global as any)._sessionCache = {};
              (global as any)._sessionCache[cacheKey] = { timestamp: now };
              return token;
            }

            const authStart = Date.now();
            try {
              const client = await clientPromise;
              const db = client.db("ktltc_db");
              const currentUser = await db.collection("users").findOne(
                { _id: new ObjectId(token.id as string) },
                { projection: { currentSessionId: 1 } }
              );
              const authEnd = Date.now();
              
              if (authEnd - authStart > 100) {
                 console.log(`[AUTH] DB Session Check took ${authEnd - authStart}ms for user ${token.id}`);
              }

              if (!(global as any)._sessionCache) (global as any)._sessionCache = {};
              
              if (!currentUser || currentUser.currentSessionId !== token.sessionId) {
                const err = "ConcurrentLogin";
                (global as any)._sessionCache[cacheKey] = { error: err, timestamp: now };
                token.error = err;
                return token;
              }

              (global as any)._sessionCache[cacheKey] = { timestamp: now };
            } catch (error) {
              console.error("JWT Session validation error:", error);
            }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error) {
        (session as any).error = token.error;
      }
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
});
