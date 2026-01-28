import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // ✅ แก้ไข: ลบ Cookie ที่ชื่อ "token" (ให้ตรงกับตอน Login)
    cookieStore.delete("token");

    // ถ้ามีการเก็บ username ใน cookie ด้วย ก็ลบออก (ถ้าไม่ได้ใช้ก็ลบเกี่ยวบรรทัดนี้ทิ้งได้)
    // cookieStore.delete("username");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
