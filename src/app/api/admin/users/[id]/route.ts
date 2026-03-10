import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // ตรวจสอบความถูกต้องของ ID ก่อนทำงาน (ช่วยลด Error)
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const { logAction, logDetails, adminId, adminName, ...updateData } = body;

    // --- 1. ดึงข้อมูล User เป้าหมายแบบจำกัด Field (เพื่อความรวดเร็ว) ---
    const targetUser = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { name: 1 } }, // ดึงเฉพาะชื่อ ลดภาระฐานข้อมูล
    );

    const targetName = targetUser?.name || "Unknown User";

    // --- 2. อัปเดตข้อมูล User ---
    const updateResult = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- 3. บันทึก Log แบบละเอียด (ใส่ชื่อแทน ID) ---
    if (logAction) {
      await db.collection("logs").insertOne({
        userId:
          adminId && ObjectId.isValid(adminId) ? new ObjectId(adminId) : null,
        userName: adminName || "System",
        action: logAction,
        // รวมรายละเอียดและชื่อผู้ถูกกระทำเพื่อให้ Admin อ่านง่ายในหน้า Log
        details: `${logDetails} (${targetName})`,
        targetId: new ObjectId(id),
        timestamp: new Date(),
        // ดึง IP จริงของผู้ใช้
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1",
      });
    }

    return NextResponse.json({ success: true, targetName });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
