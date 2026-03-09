import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // รับข้อมูล adminId และ adminName จาก Frontend
    const { logAction, logDetails, adminId, adminName, ...updateData } = body;

    const updatePayload: any = {
      ...updateData,
      updatedAt: new Date(),
    };

    // 1. อัปเดตข้อมูล User เป้าหมาย
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatePayload });

    // 2. บันทึก Log โดยใช้ชื่อของ Admin (ผู้เปลี่ยน)
    if (logAction) {
      await db.collection("logs").insertOne({
        userId: adminId ? new ObjectId(adminId) : null, // ID ของ nutmontree
        userName: adminName || "System", // ชื่อ nutmontree
        action: logAction,
        details: logDetails, // "เปลี่ยนสิทธิ์ Datacenter..."
        targetId: new ObjectId(id), // ID ของ Datacenter
        timestamp: new Date(),
        ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
