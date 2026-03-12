import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function DELETE(req) {
  try {
    const session = await auth();

    if (!session || !["admin", "super_admin"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ลบข้อมูล" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ต้องระบุ ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 🔍 1. ดึงข้อมูลก่อนลบ (ไม่งั้นจะหาหัวข้อมาลง Log ไม่ได้)
    const questionBeforeDelete = await db.collection("questions").findOne({
      _id: new ObjectId(id),
    });

    const result = await db.collection("questions").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      // ✅ 2. บันทึก LOG โดยใช้ userName เป็นชื่อแอดมิน
      await db.collection("logs").insertOne({
        userName: session.user.name,
        action: "DELETE_QUESTION",
        targetId: new ObjectId(id),
        details: `ลบคำถามหัวข้อ: "${questionBeforeDelete?.subject || "ไม่ทราบหัวข้อ"}" ของคุณ ${questionBeforeDelete?.guestName || "GUEST"}`,
        module: "Q&A",
        timestamp: new Date(),
        ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });

      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
