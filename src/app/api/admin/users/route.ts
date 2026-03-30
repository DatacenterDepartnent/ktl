import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth"; // เปลี่ยนมาใช้ตัวนี้

export async function GET() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  const allowedRoles = ["super_admin", "admin", "hr", "director", "deputy_resource", "editor", "staff"];

  // ตรวจสอบว่ามีสิทธิ์เข้าถึงประเภทผู้ดูแลหรือไม่
  if (!session || !allowedRoles.includes(userRole)) {
    return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const users = await db
      .collection("users")
      .find({})
      .sort({ orderIndex: 1 })
      .project({ password: 0 })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Database Error" }, { status: 500 });
  }
}
