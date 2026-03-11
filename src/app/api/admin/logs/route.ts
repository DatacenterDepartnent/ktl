import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

// GET: ดึงรายการ Log (เฉพาะ Admin)
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
      .limit(200) // เพิ่มเป็น 200 เพื่อให้ดูประวัติได้ยาวขึ้น
      .toArray();

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

// POST: บันทึกกิจกรรมใหม่ (ใช้ได้ทั้งระบบ Auth และ Guest)
export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { action, details, link, userName: manualName } = body;

    // ดึง IP Address ของผู้ใช้งาน
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const newLog = {
      // 1. ลำดับความสำคัญชื่อ: จาก Session > จาก Body (Guest) > System
      userName: session?.user?.name || manualName || "System_Kernel",
      userEmail: session?.user?.email || null,
      action: action || "UNKNOWN_ACTION",
      details: details || "No details provided",
      link: link || null,
      timestamp: new Date(),
      ip: ip, // เก็บ IP ไว้เช็คการสแปม
      role: (session?.user as any)?.role || "guest",
    };

    await db.collection("logs").insertOne(newLog);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("LOG_POST_ERROR:", error);
    return NextResponse.json({ error: "Failed to save log" }, { status: 500 });
  }
}

// DELETE: ล้างประวัติ Log ทั้งหมด
export async function DELETE() {
  try {
    const session = await auth();
    // ป้องกันความปลอดภัยสูงสุด เช็คทั้ง session และสิทธิ์ super_admin
    if (!session || (session.user as any).role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // บันทึกก่อนลบว่า "ใคร" เป็นคนล้าง Log (แนะนำให้ทำ)
    await db.collection("logs").insertOne({
      userName: session.user?.name,
      action: "WIPE_ALL_LOGS",
      details: `ล้างประวัติกิจกรรมทั้งหมดโดย Super Admin`,
      timestamp: new Date(),
      ip: "INTERNAL",
    });

    // ลบ Log เก่าทั้งหมด (ยกเว้นตัวที่เพิ่งสร้างด้านบน ถ้าต้องการความเป๊ะอาจจะใช้ deleteMany ที่ timestamp เก่ากว่าปัจจุบัน)
    await db
      .collection("logs")
      .deleteMany({ action: { $ne: "WIPE_ALL_LOGS" } });

    return NextResponse.json({ success: true, message: "Logs cleared" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear logs" },
      { status: 500 },
    );
  }
}
