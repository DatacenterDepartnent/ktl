import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    // 1. รับข้อมูลจาก Frontend
    const { username, password, name, email } = await req.json();

    // 2. Validation: ตรวจสอบว่ากรอกข้อมูลครบถ้วนหรือไม่
    if (!username || !password || !name || !email) {
      return NextResponse.json(
        {
          error: "กรุณากรอกข้อมูลให้ครบถ้วน (Username, Password, Name, Email)",
        },
        { status: 400 },
      );
    }

    // ตรวจสอบความยาวรหัสผ่าน (เพิ่มความปลอดภัยขั้นต่ำ)
    if (password.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 3. ตรวจสอบว่ามี Username หรือ Email นี้ในระบบหรือยัง
    const existingUser = await db.collection("users").findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username หรือ Email นี้ถูกใช้งานแล้ว กรุณาใช้ชื่ออื่น" },
        { status: 409 }, // 409 Conflict
      );
    }

    // 4. เข้ารหัสรหัสผ่าน (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. บันทึกลงฐานข้อมูล
    await db.collection("users").insertOne({
      username,
      password: hashedPassword,
      name,
      email,
      // 🔒 SECURITY FORCE: กำหนดค่าตายตัว ป้องกันการแอบอ้างสิทธิ์
      role: "editor", // ผู้สมัครใหม่เป็นได้แค่ Editor
      isActive: false, // ต้องรออนุมัติจาก Super Admin เท่านั้น
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message:
          "ลงทะเบียนสำเร็จ! กรุณารอผู้ดูแลระบบอนุมัติบัญชีของคุณก่อนเข้าใช้งาน",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง" },
      { status: 500 },
    );
  }
}
