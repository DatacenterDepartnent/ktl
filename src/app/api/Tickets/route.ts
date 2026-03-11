// app/api/Tickets/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 Incoming Data:", body); // เช็คว่า Data มาถึง API จริงไหม

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ตรวจสอบความปลอดภัยเบื้องต้น
    if (!body.title || !body.description) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 },
      );
    }

    const newTicket = {
      title: body.title,
      description: body.description,
      category: body.category || "ทั่วไป",
      status: "Open",
      priority: "Normal",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("tickets").insertOne(newTicket);
    console.log("✅ Insert Success:", result.insertedId);

    return NextResponse.json(
      { message: "Ticket Created", id: result.insertedId },
      { status: 201 },
    );
  } catch (error: any) {
    // พิมพ์ Error ออกทาง Console ของ VS Code เพื่อดูสาเหตุที่แท้จริง
    console.error("❌ SERVER API ERROR:", error.message);

    return NextResponse.json(
      { message: "Server Error", details: error.message },
      { status: 500 },
    );
  }
}
