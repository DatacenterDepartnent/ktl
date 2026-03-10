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

    const { logAction, logDetails, adminId, adminName, ...updateData } = body;

    // --- เพิ่มส่วนนี้: ดึงชื่อของผู้ที่ถูกแก้ไขมาเก็บใน Log ---
    const targetUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    const targetName = targetUser?.name || "Unknown User";

    // 1. อัปเดตข้อมูล User
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    // 2. บันทึก Log แบบละเอียด
    if (logAction) {
      await db.collection("logs").insertOne({
        userId: adminId ? new ObjectId(adminId) : null, // ID Admin
        userName: adminName || "System", // ชื่อ Admin
        action: logAction,
        // ปรับรายละเอียดให้มีชื่อคนโดนแก้ด้วย
        details: `${logDetails} (${targetName})`,
        targetId: new ObjectId(id),
        timestamp: new Date(),
        ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
