// src\app\api\Tickets\route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ตรวจสอบข้อมูล (ใช้ body ตรงๆ ตามที่ส่งมาจาก EditTicketForm)
    if (!body.title || !body.description || !body.author) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 },
      );
    }

    const newTicket = {
      title: body.title,
      description: body.description,
      category: body.category || "ทั่วไป",
      author: body.author,
      // ✅ ใช้ตัวแปร submissionData ที่ส่งมา หรือเช็คซ้ำที่นี่เพื่อความชัวร์
      authorRole:
        body.authorRole ||
        (body.author.toLowerCase() === "admin" ? "admin" : "user"),
      status: "Open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("tickets").insertOne(newTicket);

    return NextResponse.json(
      { message: "Created", id: result.insertedId },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ API ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// เพิ่มฟังก์ชัน GET เพื่อให้หน้าลิสต์ดึงข้อมูลไปโชว์ได้
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ดึงข้อมูล tickets ทั้งหมด เรียงจากใหม่ไปเก่า
    const tickets = await db
      .collection("tickets")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error: any) {
    console.error("❌ GET API ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
