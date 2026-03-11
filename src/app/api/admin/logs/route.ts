import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

// GET: ดึงรายการ Log (เฉพาะ Admin)
export async function GET() {
  try {
    const session = await auth();
    // เช็คสิทธิ์ว่าเป็น Admin หรือไม่
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const logs = await db
      .collection("logs")
      .find({})
      .sort({ timestamp: -1 }) // เรียงจากใหม่ไปเก่า
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

// POST: บันทึกกิจกรรมใหม่
export async function POST(req: Request) {
  try {
    const session = await auth(); // ดึง Session มาเช็คว่าใครเป็นคนทำ
    const body = await req.json();
    const { action, details, link } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    await db.collection("logs").insertOne({
      userName: session?.user?.name || body.userName || "System", // ใช้ชื่อจาก Session ถ้าไม่มีให้ใช้จาก Body
      userEmail: session?.user?.email || null,
      action,
      details,
      link: link || null,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}

// DELETE: ล้างประวัติ Log ทั้งหมด
export async function DELETE() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
