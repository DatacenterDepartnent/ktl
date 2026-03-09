import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

// ฟังก์ชันดึงข้อมูล Log เดิม (ที่มีอยู่แล้ว)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const logs = await db
      .collection("logs")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

// --- เพิ่มส่วนนี้เข้าไป ---
export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ลบข้อมูลทั้งหมดใน Collection logs
    await db.collection("logs").deleteMany({});

    return NextResponse.json({ success: true, message: "Logs cleared" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear logs" },
      { status: 500 },
    );
  }
}
