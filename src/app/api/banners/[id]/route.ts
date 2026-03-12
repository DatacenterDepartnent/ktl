// src\app\api\banners\[id]\route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// ✅ ฟังก์ชันช่วยบันทึก Log - ปรับให้ใช้ชื่อจาก Session อัตโนมัติ
async function createActivityLog(
  db: any,
  req: NextRequest,
  { action, details }: { action: string; details: string },
) {
  try {
    const session = await auth();
    // ดึงชื่อคนทำรายการ ถ้าไม่มีให้ใช้ System_Kernel
    const operatorName = session?.user?.name || "System_Kernel";

    await db.collection("logs").insertOne({
      userName: operatorName,
      action,
      details,
      module: "BANNERS", // หรือปรับเป็น Q&A ตามการใช้งานจริง
      timestamp: new Date(),
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });
  } catch (err) {
    console.error("Log recording failed:", err);
  }
}

// PATCH: อัปเดตข้อมูล + บันทึก Log พร้อมชื่อเจ้าของโพสต์/แบนเนอร์
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { _id, ...updateData } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 1. หาข้อมูลเดิมเพื่อดูว่ารายการนี้เป็นของใคร (เช่น customerName หรือ title เดิม)
    const oldDoc = await db
      .collection("banners")
      .findOne({ _id: new ObjectId(id) });
    if (!oldDoc)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    // 2. อัปเดตข้อมูล
    const result = await db
      .collection("banners")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    if (result.matchedCount > 0) {
      // 3. บันทึก Log - แต่งรายละเอียดยัดชื่อผู้สอบถาม/เจ้าของงานเข้าไป
      await createActivityLog(db, req, {
        action: "UPDATE_DATA",
        details: `แก้ไขรายการของ: ${oldDoc.customerName || oldDoc.title || "ไม่ระบุชื่อ"} | รายละเอียดใหม่: ${updateData.title || "ไม่มีการเปลี่ยนชื่อ"}`,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Update Failed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// DELETE: ลบข้อมูล + บันทึก Log (ดึงข้อมูลมาทำ Log ก่อนจะลบทิ้ง)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 1. ดึงข้อมูลก่อนลบ (ถ้าไม่ดึงก่อน มึงจะไม่มีชื่อไปใส่ใน Log เพราะพอลบแล้ว data หาย)
    const docToDelete = await db
      .collection("banners")
      .findOne({ _id: new ObjectId(id) });
    if (!docToDelete)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    // 2. ลบข้อมูลจาก Database
    const result = await db
      .collection("banners")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      // 3. บันทึก Log การลบ - ใส่ชื่อคนถาม/ชื่อเรื่องให้ชัดเจน
      await createActivityLog(db, req, {
        action: "DELETE_DATA",
        details: `ลบรายการของ: ${docToDelete.customerName || docToDelete.title || "ไม่ระบุชื่อ"}`,
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Delete Failed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ✅ เพิ่มฟังก์ชัน GET เพื่อให้หน้า Edit ดึงข้อมูลรายตัวได้
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const banner = await db.collection("banners").findOne({
      _id: new ObjectId(id),
    });

    if (!banner) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลแบนเนอร์" },
        { status: 404 },
      );
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("GET_BANNER_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
