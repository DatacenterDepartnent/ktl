import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ดึง session จากระบบ Auth.js v5
    const session = await auth();

    // ถ้ายังไม่ Login จะเข้าเงื่อนไขนี้ (ที่ทำให้คุณเจอ 401)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "ยังไม่ได้เข้าสู่ระบบ" },
        { status: 401 },
      );
    }

    // ส่งข้อมูลผู้ใช้ออกไป (เพื่อให้หน้า Add News ดึงไปใช้)
    return NextResponse.json({
      name: session.user.name,
      image: session.user.image,
      email: session.user.email,
    });
  } catch (error) {
    console.error("Auth Me Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
