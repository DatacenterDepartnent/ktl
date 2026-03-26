// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import clientPromise from "@/lib/db";
// import bcrypt from "bcryptjs";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "ชื่อผู้ใช้งาน", type: "text" },
//         password: { label: "รหัสผ่าน", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.username || !credentials?.password) return null;

//         const client = await clientPromise;
//         const db = client.db("ktltc_db");

//         const user = await db.collection("users").findOne(
//           {
//             username: credentials.username,
//           },
//           {
//             projection: {
//               password: 1,
//               name: 1,
//               username: 1,
//               role: 1,
//               email: 1,
//               image: 1,
//             },
//           },
//         );

//         if (!user) {
//           throw new Error("ไม่พบผู้ใช้งานในระบบ");
//         }

//         const isPasswordCorrect = await bcrypt.compare(
//           credentials.password as string,
//           user.password,
//         );

//         if (!isPasswordCorrect) {
//           throw new Error("รหัสผ่านไม่ถูกต้อง");
//         }

//         // ✅ ส่งข้อมูลออกไปให้ครบถ้วนเพื่อให้ JWT นำไปใช้ต่อได้
//         return {
//           id: user._id.toString(),
//           name: user.name,
//           username: user.username, // เพิ่ม username
//           email: user.email || null, // เพิ่ม email (ถ้ามี)
//           image: user.image || null,
//           role: user.role || "user",
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       // ครั้งแรกที่ Login ข้อมูลจาก authorize จะส่งมาที่ user
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role;
//         token.username = (user as any).username; // ✅ เก็บ username ลง Token
//         token.email = user.email; // ✅ เก็บ email ลง Token
//         token.name = (user as any).name;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         (session.user as any).id = token.id;
//         (session.user as any).role = token.role;
//         (session.user as any).username = token.username; // ✅ ส่ง username ให้หน้าบ้าน/API
//         session.user.email = token.email as string; // ✅ ส่ง email ให้หน้าบ้าน/API
//         session.user.name = token.name as string;
//       }
//       return session;
//     },
//   },
//   session: { strategy: "jwt" },
//   pages: { signIn: "/login" },
// });
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
          .findOne({ username: credentials.username });

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

      // 2. ตรวจสอบเงื่อนไขหมดเวลา 1 ชั่วโมง (ยกเว้น super_admin)
      if (token.role !== "super_admin" && token.loginTimestamp) {
        const ONE_HOUR_MS = 60 * 60 * 1000;
        if (Date.now() - (token.loginTimestamp as number) > ONE_HOUR_MS) {
          token.error = "SessionExpired";
          return token;
        }
      }

      // 3. ตรวจสอบการเข้าสู่ระบบซ้อนกัน (เช็ค Device ที่เข้าหลังสุด)
      if (token.id && token.sessionId && !token.error) {
        // --- High Performance Cache Layer ---
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
            const authStart = Date.now();
            try {
              const client = await clientPromise;
              const db = client.db("ktltc_db");
              const currentUser = await db.collection("users").findOne({ _id: new ObjectId(token.id as string) });
              const authEnd = Date.now();
              
              if (authEnd - authStart > 100) {
                 console.log(`[AUTH] DB Session Check took ${authEnd - authStart}ms for user ${token.id}`);
              }

              // Initialize global cache if not exists
              if (!(global as any)._sessionCache) (global as any)._sessionCache = {};
              
              // หาก session id ของ token เก่า ไม่ตรงกับในฐานข้อมูล แสดงว่ามีเครื่องอื่นล็อกอินเข้ามาใช้งานแทนที่แล้ว
              if (!currentUser || currentUser.currentSessionId !== token.sessionId) {
                const err = "ConcurrentLogin";
                (global as any)._sessionCache[cacheKey] = { error: err, timestamp: now };
                token.error = err;
                return token;
              }

              // Valid session, cache it
              (global as any)._sessionCache[cacheKey] = { timestamp: now };
            } catch (error) {
              console.error("JWT Session validation error:", error);
            }
        }
      }

      return token;
    },
    async session({ session, token }) {
      // ✅ แนบค่า error (ถ้ามี) กลับไปที่ฝั่ง Client
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
