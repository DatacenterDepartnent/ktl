import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ดึงข้อมูลย้อนหลัง 30 วัน
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await db
      .collection("logs")
      .find({ timestamp: { $gte: thirtyDaysAgo } })
      .toArray();

    // ประมวลผลข้อมูลสรุป
    const summary = {
      totalActions: logs.length,
      approvals: logs.filter((l) => l.action === "APPROVE_USER").length,
      roleChanges: logs.filter((l) => l.action === "CHANGE_ROLE").length,
      updates: logs.filter((l) => l.action === "UPDATE_USER_INFO").length,
      recentLogs: logs.slice(-5).reverse(), // 5 รายการล่าสุด
    };

    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
