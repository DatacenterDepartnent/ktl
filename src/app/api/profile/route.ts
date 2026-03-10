import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth"; // ✅ ใช้ auth จาก NextAuth v5
import bcrypt from "bcryptjs"; // ✅ เปลี่ยนจาก bcrypt เป็น bcryptjs

export async function GET() {
  // 1. ดึง Session จาก NextAuth
  const session = await auth();

  // ตรวจสอบจาก session.user.id (NextAuth v5 มักจะเก็บ id ไว้ที่นี่)
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, lineId, password } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // เตรียมข้อมูลอัปเดต
    const updateData: any = {
      name,
      email,
      phone,
      lineId,
      updatedAt: new Date(),
    };

    // ✅ ใช้ bcryptjs แทน เพื่อเลี่ยงปัญหา Edge Runtime/Crypto
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

    return NextResponse.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
