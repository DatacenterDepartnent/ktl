// src/app/api/admin/logs/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

// --- ฟังก์ชัน GET เดิมของคุณ ---
export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const logs = await db
      .collection("logs")
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

// ✅ เพิ่มฟังก์ชัน POST (แก้ไขอาการ 405)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userName, action, details, link } = body; // ✅ รับ link เข้ามาด้วย

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    await db.collection("logs").insertOne({
      userName,
      action,
      details,
      link: link || null, // ✅ บันทึกลง Database
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}

// --- ฟังก์ชัน DELETE เดิมของคุณ ---
export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    await db.collection("logs").deleteMany({});
    return NextResponse.json({ success: true, message: "Logs cleared" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear logs" },
      { status: 500 },
    );
  }
}
