import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// ฟังก์ชันช่วยบันทึก Log
async function createActivityLog(
  db: any,
  req: NextRequest,
  { action, details }: { action: string; details: string },
) {
  try {
    const session = await auth();
    await db.collection("logs").insertOne({
      userName: session?.user?.name || "Admin",
      action,
      details,
      module: "BANNERS",
      timestamp: new Date(), // ✅ ใช้ฟิลด์นี้เพื่อให้หน้า Super Admin ดึงข้อมูลได้
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });
  } catch (err) {
    console.error("Log recording failed:", err);
  }
}

// GET: ดึงข้อมูลแบนเนอร์ (คงเดิม)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("ktltc_db");
    const banner = await db
      .collection("banners")
      .findOne({ _id: new ObjectId(id) });
    if (!banner)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PATCH: อัปเดตข้อมูลแบนเนอร์ + บันทึก Log
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    const allowedRoles = ["super_admin", "admin", "editor"];

    if (!session || !allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { _id, ...updateData } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // 1. ดึงข้อมูลเดิมก่อนอัปเดตเพื่อตรวจสอบชื่อ
    const oldBanner = await db
      .collection("banners")
      .findOne({ _id: new ObjectId(id) });
    if (!oldBanner)
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });

    // 2. อัปเดตข้อมูล
    const result = await db
      .collection("banners")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    if (result.matchedCount > 0) {
      // 3. บันทึก Log
      await createActivityLog(db, req, {
        action: "UPDATE_BANNER",
        details: `แก้ไขแบนเนอร์: ${oldBanner.title} ${updateData.title && updateData.title !== oldBanner.title ? `เป็น ${updateData.title}` : ""}`,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Update Failed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}

// DELETE: ลบแบนเนอร์ + บันทึก Log
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

    // 1. ดึงข้อมูลก่อนลบเพื่อเอาชื่อมาใส่ Log
    const bannerToDelete = await db
      .collection("banners")
      .findOne({ _id: new ObjectId(id) });
    if (!bannerToDelete)
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });

    // 2. ลบข้อมูล
    const result = await db
      .collection("banners")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      // 3. บันทึก Log
      await createActivityLog(db, req, {
        action: "DELETE_BANNER",
        details: `ลบแบนเนอร์: ${bannerToDelete.title}`,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Delete Failed" }, { status: 400 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
  }
}
