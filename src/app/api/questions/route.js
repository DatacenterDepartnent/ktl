// api/questions/route.js 
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(req) {
  try {
    const { customerName, subject, details } = await req.json(); // รับชื่อ "นายสมหมาย" มาจากหน้าบ้าน

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 1. บันทึกคำถามลง DB
    const newQuestion = await db.collection("questions").insertOne({
      customerName, // นายสมหมาย
      subject,
      details,
      status: "pending",
      createdAt: new Date(),
    });

    // 2. บันทึก LOG (จุดสำคัญสัสๆ อยู่ตรงนี้!)
    await db.collection("logs").insertOne({
      // แทนที่จะใส่ "SYSTEM" ให้ใส่ชื่อลูกค้า (นายสมหมาย) ลงไปตรงๆ เลย
      userName: customerName || "GUEST",
      action: "GUEST_QUESTION",
      details: `คำถามใหม่: ${subject}`,
      module: "Q&A",
      timestamp: new Date(),
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      targetId: newQuestion.insertedId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
