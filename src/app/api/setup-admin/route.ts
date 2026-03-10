import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // เข้ารหัสผ่าน 123456
    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = {
      username: "admin",
      password: hashedPassword,
      name: "สมชาย ใจดี", // ชื่อนี้จะไปโผล่ในข่าว
      role: "admin",
      image: "https://ui-avatars.com/api/?name=Admin",
    };

    // อัปเดตหรือสร้างใหม่ถ้ายังไม่มี
    await db
      .collection("users")
      .updateOne({ username: "admin" }, { $set: user }, { upsert: true });

    return NextResponse.json({
      message: "User 'admin' created with password '123456'",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
