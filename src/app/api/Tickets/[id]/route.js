import Ticket from "@/app/models/Ticket";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db"; // ดึงเพื่อใช้บันทึก Log ลง MongoDB โดยตรง

// ฟังก์ชันกลางสำหรับบันทึก Log
async function saveLog(action, details, metadata = {}) {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    await db.collection("logs").insertOne({
      action, // เช่น "CREATE_TICKET", "REPLY_TICKET", "DELETE_TICKET"
      details, // รายละเอียดข้อความ
      ...metadata, // เช่น ip, adminName, timestamp
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Log Error:", error);
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const ticketData = body.formData || body;
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (ticketData.reply) {
      // ✅ กรณี Admin เข้ามาตอบ
      await Ticket.findByIdAndUpdate(id, {
        $push: {
          replies: {
            content: ticketData.reply,
            author: ticketData.adminName || "Admin",
            createdAt: new Date(),
          },
        },
        $set: { status: "answered" },
      });

      // 📝 บันทึก Log การตอบ
      await saveLog("REPLY_TICKET", `Admin replied to ticket ID: ${id}`, {
        adminName: ticketData.adminName,
        ticketId: id,
        ip: ip,
      });
    } else {
      // ✅ กรณีแก้ไขข้อมูลทั่วไป
      await Ticket.findByIdAndUpdate(id, { ...ticketData });

      await saveLog("UPDATE_TICKET", `Updated ticket ID: ${id}`, {
        ip: ip,
        ticketId: id,
      });
    }

    return NextResponse.json({ message: "Updated & Logged" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const deletedTicket = await Ticket.findByIdAndDelete(id);

    // 📝 บันทึก Log การลบ (เก็บหัวข้อไว้ดูย้อนหลังได้ว่าลบอะไรไป)
    await saveLog("DELETE_TICKET", `Deleted ticket: ${deletedTicket?.title}`, {
      ticketId: id,
      ip: ip,
    });

    return NextResponse.json({ message: "Ticket Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
