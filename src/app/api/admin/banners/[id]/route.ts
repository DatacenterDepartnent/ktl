import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// GET: ดึงข้อมูลแบนเนอร์ทีละ 1 รายการ
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. await params เพียงครั้งเดียวใน try-catch เพื่อความปลอดภัย
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

// PATCH: อัปเดตข้อมูลแบนเนอร์
export async function PATCH(
  req: NextRequest, // ปรับเป็น NextRequest เพื่อความสม่ำเสมอ
  { params }: { params: Promise<{ id: string }> }, // ✅ แก้ไข: ต้องเป็น Promise เหมือน GET/DELETE
) {
  try {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    const allowedRoles = ["super_admin", "admin", "editor"];

    if (!session || !allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. await params ก่อนนำ id มาใช้
    const { id } = await params;
    const body = await req.json();
    const { _id, ...updateData } = body;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const result = await db
      .collection("banners")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}

// DELETE: ลบแบนเนอร์
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 3. await params
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const result = await db
      .collection("banners")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
  }
}
