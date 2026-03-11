import Ticket from "@/app/models/Ticket";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db"; // สำหรับบันทึก Log ลง DB โดยตรง

// ฟังก์ชันบันทึก Log กลาง
async function saveLog(action, details, metadata = {}) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    await db.collection("logs").insertOne({
      action,
      details,
      ...metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ Logging Error:", error);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const ticketData = body.formData;
    
    // 🔍 ดึง IP Address ของผู้ส่ง (Guest)
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // 1. บันทึกคำถามลง Database
    const newTicket = await Ticket.create({
      ...ticketData,
      status: "pending", // ค่าเริ่มต้นคือรอคำตอบ
    });

    // 2. ✅ บันทึก Log การสร้างคำถาม
    await saveLog("CREATE_TICKET", `มีคำถามใหม่: ${ticketData.title}`, {
      author: ticketData.category, // ในฟอร์มคุณใช้ category เก็บชื่อผู้โพสต์
      ticketId: newTicket._id,
      ip: ip,
      userAgent: req.headers.get("user-agent") // เก็บข้อมูล Browser/Device เบื้องต้น
    });

    return NextResponse.json({ message: "Ticket Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

// ส่วน GET คงเดิมตามที่คุณแก้ไขไว้
export async function GET() {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 }); // เรียงใหม่ล่าสุดขึ้นก่อน
    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to get tickets", error },
      { status: 500 }
    );
  }
}