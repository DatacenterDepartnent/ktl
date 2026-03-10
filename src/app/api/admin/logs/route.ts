import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

// ดึง Log ทั้งหมดมาแสดงในหน้า Admin
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
      .find({}) // ดึงของทุกคน
      .sort({ timestamp: -1 }) // เอาล่าสุดขึ้นก่อน
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

// ล้างประวัติ Log ทั้งหมด
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
